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
  - Project goes inside projects[]
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
  const setProjectDataIndex = (element, index) => {
    element.dataset.projectIndex = index;
  };

  const calculateNewProjectIndex = () => {
    const lists = document.getElementById('nav-todo-lists').children;
    const newIndex = lists.length + 1;
    return newIndex;
  };

  const updateAllProjectIndices = () => {
    const currentLists = document.getElementById('nav-todo-lists').children;
    let updatedIndex = 1;
    for (const list of currentLists) {
      const buttons = list.querySelectorAll('button');
      list.dataset.projectIndex = updatedIndex;
      buttons.forEach((button) => {
        button.dataset.projectIndex = updatedIndex;
      });
      updatedIndex += 1;
    }
  };

  const renderNewList = (list, listIndex) => {
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

    setProjectDataIndex(link, listIndex);
    setProjectDataIndex(editBtn, listIndex);
    setProjectDataIndex(deleteBtn, listIndex);

    editBtn.appendChild(editImg);
    deleteBtn.appendChild(deleteImg);
    div.appendChild(editBtn);
    div.appendChild(deleteBtn);
    listItem.appendChild(link);
    listItem.appendChild(div);
    navList.appendChild(listItem);

    deleteBtn.addEventListener('click', () =>
      deleteListModal.openDeleteModal(deleteBtn.dataset.projectIndex),
    );
  };

  const renderDeletedList = (listIndex) => {
    const lists = document.getElementById('nav-todo-lists').children;
    for (const list of lists) {
      const link = list.querySelector('a');
      if (link.dataset.projectIndex === String(listIndex)) {
        list.remove();
        break;
      }
    }
  };

  /* Functions to invoke in initiliser function, for the component to work properly */
  const renderCurrentLists = () => {
    const lists = _toDoList__WEBPACK_IMPORTED_MODULE_0__.projectManager.revealAllProjects();
    lists.forEach((list) => {
      if (lists.indexOf(list) > 0) {
        renderNewList(list, lists.indexOf(list));
      }
    });
  };

  const addNewListBtnListener = () => {
    const newListBtn = document.querySelector('.nav-new-list-button');
    const modalNewList =
      document.querySelector('.new-list-modal').parentElement;
    newListBtn.addEventListener('click', () => toggleHidden(modalNewList));
  };

  return {
    calculateNewProjectIndex,
    renderNewList,
    renderDeletedList,
    renderCurrentLists,
    addNewListBtnListener,
  };
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
  const modal = document.querySelector('.new-list-modal').parentElement;
  const submitBtn = document.getElementById('new-list-submit-button');

  const creatNewList = (e) => {
    const titleInput = document.getElementById('new-list-name').value;
    const descriptionInput = document.getElementById(
      'new-list-description',
    ).value;

    if (titleInput !== '') {
      e.preventDefault();

      const newList = _toDoList__WEBPACK_IMPORTED_MODULE_0__.projectManager.createNewProject(
        titleInput,
        descriptionInput,
      );
      navbar.renderNewList(newList, navbar.calculateNewProjectIndex());

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
'Delete list' modal module
************************************************************** */
const deleteListModal = (() => {
  const modal = document.querySelector('.delete-list-modal').parentElement;
  const cancelBtn = modal.querySelector('.cancel-button');
  const deleteBtn = modal.querySelector('.delete-button');

  const setProjectDataIndex = (projectIndex) => {
    deleteBtn.dataset.projectIndex = projectIndex;
  };

  const openDeleteModal = (projectIndex) => {
    setProjectDataIndex(projectIndex);
    toggleHidden(modal);
  };

  const deleteList = () => {
    const index = Number(deleteBtn.dataset.projectIndex);
    _toDoList__WEBPACK_IMPORTED_MODULE_0__.projectManager.deleteProject(index);
    navbar.renderDeletedList(index);
    toggleHidden(modal);
  };

  /* Function to invoke in initiliser function, for the component to work properly */
  const addCancelBtnListener = () => {
    cancelBtn.addEventListener('click', () => toggleHidden(modal));
  };

  const addDeleteBtnListener = () => {
    deleteBtn.addEventListener('click', deleteList);
  };

  return { openDeleteModal, addCancelBtnListener, addDeleteBtnListener };
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
  deleteListModal.addCancelBtnListener();
  deleteListModal.addDeleteBtnListener();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsV0FBVztBQUNYLENBQUM7O0FBRUQsaUVBQWUsY0FBYyxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNuQjlCOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDdUM7O0FBRXZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEVBQUUsZ0RBQWM7QUFDaEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwyQkFBMkIsZ0RBQWM7QUFDekM7QUFDQTtBQUNBLE1BQU07QUFDTixzQkFBc0IsMkJBQTJCO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRW1EOzs7Ozs7Ozs7Ozs7Ozs7O0FDMVZwRDs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNzRTs7QUFFdEU7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLFdBQVc7QUFDWCxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMEJBQTBCLFdBQVc7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGtCQUFrQixxREFBYztBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBLFdBQVc7QUFDWCxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsc0JBQXNCLHFEQUFjO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxXQUFXO0FBQ1gsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLElBQUkscURBQWM7QUFDbEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxXQUFXO0FBQ1gsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpRUFBZSxZQUFZLEVBQUM7Ozs7Ozs7VUNyUjVCO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7O0FDTnNFO0FBQ3RDOztBQUVoQyxxREFBYztBQUNkLCtDQUFZIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdG8tZG8tbGlzdC8uL3NyYy9zdG9yYWdlLmpzIiwid2VicGFjazovL3RvLWRvLWxpc3QvLi9zcmMvdG9Eb0xpc3QuanMiLCJ3ZWJwYWNrOi8vdG8tZG8tbGlzdC8uL3NyYy91aS5qcyIsIndlYnBhY2s6Ly90by1kby1saXN0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3RvLWRvLWxpc3Qvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3RvLWRvLWxpc3Qvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly90by1kby1saXN0L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdG8tZG8tbGlzdC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBzdG9yYWdlTWFuYWdlciA9ICgoKSA9PiB7XG4gIC8qIEluaXRpYWwgZnVuY3Rpb24gdG8gZ2V0IGFueXRoaW5nIHNhdmVkIGluIGxvY2FsU3RvcmFnZSAqL1xuICBjb25zdCBnZXRTdG9yYWdlID0gKCkgPT4ge1xuICAgIGxldCB0b0RvTGlzdCA9IFtdO1xuICAgIGlmIChsb2NhbFN0b3JhZ2UudG9Eb0xpc3QpIHtcbiAgICAgIHRvRG9MaXN0ID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndG9Eb0xpc3QnKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRvRG9MaXN0O1xuICB9O1xuXG4gIGNvbnN0IHNldFN0b3JhZ2UgPSAocHJvamVjdHMpID0+IHtcbiAgICBjb25zdCB0b0RvTGlzdCA9IEpTT04uc3RyaW5naWZ5KHByb2plY3RzKTtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndG9Eb0xpc3QnLCB0b0RvTGlzdCk7XG4gIH07XG5cbiAgcmV0dXJuIHsgZ2V0U3RvcmFnZSwgc2V0U3RvcmFnZSB9O1xufSkoKTtcblxuZXhwb3J0IGRlZmF1bHQgc3RvcmFnZU1hbmFnZXI7XG4iLCIvKiBDb250ZW50czpcblxuICAtIENvbnN0cnVjdG9ycyAtIFRhc2ssIFN0ZXAgJiBQcm9qZWN0XG5cbiAgLSBGdW5jdGlvbnMgdG8gZGVlcCBjbG9uZSBhcnJheXMgJiBvYmplY3RzLCAmIHVwZGF0ZSBsb2NhbCBzdG9yYWdlXG5cbiAgLSBQcm9qZWN0IE1hbmFnZXJcblxuICAtIFRhc2sgTWFuYWdlclxuXG4gIC0gU3RlcCBNYW5hZ2VyXG4qL1xuaW1wb3J0IHN0b3JhZ2VNYW5hZ2VyIGZyb20gJy4vc3RvcmFnZSc7XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4tIENvbnN0cnVjdG9ycyAtIFRhc2ssIFN0ZXAgJiBQcm9qZWN0XG4gIC0gU3RlcCBnb2VzIGluc2lkZSBUYXNrLnN0ZXBzW11cbiAgLSBUYXNrIGdvZXMgaW5zaWRlIFByb2plY3QudGFza3NbXVxuICAtIFByb2plY3QgZ29lcyBpbnNpZGUgcHJvamVjdHNbXVxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbmNsYXNzIFRhc2sge1xuICBjb25zdHJ1Y3Rvcih0aXRsZSwgZGVzY3JpcHRpb24sIGR1ZURhdGUsIHByaW9yaXR5LCBzdGF0dXMpIHtcbiAgICB0aGlzLnRpdGxlID0gdGl0bGU7XG4gICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xuICAgIHRoaXMuc3RlcHMgPSBbXTtcbiAgICB0aGlzLmR1ZURhdGUgPSBkdWVEYXRlO1xuICAgIHRoaXMucHJpb3JpdHkgPSBwcmlvcml0eTtcbiAgICB0aGlzLnN0YXR1cyA9IHN0YXR1cztcbiAgfVxufVxuXG5jbGFzcyBTdGVwIHtcbiAgY29uc3RydWN0b3IoZGVzY3JpcHRpb24sIHN0YXR1cykge1xuICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcbiAgICB0aGlzLnN0YXR1cyA9IHN0YXR1cztcbiAgfVxufVxuXG5jbGFzcyBQcm9qZWN0IHtcbiAgY29uc3RydWN0b3IodGl0bGUsIGRlc2NyaXB0aW9uKSB7XG4gICAgdGhpcy50aXRsZSA9IHRpdGxlO1xuICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcbiAgICB0aGlzLnRhc2tzID0gW107XG4gIH1cbn1cblxuY29uc3QgcHJvamVjdHMgPSBbXTtcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi0gRnVuY3Rpb25zIHRvIGRlZXAgY2xvbmUgYXJyYXlzICYgb2JqZWN0cywgJiB1cGRhdGUgbG9jYWwgc3RvcmFnZVxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbmNvbnN0IGRlZXBDb3B5QXJyYXkgPSAoYXJyYXkpID0+IHtcbiAgY29uc3QgYXJyYXlDb3B5ID0gW107XG4gIGFycmF5LmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShpdGVtKSkge1xuICAgICAgYXJyYXlDb3B5LnB1c2goZGVlcENvcHlBcnJheShpdGVtKSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgaXRlbSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGFycmF5Q29weS5wdXNoKGRlZXBDb3B5T2JqZWN0KGl0ZW0pKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXJyYXlDb3B5LnB1c2goaXRlbSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGFycmF5Q29weTtcbn07XG5cbmNvbnN0IGRlZXBDb3B5T2JqZWN0ID0gKG9iamVjdCkgPT4ge1xuICBjb25zdCBvYmplY3RDb3B5ID0ge307XG4gIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKG9iamVjdCkpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgIG9iamVjdENvcHlba2V5XSA9IGRlZXBDb3B5QXJyYXkodmFsdWUpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgICAgb2JqZWN0Q29weVtrZXldID0gZGVlcENvcHlPYmplY3QodmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvYmplY3RDb3B5W2tleV0gPSB2YWx1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG9iamVjdENvcHk7XG59O1xuXG5jb25zdCBzZXRTdG9yYWdlID0gKCkgPT4ge1xuICBjb25zdCBwcm9qZWN0c0NvcHkgPSBkZWVwQ29weUFycmF5KHByb2plY3RzKTtcbiAgc3RvcmFnZU1hbmFnZXIuc2V0U3RvcmFnZShwcm9qZWN0c0NvcHkpO1xufTtcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi0gUHJvamVjdCBNYW5hZ2VyXG4gIC0gQ3JlYXRlIGEgc2FmZSBjb3B5IG9mIGEgcHJvamVjdCAmIG9mIHRoZSBwcm9qZWN0cyBhcnJheSBmb3IgcHVibGljIHVzZVxuICAtIENyZWF0ZSAmIGRlbGV0ZSBwcm9qZWN0c1xuICAtIEVkaXQgcHJvamVjdCB0aXRsZXMgJiBkZXNjcmlwdGlvbnNcbiAgLSBJbml0aWFsaXNlIGJ5IGNoZWNraW5nIGZvciBsb2NhbGx5IHN0b3JlZCBwcm9qZWN0c1xuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbmNvbnN0IHByb2plY3RNYW5hZ2VyID0gKCgpID0+IHtcbiAgY29uc3QgcmV2ZWFsUHJvamVjdCA9IChwcm9qZWN0SW5kZXgpID0+IHtcbiAgICBjb25zdCBwcm9qZWN0Q29weSA9IGRlZXBDb3B5T2JqZWN0KHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXSk7XG5cbiAgICByZXR1cm4gcHJvamVjdENvcHk7XG4gIH07XG5cbiAgY29uc3QgcmV2ZWFsQWxsUHJvamVjdHMgPSAoKSA9PiB7XG4gICAgY29uc3QgcHJvamVjdHNDb3B5ID0gZGVlcENvcHlBcnJheShwcm9qZWN0cyk7XG5cbiAgICByZXR1cm4gcHJvamVjdHNDb3B5O1xuICB9O1xuXG4gIGNvbnN0IGNyZWF0ZU5ld1Byb2plY3QgPSAodGl0bGUsIGRlc2NyaXB0aW9uKSA9PiB7XG4gICAgY29uc3QgbmV3UHJvamVjdCA9IG5ldyBQcm9qZWN0KHRpdGxlLCBkZXNjcmlwdGlvbik7XG4gICAgcHJvamVjdHMucHVzaChuZXdQcm9qZWN0KTtcblxuICAgIHNldFN0b3JhZ2UoKTtcbiAgICByZXR1cm4gcmV2ZWFsUHJvamVjdChwcm9qZWN0cy5sZW5ndGggLSAxKTtcbiAgfTtcblxuICBjb25zdCBkZWxldGVQcm9qZWN0ID0gKHByb2plY3RJbmRleCkgPT4ge1xuICAgIGNvbnN0IGluZGV4ID0gTnVtYmVyKHByb2plY3RJbmRleCk7XG4gICAgcHJvamVjdHMuc3BsaWNlKGluZGV4LCAxKTtcblxuICAgIHNldFN0b3JhZ2UoKTtcbiAgICByZXR1cm4gcmV2ZWFsQWxsUHJvamVjdHMoKTtcbiAgfTtcblxuICAvKiBNaWdodCBub3QgbmVlZCB0aGlzICovXG4gIGNvbnN0IGRlbGV0ZVByb2plY3RCeU5hbWUgPSAocHJvamVjdFRpdGxlKSA9PiB7XG4gICAgcHJvamVjdHMuZm9yRWFjaCgocHJvamVjdCkgPT4ge1xuICAgICAgaWYgKHByb2plY3QudGl0bGUgPT09IHByb2plY3RUaXRsZSkge1xuICAgICAgICBwcm9qZWN0cy5zcGxpY2UocHJvamVjdHMuaW5kZXhPZihwcm9qZWN0KSwgMSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBzZXRTdG9yYWdlKCk7XG4gICAgcmV0dXJuIHJldmVhbEFsbFByb2plY3RzKCk7XG4gIH07XG5cbiAgY29uc3QgZWRpdFByb2plY3RUaXRsZSA9IChwcm9qZWN0SW5kZXgsIG5ld1RpdGxlKSA9PiB7XG4gICAgcHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldLnRpdGxlID0gbmV3VGl0bGU7XG5cbiAgICBzZXRTdG9yYWdlKCk7XG4gICAgcmV0dXJuIHJldmVhbFByb2plY3QoTnVtYmVyKHByb2plY3RJbmRleCkpO1xuICB9O1xuXG4gIGNvbnN0IGVkaXRQcm9qZWN0RGVzY3JpcHRpb24gPSAocHJvamVjdEluZGV4LCBuZXdEZXNjcmlwdGlvbikgPT4ge1xuICAgIHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXS5kZXNjcmlwdGlvbiA9IG5ld0Rlc2NyaXB0aW9uO1xuXG4gICAgc2V0U3RvcmFnZSgpO1xuICAgIHJldHVybiByZXZlYWxQcm9qZWN0KE51bWJlcihwcm9qZWN0SW5kZXgpKTtcbiAgfTtcblxuICAvKiBUaGlzIHNob3VsZCBiZSB1c2VkIGF0IHRoZSBiZWdnaW5pbmcgb2YgdGhlIGNvZGUgdG8gc3RhcnQgdGhlIGFwcCBwcm9wZXJseSAqL1xuICBjb25zdCBpbml0aWFsaXNlID0gKCkgPT4ge1xuICAgIGNvbnN0IHN0b3JlZFByb2plY3RzID0gc3RvcmFnZU1hbmFnZXIuZ2V0U3RvcmFnZSgpO1xuICAgIGlmIChzdG9yZWRQcm9qZWN0cy5sZW5ndGggPT09IDApIHtcbiAgICAgIGNyZWF0ZU5ld1Byb2plY3QoJ0luYm94JywgJycpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0b3JlZFByb2plY3RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHByb2plY3RzLnB1c2goc3RvcmVkUHJvamVjdHNbaV0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmV2ZWFsQWxsUHJvamVjdHMoKTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIHJldmVhbFByb2plY3QsXG4gICAgcmV2ZWFsQWxsUHJvamVjdHMsXG4gICAgY3JlYXRlTmV3UHJvamVjdCxcbiAgICBkZWxldGVQcm9qZWN0LFxuICAgIGRlbGV0ZVByb2plY3RCeU5hbWUsXG4gICAgZWRpdFByb2plY3RUaXRsZSxcbiAgICBlZGl0UHJvamVjdERlc2NyaXB0aW9uLFxuICAgIGluaXRpYWxpc2UsXG4gIH07XG59KSgpO1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLSBUYXNrIE1hbmFnZXJcbiAgLSBDcmVhdGUgYSBzYWZlIGNvcHkgb2YgYSBzaW5nbGUgdGFzayBmb3IgcHVibGljIHVzZVxuICAtIENyZWF0ZSAmIGRlbGV0ZSB0YXNrcyBpbiBhIHByb2plY3RcbiAgLSBFZGl0IHRhc2sgdGl0bGUsIGRlc2NyaXB0aW9uLCBkdWUgZGF0ZSwgcHJpb3JpdHkgJiBzdGF0dXNcbiAgLSBTdWJzY3JpYmUgdG8gbWVkaWF0b3IgZXZlbnRzXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuY29uc3QgdGFza01hbmFnZXIgPSAoKCkgPT4ge1xuICBjb25zdCByZXZlYWxUYXNrID0gKHByb2plY3RJbmRleCwgdGFza0luZGV4KSA9PiB7XG4gICAgY29uc3QgdGFza0NvcHkgPSBkZWVwQ29weU9iamVjdChcbiAgICAgIHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXS50YXNrc1tOdW1iZXIodGFza0luZGV4KV0sXG4gICAgKTtcblxuICAgIHJldHVybiB0YXNrQ29weTtcbiAgfTtcblxuICBjb25zdCBjcmVhdGVOZXdUYXNrID0gKFxuICAgIHByb2plY3RJbmRleCxcbiAgICB0aXRsZSxcbiAgICBkZXNjcmlwdGlvbixcbiAgICBkdWVEYXRlLFxuICAgIHByaW9yaXR5LFxuICAgIHN0YXR1cyxcbiAgKSA9PiB7XG4gICAgY29uc3QgcHJvamVjdCA9IHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXTtcbiAgICBwcm9qZWN0LnRhc2tzLnB1c2gobmV3IFRhc2sodGl0bGUsIGRlc2NyaXB0aW9uLCBkdWVEYXRlLCBwcmlvcml0eSwgc3RhdHVzKSk7XG5cbiAgICBzZXRTdG9yYWdlKCk7XG4gICAgcmV0dXJuIHJldmVhbFRhc2soTnVtYmVyKHByb2plY3RJbmRleCksIHByb2plY3QudGFza3MubGVuZ3RoIC0gMSk7XG4gIH07XG5cbiAgY29uc3QgZGVsZXRlVGFzayA9IChwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCkgPT4ge1xuICAgIGNvbnN0IHByb2plY3QgPSBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV07XG4gICAgY29uc3QgaW5kZXggPSBOdW1iZXIodGFza0luZGV4KTtcbiAgICBwcm9qZWN0LnRhc2tzLnNwbGljZShpbmRleCwgMSk7XG5cbiAgICBzZXRTdG9yYWdlKCk7XG4gICAgcmV0dXJuIHByb2plY3RNYW5hZ2VyLnJldmVhbFByb2plY3QoTnVtYmVyKHByb2plY3RJbmRleCkpO1xuICB9O1xuXG4gIGNvbnN0IGVkaXRUYXNrVGl0bGUgPSAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgsIG5ld1RpdGxlKSA9PiB7XG4gICAgY29uc3QgdGFzayA9IHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXS50YXNrc1tOdW1iZXIodGFza0luZGV4KV07XG4gICAgdGFzay50aXRsZSA9IG5ld1RpdGxlO1xuXG4gICAgc2V0U3RvcmFnZSgpO1xuICAgIHJldHVybiByZXZlYWxUYXNrKE51bWJlcihwcm9qZWN0SW5kZXgpLCBOdW1iZXIodGFza0luZGV4KSk7XG4gIH07XG5cbiAgY29uc3QgZWRpdFRhc2tEZXNjcmlwdGlvbiA9IChwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCwgbmV3RGVzY3JpcHRpb24pID0+IHtcbiAgICBjb25zdCB0YXNrID0gcHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldLnRhc2tzW051bWJlcih0YXNrSW5kZXgpXTtcbiAgICB0YXNrLmRlc2NyaXB0aW9uID0gbmV3RGVzY3JpcHRpb247XG5cbiAgICBzZXRTdG9yYWdlKCk7XG4gICAgcmV0dXJuIHJldmVhbFRhc2soTnVtYmVyKHByb2plY3RJbmRleCksIE51bWJlcih0YXNrSW5kZXgpKTtcbiAgfTtcblxuICBjb25zdCBlZGl0VGFza0R1ZURhdGUgPSAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgsIG5ld0R1ZURhdGUpID0+IHtcbiAgICBjb25zdCB0YXNrID0gcHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldLnRhc2tzW051bWJlcih0YXNrSW5kZXgpXTtcbiAgICB0YXNrLmR1ZURhdGUgPSBuZXdEdWVEYXRlO1xuXG4gICAgc2V0U3RvcmFnZSgpO1xuICAgIHJldHVybiByZXZlYWxUYXNrKE51bWJlcihwcm9qZWN0SW5kZXgpLCBOdW1iZXIodGFza0luZGV4KSk7XG4gIH07XG5cbiAgY29uc3QgZWRpdFRhc2tQcmlvcml0eSA9IChwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCwgbmV3UHJpb3JpdHkpID0+IHtcbiAgICBjb25zdCB0YXNrID0gcHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldLnRhc2tzW051bWJlcih0YXNrSW5kZXgpXTtcbiAgICB0YXNrLnByaW9yaXR5ID0gbmV3UHJpb3JpdHk7XG5cbiAgICBzZXRTdG9yYWdlKCk7XG4gICAgcmV0dXJuIHJldmVhbFRhc2soTnVtYmVyKHByb2plY3RJbmRleCksIE51bWJlcih0YXNrSW5kZXgpKTtcbiAgfTtcblxuICBjb25zdCBlZGl0VGFza1N0YXR1cyA9IChwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCwgbmV3U3RhdHVzKSA9PiB7XG4gICAgY29uc3QgdGFzayA9IHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXS50YXNrc1tOdW1iZXIodGFza0luZGV4KV07XG4gICAgdGFzay5zdGF0dXMgPSBuZXdTdGF0dXM7XG5cbiAgICBzZXRTdG9yYWdlKCk7XG4gICAgcmV0dXJuIHJldmVhbFRhc2soTnVtYmVyKHByb2plY3RJbmRleCksIE51bWJlcih0YXNrSW5kZXgpKTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIHJldmVhbFRhc2ssXG4gICAgY3JlYXRlTmV3VGFzayxcbiAgICBkZWxldGVUYXNrLFxuICAgIGVkaXRUYXNrVGl0bGUsXG4gICAgZWRpdFRhc2tEZXNjcmlwdGlvbixcbiAgICBlZGl0VGFza0R1ZURhdGUsXG4gICAgZWRpdFRhc2tQcmlvcml0eSxcbiAgICBlZGl0VGFza1N0YXR1cyxcbiAgfTtcbn0pKCk7XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4tIFN0ZXAgTWFuYWdlclxuICAtIENyZWF0ZSAmIGRlbGV0ZSBzdGVwcyBpbiBhIHRhc2tcbiAgLSBFZGl0IHN0ZXAgZGVzY3JpcHRpb24gJiBzdGF0dXNcbiAgLSBDcmVhdGUgYSBzZmUgY29weSBvZiBhIHNpbmdsZSBzdGVwIGZvciBwdWJsaWMgdXNlXG4gIC0gU3Vic2NyaWJlIHRvIG1lZGlhdG9yIGV2ZW50c1xuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbmNvbnN0IHN0ZXBNYW5hZ2VyID0gKCgpID0+IHtcbiAgY29uc3QgcmV2ZWFsU3RlcCA9IChwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCwgc3RlcEluZGV4KSA9PiB7XG4gICAgY29uc3Qgc3RlcENvcHkgPSBkZWVwQ29weU9iamVjdChcbiAgICAgIHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXS50YXNrc1tOdW1iZXIodGFza0luZGV4KV0uc3RlcHNbXG4gICAgICAgIE51bWJlcihzdGVwSW5kZXgpXG4gICAgICBdLFxuICAgICk7XG5cbiAgICByZXR1cm4gc3RlcENvcHk7XG4gIH07XG5cbiAgY29uc3QgY3JlYXRlTmV3U3RlcCA9IChwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCwgZGVzY3JpcHRpb24sIHN0YXR1cykgPT4ge1xuICAgIGNvbnN0IHRhc2sgPSBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0udGFza3NbTnVtYmVyKHRhc2tJbmRleCldO1xuICAgIHRhc2suc3RlcHMucHVzaChuZXcgU3RlcChkZXNjcmlwdGlvbiwgc3RhdHVzKSk7XG5cbiAgICBzZXRTdG9yYWdlKCk7XG4gICAgcmV0dXJuIHJldmVhbFN0ZXAoXG4gICAgICBOdW1iZXIocHJvamVjdEluZGV4KSxcbiAgICAgIE51bWJlcih0YXNrSW5kZXgpLFxuICAgICAgdGFzay5zdGVwcy5sZW5ndGggLSAxLFxuICAgICk7XG4gIH07XG5cbiAgY29uc3QgZGVsZXRlU3RlcCA9IChwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCwgc3RlcEluZGV4KSA9PiB7XG4gICAgY29uc3QgdGFzayA9IHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXS50YXNrc1tOdW1iZXIodGFza0luZGV4KV07XG4gICAgY29uc3QgaW5kZXggPSBOdW1iZXIoc3RlcEluZGV4KTtcbiAgICB0YXNrLnN0ZXBzLnNwbGljZShpbmRleCwgMSk7XG5cbiAgICBzZXRTdG9yYWdlKCk7XG4gICAgcmV0dXJuIHRhc2tNYW5hZ2VyLnJldmVhbFRhc2soTnVtYmVyKHByb2plY3RJbmRleCksIE51bWJlcih0YXNrSW5kZXgpKTtcbiAgfTtcblxuICBjb25zdCBlZGl0U3RlcERlc2NyaXB0aW9uID0gKFxuICAgIHByb2plY3RJbmRleCxcbiAgICB0YXNrSW5kZXgsXG4gICAgc3RlcEluZGV4LFxuICAgIG5ld0Rlc2NyaXB0aW9uLFxuICApID0+IHtcbiAgICBjb25zdCBzdGVwID1cbiAgICAgIHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXS50YXNrc1tOdW1iZXIodGFza0luZGV4KV0uc3RlcHNbXG4gICAgICAgIE51bWJlcihzdGVwSW5kZXgpXG4gICAgICBdO1xuICAgIHN0ZXAuZGVzY3JpcHRpb24gPSBuZXdEZXNjcmlwdGlvbjtcblxuICAgIHNldFN0b3JhZ2UoKTtcbiAgICByZXR1cm4gcmV2ZWFsU3RlcChcbiAgICAgIE51bWJlcihwcm9qZWN0SW5kZXgpLFxuICAgICAgTnVtYmVyKHRhc2tJbmRleCksXG4gICAgICBOdW1iZXIoc3RlcEluZGV4KSxcbiAgICApO1xuICB9O1xuXG4gIGNvbnN0IGVkaXRTdGVwU3RhdHVzID0gKHByb2plY3RJbmRleCwgdGFza0luZGV4LCBzdGVwSW5kZXgsIG5ld1N0YXR1cykgPT4ge1xuICAgIGNvbnN0IHN0ZXAgPVxuICAgICAgcHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldLnRhc2tzW051bWJlcih0YXNrSW5kZXgpXS5zdGVwc1tcbiAgICAgICAgTnVtYmVyKHN0ZXBJbmRleClcbiAgICAgIF07XG4gICAgc3RlcC5zdGF0dXMgPSBuZXdTdGF0dXM7XG5cbiAgICBzZXRTdG9yYWdlKCk7XG4gICAgcmV0dXJuIHJldmVhbFN0ZXAoXG4gICAgICBOdW1iZXIocHJvamVjdEluZGV4KSxcbiAgICAgIE51bWJlcih0YXNrSW5kZXgpLFxuICAgICAgTnVtYmVyKHN0ZXBJbmRleCksXG4gICAgKTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIHJldmVhbFN0ZXAsXG4gICAgY3JlYXRlTmV3U3RlcCxcbiAgICBkZWxldGVTdGVwLFxuICAgIGVkaXRTdGVwRGVzY3JpcHRpb24sXG4gICAgZWRpdFN0ZXBTdGF0dXMsXG4gIH07XG59KSgpO1xuXG5leHBvcnQgeyBwcm9qZWN0TWFuYWdlciwgdGFza01hbmFnZXIsIHN0ZXBNYW5hZ2VyIH07XG4iLCIvKiBDb250ZW50czpcblxuXHQtIEdlbmVyYWxcblxuXHQtIEhlYWRlciBtb2R1bGVcblxuXHQtIE5hdmJhciBtb2R1bGVcblx0XG5cdC0gTW9kdWxlIHRvIGNvbnRyb2wgdGhpbmdzIGNvbW1vbiBtb3N0IG1vZGFsc1xuXG5cdC0gJ05ldyBMaXN0JyBtb2RhbCBtb2R1bGVcblxuXHQtIEluaXRpYWxpc2VyIGZ1bmN0aW9uXG4qL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi0gR2VuZXJhbFxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbmltcG9ydCB7IHByb2plY3RNYW5hZ2VyLCB0YXNrTWFuYWdlciwgc3RlcE1hbmFnZXIgfSBmcm9tICcuL3RvRG9MaXN0JztcblxuY29uc3QgdG9nZ2xlSGlkZGVuID0gKGVsZW1lbnQpID0+IHtcbiAgZWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKCdoaWRkZW4nKTtcbn07XG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLSBIZWFkZXIgbW9kdWxlXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuY29uc3QgaGVhZGVyID0gKCgpID0+IHtcbiAgLyogRnVuY3Rpb24gdG8gaW52b2tlIGluIGluaXRpbGlzZXIgZnVuY3Rpb24sIGZvciB0aGUgY29tcG9uZW50IHRvIHdvcmsgcHJvcGVybHkgKi9cbiAgY29uc3QgYWRkSGVhZGVyTGlzdGVuZXJzID0gKCkgPT4ge1xuICAgIGNvbnN0IHRvZ2dsZU5hdkJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0b2dnbGUtbmF2LWJ1dHRvbicpO1xuICAgIGNvbnN0IHRvZ2dsZUFzaWRlQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RvZ2dsZS1hc2lkZS1idXR0b24nKTtcbiAgICBjb25zdCBuYXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCduYXYnKTtcbiAgICBjb25zdCBhc2lkZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2FzaWRlJyk7XG5cbiAgICB0b2dnbGVOYXZCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB0b2dnbGVIaWRkZW4obmF2KSk7XG4gICAgdG9nZ2xlQXNpZGVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB0b2dnbGVIaWRkZW4oYXNpZGUpKTtcbiAgfTtcblxuICByZXR1cm4geyBhZGRIZWFkZXJMaXN0ZW5lcnMgfTtcbn0pKCk7XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4tIE5hdmJhciBtb2R1bGVcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5jb25zdCBuYXZiYXIgPSAoKCkgPT4ge1xuICBjb25zdCBzZXRQcm9qZWN0RGF0YUluZGV4ID0gKGVsZW1lbnQsIGluZGV4KSA9PiB7XG4gICAgZWxlbWVudC5kYXRhc2V0LnByb2plY3RJbmRleCA9IGluZGV4O1xuICB9O1xuXG4gIGNvbnN0IGNhbGN1bGF0ZU5ld1Byb2plY3RJbmRleCA9ICgpID0+IHtcbiAgICBjb25zdCBsaXN0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduYXYtdG9kby1saXN0cycpLmNoaWxkcmVuO1xuICAgIGNvbnN0IG5ld0luZGV4ID0gbGlzdHMubGVuZ3RoICsgMTtcbiAgICByZXR1cm4gbmV3SW5kZXg7XG4gIH07XG5cbiAgY29uc3QgdXBkYXRlQWxsUHJvamVjdEluZGljZXMgPSAoKSA9PiB7XG4gICAgY29uc3QgY3VycmVudExpc3RzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25hdi10b2RvLWxpc3RzJykuY2hpbGRyZW47XG4gICAgbGV0IHVwZGF0ZWRJbmRleCA9IDE7XG4gICAgZm9yIChjb25zdCBsaXN0IG9mIGN1cnJlbnRMaXN0cykge1xuICAgICAgY29uc3QgYnV0dG9ucyA9IGxpc3QucXVlcnlTZWxlY3RvckFsbCgnYnV0dG9uJyk7XG4gICAgICBsaXN0LmRhdGFzZXQucHJvamVjdEluZGV4ID0gdXBkYXRlZEluZGV4O1xuICAgICAgYnV0dG9ucy5mb3JFYWNoKChidXR0b24pID0+IHtcbiAgICAgICAgYnV0dG9uLmRhdGFzZXQucHJvamVjdEluZGV4ID0gdXBkYXRlZEluZGV4O1xuICAgICAgfSk7XG4gICAgICB1cGRhdGVkSW5kZXggKz0gMTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgcmVuZGVyTmV3TGlzdCA9IChsaXN0LCBsaXN0SW5kZXgpID0+IHtcbiAgICBjb25zdCBuYXZMaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25hdi10b2RvLWxpc3RzJyk7XG4gICAgY29uc3QgbGlzdEl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgIGNvbnN0IGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29uc3QgZWRpdEJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGNvbnN0IGVkaXRJbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICBjb25zdCBkZWxldGVCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBjb25zdCBkZWxldGVJbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcblxuICAgIGxpbmsuc2V0QXR0cmlidXRlKCdocmVmJywgJyMnKTtcbiAgICBsaW5rLnRleHRDb250ZW50ID0gYCR7bGlzdC50aXRsZX1gO1xuICAgIGRpdi5jbGFzc0xpc3QuYWRkKCduYXYtbGlzdC1idXR0b25zJyk7XG4gICAgZWRpdEltZy5zZXRBdHRyaWJ1dGUoJ3NyYycsICcuL2ljb25zL2VkaXQuc3ZnJyk7XG4gICAgZWRpdEltZy5zZXRBdHRyaWJ1dGUoJ2FsdCcsICdidXR0b24gdG8gZWRpdCBsaXN0Jyk7XG4gICAgZGVsZXRlSW1nLnNldEF0dHJpYnV0ZSgnc3JjJywgJy4vaWNvbnMvZGVsZXRlLnN2ZycpO1xuICAgIGRlbGV0ZUltZy5zZXRBdHRyaWJ1dGUoJ2FsdCcsICdidXR0b24gdG8gZGVsZXRlIGxpc3QnKTtcblxuICAgIHNldFByb2plY3REYXRhSW5kZXgobGluaywgbGlzdEluZGV4KTtcbiAgICBzZXRQcm9qZWN0RGF0YUluZGV4KGVkaXRCdG4sIGxpc3RJbmRleCk7XG4gICAgc2V0UHJvamVjdERhdGFJbmRleChkZWxldGVCdG4sIGxpc3RJbmRleCk7XG5cbiAgICBlZGl0QnRuLmFwcGVuZENoaWxkKGVkaXRJbWcpO1xuICAgIGRlbGV0ZUJ0bi5hcHBlbmRDaGlsZChkZWxldGVJbWcpO1xuICAgIGRpdi5hcHBlbmRDaGlsZChlZGl0QnRuKTtcbiAgICBkaXYuYXBwZW5kQ2hpbGQoZGVsZXRlQnRuKTtcbiAgICBsaXN0SXRlbS5hcHBlbmRDaGlsZChsaW5rKTtcbiAgICBsaXN0SXRlbS5hcHBlbmRDaGlsZChkaXYpO1xuICAgIG5hdkxpc3QuYXBwZW5kQ2hpbGQobGlzdEl0ZW0pO1xuXG4gICAgZGVsZXRlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT5cbiAgICAgIGRlbGV0ZUxpc3RNb2RhbC5vcGVuRGVsZXRlTW9kYWwoZGVsZXRlQnRuLmRhdGFzZXQucHJvamVjdEluZGV4KSxcbiAgICApO1xuICB9O1xuXG4gIGNvbnN0IHJlbmRlckRlbGV0ZWRMaXN0ID0gKGxpc3RJbmRleCkgPT4ge1xuICAgIGNvbnN0IGxpc3RzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25hdi10b2RvLWxpc3RzJykuY2hpbGRyZW47XG4gICAgZm9yIChjb25zdCBsaXN0IG9mIGxpc3RzKSB7XG4gICAgICBjb25zdCBsaW5rID0gbGlzdC5xdWVyeVNlbGVjdG9yKCdhJyk7XG4gICAgICBpZiAobGluay5kYXRhc2V0LnByb2plY3RJbmRleCA9PT0gU3RyaW5nKGxpc3RJbmRleCkpIHtcbiAgICAgICAgbGlzdC5yZW1vdmUoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8qIEZ1bmN0aW9ucyB0byBpbnZva2UgaW4gaW5pdGlsaXNlciBmdW5jdGlvbiwgZm9yIHRoZSBjb21wb25lbnQgdG8gd29yayBwcm9wZXJseSAqL1xuICBjb25zdCByZW5kZXJDdXJyZW50TGlzdHMgPSAoKSA9PiB7XG4gICAgY29uc3QgbGlzdHMgPSBwcm9qZWN0TWFuYWdlci5yZXZlYWxBbGxQcm9qZWN0cygpO1xuICAgIGxpc3RzLmZvckVhY2goKGxpc3QpID0+IHtcbiAgICAgIGlmIChsaXN0cy5pbmRleE9mKGxpc3QpID4gMCkge1xuICAgICAgICByZW5kZXJOZXdMaXN0KGxpc3QsIGxpc3RzLmluZGV4T2YobGlzdCkpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IGFkZE5ld0xpc3RCdG5MaXN0ZW5lciA9ICgpID0+IHtcbiAgICBjb25zdCBuZXdMaXN0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5hdi1uZXctbGlzdC1idXR0b24nKTtcbiAgICBjb25zdCBtb2RhbE5ld0xpc3QgPVxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5ldy1saXN0LW1vZGFsJykucGFyZW50RWxlbWVudDtcbiAgICBuZXdMaXN0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gdG9nZ2xlSGlkZGVuKG1vZGFsTmV3TGlzdCkpO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgY2FsY3VsYXRlTmV3UHJvamVjdEluZGV4LFxuICAgIHJlbmRlck5ld0xpc3QsXG4gICAgcmVuZGVyRGVsZXRlZExpc3QsXG4gICAgcmVuZGVyQ3VycmVudExpc3RzLFxuICAgIGFkZE5ld0xpc3RCdG5MaXN0ZW5lcixcbiAgfTtcbn0pKCk7XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4tIE1vZHVsZSB0byBjb250cm9sIHRoaW5ncyBjb21tb24gbW9zdCBtb2RhbHNcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5jb25zdCBhbGxNb2RhbHMgPSAoKCkgPT4ge1xuICAvKiBHZW5lcmFsIGZ1bmN0aW9ucyB0byBjbG9zZSBtb2RhbHMgYW5kIGNsZWFyIGlucHV0cyAqL1xuICBjb25zdCBjbGVhcklucHV0cyA9IChtb2RhbCkgPT4ge1xuICAgIGNvbnN0IGlucHV0cyA9IG1vZGFsLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0Jyk7XG4gICAgY29uc3QgdGV4dGFyZWFzID0gbW9kYWwucXVlcnlTZWxlY3RvckFsbCgndGV4dGFyZWEnKTtcbiAgICBpbnB1dHMuZm9yRWFjaCgoaW5wdXQpID0+IHtcbiAgICAgIGlucHV0LnZhbHVlID0gJyc7XG4gICAgfSk7XG4gICAgdGV4dGFyZWFzLmZvckVhY2goKHRleHRhcmVhKSA9PiB7XG4gICAgICB0ZXh0YXJlYS52YWx1ZSA9ICcnO1xuICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IGNsb3NlTW9kYWwgPSAobW9kYWwpID0+IHtcbiAgICBjbGVhcklucHV0cyhtb2RhbCk7XG4gICAgdG9nZ2xlSGlkZGVuKG1vZGFsKTtcbiAgfTtcblxuICAvKiBGdW5jdGlvbnMgdG8gaW52b2tlIGluIGluaXRpbGlzZXIgZnVuY3Rpb24sIGZvciB0aGUgY29tcG9uZW50IHRvIHdvcmsgcHJvcGVybHkgKi9cbiAgY29uc3QgYWRkQ2xvc2VCdG5MaXN0ZW5lcnMgPSAoKSA9PiB7XG4gICAgY29uc3QgY2xvc2VNb2RhbEJ0bnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubW9kYWwtY2xvc2UtYnV0dG9uJyk7XG5cbiAgICBjbG9zZU1vZGFsQnRucy5mb3JFYWNoKChidG4pID0+IHtcbiAgICAgIGNvbnN0IG1vZGFsID0gYnRuLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50O1xuICAgICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gY2xvc2VNb2RhbChtb2RhbCkpO1xuICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IGFkZENsb3NlQmFja2dyb3VuZExpc3RlbmVycyA9ICgpID0+IHtcbiAgICBjb25zdCBtb2RhbEJhY2tncm91bmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm1vZGFsLWJhY2tncm91bmQnKTtcbiAgICBjb25zdCBjbG9zZSA9IChlLCBtb2RhbEJhY2tncm91bmQpID0+IHtcbiAgICAgIGlmICghZS50YXJnZXQuY2xvc2VzdCgnLm1vZGFsJykpIHtcbiAgICAgICAgY2xvc2VNb2RhbChtb2RhbEJhY2tncm91bmQpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBtb2RhbEJhY2tncm91bmRzLmZvckVhY2goKGJhY2tncm91bmQpID0+IHtcbiAgICAgIGJhY2tncm91bmQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4gY2xvc2UoZSwgYmFja2dyb3VuZCkpO1xuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiB7IGNsb3NlTW9kYWwsIGFkZENsb3NlQnRuTGlzdGVuZXJzLCBhZGRDbG9zZUJhY2tncm91bmRMaXN0ZW5lcnMgfTtcbn0pKCk7XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4tICdOZXcgTGlzdCcgbW9kYWwgbW9kdWxlXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuY29uc3QgbmV3TGlzdE1vZGFsID0gKCgpID0+IHtcbiAgY29uc3QgbW9kYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmV3LWxpc3QtbW9kYWwnKS5wYXJlbnRFbGVtZW50O1xuICBjb25zdCBzdWJtaXRCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmV3LWxpc3Qtc3VibWl0LWJ1dHRvbicpO1xuXG4gIGNvbnN0IGNyZWF0TmV3TGlzdCA9IChlKSA9PiB7XG4gICAgY29uc3QgdGl0bGVJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZXctbGlzdC1uYW1lJykudmFsdWU7XG4gICAgY29uc3QgZGVzY3JpcHRpb25JbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuICAgICAgJ25ldy1saXN0LWRlc2NyaXB0aW9uJyxcbiAgICApLnZhbHVlO1xuXG4gICAgaWYgKHRpdGxlSW5wdXQgIT09ICcnKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIGNvbnN0IG5ld0xpc3QgPSBwcm9qZWN0TWFuYWdlci5jcmVhdGVOZXdQcm9qZWN0KFxuICAgICAgICB0aXRsZUlucHV0LFxuICAgICAgICBkZXNjcmlwdGlvbklucHV0LFxuICAgICAgKTtcbiAgICAgIG5hdmJhci5yZW5kZXJOZXdMaXN0KG5ld0xpc3QsIG5hdmJhci5jYWxjdWxhdGVOZXdQcm9qZWN0SW5kZXgoKSk7XG5cbiAgICAgIGFsbE1vZGFscy5jbG9zZU1vZGFsKG1vZGFsKTtcbiAgICB9XG4gIH07XG5cbiAgLyogRnVuY3Rpb24gdG8gaW52b2tlIGluIGluaXRpbGlzZXIgZnVuY3Rpb24sIGZvciB0aGUgY29tcG9uZW50IHRvIHdvcmsgcHJvcGVybHkgKi9cbiAgY29uc3QgYWRkU3VibWl0QnRuTGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgc3VibWl0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IGNyZWF0TmV3TGlzdChlKSk7XG4gIH07XG5cbiAgcmV0dXJuIHsgYWRkU3VibWl0QnRuTGlzdGVuZXIgfTtcbn0pKCk7XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4nRGVsZXRlIGxpc3QnIG1vZGFsIG1vZHVsZVxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbmNvbnN0IGRlbGV0ZUxpc3RNb2RhbCA9ICgoKSA9PiB7XG4gIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRlbGV0ZS1saXN0LW1vZGFsJykucGFyZW50RWxlbWVudDtcbiAgY29uc3QgY2FuY2VsQnRuID0gbW9kYWwucXVlcnlTZWxlY3RvcignLmNhbmNlbC1idXR0b24nKTtcbiAgY29uc3QgZGVsZXRlQnRuID0gbW9kYWwucXVlcnlTZWxlY3RvcignLmRlbGV0ZS1idXR0b24nKTtcblxuICBjb25zdCBzZXRQcm9qZWN0RGF0YUluZGV4ID0gKHByb2plY3RJbmRleCkgPT4ge1xuICAgIGRlbGV0ZUJ0bi5kYXRhc2V0LnByb2plY3RJbmRleCA9IHByb2plY3RJbmRleDtcbiAgfTtcblxuICBjb25zdCBvcGVuRGVsZXRlTW9kYWwgPSAocHJvamVjdEluZGV4KSA9PiB7XG4gICAgc2V0UHJvamVjdERhdGFJbmRleChwcm9qZWN0SW5kZXgpO1xuICAgIHRvZ2dsZUhpZGRlbihtb2RhbCk7XG4gIH07XG5cbiAgY29uc3QgZGVsZXRlTGlzdCA9ICgpID0+IHtcbiAgICBjb25zdCBpbmRleCA9IE51bWJlcihkZWxldGVCdG4uZGF0YXNldC5wcm9qZWN0SW5kZXgpO1xuICAgIHByb2plY3RNYW5hZ2VyLmRlbGV0ZVByb2plY3QoaW5kZXgpO1xuICAgIG5hdmJhci5yZW5kZXJEZWxldGVkTGlzdChpbmRleCk7XG4gICAgdG9nZ2xlSGlkZGVuKG1vZGFsKTtcbiAgfTtcblxuICAvKiBGdW5jdGlvbiB0byBpbnZva2UgaW4gaW5pdGlsaXNlciBmdW5jdGlvbiwgZm9yIHRoZSBjb21wb25lbnQgdG8gd29yayBwcm9wZXJseSAqL1xuICBjb25zdCBhZGRDYW5jZWxCdG5MaXN0ZW5lciA9ICgpID0+IHtcbiAgICBjYW5jZWxCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB0b2dnbGVIaWRkZW4obW9kYWwpKTtcbiAgfTtcblxuICBjb25zdCBhZGREZWxldGVCdG5MaXN0ZW5lciA9ICgpID0+IHtcbiAgICBkZWxldGVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBkZWxldGVMaXN0KTtcbiAgfTtcblxuICByZXR1cm4geyBvcGVuRGVsZXRlTW9kYWwsIGFkZENhbmNlbEJ0bkxpc3RlbmVyLCBhZGREZWxldGVCdG5MaXN0ZW5lciB9O1xufSkoKTtcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi0gSW5pdGlhbGlzZXIgZnVuY3Rpb25cbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5jb25zdCBpbml0aWFsaXNlVUkgPSAoKSA9PiB7XG4gIGhlYWRlci5hZGRIZWFkZXJMaXN0ZW5lcnMoKTtcblxuICBuYXZiYXIucmVuZGVyQ3VycmVudExpc3RzKCk7XG4gIG5hdmJhci5hZGROZXdMaXN0QnRuTGlzdGVuZXIoKTtcblxuICBhbGxNb2RhbHMuYWRkQ2xvc2VCdG5MaXN0ZW5lcnMoKTtcbiAgYWxsTW9kYWxzLmFkZENsb3NlQmFja2dyb3VuZExpc3RlbmVycygpO1xuXG4gIG5ld0xpc3RNb2RhbC5hZGRTdWJtaXRCdG5MaXN0ZW5lcigpO1xuICBkZWxldGVMaXN0TW9kYWwuYWRkQ2FuY2VsQnRuTGlzdGVuZXIoKTtcbiAgZGVsZXRlTGlzdE1vZGFsLmFkZERlbGV0ZUJ0bkxpc3RlbmVyKCk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBpbml0aWFsaXNlVUk7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IHByb2plY3RNYW5hZ2VyLCB0YXNrTWFuYWdlciwgc3RlcE1hbmFnZXIgfSBmcm9tICcuL3RvRG9MaXN0JztcbmltcG9ydCBpbml0aWFsaXNlVUkgZnJvbSAnLi91aSc7XG5cbnByb2plY3RNYW5hZ2VyLmluaXRpYWxpc2UoKTtcbmluaXRpYWxpc2VVSSgpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9