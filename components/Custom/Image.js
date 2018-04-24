import React from 'react';
import PropTypes from 'prop-types';
import {
    Image as RNImage,
    Animated as RNAnimated
} from 'react-native';
import {BuilderStyles, BuilderProps} from "../../helpers/Builders";
import Props from '../../helpers/PropTypes';
import {getComponentStyleByProps, getGlobal, registerComponentStyle} from "../../defaults";
import {getAssetByName, registerAsset} from "../../helpers/Assets";

/**
 *
 **/
function getSource(source, uri) {
    if (source || uri) {
        return source ? getAssetByName(source) : uri;
    }
    throw new Error('Image source is empty');
}

/**
 * Custom Image component
 **/
function Custom(props) {
    const componentStyle = getComponentStyleByProps(props),
        imageStyle = [
            componentStyle.image,
            props.color ? {tintColor: props.color} : {},
            props.flex ? getGlobal('flex') : {},
            {
                width: props.width,
                height: props.height,
            }
        ];

    return <RNImage
        source={getSource(props.source, props.uri)}
        resizeMode={props.mode}
        style={imageStyle}
    />;
}

Custom.defaultProps = {
    componentName: 'Image.Custom',
    ignoreOwnStyles: false,

    source: undefined,
    uri: undefined,
    mode: 'contain',
    color: '',
    flex: false,

    width: undefined,
    height: undefined,
};
Custom.propTypes = {
    componentName: PropTypes.string,
    ignoreOwnStyles: PropTypes.bool,

    source: PropTypes.string,
    uri: PropTypes.string,
    mode: PropTypes.string,
    color: PropTypes.string,
    flex: PropTypes.bool,

    width: Props.numberOrString,
    height: Props.numberOrString
};
Custom.displayName = Custom.defaultProps.componentName;

Object.defineProperty(Custom, 'defineStyles', {
    get: function () {
        return new BuilderImageStyles();
    }
});
Object.defineProperty(Custom, 'defineProps', {
    get: function () {
        return new BuilderImageProps(BuilderImageStyles);
    }
});

class BuilderImageStyles extends BuilderStyles {
    addition(value) {
        this.styles.image = value;
        return this;
    }
}

class BuilderImageProps extends BuilderProps {
    source(value) {
        this.props.source = value;
        return this;
    }

    uri(uri) {
        this.props.uri = {uri};
        return this;
    }

    mode(value) {
        this.props.mode = value;
        return this;
    }

    color(value) {
        this.props.color = value;
        return this;
    }

    width(value) {
        this.props.width = value;
        return this;
    }

    height(value) {
        this.props.height = value;
        return this;
    }
}

registerAsset('notFound', require('../../defaults/not_found.png'));

registerComponentStyle(Custom, Custom.defineStyles
    .get
);


function Animated(props) {
    const componentStyle = getComponentStyleByProps(props),
        textStyle = [
            componentStyle.text,
            props.disabled ? componentStyle.disabled : componentStyle.active,
            props.flex ? getGlobal('flex') : {},
        ];

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
        return new BuilderImageStyles();
    }
});
Object.defineProperty(Animated, 'defineProps', {
    get: function () {
        return new BuilderImageProps(BuilderImageStyles);
    }
});

// registerComponentStyle(Animated, Animated.defineStyles
//     .active('#4a90e2').disabled('#696969').error('#dc3d30')
//     .font(builder => builder.size(16).get)
//     .get
// );

module.exports = {
    Image: Custom
};
