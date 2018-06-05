import _ from 'lodash';

const CARD_AMERICAN_EXPRESS = 1,
    CARD_CHINA_UNION_PAY = 2,
    CARD_DINERS_CLUB_CARTE_BLANCHE = 3,
    CARD_DINERS_CLUB_INTERNATIONAL = 4,
    CARD_DINERS_CLUB_US_AND_CANADA = 5,
    CARD_DISCOVER_CARD = 6,
    CARD_JBS = 7,
    CARD_LASER = 8,
    CARD_MAESTRO = 9,
    CARD_DANKORT = 10,
    CARD_MASTERCARD = 11,
    CARD_VISA = 12,
    CARD_VISA_ELECTRON = 13;

const cards = [
    {
        name: 'American Express',
        type: CARD_AMERICAN_EXPRESS,
        codes: [34, 37]
    }, {
        name: 'China UnionPay',
        type: CARD_CHINA_UNION_PAY,
        codes: [62, 88]
    }, {
        name: 'Diners ClubCarte Blanche',
        type: CARD_DINERS_CLUB_CARTE_BLANCHE,
        ranges: [[300, 305]]
    }, {
        name: 'Diners Club International',
        type: CARD_DINERS_CLUB_INTERNATIONAL,
        codes: [309, 36],
        ranges: [[300, 305], [38, 39]]
    }, {
        name: 'Diners Club US & Canada',
        type: CARD_DINERS_CLUB_US_AND_CANADA,
        codes: [54, 55]
    }, {
        name: 'Discover Card',
        type: CARD_DISCOVER_CARD,
        codes: [6011, 65],
        ranges: [[622126, 622925], [644, 649]]
    }, {
        name: 'JCB',
        type: CARD_JBS,
        ranges: [[3528, 3589]]
    }, {
        name: 'Laser',
        type: CARD_LASER,
        codes: [6304, 6706, 6771, 6709]
    }, {
        name: 'Maestro',
        type: CARD_MAESTRO,
        codes: [5018, 5020, 5038, 5612, 5893, 6304, 6759, 6761, 6762, 6763, '0604', 6390]
    }, {
        name: 'Dankort',
        type: CARD_DANKORT,
        codes: [5019]
    }, {
        name: 'MasterCard',
        type: CARD_MASTERCARD,
        ranges: [[50, 55]]
    }, {
        name: 'Visa',
        type: CARD_VISA,
        codes: [4]
    }, {
        name: 'Visa Electron',
        type: CARD_VISA_ELECTRON,
        codes: [4026, 417500, 4405, 4508, 4844, 4913, 4917]
    }
];

export const cardTypes = {
    CARD_AMERICAN_EXPRESS,
    CARD_CHINA_UNION_PAY,
    CARD_DINERS_CLUB_CARTE_BLANCHE,
    CARD_DINERS_CLUB_INTERNATIONAL,
    CARD_DINERS_CLUB_US_AND_CANADA,
    CARD_DISCOVER_CARD,
    CARD_JBS,
    CARD_LASER,
    CARD_MAESTRO,
    CARD_DANKORT,
    CARD_MASTERCARD,
    CARD_VISA,
    CARD_VISA_ELECTRON
};

const cardMatrix = initMatrix();

function initMatrix() {
    return cards.reduce((res, ct, i) => {
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
            return cards[type];
        }
    }
}
