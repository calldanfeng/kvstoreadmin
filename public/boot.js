requirejs.config({
    "baseUrl": "",
    "paths": {
        "jquery": "components/jquery/dist/jquery.min",
        "jqueryui": "components/jquery-ui/jquery-ui.min",
        'promise': 'components/promise-polyfill/promise.min',
        "underscore": "components/underscore/underscore-min",
        "knockout": "components/knockout/dist/knockout",
        "komapping" :"components/knockout-mapping/build/output/knockout.mapping-latest",
        'text': 'components/text/text',
        "semantic": "components/semantic/dist/semantic.min",
        'rest': 'lib/ajax-restful',
        'store': 'lib/browser-local-store'
    },
    "shim": {
        "semantic": ["jquery"],
        "jqueryui": ["jquery"],
        'promise': {
            exports: 'Promise'
        }
    }
});

require(['app']);
