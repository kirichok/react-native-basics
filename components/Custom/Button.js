import React from 'react';
import {View} from 'react-native';
import PropTypes from "prop-types";
import Props from "../../helpers/PropTypes";
import {BuilderProps, BuilderStyles} from "../../helpers/Builders";
import {
    getComponentStyle,
    getComponentStyleByProps,
    getGlobal,
    registerComponentStyle
} from "../../defaults";
import {value} from "../../helpers/Style";
import {ThrottledTouchableOpacity} from "./ThrottledTouchable";

const {Text: CustomText} = require('./Text');
const {Image: CustomImage} = require('./Image');

/**
 * Custom Button component
 * */
function Custom(props) {
    const componentStyle = getComponentStyleByProps(props),
        wrapStyle = [
            componentStyle.wrap,
            props.disabled ? componentStyle.disabled : componentStyle.active,
            props.flex ? getGlobal('flex') : {},
            {borderRadius: props.radius}
        ],
        containerStyle = [componentStyle.container, {height: props.height}];

    return <ThrottledTouchableOpacity
        activeOpacity={props.activeOpacity}
        style={wrapStyle}
        onPress={props.disabled ? null : props.onPress}
    >
        <View style={containerStyle}>{props.children}</View>
    </ThrottledTouchableOpacity>;
}

Custom.defaultProps = {
    componentName: 'Button.Custom',
    ignoreOwnStyles: false,

    children: null,
    disabled: false,
    onPress: null,
    style: {},
    activeOpacity: 0.8,
    height: null,//value(40),
    radius: 0,
    flex: false
};
Custom.propTypes = {
    componentName: PropTypes.string,
    ignoreOwnStyles: PropTypes.bool,
    onPress: PropTypes.func.isRequired,
    style: Props.objectOrNumberOrArray,
    disabled: PropTypes.bool,
    activeOpacity: PropTypes.number,
    height: PropTypes.number,
    radius: PropTypes.number,
    flex: PropTypes.bool,
};
Custom.displayName = Custom.defaultProps.componentName;
Object.defineProperty(Custom, 'defineStyles', {
    get: function () {
        return new BuilderButtonStyles();
    }
});
Object.defineProperty(Custom, 'defineProps', {
    get: function () {
        return new BuilderButtonProps(BuilderButtonStyles);
    }
});

class BuilderButtonStyles extends BuilderStyles {
    active(backgroundColor) {
        this.styles.active = {
            backgroundColor,
        };
        return this;
    }

    disabled(backgroundColor) {
        this.styles.disabled = {
            backgroundColor,
        };
        return this;
    }

    error(backgroundColor) {
        this.styles.error = {
            backgroundColor,
        };
        return this;
    }

    container(style) {
        this.styles.container = style;
        return this;
    }

    wrap(style) {
        this.styles.wrap = style;
        return this;
    }
}

class BuilderButtonProps extends BuilderProps {
    disable(value) {
        this.props.disabled = value;
        return this;
    }

    get disabled() {
        return this.disable(true);
    }

    onPress(handle) {
        if (typeof handle !== 'function') {
            throw new Error('[Builder.Props] Button (onPress): Handle must be a type of function');
        }
        this.props.onPress = handle;
        return this;
    }

    activeOpacity(value) {
        this.props.activeOpacity = value;
        return this;
    }

    height(value) {
        this.props.height = value;
        return this;
    }

    radius(value) {
        this.props.radius = value;
        return this;
    }

    get flex() {
        this.props.flex = true;
        return this;
    }
}

registerComponentStyle(Custom, Custom.defineStyles
    .active('#4a90e2').disabled('#696969').error('#dc3d30')
    .wrap({
        flexDirection: 'row',
    })
    .container({
        flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center',
        // overflow: 'hidden'
    })
    .get
);

/**
 * Button with text
 * */
function Text(props) {
    const componentStyle = getComponentStyle(props.componentName),
        buttonProps = {style: componentStyle.button, ...props.button},
        textProps = {style: componentStyle.text, ...props.text};

    return <Custom {...buttonProps} disabled={props.disabled} ignoreOwnStyles={true}>
        <CustomText {...textProps} disabled={props.disabled} ignoreOwnStyles={true}/>
    </Custom>
}

Text.defaultProps = {
    componentName: 'Button.Text',
    disabled: false,
    button: Custom.defaultProps,
    text: CustomText.defaultProps,
};
Text.propTypes = {
    componentName: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    button: PropTypes.shape(Custom.propTypes),
    text: PropTypes.shape(CustomText.propTypes)
};
Text.displayName = Text.defaultProps.componentName;
Text.defineStyles = {
    _styles: {
        button: {},
        text: {}
    },
    button(handle) {
        if (typeof handle !== 'function') {
            throw new Error('[defineStyles] Text (Button): Handle must be a type of function');
        }
        this._styles.button = handle(Custom.defineStyles);
        return this;
    },
    text(handle) {
        if (typeof handle !== 'function') {
            throw new Error('[defineStyles] Text (Text): Handle must be a type of function');
        }
        this._styles.text = handle(CustomText.defineStyles);
        return this;
    },
    get get() {
        return this._styles;
    }
};
Text.defineProps = {
    _props: {
        // component: {},
        button: {},
        text: {}
    },
    disable(value) {
        this._props.disabled = value;
        return this;
    },
    get disabled() {
        return this.disable(true);
    },
    // component
    button(handle) {
        if (typeof handle !== 'function') {
            throw new Error('[defineProps] Text (Button): Handle must be a type of function');
        }
        this._props.button = handle(Custom.defineProps);
        return this;
    },
    text(handle) {
        if (typeof handle !== 'function') {
            throw new Error('[defineProps] Text (Text): Handle must be a type of function');
        }
        this._props.text = handle(CustomText.defineProps);
        return this;
    },
    get get() {
        return this._props;
    }
};

registerComponentStyle(Text, Text.defineStyles
    .button(builder => builder
        .active('#4a90e2').disabled('#696969').error('#dc3d30')
        .wrap({
            flexDirection: 'row',
        })
        .container({
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
        })
        .get)
    .text(builder => builder
        .active('#4a90e2').disabled('#696969').error('#dc3d30')
        .font(builder => builder.size(16).get)
        .get)
    .get
);

/**
 * Button with Image
 * */
function Image(props) {
    const componentStyle = getComponentStyle(props.componentName),
        buttonProps = {style: componentStyle.button, ...props.button},
        imageProps = {style: componentStyle.image, ...props.image};

    return <Custom {...buttonProps} disabled={props.disabled} ignoreOwnStyles={true}>
        <CustomImage {...imageProps} disabled={props.disabled} ignoreOwnStyles={true}/>
    </Custom>
}

Image.defaultProps = {
    componentName: 'Button.Image',
    disabled: false,
    button: Custom.defaultProps,
    image: CustomImage.defaultProps,
};
Image.propTypes = {
    componentName: PropTypes.string.isRequired,
    disabled: PropTypes.bool,

    button: PropTypes.shape(Custom.propTypes),
    image: PropTypes.shape(CustomImage.propTypes)
};
Image.displayName = Image.defaultProps.componentName;
Image.defineStyles = {
    _styles: {
        button: {},
        image: {}
    },
    button(handle) {
        if (typeof handle !== 'function') {
            throw new Error('[defineStyles] Button.Image (Button): Handle must be a type of function');
        }
        this._styles.button = handle(Custom.defineStyles);
        return this;
    },
    image(handle) {
        if (typeof handle !== 'function') {
            throw new Error('[defineStyles] Button.Image (Image): Handle must be a type of function');
        }
        this._styles.image = handle(CustomImage.defineStyles);
        return this;
    },
    get get() {
        return this._styles;
    }
};
Image.defineProps = {
    _props: {
        button: {},
        image: {}
    },
    disable(value) {
        this._props.disabled = value;
        return this;
    },
    get disabled() {
        return this.disable(true);
    },
    // component
    button(handle) {
        if (typeof handle !== 'function') {
            throw new Error('[defineProps] Button.Image (Button): Handle must be a type of function');
        }
        this._props.button = handle(Custom.defineProps);
        return this;
    },
    image(handle) {
        if (typeof handle !== 'function') {
            throw new Error('[defineProps] Button.Image (Image): Handle must be a type of function');
        }
        this._props.image = handle(CustomImage.defineProps);

        return this;
    },
    get get() {
        return this._props;
    }
};

registerComponentStyle(Image, Image.defineStyles
    .button(builder => builder
        .active('#4a90e2').disabled('#696969').error('#dc3d30')
        .wrap({
            flexDirection: 'row',
        })
        .container({
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
        })
        .get)
    .image(builder => builder.get)
    .get
);


Custom.Text = Text;
Custom.Image = Image;

module.exports = Custom;
