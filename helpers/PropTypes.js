import PropTypes from 'prop-types';
import {fontStyles} from "./Style";

/**
 * Defined own pairs of PropTypes
 **/
export default {
    objectOrNumber: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.number,
    ]),
    objectOrNumberOrArray: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.number,
        PropTypes.array,
    ]),
    numberOrString: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]),
};

export class BuilderProps {
    constructor(StyleBuilder) {
        this.props = {};
        this.StyleBuilder = StyleBuilder;
    }

    get flex() {
        this.props.flex = true;
        return this;
    }

    disable(value) {
        this.props.disabled = value;
        return this;
    }

    get disabled() {
        return this.disable(true);
    }

    onPress(handle) {
        return this._applyHandle('onPress', handle);
    }

    style(handle) {
        if (!this.StyleBuilder) {
            throw new Error('Style builder is not defined');
        }
        this._isFunction(handle);
        this.props.style = handle(new this.StyleBuilder());
        return this;
    }

    get get() {
        return this.props;
    }

    _applyHandle(prop, handle) {
        this._isFunction(handle);
        this.props[prop] = handle;
        return this;
    }

    _isFunction(handle) {
        if (typeof handle !== 'function') {
            throw new Error('Handle must be a type of function');
        }
    }
}


export class PropsBuilder {
    constructor(styleBuilder) {
        this.props = {};
        this.styleBuilder = styleBuilder;
    }

    get flex() {
        this.props.flex = true;
        return this;
    }

    onPress(handle) {
        if (typeof handle !== 'function') {
            throw new Error('Handle must be a type of function');
        }
        this.props.onPress = handle;
        return this;
    }

    get disabled() {
        this.props.disabled = true;
        return this;
    }

    radius(value) {
        this.props.radius = value;
        return this;
    }

    opacity(value) {
        this.props.activeOpacity = value;
        return this;
    }

    height(value) {
        this.props.height = value;
        return this;
    }

    style(handle) {
        if (!this.styleBuilder) {
            throw new Error('Style builder is not defined');
        }
        if (typeof handle !== 'function') {
            throw new Error('Handle must be a type of function');
        }
        this.props.style = handle(new this.styleBuilder());
        return this;
    }

    text(text) {
        this.props.text = text;
        return this;
    }

    get get() {
        return this.props;
    }
}