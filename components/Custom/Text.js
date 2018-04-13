import React from 'react';
import PropTypes from 'prop-types';
import {
    Text as RNText,
    Animated as RNAnimated
} from 'react-native';
import {BuilderFont, BuilderStyle} from "../../helpers/Style";
import Props, {BuilderProps} from '../../helpers/PropTypes';
import {getComponentStyleByProps, getGlobal, registerComponentStyle} from "../../defaults";

/**
 * Custom Text component
 * */
function Custom(props) {
    const componentStyle = getComponentStyleByProps(props),
        textStyle = [
            componentStyle.text,
            props.disabled ? componentStyle.disabled : componentStyle.active,
            props.flex ? getGlobal('flex') : {},
        ];
    return <RNText style={textStyle} onPress={props.onPress}>
        {props.text}
    </RNText>;
}

Custom.defaultProps = {
    componentName: 'Text.Custom',
    ignoreOwnStyles: false,
    text: 'Text',
    disabled: false,
    flex: false,
};
Custom.propTypes = {
    componentName: PropTypes.string,
    ignoreOwnStyles: PropTypes.bool,
    text: PropTypes.string.isRequired,
    onPress: PropTypes.func,
    style: Props.objectOrNumberOrArray,
    disabled: PropTypes.bool,
    flex: PropTypes.bool
};
Custom.displayName = Custom.defaultProps.componentName;

Object.defineProperty(Custom, 'defineStyles', {
    get: function () {
        return new BuilderTextStyles();
    }
});
Object.defineProperty(Custom, 'defineProps', {
    get: function () {
        return new BuilderTextProps(BuilderTextStyles);
    }
});

class BuilderTextStyles extends BuilderStyle {
    active(color) {
        this.styles.active = {
            color,
        };
        return this;
    }

    disabled(color) {
        this.styles.disabled = {
            color,
        };
        return this;
    }

    error(color) {
        this.styles.error = {
            color,
        };
        return this;
    }

    font(handle) {
        if (typeof handle !== 'function') {
            throw new Error('Handle must be a type of function');
        }
        this.styles.text = handle(BuilderFont);
        return this;
    }
}

class BuilderTextProps extends BuilderProps {
    disable(value) {
        this.props.disabled = value;
        return this;
    }

    get disabled() {
        return this.disable(true);
    }

    text(text) {
        this.props.text = text;
        return this;
    }
}

registerComponentStyle(Custom, Custom.defineStyles
    .active('#4a90e2').disabled('#696969').error('#dc3d30')
    .font(builder => builder.size(16).get)
    .get
);

function Animated(props) {
    const componentStyle = getComponentStyleByProps(props),
        textStyle = [
            componentStyle.text,
            props.disabled ? componentStyle.disabled : componentStyle.active,
            props.flex ? getGlobal('flex') : {},
        ];

    console.log(props.style);
    return <RNAnimated.Text style={props.style} onPress={props.onPress}>
        {props.text}
    </RNAnimated.Text>;
}

Animated.defaultProps = {
    componentName: 'Animated.Text',
    ignoreOwnStyles: false,
    text: 'Text',
    disabled: false,
    flex: false,
};
Animated.propTypes = {
    componentName: PropTypes.string,
    ignoreOwnStyles: PropTypes.bool,
    text: PropTypes.string.isRequired,
    onPress: PropTypes.func,
    style: Props.objectOrNumberOrArray,
    disabled: PropTypes.bool,
    flex: PropTypes.bool
};
Animated.displayName = Animated.defaultProps.componentName;

Object.defineProperty(Animated, 'defineStyles', {
    get: function () {
        return new BuilderTextStyles();
    }
});
Object.defineProperty(Animated, 'defineProps', {
    get: function () {
        return new BuilderTextProps(BuilderTextStyles);
    }
});

registerComponentStyle(Animated, Animated.defineStyles
    .active('#4a90e2').disabled('#696969').error('#dc3d30')
    .font(builder => builder.size(16).get)
    .get
);

module.exports = {
    Text: Custom,
    Animated: Animated,

    BuilderTextStyles,
    BuilderTextProps
};