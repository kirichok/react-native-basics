const exec = require('child_process').execSync,
    dependenciesToLink = [
        'react-native-device-info',
        'react-native-vector-icons'
    ],
    command = 'react-native link';

dependenciesToLink.forEach((dependency) => {
    exec(`${command} ${dependency}`);
});