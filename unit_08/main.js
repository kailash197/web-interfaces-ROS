var app = new Vue({
    el: '#app',
    // storing the state of the page
    data: {
        connected: false,
        ros: null,
        logs: [],
        loading: false,
        rosbridge_address: '',
        port: '9090',
        service_busy: false,
        param_val: 0,
        param_read_val: 0,
    },
    // helper methods to connect to ROS
    methods: {
        connect: function() {
            this.loading = true
            this.ros = new ROSLIB.Ros({
                url: this.rosbridge_address
            })
            this.ros.on('connection', () => {
                this.logs.unshift((new Date()).toTimeString() + ' - Connected!')
                this.connected = true
                this.loading = false
            })
            this.ros.on('error', (error) => {
                this.logs.unshift((new Date()).toTimeString() + ` - Error: ${error}`)
            })
            this.ros.on('close', () => {
                this.logs.unshift((new Date()).toTimeString() + ' - Disconnected!')
                this.connected = false
                this.loading = false
            })
        },
        disconnect: function() {
            this.ros.close()
        },
        set_param: function() {
            // set as busy
            service_busy = true

            let web_param = new ROSLIB.Param({
                ros: this.ros,
                name: 'web_param'
            })

            web_param.set(this.param_val)

            // set as not busy
            service_busy = false
        },
        read_param: function() {
            // set as busy
            service_busy = true

            let web_param = new ROSLIB.Param({
                ros: this.ros,
                name: 'web_param'
            })

            web_param.get((value) => {
                // set as not busy
                service_busy = false
                this.param_read_val = value
            }, (err) => {
                // set as not busy
                service_busy = false
            })

        },
    },
    mounted() {
    },
})