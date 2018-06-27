{{=<% %>=}}
<template>
  <div class="<%idDash%>">
    <button @click="callHttp">Call HTTP</button>
    <button @click="callApi">Call API</button>
    <button @click="callJob">Call Job</button>
    <button @click="callBroadcast">Broadcast</button>
    <button @click="callGrpc">GRCP</button>
    <div>
      <div v-for="message in messages">
        {{message}}
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: '<%idDash%>',
    mounted () {
      this.$ctx.socket.on('broadcastResponse', (msg) => {
        let from = msg.context.auth.email
        this.addMessage(`from ${from}: ${msg.message}`)
      });
    },
    data () {
      return {
        messages: []
      }
    },
    computed: {

    },

    methods: {
      // Adds message to the list which is then shown
      addMessage(message) {
        this.messages.unshift(message)
      },

      // Example of how to call a HTTP get request which ends with the server
      async callHttp () {
        let data = await this.$ctx.httpGet('/api/work')
        this.addMessage(data)
      },

      // Example of how to use messaging API to call a method
      async callApi () {
        let data = await this.$ctx.apiCall('doSomeWork', [123, 'abc'])
        this.addMessage(data)
      },

      // Example of how to call long running job using API
      async callJob () {
        let data = await this.$ctx.apiJob('doSomeWorkAsync', [123, 'abc'], this.jobMessageHandler)
        this.addMessage(data)
      },
      jobMessageHandler(msg) {
        this.addMessage(msg)
      },

      // Example how to broadcast a message to all clients
      callBroadcast () {
        this.$ctx.broadcast('broadcastResponse','Hey there')
      },

      // Example of GRPC call
      async callGrpc () {
        let results = await this.$ctx.grpc('grpcTest', {
          name: 'Some parameter'
        })
        this.addMessage(results)
      }
    },
    props: ['$ctx']
  }

</script>

<style scoped lang="less">
  .<%idDash%> {

  }
</style>
<%={{ }}=%>
