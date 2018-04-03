'use strict';

// import {Text} from './components/Custom/Image';

function test() {
    return 'Test 111 222';
}

const Basics = {
    get test() { return test },

    get Grid() {
        // import Image from './components/Custom/Image';
        return require('./components/Custom/Image');
        //const {Text} = require('./components/Custom/Image');
        //return Text;
    }
};

module.exports = Basics;