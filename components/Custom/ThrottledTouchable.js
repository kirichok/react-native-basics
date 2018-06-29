import React, {Component} from 'react'
import {TouchableOpacity, TouchableWithoutFeedback} from 'react-native'
import _ from 'lodash'

const DEF_PERIOD = 500;

class ThrottledTouchable extends Component {
    constructor(props) {
        super(props);
        this.state = {...props};
        this.debounceHandler = _.throttle(this.onPress, props.period, {trailing: false});
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {...nextProps}
    }

    onPress = () => {
        const {onPress} = this.props;
        onPress && onPress();
    };

    render() {
        const {Touchable, ...rest} = this.props;
        return <Touchable {...rest} onPress={this.debounceHandler}/>
    }
}

/**
 * Returns {@link TouchableOpacity} that fires onPress only once per the specified period (in ms.)
 * You can also use 'period' property to override the default value: {@link DEF_PERIOD} ms.
 * @return {TouchableOpacity}
 */
export function ThrottledTouchableOpacity(props) {
    return <ThrottledTouchable Touchable={TouchableOpacity} {...props}/>
}

/**
 * Returns {@link TouchableWithoutFeedback} that fires onPress only once per the specified period (in ms.)
 * You can also use 'period' property to override the default value: {@link DEF_PERIOD} ms.
 * @return {TouchableWithoutFeedback}
 */
export function ThrottledTouchableWithoutFeedback(props) {
    return <ThrottledTouchable Touchable={TouchableWithoutFeedback} {...props}/>
}






