'use strict';

const purify = require('purify-css');
const request = require('request-promise-native');
const tmp = require('tmp-promise');
const fs = require('fs');

class PurifyCSS {
	constructor(config) {
		this.config = config.plugins.purifycss || {};
	}
  optimize(file) {
  	try {
		const options = this.config.options;
		const promises = this.config.content.map(function (c) {
			if (c.startsWith('http')) {
				return request.get(c).then(function(response) {
					return tmp.file().then(function (tmpFile) {
						return new Promise(function (resolve, reject) {
							const writeStream = fs.createWriteStream(tmpFile.path);
							writeStream.write(response);
							resolve(tmpFile.path);
						});
					})
				});
			} else {
				return Promise.resolve(c);
			}
		});
		return Promise.all(promises).then(function (content) {
			console.log(content);
	  		const purified = purify(content, file.data, options);
			return Promise.resolve(purified);
		});
  	} catch (error) {
  		return Promise.reject(error);
  	}
  }
}

PurifyCSS.prototype.brunchPlugin = true;
PurifyCSS.prototype.type = 'stylesheet';
//PurifyCSS.prototype.extension = 'css';

module.exports = PurifyCSS;
