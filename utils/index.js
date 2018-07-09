import _ from 'lodash';

export async function to(promise, resolveHandle, rejectHandle) {
    try {
        const result = await promise;
        return _.isFunction(resolveHandle) ? resolveHandle(result) : result;
    } catch (error) {
        return _.isFunction(rejectHandle) ? rejectHandle(error) : error;
    }
}

export async function toAPI(promise) {
    return await to(promise,
        resolve => {
            const {
                status,
                data
            } = resolve;

            return {
                status,
                data
            }
        },
        reject => {
            if (!reject.response) {
                throw {
                    status: 0,
                    message: reject.message,
                    error: reject.message
                }
            }

            const {
                statusCode = 500,
                message = '',
                error = 'Unknown error'
            } = reject.response.data;

            console.log('--- TO API:', reject.response);

            throw {
                status: statusCode,
                message,
                error
            };
        });
}

export function prepareFormData(data, iterate = null) {
    const formData = new FormData();
    _.each(data, (value, key) => {
        formData.append(key, _.isFunction(iterate) ? iterate(key, value) : value);
    });
    return formData;
}
