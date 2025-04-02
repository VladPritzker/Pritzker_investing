const { override, addBabelPlugins } = require('customize-cra');

module.exports = override(
  ...addBabelPlugins(
    ["@babel/plugin-transform-class-properties", { "loose": true }],
    ["@babel/plugin-transform-private-methods", { "loose": true }],
    ["@babel/plugin-transform-private-property-in-object", { "loose": true }]
  )
);
