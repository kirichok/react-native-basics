const assets = {};

export function registerAsset(name, source) {
    if (assets[name]) {
        throw new Error(`Image name "${name}" is already in use`);
    }
    assets[name] = source;
}

export function getAssetByName(name) {
    if (!assets[name]) {
        throw new Error('Image name is not found in set');
    }
    return assets[name];
}