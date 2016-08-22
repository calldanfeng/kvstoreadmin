define(['jquery', 'knockout',
    'text!templates/cell-value-editor.html'], function ($, ko, cellValueEditorTemplate) {

    ko.components.register('CellValueEditor', {

        viewModel: function (params, componentInfo) {

            var self = this;

            $.extend(self, params);

            self.discard = function () {
                self.target(null);
            };

            return self;
        },

        template: cellValueEditorTemplate
    });

});
