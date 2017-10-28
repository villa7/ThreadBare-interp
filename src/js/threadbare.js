import Parser from './interpreter/Parser.js';
import Runner from './interpreter/Runner.js';
import Log from './logger/Log.js';
import Eventify from './Eventify.js';

(function() {
	function ThreadBare() {
		const TAG = "ThreadBare";
		var runner = null;
		this.interpret = function(str, threadType) {
			//if (Eventify.getInstance()) Eventify.removeInstance();
			var i = new Parser();
			i.interpret(str.trim())
			.then(tree => {
				runner = new Runner(tree, threadType);
				Log.d(TAG, runner);

				//runner.step();
			})
			.catch(e => {
				Eventify.getInstance().emit('interpret.error', e);
			});
			this._id = Date.now().toString();
		}
		this.start = function() {
			if (!runner) return;
			runner.start();
		}
		this.stop = function() {
			if (!runner) return;
			runner.stop();
		}
		this.step = function() {
			if (!runner) return;
			runner.step();
		}
		this.reset = function() {
			runner = null;
		}
		this.isDone = function() {
			return runner && runner.done();
		}
		this.on = function(event, fn) {
			Eventify.getInstance().on(event, fn);
		}
		this.off = function(event, fn) {
			Eventify.getInstance().off(event, fn);
		}
	}

	if (module && module.exports) module.ThreadBare = ThreadBare;
	else window.ThreadBare = ThreadBare;
})();
