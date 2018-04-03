import {StyleSheet, Dimensions, Platform} from 'react-native';
import {
    isTablet,
    getBuildNumber,
    getVersion
} from 'react-native-device-info';

export const info = {
    isIOS: Platform.OS === 'ios',
    isAndroid: Platform.OS === 'android',

    isTablet: isTablet(),
    isPhone: !isTablet(),
    version: getVersion() + (this.isIOS ? '-' + getBuildNumber() : '')
};

/**
 * Window size
 * */
export const dimensions = {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
};
