<template>
  <div class="form-config-container">
    <Form label-position="top">
      
      <FormItem label="标签对齐方式">
        <RadioGroup v-model="data.labelPosition" type="button">
          <Radio label="left">左对齐</Radio>
          <Radio label="right">右对齐</Radio>
          <Radio label="top">顶部对齐</Radio>
        </RadioGroup>
      </FormItem>

      <FormItem label="表单字段宽度">
        <InputNumber v-model="data.labelWidth" :min="0" :max="200" :step="10"></InputNumber>
      </FormItem>
    </Form>
  </div>
</template>

<script>
export default {
  props: ['data']
}
</script>
