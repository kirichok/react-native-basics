import PropTypes from 'prop-types';

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