<template>
<fm-generate-form :data="jsonData" :remote="remoteFuncs" :value="editData" ref="generateForm"></fm-generate-form>
  <!-- <div style="padding: 50px;">

    <upload
      :width="160"
      :height="100"
      :token="uptoken"
      :domain="domain"
    ></upload>
  </div> -->

</template>

<script>
import Upload from './components/Upload'
import request from './util/request.js'
export default {
  components: {
    Upload
  },
  data () {
    return {
      jsonData: {"list":[{"type":"textarea","name":"多行文本","icon":"regular/keyboard","options":{"width":"100%","defaultValue":"","required":false,"pattern":"","placeholder":"","remoteFunc":"func_1541506527000_80830"},"key":"1541506527000_80830","model":"textarea_1541506527000_80830","rules":[]},{"type":"input","name":"单行文本","icon":"regular/keyboard","options":{"width":"100%","defaultValue":"","required":false,"dataType":"text","pattern":"","placeholder":"","remoteFunc":"func_1541506528000_72758"},"key":"1541506528000_72758","model":"input_1541506528000_72758","rules":[]},{"type":"number","name":"计数器","icon":"sort-numeric-up","options":{"width":"","required":false,"defaultValue":0,"min":"","max":"","step":1,"disabled":false,"controlsPosition":"","remoteFunc":"func_1541506530000_32310"},"key":"1541506530000_32310","model":"number_1541506530000_32310","rules":[]}],"config":{"labelWidth":100,"labelPosition":"top"}},
      uptoken: '',
      domain: 'http://.bkt.clouddn.com/',
      editData: {
        'textarea_1541506527000_80830':"dasdadashuidsahduasdhsudhsudhu"
      },
          remoteFuncs: {
            
          }
    }
  },
  created () {
    // request.get('http://localhost:9000/api/uptoken').then(res => {
    //   console.log('res', res)
    //   this.uptoken = res.uptoken
    //   // this.domain = res.domain
    // })
  }
}
</script>
