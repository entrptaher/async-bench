const { performance } = require("perf_hooks");

/**
 * Figure out how long it takes for a method to execute.
 *
 * @param {Function} method to test
 * @param {number} iterations number of executions.
 * @param {Array} args to pass in.
 * @param {T} context the context to call the method in.
 */
const bench = async (method, iterations, args, context) => {
  let time = 0;
  const timer = action => {
    const d = performance.now();
    if (time < 1 || action === "start") {
      time = d;
      return 0;
    } else if (action === "stop") {
      const t = d - time;
      time = 0;
      return t;
    } else {
      return d - time;
    }
  };

  const result = [];
  let i = 0;
  timer("start");
  while (i < iterations) {
    result.push(await method.apply(context, args));
    i++;
  }

  const execTime = timer("stop");
  
  return {
    meanExecTime: execTime / iterations, // Mean execution time
    execTime, // Sum execution time
    resultOfMethod: result[0] // Result of the method call
  };
};

module.exports = bench;