'use strict';
import {getComponentCopy, registerComponentStyle} from "./defaults";
import {getAssetByName, registerAsset} from "./helpers/Assets";

const Basics = {
    get Button() {
        return require('./components/Custom/Button');
    },
    get Text() {
        return require('./components/Custom/Text').Text;
    },
    get Screen() {
        return require('./components/Custom/Screen');
    },
    get Col() {
        return require('./components/Custom/Screen').Col;
    },
    get Row() {
        return require('./components/Custom/Screen').Row;
    },
    get Sheet() {
        return require('./components/Custom/Screen').Sheet;
    },
    get Label() {
        return require('./components/Custom/Label');
    },
    get TextInput() {
        return require('./components/Custom/TextInput');
    },
    get Image() {
        return require('./components/Custom/Image').Image;
    },

    get CodeInput() {
        return require('./components/CodeInput').CodeInput
    },

    get styles() {
        return {
            ...require('./helpers/Style'),
            create: require('./defaults').create
        };
    },

    get Builder() {
        const {BuilderFont} = require('./helpers/Builders');
        return {
            Font: new BuilderFont()
        }
    },

    get Assets() {
        return {
            registerAsset,
            getAssetByName
        };
    },

    get Utils() {
        return {
            ...require('./helpers'),
            ...require('./utils'),
            ...require('./utils/validator')
        };
    },

    get Helpers() {
        return {
            Device: require('./helpers/Device')
        }
    },

    get configs() {
        return require('./configs');
    },

    get BaseReduxModule() {
        return require('./helpers/ReduxModules');
    },

    get GoogleApi() {
        return require('./helpers/GoogleApi');
    },

    registerComponentStyle(componentName, style) {
        registerComponentStyle(componentName, style);
    },

    get copyComponent() {
        return getComponentCopy;
    }
};

module.exports = Basics;
