import Environment from './../../environment/Environment.js';
import clone from 'clone';

class Class/* extends Environment */ {
	constructor() {
		//super(null);
		this._name;
		this._entries = {};
		this._constructors = {};
		this._environment = null;
	}
	addEntry(en) {
		if (!this._entries[en.getName()]) this._entries[en.getName()] = en;
	}
	getEntry(n) {
		return this._entries[n];
	}
	addConstructor(en) {
		if (!this._constructors[en.getName()]) this._constructors[en.getName()] = en;
	}
	getConstructor(n) {
		return this._constructors[n];
	}
	canAddEntry(entry) {
		return this._entries[entry.getName()] === undefined
		&& this._constructors[entry.getName()] === undefined;
	}
	set environment(env) {
		this._environment = env;
		this.spreadEnv(env);
	}
	spreadEnv(env) {
		for (var e in this._entries) {
			this._entries[e].getValue().environment = env;
		}
		for (var e in this._constructors) {
			this._constructors[e].getValue().environment = env;
		}
	}
	clone() {
		return clone(this);
	}
}
export default Class;