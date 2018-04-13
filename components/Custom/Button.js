import _ from 'lodash';
import React from 'react';
import {
    TouchableOpacity, View
} from 'react-native';
import PropTypes from "prop-types";
import Props, {BuilderProps} from "../../helpers/PropTypes";
import {
    getComponentStyle,
    getComponentStyleByProps,
    getGlobal,
    registerComponentStyle
} from "../../defaults";
import {BuilderStyle, value} from "../../helpers/Style";

const {Text: CustomText} = require('./Text');

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

    return <TouchableOpacity
        activeOpacity={props.activeOpacity}
        style={wrapStyle}
        onPress={props.disabled ? null : props.onPress}
    >
        <View style={containerStyle}>{props.children}</View>
    </TouchableOpacity>;
}

Custom.defaultProps = {
    componentName: 'Button.Custom',
    ignoreOwnStyles: false,

    children: null,
    disabled: false,
    onPress: null,
    style: {},
    activeOpacity: 0.8,
    height: value(40),
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

class BuilderButtonStyles extends BuilderStyle {
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
            throw new Error('Handle must be a type of function');
        }
        this.props.onPress = handle;
        return this;
    }

    style(handle) {
        if (!this.StyleBuilder) {
            throw new Error('Style builder is not defined');
        }
        if (typeof handle !== 'function') {
            throw new Error('Handle must be a type of function');
        }
        this.props.style = handle(new this.StyleBuilder());
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
            throw new Error('Handle must be a type of function');
        }
        this._styles.button = handle(Custom.defineStyles);
        return this;
    },
    text(handle) {
        if (typeof handle !== 'function') {
            throw new Error('Handle must be a type of function');
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
            throw new Error('Handle must be a type of function');
        }
        this._props.button = handle(Custom.defineProps);
        return this;
    },
    text(handle) {
        if (typeof handle !== 'function') {
            throw new Error('Handle must be a type of function');
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

Custom.Text = Text;

module.exports = Custom;