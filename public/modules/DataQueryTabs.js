define(['knockout', 'komapping', 'store', 'modules/DataQueryTabModel'], function (ko, komapping, store, DataQueryTabModel) {
    return function DataQueryTabs() {
        var self = this;

        self.activeQuery = ko.observable();

        self.queryTabs = ko.observableArray();

        self.newQuery = function (path) {
            var newQuery = new DataQueryTabModel(path);
            self.queryTabs.push(newQuery);
            self.selectQuery(newQuery);
        };

        self.selectQuery = function (target) {
            if (self.queryTabs().indexOf(target) >= 0) {
                self.activeQuery(target);
            }
        };

        self.removeQuery = function (target) {
            var targetOriginIndex = self.queryTabs().indexOf(target);
            self.queryTabs.remove(target);
            if (self.activeQuery() === target) {
                if (targetOriginIndex >= self.queryTabs().length) {
                    self.activeQuery(self.queryTabs()[self.queryTabs().length - 1]);
                } else {
                    self.activeQuery(self.queryTabs()[targetOriginIndex]);
                }
            }
        };

        /*
        TODO save tab status on any change
        ko.computed(function () {
            var queryTabsJson = komapping.toJSON(self, {
                ignore: ['running', 'fetchedKeys', 'isFetchingKeys', 'isFetchingSchema', 'editTitleMode', 'tableResult']
            });
            console.log(queryTabsJson);

            store.put('queryTabs', queryTabsJson);
        });
        */
    };
});
