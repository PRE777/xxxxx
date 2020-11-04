export var baseUrl = ""

if (process.env.NODE_ENV == 'production') {
    if (process.env.VUE_APP_FLAG == 'prod') {
        //正式环境走的地址
        baseUrl = "https://www.iwhere.com";
    } else if (process.env.VUE_APP_FLAG == 'qa') {
        //qa环境走的地址
        baseUrl = "http://qa.iwhere.com:9007";
    }
} else {
    // 开发环境
    baseUrl = "http://qa.iwhere.com:9007";
}