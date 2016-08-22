define(['jquery', 'knockout',
    'text!templates/message.html'], function ($, ko, messageTemplate) {

    ko.components.register('Message', {
        viewModel: {
            createViewModel: function (params, componentInfo) {
                params || (params = {});

                var model = {};

                var $container = $(componentInfo.element);

                model.message = params.message;

                model.fadeOut = function () {
                    model.message('');
                    $container.transition('fade up out');
                };

                model.message.subscribe(function(message) {
                    if (message) {
                        $container.transition('fade down in');
                    } else {
                        $container.is(':visible') && model.fadeOut();
                    }
                });

                return model;
            }
        },
        template: messageTemplate
    });
});
