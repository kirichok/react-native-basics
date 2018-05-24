import React from 'react'
import {
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native'
import _ from 'lodash'

const DEF_PERIOD = 500;

function ThrottledTouchable(Touchable) {
    return function (props) {
        // noinspection JSUnresolvedVariable
        const period = props.period ? props.period : DEF_PERIOD;
        const debouncedHandler = props.onPress
            ? _.throttle(props.onPress, period, {trailing: false})
            : undefined;

        return <Touchable {...props} onPress={debouncedHandler}/>
    }
}


/**
 * Returns {@link TouchableOpacity} that fires onPress only once per the specified period (in ms.)
 * You can also use 'period' property to override the default value: {@link DEF_PERIOD} ms.
 * @return {TouchableOpacity}
 */
export function ThrottledTouchableOpacity(props) {
    const Touchable = ThrottledTouchable(TouchableOpacity);
    return <Touchable {...props}/>
}

/**
 * Returns {@link TouchableWithoutFeedback} that fires onPress only once per the specified period (in ms.)
 * You can also use 'period' property to override the default value: {@link DEF_PERIOD} ms.
 * @return {TouchableWithoutFeedback}
 */
export function ThrottledTouchableWithoutFeedback(props) {
    const Touchable = ThrottledTouchable(TouchableWithoutFeedback);
    return <Touchable {...props}/>
}
