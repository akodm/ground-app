module.exports = {
  apps : [{
    name: 'CLIENT',
    script: './node_modules/react-scripts/scripts/start.js',
    instances : 1,
    exec_mode : "fork",
    time : true,
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],
};