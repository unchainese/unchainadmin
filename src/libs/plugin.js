function shortTime(ts) {
    // unix timestamp to  yyyy-mm-dd hh:mm:ss
    let date = new Date(ts * 1000);
    return date.toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
}

function ts2Date(tsSecond) {
    return new Date(tsSecond * 1000);
}


// 日期格式化
function parseTime(time, pattern) {
    if (arguments.length === 0 || !time) {
        return null
    }
    const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
        date = time
    } else {
        if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
            time = parseInt(time)
        }
        if ((typeof time === 'number') && (time.toString().length === 10)) {
            time = time * 1000
        }
        date = new Date(time)
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    }
    return format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key]
        // Note: getDay() returns 0 on Sunday
        if (key === 'a') {
            return ['日', '一', '二', '三', '四', '五', '六'][value]
        }
        if (result.length > 0 && value < 10) {
            value = '0' + value
        }
        return value || 0
    })
}

export const VuePlugin = {
    install(Vue) {
        Vue.prototype.shortTime = shortTime
        Vue.prototype.parseTime = parseTime
        Vue.prototype.ts2Date = ts2Date
        Vue.prototype.kbGb = function (sizeKB) {
            return (sizeKB / 1024 / 1024).toFixed(2) + 'GB';
        }
    },
}