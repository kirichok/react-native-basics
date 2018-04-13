import React, {Component} from 'react';
import {Animated, Text} from 'react-native';
import PropTypes from 'prop-types';
import {BuilderFont, BuilderStyle} from "../../helpers/Style";
import {font, getComponentStyle} from "../../defaults";

const {Row, Col} = require('./Screen');
const {
    Animated: CustomAnimated,
    BuilderTextStyles,
    BuilderTextProps
} = require('./Text');


class Floating extends Component {
    constructor(props) {
        super(props);

        const {
            focused,

            style: {
                inline,
                focus
            },

            /*floating: {
                inline,
                focus
            }*/
        } = props;

        this.state = {
            focused,
        };

        this._focused = new Animated.Value(focused ? 1 : 0);

        this.style = {
            position: 'absolute',
            left: this._focused.interpolate({
                inputRange: [0, 1],
                outputRange: [inline.left, focus.left],
            }),
            top: this._focused.interpolate({
                inputRange: [0, 1],
                outputRange: [inline.top, focus.top],
            }),
            fontSize: this._focused.interpolate({
                inputRange: [0, 1],
                outputRange: [inline.size, focus.size],
            }),
            color: this._focused.interpolate({
                inputRange: [0, 1],
                outputRange: [inline.color, focus.color],
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
            duration: 3000,
        }).start();
    }

    getStyleByFocus() {
        return this.props.focused ? this.props.style.focus : this.props.style.inline;
    }

    render() {
        const {
            text = {
                inline: 'I',
                focus: 'F',
            },

            height,


            style: {
                focus,
                inline
            },

            children
        } = this.props;

        const {
            focused
        } = this.state;


        // const componentStyle = getComponentStyle(props.componentName),

            // textProps = {style: componentStyle.text, ...props.text};

        // const wrap = height === defStyles.label.height ? styles.wrap : [styles.wrap, {paddingTop: height}];

        return <Row style={{backgroundColor: '#696969'}}>
            <Col style={{}}>
                {/*<CustomAnimated {...this.getStyleByFocus()} style={this.style} ignoreOwnStyles={true}/>*/}

                <Animated.Text style={this.style}>{focused ? focus.text : inline.text}</Animated.Text>

                {children}
            </Col>
        </Row>;
    }
}

Floating.defaultProps = {
    componentName: 'Label.Floating',
    ignoreOwnStyles: false,

    focused: false,

    style: {
        focus: {
            text: 'Focus text',
            position: {
                top: 0,
                left: 0
            },
            style: {
                font: BuilderFont.sm.color('grey').get
            }
        },
        inline: {
            text: 'Inline text',
            position: {
                top: 20,
                left: 10
            },
            style: {
                font: BuilderFont.md.color('red').get
            }
        },
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


class BuilderFloatingStyles extends BuilderTextStyles {
    position(left, top) {
        this.styles.position = {
            left, top
        };
        return this;
    }
}

class BuilderFloatingProps extends BuilderTextProps {
    focus(handle) {
        return this._style('focus', handle);
    }
    inline(handle) {
        return this._style('inline', handle);
    }
    _style(type, handle) {
        if (!this.StyleBuilder) {
            throw new Error('Style builder is not defined');
        }
        if (typeof handle !== 'function') {
            throw new Error('Handle must be a type of function');
        }
        if (!this.props.style) {
            this.props.style = {};
        }
        this.props.style[type] = handle(new this.StyleBuilder());
        return this;
    }
}

delete BuilderFloatingProps.style;

module.exports = {
    Floating
};