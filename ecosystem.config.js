module.exports = {
    apps: [
      {
        name: 'gms-dev',
        script: 'npm',
        args: 'start',
        env: {
          PORT: 5600, // Explicitly set the port here or...
          NODE_ENV: 'development',
        },
        env_local: {
          PORT: 5600, // This works if `.env.local` has been correctly read
        },
      },
    ],
  };