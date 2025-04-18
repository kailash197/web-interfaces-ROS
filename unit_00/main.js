// ws://54.147.26.233:9090

var app = new Vue({
  el: '#app',
  // computed values
  computed: {
    ws_address: function() {
      return `${this.rosbridge_address}`
    },
    camera_address: function() {
      console.log('camera address')
      let protocol = 'https://'
      console.log(this.rosbridge_address)
      let res = ''
      try {
        let address = this.rosbridge_address.split('wss://')[1].split('/')[0] + '/' + this.rosbridge_address.split('wss://')[1].split('/')[1]
        let endpoint = '/stream'
        let topic = '/camera/rgb/image_raw'
        let params = `?topic=${topic}&width=400&height=300`
        res = protocol + address + endpoint + params
        console.log(res)
      } catch(ex) {

      }
      return res
    },
  },
  // storing the state of the page
  data: {
    connected: false,
    ros: null,
    logs: [],
    loading: false,
    topic: null,
    message: null,
    rosbridge_address: '',
    port: '9090',
  },
  // helper methods to connect to ROS
  methods: {
    connect: function () {
      this.loading = true
      this.ros = new ROSLIB.Ros({
        url: this.ws_address
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
    disconnect: function () {
      this.ros.close()
    },
    setTopic: function () {
      this.topic = new ROSLIB.Topic({
        ros: this.ros,
        name: '/cmd_vel',
        messageType: 'geometry_msgs/Twist'
      })
    },
    forward: function () {
      this.message = new ROSLIB.Message({
        linear: { x: 1, y: 0, z: 0, },
        angular: { x: 0, y: 0, z: 0, },
      })
      this.setTopic()
      this.topic.publish(this.message)
    },
    stop: function () {
      this.message = new ROSLIB.Message({
        linear: { x: 0, y: 0, z: 0, },
        angular: { x: 0, y: 0, z: 0, },
      })
      this.setTopic()
      this.topic.publish(this.message)
    },
    backward: function () {
      this.message = new ROSLIB.Message({
        linear: { x: -1, y: 0, z: 0, },
        angular: { x: 0, y: 0, z: 0, },
      })
      this.setTopic()
      this.topic.publish(this.message)
    },
    turnLeft: function () {
      this.message = new ROSLIB.Message({
        linear: { x: 0.5, y: 0, z: 0, },
        angular: { x: 0, y: 0, z: 0.5, },
      })
      this.setTopic()
      this.topic.publish(this.message)
    },
    turnRight: function () {
      this.message = new ROSLIB.Message({
        linear: { x: 0.5, y: 0, z: 0, },
        angular: { x: 0, y: 0, z: -0.5, },
      })
      this.setTopic()
      this.topic.publish(this.message)
    },
  },
  mounted() {
  },
})