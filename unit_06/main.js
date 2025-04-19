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
        service_response: '',
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
        callExampleService: function() {
            // service is busy
            this.service_busy = true
            this.service_response = ''
            // define the service to be called
            let service = new ROSLIB.Service({
                ros: this.ros,
                name: '/example/service',
                serviceType: 'std_srvs/SetBool',
            })

            // define the request
            let request = new ROSLIB.ServiceRequest({
                data: true,
            })

            // define a callback
            service.callService(request, (result) => {
                this.service_busy = false
                this.service_response = JSON.stringify(result)
            })
        },
    },
})