import _ from 'lodash';

const cardTypes = [
    {
        name: 'American Express',
        codes: [34, 37]
    }, {
        name: 'China UnionPay',
        codes: [62, 88]
    }, {
        name: 'Diners ClubCarte Blanche',
        ranges: [[300, 305]]
    }, {
        name: 'Diners Club International',
        codes: [309, 36],
        ranges: [[300, 305], [38, 39]]
    }, {
        name: 'Diners Club US & Canada',
        codes: [54, 55]
    }, {
        name: 'Discover Card',
        codes: [6011, 65],
        ranges: [[622126, 622925], [644, 649]]
    }, {
        name: 'JCB',
        ranges: [[3528, 3589]]
    }, {
        name: 'Laser',
        codes: [6304, 6706, 6771, 6709]
    }, {
        name: 'Maestro',
        codes: [5018, 5020, 5038, 5612, 5893, 6304, 6759, 6761, 6762, 6763, '0604', 6390]
    }, {
        name: 'Dankort',
        codes: [5019]
    }, {
        name: 'MasterCard',
        ranges: [[50, 55]]
    }, {
        name: 'Visa',
        codes: [4]
    }, {
        name: 'Visa Electron',
        codes: [4026, 417500, 4405, 4508, 4844, 4913, 4917]
    }
];

const cardMatrix = initMatrix();

function initMatrix() {
    return cardTypes.reduce((res, ct, i) => {
        ct.codes && ct.codes.reduce(reducer(i), res);
        ct.ranges && ct.ranges.forEach(range => (_.range(range[0], range[1] + 1)).reduce(reducer(i), res), res);
        return res;
    }, {});

    function reducer(index) {
        return function (accumulator, code) {
            const len = code.toString().length;
            if (!accumulator[len]) {
                accumulator[len] = {}
            }
            accumulator[len][code] = index;
            return accumulator;
        }
    }
}

export function getCardType(number) {
    let len = number.length;

    if (len > 6) {
        len = 6;
    }

    for (; len > 0; len--) {
        if (!cardMatrix[len]) {
            continue
        }
        const type = cardMatrix[len][number.substring(0, len)];
        if (type !== undefined) {
            return cardTypes[type];
        }
    }
}
