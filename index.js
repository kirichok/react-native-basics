'use strict';
import {registerComponentStyle} from "./defaults";


function test() {
    return 'Test 111 222';
}

const Basics = {
    get Button() {
        return require('./components/Custom/Button');
    },
    get styles() {
        return require('./helpers/Style');
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
        return require('./components/Custom/TextInput').TextInput;
    },

    get Builder() {
        return {
            Font: require('./helpers/Style').BuilderFont
        }
    },

    get test() {
        return test
    },

    registerComponentStyle(componentName, style) {
        registerComponentStyle(componentName, style);
    }
};

module.exports = Basics;