/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/mediator.js":
/*!*************************!*\
  !*** ./src/mediator.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
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

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (mediator);


/***/ }),

/***/ "./src/storage.js":
/*!************************!*\
  !*** ./src/storage.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _mediator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mediator */ "./src/mediator.js");


const storageManager = (() => {
  const getStorage = () => {
    let toDoList = [];
    if (localStorage.toDoList) {
      toDoList = JSON.parse(localStorage.getItem('toDoList'));
    }
    _mediator__WEBPACK_IMPORTED_MODULE_0__["default"].publish('stored projects', toDoList);
  };

  const setStorage = (projects) => {
    const toDoList = JSON.stringify(projects);
    localStorage.setItem('toDoList', toDoList);
  };

  const subscribe = () => {
    _mediator__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe('updated projects', setStorage);
  };

  return { getStorage, setStorage, subscribe };
})();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (storageManager);


/***/ }),

/***/ "./src/toDoList.js":
/*!*************************!*\
  !*** ./src/toDoList.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   projectManager: () => (/* binding */ projectManager),
/* harmony export */   stepManager: () => (/* binding */ stepManager),
/* harmony export */   taskManager: () => (/* binding */ taskManager)
/* harmony export */ });
/* harmony import */ var _mediator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mediator */ "./src/mediator.js");
/* Contents:

  Constructors - Task, Step & Project

  Functions to deep clone arrays and objects

  Project Manager

  Task Manager

  Step Manager
*/



/* ********************************************************************
Constructors - Task, Step & Project
  - Step goes inside Task.steps[]
  - Task goes inside Project.tasks[]
******************************************************************** */
class Task {
  constructor(title, description, dueDate, priority, status) {
    this.title = title;
    this.description = description;
    this.steps = [];
    this.dueDate = dueDate;
    this.priority = priority;
    this.status = status;
  }
}

class Step {
  constructor(description, status) {
    this.description = description;
    this.status = status;
  }
}

class Project {
  constructor(title, description) {
    this.title = title;
    this.description = description;
    this.tasks = [];
  }
}

const projects = [];

/* ********************************************************************
Functions to deep clone arrays and objects
******************************************************************** */
const deepCopyArray = (array) => {
  const arrayCopy = [];
  array.forEach((item) => {
    if (Array.isArray(item)) {
      arrayCopy.push(deepCopyArray(item));
    } else if (typeof item === 'object') {
      arrayCopy.push(deepCopyObject(item));
    } else {
      arrayCopy.push(item);
    }
  });
  return arrayCopy;
};

const deepCopyObject = (object) => {
  const objectCopy = {};
  for (const [key, value] of Object.entries(object)) {
    if (Array.isArray(value)) {
      objectCopy[key] = deepCopyArray(value);
    } else if (typeof value === 'object') {
      objectCopy[key] = deepCopyObject(value);
    } else {
      objectCopy[key] = value;
    }
  }
  return objectCopy;
};

/* ********************************************************************
Project Manager
  - Create & delete projects
  - Edit project titles & descriptions
  - Create a safe copy of a project & of the projects array for public use
******************************************************************** */
const projectManager = (() => {
  const createNewProject = (title, description) => {
    /* const projectAlreadyExists = projects.find((project) => {
      return project.title === title;
    });

    if (typeof projectAlreadyExists === 'object') {
      return false; // Can't create new project because one with the same title already exists
    } */ /* This can cause problems when editing the title */
    const newProject = new Project(title, description);
    projects.push(newProject);
  };

  const deleteProject = (projectIndex) => {
    const index = Number(projectIndex);
    projects.splice(index, 1);
  };

  /* Might not need this */
  const deleteProjectByName = (projectTitle) => {
    projects.forEach((project) => {
      if (project.title === projectTitle) {
        projects.splice(projects.indexOf(project), 1);
      }
    });
  };

  const editProjectTitle = (projectIndex, newTitle) => {
    projects[Number(projectIndex)].title = newTitle;
  };

  const editProjectDescription = (projectIndex, newDescription) => {
    projects[Number(projectIndex)].description = newDescription;
  };

  const revealProject = (projectIndex) => {
    const projectCopy = deepCopyObject(projects[projectIndex]);
    return projectCopy;
  };

  const revealAllProjects = () => {
    const projectsCopy = deepCopyArray(projects);
    return projectsCopy;
  };

  const subscribe = () => {};

  return {
    createNewProject,
    deleteProject,
    deleteProjectByName,
    editProjectTitle,
    editProjectDescription,
    revealProject,
    revealAllProjects,
    subscribe,
  };
})();

/* ********************************************************************
Task Manager
  - Create & delete tasks in a project
  - Edit task title, description, due date, priority & status
  - Create a safe copy of a single task for public use
******************************************************************** */
const taskManager = (() => {
  const createNewTask = (
    projectIndex,
    title,
    description,
    dueDate,
    priority,
    status,
  ) => {
    const project = projects[Number(projectIndex)];
    /* const taskAlreadyExists = project.tasks.find((task) => {
      return task.title === title;
    });

    if (typeof taskAlreadyExists === 'object') {
      return false; // Can't create new task because one with the same title already exists
    } */ /* This can cause problems when editing the title */
    project.tasks.push(new Task(title, description, dueDate, priority, status));
  };

  const deleteTask = (projectIndex, taskIndex) => {
    const project = projects[Number(projectIndex)];
    const index = Number(taskIndex);
    project.tasks.splice(index, 1);
  };

  const editTaskTitle = (projectIndex, taskIndex, newTitle) => {
    const task = projects[Number(projectIndex)].tasks[Number(taskIndex)];
    task.title = newTitle;
  };

  const editTaskDescription = (projectIndex, taskIndex, newDescription) => {
    const task = projects[Number(projectIndex)].tasks[Number(taskIndex)];
    task.description = newDescription;
  };

  const editTaskDueDate = (projectIndex, taskIndex, newDueDate) => {
    const task = projects[Number(projectIndex)].tasks[Number(taskIndex)];
    task.dueDate = newDueDate;
  };

  const editTaskPriority = (projectIndex, taskIndex, newPriority) => {
    const task = projects[Number(projectIndex)].tasks[Number(taskIndex)];
    task.priority = newPriority;
  };

  const editTaskStatus = (projectIndex, taskIndex, newStatus) => {
    const task = projects[Number(projectIndex)].tasks[Number(taskIndex)];
    task.status = newStatus;
  };

  const revealTask = (projectIndex, taskIndex) => {
    const taskCopy = deepCopyObject(
      projects[Number(projectIndex)].tasks[Number(taskIndex)],
    );
    return taskCopy;
  };

  const subscribe = () => {};

  return {
    createNewTask,
    deleteTask,
    editTaskTitle,
    editTaskDescription,
    editTaskDueDate,
    editTaskPriority,
    editTaskStatus,
    revealTask,
    subscribe,
  };
})();

/* ********************************************************************
Step Manager
  - Create & delete steps in a task
  - Edit step description & status
  - Create a sfe copy of a single step for public use
******************************************************************** */
const stepManager = (() => {
  const createNewStep = (projectIndex, taskIndex, description, status) => {
    const task = projects[Number(projectIndex)].tasks[Number(taskIndex)];
    task.steps.push(new Step(description, status));
  };

  const deleteStep = (projectIndex, taskIndex, stepIndex) => {
    const task = projects[Number(projectIndex)].tasks[Number(taskIndex)];
    const index = Number(stepIndex);
    task.steps.splice(index, 1);
  };

  const editStepDescription = (
    projectIndex,
    taskIndex,
    stepIndex,
    newDescription,
  ) => {
    const step =
      projects[Number(projectIndex)].tasks[Number(taskIndex)].steps[
        Number(stepIndex)
      ];
    step.description = newDescription;
  };

  const editStepStatus = (projectIndex, taskIndex, stepIndex, newStatus) => {
    const step =
      projects[Number(projectIndex)].tasks[Number(taskIndex)].steps[
        Number(stepIndex)
      ];
    step.status = newStatus;
  };

  const revealStep = (projectIndex, taskIndex, stepIndex) => {
    const stepCopy = deepCopyObject(
      projects[Number(projectIndex)].tasks[Number(taskIndex)].steps[
        Number(stepIndex)
      ],
    );
    return stepCopy;
  };

  const subscribe = () => {};

  return {
    createNewStep,
    deleteStep,
    editStepDescription,
    editStepStatus,
    revealStep,
    subscribe,
  };
})();

/* projectManager.createNewProject(
  'cleaning',
  'kitchen, bathroom, bedroom, livingroom',
);
projectManager.createNewProject('housework', 'cooking, washing, ironing');
projectManager.createNewProject('shopping', 'food, cleaning products, clothes');

taskManager.createNewTask(1, 'bake cake', '', '23-07-2023', 'medium', 'to do');
taskManager.createNewTask(1, 'cook dinner', '', '23-07-2023', 'high', 'to do');
taskManager.createNewTask(1, 'cook tea', '', '23-07-2023', 'high', 'to do');

stepManager.createNewStep(1, 0, 'gather ingredients', 'to do');
stepManager.createNewStep(1, 0, 'mix ingredients', 'to do');
stepManager.createNewStep(1, 0, 'bake in oven', 'to do'); */




/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _toDoList__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toDoList */ "./src/toDoList.js");
/* harmony import */ var _storage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./storage */ "./src/storage.js");



/* projectManager.subscribe();
storageManager.subscribe();
storageManager.getStorage(); */

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0IsOEJBQThCO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLFdBQVc7QUFDWCxDQUFDOztBQUVELGlFQUFlLFFBQVEsRUFBQzs7Ozs7Ozs7Ozs7Ozs7OztBQy9CVTs7QUFFbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxpREFBUTtBQUNaOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsSUFBSSxpREFBUTtBQUNaOztBQUVBLFdBQVc7QUFDWCxDQUFDOztBQUVELGlFQUFlLGNBQWMsRUFBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdkI5Qjs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVrQzs7QUFFbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0Esb0JBQW9CO0FBQ3BCLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSxvQkFBb0I7QUFDcEIsTUFBTTtBQUNOO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDBEQUEwRDs7QUFFTjs7Ozs7OztVQzFTcEQ7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7QUNONEM7QUFDTDs7QUFFdkM7QUFDQTtBQUNBLDZCQUE2QiIsInNvdXJjZXMiOlsid2VicGFjazovL3RvLWRvLWxpc3QvLi9zcmMvbWVkaWF0b3IuanMiLCJ3ZWJwYWNrOi8vdG8tZG8tbGlzdC8uL3NyYy9zdG9yYWdlLmpzIiwid2VicGFjazovL3RvLWRvLWxpc3QvLi9zcmMvdG9Eb0xpc3QuanMiLCJ3ZWJwYWNrOi8vdG8tZG8tbGlzdC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90by1kby1saXN0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly90by1kby1saXN0L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vdG8tZG8tbGlzdC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3RvLWRvLWxpc3QvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyogRXZlbnRzOlxuXHQtICdzdG9yZWQgcHJvamVjdHMnIC0gcHVibGlzaGVzIGFsbCBwcm9qZWN0cyBzYXZlZCBpbiBzdG9yYWdlIGFzIGFuIGFycmF5XG5cdC0gJ3VwZGF0ZWQgcHJvamVjdHMnIC0gcHVibGlzaGVzIGFsbCBwcm9qZWN0cyAoYXJyYXkpIHdoZW4gYSBjaGFuZ2Ugb2NjdXJzXG4qL1xuXG5jb25zdCBtZWRpYXRvciA9ICgoKSA9PiB7XG4gIGNvbnN0IGV2ZW50cyA9IHt9O1xuICBjb25zdCBzdWJzY3JpYmUgPSAoZXZlbnROYW1lLCBmdW5jdGlvblRvU2V0T2ZmKSA9PiB7XG4gICAgZXZlbnRzW2V2ZW50TmFtZV0gPSBldmVudHNbZXZlbnROYW1lXSB8fCBbXTtcbiAgICBldmVudHNbZXZlbnROYW1lXS5wdXNoKGZ1bmN0aW9uVG9TZXRPZmYpO1xuICB9O1xuICBjb25zdCB1bnN1YnNjcmliZSA9IChldmVudE5hbWUsIGZ1bmN0aW9uVG9SZW1vdmUpID0+IHtcbiAgICBpZiAoZXZlbnRzW2V2ZW50TmFtZV0pIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXZlbnRzW2V2ZW50TmFtZV0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGV2ZW50c1tldmVudE5hbWVdW2ldID09PSBmdW5jdGlvblRvUmVtb3ZlKSB7XG4gICAgICAgICAgZXZlbnRzW2V2ZW50TmFtZV0uc3BsaWNlKGksIDEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBjb25zdCBwdWJsaXNoID0gKGV2ZW50TmFtZSwgZGF0YSkgPT4ge1xuICAgIGlmIChldmVudHNbZXZlbnROYW1lXSkge1xuICAgICAgZXZlbnRzW2V2ZW50TmFtZV0uZm9yRWFjaCgoZnVuY3Rpb25Ub1J1bikgPT4ge1xuICAgICAgICBmdW5jdGlvblRvUnVuKGRhdGEpO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xuICByZXR1cm4geyBzdWJzY3JpYmUsIHVuc3Vic2NyaWJlLCBwdWJsaXNoIH07XG59KSgpO1xuXG5leHBvcnQgZGVmYXVsdCBtZWRpYXRvcjtcbiIsImltcG9ydCBtZWRpYXRvciBmcm9tICcuL21lZGlhdG9yJztcblxuY29uc3Qgc3RvcmFnZU1hbmFnZXIgPSAoKCkgPT4ge1xuICBjb25zdCBnZXRTdG9yYWdlID0gKCkgPT4ge1xuICAgIGxldCB0b0RvTGlzdCA9IFtdO1xuICAgIGlmIChsb2NhbFN0b3JhZ2UudG9Eb0xpc3QpIHtcbiAgICAgIHRvRG9MaXN0ID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndG9Eb0xpc3QnKSk7XG4gICAgfVxuICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3N0b3JlZCBwcm9qZWN0cycsIHRvRG9MaXN0KTtcbiAgfTtcblxuICBjb25zdCBzZXRTdG9yYWdlID0gKHByb2plY3RzKSA9PiB7XG4gICAgY29uc3QgdG9Eb0xpc3QgPSBKU09OLnN0cmluZ2lmeShwcm9qZWN0cyk7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3RvRG9MaXN0JywgdG9Eb0xpc3QpO1xuICB9O1xuXG4gIGNvbnN0IHN1YnNjcmliZSA9ICgpID0+IHtcbiAgICBtZWRpYXRvci5zdWJzY3JpYmUoJ3VwZGF0ZWQgcHJvamVjdHMnLCBzZXRTdG9yYWdlKTtcbiAgfTtcblxuICByZXR1cm4geyBnZXRTdG9yYWdlLCBzZXRTdG9yYWdlLCBzdWJzY3JpYmUgfTtcbn0pKCk7XG5cbmV4cG9ydCBkZWZhdWx0IHN0b3JhZ2VNYW5hZ2VyO1xuIiwiLyogQ29udGVudHM6XG5cbiAgQ29uc3RydWN0b3JzIC0gVGFzaywgU3RlcCAmIFByb2plY3RcblxuICBGdW5jdGlvbnMgdG8gZGVlcCBjbG9uZSBhcnJheXMgYW5kIG9iamVjdHNcblxuICBQcm9qZWN0IE1hbmFnZXJcblxuICBUYXNrIE1hbmFnZXJcblxuICBTdGVwIE1hbmFnZXJcbiovXG5cbmltcG9ydCBtZWRpYXRvciBmcm9tICcuL21lZGlhdG9yJztcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbkNvbnN0cnVjdG9ycyAtIFRhc2ssIFN0ZXAgJiBQcm9qZWN0XG4gIC0gU3RlcCBnb2VzIGluc2lkZSBUYXNrLnN0ZXBzW11cbiAgLSBUYXNrIGdvZXMgaW5zaWRlIFByb2plY3QudGFza3NbXVxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbmNsYXNzIFRhc2sge1xuICBjb25zdHJ1Y3Rvcih0aXRsZSwgZGVzY3JpcHRpb24sIGR1ZURhdGUsIHByaW9yaXR5LCBzdGF0dXMpIHtcbiAgICB0aGlzLnRpdGxlID0gdGl0bGU7XG4gICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xuICAgIHRoaXMuc3RlcHMgPSBbXTtcbiAgICB0aGlzLmR1ZURhdGUgPSBkdWVEYXRlO1xuICAgIHRoaXMucHJpb3JpdHkgPSBwcmlvcml0eTtcbiAgICB0aGlzLnN0YXR1cyA9IHN0YXR1cztcbiAgfVxufVxuXG5jbGFzcyBTdGVwIHtcbiAgY29uc3RydWN0b3IoZGVzY3JpcHRpb24sIHN0YXR1cykge1xuICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcbiAgICB0aGlzLnN0YXR1cyA9IHN0YXR1cztcbiAgfVxufVxuXG5jbGFzcyBQcm9qZWN0IHtcbiAgY29uc3RydWN0b3IodGl0bGUsIGRlc2NyaXB0aW9uKSB7XG4gICAgdGhpcy50aXRsZSA9IHRpdGxlO1xuICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcbiAgICB0aGlzLnRhc2tzID0gW107XG4gIH1cbn1cblxuY29uc3QgcHJvamVjdHMgPSBbXTtcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbkZ1bmN0aW9ucyB0byBkZWVwIGNsb25lIGFycmF5cyBhbmQgb2JqZWN0c1xuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbmNvbnN0IGRlZXBDb3B5QXJyYXkgPSAoYXJyYXkpID0+IHtcbiAgY29uc3QgYXJyYXlDb3B5ID0gW107XG4gIGFycmF5LmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShpdGVtKSkge1xuICAgICAgYXJyYXlDb3B5LnB1c2goZGVlcENvcHlBcnJheShpdGVtKSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgaXRlbSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGFycmF5Q29weS5wdXNoKGRlZXBDb3B5T2JqZWN0KGl0ZW0pKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXJyYXlDb3B5LnB1c2goaXRlbSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGFycmF5Q29weTtcbn07XG5cbmNvbnN0IGRlZXBDb3B5T2JqZWN0ID0gKG9iamVjdCkgPT4ge1xuICBjb25zdCBvYmplY3RDb3B5ID0ge307XG4gIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKG9iamVjdCkpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgIG9iamVjdENvcHlba2V5XSA9IGRlZXBDb3B5QXJyYXkodmFsdWUpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgICAgb2JqZWN0Q29weVtrZXldID0gZGVlcENvcHlPYmplY3QodmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvYmplY3RDb3B5W2tleV0gPSB2YWx1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG9iamVjdENvcHk7XG59O1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuUHJvamVjdCBNYW5hZ2VyXG4gIC0gQ3JlYXRlICYgZGVsZXRlIHByb2plY3RzXG4gIC0gRWRpdCBwcm9qZWN0IHRpdGxlcyAmIGRlc2NyaXB0aW9uc1xuICAtIENyZWF0ZSBhIHNhZmUgY29weSBvZiBhIHByb2plY3QgJiBvZiB0aGUgcHJvamVjdHMgYXJyYXkgZm9yIHB1YmxpYyB1c2VcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5jb25zdCBwcm9qZWN0TWFuYWdlciA9ICgoKSA9PiB7XG4gIGNvbnN0IGNyZWF0ZU5ld1Byb2plY3QgPSAodGl0bGUsIGRlc2NyaXB0aW9uKSA9PiB7XG4gICAgLyogY29uc3QgcHJvamVjdEFscmVhZHlFeGlzdHMgPSBwcm9qZWN0cy5maW5kKChwcm9qZWN0KSA9PiB7XG4gICAgICByZXR1cm4gcHJvamVjdC50aXRsZSA9PT0gdGl0bGU7XG4gICAgfSk7XG5cbiAgICBpZiAodHlwZW9mIHByb2plY3RBbHJlYWR5RXhpc3RzID09PSAnb2JqZWN0Jykge1xuICAgICAgcmV0dXJuIGZhbHNlOyAvLyBDYW4ndCBjcmVhdGUgbmV3IHByb2plY3QgYmVjYXVzZSBvbmUgd2l0aCB0aGUgc2FtZSB0aXRsZSBhbHJlYWR5IGV4aXN0c1xuICAgIH0gKi8gLyogVGhpcyBjYW4gY2F1c2UgcHJvYmxlbXMgd2hlbiBlZGl0aW5nIHRoZSB0aXRsZSAqL1xuICAgIGNvbnN0IG5ld1Byb2plY3QgPSBuZXcgUHJvamVjdCh0aXRsZSwgZGVzY3JpcHRpb24pO1xuICAgIHByb2plY3RzLnB1c2gobmV3UHJvamVjdCk7XG4gIH07XG5cbiAgY29uc3QgZGVsZXRlUHJvamVjdCA9IChwcm9qZWN0SW5kZXgpID0+IHtcbiAgICBjb25zdCBpbmRleCA9IE51bWJlcihwcm9qZWN0SW5kZXgpO1xuICAgIHByb2plY3RzLnNwbGljZShpbmRleCwgMSk7XG4gIH07XG5cbiAgLyogTWlnaHQgbm90IG5lZWQgdGhpcyAqL1xuICBjb25zdCBkZWxldGVQcm9qZWN0QnlOYW1lID0gKHByb2plY3RUaXRsZSkgPT4ge1xuICAgIHByb2plY3RzLmZvckVhY2goKHByb2plY3QpID0+IHtcbiAgICAgIGlmIChwcm9qZWN0LnRpdGxlID09PSBwcm9qZWN0VGl0bGUpIHtcbiAgICAgICAgcHJvamVjdHMuc3BsaWNlKHByb2plY3RzLmluZGV4T2YocHJvamVjdCksIDEpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IGVkaXRQcm9qZWN0VGl0bGUgPSAocHJvamVjdEluZGV4LCBuZXdUaXRsZSkgPT4ge1xuICAgIHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXS50aXRsZSA9IG5ld1RpdGxlO1xuICB9O1xuXG4gIGNvbnN0IGVkaXRQcm9qZWN0RGVzY3JpcHRpb24gPSAocHJvamVjdEluZGV4LCBuZXdEZXNjcmlwdGlvbikgPT4ge1xuICAgIHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXS5kZXNjcmlwdGlvbiA9IG5ld0Rlc2NyaXB0aW9uO1xuICB9O1xuXG4gIGNvbnN0IHJldmVhbFByb2plY3QgPSAocHJvamVjdEluZGV4KSA9PiB7XG4gICAgY29uc3QgcHJvamVjdENvcHkgPSBkZWVwQ29weU9iamVjdChwcm9qZWN0c1twcm9qZWN0SW5kZXhdKTtcbiAgICByZXR1cm4gcHJvamVjdENvcHk7XG4gIH07XG5cbiAgY29uc3QgcmV2ZWFsQWxsUHJvamVjdHMgPSAoKSA9PiB7XG4gICAgY29uc3QgcHJvamVjdHNDb3B5ID0gZGVlcENvcHlBcnJheShwcm9qZWN0cyk7XG4gICAgcmV0dXJuIHByb2plY3RzQ29weTtcbiAgfTtcblxuICBjb25zdCBzdWJzY3JpYmUgPSAoKSA9PiB7fTtcblxuICByZXR1cm4ge1xuICAgIGNyZWF0ZU5ld1Byb2plY3QsXG4gICAgZGVsZXRlUHJvamVjdCxcbiAgICBkZWxldGVQcm9qZWN0QnlOYW1lLFxuICAgIGVkaXRQcm9qZWN0VGl0bGUsXG4gICAgZWRpdFByb2plY3REZXNjcmlwdGlvbixcbiAgICByZXZlYWxQcm9qZWN0LFxuICAgIHJldmVhbEFsbFByb2plY3RzLFxuICAgIHN1YnNjcmliZSxcbiAgfTtcbn0pKCk7XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5UYXNrIE1hbmFnZXJcbiAgLSBDcmVhdGUgJiBkZWxldGUgdGFza3MgaW4gYSBwcm9qZWN0XG4gIC0gRWRpdCB0YXNrIHRpdGxlLCBkZXNjcmlwdGlvbiwgZHVlIGRhdGUsIHByaW9yaXR5ICYgc3RhdHVzXG4gIC0gQ3JlYXRlIGEgc2FmZSBjb3B5IG9mIGEgc2luZ2xlIHRhc2sgZm9yIHB1YmxpYyB1c2VcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5jb25zdCB0YXNrTWFuYWdlciA9ICgoKSA9PiB7XG4gIGNvbnN0IGNyZWF0ZU5ld1Rhc2sgPSAoXG4gICAgcHJvamVjdEluZGV4LFxuICAgIHRpdGxlLFxuICAgIGRlc2NyaXB0aW9uLFxuICAgIGR1ZURhdGUsXG4gICAgcHJpb3JpdHksXG4gICAgc3RhdHVzLFxuICApID0+IHtcbiAgICBjb25zdCBwcm9qZWN0ID0gcHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldO1xuICAgIC8qIGNvbnN0IHRhc2tBbHJlYWR5RXhpc3RzID0gcHJvamVjdC50YXNrcy5maW5kKCh0YXNrKSA9PiB7XG4gICAgICByZXR1cm4gdGFzay50aXRsZSA9PT0gdGl0bGU7XG4gICAgfSk7XG5cbiAgICBpZiAodHlwZW9mIHRhc2tBbHJlYWR5RXhpc3RzID09PSAnb2JqZWN0Jykge1xuICAgICAgcmV0dXJuIGZhbHNlOyAvLyBDYW4ndCBjcmVhdGUgbmV3IHRhc2sgYmVjYXVzZSBvbmUgd2l0aCB0aGUgc2FtZSB0aXRsZSBhbHJlYWR5IGV4aXN0c1xuICAgIH0gKi8gLyogVGhpcyBjYW4gY2F1c2UgcHJvYmxlbXMgd2hlbiBlZGl0aW5nIHRoZSB0aXRsZSAqL1xuICAgIHByb2plY3QudGFza3MucHVzaChuZXcgVGFzayh0aXRsZSwgZGVzY3JpcHRpb24sIGR1ZURhdGUsIHByaW9yaXR5LCBzdGF0dXMpKTtcbiAgfTtcblxuICBjb25zdCBkZWxldGVUYXNrID0gKHByb2plY3RJbmRleCwgdGFza0luZGV4KSA9PiB7XG4gICAgY29uc3QgcHJvamVjdCA9IHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXTtcbiAgICBjb25zdCBpbmRleCA9IE51bWJlcih0YXNrSW5kZXgpO1xuICAgIHByb2plY3QudGFza3Muc3BsaWNlKGluZGV4LCAxKTtcbiAgfTtcblxuICBjb25zdCBlZGl0VGFza1RpdGxlID0gKHByb2plY3RJbmRleCwgdGFza0luZGV4LCBuZXdUaXRsZSkgPT4ge1xuICAgIGNvbnN0IHRhc2sgPSBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0udGFza3NbTnVtYmVyKHRhc2tJbmRleCldO1xuICAgIHRhc2sudGl0bGUgPSBuZXdUaXRsZTtcbiAgfTtcblxuICBjb25zdCBlZGl0VGFza0Rlc2NyaXB0aW9uID0gKHByb2plY3RJbmRleCwgdGFza0luZGV4LCBuZXdEZXNjcmlwdGlvbikgPT4ge1xuICAgIGNvbnN0IHRhc2sgPSBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0udGFza3NbTnVtYmVyKHRhc2tJbmRleCldO1xuICAgIHRhc2suZGVzY3JpcHRpb24gPSBuZXdEZXNjcmlwdGlvbjtcbiAgfTtcblxuICBjb25zdCBlZGl0VGFza0R1ZURhdGUgPSAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgsIG5ld0R1ZURhdGUpID0+IHtcbiAgICBjb25zdCB0YXNrID0gcHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldLnRhc2tzW051bWJlcih0YXNrSW5kZXgpXTtcbiAgICB0YXNrLmR1ZURhdGUgPSBuZXdEdWVEYXRlO1xuICB9O1xuXG4gIGNvbnN0IGVkaXRUYXNrUHJpb3JpdHkgPSAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgsIG5ld1ByaW9yaXR5KSA9PiB7XG4gICAgY29uc3QgdGFzayA9IHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXS50YXNrc1tOdW1iZXIodGFza0luZGV4KV07XG4gICAgdGFzay5wcmlvcml0eSA9IG5ld1ByaW9yaXR5O1xuICB9O1xuXG4gIGNvbnN0IGVkaXRUYXNrU3RhdHVzID0gKHByb2plY3RJbmRleCwgdGFza0luZGV4LCBuZXdTdGF0dXMpID0+IHtcbiAgICBjb25zdCB0YXNrID0gcHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldLnRhc2tzW051bWJlcih0YXNrSW5kZXgpXTtcbiAgICB0YXNrLnN0YXR1cyA9IG5ld1N0YXR1cztcbiAgfTtcblxuICBjb25zdCByZXZlYWxUYXNrID0gKHByb2plY3RJbmRleCwgdGFza0luZGV4KSA9PiB7XG4gICAgY29uc3QgdGFza0NvcHkgPSBkZWVwQ29weU9iamVjdChcbiAgICAgIHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXS50YXNrc1tOdW1iZXIodGFza0luZGV4KV0sXG4gICAgKTtcbiAgICByZXR1cm4gdGFza0NvcHk7XG4gIH07XG5cbiAgY29uc3Qgc3Vic2NyaWJlID0gKCkgPT4ge307XG5cbiAgcmV0dXJuIHtcbiAgICBjcmVhdGVOZXdUYXNrLFxuICAgIGRlbGV0ZVRhc2ssXG4gICAgZWRpdFRhc2tUaXRsZSxcbiAgICBlZGl0VGFza0Rlc2NyaXB0aW9uLFxuICAgIGVkaXRUYXNrRHVlRGF0ZSxcbiAgICBlZGl0VGFza1ByaW9yaXR5LFxuICAgIGVkaXRUYXNrU3RhdHVzLFxuICAgIHJldmVhbFRhc2ssXG4gICAgc3Vic2NyaWJlLFxuICB9O1xufSkoKTtcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblN0ZXAgTWFuYWdlclxuICAtIENyZWF0ZSAmIGRlbGV0ZSBzdGVwcyBpbiBhIHRhc2tcbiAgLSBFZGl0IHN0ZXAgZGVzY3JpcHRpb24gJiBzdGF0dXNcbiAgLSBDcmVhdGUgYSBzZmUgY29weSBvZiBhIHNpbmdsZSBzdGVwIGZvciBwdWJsaWMgdXNlXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuY29uc3Qgc3RlcE1hbmFnZXIgPSAoKCkgPT4ge1xuICBjb25zdCBjcmVhdGVOZXdTdGVwID0gKHByb2plY3RJbmRleCwgdGFza0luZGV4LCBkZXNjcmlwdGlvbiwgc3RhdHVzKSA9PiB7XG4gICAgY29uc3QgdGFzayA9IHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXS50YXNrc1tOdW1iZXIodGFza0luZGV4KV07XG4gICAgdGFzay5zdGVwcy5wdXNoKG5ldyBTdGVwKGRlc2NyaXB0aW9uLCBzdGF0dXMpKTtcbiAgfTtcblxuICBjb25zdCBkZWxldGVTdGVwID0gKHByb2plY3RJbmRleCwgdGFza0luZGV4LCBzdGVwSW5kZXgpID0+IHtcbiAgICBjb25zdCB0YXNrID0gcHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldLnRhc2tzW051bWJlcih0YXNrSW5kZXgpXTtcbiAgICBjb25zdCBpbmRleCA9IE51bWJlcihzdGVwSW5kZXgpO1xuICAgIHRhc2suc3RlcHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgfTtcblxuICBjb25zdCBlZGl0U3RlcERlc2NyaXB0aW9uID0gKFxuICAgIHByb2plY3RJbmRleCxcbiAgICB0YXNrSW5kZXgsXG4gICAgc3RlcEluZGV4LFxuICAgIG5ld0Rlc2NyaXB0aW9uLFxuICApID0+IHtcbiAgICBjb25zdCBzdGVwID1cbiAgICAgIHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXS50YXNrc1tOdW1iZXIodGFza0luZGV4KV0uc3RlcHNbXG4gICAgICAgIE51bWJlcihzdGVwSW5kZXgpXG4gICAgICBdO1xuICAgIHN0ZXAuZGVzY3JpcHRpb24gPSBuZXdEZXNjcmlwdGlvbjtcbiAgfTtcblxuICBjb25zdCBlZGl0U3RlcFN0YXR1cyA9IChwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCwgc3RlcEluZGV4LCBuZXdTdGF0dXMpID0+IHtcbiAgICBjb25zdCBzdGVwID1cbiAgICAgIHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXS50YXNrc1tOdW1iZXIodGFza0luZGV4KV0uc3RlcHNbXG4gICAgICAgIE51bWJlcihzdGVwSW5kZXgpXG4gICAgICBdO1xuICAgIHN0ZXAuc3RhdHVzID0gbmV3U3RhdHVzO1xuICB9O1xuXG4gIGNvbnN0IHJldmVhbFN0ZXAgPSAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgsIHN0ZXBJbmRleCkgPT4ge1xuICAgIGNvbnN0IHN0ZXBDb3B5ID0gZGVlcENvcHlPYmplY3QoXG4gICAgICBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0udGFza3NbTnVtYmVyKHRhc2tJbmRleCldLnN0ZXBzW1xuICAgICAgICBOdW1iZXIoc3RlcEluZGV4KVxuICAgICAgXSxcbiAgICApO1xuICAgIHJldHVybiBzdGVwQ29weTtcbiAgfTtcblxuICBjb25zdCBzdWJzY3JpYmUgPSAoKSA9PiB7fTtcblxuICByZXR1cm4ge1xuICAgIGNyZWF0ZU5ld1N0ZXAsXG4gICAgZGVsZXRlU3RlcCxcbiAgICBlZGl0U3RlcERlc2NyaXB0aW9uLFxuICAgIGVkaXRTdGVwU3RhdHVzLFxuICAgIHJldmVhbFN0ZXAsXG4gICAgc3Vic2NyaWJlLFxuICB9O1xufSkoKTtcblxuLyogcHJvamVjdE1hbmFnZXIuY3JlYXRlTmV3UHJvamVjdChcbiAgJ2NsZWFuaW5nJyxcbiAgJ2tpdGNoZW4sIGJhdGhyb29tLCBiZWRyb29tLCBsaXZpbmdyb29tJyxcbik7XG5wcm9qZWN0TWFuYWdlci5jcmVhdGVOZXdQcm9qZWN0KCdob3VzZXdvcmsnLCAnY29va2luZywgd2FzaGluZywgaXJvbmluZycpO1xucHJvamVjdE1hbmFnZXIuY3JlYXRlTmV3UHJvamVjdCgnc2hvcHBpbmcnLCAnZm9vZCwgY2xlYW5pbmcgcHJvZHVjdHMsIGNsb3RoZXMnKTtcblxudGFza01hbmFnZXIuY3JlYXRlTmV3VGFzaygxLCAnYmFrZSBjYWtlJywgJycsICcyMy0wNy0yMDIzJywgJ21lZGl1bScsICd0byBkbycpO1xudGFza01hbmFnZXIuY3JlYXRlTmV3VGFzaygxLCAnY29vayBkaW5uZXInLCAnJywgJzIzLTA3LTIwMjMnLCAnaGlnaCcsICd0byBkbycpO1xudGFza01hbmFnZXIuY3JlYXRlTmV3VGFzaygxLCAnY29vayB0ZWEnLCAnJywgJzIzLTA3LTIwMjMnLCAnaGlnaCcsICd0byBkbycpO1xuXG5zdGVwTWFuYWdlci5jcmVhdGVOZXdTdGVwKDEsIDAsICdnYXRoZXIgaW5ncmVkaWVudHMnLCAndG8gZG8nKTtcbnN0ZXBNYW5hZ2VyLmNyZWF0ZU5ld1N0ZXAoMSwgMCwgJ21peCBpbmdyZWRpZW50cycsICd0byBkbycpO1xuc3RlcE1hbmFnZXIuY3JlYXRlTmV3U3RlcCgxLCAwLCAnYmFrZSBpbiBvdmVuJywgJ3RvIGRvJyk7ICovXG5cbmV4cG9ydCB7IHByb2plY3RNYW5hZ2VyLCB0YXNrTWFuYWdlciwgc3RlcE1hbmFnZXIgfTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgcHJvamVjdE1hbmFnZXIgfSBmcm9tICcuL3RvRG9MaXN0JztcbmltcG9ydCBzdG9yYWdlTWFuYWdlciBmcm9tICcuL3N0b3JhZ2UnO1xuXG4vKiBwcm9qZWN0TWFuYWdlci5zdWJzY3JpYmUoKTtcbnN0b3JhZ2VNYW5hZ2VyLnN1YnNjcmliZSgpO1xuc3RvcmFnZU1hbmFnZXIuZ2V0U3RvcmFnZSgpOyAqL1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9