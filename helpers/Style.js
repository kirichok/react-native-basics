import _ from 'lodash';
import {dimensions, info} from "./Device";
import * as defaults from '../defaults';

/**
 * Stretch values based on window size
 */
const CONST_WIDTH = 375;
const DELTA = dimensions.width / CONST_WIDTH;
const calcSize = size => Math.round(DELTA * size);
const values = {};

export const value = (v) => {
    if (typeof v !== 'number') {
        return 0;
    }
    if (!_.has(values, v)) {
        values[v] = info.isPhone ? calcSize(v) : v;
    }
    return values[v];
};

/**
 * Getting styles from props for combined component
 * */
export function getStyles(defaults, props, fields) {
    if (_.isArray(fields)) {
        return _.map(fields, field => getField(defaults, props, field));
    } else if (_.isString(fields)) {
        return getField(defaults, props, fields);
    } else {
        throw new Error('Wrong arguments for getting styles');
    }
}

/**
 * Merge default & custom styles
 * */
function getField(defaults, props, field) {
    return _.has(props, field)
        ? [defaults[field], props[field]]
        : defaults[field]
}

/**
 * Style builder for components
 * */
export class BuilderStyle {
    constructor() {
        this.styles = {};
    }

    get get() {
        return this.styles;
    }
}

/**
 * Get font.
 * Note: at the end need call get.
 *
 * Examples:
 * font.xl.bold.get return for iOS:
 * {
 *      fontFamily: 'System',
 *      fontSize: 40,
 *      fontWeight: 'bold',
 *      color: '#4a4a4a'
 * }
 *
 * font.get return for iOS (gets default):
 * {
 *      fontFamily: 'System',
 *      fontSize: 16,
 *      fontWeight: 'normal',
 *      color: '#4a4a4a'
 * }
 * */

const _value = {
    fontFamily: info.isIOS ? defaults.font.name.ios : defaults.font.name.android,
    fontSize: value(defaults.font.size.default),
    fontWeight: 'normal',
    color: defaults.font.color.default
};

export const BuilderFont = {
    _value: {..._value},
    get sm() {
        return this.size(defaults.font.size.sm);
    },
    get md() {
        return this.size(defaults.font.size.md);
    },
    get lg() {
        return this.size(defaults.font.size.lg);
    },
    get xl() {
        return this.size(defaults.font.size.xl);
    },
    get bold() {
        return this.weight('bold');
    },
    get underline() {
        return this.textDecorationLine('underline');
    },
    size(size) {
        this._value.fontSize = value(size);
        return this;
    },
    weight(weight) {
        this._value.fontWeight = weight;
        return this;
    },
    color(color) {
        this._value.color = color;
        return this;
    },
    spacing(value) {
        this._value.letterSpacing = value;
        return this;
    },
    family(value) {
        this._value.fontFamily = value;
        return this;
    },
    textDecorationLine(value) {
        this._value.textDecorationLine = value;
        return this;
    },
    lineHeight(value) {
        this._value.lineHeight= value;
        return this;
    },
    get get() {
        const res = {...this._value};
        this._value = {..._value};
        return res;
    }
};