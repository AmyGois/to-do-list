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
      revealAllProjects();
    }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQiw4QkFBOEI7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsV0FBVztBQUNYLENBQUM7O0FBRUQsaUVBQWUsUUFBUSxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FDekNVOztBQUVsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsSUFBSSxpREFBUTtBQUNaOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsSUFBSSxpREFBUTtBQUNaOztBQUVBLFdBQVc7QUFDWCxDQUFDOztBQUVELGlFQUFlLGNBQWMsRUFBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDeEI5Qjs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ2tDOztBQUVsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLElBQUksaURBQVE7QUFDWixJQUFJLGlEQUFRO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLElBQUksaURBQVE7QUFDWjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMLElBQUksaURBQVE7QUFDWjs7QUFFQTtBQUNBOztBQUVBLElBQUksaURBQVE7QUFDWixJQUFJLGlEQUFRO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxJQUFJLGlEQUFRO0FBQ1osSUFBSSxpREFBUTtBQUNaO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsSUFBSSxpREFBUTtBQUNaOztBQUVBO0FBQ0E7O0FBRUEsSUFBSSxpREFBUTtBQUNaOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxJQUFJLGlEQUFRO0FBQ1o7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLElBQUksaURBQVE7QUFDWixJQUFJLGlEQUFRO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsSUFBSSxpREFBUTtBQUNaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxJQUFJLGlEQUFRO0FBQ1osSUFBSSxpREFBUTtBQUNaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxJQUFJLGlEQUFRO0FBQ1osSUFBSSxpREFBUTtBQUNaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxJQUFJLGlEQUFRO0FBQ1osSUFBSSxpREFBUTtBQUNaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxJQUFJLGlEQUFRO0FBQ1osSUFBSSxpREFBUTtBQUNaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxJQUFJLGlEQUFRO0FBQ1osSUFBSSxpREFBUTtBQUNaOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLElBQUksaURBQVE7QUFDWjs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLElBQUksaURBQVE7QUFDWixJQUFJLGlEQUFRO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsSUFBSSxpREFBUTtBQUNaOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsSUFBSSxpREFBUTtBQUNaLElBQUksaURBQVE7QUFDWjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsSUFBSSxpREFBUTtBQUNaLElBQUksaURBQVE7QUFDWjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsSUFBSSxpREFBUTtBQUNaO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRW1EOzs7Ozs7O1VDMVZwRDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7OztBQ040QztBQUNMOztBQUV2QyxxREFBYztBQUNkLGdEQUFjOztBQUVkLGdEQUFjIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdG8tZG8tbGlzdC8uL3NyYy9tZWRpYXRvci5qcyIsIndlYnBhY2s6Ly90by1kby1saXN0Ly4vc3JjL3N0b3JhZ2UuanMiLCJ3ZWJwYWNrOi8vdG8tZG8tbGlzdC8uL3NyYy90b0RvTGlzdC5qcyIsIndlYnBhY2s6Ly90by1kby1saXN0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3RvLWRvLWxpc3Qvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3RvLWRvLWxpc3Qvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly90by1kby1saXN0L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdG8tZG8tbGlzdC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBFdmVudHM6XG5cdC0gJ3N0b3JlZCBwcm9qZWN0cycgLSBwdWJsaXNoZXMgYWxsIHByb2plY3RzIHNhdmVkIGluIHN0b3JhZ2UgYXMgYW4gYXJyYXlcblx0LSAndXBkYXRlZCBhbGwgcHJvamVjdHMnIC0gcHVibGlzaGVzIGFsbCBwcm9qZWN0cyAoYXJyYXkpIHdoZW4gYSBjaGFuZ2Ugb2NjdXJzXG5cdC0gJ3JldmVhbGVkIGFsbCBwcm9qZWN0cycgLSBwdWJsaXNoZXMgYWxsIGN1cnJlbnQgcHJvamVjdHMgKGFycmF5KSB3aGVuIG5vdGhpbmcgaGFzIGJlZW4gYWx0ZXJlZFxuXHQtICduZXcgcHJvamVjdCBjcmVhdGVkJyAtIHB1Ymxpc2hlcyBhIHNpbmdsZSBwcm9qZWN0IChvYmplY3QpIHdoZW4gaXQgaXMgY3JlYXRlZFxuXHQtICd1cGRhdGVkIHByb2plY3QnIC0gcHVibGlzaGVzIGEgc2luZ2xlIHByb2plY3QgKG9iamVjdCkgd2hlbiBhIGNoYW5nZSBvY2N1cnNcblx0LSAncmV2ZWFsZWQgcHJvamVjdCcgLSBwdWJsaXNoZXMgYSBzaW5nbGUgcHJvamVjdCAob2JqZWN0KSB0aGF0IGhhc24ndCBiZWVuIGFsdGVyZWRcblx0LSAnbmV3IHRhc2sgY3JlYXRlZCcgLSBwdWJsaXNoZXMgYSBzaW5nbGUgdGFzayAob2JqZWN0KSB3aGVuIGl0IGlzIGNyZWF0ZWRcblx0LSAndXBkYXRlZCB0YXNrJyAtIHB1Ymxpc2hlcyBhIHNpbmdsZSB0YXNrIChvYmplY3QpIHdoZW4gYSBjaGFuZ2Ugb2NjdXJzXG5cdC0gJ3JldmVhbGVkIHRhc2snIC0gcHVibGlzaGVzIGEgc2luZ2xlIHRhc2sgKG9iamVjdCkgdGhhdCBoYXNuJ3QgYmVlbiBhbHRlcmVkXG5cdC0gJ25ldyBzdGVwIGNyZWF0ZWQnIC0gcHVibGlzaGVzIGEgc2luZ2xlIHN0ZXAgKG9iamVjdCkgd2hlbiBpdCBpcyBjcmVhdGVkXG5cdC0gJ3VwZGF0ZWQgc3RlcCcgLSBwdWJsaXNoZXMgYSBzaW5nbGUgc3RlcCAob2JqZWN0KSB3aGVuIGEgY2hhbmdlIG9jY3Vyc1xuXHQtICdyZXZlYWxlZCBzdGVwJyAtIHB1Ymxpc2hlcyBhIHNpbmdsZSBzdGVwIChvYmplY3QpIHRoYXQgaGFzbid0IGJlZW4gYWx0ZXJlZFxuKi9cblxuY29uc3QgbWVkaWF0b3IgPSAoKCkgPT4ge1xuICBjb25zdCBldmVudHMgPSB7fTtcbiAgY29uc3Qgc3Vic2NyaWJlID0gKGV2ZW50TmFtZSwgZnVuY3Rpb25Ub1NldE9mZikgPT4ge1xuICAgIGV2ZW50c1tldmVudE5hbWVdID0gZXZlbnRzW2V2ZW50TmFtZV0gfHwgW107XG4gICAgZXZlbnRzW2V2ZW50TmFtZV0ucHVzaChmdW5jdGlvblRvU2V0T2ZmKTtcbiAgfTtcbiAgY29uc3QgdW5zdWJzY3JpYmUgPSAoZXZlbnROYW1lLCBmdW5jdGlvblRvUmVtb3ZlKSA9PiB7XG4gICAgaWYgKGV2ZW50c1tldmVudE5hbWVdKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGV2ZW50c1tldmVudE5hbWVdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChldmVudHNbZXZlbnROYW1lXVtpXSA9PT0gZnVuY3Rpb25Ub1JlbW92ZSkge1xuICAgICAgICAgIGV2ZW50c1tldmVudE5hbWVdLnNwbGljZShpLCAxKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgY29uc3QgcHVibGlzaCA9IChldmVudE5hbWUsIGRhdGEpID0+IHtcbiAgICBpZiAoZXZlbnRzW2V2ZW50TmFtZV0pIHtcbiAgICAgIGV2ZW50c1tldmVudE5hbWVdLmZvckVhY2goKGZ1bmN0aW9uVG9SdW4pID0+IHtcbiAgICAgICAgZnVuY3Rpb25Ub1J1bihkYXRhKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHsgc3Vic2NyaWJlLCB1bnN1YnNjcmliZSwgcHVibGlzaCB9O1xufSkoKTtcblxuZXhwb3J0IGRlZmF1bHQgbWVkaWF0b3I7XG4iLCJpbXBvcnQgbWVkaWF0b3IgZnJvbSAnLi9tZWRpYXRvcic7XG5cbmNvbnN0IHN0b3JhZ2VNYW5hZ2VyID0gKCgpID0+IHtcbiAgY29uc3QgZ2V0U3RvcmFnZSA9ICgpID0+IHtcbiAgICBsZXQgdG9Eb0xpc3QgPSBbXTtcbiAgICBpZiAobG9jYWxTdG9yYWdlLnRvRG9MaXN0KSB7XG4gICAgICB0b0RvTGlzdCA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3RvRG9MaXN0JykpO1xuICAgIH1cblxuICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3N0b3JlZCBwcm9qZWN0cycsIHRvRG9MaXN0KTtcbiAgfTtcblxuICBjb25zdCBzZXRTdG9yYWdlID0gKHByb2plY3RzKSA9PiB7XG4gICAgY29uc3QgdG9Eb0xpc3QgPSBKU09OLnN0cmluZ2lmeShwcm9qZWN0cyk7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3RvRG9MaXN0JywgdG9Eb0xpc3QpO1xuICB9O1xuXG4gIGNvbnN0IHN1YnNjcmliZSA9ICgpID0+IHtcbiAgICBtZWRpYXRvci5zdWJzY3JpYmUoJ3VwZGF0ZWQgYWxsIHByb2plY3RzJywgc2V0U3RvcmFnZSk7XG4gIH07XG5cbiAgcmV0dXJuIHsgZ2V0U3RvcmFnZSwgc2V0U3RvcmFnZSwgc3Vic2NyaWJlIH07XG59KSgpO1xuXG5leHBvcnQgZGVmYXVsdCBzdG9yYWdlTWFuYWdlcjtcbiIsIi8qIENvbnRlbnRzOlxuXG4gIENvbnN0cnVjdG9ycyAtIFRhc2ssIFN0ZXAgJiBQcm9qZWN0XG5cbiAgRnVuY3Rpb25zIHRvIGRlZXAgY2xvbmUgYXJyYXlzIGFuZCBvYmplY3RzXG5cbiAgUHJvamVjdCBNYW5hZ2VyXG5cbiAgVGFzayBNYW5hZ2VyXG5cbiAgU3RlcCBNYW5hZ2VyXG4qL1xuaW1wb3J0IG1lZGlhdG9yIGZyb20gJy4vbWVkaWF0b3InO1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuQ29uc3RydWN0b3JzIC0gVGFzaywgU3RlcCAmIFByb2plY3RcbiAgLSBTdGVwIGdvZXMgaW5zaWRlIFRhc2suc3RlcHNbXVxuICAtIFRhc2sgZ29lcyBpbnNpZGUgUHJvamVjdC50YXNrc1tdXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuY2xhc3MgVGFzayB7XG4gIGNvbnN0cnVjdG9yKHRpdGxlLCBkZXNjcmlwdGlvbiwgZHVlRGF0ZSwgcHJpb3JpdHksIHN0YXR1cykge1xuICAgIHRoaXMudGl0bGUgPSB0aXRsZTtcbiAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XG4gICAgdGhpcy5zdGVwcyA9IFtdO1xuICAgIHRoaXMuZHVlRGF0ZSA9IGR1ZURhdGU7XG4gICAgdGhpcy5wcmlvcml0eSA9IHByaW9yaXR5O1xuICAgIHRoaXMuc3RhdHVzID0gc3RhdHVzO1xuICB9XG59XG5cbmNsYXNzIFN0ZXAge1xuICBjb25zdHJ1Y3RvcihkZXNjcmlwdGlvbiwgc3RhdHVzKSB7XG4gICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xuICAgIHRoaXMuc3RhdHVzID0gc3RhdHVzO1xuICB9XG59XG5cbmNsYXNzIFByb2plY3Qge1xuICBjb25zdHJ1Y3Rvcih0aXRsZSwgZGVzY3JpcHRpb24pIHtcbiAgICB0aGlzLnRpdGxlID0gdGl0bGU7XG4gICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xuICAgIHRoaXMudGFza3MgPSBbXTtcbiAgfVxufVxuXG5jb25zdCBwcm9qZWN0cyA9IFtdO1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuRnVuY3Rpb25zIHRvIGRlZXAgY2xvbmUgYXJyYXlzIGFuZCBvYmplY3RzXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuY29uc3QgZGVlcENvcHlBcnJheSA9IChhcnJheSkgPT4ge1xuICBjb25zdCBhcnJheUNvcHkgPSBbXTtcbiAgYXJyYXkuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgIGlmIChBcnJheS5pc0FycmF5KGl0ZW0pKSB7XG4gICAgICBhcnJheUNvcHkucHVzaChkZWVwQ29weUFycmF5KGl0ZW0pKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBpdGVtID09PSAnb2JqZWN0Jykge1xuICAgICAgYXJyYXlDb3B5LnB1c2goZGVlcENvcHlPYmplY3QoaXRlbSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcnJheUNvcHkucHVzaChpdGVtKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gYXJyYXlDb3B5O1xufTtcblxuY29uc3QgZGVlcENvcHlPYmplY3QgPSAob2JqZWN0KSA9PiB7XG4gIGNvbnN0IG9iamVjdENvcHkgPSB7fTtcbiAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMob2JqZWN0KSkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgb2JqZWN0Q29weVtrZXldID0gZGVlcENvcHlBcnJheSh2YWx1ZSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgICBvYmplY3RDb3B5W2tleV0gPSBkZWVwQ29weU9iamVjdCh2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9iamVjdENvcHlba2V5XSA9IHZhbHVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gb2JqZWN0Q29weTtcbn07XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5Qcm9qZWN0IE1hbmFnZXJcbiAgLSBDcmVhdGUgJiBkZWxldGUgcHJvamVjdHNcbiAgLSBFZGl0IHByb2plY3QgdGl0bGVzICYgZGVzY3JpcHRpb25zXG4gIC0gQ3JlYXRlIGEgc2FmZSBjb3B5IG9mIGEgcHJvamVjdCAmIG9mIHRoZSBwcm9qZWN0cyBhcnJheSBmb3IgcHVibGljIHVzZVxuICAtIFN1YnNjcmliZSB0byBtZWRpYXRvciBldmVudHNcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5jb25zdCBwcm9qZWN0TWFuYWdlciA9ICgoKSA9PiB7XG4gIGNvbnN0IGNyZWF0ZU5ld1Byb2plY3QgPSAodGl0bGUsIGRlc2NyaXB0aW9uKSA9PiB7XG4gICAgY29uc3QgbmV3UHJvamVjdCA9IG5ldyBQcm9qZWN0KHRpdGxlLCBkZXNjcmlwdGlvbik7XG4gICAgcHJvamVjdHMucHVzaChuZXdQcm9qZWN0KTtcblxuICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3VwZGF0ZWQgYWxsIHByb2plY3RzJywgZGVlcENvcHlBcnJheShwcm9qZWN0cykpO1xuICAgIG1lZGlhdG9yLnB1Ymxpc2goXG4gICAgICAnbmV3IHByb2plY3QgY3JlYXRlZCcsXG4gICAgICBkZWVwQ29weU9iamVjdChwcm9qZWN0c1twcm9qZWN0cy5sZW5ndGggLSAxXSksXG4gICAgKTtcbiAgfTtcblxuICBjb25zdCBkZWxldGVQcm9qZWN0ID0gKHByb2plY3RJbmRleCkgPT4ge1xuICAgIGNvbnN0IGluZGV4ID0gTnVtYmVyKHByb2plY3RJbmRleCk7XG4gICAgcHJvamVjdHMuc3BsaWNlKGluZGV4LCAxKTtcblxuICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3VwZGF0ZWQgYWxsIHByb2plY3RzJywgZGVlcENvcHlBcnJheShwcm9qZWN0cykpO1xuICB9O1xuXG4gIC8qIE1pZ2h0IG5vdCBuZWVkIHRoaXMgKi9cbiAgY29uc3QgZGVsZXRlUHJvamVjdEJ5TmFtZSA9IChwcm9qZWN0VGl0bGUpID0+IHtcbiAgICBwcm9qZWN0cy5mb3JFYWNoKChwcm9qZWN0KSA9PiB7XG4gICAgICBpZiAocHJvamVjdC50aXRsZSA9PT0gcHJvamVjdFRpdGxlKSB7XG4gICAgICAgIHByb2plY3RzLnNwbGljZShwcm9qZWN0cy5pbmRleE9mKHByb2plY3QpLCAxKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3VwZGF0ZWQgYWxsIHByb2plY3RzJywgZGVlcENvcHlBcnJheShwcm9qZWN0cykpO1xuICB9O1xuXG4gIGNvbnN0IGVkaXRQcm9qZWN0VGl0bGUgPSAocHJvamVjdEluZGV4LCBuZXdUaXRsZSkgPT4ge1xuICAgIHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXS50aXRsZSA9IG5ld1RpdGxlO1xuXG4gICAgbWVkaWF0b3IucHVibGlzaCgndXBkYXRlZCBhbGwgcHJvamVjdHMnLCBkZWVwQ29weUFycmF5KHByb2plY3RzKSk7XG4gICAgbWVkaWF0b3IucHVibGlzaChcbiAgICAgICd1cGRhdGVkIHByb2plY3QnLFxuICAgICAgZGVlcENvcHlPYmplY3QocHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldKSxcbiAgICApO1xuICB9O1xuXG4gIGNvbnN0IGVkaXRQcm9qZWN0RGVzY3JpcHRpb24gPSAocHJvamVjdEluZGV4LCBuZXdEZXNjcmlwdGlvbikgPT4ge1xuICAgIHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXS5kZXNjcmlwdGlvbiA9IG5ld0Rlc2NyaXB0aW9uO1xuXG4gICAgbWVkaWF0b3IucHVibGlzaCgndXBkYXRlZCBhbGwgcHJvamVjdHMnLCBkZWVwQ29weUFycmF5KHByb2plY3RzKSk7XG4gICAgbWVkaWF0b3IucHVibGlzaChcbiAgICAgICd1cGRhdGVkIHByb2plY3QnLFxuICAgICAgZGVlcENvcHlPYmplY3QocHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldKSxcbiAgICApO1xuICB9O1xuXG4gIGNvbnN0IHJldmVhbFByb2plY3QgPSAocHJvamVjdEluZGV4KSA9PiB7XG4gICAgY29uc3QgcHJvamVjdENvcHkgPSBkZWVwQ29weU9iamVjdChwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0pO1xuXG4gICAgbWVkaWF0b3IucHVibGlzaCgncmV2ZWFsZWQgcHJvamVjdCcsIHByb2plY3RDb3B5KTtcbiAgfTtcblxuICBjb25zdCByZXZlYWxBbGxQcm9qZWN0cyA9ICgpID0+IHtcbiAgICBjb25zdCBwcm9qZWN0c0NvcHkgPSBkZWVwQ29weUFycmF5KHByb2plY3RzKTtcblxuICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3JldmVhbGVkIGFsbCBwcm9qZWN0cycsIHByb2plY3RzQ29weSk7XG4gIH07XG5cbiAgY29uc3QgaW5pdGlhbGlzZSA9IChzdG9yZWRQcm9qZWN0cykgPT4ge1xuICAgIGlmIChzdG9yZWRQcm9qZWN0cy5sZW5ndGggPT09IDApIHtcbiAgICAgIGNyZWF0ZU5ld1Byb2plY3QoJ0luYm94JywgJycpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXZlYWxBbGxQcm9qZWN0cygpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBzdWJzY3JpYmUgPSAoKSA9PiB7XG4gICAgbWVkaWF0b3Iuc3Vic2NyaWJlKCdzdG9yZWQgcHJvamVjdHMnLCBpbml0aWFsaXNlKTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGNyZWF0ZU5ld1Byb2plY3QsXG4gICAgZGVsZXRlUHJvamVjdCxcbiAgICBkZWxldGVQcm9qZWN0QnlOYW1lLFxuICAgIGVkaXRQcm9qZWN0VGl0bGUsXG4gICAgZWRpdFByb2plY3REZXNjcmlwdGlvbixcbiAgICByZXZlYWxQcm9qZWN0LFxuICAgIHJldmVhbEFsbFByb2plY3RzLFxuICAgIGluaXRpYWxpc2UsXG4gICAgc3Vic2NyaWJlLFxuICB9O1xufSkoKTtcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblRhc2sgTWFuYWdlclxuICAtIENyZWF0ZSAmIGRlbGV0ZSB0YXNrcyBpbiBhIHByb2plY3RcbiAgLSBFZGl0IHRhc2sgdGl0bGUsIGRlc2NyaXB0aW9uLCBkdWUgZGF0ZSwgcHJpb3JpdHkgJiBzdGF0dXNcbiAgLSBDcmVhdGUgYSBzYWZlIGNvcHkgb2YgYSBzaW5nbGUgdGFzayBmb3IgcHVibGljIHVzZVxuICAtIFN1YnNjcmliZSB0byBtZWRpYXRvciBldmVudHNcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5jb25zdCB0YXNrTWFuYWdlciA9ICgoKSA9PiB7XG4gIGNvbnN0IGNyZWF0ZU5ld1Rhc2sgPSAoXG4gICAgcHJvamVjdEluZGV4LFxuICAgIHRpdGxlLFxuICAgIGRlc2NyaXB0aW9uLFxuICAgIGR1ZURhdGUsXG4gICAgcHJpb3JpdHksXG4gICAgc3RhdHVzLFxuICApID0+IHtcbiAgICBjb25zdCBwcm9qZWN0ID0gcHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldO1xuICAgIHByb2plY3QudGFza3MucHVzaChuZXcgVGFzayh0aXRsZSwgZGVzY3JpcHRpb24sIGR1ZURhdGUsIHByaW9yaXR5LCBzdGF0dXMpKTtcblxuICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3VwZGF0ZWQgYWxsIHByb2plY3RzJywgZGVlcENvcHlBcnJheShwcm9qZWN0cykpO1xuICAgIG1lZGlhdG9yLnB1Ymxpc2goXG4gICAgICAnbmV3IHRhc2sgY3JlYXRlZCcsXG4gICAgICBkZWVwQ29weU9iamVjdChwcm9qZWN0LnRhc2tzW3Byb2plY3QudGFza3MubGVuZ3RoIC0gMV0pLFxuICAgICk7XG4gIH07XG5cbiAgY29uc3QgZGVsZXRlVGFzayA9IChwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCkgPT4ge1xuICAgIGNvbnN0IHByb2plY3QgPSBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV07XG4gICAgY29uc3QgaW5kZXggPSBOdW1iZXIodGFza0luZGV4KTtcbiAgICBwcm9qZWN0LnRhc2tzLnNwbGljZShpbmRleCwgMSk7XG5cbiAgICBtZWRpYXRvci5wdWJsaXNoKCd1cGRhdGVkIGFsbCBwcm9qZWN0cycsIGRlZXBDb3B5QXJyYXkocHJvamVjdHMpKTtcbiAgfTtcblxuICBjb25zdCBlZGl0VGFza1RpdGxlID0gKHByb2plY3RJbmRleCwgdGFza0luZGV4LCBuZXdUaXRsZSkgPT4ge1xuICAgIGNvbnN0IHRhc2sgPSBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0udGFza3NbTnVtYmVyKHRhc2tJbmRleCldO1xuICAgIHRhc2sudGl0bGUgPSBuZXdUaXRsZTtcblxuICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3VwZGF0ZWQgYWxsIHByb2plY3RzJywgZGVlcENvcHlBcnJheShwcm9qZWN0cykpO1xuICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3VwZGF0ZWQgdGFzaycsIGRlZXBDb3B5T2JqZWN0KHRhc2spKTtcbiAgfTtcblxuICBjb25zdCBlZGl0VGFza0Rlc2NyaXB0aW9uID0gKHByb2plY3RJbmRleCwgdGFza0luZGV4LCBuZXdEZXNjcmlwdGlvbikgPT4ge1xuICAgIGNvbnN0IHRhc2sgPSBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0udGFza3NbTnVtYmVyKHRhc2tJbmRleCldO1xuICAgIHRhc2suZGVzY3JpcHRpb24gPSBuZXdEZXNjcmlwdGlvbjtcblxuICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3VwZGF0ZWQgYWxsIHByb2plY3RzJywgZGVlcENvcHlBcnJheShwcm9qZWN0cykpO1xuICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3VwZGF0ZWQgdGFzaycsIGRlZXBDb3B5T2JqZWN0KHRhc2spKTtcbiAgfTtcblxuICBjb25zdCBlZGl0VGFza0R1ZURhdGUgPSAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgsIG5ld0R1ZURhdGUpID0+IHtcbiAgICBjb25zdCB0YXNrID0gcHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldLnRhc2tzW051bWJlcih0YXNrSW5kZXgpXTtcbiAgICB0YXNrLmR1ZURhdGUgPSBuZXdEdWVEYXRlO1xuXG4gICAgbWVkaWF0b3IucHVibGlzaCgndXBkYXRlZCBhbGwgcHJvamVjdHMnLCBkZWVwQ29weUFycmF5KHByb2plY3RzKSk7XG4gICAgbWVkaWF0b3IucHVibGlzaCgndXBkYXRlZCB0YXNrJywgZGVlcENvcHlPYmplY3QodGFzaykpO1xuICB9O1xuXG4gIGNvbnN0IGVkaXRUYXNrUHJpb3JpdHkgPSAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgsIG5ld1ByaW9yaXR5KSA9PiB7XG4gICAgY29uc3QgdGFzayA9IHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXS50YXNrc1tOdW1iZXIodGFza0luZGV4KV07XG4gICAgdGFzay5wcmlvcml0eSA9IG5ld1ByaW9yaXR5O1xuXG4gICAgbWVkaWF0b3IucHVibGlzaCgndXBkYXRlZCBhbGwgcHJvamVjdHMnLCBkZWVwQ29weUFycmF5KHByb2plY3RzKSk7XG4gICAgbWVkaWF0b3IucHVibGlzaCgndXBkYXRlZCB0YXNrJywgZGVlcENvcHlPYmplY3QodGFzaykpO1xuICB9O1xuXG4gIGNvbnN0IGVkaXRUYXNrU3RhdHVzID0gKHByb2plY3RJbmRleCwgdGFza0luZGV4LCBuZXdTdGF0dXMpID0+IHtcbiAgICBjb25zdCB0YXNrID0gcHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldLnRhc2tzW051bWJlcih0YXNrSW5kZXgpXTtcbiAgICB0YXNrLnN0YXR1cyA9IG5ld1N0YXR1cztcblxuICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3VwZGF0ZWQgYWxsIHByb2plY3RzJywgZGVlcENvcHlBcnJheShwcm9qZWN0cykpO1xuICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3VwZGF0ZWQgdGFzaycsIGRlZXBDb3B5T2JqZWN0KHRhc2spKTtcbiAgfTtcblxuICBjb25zdCByZXZlYWxUYXNrID0gKHByb2plY3RJbmRleCwgdGFza0luZGV4KSA9PiB7XG4gICAgY29uc3QgdGFza0NvcHkgPSBkZWVwQ29weU9iamVjdChcbiAgICAgIHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXS50YXNrc1tOdW1iZXIodGFza0luZGV4KV0sXG4gICAgKTtcblxuICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3JldmVhbGVkIHRhc2snLCB0YXNrQ29weSk7XG4gIH07XG5cbiAgY29uc3Qgc3Vic2NyaWJlID0gKCkgPT4ge307XG5cbiAgcmV0dXJuIHtcbiAgICBjcmVhdGVOZXdUYXNrLFxuICAgIGRlbGV0ZVRhc2ssXG4gICAgZWRpdFRhc2tUaXRsZSxcbiAgICBlZGl0VGFza0Rlc2NyaXB0aW9uLFxuICAgIGVkaXRUYXNrRHVlRGF0ZSxcbiAgICBlZGl0VGFza1ByaW9yaXR5LFxuICAgIGVkaXRUYXNrU3RhdHVzLFxuICAgIHJldmVhbFRhc2ssXG4gICAgc3Vic2NyaWJlLFxuICB9O1xufSkoKTtcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblN0ZXAgTWFuYWdlclxuICAtIENyZWF0ZSAmIGRlbGV0ZSBzdGVwcyBpbiBhIHRhc2tcbiAgLSBFZGl0IHN0ZXAgZGVzY3JpcHRpb24gJiBzdGF0dXNcbiAgLSBDcmVhdGUgYSBzZmUgY29weSBvZiBhIHNpbmdsZSBzdGVwIGZvciBwdWJsaWMgdXNlXG4gIC0gU3Vic2NyaWJlIHRvIG1lZGlhdG9yIGV2ZW50c1xuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbmNvbnN0IHN0ZXBNYW5hZ2VyID0gKCgpID0+IHtcbiAgY29uc3QgY3JlYXRlTmV3U3RlcCA9IChwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCwgZGVzY3JpcHRpb24sIHN0YXR1cykgPT4ge1xuICAgIGNvbnN0IHRhc2sgPSBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0udGFza3NbTnVtYmVyKHRhc2tJbmRleCldO1xuICAgIHRhc2suc3RlcHMucHVzaChuZXcgU3RlcChkZXNjcmlwdGlvbiwgc3RhdHVzKSk7XG5cbiAgICBtZWRpYXRvci5wdWJsaXNoKCd1cGRhdGVkIGFsbCBwcm9qZWN0cycsIGRlZXBDb3B5QXJyYXkocHJvamVjdHMpKTtcbiAgICBtZWRpYXRvci5wdWJsaXNoKFxuICAgICAgJ25ldyBzdGVwIGNyZWF0ZWQnLFxuICAgICAgZGVlcENvcHlPYmplY3QodGFzay5zdGVwc1t0YXNrLnN0ZXBzLmxlbmd0aCAtIDFdKSxcbiAgICApO1xuICB9O1xuXG4gIGNvbnN0IGRlbGV0ZVN0ZXAgPSAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgsIHN0ZXBJbmRleCkgPT4ge1xuICAgIGNvbnN0IHRhc2sgPSBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0udGFza3NbTnVtYmVyKHRhc2tJbmRleCldO1xuICAgIGNvbnN0IGluZGV4ID0gTnVtYmVyKHN0ZXBJbmRleCk7XG4gICAgdGFzay5zdGVwcy5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gICAgbWVkaWF0b3IucHVibGlzaCgndXBkYXRlZCBhbGwgcHJvamVjdHMnLCBkZWVwQ29weUFycmF5KHByb2plY3RzKSk7XG4gIH07XG5cbiAgY29uc3QgZWRpdFN0ZXBEZXNjcmlwdGlvbiA9IChcbiAgICBwcm9qZWN0SW5kZXgsXG4gICAgdGFza0luZGV4LFxuICAgIHN0ZXBJbmRleCxcbiAgICBuZXdEZXNjcmlwdGlvbixcbiAgKSA9PiB7XG4gICAgY29uc3Qgc3RlcCA9XG4gICAgICBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0udGFza3NbTnVtYmVyKHRhc2tJbmRleCldLnN0ZXBzW1xuICAgICAgICBOdW1iZXIoc3RlcEluZGV4KVxuICAgICAgXTtcbiAgICBzdGVwLmRlc2NyaXB0aW9uID0gbmV3RGVzY3JpcHRpb247XG5cbiAgICBtZWRpYXRvci5wdWJsaXNoKCd1cGRhdGVkIGFsbCBwcm9qZWN0cycsIGRlZXBDb3B5QXJyYXkocHJvamVjdHMpKTtcbiAgICBtZWRpYXRvci5wdWJsaXNoKCd1cGRhdGVkIHN0ZXAnLCBkZWVwQ29weU9iamVjdChzdGVwKSk7XG4gIH07XG5cbiAgY29uc3QgZWRpdFN0ZXBTdGF0dXMgPSAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgsIHN0ZXBJbmRleCwgbmV3U3RhdHVzKSA9PiB7XG4gICAgY29uc3Qgc3RlcCA9XG4gICAgICBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0udGFza3NbTnVtYmVyKHRhc2tJbmRleCldLnN0ZXBzW1xuICAgICAgICBOdW1iZXIoc3RlcEluZGV4KVxuICAgICAgXTtcbiAgICBzdGVwLnN0YXR1cyA9IG5ld1N0YXR1cztcblxuICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3VwZGF0ZWQgYWxsIHByb2plY3RzJywgZGVlcENvcHlBcnJheShwcm9qZWN0cykpO1xuICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3VwZGF0ZWQgc3RlcCcsIGRlZXBDb3B5T2JqZWN0KHN0ZXApKTtcbiAgfTtcblxuICBjb25zdCByZXZlYWxTdGVwID0gKHByb2plY3RJbmRleCwgdGFza0luZGV4LCBzdGVwSW5kZXgpID0+IHtcbiAgICBjb25zdCBzdGVwQ29weSA9IGRlZXBDb3B5T2JqZWN0KFxuICAgICAgcHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldLnRhc2tzW051bWJlcih0YXNrSW5kZXgpXS5zdGVwc1tcbiAgICAgICAgTnVtYmVyKHN0ZXBJbmRleClcbiAgICAgIF0sXG4gICAgKTtcblxuICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3JldmVhbGVkIHN0ZXAnLCBzdGVwQ29weSk7XG4gICAgcmV0dXJuIHN0ZXBDb3B5O1xuICB9O1xuXG4gIGNvbnN0IHN1YnNjcmliZSA9ICgpID0+IHt9O1xuXG4gIHJldHVybiB7XG4gICAgY3JlYXRlTmV3U3RlcCxcbiAgICBkZWxldGVTdGVwLFxuICAgIGVkaXRTdGVwRGVzY3JpcHRpb24sXG4gICAgZWRpdFN0ZXBTdGF0dXMsXG4gICAgcmV2ZWFsU3RlcCxcbiAgICBzdWJzY3JpYmUsXG4gIH07XG59KSgpO1xuXG5leHBvcnQgeyBwcm9qZWN0TWFuYWdlciwgdGFza01hbmFnZXIsIHN0ZXBNYW5hZ2VyIH07XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IHByb2plY3RNYW5hZ2VyIH0gZnJvbSAnLi90b0RvTGlzdCc7XG5pbXBvcnQgc3RvcmFnZU1hbmFnZXIgZnJvbSAnLi9zdG9yYWdlJztcblxucHJvamVjdE1hbmFnZXIuc3Vic2NyaWJlKCk7XG5zdG9yYWdlTWFuYWdlci5zdWJzY3JpYmUoKTtcblxuc3RvcmFnZU1hbmFnZXIuZ2V0U3RvcmFnZSgpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9