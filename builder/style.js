import {StyleSheet, Platform} from 'react-native';
import {dimensions, info} from "../helpers/Device";
import {defFont} from '../defaults'

/**
 * Create cached styles
 * */
const baseStyles = {
    container: {}
};

export function create(overrides = {}) {
    return StyleSheet.create({...baseStyles, ...overrides});
}

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

const defaults = {
    fontFamily: info.isIOS
        ? 'System'
        : 'sans-serif',
    fontSize: value(defFont.size.default),
    fontWeight: 'normal',
    color: defFont.color.default
};

export const font = {
    _value: {...defaults},

    get sm() {
        return this.size(defFont.size.sm);
    },

    get md() {
        return this.size(defFont.size.md);
    },

    get lg() {
        return this.size(defFont.size.lg);
    },

    get xl() {
        return this.size(defFont.size.xl);
    },

    get bold() {
        return this.weight('bold');
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

    get get() {
        const res = {...this._value};
        this._value = this.def();
        return res;
    },

    def() {
        return {...defaults}
    }
};