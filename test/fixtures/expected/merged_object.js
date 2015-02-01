(function(global, factory) {
    global.result = factory(global);
})(this, function(global) {
    var a = function(exports) {
        exports.tool = function(test) {
            return test;
        }({});
        exports.wat = true;
        return exports;
    }({});
    var result = function() {
        return {};
    }();
    return result;
});