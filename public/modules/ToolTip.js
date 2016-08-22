define(['jquery', 'knockout'], function ($, ko) {

    ko.components.register('ToolTip', {
        viewModel: {
            createViewModel: function (params, componentInfo) {
                $(componentInfo.element).popup(params);
            }
        },
        template: '<i></i>'
    });
});
