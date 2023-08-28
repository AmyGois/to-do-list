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

  - Steps component module

  - 'Delete task' modal module

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
  const navList = document.getElementById('nav-todo-lists');

  const setProjectDataIndex = (element, index) => {
    element.dataset.projectIndex = index;
  };

  const calculateNewProjectIndex = () => {
    const lists = navList.children;
    const newIndex = lists.length + 1;
    return newIndex;
  };

  const updateAllProjectIndices = () => {
    const currentLists = navList.children;
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
    const listToDelete = navList.querySelector(
      `[data-project-index='${listIndex}']`,
    ).parentElement;
    listToDelete.remove();
    updateAllProjectIndices();
  };

  const renderEditedList = (listIndex, project) => {
    const listToEdit = navList.querySelector(
      `a[data-project-index='${listIndex}']`,
    );
    listToEdit.textContent = project.title;
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
  const mainTasks = document.querySelector('main');
  const newTaskBtn = document.getElementById('main-new-task-button');
  const unfinishedDiv = document.querySelector('.unfinished-tasks');
  const finishedDiv = document.querySelector('.finished-tasks');

  /* Header section */
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

  const sendToFinishedDiv = (taskIndex) => {
    const taskToMove = unfinishedDiv.querySelector(
      `div[data-task-index='${taskIndex}']`,
    );
    finishedDiv.prepend(taskToMove);
  };

  const sendToUnfinishedDiv = (taskIndex) => {
    const taskToMove = finishedDiv.querySelector(
      `div[data-task-index='${taskIndex}']`,
    );
    unfinishedDiv.appendChild(taskToMove);
  };

  const toggleTaskStatus = (checkbox, projectIndex, taskIndex) => {
    if (checkbox.checked) {
      _toDoList__WEBPACK_IMPORTED_MODULE_0__.taskManager.editTaskStatus(projectIndex, taskIndex, 'done');
      sendToFinishedDiv(taskIndex);
    } else if (!checkbox.checked) {
      _toDoList__WEBPACK_IMPORTED_MODULE_0__.taskManager.editTaskStatus(projectIndex, taskIndex, 'to do');
      sendToUnfinishedDiv(taskIndex);
    }
  };

  const toggleStepStatus = (checkbox, projectIndex, taskIndex, stepIndex) => {
    if (checkbox.checked) {
      _toDoList__WEBPACK_IMPORTED_MODULE_0__.stepManager.editStepStatus(projectIndex, taskIndex, stepIndex, 'done');
    } else if (!checkbox.checked) {
      _toDoList__WEBPACK_IMPORTED_MODULE_0__.stepManager.editStepStatus(projectIndex, taskIndex, stepIndex, 'to do');
    }
  };

  const renderTaskContent = (projectIndex, taskIndex) => {
    const task = _toDoList__WEBPACK_IMPORTED_MODULE_0__.taskManager.revealTask(projectIndex, taskIndex);
    const taskItem = mainTasks
      .querySelector(`div[data-task-index='${taskIndex}']`)
      .querySelector('.task-item');
    const priorityLevel = taskItem.querySelector('.task-priority-level');
    const titleDiv = taskItem.querySelector('.task-title');
    const titleCheckbox = titleDiv.querySelector('input');
    const titleLabel = titleDiv.querySelector('label');
    const description = taskItem.querySelector('.task-description');
    const stepsList = taskItem.querySelector('.task-steps');

    switch (task.priority) {
      case 'low':
        taskItem.classList.add('priority-low');
        priorityLevel.textContent = 'Low';
        break;
      case 'medium':
        taskItem.classList.add('priority-medium');
        priorityLevel.textContent = 'Medium';
        break;
      case 'high':
        taskItem.classList.add('priority-high');
        priorityLevel.textContent = 'High';
        break;
      default:
        taskItem.classList.add('priority-none');
        priorityLevel.textContent = 'None';
        break;
    }
    if (task.status === 'to do') {
      titleCheckbox.checked = false;
    } else if (task.status === 'done') {
      titleCheckbox.checked = true;
    }
    titleLabel.textContent = task.title;
    description.textContent = task.description;
    task.steps.forEach((step) => {
      const listItem = document.createElement('li');
      const stepCheckbox = document.createElement('input');
      const stepLabel = document.createElement('label');
      const index = task.steps.indexOf(step);

      stepCheckbox.setAttribute('type', 'checkbox');
      stepCheckbox.setAttribute(
        'name',
        `project${projectIndex}-task${taskIndex}-step${index}`,
      );
      stepCheckbox.setAttribute(
        'id',
        `project${projectIndex}-task${taskIndex}-step${index}`,
      );
      if (step.status === 'to do') {
        stepCheckbox.checked = false;
      } else if (step.status === 'done') {
        stepCheckbox.checked = true;
      }
      stepCheckbox.dataset.projectIndex = projectIndex;
      stepCheckbox.dataset.taskIndex = taskIndex;
      stepCheckbox.dataset.stepIndex = index;
      stepLabel.setAttribute(
        'for',
        `project${projectIndex}-task${taskIndex}-step${index}`,
      );
      stepLabel.textContent = step.description;

      stepCheckbox.addEventListener('change', () =>
        toggleStepStatus(stepCheckbox, projectIndex, taskIndex, index),
      );

      listItem.appendChild(stepCheckbox);
      listItem.appendChild(stepLabel);
      stepsList.appendChild(listItem);
    });
    if (task.dueDate !== '') {
      const dateSpan = taskItem.querySelector('.task-info');
      const taskDueDate = taskItem.querySelector('.task-due-date');

      dateSpan.textContent = 'Due by: ';
      taskDueDate.textContent = task.dueDate;
    }
  };

  const toggleTaskDetails = (img, body) => {
    const btnImg = img.getAttribute('src');

    if (btnImg === './icons/drop_down.svg') {
      img.setAttribute('src', './icons/drop_down_left.svg');
    } else if (btnImg === './icons/drop_down_left.svg') {
      img.setAttribute('src', './icons/drop_down.svg');
    }
    toggleHidden(body);
  };

  const renderTask = (projectIndex, taskIndex) => {
    const taskRow = document.createElement('div');
    const taskItem = document.createElement('div');
    const taskItemHeader = document.createElement('div');
    const taskTitle = document.createElement('div');
    const titleCheckbox = document.createElement('input');
    const titleLabel = document.createElement('label');
    const taskItemReveal = document.createElement('div');
    const taskRevealBtn = document.createElement('button');
    const taskRevealImg = document.createElement('img');
    const taskItemBody = document.createElement('div');
    const taskDescription = document.createElement('p');
    const taskSteps = document.createElement('ul');
    const taskDateDiv = document.createElement('div');
    const dateSpan = document.createElement('span');
    const taskDueDate = document.createElement('span');
    const dateInfoSpan = document.createElement('span');
    const taskPriorityDiv = document.createElement('div');
    const prioritySpan = document.createElement('span');
    const taskPriorityLevel = document.createElement('span');
    const taskRowBtns = document.createElement('div');
    const editTaskBtn = document.createElement('button');
    const editTaskImg = document.createElement('img');
    const deleteTaskBtn = document.createElement('button');
    const deleteTaskImg = document.createElement('img');

    taskRow.classList.add('task-row');
    taskRow.dataset.projectIndex = projectIndex;
    taskRow.dataset.taskIndex = taskIndex;
    taskItem.classList.add('task-item');
    taskItemHeader.classList.add('task-item-header');
    taskTitle.classList.add('task-title');
    titleCheckbox.setAttribute('type', 'checkbox');
    titleCheckbox.setAttribute(
      'name',
      `project${projectIndex}-task${taskIndex}`,
    );
    titleCheckbox.setAttribute('id', `project${projectIndex}-task${taskIndex}`);
    titleCheckbox.dataset.projectIndex = projectIndex;
    titleCheckbox.dataset.taskIndex = taskIndex;
    titleLabel.setAttribute('for', `project${projectIndex}-task${taskIndex}`);
    taskItemReveal.classList.add('task-item-reveal');
    taskRevealBtn.classList.add('task-reveal-button');
    taskRevealImg.setAttribute('src', './icons/drop_down.svg');
    taskRevealImg.setAttribute('alt', 'show task details dropdown');
    taskItemBody.classList.add('task-item-body', 'hidden');
    taskDescription.classList.add('task-description');
    taskSteps.classList.add('task-steps');
    dateSpan.classList.add('task-info');
    taskDueDate.classList.add('task-due-date');
    dateInfoSpan.classList.add('task-date-info');
    prioritySpan.classList.add('task-info');
    prioritySpan.textContent = 'Priority: ';
    taskPriorityLevel.classList.add('task-priority-level');
    taskRowBtns.classList.add('task-row-buttons');
    editTaskImg.setAttribute('src', './icons/edit.svg');
    editTaskImg.setAttribute('alt', 'edit task button');
    editTaskBtn.dataset.projectIndex = projectIndex;
    editTaskBtn.dataset.taskIndex = taskIndex;
    deleteTaskImg.setAttribute('src', './icons/delete.svg');
    deleteTaskImg.setAttribute('alt', 'delete task button');
    deleteTaskBtn.dataset.projectIndex = projectIndex;
    deleteTaskBtn.dataset.taskIndex = taskIndex;

    unfinishedDiv.appendChild(taskRow);
    taskRow.appendChild(taskItem);
    taskItem.appendChild(taskItemHeader);
    taskItemHeader.appendChild(taskTitle);
    taskTitle.appendChild(titleCheckbox);
    taskTitle.appendChild(titleLabel);
    taskItemHeader.appendChild(taskItemReveal);
    taskItemReveal.appendChild(taskRevealBtn);
    taskRevealBtn.appendChild(taskRevealImg);
    taskItem.appendChild(taskItemBody);
    taskItemBody.appendChild(taskDescription);
    taskItemBody.appendChild(taskSteps);
    taskItemBody.appendChild(taskDateDiv);
    taskDateDiv.appendChild(dateSpan);
    taskDateDiv.appendChild(taskDueDate);
    taskDateDiv.appendChild(dateInfoSpan);
    taskItemBody.appendChild(taskPriorityDiv);
    taskPriorityDiv.appendChild(prioritySpan);
    taskPriorityDiv.appendChild(taskPriorityLevel);
    taskRow.appendChild(taskRowBtns);
    taskRowBtns.appendChild(editTaskBtn);
    editTaskBtn.appendChild(editTaskImg);
    taskRowBtns.appendChild(deleteTaskBtn);
    deleteTaskBtn.appendChild(deleteTaskImg);

    renderTaskContent(projectIndex, taskIndex);

    /* Add edit & delete listeners here */
    taskRevealBtn.addEventListener('click', () =>
      toggleTaskDetails(taskRevealImg, taskItemBody),
    );
    titleCheckbox.addEventListener('change', () =>
      toggleTaskStatus(titleCheckbox, projectIndex, taskIndex),
    );
    deleteTaskBtn.addEventListener('click', () =>
      deleteTaskModal.openDeleteModal(
        deleteTaskBtn.dataset.projectIndex,
        deleteTaskBtn.dataset.taskIndex,
      ),
    );

    if (titleCheckbox.checked) {
      sendToFinishedDiv(taskIndex);
    }
  };

  const updateTaskIndices = (deletedIndex) => {
    const allTaskIndices = mainTasks.querySelectorAll('[data-task-index]');
    allTaskIndices.forEach((element) => {
      const currentIndex = Number(element.dataset.taskIndex);
      if (currentIndex >= Number(deletedIndex)) {
        element.dataset.taskIndex = currentIndex - 1;
      }
    });
  };

  const renderDeletedTask = (taskIndex) => {
    const taskToDelete = mainTasks.querySelector(
      `div[data-task-index='${taskIndex}']`,
    );
    taskToDelete.remove();
    updateTaskIndices(taskIndex);
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
    addNewTaskBtnListener,
    clearTasks,
    renderTask,
    renderDeletedTask,
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
      main.renderTask(projectIndex, length - 1);
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
- 'Delete task' modal module
************************************************************** */
const deleteTaskModal = (() => {
  const modal = document.querySelector('.delete-task-modal').parentElement;
  const cancelBtn = modal.querySelector('.cancel-button');
  const deleteBtn = modal.querySelector('.delete-button');

  const setProjectDataIndex = (projectIndex) => {
    deleteBtn.dataset.projectIndex = projectIndex;
  };

  const setTaskDataIndex = (taskIndex) => {
    deleteBtn.dataset.taskIndex = taskIndex;
  };

  const openDeleteModal = (projectIndex, taskIndex) => {
    setProjectDataIndex(projectIndex);
    setTaskDataIndex(taskIndex);
    toggleHidden(modal);
  };

  const deleteTask = () => {
    const projectIndex = Number(deleteBtn.dataset.projectIndex);
    const taskIndex = Number(deleteBtn.dataset.taskIndex);
    _toDoList__WEBPACK_IMPORTED_MODULE_0__.taskManager.deleteTask(projectIndex, taskIndex);
    main.renderDeletedTask(taskIndex);
    toggleHidden(modal);
  };

  /* Functions to invoke on initilise, for the component to work properly */
  const addCancelBtnListener = () => {
    cancelBtn.addEventListener('click', () => toggleHidden(modal));
  };

  const addDeleteBtnListener = () => {
    deleteBtn.addEventListener('click', deleteTask);
  };
  return { openDeleteModal, addCancelBtnListener, addDeleteBtnListener };
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
  deleteTaskModal.addCancelBtnListener();
  deleteTaskModal.addDeleteBtnListener();

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsV0FBVztBQUNYLENBQUM7O0FBRUQsaUVBQWUsY0FBYyxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNuQjlCOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDdUM7O0FBRXZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEVBQUUsZ0RBQWM7QUFDaEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwyQkFBMkIsZ0RBQWM7QUFDekM7QUFDQTtBQUNBLE1BQU07QUFDTixzQkFBc0IsMkJBQTJCO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFbUQ7Ozs7Ozs7Ozs7Ozs7Ozs7QUNoV3BEOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ3NFOztBQUV0RTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsV0FBVztBQUNYLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwwQkFBMEIsV0FBVztBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsOEJBQThCLFVBQVU7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLCtCQUErQixVQUFVO0FBQ3pDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esa0JBQWtCLHFEQUFjO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0EsOEJBQThCLFVBQVU7QUFDeEM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw4QkFBOEIsVUFBVTtBQUN4QztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQU0sa0RBQVc7QUFDakI7QUFDQSxNQUFNO0FBQ04sTUFBTSxrREFBVztBQUNqQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQU0sa0RBQVc7QUFDakIsTUFBTTtBQUNOLE1BQU0sa0RBQVc7QUFDakI7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQixrREFBVztBQUM1QjtBQUNBLDZDQUE2QyxVQUFVO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixhQUFhLE9BQU8sVUFBVSxPQUFPLE1BQU07QUFDN0Q7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLGFBQWEsT0FBTyxVQUFVLE9BQU8sTUFBTTtBQUM3RDtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsYUFBYSxPQUFPLFVBQVUsT0FBTyxNQUFNO0FBQzdEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixhQUFhLE9BQU8sVUFBVTtBQUM5QztBQUNBLCtDQUErQyxhQUFhLE9BQU8sVUFBVTtBQUM3RTtBQUNBO0FBQ0EsNkNBQTZDLGFBQWEsT0FBTyxVQUFVO0FBQzNFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0EsOEJBQThCLFVBQVU7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHlCQUF5QixxREFBYztBQUN2QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQSxXQUFXO0FBQ1gsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLHNCQUFzQixxREFBYztBQUNwQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsV0FBVztBQUNYLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIscURBQWM7O0FBRXhDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBTSxxREFBYztBQUNwQixNQUFNLHFEQUFjO0FBQ3BCLHFDQUFxQyxxREFBYztBQUNuRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsV0FBVztBQUNYLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxJQUFJLHFEQUFjO0FBQ2xCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsV0FBVztBQUNYLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFNLGtEQUFXO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLHFEQUFjO0FBQ25DO0FBQ0EsUUFBUSxrREFBVztBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFdBQVc7QUFDWCxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaURBQWlELE1BQU07QUFDdkQsK0NBQStDLE1BQU07QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2Q0FBNkMsTUFBTTtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG1EQUFtRCxNQUFNO0FBQ3pELGlEQUFpRCxNQUFNO0FBQ3ZEO0FBQ0EsK0NBQStDLE1BQU07QUFDckQ7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7O0FBRUEsV0FBVztBQUNYLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUksa0RBQVc7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLGlFQUFlLFlBQVksRUFBQzs7Ozs7OztVQzU5QjVCO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7O0FDTjRDO0FBQ1o7O0FBRWhDLHFEQUFjO0FBQ2QsK0NBQVkiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90by1kby1saXN0Ly4vc3JjL3N0b3JhZ2UuanMiLCJ3ZWJwYWNrOi8vdG8tZG8tbGlzdC8uL3NyYy90b0RvTGlzdC5qcyIsIndlYnBhY2s6Ly90by1kby1saXN0Ly4vc3JjL3VpLmpzIiwid2VicGFjazovL3RvLWRvLWxpc3Qvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdG8tZG8tbGlzdC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vdG8tZG8tbGlzdC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3RvLWRvLWxpc3Qvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly90by1kby1saXN0Ly4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHN0b3JhZ2VNYW5hZ2VyID0gKCgpID0+IHtcbiAgLyogSW5pdGlhbCBmdW5jdGlvbiB0byBnZXQgYW55dGhpbmcgc2F2ZWQgaW4gbG9jYWxTdG9yYWdlICovXG4gIGNvbnN0IGdldFN0b3JhZ2UgPSAoKSA9PiB7XG4gICAgbGV0IHRvRG9MaXN0ID0gW107XG4gICAgaWYgKGxvY2FsU3RvcmFnZS50b0RvTGlzdCkge1xuICAgICAgdG9Eb0xpc3QgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0b0RvTGlzdCcpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdG9Eb0xpc3Q7XG4gIH07XG5cbiAgY29uc3Qgc2V0U3RvcmFnZSA9IChwcm9qZWN0cykgPT4ge1xuICAgIGNvbnN0IHRvRG9MaXN0ID0gSlNPTi5zdHJpbmdpZnkocHJvamVjdHMpO1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd0b0RvTGlzdCcsIHRvRG9MaXN0KTtcbiAgfTtcblxuICByZXR1cm4geyBnZXRTdG9yYWdlLCBzZXRTdG9yYWdlIH07XG59KSgpO1xuXG5leHBvcnQgZGVmYXVsdCBzdG9yYWdlTWFuYWdlcjtcbiIsIi8qIENvbnRlbnRzOlxuXG4gIC0gQ29uc3RydWN0b3JzIC0gVGFzaywgU3RlcCAmIFByb2plY3RcblxuICAtIEZ1bmN0aW9ucyB0byBkZWVwIGNsb25lIGFycmF5cyAmIG9iamVjdHMsICYgdXBkYXRlIGxvY2FsIHN0b3JhZ2VcblxuICAtIFByb2plY3QgTWFuYWdlclxuXG4gIC0gVGFzayBNYW5hZ2VyXG5cbiAgLSBTdGVwIE1hbmFnZXJcbiovXG5pbXBvcnQgc3RvcmFnZU1hbmFnZXIgZnJvbSAnLi9zdG9yYWdlJztcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi0gQ29uc3RydWN0b3JzIC0gVGFzaywgU3RlcCAmIFByb2plY3RcbiAgLSBTdGVwIGdvZXMgaW5zaWRlIFRhc2suc3RlcHNbXVxuICAtIFRhc2sgZ29lcyBpbnNpZGUgUHJvamVjdC50YXNrc1tdXG4gIC0gUHJvamVjdCBnb2VzIGluc2lkZSBwcm9qZWN0c1tdXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuY2xhc3MgVGFzayB7XG4gIGNvbnN0cnVjdG9yKHRpdGxlLCBkZXNjcmlwdGlvbiwgZHVlRGF0ZSwgcHJpb3JpdHksIHN0YXR1cykge1xuICAgIHRoaXMudGl0bGUgPSB0aXRsZTtcbiAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XG4gICAgdGhpcy5zdGVwcyA9IFtdO1xuICAgIHRoaXMuZHVlRGF0ZSA9IGR1ZURhdGU7XG4gICAgdGhpcy5wcmlvcml0eSA9IHByaW9yaXR5O1xuICAgIHRoaXMuc3RhdHVzID0gc3RhdHVzO1xuICB9XG59XG5cbmNsYXNzIFN0ZXAge1xuICBjb25zdHJ1Y3RvcihkZXNjcmlwdGlvbiwgc3RhdHVzKSB7XG4gICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xuICAgIHRoaXMuc3RhdHVzID0gc3RhdHVzO1xuICB9XG59XG5cbmNsYXNzIFByb2plY3Qge1xuICBjb25zdHJ1Y3Rvcih0aXRsZSwgZGVzY3JpcHRpb24pIHtcbiAgICB0aGlzLnRpdGxlID0gdGl0bGU7XG4gICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xuICAgIHRoaXMudGFza3MgPSBbXTtcbiAgfVxufVxuXG5jb25zdCBwcm9qZWN0cyA9IFtdO1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLSBGdW5jdGlvbnMgdG8gZGVlcCBjbG9uZSBhcnJheXMgJiBvYmplY3RzLCAmIHVwZGF0ZSBsb2NhbCBzdG9yYWdlXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuY29uc3QgZGVlcENvcHlBcnJheSA9IChhcnJheSkgPT4ge1xuICBjb25zdCBhcnJheUNvcHkgPSBbXTtcbiAgYXJyYXkuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgIGlmIChBcnJheS5pc0FycmF5KGl0ZW0pKSB7XG4gICAgICBhcnJheUNvcHkucHVzaChkZWVwQ29weUFycmF5KGl0ZW0pKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBpdGVtID09PSAnb2JqZWN0Jykge1xuICAgICAgYXJyYXlDb3B5LnB1c2goZGVlcENvcHlPYmplY3QoaXRlbSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcnJheUNvcHkucHVzaChpdGVtKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gYXJyYXlDb3B5O1xufTtcblxuY29uc3QgZGVlcENvcHlPYmplY3QgPSAob2JqZWN0KSA9PiB7XG4gIGNvbnN0IG9iamVjdENvcHkgPSB7fTtcbiAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMob2JqZWN0KSkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgb2JqZWN0Q29weVtrZXldID0gZGVlcENvcHlBcnJheSh2YWx1ZSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgICBvYmplY3RDb3B5W2tleV0gPSBkZWVwQ29weU9iamVjdCh2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9iamVjdENvcHlba2V5XSA9IHZhbHVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gb2JqZWN0Q29weTtcbn07XG5cbmNvbnN0IHNldFN0b3JhZ2UgPSAoKSA9PiB7XG4gIGNvbnN0IHByb2plY3RzQ29weSA9IGRlZXBDb3B5QXJyYXkocHJvamVjdHMpO1xuICBzdG9yYWdlTWFuYWdlci5zZXRTdG9yYWdlKHByb2plY3RzQ29weSk7XG59O1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLSBQcm9qZWN0IE1hbmFnZXJcbiAgLSBDcmVhdGUgYSBzYWZlIGNvcHkgb2YgYSBwcm9qZWN0ICYgb2YgdGhlIHByb2plY3RzIGFycmF5IGZvciBwdWJsaWMgdXNlXG4gIC0gQ3JlYXRlICYgZGVsZXRlIHByb2plY3RzXG4gIC0gRWRpdCBwcm9qZWN0IHRpdGxlcyAmIGRlc2NyaXB0aW9uc1xuICAtIEluaXRpYWxpc2UgYnkgY2hlY2tpbmcgZm9yIGxvY2FsbHkgc3RvcmVkIHByb2plY3RzXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuY29uc3QgcHJvamVjdE1hbmFnZXIgPSAoKCkgPT4ge1xuICBjb25zdCByZXZlYWxQcm9qZWN0ID0gKHByb2plY3RJbmRleCkgPT4ge1xuICAgIGNvbnN0IHByb2plY3RDb3B5ID0gZGVlcENvcHlPYmplY3QocHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldKTtcblxuICAgIHJldHVybiBwcm9qZWN0Q29weTtcbiAgfTtcblxuICBjb25zdCByZXZlYWxQcm9qZWN0VGFza3NMZW5ndGggPSAocHJvamVjdEluZGV4KSA9PiB7XG4gICAgY29uc3QgdGFza3NMZW5ndGggPSBwcm9qZWN0c1twcm9qZWN0SW5kZXhdLnRhc2tzLmxlbmd0aDtcbiAgICByZXR1cm4gdGFza3NMZW5ndGg7XG4gIH07XG5cbiAgY29uc3QgcmV2ZWFsQWxsUHJvamVjdHMgPSAoKSA9PiB7XG4gICAgY29uc3QgcHJvamVjdHNDb3B5ID0gZGVlcENvcHlBcnJheShwcm9qZWN0cyk7XG5cbiAgICByZXR1cm4gcHJvamVjdHNDb3B5O1xuICB9O1xuXG4gIGNvbnN0IGNyZWF0ZU5ld1Byb2plY3QgPSAodGl0bGUsIGRlc2NyaXB0aW9uKSA9PiB7XG4gICAgY29uc3QgbmV3UHJvamVjdCA9IG5ldyBQcm9qZWN0KHRpdGxlLCBkZXNjcmlwdGlvbik7XG4gICAgcHJvamVjdHMucHVzaChuZXdQcm9qZWN0KTtcblxuICAgIHNldFN0b3JhZ2UoKTtcbiAgICByZXR1cm4gcmV2ZWFsUHJvamVjdChwcm9qZWN0cy5sZW5ndGggLSAxKTtcbiAgfTtcblxuICBjb25zdCBkZWxldGVQcm9qZWN0ID0gKHByb2plY3RJbmRleCkgPT4ge1xuICAgIGNvbnN0IGluZGV4ID0gTnVtYmVyKHByb2plY3RJbmRleCk7XG4gICAgcHJvamVjdHMuc3BsaWNlKGluZGV4LCAxKTtcblxuICAgIHNldFN0b3JhZ2UoKTtcbiAgICByZXR1cm4gcmV2ZWFsQWxsUHJvamVjdHMoKTtcbiAgfTtcblxuICAvKiBNaWdodCBub3QgbmVlZCB0aGlzICovXG4gIGNvbnN0IGRlbGV0ZVByb2plY3RCeU5hbWUgPSAocHJvamVjdFRpdGxlKSA9PiB7XG4gICAgcHJvamVjdHMuZm9yRWFjaCgocHJvamVjdCkgPT4ge1xuICAgICAgaWYgKHByb2plY3QudGl0bGUgPT09IHByb2plY3RUaXRsZSkge1xuICAgICAgICBwcm9qZWN0cy5zcGxpY2UocHJvamVjdHMuaW5kZXhPZihwcm9qZWN0KSwgMSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBzZXRTdG9yYWdlKCk7XG4gICAgcmV0dXJuIHJldmVhbEFsbFByb2plY3RzKCk7XG4gIH07XG5cbiAgY29uc3QgZWRpdFByb2plY3RUaXRsZSA9IChwcm9qZWN0SW5kZXgsIG5ld1RpdGxlKSA9PiB7XG4gICAgcHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldLnRpdGxlID0gbmV3VGl0bGU7XG5cbiAgICBzZXRTdG9yYWdlKCk7XG4gICAgcmV0dXJuIHJldmVhbFByb2plY3QoTnVtYmVyKHByb2plY3RJbmRleCkpO1xuICB9O1xuXG4gIGNvbnN0IGVkaXRQcm9qZWN0RGVzY3JpcHRpb24gPSAocHJvamVjdEluZGV4LCBuZXdEZXNjcmlwdGlvbikgPT4ge1xuICAgIHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXS5kZXNjcmlwdGlvbiA9IG5ld0Rlc2NyaXB0aW9uO1xuXG4gICAgc2V0U3RvcmFnZSgpO1xuICAgIHJldHVybiByZXZlYWxQcm9qZWN0KE51bWJlcihwcm9qZWN0SW5kZXgpKTtcbiAgfTtcblxuICAvKiBUaGlzIHNob3VsZCBiZSB1c2VkIGF0IHRoZSBiZWdnaW5pbmcgb2YgdGhlIGNvZGUgdG8gc3RhcnQgdGhlIGFwcCBwcm9wZXJseSAqL1xuICBjb25zdCBpbml0aWFsaXNlID0gKCkgPT4ge1xuICAgIGNvbnN0IHN0b3JlZFByb2plY3RzID0gc3RvcmFnZU1hbmFnZXIuZ2V0U3RvcmFnZSgpO1xuICAgIGlmIChzdG9yZWRQcm9qZWN0cy5sZW5ndGggPT09IDApIHtcbiAgICAgIGNyZWF0ZU5ld1Byb2plY3QoJ0luYm94JywgJycpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0b3JlZFByb2plY3RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHByb2plY3RzLnB1c2goc3RvcmVkUHJvamVjdHNbaV0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmV2ZWFsQWxsUHJvamVjdHMoKTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIHJldmVhbFByb2plY3QsXG4gICAgcmV2ZWFsUHJvamVjdFRhc2tzTGVuZ3RoLFxuICAgIHJldmVhbEFsbFByb2plY3RzLFxuICAgIGNyZWF0ZU5ld1Byb2plY3QsXG4gICAgZGVsZXRlUHJvamVjdCxcbiAgICBkZWxldGVQcm9qZWN0QnlOYW1lLFxuICAgIGVkaXRQcm9qZWN0VGl0bGUsXG4gICAgZWRpdFByb2plY3REZXNjcmlwdGlvbixcbiAgICBpbml0aWFsaXNlLFxuICB9O1xufSkoKTtcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi0gVGFzayBNYW5hZ2VyXG4gIC0gQ3JlYXRlIGEgc2FmZSBjb3B5IG9mIGEgc2luZ2xlIHRhc2sgZm9yIHB1YmxpYyB1c2VcbiAgLSBDcmVhdGUgJiBkZWxldGUgdGFza3MgaW4gYSBwcm9qZWN0XG4gIC0gRWRpdCB0YXNrIHRpdGxlLCBkZXNjcmlwdGlvbiwgZHVlIGRhdGUsIHByaW9yaXR5ICYgc3RhdHVzXG4gIC0gU3Vic2NyaWJlIHRvIG1lZGlhdG9yIGV2ZW50c1xuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbmNvbnN0IHRhc2tNYW5hZ2VyID0gKCgpID0+IHtcbiAgY29uc3QgcmV2ZWFsVGFzayA9IChwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCkgPT4ge1xuICAgIGNvbnN0IHRhc2tDb3B5ID0gZGVlcENvcHlPYmplY3QoXG4gICAgICBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0udGFza3NbTnVtYmVyKHRhc2tJbmRleCldLFxuICAgICk7XG5cbiAgICByZXR1cm4gdGFza0NvcHk7XG4gIH07XG5cbiAgY29uc3QgY3JlYXRlTmV3VGFzayA9IChcbiAgICBwcm9qZWN0SW5kZXgsXG4gICAgdGl0bGUsXG4gICAgZGVzY3JpcHRpb24sXG4gICAgZHVlRGF0ZSxcbiAgICBwcmlvcml0eSxcbiAgICBzdGF0dXMsXG4gICkgPT4ge1xuICAgIGNvbnN0IHByb2plY3QgPSBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV07XG4gICAgcHJvamVjdC50YXNrcy5wdXNoKG5ldyBUYXNrKHRpdGxlLCBkZXNjcmlwdGlvbiwgZHVlRGF0ZSwgcHJpb3JpdHksIHN0YXR1cykpO1xuXG4gICAgc2V0U3RvcmFnZSgpO1xuICAgIHJldHVybiByZXZlYWxUYXNrKE51bWJlcihwcm9qZWN0SW5kZXgpLCBwcm9qZWN0LnRhc2tzLmxlbmd0aCAtIDEpO1xuICB9O1xuXG4gIGNvbnN0IGRlbGV0ZVRhc2sgPSAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgpID0+IHtcbiAgICBjb25zdCBwcm9qZWN0ID0gcHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldO1xuICAgIGNvbnN0IGluZGV4ID0gTnVtYmVyKHRhc2tJbmRleCk7XG4gICAgcHJvamVjdC50YXNrcy5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gICAgc2V0U3RvcmFnZSgpO1xuICAgIHJldHVybiBwcm9qZWN0TWFuYWdlci5yZXZlYWxQcm9qZWN0KE51bWJlcihwcm9qZWN0SW5kZXgpKTtcbiAgfTtcblxuICBjb25zdCBlZGl0VGFza1RpdGxlID0gKHByb2plY3RJbmRleCwgdGFza0luZGV4LCBuZXdUaXRsZSkgPT4ge1xuICAgIGNvbnN0IHRhc2sgPSBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0udGFza3NbTnVtYmVyKHRhc2tJbmRleCldO1xuICAgIHRhc2sudGl0bGUgPSBuZXdUaXRsZTtcblxuICAgIHNldFN0b3JhZ2UoKTtcbiAgICByZXR1cm4gcmV2ZWFsVGFzayhOdW1iZXIocHJvamVjdEluZGV4KSwgTnVtYmVyKHRhc2tJbmRleCkpO1xuICB9O1xuXG4gIGNvbnN0IGVkaXRUYXNrRGVzY3JpcHRpb24gPSAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgsIG5ld0Rlc2NyaXB0aW9uKSA9PiB7XG4gICAgY29uc3QgdGFzayA9IHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXS50YXNrc1tOdW1iZXIodGFza0luZGV4KV07XG4gICAgdGFzay5kZXNjcmlwdGlvbiA9IG5ld0Rlc2NyaXB0aW9uO1xuXG4gICAgc2V0U3RvcmFnZSgpO1xuICAgIHJldHVybiByZXZlYWxUYXNrKE51bWJlcihwcm9qZWN0SW5kZXgpLCBOdW1iZXIodGFza0luZGV4KSk7XG4gIH07XG5cbiAgY29uc3QgZWRpdFRhc2tEdWVEYXRlID0gKHByb2plY3RJbmRleCwgdGFza0luZGV4LCBuZXdEdWVEYXRlKSA9PiB7XG4gICAgY29uc3QgdGFzayA9IHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXS50YXNrc1tOdW1iZXIodGFza0luZGV4KV07XG4gICAgdGFzay5kdWVEYXRlID0gbmV3RHVlRGF0ZTtcblxuICAgIHNldFN0b3JhZ2UoKTtcbiAgICByZXR1cm4gcmV2ZWFsVGFzayhOdW1iZXIocHJvamVjdEluZGV4KSwgTnVtYmVyKHRhc2tJbmRleCkpO1xuICB9O1xuXG4gIGNvbnN0IGVkaXRUYXNrUHJpb3JpdHkgPSAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgsIG5ld1ByaW9yaXR5KSA9PiB7XG4gICAgY29uc3QgdGFzayA9IHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXS50YXNrc1tOdW1iZXIodGFza0luZGV4KV07XG4gICAgdGFzay5wcmlvcml0eSA9IG5ld1ByaW9yaXR5O1xuXG4gICAgc2V0U3RvcmFnZSgpO1xuICAgIHJldHVybiByZXZlYWxUYXNrKE51bWJlcihwcm9qZWN0SW5kZXgpLCBOdW1iZXIodGFza0luZGV4KSk7XG4gIH07XG5cbiAgY29uc3QgZWRpdFRhc2tTdGF0dXMgPSAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgsIG5ld1N0YXR1cykgPT4ge1xuICAgIGNvbnN0IHRhc2sgPSBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0udGFza3NbTnVtYmVyKHRhc2tJbmRleCldO1xuICAgIHRhc2suc3RhdHVzID0gbmV3U3RhdHVzO1xuXG4gICAgc2V0U3RvcmFnZSgpO1xuICAgIHJldHVybiByZXZlYWxUYXNrKE51bWJlcihwcm9qZWN0SW5kZXgpLCBOdW1iZXIodGFza0luZGV4KSk7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICByZXZlYWxUYXNrLFxuICAgIGNyZWF0ZU5ld1Rhc2ssXG4gICAgZGVsZXRlVGFzayxcbiAgICBlZGl0VGFza1RpdGxlLFxuICAgIGVkaXRUYXNrRGVzY3JpcHRpb24sXG4gICAgZWRpdFRhc2tEdWVEYXRlLFxuICAgIGVkaXRUYXNrUHJpb3JpdHksXG4gICAgZWRpdFRhc2tTdGF0dXMsXG4gIH07XG59KSgpO1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLSBTdGVwIE1hbmFnZXJcbiAgLSBDcmVhdGUgJiBkZWxldGUgc3RlcHMgaW4gYSB0YXNrXG4gIC0gRWRpdCBzdGVwIGRlc2NyaXB0aW9uICYgc3RhdHVzXG4gIC0gQ3JlYXRlIGEgc2ZlIGNvcHkgb2YgYSBzaW5nbGUgc3RlcCBmb3IgcHVibGljIHVzZVxuICAtIFN1YnNjcmliZSB0byBtZWRpYXRvciBldmVudHNcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5jb25zdCBzdGVwTWFuYWdlciA9ICgoKSA9PiB7XG4gIGNvbnN0IHJldmVhbFN0ZXAgPSAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgsIHN0ZXBJbmRleCkgPT4ge1xuICAgIGNvbnN0IHN0ZXBDb3B5ID0gZGVlcENvcHlPYmplY3QoXG4gICAgICBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0udGFza3NbTnVtYmVyKHRhc2tJbmRleCldLnN0ZXBzW1xuICAgICAgICBOdW1iZXIoc3RlcEluZGV4KVxuICAgICAgXSxcbiAgICApO1xuXG4gICAgcmV0dXJuIHN0ZXBDb3B5O1xuICB9O1xuXG4gIGNvbnN0IGNyZWF0ZU5ld1N0ZXAgPSAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgsIGRlc2NyaXB0aW9uLCBzdGF0dXMpID0+IHtcbiAgICBjb25zdCB0YXNrID0gcHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldLnRhc2tzW051bWJlcih0YXNrSW5kZXgpXTtcbiAgICB0YXNrLnN0ZXBzLnB1c2gobmV3IFN0ZXAoZGVzY3JpcHRpb24sIHN0YXR1cykpO1xuXG4gICAgc2V0U3RvcmFnZSgpO1xuICAgIHJldHVybiByZXZlYWxTdGVwKFxuICAgICAgTnVtYmVyKHByb2plY3RJbmRleCksXG4gICAgICBOdW1iZXIodGFza0luZGV4KSxcbiAgICAgIHRhc2suc3RlcHMubGVuZ3RoIC0gMSxcbiAgICApO1xuICB9O1xuXG4gIGNvbnN0IGRlbGV0ZVN0ZXAgPSAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgsIHN0ZXBJbmRleCkgPT4ge1xuICAgIGNvbnN0IHRhc2sgPSBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0udGFza3NbTnVtYmVyKHRhc2tJbmRleCldO1xuICAgIGNvbnN0IGluZGV4ID0gTnVtYmVyKHN0ZXBJbmRleCk7XG4gICAgdGFzay5zdGVwcy5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gICAgc2V0U3RvcmFnZSgpO1xuICAgIHJldHVybiB0YXNrTWFuYWdlci5yZXZlYWxUYXNrKE51bWJlcihwcm9qZWN0SW5kZXgpLCBOdW1iZXIodGFza0luZGV4KSk7XG4gIH07XG5cbiAgY29uc3QgZWRpdFN0ZXBEZXNjcmlwdGlvbiA9IChcbiAgICBwcm9qZWN0SW5kZXgsXG4gICAgdGFza0luZGV4LFxuICAgIHN0ZXBJbmRleCxcbiAgICBuZXdEZXNjcmlwdGlvbixcbiAgKSA9PiB7XG4gICAgY29uc3Qgc3RlcCA9XG4gICAgICBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0udGFza3NbTnVtYmVyKHRhc2tJbmRleCldLnN0ZXBzW1xuICAgICAgICBOdW1iZXIoc3RlcEluZGV4KVxuICAgICAgXTtcbiAgICBzdGVwLmRlc2NyaXB0aW9uID0gbmV3RGVzY3JpcHRpb247XG5cbiAgICBzZXRTdG9yYWdlKCk7XG4gICAgcmV0dXJuIHJldmVhbFN0ZXAoXG4gICAgICBOdW1iZXIocHJvamVjdEluZGV4KSxcbiAgICAgIE51bWJlcih0YXNrSW5kZXgpLFxuICAgICAgTnVtYmVyKHN0ZXBJbmRleCksXG4gICAgKTtcbiAgfTtcblxuICBjb25zdCBlZGl0U3RlcFN0YXR1cyA9IChwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCwgc3RlcEluZGV4LCBuZXdTdGF0dXMpID0+IHtcbiAgICBjb25zdCBzdGVwID1cbiAgICAgIHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXS50YXNrc1tOdW1iZXIodGFza0luZGV4KV0uc3RlcHNbXG4gICAgICAgIE51bWJlcihzdGVwSW5kZXgpXG4gICAgICBdO1xuICAgIHN0ZXAuc3RhdHVzID0gbmV3U3RhdHVzO1xuXG4gICAgc2V0U3RvcmFnZSgpO1xuICAgIHJldHVybiByZXZlYWxTdGVwKFxuICAgICAgTnVtYmVyKHByb2plY3RJbmRleCksXG4gICAgICBOdW1iZXIodGFza0luZGV4KSxcbiAgICAgIE51bWJlcihzdGVwSW5kZXgpLFxuICAgICk7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICByZXZlYWxTdGVwLFxuICAgIGNyZWF0ZU5ld1N0ZXAsXG4gICAgZGVsZXRlU3RlcCxcbiAgICBlZGl0U3RlcERlc2NyaXB0aW9uLFxuICAgIGVkaXRTdGVwU3RhdHVzLFxuICB9O1xufSkoKTtcblxuZXhwb3J0IHsgcHJvamVjdE1hbmFnZXIsIHRhc2tNYW5hZ2VyLCBzdGVwTWFuYWdlciB9O1xuIiwiLyogQ29udGVudHM6XG5cblx0LSBHZW5lcmFsXG5cblx0LSBIZWFkZXIgbW9kdWxlXG5cblx0LSBOYXZiYXIgbW9kdWxlXG5cbiAgLSBNYWluIG1vZHVsZVxuXHRcblx0LSBNb2R1bGUgdG8gY29udHJvbCB0aGluZ3MgY29tbW9uIG1vc3QgbW9kYWxzXG5cblx0LSAnTmV3IExpc3QnIG1vZGFsIG1vZHVsZVxuXG4gIC0gJ0RlbGV0ZSBsaXN0JyBtb2RhbCBtb2R1bGVcblxuICAtICdOZXcgdGFzaycgbW9kYWwgbW9kdWxlXG5cbiAgLSBTdGVwcyBjb21wb25lbnQgbW9kdWxlXG5cbiAgLSAnRGVsZXRlIHRhc2snIG1vZGFsIG1vZHVsZVxuXG5cdC0gSW5pdGlhbGlzZXIgZnVuY3Rpb25cbiovXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLSBHZW5lcmFsXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuaW1wb3J0IHsgcHJvamVjdE1hbmFnZXIsIHRhc2tNYW5hZ2VyLCBzdGVwTWFuYWdlciB9IGZyb20gJy4vdG9Eb0xpc3QnO1xuXG5jb25zdCB0b2dnbGVIaWRkZW4gPSAoZWxlbWVudCkgPT4ge1xuICBlbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoJ2hpZGRlbicpO1xufTtcbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4tIEhlYWRlciBtb2R1bGVcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5jb25zdCBoZWFkZXIgPSAoKCkgPT4ge1xuICAvKiBGdW5jdGlvbiB0byBpbnZva2Ugb24gaW5pdGlsaXNlLCBmb3IgdGhlIGNvbXBvbmVudCB0byB3b3JrIHByb3Blcmx5ICovXG4gIGNvbnN0IGFkZEhlYWRlckxpc3RlbmVycyA9ICgpID0+IHtcbiAgICBjb25zdCB0b2dnbGVOYXZCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndG9nZ2xlLW5hdi1idXR0b24nKTtcbiAgICBjb25zdCB0b2dnbGVBc2lkZUJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0b2dnbGUtYXNpZGUtYnV0dG9uJyk7XG4gICAgY29uc3QgbmF2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbmF2Jyk7XG4gICAgY29uc3QgYXNpZGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdhc2lkZScpO1xuXG4gICAgdG9nZ2xlTmF2QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gdG9nZ2xlSGlkZGVuKG5hdikpO1xuICAgIHRvZ2dsZUFzaWRlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gdG9nZ2xlSGlkZGVuKGFzaWRlKSk7XG4gIH07XG5cbiAgcmV0dXJuIHsgYWRkSGVhZGVyTGlzdGVuZXJzIH07XG59KSgpO1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLSBOYXZiYXIgbW9kdWxlXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuY29uc3QgbmF2YmFyID0gKCgpID0+IHtcbiAgY29uc3QgbmF2TGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduYXYtdG9kby1saXN0cycpO1xuXG4gIGNvbnN0IHNldFByb2plY3REYXRhSW5kZXggPSAoZWxlbWVudCwgaW5kZXgpID0+IHtcbiAgICBlbGVtZW50LmRhdGFzZXQucHJvamVjdEluZGV4ID0gaW5kZXg7XG4gIH07XG5cbiAgY29uc3QgY2FsY3VsYXRlTmV3UHJvamVjdEluZGV4ID0gKCkgPT4ge1xuICAgIGNvbnN0IGxpc3RzID0gbmF2TGlzdC5jaGlsZHJlbjtcbiAgICBjb25zdCBuZXdJbmRleCA9IGxpc3RzLmxlbmd0aCArIDE7XG4gICAgcmV0dXJuIG5ld0luZGV4O1xuICB9O1xuXG4gIGNvbnN0IHVwZGF0ZUFsbFByb2plY3RJbmRpY2VzID0gKCkgPT4ge1xuICAgIGNvbnN0IGN1cnJlbnRMaXN0cyA9IG5hdkxpc3QuY2hpbGRyZW47XG4gICAgbGV0IHVwZGF0ZWRJbmRleCA9IDE7XG4gICAgZm9yIChjb25zdCBsaXN0IG9mIGN1cnJlbnRMaXN0cykge1xuICAgICAgY29uc3QgbGluayA9IGxpc3QucXVlcnlTZWxlY3RvcignYScpO1xuICAgICAgY29uc3QgYnV0dG9ucyA9IGxpc3QucXVlcnlTZWxlY3RvckFsbCgnYnV0dG9uJyk7XG4gICAgICBsaW5rLmRhdGFzZXQucHJvamVjdEluZGV4ID0gdXBkYXRlZEluZGV4O1xuICAgICAgYnV0dG9ucy5mb3JFYWNoKChidXR0b24pID0+IHtcbiAgICAgICAgYnV0dG9uLmRhdGFzZXQucHJvamVjdEluZGV4ID0gdXBkYXRlZEluZGV4O1xuICAgICAgfSk7XG4gICAgICB1cGRhdGVkSW5kZXggKz0gMTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgcmVuZGVyTmV3TGlzdCA9IChsaXN0LCBsaXN0SW5kZXgpID0+IHtcbiAgICBjb25zdCBsaXN0SXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgY29uc3QgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjb25zdCBlZGl0QnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgY29uc3QgZWRpdEltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgIGNvbnN0IGRlbGV0ZUJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGNvbnN0IGRlbGV0ZUltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuXG4gICAgbGluay5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCAnIycpO1xuICAgIGxpbmsudGV4dENvbnRlbnQgPSBgJHtsaXN0LnRpdGxlfWA7XG4gICAgZGl2LmNsYXNzTGlzdC5hZGQoJ25hdi1saXN0LWJ1dHRvbnMnKTtcbiAgICBlZGl0SW1nLnNldEF0dHJpYnV0ZSgnc3JjJywgJy4vaWNvbnMvZWRpdC5zdmcnKTtcbiAgICBlZGl0SW1nLnNldEF0dHJpYnV0ZSgnYWx0JywgJ2J1dHRvbiB0byBlZGl0IGxpc3QnKTtcbiAgICBkZWxldGVJbWcuc2V0QXR0cmlidXRlKCdzcmMnLCAnLi9pY29ucy9kZWxldGUuc3ZnJyk7XG4gICAgZGVsZXRlSW1nLnNldEF0dHJpYnV0ZSgnYWx0JywgJ2J1dHRvbiB0byBkZWxldGUgbGlzdCcpO1xuXG4gICAgc2V0UHJvamVjdERhdGFJbmRleChsaW5rLCBsaXN0SW5kZXgpO1xuICAgIHNldFByb2plY3REYXRhSW5kZXgoZWRpdEJ0biwgbGlzdEluZGV4KTtcbiAgICBzZXRQcm9qZWN0RGF0YUluZGV4KGRlbGV0ZUJ0biwgbGlzdEluZGV4KTtcblxuICAgIGVkaXRCdG4uYXBwZW5kQ2hpbGQoZWRpdEltZyk7XG4gICAgZGVsZXRlQnRuLmFwcGVuZENoaWxkKGRlbGV0ZUltZyk7XG4gICAgZGl2LmFwcGVuZENoaWxkKGVkaXRCdG4pO1xuICAgIGRpdi5hcHBlbmRDaGlsZChkZWxldGVCdG4pO1xuICAgIGxpc3RJdGVtLmFwcGVuZENoaWxkKGxpbmspO1xuICAgIGxpc3RJdGVtLmFwcGVuZENoaWxkKGRpdik7XG4gICAgbmF2TGlzdC5hcHBlbmRDaGlsZChsaXN0SXRlbSk7XG5cbiAgICBlZGl0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT5cbiAgICAgIGVkaXRMaXN0TW9kYWwub3BlbkVkaXRNb2RhbChlZGl0QnRuLmRhdGFzZXQucHJvamVjdEluZGV4KSxcbiAgICApO1xuICAgIGRlbGV0ZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+XG4gICAgICBkZWxldGVMaXN0TW9kYWwub3BlbkRlbGV0ZU1vZGFsKGRlbGV0ZUJ0bi5kYXRhc2V0LnByb2plY3RJbmRleCksXG4gICAgKTtcbiAgfTtcblxuICBjb25zdCByZW5kZXJEZWxldGVkTGlzdCA9IChsaXN0SW5kZXgpID0+IHtcbiAgICBjb25zdCBsaXN0VG9EZWxldGUgPSBuYXZMaXN0LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICBgW2RhdGEtcHJvamVjdC1pbmRleD0nJHtsaXN0SW5kZXh9J11gLFxuICAgICkucGFyZW50RWxlbWVudDtcbiAgICBsaXN0VG9EZWxldGUucmVtb3ZlKCk7XG4gICAgdXBkYXRlQWxsUHJvamVjdEluZGljZXMoKTtcbiAgfTtcblxuICBjb25zdCByZW5kZXJFZGl0ZWRMaXN0ID0gKGxpc3RJbmRleCwgcHJvamVjdCkgPT4ge1xuICAgIGNvbnN0IGxpc3RUb0VkaXQgPSBuYXZMaXN0LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICBgYVtkYXRhLXByb2plY3QtaW5kZXg9JyR7bGlzdEluZGV4fSddYCxcbiAgICApO1xuICAgIGxpc3RUb0VkaXQudGV4dENvbnRlbnQgPSBwcm9qZWN0LnRpdGxlO1xuICB9O1xuXG4gIC8qIEZ1bmN0aW9ucyB0byBpbnZva2Ugb24gaW5pdGlsaXNlLCBmb3IgdGhlIGNvbXBvbmVudCB0byB3b3JrIHByb3Blcmx5ICovXG4gIGNvbnN0IHJlbmRlckN1cnJlbnRMaXN0cyA9ICgpID0+IHtcbiAgICBjb25zdCBsaXN0cyA9IHByb2plY3RNYW5hZ2VyLnJldmVhbEFsbFByb2plY3RzKCk7XG4gICAgbGlzdHMuZm9yRWFjaCgobGlzdCkgPT4ge1xuICAgICAgaWYgKGxpc3RzLmluZGV4T2YobGlzdCkgPiAwKSB7XG4gICAgICAgIHJlbmRlck5ld0xpc3QobGlzdCwgbGlzdHMuaW5kZXhPZihsaXN0KSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgY29uc3Qgc2V0SW5ib3hQcm9qZWN0SW5kZXggPSAoKSA9PiB7XG4gICAgY29uc3QgaW5ib3ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmF2LWxpc3QtaW5ib3gnKTtcbiAgICBzZXRQcm9qZWN0RGF0YUluZGV4KGluYm94LCAwKTtcbiAgfTtcblxuICBjb25zdCBhZGROZXdMaXN0QnRuTGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgY29uc3QgbmV3TGlzdEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uYXYtbmV3LWxpc3QtYnV0dG9uJyk7XG4gICAgY29uc3QgbW9kYWxOZXdMaXN0ID1cbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uZXctbGlzdC1tb2RhbCcpLnBhcmVudEVsZW1lbnQ7XG4gICAgbmV3TGlzdEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHRvZ2dsZUhpZGRlbihtb2RhbE5ld0xpc3QpKTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGNhbGN1bGF0ZU5ld1Byb2plY3RJbmRleCxcbiAgICByZW5kZXJOZXdMaXN0LFxuICAgIHJlbmRlckRlbGV0ZWRMaXN0LFxuICAgIHJlbmRlckVkaXRlZExpc3QsXG4gICAgcmVuZGVyQ3VycmVudExpc3RzLFxuICAgIHNldEluYm94UHJvamVjdEluZGV4LFxuICAgIGFkZE5ld0xpc3RCdG5MaXN0ZW5lcixcbiAgfTtcbn0pKCk7XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4tIE1haW4gbW9kdWxlXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuY29uc3QgbWFpbiA9ICgoKSA9PiB7XG4gIGNvbnN0IG1haW5UYXNrcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ21haW4nKTtcbiAgY29uc3QgbmV3VGFza0J0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluLW5ldy10YXNrLWJ1dHRvbicpO1xuICBjb25zdCB1bmZpbmlzaGVkRGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnVuZmluaXNoZWQtdGFza3MnKTtcbiAgY29uc3QgZmluaXNoZWREaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZmluaXNoZWQtdGFza3MnKTtcblxuICAvKiBIZWFkZXIgc2VjdGlvbiAqL1xuICBjb25zdCByZW5kZXJIZWFkZXIgPSAocHJvamVjdCkgPT4ge1xuICAgIGNvbnN0IGxpc3RUaXRsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluLWxpc3QtdGl0bGUnKTtcbiAgICBjb25zdCBsaXN0RGVzY3JpcHRpb24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbi1saXN0LWRlc2NyaXB0aW9uJyk7XG4gICAgbGlzdFRpdGxlLnRleHRDb250ZW50ID0gcHJvamVjdC50aXRsZTtcbiAgICBsaXN0RGVzY3JpcHRpb24udGV4dENvbnRlbnQgPSBwcm9qZWN0LmRlc2NyaXB0aW9uO1xuICB9O1xuXG4gIGNvbnN0IHNldE5ld1Rhc2tCdG5JbmRleCA9IChpbmRleCkgPT4ge1xuICAgIG5ld1Rhc2tCdG4uZGF0YXNldC5wcm9qZWN0SW5kZXggPSBpbmRleDtcbiAgfTtcblxuICBjb25zdCBhZGROZXdUYXNrQnRuTGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgbmV3VGFza0J0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+XG4gICAgICBuZXdUYXNrTW9kYWwub3Blbk5ld1Rhc2tNb2RhbChuZXdUYXNrQnRuLmRhdGFzZXQucHJvamVjdEluZGV4KSxcbiAgICApO1xuICB9O1xuXG4gIC8qIFRhc2tzIHNlY3Rpb24gKi9cbiAgY29uc3QgY2xlYXJUYXNrcyA9ICgpID0+IHtcbiAgICBjb25zdCB0YXNrR3JvdXBzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm1haW4tdGFza3MnKTtcbiAgICB0YXNrR3JvdXBzLmZvckVhY2goKHRhc2tHcm91cCkgPT4ge1xuICAgICAgdGFza0dyb3VwLmlubmVySFRNTCA9ICcnO1xuICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IHNlbmRUb0ZpbmlzaGVkRGl2ID0gKHRhc2tJbmRleCkgPT4ge1xuICAgIGNvbnN0IHRhc2tUb01vdmUgPSB1bmZpbmlzaGVkRGl2LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICBgZGl2W2RhdGEtdGFzay1pbmRleD0nJHt0YXNrSW5kZXh9J11gLFxuICAgICk7XG4gICAgZmluaXNoZWREaXYucHJlcGVuZCh0YXNrVG9Nb3ZlKTtcbiAgfTtcblxuICBjb25zdCBzZW5kVG9VbmZpbmlzaGVkRGl2ID0gKHRhc2tJbmRleCkgPT4ge1xuICAgIGNvbnN0IHRhc2tUb01vdmUgPSBmaW5pc2hlZERpdi5xdWVyeVNlbGVjdG9yKFxuICAgICAgYGRpdltkYXRhLXRhc2staW5kZXg9JyR7dGFza0luZGV4fSddYCxcbiAgICApO1xuICAgIHVuZmluaXNoZWREaXYuYXBwZW5kQ2hpbGQodGFza1RvTW92ZSk7XG4gIH07XG5cbiAgY29uc3QgdG9nZ2xlVGFza1N0YXR1cyA9IChjaGVja2JveCwgcHJvamVjdEluZGV4LCB0YXNrSW5kZXgpID0+IHtcbiAgICBpZiAoY2hlY2tib3guY2hlY2tlZCkge1xuICAgICAgdGFza01hbmFnZXIuZWRpdFRhc2tTdGF0dXMocHJvamVjdEluZGV4LCB0YXNrSW5kZXgsICdkb25lJyk7XG4gICAgICBzZW5kVG9GaW5pc2hlZERpdih0YXNrSW5kZXgpO1xuICAgIH0gZWxzZSBpZiAoIWNoZWNrYm94LmNoZWNrZWQpIHtcbiAgICAgIHRhc2tNYW5hZ2VyLmVkaXRUYXNrU3RhdHVzKHByb2plY3RJbmRleCwgdGFza0luZGV4LCAndG8gZG8nKTtcbiAgICAgIHNlbmRUb1VuZmluaXNoZWREaXYodGFza0luZGV4KTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgdG9nZ2xlU3RlcFN0YXR1cyA9IChjaGVja2JveCwgcHJvamVjdEluZGV4LCB0YXNrSW5kZXgsIHN0ZXBJbmRleCkgPT4ge1xuICAgIGlmIChjaGVja2JveC5jaGVja2VkKSB7XG4gICAgICBzdGVwTWFuYWdlci5lZGl0U3RlcFN0YXR1cyhwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCwgc3RlcEluZGV4LCAnZG9uZScpO1xuICAgIH0gZWxzZSBpZiAoIWNoZWNrYm94LmNoZWNrZWQpIHtcbiAgICAgIHN0ZXBNYW5hZ2VyLmVkaXRTdGVwU3RhdHVzKHByb2plY3RJbmRleCwgdGFza0luZGV4LCBzdGVwSW5kZXgsICd0byBkbycpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCByZW5kZXJUYXNrQ29udGVudCA9IChwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCkgPT4ge1xuICAgIGNvbnN0IHRhc2sgPSB0YXNrTWFuYWdlci5yZXZlYWxUYXNrKHByb2plY3RJbmRleCwgdGFza0luZGV4KTtcbiAgICBjb25zdCB0YXNrSXRlbSA9IG1haW5UYXNrc1xuICAgICAgLnF1ZXJ5U2VsZWN0b3IoYGRpdltkYXRhLXRhc2staW5kZXg9JyR7dGFza0luZGV4fSddYClcbiAgICAgIC5xdWVyeVNlbGVjdG9yKCcudGFzay1pdGVtJyk7XG4gICAgY29uc3QgcHJpb3JpdHlMZXZlbCA9IHRhc2tJdGVtLnF1ZXJ5U2VsZWN0b3IoJy50YXNrLXByaW9yaXR5LWxldmVsJyk7XG4gICAgY29uc3QgdGl0bGVEaXYgPSB0YXNrSXRlbS5xdWVyeVNlbGVjdG9yKCcudGFzay10aXRsZScpO1xuICAgIGNvbnN0IHRpdGxlQ2hlY2tib3ggPSB0aXRsZURpdi5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpO1xuICAgIGNvbnN0IHRpdGxlTGFiZWwgPSB0aXRsZURpdi5xdWVyeVNlbGVjdG9yKCdsYWJlbCcpO1xuICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gdGFza0l0ZW0ucXVlcnlTZWxlY3RvcignLnRhc2stZGVzY3JpcHRpb24nKTtcbiAgICBjb25zdCBzdGVwc0xpc3QgPSB0YXNrSXRlbS5xdWVyeVNlbGVjdG9yKCcudGFzay1zdGVwcycpO1xuXG4gICAgc3dpdGNoICh0YXNrLnByaW9yaXR5KSB7XG4gICAgICBjYXNlICdsb3cnOlxuICAgICAgICB0YXNrSXRlbS5jbGFzc0xpc3QuYWRkKCdwcmlvcml0eS1sb3cnKTtcbiAgICAgICAgcHJpb3JpdHlMZXZlbC50ZXh0Q29udGVudCA9ICdMb3cnO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21lZGl1bSc6XG4gICAgICAgIHRhc2tJdGVtLmNsYXNzTGlzdC5hZGQoJ3ByaW9yaXR5LW1lZGl1bScpO1xuICAgICAgICBwcmlvcml0eUxldmVsLnRleHRDb250ZW50ID0gJ01lZGl1bSc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnaGlnaCc6XG4gICAgICAgIHRhc2tJdGVtLmNsYXNzTGlzdC5hZGQoJ3ByaW9yaXR5LWhpZ2gnKTtcbiAgICAgICAgcHJpb3JpdHlMZXZlbC50ZXh0Q29udGVudCA9ICdIaWdoJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0YXNrSXRlbS5jbGFzc0xpc3QuYWRkKCdwcmlvcml0eS1ub25lJyk7XG4gICAgICAgIHByaW9yaXR5TGV2ZWwudGV4dENvbnRlbnQgPSAnTm9uZSc7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBpZiAodGFzay5zdGF0dXMgPT09ICd0byBkbycpIHtcbiAgICAgIHRpdGxlQ2hlY2tib3guY2hlY2tlZCA9IGZhbHNlO1xuICAgIH0gZWxzZSBpZiAodGFzay5zdGF0dXMgPT09ICdkb25lJykge1xuICAgICAgdGl0bGVDaGVja2JveC5jaGVja2VkID0gdHJ1ZTtcbiAgICB9XG4gICAgdGl0bGVMYWJlbC50ZXh0Q29udGVudCA9IHRhc2sudGl0bGU7XG4gICAgZGVzY3JpcHRpb24udGV4dENvbnRlbnQgPSB0YXNrLmRlc2NyaXB0aW9uO1xuICAgIHRhc2suc3RlcHMuZm9yRWFjaCgoc3RlcCkgPT4ge1xuICAgICAgY29uc3QgbGlzdEl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgY29uc3Qgc3RlcENoZWNrYm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICAgIGNvbnN0IHN0ZXBMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gICAgICBjb25zdCBpbmRleCA9IHRhc2suc3RlcHMuaW5kZXhPZihzdGVwKTtcblxuICAgICAgc3RlcENoZWNrYm94LnNldEF0dHJpYnV0ZSgndHlwZScsICdjaGVja2JveCcpO1xuICAgICAgc3RlcENoZWNrYm94LnNldEF0dHJpYnV0ZShcbiAgICAgICAgJ25hbWUnLFxuICAgICAgICBgcHJvamVjdCR7cHJvamVjdEluZGV4fS10YXNrJHt0YXNrSW5kZXh9LXN0ZXAke2luZGV4fWAsXG4gICAgICApO1xuICAgICAgc3RlcENoZWNrYm94LnNldEF0dHJpYnV0ZShcbiAgICAgICAgJ2lkJyxcbiAgICAgICAgYHByb2plY3Qke3Byb2plY3RJbmRleH0tdGFzayR7dGFza0luZGV4fS1zdGVwJHtpbmRleH1gLFxuICAgICAgKTtcbiAgICAgIGlmIChzdGVwLnN0YXR1cyA9PT0gJ3RvIGRvJykge1xuICAgICAgICBzdGVwQ2hlY2tib3guY2hlY2tlZCA9IGZhbHNlO1xuICAgICAgfSBlbHNlIGlmIChzdGVwLnN0YXR1cyA9PT0gJ2RvbmUnKSB7XG4gICAgICAgIHN0ZXBDaGVja2JveC5jaGVja2VkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHN0ZXBDaGVja2JveC5kYXRhc2V0LnByb2plY3RJbmRleCA9IHByb2plY3RJbmRleDtcbiAgICAgIHN0ZXBDaGVja2JveC5kYXRhc2V0LnRhc2tJbmRleCA9IHRhc2tJbmRleDtcbiAgICAgIHN0ZXBDaGVja2JveC5kYXRhc2V0LnN0ZXBJbmRleCA9IGluZGV4O1xuICAgICAgc3RlcExhYmVsLnNldEF0dHJpYnV0ZShcbiAgICAgICAgJ2ZvcicsXG4gICAgICAgIGBwcm9qZWN0JHtwcm9qZWN0SW5kZXh9LXRhc2ske3Rhc2tJbmRleH0tc3RlcCR7aW5kZXh9YCxcbiAgICAgICk7XG4gICAgICBzdGVwTGFiZWwudGV4dENvbnRlbnQgPSBzdGVwLmRlc2NyaXB0aW9uO1xuXG4gICAgICBzdGVwQ2hlY2tib3guYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKCkgPT5cbiAgICAgICAgdG9nZ2xlU3RlcFN0YXR1cyhzdGVwQ2hlY2tib3gsIHByb2plY3RJbmRleCwgdGFza0luZGV4LCBpbmRleCksXG4gICAgICApO1xuXG4gICAgICBsaXN0SXRlbS5hcHBlbmRDaGlsZChzdGVwQ2hlY2tib3gpO1xuICAgICAgbGlzdEl0ZW0uYXBwZW5kQ2hpbGQoc3RlcExhYmVsKTtcbiAgICAgIHN0ZXBzTGlzdC5hcHBlbmRDaGlsZChsaXN0SXRlbSk7XG4gICAgfSk7XG4gICAgaWYgKHRhc2suZHVlRGF0ZSAhPT0gJycpIHtcbiAgICAgIGNvbnN0IGRhdGVTcGFuID0gdGFza0l0ZW0ucXVlcnlTZWxlY3RvcignLnRhc2staW5mbycpO1xuICAgICAgY29uc3QgdGFza0R1ZURhdGUgPSB0YXNrSXRlbS5xdWVyeVNlbGVjdG9yKCcudGFzay1kdWUtZGF0ZScpO1xuXG4gICAgICBkYXRlU3Bhbi50ZXh0Q29udGVudCA9ICdEdWUgYnk6ICc7XG4gICAgICB0YXNrRHVlRGF0ZS50ZXh0Q29udGVudCA9IHRhc2suZHVlRGF0ZTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgdG9nZ2xlVGFza0RldGFpbHMgPSAoaW1nLCBib2R5KSA9PiB7XG4gICAgY29uc3QgYnRuSW1nID0gaW1nLmdldEF0dHJpYnV0ZSgnc3JjJyk7XG5cbiAgICBpZiAoYnRuSW1nID09PSAnLi9pY29ucy9kcm9wX2Rvd24uc3ZnJykge1xuICAgICAgaW1nLnNldEF0dHJpYnV0ZSgnc3JjJywgJy4vaWNvbnMvZHJvcF9kb3duX2xlZnQuc3ZnJyk7XG4gICAgfSBlbHNlIGlmIChidG5JbWcgPT09ICcuL2ljb25zL2Ryb3BfZG93bl9sZWZ0LnN2ZycpIHtcbiAgICAgIGltZy5zZXRBdHRyaWJ1dGUoJ3NyYycsICcuL2ljb25zL2Ryb3BfZG93bi5zdmcnKTtcbiAgICB9XG4gICAgdG9nZ2xlSGlkZGVuKGJvZHkpO1xuICB9O1xuXG4gIGNvbnN0IHJlbmRlclRhc2sgPSAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgpID0+IHtcbiAgICBjb25zdCB0YXNrUm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29uc3QgdGFza0l0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjb25zdCB0YXNrSXRlbUhlYWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbnN0IHRhc2tUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbnN0IHRpdGxlQ2hlY2tib3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIGNvbnN0IHRpdGxlTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICAgIGNvbnN0IHRhc2tJdGVtUmV2ZWFsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29uc3QgdGFza1JldmVhbEJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGNvbnN0IHRhc2tSZXZlYWxJbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICBjb25zdCB0YXNrSXRlbUJvZHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjb25zdCB0YXNrRGVzY3JpcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgY29uc3QgdGFza1N0ZXBzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcbiAgICBjb25zdCB0YXNrRGF0ZURpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbnN0IGRhdGVTcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIGNvbnN0IHRhc2tEdWVEYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIGNvbnN0IGRhdGVJbmZvU3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBjb25zdCB0YXNrUHJpb3JpdHlEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjb25zdCBwcmlvcml0eVNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgY29uc3QgdGFza1ByaW9yaXR5TGV2ZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgY29uc3QgdGFza1Jvd0J0bnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjb25zdCBlZGl0VGFza0J0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGNvbnN0IGVkaXRUYXNrSW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgY29uc3QgZGVsZXRlVGFza0J0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGNvbnN0IGRlbGV0ZVRhc2tJbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcblxuICAgIHRhc2tSb3cuY2xhc3NMaXN0LmFkZCgndGFzay1yb3cnKTtcbiAgICB0YXNrUm93LmRhdGFzZXQucHJvamVjdEluZGV4ID0gcHJvamVjdEluZGV4O1xuICAgIHRhc2tSb3cuZGF0YXNldC50YXNrSW5kZXggPSB0YXNrSW5kZXg7XG4gICAgdGFza0l0ZW0uY2xhc3NMaXN0LmFkZCgndGFzay1pdGVtJyk7XG4gICAgdGFza0l0ZW1IZWFkZXIuY2xhc3NMaXN0LmFkZCgndGFzay1pdGVtLWhlYWRlcicpO1xuICAgIHRhc2tUaXRsZS5jbGFzc0xpc3QuYWRkKCd0YXNrLXRpdGxlJyk7XG4gICAgdGl0bGVDaGVja2JveC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnY2hlY2tib3gnKTtcbiAgICB0aXRsZUNoZWNrYm94LnNldEF0dHJpYnV0ZShcbiAgICAgICduYW1lJyxcbiAgICAgIGBwcm9qZWN0JHtwcm9qZWN0SW5kZXh9LXRhc2ske3Rhc2tJbmRleH1gLFxuICAgICk7XG4gICAgdGl0bGVDaGVja2JveC5zZXRBdHRyaWJ1dGUoJ2lkJywgYHByb2plY3Qke3Byb2plY3RJbmRleH0tdGFzayR7dGFza0luZGV4fWApO1xuICAgIHRpdGxlQ2hlY2tib3guZGF0YXNldC5wcm9qZWN0SW5kZXggPSBwcm9qZWN0SW5kZXg7XG4gICAgdGl0bGVDaGVja2JveC5kYXRhc2V0LnRhc2tJbmRleCA9IHRhc2tJbmRleDtcbiAgICB0aXRsZUxhYmVsLnNldEF0dHJpYnV0ZSgnZm9yJywgYHByb2plY3Qke3Byb2plY3RJbmRleH0tdGFzayR7dGFza0luZGV4fWApO1xuICAgIHRhc2tJdGVtUmV2ZWFsLmNsYXNzTGlzdC5hZGQoJ3Rhc2staXRlbS1yZXZlYWwnKTtcbiAgICB0YXNrUmV2ZWFsQnRuLmNsYXNzTGlzdC5hZGQoJ3Rhc2stcmV2ZWFsLWJ1dHRvbicpO1xuICAgIHRhc2tSZXZlYWxJbWcuc2V0QXR0cmlidXRlKCdzcmMnLCAnLi9pY29ucy9kcm9wX2Rvd24uc3ZnJyk7XG4gICAgdGFza1JldmVhbEltZy5zZXRBdHRyaWJ1dGUoJ2FsdCcsICdzaG93IHRhc2sgZGV0YWlscyBkcm9wZG93bicpO1xuICAgIHRhc2tJdGVtQm9keS5jbGFzc0xpc3QuYWRkKCd0YXNrLWl0ZW0tYm9keScsICdoaWRkZW4nKTtcbiAgICB0YXNrRGVzY3JpcHRpb24uY2xhc3NMaXN0LmFkZCgndGFzay1kZXNjcmlwdGlvbicpO1xuICAgIHRhc2tTdGVwcy5jbGFzc0xpc3QuYWRkKCd0YXNrLXN0ZXBzJyk7XG4gICAgZGF0ZVNwYW4uY2xhc3NMaXN0LmFkZCgndGFzay1pbmZvJyk7XG4gICAgdGFza0R1ZURhdGUuY2xhc3NMaXN0LmFkZCgndGFzay1kdWUtZGF0ZScpO1xuICAgIGRhdGVJbmZvU3Bhbi5jbGFzc0xpc3QuYWRkKCd0YXNrLWRhdGUtaW5mbycpO1xuICAgIHByaW9yaXR5U3Bhbi5jbGFzc0xpc3QuYWRkKCd0YXNrLWluZm8nKTtcbiAgICBwcmlvcml0eVNwYW4udGV4dENvbnRlbnQgPSAnUHJpb3JpdHk6ICc7XG4gICAgdGFza1ByaW9yaXR5TGV2ZWwuY2xhc3NMaXN0LmFkZCgndGFzay1wcmlvcml0eS1sZXZlbCcpO1xuICAgIHRhc2tSb3dCdG5zLmNsYXNzTGlzdC5hZGQoJ3Rhc2stcm93LWJ1dHRvbnMnKTtcbiAgICBlZGl0VGFza0ltZy5zZXRBdHRyaWJ1dGUoJ3NyYycsICcuL2ljb25zL2VkaXQuc3ZnJyk7XG4gICAgZWRpdFRhc2tJbWcuc2V0QXR0cmlidXRlKCdhbHQnLCAnZWRpdCB0YXNrIGJ1dHRvbicpO1xuICAgIGVkaXRUYXNrQnRuLmRhdGFzZXQucHJvamVjdEluZGV4ID0gcHJvamVjdEluZGV4O1xuICAgIGVkaXRUYXNrQnRuLmRhdGFzZXQudGFza0luZGV4ID0gdGFza0luZGV4O1xuICAgIGRlbGV0ZVRhc2tJbWcuc2V0QXR0cmlidXRlKCdzcmMnLCAnLi9pY29ucy9kZWxldGUuc3ZnJyk7XG4gICAgZGVsZXRlVGFza0ltZy5zZXRBdHRyaWJ1dGUoJ2FsdCcsICdkZWxldGUgdGFzayBidXR0b24nKTtcbiAgICBkZWxldGVUYXNrQnRuLmRhdGFzZXQucHJvamVjdEluZGV4ID0gcHJvamVjdEluZGV4O1xuICAgIGRlbGV0ZVRhc2tCdG4uZGF0YXNldC50YXNrSW5kZXggPSB0YXNrSW5kZXg7XG5cbiAgICB1bmZpbmlzaGVkRGl2LmFwcGVuZENoaWxkKHRhc2tSb3cpO1xuICAgIHRhc2tSb3cuYXBwZW5kQ2hpbGQodGFza0l0ZW0pO1xuICAgIHRhc2tJdGVtLmFwcGVuZENoaWxkKHRhc2tJdGVtSGVhZGVyKTtcbiAgICB0YXNrSXRlbUhlYWRlci5hcHBlbmRDaGlsZCh0YXNrVGl0bGUpO1xuICAgIHRhc2tUaXRsZS5hcHBlbmRDaGlsZCh0aXRsZUNoZWNrYm94KTtcbiAgICB0YXNrVGl0bGUuYXBwZW5kQ2hpbGQodGl0bGVMYWJlbCk7XG4gICAgdGFza0l0ZW1IZWFkZXIuYXBwZW5kQ2hpbGQodGFza0l0ZW1SZXZlYWwpO1xuICAgIHRhc2tJdGVtUmV2ZWFsLmFwcGVuZENoaWxkKHRhc2tSZXZlYWxCdG4pO1xuICAgIHRhc2tSZXZlYWxCdG4uYXBwZW5kQ2hpbGQodGFza1JldmVhbEltZyk7XG4gICAgdGFza0l0ZW0uYXBwZW5kQ2hpbGQodGFza0l0ZW1Cb2R5KTtcbiAgICB0YXNrSXRlbUJvZHkuYXBwZW5kQ2hpbGQodGFza0Rlc2NyaXB0aW9uKTtcbiAgICB0YXNrSXRlbUJvZHkuYXBwZW5kQ2hpbGQodGFza1N0ZXBzKTtcbiAgICB0YXNrSXRlbUJvZHkuYXBwZW5kQ2hpbGQodGFza0RhdGVEaXYpO1xuICAgIHRhc2tEYXRlRGl2LmFwcGVuZENoaWxkKGRhdGVTcGFuKTtcbiAgICB0YXNrRGF0ZURpdi5hcHBlbmRDaGlsZCh0YXNrRHVlRGF0ZSk7XG4gICAgdGFza0RhdGVEaXYuYXBwZW5kQ2hpbGQoZGF0ZUluZm9TcGFuKTtcbiAgICB0YXNrSXRlbUJvZHkuYXBwZW5kQ2hpbGQodGFza1ByaW9yaXR5RGl2KTtcbiAgICB0YXNrUHJpb3JpdHlEaXYuYXBwZW5kQ2hpbGQocHJpb3JpdHlTcGFuKTtcbiAgICB0YXNrUHJpb3JpdHlEaXYuYXBwZW5kQ2hpbGQodGFza1ByaW9yaXR5TGV2ZWwpO1xuICAgIHRhc2tSb3cuYXBwZW5kQ2hpbGQodGFza1Jvd0J0bnMpO1xuICAgIHRhc2tSb3dCdG5zLmFwcGVuZENoaWxkKGVkaXRUYXNrQnRuKTtcbiAgICBlZGl0VGFza0J0bi5hcHBlbmRDaGlsZChlZGl0VGFza0ltZyk7XG4gICAgdGFza1Jvd0J0bnMuYXBwZW5kQ2hpbGQoZGVsZXRlVGFza0J0bik7XG4gICAgZGVsZXRlVGFza0J0bi5hcHBlbmRDaGlsZChkZWxldGVUYXNrSW1nKTtcblxuICAgIHJlbmRlclRhc2tDb250ZW50KHByb2plY3RJbmRleCwgdGFza0luZGV4KTtcblxuICAgIC8qIEFkZCBlZGl0ICYgZGVsZXRlIGxpc3RlbmVycyBoZXJlICovXG4gICAgdGFza1JldmVhbEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+XG4gICAgICB0b2dnbGVUYXNrRGV0YWlscyh0YXNrUmV2ZWFsSW1nLCB0YXNrSXRlbUJvZHkpLFxuICAgICk7XG4gICAgdGl0bGVDaGVja2JveC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoKSA9PlxuICAgICAgdG9nZ2xlVGFza1N0YXR1cyh0aXRsZUNoZWNrYm94LCBwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCksXG4gICAgKTtcbiAgICBkZWxldGVUYXNrQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT5cbiAgICAgIGRlbGV0ZVRhc2tNb2RhbC5vcGVuRGVsZXRlTW9kYWwoXG4gICAgICAgIGRlbGV0ZVRhc2tCdG4uZGF0YXNldC5wcm9qZWN0SW5kZXgsXG4gICAgICAgIGRlbGV0ZVRhc2tCdG4uZGF0YXNldC50YXNrSW5kZXgsXG4gICAgICApLFxuICAgICk7XG5cbiAgICBpZiAodGl0bGVDaGVja2JveC5jaGVja2VkKSB7XG4gICAgICBzZW5kVG9GaW5pc2hlZERpdih0YXNrSW5kZXgpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCB1cGRhdGVUYXNrSW5kaWNlcyA9IChkZWxldGVkSW5kZXgpID0+IHtcbiAgICBjb25zdCBhbGxUYXNrSW5kaWNlcyA9IG1haW5UYXNrcy5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS10YXNrLWluZGV4XScpO1xuICAgIGFsbFRhc2tJbmRpY2VzLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgIGNvbnN0IGN1cnJlbnRJbmRleCA9IE51bWJlcihlbGVtZW50LmRhdGFzZXQudGFza0luZGV4KTtcbiAgICAgIGlmIChjdXJyZW50SW5kZXggPj0gTnVtYmVyKGRlbGV0ZWRJbmRleCkpIHtcbiAgICAgICAgZWxlbWVudC5kYXRhc2V0LnRhc2tJbmRleCA9IGN1cnJlbnRJbmRleCAtIDE7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgY29uc3QgcmVuZGVyRGVsZXRlZFRhc2sgPSAodGFza0luZGV4KSA9PiB7XG4gICAgY29uc3QgdGFza1RvRGVsZXRlID0gbWFpblRhc2tzLnF1ZXJ5U2VsZWN0b3IoXG4gICAgICBgZGl2W2RhdGEtdGFzay1pbmRleD0nJHt0YXNrSW5kZXh9J11gLFxuICAgICk7XG4gICAgdGFza1RvRGVsZXRlLnJlbW92ZSgpO1xuICAgIHVwZGF0ZVRhc2tJbmRpY2VzKHRhc2tJbmRleCk7XG4gIH07XG5cbiAgLyogRnVuY3Rpb24gdG8gaW52b2tlIG9uIGluaXRpbGlzZSwgZm9yIHRoZSBjb21wb25lbnQgdG8gd29yayBwcm9wZXJseSAqL1xuICBjb25zdCBpbml0ID0gKCkgPT4ge1xuICAgIGNvbnN0IGZpcnN0UHJvamVjdCA9IHByb2plY3RNYW5hZ2VyLnJldmVhbFByb2plY3QoMCk7XG4gICAgcmVuZGVySGVhZGVyKGZpcnN0UHJvamVjdCk7XG4gICAgc2V0TmV3VGFza0J0bkluZGV4KDApO1xuICAgIGFkZE5ld1Rhc2tCdG5MaXN0ZW5lcigpO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgcmVuZGVySGVhZGVyLFxuICAgIHNldE5ld1Rhc2tCdG5JbmRleCxcbiAgICBhZGROZXdUYXNrQnRuTGlzdGVuZXIsXG4gICAgY2xlYXJUYXNrcyxcbiAgICByZW5kZXJUYXNrLFxuICAgIHJlbmRlckRlbGV0ZWRUYXNrLFxuICAgIGluaXQsXG4gIH07XG59KSgpO1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLSBNb2R1bGUgdG8gY29udHJvbCB0aGluZ3MgY29tbW9uIG1vc3QgbW9kYWxzXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuY29uc3QgYWxsTW9kYWxzID0gKCgpID0+IHtcbiAgLyogR2VuZXJhbCBmdW5jdGlvbnMgdG8gY2xvc2UgbW9kYWxzIGFuZCBjbGVhciBpbnB1dHMgKi9cbiAgY29uc3QgY2xlYXJJbnB1dHMgPSAobW9kYWwpID0+IHtcbiAgICBjb25zdCBpbnB1dHMgPSBtb2RhbC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dCcpO1xuICAgIGNvbnN0IHRleHRhcmVhcyA9IG1vZGFsLnF1ZXJ5U2VsZWN0b3JBbGwoJ3RleHRhcmVhJyk7XG4gICAgY29uc3Qgc2VsZWN0T3B0aW9uID0gbW9kYWwucXVlcnlTZWxlY3Rvcignb3B0aW9uJyk7XG4gICAgaWYgKGlucHV0cykge1xuICAgICAgaW5wdXRzLmZvckVhY2goKGlucHV0KSA9PiB7XG4gICAgICAgIGlucHV0LnZhbHVlID0gJyc7XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKHRleHRhcmVhcykge1xuICAgICAgdGV4dGFyZWFzLmZvckVhY2goKHRleHRhcmVhKSA9PiB7XG4gICAgICAgIHRleHRhcmVhLnZhbHVlID0gJyc7XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKHNlbGVjdE9wdGlvbikge1xuICAgICAgc2VsZWN0T3B0aW9uLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgY2xvc2VNb2RhbCA9IChtb2RhbCkgPT4ge1xuICAgIGNsZWFySW5wdXRzKG1vZGFsKTtcbiAgICB0b2dnbGVIaWRkZW4obW9kYWwpO1xuICB9O1xuXG4gIC8qIEZ1bmN0aW9ucyB0byBpbnZva2Ugb24gaW5pdGlsaXNlLCBmb3IgdGhlIGNvbXBvbmVudCB0byB3b3JrIHByb3Blcmx5ICovXG4gIGNvbnN0IGFkZENsb3NlQnRuTGlzdGVuZXJzID0gKCkgPT4ge1xuICAgIGNvbnN0IGNsb3NlTW9kYWxCdG5zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm1vZGFsLWNsb3NlLWJ1dHRvbicpO1xuXG4gICAgY2xvc2VNb2RhbEJ0bnMuZm9yRWFjaCgoYnRuKSA9PiB7XG4gICAgICBjb25zdCBtb2RhbCA9IGJ0bi5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudDtcbiAgICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IGNsb3NlTW9kYWwobW9kYWwpKTtcbiAgICB9KTtcbiAgfTtcblxuICBjb25zdCBhZGRDbG9zZUJhY2tncm91bmRMaXN0ZW5lcnMgPSAoKSA9PiB7XG4gICAgY29uc3QgbW9kYWxCYWNrZ3JvdW5kcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5tb2RhbC1iYWNrZ3JvdW5kJyk7XG4gICAgY29uc3QgY2xvc2UgPSAoZSwgbW9kYWxCYWNrZ3JvdW5kKSA9PiB7XG4gICAgICBpZiAoIWUudGFyZ2V0LmNsb3Nlc3QoJy5tb2RhbCcpKSB7XG4gICAgICAgIGNsb3NlTW9kYWwobW9kYWxCYWNrZ3JvdW5kKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgbW9kYWxCYWNrZ3JvdW5kcy5mb3JFYWNoKChiYWNrZ3JvdW5kKSA9PiB7XG4gICAgICBiYWNrZ3JvdW5kLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IGNsb3NlKGUsIGJhY2tncm91bmQpKTtcbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4geyBjbG9zZU1vZGFsLCBhZGRDbG9zZUJ0bkxpc3RlbmVycywgYWRkQ2xvc2VCYWNrZ3JvdW5kTGlzdGVuZXJzIH07XG59KSgpO1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLSAnTmV3IExpc3QnIG1vZGFsIG1vZHVsZVxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbmNvbnN0IG5ld0xpc3RNb2RhbCA9ICgoKSA9PiB7XG4gIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5ldy1saXN0LW1vZGFsJykucGFyZW50RWxlbWVudDtcbiAgY29uc3Qgc3VibWl0QnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25ldy1saXN0LXN1Ym1pdC1idXR0b24nKTtcblxuICBjb25zdCBjcmVhdE5ld0xpc3QgPSAoZSkgPT4ge1xuICAgIGNvbnN0IHRpdGxlSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmV3LWxpc3QtbmFtZScpLnZhbHVlO1xuICAgIGNvbnN0IGRlc2NyaXB0aW9uSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcbiAgICAgICduZXctbGlzdC1kZXNjcmlwdGlvbicsXG4gICAgKS52YWx1ZTtcblxuICAgIGlmICh0aXRsZUlucHV0ICE9PSAnJykge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICBjb25zdCBuZXdMaXN0ID0gcHJvamVjdE1hbmFnZXIuY3JlYXRlTmV3UHJvamVjdChcbiAgICAgICAgdGl0bGVJbnB1dCxcbiAgICAgICAgZGVzY3JpcHRpb25JbnB1dCxcbiAgICAgICk7XG4gICAgICBuYXZiYXIucmVuZGVyTmV3TGlzdChuZXdMaXN0LCBuYXZiYXIuY2FsY3VsYXRlTmV3UHJvamVjdEluZGV4KCkpO1xuXG4gICAgICBhbGxNb2RhbHMuY2xvc2VNb2RhbChtb2RhbCk7XG4gICAgfVxuICB9O1xuXG4gIC8qIEZ1bmN0aW9uIHRvIGludm9rZSBvbiBpbml0aWxpc2UsIGZvciB0aGUgY29tcG9uZW50IHRvIHdvcmsgcHJvcGVybHkgKi9cbiAgY29uc3QgYWRkU3VibWl0QnRuTGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgc3VibWl0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IGNyZWF0TmV3TGlzdChlKSk7XG4gIH07XG5cbiAgcmV0dXJuIHsgYWRkU3VibWl0QnRuTGlzdGVuZXIgfTtcbn0pKCk7XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4tICdFZGl0IGxpc3QnIG1vZGFsIG1vZHVsZVxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbmNvbnN0IGVkaXRMaXN0TW9kYWwgPSAoKCkgPT4ge1xuICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5lZGl0LWxpc3QtbW9kYWwnKS5wYXJlbnRFbGVtZW50O1xuICBjb25zdCBlZGl0QnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VkaXQtbGlzdC1zdWJtaXQtYnV0dG9uJyk7XG5cbiAgY29uc3Qgc2V0UHJvamVjdERhdGFJbmRleCA9IChwcm9qZWN0SW5kZXgpID0+IHtcbiAgICBlZGl0QnRuLmRhdGFzZXQucHJvamVjdEluZGV4ID0gcHJvamVjdEluZGV4O1xuICB9O1xuXG4gIGNvbnN0IG9wZW5FZGl0TW9kYWwgPSAocHJvamVjdEluZGV4KSA9PiB7XG4gICAgY29uc3QgdGl0bGVJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlZGl0LWxpc3QtbmFtZScpO1xuICAgIGNvbnN0IGRlc2NyaXB0aW9uSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZWRpdC1saXN0LWRlc2NyaXB0aW9uJyk7XG4gICAgY29uc3QgcHJvamVjdFRvRWRpdCA9IHByb2plY3RNYW5hZ2VyLnJldmVhbFByb2plY3QoTnVtYmVyKHByb2plY3RJbmRleCkpO1xuXG4gICAgdGl0bGVJbnB1dC52YWx1ZSA9IHByb2plY3RUb0VkaXQudGl0bGU7XG4gICAgZGVzY3JpcHRpb25JbnB1dC52YWx1ZSA9IHByb2plY3RUb0VkaXQuZGVzY3JpcHRpb247XG5cbiAgICBzZXRQcm9qZWN0RGF0YUluZGV4KHByb2plY3RJbmRleCk7XG4gICAgdG9nZ2xlSGlkZGVuKG1vZGFsKTtcbiAgfTtcblxuICBjb25zdCBlZGl0TGlzdCA9IChlKSA9PiB7XG4gICAgY29uc3QgdGl0bGVJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlZGl0LWxpc3QtbmFtZScpLnZhbHVlO1xuICAgIGNvbnN0IGRlc2NyaXB0aW9uSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcbiAgICAgICdlZGl0LWxpc3QtZGVzY3JpcHRpb24nLFxuICAgICkudmFsdWU7XG4gICAgY29uc3QgaW5kZXggPSBOdW1iZXIoZWRpdEJ0bi5kYXRhc2V0LnByb2plY3RJbmRleCk7XG5cbiAgICBpZiAodGl0bGVJbnB1dCAhPT0gJycpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHByb2plY3RNYW5hZ2VyLmVkaXRQcm9qZWN0VGl0bGUoaW5kZXgsIHRpdGxlSW5wdXQpO1xuICAgICAgcHJvamVjdE1hbmFnZXIuZWRpdFByb2plY3REZXNjcmlwdGlvbihpbmRleCwgZGVzY3JpcHRpb25JbnB1dCk7XG4gICAgICBuYXZiYXIucmVuZGVyRWRpdGVkTGlzdChpbmRleCwgcHJvamVjdE1hbmFnZXIucmV2ZWFsUHJvamVjdChpbmRleCkpO1xuICAgICAgYWxsTW9kYWxzLmNsb3NlTW9kYWwobW9kYWwpO1xuICAgIH1cbiAgfTtcblxuICAvKiBGdW5jdGlvbiB0byBpbnZva2Ugb24gaW5pdGlsaXNlLCBmb3IgdGhlIGNvbXBvbmVudCB0byB3b3JrIHByb3Blcmx5ICovXG4gIGNvbnN0IGFkZEVkaXRCdG5MaXN0ZW5lciA9ICgpID0+IHtcbiAgICBlZGl0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IGVkaXRMaXN0KGUpKTtcbiAgfTtcblxuICByZXR1cm4geyBvcGVuRWRpdE1vZGFsLCBhZGRFZGl0QnRuTGlzdGVuZXIgfTtcbn0pKCk7XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4tICdEZWxldGUgbGlzdCcgbW9kYWwgbW9kdWxlXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuY29uc3QgZGVsZXRlTGlzdE1vZGFsID0gKCgpID0+IHtcbiAgY29uc3QgbW9kYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZGVsZXRlLWxpc3QtbW9kYWwnKS5wYXJlbnRFbGVtZW50O1xuICBjb25zdCBjYW5jZWxCdG4gPSBtb2RhbC5xdWVyeVNlbGVjdG9yKCcuY2FuY2VsLWJ1dHRvbicpO1xuICBjb25zdCBkZWxldGVCdG4gPSBtb2RhbC5xdWVyeVNlbGVjdG9yKCcuZGVsZXRlLWJ1dHRvbicpO1xuXG4gIGNvbnN0IHNldFByb2plY3REYXRhSW5kZXggPSAocHJvamVjdEluZGV4KSA9PiB7XG4gICAgZGVsZXRlQnRuLmRhdGFzZXQucHJvamVjdEluZGV4ID0gcHJvamVjdEluZGV4O1xuICB9O1xuXG4gIGNvbnN0IG9wZW5EZWxldGVNb2RhbCA9IChwcm9qZWN0SW5kZXgpID0+IHtcbiAgICBzZXRQcm9qZWN0RGF0YUluZGV4KHByb2plY3RJbmRleCk7XG4gICAgdG9nZ2xlSGlkZGVuKG1vZGFsKTtcbiAgfTtcblxuICBjb25zdCBkZWxldGVMaXN0ID0gKCkgPT4ge1xuICAgIGNvbnN0IGluZGV4ID0gTnVtYmVyKGRlbGV0ZUJ0bi5kYXRhc2V0LnByb2plY3RJbmRleCk7XG4gICAgcHJvamVjdE1hbmFnZXIuZGVsZXRlUHJvamVjdChpbmRleCk7XG4gICAgbmF2YmFyLnJlbmRlckRlbGV0ZWRMaXN0KGluZGV4KTtcbiAgICB0b2dnbGVIaWRkZW4obW9kYWwpO1xuICB9O1xuXG4gIC8qIEZ1bmN0aW9ucyB0byBpbnZva2Ugb24gaW5pdGlsaXNlLCBmb3IgdGhlIGNvbXBvbmVudCB0byB3b3JrIHByb3Blcmx5ICovXG4gIGNvbnN0IGFkZENhbmNlbEJ0bkxpc3RlbmVyID0gKCkgPT4ge1xuICAgIGNhbmNlbEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHRvZ2dsZUhpZGRlbihtb2RhbCkpO1xuICB9O1xuXG4gIGNvbnN0IGFkZERlbGV0ZUJ0bkxpc3RlbmVyID0gKCkgPT4ge1xuICAgIGRlbGV0ZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGRlbGV0ZUxpc3QpO1xuICB9O1xuXG4gIHJldHVybiB7IG9wZW5EZWxldGVNb2RhbCwgYWRkQ2FuY2VsQnRuTGlzdGVuZXIsIGFkZERlbGV0ZUJ0bkxpc3RlbmVyIH07XG59KSgpO1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLSAnTmV3IHRhc2snIG1vZGFsIG1vZHVsZVxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbmNvbnN0IG5ld1Rhc2tNb2RhbCA9ICgoKSA9PiB7XG4gIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5ldy10YXNrLW1vZGFsJykucGFyZW50RWxlbWVudDtcbiAgY29uc3QgbmV3VGFza0J0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZXctdGFzay1zdWJtaXQtYnV0dG9uJyk7XG4gIGNvbnN0IHN0ZXBzTGlzdCA9IG1vZGFsLnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbC1zdGVwcy1saXN0Jyk7XG5cbiAgY29uc3Qgc2V0UHJvamVjdERhdGFJbmRleCA9IChwcm9qZWN0SW5kZXgpID0+IHtcbiAgICBuZXdUYXNrQnRuLmRhdGFzZXQucHJvamVjdEluZGV4ID0gcHJvamVjdEluZGV4O1xuICB9O1xuXG4gIGNvbnN0IG9wZW5OZXdUYXNrTW9kYWwgPSAocHJvamVjdEluZGV4KSA9PiB7XG4gICAgc2V0UHJvamVjdERhdGFJbmRleChwcm9qZWN0SW5kZXgpO1xuICAgIHN0ZXBzQ29tcG9uZW50LmNsZWFyQWxsU3RlcHMoc3RlcHNMaXN0KTtcbiAgICB0b2dnbGVIaWRkZW4obW9kYWwpO1xuICB9O1xuXG4gIGNvbnN0IHN1Ym1pdE5ld1Rhc2sgPSAoZSkgPT4ge1xuICAgIGNvbnN0IHByb2plY3RJbmRleCA9IE51bWJlcihuZXdUYXNrQnRuLmRhdGFzZXQucHJvamVjdEluZGV4KTtcbiAgICBjb25zdCBuZXdUaXRsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZXctdGFzay1uYW1lJykudmFsdWU7XG4gICAgY29uc3QgbmV3RGVzY3JpcHRpb24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcbiAgICAgICduZXctdGFzay1kZXNjcmlwdGlvbicsXG4gICAgKS52YWx1ZTtcbiAgICBjb25zdCBuZXdEYXRlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25ldy10YXNrLWRhdGUnKS52YWx1ZTtcbiAgICBjb25zdCBuZXdQcmlvcml0eSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZXctdGFzay1wcmlvcml0eScpLnZhbHVlO1xuICAgIGNvbnN0IG5ld1N0ZXBzID0gc3RlcHNDb21wb25lbnQucmV2ZWFsU3RlcHMoKTtcblxuICAgIGlmIChuZXdUaXRsZSAhPT0gJycpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHRhc2tNYW5hZ2VyLmNyZWF0ZU5ld1Rhc2soXG4gICAgICAgIHByb2plY3RJbmRleCxcbiAgICAgICAgbmV3VGl0bGUsXG4gICAgICAgIG5ld0Rlc2NyaXB0aW9uLFxuICAgICAgICBuZXdEYXRlLFxuICAgICAgICBuZXdQcmlvcml0eSxcbiAgICAgICAgJ3RvIGRvJyxcbiAgICAgICk7XG4gICAgICBjb25zdCBsZW5ndGggPSBwcm9qZWN0TWFuYWdlci5yZXZlYWxQcm9qZWN0VGFza3NMZW5ndGgocHJvamVjdEluZGV4KTtcbiAgICAgIG5ld1N0ZXBzLmZvckVhY2goKHN0ZXApID0+IHtcbiAgICAgICAgc3RlcE1hbmFnZXIuY3JlYXRlTmV3U3RlcChcbiAgICAgICAgICBwcm9qZWN0SW5kZXgsXG4gICAgICAgICAgbGVuZ3RoIC0gMSxcbiAgICAgICAgICBzdGVwLmRlc2NyaXB0aW9uLFxuICAgICAgICAgIHN0ZXAuc3RhdHVzLFxuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgICBtYWluLnJlbmRlclRhc2socHJvamVjdEluZGV4LCBsZW5ndGggLSAxKTtcbiAgICAgIGFsbE1vZGFscy5jbG9zZU1vZGFsKG1vZGFsKTtcbiAgICB9XG4gIH07XG5cbiAgLyogRnVuY3Rpb25zIHRvIGludm9rZSBvbiBpbml0aWxpc2UsIGZvciB0aGUgY29tcG9uZW50IHRvIHdvcmsgcHJvcGVybHkgKi9cbiAgY29uc3QgYWRkTmV3VGFza0J0bkxJc3RlbmVyID0gKCkgPT4ge1xuICAgIG5ld1Rhc2tCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4gc3VibWl0TmV3VGFzayhlKSk7XG4gIH07XG5cbiAgcmV0dXJuIHsgb3Blbk5ld1Rhc2tNb2RhbCwgYWRkTmV3VGFza0J0bkxJc3RlbmVyIH07XG59KSgpO1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLSBTdGVwcyBjb21wb25lbnQgbW9kdWxlXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuY29uc3Qgc3RlcHNDb21wb25lbnQgPSAoKCkgPT4ge1xuICBjb25zdCBuZXdTdGVwQnRucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hZGQtc3RlcC1idXR0b24nKTtcbiAgbGV0IG1vZGFsO1xuICBsZXQgc3RlcHNMaXN0O1xuICBsZXQgbmV3U3RlcEJ0bjtcbiAgY29uc3Qgc3RlcHMgPSBbXTtcblxuICBjb25zdCBjbGVhckFsbFN0ZXBzID0gKHVsKSA9PiB7XG4gICAgY29uc3QgdWxUb0NsZWFyID0gdWw7XG4gICAgc3RlcHMubGVuZ3RoID0gMDtcbiAgICB1bFRvQ2xlYXIuaW5uZXJIVE1MID0gJyc7XG4gIH07XG5cbiAgY29uc3QgcmV2ZWFsU3RlcHMgPSAoKSA9PiBzdGVwcztcblxuICBjb25zdCByZW5kZXJTdGVwID0gKGxpc3RJdGVtLCBzdGVwLCBpbmRleCkgPT4ge1xuICAgIGNvbnN0IGNoZWNrYm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICBjb25zdCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gICAgY29uc3QgZWRpdFN0ZXBCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBjb25zdCBlZGl0U3RlcEltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgIGNvbnN0IGRlbGV0ZVN0ZXBCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBjb25zdCBkZWxldGVTdGVwSW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG5cbiAgICBjaGVja2JveC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnY2hlY2tib3gnKTtcbiAgICBjaGVja2JveC5zZXRBdHRyaWJ1dGUoJ25hbWUnLCBgc3RlcC1zdGF0dXMtJHtpbmRleH1gKTtcbiAgICBjaGVja2JveC5zZXRBdHRyaWJ1dGUoJ2lkJywgYHN0ZXAtc3RhdHVzLSR7aW5kZXh9YCk7XG4gICAgY2hlY2tib3guZGF0YXNldC5zdGVwSW5kZXggPSBpbmRleDtcbiAgICBpZiAoc3RlcC5zdGF0dXMgPT09ICdkb25lJykge1xuICAgICAgY2hlY2tib3guY2hlY2tlZCA9IHRydWU7XG4gICAgfVxuICAgIGxhYmVsLnNldEF0dHJpYnV0ZSgnZm9yJywgYHN0ZXAtc3RhdHVzLSR7aW5kZXh9YCk7XG4gICAgbGFiZWwudGV4dENvbnRlbnQgPSBzdGVwLmRlc2NyaXB0aW9uO1xuICAgIGVkaXRTdGVwQnRuLmNsYXNzTGlzdC5hZGQoJ3N0ZXBzLWxpc3QtaXRlbS1idXR0b24nKTtcbiAgICBlZGl0U3RlcEJ0bi5kYXRhc2V0LnN0ZXBJbmRleCA9IGluZGV4O1xuICAgIGVkaXRTdGVwSW1nLnNldEF0dHJpYnV0ZSgnc3JjJywgJy4vaWNvbnMvZWRpdC5zdmcnKTtcbiAgICBlZGl0U3RlcEltZy5zZXRBdHRyaWJ1dGUoJ2FsdCcsICdlZGl0IHN0ZXAgYnV0dG9uJyk7XG4gICAgZGVsZXRlU3RlcEJ0bi5jbGFzc0xpc3QuYWRkKCdzdGVwcy1saXN0LWl0ZW0tYnV0dG9uJyk7XG4gICAgZGVsZXRlU3RlcEJ0bi5kYXRhc2V0LnN0ZXBJbmRleCA9IGluZGV4O1xuICAgIGRlbGV0ZVN0ZXBJbWcuc2V0QXR0cmlidXRlKCdzcmMnLCAnLi9pY29ucy9kZWxldGUuc3ZnJyk7XG4gICAgZGVsZXRlU3RlcEltZy5zZXRBdHRyaWJ1dGUoJ2FsdCcsICdkZWxldGUgc3RlcCBidXR0b24nKTtcblxuICAgIGNoZWNrYm94LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsICgpID0+XG4gICAgICB1cGRhdGVTdGVwU3RhdHVzKGNoZWNrYm94LmNoZWNrZWQsIE51bWJlcihjaGVja2JveC5kYXRhc2V0LnN0ZXBJbmRleCkpLFxuICAgICk7XG4gICAgZWRpdFN0ZXBCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXYpID0+XG4gICAgICByZW5kZXJFZGl0U3RlcChldiwgZWRpdFN0ZXBCdG4uZGF0YXNldC5zdGVwSW5kZXgpLFxuICAgICk7XG4gICAgZGVsZXRlU3RlcEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldikgPT5cbiAgICAgIGRlbGV0ZVN0ZXAoZXYsIGRlbGV0ZVN0ZXBCdG4uZGF0YXNldC5zdGVwSW5kZXgpLFxuICAgICk7XG5cbiAgICBsaXN0SXRlbS5hcHBlbmRDaGlsZChjaGVja2JveCk7XG4gICAgbGlzdEl0ZW0uYXBwZW5kQ2hpbGQobGFiZWwpO1xuICAgIGxpc3RJdGVtLmFwcGVuZENoaWxkKGVkaXRTdGVwQnRuKTtcbiAgICBlZGl0U3RlcEJ0bi5hcHBlbmRDaGlsZChlZGl0U3RlcEltZyk7XG4gICAgbGlzdEl0ZW0uYXBwZW5kQ2hpbGQoZGVsZXRlU3RlcEJ0bik7XG4gICAgZGVsZXRlU3RlcEJ0bi5hcHBlbmRDaGlsZChkZWxldGVTdGVwSW1nKTtcbiAgfTtcblxuICBjb25zdCB1cGRhdGVTdGVwSWRpY2VzID0gKCkgPT4ge1xuICAgIGNvbnN0IGFsbFN0ZXBzID0gc3RlcHNMaXN0LmNoaWxkcmVuO1xuICAgIGxldCBpbmRleCA9IDA7XG4gICAgZm9yIChjb25zdCBsaXN0SXRlbSBvZiBhbGxTdGVwcykge1xuICAgICAgY29uc3QgY2hlY2tib3ggPSBsaXN0SXRlbS5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpO1xuICAgICAgY29uc3QgbGFiZWwgPSBsaXN0SXRlbS5xdWVyeVNlbGVjdG9yKCdsYWJlbCcpO1xuICAgICAgY29uc3QgYnV0dG9ucyA9IGxpc3RJdGVtLnF1ZXJ5U2VsZWN0b3JBbGwoJy5zdGVwcy1saXN0LWl0ZW0tYnV0dG9uJyk7XG5cbiAgICAgIGNoZWNrYm94LnNldEF0dHJpYnV0ZSgnbmFtZScsIGBzdGVwLXN0YXR1cy0ke2luZGV4fWApO1xuICAgICAgY2hlY2tib3guc2V0QXR0cmlidXRlKCdpZCcsIGBzdGVwLXN0YXR1cy0ke2luZGV4fWApO1xuICAgICAgY2hlY2tib3guZGF0YXNldC5zdGVwSW5kZXggPSBpbmRleDtcbiAgICAgIGxhYmVsLnNldEF0dHJpYnV0ZSgnZm9yJywgYHN0ZXAtc3RhdHVzLSR7aW5kZXh9YCk7XG4gICAgICBidXR0b25zLmZvckVhY2goKGJ1dHRvbikgPT4ge1xuICAgICAgICBidXR0b24uZGF0YXNldC5zdGVwSW5kZXggPSBpbmRleDtcbiAgICAgIH0pO1xuICAgICAgaW5kZXggKz0gMTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgdXBkYXRlU3RlcFN0YXR1cyA9IChuZXdTdGF0dXMsIGluZGV4KSA9PiB7XG4gICAgaWYgKG5ld1N0YXR1cyA9PT0gdHJ1ZSkge1xuICAgICAgc3RlcHNbaW5kZXhdLnN0YXR1cyA9ICdkb25lJztcbiAgICB9IGVsc2UgaWYgKG5ld1N0YXR1cyA9PT0gZmFsc2UpIHtcbiAgICAgIHN0ZXBzW2luZGV4XS5zdGF0dXMgPSAndG8gZG8nO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBlZGl0U3RlcCA9IChlLCBzdGVwSW5kZXgsIGVkaXRlZFN0ZXBWYWx1ZSkgPT4ge1xuICAgIGNvbnN0IHN0ZXBUb0VkaXQgPSBlLnRhcmdldC5jbG9zZXN0KCdsaScpO1xuICAgIGNvbnN0IGlucHV0ID0gc3RlcFRvRWRpdC5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpO1xuICAgIGNvbnN0IHN1Ym1pdFN0ZXBCdG4gPSBpbnB1dC5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgY29uc3QgZWRpdFN0ZXBCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBjb25zdCBlZGl0U3RlcEltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgIGNvbnN0IGRlbGV0ZVN0ZXBCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBjb25zdCBkZWxldGVTdGVwSW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG5cbiAgICBpZiAoZWRpdGVkU3RlcFZhbHVlICE9PSAnJykge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIHN0ZXBzW3N0ZXBJbmRleF0uZGVzY3JpcHRpb24gPSBlZGl0ZWRTdGVwVmFsdWU7XG4gICAgICBpbnB1dC5yZW1vdmUoKTtcbiAgICAgIHN1Ym1pdFN0ZXBCdG4ucmVtb3ZlKCk7XG4gICAgICByZW5kZXJTdGVwKHN0ZXBUb0VkaXQsIHN0ZXBzW3N0ZXBJbmRleF0sIHN0ZXBJbmRleCk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IHJlbmRlckVkaXRTdGVwID0gKGV2LCBpbmRleCkgPT4ge1xuICAgIGNvbnN0IHN0ZXBJbmRleCA9IE51bWJlcihpbmRleCk7XG4gICAgY29uc3Qgc3RlcFRvRWRpdCA9IGV2LnRhcmdldC5jbG9zZXN0KCdsaScpO1xuICAgIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICBjb25zdCBzdWJtaXRTdGVwQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgY29uc3Qgc3VibWl0SW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG5cbiAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIHN0ZXBUb0VkaXQuaW5uZXJIVE1MID0gJyc7XG5cbiAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAndGV4dCcpO1xuICAgIGlucHV0LnNldEF0dHJpYnV0ZSgnbmFtZScsICdtb2RhbC1lZGl0LXN0ZXAnKTtcbiAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoJ2lkJywgJ21vZGFsLWVkaXQtc3RlcCcpO1xuICAgIGlucHV0LnJlcXVpcmVkID0gdHJ1ZTtcbiAgICBpbnB1dC52YWx1ZSA9IHN0ZXBzW3N0ZXBJbmRleF0uZGVzY3JpcHRpb247XG4gICAgc3VibWl0U3RlcEJ0bi50ZXh0Q29udGVudCA9ICdBbHRlciBzdGVwJztcbiAgICBzdWJtaXRJbWcuc2V0QXR0cmlidXRlKCdzcmMnLCAnLi9pY29ucy9jb25maXJtLnN2ZycpO1xuICAgIHN1Ym1pdEltZy5zZXRBdHRyaWJ1dGUoJ2FsdCcsICdjb25maXJtIGVkaXQgYnV0dG9uJyk7XG5cbiAgICBzdGVwVG9FZGl0LmFwcGVuZENoaWxkKGlucHV0KTtcbiAgICBzdGVwVG9FZGl0LmFwcGVuZENoaWxkKHN1Ym1pdFN0ZXBCdG4pO1xuICAgIHN1Ym1pdFN0ZXBCdG4uYXBwZW5kQ2hpbGQoc3VibWl0SW1nKTtcblxuICAgIHN1Ym1pdFN0ZXBCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT5cbiAgICAgIGVkaXRTdGVwKGUsIHN0ZXBJbmRleCwgaW5wdXQudmFsdWUpLFxuICAgICk7XG4gIH07XG5cbiAgY29uc3QgZGVsZXRlU3RlcCA9IChldiwgaW5kZXgpID0+IHtcbiAgICBjb25zdCBzdGVwSW5kZXggPSBOdW1iZXIoaW5kZXgpO1xuICAgIGNvbnN0IHN0ZXBUb0RlbGV0ZSA9IGV2LnRhcmdldC5jbG9zZXN0KCdsaScpO1xuXG4gICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBzdGVwcy5zcGxpY2Uoc3RlcEluZGV4LCAxKTtcbiAgICBzdGVwVG9EZWxldGUucmVtb3ZlKCk7XG4gICAgdXBkYXRlU3RlcElkaWNlcygpO1xuICB9O1xuXG4gIGNvbnN0IGFkZFN0ZXAgPSAoZXZ0KSA9PiB7XG4gICAgY29uc3QgbmV3U3RlcERlc2NyaXB0aW9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGFsLWFkZC1zdGVwJyk7XG4gICAgY29uc3Qgc3RlcENyZWF0b3IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kYWwtYWRkLXN0ZXAnKS5wYXJlbnRFbGVtZW50O1xuICAgIGNvbnN0IHN0ZXBzTGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbC1zdGVwcy1saXN0Jyk7XG5cbiAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgaWYgKG5ld1N0ZXBEZXNjcmlwdGlvbi52YWx1ZSAhPT0gJycpIHtcbiAgICAgIGNvbnN0IHN0ZXAgPSB7XG4gICAgICAgIGRlc2NyaXB0aW9uOiBuZXdTdGVwRGVzY3JpcHRpb24udmFsdWUsXG4gICAgICAgIHN0YXR1czogJ3RvIGRvJyxcbiAgICAgIH07XG4gICAgICBjb25zdCBsaXN0SXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG5cbiAgICAgIHN0ZXBzLnB1c2goc3RlcCk7XG4gICAgICBzdGVwc0xpc3QuYXBwZW5kQ2hpbGQobGlzdEl0ZW0pO1xuICAgICAgcmVuZGVyU3RlcChsaXN0SXRlbSwgc3RlcHNbc3RlcHMubGVuZ3RoIC0gMV0sIHN0ZXBzLmxlbmd0aCAtIDEpO1xuICAgIH1cbiAgICB0b2dnbGVIaWRkZW4obmV3U3RlcEJ0bik7XG4gICAgc3RlcENyZWF0b3IucmVtb3ZlKCk7XG4gIH07XG5cbiAgY29uc3QgcmVuZGVyQ3JlYXRlU3RlcCA9IChlKSA9PiB7XG4gICAgY29uc3QgbGlzdEl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICBjb25zdCBzdWJtaXRTdGVwQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgY29uc3Qgc3VibWl0SW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG5cbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgaW5wdXQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQnKTtcbiAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoJ25hbWUnLCAnbW9kYWwtYWRkLXN0ZXAnKTtcbiAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoJ2lkJywgJ21vZGFsLWFkZC1zdGVwJyk7XG4gICAgc3VibWl0U3RlcEJ0bi50ZXh0Q29udGVudCA9ICdBZGQgc3RlcCc7XG4gICAgc3VibWl0SW1nLnNldEF0dHJpYnV0ZSgnc3JjJywgJy4vaWNvbnMvY29uZmlybS5zdmcnKTtcbiAgICBzdWJtaXRJbWcuc2V0QXR0cmlidXRlKCdhbHQnLCAnY29uZmlybSBzdGVwIGJ1dHRvbicpO1xuXG4gICAgc3VibWl0U3RlcEJ0bi5hcHBlbmRDaGlsZChzdWJtaXRJbWcpO1xuICAgIGxpc3RJdGVtLmFwcGVuZENoaWxkKGlucHV0KTtcbiAgICBsaXN0SXRlbS5hcHBlbmRDaGlsZChzdWJtaXRTdGVwQnRuKTtcbiAgICBzdGVwc0xpc3QuYXBwZW5kQ2hpbGQobGlzdEl0ZW0pO1xuXG4gICAgc3VibWl0U3RlcEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldnQpID0+IGFkZFN0ZXAoZXZ0KSk7XG4gICAgdG9nZ2xlSGlkZGVuKG5ld1N0ZXBCdG4pO1xuICB9O1xuXG4gIC8qIEZ1bmN0aW9uIHRvIGludm9rZSBvbiBpbml0aWxpc2UsIGZvciB0aGUgY29tcG9uZW50IHRvIHdvcmsgcHJvcGVybHkgKi9cbiAgY29uc3QgYWRkTmV3U3RlcEJ0bkxpc3RlbmVycyA9ICgpID0+IHtcbiAgICBuZXdTdGVwQnRucy5mb3JFYWNoKChidG4pID0+IHtcbiAgICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgIGlmIChlLnRhcmdldC5jbG9zZXN0KCcubmV3LXRhc2stbW9kYWwnKSkge1xuICAgICAgICAgIG1vZGFsID0gZS50YXJnZXQuY2xvc2VzdCgnLm5ldy10YXNrLW1vZGFsJykucGFyZW50RWxlbWVudDtcbiAgICAgICAgfSBlbHNlIGlmIChlLnRhcmdldC5jbG9zZXN0KCdlZGl0LXRhc2stbW9kYWwnKSkge1xuICAgICAgICAgIG1vZGFsID0gZS50YXJnZXQuY2xvc2VzdCgnZWRpdC10YXNrLW1vZGFsJykucGFyZW50RWxlbWVudDtcbiAgICAgICAgfVxuICAgICAgICBzdGVwc0xpc3QgPSBtb2RhbC5xdWVyeVNlbGVjdG9yKCcubW9kYWwtc3RlcHMtbGlzdCcpO1xuICAgICAgICBuZXdTdGVwQnRuID0gbW9kYWwucXVlcnlTZWxlY3RvcignLmFkZC1zdGVwLWJ1dHRvbicpO1xuICAgICAgICByZW5kZXJDcmVhdGVTdGVwKGUpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG5cbiAgcmV0dXJuIHsgY2xlYXJBbGxTdGVwcywgcmV2ZWFsU3RlcHMsIGFkZE5ld1N0ZXBCdG5MaXN0ZW5lcnMgfTtcbn0pKCk7XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4tICdEZWxldGUgdGFzaycgbW9kYWwgbW9kdWxlXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuY29uc3QgZGVsZXRlVGFza01vZGFsID0gKCgpID0+IHtcbiAgY29uc3QgbW9kYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZGVsZXRlLXRhc2stbW9kYWwnKS5wYXJlbnRFbGVtZW50O1xuICBjb25zdCBjYW5jZWxCdG4gPSBtb2RhbC5xdWVyeVNlbGVjdG9yKCcuY2FuY2VsLWJ1dHRvbicpO1xuICBjb25zdCBkZWxldGVCdG4gPSBtb2RhbC5xdWVyeVNlbGVjdG9yKCcuZGVsZXRlLWJ1dHRvbicpO1xuXG4gIGNvbnN0IHNldFByb2plY3REYXRhSW5kZXggPSAocHJvamVjdEluZGV4KSA9PiB7XG4gICAgZGVsZXRlQnRuLmRhdGFzZXQucHJvamVjdEluZGV4ID0gcHJvamVjdEluZGV4O1xuICB9O1xuXG4gIGNvbnN0IHNldFRhc2tEYXRhSW5kZXggPSAodGFza0luZGV4KSA9PiB7XG4gICAgZGVsZXRlQnRuLmRhdGFzZXQudGFza0luZGV4ID0gdGFza0luZGV4O1xuICB9O1xuXG4gIGNvbnN0IG9wZW5EZWxldGVNb2RhbCA9IChwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCkgPT4ge1xuICAgIHNldFByb2plY3REYXRhSW5kZXgocHJvamVjdEluZGV4KTtcbiAgICBzZXRUYXNrRGF0YUluZGV4KHRhc2tJbmRleCk7XG4gICAgdG9nZ2xlSGlkZGVuKG1vZGFsKTtcbiAgfTtcblxuICBjb25zdCBkZWxldGVUYXNrID0gKCkgPT4ge1xuICAgIGNvbnN0IHByb2plY3RJbmRleCA9IE51bWJlcihkZWxldGVCdG4uZGF0YXNldC5wcm9qZWN0SW5kZXgpO1xuICAgIGNvbnN0IHRhc2tJbmRleCA9IE51bWJlcihkZWxldGVCdG4uZGF0YXNldC50YXNrSW5kZXgpO1xuICAgIHRhc2tNYW5hZ2VyLmRlbGV0ZVRhc2socHJvamVjdEluZGV4LCB0YXNrSW5kZXgpO1xuICAgIG1haW4ucmVuZGVyRGVsZXRlZFRhc2sodGFza0luZGV4KTtcbiAgICB0b2dnbGVIaWRkZW4obW9kYWwpO1xuICB9O1xuXG4gIC8qIEZ1bmN0aW9ucyB0byBpbnZva2Ugb24gaW5pdGlsaXNlLCBmb3IgdGhlIGNvbXBvbmVudCB0byB3b3JrIHByb3Blcmx5ICovXG4gIGNvbnN0IGFkZENhbmNlbEJ0bkxpc3RlbmVyID0gKCkgPT4ge1xuICAgIGNhbmNlbEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHRvZ2dsZUhpZGRlbihtb2RhbCkpO1xuICB9O1xuXG4gIGNvbnN0IGFkZERlbGV0ZUJ0bkxpc3RlbmVyID0gKCkgPT4ge1xuICAgIGRlbGV0ZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGRlbGV0ZVRhc2spO1xuICB9O1xuICByZXR1cm4geyBvcGVuRGVsZXRlTW9kYWwsIGFkZENhbmNlbEJ0bkxpc3RlbmVyLCBhZGREZWxldGVCdG5MaXN0ZW5lciB9O1xufSkoKTtcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi0gSW5pdGlhbGlzZXIgZnVuY3Rpb25cbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5jb25zdCBpbml0aWFsaXNlVUkgPSAoKSA9PiB7XG4gIGhlYWRlci5hZGRIZWFkZXJMaXN0ZW5lcnMoKTtcblxuICBuYXZiYXIucmVuZGVyQ3VycmVudExpc3RzKCk7XG4gIG5hdmJhci5zZXRJbmJveFByb2plY3RJbmRleCgpO1xuICBuYXZiYXIuYWRkTmV3TGlzdEJ0bkxpc3RlbmVyKCk7XG5cbiAgbWFpbi5pbml0KCk7XG5cbiAgYWxsTW9kYWxzLmFkZENsb3NlQnRuTGlzdGVuZXJzKCk7XG4gIGFsbE1vZGFscy5hZGRDbG9zZUJhY2tncm91bmRMaXN0ZW5lcnMoKTtcblxuICBuZXdMaXN0TW9kYWwuYWRkU3VibWl0QnRuTGlzdGVuZXIoKTtcbiAgZWRpdExpc3RNb2RhbC5hZGRFZGl0QnRuTGlzdGVuZXIoKTtcbiAgZGVsZXRlTGlzdE1vZGFsLmFkZENhbmNlbEJ0bkxpc3RlbmVyKCk7XG4gIGRlbGV0ZUxpc3RNb2RhbC5hZGREZWxldGVCdG5MaXN0ZW5lcigpO1xuICBuZXdUYXNrTW9kYWwuYWRkTmV3VGFza0J0bkxJc3RlbmVyKCk7XG4gIGRlbGV0ZVRhc2tNb2RhbC5hZGRDYW5jZWxCdG5MaXN0ZW5lcigpO1xuICBkZWxldGVUYXNrTW9kYWwuYWRkRGVsZXRlQnRuTGlzdGVuZXIoKTtcblxuICBzdGVwc0NvbXBvbmVudC5hZGROZXdTdGVwQnRuTGlzdGVuZXJzKCk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBpbml0aWFsaXNlVUk7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IHByb2plY3RNYW5hZ2VyIH0gZnJvbSAnLi90b0RvTGlzdCc7XG5pbXBvcnQgaW5pdGlhbGlzZVVJIGZyb20gJy4vdWknO1xuXG5wcm9qZWN0TWFuYWdlci5pbml0aWFsaXNlKCk7XG5pbml0aWFsaXNlVUkoKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==