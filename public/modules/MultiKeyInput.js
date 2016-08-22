define(['jquery', 'knockout',
    'text!templates/multi-key-input.html'], function ($, ko, multiKeyInputTemplate) {

    ko.components.register('MultiKeyInput', {
        viewModel: {
            createViewModel: function (params, componentInfo) {
                params || (params = {});

                var model = {};

                model.placeholder = params.placeholder || 'Input Keys...';
                model.options = params.options || [];
                model.loading = params.loading || false;
                model.selected = params.selected || ko.observableArray();

                var $dropdown = $(componentInfo.element);
                $dropdown.addClass('ui fluid search dropdown');
                $dropdown.attr('multiple', 'multiple');
                $dropdown.dropdown({
                    allowAdditions: true,
                    hideAdditions: false,
                    keepOnScreen: true,
                    match: 'text',
                    maxSelections: 20,
                    regExp: {
                        escape: /[-[\]{}()*+?.,\\^$|#\s]/g
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
                    fullTextSearch: "exact",
                    selectOnKeydown: false,
                    placeholder: model.placeholder,
                    forceSelection: true,
                    onChange: function (values) {
                        if (ko.isWritableObservable(model.selected)) {
                            model.selected(values);
                        }
                    },
                    onRemove: function (item) {
                        model.selected.remove(item);
                    }
                });

                $dropdown.siblings('.search').on('paste', function (e) {
                    var pastedText = e.originalEvent.clipboardData.getData('text/plain');
                    e.preventDefault();
                    var keys = pastedText.split('\n');
                    var cleanedKeys = [];
                    keys.forEach(function (key) {
                        if (typeof key === 'string' && key.trim()) {
                            cleanedKeys.push(key.trim());
                        }
                    });
                    $dropdown.parent().dropdown('set selected', cleanedKeys);
                });

                $dropdown.dropdown('clear');

                var setLoading = function (loading) {
                    $dropdown.closest('.selection')[loading ? 'addClass' : 'removeClass']('loading');
                };
                if (ko.isObservable(model.loading)) {
                    model.loading.subscribe(setLoading);
                }
                setLoading(ko.unwrap(model.loading));

                return model;
            }
        },
        template: multiKeyInputTemplate
    });
});
