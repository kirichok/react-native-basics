import _ from 'lodash';
import React from 'react';
import {StyleSheet} from 'react-native';

export function create(styles) {
    return StyleSheet.create(styles);
}

export const font = {
    size: {
        sm: 10,
        default: 16,
        md: 20,
        lg: 30,
        xl: 40
    },
    color: {
        default: '#4a4a4a',
        white: '#fff',
        label: '#9b9b9b',

        error: '#d0021b',
        disable: '#9b9b9b',
    },
    name: {
        ios: 'System',
        android: 'sans-serif'
    },
};

const _styles = {
    global: create({
        flex: {
            flex: 1
        }
    })
};

export function registerComponentStyle(component, styles) {
    defineStyle(component.displayName, styles);
}

export function defineStyle(name, value, merge = true) {
    if (merge) {
        _styles[name] = _.merge({}, _styles[name], value);
    } else {
        _styles[name] = value;
    }
}

export function getComponentStyle(name) {
    if (_styles[name]) {
        return _styles[name]
    }
    return {};
}

export function getGlobal(pick) {
    if (pick) {
        return _.pick(_styles.global, pick);
    }
    return _styles.global;
}

export function getComponentStyleByProps(props) {
    // return _.merge(
    //     {},
    //     props.ignoreOwnStyles ? {} : getComponentStyle(props.componentName),
    //     props.style
    // );

    return {
        ...(props.ignoreOwnStyles ? {} : getComponentStyle(props.componentName)),
        ...props.style
    };
}

export function getComponentCopy(Component, componentName, mixin) {
    function newComponent(props) {
        return <Component {...props} componentName={componentName}/>;
    }
    Object.setPrototypeOf(newComponent, Component);
    newComponent.defaultProps.componentName = componentName;
    newComponent.displayName = componentName;

    defineStyle(newComponent.displayName, getComponentStyle(Component.displayName));
    return newComponent;
}