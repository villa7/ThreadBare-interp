import AbstractElement from './AbstractElement.js';
import Log from './../../logger/Log.js';
import Unique from './../Unique.js';
import clone from 'clone';

const hiddenTest = Symbol('hiddenTest');
const hiddenBody = Symbol('hiddenBody');
const TAG = 'DoWhileStatement';
// while (test) { body }
class DoWhileStatement extends AbstractElement {
	constructor() {
		super();
		this._type = "DoWhileStatement";
		// BinaryExpression
		this._test;
		// BlockStatement
		this._body;
	}
	get test() {
		return this._test;
	}
	set test(test) {
		this[hiddenTest] = test;
		this._test = clone(this[hiddenTest]);
	}
	get body() {
		return this._body;
	}
	set body(body) {
		this[hiddenBody] = body;
		this._body = clone(this[hiddenBody]);
	}
	set environment(env) {
		super.environment = env;
		this._test.environment = env;
		this._body.environment = env;

		var thisID = Unique.get();
		super.runtimeID = thisID;
		this._body.runtimeID = thisID;
		event.on(thisID + ".break", () => {
			this._break = true;
		});
	}
	step() {
		// run the body once first
		if (!this._hasRun) {
			this._body.step();

			if (this._body.isDone()) {
				this._hasRun = true;
			}
		}

		// evaluate the test every step
		// and immediately run the body if test is true
		else if (this._test && !this._test.isDone()) {
			//Log.d(this._test);
			this._test.step();
			return;
		} else if (!this._body.isDone() && this._test && this._test.isDone() && !!this._test.eval()) {
			this._body.step();
			if (this._body.isDone()) {
				// reached end of body, reset test for next loop
				delete this._test;
				this._test = clone(this[hiddenTest]);
				this._test.environment = this._environment;
			}

			while (!this._test.isDone()) {
				this._test.step();
				//Log.d('tstep');
			}
			if (!this._test.eval()) {
				//Log.d('break');
				this._break = true;
				return;
			}
			return;
		} else {
			if (!this._test.eval().value) return;
			// body is done, so reset test and body for next loop
			delete this._test;
			this._test = clone(this[hiddenTest]);
			this._test.environment = this._environment;
			delete this._body;
			this._body = clone(this[hiddenBody]);
			this._body.environment = this._environment;
		}
	}
	isDone() {
		return this._break || this._test && this._test.isDone() && !this._test.eval().value && this._body.isDone();
	}
}
export default DoWhileStatement;