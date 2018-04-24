import _ from 'lodash';
import Axios from 'axios';
import qs from 'qs';
import configs from '../configs'

class Sender {
    constructor(apiName) {
        this.url = `https://maps.googleapis.com/maps/api/${apiName}/json`;
        this.key = configs.get().GOOGLE_API_KEY;
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
                return result.data.results;
            } else {
                throw result;
            }
        } catch (e) {
            console.log('GOOGLE API ERROR: ', e);
            throw e;
        }
    };

    format = data => {
        const address = {
            address_line1: '',
            address_line2: '',
            address_country: '',
            address_state: '',
            address_city: '',
            address_zip: '',
            address_coordinate: {
                longitude: null,
                latitude: null
            },
            place_id: ''
        };

        if (data.geometry && data.geometry.location) {
            address.address_coordinate.longitude = data.geometry.location.lng;
            address.address_coordinate.latitude = data.geometry.location.lat;
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
                address.address_line1 = (address.address_line1 ? ' ' : '') + long_name;
            }
            if (types.indexOf('route') > -1) {
                address.address_line1 += (address.address_line1 ? ' ' : '') + long_name;
            }
            if (types.indexOf('country') > -1) {
                address.address_country = long_name;
            }
            if (types.indexOf('administrative_area_level_1') > -1) {
                address.address_state = long_name;
            }
            if (types.indexOf('locality') > -1) {
                address.address_city = long_name;
            }
            if (types.indexOf('sublocality') > -1 && types.indexOf('sublocality_level_1') > -1 && !address.address_city) {
                address.address_city = long_name;
            }
            if (types.indexOf('postal_code') > -1) {
                address.address_zip = long_name;
            }
        });

        return address;
    };
}

class GeoCode extends Sender {
    constructor() {
        super('geocode');
    }

    async getAddressByCoordinates(lat, lng) {
        try {
            return await this.send('POST', {
                latlng: lat + ',' + lng
            });
        } catch (e) {
            throw e;
        }
    }

    async getFormatedFullAddressByAddress(address) {
        try {
            const result = await this.send('POST', {
                address
            });
            return this.format(_.isArray(result) && result.length ? result[0] : {});
        } catch (e) {
            throw e;
        }
    }
}

module.exports = {
    GeoCode
};
