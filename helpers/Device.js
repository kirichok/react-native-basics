import {Dimensions, Platform} from 'react-native';
import {
    isTablet,
    getBuildNumber,
    getVersion
} from 'react-native-device-info';
import Configs from '../configs';

/**
* Device info
* */
export const info = {
    isIOS: Platform.OS === 'ios',
    isAndroid: Platform.OS === 'android',

    isTablet: isTablet(),
    isPhone: !isTablet(),
    get version() {
        const config = Configs.get();
        let version = getVersion();

        if (config.IS_DEV) {
            version += (Platform.OS === 'ios' ? '-' + getBuildNumber() : '');
        }

        return version
    }
};

/**
 * Window size
 * */
export const dimensions = {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
};
