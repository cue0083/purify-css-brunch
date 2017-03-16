'use strict';

const purify = require('purify-css');

class PurifyCSS {
	constructor(config) {
		this.config = config.plugins.purifycss || {};
	}
  optimize(file) {
  	try {
  		const purified = purify(this.config.content, file.data, this.config.options);
    	return Promise.resolve(purified);
  	} catch (error) {
  		return Promise.reject(error);
  	}
  }
}

PurifyCSS.prototype.brunchPlugin = true;
PurifyCSS.prototype.type = 'stylesheet';
//PurifyCSS.prototype.extension = 'css';

module.exports = PurifyCSS;