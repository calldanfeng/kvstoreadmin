define(['jquery', 'knockout',
    'text!templates/combo-box.html'], function ($, ko, comboBoxTemplate) {

    ko.components.register('ComboBox', {
        viewModel: {
            createViewModel: function (params, componentInfo) {
                params || (params = {});

                var model = {};

                model.placeholder = params.placeholder || '';
                model.options = params.options || [];

                var $container = $(componentInfo.element);
                $container.attr('class', 'ui search dropdown');
                $container.dropdown({
                    allowAdditions: true,
                    keepOnScreen: true,
                    match: 'text',
                    regExp: {
                        escape: /[-[\]{}()*+?.,\\^$|#\s]/g,
                    },
                    keys: {
                        backspace: 8,
                        delimiter: false, // comma
                        deleteKey: 46,
                        enter: 13,
                        escape: 27,
                        pageUp: 33,
                        pageDown: 34,
                        leftArrow: 37,
                        upArrow: 38,
                        rightArrow: 39,
                        downArrow: 40
                    },
                    onChange: function (value) {
                        if (ko.isWritableObservable(params.value)) {
                            params.value(value);
                        }
                        if (ko.isWritableObservable(params.textInput)) {
                            params.textInput(value);
                        }
                    }
                });

                if (ko.isWritableObservable(params.textInput)) {
                    $container.siblings('.search').on('input', function (e) {
                        params.textInput($(this).val());

                    });
                }

                var refreshValue = function () {
                    $container.parent().dropdown('set selected', ko.unwrap(params.value));
                };

                if (ko.isObservable(params.value)) {
                    params.value.subscribe(refreshValue);
                }

                setTimeout(refreshValue, 0);

                return model;
            }
        },
        template: comboBoxTemplate
    });
});
