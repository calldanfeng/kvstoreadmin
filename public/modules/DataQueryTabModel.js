define(['knockout'], function (ko) {

    return function DataQueryTabModel(path) {

        var self = this,
            leaf = path[path.length - 1];

        self.path = path;

        self.type = path[0].type;

        self.title = ko.observable(leaf.name);

        self.editTitleMode = ko.observable(false);
    };
});
