var logelem;
export default class Log {
	static d(tag, str) {
		if (str === undefined) {
			str = tag;
			tag = "NOTAG";
		}
		//str = JSON.parse(stringify(str));
		if (typeof str === 'object') {
			outo(console.log, `[${tag}]:`, str);
		} else {
			out(console.log, `[${tag}]: ${str}`);
		}
	}
	static w(tag, str) {
		if (str === undefined) {
			str = tag;
			tag = "NOTAG";
		}
		str = JSON.parse(stringify(str));
		if (typeof str === 'object') {
			outo(console.warn, `[${tag}]:`, str);
		} else {
			out(console.warn, `[${tag}]: ${str}`);
		}
	}
	static e(tag, str) {
		if (str === undefined) {
			str = tag;
			tag = "NOTAG";
		}
		//str = JSON.parse(stringify(str));
		if (typeof str === 'object') {
			outo(console.error, `[${tag}]:`, str);
		} else {
			out(console.error, `[${tag}]: ${str}`);
		}
	}
	static s(tag, str) {
		if (str === undefined) {
			str = tag;
			tag = "NOTAG";
		}
		if (typeof str === 'object') {
			out(console.log, `[${tag}]: ${stringify(str)}`);
		} else {
			out(console.log, `[${tag}]: ${str}`);
		}
	}
	static out(tag, str, redef) {
		if (logelem === undefined || redef) {
			if (redef && document.findElementById('LOGGERJS')) {
				document.findElementById('LOGGERJS').remove();
			}
			logelem = document.createElement('pre');
			logelem.id = "LOGGERJS";
			document.querySelector('body').append(logelem);
		}
		logelem.innerHTML = `[${tag}]: ${stringify(str, true)}\n` + logelem.innerHTML;
	}
}

function stringify(str, html) {
	var cache = [];
	return JSON.stringify(str, function(key, value) {
	    if (typeof value === 'object' && value !== null) {
	        if (cache.indexOf(value) !== -1) {
	            // Circular reference found, discard key
	            return html ? '<span style="color:red">[CircularRef]</span>' : 'circular';
	        }
	        // Store value in our collection
	        cache.push(value);
	    }
	    return value;
	}, 2);
}

const out = (fn, str) => fn(str);
const outo = (fn, tag, obj) => {
	fn(tag);
	fn(obj);
} 