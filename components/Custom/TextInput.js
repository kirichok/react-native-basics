import React, {Component, forwardRef} from 'react';
import PropTypes from 'prop-types';
import {
    TextInput as RNTextInput,
    View
} from 'react-native';
import {BuilderStyles, BuilderProps, BuilderFont} from "../../helpers/Builders";
import Props, {} from '../../helpers/PropTypes';
import {getComponentStyleByProps, getGlobal, registerComponentStyle} from "../../defaults";

const Label = require('./Label');

/**
 * Custom TextInput component
 * */

const Custom = forwardRef((props, ref) => {
    const {
        onChange,
        value,
        placeholder,

        keyboard,
        secure,
        editable,
        focus,
        clearButton,
        maxLength,

        onFocus,
        onBlur,
        onKeyPress,

        returnKeyType,
        onSubmitEditing,
        blurOnSubmit
    } = props;

    const componentStyle = getComponentStyleByProps(props),
        textInputStyle = [
            {
                margin: 0,
                padding: 0
            },
            componentStyle.input,
            props.flex ? getGlobal('flex') : {},
        ];

    return <RNTextInput
        ref={ref}
        value={'' + value}
        placeholder={placeholder}
        style={textInputStyle}

        onChangeText={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyPress={onKeyPress}

        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        blurOnSubmit={blurOnSubmit}

        underlineColorAndroid={'transparent'}
        autoCapitalize={'none'}
        keyboardType={keyboard}

        clearTextOnFocus={false}
        autoCorrect={false}
        autoComplete={false}
        secureTextEntry={secure}
        editable={editable}
        autoFocus={focus}
        maxLength={maxLength}

        clearButtonMode={clearButton ? 'while-editing' : 'never'}
    />
});
// function Custom() {
//     return forwardRef(function (props) {
//
//     });
// }

Custom.defaultProps = {
    componentName: 'TextInput.Custom',
    ignoreOwnStyles: false,

    onChange: null,
    value: '',
    placeholder: '',
    style: {},
    maxLength: undefined,

    keyboard: 'default',
    secure: false,
    editable: true,
    focus: false,
    clearButton: false
};
Custom.propTypes = {
    onChange: PropTypes.func.isRequired,
    value: Props.numberOrString,
    placeholder: PropTypes.string,
    style: Props.objectOrNumberOrArray,

    keyboard: PropTypes.string,
    secure: PropTypes.bool,
    editable: PropTypes.bool,
    focus: PropTypes.bool,
    clearButton: PropTypes.bool,
};
Custom.displayName = Custom.defaultProps.componentName;

Object.defineProperty(Custom, 'defineStyles', {
    get: function () {
        return new BuilderTextInputStyles();
    }
});
Object.defineProperty(Custom, 'defineProps', {
    get: function () {
        return new BuilderTextInputProps(BuilderTextInputStyles);
    }
});

class BuilderTextInputStyles extends BuilderStyles {
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
            throw new Error('[Builder.Styles] TextInput (Font): Handle must be a type of function');
        }
        this.styles.input = handle(new BuilderFont());
        return this;
    }
}

class BuilderTextInputProps extends BuilderProps {
    keyboard(name) {
        this.props.keyboard = name;
        return this;
    }

    edit(value) {
        this.props.editable = value;
        return this;
    }

    get editable() {
        return this.edit(true);
    }


    secure(value) {
        this.props.secure = value;
        return this;
    }

    get secured() {
        return this.secure(true);
    }

    focus(value) {
        this.props.focus = value;
        return this;
    }

    get focused() {
        return this.focus(true);
    }

    onChange(handle) {
        return this._applyHandle('onChange', handle);
    }

    onFocus(handle) {
        return this._applyHandle('onFocus', handle, true);
    }

    onBlur(handle) {
        return this._applyHandle('onBlur', handle, true);
    }

    onKeyPress(handle) {
        return this._applyHandle('onKeyPress', handle, true);
    }

    value(value) {
        this.props.value = value;
        return this;
    }

    placeholder(value) {
        this.props.placeholder = value;
        return this;
    }

    max(value) {
        this.props.maxLength = value;
        return this;
    }

    onSubmitEditing(handle) {
        return this._applyHandle('onSubmitEditing', handle, true);
    }

    returnKeyType(value) {
        this.props.returnKeyType = value;
        return this;
    }

    blurOnSubmit(value) {
        this.props.blurOnSubmit = value;
        return this;
    }

    mask(value) {
        this.props.mask = value;
        return this;
    }
}

registerComponentStyle(Custom, Custom.defineStyles
    .active('#262628').disabled('#dbdbdb').error('#ff4e64')
    .font(builder => builder.size(16).get)
    .get
);


/**
 *
 **/


/**
 * TextInput with Label
 **/
class Labeled extends Component {
    constructor(props) {
        super(props);
        this.state = {
            focused: this.props.textInput.focus,
        };
    }

    onFocus = () => {
        this.setState({focused: true});
    };

    onBlur = () => {
        this.setState({focused: false});
    };

    render() {
        const TextInput_ = this.props.textInputComponent ? this.props.textInputComponent : Custom;

        return <Label.Floating
            {...this.props.label}
            focused={this.state.focused || this.props.textInput.value}
        >
            <View style={{flexDirection: 'row'}}>
                <TextInput_
                    {...this.props.textInput}
                    onFocus={() => {
                        this.onFocus();
                        this.props.textInput.onFocus && this.props.textInput.onFocus();
                    }}
                    onBlur={() => {
                        this.onBlur();
                        this.props.textInput.onBlur && this.props.textInput.onBlur();
                    }}
                />
                {this.props.Right}
            </View>
        </Label.Floating>;
    }
}

Labeled.propTypes = {
    componentName: PropTypes.string.isRequired,
    disabled: PropTypes.bool,

    label: PropTypes.shape(Label.Floating.propTypes),
    textInput: PropTypes.shape(Custom.propTypes)
};
Labeled.defaultProps = {
    componentName: 'TextInput.Labeled',
    disabled: false,

    label: Label.Floating.defaultProps,
    textInput: Custom.defaultProps
};
Labeled.displayName = Labeled.defaultProps.componentName;

Object.defineProperty(Labeled, 'defineStyles', {
    get: function () {
        return new BuilderLabeledStyles();
    }
});
Object.defineProperty(Labeled, 'defineProps', {
    get: function () {
        return new BuilderLabeledProps();
    }
});

class BuilderLabeledStyles {
    _styles = {
        label: {},
        textInput: {}
    };

    label(handle) {
        if (typeof handle !== 'function') {
            throw new Error('[Builder.Styles] TextInput.Labeled (Label): Handle must be a type of function');
        }
        this._styles.label = handle(Label.Floating.defineStyles);
        return this;
    }

    textInput(handle) {
        if (typeof handle !== 'function') {
            throw new Error('[Builder.Styles] TextInput.Labeled (TextInput): Handle must be a type of function');
        }
        this._styles.textInput = handle(Custom.defineStyles);
        return this;
    }

    get get() {
        return this._styles;
    }
}

class BuilderLabeledProps {
    _props = {
        label: {},
        textInput: {}
    };

    disable(value) {
        this._props.disabled = value;
        return this;
    }

    get disabled() {
        return this.disable(true);
    }

    // component
    label(handle) {
        if (typeof handle !== 'function') {
            throw new Error('[Builder.Props] TextInput.Labeled (Label): Handle must be a type of function');
        }
        this._props.label = handle(Label.Floating.defineProps);
        return this;
    }

    textInput(handle) {
        if (typeof handle !== 'function') {
            throw new Error('[Builder.Props] TextInput.Labeled (TextInput): Handle must be a type of function');
        }
        this._props.textInput = handle(Custom.defineProps);

        return this;
    }

    rightComponent(component) {
        this._props.Right = component;
        return this;
    }

    textInputComponent(component) {
        this._props.textInputComponent = component;
        return this;
    }

    get get() {
        return this._props;
    }
}


Custom.Labeled = Labeled;

module.exports = Custom;
