define(['jquery', 'semantic'], function ($) {

    function popupContent(selector) {
        var $connectTipPopup = $(selector);
        $connectTipPopup.popup({
            on: 'manual',
            delay: {
                show: 100,
                hide: 200
            }
        }).popup('show');
        setTimeout(function () {
            $connectTipPopup.popup('hide');
        }, 3000);
    }

    return {
        popupContent: popupContent
    };
});
