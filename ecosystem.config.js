module.exports = {
    apps: [
        {
            name: 'Messenger-FrontEnd',
            port: '443',
            exec_mode: 'cluster',
            instances: 'max',
            script: './.output/server/index.mjs'
        }
    ]
};
