<template>
  <FormItem :label="widget.name" :prop="widget.model">
 
    <template v-if="widget.type == 'input'" >
      <Input 
        v-if="widget.options.dataType == 'number' || widget.options.dataType == 'integer' || widget.options.dataType == 'float'"
        :type="widget.options.dataType"
        v-model.number="dataModel"
        :placeholder="widget.options.placeholder"
        :style="{width: widget.options.width}"
      />
      <Input  
        v-else
        :type="widget.options.dataType"
        v-model="dataModel"
        :placeholder="widget.options.placeholder"
        :style="{width: widget.options.width}"
      />
    </template>
    <template v-if="widget.type == 'textarea'">

      <Input type="textarea" :rows="5"
        v-model="dataModel"
        :placeholder="widget.options.placeholder"
        :style="{width: widget.options.width}"
      />
      
    </template>

    <template v-if="widget.type == 'number'">
      <InputNumber 
        v-model="widget.options.defaultValue" 
        :style="{width: widget.options.width}"
        :step="widget.options.step"
        controls-position="right"
      ></InputNumber>
    </template>

    <template v-if="widget.type == 'radio'">
      <RadioGroup v-model="dataModel"
        :style="{width: widget.options.width}"
      >
        <Radio
          :style="{display: widget.options.inline!=='false' ? 'inline-block' : 'block'}"
          :label="item.value" v-for="(item, index) in (widget.options.remote!=='false' ? widget.options.remoteOptions : widget.options.options)" :key="index"
        >
          <template v-if="widget.options.remote!=='false'">{{item.label}}</template>
          <template v-else>{{widget.options.showLabel ? item.label : item.value}}</template>
        </Radio>
      </RadioGroup>
    </template>
    <template v-if="widget.type == 'checkbox'">
      <CheckboxGroup v-model="dataModel"
        :style="{width: widget.options.width}"
      >
        <Checkbox
          :style="{display: widget.options.inline!=='false' ? 'inline-block' : 'block'}"
          :label="item.value" v-for="(item, index) in (widget.options.remote!=='false' ? widget.options.remoteOptions : widget.options.options)" :key="index"
        >
          <template v-if="widget.options.remote!=='false'">{{item.label}}</template>
          <template v-else>{{widget.options.showLabel ? item.label : item.value}}</template>
        </Checkbox>
      </CheckboxGroup>
    </template>
    <template v-if="widget.type == 'time'">
      <TimePicker 
        v-model="dataModel"
        :is-range="widget.options.isRange"
        :placeholder="widget.options.placeholder"
        :start-placeholder="widget.options.startPlaceholder"
        :end-placeholder="widget.options.endPlaceholder"
        :readonly="widget.options.readonly"
        :disabled="widget.options.disabled"
        :editable="widget.options.editable"
        :clearable="widget.options.clearable"
        :arrowControl="widget.options.arrowControl"
        :value-format="widget.options.format"
        :style="{width: widget.options.width}"
      >
      </TimePicker>
    </template>
    <template v-if="widget.type=='date'">
      <DatePicker
        v-model="dataModel"
        :type="widget.options.type"
        :placeholder="widget.options.placeholder"
        :start-placeholder="widget.options.startPlaceholder"
        :end-placeholder="widget.options.endPlaceholder"
        :readonly="widget.options.readonly"
        :disabled="widget.options.disabled"
        :editable="widget.options.editable"
        :clearable="widget.options.clearable"
        :value-format="widget.options.timestamp ? 'timestamp' : widget.options.format"
        :format="widget.options.format"
        :style="{width: widget.options.width}"
      >
      </DatePicker>
    </template>
    <template v-if="widget.type =='rate'">
      <Rate v-model="dataModel"
        :max="widget.options.max"
        :disabled="widget.options.disabled"
        :allow-half="widget.options.allowHalf"
      ></Rate>
    </template>
    <template v-if="widget.type == 'color'">
      <ColorPicker 
        v-model="dataModel"
        :disabled="widget.options.disabled"
        :show-alpha="widget.options.showAlpha"
      ></ColorPicker>
    </template>
    <template v-if="widget.type == 'select'">
      <Select
        v-model="dataModel"
        :disabled="widget.options.disabled"
        :multiple="widget.options.multiple"
        :clearable="widget.options.clearable"
        :placeholder="widget.options.placeholder"
        :style="{width: widget.options.width}"
      >
        <Option v-for="item in (widget.options.remote!=='false' ? widget.options.remoteOptions : widget.options.options)" :key="item.value" :value="item.value" :label="widget.options.showLabel || widget.options.remote!=='false'?item.label:item.value"></Option>
      </Select>
    </template>

    <template v-if="widget.type=='switch'">
      <i-switch
        v-model="dataModel"
        :disabled="widget.options.disabled"
      >
      </i-switch>
    </template>
    <template v-if="widget.type=='slider'">
      <Slider 
        v-model="dataModel"
        :min="widget.options.min"
        :max="widget.options.max"
        :disabled="widget.options.disabled"
        :step="widget.options.step"
        :show-input="widget.options.showInput"
        :range="widget.options.range"
        :style="{width: widget.options.width}"
      ></Slider>
    </template>
    <template v-if="widget.type=='imgupload'">
      <fm-upload
        v-model="dataModel"
        :disabled="widget.options.disabled"
        :style="{'width': widget.options.width}"
        :width="widget.options.size.width"
        :height="widget.options.size.height"
        :token="widget.options.token"
        :domain="widget.options.domain"
      >
      </fm-upload>
    </template>
  </FormItem>
</template>

<script>
import FmUpload from './Upload'

export default {
  props: ['widget', 'models', 'rules', 'remote'],
  components: {
    FmUpload
  },
  data () {
    return {
      dataModel: this.models[this.widget.model]
    }
  },
  created () {
    console.log(2222)
    console.log(this.widget)
    if (this.widget.options.remote && this.remote[this.widget.options.remoteFunc]) {
      this.remote[this.widget.options.remoteFunc]((data) => {
        this.widget.options.remoteOptions = data.map(item => {
          return {
            value: item[this.widget.options.props.value],
            label: item[this.widget.options.props.label]
          }
        })
      })
    }

    if (this.widget.type === 'imgupload') {
      this.remote[this.widget.options.tokenFunc]((data) => {
        this.widget.options.token = data
      })
    }
  },
  watch: {
    dataModel: {
      deep: true,
      handler (val) {
        this.models[this.widget.model] = val
        this.$emit('update:models', {
          ...this.models,
          [this.widget.model]: val
        })
      }
    },
    models: {
      deep: true,
      handler (val) {
        console.log('--------')
        this.dataModel = val[this.widget.model]
      }
    }
  }
}
</script>
