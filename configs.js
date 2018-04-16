const configs = {
    DEV: {
        // SERVER_API: 'http://192.168.0.114:7000/api/'
    },
    PROD: {
        // SERVER_API: 'https://restore.com/api/'
    }
};
let IS_DEV = false;

function define(dev, prod) {
    configs.DEV = {...configs.DEV, dev};
    configs.PROD = {...configs.PROD, prod};
}

function isDev(value) {
    IS_DEV = value;
}

function get() {
    return {
        IS_DEV,
        ...(IS_DEV ? configs.DEV : configs.PROD)
    }
}

module.exports = {
    define,
    isDev,
    get
};