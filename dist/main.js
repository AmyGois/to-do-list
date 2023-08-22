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

  const revealProjectTasksLength = (projectIndex) => {
    const tasksLength = projects[projectIndex].tasks.length;
    return tasksLength;
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
    revealProjectTasksLength,
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

  - 'New task' modal module

  -- Steps component module

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
  /* Header section */
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

  /* Tasks section */
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
    const selectOption = modal.querySelector('option');
    if (inputs) {
      inputs.forEach((input) => {
        input.value = '';
      });
    }
    if (textareas) {
      textareas.forEach((textarea) => {
        textarea.value = '';
      });
    }
    if (selectOption) {
      selectOption.selected = true;
    }
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

  /* Functions to invoke on initilise, for the component to work properly */
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
  const stepsList = modal.querySelector('.modal-steps-list');

  const setProjectDataIndex = (projectIndex) => {
    newTaskBtn.dataset.projectIndex = projectIndex;
  };

  const openNewTaskModal = (projectIndex) => {
    setProjectDataIndex(projectIndex);
    stepsComponent.clearAllSteps(stepsList);
    toggleHidden(modal);
  };

  const submitNewTask = (e) => {
    const projectIndex = Number(newTaskBtn.dataset.projectIndex);
    const newTitle = document.getElementById('new-task-name').value;
    const newDescription = document.getElementById(
      'new-task-description',
    ).value;
    const newDate = document.getElementById('new-task-date').value;
    const newPriority = document.getElementById('new-task-priority').value;
    const newSteps = stepsComponent.revealSteps();

    if (newTitle !== '') {
      e.preventDefault();
      _toDoList__WEBPACK_IMPORTED_MODULE_0__.taskManager.createNewTask(
        projectIndex,
        newTitle,
        newDescription,
        newDate,
        newPriority,
        'to do',
      );
      const length = _toDoList__WEBPACK_IMPORTED_MODULE_0__.projectManager.revealProjectTasksLength(projectIndex);
      newSteps.forEach((step) => {
        _toDoList__WEBPACK_IMPORTED_MODULE_0__.stepManager.createNewStep(
          projectIndex,
          length - 1,
          step.description,
          step.status,
        );
      });
      /* Swap console-log for function to render task */
      console.log(_toDoList__WEBPACK_IMPORTED_MODULE_0__.taskManager.revealTask(projectIndex, length - 1));
      allModals.closeModal(modal);
    }
  };

  /* Functions to invoke on initilise, for the component to work properly */
  const addNewTaskBtnLIstener = () => {
    newTaskBtn.addEventListener('click', (e) => submitNewTask(e));
  };

  return { openNewTaskModal, addNewTaskBtnLIstener };
})();

/* **************************************************************
- Steps component module
************************************************************** */
const stepsComponent = (() => {
  const newStepBtns = document.querySelectorAll('.add-step-button');
  let modal;
  let stepsList;
  let newStepBtn;
  const steps = [];

  const clearAllSteps = (ul) => {
    const ulToClear = ul;
    steps.length = 0;
    ulToClear.innerHTML = '';
  };

  const revealSteps = () => steps;

  const renderStep = (listItem, step, index) => {
    const checkbox = document.createElement('input');
    const label = document.createElement('label');
    const editStepBtn = document.createElement('button');
    const editStepImg = document.createElement('img');
    const deleteStepBtn = document.createElement('button');
    const deleteStepImg = document.createElement('img');

    checkbox.setAttribute('type', 'checkbox');
    checkbox.setAttribute('name', `step-status-${index}`);
    checkbox.setAttribute('id', `step-status-${index}`);
    checkbox.dataset.stepIndex = index;
    if (step.status === 'done') {
      checkbox.checked = true;
    }
    label.setAttribute('for', `step-status-${index}`);
    label.textContent = step.description;
    editStepBtn.classList.add('steps-list-item-button');
    editStepBtn.dataset.stepIndex = index;
    editStepImg.setAttribute('src', './icons/edit.svg');
    editStepImg.setAttribute('alt', 'edit step button');
    deleteStepBtn.classList.add('steps-list-item-button');
    deleteStepBtn.dataset.stepIndex = index;
    deleteStepImg.setAttribute('src', './icons/delete.svg');
    deleteStepImg.setAttribute('alt', 'delete step button');

    checkbox.addEventListener('change', () =>
      updateStepStatus(checkbox.checked, Number(checkbox.dataset.stepIndex)),
    );
    editStepBtn.addEventListener('click', (ev) =>
      renderEditStep(ev, editStepBtn.dataset.stepIndex),
    );
    deleteStepBtn.addEventListener('click', (ev) =>
      deleteStep(ev, deleteStepBtn.dataset.stepIndex),
    );

    listItem.appendChild(checkbox);
    listItem.appendChild(label);
    listItem.appendChild(editStepBtn);
    editStepBtn.appendChild(editStepImg);
    listItem.appendChild(deleteStepBtn);
    deleteStepBtn.appendChild(deleteStepImg);
  };

  const updateStepIdices = () => {
    const allSteps = stepsList.children;
    let index = 0;
    for (const listItem of allSteps) {
      const checkbox = listItem.querySelector('input');
      const label = listItem.querySelector('label');
      const buttons = listItem.querySelectorAll('.steps-list-item-button');

      checkbox.setAttribute('name', `step-status-${index}`);
      checkbox.setAttribute('id', `step-status-${index}`);
      checkbox.dataset.stepIndex = index;
      label.setAttribute('for', `step-status-${index}`);
      buttons.forEach((button) => {
        button.dataset.stepIndex = index;
      });
      index += 1;
    }
  };

  const updateStepStatus = (newStatus, index) => {
    if (newStatus === true) {
      steps[index].status = 'done';
    } else if (newStatus === false) {
      steps[index].status = 'to do';
    }
  };

  const editStep = (e, stepIndex, editedStepValue) => {
    const stepToEdit = e.target.closest('li');
    const input = stepToEdit.querySelector('input');
    const submitStepBtn = input.nextElementSibling;
    const editStepBtn = document.createElement('button');
    const editStepImg = document.createElement('img');
    const deleteStepBtn = document.createElement('button');
    const deleteStepImg = document.createElement('img');

    if (editedStepValue !== '') {
      e.preventDefault();
      e.stopPropagation();
      steps[stepIndex].description = editedStepValue;
      input.remove();
      submitStepBtn.remove();
      renderStep(stepToEdit, steps[stepIndex], stepIndex);
    }
  };

  const renderEditStep = (ev, index) => {
    const stepIndex = Number(index);
    const stepToEdit = ev.target.closest('li');
    const input = document.createElement('input');
    const submitStepBtn = document.createElement('button');
    const submitImg = document.createElement('img');

    ev.preventDefault();
    ev.stopPropagation();
    stepToEdit.innerHTML = '';

    input.setAttribute('type', 'text');
    input.setAttribute('name', 'modal-edit-step');
    input.setAttribute('id', 'modal-edit-step');
    input.required = true;
    input.value = steps[stepIndex].description;
    submitStepBtn.textContent = 'Alter step';
    submitImg.setAttribute('src', './icons/confirm.svg');
    submitImg.setAttribute('alt', 'confirm edit button');

    stepToEdit.appendChild(input);
    stepToEdit.appendChild(submitStepBtn);
    submitStepBtn.appendChild(submitImg);

    submitStepBtn.addEventListener('click', (e) =>
      editStep(e, stepIndex, input.value),
    );
  };

  const deleteStep = (ev, index) => {
    const stepIndex = Number(index);
    const stepToDelete = ev.target.closest('li');

    ev.preventDefault();
    ev.stopPropagation();
    steps.splice(stepIndex, 1);
    stepToDelete.remove();
    updateStepIdices();
  };

  const addStep = (evt) => {
    const newStepDescription = document.getElementById('modal-add-step');
    const stepCreator = document.getElementById('modal-add-step').parentElement;
    const stepsList = document.querySelector('.modal-steps-list');

    evt.preventDefault();
    evt.stopPropagation();
    if (newStepDescription.value !== '') {
      const step = {
        description: newStepDescription.value,
        status: 'to do',
      };
      const listItem = document.createElement('li');

      steps.push(step);
      stepsList.appendChild(listItem);
      renderStep(listItem, steps[steps.length - 1], steps.length - 1);
    }
    toggleHidden(newStepBtn);
    stepCreator.remove();
  };

  const renderCreateStep = (e) => {
    const listItem = document.createElement('li');
    const input = document.createElement('input');
    const submitStepBtn = document.createElement('button');
    const submitImg = document.createElement('img');

    e.preventDefault();
    input.setAttribute('type', 'text');
    input.setAttribute('name', 'modal-add-step');
    input.setAttribute('id', 'modal-add-step');
    submitStepBtn.textContent = 'Add step';
    submitImg.setAttribute('src', './icons/confirm.svg');
    submitImg.setAttribute('alt', 'confirm step button');

    submitStepBtn.appendChild(submitImg);
    listItem.appendChild(input);
    listItem.appendChild(submitStepBtn);
    stepsList.appendChild(listItem);

    submitStepBtn.addEventListener('click', (evt) => addStep(evt));
    toggleHidden(newStepBtn);
  };

  /* Function to invoke on initilise, for the component to work properly */
  const addNewStepBtnListeners = () => {
    newStepBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        if (e.target.closest('.new-task-modal')) {
          modal = e.target.closest('.new-task-modal').parentElement;
        } else if (e.target.closest('edit-task-modal')) {
          modal = e.target.closest('edit-task-modal').parentElement;
        }
        stepsList = modal.querySelector('.modal-steps-list');
        newStepBtn = modal.querySelector('.add-step-button');
        renderCreateStep(e);
      });
    });
  };

  return { clearAllSteps, revealSteps, addNewStepBtnListeners };
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
  newTaskModal.addNewTaskBtnLIstener();

  stepsComponent.addNewStepBtnListeners();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsV0FBVztBQUNYLENBQUM7O0FBRUQsaUVBQWUsY0FBYyxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNuQjlCOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDdUM7O0FBRXZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEVBQUUsZ0RBQWM7QUFDaEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwyQkFBMkIsZ0RBQWM7QUFDekM7QUFDQTtBQUNBLE1BQU07QUFDTixzQkFBc0IsMkJBQTJCO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFbUQ7Ozs7Ozs7Ozs7Ozs7Ozs7QUNoV3BEOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ3NFOztBQUV0RTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsV0FBVztBQUNYLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDBCQUEwQixXQUFXO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGtCQUFrQixxREFBYztBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBLHlCQUF5QixxREFBYztBQUN2QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBLFdBQVc7QUFDWCxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsc0JBQXNCLHFEQUFjO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxXQUFXO0FBQ1gsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQixxREFBYzs7QUFFeEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFNLHFEQUFjO0FBQ3BCLE1BQU0scURBQWM7QUFDcEIscUNBQXFDLHFEQUFjO0FBQ25EO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxXQUFXO0FBQ1gsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLElBQUkscURBQWM7QUFDbEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxXQUFXO0FBQ1gsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQU0sa0RBQVc7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIscURBQWM7QUFDbkM7QUFDQSxRQUFRLGtEQUFXO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxrQkFBa0Isa0RBQVc7QUFDN0I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFdBQVc7QUFDWCxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaURBQWlELE1BQU07QUFDdkQsK0NBQStDLE1BQU07QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2Q0FBNkMsTUFBTTtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG1EQUFtRCxNQUFNO0FBQ3pELGlEQUFpRCxNQUFNO0FBQ3ZEO0FBQ0EsK0NBQStDLE1BQU07QUFDckQ7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7O0FBRUEsV0FBVztBQUNYLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsaUVBQWUsWUFBWSxFQUFDOzs7Ozs7O1VDcHJCNUI7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7QUNONEM7QUFDWjs7QUFFaEMscURBQWM7QUFDZCwrQ0FBWSIsInNvdXJjZXMiOlsid2VicGFjazovL3RvLWRvLWxpc3QvLi9zcmMvc3RvcmFnZS5qcyIsIndlYnBhY2s6Ly90by1kby1saXN0Ly4vc3JjL3RvRG9MaXN0LmpzIiwid2VicGFjazovL3RvLWRvLWxpc3QvLi9zcmMvdWkuanMiLCJ3ZWJwYWNrOi8vdG8tZG8tbGlzdC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90by1kby1saXN0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly90by1kby1saXN0L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vdG8tZG8tbGlzdC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3RvLWRvLWxpc3QvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3Qgc3RvcmFnZU1hbmFnZXIgPSAoKCkgPT4ge1xuICAvKiBJbml0aWFsIGZ1bmN0aW9uIHRvIGdldCBhbnl0aGluZyBzYXZlZCBpbiBsb2NhbFN0b3JhZ2UgKi9cbiAgY29uc3QgZ2V0U3RvcmFnZSA9ICgpID0+IHtcbiAgICBsZXQgdG9Eb0xpc3QgPSBbXTtcbiAgICBpZiAobG9jYWxTdG9yYWdlLnRvRG9MaXN0KSB7XG4gICAgICB0b0RvTGlzdCA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3RvRG9MaXN0JykpO1xuICAgIH1cblxuICAgIHJldHVybiB0b0RvTGlzdDtcbiAgfTtcblxuICBjb25zdCBzZXRTdG9yYWdlID0gKHByb2plY3RzKSA9PiB7XG4gICAgY29uc3QgdG9Eb0xpc3QgPSBKU09OLnN0cmluZ2lmeShwcm9qZWN0cyk7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3RvRG9MaXN0JywgdG9Eb0xpc3QpO1xuICB9O1xuXG4gIHJldHVybiB7IGdldFN0b3JhZ2UsIHNldFN0b3JhZ2UgfTtcbn0pKCk7XG5cbmV4cG9ydCBkZWZhdWx0IHN0b3JhZ2VNYW5hZ2VyO1xuIiwiLyogQ29udGVudHM6XG5cbiAgLSBDb25zdHJ1Y3RvcnMgLSBUYXNrLCBTdGVwICYgUHJvamVjdFxuXG4gIC0gRnVuY3Rpb25zIHRvIGRlZXAgY2xvbmUgYXJyYXlzICYgb2JqZWN0cywgJiB1cGRhdGUgbG9jYWwgc3RvcmFnZVxuXG4gIC0gUHJvamVjdCBNYW5hZ2VyXG5cbiAgLSBUYXNrIE1hbmFnZXJcblxuICAtIFN0ZXAgTWFuYWdlclxuKi9cbmltcG9ydCBzdG9yYWdlTWFuYWdlciBmcm9tICcuL3N0b3JhZ2UnO1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLSBDb25zdHJ1Y3RvcnMgLSBUYXNrLCBTdGVwICYgUHJvamVjdFxuICAtIFN0ZXAgZ29lcyBpbnNpZGUgVGFzay5zdGVwc1tdXG4gIC0gVGFzayBnb2VzIGluc2lkZSBQcm9qZWN0LnRhc2tzW11cbiAgLSBQcm9qZWN0IGdvZXMgaW5zaWRlIHByb2plY3RzW11cbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5jbGFzcyBUYXNrIHtcbiAgY29uc3RydWN0b3IodGl0bGUsIGRlc2NyaXB0aW9uLCBkdWVEYXRlLCBwcmlvcml0eSwgc3RhdHVzKSB7XG4gICAgdGhpcy50aXRsZSA9IHRpdGxlO1xuICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcbiAgICB0aGlzLnN0ZXBzID0gW107XG4gICAgdGhpcy5kdWVEYXRlID0gZHVlRGF0ZTtcbiAgICB0aGlzLnByaW9yaXR5ID0gcHJpb3JpdHk7XG4gICAgdGhpcy5zdGF0dXMgPSBzdGF0dXM7XG4gIH1cbn1cblxuY2xhc3MgU3RlcCB7XG4gIGNvbnN0cnVjdG9yKGRlc2NyaXB0aW9uLCBzdGF0dXMpIHtcbiAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XG4gICAgdGhpcy5zdGF0dXMgPSBzdGF0dXM7XG4gIH1cbn1cblxuY2xhc3MgUHJvamVjdCB7XG4gIGNvbnN0cnVjdG9yKHRpdGxlLCBkZXNjcmlwdGlvbikge1xuICAgIHRoaXMudGl0bGUgPSB0aXRsZTtcbiAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XG4gICAgdGhpcy50YXNrcyA9IFtdO1xuICB9XG59XG5cbmNvbnN0IHByb2plY3RzID0gW107XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4tIEZ1bmN0aW9ucyB0byBkZWVwIGNsb25lIGFycmF5cyAmIG9iamVjdHMsICYgdXBkYXRlIGxvY2FsIHN0b3JhZ2VcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5jb25zdCBkZWVwQ29weUFycmF5ID0gKGFycmF5KSA9PiB7XG4gIGNvbnN0IGFycmF5Q29weSA9IFtdO1xuICBhcnJheS5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoaXRlbSkpIHtcbiAgICAgIGFycmF5Q29weS5wdXNoKGRlZXBDb3B5QXJyYXkoaXRlbSkpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGl0ZW0gPT09ICdvYmplY3QnKSB7XG4gICAgICBhcnJheUNvcHkucHVzaChkZWVwQ29weU9iamVjdChpdGVtKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFycmF5Q29weS5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBhcnJheUNvcHk7XG59O1xuXG5jb25zdCBkZWVwQ29weU9iamVjdCA9IChvYmplY3QpID0+IHtcbiAgY29uc3Qgb2JqZWN0Q29weSA9IHt9O1xuICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhvYmplY3QpKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICBvYmplY3RDb3B5W2tleV0gPSBkZWVwQ29weUFycmF5KHZhbHVlKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIG9iamVjdENvcHlba2V5XSA9IGRlZXBDb3B5T2JqZWN0KHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb2JqZWN0Q29weVtrZXldID0gdmFsdWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBvYmplY3RDb3B5O1xufTtcblxuY29uc3Qgc2V0U3RvcmFnZSA9ICgpID0+IHtcbiAgY29uc3QgcHJvamVjdHNDb3B5ID0gZGVlcENvcHlBcnJheShwcm9qZWN0cyk7XG4gIHN0b3JhZ2VNYW5hZ2VyLnNldFN0b3JhZ2UocHJvamVjdHNDb3B5KTtcbn07XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4tIFByb2plY3QgTWFuYWdlclxuICAtIENyZWF0ZSBhIHNhZmUgY29weSBvZiBhIHByb2plY3QgJiBvZiB0aGUgcHJvamVjdHMgYXJyYXkgZm9yIHB1YmxpYyB1c2VcbiAgLSBDcmVhdGUgJiBkZWxldGUgcHJvamVjdHNcbiAgLSBFZGl0IHByb2plY3QgdGl0bGVzICYgZGVzY3JpcHRpb25zXG4gIC0gSW5pdGlhbGlzZSBieSBjaGVja2luZyBmb3IgbG9jYWxseSBzdG9yZWQgcHJvamVjdHNcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5jb25zdCBwcm9qZWN0TWFuYWdlciA9ICgoKSA9PiB7XG4gIGNvbnN0IHJldmVhbFByb2plY3QgPSAocHJvamVjdEluZGV4KSA9PiB7XG4gICAgY29uc3QgcHJvamVjdENvcHkgPSBkZWVwQ29weU9iamVjdChwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0pO1xuXG4gICAgcmV0dXJuIHByb2plY3RDb3B5O1xuICB9O1xuXG4gIGNvbnN0IHJldmVhbFByb2plY3RUYXNrc0xlbmd0aCA9IChwcm9qZWN0SW5kZXgpID0+IHtcbiAgICBjb25zdCB0YXNrc0xlbmd0aCA9IHByb2plY3RzW3Byb2plY3RJbmRleF0udGFza3MubGVuZ3RoO1xuICAgIHJldHVybiB0YXNrc0xlbmd0aDtcbiAgfTtcblxuICBjb25zdCByZXZlYWxBbGxQcm9qZWN0cyA9ICgpID0+IHtcbiAgICBjb25zdCBwcm9qZWN0c0NvcHkgPSBkZWVwQ29weUFycmF5KHByb2plY3RzKTtcblxuICAgIHJldHVybiBwcm9qZWN0c0NvcHk7XG4gIH07XG5cbiAgY29uc3QgY3JlYXRlTmV3UHJvamVjdCA9ICh0aXRsZSwgZGVzY3JpcHRpb24pID0+IHtcbiAgICBjb25zdCBuZXdQcm9qZWN0ID0gbmV3IFByb2plY3QodGl0bGUsIGRlc2NyaXB0aW9uKTtcbiAgICBwcm9qZWN0cy5wdXNoKG5ld1Byb2plY3QpO1xuXG4gICAgc2V0U3RvcmFnZSgpO1xuICAgIHJldHVybiByZXZlYWxQcm9qZWN0KHByb2plY3RzLmxlbmd0aCAtIDEpO1xuICB9O1xuXG4gIGNvbnN0IGRlbGV0ZVByb2plY3QgPSAocHJvamVjdEluZGV4KSA9PiB7XG4gICAgY29uc3QgaW5kZXggPSBOdW1iZXIocHJvamVjdEluZGV4KTtcbiAgICBwcm9qZWN0cy5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gICAgc2V0U3RvcmFnZSgpO1xuICAgIHJldHVybiByZXZlYWxBbGxQcm9qZWN0cygpO1xuICB9O1xuXG4gIC8qIE1pZ2h0IG5vdCBuZWVkIHRoaXMgKi9cbiAgY29uc3QgZGVsZXRlUHJvamVjdEJ5TmFtZSA9IChwcm9qZWN0VGl0bGUpID0+IHtcbiAgICBwcm9qZWN0cy5mb3JFYWNoKChwcm9qZWN0KSA9PiB7XG4gICAgICBpZiAocHJvamVjdC50aXRsZSA9PT0gcHJvamVjdFRpdGxlKSB7XG4gICAgICAgIHByb2plY3RzLnNwbGljZShwcm9qZWN0cy5pbmRleE9mKHByb2plY3QpLCAxKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHNldFN0b3JhZ2UoKTtcbiAgICByZXR1cm4gcmV2ZWFsQWxsUHJvamVjdHMoKTtcbiAgfTtcblxuICBjb25zdCBlZGl0UHJvamVjdFRpdGxlID0gKHByb2plY3RJbmRleCwgbmV3VGl0bGUpID0+IHtcbiAgICBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0udGl0bGUgPSBuZXdUaXRsZTtcblxuICAgIHNldFN0b3JhZ2UoKTtcbiAgICByZXR1cm4gcmV2ZWFsUHJvamVjdChOdW1iZXIocHJvamVjdEluZGV4KSk7XG4gIH07XG5cbiAgY29uc3QgZWRpdFByb2plY3REZXNjcmlwdGlvbiA9IChwcm9qZWN0SW5kZXgsIG5ld0Rlc2NyaXB0aW9uKSA9PiB7XG4gICAgcHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldLmRlc2NyaXB0aW9uID0gbmV3RGVzY3JpcHRpb247XG5cbiAgICBzZXRTdG9yYWdlKCk7XG4gICAgcmV0dXJuIHJldmVhbFByb2plY3QoTnVtYmVyKHByb2plY3RJbmRleCkpO1xuICB9O1xuXG4gIC8qIFRoaXMgc2hvdWxkIGJlIHVzZWQgYXQgdGhlIGJlZ2dpbmluZyBvZiB0aGUgY29kZSB0byBzdGFydCB0aGUgYXBwIHByb3Blcmx5ICovXG4gIGNvbnN0IGluaXRpYWxpc2UgPSAoKSA9PiB7XG4gICAgY29uc3Qgc3RvcmVkUHJvamVjdHMgPSBzdG9yYWdlTWFuYWdlci5nZXRTdG9yYWdlKCk7XG4gICAgaWYgKHN0b3JlZFByb2plY3RzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgY3JlYXRlTmV3UHJvamVjdCgnSW5ib3gnLCAnJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RvcmVkUHJvamVjdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcHJvamVjdHMucHVzaChzdG9yZWRQcm9qZWN0c1tpXSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXZlYWxBbGxQcm9qZWN0cygpO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgcmV2ZWFsUHJvamVjdCxcbiAgICByZXZlYWxQcm9qZWN0VGFza3NMZW5ndGgsXG4gICAgcmV2ZWFsQWxsUHJvamVjdHMsXG4gICAgY3JlYXRlTmV3UHJvamVjdCxcbiAgICBkZWxldGVQcm9qZWN0LFxuICAgIGRlbGV0ZVByb2plY3RCeU5hbWUsXG4gICAgZWRpdFByb2plY3RUaXRsZSxcbiAgICBlZGl0UHJvamVjdERlc2NyaXB0aW9uLFxuICAgIGluaXRpYWxpc2UsXG4gIH07XG59KSgpO1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLSBUYXNrIE1hbmFnZXJcbiAgLSBDcmVhdGUgYSBzYWZlIGNvcHkgb2YgYSBzaW5nbGUgdGFzayBmb3IgcHVibGljIHVzZVxuICAtIENyZWF0ZSAmIGRlbGV0ZSB0YXNrcyBpbiBhIHByb2plY3RcbiAgLSBFZGl0IHRhc2sgdGl0bGUsIGRlc2NyaXB0aW9uLCBkdWUgZGF0ZSwgcHJpb3JpdHkgJiBzdGF0dXNcbiAgLSBTdWJzY3JpYmUgdG8gbWVkaWF0b3IgZXZlbnRzXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuY29uc3QgdGFza01hbmFnZXIgPSAoKCkgPT4ge1xuICBjb25zdCByZXZlYWxUYXNrID0gKHByb2plY3RJbmRleCwgdGFza0luZGV4KSA9PiB7XG4gICAgY29uc3QgdGFza0NvcHkgPSBkZWVwQ29weU9iamVjdChcbiAgICAgIHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXS50YXNrc1tOdW1iZXIodGFza0luZGV4KV0sXG4gICAgKTtcblxuICAgIHJldHVybiB0YXNrQ29weTtcbiAgfTtcblxuICBjb25zdCBjcmVhdGVOZXdUYXNrID0gKFxuICAgIHByb2plY3RJbmRleCxcbiAgICB0aXRsZSxcbiAgICBkZXNjcmlwdGlvbixcbiAgICBkdWVEYXRlLFxuICAgIHByaW9yaXR5LFxuICAgIHN0YXR1cyxcbiAgKSA9PiB7XG4gICAgY29uc3QgcHJvamVjdCA9IHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXTtcbiAgICBwcm9qZWN0LnRhc2tzLnB1c2gobmV3IFRhc2sodGl0bGUsIGRlc2NyaXB0aW9uLCBkdWVEYXRlLCBwcmlvcml0eSwgc3RhdHVzKSk7XG5cbiAgICBzZXRTdG9yYWdlKCk7XG4gICAgcmV0dXJuIHJldmVhbFRhc2soTnVtYmVyKHByb2plY3RJbmRleCksIHByb2plY3QudGFza3MubGVuZ3RoIC0gMSk7XG4gIH07XG5cbiAgY29uc3QgZGVsZXRlVGFzayA9IChwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCkgPT4ge1xuICAgIGNvbnN0IHByb2plY3QgPSBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV07XG4gICAgY29uc3QgaW5kZXggPSBOdW1iZXIodGFza0luZGV4KTtcbiAgICBwcm9qZWN0LnRhc2tzLnNwbGljZShpbmRleCwgMSk7XG5cbiAgICBzZXRTdG9yYWdlKCk7XG4gICAgcmV0dXJuIHByb2plY3RNYW5hZ2VyLnJldmVhbFByb2plY3QoTnVtYmVyKHByb2plY3RJbmRleCkpO1xuICB9O1xuXG4gIGNvbnN0IGVkaXRUYXNrVGl0bGUgPSAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgsIG5ld1RpdGxlKSA9PiB7XG4gICAgY29uc3QgdGFzayA9IHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXS50YXNrc1tOdW1iZXIodGFza0luZGV4KV07XG4gICAgdGFzay50aXRsZSA9IG5ld1RpdGxlO1xuXG4gICAgc2V0U3RvcmFnZSgpO1xuICAgIHJldHVybiByZXZlYWxUYXNrKE51bWJlcihwcm9qZWN0SW5kZXgpLCBOdW1iZXIodGFza0luZGV4KSk7XG4gIH07XG5cbiAgY29uc3QgZWRpdFRhc2tEZXNjcmlwdGlvbiA9IChwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCwgbmV3RGVzY3JpcHRpb24pID0+IHtcbiAgICBjb25zdCB0YXNrID0gcHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldLnRhc2tzW051bWJlcih0YXNrSW5kZXgpXTtcbiAgICB0YXNrLmRlc2NyaXB0aW9uID0gbmV3RGVzY3JpcHRpb247XG5cbiAgICBzZXRTdG9yYWdlKCk7XG4gICAgcmV0dXJuIHJldmVhbFRhc2soTnVtYmVyKHByb2plY3RJbmRleCksIE51bWJlcih0YXNrSW5kZXgpKTtcbiAgfTtcblxuICBjb25zdCBlZGl0VGFza0R1ZURhdGUgPSAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgsIG5ld0R1ZURhdGUpID0+IHtcbiAgICBjb25zdCB0YXNrID0gcHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldLnRhc2tzW051bWJlcih0YXNrSW5kZXgpXTtcbiAgICB0YXNrLmR1ZURhdGUgPSBuZXdEdWVEYXRlO1xuXG4gICAgc2V0U3RvcmFnZSgpO1xuICAgIHJldHVybiByZXZlYWxUYXNrKE51bWJlcihwcm9qZWN0SW5kZXgpLCBOdW1iZXIodGFza0luZGV4KSk7XG4gIH07XG5cbiAgY29uc3QgZWRpdFRhc2tQcmlvcml0eSA9IChwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCwgbmV3UHJpb3JpdHkpID0+IHtcbiAgICBjb25zdCB0YXNrID0gcHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldLnRhc2tzW051bWJlcih0YXNrSW5kZXgpXTtcbiAgICB0YXNrLnByaW9yaXR5ID0gbmV3UHJpb3JpdHk7XG5cbiAgICBzZXRTdG9yYWdlKCk7XG4gICAgcmV0dXJuIHJldmVhbFRhc2soTnVtYmVyKHByb2plY3RJbmRleCksIE51bWJlcih0YXNrSW5kZXgpKTtcbiAgfTtcblxuICBjb25zdCBlZGl0VGFza1N0YXR1cyA9IChwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCwgbmV3U3RhdHVzKSA9PiB7XG4gICAgY29uc3QgdGFzayA9IHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXS50YXNrc1tOdW1iZXIodGFza0luZGV4KV07XG4gICAgdGFzay5zdGF0dXMgPSBuZXdTdGF0dXM7XG5cbiAgICBzZXRTdG9yYWdlKCk7XG4gICAgcmV0dXJuIHJldmVhbFRhc2soTnVtYmVyKHByb2plY3RJbmRleCksIE51bWJlcih0YXNrSW5kZXgpKTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIHJldmVhbFRhc2ssXG4gICAgY3JlYXRlTmV3VGFzayxcbiAgICBkZWxldGVUYXNrLFxuICAgIGVkaXRUYXNrVGl0bGUsXG4gICAgZWRpdFRhc2tEZXNjcmlwdGlvbixcbiAgICBlZGl0VGFza0R1ZURhdGUsXG4gICAgZWRpdFRhc2tQcmlvcml0eSxcbiAgICBlZGl0VGFza1N0YXR1cyxcbiAgfTtcbn0pKCk7XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4tIFN0ZXAgTWFuYWdlclxuICAtIENyZWF0ZSAmIGRlbGV0ZSBzdGVwcyBpbiBhIHRhc2tcbiAgLSBFZGl0IHN0ZXAgZGVzY3JpcHRpb24gJiBzdGF0dXNcbiAgLSBDcmVhdGUgYSBzZmUgY29weSBvZiBhIHNpbmdsZSBzdGVwIGZvciBwdWJsaWMgdXNlXG4gIC0gU3Vic2NyaWJlIHRvIG1lZGlhdG9yIGV2ZW50c1xuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbmNvbnN0IHN0ZXBNYW5hZ2VyID0gKCgpID0+IHtcbiAgY29uc3QgcmV2ZWFsU3RlcCA9IChwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCwgc3RlcEluZGV4KSA9PiB7XG4gICAgY29uc3Qgc3RlcENvcHkgPSBkZWVwQ29weU9iamVjdChcbiAgICAgIHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXS50YXNrc1tOdW1iZXIodGFza0luZGV4KV0uc3RlcHNbXG4gICAgICAgIE51bWJlcihzdGVwSW5kZXgpXG4gICAgICBdLFxuICAgICk7XG5cbiAgICByZXR1cm4gc3RlcENvcHk7XG4gIH07XG5cbiAgY29uc3QgY3JlYXRlTmV3U3RlcCA9IChwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCwgZGVzY3JpcHRpb24sIHN0YXR1cykgPT4ge1xuICAgIGNvbnN0IHRhc2sgPSBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0udGFza3NbTnVtYmVyKHRhc2tJbmRleCldO1xuICAgIHRhc2suc3RlcHMucHVzaChuZXcgU3RlcChkZXNjcmlwdGlvbiwgc3RhdHVzKSk7XG5cbiAgICBzZXRTdG9yYWdlKCk7XG4gICAgcmV0dXJuIHJldmVhbFN0ZXAoXG4gICAgICBOdW1iZXIocHJvamVjdEluZGV4KSxcbiAgICAgIE51bWJlcih0YXNrSW5kZXgpLFxuICAgICAgdGFzay5zdGVwcy5sZW5ndGggLSAxLFxuICAgICk7XG4gIH07XG5cbiAgY29uc3QgZGVsZXRlU3RlcCA9IChwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCwgc3RlcEluZGV4KSA9PiB7XG4gICAgY29uc3QgdGFzayA9IHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXS50YXNrc1tOdW1iZXIodGFza0luZGV4KV07XG4gICAgY29uc3QgaW5kZXggPSBOdW1iZXIoc3RlcEluZGV4KTtcbiAgICB0YXNrLnN0ZXBzLnNwbGljZShpbmRleCwgMSk7XG5cbiAgICBzZXRTdG9yYWdlKCk7XG4gICAgcmV0dXJuIHRhc2tNYW5hZ2VyLnJldmVhbFRhc2soTnVtYmVyKHByb2plY3RJbmRleCksIE51bWJlcih0YXNrSW5kZXgpKTtcbiAgfTtcblxuICBjb25zdCBlZGl0U3RlcERlc2NyaXB0aW9uID0gKFxuICAgIHByb2plY3RJbmRleCxcbiAgICB0YXNrSW5kZXgsXG4gICAgc3RlcEluZGV4LFxuICAgIG5ld0Rlc2NyaXB0aW9uLFxuICApID0+IHtcbiAgICBjb25zdCBzdGVwID1cbiAgICAgIHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXS50YXNrc1tOdW1iZXIodGFza0luZGV4KV0uc3RlcHNbXG4gICAgICAgIE51bWJlcihzdGVwSW5kZXgpXG4gICAgICBdO1xuICAgIHN0ZXAuZGVzY3JpcHRpb24gPSBuZXdEZXNjcmlwdGlvbjtcblxuICAgIHNldFN0b3JhZ2UoKTtcbiAgICByZXR1cm4gcmV2ZWFsU3RlcChcbiAgICAgIE51bWJlcihwcm9qZWN0SW5kZXgpLFxuICAgICAgTnVtYmVyKHRhc2tJbmRleCksXG4gICAgICBOdW1iZXIoc3RlcEluZGV4KSxcbiAgICApO1xuICB9O1xuXG4gIGNvbnN0IGVkaXRTdGVwU3RhdHVzID0gKHByb2plY3RJbmRleCwgdGFza0luZGV4LCBzdGVwSW5kZXgsIG5ld1N0YXR1cykgPT4ge1xuICAgIGNvbnN0IHN0ZXAgPVxuICAgICAgcHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldLnRhc2tzW051bWJlcih0YXNrSW5kZXgpXS5zdGVwc1tcbiAgICAgICAgTnVtYmVyKHN0ZXBJbmRleClcbiAgICAgIF07XG4gICAgc3RlcC5zdGF0dXMgPSBuZXdTdGF0dXM7XG5cbiAgICBzZXRTdG9yYWdlKCk7XG4gICAgcmV0dXJuIHJldmVhbFN0ZXAoXG4gICAgICBOdW1iZXIocHJvamVjdEluZGV4KSxcbiAgICAgIE51bWJlcih0YXNrSW5kZXgpLFxuICAgICAgTnVtYmVyKHN0ZXBJbmRleCksXG4gICAgKTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIHJldmVhbFN0ZXAsXG4gICAgY3JlYXRlTmV3U3RlcCxcbiAgICBkZWxldGVTdGVwLFxuICAgIGVkaXRTdGVwRGVzY3JpcHRpb24sXG4gICAgZWRpdFN0ZXBTdGF0dXMsXG4gIH07XG59KSgpO1xuXG5leHBvcnQgeyBwcm9qZWN0TWFuYWdlciwgdGFza01hbmFnZXIsIHN0ZXBNYW5hZ2VyIH07XG4iLCIvKiBDb250ZW50czpcblxuXHQtIEdlbmVyYWxcblxuXHQtIEhlYWRlciBtb2R1bGVcblxuXHQtIE5hdmJhciBtb2R1bGVcblxuICAtIE1haW4gbW9kdWxlXG5cdFxuXHQtIE1vZHVsZSB0byBjb250cm9sIHRoaW5ncyBjb21tb24gbW9zdCBtb2RhbHNcblxuXHQtICdOZXcgTGlzdCcgbW9kYWwgbW9kdWxlXG5cbiAgLSAnRGVsZXRlIGxpc3QnIG1vZGFsIG1vZHVsZVxuXG4gIC0gJ05ldyB0YXNrJyBtb2RhbCBtb2R1bGVcblxuICAtLSBTdGVwcyBjb21wb25lbnQgbW9kdWxlXG5cblx0LSBJbml0aWFsaXNlciBmdW5jdGlvblxuKi9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4tIEdlbmVyYWxcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5pbXBvcnQgeyBwcm9qZWN0TWFuYWdlciwgdGFza01hbmFnZXIsIHN0ZXBNYW5hZ2VyIH0gZnJvbSAnLi90b0RvTGlzdCc7XG5cbmNvbnN0IHRvZ2dsZUhpZGRlbiA9IChlbGVtZW50KSA9PiB7XG4gIGVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZSgnaGlkZGVuJyk7XG59O1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi0gSGVhZGVyIG1vZHVsZVxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbmNvbnN0IGhlYWRlciA9ICgoKSA9PiB7XG4gIC8qIEZ1bmN0aW9uIHRvIGludm9rZSBvbiBpbml0aWxpc2UsIGZvciB0aGUgY29tcG9uZW50IHRvIHdvcmsgcHJvcGVybHkgKi9cbiAgY29uc3QgYWRkSGVhZGVyTGlzdGVuZXJzID0gKCkgPT4ge1xuICAgIGNvbnN0IHRvZ2dsZU5hdkJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0b2dnbGUtbmF2LWJ1dHRvbicpO1xuICAgIGNvbnN0IHRvZ2dsZUFzaWRlQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RvZ2dsZS1hc2lkZS1idXR0b24nKTtcbiAgICBjb25zdCBuYXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCduYXYnKTtcbiAgICBjb25zdCBhc2lkZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2FzaWRlJyk7XG5cbiAgICB0b2dnbGVOYXZCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB0b2dnbGVIaWRkZW4obmF2KSk7XG4gICAgdG9nZ2xlQXNpZGVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB0b2dnbGVIaWRkZW4oYXNpZGUpKTtcbiAgfTtcblxuICByZXR1cm4geyBhZGRIZWFkZXJMaXN0ZW5lcnMgfTtcbn0pKCk7XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4tIE5hdmJhciBtb2R1bGVcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5jb25zdCBuYXZiYXIgPSAoKCkgPT4ge1xuICBjb25zdCBzZXRQcm9qZWN0RGF0YUluZGV4ID0gKGVsZW1lbnQsIGluZGV4KSA9PiB7XG4gICAgZWxlbWVudC5kYXRhc2V0LnByb2plY3RJbmRleCA9IGluZGV4O1xuICB9O1xuXG4gIGNvbnN0IGNhbGN1bGF0ZU5ld1Byb2plY3RJbmRleCA9ICgpID0+IHtcbiAgICBjb25zdCBsaXN0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduYXYtdG9kby1saXN0cycpLmNoaWxkcmVuO1xuICAgIGNvbnN0IG5ld0luZGV4ID0gbGlzdHMubGVuZ3RoICsgMTtcbiAgICByZXR1cm4gbmV3SW5kZXg7XG4gIH07XG5cbiAgY29uc3QgdXBkYXRlQWxsUHJvamVjdEluZGljZXMgPSAoKSA9PiB7XG4gICAgY29uc3QgY3VycmVudExpc3RzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25hdi10b2RvLWxpc3RzJykuY2hpbGRyZW47XG4gICAgbGV0IHVwZGF0ZWRJbmRleCA9IDE7XG4gICAgZm9yIChjb25zdCBsaXN0IG9mIGN1cnJlbnRMaXN0cykge1xuICAgICAgY29uc3QgbGluayA9IGxpc3QucXVlcnlTZWxlY3RvcignYScpO1xuICAgICAgY29uc3QgYnV0dG9ucyA9IGxpc3QucXVlcnlTZWxlY3RvckFsbCgnYnV0dG9uJyk7XG4gICAgICBsaW5rLmRhdGFzZXQucHJvamVjdEluZGV4ID0gdXBkYXRlZEluZGV4O1xuICAgICAgYnV0dG9ucy5mb3JFYWNoKChidXR0b24pID0+IHtcbiAgICAgICAgYnV0dG9uLmRhdGFzZXQucHJvamVjdEluZGV4ID0gdXBkYXRlZEluZGV4O1xuICAgICAgfSk7XG4gICAgICB1cGRhdGVkSW5kZXggKz0gMTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgcmVuZGVyTmV3TGlzdCA9IChsaXN0LCBsaXN0SW5kZXgpID0+IHtcbiAgICBjb25zdCBuYXZMaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25hdi10b2RvLWxpc3RzJyk7XG4gICAgY29uc3QgbGlzdEl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgIGNvbnN0IGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29uc3QgZWRpdEJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGNvbnN0IGVkaXRJbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICBjb25zdCBkZWxldGVCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBjb25zdCBkZWxldGVJbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcblxuICAgIGxpbmsuc2V0QXR0cmlidXRlKCdocmVmJywgJyMnKTtcbiAgICBsaW5rLnRleHRDb250ZW50ID0gYCR7bGlzdC50aXRsZX1gO1xuICAgIGRpdi5jbGFzc0xpc3QuYWRkKCduYXYtbGlzdC1idXR0b25zJyk7XG4gICAgZWRpdEltZy5zZXRBdHRyaWJ1dGUoJ3NyYycsICcuL2ljb25zL2VkaXQuc3ZnJyk7XG4gICAgZWRpdEltZy5zZXRBdHRyaWJ1dGUoJ2FsdCcsICdidXR0b24gdG8gZWRpdCBsaXN0Jyk7XG4gICAgZGVsZXRlSW1nLnNldEF0dHJpYnV0ZSgnc3JjJywgJy4vaWNvbnMvZGVsZXRlLnN2ZycpO1xuICAgIGRlbGV0ZUltZy5zZXRBdHRyaWJ1dGUoJ2FsdCcsICdidXR0b24gdG8gZGVsZXRlIGxpc3QnKTtcblxuICAgIHNldFByb2plY3REYXRhSW5kZXgobGluaywgbGlzdEluZGV4KTtcbiAgICBzZXRQcm9qZWN0RGF0YUluZGV4KGVkaXRCdG4sIGxpc3RJbmRleCk7XG4gICAgc2V0UHJvamVjdERhdGFJbmRleChkZWxldGVCdG4sIGxpc3RJbmRleCk7XG5cbiAgICBlZGl0QnRuLmFwcGVuZENoaWxkKGVkaXRJbWcpO1xuICAgIGRlbGV0ZUJ0bi5hcHBlbmRDaGlsZChkZWxldGVJbWcpO1xuICAgIGRpdi5hcHBlbmRDaGlsZChlZGl0QnRuKTtcbiAgICBkaXYuYXBwZW5kQ2hpbGQoZGVsZXRlQnRuKTtcbiAgICBsaXN0SXRlbS5hcHBlbmRDaGlsZChsaW5rKTtcbiAgICBsaXN0SXRlbS5hcHBlbmRDaGlsZChkaXYpO1xuICAgIG5hdkxpc3QuYXBwZW5kQ2hpbGQobGlzdEl0ZW0pO1xuXG4gICAgZWRpdEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+XG4gICAgICBlZGl0TGlzdE1vZGFsLm9wZW5FZGl0TW9kYWwoZWRpdEJ0bi5kYXRhc2V0LnByb2plY3RJbmRleCksXG4gICAgKTtcbiAgICBkZWxldGVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PlxuICAgICAgZGVsZXRlTGlzdE1vZGFsLm9wZW5EZWxldGVNb2RhbChkZWxldGVCdG4uZGF0YXNldC5wcm9qZWN0SW5kZXgpLFxuICAgICk7XG4gIH07XG5cbiAgY29uc3QgcmVuZGVyRGVsZXRlZExpc3QgPSAobGlzdEluZGV4KSA9PiB7XG4gICAgY29uc3QgbGlzdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmF2LXRvZG8tbGlzdHMnKS5jaGlsZHJlbjtcbiAgICBmb3IgKGNvbnN0IGxpc3Qgb2YgbGlzdHMpIHtcbiAgICAgIGNvbnN0IGxpbmsgPSBsaXN0LnF1ZXJ5U2VsZWN0b3IoJ2EnKTtcbiAgICAgIGlmIChsaW5rLmRhdGFzZXQucHJvamVjdEluZGV4ID09PSBTdHJpbmcobGlzdEluZGV4KSkge1xuICAgICAgICBsaXN0LnJlbW92ZSgpO1xuICAgICAgICB1cGRhdGVBbGxQcm9qZWN0SW5kaWNlcygpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgY29uc3QgcmVuZGVyRWRpdGVkTGlzdCA9IChsaXN0SW5kZXgsIHByb2plY3QpID0+IHtcbiAgICBjb25zdCBsaXN0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduYXYtdG9kby1saXN0cycpLmNoaWxkcmVuO1xuICAgIGZvciAoY29uc3QgbGlzdCBvZiBsaXN0cykge1xuICAgICAgY29uc3QgbGluayA9IGxpc3QucXVlcnlTZWxlY3RvcignYScpO1xuICAgICAgaWYgKGxpbmsuZGF0YXNldC5wcm9qZWN0SW5kZXggPT09IFN0cmluZyhsaXN0SW5kZXgpKSB7XG4gICAgICAgIGxpbmsudGV4dENvbnRlbnQgPSBwcm9qZWN0LnRpdGxlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLyogRnVuY3Rpb25zIHRvIGludm9rZSBvbiBpbml0aWxpc2UsIGZvciB0aGUgY29tcG9uZW50IHRvIHdvcmsgcHJvcGVybHkgKi9cbiAgY29uc3QgcmVuZGVyQ3VycmVudExpc3RzID0gKCkgPT4ge1xuICAgIGNvbnN0IGxpc3RzID0gcHJvamVjdE1hbmFnZXIucmV2ZWFsQWxsUHJvamVjdHMoKTtcbiAgICBsaXN0cy5mb3JFYWNoKChsaXN0KSA9PiB7XG4gICAgICBpZiAobGlzdHMuaW5kZXhPZihsaXN0KSA+IDApIHtcbiAgICAgICAgcmVuZGVyTmV3TGlzdChsaXN0LCBsaXN0cy5pbmRleE9mKGxpc3QpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBjb25zdCBzZXRJbmJveFByb2plY3RJbmRleCA9ICgpID0+IHtcbiAgICBjb25zdCBpbmJveCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduYXYtbGlzdC1pbmJveCcpO1xuICAgIHNldFByb2plY3REYXRhSW5kZXgoaW5ib3gsIDApO1xuICB9O1xuXG4gIGNvbnN0IGFkZE5ld0xpc3RCdG5MaXN0ZW5lciA9ICgpID0+IHtcbiAgICBjb25zdCBuZXdMaXN0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5hdi1uZXctbGlzdC1idXR0b24nKTtcbiAgICBjb25zdCBtb2RhbE5ld0xpc3QgPVxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5ldy1saXN0LW1vZGFsJykucGFyZW50RWxlbWVudDtcbiAgICBuZXdMaXN0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gdG9nZ2xlSGlkZGVuKG1vZGFsTmV3TGlzdCkpO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgY2FsY3VsYXRlTmV3UHJvamVjdEluZGV4LFxuICAgIHJlbmRlck5ld0xpc3QsXG4gICAgcmVuZGVyRGVsZXRlZExpc3QsXG4gICAgcmVuZGVyRWRpdGVkTGlzdCxcbiAgICByZW5kZXJDdXJyZW50TGlzdHMsXG4gICAgc2V0SW5ib3hQcm9qZWN0SW5kZXgsXG4gICAgYWRkTmV3TGlzdEJ0bkxpc3RlbmVyLFxuICB9O1xufSkoKTtcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi0gTWFpbiBtb2R1bGVcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5jb25zdCBtYWluID0gKCgpID0+IHtcbiAgLyogSGVhZGVyIHNlY3Rpb24gKi9cbiAgY29uc3QgbmV3VGFza0J0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluLW5ldy10YXNrLWJ1dHRvbicpO1xuXG4gIGNvbnN0IHJlbmRlckhlYWRlciA9IChwcm9qZWN0KSA9PiB7XG4gICAgY29uc3QgbGlzdFRpdGxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW4tbGlzdC10aXRsZScpO1xuICAgIGNvbnN0IGxpc3REZXNjcmlwdGlvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluLWxpc3QtZGVzY3JpcHRpb24nKTtcbiAgICBsaXN0VGl0bGUudGV4dENvbnRlbnQgPSBwcm9qZWN0LnRpdGxlO1xuICAgIGxpc3REZXNjcmlwdGlvbi50ZXh0Q29udGVudCA9IHByb2plY3QuZGVzY3JpcHRpb247XG4gIH07XG5cbiAgY29uc3Qgc2V0TmV3VGFza0J0bkluZGV4ID0gKGluZGV4KSA9PiB7XG4gICAgbmV3VGFza0J0bi5kYXRhc2V0LnByb2plY3RJbmRleCA9IGluZGV4O1xuICB9O1xuXG4gIGNvbnN0IGFkZE5ld1Rhc2tCdG5MaXN0ZW5lciA9ICgpID0+IHtcbiAgICBuZXdUYXNrQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT5cbiAgICAgIG5ld1Rhc2tNb2RhbC5vcGVuTmV3VGFza01vZGFsKG5ld1Rhc2tCdG4uZGF0YXNldC5wcm9qZWN0SW5kZXgpLFxuICAgICk7XG4gIH07XG5cbiAgLyogVGFza3Mgc2VjdGlvbiAqL1xuICBjb25zdCBjbGVhclRhc2tzID0gKCkgPT4ge1xuICAgIGNvbnN0IHRhc2tHcm91cHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubWFpbi10YXNrcycpO1xuICAgIHRhc2tHcm91cHMuZm9yRWFjaCgodGFza0dyb3VwKSA9PiB7XG4gICAgICB0YXNrR3JvdXAuaW5uZXJIVE1MID0gJyc7XG4gICAgfSk7XG4gIH07XG5cbiAgLyogRnVuY3Rpb24gdG8gaW52b2tlIG9uIGluaXRpbGlzZSwgZm9yIHRoZSBjb21wb25lbnQgdG8gd29yayBwcm9wZXJseSAqL1xuICBjb25zdCBpbml0ID0gKCkgPT4ge1xuICAgIGNvbnN0IGZpcnN0UHJvamVjdCA9IHByb2plY3RNYW5hZ2VyLnJldmVhbFByb2plY3QoMCk7XG4gICAgcmVuZGVySGVhZGVyKGZpcnN0UHJvamVjdCk7XG4gICAgc2V0TmV3VGFza0J0bkluZGV4KDApO1xuICAgIGFkZE5ld1Rhc2tCdG5MaXN0ZW5lcigpO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgcmVuZGVySGVhZGVyLFxuICAgIHNldE5ld1Rhc2tCdG5JbmRleCxcbiAgICBjbGVhclRhc2tzLFxuICAgIGFkZE5ld1Rhc2tCdG5MaXN0ZW5lcixcbiAgICBpbml0LFxuICB9O1xufSkoKTtcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi0gTW9kdWxlIHRvIGNvbnRyb2wgdGhpbmdzIGNvbW1vbiBtb3N0IG1vZGFsc1xuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbmNvbnN0IGFsbE1vZGFscyA9ICgoKSA9PiB7XG4gIC8qIEdlbmVyYWwgZnVuY3Rpb25zIHRvIGNsb3NlIG1vZGFscyBhbmQgY2xlYXIgaW5wdXRzICovXG4gIGNvbnN0IGNsZWFySW5wdXRzID0gKG1vZGFsKSA9PiB7XG4gICAgY29uc3QgaW5wdXRzID0gbW9kYWwucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQnKTtcbiAgICBjb25zdCB0ZXh0YXJlYXMgPSBtb2RhbC5xdWVyeVNlbGVjdG9yQWxsKCd0ZXh0YXJlYScpO1xuICAgIGNvbnN0IHNlbGVjdE9wdGlvbiA9IG1vZGFsLnF1ZXJ5U2VsZWN0b3IoJ29wdGlvbicpO1xuICAgIGlmIChpbnB1dHMpIHtcbiAgICAgIGlucHV0cy5mb3JFYWNoKChpbnB1dCkgPT4ge1xuICAgICAgICBpbnB1dC52YWx1ZSA9ICcnO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGlmICh0ZXh0YXJlYXMpIHtcbiAgICAgIHRleHRhcmVhcy5mb3JFYWNoKCh0ZXh0YXJlYSkgPT4ge1xuICAgICAgICB0ZXh0YXJlYS52YWx1ZSA9ICcnO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChzZWxlY3RPcHRpb24pIHtcbiAgICAgIHNlbGVjdE9wdGlvbi5zZWxlY3RlZCA9IHRydWU7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGNsb3NlTW9kYWwgPSAobW9kYWwpID0+IHtcbiAgICBjbGVhcklucHV0cyhtb2RhbCk7XG4gICAgdG9nZ2xlSGlkZGVuKG1vZGFsKTtcbiAgfTtcblxuICAvKiBGdW5jdGlvbnMgdG8gaW52b2tlIG9uIGluaXRpbGlzZSwgZm9yIHRoZSBjb21wb25lbnQgdG8gd29yayBwcm9wZXJseSAqL1xuICBjb25zdCBhZGRDbG9zZUJ0bkxpc3RlbmVycyA9ICgpID0+IHtcbiAgICBjb25zdCBjbG9zZU1vZGFsQnRucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5tb2RhbC1jbG9zZS1idXR0b24nKTtcblxuICAgIGNsb3NlTW9kYWxCdG5zLmZvckVhY2goKGJ0bikgPT4ge1xuICAgICAgY29uc3QgbW9kYWwgPSBidG4ucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQ7XG4gICAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBjbG9zZU1vZGFsKG1vZGFsKSk7XG4gICAgfSk7XG4gIH07XG5cbiAgY29uc3QgYWRkQ2xvc2VCYWNrZ3JvdW5kTGlzdGVuZXJzID0gKCkgPT4ge1xuICAgIGNvbnN0IG1vZGFsQmFja2dyb3VuZHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubW9kYWwtYmFja2dyb3VuZCcpO1xuICAgIGNvbnN0IGNsb3NlID0gKGUsIG1vZGFsQmFja2dyb3VuZCkgPT4ge1xuICAgICAgaWYgKCFlLnRhcmdldC5jbG9zZXN0KCcubW9kYWwnKSkge1xuICAgICAgICBjbG9zZU1vZGFsKG1vZGFsQmFja2dyb3VuZCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIG1vZGFsQmFja2dyb3VuZHMuZm9yRWFjaCgoYmFja2dyb3VuZCkgPT4ge1xuICAgICAgYmFja2dyb3VuZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiBjbG9zZShlLCBiYWNrZ3JvdW5kKSk7XG4gICAgfSk7XG4gIH07XG5cbiAgcmV0dXJuIHsgY2xvc2VNb2RhbCwgYWRkQ2xvc2VCdG5MaXN0ZW5lcnMsIGFkZENsb3NlQmFja2dyb3VuZExpc3RlbmVycyB9O1xufSkoKTtcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi0gJ05ldyBMaXN0JyBtb2RhbCBtb2R1bGVcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5jb25zdCBuZXdMaXN0TW9kYWwgPSAoKCkgPT4ge1xuICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uZXctbGlzdC1tb2RhbCcpLnBhcmVudEVsZW1lbnQ7XG4gIGNvbnN0IHN1Ym1pdEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZXctbGlzdC1zdWJtaXQtYnV0dG9uJyk7XG5cbiAgY29uc3QgY3JlYXROZXdMaXN0ID0gKGUpID0+IHtcbiAgICBjb25zdCB0aXRsZUlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25ldy1saXN0LW5hbWUnKS52YWx1ZTtcbiAgICBjb25zdCBkZXNjcmlwdGlvbklucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG4gICAgICAnbmV3LWxpc3QtZGVzY3JpcHRpb24nLFxuICAgICkudmFsdWU7XG5cbiAgICBpZiAodGl0bGVJbnB1dCAhPT0gJycpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgY29uc3QgbmV3TGlzdCA9IHByb2plY3RNYW5hZ2VyLmNyZWF0ZU5ld1Byb2plY3QoXG4gICAgICAgIHRpdGxlSW5wdXQsXG4gICAgICAgIGRlc2NyaXB0aW9uSW5wdXQsXG4gICAgICApO1xuICAgICAgbmF2YmFyLnJlbmRlck5ld0xpc3QobmV3TGlzdCwgbmF2YmFyLmNhbGN1bGF0ZU5ld1Byb2plY3RJbmRleCgpKTtcblxuICAgICAgYWxsTW9kYWxzLmNsb3NlTW9kYWwobW9kYWwpO1xuICAgIH1cbiAgfTtcblxuICAvKiBGdW5jdGlvbiB0byBpbnZva2Ugb24gaW5pdGlsaXNlLCBmb3IgdGhlIGNvbXBvbmVudCB0byB3b3JrIHByb3Blcmx5ICovXG4gIGNvbnN0IGFkZFN1Ym1pdEJ0bkxpc3RlbmVyID0gKCkgPT4ge1xuICAgIHN1Ym1pdEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiBjcmVhdE5ld0xpc3QoZSkpO1xuICB9O1xuXG4gIHJldHVybiB7IGFkZFN1Ym1pdEJ0bkxpc3RlbmVyIH07XG59KSgpO1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLSAnRWRpdCBsaXN0JyBtb2RhbCBtb2R1bGVcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5jb25zdCBlZGl0TGlzdE1vZGFsID0gKCgpID0+IHtcbiAgY29uc3QgbW9kYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZWRpdC1saXN0LW1vZGFsJykucGFyZW50RWxlbWVudDtcbiAgY29uc3QgZWRpdEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlZGl0LWxpc3Qtc3VibWl0LWJ1dHRvbicpO1xuXG4gIGNvbnN0IHNldFByb2plY3REYXRhSW5kZXggPSAocHJvamVjdEluZGV4KSA9PiB7XG4gICAgZWRpdEJ0bi5kYXRhc2V0LnByb2plY3RJbmRleCA9IHByb2plY3RJbmRleDtcbiAgfTtcblxuICBjb25zdCBvcGVuRWRpdE1vZGFsID0gKHByb2plY3RJbmRleCkgPT4ge1xuICAgIGNvbnN0IHRpdGxlSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZWRpdC1saXN0LW5hbWUnKTtcbiAgICBjb25zdCBkZXNjcmlwdGlvbklucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VkaXQtbGlzdC1kZXNjcmlwdGlvbicpO1xuICAgIGNvbnN0IHByb2plY3RUb0VkaXQgPSBwcm9qZWN0TWFuYWdlci5yZXZlYWxQcm9qZWN0KE51bWJlcihwcm9qZWN0SW5kZXgpKTtcblxuICAgIHRpdGxlSW5wdXQudmFsdWUgPSBwcm9qZWN0VG9FZGl0LnRpdGxlO1xuICAgIGRlc2NyaXB0aW9uSW5wdXQudmFsdWUgPSBwcm9qZWN0VG9FZGl0LmRlc2NyaXB0aW9uO1xuXG4gICAgc2V0UHJvamVjdERhdGFJbmRleChwcm9qZWN0SW5kZXgpO1xuICAgIHRvZ2dsZUhpZGRlbihtb2RhbCk7XG4gIH07XG5cbiAgY29uc3QgZWRpdExpc3QgPSAoZSkgPT4ge1xuICAgIGNvbnN0IHRpdGxlSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZWRpdC1saXN0LW5hbWUnKS52YWx1ZTtcbiAgICBjb25zdCBkZXNjcmlwdGlvbklucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG4gICAgICAnZWRpdC1saXN0LWRlc2NyaXB0aW9uJyxcbiAgICApLnZhbHVlO1xuICAgIGNvbnN0IGluZGV4ID0gTnVtYmVyKGVkaXRCdG4uZGF0YXNldC5wcm9qZWN0SW5kZXgpO1xuXG4gICAgaWYgKHRpdGxlSW5wdXQgIT09ICcnKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBwcm9qZWN0TWFuYWdlci5lZGl0UHJvamVjdFRpdGxlKGluZGV4LCB0aXRsZUlucHV0KTtcbiAgICAgIHByb2plY3RNYW5hZ2VyLmVkaXRQcm9qZWN0RGVzY3JpcHRpb24oaW5kZXgsIGRlc2NyaXB0aW9uSW5wdXQpO1xuICAgICAgbmF2YmFyLnJlbmRlckVkaXRlZExpc3QoaW5kZXgsIHByb2plY3RNYW5hZ2VyLnJldmVhbFByb2plY3QoaW5kZXgpKTtcbiAgICAgIGFsbE1vZGFscy5jbG9zZU1vZGFsKG1vZGFsKTtcbiAgICB9XG4gIH07XG5cbiAgLyogRnVuY3Rpb24gdG8gaW52b2tlIG9uIGluaXRpbGlzZSwgZm9yIHRoZSBjb21wb25lbnQgdG8gd29yayBwcm9wZXJseSAqL1xuICBjb25zdCBhZGRFZGl0QnRuTGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgZWRpdEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiBlZGl0TGlzdChlKSk7XG4gIH07XG5cbiAgcmV0dXJuIHsgb3BlbkVkaXRNb2RhbCwgYWRkRWRpdEJ0bkxpc3RlbmVyIH07XG59KSgpO1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLSAnRGVsZXRlIGxpc3QnIG1vZGFsIG1vZHVsZVxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbmNvbnN0IGRlbGV0ZUxpc3RNb2RhbCA9ICgoKSA9PiB7XG4gIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRlbGV0ZS1saXN0LW1vZGFsJykucGFyZW50RWxlbWVudDtcbiAgY29uc3QgY2FuY2VsQnRuID0gbW9kYWwucXVlcnlTZWxlY3RvcignLmNhbmNlbC1idXR0b24nKTtcbiAgY29uc3QgZGVsZXRlQnRuID0gbW9kYWwucXVlcnlTZWxlY3RvcignLmRlbGV0ZS1idXR0b24nKTtcblxuICBjb25zdCBzZXRQcm9qZWN0RGF0YUluZGV4ID0gKHByb2plY3RJbmRleCkgPT4ge1xuICAgIGRlbGV0ZUJ0bi5kYXRhc2V0LnByb2plY3RJbmRleCA9IHByb2plY3RJbmRleDtcbiAgfTtcblxuICBjb25zdCBvcGVuRGVsZXRlTW9kYWwgPSAocHJvamVjdEluZGV4KSA9PiB7XG4gICAgc2V0UHJvamVjdERhdGFJbmRleChwcm9qZWN0SW5kZXgpO1xuICAgIHRvZ2dsZUhpZGRlbihtb2RhbCk7XG4gIH07XG5cbiAgY29uc3QgZGVsZXRlTGlzdCA9ICgpID0+IHtcbiAgICBjb25zdCBpbmRleCA9IE51bWJlcihkZWxldGVCdG4uZGF0YXNldC5wcm9qZWN0SW5kZXgpO1xuICAgIHByb2plY3RNYW5hZ2VyLmRlbGV0ZVByb2plY3QoaW5kZXgpO1xuICAgIG5hdmJhci5yZW5kZXJEZWxldGVkTGlzdChpbmRleCk7XG4gICAgdG9nZ2xlSGlkZGVuKG1vZGFsKTtcbiAgfTtcblxuICAvKiBGdW5jdGlvbnMgdG8gaW52b2tlIG9uIGluaXRpbGlzZSwgZm9yIHRoZSBjb21wb25lbnQgdG8gd29yayBwcm9wZXJseSAqL1xuICBjb25zdCBhZGRDYW5jZWxCdG5MaXN0ZW5lciA9ICgpID0+IHtcbiAgICBjYW5jZWxCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB0b2dnbGVIaWRkZW4obW9kYWwpKTtcbiAgfTtcblxuICBjb25zdCBhZGREZWxldGVCdG5MaXN0ZW5lciA9ICgpID0+IHtcbiAgICBkZWxldGVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBkZWxldGVMaXN0KTtcbiAgfTtcblxuICByZXR1cm4geyBvcGVuRGVsZXRlTW9kYWwsIGFkZENhbmNlbEJ0bkxpc3RlbmVyLCBhZGREZWxldGVCdG5MaXN0ZW5lciB9O1xufSkoKTtcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi0gJ05ldyB0YXNrJyBtb2RhbCBtb2R1bGVcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5jb25zdCBuZXdUYXNrTW9kYWwgPSAoKCkgPT4ge1xuICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uZXctdGFzay1tb2RhbCcpLnBhcmVudEVsZW1lbnQ7XG4gIGNvbnN0IG5ld1Rhc2tCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmV3LXRhc2stc3VibWl0LWJ1dHRvbicpO1xuICBjb25zdCBzdGVwc0xpc3QgPSBtb2RhbC5xdWVyeVNlbGVjdG9yKCcubW9kYWwtc3RlcHMtbGlzdCcpO1xuXG4gIGNvbnN0IHNldFByb2plY3REYXRhSW5kZXggPSAocHJvamVjdEluZGV4KSA9PiB7XG4gICAgbmV3VGFza0J0bi5kYXRhc2V0LnByb2plY3RJbmRleCA9IHByb2plY3RJbmRleDtcbiAgfTtcblxuICBjb25zdCBvcGVuTmV3VGFza01vZGFsID0gKHByb2plY3RJbmRleCkgPT4ge1xuICAgIHNldFByb2plY3REYXRhSW5kZXgocHJvamVjdEluZGV4KTtcbiAgICBzdGVwc0NvbXBvbmVudC5jbGVhckFsbFN0ZXBzKHN0ZXBzTGlzdCk7XG4gICAgdG9nZ2xlSGlkZGVuKG1vZGFsKTtcbiAgfTtcblxuICBjb25zdCBzdWJtaXROZXdUYXNrID0gKGUpID0+IHtcbiAgICBjb25zdCBwcm9qZWN0SW5kZXggPSBOdW1iZXIobmV3VGFza0J0bi5kYXRhc2V0LnByb2plY3RJbmRleCk7XG4gICAgY29uc3QgbmV3VGl0bGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmV3LXRhc2stbmFtZScpLnZhbHVlO1xuICAgIGNvbnN0IG5ld0Rlc2NyaXB0aW9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG4gICAgICAnbmV3LXRhc2stZGVzY3JpcHRpb24nLFxuICAgICkudmFsdWU7XG4gICAgY29uc3QgbmV3RGF0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZXctdGFzay1kYXRlJykudmFsdWU7XG4gICAgY29uc3QgbmV3UHJpb3JpdHkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmV3LXRhc2stcHJpb3JpdHknKS52YWx1ZTtcbiAgICBjb25zdCBuZXdTdGVwcyA9IHN0ZXBzQ29tcG9uZW50LnJldmVhbFN0ZXBzKCk7XG5cbiAgICBpZiAobmV3VGl0bGUgIT09ICcnKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB0YXNrTWFuYWdlci5jcmVhdGVOZXdUYXNrKFxuICAgICAgICBwcm9qZWN0SW5kZXgsXG4gICAgICAgIG5ld1RpdGxlLFxuICAgICAgICBuZXdEZXNjcmlwdGlvbixcbiAgICAgICAgbmV3RGF0ZSxcbiAgICAgICAgbmV3UHJpb3JpdHksXG4gICAgICAgICd0byBkbycsXG4gICAgICApO1xuICAgICAgY29uc3QgbGVuZ3RoID0gcHJvamVjdE1hbmFnZXIucmV2ZWFsUHJvamVjdFRhc2tzTGVuZ3RoKHByb2plY3RJbmRleCk7XG4gICAgICBuZXdTdGVwcy5mb3JFYWNoKChzdGVwKSA9PiB7XG4gICAgICAgIHN0ZXBNYW5hZ2VyLmNyZWF0ZU5ld1N0ZXAoXG4gICAgICAgICAgcHJvamVjdEluZGV4LFxuICAgICAgICAgIGxlbmd0aCAtIDEsXG4gICAgICAgICAgc3RlcC5kZXNjcmlwdGlvbixcbiAgICAgICAgICBzdGVwLnN0YXR1cyxcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgICAgLyogU3dhcCBjb25zb2xlLWxvZyBmb3IgZnVuY3Rpb24gdG8gcmVuZGVyIHRhc2sgKi9cbiAgICAgIGNvbnNvbGUubG9nKHRhc2tNYW5hZ2VyLnJldmVhbFRhc2socHJvamVjdEluZGV4LCBsZW5ndGggLSAxKSk7XG4gICAgICBhbGxNb2RhbHMuY2xvc2VNb2RhbChtb2RhbCk7XG4gICAgfVxuICB9O1xuXG4gIC8qIEZ1bmN0aW9ucyB0byBpbnZva2Ugb24gaW5pdGlsaXNlLCBmb3IgdGhlIGNvbXBvbmVudCB0byB3b3JrIHByb3Blcmx5ICovXG4gIGNvbnN0IGFkZE5ld1Rhc2tCdG5MSXN0ZW5lciA9ICgpID0+IHtcbiAgICBuZXdUYXNrQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHN1Ym1pdE5ld1Rhc2soZSkpO1xuICB9O1xuXG4gIHJldHVybiB7IG9wZW5OZXdUYXNrTW9kYWwsIGFkZE5ld1Rhc2tCdG5MSXN0ZW5lciB9O1xufSkoKTtcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi0gU3RlcHMgY29tcG9uZW50IG1vZHVsZVxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbmNvbnN0IHN0ZXBzQ29tcG9uZW50ID0gKCgpID0+IHtcbiAgY29uc3QgbmV3U3RlcEJ0bnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYWRkLXN0ZXAtYnV0dG9uJyk7XG4gIGxldCBtb2RhbDtcbiAgbGV0IHN0ZXBzTGlzdDtcbiAgbGV0IG5ld1N0ZXBCdG47XG4gIGNvbnN0IHN0ZXBzID0gW107XG5cbiAgY29uc3QgY2xlYXJBbGxTdGVwcyA9ICh1bCkgPT4ge1xuICAgIGNvbnN0IHVsVG9DbGVhciA9IHVsO1xuICAgIHN0ZXBzLmxlbmd0aCA9IDA7XG4gICAgdWxUb0NsZWFyLmlubmVySFRNTCA9ICcnO1xuICB9O1xuXG4gIGNvbnN0IHJldmVhbFN0ZXBzID0gKCkgPT4gc3RlcHM7XG5cbiAgY29uc3QgcmVuZGVyU3RlcCA9IChsaXN0SXRlbSwgc3RlcCwgaW5kZXgpID0+IHtcbiAgICBjb25zdCBjaGVja2JveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgY29uc3QgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICAgIGNvbnN0IGVkaXRTdGVwQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgY29uc3QgZWRpdFN0ZXBJbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICBjb25zdCBkZWxldGVTdGVwQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgY29uc3QgZGVsZXRlU3RlcEltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuXG4gICAgY2hlY2tib3guc2V0QXR0cmlidXRlKCd0eXBlJywgJ2NoZWNrYm94Jyk7XG4gICAgY2hlY2tib3guc2V0QXR0cmlidXRlKCduYW1lJywgYHN0ZXAtc3RhdHVzLSR7aW5kZXh9YCk7XG4gICAgY2hlY2tib3guc2V0QXR0cmlidXRlKCdpZCcsIGBzdGVwLXN0YXR1cy0ke2luZGV4fWApO1xuICAgIGNoZWNrYm94LmRhdGFzZXQuc3RlcEluZGV4ID0gaW5kZXg7XG4gICAgaWYgKHN0ZXAuc3RhdHVzID09PSAnZG9uZScpIHtcbiAgICAgIGNoZWNrYm94LmNoZWNrZWQgPSB0cnVlO1xuICAgIH1cbiAgICBsYWJlbC5zZXRBdHRyaWJ1dGUoJ2ZvcicsIGBzdGVwLXN0YXR1cy0ke2luZGV4fWApO1xuICAgIGxhYmVsLnRleHRDb250ZW50ID0gc3RlcC5kZXNjcmlwdGlvbjtcbiAgICBlZGl0U3RlcEJ0bi5jbGFzc0xpc3QuYWRkKCdzdGVwcy1saXN0LWl0ZW0tYnV0dG9uJyk7XG4gICAgZWRpdFN0ZXBCdG4uZGF0YXNldC5zdGVwSW5kZXggPSBpbmRleDtcbiAgICBlZGl0U3RlcEltZy5zZXRBdHRyaWJ1dGUoJ3NyYycsICcuL2ljb25zL2VkaXQuc3ZnJyk7XG4gICAgZWRpdFN0ZXBJbWcuc2V0QXR0cmlidXRlKCdhbHQnLCAnZWRpdCBzdGVwIGJ1dHRvbicpO1xuICAgIGRlbGV0ZVN0ZXBCdG4uY2xhc3NMaXN0LmFkZCgnc3RlcHMtbGlzdC1pdGVtLWJ1dHRvbicpO1xuICAgIGRlbGV0ZVN0ZXBCdG4uZGF0YXNldC5zdGVwSW5kZXggPSBpbmRleDtcbiAgICBkZWxldGVTdGVwSW1nLnNldEF0dHJpYnV0ZSgnc3JjJywgJy4vaWNvbnMvZGVsZXRlLnN2ZycpO1xuICAgIGRlbGV0ZVN0ZXBJbWcuc2V0QXR0cmlidXRlKCdhbHQnLCAnZGVsZXRlIHN0ZXAgYnV0dG9uJyk7XG5cbiAgICBjaGVja2JveC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoKSA9PlxuICAgICAgdXBkYXRlU3RlcFN0YXR1cyhjaGVja2JveC5jaGVja2VkLCBOdW1iZXIoY2hlY2tib3guZGF0YXNldC5zdGVwSW5kZXgpKSxcbiAgICApO1xuICAgIGVkaXRTdGVwQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2KSA9PlxuICAgICAgcmVuZGVyRWRpdFN0ZXAoZXYsIGVkaXRTdGVwQnRuLmRhdGFzZXQuc3RlcEluZGV4KSxcbiAgICApO1xuICAgIGRlbGV0ZVN0ZXBCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXYpID0+XG4gICAgICBkZWxldGVTdGVwKGV2LCBkZWxldGVTdGVwQnRuLmRhdGFzZXQuc3RlcEluZGV4KSxcbiAgICApO1xuXG4gICAgbGlzdEl0ZW0uYXBwZW5kQ2hpbGQoY2hlY2tib3gpO1xuICAgIGxpc3RJdGVtLmFwcGVuZENoaWxkKGxhYmVsKTtcbiAgICBsaXN0SXRlbS5hcHBlbmRDaGlsZChlZGl0U3RlcEJ0bik7XG4gICAgZWRpdFN0ZXBCdG4uYXBwZW5kQ2hpbGQoZWRpdFN0ZXBJbWcpO1xuICAgIGxpc3RJdGVtLmFwcGVuZENoaWxkKGRlbGV0ZVN0ZXBCdG4pO1xuICAgIGRlbGV0ZVN0ZXBCdG4uYXBwZW5kQ2hpbGQoZGVsZXRlU3RlcEltZyk7XG4gIH07XG5cbiAgY29uc3QgdXBkYXRlU3RlcElkaWNlcyA9ICgpID0+IHtcbiAgICBjb25zdCBhbGxTdGVwcyA9IHN0ZXBzTGlzdC5jaGlsZHJlbjtcbiAgICBsZXQgaW5kZXggPSAwO1xuICAgIGZvciAoY29uc3QgbGlzdEl0ZW0gb2YgYWxsU3RlcHMpIHtcbiAgICAgIGNvbnN0IGNoZWNrYm94ID0gbGlzdEl0ZW0ucXVlcnlTZWxlY3RvcignaW5wdXQnKTtcbiAgICAgIGNvbnN0IGxhYmVsID0gbGlzdEl0ZW0ucXVlcnlTZWxlY3RvcignbGFiZWwnKTtcbiAgICAgIGNvbnN0IGJ1dHRvbnMgPSBsaXN0SXRlbS5xdWVyeVNlbGVjdG9yQWxsKCcuc3RlcHMtbGlzdC1pdGVtLWJ1dHRvbicpO1xuXG4gICAgICBjaGVja2JveC5zZXRBdHRyaWJ1dGUoJ25hbWUnLCBgc3RlcC1zdGF0dXMtJHtpbmRleH1gKTtcbiAgICAgIGNoZWNrYm94LnNldEF0dHJpYnV0ZSgnaWQnLCBgc3RlcC1zdGF0dXMtJHtpbmRleH1gKTtcbiAgICAgIGNoZWNrYm94LmRhdGFzZXQuc3RlcEluZGV4ID0gaW5kZXg7XG4gICAgICBsYWJlbC5zZXRBdHRyaWJ1dGUoJ2ZvcicsIGBzdGVwLXN0YXR1cy0ke2luZGV4fWApO1xuICAgICAgYnV0dG9ucy5mb3JFYWNoKChidXR0b24pID0+IHtcbiAgICAgICAgYnV0dG9uLmRhdGFzZXQuc3RlcEluZGV4ID0gaW5kZXg7XG4gICAgICB9KTtcbiAgICAgIGluZGV4ICs9IDE7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IHVwZGF0ZVN0ZXBTdGF0dXMgPSAobmV3U3RhdHVzLCBpbmRleCkgPT4ge1xuICAgIGlmIChuZXdTdGF0dXMgPT09IHRydWUpIHtcbiAgICAgIHN0ZXBzW2luZGV4XS5zdGF0dXMgPSAnZG9uZSc7XG4gICAgfSBlbHNlIGlmIChuZXdTdGF0dXMgPT09IGZhbHNlKSB7XG4gICAgICBzdGVwc1tpbmRleF0uc3RhdHVzID0gJ3RvIGRvJztcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgZWRpdFN0ZXAgPSAoZSwgc3RlcEluZGV4LCBlZGl0ZWRTdGVwVmFsdWUpID0+IHtcbiAgICBjb25zdCBzdGVwVG9FZGl0ID0gZS50YXJnZXQuY2xvc2VzdCgnbGknKTtcbiAgICBjb25zdCBpbnB1dCA9IHN0ZXBUb0VkaXQucXVlcnlTZWxlY3RvcignaW5wdXQnKTtcbiAgICBjb25zdCBzdWJtaXRTdGVwQnRuID0gaW5wdXQubmV4dEVsZW1lbnRTaWJsaW5nO1xuICAgIGNvbnN0IGVkaXRTdGVwQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgY29uc3QgZWRpdFN0ZXBJbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICBjb25zdCBkZWxldGVTdGVwQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgY29uc3QgZGVsZXRlU3RlcEltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuXG4gICAgaWYgKGVkaXRlZFN0ZXBWYWx1ZSAhPT0gJycpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBzdGVwc1tzdGVwSW5kZXhdLmRlc2NyaXB0aW9uID0gZWRpdGVkU3RlcFZhbHVlO1xuICAgICAgaW5wdXQucmVtb3ZlKCk7XG4gICAgICBzdWJtaXRTdGVwQnRuLnJlbW92ZSgpO1xuICAgICAgcmVuZGVyU3RlcChzdGVwVG9FZGl0LCBzdGVwc1tzdGVwSW5kZXhdLCBzdGVwSW5kZXgpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCByZW5kZXJFZGl0U3RlcCA9IChldiwgaW5kZXgpID0+IHtcbiAgICBjb25zdCBzdGVwSW5kZXggPSBOdW1iZXIoaW5kZXgpO1xuICAgIGNvbnN0IHN0ZXBUb0VkaXQgPSBldi50YXJnZXQuY2xvc2VzdCgnbGknKTtcbiAgICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgY29uc3Qgc3VibWl0U3RlcEJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGNvbnN0IHN1Ym1pdEltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuXG4gICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBzdGVwVG9FZGl0LmlubmVySFRNTCA9ICcnO1xuXG4gICAgaW5wdXQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQnKTtcbiAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoJ25hbWUnLCAnbW9kYWwtZWRpdC1zdGVwJyk7XG4gICAgaW5wdXQuc2V0QXR0cmlidXRlKCdpZCcsICdtb2RhbC1lZGl0LXN0ZXAnKTtcbiAgICBpbnB1dC5yZXF1aXJlZCA9IHRydWU7XG4gICAgaW5wdXQudmFsdWUgPSBzdGVwc1tzdGVwSW5kZXhdLmRlc2NyaXB0aW9uO1xuICAgIHN1Ym1pdFN0ZXBCdG4udGV4dENvbnRlbnQgPSAnQWx0ZXIgc3RlcCc7XG4gICAgc3VibWl0SW1nLnNldEF0dHJpYnV0ZSgnc3JjJywgJy4vaWNvbnMvY29uZmlybS5zdmcnKTtcbiAgICBzdWJtaXRJbWcuc2V0QXR0cmlidXRlKCdhbHQnLCAnY29uZmlybSBlZGl0IGJ1dHRvbicpO1xuXG4gICAgc3RlcFRvRWRpdC5hcHBlbmRDaGlsZChpbnB1dCk7XG4gICAgc3RlcFRvRWRpdC5hcHBlbmRDaGlsZChzdWJtaXRTdGVwQnRuKTtcbiAgICBzdWJtaXRTdGVwQnRuLmFwcGVuZENoaWxkKHN1Ym1pdEltZyk7XG5cbiAgICBzdWJtaXRTdGVwQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+XG4gICAgICBlZGl0U3RlcChlLCBzdGVwSW5kZXgsIGlucHV0LnZhbHVlKSxcbiAgICApO1xuICB9O1xuXG4gIGNvbnN0IGRlbGV0ZVN0ZXAgPSAoZXYsIGluZGV4KSA9PiB7XG4gICAgY29uc3Qgc3RlcEluZGV4ID0gTnVtYmVyKGluZGV4KTtcbiAgICBjb25zdCBzdGVwVG9EZWxldGUgPSBldi50YXJnZXQuY2xvc2VzdCgnbGknKTtcblxuICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgc3RlcHMuc3BsaWNlKHN0ZXBJbmRleCwgMSk7XG4gICAgc3RlcFRvRGVsZXRlLnJlbW92ZSgpO1xuICAgIHVwZGF0ZVN0ZXBJZGljZXMoKTtcbiAgfTtcblxuICBjb25zdCBhZGRTdGVwID0gKGV2dCkgPT4ge1xuICAgIGNvbnN0IG5ld1N0ZXBEZXNjcmlwdGlvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RhbC1hZGQtc3RlcCcpO1xuICAgIGNvbnN0IHN0ZXBDcmVhdG9yID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGFsLWFkZC1zdGVwJykucGFyZW50RWxlbWVudDtcbiAgICBjb25zdCBzdGVwc0xpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubW9kYWwtc3RlcHMtbGlzdCcpO1xuXG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGlmIChuZXdTdGVwRGVzY3JpcHRpb24udmFsdWUgIT09ICcnKSB7XG4gICAgICBjb25zdCBzdGVwID0ge1xuICAgICAgICBkZXNjcmlwdGlvbjogbmV3U3RlcERlc2NyaXB0aW9uLnZhbHVlLFxuICAgICAgICBzdGF0dXM6ICd0byBkbycsXG4gICAgICB9O1xuICAgICAgY29uc3QgbGlzdEl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuXG4gICAgICBzdGVwcy5wdXNoKHN0ZXApO1xuICAgICAgc3RlcHNMaXN0LmFwcGVuZENoaWxkKGxpc3RJdGVtKTtcbiAgICAgIHJlbmRlclN0ZXAobGlzdEl0ZW0sIHN0ZXBzW3N0ZXBzLmxlbmd0aCAtIDFdLCBzdGVwcy5sZW5ndGggLSAxKTtcbiAgICB9XG4gICAgdG9nZ2xlSGlkZGVuKG5ld1N0ZXBCdG4pO1xuICAgIHN0ZXBDcmVhdG9yLnJlbW92ZSgpO1xuICB9O1xuXG4gIGNvbnN0IHJlbmRlckNyZWF0ZVN0ZXAgPSAoZSkgPT4ge1xuICAgIGNvbnN0IGxpc3RJdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgY29uc3Qgc3VibWl0U3RlcEJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGNvbnN0IHN1Ym1pdEltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGlucHV0LnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0Jyk7XG4gICAgaW5wdXQuc2V0QXR0cmlidXRlKCduYW1lJywgJ21vZGFsLWFkZC1zdGVwJyk7XG4gICAgaW5wdXQuc2V0QXR0cmlidXRlKCdpZCcsICdtb2RhbC1hZGQtc3RlcCcpO1xuICAgIHN1Ym1pdFN0ZXBCdG4udGV4dENvbnRlbnQgPSAnQWRkIHN0ZXAnO1xuICAgIHN1Ym1pdEltZy5zZXRBdHRyaWJ1dGUoJ3NyYycsICcuL2ljb25zL2NvbmZpcm0uc3ZnJyk7XG4gICAgc3VibWl0SW1nLnNldEF0dHJpYnV0ZSgnYWx0JywgJ2NvbmZpcm0gc3RlcCBidXR0b24nKTtcblxuICAgIHN1Ym1pdFN0ZXBCdG4uYXBwZW5kQ2hpbGQoc3VibWl0SW1nKTtcbiAgICBsaXN0SXRlbS5hcHBlbmRDaGlsZChpbnB1dCk7XG4gICAgbGlzdEl0ZW0uYXBwZW5kQ2hpbGQoc3VibWl0U3RlcEJ0bik7XG4gICAgc3RlcHNMaXN0LmFwcGVuZENoaWxkKGxpc3RJdGVtKTtcblxuICAgIHN1Ym1pdFN0ZXBCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZ0KSA9PiBhZGRTdGVwKGV2dCkpO1xuICAgIHRvZ2dsZUhpZGRlbihuZXdTdGVwQnRuKTtcbiAgfTtcblxuICAvKiBGdW5jdGlvbiB0byBpbnZva2Ugb24gaW5pdGlsaXNlLCBmb3IgdGhlIGNvbXBvbmVudCB0byB3b3JrIHByb3Blcmx5ICovXG4gIGNvbnN0IGFkZE5ld1N0ZXBCdG5MaXN0ZW5lcnMgPSAoKSA9PiB7XG4gICAgbmV3U3RlcEJ0bnMuZm9yRWFjaCgoYnRuKSA9PiB7XG4gICAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICBpZiAoZS50YXJnZXQuY2xvc2VzdCgnLm5ldy10YXNrLW1vZGFsJykpIHtcbiAgICAgICAgICBtb2RhbCA9IGUudGFyZ2V0LmNsb3Nlc3QoJy5uZXctdGFzay1tb2RhbCcpLnBhcmVudEVsZW1lbnQ7XG4gICAgICAgIH0gZWxzZSBpZiAoZS50YXJnZXQuY2xvc2VzdCgnZWRpdC10YXNrLW1vZGFsJykpIHtcbiAgICAgICAgICBtb2RhbCA9IGUudGFyZ2V0LmNsb3Nlc3QoJ2VkaXQtdGFzay1tb2RhbCcpLnBhcmVudEVsZW1lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgc3RlcHNMaXN0ID0gbW9kYWwucXVlcnlTZWxlY3RvcignLm1vZGFsLXN0ZXBzLWxpc3QnKTtcbiAgICAgICAgbmV3U3RlcEJ0biA9IG1vZGFsLnF1ZXJ5U2VsZWN0b3IoJy5hZGQtc3RlcC1idXR0b24nKTtcbiAgICAgICAgcmVuZGVyQ3JlYXRlU3RlcChlKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiB7IGNsZWFyQWxsU3RlcHMsIHJldmVhbFN0ZXBzLCBhZGROZXdTdGVwQnRuTGlzdGVuZXJzIH07XG59KSgpO1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLSBJbml0aWFsaXNlciBmdW5jdGlvblxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbmNvbnN0IGluaXRpYWxpc2VVSSA9ICgpID0+IHtcbiAgaGVhZGVyLmFkZEhlYWRlckxpc3RlbmVycygpO1xuXG4gIG5hdmJhci5yZW5kZXJDdXJyZW50TGlzdHMoKTtcbiAgbmF2YmFyLnNldEluYm94UHJvamVjdEluZGV4KCk7XG4gIG5hdmJhci5hZGROZXdMaXN0QnRuTGlzdGVuZXIoKTtcblxuICBtYWluLmluaXQoKTtcblxuICBhbGxNb2RhbHMuYWRkQ2xvc2VCdG5MaXN0ZW5lcnMoKTtcbiAgYWxsTW9kYWxzLmFkZENsb3NlQmFja2dyb3VuZExpc3RlbmVycygpO1xuXG4gIG5ld0xpc3RNb2RhbC5hZGRTdWJtaXRCdG5MaXN0ZW5lcigpO1xuICBlZGl0TGlzdE1vZGFsLmFkZEVkaXRCdG5MaXN0ZW5lcigpO1xuICBkZWxldGVMaXN0TW9kYWwuYWRkQ2FuY2VsQnRuTGlzdGVuZXIoKTtcbiAgZGVsZXRlTGlzdE1vZGFsLmFkZERlbGV0ZUJ0bkxpc3RlbmVyKCk7XG4gIG5ld1Rhc2tNb2RhbC5hZGROZXdUYXNrQnRuTElzdGVuZXIoKTtcblxuICBzdGVwc0NvbXBvbmVudC5hZGROZXdTdGVwQnRuTGlzdGVuZXJzKCk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBpbml0aWFsaXNlVUk7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IHByb2plY3RNYW5hZ2VyIH0gZnJvbSAnLi90b0RvTGlzdCc7XG5pbXBvcnQgaW5pdGlhbGlzZVVJIGZyb20gJy4vdWknO1xuXG5wcm9qZWN0TWFuYWdlci5pbml0aWFsaXNlKCk7XG5pbml0aWFsaXNlVUkoKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==