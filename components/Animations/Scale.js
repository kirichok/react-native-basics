import React, {Component} from 'react';
import {Animated, InteractionManager} from 'react-native';
import PropTypes from 'prop-types';

export class Scale extends Component {
    static propTypes = {
        type: PropTypes.string,
        // component: PropTypes.string,
        animateOnDidMount: PropTypes.bool,
        interpolate: PropTypes.func,
    };

    static defaultProps = {
        type: 'timing',
        // component: 'View',
        animateOnDidMount: false,
    };

    constructor(props) {
        super(props);
        const {value, initValue, interpolate} = props;

        this.state = {
            value,
            scaleValue: new Animated.Value(initValue || value),
        };
        this.scale = interpolate ? interpolate(this.state.scaleValue) : this.state.scaleValue;
    }

    componentDidMount() {
        if (this.props.animateOnDidMount) {
            InteractionManager.runAfterInteractions().then(() => {
                this.move(this.props);
            });
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            value: nextProps.value
        }
    }

    shouldComponentUpdate(nextProps) {
        if (!this.state.value && nextProps.value) {
            this.move(nextProps);
        }
        return true
    }

    move = props => {
        const {value, type, onDidMove, resetValue, ...rest} = props;
        const {scaleValue} = this.state;

        Animated[type](scaleValue, {
            toValue: value,
            useNativeDriver: true,
            ...rest
        }).start(() => {
            console.log('>>> RESET VALUE', resetValue);
            if (typeof resetValue !== 'undefined') {
                this.setState({value: resetValue});
                Animated[type](scaleValue, {
                    toValue: resetValue,
                    delay: 0,
                    duration: 0,
                    useNativeDriver: true,
                }).start();
            }
            onDidMove && onDidMove();
        });
    };

    render() {
        const {style, children} = this.props;
        const animatedStyle = {
            transform: [
                {scale: this.scale},
                {perspective: 1000}
            ],
        };

        return (
            <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
        );
    }
}
