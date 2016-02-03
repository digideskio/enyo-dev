'use strict';

import bunyan               from 'bunyan';
import format               from 'bunyan-format';
import {default as Promise} from 'bluebird';

// this is the "shared" root logging utility, the approach used in these tools is very flawed
// but full-scale changes has not been possible yet
let   stream = format({outputMode: 'short'})
	, log    = bunyan.createLogger({name: 'enyo-dev', stream});

// common handler for fatal errors the output might be ugly but fatal errors should
// only occur when an edge case was unhandled
function fatal (...args) {
	log.fatal(...args);
	process.exit(-1);
}

// here we map uncaught exceptions to be handled consistently and always exit abnormally
process.on('uncaughtException', fatal);

// we register this handler because if/when we hit these issues we need to try and
// understand where they come from since, ideally, they would all be handled
process.on('unhandledRejection', (reason) => {
	log.trace({reason: reason.toString()}, 'Unhandled Promise rejection event encountered, it is impossible to retrieve a stack-trace for this error');
	fatal(`A fatal error has been encountered, please use "trace" logging for more information on this issue`);
});

// to be able to print to the command line consistently for other es6 style modules
function stdout (...args) {
	// @todo format!!
	console.log(...args);
}

export default log;
export {fatal, log, stdout};