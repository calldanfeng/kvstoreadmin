define([], function () {
    var STORE_VERSION = '1.0.1';

    var store = {};

    function getKeyString(key) {
        return typeof key === 'string' ? key : JSON.stringify(key);
    }

    store.put = function (key, value, maxAge, version) {
        if (!value) {
            store.remove(key);
        } else {
            var keyStr = getKeyString(key),
                storeObj = {
                    value: value,
                    version: version || STORE_VERSION
                };

            if (typeof maxAge === 'number' && maxAge > 0) {
                storeObj.created = new Date().getTime();
                storeObj.maxAge = maxAge;
            }

            localStorage[keyStr] = JSON.stringify(storeObj);
        }
    };

    store.get = function (key, version) {
        var keyStr = getKeyString(key);
        var storeObjStr = localStorage[keyStr];
        if (!storeObjStr) {
            return null;
        }

        var storeObj = JSON.parse(storeObjStr);
        if (!storeObj.value) {
            return null;
        }

        if (storeObj.version !== (version || STORE_VERSION)) {
            return null;
        }

        if (storeObj.maxAge && storeObj.created) {
            var ts = new Date().getTime();
            if (ts - storeObj.created > storeObj.maxAge * 1000) {
                store.remove(keyStr);
                return null;
            }
        }

        return storeObj.value;
    };

    store.remove = function (key) {
        var keyStr = getKeyString(key);
        localStorage.removeItem(keyStr);
    };

    return store;
});
