module.exports = {
    apps: [
        {
            name: 'apis',
            script: 'npm',
            args: 'start',
            cwd: '/root/carsl/art_project/apis',
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
