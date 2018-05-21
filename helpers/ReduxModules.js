import Axios from 'axios';
import qs from 'qs';

import {createAction} from 'redux-actions';
import {toAPI} from '../utils';
import configs from '../configs'

export {createAction};

const PENDING = new RegExp('.pending', 'gi'),
    FULFILLED = new RegExp('.fulfilled', 'gi'),
    REJECTED = new RegExp('.rejected', 'gi');

const CLEAR_ERROR = 'CLEAR_ERROR';

class Module {
    constructor(url, state) {
        this.name = this.constructor.name;
        this.nameRegExp = new RegExp(`^${this.name}.`, 'gi');
        this.url = configs.get().SERVER_API + url;
        // TODO: Where JWT need save?
        this.jwt = '';
        this.initalState = {
            loading: false,
            error: null,
            ...state
        };
        this.ACTIONS = {};
        this.HANDLERS = {};
        this.createActions();
    }

    createActions() {
        this.initAction(CLEAR_ERROR, () => {});
    };

    initAction = (name, handle) => {
        this.ACTIONS[name.toUpperCase()] = `${this.name}/${name.toUpperCase()}`;
        this.HANDLERS[name.toUpperCase()] = handle;
        this[name.toUpperCase()] = createAction(this.ACTIONS[name.toUpperCase()], handle);
    };

    async getJWT() {
        return false
    };

    send = async (method, path, data = {}, additionalHeaders = {}) => {
        const isFormData = data && data instanceof FormData,
            headers = {
                'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
                ...additionalHeaders
            };

        let jwt = await this.getJWT();
        if (jwt) {
            headers['AUTHORIZATION'] = 'Bearer ' + jwt;
        }

        console.log('API:', {
            method,
            headers,
            url: this.url + path,

            params: method === 'GET' ? (data ? data : undefined) : undefined,
            data: method !== 'GET' ? (isFormData ? data : JSON.stringify(data)) : undefined,

            paramsSerializer: function (params) {
                return qs.stringify(params);
            },
        });

        return await toAPI(Axios({
            method,
            headers,
            url: this.url + path,

            params: method === 'GET' ? (data ? data : undefined) : undefined,
            data: method !== 'GET' ? (isFormData ? data : JSON.stringify(data)) : undefined,

            paramsSerializer: function (params) {
                return qs.stringify(params);
            },
        }));
    };

    clearError = () => {
        return this[CLEAR_ERROR]();
    };

    onPending(state, type, payload) {
        return {};
    }

    onFulfilled(state, type, payload) {
        return {};
    }

    onRejected(state, type, payload) {
        return {};
    }

    onNotAsync(state, type, payload) {
        return {};
    }

    getReducer = (state = this.initalState, {type = '', payload = null}) => {
        if (type.split('/')[0] === this.name) {
            switch (true) {
                case type.match(FULFILLED) !== null:
                    return {
                        ...state,
                        ...this.onFulfilled(state, type.replace(FULFILLED, '').replace(this.nameRegExp, ''), payload),
                        loading: false,
                        error: false
                    };

                case type.match(PENDING) !== null:
                    return {
                        ...state,
                        ...this.onPending(state, type.replace(PENDING, '').replace(this.nameRegExp, ''), payload),
                        loading: true,
                        error: false
                    };

                case type.match(REJECTED) !== null:
                    console.log('REJECTED', payload);
                    return {
                        ...state,
                        ...this.onRejected(state, type.replace(REJECTED, '').replace(this.nameRegExp, ''), payload),
                        loading: false,
                        error: payload
                    };

                default:
                    // console.error('NOT ASYNC ACTION: ', type, payload);
                    return {
                        ...state,
                        loading: false,
                        error: false,
                        ...this.onNotAsync(state, type.replace(REJECTED, '').replace(this.nameRegExp, ''), payload),
                    };
            }
        }
        return state;
    }
}

class CrudModule extends Module {
    constructor(url, state) {
        super(url, state);

        this.ACTIONS = {
            GET: `${this.name}/get`,
            POST: `${this.name}/post`,
            PUT: `${this.name}/put`,
            DELETE: `${this.name}/delete`,
        };
    }

    createActions = () => {
        super.createActions();

        this.GET = createAction(this.ACTIONS.GET, async (data) => await this.send('GET', '', data));
        this.POST = createAction(this.ACTIONS.POST, async (data) => await this.send('POST', '', data));
        this.PUT = createAction(this.ACTIONS.PUT, async (data) => await this.send('PUT', '', data));
        this.DELETE = createAction(this.ACTIONS.DELETE, async (data) => await this.send('DELETE', '', data));

        /*this.GET = data => async (dispatch, getState) => {
            dispatch({
                type: `${this.name}/get`,
                payload: await this.send('GET', data)
            });
        };*/
    }
}

module.exports = {
    Module,
    CrudModule
};
