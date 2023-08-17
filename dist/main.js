/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/storage.js":
/*!************************!*\
  !*** ./src/storage.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const storageManager = (() => {
  /* Initial function to get anything saved in localStorage */
  const getStorage = () => {
    let toDoList = [];
    if (localStorage.toDoList) {
      toDoList = JSON.parse(localStorage.getItem('toDoList'));
    }

    return toDoList;
  };

  const setStorage = (projects) => {
    const toDoList = JSON.stringify(projects);
    localStorage.setItem('toDoList', toDoList);
  };

  return { getStorage, setStorage };
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
/* harmony import */ var _storage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./storage */ "./src/storage.js");
/* Contents:

  - Constructors - Task, Step & Project

  - Functions to deep clone arrays & objects, & update local storage

  - Project Manager

  - Task Manager

  - Step Manager
*/


/* ********************************************************************
- Constructors - Task, Step & Project
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
- Functions to deep clone arrays & objects, & update local storage
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

const setStorage = () => {
  const projectsCopy = deepCopyArray(projects);
  _storage__WEBPACK_IMPORTED_MODULE_0__["default"].setStorage(projectsCopy);
};

/* ********************************************************************
- Project Manager
  - Create a safe copy of a project & of the projects array for public use
  - Create & delete projects
  - Edit project titles & descriptions
  - Initialise by checking for locally stored projects
******************************************************************** */
const projectManager = (() => {
  const revealProject = (projectIndex) => {
    const projectCopy = deepCopyObject(projects[Number(projectIndex)]);

    return projectCopy;
  };

  const revealAllProjects = () => {
    const projectsCopy = deepCopyArray(projects);

    return projectsCopy;
  };

  const createNewProject = (title, description) => {
    const newProject = new Project(title, description);
    projects.push(newProject);

    setStorage();
    return revealProject(projects.length - 1);
  };

  const deleteProject = (projectIndex) => {
    const index = Number(projectIndex);
    projects.splice(index, 1);

    setStorage();
    return revealAllProjects();
  };

  /* Might not need this */
  const deleteProjectByName = (projectTitle) => {
    projects.forEach((project) => {
      if (project.title === projectTitle) {
        projects.splice(projects.indexOf(project), 1);
      }
    });

    setStorage();
    return revealAllProjects();
  };

  const editProjectTitle = (projectIndex, newTitle) => {
    projects[Number(projectIndex)].title = newTitle;

    setStorage();
    return revealProject(Number(projectIndex));
  };

  const editProjectDescription = (projectIndex, newDescription) => {
    projects[Number(projectIndex)].description = newDescription;

    setStorage();
    return revealProject(Number(projectIndex));
  };

  /* This should be used at the beggining of the code to start the app properly */
  const initialise = () => {
    const storedProjects = _storage__WEBPACK_IMPORTED_MODULE_0__["default"].getStorage();
    if (storedProjects.length === 0) {
      createNewProject('Inbox', '');
    } else {
      for (let i = 0; i < storedProjects.length; i++) {
        projects.push(storedProjects[i]);
      }
    }
    return revealAllProjects();
  };

  return {
    revealProject,
    revealAllProjects,
    createNewProject,
    deleteProject,
    deleteProjectByName,
    editProjectTitle,
    editProjectDescription,
    initialise,
  };
})();

/* ********************************************************************
- Task Manager
  - Create a safe copy of a single task for public use
  - Create & delete tasks in a project
  - Edit task title, description, due date, priority & status
  - Subscribe to mediator events
******************************************************************** */
const taskManager = (() => {
  const revealTask = (projectIndex, taskIndex) => {
    const taskCopy = deepCopyObject(
      projects[Number(projectIndex)].tasks[Number(taskIndex)],
    );

    return taskCopy;
  };

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

    setStorage();
    return revealTask(Number(projectIndex), project.tasks.length - 1);
  };

  const deleteTask = (projectIndex, taskIndex) => {
    const project = projects[Number(projectIndex)];
    const index = Number(taskIndex);
    project.tasks.splice(index, 1);

    setStorage();
    return projectManager.revealProject(Number(projectIndex));
  };

  const editTaskTitle = (projectIndex, taskIndex, newTitle) => {
    const task = projects[Number(projectIndex)].tasks[Number(taskIndex)];
    task.title = newTitle;

    setStorage();
    return revealTask(Number(projectIndex), Number(taskIndex));
  };

  const editTaskDescription = (projectIndex, taskIndex, newDescription) => {
    const task = projects[Number(projectIndex)].tasks[Number(taskIndex)];
    task.description = newDescription;

    setStorage();
    return revealTask(Number(projectIndex), Number(taskIndex));
  };

  const editTaskDueDate = (projectIndex, taskIndex, newDueDate) => {
    const task = projects[Number(projectIndex)].tasks[Number(taskIndex)];
    task.dueDate = newDueDate;

    setStorage();
    return revealTask(Number(projectIndex), Number(taskIndex));
  };

  const editTaskPriority = (projectIndex, taskIndex, newPriority) => {
    const task = projects[Number(projectIndex)].tasks[Number(taskIndex)];
    task.priority = newPriority;

    setStorage();
    return revealTask(Number(projectIndex), Number(taskIndex));
  };

  const editTaskStatus = (projectIndex, taskIndex, newStatus) => {
    const task = projects[Number(projectIndex)].tasks[Number(taskIndex)];
    task.status = newStatus;

    setStorage();
    return revealTask(Number(projectIndex), Number(taskIndex));
  };

  return {
    revealTask,
    createNewTask,
    deleteTask,
    editTaskTitle,
    editTaskDescription,
    editTaskDueDate,
    editTaskPriority,
    editTaskStatus,
  };
})();

/* ********************************************************************
- Step Manager
  - Create & delete steps in a task
  - Edit step description & status
  - Create a sfe copy of a single step for public use
  - Subscribe to mediator events
******************************************************************** */
const stepManager = (() => {
  const revealStep = (projectIndex, taskIndex, stepIndex) => {
    const stepCopy = deepCopyObject(
      projects[Number(projectIndex)].tasks[Number(taskIndex)].steps[
        Number(stepIndex)
      ],
    );

    return stepCopy;
  };

  const createNewStep = (projectIndex, taskIndex, description, status) => {
    const task = projects[Number(projectIndex)].tasks[Number(taskIndex)];
    task.steps.push(new Step(description, status));

    setStorage();
    return revealStep(
      Number(projectIndex),
      Number(taskIndex),
      task.steps.length - 1,
    );
  };

  const deleteStep = (projectIndex, taskIndex, stepIndex) => {
    const task = projects[Number(projectIndex)].tasks[Number(taskIndex)];
    const index = Number(stepIndex);
    task.steps.splice(index, 1);

    setStorage();
    return taskManager.revealTask(Number(projectIndex), Number(taskIndex));
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

    setStorage();
    return revealStep(
      Number(projectIndex),
      Number(taskIndex),
      Number(stepIndex),
    );
  };

  const editStepStatus = (projectIndex, taskIndex, stepIndex, newStatus) => {
    const step =
      projects[Number(projectIndex)].tasks[Number(taskIndex)].steps[
        Number(stepIndex)
      ];
    step.status = newStatus;

    setStorage();
    return revealStep(
      Number(projectIndex),
      Number(taskIndex),
      Number(stepIndex),
    );
  };

  return {
    revealStep,
    createNewStep,
    deleteStep,
    editStepDescription,
    editStepStatus,
  };
})();




/***/ }),

/***/ "./src/ui.js":
/*!*******************!*\
  !*** ./src/ui.js ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _toDoList__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toDoList */ "./src/toDoList.js");
/* Contents:

	- General

	- Header module

	- Navbar module
	
	- Module to control things common most modals

	- 'New List' modal module

	- Initialiser function
*/
/* **************************************************************
- General
************************************************************** */


const toggleHidden = (element) => {
  element.classList.toggle('hidden');
};
/* **************************************************************

************************************************************** */

/* **************************************************************
- Header module
************************************************************** */
const header = (() => {
  /* Function to invoke in initiliser function, for the component to work properly */
  const addHeaderListeners = () => {
    const toggleNavBtn = document.getElementById('toggle-nav-button');
    const toggleAsideBtn = document.getElementById('toggle-aside-button');
    const nav = document.querySelector('nav');
    const aside = document.querySelector('aside');

    toggleNavBtn.addEventListener('click', () => toggleHidden(nav));
    toggleAsideBtn.addEventListener('click', () => toggleHidden(aside));
  };

  return { addHeaderListeners };
})();

/* **************************************************************
- Navbar module
************************************************************** */
const navbar = (() => {
  const renderNewList = (list) => {
    const navList = document.getElementById('nav-todo-lists');
    const listItem = document.createElement('li');
    const link = document.createElement('a');
    const div = document.createElement('div');
    const editBtn = document.createElement('button');
    const editImg = document.createElement('img');
    const deleteBtn = document.createElement('button');
    const deleteImg = document.createElement('img');

    link.setAttribute('href', '#');
    link.textContent = `${list.title}`;
    div.classList.add('nav-list-buttons');
    editImg.setAttribute('src', './icons/edit.svg');
    editImg.setAttribute('alt', 'button to edit list');
    deleteImg.setAttribute('src', './icons/delete.svg');
    deleteImg.setAttribute('alt', 'button to delete list');

    editBtn.appendChild(editImg);
    deleteBtn.appendChild(deleteImg);
    div.appendChild(editBtn);
    div.appendChild(deleteBtn);
    listItem.appendChild(link);
    listItem.appendChild(div);
    navList.appendChild(listItem);
  };

  /* Functions to invoke in initiliser function, for the component to work properly */
  const renderCurrentLists = () => {
    const lists = _toDoList__WEBPACK_IMPORTED_MODULE_0__.projectManager.revealAllProjects();
    lists.forEach((list) => {
      if (lists.indexOf(list) > 0) {
        renderNewList(list);
      }
    });
  };

  const addNewListBtnListener = () => {
    const newListBtn = document.querySelector('.nav-new-list-button');
    const modalNewList =
      document.querySelector('.new-list-modal').parentElement;
    newListBtn.addEventListener('click', () => toggleHidden(modalNewList));
  };

  return { renderNewList, renderCurrentLists, addNewListBtnListener };
})();

/* **************************************************************
- Module to control things common most modals
************************************************************** */
const allModals = (() => {
  /* General functions to close modals and clear inputs */
  const clearInputs = (modal) => {
    const inputs = modal.querySelectorAll('input');
    const textareas = modal.querySelectorAll('textarea');
    inputs.forEach((input) => {
      input.value = '';
    });
    textareas.forEach((textarea) => {
      textarea.value = '';
    });
  };

  const closeModal = (modal) => {
    clearInputs(modal);
    toggleHidden(modal);
  };

  /* Functions to invoke in initiliser function, for the component to work properly */
  const addCloseBtnListeners = () => {
    const closeModalBtns = document.querySelectorAll('.modal-close-button');

    closeModalBtns.forEach((btn) => {
      const modal = btn.parentElement.parentElement.parentElement;
      btn.addEventListener('click', () => closeModal(modal));
    });
  };

  const addCloseBackgroundListeners = () => {
    const modalBackgrounds = document.querySelectorAll('.modal-background');
    const close = (e, modalBackground) => {
      if (!e.target.closest('.modal')) {
        closeModal(modalBackground);
      }
    };

    modalBackgrounds.forEach((background) => {
      background.addEventListener('click', (e) => close(e, background));
    });
  };

  return { closeModal, addCloseBtnListeners, addCloseBackgroundListeners };
})();

/* **************************************************************
- 'New List' modal module
************************************************************** */
const newListModal = (() => {
  const submitBtn = document.getElementById('new-list-submit-button');

  const creatNewList = (e) => {
    const titleInput = document.getElementById('new-list-name').value;
    const descriptionInput = document.getElementById(
      'new-list-description',
    ).value;
    const modal = document.querySelector('.new-list-modal').parentElement;
    if (titleInput.value !== '') {
      e.preventDefault();

      const newList = _toDoList__WEBPACK_IMPORTED_MODULE_0__.projectManager.createNewProject(
        titleInput,
        descriptionInput,
      );
      navbar.renderNewList(newList);

      allModals.closeModal(modal);
    }
  };

  /* Function to invoke in initiliser function, for the component to work properly */
  const addSubmitBtnListener = () => {
    submitBtn.addEventListener('click', (e) => creatNewList(e));
  };

  return { addSubmitBtnListener };
})();

/* **************************************************************
- Initialiser function
************************************************************** */
const initialiseUI = () => {
  header.addHeaderListeners();

  navbar.renderCurrentLists();
  navbar.addNewListBtnListener();

  allModals.addCloseBtnListeners();
  allModals.addCloseBackgroundListeners();

  newListModal.addSubmitBtnListener();
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (initialiseUI);


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
/* harmony import */ var _ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ui */ "./src/ui.js");



_toDoList__WEBPACK_IMPORTED_MODULE_0__.projectManager.initialise();
(0,_ui__WEBPACK_IMPORTED_MODULE_1__["default"])();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsV0FBVztBQUNYLENBQUM7O0FBRUQsaUVBQWUsY0FBYyxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNuQjlCOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDdUM7O0FBRXZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxFQUFFLGdEQUFjO0FBQ2hCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsMkJBQTJCLGdEQUFjO0FBQ3pDO0FBQ0E7QUFDQSxNQUFNO0FBQ04sc0JBQXNCLDJCQUEyQjtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVtRDs7Ozs7Ozs7Ozs7Ozs7OztBQ3pWcEQ7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDc0U7O0FBRXRFO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxXQUFXO0FBQ1gsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDBCQUEwQixXQUFXO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esa0JBQWtCLHFEQUFjO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxXQUFXO0FBQ1gsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQSxXQUFXO0FBQ1gsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsc0JBQXNCLHFEQUFjO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxXQUFXO0FBQ1gsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBLGlFQUFlLFlBQVksRUFBQzs7Ozs7OztVQzlMNUI7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7QUNOc0U7QUFDdEM7O0FBRWhDLHFEQUFjO0FBQ2QsK0NBQVkiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90by1kby1saXN0Ly4vc3JjL3N0b3JhZ2UuanMiLCJ3ZWJwYWNrOi8vdG8tZG8tbGlzdC8uL3NyYy90b0RvTGlzdC5qcyIsIndlYnBhY2s6Ly90by1kby1saXN0Ly4vc3JjL3VpLmpzIiwid2VicGFjazovL3RvLWRvLWxpc3Qvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdG8tZG8tbGlzdC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vdG8tZG8tbGlzdC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3RvLWRvLWxpc3Qvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly90by1kby1saXN0Ly4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHN0b3JhZ2VNYW5hZ2VyID0gKCgpID0+IHtcbiAgLyogSW5pdGlhbCBmdW5jdGlvbiB0byBnZXQgYW55dGhpbmcgc2F2ZWQgaW4gbG9jYWxTdG9yYWdlICovXG4gIGNvbnN0IGdldFN0b3JhZ2UgPSAoKSA9PiB7XG4gICAgbGV0IHRvRG9MaXN0ID0gW107XG4gICAgaWYgKGxvY2FsU3RvcmFnZS50b0RvTGlzdCkge1xuICAgICAgdG9Eb0xpc3QgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0b0RvTGlzdCcpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdG9Eb0xpc3Q7XG4gIH07XG5cbiAgY29uc3Qgc2V0U3RvcmFnZSA9IChwcm9qZWN0cykgPT4ge1xuICAgIGNvbnN0IHRvRG9MaXN0ID0gSlNPTi5zdHJpbmdpZnkocHJvamVjdHMpO1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd0b0RvTGlzdCcsIHRvRG9MaXN0KTtcbiAgfTtcblxuICByZXR1cm4geyBnZXRTdG9yYWdlLCBzZXRTdG9yYWdlIH07XG59KSgpO1xuXG5leHBvcnQgZGVmYXVsdCBzdG9yYWdlTWFuYWdlcjtcbiIsIi8qIENvbnRlbnRzOlxuXG4gIC0gQ29uc3RydWN0b3JzIC0gVGFzaywgU3RlcCAmIFByb2plY3RcblxuICAtIEZ1bmN0aW9ucyB0byBkZWVwIGNsb25lIGFycmF5cyAmIG9iamVjdHMsICYgdXBkYXRlIGxvY2FsIHN0b3JhZ2VcblxuICAtIFByb2plY3QgTWFuYWdlclxuXG4gIC0gVGFzayBNYW5hZ2VyXG5cbiAgLSBTdGVwIE1hbmFnZXJcbiovXG5pbXBvcnQgc3RvcmFnZU1hbmFnZXIgZnJvbSAnLi9zdG9yYWdlJztcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi0gQ29uc3RydWN0b3JzIC0gVGFzaywgU3RlcCAmIFByb2plY3RcbiAgLSBTdGVwIGdvZXMgaW5zaWRlIFRhc2suc3RlcHNbXVxuICAtIFRhc2sgZ29lcyBpbnNpZGUgUHJvamVjdC50YXNrc1tdXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuY2xhc3MgVGFzayB7XG4gIGNvbnN0cnVjdG9yKHRpdGxlLCBkZXNjcmlwdGlvbiwgZHVlRGF0ZSwgcHJpb3JpdHksIHN0YXR1cykge1xuICAgIHRoaXMudGl0bGUgPSB0aXRsZTtcbiAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XG4gICAgdGhpcy5zdGVwcyA9IFtdO1xuICAgIHRoaXMuZHVlRGF0ZSA9IGR1ZURhdGU7XG4gICAgdGhpcy5wcmlvcml0eSA9IHByaW9yaXR5O1xuICAgIHRoaXMuc3RhdHVzID0gc3RhdHVzO1xuICB9XG59XG5cbmNsYXNzIFN0ZXAge1xuICBjb25zdHJ1Y3RvcihkZXNjcmlwdGlvbiwgc3RhdHVzKSB7XG4gICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xuICAgIHRoaXMuc3RhdHVzID0gc3RhdHVzO1xuICB9XG59XG5cbmNsYXNzIFByb2plY3Qge1xuICBjb25zdHJ1Y3Rvcih0aXRsZSwgZGVzY3JpcHRpb24pIHtcbiAgICB0aGlzLnRpdGxlID0gdGl0bGU7XG4gICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xuICAgIHRoaXMudGFza3MgPSBbXTtcbiAgfVxufVxuXG5jb25zdCBwcm9qZWN0cyA9IFtdO1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLSBGdW5jdGlvbnMgdG8gZGVlcCBjbG9uZSBhcnJheXMgJiBvYmplY3RzLCAmIHVwZGF0ZSBsb2NhbCBzdG9yYWdlXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuY29uc3QgZGVlcENvcHlBcnJheSA9IChhcnJheSkgPT4ge1xuICBjb25zdCBhcnJheUNvcHkgPSBbXTtcbiAgYXJyYXkuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgIGlmIChBcnJheS5pc0FycmF5KGl0ZW0pKSB7XG4gICAgICBhcnJheUNvcHkucHVzaChkZWVwQ29weUFycmF5KGl0ZW0pKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBpdGVtID09PSAnb2JqZWN0Jykge1xuICAgICAgYXJyYXlDb3B5LnB1c2goZGVlcENvcHlPYmplY3QoaXRlbSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcnJheUNvcHkucHVzaChpdGVtKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gYXJyYXlDb3B5O1xufTtcblxuY29uc3QgZGVlcENvcHlPYmplY3QgPSAob2JqZWN0KSA9PiB7XG4gIGNvbnN0IG9iamVjdENvcHkgPSB7fTtcbiAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMob2JqZWN0KSkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgb2JqZWN0Q29weVtrZXldID0gZGVlcENvcHlBcnJheSh2YWx1ZSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgICBvYmplY3RDb3B5W2tleV0gPSBkZWVwQ29weU9iamVjdCh2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9iamVjdENvcHlba2V5XSA9IHZhbHVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gb2JqZWN0Q29weTtcbn07XG5cbmNvbnN0IHNldFN0b3JhZ2UgPSAoKSA9PiB7XG4gIGNvbnN0IHByb2plY3RzQ29weSA9IGRlZXBDb3B5QXJyYXkocHJvamVjdHMpO1xuICBzdG9yYWdlTWFuYWdlci5zZXRTdG9yYWdlKHByb2plY3RzQ29weSk7XG59O1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLSBQcm9qZWN0IE1hbmFnZXJcbiAgLSBDcmVhdGUgYSBzYWZlIGNvcHkgb2YgYSBwcm9qZWN0ICYgb2YgdGhlIHByb2plY3RzIGFycmF5IGZvciBwdWJsaWMgdXNlXG4gIC0gQ3JlYXRlICYgZGVsZXRlIHByb2plY3RzXG4gIC0gRWRpdCBwcm9qZWN0IHRpdGxlcyAmIGRlc2NyaXB0aW9uc1xuICAtIEluaXRpYWxpc2UgYnkgY2hlY2tpbmcgZm9yIGxvY2FsbHkgc3RvcmVkIHByb2plY3RzXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuY29uc3QgcHJvamVjdE1hbmFnZXIgPSAoKCkgPT4ge1xuICBjb25zdCByZXZlYWxQcm9qZWN0ID0gKHByb2plY3RJbmRleCkgPT4ge1xuICAgIGNvbnN0IHByb2plY3RDb3B5ID0gZGVlcENvcHlPYmplY3QocHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldKTtcblxuICAgIHJldHVybiBwcm9qZWN0Q29weTtcbiAgfTtcblxuICBjb25zdCByZXZlYWxBbGxQcm9qZWN0cyA9ICgpID0+IHtcbiAgICBjb25zdCBwcm9qZWN0c0NvcHkgPSBkZWVwQ29weUFycmF5KHByb2plY3RzKTtcblxuICAgIHJldHVybiBwcm9qZWN0c0NvcHk7XG4gIH07XG5cbiAgY29uc3QgY3JlYXRlTmV3UHJvamVjdCA9ICh0aXRsZSwgZGVzY3JpcHRpb24pID0+IHtcbiAgICBjb25zdCBuZXdQcm9qZWN0ID0gbmV3IFByb2plY3QodGl0bGUsIGRlc2NyaXB0aW9uKTtcbiAgICBwcm9qZWN0cy5wdXNoKG5ld1Byb2plY3QpO1xuXG4gICAgc2V0U3RvcmFnZSgpO1xuICAgIHJldHVybiByZXZlYWxQcm9qZWN0KHByb2plY3RzLmxlbmd0aCAtIDEpO1xuICB9O1xuXG4gIGNvbnN0IGRlbGV0ZVByb2plY3QgPSAocHJvamVjdEluZGV4KSA9PiB7XG4gICAgY29uc3QgaW5kZXggPSBOdW1iZXIocHJvamVjdEluZGV4KTtcbiAgICBwcm9qZWN0cy5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gICAgc2V0U3RvcmFnZSgpO1xuICAgIHJldHVybiByZXZlYWxBbGxQcm9qZWN0cygpO1xuICB9O1xuXG4gIC8qIE1pZ2h0IG5vdCBuZWVkIHRoaXMgKi9cbiAgY29uc3QgZGVsZXRlUHJvamVjdEJ5TmFtZSA9IChwcm9qZWN0VGl0bGUpID0+IHtcbiAgICBwcm9qZWN0cy5mb3JFYWNoKChwcm9qZWN0KSA9PiB7XG4gICAgICBpZiAocHJvamVjdC50aXRsZSA9PT0gcHJvamVjdFRpdGxlKSB7XG4gICAgICAgIHByb2plY3RzLnNwbGljZShwcm9qZWN0cy5pbmRleE9mKHByb2plY3QpLCAxKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHNldFN0b3JhZ2UoKTtcbiAgICByZXR1cm4gcmV2ZWFsQWxsUHJvamVjdHMoKTtcbiAgfTtcblxuICBjb25zdCBlZGl0UHJvamVjdFRpdGxlID0gKHByb2plY3RJbmRleCwgbmV3VGl0bGUpID0+IHtcbiAgICBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0udGl0bGUgPSBuZXdUaXRsZTtcblxuICAgIHNldFN0b3JhZ2UoKTtcbiAgICByZXR1cm4gcmV2ZWFsUHJvamVjdChOdW1iZXIocHJvamVjdEluZGV4KSk7XG4gIH07XG5cbiAgY29uc3QgZWRpdFByb2plY3REZXNjcmlwdGlvbiA9IChwcm9qZWN0SW5kZXgsIG5ld0Rlc2NyaXB0aW9uKSA9PiB7XG4gICAgcHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldLmRlc2NyaXB0aW9uID0gbmV3RGVzY3JpcHRpb247XG5cbiAgICBzZXRTdG9yYWdlKCk7XG4gICAgcmV0dXJuIHJldmVhbFByb2plY3QoTnVtYmVyKHByb2plY3RJbmRleCkpO1xuICB9O1xuXG4gIC8qIFRoaXMgc2hvdWxkIGJlIHVzZWQgYXQgdGhlIGJlZ2dpbmluZyBvZiB0aGUgY29kZSB0byBzdGFydCB0aGUgYXBwIHByb3Blcmx5ICovXG4gIGNvbnN0IGluaXRpYWxpc2UgPSAoKSA9PiB7XG4gICAgY29uc3Qgc3RvcmVkUHJvamVjdHMgPSBzdG9yYWdlTWFuYWdlci5nZXRTdG9yYWdlKCk7XG4gICAgaWYgKHN0b3JlZFByb2plY3RzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgY3JlYXRlTmV3UHJvamVjdCgnSW5ib3gnLCAnJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RvcmVkUHJvamVjdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcHJvamVjdHMucHVzaChzdG9yZWRQcm9qZWN0c1tpXSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXZlYWxBbGxQcm9qZWN0cygpO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgcmV2ZWFsUHJvamVjdCxcbiAgICByZXZlYWxBbGxQcm9qZWN0cyxcbiAgICBjcmVhdGVOZXdQcm9qZWN0LFxuICAgIGRlbGV0ZVByb2plY3QsXG4gICAgZGVsZXRlUHJvamVjdEJ5TmFtZSxcbiAgICBlZGl0UHJvamVjdFRpdGxlLFxuICAgIGVkaXRQcm9qZWN0RGVzY3JpcHRpb24sXG4gICAgaW5pdGlhbGlzZSxcbiAgfTtcbn0pKCk7XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4tIFRhc2sgTWFuYWdlclxuICAtIENyZWF0ZSBhIHNhZmUgY29weSBvZiBhIHNpbmdsZSB0YXNrIGZvciBwdWJsaWMgdXNlXG4gIC0gQ3JlYXRlICYgZGVsZXRlIHRhc2tzIGluIGEgcHJvamVjdFxuICAtIEVkaXQgdGFzayB0aXRsZSwgZGVzY3JpcHRpb24sIGR1ZSBkYXRlLCBwcmlvcml0eSAmIHN0YXR1c1xuICAtIFN1YnNjcmliZSB0byBtZWRpYXRvciBldmVudHNcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5jb25zdCB0YXNrTWFuYWdlciA9ICgoKSA9PiB7XG4gIGNvbnN0IHJldmVhbFRhc2sgPSAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgpID0+IHtcbiAgICBjb25zdCB0YXNrQ29weSA9IGRlZXBDb3B5T2JqZWN0KFxuICAgICAgcHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldLnRhc2tzW051bWJlcih0YXNrSW5kZXgpXSxcbiAgICApO1xuXG4gICAgcmV0dXJuIHRhc2tDb3B5O1xuICB9O1xuXG4gIGNvbnN0IGNyZWF0ZU5ld1Rhc2sgPSAoXG4gICAgcHJvamVjdEluZGV4LFxuICAgIHRpdGxlLFxuICAgIGRlc2NyaXB0aW9uLFxuICAgIGR1ZURhdGUsXG4gICAgcHJpb3JpdHksXG4gICAgc3RhdHVzLFxuICApID0+IHtcbiAgICBjb25zdCBwcm9qZWN0ID0gcHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldO1xuICAgIHByb2plY3QudGFza3MucHVzaChuZXcgVGFzayh0aXRsZSwgZGVzY3JpcHRpb24sIGR1ZURhdGUsIHByaW9yaXR5LCBzdGF0dXMpKTtcblxuICAgIHNldFN0b3JhZ2UoKTtcbiAgICByZXR1cm4gcmV2ZWFsVGFzayhOdW1iZXIocHJvamVjdEluZGV4KSwgcHJvamVjdC50YXNrcy5sZW5ndGggLSAxKTtcbiAgfTtcblxuICBjb25zdCBkZWxldGVUYXNrID0gKHByb2plY3RJbmRleCwgdGFza0luZGV4KSA9PiB7XG4gICAgY29uc3QgcHJvamVjdCA9IHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXTtcbiAgICBjb25zdCBpbmRleCA9IE51bWJlcih0YXNrSW5kZXgpO1xuICAgIHByb2plY3QudGFza3Muc3BsaWNlKGluZGV4LCAxKTtcblxuICAgIHNldFN0b3JhZ2UoKTtcbiAgICByZXR1cm4gcHJvamVjdE1hbmFnZXIucmV2ZWFsUHJvamVjdChOdW1iZXIocHJvamVjdEluZGV4KSk7XG4gIH07XG5cbiAgY29uc3QgZWRpdFRhc2tUaXRsZSA9IChwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCwgbmV3VGl0bGUpID0+IHtcbiAgICBjb25zdCB0YXNrID0gcHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldLnRhc2tzW051bWJlcih0YXNrSW5kZXgpXTtcbiAgICB0YXNrLnRpdGxlID0gbmV3VGl0bGU7XG5cbiAgICBzZXRTdG9yYWdlKCk7XG4gICAgcmV0dXJuIHJldmVhbFRhc2soTnVtYmVyKHByb2plY3RJbmRleCksIE51bWJlcih0YXNrSW5kZXgpKTtcbiAgfTtcblxuICBjb25zdCBlZGl0VGFza0Rlc2NyaXB0aW9uID0gKHByb2plY3RJbmRleCwgdGFza0luZGV4LCBuZXdEZXNjcmlwdGlvbikgPT4ge1xuICAgIGNvbnN0IHRhc2sgPSBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0udGFza3NbTnVtYmVyKHRhc2tJbmRleCldO1xuICAgIHRhc2suZGVzY3JpcHRpb24gPSBuZXdEZXNjcmlwdGlvbjtcblxuICAgIHNldFN0b3JhZ2UoKTtcbiAgICByZXR1cm4gcmV2ZWFsVGFzayhOdW1iZXIocHJvamVjdEluZGV4KSwgTnVtYmVyKHRhc2tJbmRleCkpO1xuICB9O1xuXG4gIGNvbnN0IGVkaXRUYXNrRHVlRGF0ZSA9IChwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCwgbmV3RHVlRGF0ZSkgPT4ge1xuICAgIGNvbnN0IHRhc2sgPSBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0udGFza3NbTnVtYmVyKHRhc2tJbmRleCldO1xuICAgIHRhc2suZHVlRGF0ZSA9IG5ld0R1ZURhdGU7XG5cbiAgICBzZXRTdG9yYWdlKCk7XG4gICAgcmV0dXJuIHJldmVhbFRhc2soTnVtYmVyKHByb2plY3RJbmRleCksIE51bWJlcih0YXNrSW5kZXgpKTtcbiAgfTtcblxuICBjb25zdCBlZGl0VGFza1ByaW9yaXR5ID0gKHByb2plY3RJbmRleCwgdGFza0luZGV4LCBuZXdQcmlvcml0eSkgPT4ge1xuICAgIGNvbnN0IHRhc2sgPSBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0udGFza3NbTnVtYmVyKHRhc2tJbmRleCldO1xuICAgIHRhc2sucHJpb3JpdHkgPSBuZXdQcmlvcml0eTtcblxuICAgIHNldFN0b3JhZ2UoKTtcbiAgICByZXR1cm4gcmV2ZWFsVGFzayhOdW1iZXIocHJvamVjdEluZGV4KSwgTnVtYmVyKHRhc2tJbmRleCkpO1xuICB9O1xuXG4gIGNvbnN0IGVkaXRUYXNrU3RhdHVzID0gKHByb2plY3RJbmRleCwgdGFza0luZGV4LCBuZXdTdGF0dXMpID0+IHtcbiAgICBjb25zdCB0YXNrID0gcHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldLnRhc2tzW051bWJlcih0YXNrSW5kZXgpXTtcbiAgICB0YXNrLnN0YXR1cyA9IG5ld1N0YXR1cztcblxuICAgIHNldFN0b3JhZ2UoKTtcbiAgICByZXR1cm4gcmV2ZWFsVGFzayhOdW1iZXIocHJvamVjdEluZGV4KSwgTnVtYmVyKHRhc2tJbmRleCkpO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgcmV2ZWFsVGFzayxcbiAgICBjcmVhdGVOZXdUYXNrLFxuICAgIGRlbGV0ZVRhc2ssXG4gICAgZWRpdFRhc2tUaXRsZSxcbiAgICBlZGl0VGFza0Rlc2NyaXB0aW9uLFxuICAgIGVkaXRUYXNrRHVlRGF0ZSxcbiAgICBlZGl0VGFza1ByaW9yaXR5LFxuICAgIGVkaXRUYXNrU3RhdHVzLFxuICB9O1xufSkoKTtcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi0gU3RlcCBNYW5hZ2VyXG4gIC0gQ3JlYXRlICYgZGVsZXRlIHN0ZXBzIGluIGEgdGFza1xuICAtIEVkaXQgc3RlcCBkZXNjcmlwdGlvbiAmIHN0YXR1c1xuICAtIENyZWF0ZSBhIHNmZSBjb3B5IG9mIGEgc2luZ2xlIHN0ZXAgZm9yIHB1YmxpYyB1c2VcbiAgLSBTdWJzY3JpYmUgdG8gbWVkaWF0b3IgZXZlbnRzXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuY29uc3Qgc3RlcE1hbmFnZXIgPSAoKCkgPT4ge1xuICBjb25zdCByZXZlYWxTdGVwID0gKHByb2plY3RJbmRleCwgdGFza0luZGV4LCBzdGVwSW5kZXgpID0+IHtcbiAgICBjb25zdCBzdGVwQ29weSA9IGRlZXBDb3B5T2JqZWN0KFxuICAgICAgcHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldLnRhc2tzW051bWJlcih0YXNrSW5kZXgpXS5zdGVwc1tcbiAgICAgICAgTnVtYmVyKHN0ZXBJbmRleClcbiAgICAgIF0sXG4gICAgKTtcblxuICAgIHJldHVybiBzdGVwQ29weTtcbiAgfTtcblxuICBjb25zdCBjcmVhdGVOZXdTdGVwID0gKHByb2plY3RJbmRleCwgdGFza0luZGV4LCBkZXNjcmlwdGlvbiwgc3RhdHVzKSA9PiB7XG4gICAgY29uc3QgdGFzayA9IHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXS50YXNrc1tOdW1iZXIodGFza0luZGV4KV07XG4gICAgdGFzay5zdGVwcy5wdXNoKG5ldyBTdGVwKGRlc2NyaXB0aW9uLCBzdGF0dXMpKTtcblxuICAgIHNldFN0b3JhZ2UoKTtcbiAgICByZXR1cm4gcmV2ZWFsU3RlcChcbiAgICAgIE51bWJlcihwcm9qZWN0SW5kZXgpLFxuICAgICAgTnVtYmVyKHRhc2tJbmRleCksXG4gICAgICB0YXNrLnN0ZXBzLmxlbmd0aCAtIDEsXG4gICAgKTtcbiAgfTtcblxuICBjb25zdCBkZWxldGVTdGVwID0gKHByb2plY3RJbmRleCwgdGFza0luZGV4LCBzdGVwSW5kZXgpID0+IHtcbiAgICBjb25zdCB0YXNrID0gcHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldLnRhc2tzW051bWJlcih0YXNrSW5kZXgpXTtcbiAgICBjb25zdCBpbmRleCA9IE51bWJlcihzdGVwSW5kZXgpO1xuICAgIHRhc2suc3RlcHMuc3BsaWNlKGluZGV4LCAxKTtcblxuICAgIHNldFN0b3JhZ2UoKTtcbiAgICByZXR1cm4gdGFza01hbmFnZXIucmV2ZWFsVGFzayhOdW1iZXIocHJvamVjdEluZGV4KSwgTnVtYmVyKHRhc2tJbmRleCkpO1xuICB9O1xuXG4gIGNvbnN0IGVkaXRTdGVwRGVzY3JpcHRpb24gPSAoXG4gICAgcHJvamVjdEluZGV4LFxuICAgIHRhc2tJbmRleCxcbiAgICBzdGVwSW5kZXgsXG4gICAgbmV3RGVzY3JpcHRpb24sXG4gICkgPT4ge1xuICAgIGNvbnN0IHN0ZXAgPVxuICAgICAgcHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldLnRhc2tzW051bWJlcih0YXNrSW5kZXgpXS5zdGVwc1tcbiAgICAgICAgTnVtYmVyKHN0ZXBJbmRleClcbiAgICAgIF07XG4gICAgc3RlcC5kZXNjcmlwdGlvbiA9IG5ld0Rlc2NyaXB0aW9uO1xuXG4gICAgc2V0U3RvcmFnZSgpO1xuICAgIHJldHVybiByZXZlYWxTdGVwKFxuICAgICAgTnVtYmVyKHByb2plY3RJbmRleCksXG4gICAgICBOdW1iZXIodGFza0luZGV4KSxcbiAgICAgIE51bWJlcihzdGVwSW5kZXgpLFxuICAgICk7XG4gIH07XG5cbiAgY29uc3QgZWRpdFN0ZXBTdGF0dXMgPSAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgsIHN0ZXBJbmRleCwgbmV3U3RhdHVzKSA9PiB7XG4gICAgY29uc3Qgc3RlcCA9XG4gICAgICBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0udGFza3NbTnVtYmVyKHRhc2tJbmRleCldLnN0ZXBzW1xuICAgICAgICBOdW1iZXIoc3RlcEluZGV4KVxuICAgICAgXTtcbiAgICBzdGVwLnN0YXR1cyA9IG5ld1N0YXR1cztcblxuICAgIHNldFN0b3JhZ2UoKTtcbiAgICByZXR1cm4gcmV2ZWFsU3RlcChcbiAgICAgIE51bWJlcihwcm9qZWN0SW5kZXgpLFxuICAgICAgTnVtYmVyKHRhc2tJbmRleCksXG4gICAgICBOdW1iZXIoc3RlcEluZGV4KSxcbiAgICApO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgcmV2ZWFsU3RlcCxcbiAgICBjcmVhdGVOZXdTdGVwLFxuICAgIGRlbGV0ZVN0ZXAsXG4gICAgZWRpdFN0ZXBEZXNjcmlwdGlvbixcbiAgICBlZGl0U3RlcFN0YXR1cyxcbiAgfTtcbn0pKCk7XG5cbmV4cG9ydCB7IHByb2plY3RNYW5hZ2VyLCB0YXNrTWFuYWdlciwgc3RlcE1hbmFnZXIgfTtcbiIsIi8qIENvbnRlbnRzOlxuXG5cdC0gR2VuZXJhbFxuXG5cdC0gSGVhZGVyIG1vZHVsZVxuXG5cdC0gTmF2YmFyIG1vZHVsZVxuXHRcblx0LSBNb2R1bGUgdG8gY29udHJvbCB0aGluZ3MgY29tbW9uIG1vc3QgbW9kYWxzXG5cblx0LSAnTmV3IExpc3QnIG1vZGFsIG1vZHVsZVxuXG5cdC0gSW5pdGlhbGlzZXIgZnVuY3Rpb25cbiovXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLSBHZW5lcmFsXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuaW1wb3J0IHsgcHJvamVjdE1hbmFnZXIsIHRhc2tNYW5hZ2VyLCBzdGVwTWFuYWdlciB9IGZyb20gJy4vdG9Eb0xpc3QnO1xuXG5jb25zdCB0b2dnbGVIaWRkZW4gPSAoZWxlbWVudCkgPT4ge1xuICBlbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoJ2hpZGRlbicpO1xufTtcbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4tIEhlYWRlciBtb2R1bGVcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5jb25zdCBoZWFkZXIgPSAoKCkgPT4ge1xuICAvKiBGdW5jdGlvbiB0byBpbnZva2UgaW4gaW5pdGlsaXNlciBmdW5jdGlvbiwgZm9yIHRoZSBjb21wb25lbnQgdG8gd29yayBwcm9wZXJseSAqL1xuICBjb25zdCBhZGRIZWFkZXJMaXN0ZW5lcnMgPSAoKSA9PiB7XG4gICAgY29uc3QgdG9nZ2xlTmF2QnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RvZ2dsZS1uYXYtYnV0dG9uJyk7XG4gICAgY29uc3QgdG9nZ2xlQXNpZGVCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndG9nZ2xlLWFzaWRlLWJ1dHRvbicpO1xuICAgIGNvbnN0IG5hdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ25hdicpO1xuICAgIGNvbnN0IGFzaWRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYXNpZGUnKTtcblxuICAgIHRvZ2dsZU5hdkJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHRvZ2dsZUhpZGRlbihuYXYpKTtcbiAgICB0b2dnbGVBc2lkZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHRvZ2dsZUhpZGRlbihhc2lkZSkpO1xuICB9O1xuXG4gIHJldHVybiB7IGFkZEhlYWRlckxpc3RlbmVycyB9O1xufSkoKTtcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi0gTmF2YmFyIG1vZHVsZVxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbmNvbnN0IG5hdmJhciA9ICgoKSA9PiB7XG4gIGNvbnN0IHJlbmRlck5ld0xpc3QgPSAobGlzdCkgPT4ge1xuICAgIGNvbnN0IG5hdkxpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmF2LXRvZG8tbGlzdHMnKTtcbiAgICBjb25zdCBsaXN0SXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgY29uc3QgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjb25zdCBlZGl0QnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgY29uc3QgZWRpdEltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgIGNvbnN0IGRlbGV0ZUJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGNvbnN0IGRlbGV0ZUltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuXG4gICAgbGluay5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCAnIycpO1xuICAgIGxpbmsudGV4dENvbnRlbnQgPSBgJHtsaXN0LnRpdGxlfWA7XG4gICAgZGl2LmNsYXNzTGlzdC5hZGQoJ25hdi1saXN0LWJ1dHRvbnMnKTtcbiAgICBlZGl0SW1nLnNldEF0dHJpYnV0ZSgnc3JjJywgJy4vaWNvbnMvZWRpdC5zdmcnKTtcbiAgICBlZGl0SW1nLnNldEF0dHJpYnV0ZSgnYWx0JywgJ2J1dHRvbiB0byBlZGl0IGxpc3QnKTtcbiAgICBkZWxldGVJbWcuc2V0QXR0cmlidXRlKCdzcmMnLCAnLi9pY29ucy9kZWxldGUuc3ZnJyk7XG4gICAgZGVsZXRlSW1nLnNldEF0dHJpYnV0ZSgnYWx0JywgJ2J1dHRvbiB0byBkZWxldGUgbGlzdCcpO1xuXG4gICAgZWRpdEJ0bi5hcHBlbmRDaGlsZChlZGl0SW1nKTtcbiAgICBkZWxldGVCdG4uYXBwZW5kQ2hpbGQoZGVsZXRlSW1nKTtcbiAgICBkaXYuYXBwZW5kQ2hpbGQoZWRpdEJ0bik7XG4gICAgZGl2LmFwcGVuZENoaWxkKGRlbGV0ZUJ0bik7XG4gICAgbGlzdEl0ZW0uYXBwZW5kQ2hpbGQobGluayk7XG4gICAgbGlzdEl0ZW0uYXBwZW5kQ2hpbGQoZGl2KTtcbiAgICBuYXZMaXN0LmFwcGVuZENoaWxkKGxpc3RJdGVtKTtcbiAgfTtcblxuICAvKiBGdW5jdGlvbnMgdG8gaW52b2tlIGluIGluaXRpbGlzZXIgZnVuY3Rpb24sIGZvciB0aGUgY29tcG9uZW50IHRvIHdvcmsgcHJvcGVybHkgKi9cbiAgY29uc3QgcmVuZGVyQ3VycmVudExpc3RzID0gKCkgPT4ge1xuICAgIGNvbnN0IGxpc3RzID0gcHJvamVjdE1hbmFnZXIucmV2ZWFsQWxsUHJvamVjdHMoKTtcbiAgICBsaXN0cy5mb3JFYWNoKChsaXN0KSA9PiB7XG4gICAgICBpZiAobGlzdHMuaW5kZXhPZihsaXN0KSA+IDApIHtcbiAgICAgICAgcmVuZGVyTmV3TGlzdChsaXN0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBjb25zdCBhZGROZXdMaXN0QnRuTGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgY29uc3QgbmV3TGlzdEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uYXYtbmV3LWxpc3QtYnV0dG9uJyk7XG4gICAgY29uc3QgbW9kYWxOZXdMaXN0ID1cbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uZXctbGlzdC1tb2RhbCcpLnBhcmVudEVsZW1lbnQ7XG4gICAgbmV3TGlzdEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHRvZ2dsZUhpZGRlbihtb2RhbE5ld0xpc3QpKTtcbiAgfTtcblxuICByZXR1cm4geyByZW5kZXJOZXdMaXN0LCByZW5kZXJDdXJyZW50TGlzdHMsIGFkZE5ld0xpc3RCdG5MaXN0ZW5lciB9O1xufSkoKTtcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi0gTW9kdWxlIHRvIGNvbnRyb2wgdGhpbmdzIGNvbW1vbiBtb3N0IG1vZGFsc1xuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbmNvbnN0IGFsbE1vZGFscyA9ICgoKSA9PiB7XG4gIC8qIEdlbmVyYWwgZnVuY3Rpb25zIHRvIGNsb3NlIG1vZGFscyBhbmQgY2xlYXIgaW5wdXRzICovXG4gIGNvbnN0IGNsZWFySW5wdXRzID0gKG1vZGFsKSA9PiB7XG4gICAgY29uc3QgaW5wdXRzID0gbW9kYWwucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQnKTtcbiAgICBjb25zdCB0ZXh0YXJlYXMgPSBtb2RhbC5xdWVyeVNlbGVjdG9yQWxsKCd0ZXh0YXJlYScpO1xuICAgIGlucHV0cy5mb3JFYWNoKChpbnB1dCkgPT4ge1xuICAgICAgaW5wdXQudmFsdWUgPSAnJztcbiAgICB9KTtcbiAgICB0ZXh0YXJlYXMuZm9yRWFjaCgodGV4dGFyZWEpID0+IHtcbiAgICAgIHRleHRhcmVhLnZhbHVlID0gJyc7XG4gICAgfSk7XG4gIH07XG5cbiAgY29uc3QgY2xvc2VNb2RhbCA9IChtb2RhbCkgPT4ge1xuICAgIGNsZWFySW5wdXRzKG1vZGFsKTtcbiAgICB0b2dnbGVIaWRkZW4obW9kYWwpO1xuICB9O1xuXG4gIC8qIEZ1bmN0aW9ucyB0byBpbnZva2UgaW4gaW5pdGlsaXNlciBmdW5jdGlvbiwgZm9yIHRoZSBjb21wb25lbnQgdG8gd29yayBwcm9wZXJseSAqL1xuICBjb25zdCBhZGRDbG9zZUJ0bkxpc3RlbmVycyA9ICgpID0+IHtcbiAgICBjb25zdCBjbG9zZU1vZGFsQnRucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5tb2RhbC1jbG9zZS1idXR0b24nKTtcblxuICAgIGNsb3NlTW9kYWxCdG5zLmZvckVhY2goKGJ0bikgPT4ge1xuICAgICAgY29uc3QgbW9kYWwgPSBidG4ucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQ7XG4gICAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBjbG9zZU1vZGFsKG1vZGFsKSk7XG4gICAgfSk7XG4gIH07XG5cbiAgY29uc3QgYWRkQ2xvc2VCYWNrZ3JvdW5kTGlzdGVuZXJzID0gKCkgPT4ge1xuICAgIGNvbnN0IG1vZGFsQmFja2dyb3VuZHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubW9kYWwtYmFja2dyb3VuZCcpO1xuICAgIGNvbnN0IGNsb3NlID0gKGUsIG1vZGFsQmFja2dyb3VuZCkgPT4ge1xuICAgICAgaWYgKCFlLnRhcmdldC5jbG9zZXN0KCcubW9kYWwnKSkge1xuICAgICAgICBjbG9zZU1vZGFsKG1vZGFsQmFja2dyb3VuZCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIG1vZGFsQmFja2dyb3VuZHMuZm9yRWFjaCgoYmFja2dyb3VuZCkgPT4ge1xuICAgICAgYmFja2dyb3VuZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiBjbG9zZShlLCBiYWNrZ3JvdW5kKSk7XG4gICAgfSk7XG4gIH07XG5cbiAgcmV0dXJuIHsgY2xvc2VNb2RhbCwgYWRkQ2xvc2VCdG5MaXN0ZW5lcnMsIGFkZENsb3NlQmFja2dyb3VuZExpc3RlbmVycyB9O1xufSkoKTtcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi0gJ05ldyBMaXN0JyBtb2RhbCBtb2R1bGVcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5jb25zdCBuZXdMaXN0TW9kYWwgPSAoKCkgPT4ge1xuICBjb25zdCBzdWJtaXRCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmV3LWxpc3Qtc3VibWl0LWJ1dHRvbicpO1xuXG4gIGNvbnN0IGNyZWF0TmV3TGlzdCA9IChlKSA9PiB7XG4gICAgY29uc3QgdGl0bGVJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZXctbGlzdC1uYW1lJykudmFsdWU7XG4gICAgY29uc3QgZGVzY3JpcHRpb25JbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuICAgICAgJ25ldy1saXN0LWRlc2NyaXB0aW9uJyxcbiAgICApLnZhbHVlO1xuICAgIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5ldy1saXN0LW1vZGFsJykucGFyZW50RWxlbWVudDtcbiAgICBpZiAodGl0bGVJbnB1dC52YWx1ZSAhPT0gJycpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgY29uc3QgbmV3TGlzdCA9IHByb2plY3RNYW5hZ2VyLmNyZWF0ZU5ld1Byb2plY3QoXG4gICAgICAgIHRpdGxlSW5wdXQsXG4gICAgICAgIGRlc2NyaXB0aW9uSW5wdXQsXG4gICAgICApO1xuICAgICAgbmF2YmFyLnJlbmRlck5ld0xpc3QobmV3TGlzdCk7XG5cbiAgICAgIGFsbE1vZGFscy5jbG9zZU1vZGFsKG1vZGFsKTtcbiAgICB9XG4gIH07XG5cbiAgLyogRnVuY3Rpb24gdG8gaW52b2tlIGluIGluaXRpbGlzZXIgZnVuY3Rpb24sIGZvciB0aGUgY29tcG9uZW50IHRvIHdvcmsgcHJvcGVybHkgKi9cbiAgY29uc3QgYWRkU3VibWl0QnRuTGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgc3VibWl0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IGNyZWF0TmV3TGlzdChlKSk7XG4gIH07XG5cbiAgcmV0dXJuIHsgYWRkU3VibWl0QnRuTGlzdGVuZXIgfTtcbn0pKCk7XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4tIEluaXRpYWxpc2VyIGZ1bmN0aW9uXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuY29uc3QgaW5pdGlhbGlzZVVJID0gKCkgPT4ge1xuICBoZWFkZXIuYWRkSGVhZGVyTGlzdGVuZXJzKCk7XG5cbiAgbmF2YmFyLnJlbmRlckN1cnJlbnRMaXN0cygpO1xuICBuYXZiYXIuYWRkTmV3TGlzdEJ0bkxpc3RlbmVyKCk7XG5cbiAgYWxsTW9kYWxzLmFkZENsb3NlQnRuTGlzdGVuZXJzKCk7XG4gIGFsbE1vZGFscy5hZGRDbG9zZUJhY2tncm91bmRMaXN0ZW5lcnMoKTtcblxuICBuZXdMaXN0TW9kYWwuYWRkU3VibWl0QnRuTGlzdGVuZXIoKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGluaXRpYWxpc2VVSTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgcHJvamVjdE1hbmFnZXIsIHRhc2tNYW5hZ2VyLCBzdGVwTWFuYWdlciB9IGZyb20gJy4vdG9Eb0xpc3QnO1xuaW1wb3J0IGluaXRpYWxpc2VVSSBmcm9tICcuL3VpJztcblxucHJvamVjdE1hbmFnZXIuaW5pdGlhbGlzZSgpO1xuaW5pdGlhbGlzZVVJKCk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=