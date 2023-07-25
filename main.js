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



/* projectManager.subscribe();
storageManager.subscribe();
storageManager.getStorage(); */

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQiw4QkFBOEI7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsV0FBVztBQUNYLENBQUM7O0FBRUQsaUVBQWUsUUFBUSxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FDekNVOztBQUVsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLGlEQUFRO0FBQ1o7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxJQUFJLGlEQUFRO0FBQ1o7O0FBRUEsV0FBVztBQUNYLENBQUM7O0FBRUQsaUVBQWUsY0FBYyxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN2QjlCOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRWtDOztBQUVsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSxvQkFBb0I7QUFDcEIsTUFBTTtBQUNOO0FBQ0E7O0FBRUEsSUFBSSxpREFBUTtBQUNaLElBQUksaURBQVE7QUFDWjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsSUFBSSxpREFBUTtBQUNaOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUwsSUFBSSxpREFBUTtBQUNaOztBQUVBO0FBQ0E7O0FBRUEsSUFBSSxpREFBUTtBQUNaLElBQUksaURBQVE7QUFDWjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLElBQUksaURBQVE7QUFDWixJQUFJLGlEQUFRO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxJQUFJLGlEQUFRO0FBQ1o7O0FBRUE7QUFDQTs7QUFFQSxJQUFJLGlEQUFRO0FBQ1o7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSxvQkFBb0I7QUFDcEIsTUFBTTtBQUNOOztBQUVBLElBQUksaURBQVE7QUFDWixJQUFJLGlEQUFRO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsSUFBSSxpREFBUTtBQUNaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxJQUFJLGlEQUFRO0FBQ1osSUFBSSxpREFBUTtBQUNaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxJQUFJLGlEQUFRO0FBQ1osSUFBSSxpREFBUTtBQUNaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxJQUFJLGlEQUFRO0FBQ1osSUFBSSxpREFBUTtBQUNaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxJQUFJLGlEQUFRO0FBQ1osSUFBSSxpREFBUTtBQUNaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxJQUFJLGlEQUFRO0FBQ1osSUFBSSxpREFBUTtBQUNaOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLElBQUksaURBQVE7QUFDWjs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxJQUFJLGlEQUFRO0FBQ1osSUFBSSxpREFBUTtBQUNaO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLElBQUksaURBQVE7QUFDWjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLElBQUksaURBQVE7QUFDWixJQUFJLGlEQUFRO0FBQ1o7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLElBQUksaURBQVE7QUFDWixJQUFJLGlEQUFRO0FBQ1o7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLElBQUksaURBQVE7QUFDWjtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVtRDs7Ozs7OztVQzNWcEQ7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7QUNONEM7QUFDTDs7QUFFdkM7QUFDQTtBQUNBLDZCQUE2QiIsInNvdXJjZXMiOlsid2VicGFjazovL3RvLWRvLWxpc3QvLi9zcmMvbWVkaWF0b3IuanMiLCJ3ZWJwYWNrOi8vdG8tZG8tbGlzdC8uL3NyYy9zdG9yYWdlLmpzIiwid2VicGFjazovL3RvLWRvLWxpc3QvLi9zcmMvdG9Eb0xpc3QuanMiLCJ3ZWJwYWNrOi8vdG8tZG8tbGlzdC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90by1kby1saXN0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly90by1kby1saXN0L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vdG8tZG8tbGlzdC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3RvLWRvLWxpc3QvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyogRXZlbnRzOlxuXHQtICdzdG9yZWQgcHJvamVjdHMnIC0gcHVibGlzaGVzIGFsbCBwcm9qZWN0cyBzYXZlZCBpbiBzdG9yYWdlIGFzIGFuIGFycmF5XG5cdC0gJ3VwZGF0ZWQgYWxsIHByb2plY3RzJyAtIHB1Ymxpc2hlcyBhbGwgcHJvamVjdHMgKGFycmF5KSB3aGVuIGEgY2hhbmdlIG9jY3Vyc1xuXHQtICdyZXZlYWxlZCBhbGwgcHJvamVjdHMnIC0gcHVibGlzaGVzIGFsbCBjdXJyZW50IHByb2plY3RzIChhcnJheSkgd2hlbiBub3RoaW5nIGhhcyBiZWVuIGFsdGVyZWRcblx0LSAnbmV3IHByb2plY3QgY3JlYXRlZCcgLSBwdWJsaXNoZXMgYSBzaW5nbGUgcHJvamVjdCAob2JqZWN0KSB3aGVuIGl0IGlzIGNyZWF0ZWRcblx0LSAndXBkYXRlZCBwcm9qZWN0JyAtIHB1Ymxpc2hlcyBhIHNpbmdsZSBwcm9qZWN0IChvYmplY3QpIHdoZW4gYSBjaGFuZ2Ugb2NjdXJzXG5cdC0gJ3JldmVhbGVkIHByb2plY3QnIC0gcHVibGlzaGVzIGEgc2luZ2xlIHByb2plY3QgKG9iamVjdCkgdGhhdCBoYXNuJ3QgYmVlbiBhbHRlcmVkXG5cdC0gJ25ldyB0YXNrIGNyZWF0ZWQnIC0gcHVibGlzaGVzIGEgc2luZ2xlIHRhc2sgKG9iamVjdCkgd2hlbiBpdCBpcyBjcmVhdGVkXG5cdC0gJ3VwZGF0ZWQgdGFzaycgLSBwdWJsaXNoZXMgYSBzaW5nbGUgdGFzayAob2JqZWN0KSB3aGVuIGEgY2hhbmdlIG9jY3Vyc1xuXHQtICdyZXZlYWxlZCB0YXNrJyAtIHB1Ymxpc2hlcyBhIHNpbmdsZSB0YXNrIChvYmplY3QpIHRoYXQgaGFzbid0IGJlZW4gYWx0ZXJlZFxuXHQtICduZXcgc3RlcCBjcmVhdGVkJyAtIHB1Ymxpc2hlcyBhIHNpbmdsZSBzdGVwIChvYmplY3QpIHdoZW4gaXQgaXMgY3JlYXRlZFxuXHQtICd1cGRhdGVkIHN0ZXAnIC0gcHVibGlzaGVzIGEgc2luZ2xlIHN0ZXAgKG9iamVjdCkgd2hlbiBhIGNoYW5nZSBvY2N1cnNcblx0LSAncmV2ZWFsZWQgc3RlcCcgLSBwdWJsaXNoZXMgYSBzaW5nbGUgc3RlcCAob2JqZWN0KSB0aGF0IGhhc24ndCBiZWVuIGFsdGVyZWRcbiovXG5cbmNvbnN0IG1lZGlhdG9yID0gKCgpID0+IHtcbiAgY29uc3QgZXZlbnRzID0ge307XG4gIGNvbnN0IHN1YnNjcmliZSA9IChldmVudE5hbWUsIGZ1bmN0aW9uVG9TZXRPZmYpID0+IHtcbiAgICBldmVudHNbZXZlbnROYW1lXSA9IGV2ZW50c1tldmVudE5hbWVdIHx8IFtdO1xuICAgIGV2ZW50c1tldmVudE5hbWVdLnB1c2goZnVuY3Rpb25Ub1NldE9mZik7XG4gIH07XG4gIGNvbnN0IHVuc3Vic2NyaWJlID0gKGV2ZW50TmFtZSwgZnVuY3Rpb25Ub1JlbW92ZSkgPT4ge1xuICAgIGlmIChldmVudHNbZXZlbnROYW1lXSkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBldmVudHNbZXZlbnROYW1lXS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoZXZlbnRzW2V2ZW50TmFtZV1baV0gPT09IGZ1bmN0aW9uVG9SZW1vdmUpIHtcbiAgICAgICAgICBldmVudHNbZXZlbnROYW1lXS5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIGNvbnN0IHB1Ymxpc2ggPSAoZXZlbnROYW1lLCBkYXRhKSA9PiB7XG4gICAgaWYgKGV2ZW50c1tldmVudE5hbWVdKSB7XG4gICAgICBldmVudHNbZXZlbnROYW1lXS5mb3JFYWNoKChmdW5jdGlvblRvUnVuKSA9PiB7XG4gICAgICAgIGZ1bmN0aW9uVG9SdW4oZGF0YSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG4gIHJldHVybiB7IHN1YnNjcmliZSwgdW5zdWJzY3JpYmUsIHB1Ymxpc2ggfTtcbn0pKCk7XG5cbmV4cG9ydCBkZWZhdWx0IG1lZGlhdG9yO1xuIiwiaW1wb3J0IG1lZGlhdG9yIGZyb20gJy4vbWVkaWF0b3InO1xuXG5jb25zdCBzdG9yYWdlTWFuYWdlciA9ICgoKSA9PiB7XG4gIGNvbnN0IGdldFN0b3JhZ2UgPSAoKSA9PiB7XG4gICAgbGV0IHRvRG9MaXN0ID0gW107XG4gICAgaWYgKGxvY2FsU3RvcmFnZS50b0RvTGlzdCkge1xuICAgICAgdG9Eb0xpc3QgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0b0RvTGlzdCcpKTtcbiAgICB9XG4gICAgbWVkaWF0b3IucHVibGlzaCgnc3RvcmVkIHByb2plY3RzJywgdG9Eb0xpc3QpO1xuICB9O1xuXG4gIGNvbnN0IHNldFN0b3JhZ2UgPSAocHJvamVjdHMpID0+IHtcbiAgICBjb25zdCB0b0RvTGlzdCA9IEpTT04uc3RyaW5naWZ5KHByb2plY3RzKTtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndG9Eb0xpc3QnLCB0b0RvTGlzdCk7XG4gIH07XG5cbiAgY29uc3Qgc3Vic2NyaWJlID0gKCkgPT4ge1xuICAgIG1lZGlhdG9yLnN1YnNjcmliZSgndXBkYXRlZCBhbGwgcHJvamVjdHMnLCBzZXRTdG9yYWdlKTtcbiAgfTtcblxuICByZXR1cm4geyBnZXRTdG9yYWdlLCBzZXRTdG9yYWdlLCBzdWJzY3JpYmUgfTtcbn0pKCk7XG5cbmV4cG9ydCBkZWZhdWx0IHN0b3JhZ2VNYW5hZ2VyO1xuIiwiLyogQ29udGVudHM6XG5cbiAgQ29uc3RydWN0b3JzIC0gVGFzaywgU3RlcCAmIFByb2plY3RcblxuICBGdW5jdGlvbnMgdG8gZGVlcCBjbG9uZSBhcnJheXMgYW5kIG9iamVjdHNcblxuICBQcm9qZWN0IE1hbmFnZXJcblxuICBUYXNrIE1hbmFnZXJcblxuICBTdGVwIE1hbmFnZXJcbiovXG5cbmltcG9ydCBtZWRpYXRvciBmcm9tICcuL21lZGlhdG9yJztcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbkNvbnN0cnVjdG9ycyAtIFRhc2ssIFN0ZXAgJiBQcm9qZWN0XG4gIC0gU3RlcCBnb2VzIGluc2lkZSBUYXNrLnN0ZXBzW11cbiAgLSBUYXNrIGdvZXMgaW5zaWRlIFByb2plY3QudGFza3NbXVxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbmNsYXNzIFRhc2sge1xuICBjb25zdHJ1Y3Rvcih0aXRsZSwgZGVzY3JpcHRpb24sIGR1ZURhdGUsIHByaW9yaXR5LCBzdGF0dXMpIHtcbiAgICB0aGlzLnRpdGxlID0gdGl0bGU7XG4gICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xuICAgIHRoaXMuc3RlcHMgPSBbXTtcbiAgICB0aGlzLmR1ZURhdGUgPSBkdWVEYXRlO1xuICAgIHRoaXMucHJpb3JpdHkgPSBwcmlvcml0eTtcbiAgICB0aGlzLnN0YXR1cyA9IHN0YXR1cztcbiAgfVxufVxuXG5jbGFzcyBTdGVwIHtcbiAgY29uc3RydWN0b3IoZGVzY3JpcHRpb24sIHN0YXR1cykge1xuICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcbiAgICB0aGlzLnN0YXR1cyA9IHN0YXR1cztcbiAgfVxufVxuXG5jbGFzcyBQcm9qZWN0IHtcbiAgY29uc3RydWN0b3IodGl0bGUsIGRlc2NyaXB0aW9uKSB7XG4gICAgdGhpcy50aXRsZSA9IHRpdGxlO1xuICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcbiAgICB0aGlzLnRhc2tzID0gW107XG4gIH1cbn1cblxuY29uc3QgcHJvamVjdHMgPSBbXTtcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbkZ1bmN0aW9ucyB0byBkZWVwIGNsb25lIGFycmF5cyBhbmQgb2JqZWN0c1xuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbmNvbnN0IGRlZXBDb3B5QXJyYXkgPSAoYXJyYXkpID0+IHtcbiAgY29uc3QgYXJyYXlDb3B5ID0gW107XG4gIGFycmF5LmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShpdGVtKSkge1xuICAgICAgYXJyYXlDb3B5LnB1c2goZGVlcENvcHlBcnJheShpdGVtKSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgaXRlbSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGFycmF5Q29weS5wdXNoKGRlZXBDb3B5T2JqZWN0KGl0ZW0pKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXJyYXlDb3B5LnB1c2goaXRlbSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGFycmF5Q29weTtcbn07XG5cbmNvbnN0IGRlZXBDb3B5T2JqZWN0ID0gKG9iamVjdCkgPT4ge1xuICBjb25zdCBvYmplY3RDb3B5ID0ge307XG4gIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKG9iamVjdCkpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgIG9iamVjdENvcHlba2V5XSA9IGRlZXBDb3B5QXJyYXkodmFsdWUpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgICAgb2JqZWN0Q29weVtrZXldID0gZGVlcENvcHlPYmplY3QodmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvYmplY3RDb3B5W2tleV0gPSB2YWx1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG9iamVjdENvcHk7XG59O1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuUHJvamVjdCBNYW5hZ2VyXG4gIC0gQ3JlYXRlICYgZGVsZXRlIHByb2plY3RzXG4gIC0gRWRpdCBwcm9qZWN0IHRpdGxlcyAmIGRlc2NyaXB0aW9uc1xuICAtIENyZWF0ZSBhIHNhZmUgY29weSBvZiBhIHByb2plY3QgJiBvZiB0aGUgcHJvamVjdHMgYXJyYXkgZm9yIHB1YmxpYyB1c2VcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5jb25zdCBwcm9qZWN0TWFuYWdlciA9ICgoKSA9PiB7XG4gIGNvbnN0IGNyZWF0ZU5ld1Byb2plY3QgPSAodGl0bGUsIGRlc2NyaXB0aW9uKSA9PiB7XG4gICAgLyogY29uc3QgcHJvamVjdEFscmVhZHlFeGlzdHMgPSBwcm9qZWN0cy5maW5kKChwcm9qZWN0KSA9PiB7XG4gICAgICByZXR1cm4gcHJvamVjdC50aXRsZSA9PT0gdGl0bGU7XG4gICAgfSk7XG5cbiAgICBpZiAodHlwZW9mIHByb2plY3RBbHJlYWR5RXhpc3RzID09PSAnb2JqZWN0Jykge1xuICAgICAgcmV0dXJuIGZhbHNlOyAvLyBDYW4ndCBjcmVhdGUgbmV3IHByb2plY3QgYmVjYXVzZSBvbmUgd2l0aCB0aGUgc2FtZSB0aXRsZSBhbHJlYWR5IGV4aXN0c1xuICAgIH0gKi8gLyogVGhpcyBjYW4gY2F1c2UgcHJvYmxlbXMgd2hlbiBlZGl0aW5nIHRoZSB0aXRsZSAqL1xuICAgIGNvbnN0IG5ld1Byb2plY3QgPSBuZXcgUHJvamVjdCh0aXRsZSwgZGVzY3JpcHRpb24pO1xuICAgIHByb2plY3RzLnB1c2gobmV3UHJvamVjdCk7XG5cbiAgICBtZWRpYXRvci5wdWJsaXNoKCd1cGRhdGVkIGFsbCBwcm9qZWN0cycsIGRlZXBDb3B5QXJyYXkocHJvamVjdHMpKTtcbiAgICBtZWRpYXRvci5wdWJsaXNoKFxuICAgICAgJ25ldyBwcm9qZWN0IGNyZWF0ZWQnLFxuICAgICAgZGVlcENvcHlPYmplY3QocHJvamVjdHNbcHJvamVjdHMubGVuZ3RoIC0gMV0pLFxuICAgICk7XG4gIH07XG5cbiAgY29uc3QgZGVsZXRlUHJvamVjdCA9IChwcm9qZWN0SW5kZXgpID0+IHtcbiAgICBjb25zdCBpbmRleCA9IE51bWJlcihwcm9qZWN0SW5kZXgpO1xuICAgIHByb2plY3RzLnNwbGljZShpbmRleCwgMSk7XG5cbiAgICBtZWRpYXRvci5wdWJsaXNoKCd1cGRhdGVkIGFsbCBwcm9qZWN0cycsIGRlZXBDb3B5QXJyYXkocHJvamVjdHMpKTtcbiAgfTtcblxuICAvKiBNaWdodCBub3QgbmVlZCB0aGlzICovXG4gIGNvbnN0IGRlbGV0ZVByb2plY3RCeU5hbWUgPSAocHJvamVjdFRpdGxlKSA9PiB7XG4gICAgcHJvamVjdHMuZm9yRWFjaCgocHJvamVjdCkgPT4ge1xuICAgICAgaWYgKHByb2plY3QudGl0bGUgPT09IHByb2plY3RUaXRsZSkge1xuICAgICAgICBwcm9qZWN0cy5zcGxpY2UocHJvamVjdHMuaW5kZXhPZihwcm9qZWN0KSwgMSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBtZWRpYXRvci5wdWJsaXNoKCd1cGRhdGVkIGFsbCBwcm9qZWN0cycsIGRlZXBDb3B5QXJyYXkocHJvamVjdHMpKTtcbiAgfTtcblxuICBjb25zdCBlZGl0UHJvamVjdFRpdGxlID0gKHByb2plY3RJbmRleCwgbmV3VGl0bGUpID0+IHtcbiAgICBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0udGl0bGUgPSBuZXdUaXRsZTtcblxuICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3VwZGF0ZWQgYWxsIHByb2plY3RzJywgZGVlcENvcHlBcnJheShwcm9qZWN0cykpO1xuICAgIG1lZGlhdG9yLnB1Ymxpc2goXG4gICAgICAndXBkYXRlZCBwcm9qZWN0JyxcbiAgICAgIGRlZXBDb3B5T2JqZWN0KHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXSksXG4gICAgKTtcbiAgfTtcblxuICBjb25zdCBlZGl0UHJvamVjdERlc2NyaXB0aW9uID0gKHByb2plY3RJbmRleCwgbmV3RGVzY3JpcHRpb24pID0+IHtcbiAgICBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0uZGVzY3JpcHRpb24gPSBuZXdEZXNjcmlwdGlvbjtcblxuICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3VwZGF0ZWQgYWxsIHByb2plY3RzJywgZGVlcENvcHlBcnJheShwcm9qZWN0cykpO1xuICAgIG1lZGlhdG9yLnB1Ymxpc2goXG4gICAgICAndXBkYXRlZCBwcm9qZWN0JyxcbiAgICAgIGRlZXBDb3B5T2JqZWN0KHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXSksXG4gICAgKTtcbiAgfTtcblxuICBjb25zdCByZXZlYWxQcm9qZWN0ID0gKHByb2plY3RJbmRleCkgPT4ge1xuICAgIGNvbnN0IHByb2plY3RDb3B5ID0gZGVlcENvcHlPYmplY3QocHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldKTtcblxuICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3JldmVhbGVkIHByb2plY3QnLCBwcm9qZWN0Q29weSk7XG4gIH07XG5cbiAgY29uc3QgcmV2ZWFsQWxsUHJvamVjdHMgPSAoKSA9PiB7XG4gICAgY29uc3QgcHJvamVjdHNDb3B5ID0gZGVlcENvcHlBcnJheShwcm9qZWN0cyk7XG5cbiAgICBtZWRpYXRvci5wdWJsaXNoKCdyZXZlYWxlZCBhbGwgcHJvamVjdHMnLCBwcm9qZWN0c0NvcHkpO1xuICB9O1xuXG4gIGNvbnN0IHN1YnNjcmliZSA9ICgpID0+IHt9O1xuXG4gIHJldHVybiB7XG4gICAgY3JlYXRlTmV3UHJvamVjdCxcbiAgICBkZWxldGVQcm9qZWN0LFxuICAgIGRlbGV0ZVByb2plY3RCeU5hbWUsXG4gICAgZWRpdFByb2plY3RUaXRsZSxcbiAgICBlZGl0UHJvamVjdERlc2NyaXB0aW9uLFxuICAgIHJldmVhbFByb2plY3QsXG4gICAgcmV2ZWFsQWxsUHJvamVjdHMsXG4gICAgc3Vic2NyaWJlLFxuICB9O1xufSkoKTtcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblRhc2sgTWFuYWdlclxuICAtIENyZWF0ZSAmIGRlbGV0ZSB0YXNrcyBpbiBhIHByb2plY3RcbiAgLSBFZGl0IHRhc2sgdGl0bGUsIGRlc2NyaXB0aW9uLCBkdWUgZGF0ZSwgcHJpb3JpdHkgJiBzdGF0dXNcbiAgLSBDcmVhdGUgYSBzYWZlIGNvcHkgb2YgYSBzaW5nbGUgdGFzayBmb3IgcHVibGljIHVzZVxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbmNvbnN0IHRhc2tNYW5hZ2VyID0gKCgpID0+IHtcbiAgY29uc3QgY3JlYXRlTmV3VGFzayA9IChcbiAgICBwcm9qZWN0SW5kZXgsXG4gICAgdGl0bGUsXG4gICAgZGVzY3JpcHRpb24sXG4gICAgZHVlRGF0ZSxcbiAgICBwcmlvcml0eSxcbiAgICBzdGF0dXMsXG4gICkgPT4ge1xuICAgIGNvbnN0IHByb2plY3QgPSBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV07XG4gICAgLyogY29uc3QgdGFza0FscmVhZHlFeGlzdHMgPSBwcm9qZWN0LnRhc2tzLmZpbmQoKHRhc2spID0+IHtcbiAgICAgIHJldHVybiB0YXNrLnRpdGxlID09PSB0aXRsZTtcbiAgICB9KTtcblxuICAgIGlmICh0eXBlb2YgdGFza0FscmVhZHlFeGlzdHMgPT09ICdvYmplY3QnKSB7XG4gICAgICByZXR1cm4gZmFsc2U7IC8vIENhbid0IGNyZWF0ZSBuZXcgdGFzayBiZWNhdXNlIG9uZSB3aXRoIHRoZSBzYW1lIHRpdGxlIGFscmVhZHkgZXhpc3RzXG4gICAgfSAqLyAvKiBUaGlzIGNhbiBjYXVzZSBwcm9ibGVtcyB3aGVuIGVkaXRpbmcgdGhlIHRpdGxlICovXG4gICAgcHJvamVjdC50YXNrcy5wdXNoKG5ldyBUYXNrKHRpdGxlLCBkZXNjcmlwdGlvbiwgZHVlRGF0ZSwgcHJpb3JpdHksIHN0YXR1cykpO1xuXG4gICAgbWVkaWF0b3IucHVibGlzaCgndXBkYXRlZCBhbGwgcHJvamVjdHMnLCBkZWVwQ29weUFycmF5KHByb2plY3RzKSk7XG4gICAgbWVkaWF0b3IucHVibGlzaChcbiAgICAgICduZXcgdGFzayBjcmVhdGVkJyxcbiAgICAgIGRlZXBDb3B5T2JqZWN0KHByb2plY3QudGFza3NbcHJvamVjdC50YXNrcy5sZW5ndGggLSAxXSksXG4gICAgKTtcbiAgfTtcblxuICBjb25zdCBkZWxldGVUYXNrID0gKHByb2plY3RJbmRleCwgdGFza0luZGV4KSA9PiB7XG4gICAgY29uc3QgcHJvamVjdCA9IHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXTtcbiAgICBjb25zdCBpbmRleCA9IE51bWJlcih0YXNrSW5kZXgpO1xuICAgIHByb2plY3QudGFza3Muc3BsaWNlKGluZGV4LCAxKTtcblxuICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3VwZGF0ZWQgYWxsIHByb2plY3RzJywgZGVlcENvcHlBcnJheShwcm9qZWN0cykpO1xuICB9O1xuXG4gIGNvbnN0IGVkaXRUYXNrVGl0bGUgPSAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgsIG5ld1RpdGxlKSA9PiB7XG4gICAgY29uc3QgdGFzayA9IHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXS50YXNrc1tOdW1iZXIodGFza0luZGV4KV07XG4gICAgdGFzay50aXRsZSA9IG5ld1RpdGxlO1xuXG4gICAgbWVkaWF0b3IucHVibGlzaCgndXBkYXRlZCBhbGwgcHJvamVjdHMnLCBkZWVwQ29weUFycmF5KHByb2plY3RzKSk7XG4gICAgbWVkaWF0b3IucHVibGlzaCgndXBkYXRlZCB0YXNrJywgZGVlcENvcHlPYmplY3QodGFzaykpO1xuICB9O1xuXG4gIGNvbnN0IGVkaXRUYXNrRGVzY3JpcHRpb24gPSAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgsIG5ld0Rlc2NyaXB0aW9uKSA9PiB7XG4gICAgY29uc3QgdGFzayA9IHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXS50YXNrc1tOdW1iZXIodGFza0luZGV4KV07XG4gICAgdGFzay5kZXNjcmlwdGlvbiA9IG5ld0Rlc2NyaXB0aW9uO1xuXG4gICAgbWVkaWF0b3IucHVibGlzaCgndXBkYXRlZCBhbGwgcHJvamVjdHMnLCBkZWVwQ29weUFycmF5KHByb2plY3RzKSk7XG4gICAgbWVkaWF0b3IucHVibGlzaCgndXBkYXRlZCB0YXNrJywgZGVlcENvcHlPYmplY3QodGFzaykpO1xuICB9O1xuXG4gIGNvbnN0IGVkaXRUYXNrRHVlRGF0ZSA9IChwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCwgbmV3RHVlRGF0ZSkgPT4ge1xuICAgIGNvbnN0IHRhc2sgPSBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0udGFza3NbTnVtYmVyKHRhc2tJbmRleCldO1xuICAgIHRhc2suZHVlRGF0ZSA9IG5ld0R1ZURhdGU7XG5cbiAgICBtZWRpYXRvci5wdWJsaXNoKCd1cGRhdGVkIGFsbCBwcm9qZWN0cycsIGRlZXBDb3B5QXJyYXkocHJvamVjdHMpKTtcbiAgICBtZWRpYXRvci5wdWJsaXNoKCd1cGRhdGVkIHRhc2snLCBkZWVwQ29weU9iamVjdCh0YXNrKSk7XG4gIH07XG5cbiAgY29uc3QgZWRpdFRhc2tQcmlvcml0eSA9IChwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCwgbmV3UHJpb3JpdHkpID0+IHtcbiAgICBjb25zdCB0YXNrID0gcHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldLnRhc2tzW051bWJlcih0YXNrSW5kZXgpXTtcbiAgICB0YXNrLnByaW9yaXR5ID0gbmV3UHJpb3JpdHk7XG5cbiAgICBtZWRpYXRvci5wdWJsaXNoKCd1cGRhdGVkIGFsbCBwcm9qZWN0cycsIGRlZXBDb3B5QXJyYXkocHJvamVjdHMpKTtcbiAgICBtZWRpYXRvci5wdWJsaXNoKCd1cGRhdGVkIHRhc2snLCBkZWVwQ29weU9iamVjdCh0YXNrKSk7XG4gIH07XG5cbiAgY29uc3QgZWRpdFRhc2tTdGF0dXMgPSAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgsIG5ld1N0YXR1cykgPT4ge1xuICAgIGNvbnN0IHRhc2sgPSBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0udGFza3NbTnVtYmVyKHRhc2tJbmRleCldO1xuICAgIHRhc2suc3RhdHVzID0gbmV3U3RhdHVzO1xuXG4gICAgbWVkaWF0b3IucHVibGlzaCgndXBkYXRlZCBhbGwgcHJvamVjdHMnLCBkZWVwQ29weUFycmF5KHByb2plY3RzKSk7XG4gICAgbWVkaWF0b3IucHVibGlzaCgndXBkYXRlZCB0YXNrJywgZGVlcENvcHlPYmplY3QodGFzaykpO1xuICB9O1xuXG4gIGNvbnN0IHJldmVhbFRhc2sgPSAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgpID0+IHtcbiAgICBjb25zdCB0YXNrQ29weSA9IGRlZXBDb3B5T2JqZWN0KFxuICAgICAgcHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldLnRhc2tzW051bWJlcih0YXNrSW5kZXgpXSxcbiAgICApO1xuXG4gICAgbWVkaWF0b3IucHVibGlzaCgncmV2ZWFsZWQgdGFzaycsIHRhc2tDb3B5KTtcbiAgfTtcblxuICBjb25zdCBzdWJzY3JpYmUgPSAoKSA9PiB7fTtcblxuICByZXR1cm4ge1xuICAgIGNyZWF0ZU5ld1Rhc2ssXG4gICAgZGVsZXRlVGFzayxcbiAgICBlZGl0VGFza1RpdGxlLFxuICAgIGVkaXRUYXNrRGVzY3JpcHRpb24sXG4gICAgZWRpdFRhc2tEdWVEYXRlLFxuICAgIGVkaXRUYXNrUHJpb3JpdHksXG4gICAgZWRpdFRhc2tTdGF0dXMsXG4gICAgcmV2ZWFsVGFzayxcbiAgICBzdWJzY3JpYmUsXG4gIH07XG59KSgpO1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuU3RlcCBNYW5hZ2VyXG4gIC0gQ3JlYXRlICYgZGVsZXRlIHN0ZXBzIGluIGEgdGFza1xuICAtIEVkaXQgc3RlcCBkZXNjcmlwdGlvbiAmIHN0YXR1c1xuICAtIENyZWF0ZSBhIHNmZSBjb3B5IG9mIGEgc2luZ2xlIHN0ZXAgZm9yIHB1YmxpYyB1c2VcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5jb25zdCBzdGVwTWFuYWdlciA9ICgoKSA9PiB7XG4gIGNvbnN0IGNyZWF0ZU5ld1N0ZXAgPSAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgsIGRlc2NyaXB0aW9uLCBzdGF0dXMpID0+IHtcbiAgICBjb25zdCB0YXNrID0gcHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldLnRhc2tzW051bWJlcih0YXNrSW5kZXgpXTtcbiAgICB0YXNrLnN0ZXBzLnB1c2gobmV3IFN0ZXAoZGVzY3JpcHRpb24sIHN0YXR1cykpO1xuXG4gICAgbWVkaWF0b3IucHVibGlzaCgndXBkYXRlZCBhbGwgcHJvamVjdHMnLCBkZWVwQ29weUFycmF5KHByb2plY3RzKSk7XG4gICAgbWVkaWF0b3IucHVibGlzaChcbiAgICAgICduZXcgc3RlcCBjcmVhdGVkJyxcbiAgICAgIGRlZXBDb3B5T2JqZWN0KHRhc2suc3RlcHNbdGFzay5zdGVwcy5sZW5ndGggLSAxXSksXG4gICAgKTtcbiAgfTtcblxuICBjb25zdCBkZWxldGVTdGVwID0gKHByb2plY3RJbmRleCwgdGFza0luZGV4LCBzdGVwSW5kZXgpID0+IHtcbiAgICBjb25zdCB0YXNrID0gcHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldLnRhc2tzW051bWJlcih0YXNrSW5kZXgpXTtcbiAgICBjb25zdCBpbmRleCA9IE51bWJlcihzdGVwSW5kZXgpO1xuICAgIHRhc2suc3RlcHMuc3BsaWNlKGluZGV4LCAxKTtcblxuICAgIG1lZGlhdG9yLnB1Ymxpc2goJ3VwZGF0ZWQgYWxsIHByb2plY3RzJywgZGVlcENvcHlBcnJheShwcm9qZWN0cykpO1xuICB9O1xuXG4gIGNvbnN0IGVkaXRTdGVwRGVzY3JpcHRpb24gPSAoXG4gICAgcHJvamVjdEluZGV4LFxuICAgIHRhc2tJbmRleCxcbiAgICBzdGVwSW5kZXgsXG4gICAgbmV3RGVzY3JpcHRpb24sXG4gICkgPT4ge1xuICAgIGNvbnN0IHN0ZXAgPVxuICAgICAgcHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldLnRhc2tzW051bWJlcih0YXNrSW5kZXgpXS5zdGVwc1tcbiAgICAgICAgTnVtYmVyKHN0ZXBJbmRleClcbiAgICAgIF07XG4gICAgc3RlcC5kZXNjcmlwdGlvbiA9IG5ld0Rlc2NyaXB0aW9uO1xuXG4gICAgbWVkaWF0b3IucHVibGlzaCgndXBkYXRlZCBhbGwgcHJvamVjdHMnLCBkZWVwQ29weUFycmF5KHByb2plY3RzKSk7XG4gICAgbWVkaWF0b3IucHVibGlzaCgndXBkYXRlZCBzdGVwJywgZGVlcENvcHlPYmplY3Qoc3RlcCkpO1xuICB9O1xuXG4gIGNvbnN0IGVkaXRTdGVwU3RhdHVzID0gKHByb2plY3RJbmRleCwgdGFza0luZGV4LCBzdGVwSW5kZXgsIG5ld1N0YXR1cykgPT4ge1xuICAgIGNvbnN0IHN0ZXAgPVxuICAgICAgcHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldLnRhc2tzW051bWJlcih0YXNrSW5kZXgpXS5zdGVwc1tcbiAgICAgICAgTnVtYmVyKHN0ZXBJbmRleClcbiAgICAgIF07XG4gICAgc3RlcC5zdGF0dXMgPSBuZXdTdGF0dXM7XG5cbiAgICBtZWRpYXRvci5wdWJsaXNoKCd1cGRhdGVkIGFsbCBwcm9qZWN0cycsIGRlZXBDb3B5QXJyYXkocHJvamVjdHMpKTtcbiAgICBtZWRpYXRvci5wdWJsaXNoKCd1cGRhdGVkIHN0ZXAnLCBkZWVwQ29weU9iamVjdChzdGVwKSk7XG4gIH07XG5cbiAgY29uc3QgcmV2ZWFsU3RlcCA9IChwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCwgc3RlcEluZGV4KSA9PiB7XG4gICAgY29uc3Qgc3RlcENvcHkgPSBkZWVwQ29weU9iamVjdChcbiAgICAgIHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXS50YXNrc1tOdW1iZXIodGFza0luZGV4KV0uc3RlcHNbXG4gICAgICAgIE51bWJlcihzdGVwSW5kZXgpXG4gICAgICBdLFxuICAgICk7XG5cbiAgICBtZWRpYXRvci5wdWJsaXNoKCdyZXZlYWxlZCBzdGVwJywgc3RlcENvcHkpO1xuICAgIHJldHVybiBzdGVwQ29weTtcbiAgfTtcblxuICBjb25zdCBzdWJzY3JpYmUgPSAoKSA9PiB7fTtcblxuICByZXR1cm4ge1xuICAgIGNyZWF0ZU5ld1N0ZXAsXG4gICAgZGVsZXRlU3RlcCxcbiAgICBlZGl0U3RlcERlc2NyaXB0aW9uLFxuICAgIGVkaXRTdGVwU3RhdHVzLFxuICAgIHJldmVhbFN0ZXAsXG4gICAgc3Vic2NyaWJlLFxuICB9O1xufSkoKTtcblxuZXhwb3J0IHsgcHJvamVjdE1hbmFnZXIsIHRhc2tNYW5hZ2VyLCBzdGVwTWFuYWdlciB9O1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBwcm9qZWN0TWFuYWdlciB9IGZyb20gJy4vdG9Eb0xpc3QnO1xuaW1wb3J0IHN0b3JhZ2VNYW5hZ2VyIGZyb20gJy4vc3RvcmFnZSc7XG5cbi8qIHByb2plY3RNYW5hZ2VyLnN1YnNjcmliZSgpO1xuc3RvcmFnZU1hbmFnZXIuc3Vic2NyaWJlKCk7XG5zdG9yYWdlTWFuYWdlci5nZXRTdG9yYWdlKCk7ICovXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=