module.exports = {
    apps: [
      {
        name: 'gms-staging',
        script: 'npm',
        args: 'start',
        env: {
          PORT: 5800, // Explicitly set the port here or...
          NODE_ENV: 'development',
        },
        env_local: {
          PORT: 5800, // This works if `.env.local` has been correctly read
        },
      },
    ],
  };