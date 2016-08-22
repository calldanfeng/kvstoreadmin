define(['jquery', 'knockout', 'text!templates/drop-down.html'], function ($, ko, dropDownTemplate) {

    ko.components.register('DropDown', {
        viewModel: {
            createViewModel: function (params, componentInfo) {
                var model = {};

                model.options = ko.pureComputed(function () {
                    var inputOptions = ko.unwrap(params.options),
                        kvOptions = [];
                    if (Array.isArray(inputOptions)) {
                        kvOptions = inputOptions.map(function (opt) {

                            var optFormatted = null;

                            if (typeof opt === 'object' &&
                                'name' in opt &&
                                'value' in opt) {

                                optFormatted = opt;

                            } else if (typeof opt === 'string') {
                                optFormatted = {
                                    name: opt,
                                    value: opt
                                };

                            } else {
                                throw new TypeError('The options for "DropDown" component must either an array ' +
                                    'of string or an array of objects with "name" and "value" properties.');
                            }

                            return optFormatted;
                        });
                    }
                    return kvOptions;
                });
                model.value = params.value || ko.observable();
                model.loading = params.loading || false;

                var $container = $(componentInfo.element);
                $container.attr('class', 'ui dropdown');
                $container.dropdown({
                    onChange: function (value) {
                        if (ko.isWritableObservable(model.value)) {
                            model.value(value);
                        }
                    }
                });

                var refreshValue = function () {
                    $container.dropdown('set value', ko.unwrap(model.value));
                };
                model.value.subscribe(refreshValue);

                setTimeout(refreshValue, 0);

                var setLoading = function (loading) {
                    $container.closest('.selection')[loading ? 'addClass' : 'removeClass']('loading');
                };
                if (ko.isObservable(model.loading)) {
                    model.loading.subscribe(setLoading);
                }
                setLoading(ko.unwrap(model.loading));

                return model;
            }
        },
        template: dropDownTemplate
    });
});
