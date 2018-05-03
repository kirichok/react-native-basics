import _ from 'lodash';
import Axios from 'axios';
import qs from 'qs';
import configs from '../configs'

class Sender {
    constructor(apiName, defaultSearch = '') {
        this.url = `https://maps.googleapis.com/maps/api/${apiName}/json`;
        this.key = configs.get().GOOGLE_API_KEY;
        this.default = defaultSearch;
    }

    send = async (method, data) => {
        if (!data) {
            data = {};
        }
        data.key = this.key;
        try {
            const result = await Axios({
                method,
                url: this.url + '?' + qs.stringify(data, {format: 'RFC1738'}),
            });

            console.log('GOOGLE API RES: ', this.url + '?' + qs.stringify(data, {format: 'RFC1738'}), result);

            if (result.status === 200 && result.data.status.match('OK|ZERO_RESULTS')) {
                return result.data;
            } else {
                throw result;
            }
        } catch (e) {
            console.log('GOOGLE API ERROR: ', e);
            throw e;
        }
    };

    addDefaultSearch = value => value ? value += ', ' + this.default : '';

    format = data => {
        const address = {
            line1: '',
            line2: '',
            country: '',
            state: '',
            city: '',
            zip: '',
            coordinate: {
                longitude: null,
                latitude: null
            },
            place_id: ''
        };

        if (data.geometry && data.geometry.location) {
            address.coordinate.longitude = data.geometry.location.lng;
            address.coordinate.latitude = data.geometry.location.lat;
        }

        if (data.place_id) {
            address.place_id = data.place_id;
        }

        Array.isArray(data.address_components) && data.address_components.forEach(d => {
            const {
                types,
                long_name
            } = d;

            if (types.indexOf('street_number') > -1) {
                address.line1 = (address.line1 ? ' ' : '') + long_name;
            }
            if (types.indexOf('route') > -1) {
                address.line1 += (address.line1 ? ' ' : '') + long_name;
            }
            if (types.indexOf('country') > -1) {
                address.country = long_name;
            }
            if (types.indexOf('administrative_area_level_1') > -1) {
                address.state = long_name;
            }
            if (types.indexOf('locality') > -1) {
                address.city = long_name;
            }
            if (types.indexOf('sublocality') > -1 && types.indexOf('sublocality_level_1') > -1 && !address.city) {
                address.city = long_name;
            }
            if (types.indexOf('postal_code') > -1) {
                address.zip = long_name;
            }
        });

        return address;
    };
}

class GeoCode extends Sender {
    constructor(defaultSearch = '') {
        super('geocode', defaultSearch);
    }

    async getAddressByCoordinates(lat, lng) {
        try {
            const {data} = await this.send('POST', {
                latlng: lat + ',' + lng
            });
            return data;
        } catch (e) {
            throw e;
        }
    }

    async getFormatedFullAddressByAddress(address) {
        try {
            const {data} = await this.send('POST', {
                address: this.addDefaultSearch(value)
            });
            return _.isArray(data) && data.length ? _.map(data, r => this.format(r)) : false;
        } catch (e) {
            throw e;
        }
    }

    async getFormatedFullAddressByZipAndCountry(zip, country = 'US') {
        try {
            const {data} = await this.send('POST', {
                address: this.addDefaultSearch(zip)
            });

            if (_.isArray(data) && data.length) {
                const address = _.find(data, r => this.format(r).zip === zip);
                return address ? this.format(address) : false;
            }
            return false;
        } catch (e) {
            throw e;
        }
    }
}

class PlaceDetail extends Sender {
    constructor() {
        super('place/detail');
    }

    async getAddress(placeId) {
        try {
            const result = await this.send('POST', {placeId});
            return result.result ? this.format(result.result) : false;
        } catch (e) {
            throw e;
        }
    }
}


class PlaceAutocomplete extends Sender {
    constructor(defaultSearch = '') {
        super('place/autocomplete', defaultSearch);
    }

    prepareData = places => Array.isArray(places.predictions)
        ? _.map(places.predictions, d => ({
            text: d.structured_formatting.main_text,
            subText: d.structured_formatting.secondary_text,
            place_id: d.place_id,
            textMatched: d.structured_formatting.main_text_matched_substrings
        }))
        : [];

    async getPlaces(input) {
        try {
            const places = await this.send('POST', {
                input: this.addDefaultSearch(input),
                types: 'address'
            });
            return this.prepareData(places);
        } catch (e) {
            throw e;
        }
    }
}

class Place {
    constructor(defaultSearch = '') {
        this.autocomplete = new PlaceAutocomplete(defaultSearch);
        this.detail = new PlaceDetail(defaultSearch);
    }

    getPlaces = async input => await this.autocomplete.getPlaces(input);

    getAddress = async placeId => await this.autocomplete.getAddress(placeId);
}

module.exports = {
    GeoCode,
    Place
};
