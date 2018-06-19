import {Animated} from "react-native";

export function timing(animated, toValue, duration, delay) {
    return Animated.timing(animated, {
        toValue,
        duration,
        delay,
        useNativeDriver: true,
    });
}

export function animate(type = 'timing', animated, toValue, duration, delay) {
    return Animated[type](animated, {
        toValue,
        duration,
        delay,
        useNativeDriver: true,
    });
}
