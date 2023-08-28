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

  /* ---------- Change this? --------- */
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsV0FBVztBQUNYLENBQUM7O0FBRUQsaUVBQWUsY0FBYyxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNuQjlCOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDdUM7O0FBRXZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEVBQUUsZ0RBQWM7QUFDaEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwyQkFBMkIsZ0RBQWM7QUFDekM7QUFDQTtBQUNBLE1BQU07QUFDTixzQkFBc0IsMkJBQTJCO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFbUQ7Ozs7Ozs7Ozs7Ozs7Ozs7QUNoV3BEOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ3NFOztBQUV0RTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsV0FBVztBQUNYLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDBCQUEwQixXQUFXO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esa0JBQWtCLHFEQUFjO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0EsOEJBQThCLFVBQVU7QUFDeEM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw4QkFBOEIsVUFBVTtBQUN4QztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQU0sa0RBQVc7QUFDakI7QUFDQSxNQUFNO0FBQ04sTUFBTSxrREFBVztBQUNqQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQU0sa0RBQVc7QUFDakIsTUFBTTtBQUNOLE1BQU0sa0RBQVc7QUFDakI7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQixrREFBVztBQUM1QjtBQUNBLDZDQUE2QyxVQUFVO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixhQUFhLE9BQU8sVUFBVSxPQUFPLE1BQU07QUFDN0Q7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLGFBQWEsT0FBTyxVQUFVLE9BQU8sTUFBTTtBQUM3RDtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsYUFBYSxPQUFPLFVBQVUsT0FBTyxNQUFNO0FBQzdEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixhQUFhLE9BQU8sVUFBVTtBQUM5QztBQUNBLCtDQUErQyxhQUFhLE9BQU8sVUFBVTtBQUM3RTtBQUNBO0FBQ0EsNkNBQTZDLGFBQWEsT0FBTyxVQUFVO0FBQzNFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0EsOEJBQThCLFVBQVU7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHlCQUF5QixxREFBYztBQUN2QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQSxXQUFXO0FBQ1gsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLHNCQUFzQixxREFBYztBQUNwQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsV0FBVztBQUNYLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIscURBQWM7O0FBRXhDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBTSxxREFBYztBQUNwQixNQUFNLHFEQUFjO0FBQ3BCLHFDQUFxQyxxREFBYztBQUNuRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsV0FBVztBQUNYLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxJQUFJLHFEQUFjO0FBQ2xCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsV0FBVztBQUNYLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFNLGtEQUFXO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLHFEQUFjO0FBQ25DO0FBQ0EsUUFBUSxrREFBVztBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFdBQVc7QUFDWCxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaURBQWlELE1BQU07QUFDdkQsK0NBQStDLE1BQU07QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2Q0FBNkMsTUFBTTtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG1EQUFtRCxNQUFNO0FBQ3pELGlEQUFpRCxNQUFNO0FBQ3ZEO0FBQ0EsK0NBQStDLE1BQU07QUFDckQ7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7O0FBRUEsV0FBVztBQUNYLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUksa0RBQVc7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLGlFQUFlLFlBQVksRUFBQzs7Ozs7OztVQ3ArQjVCO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7O0FDTjRDO0FBQ1o7O0FBRWhDLHFEQUFjO0FBQ2QsK0NBQVkiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90by1kby1saXN0Ly4vc3JjL3N0b3JhZ2UuanMiLCJ3ZWJwYWNrOi8vdG8tZG8tbGlzdC8uL3NyYy90b0RvTGlzdC5qcyIsIndlYnBhY2s6Ly90by1kby1saXN0Ly4vc3JjL3VpLmpzIiwid2VicGFjazovL3RvLWRvLWxpc3Qvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdG8tZG8tbGlzdC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vdG8tZG8tbGlzdC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3RvLWRvLWxpc3Qvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly90by1kby1saXN0Ly4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHN0b3JhZ2VNYW5hZ2VyID0gKCgpID0+IHtcbiAgLyogSW5pdGlhbCBmdW5jdGlvbiB0byBnZXQgYW55dGhpbmcgc2F2ZWQgaW4gbG9jYWxTdG9yYWdlICovXG4gIGNvbnN0IGdldFN0b3JhZ2UgPSAoKSA9PiB7XG4gICAgbGV0IHRvRG9MaXN0ID0gW107XG4gICAgaWYgKGxvY2FsU3RvcmFnZS50b0RvTGlzdCkge1xuICAgICAgdG9Eb0xpc3QgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0b0RvTGlzdCcpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdG9Eb0xpc3Q7XG4gIH07XG5cbiAgY29uc3Qgc2V0U3RvcmFnZSA9IChwcm9qZWN0cykgPT4ge1xuICAgIGNvbnN0IHRvRG9MaXN0ID0gSlNPTi5zdHJpbmdpZnkocHJvamVjdHMpO1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd0b0RvTGlzdCcsIHRvRG9MaXN0KTtcbiAgfTtcblxuICByZXR1cm4geyBnZXRTdG9yYWdlLCBzZXRTdG9yYWdlIH07XG59KSgpO1xuXG5leHBvcnQgZGVmYXVsdCBzdG9yYWdlTWFuYWdlcjtcbiIsIi8qIENvbnRlbnRzOlxuXG4gIC0gQ29uc3RydWN0b3JzIC0gVGFzaywgU3RlcCAmIFByb2plY3RcblxuICAtIEZ1bmN0aW9ucyB0byBkZWVwIGNsb25lIGFycmF5cyAmIG9iamVjdHMsICYgdXBkYXRlIGxvY2FsIHN0b3JhZ2VcblxuICAtIFByb2plY3QgTWFuYWdlclxuXG4gIC0gVGFzayBNYW5hZ2VyXG5cbiAgLSBTdGVwIE1hbmFnZXJcbiovXG5pbXBvcnQgc3RvcmFnZU1hbmFnZXIgZnJvbSAnLi9zdG9yYWdlJztcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi0gQ29uc3RydWN0b3JzIC0gVGFzaywgU3RlcCAmIFByb2plY3RcbiAgLSBTdGVwIGdvZXMgaW5zaWRlIFRhc2suc3RlcHNbXVxuICAtIFRhc2sgZ29lcyBpbnNpZGUgUHJvamVjdC50YXNrc1tdXG4gIC0gUHJvamVjdCBnb2VzIGluc2lkZSBwcm9qZWN0c1tdXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuY2xhc3MgVGFzayB7XG4gIGNvbnN0cnVjdG9yKHRpdGxlLCBkZXNjcmlwdGlvbiwgZHVlRGF0ZSwgcHJpb3JpdHksIHN0YXR1cykge1xuICAgIHRoaXMudGl0bGUgPSB0aXRsZTtcbiAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XG4gICAgdGhpcy5zdGVwcyA9IFtdO1xuICAgIHRoaXMuZHVlRGF0ZSA9IGR1ZURhdGU7XG4gICAgdGhpcy5wcmlvcml0eSA9IHByaW9yaXR5O1xuICAgIHRoaXMuc3RhdHVzID0gc3RhdHVzO1xuICB9XG59XG5cbmNsYXNzIFN0ZXAge1xuICBjb25zdHJ1Y3RvcihkZXNjcmlwdGlvbiwgc3RhdHVzKSB7XG4gICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xuICAgIHRoaXMuc3RhdHVzID0gc3RhdHVzO1xuICB9XG59XG5cbmNsYXNzIFByb2plY3Qge1xuICBjb25zdHJ1Y3Rvcih0aXRsZSwgZGVzY3JpcHRpb24pIHtcbiAgICB0aGlzLnRpdGxlID0gdGl0bGU7XG4gICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xuICAgIHRoaXMudGFza3MgPSBbXTtcbiAgfVxufVxuXG5jb25zdCBwcm9qZWN0cyA9IFtdO1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLSBGdW5jdGlvbnMgdG8gZGVlcCBjbG9uZSBhcnJheXMgJiBvYmplY3RzLCAmIHVwZGF0ZSBsb2NhbCBzdG9yYWdlXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuY29uc3QgZGVlcENvcHlBcnJheSA9IChhcnJheSkgPT4ge1xuICBjb25zdCBhcnJheUNvcHkgPSBbXTtcbiAgYXJyYXkuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgIGlmIChBcnJheS5pc0FycmF5KGl0ZW0pKSB7XG4gICAgICBhcnJheUNvcHkucHVzaChkZWVwQ29weUFycmF5KGl0ZW0pKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBpdGVtID09PSAnb2JqZWN0Jykge1xuICAgICAgYXJyYXlDb3B5LnB1c2goZGVlcENvcHlPYmplY3QoaXRlbSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcnJheUNvcHkucHVzaChpdGVtKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gYXJyYXlDb3B5O1xufTtcblxuY29uc3QgZGVlcENvcHlPYmplY3QgPSAob2JqZWN0KSA9PiB7XG4gIGNvbnN0IG9iamVjdENvcHkgPSB7fTtcbiAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMob2JqZWN0KSkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgb2JqZWN0Q29weVtrZXldID0gZGVlcENvcHlBcnJheSh2YWx1ZSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgICBvYmplY3RDb3B5W2tleV0gPSBkZWVwQ29weU9iamVjdCh2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9iamVjdENvcHlba2V5XSA9IHZhbHVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gb2JqZWN0Q29weTtcbn07XG5cbmNvbnN0IHNldFN0b3JhZ2UgPSAoKSA9PiB7XG4gIGNvbnN0IHByb2plY3RzQ29weSA9IGRlZXBDb3B5QXJyYXkocHJvamVjdHMpO1xuICBzdG9yYWdlTWFuYWdlci5zZXRTdG9yYWdlKHByb2plY3RzQ29weSk7XG59O1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLSBQcm9qZWN0IE1hbmFnZXJcbiAgLSBDcmVhdGUgYSBzYWZlIGNvcHkgb2YgYSBwcm9qZWN0ICYgb2YgdGhlIHByb2plY3RzIGFycmF5IGZvciBwdWJsaWMgdXNlXG4gIC0gQ3JlYXRlICYgZGVsZXRlIHByb2plY3RzXG4gIC0gRWRpdCBwcm9qZWN0IHRpdGxlcyAmIGRlc2NyaXB0aW9uc1xuICAtIEluaXRpYWxpc2UgYnkgY2hlY2tpbmcgZm9yIGxvY2FsbHkgc3RvcmVkIHByb2plY3RzXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuY29uc3QgcHJvamVjdE1hbmFnZXIgPSAoKCkgPT4ge1xuICBjb25zdCByZXZlYWxQcm9qZWN0ID0gKHByb2plY3RJbmRleCkgPT4ge1xuICAgIGNvbnN0IHByb2plY3RDb3B5ID0gZGVlcENvcHlPYmplY3QocHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldKTtcblxuICAgIHJldHVybiBwcm9qZWN0Q29weTtcbiAgfTtcblxuICBjb25zdCByZXZlYWxQcm9qZWN0VGFza3NMZW5ndGggPSAocHJvamVjdEluZGV4KSA9PiB7XG4gICAgY29uc3QgdGFza3NMZW5ndGggPSBwcm9qZWN0c1twcm9qZWN0SW5kZXhdLnRhc2tzLmxlbmd0aDtcbiAgICByZXR1cm4gdGFza3NMZW5ndGg7XG4gIH07XG5cbiAgY29uc3QgcmV2ZWFsQWxsUHJvamVjdHMgPSAoKSA9PiB7XG4gICAgY29uc3QgcHJvamVjdHNDb3B5ID0gZGVlcENvcHlBcnJheShwcm9qZWN0cyk7XG5cbiAgICByZXR1cm4gcHJvamVjdHNDb3B5O1xuICB9O1xuXG4gIGNvbnN0IGNyZWF0ZU5ld1Byb2plY3QgPSAodGl0bGUsIGRlc2NyaXB0aW9uKSA9PiB7XG4gICAgY29uc3QgbmV3UHJvamVjdCA9IG5ldyBQcm9qZWN0KHRpdGxlLCBkZXNjcmlwdGlvbik7XG4gICAgcHJvamVjdHMucHVzaChuZXdQcm9qZWN0KTtcblxuICAgIHNldFN0b3JhZ2UoKTtcbiAgICByZXR1cm4gcmV2ZWFsUHJvamVjdChwcm9qZWN0cy5sZW5ndGggLSAxKTtcbiAgfTtcblxuICBjb25zdCBkZWxldGVQcm9qZWN0ID0gKHByb2plY3RJbmRleCkgPT4ge1xuICAgIGNvbnN0IGluZGV4ID0gTnVtYmVyKHByb2plY3RJbmRleCk7XG4gICAgcHJvamVjdHMuc3BsaWNlKGluZGV4LCAxKTtcblxuICAgIHNldFN0b3JhZ2UoKTtcbiAgICByZXR1cm4gcmV2ZWFsQWxsUHJvamVjdHMoKTtcbiAgfTtcblxuICAvKiBNaWdodCBub3QgbmVlZCB0aGlzICovXG4gIGNvbnN0IGRlbGV0ZVByb2plY3RCeU5hbWUgPSAocHJvamVjdFRpdGxlKSA9PiB7XG4gICAgcHJvamVjdHMuZm9yRWFjaCgocHJvamVjdCkgPT4ge1xuICAgICAgaWYgKHByb2plY3QudGl0bGUgPT09IHByb2plY3RUaXRsZSkge1xuICAgICAgICBwcm9qZWN0cy5zcGxpY2UocHJvamVjdHMuaW5kZXhPZihwcm9qZWN0KSwgMSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBzZXRTdG9yYWdlKCk7XG4gICAgcmV0dXJuIHJldmVhbEFsbFByb2plY3RzKCk7XG4gIH07XG5cbiAgY29uc3QgZWRpdFByb2plY3RUaXRsZSA9IChwcm9qZWN0SW5kZXgsIG5ld1RpdGxlKSA9PiB7XG4gICAgcHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldLnRpdGxlID0gbmV3VGl0bGU7XG5cbiAgICBzZXRTdG9yYWdlKCk7XG4gICAgcmV0dXJuIHJldmVhbFByb2plY3QoTnVtYmVyKHByb2plY3RJbmRleCkpO1xuICB9O1xuXG4gIGNvbnN0IGVkaXRQcm9qZWN0RGVzY3JpcHRpb24gPSAocHJvamVjdEluZGV4LCBuZXdEZXNjcmlwdGlvbikgPT4ge1xuICAgIHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXS5kZXNjcmlwdGlvbiA9IG5ld0Rlc2NyaXB0aW9uO1xuXG4gICAgc2V0U3RvcmFnZSgpO1xuICAgIHJldHVybiByZXZlYWxQcm9qZWN0KE51bWJlcihwcm9qZWN0SW5kZXgpKTtcbiAgfTtcblxuICAvKiBUaGlzIHNob3VsZCBiZSB1c2VkIGF0IHRoZSBiZWdnaW5pbmcgb2YgdGhlIGNvZGUgdG8gc3RhcnQgdGhlIGFwcCBwcm9wZXJseSAqL1xuICBjb25zdCBpbml0aWFsaXNlID0gKCkgPT4ge1xuICAgIGNvbnN0IHN0b3JlZFByb2plY3RzID0gc3RvcmFnZU1hbmFnZXIuZ2V0U3RvcmFnZSgpO1xuICAgIGlmIChzdG9yZWRQcm9qZWN0cy5sZW5ndGggPT09IDApIHtcbiAgICAgIGNyZWF0ZU5ld1Byb2plY3QoJ0luYm94JywgJycpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0b3JlZFByb2plY3RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHByb2plY3RzLnB1c2goc3RvcmVkUHJvamVjdHNbaV0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmV2ZWFsQWxsUHJvamVjdHMoKTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIHJldmVhbFByb2plY3QsXG4gICAgcmV2ZWFsUHJvamVjdFRhc2tzTGVuZ3RoLFxuICAgIHJldmVhbEFsbFByb2plY3RzLFxuICAgIGNyZWF0ZU5ld1Byb2plY3QsXG4gICAgZGVsZXRlUHJvamVjdCxcbiAgICBkZWxldGVQcm9qZWN0QnlOYW1lLFxuICAgIGVkaXRQcm9qZWN0VGl0bGUsXG4gICAgZWRpdFByb2plY3REZXNjcmlwdGlvbixcbiAgICBpbml0aWFsaXNlLFxuICB9O1xufSkoKTtcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi0gVGFzayBNYW5hZ2VyXG4gIC0gQ3JlYXRlIGEgc2FmZSBjb3B5IG9mIGEgc2luZ2xlIHRhc2sgZm9yIHB1YmxpYyB1c2VcbiAgLSBDcmVhdGUgJiBkZWxldGUgdGFza3MgaW4gYSBwcm9qZWN0XG4gIC0gRWRpdCB0YXNrIHRpdGxlLCBkZXNjcmlwdGlvbiwgZHVlIGRhdGUsIHByaW9yaXR5ICYgc3RhdHVzXG4gIC0gU3Vic2NyaWJlIHRvIG1lZGlhdG9yIGV2ZW50c1xuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbmNvbnN0IHRhc2tNYW5hZ2VyID0gKCgpID0+IHtcbiAgY29uc3QgcmV2ZWFsVGFzayA9IChwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCkgPT4ge1xuICAgIGNvbnN0IHRhc2tDb3B5ID0gZGVlcENvcHlPYmplY3QoXG4gICAgICBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0udGFza3NbTnVtYmVyKHRhc2tJbmRleCldLFxuICAgICk7XG5cbiAgICByZXR1cm4gdGFza0NvcHk7XG4gIH07XG5cbiAgY29uc3QgY3JlYXRlTmV3VGFzayA9IChcbiAgICBwcm9qZWN0SW5kZXgsXG4gICAgdGl0bGUsXG4gICAgZGVzY3JpcHRpb24sXG4gICAgZHVlRGF0ZSxcbiAgICBwcmlvcml0eSxcbiAgICBzdGF0dXMsXG4gICkgPT4ge1xuICAgIGNvbnN0IHByb2plY3QgPSBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV07XG4gICAgcHJvamVjdC50YXNrcy5wdXNoKG5ldyBUYXNrKHRpdGxlLCBkZXNjcmlwdGlvbiwgZHVlRGF0ZSwgcHJpb3JpdHksIHN0YXR1cykpO1xuXG4gICAgc2V0U3RvcmFnZSgpO1xuICAgIHJldHVybiByZXZlYWxUYXNrKE51bWJlcihwcm9qZWN0SW5kZXgpLCBwcm9qZWN0LnRhc2tzLmxlbmd0aCAtIDEpO1xuICB9O1xuXG4gIGNvbnN0IGRlbGV0ZVRhc2sgPSAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgpID0+IHtcbiAgICBjb25zdCBwcm9qZWN0ID0gcHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldO1xuICAgIGNvbnN0IGluZGV4ID0gTnVtYmVyKHRhc2tJbmRleCk7XG4gICAgcHJvamVjdC50YXNrcy5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gICAgc2V0U3RvcmFnZSgpO1xuICAgIHJldHVybiBwcm9qZWN0TWFuYWdlci5yZXZlYWxQcm9qZWN0KE51bWJlcihwcm9qZWN0SW5kZXgpKTtcbiAgfTtcblxuICBjb25zdCBlZGl0VGFza1RpdGxlID0gKHByb2plY3RJbmRleCwgdGFza0luZGV4LCBuZXdUaXRsZSkgPT4ge1xuICAgIGNvbnN0IHRhc2sgPSBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0udGFza3NbTnVtYmVyKHRhc2tJbmRleCldO1xuICAgIHRhc2sudGl0bGUgPSBuZXdUaXRsZTtcblxuICAgIHNldFN0b3JhZ2UoKTtcbiAgICByZXR1cm4gcmV2ZWFsVGFzayhOdW1iZXIocHJvamVjdEluZGV4KSwgTnVtYmVyKHRhc2tJbmRleCkpO1xuICB9O1xuXG4gIGNvbnN0IGVkaXRUYXNrRGVzY3JpcHRpb24gPSAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgsIG5ld0Rlc2NyaXB0aW9uKSA9PiB7XG4gICAgY29uc3QgdGFzayA9IHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXS50YXNrc1tOdW1iZXIodGFza0luZGV4KV07XG4gICAgdGFzay5kZXNjcmlwdGlvbiA9IG5ld0Rlc2NyaXB0aW9uO1xuXG4gICAgc2V0U3RvcmFnZSgpO1xuICAgIHJldHVybiByZXZlYWxUYXNrKE51bWJlcihwcm9qZWN0SW5kZXgpLCBOdW1iZXIodGFza0luZGV4KSk7XG4gIH07XG5cbiAgY29uc3QgZWRpdFRhc2tEdWVEYXRlID0gKHByb2plY3RJbmRleCwgdGFza0luZGV4LCBuZXdEdWVEYXRlKSA9PiB7XG4gICAgY29uc3QgdGFzayA9IHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXS50YXNrc1tOdW1iZXIodGFza0luZGV4KV07XG4gICAgdGFzay5kdWVEYXRlID0gbmV3RHVlRGF0ZTtcblxuICAgIHNldFN0b3JhZ2UoKTtcbiAgICByZXR1cm4gcmV2ZWFsVGFzayhOdW1iZXIocHJvamVjdEluZGV4KSwgTnVtYmVyKHRhc2tJbmRleCkpO1xuICB9O1xuXG4gIGNvbnN0IGVkaXRUYXNrUHJpb3JpdHkgPSAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgsIG5ld1ByaW9yaXR5KSA9PiB7XG4gICAgY29uc3QgdGFzayA9IHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXS50YXNrc1tOdW1iZXIodGFza0luZGV4KV07XG4gICAgdGFzay5wcmlvcml0eSA9IG5ld1ByaW9yaXR5O1xuXG4gICAgc2V0U3RvcmFnZSgpO1xuICAgIHJldHVybiByZXZlYWxUYXNrKE51bWJlcihwcm9qZWN0SW5kZXgpLCBOdW1iZXIodGFza0luZGV4KSk7XG4gIH07XG5cbiAgY29uc3QgZWRpdFRhc2tTdGF0dXMgPSAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgsIG5ld1N0YXR1cykgPT4ge1xuICAgIGNvbnN0IHRhc2sgPSBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0udGFza3NbTnVtYmVyKHRhc2tJbmRleCldO1xuICAgIHRhc2suc3RhdHVzID0gbmV3U3RhdHVzO1xuXG4gICAgc2V0U3RvcmFnZSgpO1xuICAgIHJldHVybiByZXZlYWxUYXNrKE51bWJlcihwcm9qZWN0SW5kZXgpLCBOdW1iZXIodGFza0luZGV4KSk7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICByZXZlYWxUYXNrLFxuICAgIGNyZWF0ZU5ld1Rhc2ssXG4gICAgZGVsZXRlVGFzayxcbiAgICBlZGl0VGFza1RpdGxlLFxuICAgIGVkaXRUYXNrRGVzY3JpcHRpb24sXG4gICAgZWRpdFRhc2tEdWVEYXRlLFxuICAgIGVkaXRUYXNrUHJpb3JpdHksXG4gICAgZWRpdFRhc2tTdGF0dXMsXG4gIH07XG59KSgpO1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLSBTdGVwIE1hbmFnZXJcbiAgLSBDcmVhdGUgJiBkZWxldGUgc3RlcHMgaW4gYSB0YXNrXG4gIC0gRWRpdCBzdGVwIGRlc2NyaXB0aW9uICYgc3RhdHVzXG4gIC0gQ3JlYXRlIGEgc2ZlIGNvcHkgb2YgYSBzaW5nbGUgc3RlcCBmb3IgcHVibGljIHVzZVxuICAtIFN1YnNjcmliZSB0byBtZWRpYXRvciBldmVudHNcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5jb25zdCBzdGVwTWFuYWdlciA9ICgoKSA9PiB7XG4gIGNvbnN0IHJldmVhbFN0ZXAgPSAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgsIHN0ZXBJbmRleCkgPT4ge1xuICAgIGNvbnN0IHN0ZXBDb3B5ID0gZGVlcENvcHlPYmplY3QoXG4gICAgICBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0udGFza3NbTnVtYmVyKHRhc2tJbmRleCldLnN0ZXBzW1xuICAgICAgICBOdW1iZXIoc3RlcEluZGV4KVxuICAgICAgXSxcbiAgICApO1xuXG4gICAgcmV0dXJuIHN0ZXBDb3B5O1xuICB9O1xuXG4gIGNvbnN0IGNyZWF0ZU5ld1N0ZXAgPSAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgsIGRlc2NyaXB0aW9uLCBzdGF0dXMpID0+IHtcbiAgICBjb25zdCB0YXNrID0gcHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldLnRhc2tzW051bWJlcih0YXNrSW5kZXgpXTtcbiAgICB0YXNrLnN0ZXBzLnB1c2gobmV3IFN0ZXAoZGVzY3JpcHRpb24sIHN0YXR1cykpO1xuXG4gICAgc2V0U3RvcmFnZSgpO1xuICAgIHJldHVybiByZXZlYWxTdGVwKFxuICAgICAgTnVtYmVyKHByb2plY3RJbmRleCksXG4gICAgICBOdW1iZXIodGFza0luZGV4KSxcbiAgICAgIHRhc2suc3RlcHMubGVuZ3RoIC0gMSxcbiAgICApO1xuICB9O1xuXG4gIGNvbnN0IGRlbGV0ZVN0ZXAgPSAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgsIHN0ZXBJbmRleCkgPT4ge1xuICAgIGNvbnN0IHRhc2sgPSBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0udGFza3NbTnVtYmVyKHRhc2tJbmRleCldO1xuICAgIGNvbnN0IGluZGV4ID0gTnVtYmVyKHN0ZXBJbmRleCk7XG4gICAgdGFzay5zdGVwcy5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gICAgc2V0U3RvcmFnZSgpO1xuICAgIHJldHVybiB0YXNrTWFuYWdlci5yZXZlYWxUYXNrKE51bWJlcihwcm9qZWN0SW5kZXgpLCBOdW1iZXIodGFza0luZGV4KSk7XG4gIH07XG5cbiAgY29uc3QgZWRpdFN0ZXBEZXNjcmlwdGlvbiA9IChcbiAgICBwcm9qZWN0SW5kZXgsXG4gICAgdGFza0luZGV4LFxuICAgIHN0ZXBJbmRleCxcbiAgICBuZXdEZXNjcmlwdGlvbixcbiAgKSA9PiB7XG4gICAgY29uc3Qgc3RlcCA9XG4gICAgICBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0udGFza3NbTnVtYmVyKHRhc2tJbmRleCldLnN0ZXBzW1xuICAgICAgICBOdW1iZXIoc3RlcEluZGV4KVxuICAgICAgXTtcbiAgICBzdGVwLmRlc2NyaXB0aW9uID0gbmV3RGVzY3JpcHRpb247XG5cbiAgICBzZXRTdG9yYWdlKCk7XG4gICAgcmV0dXJuIHJldmVhbFN0ZXAoXG4gICAgICBOdW1iZXIocHJvamVjdEluZGV4KSxcbiAgICAgIE51bWJlcih0YXNrSW5kZXgpLFxuICAgICAgTnVtYmVyKHN0ZXBJbmRleCksXG4gICAgKTtcbiAgfTtcblxuICBjb25zdCBlZGl0U3RlcFN0YXR1cyA9IChwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCwgc3RlcEluZGV4LCBuZXdTdGF0dXMpID0+IHtcbiAgICBjb25zdCBzdGVwID1cbiAgICAgIHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXS50YXNrc1tOdW1iZXIodGFza0luZGV4KV0uc3RlcHNbXG4gICAgICAgIE51bWJlcihzdGVwSW5kZXgpXG4gICAgICBdO1xuICAgIHN0ZXAuc3RhdHVzID0gbmV3U3RhdHVzO1xuXG4gICAgc2V0U3RvcmFnZSgpO1xuICAgIHJldHVybiByZXZlYWxTdGVwKFxuICAgICAgTnVtYmVyKHByb2plY3RJbmRleCksXG4gICAgICBOdW1iZXIodGFza0luZGV4KSxcbiAgICAgIE51bWJlcihzdGVwSW5kZXgpLFxuICAgICk7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICByZXZlYWxTdGVwLFxuICAgIGNyZWF0ZU5ld1N0ZXAsXG4gICAgZGVsZXRlU3RlcCxcbiAgICBlZGl0U3RlcERlc2NyaXB0aW9uLFxuICAgIGVkaXRTdGVwU3RhdHVzLFxuICB9O1xufSkoKTtcblxuZXhwb3J0IHsgcHJvamVjdE1hbmFnZXIsIHRhc2tNYW5hZ2VyLCBzdGVwTWFuYWdlciB9O1xuIiwiLyogQ29udGVudHM6XG5cblx0LSBHZW5lcmFsXG5cblx0LSBIZWFkZXIgbW9kdWxlXG5cblx0LSBOYXZiYXIgbW9kdWxlXG5cbiAgLSBNYWluIG1vZHVsZVxuXHRcblx0LSBNb2R1bGUgdG8gY29udHJvbCB0aGluZ3MgY29tbW9uIG1vc3QgbW9kYWxzXG5cblx0LSAnTmV3IExpc3QnIG1vZGFsIG1vZHVsZVxuXG4gIC0gJ0RlbGV0ZSBsaXN0JyBtb2RhbCBtb2R1bGVcblxuICAtICdOZXcgdGFzaycgbW9kYWwgbW9kdWxlXG5cbiAgLSBTdGVwcyBjb21wb25lbnQgbW9kdWxlXG5cbiAgLSAnRGVsZXRlIHRhc2snIG1vZGFsIG1vZHVsZVxuXG5cdC0gSW5pdGlhbGlzZXIgZnVuY3Rpb25cbiovXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLSBHZW5lcmFsXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuaW1wb3J0IHsgcHJvamVjdE1hbmFnZXIsIHRhc2tNYW5hZ2VyLCBzdGVwTWFuYWdlciB9IGZyb20gJy4vdG9Eb0xpc3QnO1xuXG5jb25zdCB0b2dnbGVIaWRkZW4gPSAoZWxlbWVudCkgPT4ge1xuICBlbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoJ2hpZGRlbicpO1xufTtcbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4tIEhlYWRlciBtb2R1bGVcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5jb25zdCBoZWFkZXIgPSAoKCkgPT4ge1xuICAvKiBGdW5jdGlvbiB0byBpbnZva2Ugb24gaW5pdGlsaXNlLCBmb3IgdGhlIGNvbXBvbmVudCB0byB3b3JrIHByb3Blcmx5ICovXG4gIGNvbnN0IGFkZEhlYWRlckxpc3RlbmVycyA9ICgpID0+IHtcbiAgICBjb25zdCB0b2dnbGVOYXZCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndG9nZ2xlLW5hdi1idXR0b24nKTtcbiAgICBjb25zdCB0b2dnbGVBc2lkZUJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0b2dnbGUtYXNpZGUtYnV0dG9uJyk7XG4gICAgY29uc3QgbmF2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbmF2Jyk7XG4gICAgY29uc3QgYXNpZGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdhc2lkZScpO1xuXG4gICAgdG9nZ2xlTmF2QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gdG9nZ2xlSGlkZGVuKG5hdikpO1xuICAgIHRvZ2dsZUFzaWRlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gdG9nZ2xlSGlkZGVuKGFzaWRlKSk7XG4gIH07XG5cbiAgcmV0dXJuIHsgYWRkSGVhZGVyTGlzdGVuZXJzIH07XG59KSgpO1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLSBOYXZiYXIgbW9kdWxlXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuY29uc3QgbmF2YmFyID0gKCgpID0+IHtcbiAgY29uc3Qgc2V0UHJvamVjdERhdGFJbmRleCA9IChlbGVtZW50LCBpbmRleCkgPT4ge1xuICAgIGVsZW1lbnQuZGF0YXNldC5wcm9qZWN0SW5kZXggPSBpbmRleDtcbiAgfTtcblxuICBjb25zdCBjYWxjdWxhdGVOZXdQcm9qZWN0SW5kZXggPSAoKSA9PiB7XG4gICAgY29uc3QgbGlzdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmF2LXRvZG8tbGlzdHMnKS5jaGlsZHJlbjtcbiAgICBjb25zdCBuZXdJbmRleCA9IGxpc3RzLmxlbmd0aCArIDE7XG4gICAgcmV0dXJuIG5ld0luZGV4O1xuICB9O1xuXG4gIGNvbnN0IHVwZGF0ZUFsbFByb2plY3RJbmRpY2VzID0gKCkgPT4ge1xuICAgIGNvbnN0IGN1cnJlbnRMaXN0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduYXYtdG9kby1saXN0cycpLmNoaWxkcmVuO1xuICAgIGxldCB1cGRhdGVkSW5kZXggPSAxO1xuICAgIGZvciAoY29uc3QgbGlzdCBvZiBjdXJyZW50TGlzdHMpIHtcbiAgICAgIGNvbnN0IGxpbmsgPSBsaXN0LnF1ZXJ5U2VsZWN0b3IoJ2EnKTtcbiAgICAgIGNvbnN0IGJ1dHRvbnMgPSBsaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoJ2J1dHRvbicpO1xuICAgICAgbGluay5kYXRhc2V0LnByb2plY3RJbmRleCA9IHVwZGF0ZWRJbmRleDtcbiAgICAgIGJ1dHRvbnMuZm9yRWFjaCgoYnV0dG9uKSA9PiB7XG4gICAgICAgIGJ1dHRvbi5kYXRhc2V0LnByb2plY3RJbmRleCA9IHVwZGF0ZWRJbmRleDtcbiAgICAgIH0pO1xuICAgICAgdXBkYXRlZEluZGV4ICs9IDE7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IHJlbmRlck5ld0xpc3QgPSAobGlzdCwgbGlzdEluZGV4KSA9PiB7XG4gICAgY29uc3QgbmF2TGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduYXYtdG9kby1saXN0cycpO1xuICAgIGNvbnN0IGxpc3RJdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICBjb25zdCBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbnN0IGVkaXRCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBjb25zdCBlZGl0SW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgY29uc3QgZGVsZXRlQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgY29uc3QgZGVsZXRlSW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG5cbiAgICBsaW5rLnNldEF0dHJpYnV0ZSgnaHJlZicsICcjJyk7XG4gICAgbGluay50ZXh0Q29udGVudCA9IGAke2xpc3QudGl0bGV9YDtcbiAgICBkaXYuY2xhc3NMaXN0LmFkZCgnbmF2LWxpc3QtYnV0dG9ucycpO1xuICAgIGVkaXRJbWcuc2V0QXR0cmlidXRlKCdzcmMnLCAnLi9pY29ucy9lZGl0LnN2ZycpO1xuICAgIGVkaXRJbWcuc2V0QXR0cmlidXRlKCdhbHQnLCAnYnV0dG9uIHRvIGVkaXQgbGlzdCcpO1xuICAgIGRlbGV0ZUltZy5zZXRBdHRyaWJ1dGUoJ3NyYycsICcuL2ljb25zL2RlbGV0ZS5zdmcnKTtcbiAgICBkZWxldGVJbWcuc2V0QXR0cmlidXRlKCdhbHQnLCAnYnV0dG9uIHRvIGRlbGV0ZSBsaXN0Jyk7XG5cbiAgICBzZXRQcm9qZWN0RGF0YUluZGV4KGxpbmssIGxpc3RJbmRleCk7XG4gICAgc2V0UHJvamVjdERhdGFJbmRleChlZGl0QnRuLCBsaXN0SW5kZXgpO1xuICAgIHNldFByb2plY3REYXRhSW5kZXgoZGVsZXRlQnRuLCBsaXN0SW5kZXgpO1xuXG4gICAgZWRpdEJ0bi5hcHBlbmRDaGlsZChlZGl0SW1nKTtcbiAgICBkZWxldGVCdG4uYXBwZW5kQ2hpbGQoZGVsZXRlSW1nKTtcbiAgICBkaXYuYXBwZW5kQ2hpbGQoZWRpdEJ0bik7XG4gICAgZGl2LmFwcGVuZENoaWxkKGRlbGV0ZUJ0bik7XG4gICAgbGlzdEl0ZW0uYXBwZW5kQ2hpbGQobGluayk7XG4gICAgbGlzdEl0ZW0uYXBwZW5kQ2hpbGQoZGl2KTtcbiAgICBuYXZMaXN0LmFwcGVuZENoaWxkKGxpc3RJdGVtKTtcblxuICAgIGVkaXRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PlxuICAgICAgZWRpdExpc3RNb2RhbC5vcGVuRWRpdE1vZGFsKGVkaXRCdG4uZGF0YXNldC5wcm9qZWN0SW5kZXgpLFxuICAgICk7XG4gICAgZGVsZXRlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT5cbiAgICAgIGRlbGV0ZUxpc3RNb2RhbC5vcGVuRGVsZXRlTW9kYWwoZGVsZXRlQnRuLmRhdGFzZXQucHJvamVjdEluZGV4KSxcbiAgICApO1xuICB9O1xuXG4gIC8qIC0tLS0tLS0tLS0gQ2hhbmdlIHRoaXM/IC0tLS0tLS0tLSAqL1xuICBjb25zdCByZW5kZXJEZWxldGVkTGlzdCA9IChsaXN0SW5kZXgpID0+IHtcbiAgICBjb25zdCBsaXN0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduYXYtdG9kby1saXN0cycpLmNoaWxkcmVuO1xuICAgIGZvciAoY29uc3QgbGlzdCBvZiBsaXN0cykge1xuICAgICAgY29uc3QgbGluayA9IGxpc3QucXVlcnlTZWxlY3RvcignYScpO1xuICAgICAgaWYgKGxpbmsuZGF0YXNldC5wcm9qZWN0SW5kZXggPT09IFN0cmluZyhsaXN0SW5kZXgpKSB7XG4gICAgICAgIGxpc3QucmVtb3ZlKCk7XG4gICAgICAgIHVwZGF0ZUFsbFByb2plY3RJbmRpY2VzKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBjb25zdCByZW5kZXJFZGl0ZWRMaXN0ID0gKGxpc3RJbmRleCwgcHJvamVjdCkgPT4ge1xuICAgIGNvbnN0IGxpc3RzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25hdi10b2RvLWxpc3RzJykuY2hpbGRyZW47XG4gICAgZm9yIChjb25zdCBsaXN0IG9mIGxpc3RzKSB7XG4gICAgICBjb25zdCBsaW5rID0gbGlzdC5xdWVyeVNlbGVjdG9yKCdhJyk7XG4gICAgICBpZiAobGluay5kYXRhc2V0LnByb2plY3RJbmRleCA9PT0gU3RyaW5nKGxpc3RJbmRleCkpIHtcbiAgICAgICAgbGluay50ZXh0Q29udGVudCA9IHByb2plY3QudGl0bGU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAvKiBGdW5jdGlvbnMgdG8gaW52b2tlIG9uIGluaXRpbGlzZSwgZm9yIHRoZSBjb21wb25lbnQgdG8gd29yayBwcm9wZXJseSAqL1xuICBjb25zdCByZW5kZXJDdXJyZW50TGlzdHMgPSAoKSA9PiB7XG4gICAgY29uc3QgbGlzdHMgPSBwcm9qZWN0TWFuYWdlci5yZXZlYWxBbGxQcm9qZWN0cygpO1xuICAgIGxpc3RzLmZvckVhY2goKGxpc3QpID0+IHtcbiAgICAgIGlmIChsaXN0cy5pbmRleE9mKGxpc3QpID4gMCkge1xuICAgICAgICByZW5kZXJOZXdMaXN0KGxpc3QsIGxpc3RzLmluZGV4T2YobGlzdCkpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IHNldEluYm94UHJvamVjdEluZGV4ID0gKCkgPT4ge1xuICAgIGNvbnN0IGluYm94ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25hdi1saXN0LWluYm94Jyk7XG4gICAgc2V0UHJvamVjdERhdGFJbmRleChpbmJveCwgMCk7XG4gIH07XG5cbiAgY29uc3QgYWRkTmV3TGlzdEJ0bkxpc3RlbmVyID0gKCkgPT4ge1xuICAgIGNvbnN0IG5ld0xpc3RCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmF2LW5ldy1saXN0LWJ1dHRvbicpO1xuICAgIGNvbnN0IG1vZGFsTmV3TGlzdCA9XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmV3LWxpc3QtbW9kYWwnKS5wYXJlbnRFbGVtZW50O1xuICAgIG5ld0xpc3RCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB0b2dnbGVIaWRkZW4obW9kYWxOZXdMaXN0KSk7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBjYWxjdWxhdGVOZXdQcm9qZWN0SW5kZXgsXG4gICAgcmVuZGVyTmV3TGlzdCxcbiAgICByZW5kZXJEZWxldGVkTGlzdCxcbiAgICByZW5kZXJFZGl0ZWRMaXN0LFxuICAgIHJlbmRlckN1cnJlbnRMaXN0cyxcbiAgICBzZXRJbmJveFByb2plY3RJbmRleCxcbiAgICBhZGROZXdMaXN0QnRuTGlzdGVuZXIsXG4gIH07XG59KSgpO1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLSBNYWluIG1vZHVsZVxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbmNvbnN0IG1haW4gPSAoKCkgPT4ge1xuICBjb25zdCBtYWluVGFza3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdtYWluJyk7XG4gIGNvbnN0IG5ld1Rhc2tCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbi1uZXctdGFzay1idXR0b24nKTtcbiAgY29uc3QgdW5maW5pc2hlZERpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy51bmZpbmlzaGVkLXRhc2tzJyk7XG4gIGNvbnN0IGZpbmlzaGVkRGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZpbmlzaGVkLXRhc2tzJyk7XG5cbiAgLyogSGVhZGVyIHNlY3Rpb24gKi9cbiAgY29uc3QgcmVuZGVySGVhZGVyID0gKHByb2plY3QpID0+IHtcbiAgICBjb25zdCBsaXN0VGl0bGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbi1saXN0LXRpdGxlJyk7XG4gICAgY29uc3QgbGlzdERlc2NyaXB0aW9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW4tbGlzdC1kZXNjcmlwdGlvbicpO1xuICAgIGxpc3RUaXRsZS50ZXh0Q29udGVudCA9IHByb2plY3QudGl0bGU7XG4gICAgbGlzdERlc2NyaXB0aW9uLnRleHRDb250ZW50ID0gcHJvamVjdC5kZXNjcmlwdGlvbjtcbiAgfTtcblxuICBjb25zdCBzZXROZXdUYXNrQnRuSW5kZXggPSAoaW5kZXgpID0+IHtcbiAgICBuZXdUYXNrQnRuLmRhdGFzZXQucHJvamVjdEluZGV4ID0gaW5kZXg7XG4gIH07XG5cbiAgY29uc3QgYWRkTmV3VGFza0J0bkxpc3RlbmVyID0gKCkgPT4ge1xuICAgIG5ld1Rhc2tCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PlxuICAgICAgbmV3VGFza01vZGFsLm9wZW5OZXdUYXNrTW9kYWwobmV3VGFza0J0bi5kYXRhc2V0LnByb2plY3RJbmRleCksXG4gICAgKTtcbiAgfTtcblxuICAvKiBUYXNrcyBzZWN0aW9uICovXG4gIGNvbnN0IGNsZWFyVGFza3MgPSAoKSA9PiB7XG4gICAgY29uc3QgdGFza0dyb3VwcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5tYWluLXRhc2tzJyk7XG4gICAgdGFza0dyb3Vwcy5mb3JFYWNoKCh0YXNrR3JvdXApID0+IHtcbiAgICAgIHRhc2tHcm91cC5pbm5lckhUTUwgPSAnJztcbiAgICB9KTtcbiAgfTtcblxuICBjb25zdCBzZW5kVG9GaW5pc2hlZERpdiA9ICh0YXNrSW5kZXgpID0+IHtcbiAgICBjb25zdCB0YXNrVG9Nb3ZlID0gdW5maW5pc2hlZERpdi5xdWVyeVNlbGVjdG9yKFxuICAgICAgYGRpdltkYXRhLXRhc2staW5kZXg9JyR7dGFza0luZGV4fSddYCxcbiAgICApO1xuICAgIGZpbmlzaGVkRGl2LnByZXBlbmQodGFza1RvTW92ZSk7XG4gIH07XG5cbiAgY29uc3Qgc2VuZFRvVW5maW5pc2hlZERpdiA9ICh0YXNrSW5kZXgpID0+IHtcbiAgICBjb25zdCB0YXNrVG9Nb3ZlID0gZmluaXNoZWREaXYucXVlcnlTZWxlY3RvcihcbiAgICAgIGBkaXZbZGF0YS10YXNrLWluZGV4PScke3Rhc2tJbmRleH0nXWAsXG4gICAgKTtcbiAgICB1bmZpbmlzaGVkRGl2LmFwcGVuZENoaWxkKHRhc2tUb01vdmUpO1xuICB9O1xuXG4gIGNvbnN0IHRvZ2dsZVRhc2tTdGF0dXMgPSAoY2hlY2tib3gsIHByb2plY3RJbmRleCwgdGFza0luZGV4KSA9PiB7XG4gICAgaWYgKGNoZWNrYm94LmNoZWNrZWQpIHtcbiAgICAgIHRhc2tNYW5hZ2VyLmVkaXRUYXNrU3RhdHVzKHByb2plY3RJbmRleCwgdGFza0luZGV4LCAnZG9uZScpO1xuICAgICAgc2VuZFRvRmluaXNoZWREaXYodGFza0luZGV4KTtcbiAgICB9IGVsc2UgaWYgKCFjaGVja2JveC5jaGVja2VkKSB7XG4gICAgICB0YXNrTWFuYWdlci5lZGl0VGFza1N0YXR1cyhwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCwgJ3RvIGRvJyk7XG4gICAgICBzZW5kVG9VbmZpbmlzaGVkRGl2KHRhc2tJbmRleCk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IHRvZ2dsZVN0ZXBTdGF0dXMgPSAoY2hlY2tib3gsIHByb2plY3RJbmRleCwgdGFza0luZGV4LCBzdGVwSW5kZXgpID0+IHtcbiAgICBpZiAoY2hlY2tib3guY2hlY2tlZCkge1xuICAgICAgc3RlcE1hbmFnZXIuZWRpdFN0ZXBTdGF0dXMocHJvamVjdEluZGV4LCB0YXNrSW5kZXgsIHN0ZXBJbmRleCwgJ2RvbmUnKTtcbiAgICB9IGVsc2UgaWYgKCFjaGVja2JveC5jaGVja2VkKSB7XG4gICAgICBzdGVwTWFuYWdlci5lZGl0U3RlcFN0YXR1cyhwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCwgc3RlcEluZGV4LCAndG8gZG8nKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgcmVuZGVyVGFza0NvbnRlbnQgPSAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgpID0+IHtcbiAgICBjb25zdCB0YXNrID0gdGFza01hbmFnZXIucmV2ZWFsVGFzayhwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCk7XG4gICAgY29uc3QgdGFza0l0ZW0gPSBtYWluVGFza3NcbiAgICAgIC5xdWVyeVNlbGVjdG9yKGBkaXZbZGF0YS10YXNrLWluZGV4PScke3Rhc2tJbmRleH0nXWApXG4gICAgICAucXVlcnlTZWxlY3RvcignLnRhc2staXRlbScpO1xuICAgIGNvbnN0IHByaW9yaXR5TGV2ZWwgPSB0YXNrSXRlbS5xdWVyeVNlbGVjdG9yKCcudGFzay1wcmlvcml0eS1sZXZlbCcpO1xuICAgIGNvbnN0IHRpdGxlRGl2ID0gdGFza0l0ZW0ucXVlcnlTZWxlY3RvcignLnRhc2stdGl0bGUnKTtcbiAgICBjb25zdCB0aXRsZUNoZWNrYm94ID0gdGl0bGVEaXYucXVlcnlTZWxlY3RvcignaW5wdXQnKTtcbiAgICBjb25zdCB0aXRsZUxhYmVsID0gdGl0bGVEaXYucXVlcnlTZWxlY3RvcignbGFiZWwnKTtcbiAgICBjb25zdCBkZXNjcmlwdGlvbiA9IHRhc2tJdGVtLnF1ZXJ5U2VsZWN0b3IoJy50YXNrLWRlc2NyaXB0aW9uJyk7XG4gICAgY29uc3Qgc3RlcHNMaXN0ID0gdGFza0l0ZW0ucXVlcnlTZWxlY3RvcignLnRhc2stc3RlcHMnKTtcblxuICAgIHN3aXRjaCAodGFzay5wcmlvcml0eSkge1xuICAgICAgY2FzZSAnbG93JzpcbiAgICAgICAgdGFza0l0ZW0uY2xhc3NMaXN0LmFkZCgncHJpb3JpdHktbG93Jyk7XG4gICAgICAgIHByaW9yaXR5TGV2ZWwudGV4dENvbnRlbnQgPSAnTG93JztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtZWRpdW0nOlxuICAgICAgICB0YXNrSXRlbS5jbGFzc0xpc3QuYWRkKCdwcmlvcml0eS1tZWRpdW0nKTtcbiAgICAgICAgcHJpb3JpdHlMZXZlbC50ZXh0Q29udGVudCA9ICdNZWRpdW0nO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2hpZ2gnOlxuICAgICAgICB0YXNrSXRlbS5jbGFzc0xpc3QuYWRkKCdwcmlvcml0eS1oaWdoJyk7XG4gICAgICAgIHByaW9yaXR5TGV2ZWwudGV4dENvbnRlbnQgPSAnSGlnaCc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGFza0l0ZW0uY2xhc3NMaXN0LmFkZCgncHJpb3JpdHktbm9uZScpO1xuICAgICAgICBwcmlvcml0eUxldmVsLnRleHRDb250ZW50ID0gJ05vbmUnO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgaWYgKHRhc2suc3RhdHVzID09PSAndG8gZG8nKSB7XG4gICAgICB0aXRsZUNoZWNrYm94LmNoZWNrZWQgPSBmYWxzZTtcbiAgICB9IGVsc2UgaWYgKHRhc2suc3RhdHVzID09PSAnZG9uZScpIHtcbiAgICAgIHRpdGxlQ2hlY2tib3guY2hlY2tlZCA9IHRydWU7XG4gICAgfVxuICAgIHRpdGxlTGFiZWwudGV4dENvbnRlbnQgPSB0YXNrLnRpdGxlO1xuICAgIGRlc2NyaXB0aW9uLnRleHRDb250ZW50ID0gdGFzay5kZXNjcmlwdGlvbjtcbiAgICB0YXNrLnN0ZXBzLmZvckVhY2goKHN0ZXApID0+IHtcbiAgICAgIGNvbnN0IGxpc3RJdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgIGNvbnN0IHN0ZXBDaGVja2JveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICBjb25zdCBzdGVwTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICAgICAgY29uc3QgaW5kZXggPSB0YXNrLnN0ZXBzLmluZGV4T2Yoc3RlcCk7XG5cbiAgICAgIHN0ZXBDaGVja2JveC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnY2hlY2tib3gnKTtcbiAgICAgIHN0ZXBDaGVja2JveC5zZXRBdHRyaWJ1dGUoXG4gICAgICAgICduYW1lJyxcbiAgICAgICAgYHByb2plY3Qke3Byb2plY3RJbmRleH0tdGFzayR7dGFza0luZGV4fS1zdGVwJHtpbmRleH1gLFxuICAgICAgKTtcbiAgICAgIHN0ZXBDaGVja2JveC5zZXRBdHRyaWJ1dGUoXG4gICAgICAgICdpZCcsXG4gICAgICAgIGBwcm9qZWN0JHtwcm9qZWN0SW5kZXh9LXRhc2ske3Rhc2tJbmRleH0tc3RlcCR7aW5kZXh9YCxcbiAgICAgICk7XG4gICAgICBpZiAoc3RlcC5zdGF0dXMgPT09ICd0byBkbycpIHtcbiAgICAgICAgc3RlcENoZWNrYm94LmNoZWNrZWQgPSBmYWxzZTtcbiAgICAgIH0gZWxzZSBpZiAoc3RlcC5zdGF0dXMgPT09ICdkb25lJykge1xuICAgICAgICBzdGVwQ2hlY2tib3guY2hlY2tlZCA9IHRydWU7XG4gICAgICB9XG4gICAgICBzdGVwQ2hlY2tib3guZGF0YXNldC5wcm9qZWN0SW5kZXggPSBwcm9qZWN0SW5kZXg7XG4gICAgICBzdGVwQ2hlY2tib3guZGF0YXNldC50YXNrSW5kZXggPSB0YXNrSW5kZXg7XG4gICAgICBzdGVwQ2hlY2tib3guZGF0YXNldC5zdGVwSW5kZXggPSBpbmRleDtcbiAgICAgIHN0ZXBMYWJlbC5zZXRBdHRyaWJ1dGUoXG4gICAgICAgICdmb3InLFxuICAgICAgICBgcHJvamVjdCR7cHJvamVjdEluZGV4fS10YXNrJHt0YXNrSW5kZXh9LXN0ZXAke2luZGV4fWAsXG4gICAgICApO1xuICAgICAgc3RlcExhYmVsLnRleHRDb250ZW50ID0gc3RlcC5kZXNjcmlwdGlvbjtcblxuICAgICAgc3RlcENoZWNrYm94LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsICgpID0+XG4gICAgICAgIHRvZ2dsZVN0ZXBTdGF0dXMoc3RlcENoZWNrYm94LCBwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCwgaW5kZXgpLFxuICAgICAgKTtcblxuICAgICAgbGlzdEl0ZW0uYXBwZW5kQ2hpbGQoc3RlcENoZWNrYm94KTtcbiAgICAgIGxpc3RJdGVtLmFwcGVuZENoaWxkKHN0ZXBMYWJlbCk7XG4gICAgICBzdGVwc0xpc3QuYXBwZW5kQ2hpbGQobGlzdEl0ZW0pO1xuICAgIH0pO1xuICAgIGlmICh0YXNrLmR1ZURhdGUgIT09ICcnKSB7XG4gICAgICBjb25zdCBkYXRlU3BhbiA9IHRhc2tJdGVtLnF1ZXJ5U2VsZWN0b3IoJy50YXNrLWluZm8nKTtcbiAgICAgIGNvbnN0IHRhc2tEdWVEYXRlID0gdGFza0l0ZW0ucXVlcnlTZWxlY3RvcignLnRhc2stZHVlLWRhdGUnKTtcblxuICAgICAgZGF0ZVNwYW4udGV4dENvbnRlbnQgPSAnRHVlIGJ5OiAnO1xuICAgICAgdGFza0R1ZURhdGUudGV4dENvbnRlbnQgPSB0YXNrLmR1ZURhdGU7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IHRvZ2dsZVRhc2tEZXRhaWxzID0gKGltZywgYm9keSkgPT4ge1xuICAgIGNvbnN0IGJ0bkltZyA9IGltZy5nZXRBdHRyaWJ1dGUoJ3NyYycpO1xuXG4gICAgaWYgKGJ0bkltZyA9PT0gJy4vaWNvbnMvZHJvcF9kb3duLnN2ZycpIHtcbiAgICAgIGltZy5zZXRBdHRyaWJ1dGUoJ3NyYycsICcuL2ljb25zL2Ryb3BfZG93bl9sZWZ0LnN2ZycpO1xuICAgIH0gZWxzZSBpZiAoYnRuSW1nID09PSAnLi9pY29ucy9kcm9wX2Rvd25fbGVmdC5zdmcnKSB7XG4gICAgICBpbWcuc2V0QXR0cmlidXRlKCdzcmMnLCAnLi9pY29ucy9kcm9wX2Rvd24uc3ZnJyk7XG4gICAgfVxuICAgIHRvZ2dsZUhpZGRlbihib2R5KTtcbiAgfTtcblxuICBjb25zdCByZW5kZXJUYXNrID0gKHByb2plY3RJbmRleCwgdGFza0luZGV4KSA9PiB7XG4gICAgY29uc3QgdGFza1JvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbnN0IHRhc2tJdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29uc3QgdGFza0l0ZW1IZWFkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjb25zdCB0YXNrVGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjb25zdCB0aXRsZUNoZWNrYm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICBjb25zdCB0aXRsZUxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgICBjb25zdCB0YXNrSXRlbVJldmVhbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbnN0IHRhc2tSZXZlYWxCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBjb25zdCB0YXNrUmV2ZWFsSW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgY29uc3QgdGFza0l0ZW1Cb2R5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29uc3QgdGFza0Rlc2NyaXB0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgIGNvbnN0IHRhc2tTdGVwcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG4gICAgY29uc3QgdGFza0RhdGVEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjb25zdCBkYXRlU3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBjb25zdCB0YXNrRHVlRGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBjb25zdCBkYXRlSW5mb1NwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgY29uc3QgdGFza1ByaW9yaXR5RGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29uc3QgcHJpb3JpdHlTcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIGNvbnN0IHRhc2tQcmlvcml0eUxldmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIGNvbnN0IHRhc2tSb3dCdG5zID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29uc3QgZWRpdFRhc2tCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBjb25zdCBlZGl0VGFza0ltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgIGNvbnN0IGRlbGV0ZVRhc2tCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBjb25zdCBkZWxldGVUYXNrSW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG5cbiAgICB0YXNrUm93LmNsYXNzTGlzdC5hZGQoJ3Rhc2stcm93Jyk7XG4gICAgdGFza1Jvdy5kYXRhc2V0LnByb2plY3RJbmRleCA9IHByb2plY3RJbmRleDtcbiAgICB0YXNrUm93LmRhdGFzZXQudGFza0luZGV4ID0gdGFza0luZGV4O1xuICAgIHRhc2tJdGVtLmNsYXNzTGlzdC5hZGQoJ3Rhc2staXRlbScpO1xuICAgIHRhc2tJdGVtSGVhZGVyLmNsYXNzTGlzdC5hZGQoJ3Rhc2staXRlbS1oZWFkZXInKTtcbiAgICB0YXNrVGl0bGUuY2xhc3NMaXN0LmFkZCgndGFzay10aXRsZScpO1xuICAgIHRpdGxlQ2hlY2tib3guc2V0QXR0cmlidXRlKCd0eXBlJywgJ2NoZWNrYm94Jyk7XG4gICAgdGl0bGVDaGVja2JveC5zZXRBdHRyaWJ1dGUoXG4gICAgICAnbmFtZScsXG4gICAgICBgcHJvamVjdCR7cHJvamVjdEluZGV4fS10YXNrJHt0YXNrSW5kZXh9YCxcbiAgICApO1xuICAgIHRpdGxlQ2hlY2tib3guc2V0QXR0cmlidXRlKCdpZCcsIGBwcm9qZWN0JHtwcm9qZWN0SW5kZXh9LXRhc2ske3Rhc2tJbmRleH1gKTtcbiAgICB0aXRsZUNoZWNrYm94LmRhdGFzZXQucHJvamVjdEluZGV4ID0gcHJvamVjdEluZGV4O1xuICAgIHRpdGxlQ2hlY2tib3guZGF0YXNldC50YXNrSW5kZXggPSB0YXNrSW5kZXg7XG4gICAgdGl0bGVMYWJlbC5zZXRBdHRyaWJ1dGUoJ2ZvcicsIGBwcm9qZWN0JHtwcm9qZWN0SW5kZXh9LXRhc2ske3Rhc2tJbmRleH1gKTtcbiAgICB0YXNrSXRlbVJldmVhbC5jbGFzc0xpc3QuYWRkKCd0YXNrLWl0ZW0tcmV2ZWFsJyk7XG4gICAgdGFza1JldmVhbEJ0bi5jbGFzc0xpc3QuYWRkKCd0YXNrLXJldmVhbC1idXR0b24nKTtcbiAgICB0YXNrUmV2ZWFsSW1nLnNldEF0dHJpYnV0ZSgnc3JjJywgJy4vaWNvbnMvZHJvcF9kb3duLnN2ZycpO1xuICAgIHRhc2tSZXZlYWxJbWcuc2V0QXR0cmlidXRlKCdhbHQnLCAnc2hvdyB0YXNrIGRldGFpbHMgZHJvcGRvd24nKTtcbiAgICB0YXNrSXRlbUJvZHkuY2xhc3NMaXN0LmFkZCgndGFzay1pdGVtLWJvZHknLCAnaGlkZGVuJyk7XG4gICAgdGFza0Rlc2NyaXB0aW9uLmNsYXNzTGlzdC5hZGQoJ3Rhc2stZGVzY3JpcHRpb24nKTtcbiAgICB0YXNrU3RlcHMuY2xhc3NMaXN0LmFkZCgndGFzay1zdGVwcycpO1xuICAgIGRhdGVTcGFuLmNsYXNzTGlzdC5hZGQoJ3Rhc2staW5mbycpO1xuICAgIHRhc2tEdWVEYXRlLmNsYXNzTGlzdC5hZGQoJ3Rhc2stZHVlLWRhdGUnKTtcbiAgICBkYXRlSW5mb1NwYW4uY2xhc3NMaXN0LmFkZCgndGFzay1kYXRlLWluZm8nKTtcbiAgICBwcmlvcml0eVNwYW4uY2xhc3NMaXN0LmFkZCgndGFzay1pbmZvJyk7XG4gICAgcHJpb3JpdHlTcGFuLnRleHRDb250ZW50ID0gJ1ByaW9yaXR5OiAnO1xuICAgIHRhc2tQcmlvcml0eUxldmVsLmNsYXNzTGlzdC5hZGQoJ3Rhc2stcHJpb3JpdHktbGV2ZWwnKTtcbiAgICB0YXNrUm93QnRucy5jbGFzc0xpc3QuYWRkKCd0YXNrLXJvdy1idXR0b25zJyk7XG4gICAgZWRpdFRhc2tJbWcuc2V0QXR0cmlidXRlKCdzcmMnLCAnLi9pY29ucy9lZGl0LnN2ZycpO1xuICAgIGVkaXRUYXNrSW1nLnNldEF0dHJpYnV0ZSgnYWx0JywgJ2VkaXQgdGFzayBidXR0b24nKTtcbiAgICBlZGl0VGFza0J0bi5kYXRhc2V0LnByb2plY3RJbmRleCA9IHByb2plY3RJbmRleDtcbiAgICBlZGl0VGFza0J0bi5kYXRhc2V0LnRhc2tJbmRleCA9IHRhc2tJbmRleDtcbiAgICBkZWxldGVUYXNrSW1nLnNldEF0dHJpYnV0ZSgnc3JjJywgJy4vaWNvbnMvZGVsZXRlLnN2ZycpO1xuICAgIGRlbGV0ZVRhc2tJbWcuc2V0QXR0cmlidXRlKCdhbHQnLCAnZGVsZXRlIHRhc2sgYnV0dG9uJyk7XG4gICAgZGVsZXRlVGFza0J0bi5kYXRhc2V0LnByb2plY3RJbmRleCA9IHByb2plY3RJbmRleDtcbiAgICBkZWxldGVUYXNrQnRuLmRhdGFzZXQudGFza0luZGV4ID0gdGFza0luZGV4O1xuXG4gICAgdW5maW5pc2hlZERpdi5hcHBlbmRDaGlsZCh0YXNrUm93KTtcbiAgICB0YXNrUm93LmFwcGVuZENoaWxkKHRhc2tJdGVtKTtcbiAgICB0YXNrSXRlbS5hcHBlbmRDaGlsZCh0YXNrSXRlbUhlYWRlcik7XG4gICAgdGFza0l0ZW1IZWFkZXIuYXBwZW5kQ2hpbGQodGFza1RpdGxlKTtcbiAgICB0YXNrVGl0bGUuYXBwZW5kQ2hpbGQodGl0bGVDaGVja2JveCk7XG4gICAgdGFza1RpdGxlLmFwcGVuZENoaWxkKHRpdGxlTGFiZWwpO1xuICAgIHRhc2tJdGVtSGVhZGVyLmFwcGVuZENoaWxkKHRhc2tJdGVtUmV2ZWFsKTtcbiAgICB0YXNrSXRlbVJldmVhbC5hcHBlbmRDaGlsZCh0YXNrUmV2ZWFsQnRuKTtcbiAgICB0YXNrUmV2ZWFsQnRuLmFwcGVuZENoaWxkKHRhc2tSZXZlYWxJbWcpO1xuICAgIHRhc2tJdGVtLmFwcGVuZENoaWxkKHRhc2tJdGVtQm9keSk7XG4gICAgdGFza0l0ZW1Cb2R5LmFwcGVuZENoaWxkKHRhc2tEZXNjcmlwdGlvbik7XG4gICAgdGFza0l0ZW1Cb2R5LmFwcGVuZENoaWxkKHRhc2tTdGVwcyk7XG4gICAgdGFza0l0ZW1Cb2R5LmFwcGVuZENoaWxkKHRhc2tEYXRlRGl2KTtcbiAgICB0YXNrRGF0ZURpdi5hcHBlbmRDaGlsZChkYXRlU3Bhbik7XG4gICAgdGFza0RhdGVEaXYuYXBwZW5kQ2hpbGQodGFza0R1ZURhdGUpO1xuICAgIHRhc2tEYXRlRGl2LmFwcGVuZENoaWxkKGRhdGVJbmZvU3Bhbik7XG4gICAgdGFza0l0ZW1Cb2R5LmFwcGVuZENoaWxkKHRhc2tQcmlvcml0eURpdik7XG4gICAgdGFza1ByaW9yaXR5RGl2LmFwcGVuZENoaWxkKHByaW9yaXR5U3Bhbik7XG4gICAgdGFza1ByaW9yaXR5RGl2LmFwcGVuZENoaWxkKHRhc2tQcmlvcml0eUxldmVsKTtcbiAgICB0YXNrUm93LmFwcGVuZENoaWxkKHRhc2tSb3dCdG5zKTtcbiAgICB0YXNrUm93QnRucy5hcHBlbmRDaGlsZChlZGl0VGFza0J0bik7XG4gICAgZWRpdFRhc2tCdG4uYXBwZW5kQ2hpbGQoZWRpdFRhc2tJbWcpO1xuICAgIHRhc2tSb3dCdG5zLmFwcGVuZENoaWxkKGRlbGV0ZVRhc2tCdG4pO1xuICAgIGRlbGV0ZVRhc2tCdG4uYXBwZW5kQ2hpbGQoZGVsZXRlVGFza0ltZyk7XG5cbiAgICByZW5kZXJUYXNrQ29udGVudChwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCk7XG5cbiAgICAvKiBBZGQgZWRpdCAmIGRlbGV0ZSBsaXN0ZW5lcnMgaGVyZSAqL1xuICAgIHRhc2tSZXZlYWxCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PlxuICAgICAgdG9nZ2xlVGFza0RldGFpbHModGFza1JldmVhbEltZywgdGFza0l0ZW1Cb2R5KSxcbiAgICApO1xuICAgIHRpdGxlQ2hlY2tib3guYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKCkgPT5cbiAgICAgIHRvZ2dsZVRhc2tTdGF0dXModGl0bGVDaGVja2JveCwgcHJvamVjdEluZGV4LCB0YXNrSW5kZXgpLFxuICAgICk7XG4gICAgZGVsZXRlVGFza0J0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+XG4gICAgICBkZWxldGVUYXNrTW9kYWwub3BlbkRlbGV0ZU1vZGFsKFxuICAgICAgICBkZWxldGVUYXNrQnRuLmRhdGFzZXQucHJvamVjdEluZGV4LFxuICAgICAgICBkZWxldGVUYXNrQnRuLmRhdGFzZXQudGFza0luZGV4LFxuICAgICAgKSxcbiAgICApO1xuXG4gICAgaWYgKHRpdGxlQ2hlY2tib3guY2hlY2tlZCkge1xuICAgICAgc2VuZFRvRmluaXNoZWREaXYodGFza0luZGV4KTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgdXBkYXRlVGFza0luZGljZXMgPSAoZGVsZXRlZEluZGV4KSA9PiB7XG4gICAgY29uc3QgYWxsVGFza0luZGljZXMgPSBtYWluVGFza3MucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtdGFzay1pbmRleF0nKTtcbiAgICBhbGxUYXNrSW5kaWNlcy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICBjb25zdCBjdXJyZW50SW5kZXggPSBOdW1iZXIoZWxlbWVudC5kYXRhc2V0LnRhc2tJbmRleCk7XG4gICAgICBpZiAoY3VycmVudEluZGV4ID49IE51bWJlcihkZWxldGVkSW5kZXgpKSB7XG4gICAgICAgIGVsZW1lbnQuZGF0YXNldC50YXNrSW5kZXggPSBjdXJyZW50SW5kZXggLSAxO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IHJlbmRlckRlbGV0ZWRUYXNrID0gKHRhc2tJbmRleCkgPT4ge1xuICAgIGNvbnN0IHRhc2tUb0RlbGV0ZSA9IG1haW5UYXNrcy5xdWVyeVNlbGVjdG9yKFxuICAgICAgYGRpdltkYXRhLXRhc2staW5kZXg9JyR7dGFza0luZGV4fSddYCxcbiAgICApO1xuICAgIHRhc2tUb0RlbGV0ZS5yZW1vdmUoKTtcbiAgICB1cGRhdGVUYXNrSW5kaWNlcyh0YXNrSW5kZXgpO1xuICB9O1xuXG4gIC8qIEZ1bmN0aW9uIHRvIGludm9rZSBvbiBpbml0aWxpc2UsIGZvciB0aGUgY29tcG9uZW50IHRvIHdvcmsgcHJvcGVybHkgKi9cbiAgY29uc3QgaW5pdCA9ICgpID0+IHtcbiAgICBjb25zdCBmaXJzdFByb2plY3QgPSBwcm9qZWN0TWFuYWdlci5yZXZlYWxQcm9qZWN0KDApO1xuICAgIHJlbmRlckhlYWRlcihmaXJzdFByb2plY3QpO1xuICAgIHNldE5ld1Rhc2tCdG5JbmRleCgwKTtcbiAgICBhZGROZXdUYXNrQnRuTGlzdGVuZXIoKTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIHJlbmRlckhlYWRlcixcbiAgICBzZXROZXdUYXNrQnRuSW5kZXgsXG4gICAgYWRkTmV3VGFza0J0bkxpc3RlbmVyLFxuICAgIGNsZWFyVGFza3MsXG4gICAgcmVuZGVyVGFzayxcbiAgICByZW5kZXJEZWxldGVkVGFzayxcbiAgICBpbml0LFxuICB9O1xufSkoKTtcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi0gTW9kdWxlIHRvIGNvbnRyb2wgdGhpbmdzIGNvbW1vbiBtb3N0IG1vZGFsc1xuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbmNvbnN0IGFsbE1vZGFscyA9ICgoKSA9PiB7XG4gIC8qIEdlbmVyYWwgZnVuY3Rpb25zIHRvIGNsb3NlIG1vZGFscyBhbmQgY2xlYXIgaW5wdXRzICovXG4gIGNvbnN0IGNsZWFySW5wdXRzID0gKG1vZGFsKSA9PiB7XG4gICAgY29uc3QgaW5wdXRzID0gbW9kYWwucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQnKTtcbiAgICBjb25zdCB0ZXh0YXJlYXMgPSBtb2RhbC5xdWVyeVNlbGVjdG9yQWxsKCd0ZXh0YXJlYScpO1xuICAgIGNvbnN0IHNlbGVjdE9wdGlvbiA9IG1vZGFsLnF1ZXJ5U2VsZWN0b3IoJ29wdGlvbicpO1xuICAgIGlmIChpbnB1dHMpIHtcbiAgICAgIGlucHV0cy5mb3JFYWNoKChpbnB1dCkgPT4ge1xuICAgICAgICBpbnB1dC52YWx1ZSA9ICcnO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGlmICh0ZXh0YXJlYXMpIHtcbiAgICAgIHRleHRhcmVhcy5mb3JFYWNoKCh0ZXh0YXJlYSkgPT4ge1xuICAgICAgICB0ZXh0YXJlYS52YWx1ZSA9ICcnO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChzZWxlY3RPcHRpb24pIHtcbiAgICAgIHNlbGVjdE9wdGlvbi5zZWxlY3RlZCA9IHRydWU7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGNsb3NlTW9kYWwgPSAobW9kYWwpID0+IHtcbiAgICBjbGVhcklucHV0cyhtb2RhbCk7XG4gICAgdG9nZ2xlSGlkZGVuKG1vZGFsKTtcbiAgfTtcblxuICAvKiBGdW5jdGlvbnMgdG8gaW52b2tlIG9uIGluaXRpbGlzZSwgZm9yIHRoZSBjb21wb25lbnQgdG8gd29yayBwcm9wZXJseSAqL1xuICBjb25zdCBhZGRDbG9zZUJ0bkxpc3RlbmVycyA9ICgpID0+IHtcbiAgICBjb25zdCBjbG9zZU1vZGFsQnRucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5tb2RhbC1jbG9zZS1idXR0b24nKTtcblxuICAgIGNsb3NlTW9kYWxCdG5zLmZvckVhY2goKGJ0bikgPT4ge1xuICAgICAgY29uc3QgbW9kYWwgPSBidG4ucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQ7XG4gICAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBjbG9zZU1vZGFsKG1vZGFsKSk7XG4gICAgfSk7XG4gIH07XG5cbiAgY29uc3QgYWRkQ2xvc2VCYWNrZ3JvdW5kTGlzdGVuZXJzID0gKCkgPT4ge1xuICAgIGNvbnN0IG1vZGFsQmFja2dyb3VuZHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubW9kYWwtYmFja2dyb3VuZCcpO1xuICAgIGNvbnN0IGNsb3NlID0gKGUsIG1vZGFsQmFja2dyb3VuZCkgPT4ge1xuICAgICAgaWYgKCFlLnRhcmdldC5jbG9zZXN0KCcubW9kYWwnKSkge1xuICAgICAgICBjbG9zZU1vZGFsKG1vZGFsQmFja2dyb3VuZCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIG1vZGFsQmFja2dyb3VuZHMuZm9yRWFjaCgoYmFja2dyb3VuZCkgPT4ge1xuICAgICAgYmFja2dyb3VuZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiBjbG9zZShlLCBiYWNrZ3JvdW5kKSk7XG4gICAgfSk7XG4gIH07XG5cbiAgcmV0dXJuIHsgY2xvc2VNb2RhbCwgYWRkQ2xvc2VCdG5MaXN0ZW5lcnMsIGFkZENsb3NlQmFja2dyb3VuZExpc3RlbmVycyB9O1xufSkoKTtcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi0gJ05ldyBMaXN0JyBtb2RhbCBtb2R1bGVcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5jb25zdCBuZXdMaXN0TW9kYWwgPSAoKCkgPT4ge1xuICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uZXctbGlzdC1tb2RhbCcpLnBhcmVudEVsZW1lbnQ7XG4gIGNvbnN0IHN1Ym1pdEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZXctbGlzdC1zdWJtaXQtYnV0dG9uJyk7XG5cbiAgY29uc3QgY3JlYXROZXdMaXN0ID0gKGUpID0+IHtcbiAgICBjb25zdCB0aXRsZUlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25ldy1saXN0LW5hbWUnKS52YWx1ZTtcbiAgICBjb25zdCBkZXNjcmlwdGlvbklucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG4gICAgICAnbmV3LWxpc3QtZGVzY3JpcHRpb24nLFxuICAgICkudmFsdWU7XG5cbiAgICBpZiAodGl0bGVJbnB1dCAhPT0gJycpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgY29uc3QgbmV3TGlzdCA9IHByb2plY3RNYW5hZ2VyLmNyZWF0ZU5ld1Byb2plY3QoXG4gICAgICAgIHRpdGxlSW5wdXQsXG4gICAgICAgIGRlc2NyaXB0aW9uSW5wdXQsXG4gICAgICApO1xuICAgICAgbmF2YmFyLnJlbmRlck5ld0xpc3QobmV3TGlzdCwgbmF2YmFyLmNhbGN1bGF0ZU5ld1Byb2plY3RJbmRleCgpKTtcblxuICAgICAgYWxsTW9kYWxzLmNsb3NlTW9kYWwobW9kYWwpO1xuICAgIH1cbiAgfTtcblxuICAvKiBGdW5jdGlvbiB0byBpbnZva2Ugb24gaW5pdGlsaXNlLCBmb3IgdGhlIGNvbXBvbmVudCB0byB3b3JrIHByb3Blcmx5ICovXG4gIGNvbnN0IGFkZFN1Ym1pdEJ0bkxpc3RlbmVyID0gKCkgPT4ge1xuICAgIHN1Ym1pdEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiBjcmVhdE5ld0xpc3QoZSkpO1xuICB9O1xuXG4gIHJldHVybiB7IGFkZFN1Ym1pdEJ0bkxpc3RlbmVyIH07XG59KSgpO1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLSAnRWRpdCBsaXN0JyBtb2RhbCBtb2R1bGVcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5jb25zdCBlZGl0TGlzdE1vZGFsID0gKCgpID0+IHtcbiAgY29uc3QgbW9kYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZWRpdC1saXN0LW1vZGFsJykucGFyZW50RWxlbWVudDtcbiAgY29uc3QgZWRpdEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlZGl0LWxpc3Qtc3VibWl0LWJ1dHRvbicpO1xuXG4gIGNvbnN0IHNldFByb2plY3REYXRhSW5kZXggPSAocHJvamVjdEluZGV4KSA9PiB7XG4gICAgZWRpdEJ0bi5kYXRhc2V0LnByb2plY3RJbmRleCA9IHByb2plY3RJbmRleDtcbiAgfTtcblxuICBjb25zdCBvcGVuRWRpdE1vZGFsID0gKHByb2plY3RJbmRleCkgPT4ge1xuICAgIGNvbnN0IHRpdGxlSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZWRpdC1saXN0LW5hbWUnKTtcbiAgICBjb25zdCBkZXNjcmlwdGlvbklucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VkaXQtbGlzdC1kZXNjcmlwdGlvbicpO1xuICAgIGNvbnN0IHByb2plY3RUb0VkaXQgPSBwcm9qZWN0TWFuYWdlci5yZXZlYWxQcm9qZWN0KE51bWJlcihwcm9qZWN0SW5kZXgpKTtcblxuICAgIHRpdGxlSW5wdXQudmFsdWUgPSBwcm9qZWN0VG9FZGl0LnRpdGxlO1xuICAgIGRlc2NyaXB0aW9uSW5wdXQudmFsdWUgPSBwcm9qZWN0VG9FZGl0LmRlc2NyaXB0aW9uO1xuXG4gICAgc2V0UHJvamVjdERhdGFJbmRleChwcm9qZWN0SW5kZXgpO1xuICAgIHRvZ2dsZUhpZGRlbihtb2RhbCk7XG4gIH07XG5cbiAgY29uc3QgZWRpdExpc3QgPSAoZSkgPT4ge1xuICAgIGNvbnN0IHRpdGxlSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZWRpdC1saXN0LW5hbWUnKS52YWx1ZTtcbiAgICBjb25zdCBkZXNjcmlwdGlvbklucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG4gICAgICAnZWRpdC1saXN0LWRlc2NyaXB0aW9uJyxcbiAgICApLnZhbHVlO1xuICAgIGNvbnN0IGluZGV4ID0gTnVtYmVyKGVkaXRCdG4uZGF0YXNldC5wcm9qZWN0SW5kZXgpO1xuXG4gICAgaWYgKHRpdGxlSW5wdXQgIT09ICcnKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBwcm9qZWN0TWFuYWdlci5lZGl0UHJvamVjdFRpdGxlKGluZGV4LCB0aXRsZUlucHV0KTtcbiAgICAgIHByb2plY3RNYW5hZ2VyLmVkaXRQcm9qZWN0RGVzY3JpcHRpb24oaW5kZXgsIGRlc2NyaXB0aW9uSW5wdXQpO1xuICAgICAgbmF2YmFyLnJlbmRlckVkaXRlZExpc3QoaW5kZXgsIHByb2plY3RNYW5hZ2VyLnJldmVhbFByb2plY3QoaW5kZXgpKTtcbiAgICAgIGFsbE1vZGFscy5jbG9zZU1vZGFsKG1vZGFsKTtcbiAgICB9XG4gIH07XG5cbiAgLyogRnVuY3Rpb24gdG8gaW52b2tlIG9uIGluaXRpbGlzZSwgZm9yIHRoZSBjb21wb25lbnQgdG8gd29yayBwcm9wZXJseSAqL1xuICBjb25zdCBhZGRFZGl0QnRuTGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgZWRpdEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiBlZGl0TGlzdChlKSk7XG4gIH07XG5cbiAgcmV0dXJuIHsgb3BlbkVkaXRNb2RhbCwgYWRkRWRpdEJ0bkxpc3RlbmVyIH07XG59KSgpO1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLSAnRGVsZXRlIGxpc3QnIG1vZGFsIG1vZHVsZVxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbmNvbnN0IGRlbGV0ZUxpc3RNb2RhbCA9ICgoKSA9PiB7XG4gIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRlbGV0ZS1saXN0LW1vZGFsJykucGFyZW50RWxlbWVudDtcbiAgY29uc3QgY2FuY2VsQnRuID0gbW9kYWwucXVlcnlTZWxlY3RvcignLmNhbmNlbC1idXR0b24nKTtcbiAgY29uc3QgZGVsZXRlQnRuID0gbW9kYWwucXVlcnlTZWxlY3RvcignLmRlbGV0ZS1idXR0b24nKTtcblxuICBjb25zdCBzZXRQcm9qZWN0RGF0YUluZGV4ID0gKHByb2plY3RJbmRleCkgPT4ge1xuICAgIGRlbGV0ZUJ0bi5kYXRhc2V0LnByb2plY3RJbmRleCA9IHByb2plY3RJbmRleDtcbiAgfTtcblxuICBjb25zdCBvcGVuRGVsZXRlTW9kYWwgPSAocHJvamVjdEluZGV4KSA9PiB7XG4gICAgc2V0UHJvamVjdERhdGFJbmRleChwcm9qZWN0SW5kZXgpO1xuICAgIHRvZ2dsZUhpZGRlbihtb2RhbCk7XG4gIH07XG5cbiAgY29uc3QgZGVsZXRlTGlzdCA9ICgpID0+IHtcbiAgICBjb25zdCBpbmRleCA9IE51bWJlcihkZWxldGVCdG4uZGF0YXNldC5wcm9qZWN0SW5kZXgpO1xuICAgIHByb2plY3RNYW5hZ2VyLmRlbGV0ZVByb2plY3QoaW5kZXgpO1xuICAgIG5hdmJhci5yZW5kZXJEZWxldGVkTGlzdChpbmRleCk7XG4gICAgdG9nZ2xlSGlkZGVuKG1vZGFsKTtcbiAgfTtcblxuICAvKiBGdW5jdGlvbnMgdG8gaW52b2tlIG9uIGluaXRpbGlzZSwgZm9yIHRoZSBjb21wb25lbnQgdG8gd29yayBwcm9wZXJseSAqL1xuICBjb25zdCBhZGRDYW5jZWxCdG5MaXN0ZW5lciA9ICgpID0+IHtcbiAgICBjYW5jZWxCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB0b2dnbGVIaWRkZW4obW9kYWwpKTtcbiAgfTtcblxuICBjb25zdCBhZGREZWxldGVCdG5MaXN0ZW5lciA9ICgpID0+IHtcbiAgICBkZWxldGVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBkZWxldGVMaXN0KTtcbiAgfTtcblxuICByZXR1cm4geyBvcGVuRGVsZXRlTW9kYWwsIGFkZENhbmNlbEJ0bkxpc3RlbmVyLCBhZGREZWxldGVCdG5MaXN0ZW5lciB9O1xufSkoKTtcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi0gJ05ldyB0YXNrJyBtb2RhbCBtb2R1bGVcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5jb25zdCBuZXdUYXNrTW9kYWwgPSAoKCkgPT4ge1xuICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uZXctdGFzay1tb2RhbCcpLnBhcmVudEVsZW1lbnQ7XG4gIGNvbnN0IG5ld1Rhc2tCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmV3LXRhc2stc3VibWl0LWJ1dHRvbicpO1xuICBjb25zdCBzdGVwc0xpc3QgPSBtb2RhbC5xdWVyeVNlbGVjdG9yKCcubW9kYWwtc3RlcHMtbGlzdCcpO1xuXG4gIGNvbnN0IHNldFByb2plY3REYXRhSW5kZXggPSAocHJvamVjdEluZGV4KSA9PiB7XG4gICAgbmV3VGFza0J0bi5kYXRhc2V0LnByb2plY3RJbmRleCA9IHByb2plY3RJbmRleDtcbiAgfTtcblxuICBjb25zdCBvcGVuTmV3VGFza01vZGFsID0gKHByb2plY3RJbmRleCkgPT4ge1xuICAgIHNldFByb2plY3REYXRhSW5kZXgocHJvamVjdEluZGV4KTtcbiAgICBzdGVwc0NvbXBvbmVudC5jbGVhckFsbFN0ZXBzKHN0ZXBzTGlzdCk7XG4gICAgdG9nZ2xlSGlkZGVuKG1vZGFsKTtcbiAgfTtcblxuICBjb25zdCBzdWJtaXROZXdUYXNrID0gKGUpID0+IHtcbiAgICBjb25zdCBwcm9qZWN0SW5kZXggPSBOdW1iZXIobmV3VGFza0J0bi5kYXRhc2V0LnByb2plY3RJbmRleCk7XG4gICAgY29uc3QgbmV3VGl0bGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmV3LXRhc2stbmFtZScpLnZhbHVlO1xuICAgIGNvbnN0IG5ld0Rlc2NyaXB0aW9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG4gICAgICAnbmV3LXRhc2stZGVzY3JpcHRpb24nLFxuICAgICkudmFsdWU7XG4gICAgY29uc3QgbmV3RGF0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZXctdGFzay1kYXRlJykudmFsdWU7XG4gICAgY29uc3QgbmV3UHJpb3JpdHkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmV3LXRhc2stcHJpb3JpdHknKS52YWx1ZTtcbiAgICBjb25zdCBuZXdTdGVwcyA9IHN0ZXBzQ29tcG9uZW50LnJldmVhbFN0ZXBzKCk7XG5cbiAgICBpZiAobmV3VGl0bGUgIT09ICcnKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB0YXNrTWFuYWdlci5jcmVhdGVOZXdUYXNrKFxuICAgICAgICBwcm9qZWN0SW5kZXgsXG4gICAgICAgIG5ld1RpdGxlLFxuICAgICAgICBuZXdEZXNjcmlwdGlvbixcbiAgICAgICAgbmV3RGF0ZSxcbiAgICAgICAgbmV3UHJpb3JpdHksXG4gICAgICAgICd0byBkbycsXG4gICAgICApO1xuICAgICAgY29uc3QgbGVuZ3RoID0gcHJvamVjdE1hbmFnZXIucmV2ZWFsUHJvamVjdFRhc2tzTGVuZ3RoKHByb2plY3RJbmRleCk7XG4gICAgICBuZXdTdGVwcy5mb3JFYWNoKChzdGVwKSA9PiB7XG4gICAgICAgIHN0ZXBNYW5hZ2VyLmNyZWF0ZU5ld1N0ZXAoXG4gICAgICAgICAgcHJvamVjdEluZGV4LFxuICAgICAgICAgIGxlbmd0aCAtIDEsXG4gICAgICAgICAgc3RlcC5kZXNjcmlwdGlvbixcbiAgICAgICAgICBzdGVwLnN0YXR1cyxcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgICAgbWFpbi5yZW5kZXJUYXNrKHByb2plY3RJbmRleCwgbGVuZ3RoIC0gMSk7XG4gICAgICBhbGxNb2RhbHMuY2xvc2VNb2RhbChtb2RhbCk7XG4gICAgfVxuICB9O1xuXG4gIC8qIEZ1bmN0aW9ucyB0byBpbnZva2Ugb24gaW5pdGlsaXNlLCBmb3IgdGhlIGNvbXBvbmVudCB0byB3b3JrIHByb3Blcmx5ICovXG4gIGNvbnN0IGFkZE5ld1Rhc2tCdG5MSXN0ZW5lciA9ICgpID0+IHtcbiAgICBuZXdUYXNrQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHN1Ym1pdE5ld1Rhc2soZSkpO1xuICB9O1xuXG4gIHJldHVybiB7IG9wZW5OZXdUYXNrTW9kYWwsIGFkZE5ld1Rhc2tCdG5MSXN0ZW5lciB9O1xufSkoKTtcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi0gU3RlcHMgY29tcG9uZW50IG1vZHVsZVxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbmNvbnN0IHN0ZXBzQ29tcG9uZW50ID0gKCgpID0+IHtcbiAgY29uc3QgbmV3U3RlcEJ0bnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYWRkLXN0ZXAtYnV0dG9uJyk7XG4gIGxldCBtb2RhbDtcbiAgbGV0IHN0ZXBzTGlzdDtcbiAgbGV0IG5ld1N0ZXBCdG47XG4gIGNvbnN0IHN0ZXBzID0gW107XG5cbiAgY29uc3QgY2xlYXJBbGxTdGVwcyA9ICh1bCkgPT4ge1xuICAgIGNvbnN0IHVsVG9DbGVhciA9IHVsO1xuICAgIHN0ZXBzLmxlbmd0aCA9IDA7XG4gICAgdWxUb0NsZWFyLmlubmVySFRNTCA9ICcnO1xuICB9O1xuXG4gIGNvbnN0IHJldmVhbFN0ZXBzID0gKCkgPT4gc3RlcHM7XG5cbiAgY29uc3QgcmVuZGVyU3RlcCA9IChsaXN0SXRlbSwgc3RlcCwgaW5kZXgpID0+IHtcbiAgICBjb25zdCBjaGVja2JveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgY29uc3QgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICAgIGNvbnN0IGVkaXRTdGVwQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgY29uc3QgZWRpdFN0ZXBJbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICBjb25zdCBkZWxldGVTdGVwQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgY29uc3QgZGVsZXRlU3RlcEltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuXG4gICAgY2hlY2tib3guc2V0QXR0cmlidXRlKCd0eXBlJywgJ2NoZWNrYm94Jyk7XG4gICAgY2hlY2tib3guc2V0QXR0cmlidXRlKCduYW1lJywgYHN0ZXAtc3RhdHVzLSR7aW5kZXh9YCk7XG4gICAgY2hlY2tib3guc2V0QXR0cmlidXRlKCdpZCcsIGBzdGVwLXN0YXR1cy0ke2luZGV4fWApO1xuICAgIGNoZWNrYm94LmRhdGFzZXQuc3RlcEluZGV4ID0gaW5kZXg7XG4gICAgaWYgKHN0ZXAuc3RhdHVzID09PSAnZG9uZScpIHtcbiAgICAgIGNoZWNrYm94LmNoZWNrZWQgPSB0cnVlO1xuICAgIH1cbiAgICBsYWJlbC5zZXRBdHRyaWJ1dGUoJ2ZvcicsIGBzdGVwLXN0YXR1cy0ke2luZGV4fWApO1xuICAgIGxhYmVsLnRleHRDb250ZW50ID0gc3RlcC5kZXNjcmlwdGlvbjtcbiAgICBlZGl0U3RlcEJ0bi5jbGFzc0xpc3QuYWRkKCdzdGVwcy1saXN0LWl0ZW0tYnV0dG9uJyk7XG4gICAgZWRpdFN0ZXBCdG4uZGF0YXNldC5zdGVwSW5kZXggPSBpbmRleDtcbiAgICBlZGl0U3RlcEltZy5zZXRBdHRyaWJ1dGUoJ3NyYycsICcuL2ljb25zL2VkaXQuc3ZnJyk7XG4gICAgZWRpdFN0ZXBJbWcuc2V0QXR0cmlidXRlKCdhbHQnLCAnZWRpdCBzdGVwIGJ1dHRvbicpO1xuICAgIGRlbGV0ZVN0ZXBCdG4uY2xhc3NMaXN0LmFkZCgnc3RlcHMtbGlzdC1pdGVtLWJ1dHRvbicpO1xuICAgIGRlbGV0ZVN0ZXBCdG4uZGF0YXNldC5zdGVwSW5kZXggPSBpbmRleDtcbiAgICBkZWxldGVTdGVwSW1nLnNldEF0dHJpYnV0ZSgnc3JjJywgJy4vaWNvbnMvZGVsZXRlLnN2ZycpO1xuICAgIGRlbGV0ZVN0ZXBJbWcuc2V0QXR0cmlidXRlKCdhbHQnLCAnZGVsZXRlIHN0ZXAgYnV0dG9uJyk7XG5cbiAgICBjaGVja2JveC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoKSA9PlxuICAgICAgdXBkYXRlU3RlcFN0YXR1cyhjaGVja2JveC5jaGVja2VkLCBOdW1iZXIoY2hlY2tib3guZGF0YXNldC5zdGVwSW5kZXgpKSxcbiAgICApO1xuICAgIGVkaXRTdGVwQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2KSA9PlxuICAgICAgcmVuZGVyRWRpdFN0ZXAoZXYsIGVkaXRTdGVwQnRuLmRhdGFzZXQuc3RlcEluZGV4KSxcbiAgICApO1xuICAgIGRlbGV0ZVN0ZXBCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXYpID0+XG4gICAgICBkZWxldGVTdGVwKGV2LCBkZWxldGVTdGVwQnRuLmRhdGFzZXQuc3RlcEluZGV4KSxcbiAgICApO1xuXG4gICAgbGlzdEl0ZW0uYXBwZW5kQ2hpbGQoY2hlY2tib3gpO1xuICAgIGxpc3RJdGVtLmFwcGVuZENoaWxkKGxhYmVsKTtcbiAgICBsaXN0SXRlbS5hcHBlbmRDaGlsZChlZGl0U3RlcEJ0bik7XG4gICAgZWRpdFN0ZXBCdG4uYXBwZW5kQ2hpbGQoZWRpdFN0ZXBJbWcpO1xuICAgIGxpc3RJdGVtLmFwcGVuZENoaWxkKGRlbGV0ZVN0ZXBCdG4pO1xuICAgIGRlbGV0ZVN0ZXBCdG4uYXBwZW5kQ2hpbGQoZGVsZXRlU3RlcEltZyk7XG4gIH07XG5cbiAgY29uc3QgdXBkYXRlU3RlcElkaWNlcyA9ICgpID0+IHtcbiAgICBjb25zdCBhbGxTdGVwcyA9IHN0ZXBzTGlzdC5jaGlsZHJlbjtcbiAgICBsZXQgaW5kZXggPSAwO1xuICAgIGZvciAoY29uc3QgbGlzdEl0ZW0gb2YgYWxsU3RlcHMpIHtcbiAgICAgIGNvbnN0IGNoZWNrYm94ID0gbGlzdEl0ZW0ucXVlcnlTZWxlY3RvcignaW5wdXQnKTtcbiAgICAgIGNvbnN0IGxhYmVsID0gbGlzdEl0ZW0ucXVlcnlTZWxlY3RvcignbGFiZWwnKTtcbiAgICAgIGNvbnN0IGJ1dHRvbnMgPSBsaXN0SXRlbS5xdWVyeVNlbGVjdG9yQWxsKCcuc3RlcHMtbGlzdC1pdGVtLWJ1dHRvbicpO1xuXG4gICAgICBjaGVja2JveC5zZXRBdHRyaWJ1dGUoJ25hbWUnLCBgc3RlcC1zdGF0dXMtJHtpbmRleH1gKTtcbiAgICAgIGNoZWNrYm94LnNldEF0dHJpYnV0ZSgnaWQnLCBgc3RlcC1zdGF0dXMtJHtpbmRleH1gKTtcbiAgICAgIGNoZWNrYm94LmRhdGFzZXQuc3RlcEluZGV4ID0gaW5kZXg7XG4gICAgICBsYWJlbC5zZXRBdHRyaWJ1dGUoJ2ZvcicsIGBzdGVwLXN0YXR1cy0ke2luZGV4fWApO1xuICAgICAgYnV0dG9ucy5mb3JFYWNoKChidXR0b24pID0+IHtcbiAgICAgICAgYnV0dG9uLmRhdGFzZXQuc3RlcEluZGV4ID0gaW5kZXg7XG4gICAgICB9KTtcbiAgICAgIGluZGV4ICs9IDE7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IHVwZGF0ZVN0ZXBTdGF0dXMgPSAobmV3U3RhdHVzLCBpbmRleCkgPT4ge1xuICAgIGlmIChuZXdTdGF0dXMgPT09IHRydWUpIHtcbiAgICAgIHN0ZXBzW2luZGV4XS5zdGF0dXMgPSAnZG9uZSc7XG4gICAgfSBlbHNlIGlmIChuZXdTdGF0dXMgPT09IGZhbHNlKSB7XG4gICAgICBzdGVwc1tpbmRleF0uc3RhdHVzID0gJ3RvIGRvJztcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgZWRpdFN0ZXAgPSAoZSwgc3RlcEluZGV4LCBlZGl0ZWRTdGVwVmFsdWUpID0+IHtcbiAgICBjb25zdCBzdGVwVG9FZGl0ID0gZS50YXJnZXQuY2xvc2VzdCgnbGknKTtcbiAgICBjb25zdCBpbnB1dCA9IHN0ZXBUb0VkaXQucXVlcnlTZWxlY3RvcignaW5wdXQnKTtcbiAgICBjb25zdCBzdWJtaXRTdGVwQnRuID0gaW5wdXQubmV4dEVsZW1lbnRTaWJsaW5nO1xuICAgIGNvbnN0IGVkaXRTdGVwQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgY29uc3QgZWRpdFN0ZXBJbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICBjb25zdCBkZWxldGVTdGVwQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgY29uc3QgZGVsZXRlU3RlcEltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuXG4gICAgaWYgKGVkaXRlZFN0ZXBWYWx1ZSAhPT0gJycpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBzdGVwc1tzdGVwSW5kZXhdLmRlc2NyaXB0aW9uID0gZWRpdGVkU3RlcFZhbHVlO1xuICAgICAgaW5wdXQucmVtb3ZlKCk7XG4gICAgICBzdWJtaXRTdGVwQnRuLnJlbW92ZSgpO1xuICAgICAgcmVuZGVyU3RlcChzdGVwVG9FZGl0LCBzdGVwc1tzdGVwSW5kZXhdLCBzdGVwSW5kZXgpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCByZW5kZXJFZGl0U3RlcCA9IChldiwgaW5kZXgpID0+IHtcbiAgICBjb25zdCBzdGVwSW5kZXggPSBOdW1iZXIoaW5kZXgpO1xuICAgIGNvbnN0IHN0ZXBUb0VkaXQgPSBldi50YXJnZXQuY2xvc2VzdCgnbGknKTtcbiAgICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgY29uc3Qgc3VibWl0U3RlcEJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGNvbnN0IHN1Ym1pdEltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuXG4gICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBzdGVwVG9FZGl0LmlubmVySFRNTCA9ICcnO1xuXG4gICAgaW5wdXQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQnKTtcbiAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoJ25hbWUnLCAnbW9kYWwtZWRpdC1zdGVwJyk7XG4gICAgaW5wdXQuc2V0QXR0cmlidXRlKCdpZCcsICdtb2RhbC1lZGl0LXN0ZXAnKTtcbiAgICBpbnB1dC5yZXF1aXJlZCA9IHRydWU7XG4gICAgaW5wdXQudmFsdWUgPSBzdGVwc1tzdGVwSW5kZXhdLmRlc2NyaXB0aW9uO1xuICAgIHN1Ym1pdFN0ZXBCdG4udGV4dENvbnRlbnQgPSAnQWx0ZXIgc3RlcCc7XG4gICAgc3VibWl0SW1nLnNldEF0dHJpYnV0ZSgnc3JjJywgJy4vaWNvbnMvY29uZmlybS5zdmcnKTtcbiAgICBzdWJtaXRJbWcuc2V0QXR0cmlidXRlKCdhbHQnLCAnY29uZmlybSBlZGl0IGJ1dHRvbicpO1xuXG4gICAgc3RlcFRvRWRpdC5hcHBlbmRDaGlsZChpbnB1dCk7XG4gICAgc3RlcFRvRWRpdC5hcHBlbmRDaGlsZChzdWJtaXRTdGVwQnRuKTtcbiAgICBzdWJtaXRTdGVwQnRuLmFwcGVuZENoaWxkKHN1Ym1pdEltZyk7XG5cbiAgICBzdWJtaXRTdGVwQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+XG4gICAgICBlZGl0U3RlcChlLCBzdGVwSW5kZXgsIGlucHV0LnZhbHVlKSxcbiAgICApO1xuICB9O1xuXG4gIGNvbnN0IGRlbGV0ZVN0ZXAgPSAoZXYsIGluZGV4KSA9PiB7XG4gICAgY29uc3Qgc3RlcEluZGV4ID0gTnVtYmVyKGluZGV4KTtcbiAgICBjb25zdCBzdGVwVG9EZWxldGUgPSBldi50YXJnZXQuY2xvc2VzdCgnbGknKTtcblxuICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgc3RlcHMuc3BsaWNlKHN0ZXBJbmRleCwgMSk7XG4gICAgc3RlcFRvRGVsZXRlLnJlbW92ZSgpO1xuICAgIHVwZGF0ZVN0ZXBJZGljZXMoKTtcbiAgfTtcblxuICBjb25zdCBhZGRTdGVwID0gKGV2dCkgPT4ge1xuICAgIGNvbnN0IG5ld1N0ZXBEZXNjcmlwdGlvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RhbC1hZGQtc3RlcCcpO1xuICAgIGNvbnN0IHN0ZXBDcmVhdG9yID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGFsLWFkZC1zdGVwJykucGFyZW50RWxlbWVudDtcbiAgICBjb25zdCBzdGVwc0xpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubW9kYWwtc3RlcHMtbGlzdCcpO1xuXG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGlmIChuZXdTdGVwRGVzY3JpcHRpb24udmFsdWUgIT09ICcnKSB7XG4gICAgICBjb25zdCBzdGVwID0ge1xuICAgICAgICBkZXNjcmlwdGlvbjogbmV3U3RlcERlc2NyaXB0aW9uLnZhbHVlLFxuICAgICAgICBzdGF0dXM6ICd0byBkbycsXG4gICAgICB9O1xuICAgICAgY29uc3QgbGlzdEl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuXG4gICAgICBzdGVwcy5wdXNoKHN0ZXApO1xuICAgICAgc3RlcHNMaXN0LmFwcGVuZENoaWxkKGxpc3RJdGVtKTtcbiAgICAgIHJlbmRlclN0ZXAobGlzdEl0ZW0sIHN0ZXBzW3N0ZXBzLmxlbmd0aCAtIDFdLCBzdGVwcy5sZW5ndGggLSAxKTtcbiAgICB9XG4gICAgdG9nZ2xlSGlkZGVuKG5ld1N0ZXBCdG4pO1xuICAgIHN0ZXBDcmVhdG9yLnJlbW92ZSgpO1xuICB9O1xuXG4gIGNvbnN0IHJlbmRlckNyZWF0ZVN0ZXAgPSAoZSkgPT4ge1xuICAgIGNvbnN0IGxpc3RJdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgY29uc3Qgc3VibWl0U3RlcEJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGNvbnN0IHN1Ym1pdEltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGlucHV0LnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0Jyk7XG4gICAgaW5wdXQuc2V0QXR0cmlidXRlKCduYW1lJywgJ21vZGFsLWFkZC1zdGVwJyk7XG4gICAgaW5wdXQuc2V0QXR0cmlidXRlKCdpZCcsICdtb2RhbC1hZGQtc3RlcCcpO1xuICAgIHN1Ym1pdFN0ZXBCdG4udGV4dENvbnRlbnQgPSAnQWRkIHN0ZXAnO1xuICAgIHN1Ym1pdEltZy5zZXRBdHRyaWJ1dGUoJ3NyYycsICcuL2ljb25zL2NvbmZpcm0uc3ZnJyk7XG4gICAgc3VibWl0SW1nLnNldEF0dHJpYnV0ZSgnYWx0JywgJ2NvbmZpcm0gc3RlcCBidXR0b24nKTtcblxuICAgIHN1Ym1pdFN0ZXBCdG4uYXBwZW5kQ2hpbGQoc3VibWl0SW1nKTtcbiAgICBsaXN0SXRlbS5hcHBlbmRDaGlsZChpbnB1dCk7XG4gICAgbGlzdEl0ZW0uYXBwZW5kQ2hpbGQoc3VibWl0U3RlcEJ0bik7XG4gICAgc3RlcHNMaXN0LmFwcGVuZENoaWxkKGxpc3RJdGVtKTtcblxuICAgIHN1Ym1pdFN0ZXBCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZ0KSA9PiBhZGRTdGVwKGV2dCkpO1xuICAgIHRvZ2dsZUhpZGRlbihuZXdTdGVwQnRuKTtcbiAgfTtcblxuICAvKiBGdW5jdGlvbiB0byBpbnZva2Ugb24gaW5pdGlsaXNlLCBmb3IgdGhlIGNvbXBvbmVudCB0byB3b3JrIHByb3Blcmx5ICovXG4gIGNvbnN0IGFkZE5ld1N0ZXBCdG5MaXN0ZW5lcnMgPSAoKSA9PiB7XG4gICAgbmV3U3RlcEJ0bnMuZm9yRWFjaCgoYnRuKSA9PiB7XG4gICAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICBpZiAoZS50YXJnZXQuY2xvc2VzdCgnLm5ldy10YXNrLW1vZGFsJykpIHtcbiAgICAgICAgICBtb2RhbCA9IGUudGFyZ2V0LmNsb3Nlc3QoJy5uZXctdGFzay1tb2RhbCcpLnBhcmVudEVsZW1lbnQ7XG4gICAgICAgIH0gZWxzZSBpZiAoZS50YXJnZXQuY2xvc2VzdCgnZWRpdC10YXNrLW1vZGFsJykpIHtcbiAgICAgICAgICBtb2RhbCA9IGUudGFyZ2V0LmNsb3Nlc3QoJ2VkaXQtdGFzay1tb2RhbCcpLnBhcmVudEVsZW1lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgc3RlcHNMaXN0ID0gbW9kYWwucXVlcnlTZWxlY3RvcignLm1vZGFsLXN0ZXBzLWxpc3QnKTtcbiAgICAgICAgbmV3U3RlcEJ0biA9IG1vZGFsLnF1ZXJ5U2VsZWN0b3IoJy5hZGQtc3RlcC1idXR0b24nKTtcbiAgICAgICAgcmVuZGVyQ3JlYXRlU3RlcChlKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiB7IGNsZWFyQWxsU3RlcHMsIHJldmVhbFN0ZXBzLCBhZGROZXdTdGVwQnRuTGlzdGVuZXJzIH07XG59KSgpO1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLSAnRGVsZXRlIHRhc2snIG1vZGFsIG1vZHVsZVxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbmNvbnN0IGRlbGV0ZVRhc2tNb2RhbCA9ICgoKSA9PiB7XG4gIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRlbGV0ZS10YXNrLW1vZGFsJykucGFyZW50RWxlbWVudDtcbiAgY29uc3QgY2FuY2VsQnRuID0gbW9kYWwucXVlcnlTZWxlY3RvcignLmNhbmNlbC1idXR0b24nKTtcbiAgY29uc3QgZGVsZXRlQnRuID0gbW9kYWwucXVlcnlTZWxlY3RvcignLmRlbGV0ZS1idXR0b24nKTtcblxuICBjb25zdCBzZXRQcm9qZWN0RGF0YUluZGV4ID0gKHByb2plY3RJbmRleCkgPT4ge1xuICAgIGRlbGV0ZUJ0bi5kYXRhc2V0LnByb2plY3RJbmRleCA9IHByb2plY3RJbmRleDtcbiAgfTtcblxuICBjb25zdCBzZXRUYXNrRGF0YUluZGV4ID0gKHRhc2tJbmRleCkgPT4ge1xuICAgIGRlbGV0ZUJ0bi5kYXRhc2V0LnRhc2tJbmRleCA9IHRhc2tJbmRleDtcbiAgfTtcblxuICBjb25zdCBvcGVuRGVsZXRlTW9kYWwgPSAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgpID0+IHtcbiAgICBzZXRQcm9qZWN0RGF0YUluZGV4KHByb2plY3RJbmRleCk7XG4gICAgc2V0VGFza0RhdGFJbmRleCh0YXNrSW5kZXgpO1xuICAgIHRvZ2dsZUhpZGRlbihtb2RhbCk7XG4gIH07XG5cbiAgY29uc3QgZGVsZXRlVGFzayA9ICgpID0+IHtcbiAgICBjb25zdCBwcm9qZWN0SW5kZXggPSBOdW1iZXIoZGVsZXRlQnRuLmRhdGFzZXQucHJvamVjdEluZGV4KTtcbiAgICBjb25zdCB0YXNrSW5kZXggPSBOdW1iZXIoZGVsZXRlQnRuLmRhdGFzZXQudGFza0luZGV4KTtcbiAgICB0YXNrTWFuYWdlci5kZWxldGVUYXNrKHByb2plY3RJbmRleCwgdGFza0luZGV4KTtcbiAgICBtYWluLnJlbmRlckRlbGV0ZWRUYXNrKHRhc2tJbmRleCk7XG4gICAgdG9nZ2xlSGlkZGVuKG1vZGFsKTtcbiAgfTtcblxuICAvKiBGdW5jdGlvbnMgdG8gaW52b2tlIG9uIGluaXRpbGlzZSwgZm9yIHRoZSBjb21wb25lbnQgdG8gd29yayBwcm9wZXJseSAqL1xuICBjb25zdCBhZGRDYW5jZWxCdG5MaXN0ZW5lciA9ICgpID0+IHtcbiAgICBjYW5jZWxCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB0b2dnbGVIaWRkZW4obW9kYWwpKTtcbiAgfTtcblxuICBjb25zdCBhZGREZWxldGVCdG5MaXN0ZW5lciA9ICgpID0+IHtcbiAgICBkZWxldGVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBkZWxldGVUYXNrKTtcbiAgfTtcbiAgcmV0dXJuIHsgb3BlbkRlbGV0ZU1vZGFsLCBhZGRDYW5jZWxCdG5MaXN0ZW5lciwgYWRkRGVsZXRlQnRuTGlzdGVuZXIgfTtcbn0pKCk7XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4tIEluaXRpYWxpc2VyIGZ1bmN0aW9uXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuY29uc3QgaW5pdGlhbGlzZVVJID0gKCkgPT4ge1xuICBoZWFkZXIuYWRkSGVhZGVyTGlzdGVuZXJzKCk7XG5cbiAgbmF2YmFyLnJlbmRlckN1cnJlbnRMaXN0cygpO1xuICBuYXZiYXIuc2V0SW5ib3hQcm9qZWN0SW5kZXgoKTtcbiAgbmF2YmFyLmFkZE5ld0xpc3RCdG5MaXN0ZW5lcigpO1xuXG4gIG1haW4uaW5pdCgpO1xuXG4gIGFsbE1vZGFscy5hZGRDbG9zZUJ0bkxpc3RlbmVycygpO1xuICBhbGxNb2RhbHMuYWRkQ2xvc2VCYWNrZ3JvdW5kTGlzdGVuZXJzKCk7XG5cbiAgbmV3TGlzdE1vZGFsLmFkZFN1Ym1pdEJ0bkxpc3RlbmVyKCk7XG4gIGVkaXRMaXN0TW9kYWwuYWRkRWRpdEJ0bkxpc3RlbmVyKCk7XG4gIGRlbGV0ZUxpc3RNb2RhbC5hZGRDYW5jZWxCdG5MaXN0ZW5lcigpO1xuICBkZWxldGVMaXN0TW9kYWwuYWRkRGVsZXRlQnRuTGlzdGVuZXIoKTtcbiAgbmV3VGFza01vZGFsLmFkZE5ld1Rhc2tCdG5MSXN0ZW5lcigpO1xuICBkZWxldGVUYXNrTW9kYWwuYWRkQ2FuY2VsQnRuTGlzdGVuZXIoKTtcbiAgZGVsZXRlVGFza01vZGFsLmFkZERlbGV0ZUJ0bkxpc3RlbmVyKCk7XG5cbiAgc3RlcHNDb21wb25lbnQuYWRkTmV3U3RlcEJ0bkxpc3RlbmVycygpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgaW5pdGlhbGlzZVVJO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBwcm9qZWN0TWFuYWdlciB9IGZyb20gJy4vdG9Eb0xpc3QnO1xuaW1wb3J0IGluaXRpYWxpc2VVSSBmcm9tICcuL3VpJztcblxucHJvamVjdE1hbmFnZXIuaW5pdGlhbGlzZSgpO1xuaW5pdGlhbGlzZVVJKCk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=