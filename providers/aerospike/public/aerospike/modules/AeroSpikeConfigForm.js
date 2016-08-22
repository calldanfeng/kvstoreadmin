define(['jquery', 'knockout', 'komapping', 'rest', 'modules/util',
    'text!aerospike/templates/as-config-form.html',
    'modules/DropDown',
    'modules/ComboBox'], function ($, ko, komapping, rest, util, asConfigFormTemplate) {

    ko.components.register('aerospikeConfigForm', {
        viewModel: function (params, componentInfo) {

            return {};
        },
        template: asConfigFormTemplate
    });
});
