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
        performTakeoff: function() {
            // define page as busy
            this.service_busy = true
            // define the service to be called
            let service = new ROSLIB.Service({
                ros: this.ros,
                name: '/hector_services/takeoff',
                serviceType: 'std_srvs/SetBool',
            })

            // define the request
            let request = new ROSLIB.ServiceRequest({
                data: true,
            })

            // call service and define a callback
            service.callService(request, (result) => {
                this.service_busy = false
                console.log(result)
            }, (error) => {
                this.service_busy = false
                console.error(error)
            })
        },
        performLanding: function() {
            // define page as busy
            this.service_busy = true
            // define the service to be called
            let service = new ROSLIB.Service({
                ros: this.ros,
                name: '/hector_services/landing',
                serviceType: 'std_srvs/SetBool',
            })

            // define the request
            let request = new ROSLIB.ServiceRequest({
                data: true,
            })

            // call service and define a callback
            service.callService(request, (result) => {
                this.service_busy = false
                console.log(result)
            }, (error) => {
                this.service_busy = false
                console.error(error)
            })
        },
    },
})