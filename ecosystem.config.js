// eslint-disable-next-line no-undef
module.exports = {
  apps : [{
    name: "tinyurl",
    script: 'dist/index.js',
    exec_mode: 'cluster',
    instances: 4,
    watch: true,
  }]
};
