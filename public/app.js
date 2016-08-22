requirejs(['jquery', 'knockout',
        'modules/DataSourcePanel',
        'modules/DataQueryTabs',
        'semantic',
        'modules/MultiKeyInput'],
    function ($, ko, DataSourcePanel, DataQueryTabs) {

        var dataQueryTabs = new DataQueryTabs();
        var dataSourcePanel = new DataSourcePanel({dataQueryTabs: dataQueryTabs}, $('#dataSourcePanel')[0]);

        ko.applyBindings(dataSourcePanel, $('#collapsedDataSourcePanel')[0]);
        ko.applyBindings(dataSourcePanel, $('#expandedDataSourcePanel')[0]);

        $(function () {
            dataSourcePanel.bind();
            ko.applyBindings(dataQueryTabs, $('#queryTabPanel')[0]);
        });
    }
);
