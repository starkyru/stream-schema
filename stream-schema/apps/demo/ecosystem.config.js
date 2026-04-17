module.exports = {
  apps: [
    {
      name: 'stream-schema',
      script: './node_modules/.bin/next',
      args: 'start -p 3006',
      cwd: '/home/ilia/apps/stream-schema/stream-schema/apps/demo',
      env: {
        NODE_ENV: 'production',
        PORT: '3006',
      },
      error_file: '/home/ilia/.pm2/logs/stream-schema-error.log',
      out_file: '/home/ilia/.pm2/logs/stream-schema-out.log',
    },
  ],
};
