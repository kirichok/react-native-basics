const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PHONE_REGEX = /^[+\(]*[0-9]{1,3}[-\s\.\(]{0,2}[0-9]{1,3}[)\s\-]{0,1}[-\s\./0-9]{7,10}$/;

export function isEmail(email) {
    return EMAIL_REGEX.test(email);
}

export function isPhoneNumber(phone) {
    return PHONE_REGEX.test(phone);
}