var a = require('./simpleA');

a();
a.what;
a.scum = 0;
a.scum();
var test = a;

module.exports = {
	test : a,
	lala : require('./objectA')
};