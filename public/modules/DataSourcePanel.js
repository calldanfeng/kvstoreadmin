define(['jquery', 'knockout', 'komapping', 'rest', 'store', 'promise',
        'modules/DataSourceConfigModal',
        'text!templates/data-source-panel.html',
        'text!templates/data-source-menu-popup.html',
        'semantic',
        'modules/ComboBox',
        'jqueryui'],
    function ($, ko, komapping, rest, store, Promise,
              DataSourceConfigModal,
              dataSourcePanelTemplate,
              dataSourceMenuPopupTemplate) {

        ko.options.deferUpdates = true;

        return function DataSourcePanel(settings, container) {

            var self = this;

            self.collapsed = ko.observable(false);
            self.loading = ko.observable(false);
            self.filter = ko.observable(store.get('filter'));
            self.dataSourceList = ko.observable();
            self.dataSourceConfigList = ko.observableArray([]);

            // persist filter
            self.filter.subscribe(function (filter) {
                store.put('filter', filter);
            });

            self.displayDataSourceList = ko.pureComputed(function () {
                var filter = self.filter();

                var dataSourceFiltered = $.extend(true, [], self.dataSourceList());
                dataSourceFiltered.forEach(function (dataSource) {
                    if (dataSource.status !== 'broken') {
                        dataSource.items.forEach(function (cluster) {
                            var filteredStore = [];
                            if (filter) {
                                cluster.items.forEach(function (store) {

                                    var highlightStart = store.name.toLowerCase().indexOf(filter.toLowerCase());
                                    if (highlightStart >= 0) {
                                        store.highlight = {
                                            start: store.name.substr(0, highlightStart),
                                            mid: store.name.substr(highlightStart, filter.length),
                                            end: store.name.substr(highlightStart + filter.length)
                                        };
                                        filteredStore.push(store);
                                    }
                                });
                                cluster.items = filteredStore;
                            }
                            cluster.collapsed = ko.observable(false);
                        });

                        // also remove the cluster nodes if they don't contain stores after filtering.
                        dataSource.items = dataSource.items.filter(function (cluster) {
                            return cluster && cluster.items && cluster.items.length > 0;
                        });
                    }

                    dataSource.collapsed = ko.observable(false);
                });

                return dataSourceFiltered;
            });

            self.displayDataSourceList.extend({rateLimit: {method: "notifyWhenChangesStop", timeout: 200}});

            self.collapse = function () {
                self.collapsed(true);
            };

            self.expand = function () {
                self.collapsed(false);
            };

            self.toggleNode = function (data) {
                if (data.status !== 'broken') {
                    data.collapsed(!data.collapsed());
                }
            };

            self.popupEdit = function () {
                $('#dataSourceEditPopupButton').popup();
            };

            function loadDataSource() {

                self.dataSourceConfigList(store.get('dataSourceConfigList'));

                var cachedDataSourceList = store.get('dataSourceList');
                if (cachedDataSourceList) {
                    self.dataSourceList(cachedDataSourceList);
                } else {

                    self.loading(true);

                    var requests = self.dataSourceConfigList().map(function (conf) {

                        return new Promise(function (fulfill) {
                            rest.ajax({
                                url: conf.type + '/datasource/connect',
                                method: 'POST',
                                methodAs: 'GET',
                                data: JSON.stringify(conf)
                            }).then(function (success) {
                                fulfill(success);
                            }, function () {

                                var brokenDS = {
                                    dataSourceTree: $.extend({}, conf)
                                };
                                brokenDS.dataSourceTree.status = 'broken';
                                fulfill(brokenDS);
                            });
                        });
                    });

                    Promise.all(requests).then(
                        function (responses) {
                            self.loading(false);
                            var dataSourceList = responses.map(function (resp) {
                                return resp.dataSourceTree;
                            });
                            store.put('dataSourceList', dataSourceList, 3600);
                            dataSourceList.forEach(function(dataSource, i) {
                                self.dataSourceConfigList().forEach(function (dataSourceConfig, j) {
                                    if (i === j) {
                                        $.extend(true, dataSourceConfig, dataSource);
                                        delete dataSourceConfig.items;
                                    }
                                });
                            });
                            store.put('dataSourceConfigList', self.dataSourceConfigList());

                            self.dataSourceList(dataSourceList);
                        },
                        function () {
                            self.loading(false);
                        }
                    );
                }
            }

            self.reloadDataSource = function () {
                store.put('dataSourceConfigList', self.dataSourceConfigList());
                store.remove('dataSourceList');
                loadDataSource();
            };

            self.addDataSource = function () {
                new DataSourceConfigModal({
                    onSave: function (config) {
                        self.dataSourceConfigList.push(config);
                        self.reloadDataSource();
                    }
                }).popup();
            };

            self.removeDataSource = function (data) {
                self.dataSourceConfigList.remove(data);
                self.reloadDataSource();
            };

            self.editDataSource = function (data) {
                new DataSourceConfigModal({
                    onSave: function (config) {
                        self.dataSourceConfigList.splice(
                            self.dataSourceConfigList().indexOf(data),
                            1,
                            config
                        );
                        self.reloadDataSource();
                    }
                }).popup(data);
            };

            self.newQuery = function ($context) {
                var path = [$context.$data];
                $context.$parents.forEach(function (node) {
                    if ('type' in node) {
                        path.unshift(node);
                    }
                });
                settings.dataQueryTabs.newQuery(komapping.toJS(path, {ignore: 'items'}));
                return true;
            };

            self.bind = function () {
                loadDataSource();

                var $dataSourcePanel = $(dataSourcePanelTemplate);
                var $dataSourceMenuPopup = $(dataSourceMenuPopupTemplate);
                $(container).append($dataSourcePanel)
                    .append($dataSourceMenuPopup);

                ko.applyBindings(self, $dataSourcePanel[0]);
                ko.applyBindings(self, $dataSourceMenuPopup[0]);

                $('#dataSourceEditPopupButton').popup({
                    popup: '#dataSourceEditPopup',
                    hoverable: true,
                    on: 'click',
                    position: 'bottom center',
                    delay: {
                        show: 200,
                        hide: 400
                    }
                });

                // $('#dataSourceConfigRows').sortable({
                //
                //     placeholder: "ui-state-highlight"
                // });
            };

        };
    }
);
