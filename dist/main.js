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

  - Main module
	
	- Module to control things common most modals

	- 'New List' modal module

  - 'Delete list' modal module

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
  /* Function to invoke on initilise, for the component to work properly */
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
      const link = list.querySelector('a');
      const buttons = list.querySelectorAll('button');
      link.dataset.projectIndex = updatedIndex;
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

    editBtn.addEventListener('click', () =>
      editListModal.openEditModal(editBtn.dataset.projectIndex),
    );
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
        updateAllProjectIndices();
        break;
      }
    }
  };

  const renderEditedList = (listIndex, project) => {
    const lists = document.getElementById('nav-todo-lists').children;
    for (const list of lists) {
      const link = list.querySelector('a');
      if (link.dataset.projectIndex === String(listIndex)) {
        link.textContent = project.title;
        break;
      }
    }
  };

  /* Functions to invoke on initilise, for the component to work properly */
  const renderCurrentLists = () => {
    const lists = _toDoList__WEBPACK_IMPORTED_MODULE_0__.projectManager.revealAllProjects();
    lists.forEach((list) => {
      if (lists.indexOf(list) > 0) {
        renderNewList(list, lists.indexOf(list));
      }
    });
  };

  const setInboxProjectIndex = () => {
    const inbox = document.getElementById('nav-list-inbox');
    setProjectDataIndex(inbox, 0);
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
    renderEditedList,
    renderCurrentLists,
    setInboxProjectIndex,
    addNewListBtnListener,
  };
})();

/* **************************************************************
- Main module
************************************************************** */
const main = (() => {
  const newTaskBtn = document.getElementById('main-new-task-button');

  const renderHeader = (project) => {
    const listTitle = document.getElementById('main-list-title');
    const listDescription = document.getElementById('main-list-description');
    listTitle.textContent = project.title;
    listDescription.textContent = project.description;
  };

  const setNewTaskBtnIndex = (index) => {
    newTaskBtn.dataset.projectIndex = index;
  };

  const addNewTaskBtnListener = () => {
    newTaskBtn.addEventListener('click', () =>
      newTaskModal.openNewTaskModal(newTaskBtn.dataset.projectIndex),
    );
  };

  const clearTasks = () => {
    const taskGroups = document.querySelectorAll('.main-tasks');
    taskGroups.forEach((taskGroup) => {
      taskGroup.innerHTML = '';
    });
  };

  /* Function to invoke on initilise, for the component to work properly */
  const init = () => {
    const firstProject = _toDoList__WEBPACK_IMPORTED_MODULE_0__.projectManager.revealProject(0);
    renderHeader(firstProject);
    setNewTaskBtnIndex(0);
    addNewTaskBtnListener();
  };

  return {
    renderHeader,
    setNewTaskBtnIndex,
    clearTasks,
    addNewTaskBtnListener,
    init,
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

  /* Functions to invoke on initilise, for the component to work properly */
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

  /* Function to invoke on initilise, for the component to work properly */
  const addSubmitBtnListener = () => {
    submitBtn.addEventListener('click', (e) => creatNewList(e));
  };

  return { addSubmitBtnListener };
})();

/* **************************************************************
- 'Edit list' modal module
************************************************************** */
const editListModal = (() => {
  const modal = document.querySelector('.edit-list-modal').parentElement;
  const editBtn = document.getElementById('edit-list-submit-button');

  const setProjectDataIndex = (projectIndex) => {
    editBtn.dataset.projectIndex = projectIndex;
  };

  const openEditModal = (projectIndex) => {
    const titleInput = document.getElementById('edit-list-name');
    const descriptionInput = document.getElementById('edit-list-description');
    const projectToEdit = _toDoList__WEBPACK_IMPORTED_MODULE_0__.projectManager.revealProject(Number(projectIndex));

    titleInput.value = projectToEdit.title;
    descriptionInput.value = projectToEdit.description;

    setProjectDataIndex(projectIndex);
    toggleHidden(modal);
  };

  const editList = (e) => {
    const titleInput = document.getElementById('edit-list-name').value;
    const descriptionInput = document.getElementById(
      'edit-list-description',
    ).value;
    const index = Number(editBtn.dataset.projectIndex);

    if (titleInput !== '') {
      e.preventDefault();
      _toDoList__WEBPACK_IMPORTED_MODULE_0__.projectManager.editProjectTitle(index, titleInput);
      _toDoList__WEBPACK_IMPORTED_MODULE_0__.projectManager.editProjectDescription(index, descriptionInput);
      navbar.renderEditedList(index, _toDoList__WEBPACK_IMPORTED_MODULE_0__.projectManager.revealProject(index));
      allModals.closeModal(modal);
    }
  };

  /* Function to invoke on initilise, for the component to work properly */
  const addEditBtnListener = () => {
    editBtn.addEventListener('click', (e) => editList(e));
  };

  return { openEditModal, addEditBtnListener };
})();

/* **************************************************************
- 'Delete list' modal module
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

  /* Function to invoke on initilise, for the component to work properly */
  const addCancelBtnListener = () => {
    cancelBtn.addEventListener('click', () => toggleHidden(modal));
  };

  const addDeleteBtnListener = () => {
    deleteBtn.addEventListener('click', deleteList);
  };

  return { openDeleteModal, addCancelBtnListener, addDeleteBtnListener };
})();

/* **************************************************************
- 'New task' modal module
************************************************************** */
const newTaskModal = (() => {
  const modal = document.querySelector('.new-task-modal').parentElement;
  const newTaskBtn = document.getElementById('new-task-submit-button');

  const setProjectDataIndex = (projectIndex) => {
    newTaskBtn.dataset.projectIndex = projectIndex;
  };

  const openNewTaskModal = (projectIndex) => {
    setProjectDataIndex(projectIndex);
    toggleHidden(modal);
  };

  return { openNewTaskModal };
})();

/* **************************************************************
- Initialiser function
************************************************************** */
const initialiseUI = () => {
  header.addHeaderListeners();

  navbar.renderCurrentLists();
  navbar.setInboxProjectIndex();
  navbar.addNewListBtnListener();

  main.init();

  allModals.addCloseBtnListeners();
  allModals.addCloseBackgroundListeners();

  newListModal.addSubmitBtnListener();
  editListModal.addEditBtnListener();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsV0FBVztBQUNYLENBQUM7O0FBRUQsaUVBQWUsY0FBYyxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNuQjlCOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDdUM7O0FBRXZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEVBQUUsZ0RBQWM7QUFDaEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwyQkFBMkIsZ0RBQWM7QUFDekM7QUFDQTtBQUNBLE1BQU07QUFDTixzQkFBc0IsMkJBQTJCO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRW1EOzs7Ozs7Ozs7Ozs7Ozs7O0FDMVZwRDs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNzRTs7QUFFdEU7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLFdBQVc7QUFDWCxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwwQkFBMEIsV0FBVztBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxrQkFBa0IscURBQWM7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBLHlCQUF5QixxREFBYztBQUN2QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUEsV0FBVztBQUNYLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxzQkFBc0IscURBQWM7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFdBQVc7QUFDWCxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLHFEQUFjOztBQUV4QztBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQU0scURBQWM7QUFDcEIsTUFBTSxxREFBYztBQUNwQixxQ0FBcUMscURBQWM7QUFDbkQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFdBQVc7QUFDWCxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsSUFBSSxxREFBYztBQUNsQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLFdBQVc7QUFDWCxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsV0FBVztBQUNYLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlFQUFlLFlBQVksRUFBQzs7Ozs7OztVQ3JhNUI7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7QUNONEM7QUFDWjs7QUFFaEMscURBQWM7QUFDZCwrQ0FBWSIsInNvdXJjZXMiOlsid2VicGFjazovL3RvLWRvLWxpc3QvLi9zcmMvc3RvcmFnZS5qcyIsIndlYnBhY2s6Ly90by1kby1saXN0Ly4vc3JjL3RvRG9MaXN0LmpzIiwid2VicGFjazovL3RvLWRvLWxpc3QvLi9zcmMvdWkuanMiLCJ3ZWJwYWNrOi8vdG8tZG8tbGlzdC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90by1kby1saXN0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly90by1kby1saXN0L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vdG8tZG8tbGlzdC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3RvLWRvLWxpc3QvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3Qgc3RvcmFnZU1hbmFnZXIgPSAoKCkgPT4ge1xuICAvKiBJbml0aWFsIGZ1bmN0aW9uIHRvIGdldCBhbnl0aGluZyBzYXZlZCBpbiBsb2NhbFN0b3JhZ2UgKi9cbiAgY29uc3QgZ2V0U3RvcmFnZSA9ICgpID0+IHtcbiAgICBsZXQgdG9Eb0xpc3QgPSBbXTtcbiAgICBpZiAobG9jYWxTdG9yYWdlLnRvRG9MaXN0KSB7XG4gICAgICB0b0RvTGlzdCA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3RvRG9MaXN0JykpO1xuICAgIH1cblxuICAgIHJldHVybiB0b0RvTGlzdDtcbiAgfTtcblxuICBjb25zdCBzZXRTdG9yYWdlID0gKHByb2plY3RzKSA9PiB7XG4gICAgY29uc3QgdG9Eb0xpc3QgPSBKU09OLnN0cmluZ2lmeShwcm9qZWN0cyk7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3RvRG9MaXN0JywgdG9Eb0xpc3QpO1xuICB9O1xuXG4gIHJldHVybiB7IGdldFN0b3JhZ2UsIHNldFN0b3JhZ2UgfTtcbn0pKCk7XG5cbmV4cG9ydCBkZWZhdWx0IHN0b3JhZ2VNYW5hZ2VyO1xuIiwiLyogQ29udGVudHM6XG5cbiAgLSBDb25zdHJ1Y3RvcnMgLSBUYXNrLCBTdGVwICYgUHJvamVjdFxuXG4gIC0gRnVuY3Rpb25zIHRvIGRlZXAgY2xvbmUgYXJyYXlzICYgb2JqZWN0cywgJiB1cGRhdGUgbG9jYWwgc3RvcmFnZVxuXG4gIC0gUHJvamVjdCBNYW5hZ2VyXG5cbiAgLSBUYXNrIE1hbmFnZXJcblxuICAtIFN0ZXAgTWFuYWdlclxuKi9cbmltcG9ydCBzdG9yYWdlTWFuYWdlciBmcm9tICcuL3N0b3JhZ2UnO1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLSBDb25zdHJ1Y3RvcnMgLSBUYXNrLCBTdGVwICYgUHJvamVjdFxuICAtIFN0ZXAgZ29lcyBpbnNpZGUgVGFzay5zdGVwc1tdXG4gIC0gVGFzayBnb2VzIGluc2lkZSBQcm9qZWN0LnRhc2tzW11cbiAgLSBQcm9qZWN0IGdvZXMgaW5zaWRlIHByb2plY3RzW11cbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5jbGFzcyBUYXNrIHtcbiAgY29uc3RydWN0b3IodGl0bGUsIGRlc2NyaXB0aW9uLCBkdWVEYXRlLCBwcmlvcml0eSwgc3RhdHVzKSB7XG4gICAgdGhpcy50aXRsZSA9IHRpdGxlO1xuICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcbiAgICB0aGlzLnN0ZXBzID0gW107XG4gICAgdGhpcy5kdWVEYXRlID0gZHVlRGF0ZTtcbiAgICB0aGlzLnByaW9yaXR5ID0gcHJpb3JpdHk7XG4gICAgdGhpcy5zdGF0dXMgPSBzdGF0dXM7XG4gIH1cbn1cblxuY2xhc3MgU3RlcCB7XG4gIGNvbnN0cnVjdG9yKGRlc2NyaXB0aW9uLCBzdGF0dXMpIHtcbiAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XG4gICAgdGhpcy5zdGF0dXMgPSBzdGF0dXM7XG4gIH1cbn1cblxuY2xhc3MgUHJvamVjdCB7XG4gIGNvbnN0cnVjdG9yKHRpdGxlLCBkZXNjcmlwdGlvbikge1xuICAgIHRoaXMudGl0bGUgPSB0aXRsZTtcbiAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XG4gICAgdGhpcy50YXNrcyA9IFtdO1xuICB9XG59XG5cbmNvbnN0IHByb2plY3RzID0gW107XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4tIEZ1bmN0aW9ucyB0byBkZWVwIGNsb25lIGFycmF5cyAmIG9iamVjdHMsICYgdXBkYXRlIGxvY2FsIHN0b3JhZ2VcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5jb25zdCBkZWVwQ29weUFycmF5ID0gKGFycmF5KSA9PiB7XG4gIGNvbnN0IGFycmF5Q29weSA9IFtdO1xuICBhcnJheS5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoaXRlbSkpIHtcbiAgICAgIGFycmF5Q29weS5wdXNoKGRlZXBDb3B5QXJyYXkoaXRlbSkpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGl0ZW0gPT09ICdvYmplY3QnKSB7XG4gICAgICBhcnJheUNvcHkucHVzaChkZWVwQ29weU9iamVjdChpdGVtKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFycmF5Q29weS5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBhcnJheUNvcHk7XG59O1xuXG5jb25zdCBkZWVwQ29weU9iamVjdCA9IChvYmplY3QpID0+IHtcbiAgY29uc3Qgb2JqZWN0Q29weSA9IHt9O1xuICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhvYmplY3QpKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICBvYmplY3RDb3B5W2tleV0gPSBkZWVwQ29weUFycmF5KHZhbHVlKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIG9iamVjdENvcHlba2V5XSA9IGRlZXBDb3B5T2JqZWN0KHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb2JqZWN0Q29weVtrZXldID0gdmFsdWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBvYmplY3RDb3B5O1xufTtcblxuY29uc3Qgc2V0U3RvcmFnZSA9ICgpID0+IHtcbiAgY29uc3QgcHJvamVjdHNDb3B5ID0gZGVlcENvcHlBcnJheShwcm9qZWN0cyk7XG4gIHN0b3JhZ2VNYW5hZ2VyLnNldFN0b3JhZ2UocHJvamVjdHNDb3B5KTtcbn07XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4tIFByb2plY3QgTWFuYWdlclxuICAtIENyZWF0ZSBhIHNhZmUgY29weSBvZiBhIHByb2plY3QgJiBvZiB0aGUgcHJvamVjdHMgYXJyYXkgZm9yIHB1YmxpYyB1c2VcbiAgLSBDcmVhdGUgJiBkZWxldGUgcHJvamVjdHNcbiAgLSBFZGl0IHByb2plY3QgdGl0bGVzICYgZGVzY3JpcHRpb25zXG4gIC0gSW5pdGlhbGlzZSBieSBjaGVja2luZyBmb3IgbG9jYWxseSBzdG9yZWQgcHJvamVjdHNcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5jb25zdCBwcm9qZWN0TWFuYWdlciA9ICgoKSA9PiB7XG4gIGNvbnN0IHJldmVhbFByb2plY3QgPSAocHJvamVjdEluZGV4KSA9PiB7XG4gICAgY29uc3QgcHJvamVjdENvcHkgPSBkZWVwQ29weU9iamVjdChwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0pO1xuXG4gICAgcmV0dXJuIHByb2plY3RDb3B5O1xuICB9O1xuXG4gIGNvbnN0IHJldmVhbEFsbFByb2plY3RzID0gKCkgPT4ge1xuICAgIGNvbnN0IHByb2plY3RzQ29weSA9IGRlZXBDb3B5QXJyYXkocHJvamVjdHMpO1xuXG4gICAgcmV0dXJuIHByb2plY3RzQ29weTtcbiAgfTtcblxuICBjb25zdCBjcmVhdGVOZXdQcm9qZWN0ID0gKHRpdGxlLCBkZXNjcmlwdGlvbikgPT4ge1xuICAgIGNvbnN0IG5ld1Byb2plY3QgPSBuZXcgUHJvamVjdCh0aXRsZSwgZGVzY3JpcHRpb24pO1xuICAgIHByb2plY3RzLnB1c2gobmV3UHJvamVjdCk7XG5cbiAgICBzZXRTdG9yYWdlKCk7XG4gICAgcmV0dXJuIHJldmVhbFByb2plY3QocHJvamVjdHMubGVuZ3RoIC0gMSk7XG4gIH07XG5cbiAgY29uc3QgZGVsZXRlUHJvamVjdCA9IChwcm9qZWN0SW5kZXgpID0+IHtcbiAgICBjb25zdCBpbmRleCA9IE51bWJlcihwcm9qZWN0SW5kZXgpO1xuICAgIHByb2plY3RzLnNwbGljZShpbmRleCwgMSk7XG5cbiAgICBzZXRTdG9yYWdlKCk7XG4gICAgcmV0dXJuIHJldmVhbEFsbFByb2plY3RzKCk7XG4gIH07XG5cbiAgLyogTWlnaHQgbm90IG5lZWQgdGhpcyAqL1xuICBjb25zdCBkZWxldGVQcm9qZWN0QnlOYW1lID0gKHByb2plY3RUaXRsZSkgPT4ge1xuICAgIHByb2plY3RzLmZvckVhY2goKHByb2plY3QpID0+IHtcbiAgICAgIGlmIChwcm9qZWN0LnRpdGxlID09PSBwcm9qZWN0VGl0bGUpIHtcbiAgICAgICAgcHJvamVjdHMuc3BsaWNlKHByb2plY3RzLmluZGV4T2YocHJvamVjdCksIDEpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgc2V0U3RvcmFnZSgpO1xuICAgIHJldHVybiByZXZlYWxBbGxQcm9qZWN0cygpO1xuICB9O1xuXG4gIGNvbnN0IGVkaXRQcm9qZWN0VGl0bGUgPSAocHJvamVjdEluZGV4LCBuZXdUaXRsZSkgPT4ge1xuICAgIHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXS50aXRsZSA9IG5ld1RpdGxlO1xuXG4gICAgc2V0U3RvcmFnZSgpO1xuICAgIHJldHVybiByZXZlYWxQcm9qZWN0KE51bWJlcihwcm9qZWN0SW5kZXgpKTtcbiAgfTtcblxuICBjb25zdCBlZGl0UHJvamVjdERlc2NyaXB0aW9uID0gKHByb2plY3RJbmRleCwgbmV3RGVzY3JpcHRpb24pID0+IHtcbiAgICBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0uZGVzY3JpcHRpb24gPSBuZXdEZXNjcmlwdGlvbjtcblxuICAgIHNldFN0b3JhZ2UoKTtcbiAgICByZXR1cm4gcmV2ZWFsUHJvamVjdChOdW1iZXIocHJvamVjdEluZGV4KSk7XG4gIH07XG5cbiAgLyogVGhpcyBzaG91bGQgYmUgdXNlZCBhdCB0aGUgYmVnZ2luaW5nIG9mIHRoZSBjb2RlIHRvIHN0YXJ0IHRoZSBhcHAgcHJvcGVybHkgKi9cbiAgY29uc3QgaW5pdGlhbGlzZSA9ICgpID0+IHtcbiAgICBjb25zdCBzdG9yZWRQcm9qZWN0cyA9IHN0b3JhZ2VNYW5hZ2VyLmdldFN0b3JhZ2UoKTtcbiAgICBpZiAoc3RvcmVkUHJvamVjdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICBjcmVhdGVOZXdQcm9qZWN0KCdJbmJveCcsICcnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdG9yZWRQcm9qZWN0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBwcm9qZWN0cy5wdXNoKHN0b3JlZFByb2plY3RzW2ldKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJldmVhbEFsbFByb2plY3RzKCk7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICByZXZlYWxQcm9qZWN0LFxuICAgIHJldmVhbEFsbFByb2plY3RzLFxuICAgIGNyZWF0ZU5ld1Byb2plY3QsXG4gICAgZGVsZXRlUHJvamVjdCxcbiAgICBkZWxldGVQcm9qZWN0QnlOYW1lLFxuICAgIGVkaXRQcm9qZWN0VGl0bGUsXG4gICAgZWRpdFByb2plY3REZXNjcmlwdGlvbixcbiAgICBpbml0aWFsaXNlLFxuICB9O1xufSkoKTtcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi0gVGFzayBNYW5hZ2VyXG4gIC0gQ3JlYXRlIGEgc2FmZSBjb3B5IG9mIGEgc2luZ2xlIHRhc2sgZm9yIHB1YmxpYyB1c2VcbiAgLSBDcmVhdGUgJiBkZWxldGUgdGFza3MgaW4gYSBwcm9qZWN0XG4gIC0gRWRpdCB0YXNrIHRpdGxlLCBkZXNjcmlwdGlvbiwgZHVlIGRhdGUsIHByaW9yaXR5ICYgc3RhdHVzXG4gIC0gU3Vic2NyaWJlIHRvIG1lZGlhdG9yIGV2ZW50c1xuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbmNvbnN0IHRhc2tNYW5hZ2VyID0gKCgpID0+IHtcbiAgY29uc3QgcmV2ZWFsVGFzayA9IChwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCkgPT4ge1xuICAgIGNvbnN0IHRhc2tDb3B5ID0gZGVlcENvcHlPYmplY3QoXG4gICAgICBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0udGFza3NbTnVtYmVyKHRhc2tJbmRleCldLFxuICAgICk7XG5cbiAgICByZXR1cm4gdGFza0NvcHk7XG4gIH07XG5cbiAgY29uc3QgY3JlYXRlTmV3VGFzayA9IChcbiAgICBwcm9qZWN0SW5kZXgsXG4gICAgdGl0bGUsXG4gICAgZGVzY3JpcHRpb24sXG4gICAgZHVlRGF0ZSxcbiAgICBwcmlvcml0eSxcbiAgICBzdGF0dXMsXG4gICkgPT4ge1xuICAgIGNvbnN0IHByb2plY3QgPSBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV07XG4gICAgcHJvamVjdC50YXNrcy5wdXNoKG5ldyBUYXNrKHRpdGxlLCBkZXNjcmlwdGlvbiwgZHVlRGF0ZSwgcHJpb3JpdHksIHN0YXR1cykpO1xuXG4gICAgc2V0U3RvcmFnZSgpO1xuICAgIHJldHVybiByZXZlYWxUYXNrKE51bWJlcihwcm9qZWN0SW5kZXgpLCBwcm9qZWN0LnRhc2tzLmxlbmd0aCAtIDEpO1xuICB9O1xuXG4gIGNvbnN0IGRlbGV0ZVRhc2sgPSAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgpID0+IHtcbiAgICBjb25zdCBwcm9qZWN0ID0gcHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldO1xuICAgIGNvbnN0IGluZGV4ID0gTnVtYmVyKHRhc2tJbmRleCk7XG4gICAgcHJvamVjdC50YXNrcy5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gICAgc2V0U3RvcmFnZSgpO1xuICAgIHJldHVybiBwcm9qZWN0TWFuYWdlci5yZXZlYWxQcm9qZWN0KE51bWJlcihwcm9qZWN0SW5kZXgpKTtcbiAgfTtcblxuICBjb25zdCBlZGl0VGFza1RpdGxlID0gKHByb2plY3RJbmRleCwgdGFza0luZGV4LCBuZXdUaXRsZSkgPT4ge1xuICAgIGNvbnN0IHRhc2sgPSBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0udGFza3NbTnVtYmVyKHRhc2tJbmRleCldO1xuICAgIHRhc2sudGl0bGUgPSBuZXdUaXRsZTtcblxuICAgIHNldFN0b3JhZ2UoKTtcbiAgICByZXR1cm4gcmV2ZWFsVGFzayhOdW1iZXIocHJvamVjdEluZGV4KSwgTnVtYmVyKHRhc2tJbmRleCkpO1xuICB9O1xuXG4gIGNvbnN0IGVkaXRUYXNrRGVzY3JpcHRpb24gPSAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgsIG5ld0Rlc2NyaXB0aW9uKSA9PiB7XG4gICAgY29uc3QgdGFzayA9IHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXS50YXNrc1tOdW1iZXIodGFza0luZGV4KV07XG4gICAgdGFzay5kZXNjcmlwdGlvbiA9IG5ld0Rlc2NyaXB0aW9uO1xuXG4gICAgc2V0U3RvcmFnZSgpO1xuICAgIHJldHVybiByZXZlYWxUYXNrKE51bWJlcihwcm9qZWN0SW5kZXgpLCBOdW1iZXIodGFza0luZGV4KSk7XG4gIH07XG5cbiAgY29uc3QgZWRpdFRhc2tEdWVEYXRlID0gKHByb2plY3RJbmRleCwgdGFza0luZGV4LCBuZXdEdWVEYXRlKSA9PiB7XG4gICAgY29uc3QgdGFzayA9IHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXS50YXNrc1tOdW1iZXIodGFza0luZGV4KV07XG4gICAgdGFzay5kdWVEYXRlID0gbmV3RHVlRGF0ZTtcblxuICAgIHNldFN0b3JhZ2UoKTtcbiAgICByZXR1cm4gcmV2ZWFsVGFzayhOdW1iZXIocHJvamVjdEluZGV4KSwgTnVtYmVyKHRhc2tJbmRleCkpO1xuICB9O1xuXG4gIGNvbnN0IGVkaXRUYXNrUHJpb3JpdHkgPSAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgsIG5ld1ByaW9yaXR5KSA9PiB7XG4gICAgY29uc3QgdGFzayA9IHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXS50YXNrc1tOdW1iZXIodGFza0luZGV4KV07XG4gICAgdGFzay5wcmlvcml0eSA9IG5ld1ByaW9yaXR5O1xuXG4gICAgc2V0U3RvcmFnZSgpO1xuICAgIHJldHVybiByZXZlYWxUYXNrKE51bWJlcihwcm9qZWN0SW5kZXgpLCBOdW1iZXIodGFza0luZGV4KSk7XG4gIH07XG5cbiAgY29uc3QgZWRpdFRhc2tTdGF0dXMgPSAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgsIG5ld1N0YXR1cykgPT4ge1xuICAgIGNvbnN0IHRhc2sgPSBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0udGFza3NbTnVtYmVyKHRhc2tJbmRleCldO1xuICAgIHRhc2suc3RhdHVzID0gbmV3U3RhdHVzO1xuXG4gICAgc2V0U3RvcmFnZSgpO1xuICAgIHJldHVybiByZXZlYWxUYXNrKE51bWJlcihwcm9qZWN0SW5kZXgpLCBOdW1iZXIodGFza0luZGV4KSk7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICByZXZlYWxUYXNrLFxuICAgIGNyZWF0ZU5ld1Rhc2ssXG4gICAgZGVsZXRlVGFzayxcbiAgICBlZGl0VGFza1RpdGxlLFxuICAgIGVkaXRUYXNrRGVzY3JpcHRpb24sXG4gICAgZWRpdFRhc2tEdWVEYXRlLFxuICAgIGVkaXRUYXNrUHJpb3JpdHksXG4gICAgZWRpdFRhc2tTdGF0dXMsXG4gIH07XG59KSgpO1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLSBTdGVwIE1hbmFnZXJcbiAgLSBDcmVhdGUgJiBkZWxldGUgc3RlcHMgaW4gYSB0YXNrXG4gIC0gRWRpdCBzdGVwIGRlc2NyaXB0aW9uICYgc3RhdHVzXG4gIC0gQ3JlYXRlIGEgc2ZlIGNvcHkgb2YgYSBzaW5nbGUgc3RlcCBmb3IgcHVibGljIHVzZVxuICAtIFN1YnNjcmliZSB0byBtZWRpYXRvciBldmVudHNcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5jb25zdCBzdGVwTWFuYWdlciA9ICgoKSA9PiB7XG4gIGNvbnN0IHJldmVhbFN0ZXAgPSAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgsIHN0ZXBJbmRleCkgPT4ge1xuICAgIGNvbnN0IHN0ZXBDb3B5ID0gZGVlcENvcHlPYmplY3QoXG4gICAgICBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0udGFza3NbTnVtYmVyKHRhc2tJbmRleCldLnN0ZXBzW1xuICAgICAgICBOdW1iZXIoc3RlcEluZGV4KVxuICAgICAgXSxcbiAgICApO1xuXG4gICAgcmV0dXJuIHN0ZXBDb3B5O1xuICB9O1xuXG4gIGNvbnN0IGNyZWF0ZU5ld1N0ZXAgPSAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgsIGRlc2NyaXB0aW9uLCBzdGF0dXMpID0+IHtcbiAgICBjb25zdCB0YXNrID0gcHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldLnRhc2tzW051bWJlcih0YXNrSW5kZXgpXTtcbiAgICB0YXNrLnN0ZXBzLnB1c2gobmV3IFN0ZXAoZGVzY3JpcHRpb24sIHN0YXR1cykpO1xuXG4gICAgc2V0U3RvcmFnZSgpO1xuICAgIHJldHVybiByZXZlYWxTdGVwKFxuICAgICAgTnVtYmVyKHByb2plY3RJbmRleCksXG4gICAgICBOdW1iZXIodGFza0luZGV4KSxcbiAgICAgIHRhc2suc3RlcHMubGVuZ3RoIC0gMSxcbiAgICApO1xuICB9O1xuXG4gIGNvbnN0IGRlbGV0ZVN0ZXAgPSAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgsIHN0ZXBJbmRleCkgPT4ge1xuICAgIGNvbnN0IHRhc2sgPSBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0udGFza3NbTnVtYmVyKHRhc2tJbmRleCldO1xuICAgIGNvbnN0IGluZGV4ID0gTnVtYmVyKHN0ZXBJbmRleCk7XG4gICAgdGFzay5zdGVwcy5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gICAgc2V0U3RvcmFnZSgpO1xuICAgIHJldHVybiB0YXNrTWFuYWdlci5yZXZlYWxUYXNrKE51bWJlcihwcm9qZWN0SW5kZXgpLCBOdW1iZXIodGFza0luZGV4KSk7XG4gIH07XG5cbiAgY29uc3QgZWRpdFN0ZXBEZXNjcmlwdGlvbiA9IChcbiAgICBwcm9qZWN0SW5kZXgsXG4gICAgdGFza0luZGV4LFxuICAgIHN0ZXBJbmRleCxcbiAgICBuZXdEZXNjcmlwdGlvbixcbiAgKSA9PiB7XG4gICAgY29uc3Qgc3RlcCA9XG4gICAgICBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0udGFza3NbTnVtYmVyKHRhc2tJbmRleCldLnN0ZXBzW1xuICAgICAgICBOdW1iZXIoc3RlcEluZGV4KVxuICAgICAgXTtcbiAgICBzdGVwLmRlc2NyaXB0aW9uID0gbmV3RGVzY3JpcHRpb247XG5cbiAgICBzZXRTdG9yYWdlKCk7XG4gICAgcmV0dXJuIHJldmVhbFN0ZXAoXG4gICAgICBOdW1iZXIocHJvamVjdEluZGV4KSxcbiAgICAgIE51bWJlcih0YXNrSW5kZXgpLFxuICAgICAgTnVtYmVyKHN0ZXBJbmRleCksXG4gICAgKTtcbiAgfTtcblxuICBjb25zdCBlZGl0U3RlcFN0YXR1cyA9IChwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCwgc3RlcEluZGV4LCBuZXdTdGF0dXMpID0+IHtcbiAgICBjb25zdCBzdGVwID1cbiAgICAgIHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXS50YXNrc1tOdW1iZXIodGFza0luZGV4KV0uc3RlcHNbXG4gICAgICAgIE51bWJlcihzdGVwSW5kZXgpXG4gICAgICBdO1xuICAgIHN0ZXAuc3RhdHVzID0gbmV3U3RhdHVzO1xuXG4gICAgc2V0U3RvcmFnZSgpO1xuICAgIHJldHVybiByZXZlYWxTdGVwKFxuICAgICAgTnVtYmVyKHByb2plY3RJbmRleCksXG4gICAgICBOdW1iZXIodGFza0luZGV4KSxcbiAgICAgIE51bWJlcihzdGVwSW5kZXgpLFxuICAgICk7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICByZXZlYWxTdGVwLFxuICAgIGNyZWF0ZU5ld1N0ZXAsXG4gICAgZGVsZXRlU3RlcCxcbiAgICBlZGl0U3RlcERlc2NyaXB0aW9uLFxuICAgIGVkaXRTdGVwU3RhdHVzLFxuICB9O1xufSkoKTtcblxuZXhwb3J0IHsgcHJvamVjdE1hbmFnZXIsIHRhc2tNYW5hZ2VyLCBzdGVwTWFuYWdlciB9O1xuIiwiLyogQ29udGVudHM6XG5cblx0LSBHZW5lcmFsXG5cblx0LSBIZWFkZXIgbW9kdWxlXG5cblx0LSBOYXZiYXIgbW9kdWxlXG5cbiAgLSBNYWluIG1vZHVsZVxuXHRcblx0LSBNb2R1bGUgdG8gY29udHJvbCB0aGluZ3MgY29tbW9uIG1vc3QgbW9kYWxzXG5cblx0LSAnTmV3IExpc3QnIG1vZGFsIG1vZHVsZVxuXG4gIC0gJ0RlbGV0ZSBsaXN0JyBtb2RhbCBtb2R1bGVcblxuXHQtIEluaXRpYWxpc2VyIGZ1bmN0aW9uXG4qL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi0gR2VuZXJhbFxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbmltcG9ydCB7IHByb2plY3RNYW5hZ2VyLCB0YXNrTWFuYWdlciwgc3RlcE1hbmFnZXIgfSBmcm9tICcuL3RvRG9MaXN0JztcblxuY29uc3QgdG9nZ2xlSGlkZGVuID0gKGVsZW1lbnQpID0+IHtcbiAgZWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKCdoaWRkZW4nKTtcbn07XG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLSBIZWFkZXIgbW9kdWxlXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuY29uc3QgaGVhZGVyID0gKCgpID0+IHtcbiAgLyogRnVuY3Rpb24gdG8gaW52b2tlIG9uIGluaXRpbGlzZSwgZm9yIHRoZSBjb21wb25lbnQgdG8gd29yayBwcm9wZXJseSAqL1xuICBjb25zdCBhZGRIZWFkZXJMaXN0ZW5lcnMgPSAoKSA9PiB7XG4gICAgY29uc3QgdG9nZ2xlTmF2QnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RvZ2dsZS1uYXYtYnV0dG9uJyk7XG4gICAgY29uc3QgdG9nZ2xlQXNpZGVCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndG9nZ2xlLWFzaWRlLWJ1dHRvbicpO1xuICAgIGNvbnN0IG5hdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ25hdicpO1xuICAgIGNvbnN0IGFzaWRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYXNpZGUnKTtcblxuICAgIHRvZ2dsZU5hdkJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHRvZ2dsZUhpZGRlbihuYXYpKTtcbiAgICB0b2dnbGVBc2lkZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHRvZ2dsZUhpZGRlbihhc2lkZSkpO1xuICB9O1xuXG4gIHJldHVybiB7IGFkZEhlYWRlckxpc3RlbmVycyB9O1xufSkoKTtcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi0gTmF2YmFyIG1vZHVsZVxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbmNvbnN0IG5hdmJhciA9ICgoKSA9PiB7XG4gIGNvbnN0IHNldFByb2plY3REYXRhSW5kZXggPSAoZWxlbWVudCwgaW5kZXgpID0+IHtcbiAgICBlbGVtZW50LmRhdGFzZXQucHJvamVjdEluZGV4ID0gaW5kZXg7XG4gIH07XG5cbiAgY29uc3QgY2FsY3VsYXRlTmV3UHJvamVjdEluZGV4ID0gKCkgPT4ge1xuICAgIGNvbnN0IGxpc3RzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25hdi10b2RvLWxpc3RzJykuY2hpbGRyZW47XG4gICAgY29uc3QgbmV3SW5kZXggPSBsaXN0cy5sZW5ndGggKyAxO1xuICAgIHJldHVybiBuZXdJbmRleDtcbiAgfTtcblxuICBjb25zdCB1cGRhdGVBbGxQcm9qZWN0SW5kaWNlcyA9ICgpID0+IHtcbiAgICBjb25zdCBjdXJyZW50TGlzdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmF2LXRvZG8tbGlzdHMnKS5jaGlsZHJlbjtcbiAgICBsZXQgdXBkYXRlZEluZGV4ID0gMTtcbiAgICBmb3IgKGNvbnN0IGxpc3Qgb2YgY3VycmVudExpc3RzKSB7XG4gICAgICBjb25zdCBsaW5rID0gbGlzdC5xdWVyeVNlbGVjdG9yKCdhJyk7XG4gICAgICBjb25zdCBidXR0b25zID0gbGlzdC5xdWVyeVNlbGVjdG9yQWxsKCdidXR0b24nKTtcbiAgICAgIGxpbmsuZGF0YXNldC5wcm9qZWN0SW5kZXggPSB1cGRhdGVkSW5kZXg7XG4gICAgICBidXR0b25zLmZvckVhY2goKGJ1dHRvbikgPT4ge1xuICAgICAgICBidXR0b24uZGF0YXNldC5wcm9qZWN0SW5kZXggPSB1cGRhdGVkSW5kZXg7XG4gICAgICB9KTtcbiAgICAgIHVwZGF0ZWRJbmRleCArPSAxO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCByZW5kZXJOZXdMaXN0ID0gKGxpc3QsIGxpc3RJbmRleCkgPT4ge1xuICAgIGNvbnN0IG5hdkxpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmF2LXRvZG8tbGlzdHMnKTtcbiAgICBjb25zdCBsaXN0SXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgY29uc3QgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjb25zdCBlZGl0QnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgY29uc3QgZWRpdEltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgIGNvbnN0IGRlbGV0ZUJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGNvbnN0IGRlbGV0ZUltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuXG4gICAgbGluay5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCAnIycpO1xuICAgIGxpbmsudGV4dENvbnRlbnQgPSBgJHtsaXN0LnRpdGxlfWA7XG4gICAgZGl2LmNsYXNzTGlzdC5hZGQoJ25hdi1saXN0LWJ1dHRvbnMnKTtcbiAgICBlZGl0SW1nLnNldEF0dHJpYnV0ZSgnc3JjJywgJy4vaWNvbnMvZWRpdC5zdmcnKTtcbiAgICBlZGl0SW1nLnNldEF0dHJpYnV0ZSgnYWx0JywgJ2J1dHRvbiB0byBlZGl0IGxpc3QnKTtcbiAgICBkZWxldGVJbWcuc2V0QXR0cmlidXRlKCdzcmMnLCAnLi9pY29ucy9kZWxldGUuc3ZnJyk7XG4gICAgZGVsZXRlSW1nLnNldEF0dHJpYnV0ZSgnYWx0JywgJ2J1dHRvbiB0byBkZWxldGUgbGlzdCcpO1xuXG4gICAgc2V0UHJvamVjdERhdGFJbmRleChsaW5rLCBsaXN0SW5kZXgpO1xuICAgIHNldFByb2plY3REYXRhSW5kZXgoZWRpdEJ0biwgbGlzdEluZGV4KTtcbiAgICBzZXRQcm9qZWN0RGF0YUluZGV4KGRlbGV0ZUJ0biwgbGlzdEluZGV4KTtcblxuICAgIGVkaXRCdG4uYXBwZW5kQ2hpbGQoZWRpdEltZyk7XG4gICAgZGVsZXRlQnRuLmFwcGVuZENoaWxkKGRlbGV0ZUltZyk7XG4gICAgZGl2LmFwcGVuZENoaWxkKGVkaXRCdG4pO1xuICAgIGRpdi5hcHBlbmRDaGlsZChkZWxldGVCdG4pO1xuICAgIGxpc3RJdGVtLmFwcGVuZENoaWxkKGxpbmspO1xuICAgIGxpc3RJdGVtLmFwcGVuZENoaWxkKGRpdik7XG4gICAgbmF2TGlzdC5hcHBlbmRDaGlsZChsaXN0SXRlbSk7XG5cbiAgICBlZGl0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT5cbiAgICAgIGVkaXRMaXN0TW9kYWwub3BlbkVkaXRNb2RhbChlZGl0QnRuLmRhdGFzZXQucHJvamVjdEluZGV4KSxcbiAgICApO1xuICAgIGRlbGV0ZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+XG4gICAgICBkZWxldGVMaXN0TW9kYWwub3BlbkRlbGV0ZU1vZGFsKGRlbGV0ZUJ0bi5kYXRhc2V0LnByb2plY3RJbmRleCksXG4gICAgKTtcbiAgfTtcblxuICBjb25zdCByZW5kZXJEZWxldGVkTGlzdCA9IChsaXN0SW5kZXgpID0+IHtcbiAgICBjb25zdCBsaXN0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduYXYtdG9kby1saXN0cycpLmNoaWxkcmVuO1xuICAgIGZvciAoY29uc3QgbGlzdCBvZiBsaXN0cykge1xuICAgICAgY29uc3QgbGluayA9IGxpc3QucXVlcnlTZWxlY3RvcignYScpO1xuICAgICAgaWYgKGxpbmsuZGF0YXNldC5wcm9qZWN0SW5kZXggPT09IFN0cmluZyhsaXN0SW5kZXgpKSB7XG4gICAgICAgIGxpc3QucmVtb3ZlKCk7XG4gICAgICAgIHVwZGF0ZUFsbFByb2plY3RJbmRpY2VzKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBjb25zdCByZW5kZXJFZGl0ZWRMaXN0ID0gKGxpc3RJbmRleCwgcHJvamVjdCkgPT4ge1xuICAgIGNvbnN0IGxpc3RzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25hdi10b2RvLWxpc3RzJykuY2hpbGRyZW47XG4gICAgZm9yIChjb25zdCBsaXN0IG9mIGxpc3RzKSB7XG4gICAgICBjb25zdCBsaW5rID0gbGlzdC5xdWVyeVNlbGVjdG9yKCdhJyk7XG4gICAgICBpZiAobGluay5kYXRhc2V0LnByb2plY3RJbmRleCA9PT0gU3RyaW5nKGxpc3RJbmRleCkpIHtcbiAgICAgICAgbGluay50ZXh0Q29udGVudCA9IHByb2plY3QudGl0bGU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAvKiBGdW5jdGlvbnMgdG8gaW52b2tlIG9uIGluaXRpbGlzZSwgZm9yIHRoZSBjb21wb25lbnQgdG8gd29yayBwcm9wZXJseSAqL1xuICBjb25zdCByZW5kZXJDdXJyZW50TGlzdHMgPSAoKSA9PiB7XG4gICAgY29uc3QgbGlzdHMgPSBwcm9qZWN0TWFuYWdlci5yZXZlYWxBbGxQcm9qZWN0cygpO1xuICAgIGxpc3RzLmZvckVhY2goKGxpc3QpID0+IHtcbiAgICAgIGlmIChsaXN0cy5pbmRleE9mKGxpc3QpID4gMCkge1xuICAgICAgICByZW5kZXJOZXdMaXN0KGxpc3QsIGxpc3RzLmluZGV4T2YobGlzdCkpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IHNldEluYm94UHJvamVjdEluZGV4ID0gKCkgPT4ge1xuICAgIGNvbnN0IGluYm94ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25hdi1saXN0LWluYm94Jyk7XG4gICAgc2V0UHJvamVjdERhdGFJbmRleChpbmJveCwgMCk7XG4gIH07XG5cbiAgY29uc3QgYWRkTmV3TGlzdEJ0bkxpc3RlbmVyID0gKCkgPT4ge1xuICAgIGNvbnN0IG5ld0xpc3RCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmF2LW5ldy1saXN0LWJ1dHRvbicpO1xuICAgIGNvbnN0IG1vZGFsTmV3TGlzdCA9XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmV3LWxpc3QtbW9kYWwnKS5wYXJlbnRFbGVtZW50O1xuICAgIG5ld0xpc3RCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB0b2dnbGVIaWRkZW4obW9kYWxOZXdMaXN0KSk7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBjYWxjdWxhdGVOZXdQcm9qZWN0SW5kZXgsXG4gICAgcmVuZGVyTmV3TGlzdCxcbiAgICByZW5kZXJEZWxldGVkTGlzdCxcbiAgICByZW5kZXJFZGl0ZWRMaXN0LFxuICAgIHJlbmRlckN1cnJlbnRMaXN0cyxcbiAgICBzZXRJbmJveFByb2plY3RJbmRleCxcbiAgICBhZGROZXdMaXN0QnRuTGlzdGVuZXIsXG4gIH07XG59KSgpO1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLSBNYWluIG1vZHVsZVxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbmNvbnN0IG1haW4gPSAoKCkgPT4ge1xuICBjb25zdCBuZXdUYXNrQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW4tbmV3LXRhc2stYnV0dG9uJyk7XG5cbiAgY29uc3QgcmVuZGVySGVhZGVyID0gKHByb2plY3QpID0+IHtcbiAgICBjb25zdCBsaXN0VGl0bGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbi1saXN0LXRpdGxlJyk7XG4gICAgY29uc3QgbGlzdERlc2NyaXB0aW9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW4tbGlzdC1kZXNjcmlwdGlvbicpO1xuICAgIGxpc3RUaXRsZS50ZXh0Q29udGVudCA9IHByb2plY3QudGl0bGU7XG4gICAgbGlzdERlc2NyaXB0aW9uLnRleHRDb250ZW50ID0gcHJvamVjdC5kZXNjcmlwdGlvbjtcbiAgfTtcblxuICBjb25zdCBzZXROZXdUYXNrQnRuSW5kZXggPSAoaW5kZXgpID0+IHtcbiAgICBuZXdUYXNrQnRuLmRhdGFzZXQucHJvamVjdEluZGV4ID0gaW5kZXg7XG4gIH07XG5cbiAgY29uc3QgYWRkTmV3VGFza0J0bkxpc3RlbmVyID0gKCkgPT4ge1xuICAgIG5ld1Rhc2tCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PlxuICAgICAgbmV3VGFza01vZGFsLm9wZW5OZXdUYXNrTW9kYWwobmV3VGFza0J0bi5kYXRhc2V0LnByb2plY3RJbmRleCksXG4gICAgKTtcbiAgfTtcblxuICBjb25zdCBjbGVhclRhc2tzID0gKCkgPT4ge1xuICAgIGNvbnN0IHRhc2tHcm91cHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubWFpbi10YXNrcycpO1xuICAgIHRhc2tHcm91cHMuZm9yRWFjaCgodGFza0dyb3VwKSA9PiB7XG4gICAgICB0YXNrR3JvdXAuaW5uZXJIVE1MID0gJyc7XG4gICAgfSk7XG4gIH07XG5cbiAgLyogRnVuY3Rpb24gdG8gaW52b2tlIG9uIGluaXRpbGlzZSwgZm9yIHRoZSBjb21wb25lbnQgdG8gd29yayBwcm9wZXJseSAqL1xuICBjb25zdCBpbml0ID0gKCkgPT4ge1xuICAgIGNvbnN0IGZpcnN0UHJvamVjdCA9IHByb2plY3RNYW5hZ2VyLnJldmVhbFByb2plY3QoMCk7XG4gICAgcmVuZGVySGVhZGVyKGZpcnN0UHJvamVjdCk7XG4gICAgc2V0TmV3VGFza0J0bkluZGV4KDApO1xuICAgIGFkZE5ld1Rhc2tCdG5MaXN0ZW5lcigpO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgcmVuZGVySGVhZGVyLFxuICAgIHNldE5ld1Rhc2tCdG5JbmRleCxcbiAgICBjbGVhclRhc2tzLFxuICAgIGFkZE5ld1Rhc2tCdG5MaXN0ZW5lcixcbiAgICBpbml0LFxuICB9O1xufSkoKTtcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi0gTW9kdWxlIHRvIGNvbnRyb2wgdGhpbmdzIGNvbW1vbiBtb3N0IG1vZGFsc1xuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbmNvbnN0IGFsbE1vZGFscyA9ICgoKSA9PiB7XG4gIC8qIEdlbmVyYWwgZnVuY3Rpb25zIHRvIGNsb3NlIG1vZGFscyBhbmQgY2xlYXIgaW5wdXRzICovXG4gIGNvbnN0IGNsZWFySW5wdXRzID0gKG1vZGFsKSA9PiB7XG4gICAgY29uc3QgaW5wdXRzID0gbW9kYWwucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQnKTtcbiAgICBjb25zdCB0ZXh0YXJlYXMgPSBtb2RhbC5xdWVyeVNlbGVjdG9yQWxsKCd0ZXh0YXJlYScpO1xuICAgIGlucHV0cy5mb3JFYWNoKChpbnB1dCkgPT4ge1xuICAgICAgaW5wdXQudmFsdWUgPSAnJztcbiAgICB9KTtcbiAgICB0ZXh0YXJlYXMuZm9yRWFjaCgodGV4dGFyZWEpID0+IHtcbiAgICAgIHRleHRhcmVhLnZhbHVlID0gJyc7XG4gICAgfSk7XG4gIH07XG5cbiAgY29uc3QgY2xvc2VNb2RhbCA9IChtb2RhbCkgPT4ge1xuICAgIGNsZWFySW5wdXRzKG1vZGFsKTtcbiAgICB0b2dnbGVIaWRkZW4obW9kYWwpO1xuICB9O1xuXG4gIC8qIEZ1bmN0aW9ucyB0byBpbnZva2Ugb24gaW5pdGlsaXNlLCBmb3IgdGhlIGNvbXBvbmVudCB0byB3b3JrIHByb3Blcmx5ICovXG4gIGNvbnN0IGFkZENsb3NlQnRuTGlzdGVuZXJzID0gKCkgPT4ge1xuICAgIGNvbnN0IGNsb3NlTW9kYWxCdG5zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm1vZGFsLWNsb3NlLWJ1dHRvbicpO1xuXG4gICAgY2xvc2VNb2RhbEJ0bnMuZm9yRWFjaCgoYnRuKSA9PiB7XG4gICAgICBjb25zdCBtb2RhbCA9IGJ0bi5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudDtcbiAgICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IGNsb3NlTW9kYWwobW9kYWwpKTtcbiAgICB9KTtcbiAgfTtcblxuICBjb25zdCBhZGRDbG9zZUJhY2tncm91bmRMaXN0ZW5lcnMgPSAoKSA9PiB7XG4gICAgY29uc3QgbW9kYWxCYWNrZ3JvdW5kcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5tb2RhbC1iYWNrZ3JvdW5kJyk7XG4gICAgY29uc3QgY2xvc2UgPSAoZSwgbW9kYWxCYWNrZ3JvdW5kKSA9PiB7XG4gICAgICBpZiAoIWUudGFyZ2V0LmNsb3Nlc3QoJy5tb2RhbCcpKSB7XG4gICAgICAgIGNsb3NlTW9kYWwobW9kYWxCYWNrZ3JvdW5kKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgbW9kYWxCYWNrZ3JvdW5kcy5mb3JFYWNoKChiYWNrZ3JvdW5kKSA9PiB7XG4gICAgICBiYWNrZ3JvdW5kLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IGNsb3NlKGUsIGJhY2tncm91bmQpKTtcbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4geyBjbG9zZU1vZGFsLCBhZGRDbG9zZUJ0bkxpc3RlbmVycywgYWRkQ2xvc2VCYWNrZ3JvdW5kTGlzdGVuZXJzIH07XG59KSgpO1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLSAnTmV3IExpc3QnIG1vZGFsIG1vZHVsZVxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbmNvbnN0IG5ld0xpc3RNb2RhbCA9ICgoKSA9PiB7XG4gIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5ldy1saXN0LW1vZGFsJykucGFyZW50RWxlbWVudDtcbiAgY29uc3Qgc3VibWl0QnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25ldy1saXN0LXN1Ym1pdC1idXR0b24nKTtcblxuICBjb25zdCBjcmVhdE5ld0xpc3QgPSAoZSkgPT4ge1xuICAgIGNvbnN0IHRpdGxlSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmV3LWxpc3QtbmFtZScpLnZhbHVlO1xuICAgIGNvbnN0IGRlc2NyaXB0aW9uSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcbiAgICAgICduZXctbGlzdC1kZXNjcmlwdGlvbicsXG4gICAgKS52YWx1ZTtcblxuICAgIGlmICh0aXRsZUlucHV0ICE9PSAnJykge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICBjb25zdCBuZXdMaXN0ID0gcHJvamVjdE1hbmFnZXIuY3JlYXRlTmV3UHJvamVjdChcbiAgICAgICAgdGl0bGVJbnB1dCxcbiAgICAgICAgZGVzY3JpcHRpb25JbnB1dCxcbiAgICAgICk7XG4gICAgICBuYXZiYXIucmVuZGVyTmV3TGlzdChuZXdMaXN0LCBuYXZiYXIuY2FsY3VsYXRlTmV3UHJvamVjdEluZGV4KCkpO1xuXG4gICAgICBhbGxNb2RhbHMuY2xvc2VNb2RhbChtb2RhbCk7XG4gICAgfVxuICB9O1xuXG4gIC8qIEZ1bmN0aW9uIHRvIGludm9rZSBvbiBpbml0aWxpc2UsIGZvciB0aGUgY29tcG9uZW50IHRvIHdvcmsgcHJvcGVybHkgKi9cbiAgY29uc3QgYWRkU3VibWl0QnRuTGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgc3VibWl0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IGNyZWF0TmV3TGlzdChlKSk7XG4gIH07XG5cbiAgcmV0dXJuIHsgYWRkU3VibWl0QnRuTGlzdGVuZXIgfTtcbn0pKCk7XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4tICdFZGl0IGxpc3QnIG1vZGFsIG1vZHVsZVxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbmNvbnN0IGVkaXRMaXN0TW9kYWwgPSAoKCkgPT4ge1xuICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5lZGl0LWxpc3QtbW9kYWwnKS5wYXJlbnRFbGVtZW50O1xuICBjb25zdCBlZGl0QnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VkaXQtbGlzdC1zdWJtaXQtYnV0dG9uJyk7XG5cbiAgY29uc3Qgc2V0UHJvamVjdERhdGFJbmRleCA9IChwcm9qZWN0SW5kZXgpID0+IHtcbiAgICBlZGl0QnRuLmRhdGFzZXQucHJvamVjdEluZGV4ID0gcHJvamVjdEluZGV4O1xuICB9O1xuXG4gIGNvbnN0IG9wZW5FZGl0TW9kYWwgPSAocHJvamVjdEluZGV4KSA9PiB7XG4gICAgY29uc3QgdGl0bGVJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlZGl0LWxpc3QtbmFtZScpO1xuICAgIGNvbnN0IGRlc2NyaXB0aW9uSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZWRpdC1saXN0LWRlc2NyaXB0aW9uJyk7XG4gICAgY29uc3QgcHJvamVjdFRvRWRpdCA9IHByb2plY3RNYW5hZ2VyLnJldmVhbFByb2plY3QoTnVtYmVyKHByb2plY3RJbmRleCkpO1xuXG4gICAgdGl0bGVJbnB1dC52YWx1ZSA9IHByb2plY3RUb0VkaXQudGl0bGU7XG4gICAgZGVzY3JpcHRpb25JbnB1dC52YWx1ZSA9IHByb2plY3RUb0VkaXQuZGVzY3JpcHRpb247XG5cbiAgICBzZXRQcm9qZWN0RGF0YUluZGV4KHByb2plY3RJbmRleCk7XG4gICAgdG9nZ2xlSGlkZGVuKG1vZGFsKTtcbiAgfTtcblxuICBjb25zdCBlZGl0TGlzdCA9IChlKSA9PiB7XG4gICAgY29uc3QgdGl0bGVJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlZGl0LWxpc3QtbmFtZScpLnZhbHVlO1xuICAgIGNvbnN0IGRlc2NyaXB0aW9uSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcbiAgICAgICdlZGl0LWxpc3QtZGVzY3JpcHRpb24nLFxuICAgICkudmFsdWU7XG4gICAgY29uc3QgaW5kZXggPSBOdW1iZXIoZWRpdEJ0bi5kYXRhc2V0LnByb2plY3RJbmRleCk7XG5cbiAgICBpZiAodGl0bGVJbnB1dCAhPT0gJycpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHByb2plY3RNYW5hZ2VyLmVkaXRQcm9qZWN0VGl0bGUoaW5kZXgsIHRpdGxlSW5wdXQpO1xuICAgICAgcHJvamVjdE1hbmFnZXIuZWRpdFByb2plY3REZXNjcmlwdGlvbihpbmRleCwgZGVzY3JpcHRpb25JbnB1dCk7XG4gICAgICBuYXZiYXIucmVuZGVyRWRpdGVkTGlzdChpbmRleCwgcHJvamVjdE1hbmFnZXIucmV2ZWFsUHJvamVjdChpbmRleCkpO1xuICAgICAgYWxsTW9kYWxzLmNsb3NlTW9kYWwobW9kYWwpO1xuICAgIH1cbiAgfTtcblxuICAvKiBGdW5jdGlvbiB0byBpbnZva2Ugb24gaW5pdGlsaXNlLCBmb3IgdGhlIGNvbXBvbmVudCB0byB3b3JrIHByb3Blcmx5ICovXG4gIGNvbnN0IGFkZEVkaXRCdG5MaXN0ZW5lciA9ICgpID0+IHtcbiAgICBlZGl0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IGVkaXRMaXN0KGUpKTtcbiAgfTtcblxuICByZXR1cm4geyBvcGVuRWRpdE1vZGFsLCBhZGRFZGl0QnRuTGlzdGVuZXIgfTtcbn0pKCk7XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4tICdEZWxldGUgbGlzdCcgbW9kYWwgbW9kdWxlXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuY29uc3QgZGVsZXRlTGlzdE1vZGFsID0gKCgpID0+IHtcbiAgY29uc3QgbW9kYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZGVsZXRlLWxpc3QtbW9kYWwnKS5wYXJlbnRFbGVtZW50O1xuICBjb25zdCBjYW5jZWxCdG4gPSBtb2RhbC5xdWVyeVNlbGVjdG9yKCcuY2FuY2VsLWJ1dHRvbicpO1xuICBjb25zdCBkZWxldGVCdG4gPSBtb2RhbC5xdWVyeVNlbGVjdG9yKCcuZGVsZXRlLWJ1dHRvbicpO1xuXG4gIGNvbnN0IHNldFByb2plY3REYXRhSW5kZXggPSAocHJvamVjdEluZGV4KSA9PiB7XG4gICAgZGVsZXRlQnRuLmRhdGFzZXQucHJvamVjdEluZGV4ID0gcHJvamVjdEluZGV4O1xuICB9O1xuXG4gIGNvbnN0IG9wZW5EZWxldGVNb2RhbCA9IChwcm9qZWN0SW5kZXgpID0+IHtcbiAgICBzZXRQcm9qZWN0RGF0YUluZGV4KHByb2plY3RJbmRleCk7XG4gICAgdG9nZ2xlSGlkZGVuKG1vZGFsKTtcbiAgfTtcblxuICBjb25zdCBkZWxldGVMaXN0ID0gKCkgPT4ge1xuICAgIGNvbnN0IGluZGV4ID0gTnVtYmVyKGRlbGV0ZUJ0bi5kYXRhc2V0LnByb2plY3RJbmRleCk7XG4gICAgcHJvamVjdE1hbmFnZXIuZGVsZXRlUHJvamVjdChpbmRleCk7XG4gICAgbmF2YmFyLnJlbmRlckRlbGV0ZWRMaXN0KGluZGV4KTtcbiAgICB0b2dnbGVIaWRkZW4obW9kYWwpO1xuICB9O1xuXG4gIC8qIEZ1bmN0aW9uIHRvIGludm9rZSBvbiBpbml0aWxpc2UsIGZvciB0aGUgY29tcG9uZW50IHRvIHdvcmsgcHJvcGVybHkgKi9cbiAgY29uc3QgYWRkQ2FuY2VsQnRuTGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgY2FuY2VsQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gdG9nZ2xlSGlkZGVuKG1vZGFsKSk7XG4gIH07XG5cbiAgY29uc3QgYWRkRGVsZXRlQnRuTGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgZGVsZXRlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZGVsZXRlTGlzdCk7XG4gIH07XG5cbiAgcmV0dXJuIHsgb3BlbkRlbGV0ZU1vZGFsLCBhZGRDYW5jZWxCdG5MaXN0ZW5lciwgYWRkRGVsZXRlQnRuTGlzdGVuZXIgfTtcbn0pKCk7XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4tICdOZXcgdGFzaycgbW9kYWwgbW9kdWxlXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuY29uc3QgbmV3VGFza01vZGFsID0gKCgpID0+IHtcbiAgY29uc3QgbW9kYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmV3LXRhc2stbW9kYWwnKS5wYXJlbnRFbGVtZW50O1xuICBjb25zdCBuZXdUYXNrQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25ldy10YXNrLXN1Ym1pdC1idXR0b24nKTtcblxuICBjb25zdCBzZXRQcm9qZWN0RGF0YUluZGV4ID0gKHByb2plY3RJbmRleCkgPT4ge1xuICAgIG5ld1Rhc2tCdG4uZGF0YXNldC5wcm9qZWN0SW5kZXggPSBwcm9qZWN0SW5kZXg7XG4gIH07XG5cbiAgY29uc3Qgb3Blbk5ld1Rhc2tNb2RhbCA9IChwcm9qZWN0SW5kZXgpID0+IHtcbiAgICBzZXRQcm9qZWN0RGF0YUluZGV4KHByb2plY3RJbmRleCk7XG4gICAgdG9nZ2xlSGlkZGVuKG1vZGFsKTtcbiAgfTtcblxuICByZXR1cm4geyBvcGVuTmV3VGFza01vZGFsIH07XG59KSgpO1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLSBJbml0aWFsaXNlciBmdW5jdGlvblxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbmNvbnN0IGluaXRpYWxpc2VVSSA9ICgpID0+IHtcbiAgaGVhZGVyLmFkZEhlYWRlckxpc3RlbmVycygpO1xuXG4gIG5hdmJhci5yZW5kZXJDdXJyZW50TGlzdHMoKTtcbiAgbmF2YmFyLnNldEluYm94UHJvamVjdEluZGV4KCk7XG4gIG5hdmJhci5hZGROZXdMaXN0QnRuTGlzdGVuZXIoKTtcblxuICBtYWluLmluaXQoKTtcblxuICBhbGxNb2RhbHMuYWRkQ2xvc2VCdG5MaXN0ZW5lcnMoKTtcbiAgYWxsTW9kYWxzLmFkZENsb3NlQmFja2dyb3VuZExpc3RlbmVycygpO1xuXG4gIG5ld0xpc3RNb2RhbC5hZGRTdWJtaXRCdG5MaXN0ZW5lcigpO1xuICBlZGl0TGlzdE1vZGFsLmFkZEVkaXRCdG5MaXN0ZW5lcigpO1xuICBkZWxldGVMaXN0TW9kYWwuYWRkQ2FuY2VsQnRuTGlzdGVuZXIoKTtcbiAgZGVsZXRlTGlzdE1vZGFsLmFkZERlbGV0ZUJ0bkxpc3RlbmVyKCk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBpbml0aWFsaXNlVUk7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IHByb2plY3RNYW5hZ2VyIH0gZnJvbSAnLi90b0RvTGlzdCc7XG5pbXBvcnQgaW5pdGlhbGlzZVVJIGZyb20gJy4vdWknO1xuXG5wcm9qZWN0TWFuYWdlci5pbml0aWFsaXNlKCk7XG5pbml0aWFsaXNlVUkoKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==