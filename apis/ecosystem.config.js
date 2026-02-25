module.exports = {
    apps: [
        {
            name: 'apis',
            script: 'npm',
            args: 'start',
            cwd: '/var/www/apis',
            env: {
                NODE_ENV: 'production'
            },
            watch: false,
            instances: 1,
            autorestart: true,
            max_memory_restart: '500M'
        }
    ]
};
