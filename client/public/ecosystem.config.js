module.exports = {
  name : "CLIENT",
  script: "serve",
  exec_mode : "cluster",
  instances : 1,
  time : true,
  env: {
    PM2_SERVE_PATH: './',
    PM2_SERVE_PORT: 80,
    PM2_SERVE_SPA: 'true',
    PM2_SERVE_HOMEPAGE: '/index.html'
  }
}