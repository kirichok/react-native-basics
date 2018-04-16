import _ from 'lodash';
import PropTypes from 'prop-types';
import React, {Component, createRef} from 'react';
import {
    Text, TextInput, View, Platform,
    TouchableOpacity,
    FlatList
} from 'react-native';

import {Col, Row} from "./Custom/Screen";
import {create} from "../defaults";
import {value} from "../helpers/Style";
import {BuilderFont} from "../helpers/Style";




const CODE_TYPE_UNDERLINE = 0,
    CODE_TYPE_BOX = 1,
    CODE_TYPE_CIRCLE = 2;

class CodeInput extends Component {
    static propTypes = {
        codeOnDevMode: PropTypes.string,
        error: PropTypes.string,

        codeLength: PropTypes.number,

        onChange: PropTypes.func.isRequired,

        clearErrorHandle: PropTypes.func.isRequired,
        disableNextButton: PropTypes.func
    };

    static defaultProps = {
        codeOnDevMode: '',
        error: '',
        onChange: null,

        border: {
            type: CODE_TYPE_UNDERLINE,
            color: {
                normal: 'rgba(38, 38, 40, 0.1)',
                error: 'rgba(38, 38, 40, 0.1)'
            },
            width: 2,
            space: 16
        },

        code: {
            len: 6,
            color: {
                normal: '#262628',
                error: '#ff4e64'
            },
            height: 32
        },

        clearErrorHandle: null,
        disableNextButton: null,
        style: {}
    };

    constructor(props) {
        super(props);
        this.state = {
            codeOnDevMode: '',
            code: ''
        };
        this.input = createRef();

        this.cache = {
            styles: create({
                code: this._getCodeStyle(),
                border: this._getBorderStyle(),
            })
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.codeOnDevMode !== nextProps.codeOnDevMode) {
            console.log('getDerivedStateFromProps:');
            return {
                codeOnDevMode: nextProps.codeOnDevMode,
                code: nextProps.codeOnDevMode,
            }
        }
        return null;
    }

    // componentWillReceiveProps(next) {
    //     if (IS_DEV && this.props.codeOnDevMode !== next.codeOnDevMode) {
    //         this.setState({
    //             code: next.showDevModeValue
    //         }, this.checkCode)
    //     }
    // }

    checkCode = () => {
        this.props.onChange && this.props.onChange(this.state.code.substring(0, this.props.code.len));
    };

    activeKeyboard = () => {
        this.input.current.focus();
    };

    renderHiddenInput = () => <TextInput
        underlineColorAndroid={'transparent'}
        autoCapitalize={'none'}
        autoCorrect={false}
        keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
        style={{height: 0, margin: 0, padding: 0}}
        onChangeText={text => {
            let code = text;
            if (this.props.error) {


                if (text.length === this.props.code.len + 1) {
                    code = text.slice(-1);
                }
                this.props.clearErrorHandle && this.props.clearErrorHandle();
            }

            if (!this.props.error && this.state.code.length === this.props.code.len && this.state.code.length > code.length) {
                console.log('disable NEXT button');
                this.props.disableNextButton && this.props.disableNextButton();
            }

            console.log('>>>', code, this.props.error);

            this.setState({code}, () => {
                if (code.length === this.props.code.len) {
                    this.checkCode();
                }
            });
        }}
        value={this.state.code}
        maxLength={this.props.error ? this.props.code.len + 1 : this.props.code.len}
        caretHidden={true}
        autoFocus={true}
        ref={this.input}
    />;


    _getBorderStyle = () => {
        const {
            type,
            width,
            space,
            color
        } = this.props.border;

        switch (type) {
            case CODE_TYPE_UNDERLINE:
                return {
                    borderBottomColor: this.props.error ? color.error : color.normal,
                    borderBottomWidth: value(width),
                    marginHorizontal: value(Math.round(space / 2)),
                    paddingBottom: value(5),
                    alignItems: 'center'
                };
                break;


        }
    };

    _getCodeStyle = () => {
        const {
            height,
            color
        } = this.props.code;

        switch (this.props.border.type) {
            case CODE_TYPE_UNDERLINE:
                return {
                    width: value(height),
                    height: value(height),
                    textAlign: 'center',
                    lineHeight: value(height),
                    ...BuilderFont
                        .size(height)
                        .color(this.props.error ? color.error : color.normal)
                        .get,
                };
                break;


        }
    };

    renderCode = () => {
        let code = this.state.code.length > this.props.code.len
            ? this.state.code.substring(0, this.props.code.len - 1).split('')
            : this.state.code.split('');

        code = _.map(code, item => ({text: item}));
        if (code.length < this.props.code.len) {
            for (; code.length < this.props.code.len;) {
                code.push({text: ''});
            }
        }

        return <Row style={this.props.style}>
            <Col style={[styles.wrapCodeItems, {flex: 1}]}>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    scrollEnabled={false}
                    data={code}
                    renderItem={({item}) => {
                        return <View style={this.cache.styles.border}>
                            <Text
                                style={[
                                    this.cache.styles.code,
                                    {color: this.props.error ? this.props.code.color.error : this.props.code.color.normal}
                                ]}
                            >
                                {item.text}
                            </Text>
                        </View>
                    }}
                    keyExtractor={(item, index) => index.toString()}
                    extraData={code}
                />
            </Col>
        </Row>
    };

    render() {
        const {
            error,
        } = this.props;

        return <View style={{alignItems: 'center'}}>
            <TouchableOpacity activeOpacity={1} style={styles.transparent} onPress={this.activeKeyboard}/>
            {this.renderHiddenInput()}
            {this.renderCode()}
            {error ? <Text style={[styles.error, {marginTop: value(10)}]}>{error}</Text> : null}
        </View>
    }
}

CodeInput.defineStyles = {};

CodeInput.codeTypes = {
    underline: CODE_TYPE_UNDERLINE,
    box: CODE_TYPE_BOX,
    circle: CODE_TYPE_CIRCLE
};

const styles = create({
    wrapCodeItems: {
        alignItems: 'center',
        justifyContent: 'center'
    },

    codeError: {
        color: 'red',
    },

    error: {
        ...BuilderFont.size(10).color('red').get,
    },

    transparent: {
        // backgroundColor: '#ff6310',
        position: 'absolute',
        opacity: 0,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 1
    }
});

export {CodeInput}