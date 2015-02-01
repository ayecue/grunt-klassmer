(function(global, factory) {
    global.myClass = factory(global);
})(this, function(global) {
    var a = function() {
        return {};
    }();
    var myClass = function() {
        return {};
    }();
    return myClass;
});