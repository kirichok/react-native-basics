import * as defaults from "../defaults";
import {info} from "./Device";
import {value} from "./Style";

export class Builder {
    constructor() {
        this.value = {};
    }

    get get() {
        return this.value;
    }

    _isFunction(handle) {
        if (typeof handle !== 'function') {
            throw new Error('Handle must be a type of function');
        }
    }
}

/**
 * Builder for component props
 **/
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

/**
 * Style builder for components
 * */
export class BuilderStyles {
    constructor() {
        this.styles = {};
    }

    font(handle) {
        if (typeof handle !== 'function') {
            throw new Error('Handle must be a type of function');
        }
        this.styles.font = handle(new BuilderFont());
        return this;
    }

    get get() {
        return this.styles;
    }

    _isFunction(handle) {
        if (typeof handle !== 'function') {
            throw new Error('Handle must be a type of function');
        }
    }
}

/**
 * Build font styles
 * Note: at the end need call get.
 *
 * Examples:
 * font.xl.bold.get return for iOS:
 * {
 *      fontFamily: 'System',
 *      fontSize: 40,
 *      fontWeight: 'bold'
 * }
 *
 * font.get return for iOS (gets default):
 * {
 *      fontFamily: 'System'
 * }
 * */

export class BuilderFont {
    constructor() {
        this.font = {
            fontFamily: info.isIOS ? defaults.font.name.ios : defaults.font.name.android
        };
    }

    get sm() {
        return this.size(defaults.font.size.sm);
    }

    get md() {
        return this.size(defaults.font.size.md);
    }

    get lg() {
        return this.size(defaults.font.size.lg);
    }

    get xl() {
        return this.size(defaults.font.size.xl);
    }

    get bold() {
        return this.weight('bold');
    }

    get underline() {
        return this.textDecorationLine('underline');
    }

    size(size) {
        this.font.fontSize = value(size);
        return this;
    }

    weight(weight) {
        this.font.fontWeight = weight;
        return this;
    }

    color(color) {
        this.font.color = color;
        return this;
    }

    spacing(value) {
        this.font.letterSpacing = value;
        return this;
    }

    family(value) {
        this.font.fontFamily = value;
        return this;
    }

    textDecorationLine(value) {
        this.font.textDecorationLine = value;
        return this;
    }

    lineHeight(value) {
        this.font.lineHeight = value;
        return this;
    }

    get get() {
        return this.font;
    }
}
