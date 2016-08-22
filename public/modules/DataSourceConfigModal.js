define(['jquery', 'knockout', 'komapping',
    'rest',
    'modules/util',
    'text!templates/data-source-config-modal.html',
    'modules/DropDown',
    'modules/Message'], function ($, ko, komapping, rest, util, dataSourceConfigModalTemplate) {

    return function DataSourceConfigModal(settings) {

        var mappingOptions = {ignore: []};

        var frame = this;

        frame.originConfig = null;

        frame.availableProviders = $('#availableProviders').data('available-providers')
            .map(function (provider) {
                return {
                    name: provider.title,
                    value: provider.name
                };
            });

        frame.fetching = ko.observable(false);
        frame.connected = ko.observable(false);
        frame.dataSourceType = ko.observable(frame.availableProviders[0].value);
        frame.connectionErrorMessage = ko.observable();
        frame.dataSourceConfig = ko.observable();

        frame.onClose = function () {
            $('#dataSourceConfigModal').modal('hide');
        };

        frame.onSave = function (data, event) {
            if (!frame.connected()) {
                util.popupContent('*[name="connect"]');
            } else if (!frame.dataSourceConfig().name().trim()) {
                util.popupContent('*[name="name"]');
            } else {
                var exports = JSON.parse(komapping.toJSON(frame.dataSourceConfig, mappingOptions));
                settings.onSave(exports);
            }
        };

        frame.popup = function (originConfig) {
            $("#dataSourceConfigModal").remove();
            var $dataSourceConfigModal = $(dataSourceConfigModalTemplate);
            $('body').append(frame, $dataSourceConfigModal);
            ko.applyBindings(frame, $dataSourceConfigModal[0]);

            $('#dataSourceConfigModal').modal({
                closable: false,
                autofocus: false
            }).modal('show');

            frame.originConfig = originConfig;
        };
    };
});
