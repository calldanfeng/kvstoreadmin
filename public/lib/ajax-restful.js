'use strict';

define(['jquery'], function ($) {
    return {
        /**
         * Support rest style ajax call. It's almost the same as jQuery.ajax except
         * it supports a pathParams config which will replace the path param place holders in the url.
         * And the replaced params will be url encoded.
         * @example
         * <pre>
         * <code>
         * rest.ajax({
         *     url: 'fetch/:foo/:bar/5',
         *     pathParams: {
         *         foo: 'mailing',
         *         bar: 'inbox'
         *     }
         * });
         * </code>
         * </pre>
         * The actual url will be replaced as:
         * 'fetch/mailing/inbox/5'
         * @param config config for jQuery.ajax, with pathParams supported
         * @returns {object} jquery deferred object
         */
        ajax: function (config) {

            var urlParsed = config.url;
            if (config.pathParams) {
                for (var paramName in config.pathParams) {
                    if (config.pathParams.hasOwnProperty(paramName)) {
                        var paramVal = config.pathParams[paramName];
                        if (typeof paramVal === 'object') {
                            paramVal = JSON.stringify(paramVal);
                        }
                        urlParsed = urlParsed.replace(':' + paramName, encodeURIComponent(paramVal))
                    }
                }
            }

            var configCopy = $.extend({}, config);
            configCopy.url = urlParsed;
            configCopy.dataType = config.dataType || 'json';
            configCopy.contentType = config.configCopy || 'application/json';

            if (config.methodAs) {
                configCopy.headers || (configCopy.headers = {});
                configCopy.headers['X-HTTP-Method-Override'] = config.methodAs;
            }

            return $.ajax(configCopy);
        }
    };
});
