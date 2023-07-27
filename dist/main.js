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
  /* Initial function to get anything saved in localStorage - must be called  second in index.js, 
  immediately after the subscribe functions */
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
    _mediator__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe('updated all projects', setStorage);
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
  - Subscribe to mediator events
******************************************************************** */
const projectManager = (() => {
  const createNewProject = (title, description) => {
    const newProject = new Project(title, description);
    projects.push(newProject);

    _mediator__WEBPACK_IMPORTED_MODULE_0__["default"].publish('updated all projects', deepCopyArray(projects));
    _mediator__WEBPACK_IMPORTED_MODULE_0__["default"].publish(
      'new project created',
      deepCopyObject(projects[projects.length - 1]),
    );
  };

  const deleteProject = (projectIndex) => {
    const index = Number(projectIndex);
    projects.splice(index, 1);

    _mediator__WEBPACK_IMPORTED_MODULE_0__["default"].publish('updated all projects', deepCopyArray(projects));
  };

  /* Might not need this */
  const deleteProjectByName = (projectTitle) => {
    projects.forEach((project) => {
      if (project.title === projectTitle) {
        projects.splice(projects.indexOf(project), 1);
      }
    });

    _mediator__WEBPACK_IMPORTED_MODULE_0__["default"].publish('updated all projects', deepCopyArray(projects));
  };

  const editProjectTitle = (projectIndex, newTitle) => {
    projects[Number(projectIndex)].title = newTitle;

    _mediator__WEBPACK_IMPORTED_MODULE_0__["default"].publish('updated all projects', deepCopyArray(projects));
    _mediator__WEBPACK_IMPORTED_MODULE_0__["default"].publish(
      'updated project',
      deepCopyObject(projects[Number(projectIndex)]),
    );
  };

  const editProjectDescription = (projectIndex, newDescription) => {
    projects[Number(projectIndex)].description = newDescription;

    _mediator__WEBPACK_IMPORTED_MODULE_0__["default"].publish('updated all projects', deepCopyArray(projects));
    _mediator__WEBPACK_IMPORTED_MODULE_0__["default"].publish(
      'updated project',
      deepCopyObject(projects[Number(projectIndex)]),
    );
  };

  const revealProject = (projectIndex) => {
    const projectCopy = deepCopyObject(projects[Number(projectIndex)]);

    _mediator__WEBPACK_IMPORTED_MODULE_0__["default"].publish('revealed project', projectCopy);
  };

  const revealAllProjects = () => {
    const projectsCopy = deepCopyArray(projects);

    _mediator__WEBPACK_IMPORTED_MODULE_0__["default"].publish('revealed all projects', projectsCopy);
  };

  const initialise = (storedProjects) => {
    if (storedProjects.length === 0) {
      createNewProject('Inbox', '');
    } else {
      for (let i = 0; i < storedProjects.length; i++) {
        projects.push(storedProjects[i]);
      }
    }
    revealAllProjects();
  };

  const subscribe = () => {
    _mediator__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe('stored projects', initialise);
  };

  return {
    createNewProject,
    deleteProject,
    deleteProjectByName,
    editProjectTitle,
    editProjectDescription,
    revealProject,
    revealAllProjects,
    initialise,
    subscribe,
  };
})();

/* ********************************************************************
Task Manager
  - Create & delete tasks in a project
  - Edit task title, description, due date, priority & status
  - Create a safe copy of a single task for public use
  - Subscribe to mediator events
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
    project.tasks.push(new Task(title, description, dueDate, priority, status));

    _mediator__WEBPACK_IMPORTED_MODULE_0__["default"].publish('updated all projects', deepCopyArray(projects));
    _mediator__WEBPACK_IMPORTED_MODULE_0__["default"].publish(
      'new task created',
      deepCopyObject(project.tasks[project.tasks.length - 1]),
    );
  };

  const deleteTask = (projectIndex, taskIndex) => {
    const project = projects[Number(projectIndex)];
    const index = Number(taskIndex);
    project.tasks.splice(index, 1);

    _mediator__WEBPACK_IMPORTED_MODULE_0__["default"].publish('updated all projects', deepCopyArray(projects));
  };

  const editTaskTitle = (projectIndex, taskIndex, newTitle) => {
    const task = projects[Number(projectIndex)].tasks[Number(taskIndex)];
    task.title = newTitle;

    _mediator__WEBPACK_IMPORTED_MODULE_0__["default"].publish('updated all projects', deepCopyArray(projects));
    _mediator__WEBPACK_IMPORTED_MODULE_0__["default"].publish('updated task', deepCopyObject(task));
  };

  const editTaskDescription = (projectIndex, taskIndex, newDescription) => {
    const task = projects[Number(projectIndex)].tasks[Number(taskIndex)];
    task.description = newDescription;

    _mediator__WEBPACK_IMPORTED_MODULE_0__["default"].publish('updated all projects', deepCopyArray(projects));
    _mediator__WEBPACK_IMPORTED_MODULE_0__["default"].publish('updated task', deepCopyObject(task));
  };

  const editTaskDueDate = (projectIndex, taskIndex, newDueDate) => {
    const task = projects[Number(projectIndex)].tasks[Number(taskIndex)];
    task.dueDate = newDueDate;

    _mediator__WEBPACK_IMPORTED_MODULE_0__["default"].publish('updated all projects', deepCopyArray(projects));
    _mediator__WEBPACK_IMPORTED_MODULE_0__["default"].publish('updated task', deepCopyObject(task));
  };

  const editTaskPriority = (projectIndex, taskIndex, newPriority) => {
    const task = projects[Number(projectIndex)].tasks[Number(taskIndex)];
    task.priority = newPriority;

    _mediator__WEBPACK_IMPORTED_MODULE_0__["default"].publish('updated all projects', deepCopyArray(projects));
    _mediator__WEBPACK_IMPORTED_MODULE_0__["default"].publish('updated task', deepCopyObject(task));
  };

  const editTaskStatus = (projectIndex, taskIndex, newStatus) => {
    const task = projects[Number(projectIndex)].tasks[Number(taskIndex)];
    task.status = newStatus;

    _mediator__WEBPACK_IMPORTED_MODULE_0__["default"].publish('updated all projects', deepCopyArray(projects));
    _mediator__WEBPACK_IMPORTED_MODULE_0__["default"].publish('updated task', deepCopyObject(task));
  };

  const revealTask = (projectIndex, taskIndex) => {
    const taskCopy = deepCopyObject(
      projects[Number(projectIndex)].tasks[Number(taskIndex)],
    );

    _mediator__WEBPACK_IMPORTED_MODULE_0__["default"].publish('revealed task', taskCopy);
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
  - Subscribe to mediator events
******************************************************************** */
const stepManager = (() => {
  const createNewStep = (projectIndex, taskIndex, description, status) => {
    const task = projects[Number(projectIndex)].tasks[Number(taskIndex)];
    task.steps.push(new Step(description, status));

    _mediator__WEBPACK_IMPORTED_MODULE_0__["default"].publish('updated all projects', deepCopyArray(projects));
    _mediator__WEBPACK_IMPORTED_MODULE_0__["default"].publish(
      'new step created',
      deepCopyObject(task.steps[task.steps.length - 1]),
    );
  };

  const deleteStep = (projectIndex, taskIndex, stepIndex) => {
    const task = projects[Number(projectIndex)].tasks[Number(taskIndex)];
    const index = Number(stepIndex);
    task.steps.splice(index, 1);

    _mediator__WEBPACK_IMPORTED_MODULE_0__["default"].publish('updated all projects', deepCopyArray(projects));
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

    _mediator__WEBPACK_IMPORTED_MODULE_0__["default"].publish('updated all projects', deepCopyArray(projects));
    _mediator__WEBPACK_IMPORTED_MODULE_0__["default"].publish('updated step', deepCopyObject(step));
  };

  const editStepStatus = (projectIndex, taskIndex, stepIndex, newStatus) => {
    const step =
      projects[Number(projectIndex)].tasks[Number(taskIndex)].steps[
        Number(stepIndex)
      ];
    step.status = newStatus;

    _mediator__WEBPACK_IMPORTED_MODULE_0__["default"].publish('updated all projects', deepCopyArray(projects));
    _mediator__WEBPACK_IMPORTED_MODULE_0__["default"].publish('updated step', deepCopyObject(step));
  };

  const revealStep = (projectIndex, taskIndex, stepIndex) => {
    const stepCopy = deepCopyObject(
      projects[Number(projectIndex)].tasks[Number(taskIndex)].steps[
        Number(stepIndex)
      ],
    );

    _mediator__WEBPACK_IMPORTED_MODULE_0__["default"].publish('revealed step', stepCopy);
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



_toDoList__WEBPACK_IMPORTED_MODULE_0__.projectManager.subscribe();
_storage__WEBPACK_IMPORTED_MODULE_1__["default"].subscribe();

_storage__WEBPACK_IMPORTED_MODULE_1__["default"].getStorage();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLDhCQUE4QjtBQUNwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxXQUFXO0FBQ1gsQ0FBQzs7QUFFRCxpRUFBZSxRQUFRLEVBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7QUM5Q1U7O0FBRWxDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsSUFBSSxpREFBUTtBQUNaOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsSUFBSSxpREFBUTtBQUNaOztBQUVBLFdBQVc7QUFDWCxDQUFDOztBQUVELGlFQUFlLGNBQWMsRUFBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDMUI5Qjs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ2tDOztBQUVsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLElBQUksaURBQVE7QUFDWixJQUFJLGlEQUFRO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLElBQUksaURBQVE7QUFDWjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMLElBQUksaURBQVE7QUFDWjs7QUFFQTtBQUNBOztBQUVBLElBQUksaURBQVE7QUFDWixJQUFJLGlEQUFRO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxJQUFJLGlEQUFRO0FBQ1osSUFBSSxpREFBUTtBQUNaO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsSUFBSSxpREFBUTtBQUNaOztBQUVBO0FBQ0E7O0FBRUEsSUFBSSxpREFBUTtBQUNaOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTixzQkFBc0IsMkJBQTJCO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxJQUFJLGlEQUFRO0FBQ1o7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLElBQUksaURBQVE7QUFDWixJQUFJLGlEQUFRO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsSUFBSSxpREFBUTtBQUNaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxJQUFJLGlEQUFRO0FBQ1osSUFBSSxpREFBUTtBQUNaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxJQUFJLGlEQUFRO0FBQ1osSUFBSSxpREFBUTtBQUNaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxJQUFJLGlEQUFRO0FBQ1osSUFBSSxpREFBUTtBQUNaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxJQUFJLGlEQUFRO0FBQ1osSUFBSSxpREFBUTtBQUNaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxJQUFJLGlEQUFRO0FBQ1osSUFBSSxpREFBUTtBQUNaOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLElBQUksaURBQVE7QUFDWjs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLElBQUksaURBQVE7QUFDWixJQUFJLGlEQUFRO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsSUFBSSxpREFBUTtBQUNaOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsSUFBSSxpREFBUTtBQUNaLElBQUksaURBQVE7QUFDWjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsSUFBSSxpREFBUTtBQUNaLElBQUksaURBQVE7QUFDWjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsSUFBSSxpREFBUTtBQUNaO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRW1EOzs7Ozs7O1VDN1ZwRDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7OztBQ040QztBQUNMOztBQUV2QyxxREFBYztBQUNkLGdEQUFjOztBQUVkLGdEQUFjIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdG8tZG8tbGlzdC8uL3NyYy9tZWRpYXRvci5qcyIsIndlYnBhY2s6Ly90by1kby1saXN0Ly4vc3JjL3N0b3JhZ2UuanMiLCJ3ZWJwYWNrOi8vdG8tZG8tbGlzdC8uL3NyYy90b0RvTGlzdC5qcyIsIndlYnBhY2s6Ly90by1kby1saXN0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3RvLWRvLWxpc3Qvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3RvLWRvLWxpc3Qvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly90by1kby1saXN0L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdG8tZG8tbGlzdC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBFdmVudHM6XG5cdFB1Ymxpc2hlZCBieSBzdG9yYWdlLmpzOlxuXHQtICdzdG9yZWQgcHJvamVjdHMnIC0gcHVibGlzaGVzIGFsbCBwcm9qZWN0cyBzYXZlZCBpbiBzdG9yYWdlIGFzIGFuIGFycmF5XG5cblx0UHVibGlzaGVkIGJ5IHRvRG9MaXN0LmpzOlxuXHQtICd1cGRhdGVkIGFsbCBwcm9qZWN0cycgLSBwdWJsaXNoZXMgYWxsIHByb2plY3RzIChhcnJheSkgd2hlbiBhIGNoYW5nZSBvY2N1cnNcblx0LSAncmV2ZWFsZWQgYWxsIHByb2plY3RzJyAtIHB1Ymxpc2hlcyBhbGwgY3VycmVudCBwcm9qZWN0cyAoYXJyYXkpIHdoZW4gbm90aGluZyBoYXMgYmVlbiBhbHRlcmVkXG5cdC0gJ25ldyBwcm9qZWN0IGNyZWF0ZWQnIC0gcHVibGlzaGVzIGEgc2luZ2xlIHByb2plY3QgKG9iamVjdCkgd2hlbiBpdCBpcyBjcmVhdGVkXG5cdC0gJ3VwZGF0ZWQgcHJvamVjdCcgLSBwdWJsaXNoZXMgYSBzaW5nbGUgcHJvamVjdCAob2JqZWN0KSB3aGVuIGEgY2hhbmdlIG9jY3Vyc1xuXHQtICdyZXZlYWxlZCBwcm9qZWN0JyAtIHB1Ymxpc2hlcyBhIHNpbmdsZSBwcm9qZWN0IChvYmplY3QpIHRoYXQgaGFzbid0IGJlZW4gYWx0ZXJlZFxuXHQtICduZXcgdGFzayBjcmVhdGVkJyAtIHB1Ymxpc2hlcyBhIHNpbmdsZSB0YXNrIChvYmplY3QpIHdoZW4gaXQgaXMgY3JlYXRlZFxuXHQtICd1cGRhdGVkIHRhc2snIC0gcHVibGlzaGVzIGEgc2luZ2xlIHRhc2sgKG9iamVjdCkgd2hlbiBhIGNoYW5nZSBvY2N1cnNcblx0LSAncmV2ZWFsZWQgdGFzaycgLSBwdWJsaXNoZXMgYSBzaW5nbGUgdGFzayAob2JqZWN0KSB0aGF0IGhhc24ndCBiZWVuIGFsdGVyZWRcblx0LSAnbmV3IHN0ZXAgY3JlYXRlZCcgLSBwdWJsaXNoZXMgYSBzaW5nbGUgc3RlcCAob2JqZWN0KSB3aGVuIGl0IGlzIGNyZWF0ZWRcblx0LSAndXBkYXRlZCBzdGVwJyAtIHB1Ymxpc2hlcyBhIHNpbmdsZSBzdGVwIChvYmplY3QpIHdoZW4gYSBjaGFuZ2Ugb2NjdXJzXG5cdC0gJ3JldmVhbGVkIHN0ZXAnIC0gcHVibGlzaGVzIGEgc2luZ2xlIHN0ZXAgKG9iamVjdCkgdGhhdCBoYXNuJ3QgYmVlbiBhbHRlcmVkXG5cblx0UHVibGlzaGVkIGJ5IHVpLmpzOlxuKi9cblxuY29uc3QgbWVkaWF0b3IgPSAoKCkgPT4ge1xuICBjb25zdCBldmVudHMgPSB7fTtcbiAgY29uc3Qgc3Vic2NyaWJlID0gKGV2ZW50TmFtZSwgZnVuY3Rpb25Ub1NldE9mZikgPT4ge1xuICAgIGV2ZW50c1tldmVudE5hbWVdID0gZXZlbnRzW2V2ZW50TmFtZV0gfHwgW107XG4gICAgZXZlbnRzW2V2ZW50TmFtZV0ucHVzaChmdW5jdGlvblRvU2V0T2ZmKTtcbiAgfTtcbiAgY29uc3QgdW5zdWJzY3JpYmUgPSAoZXZlbnROYW1lLCBmdW5jdGlvblRvUmVtb3ZlKSA9PiB7XG4gICAgaWYgKGV2ZW50c1tldmVudE5hbWVdKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGV2ZW50c1tldmVudE5hbWVdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChldmVudHNbZXZlbnROYW1lXVtpXSA9PT0gZnVuY3Rpb25Ub1JlbW92ZSkge1xuICAgICAgICAgIGV2ZW50c1tldmVudE5hbWVdLnNwbGljZShpLCAxKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgY29uc3QgcHVibGlzaCA9IChldmVudE5hbWUsIGRhdGEpID0+IHtcbiAgICBpZiAoZXZlbnRzW2V2ZW50TmFtZV0pIHtcbiAgICAgIGV2ZW50c1tldmVudE5hbWVdLmZvckVhY2goKGZ1bmN0aW9uVG9SdW4pID0+IHtcbiAgICAgICAgZnVuY3Rpb25Ub1J1bihkYXRhKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHsgc3Vic2NyaWJlLCB1bnN1YnNjcmliZSwgcHVibGlzaCB9O1xufSkoKTtcblxuZXhwb3J0IGRlZmF1bHQgbWVkaWF0b3I7XG4iLCJpbXBvcnQgbWVkaWF0b3IgZnJvbSAnLi9tZWRpYXRvcic7XG5cbmNvbnN0IHN0b3JhZ2VNYW5hZ2VyID0gKCgpID0+IHtcbiAgLyogSW5pdGlhbCBmdW5jdGlvbiB0byBnZXQgYW55dGhpbmcgc2F2ZWQgaW4gbG9jYWxTdG9yYWdlIC0gbXVzdCBiZSBjYWxsZWQgIHNlY29uZCBpbiBpbmRleC5qcywgXG4gIGltbWVkaWF0ZWx5IGFmdGVyIHRoZSBzdWJzY3JpYmUgZnVuY3Rpb25zICovXG4gIGNvbnN0IGdldFN0b3JhZ2UgPSAoKSA9PiB7XG4gICAgbGV0IHRvRG9MaXN0ID0gW107XG4gICAgaWYgKGxvY2FsU3RvcmFnZS50b0RvTGlzdCkge1xuICAgICAgdG9Eb0xpc3QgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0b0RvTGlzdCcpKTtcbiAgICB9XG5cbiAgICBtZWRpYXRvci5wdWJsaXNoKCdzdG9yZWQgcHJvamVjdHMnLCB0b0RvTGlzdCk7XG4gIH07XG5cbiAgY29uc3Qgc2V0U3RvcmFnZSA9IChwcm9qZWN0cykgPT4ge1xuICAgIGNvbnN0IHRvRG9MaXN0ID0gSlNPTi5zdHJpbmdpZnkocHJvamVjdHMpO1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd0b0RvTGlzdCcsIHRvRG9MaXN0KTtcbiAgfTtcblxuICBjb25zdCBzdWJzY3JpYmUgPSAoKSA9PiB7XG4gICAgbWVkaWF0b3Iuc3Vic2NyaWJlKCd1cGRhdGVkIGFsbCBwcm9qZWN0cycsIHNldFN0b3JhZ2UpO1xuICB9O1xuXG4gIHJldHVybiB7IGdldFN0b3JhZ2UsIHNldFN0b3JhZ2UsIHN1YnNjcmliZSB9O1xufSkoKTtcblxuZXhwb3J0IGRlZmF1bHQgc3RvcmFnZU1hbmFnZXI7XG4iLCIvKiBDb250ZW50czpcblxuICBDb25zdHJ1Y3RvcnMgLSBUYXNrLCBTdGVwICYgUHJvamVjdFxuXG4gIEZ1bmN0aW9ucyB0byBkZWVwIGNsb25lIGFycmF5cyBhbmQgb2JqZWN0c1xuXG4gIFByb2plY3QgTWFuYWdlclxuXG4gIFRhc2sgTWFuYWdlclxuXG4gIFN0ZXAgTWFuYWdlclxuKi9cbmltcG9ydCBtZWRpYXRvciBmcm9tICcuL21lZGlhdG9yJztcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbkNvbnN0cnVjdG9ycyAtIFRhc2ssIFN0ZXAgJiBQcm9qZWN0XG4gIC0gU3RlcCBnb2VzIGluc2lkZSBUYXNrLnN0ZXBzW11cbiAgLSBUYXNrIGdvZXMgaW5zaWRlIFByb2plY3QudGFza3NbXVxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbmNsYXNzIFRhc2sge1xuICBjb25zdHJ1Y3Rvcih0aXRsZSwgZGVzY3JpcHRpb24sIGR1ZURhdGUsIHByaW9yaXR5LCBzdGF0dXMpIHtcbiAgICB0aGlzLnRpdGxlID0gdGl0bGU7XG4gICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xuICAgIHRoaXMuc3RlcHMgPSBbXTtcbiAgICB0aGlzLmR1ZURhdGUgPSBkdWVEYXRlO1xuICAgIHRoaXMucHJpb3JpdHkgPSBwcmlvcml0eTtcbiAgICB0aGlzLnN0YXR1cyA9IHN0YXR1cztcbiAgfVxufVxuXG5jbGFzcyBTdGVwIHtcbiAgY29uc3RydWN0b3IoZGVzY3JpcHRpb24sIHN0YXR1cykge1xuICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcbiAgICB0aGlzLnN0YXR1cyA9IHN0YXR1cztcbiAgfVxufVxuXG5jbGFzcyBQcm9qZWN0IHtcbiAgY29uc3RydWN0b3IodGl0bGUsIGRlc2NyaXB0aW9uKSB7XG4gICAgdGhpcy50aXRsZSA9IHRpdGxlO1xuICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcbiAgICB0aGlzLnRhc2tzID0gW107XG4gIH1cbn1cblxuY29uc3QgcHJvamVjdHMgPSBbXTtcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbkZ1bmN0aW9ucyB0byBkZWVwIGNsb25lIGFycmF5cyBhbmQgb2JqZWN0c1xuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbmNvbnN0IGRlZXBDb3B5QXJyYXkgPSAoYXJyYXkpID0+IHtcbiAgY29uc3QgYXJyYXlDb3B5ID0gW107XG4gIGFycmF5LmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShpdGVtKSkge1xuICAgICAgYXJyYXlDb3B5LnB1c2goZGVlcENvcHlBcnJheShpdGVtKSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgaXRlbSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGFycmF5Q29weS5wdXNoKGRlZXBDb3B5T2JqZWN0KGl0ZW0pKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXJyYXlDb3B5LnB1c2goaXRlbSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGFycmF5Q29weTtcbn07XG5cbmNvbnN0IGRlZXBDb3B5T2JqZWN0ID0gKG9iamVjdCkgPT4ge1xuICBjb25zdCBvYmplY3RDb3B5ID0ge307XG4gIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKG9iamVjdCkpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgIG9iamVjdENvcHlba2V5XSA9IGRlZXBDb3B5QXJyYXkodmFsdWUpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgICAgb2JqZWN0Q29weVtrZXldID0gZGVlcENvcHlPYmplY3QodmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvYmplY3RDb3B5W2tleV0gPSB2YWx1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG9iamVjdENvcHk7XG59O1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuUHJvamVjdCBNYW5hZ2VyXG4gIC0gQ3JlYXRlICYgZGVsZXRlIHByb2plY3RzXG4gIC0gRWRpdCBwcm9qZWN0IHRpdGxlcyAmIGRlc2NyaXB0aW9uc1xuICAtIENyZWF0ZSBhIHNhZmUgY29weSBvZiBhIHByb2plY3QgJiBvZiB0aGUgcHJvamVjdHMgYXJyYXkgZm9yIHB1YmxpYyB1c2VcbiAgLSBTdWJzY3JpYmUgdG8gbWVkaWF0b3IgZXZlbnRzXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuY29uc3QgcHJvamVjdE1hbmFnZXIgPSAoKCkgPT4ge1xuICBjb25zdCBjcmVhdGVOZXdQcm9qZWN0ID0gKHRpdGxlLCBkZXNjcmlwdGlvbikgPT4ge1xuICAgIGNvbnN0IG5ld1Byb2plY3QgPSBuZXcgUHJvamVjdCh0aXRsZSwgZGVzY3JpcHRpb24pO1xuICAgIHByb2plY3RzLnB1c2gobmV3UHJvamVjdCk7XG5cbiAgICBtZWRpYXRvci5wdWJsaXNoKCd1cGRhdGVkIGFsbCBwcm9qZWN0cycsIGRlZXBDb3B5QXJyYXkocHJvamVjdHMpKTtcbiAgICBtZWRpYXRvci5wdWJsaXNoKFxuICAgICAgJ25ldyBwcm9qZWN0IGNyZWF0ZWQnLFxuICAgICAgZGVlcENvcHlPYmplY3QocHJvamVjdHNbcHJvamVjdHMubGVuZ3RoIC0gMV0pLFxuICAgICk7XG4gIH07XG5cbiAgY29uc3QgZGVsZXRlUHJvamVjdCA9IChwcm9qZWN0SW5kZXgpID0+IHtcbiAgICBjb25zdCBpbmRleCA9IE51bWJlcihwcm9qZWN0SW5kZXgpO1xuICAgIHByb2plY3RzLnNwbGljZShpbmRleCwgMSk7XG5cbiAgICBtZWRpYXRvci5wdWJsaXNoKCd1cGRhdGVkIGFsbCBwcm9qZWN0cycsIGRlZXBDb3B5QXJyYXkocHJvamVjdHMpKTtcbiAgfTtcblxuICAvKiBNaWdodCBub3QgbmVlZCB0aGlzICovXG4gIGNvbnN0IGRlbGV0ZVByb2plY3RCeU5hbWUgPSAocHJvamVjdFRpdGxlKSA9PiB7XG4gICAgcHJvamVjdHMuZm9yRWFjaCgocHJvamVjdCkgPT4ge1xuICAgICAgaWYgKHByb2plY3QudGl0bGUgPT09IHByb2plY3RUaXRsZSkge1xuICAgICAgICBwcm9qZWN0cy5zcGxpY2UocHJvamVjdHMuaW5kZXhPZihwcm9qZWN0KSwgMSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBtZWRpYXRvci5wdWJsaXNoKCd1cGRhdGVkIGFsbCBwcm9qZWN0cycsIGRlZXBDb3B5QXJyYXkocHJvamVjdHMpKTtcbiAgfTtcblxuICBjb25zdCBlZGl0UHJvamVjdFRpdGxlID0gKHByb2plY3RJbmRleCwgbmV3VGl0bGUpID0+IHtcbiAgICBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0udGl0bGUgPSBuZXdUaXRsZTtcblxuICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3VwZGF0ZWQgYWxsIHByb2plY3RzJywgZGVlcENvcHlBcnJheShwcm9qZWN0cykpO1xuICAgIG1lZGlhdG9yLnB1Ymxpc2goXG4gICAgICAndXBkYXRlZCBwcm9qZWN0JyxcbiAgICAgIGRlZXBDb3B5T2JqZWN0KHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXSksXG4gICAgKTtcbiAgfTtcblxuICBjb25zdCBlZGl0UHJvamVjdERlc2NyaXB0aW9uID0gKHByb2plY3RJbmRleCwgbmV3RGVzY3JpcHRpb24pID0+IHtcbiAgICBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0uZGVzY3JpcHRpb24gPSBuZXdEZXNjcmlwdGlvbjtcblxuICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3VwZGF0ZWQgYWxsIHByb2plY3RzJywgZGVlcENvcHlBcnJheShwcm9qZWN0cykpO1xuICAgIG1lZGlhdG9yLnB1Ymxpc2goXG4gICAgICAndXBkYXRlZCBwcm9qZWN0JyxcbiAgICAgIGRlZXBDb3B5T2JqZWN0KHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXSksXG4gICAgKTtcbiAgfTtcblxuICBjb25zdCByZXZlYWxQcm9qZWN0ID0gKHByb2plY3RJbmRleCkgPT4ge1xuICAgIGNvbnN0IHByb2plY3RDb3B5ID0gZGVlcENvcHlPYmplY3QocHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldKTtcblxuICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3JldmVhbGVkIHByb2plY3QnLCBwcm9qZWN0Q29weSk7XG4gIH07XG5cbiAgY29uc3QgcmV2ZWFsQWxsUHJvamVjdHMgPSAoKSA9PiB7XG4gICAgY29uc3QgcHJvamVjdHNDb3B5ID0gZGVlcENvcHlBcnJheShwcm9qZWN0cyk7XG5cbiAgICBtZWRpYXRvci5wdWJsaXNoKCdyZXZlYWxlZCBhbGwgcHJvamVjdHMnLCBwcm9qZWN0c0NvcHkpO1xuICB9O1xuXG4gIGNvbnN0IGluaXRpYWxpc2UgPSAoc3RvcmVkUHJvamVjdHMpID0+IHtcbiAgICBpZiAoc3RvcmVkUHJvamVjdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICBjcmVhdGVOZXdQcm9qZWN0KCdJbmJveCcsICcnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdG9yZWRQcm9qZWN0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBwcm9qZWN0cy5wdXNoKHN0b3JlZFByb2plY3RzW2ldKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV2ZWFsQWxsUHJvamVjdHMoKTtcbiAgfTtcblxuICBjb25zdCBzdWJzY3JpYmUgPSAoKSA9PiB7XG4gICAgbWVkaWF0b3Iuc3Vic2NyaWJlKCdzdG9yZWQgcHJvamVjdHMnLCBpbml0aWFsaXNlKTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGNyZWF0ZU5ld1Byb2plY3QsXG4gICAgZGVsZXRlUHJvamVjdCxcbiAgICBkZWxldGVQcm9qZWN0QnlOYW1lLFxuICAgIGVkaXRQcm9qZWN0VGl0bGUsXG4gICAgZWRpdFByb2plY3REZXNjcmlwdGlvbixcbiAgICByZXZlYWxQcm9qZWN0LFxuICAgIHJldmVhbEFsbFByb2plY3RzLFxuICAgIGluaXRpYWxpc2UsXG4gICAgc3Vic2NyaWJlLFxuICB9O1xufSkoKTtcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblRhc2sgTWFuYWdlclxuICAtIENyZWF0ZSAmIGRlbGV0ZSB0YXNrcyBpbiBhIHByb2plY3RcbiAgLSBFZGl0IHRhc2sgdGl0bGUsIGRlc2NyaXB0aW9uLCBkdWUgZGF0ZSwgcHJpb3JpdHkgJiBzdGF0dXNcbiAgLSBDcmVhdGUgYSBzYWZlIGNvcHkgb2YgYSBzaW5nbGUgdGFzayBmb3IgcHVibGljIHVzZVxuICAtIFN1YnNjcmliZSB0byBtZWRpYXRvciBldmVudHNcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5jb25zdCB0YXNrTWFuYWdlciA9ICgoKSA9PiB7XG4gIGNvbnN0IGNyZWF0ZU5ld1Rhc2sgPSAoXG4gICAgcHJvamVjdEluZGV4LFxuICAgIHRpdGxlLFxuICAgIGRlc2NyaXB0aW9uLFxuICAgIGR1ZURhdGUsXG4gICAgcHJpb3JpdHksXG4gICAgc3RhdHVzLFxuICApID0+IHtcbiAgICBjb25zdCBwcm9qZWN0ID0gcHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldO1xuICAgIHByb2plY3QudGFza3MucHVzaChuZXcgVGFzayh0aXRsZSwgZGVzY3JpcHRpb24sIGR1ZURhdGUsIHByaW9yaXR5LCBzdGF0dXMpKTtcblxuICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3VwZGF0ZWQgYWxsIHByb2plY3RzJywgZGVlcENvcHlBcnJheShwcm9qZWN0cykpO1xuICAgIG1lZGlhdG9yLnB1Ymxpc2goXG4gICAgICAnbmV3IHRhc2sgY3JlYXRlZCcsXG4gICAgICBkZWVwQ29weU9iamVjdChwcm9qZWN0LnRhc2tzW3Byb2plY3QudGFza3MubGVuZ3RoIC0gMV0pLFxuICAgICk7XG4gIH07XG5cbiAgY29uc3QgZGVsZXRlVGFzayA9IChwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCkgPT4ge1xuICAgIGNvbnN0IHByb2plY3QgPSBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV07XG4gICAgY29uc3QgaW5kZXggPSBOdW1iZXIodGFza0luZGV4KTtcbiAgICBwcm9qZWN0LnRhc2tzLnNwbGljZShpbmRleCwgMSk7XG5cbiAgICBtZWRpYXRvci5wdWJsaXNoKCd1cGRhdGVkIGFsbCBwcm9qZWN0cycsIGRlZXBDb3B5QXJyYXkocHJvamVjdHMpKTtcbiAgfTtcblxuICBjb25zdCBlZGl0VGFza1RpdGxlID0gKHByb2plY3RJbmRleCwgdGFza0luZGV4LCBuZXdUaXRsZSkgPT4ge1xuICAgIGNvbnN0IHRhc2sgPSBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0udGFza3NbTnVtYmVyKHRhc2tJbmRleCldO1xuICAgIHRhc2sudGl0bGUgPSBuZXdUaXRsZTtcblxuICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3VwZGF0ZWQgYWxsIHByb2plY3RzJywgZGVlcENvcHlBcnJheShwcm9qZWN0cykpO1xuICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3VwZGF0ZWQgdGFzaycsIGRlZXBDb3B5T2JqZWN0KHRhc2spKTtcbiAgfTtcblxuICBjb25zdCBlZGl0VGFza0Rlc2NyaXB0aW9uID0gKHByb2plY3RJbmRleCwgdGFza0luZGV4LCBuZXdEZXNjcmlwdGlvbikgPT4ge1xuICAgIGNvbnN0IHRhc2sgPSBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0udGFza3NbTnVtYmVyKHRhc2tJbmRleCldO1xuICAgIHRhc2suZGVzY3JpcHRpb24gPSBuZXdEZXNjcmlwdGlvbjtcblxuICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3VwZGF0ZWQgYWxsIHByb2plY3RzJywgZGVlcENvcHlBcnJheShwcm9qZWN0cykpO1xuICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3VwZGF0ZWQgdGFzaycsIGRlZXBDb3B5T2JqZWN0KHRhc2spKTtcbiAgfTtcblxuICBjb25zdCBlZGl0VGFza0R1ZURhdGUgPSAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgsIG5ld0R1ZURhdGUpID0+IHtcbiAgICBjb25zdCB0YXNrID0gcHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldLnRhc2tzW051bWJlcih0YXNrSW5kZXgpXTtcbiAgICB0YXNrLmR1ZURhdGUgPSBuZXdEdWVEYXRlO1xuXG4gICAgbWVkaWF0b3IucHVibGlzaCgndXBkYXRlZCBhbGwgcHJvamVjdHMnLCBkZWVwQ29weUFycmF5KHByb2plY3RzKSk7XG4gICAgbWVkaWF0b3IucHVibGlzaCgndXBkYXRlZCB0YXNrJywgZGVlcENvcHlPYmplY3QodGFzaykpO1xuICB9O1xuXG4gIGNvbnN0IGVkaXRUYXNrUHJpb3JpdHkgPSAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgsIG5ld1ByaW9yaXR5KSA9PiB7XG4gICAgY29uc3QgdGFzayA9IHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXS50YXNrc1tOdW1iZXIodGFza0luZGV4KV07XG4gICAgdGFzay5wcmlvcml0eSA9IG5ld1ByaW9yaXR5O1xuXG4gICAgbWVkaWF0b3IucHVibGlzaCgndXBkYXRlZCBhbGwgcHJvamVjdHMnLCBkZWVwQ29weUFycmF5KHByb2plY3RzKSk7XG4gICAgbWVkaWF0b3IucHVibGlzaCgndXBkYXRlZCB0YXNrJywgZGVlcENvcHlPYmplY3QodGFzaykpO1xuICB9O1xuXG4gIGNvbnN0IGVkaXRUYXNrU3RhdHVzID0gKHByb2plY3RJbmRleCwgdGFza0luZGV4LCBuZXdTdGF0dXMpID0+IHtcbiAgICBjb25zdCB0YXNrID0gcHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldLnRhc2tzW051bWJlcih0YXNrSW5kZXgpXTtcbiAgICB0YXNrLnN0YXR1cyA9IG5ld1N0YXR1cztcblxuICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3VwZGF0ZWQgYWxsIHByb2plY3RzJywgZGVlcENvcHlBcnJheShwcm9qZWN0cykpO1xuICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3VwZGF0ZWQgdGFzaycsIGRlZXBDb3B5T2JqZWN0KHRhc2spKTtcbiAgfTtcblxuICBjb25zdCByZXZlYWxUYXNrID0gKHByb2plY3RJbmRleCwgdGFza0luZGV4KSA9PiB7XG4gICAgY29uc3QgdGFza0NvcHkgPSBkZWVwQ29weU9iamVjdChcbiAgICAgIHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXS50YXNrc1tOdW1iZXIodGFza0luZGV4KV0sXG4gICAgKTtcblxuICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3JldmVhbGVkIHRhc2snLCB0YXNrQ29weSk7XG4gIH07XG5cbiAgY29uc3Qgc3Vic2NyaWJlID0gKCkgPT4ge307XG5cbiAgcmV0dXJuIHtcbiAgICBjcmVhdGVOZXdUYXNrLFxuICAgIGRlbGV0ZVRhc2ssXG4gICAgZWRpdFRhc2tUaXRsZSxcbiAgICBlZGl0VGFza0Rlc2NyaXB0aW9uLFxuICAgIGVkaXRUYXNrRHVlRGF0ZSxcbiAgICBlZGl0VGFza1ByaW9yaXR5LFxuICAgIGVkaXRUYXNrU3RhdHVzLFxuICAgIHJldmVhbFRhc2ssXG4gICAgc3Vic2NyaWJlLFxuICB9O1xufSkoKTtcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblN0ZXAgTWFuYWdlclxuICAtIENyZWF0ZSAmIGRlbGV0ZSBzdGVwcyBpbiBhIHRhc2tcbiAgLSBFZGl0IHN0ZXAgZGVzY3JpcHRpb24gJiBzdGF0dXNcbiAgLSBDcmVhdGUgYSBzZmUgY29weSBvZiBhIHNpbmdsZSBzdGVwIGZvciBwdWJsaWMgdXNlXG4gIC0gU3Vic2NyaWJlIHRvIG1lZGlhdG9yIGV2ZW50c1xuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbmNvbnN0IHN0ZXBNYW5hZ2VyID0gKCgpID0+IHtcbiAgY29uc3QgY3JlYXRlTmV3U3RlcCA9IChwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCwgZGVzY3JpcHRpb24sIHN0YXR1cykgPT4ge1xuICAgIGNvbnN0IHRhc2sgPSBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0udGFza3NbTnVtYmVyKHRhc2tJbmRleCldO1xuICAgIHRhc2suc3RlcHMucHVzaChuZXcgU3RlcChkZXNjcmlwdGlvbiwgc3RhdHVzKSk7XG5cbiAgICBtZWRpYXRvci5wdWJsaXNoKCd1cGRhdGVkIGFsbCBwcm9qZWN0cycsIGRlZXBDb3B5QXJyYXkocHJvamVjdHMpKTtcbiAgICBtZWRpYXRvci5wdWJsaXNoKFxuICAgICAgJ25ldyBzdGVwIGNyZWF0ZWQnLFxuICAgICAgZGVlcENvcHlPYmplY3QodGFzay5zdGVwc1t0YXNrLnN0ZXBzLmxlbmd0aCAtIDFdKSxcbiAgICApO1xuICB9O1xuXG4gIGNvbnN0IGRlbGV0ZVN0ZXAgPSAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgsIHN0ZXBJbmRleCkgPT4ge1xuICAgIGNvbnN0IHRhc2sgPSBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0udGFza3NbTnVtYmVyKHRhc2tJbmRleCldO1xuICAgIGNvbnN0IGluZGV4ID0gTnVtYmVyKHN0ZXBJbmRleCk7XG4gICAgdGFzay5zdGVwcy5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gICAgbWVkaWF0b3IucHVibGlzaCgndXBkYXRlZCBhbGwgcHJvamVjdHMnLCBkZWVwQ29weUFycmF5KHByb2plY3RzKSk7XG4gIH07XG5cbiAgY29uc3QgZWRpdFN0ZXBEZXNjcmlwdGlvbiA9IChcbiAgICBwcm9qZWN0SW5kZXgsXG4gICAgdGFza0luZGV4LFxuICAgIHN0ZXBJbmRleCxcbiAgICBuZXdEZXNjcmlwdGlvbixcbiAgKSA9PiB7XG4gICAgY29uc3Qgc3RlcCA9XG4gICAgICBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0udGFza3NbTnVtYmVyKHRhc2tJbmRleCldLnN0ZXBzW1xuICAgICAgICBOdW1iZXIoc3RlcEluZGV4KVxuICAgICAgXTtcbiAgICBzdGVwLmRlc2NyaXB0aW9uID0gbmV3RGVzY3JpcHRpb247XG5cbiAgICBtZWRpYXRvci5wdWJsaXNoKCd1cGRhdGVkIGFsbCBwcm9qZWN0cycsIGRlZXBDb3B5QXJyYXkocHJvamVjdHMpKTtcbiAgICBtZWRpYXRvci5wdWJsaXNoKCd1cGRhdGVkIHN0ZXAnLCBkZWVwQ29weU9iamVjdChzdGVwKSk7XG4gIH07XG5cbiAgY29uc3QgZWRpdFN0ZXBTdGF0dXMgPSAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgsIHN0ZXBJbmRleCwgbmV3U3RhdHVzKSA9PiB7XG4gICAgY29uc3Qgc3RlcCA9XG4gICAgICBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0udGFza3NbTnVtYmVyKHRhc2tJbmRleCldLnN0ZXBzW1xuICAgICAgICBOdW1iZXIoc3RlcEluZGV4KVxuICAgICAgXTtcbiAgICBzdGVwLnN0YXR1cyA9IG5ld1N0YXR1cztcblxuICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3VwZGF0ZWQgYWxsIHByb2plY3RzJywgZGVlcENvcHlBcnJheShwcm9qZWN0cykpO1xuICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3VwZGF0ZWQgc3RlcCcsIGRlZXBDb3B5T2JqZWN0KHN0ZXApKTtcbiAgfTtcblxuICBjb25zdCByZXZlYWxTdGVwID0gKHByb2plY3RJbmRleCwgdGFza0luZGV4LCBzdGVwSW5kZXgpID0+IHtcbiAgICBjb25zdCBzdGVwQ29weSA9IGRlZXBDb3B5T2JqZWN0KFxuICAgICAgcHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldLnRhc2tzW051bWJlcih0YXNrSW5kZXgpXS5zdGVwc1tcbiAgICAgICAgTnVtYmVyKHN0ZXBJbmRleClcbiAgICAgIF0sXG4gICAgKTtcblxuICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3JldmVhbGVkIHN0ZXAnLCBzdGVwQ29weSk7XG4gICAgcmV0dXJuIHN0ZXBDb3B5O1xuICB9O1xuXG4gIGNvbnN0IHN1YnNjcmliZSA9ICgpID0+IHt9O1xuXG4gIHJldHVybiB7XG4gICAgY3JlYXRlTmV3U3RlcCxcbiAgICBkZWxldGVTdGVwLFxuICAgIGVkaXRTdGVwRGVzY3JpcHRpb24sXG4gICAgZWRpdFN0ZXBTdGF0dXMsXG4gICAgcmV2ZWFsU3RlcCxcbiAgICBzdWJzY3JpYmUsXG4gIH07XG59KSgpO1xuXG5leHBvcnQgeyBwcm9qZWN0TWFuYWdlciwgdGFza01hbmFnZXIsIHN0ZXBNYW5hZ2VyIH07XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IHByb2plY3RNYW5hZ2VyIH0gZnJvbSAnLi90b0RvTGlzdCc7XG5pbXBvcnQgc3RvcmFnZU1hbmFnZXIgZnJvbSAnLi9zdG9yYWdlJztcblxucHJvamVjdE1hbmFnZXIuc3Vic2NyaWJlKCk7XG5zdG9yYWdlTWFuYWdlci5zdWJzY3JpYmUoKTtcblxuc3RvcmFnZU1hbmFnZXIuZ2V0U3RvcmFnZSgpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9