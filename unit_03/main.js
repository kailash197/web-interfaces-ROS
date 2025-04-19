let vueApp = new Vue({
    el: "#vueApp",
    data: {
        // ros connection
        ros: null,
        rosbridge_address: 'wss://i-02ceddab37f42e4f6.robotigniteacademy.com/fb02d677-4756-4158-a71a-e833afe90221/rosbridge/', // change to your own address
        // page content
        menu_title: 'My menu title',
        main_title: 'Main title, from Vue!!',
        p_content_01: 'This is the left side of my web page. It occupies 33% of the total width',
        p_content_02: 'Here it goes the main content of my first web page, able to control ROS robots using web tools!',
    },
    mounted() {
        console.log('Mounted: page is ready!')

        // define ROSBridge connection object
        this.ros = new ROSLIB.Ros({
            url: this.rosbridge_address
        })

        // define callbacks
        this.ros.on('connection', () => {
            console.log('Connection to ROSBridge established!')
        })
        this.ros.on('error', (error) => {
            console.log('Something went wrong when trying to connect')
            console.log(error)
        })
        this.ros.on('close', () => {
            console.log('Connection to ROSBridge was closed!')
        })
    },
})