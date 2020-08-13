module.exports = {
  apps : [{
    name: 'SERVER',
    script: './bin/www',
    instances: 1,
    exec_mode : "cluster",
    watch: true,
    ignore_watch : ['node_modules', 'public'],
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],
};
