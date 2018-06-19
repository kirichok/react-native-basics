import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Animated, InteractionManager} from 'react-native';
import {animate, timing} from "./utils";

export class TranslateYAndOpacity extends Component {
    static propTypes = {
        opacity: PropTypes.number,
        translateY: PropTypes.number,
        duration: PropTypes.number,
        delay: PropTypes.number,
        startOnDidMount: PropTypes.bool,
        type: PropTypes.string
    };

    static defaultProps = {
        type: 'timing',
        opacity: 0,
        translateY: 4,
        duration: 500,
        delay: 100,
        startOnDidMount: false,
        isHidden: true,
    };

    constructor(props) {
        super(props);

        const {opacity, translateY, isHidden} = props;
        this.state = {
            isHidden,

            opacityValue: new Animated.Value(opacity),
            translateYValue: new Animated.Value(translateY)
        };
    }

    componentDidMount() {
        const {startOnDidMount} = this.props;

        if (startOnDidMount) {
            InteractionManager.runAfterInteractions().then(() => {
                this.show(this.props);
            });
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            isHidden: nextProps.isHidden
        }
    }

    shouldComponentUpdate(nextProps) {
        if (!this.props.isHidden && nextProps.isHidden) {
            this.hide(nextProps);
        }
        if (this.props.isHidden && !nextProps.isHidden) {
            this.show(nextProps);
        }
        return true
    }

    show(props) {
        const {opacityValue, translateYValue} = this.state;
        const {type, delay, onDidShow} = props;

        Animated.parallel([
            animate(type, opacityValue, 1, 300, delay),
            animate(type, translateYValue, 0, 300, delay)
        ]).start(() => {
            onDidShow && onDidShow();
        });
    }

    hide(props) {
        const {opacityValue, translateYValue} = this.state;
        const {type, opacity, translateY, duration, delay, onDidHide} = props;

        Animated.parallel([
            animate(type, opacityValue, opacity, duration, delay),
            animate(type, translateYValue, translateY, duration, delay)
        ]).start(() => {
            onDidHide && onDidHide();
        });
    }

    render() {
        const {opacityValue, translateYValue} = this.state;
        const {children} = this.props;
        const animatedStyles = {
            opacity: opacityValue,
            transform: [
                {translateY: translateYValue},
                {perspective: 1000}
            ],
        };
        return (
            <Animated.View style={animatedStyles}>{children}</Animated.View>
        );
    }
}
