module.exports = {
  "presets": [
    ["env", {
      "modules": false,
    }],
    "stage-2"
  ],
  "plugins": ["transform-vue-jsx", "transform-runtime", "lodash"]
}