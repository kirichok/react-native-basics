
/**
 * Wait for end time (Async)
**/
export function wait(value = 100) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, value);
    })
}