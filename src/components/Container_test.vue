<template>
  <Layout style="height: 100%;">
    <Sider hide-trigger  collapsible :width="300" style="background:#fff;">
      <div class="components-list">
        <div class="widget-cate">基础字段</div>
        <draggable element="ul" :list="basicComponents" 
          :options="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
          @end="handleMoveEnd"
          @start="handleMoveStart"
          :move="handleMove"
        >
          
          <li class="form-edit-widget-label" v-for="(item, index) in basicComponents" :key="index">
            <a>
              <icon class="icon" :name="item.icon"></icon>
              <span>{{item.name}}</span>
            </a>
          </li>
        </draggable>
        <div class="widget-cate">高级字段</div>
        <draggable element="ul" :list="advanceComponents" 
          :options="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
          @end="handleMoveEnd"
          @start="handleMoveStart"
          :move="handleMove"
        >
          
          <li class="form-edit-widget-label" v-for="(item, index) in advanceComponents" :key="index">
            <a>
              <icon class="icon" :name="item.icon"></icon>
              <span>{{item.name}}</span>
            </a>
          </li>
        </draggable>
        
        <div class="widget-cate">布局字段</div>
        <draggable element="ul" :list="layoutComponents" 
          :options="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
          @end="handleMoveEnd"
          @start="handleMoveStart"
          :move="handleMove"
        >
          
          <li class="form-edit-widget-label data-grid" v-for="(item, index) in layoutComponents" :key="index">
            <a>
              <icon class="icon" :name="item.icon"></icon>
              <span>{{item.name}}</span>
            </a>
          </li>
        </draggable>
      </div>
    </Sider>
    <Layout class="center-container">
        <Header class="btn-bar" style="height: 45px;">
          <Button type="text" size="small" icon="el-icon-view" @click="handlePreview">预览</Button>
          <Button type="text" size="small" icon="el-icon-tickets" @click="handleGenerateJson">生成JSON</Button>
          <Button type="text" size="small" icon="el-icon-document" @click="handleGenerateCode">生成代码</Button>
        </Header>
        <Content :class="{'widget-empty': widgetForm.list.length == 0}">
          <widget-form ref="widgetForm" :data="widgetForm" :select.sync="widgetFormSelect"></widget-form>
        </Content>
    </Layout>
    <Sider class="widget-config-container" :width="300" style="background:#fff;">
      <Layout>
        <Header style="height: 45px;">
          <div class="config-tab" :class="{active: configTab=='widget'}" @click="handleConfigSelect('widget')">字段属性</div>
          <div class="config-tab" :class="{active: configTab=='form'}" @click="handleConfigSelect('form')">表单属性</div>
        </Header>
        <Content class="config-content">
          <widget-config v-show="configTab=='widget'" :data="widgetFormSelect"></widget-config>
          <form-config v-show="configTab=='form'" :data="widgetForm.config"></form-config>
        </Content>
      </Layout>
    </Sider>
    <cus-dialog
      :visible="previewVisible"
      @on-close="previewVisible = false"
      title="预览"
      ref="widgetPreview"
      @on-submit="handleTest"
      width="1000px"
      form
    >
      <generate-form v-if="previewVisible" :data="widgetForm" :remote="remoteFuncs" :value="widgetModels" ref="generateForm">

        <template slot="blank" slot-scope="scope">
          宽度：<Input v-model="scope.model.blank.width" style="width: 100px"/>
          高度：<Input v-model="scope.model.blank.height" style="width: 100px"/>
        </template>
      </generate-form>
    </cus-dialog>

    <cus-dialog
      :visible="jsonVisible"
      @on-close="jsonVisible = false"
      ref="jsonPreview"
      title="JSON"
      width="800px"
      form
    >
      <!-- <div id="jsoneditor" style="height: 400px;width: 100%;">{{jsonTemplate}}</div> -->
      <editor v-model="jsonTemplateFn" @init="editorInit" lang="json" height="340"></editor>
      <template slot="action">
        <Button id="copybtn" data-clipboard-target=".ace_text-input">双击复制</Button>
      </template>
    </cus-dialog>

    <cus-dialog
      :visible="codeVisible"
      @on-close="codeVisible = false"
      ref="codePreview"
      title="HTML代码"
      width="800px"
      form
      :action="false"
    >
      <!-- <div id="codeeditor" style="height: 500px; width: 100%;">{{htmlTemplate}}</div> -->
      <editor v-model="htmlTemplate" @init="editorInit" lang="html" height="340"></editor>
    </cus-dialog>
  </Layout>
</template>

<script>
import Draggable from 'vuedraggable'
import WidgetConfig from './WidgetConfig'
import FormConfig from './FormConfig'
import WidgetForm from './WidgetForm'
import CusDialog from './CusDialog'
import GenerateForm from './GenerateForm'
// import JSONEditor from 'jsoneditor'
// import 'jsoneditor/dist/jsoneditor.min.css'
import Clipboard from 'clipboard'
import {basicComponents, layoutComponents, advanceComponents} from './componentsConfig.js'
import {loadJs, loadCss} from '../util/index.js'
import request from '../util/request.js'
import generateCode from './generateCode.js'
import editor from 'vue2-ace-editor'

export default {
  name: 'fm-making-form',
  components: {
    Draggable,
    WidgetConfig,
    FormConfig,
    WidgetForm,
    CusDialog,
    GenerateForm,
    editor
  },
  data () {
    return {
      basicComponents,
      layoutComponents,
      advanceComponents,
      widgetForm: {
        list: [],
        config: {
          labelWidth: 100,
          labelPosition: 'right'
        },
      },
      configTab: 'widget',
      widgetFormSelect: null,
      previewVisible: false,
      jsonVisible: false,
      codeVisible: false,
      remoteFuncs: {
        func_test (resolve) {
          setTimeout(() => {
            const options = [
              {id: '1', name: '1111'},
              {id: '2', name: '2222'},
              {id: '3', name: '3333'}
            ]

            resolve(options)
          }, 2000)
        },
        funcGetToken (resolve) {
          request.get('http://tools-server.xiaoyaoji.cn/api/uptoken').then(res => {
            resolve(res.uptoken)
          })
        }
      },
      widgetModels: {},
      blank: '',
      htmlTemplate: '',
      jsonTemplate: ''
    }
  },
  mounted () {
    // loadCss('https://unpkg.com/jsoneditor/dist/jsoneditor.min.css')
    // loadJs('https://unpkg.com/jsoneditor/dist/jsoneditor.min.js')
    //loadJs('lib/ace/src/ace.js')
    // const acex = require('brace');
    // require('brace/mode/json');
    // require('brace/mode/html');
    // require('brace/theme/monokai');
  },
  computed: {
    jsonTemplateFn(){
      return JSON.stringify(this.jsonTemplate,null,2)
    }
  },
  methods: {
    editorInit: function () {
        require('brace/mode/json')                
        require('brace/mode/html')    //language
        require('brace/theme/chrome')
    },
    handleGoGithub () {
      window.location.href = 'https://github.com/GavinZhuLei/vue-form-making'
    },
    handleConfigSelect (value) {
      this.configTab = value
    },
    handleMoveEnd (evt) {
      //console.log('end', evt)
    },
    handleMoveStart ({oldIndex}) {
      //console.log('start', oldIndex, this.basicComponents)
    },
    handleMove () {
      return true
    },
    handlePreview () {
      this.previewVisible = true
    },
    handleTest () {
      this.$refs.generateForm.getData().then(data => {
        //console.log(data)
        //this.$alert(data, '').catch(e=>{})
        this.$Modal.info({
          content: '<p style="word-wrap:break-word">'+JSON.stringify(data)+'</p>'
        })
        this.$refs.widgetPreview.end()
      }).catch(e => {
        this.$refs.widgetPreview.end()
      })
    },
    handleGenerateJson () {
      this.jsonVisible = true
      this.jsonTemplate = this.widgetForm
      this.$nextTick(() => {
      //var editor = ace.edit('jsoneditor');
      //editor.session.setMode('ace/mode/json');
        //editor.setTheme('ace/theme/monokai');
        // const editor = ace.edit('jsoneditor')
        // editor.session.setMode("ace/mode/json")
        const btnCopy = new Clipboard('#copybtn')
      })
    },
    handleGenerateCode () {
      this.codeVisible = true
      this.htmlTemplate = generateCode(JSON.stringify(this.widgetForm))
      // this.$nextTick(() => {
      //   const editor = ace.edit('codeeditor')
      //   editor.session.setMode("ace/mode/html")
      // })
    }
  },
  watch: {
    widgetForm: {
      deep: true,
      handler: function (val) {
        //console.log(this.$refs.widgetForm)
      }
    }
  }
}
</script>

<style lang="scss">
@import '../styles/cover.scss';
@import '../styles/index.scss';

.widget-empty{
  background: url('../assets/form_empty.png') no-repeat #fff;
  background-position: 50%;
}

</style>
