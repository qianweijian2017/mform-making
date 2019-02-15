module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  'extends': [
    'plugin:vue/essential'
  ],
  //　添加插件
  "plugins": [
    "vue"
  ],
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/no-parsing-error': [2, { 'x-invalid-end-tag': false }],
    'no-undef': 'off'
  }
}
