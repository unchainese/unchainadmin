const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    devServer: {
        proxy: {
            '/api': {
                target: 'https://admin.unchainese.us.kg',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': 'api'
                },
                logLevel: 'debug' // 添加日志级别以便调试
            },

        }
    }
})
