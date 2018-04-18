import React, {Component, Fragment} from 'react';
import {Animated, Text} from 'react-native';
import PropTypes from 'prop-types';
import {BuilderFont, Builder, BuilderProps, BuilderStyles} from '../../helpers/Builders';

const {Row, Col} = require('./Screen');
const {
    Animated: CustomAnimated,

    BuilderTextStyles
} = require('./Text');

class Floating extends Component {
    constructor(props) {
        super(props);

        const {
            focused,
            mode: {
                inline,
                focus
            },
        } = props;

        this.state = {
            focused,
        };

        this._focused = new Animated.Value(focused ? 1 : 0);

        this.style = {
            position: 'absolute',
            left: this._focused.interpolate({
                inputRange: [0, 1],
                outputRange: [inline.position.left, focus.position.left],
            }),
            top: this._focused.interpolate({
                inputRange: [0, 1],
                outputRange: [inline.position.top, focus.position.top],
            }),
            fontSize: this._focused.interpolate({
                inputRange: [0, 1],
                outputRange: [inline.style.font.fontSize, focus.style.font.fontSize],
            }),
            color: this._focused.interpolate({
                inputRange: [0, 1],
                outputRange: [inline.style.font.color, focus.style.font.color],
            }),
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.focused !== nextProps.focused) {
            return {
                focused: nextProps.focused
            }
        }

        return null;
    }

    componentDidUpdate() {
        Animated.timing(this._focused, {
            toValue: this.state.focused ? 1 : 0,
            duration: 200,
        }).start();
    }

    render() {
        const {
            error,
            height,
            mode: {
                focus,
                inline
            },
            children,
            style
        } = this.props;

        const {
            focused
        } = this.state;

        // const componentStyle = getComponentStyle(this.props.componentName),
        //     textProps = {style: componentStyle.text, ...this.props.text};

        // const wrap = height === defStyles.label.height ? styles.wrap : [styles.wrap, {paddingTop: height}];

        return <Fragment>
            <Row style={style.wrap}>
                <Col style={{flex: 1, paddingTop: height, ...style.underline}}>
                    <CustomAnimated {...CustomAnimated.defineProps
                        .text(focused ? focus.text : inline.text)
                        .style(builder => builder.animated(this.style).get)
                        .get}
                    />
                    {children}
                </Col>
            </Row>
            {error ? <Text style={style.font}>{error}</Text> : null}
        </Fragment>
    }
}

Floating.defaultProps = {
    componentName: 'Label.Floating',
    ignoreOwnStyles: false,

    focused: false,
    height: 20,
    error: '',

    mode: {
        focus: {
            text: 'Focus text',
            position: {
                top: 0,
                left: 0
            },
            style: {
                text: (new BuilderFont()).sm.color('grey').get
            }
        },
        inline: {
            text: 'Inline text',
            position: {
                top: 20,
                left: 10
            },
            style: {
                text: (new BuilderFont()).md.color('red').get
            }
        },
    },
    style: {
        wrap: {},
        font: {},
        underline: {}
    }
};
Floating.propTypes = {
    componentName: PropTypes.string,
    ignoreOwnStyles: PropTypes.bool,
};
Floating.displayName = Floating.defaultProps.componentName;
Object.defineProperty(Floating, 'defineStyles', {
    get: function () {
        return new BuilderFloatingStyles();
    }
});
Object.defineProperty(Floating, 'defineProps', {
    get: function () {
        return new BuilderFloatingProps(BuilderFloatingStyles);
    }
});

class BuilderFloatingStyles extends BuilderStyles {
    wrap(value) {
        this.styles.wrap = value;
        return this;
    }

    underline(value) {
        this.styles.underline = value;
        return this;
    }

    // error(handle) {
    //     this._isFunction(handle);
    //     this.styles.error = handle(new BuilderTextStyles());
    //     return this;
    // }
}

class BuilderMode extends Builder {
    text(value) {
        this.value.text = value;
        return this;
    }

    position(top, left) {
        this.value.position = {top, left};
        return this;
    }

    style(handle) {
        this._isFunction(handle);
        this.value.style = handle(new BuilderFloatingStyles());
        return this;
    }
}

class BuilderModes extends Builder {
    focus(handle) {
        return this._mode('focus', handle);
    }

    inline(handle) {
        return this._mode('inline', handle);
    }

    _mode(type, handle) {
        this._isFunction(handle);
        this.value[type] = handle(new BuilderMode());
        return this;
    }
}

class BuilderFloatingProps extends BuilderProps {
    // focused(value) {
    //     this.props.focused = value;
    //     return this;
    // }

    mode(handle) {
        this._isFunction(handle);
        this.props.mode = handle(new BuilderModes());
        return this;
    }

    height(value) {
        this.props.height = value;
        return this;
    }

    error(value) {
        this.props.error = value;
        return this;
    }
}

module.exports = {
    Floating
};