/* Events:
	Published by storage.js:
	- 'stored projects' - publishes all projects saved in storage as an array

	Published by toDoList.js:
	- 'updated all projects' - publishes all projects (array) when a change occurs
	- 'revealed all projects' - publishes all current projects (array) when nothing has been altered
	- 'new project created' - publishes a single project (object) when it is created
	- 'updated project' - publishes a single project (object) when a change occurs
	- 'revealed project' - publishes a single project (object) that hasn't been altered
	- 'new task created' - publishes a single task (object) when it is created
	- 'updated task' - publishes a single task (object) when a change occurs
	- 'revealed task' - publishes a single task (object) that hasn't been altered
	- 'new step created' - publishes a single step (object) when it is created
	- 'updated step' - publishes a single step (object) when a change occurs
	- 'revealed step' - publishes a single step (object) that hasn't been altered

	Published by ui.js:
  - 'create new project'
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
