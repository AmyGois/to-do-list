/* Events:
	- 'stored projects' - publishes all projects saved in storage as an array
	- 'updated projects' - publishes all projects (array) when a change occurs
*/

const mediator = (() => {
  const events = {};
  const subscribe = (eventName, functionToSetOff) => {
    events[eventName] = events[eventName] || [];
    events[eventName].push(functionToSetOff);
  };
  const unsubscribe = (eventName, functionToRemove) => {
    if (events[eventName]) {
      for (let i = 0; i < events[eventName].length; i++) {
        if (events[eventName][i] === functionToRemove) {
          events[eventName].splice(i, 1);
          break;
        }
      }
    }
  };
  const publish = (eventName, data) => {
    if (events[eventName]) {
      events[eventName].forEach((functionToRun) => {
        functionToRun(data);
      });
    }
  };
  return { subscribe, unsubscribe, publish };
})();

export default mediator;
