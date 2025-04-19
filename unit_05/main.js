let vueApp = new Vue({
    el: "#vueApp",
    data: {
        // ros connection
        ros: null,
        rosbridge_address: 'wss://i-0edfd58971bf7a79c.robotigniteacademy.com/rosbridge/',
        connected: false,
        // subscriber data
        position: { x: 0, y: 0, z: 0, },
        // fence mode
        fenceMode: false,
        insideFence: false,
        // page content
        menu_title: 'Connection',
        main_title: 'Main title, from Vue!!',
    },
    methods: {
        connect: function() {
            // define ROSBridge connection object
            this.ros = new ROSLIB.Ros({
                url: this.rosbridge_address
            })

            // define callbacks
            this.ros.on('connection', () => {
                this.connected = true
                console.log('Connection to ROSBridge established!')
                let topic = new ROSLIB.Topic({
                    ros: this.ros,
                    name: '/odom',
                    messageType: 'nav_msgs/Odometry'
                })
                topic.subscribe((message) => {
                    this.position = message.pose.pose.position
                    console.log(`fence mode is ${this.fenceMode}`)
                    if (this.fenceMode) {
                        this.stayOnTheFence(message.pose.pose.position)
                    }
                })
            })
            this.ros.on('error', (error) => {
                console.log('Something went wrong when trying to connect')
                console.log(error)
            })
            this.ros.on('close', () => {
                this.connected = false
                console.log('Connection to ROSBridge was closed!')
            })
        },
        disconnect: function() {
            this.ros.close()
        },
        sendCommand: function() {
            let topic = new ROSLIB.Topic({
                ros: this.ros,
                name: '/cmd_vel',
                messageType: 'geometry_msgs/Twist'
            })
            let message = new ROSLIB.Message({
                linear: { x: 1, y: 0, z: 0, },
                angular: { x: 0, y: 0, z: 0.5, },
            })
            topic.publish(message)
        },
        turnRight: function() {
            let topic = new ROSLIB.Topic({
                ros: this.ros,
                name: '/cmd_vel',
                messageType: 'geometry_msgs/Twist'
            })
            let message = new ROSLIB.Message({
                linear: { x: 1, y: 0, z: 0, },
                angular: { x: 0, y: 0, z: -0.5, },
            })
            topic.publish(message)
        },
        stop: function() {
            let topic = new ROSLIB.Topic({
                ros: this.ros,
                name: '/cmd_vel',
                messageType: 'geometry_msgs/Twist'
            })
            let message = new ROSLIB.Message({
                linear: { x: 0, y: 0, z: 0, },
                angular: { x: 0, y: 0, z: 0, },
            })
            topic.publish(message)
        },
        switchFenceMode: function() {
            this.fenceMode = !this.fenceMode
        },
        stayOnTheFence: function(position) {
            let topicToPublish = new ROSLIB.Topic({
                ros: this.ros,
                name: '/cmd_vel',
                messageType: 'geometry_msgs/Twist'
            })
            if (position.x > -5 && position.x < 5 && position.y > -5 && position.y < 5) {
                // we are inside the fence!
                this.insideFence = true
                let message = new ROSLIB.Message({
                    linear: { x: 0.5, y: 0, z: 0, },
                    angular: { x: 0, y: 0, z: 0, },
                })
                topicToPublish.publish(message)
            } else {
                // we are outside the fence!
                this.insideFence = false
                let message = new ROSLIB.Message({
                    linear: { x: 0.5, y: 0, z: 0, },
                    angular: { x: 0, y: 0, z: 0.5, },
                })
                topicToPublish.publish(message)
            }
        },
    },
    mounted() {
        // page is ready
        console.log('page is ready!')
    },
})