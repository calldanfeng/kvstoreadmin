define(['jquery', 'knockout', 'underscore',
    'text!templates/checklist-filter.html'], function ($, ko, _, checklistFilterTemplate) {

    var modelIndex = 0;

    ko.components.register('ChecklistFilter', {

        viewModel: {
            createViewModel: function (params, componentInfo) {
                modelIndex++;

                var model = {
                    filter: ko.observable(''),
                    selectedExpanded: ko.observable(true),
                    candidateExpanded: ko.observable(true),
                    selected: params.selected || ko.observableArray(),
                    all: params.all || ko.observableArray(),
                    displayAttr: params.displayAttr,
                    modelIndex: modelIndex,
                    title: params.title
                };

                model.candidates = ko.pureComputed(function () {
                    return _.difference(model.all(), model.selected()).filter(function (item) {
                        return item && item[model.displayAttr].toLowerCase().indexOf(model.filter().toLowerCase()) >= 0;
                    });
                });

                model.filter.extend({rateLimit: {method: "notifyWhenChangesStop", timeout: 200}});

                model.candidateChecked = function (data, event) {
                    model.selected.push(data);
                };

                model.deselect = function (data, event) {
                    model.selected.remove(data);
                };

                model.deselectAll = function () {
                    if (model.selected().length === 0) {
                        model.selected(model.selected().concat(model.candidates()));
                    } else {
                        model.selected.removeAll();
                    }

                };

                model.selectAll = function () {
                    if (model.selected().length === model.all().length) {
                        model.selected.removeAll();
                    } else {
                        model.selected(model.selected().concat(model.candidates()));
                    }
                };

                model.highlight = function (item) {
                    var filter = model.filter();
                    var str = item[model.displayAttr];
                    var highlightStart = str.toLowerCase().indexOf(filter.toLowerCase());
                    return {
                        start: str.substr(0, highlightStart),
                        mid: str.substr(highlightStart, filter.length),
                        end: str.substr(highlightStart + filter.length)
                    };
                };

                var $container = $(componentInfo.element);
                var $popup = $container.find('.ui.popup');

                model.popup = function (data, event) {
                    var $button = $(event.currentTarget);
                    $button.popup({
                        target: $button,
                        popup: $popup,
                        on: 'click',
                        closable: true,
                        inline: false,
                        position: 'bottom center',
                        prefer: null,
                        duration: 0,
                        lastResort: true,
                        movePopup: false,
                        delay: {
                            show: 0,
                            hide: 0
                        },
                        onHidden: function () {
                            if(typeof params.onHidden === 'function') {
                                params.onHidden();
                            }
                        }
                    }).popup('show');
                };

                return model;
            }
        },

        template: checklistFilterTemplate
    });

});
