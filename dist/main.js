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

  - Aside module
	
	- Module to control things common most modals

	- 'New List' modal module

  - 'Edit list' modal module

  - 'Delete list' modal module

  - 'New task' modal module

  - Steps component module

  - 'Edit task' modal module

  - 'Delete task' modal module

	- Initialiser function
*/
/* **************************************************************
- General
************************************************************** */


const toggleHidden = (element) => {
  element.classList.toggle('hidden');
};

const hasDatePast = (date) => {
  const dateToCompare = date.split('-');
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();

  if (
    currentYear > Number(dateToCompare[0]) ||
    (currentYear === Number(dateToCompare[0]) &&
      currentMonth > Number(dateToCompare[1])) ||
    (currentYear === Number(dateToCompare[0]) &&
      currentMonth === Number(dateToCompare[1]) &&
      currentDay > Number(dateToCompare[2]))
  ) {
    return true;
  }
  return false;
};

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

    link.addEventListener('click', () => {
      main.renderMain(
        _toDoList__WEBPACK_IMPORTED_MODULE_0__.projectManager.revealProject(Number(link.dataset.projectIndex)),
        Number(link.dataset.projectIndex),
      );
    });
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

  const renderCurrentLists = () => {
    const lists = _toDoList__WEBPACK_IMPORTED_MODULE_0__.projectManager.revealAllProjects();
    lists.forEach((list) => {
      if (lists.indexOf(list) > 0) {
        renderNewList(list, lists.indexOf(list));
      }
    });
  };

  const setInboxIndexAndListener = () => {
    const inbox = document.getElementById('nav-list-inbox');
    setProjectDataIndex(inbox, 0);
    inbox.addEventListener('click', () => {
      main.renderMain(_toDoList__WEBPACK_IMPORTED_MODULE_0__.projectManager.revealProject(0), 0);
    });
  };

  const addNewListBtnListener = () => {
    const newListBtn = document.querySelector('.nav-new-list-button');
    const modalNewList =
      document.querySelector('.new-list-modal').parentElement;
    newListBtn.addEventListener('click', () => toggleHidden(modalNewList));
  };

  /* Function to invoke on initilise, for the component to work properly */
  const init = () => {
    renderCurrentLists();
    setInboxIndexAndListener();
    addNewListBtnListener();
  };

  return {
    calculateNewProjectIndex,
    renderNewList,
    renderDeletedList,
    renderEditedList,
    init,
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
        taskItem.className = '';
        taskItem.classList.add('task-item', 'priority-low');
        priorityLevel.textContent = 'Low';
        break;
      case 'medium':
        taskItem.className = '';
        taskItem.classList.add('task-item', 'priority-medium');
        priorityLevel.textContent = 'Medium';
        break;
      case 'high':
        taskItem.className = '';
        taskItem.classList.add('task-item', 'priority-high');
        priorityLevel.textContent = 'High';
        break;
      default:
        taskItem.className = '';
        taskItem.classList.add('task-item', 'priority-none');
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
    stepsList.innerHTML = '';
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
      const isLate = taskItem.querySelector('.task-date-info');

      dateSpan.textContent = 'Due by: ';
      taskDueDate.textContent = task.dueDate;
      if (hasDatePast(task.dueDate) === true) {
        isLate.textContent = 'Late!';
      } else {
        isLate.textContent = '';
      }
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

    taskRevealBtn.addEventListener('click', () =>
      toggleTaskDetails(taskRevealImg, taskItemBody),
    );
    titleCheckbox.addEventListener('change', () =>
      toggleTaskStatus(titleCheckbox, projectIndex, taskIndex),
    );
    editTaskBtn.addEventListener('click', () =>
      editTaskModal.openEditTaskModal(
        editTaskBtn.dataset.projectIndex,
        editTaskBtn.dataset.taskIndex,
      ),
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

  const renderMain = (project, projectIndex) => {
    renderHeader(project);
    setNewTaskBtnIndex(projectIndex);
    clearTasks();
    if (project.tasks.length > 0) {
      project.tasks.forEach((task) =>
        renderTask(projectIndex, project.tasks.indexOf(task)),
      );
    }
  };

  /* Function to invoke on initilise, for the component to work properly */
  const init = () => {
    const firstProject = _toDoList__WEBPACK_IMPORTED_MODULE_0__.projectManager.revealProject(0);
    renderMain(firstProject, 0);
    addNewTaskBtnListener();
  };

  return {
    renderHeader,
    setNewTaskBtnIndex,
    addNewTaskBtnListener,
    clearTasks,
    renderTaskContent,
    renderTask,
    renderDeletedTask,
    renderMain,
    init,
  };
})();

/* **************************************************************
- Aside module
************************************************************** */
const aside = (() => {
  /* const filtersAside = document.querySelector('aside'); */
  const mainTasks = document.querySelector('.unfinished-tasks');
  const searchbar = document.getElementById('search-tasks');

  const searchForMatch = () => {
    const index = Number(
      document.getElementById('main-new-task-button').dataset.projectIndex,
    );
    const currentProject = _toDoList__WEBPACK_IMPORTED_MODULE_0__.projectManager.revealProject(index);
    const textToCompare = searchbar.value;
    const filterTasks = (task) => {
      if (
        task.title.toLowerCase().includes(textToCompare.toLowerCase()) ||
        task.description.toLowerCase().includes(textToCompare.toLowerCase()) ||
        task.steps.filter((step) =>
          step.description.toLowerCase().includes(textToCompare.toLowerCase()),
        ).length > 0
      ) {
        main.renderTask(index, currentProject.tasks.indexOf(task));
        return true;
      }
      return false;
    };

    if (textToCompare !== '') {
      main.clearTasks();
      const filteredTasks = currentProject.tasks.filter((task) =>
        filterTasks(task),
      );
      if (filteredTasks.length === 0) {
        const noTasksMessage = document.createElement('p');
        noTasksMessage.textContent = 'No matches found';
        mainTasks.appendChild(noTasksMessage);
      }
    } else if (textToCompare === '') {
      main.clearTasks();
      main.renderMain(currentProject, index);
    }
  };

  /* Function to invoke on initilise, for the component to work properly */
  const addSearchbarLIstener = () => {
    searchbar.addEventListener('keyup', searchForMatch);
  };

  return { searchForMatch, addSearchbarLIstener };
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
    const stepsList = modal.querySelector('.modal-steps-list');
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
    if (stepsList) {
      stepsComponent.clearAllSteps(stepsList);
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
    const index = document.getElementById('nav-todo-lists').children.length;

    if (titleInput !== '') {
      e.preventDefault();

      const newList = _toDoList__WEBPACK_IMPORTED_MODULE_0__.projectManager.createNewProject(
        titleInput,
        descriptionInput,
      );
      navbar.renderNewList(newList, navbar.calculateNewProjectIndex());
      main.renderMain(_toDoList__WEBPACK_IMPORTED_MODULE_0__.projectManager.revealProject(index + 1), index + 1);

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
      const editedProject = _toDoList__WEBPACK_IMPORTED_MODULE_0__.projectManager.revealProject(index);
      navbar.renderEditedList(index, editedProject);
      main.renderMain(editedProject, index);
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
    main.renderMain(_toDoList__WEBPACK_IMPORTED_MODULE_0__.projectManager.revealProject(0), 0);
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
- 'Edit task' modal module
************************************************************** */
const editTaskModal = (() => {
  const modal = document.querySelector('.edit-task-modal').parentElement;
  const editBtn = document.getElementById('edit-task-submit-button');
  const stepsList = modal.querySelector('.modal-steps-list');
  const titleInput = document.getElementById('edit-task-name');
  const descriptionInput = document.getElementById('edit-task-description');
  const dateInput = document.getElementById('edit-task-date');
  const priorityInput = document.getElementById('edit-task-priority');

  const setProjectDataIndex = (projectIndex) => {
    editBtn.dataset.projectIndex = projectIndex;
  };

  const setTaskDataIndex = (taskIndex) => {
    editBtn.dataset.taskIndex = taskIndex;
  };

  const openEditTaskModal = (projectIndex, taskIndex) => {
    const taskToEdit = _toDoList__WEBPACK_IMPORTED_MODULE_0__.taskManager.revealTask(projectIndex, taskIndex);

    setProjectDataIndex(projectIndex);
    setTaskDataIndex(taskIndex);
    titleInput.value = taskToEdit.title;
    descriptionInput.value = taskToEdit.description;
    taskToEdit.steps.forEach((step) =>
      stepsComponent.makeStep(step, stepsList),
    );
    if (taskToEdit.dueDate !== '') {
      dateInput.value = taskToEdit.dueDate;
    }
    priorityInput.value = taskToEdit.priority;
    toggleHidden(modal);
  };

  const editTask = (e) => {
    if (titleInput.value !== '') {
      const projectIndex = Number(editBtn.dataset.projectIndex);
      const taskIndex = Number(editBtn.dataset.taskIndex);
      const taskToEdit = _toDoList__WEBPACK_IMPORTED_MODULE_0__.taskManager.revealTask(projectIndex, taskIndex);
      const oldSteps = taskToEdit.steps;
      const editedSteps = stepsComponent.revealSteps();

      e.preventDefault();
      _toDoList__WEBPACK_IMPORTED_MODULE_0__.taskManager.editTaskTitle(projectIndex, taskIndex, titleInput.value);
      _toDoList__WEBPACK_IMPORTED_MODULE_0__.taskManager.editTaskDescription(
        projectIndex,
        taskIndex,
        descriptionInput.value,
      );
      _toDoList__WEBPACK_IMPORTED_MODULE_0__.taskManager.editTaskDueDate(projectIndex, taskIndex, dateInput.value);
      _toDoList__WEBPACK_IMPORTED_MODULE_0__.taskManager.editTaskPriority(
        projectIndex,
        taskIndex,
        priorityInput.value,
      );
      if (oldSteps.length > 0 && editedSteps.length > 0) {
        for (
          let i = 0;
          i < Math.min(oldSteps.length, editedSteps.length);
          i++
        ) {
          if (editedSteps[i].description !== oldSteps[i].description) {
            _toDoList__WEBPACK_IMPORTED_MODULE_0__.stepManager.editStepDescription(
              projectIndex,
              taskIndex,
              i,
              editedSteps[i].description,
            );
          }
          if (editedSteps[i].status !== oldSteps[i].status) {
            _toDoList__WEBPACK_IMPORTED_MODULE_0__.stepManager.editStepStatus(
              projectIndex,
              taskIndex,
              i,
              editedSteps[i].status,
            );
          }
        }
        if (oldSteps.length > editedSteps.length) {
          let i = oldSteps.length - 1;
          while (i >= editedSteps.length) {
            _toDoList__WEBPACK_IMPORTED_MODULE_0__.stepManager.deleteStep(projectIndex, taskIndex, i);
            i--;
          }
        } else if (oldSteps.length < editedSteps.length) {
          for (let i = oldSteps.length; i < editedSteps.length; i++) {
            _toDoList__WEBPACK_IMPORTED_MODULE_0__.stepManager.createNewStep(
              projectIndex,
              taskIndex,
              editedSteps[i].description,
              editedSteps[i].status,
            );
          }
        }
      } else if (oldSteps.length === 0 && editedSteps.length > 0) {
        editedSteps.forEach((step) => {
          _toDoList__WEBPACK_IMPORTED_MODULE_0__.stepManager.createNewStep(
            projectIndex,
            taskIndex,
            step.description,
            step.status,
          );
        });
      } else if (oldSteps.length > 0 && editedSteps.length === 0) {
        let i = oldSteps.length - 1;
        while (i >= 0) {
          _toDoList__WEBPACK_IMPORTED_MODULE_0__.stepManager.deleteStep(projectIndex, taskIndex, i);
          i--;
        }
      }
      main.renderTaskContent(projectIndex, taskIndex);
      allModals.closeModal(modal);
    }
  };

  /* Function to invoke on initilise, for the component to work properly */
  const addEditBtnListener = () => {
    editBtn.addEventListener('click', (e) => editTask(e));
  };

  return { openEditTaskModal, addEditBtnListener };
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
- Steps component module
************************************************************** */
const stepsComponent = (() => {
  /* Variables for the 'New task' modal */
  const modalNew = document.querySelector('.new-task-modal').parentElement;
  const stepsListNew = modalNew.querySelector('.modal-steps-list');
  const addStepBtnNew = modalNew.querySelector('.add-step-button');
  /* Variables for the 'Edit task' modal */
  const modalEdit = document.querySelector('.edit-task-modal').parentElement;
  const stepsListEdit = modalEdit.querySelector('.modal-steps-list');
  const addStepBtnEdit = modalEdit.querySelector('.add-step-button');

  const steps = [];

  const clearAllSteps = (ul) => {
    const ulToClear = ul;
    steps.length = 0;
    ulToClear.innerHTML = '';
  };

  const revealSteps = () => steps;

  const renderStep = (listItem, step, index, stepsList) => {
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
      renderEditStep(ev, editStepBtn.dataset.stepIndex, stepsList),
    );
    deleteStepBtn.addEventListener('click', (ev) =>
      deleteStep(ev, deleteStepBtn.dataset.stepIndex, stepsList),
    );

    listItem.appendChild(checkbox);
    listItem.appendChild(label);
    listItem.appendChild(editStepBtn);
    editStepBtn.appendChild(editStepImg);
    listItem.appendChild(deleteStepBtn);
    deleteStepBtn.appendChild(deleteStepImg);
  };

  const updateStepIdices = (stepsList) => {
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

  const editStep = (e, stepIndex, editedStepValue, stepsList) => {
    const stepToEdit = e.target.closest('li');
    const input = stepToEdit.querySelector('input');
    const submitStepBtn = input.nextElementSibling;

    if (editedStepValue !== '') {
      e.preventDefault();
      e.stopPropagation();
      steps[stepIndex].description = editedStepValue;
      input.remove();
      submitStepBtn.remove();
      renderStep(stepToEdit, steps[stepIndex], stepIndex, stepsList);
    }
  };

  const renderEditStep = (ev, index, stepsList) => {
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
      editStep(e, stepIndex, input.value, stepsList),
    );
  };

  const deleteStep = (ev, index, stepsList) => {
    const stepIndex = Number(index);
    const stepToDelete = ev.target.closest('li');

    ev.preventDefault();
    ev.stopPropagation();
    steps.splice(stepIndex, 1);
    stepToDelete.remove();
    updateStepIdices(stepsList);
  };

  const makeStep = (step, stepsList) => {
    const listItem = document.createElement('li');

    steps.push(step);
    stepsList.appendChild(listItem);
    renderStep(listItem, steps[steps.length - 1], steps.length - 1, stepsList);
  };

  const addNewStep = (evt, stepsList, newStepBtn) => {
    const newStepDescription = document.getElementById('modal-add-step');
    const stepCreator = document.getElementById('modal-add-step').parentElement;

    evt.preventDefault();
    evt.stopPropagation();
    if (newStepDescription.value !== '') {
      const step = {
        description: newStepDescription.value,
        status: 'to do',
      };
      makeStep(step, stepsList);
    }
    toggleHidden(newStepBtn);
    stepCreator.remove();
  };

  const renderCreateStep = (e, stepsList, newStepBtn) => {
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

    submitStepBtn.addEventListener('click', (evt) =>
      addNewStep(evt, stepsList, newStepBtn),
    );
    toggleHidden(newStepBtn);
  };

  /* Function to invoke on initilise, for the component to work properly */
  const addNewStepBtnListeners = () => {
    addStepBtnNew.addEventListener('click', (e) =>
      renderCreateStep(e, stepsListNew, addStepBtnNew),
    );
    addStepBtnEdit.addEventListener('click', (e) =>
      renderCreateStep(e, stepsListEdit, addStepBtnEdit),
    );
  };

  return { clearAllSteps, revealSteps, makeStep, addNewStepBtnListeners };
})();

/* **************************************************************
- Initialiser function
************************************************************** */
const initialiseUI = () => {
  header.addHeaderListeners();

  navbar.init();

  main.init();

  allModals.addCloseBtnListeners();
  allModals.addCloseBackgroundListeners();

  newListModal.addSubmitBtnListener();
  editListModal.addEditBtnListener();
  deleteListModal.addCancelBtnListener();
  deleteListModal.addDeleteBtnListener();
  newTaskModal.addNewTaskBtnLIstener();
  editTaskModal.addEditBtnListener();
  deleteTaskModal.addCancelBtnListener();
  deleteTaskModal.addDeleteBtnListener();

  stepsComponent.addNewStepBtnListeners();

  aside.addSearchbarLIstener();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsV0FBVztBQUNYLENBQUM7O0FBRUQsaUVBQWUsY0FBYyxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNuQjlCOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDdUM7O0FBRXZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEVBQUUsZ0RBQWM7QUFDaEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwyQkFBMkIsZ0RBQWM7QUFDekM7QUFDQTtBQUNBLE1BQU07QUFDTixzQkFBc0IsMkJBQTJCO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Es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QUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixhQUFhLE9BQU8sVUFBVSxPQUFPLE1BQU07QUFDN0Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsYUFBYSxPQUFPLFVBQVU7QUFDOUM7QUFDQSwrQ0FBK0MsYUFBYSxPQUFPLFVBQVU7QUFDN0U7QUFDQTtBQUNBLDZDQUE2QyxhQUFhLE9BQU8sVUFBVTtBQUMzRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxXQUFXO0FBQ1gsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBLGlFQUFlLFlBQVksRUFBQzs7Ozs7OztVQ3h0QzVCO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7O0FDTjRDO0FBQ1o7O0FBRWhDLHFEQUFjO0FBQ2QsK0NBQVkiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90by1kby1saXN0Ly4vc3JjL3N0b3JhZ2UuanMiLCJ3ZWJwYWNrOi8vdG8tZG8tbGlzdC8uL3NyYy90b0RvTGlzdC5qcyIsIndlYnBhY2s6Ly90by1kby1saXN0Ly4vc3JjL3VpLmpzIiwid2VicGFjazovL3RvLWRvLWxpc3Qvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdG8tZG8tbGlzdC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vdG8tZG8tbGlzdC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3RvLWRvLWxpc3Qvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly90by1kby1saXN0Ly4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHN0b3JhZ2VNYW5hZ2VyID0gKCgpID0+IHtcbiAgLyogSW5pdGlhbCBmdW5jdGlvbiB0byBnZXQgYW55dGhpbmcgc2F2ZWQgaW4gbG9jYWxTdG9yYWdlICovXG4gIGNvbnN0IGdldFN0b3JhZ2UgPSAoKSA9PiB7XG4gICAgbGV0IHRvRG9MaXN0ID0gW107XG4gICAgaWYgKGxvY2FsU3RvcmFnZS50b0RvTGlzdCkge1xuICAgICAgdG9Eb0xpc3QgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0b0RvTGlzdCcpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdG9Eb0xpc3Q7XG4gIH07XG5cbiAgY29uc3Qgc2V0U3RvcmFnZSA9IChwcm9qZWN0cykgPT4ge1xuICAgIGNvbnN0IHRvRG9MaXN0ID0gSlNPTi5zdHJpbmdpZnkocHJvamVjdHMpO1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd0b0RvTGlzdCcsIHRvRG9MaXN0KTtcbiAgfTtcblxuICByZXR1cm4geyBnZXRTdG9yYWdlLCBzZXRTdG9yYWdlIH07XG59KSgpO1xuXG5leHBvcnQgZGVmYXVsdCBzdG9yYWdlTWFuYWdlcjtcbiIsIi8qIENvbnRlbnRzOlxuXG4gIC0gQ29uc3RydWN0b3JzIC0gVGFzaywgU3RlcCAmIFByb2plY3RcblxuICAtIEZ1bmN0aW9ucyB0byBkZWVwIGNsb25lIGFycmF5cyAmIG9iamVjdHMsICYgdXBkYXRlIGxvY2FsIHN0b3JhZ2VcblxuICAtIFByb2plY3QgTWFuYWdlclxuXG4gIC0gVGFzayBNYW5hZ2VyXG5cbiAgLSBTdGVwIE1hbmFnZXJcbiovXG5pbXBvcnQgc3RvcmFnZU1hbmFnZXIgZnJvbSAnLi9zdG9yYWdlJztcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi0gQ29uc3RydWN0b3JzIC0gVGFzaywgU3RlcCAmIFByb2plY3RcbiAgLSBTdGVwIGdvZXMgaW5zaWRlIFRhc2suc3RlcHNbXVxuICAtIFRhc2sgZ29lcyBpbnNpZGUgUHJvamVjdC50YXNrc1tdXG4gIC0gUHJvamVjdCBnb2VzIGluc2lkZSBwcm9qZWN0c1tdXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuY2xhc3MgVGFzayB7XG4gIGNvbnN0cnVjdG9yKHRpdGxlLCBkZXNjcmlwdGlvbiwgZHVlRGF0ZSwgcHJpb3JpdHksIHN0YXR1cykge1xuICAgIHRoaXMudGl0bGUgPSB0aXRsZTtcbiAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XG4gICAgdGhpcy5zdGVwcyA9IFtdO1xuICAgIHRoaXMuZHVlRGF0ZSA9IGR1ZURhdGU7XG4gICAgdGhpcy5wcmlvcml0eSA9IHByaW9yaXR5O1xuICAgIHRoaXMuc3RhdHVzID0gc3RhdHVzO1xuICB9XG59XG5cbmNsYXNzIFN0ZXAge1xuICBjb25zdHJ1Y3RvcihkZXNjcmlwdGlvbiwgc3RhdHVzKSB7XG4gICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xuICAgIHRoaXMuc3RhdHVzID0gc3RhdHVzO1xuICB9XG59XG5cbmNsYXNzIFByb2plY3Qge1xuICBjb25zdHJ1Y3Rvcih0aXRsZSwgZGVzY3JpcHRpb24pIHtcbiAgICB0aGlzLnRpdGxlID0gdGl0bGU7XG4gICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xuICAgIHRoaXMudGFza3MgPSBbXTtcbiAgfVxufVxuXG5jb25zdCBwcm9qZWN0cyA9IFtdO1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLSBGdW5jdGlvbnMgdG8gZGVlcCBjbG9uZSBhcnJheXMgJiBvYmplY3RzLCAmIHVwZGF0ZSBsb2NhbCBzdG9yYWdlXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuY29uc3QgZGVlcENvcHlBcnJheSA9IChhcnJheSkgPT4ge1xuICBjb25zdCBhcnJheUNvcHkgPSBbXTtcbiAgYXJyYXkuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgIGlmIChBcnJheS5pc0FycmF5KGl0ZW0pKSB7XG4gICAgICBhcnJheUNvcHkucHVzaChkZWVwQ29weUFycmF5KGl0ZW0pKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBpdGVtID09PSAnb2JqZWN0Jykge1xuICAgICAgYXJyYXlDb3B5LnB1c2goZGVlcENvcHlPYmplY3QoaXRlbSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcnJheUNvcHkucHVzaChpdGVtKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gYXJyYXlDb3B5O1xufTtcblxuY29uc3QgZGVlcENvcHlPYmplY3QgPSAob2JqZWN0KSA9PiB7XG4gIGNvbnN0IG9iamVjdENvcHkgPSB7fTtcbiAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMob2JqZWN0KSkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgb2JqZWN0Q29weVtrZXldID0gZGVlcENvcHlBcnJheSh2YWx1ZSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgICBvYmplY3RDb3B5W2tleV0gPSBkZWVwQ29weU9iamVjdCh2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9iamVjdENvcHlba2V5XSA9IHZhbHVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gb2JqZWN0Q29weTtcbn07XG5cbmNvbnN0IHNldFN0b3JhZ2UgPSAoKSA9PiB7XG4gIGNvbnN0IHByb2plY3RzQ29weSA9IGRlZXBDb3B5QXJyYXkocHJvamVjdHMpO1xuICBzdG9yYWdlTWFuYWdlci5zZXRTdG9yYWdlKHByb2plY3RzQ29weSk7XG59O1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLSBQcm9qZWN0IE1hbmFnZXJcbiAgLSBDcmVhdGUgYSBzYWZlIGNvcHkgb2YgYSBwcm9qZWN0ICYgb2YgdGhlIHByb2plY3RzIGFycmF5IGZvciBwdWJsaWMgdXNlXG4gIC0gQ3JlYXRlICYgZGVsZXRlIHByb2plY3RzXG4gIC0gRWRpdCBwcm9qZWN0IHRpdGxlcyAmIGRlc2NyaXB0aW9uc1xuICAtIEluaXRpYWxpc2UgYnkgY2hlY2tpbmcgZm9yIGxvY2FsbHkgc3RvcmVkIHByb2plY3RzXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuY29uc3QgcHJvamVjdE1hbmFnZXIgPSAoKCkgPT4ge1xuICBjb25zdCByZXZlYWxQcm9qZWN0ID0gKHByb2plY3RJbmRleCkgPT4ge1xuICAgIGNvbnN0IHByb2plY3RDb3B5ID0gZGVlcENvcHlPYmplY3QocHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldKTtcblxuICAgIHJldHVybiBwcm9qZWN0Q29weTtcbiAgfTtcblxuICBjb25zdCByZXZlYWxQcm9qZWN0VGFza3NMZW5ndGggPSAocHJvamVjdEluZGV4KSA9PiB7XG4gICAgY29uc3QgdGFza3NMZW5ndGggPSBwcm9qZWN0c1twcm9qZWN0SW5kZXhdLnRhc2tzLmxlbmd0aDtcbiAgICByZXR1cm4gdGFza3NMZW5ndGg7XG4gIH07XG5cbiAgY29uc3QgcmV2ZWFsQWxsUHJvamVjdHMgPSAoKSA9PiB7XG4gICAgY29uc3QgcHJvamVjdHNDb3B5ID0gZGVlcENvcHlBcnJheShwcm9qZWN0cyk7XG5cbiAgICByZXR1cm4gcHJvamVjdHNDb3B5O1xuICB9O1xuXG4gIGNvbnN0IGNyZWF0ZU5ld1Byb2plY3QgPSAodGl0bGUsIGRlc2NyaXB0aW9uKSA9PiB7XG4gICAgY29uc3QgbmV3UHJvamVjdCA9IG5ldyBQcm9qZWN0KHRpdGxlLCBkZXNjcmlwdGlvbik7XG4gICAgcHJvamVjdHMucHVzaChuZXdQcm9qZWN0KTtcblxuICAgIHNldFN0b3JhZ2UoKTtcbiAgICByZXR1cm4gcmV2ZWFsUHJvamVjdChwcm9qZWN0cy5sZW5ndGggLSAxKTtcbiAgfTtcblxuICBjb25zdCBkZWxldGVQcm9qZWN0ID0gKHByb2plY3RJbmRleCkgPT4ge1xuICAgIGNvbnN0IGluZGV4ID0gTnVtYmVyKHByb2plY3RJbmRleCk7XG4gICAgcHJvamVjdHMuc3BsaWNlKGluZGV4LCAxKTtcblxuICAgIHNldFN0b3JhZ2UoKTtcbiAgICByZXR1cm4gcmV2ZWFsQWxsUHJvamVjdHMoKTtcbiAgfTtcblxuICAvKiBNaWdodCBub3QgbmVlZCB0aGlzICovXG4gIGNvbnN0IGRlbGV0ZVByb2plY3RCeU5hbWUgPSAocHJvamVjdFRpdGxlKSA9PiB7XG4gICAgcHJvamVjdHMuZm9yRWFjaCgocHJvamVjdCkgPT4ge1xuICAgICAgaWYgKHByb2plY3QudGl0bGUgPT09IHByb2plY3RUaXRsZSkge1xuICAgICAgICBwcm9qZWN0cy5zcGxpY2UocHJvamVjdHMuaW5kZXhPZihwcm9qZWN0KSwgMSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBzZXRTdG9yYWdlKCk7XG4gICAgcmV0dXJuIHJldmVhbEFsbFByb2plY3RzKCk7XG4gIH07XG5cbiAgY29uc3QgZWRpdFByb2plY3RUaXRsZSA9IChwcm9qZWN0SW5kZXgsIG5ld1RpdGxlKSA9PiB7XG4gICAgcHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldLnRpdGxlID0gbmV3VGl0bGU7XG5cbiAgICBzZXRTdG9yYWdlKCk7XG4gICAgcmV0dXJuIHJldmVhbFByb2plY3QoTnVtYmVyKHByb2plY3RJbmRleCkpO1xuICB9O1xuXG4gIGNvbnN0IGVkaXRQcm9qZWN0RGVzY3JpcHRpb24gPSAocHJvamVjdEluZGV4LCBuZXdEZXNjcmlwdGlvbikgPT4ge1xuICAgIHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXS5kZXNjcmlwdGlvbiA9IG5ld0Rlc2NyaXB0aW9uO1xuXG4gICAgc2V0U3RvcmFnZSgpO1xuICAgIHJldHVybiByZXZlYWxQcm9qZWN0KE51bWJlcihwcm9qZWN0SW5kZXgpKTtcbiAgfTtcblxuICAvKiBUaGlzIHNob3VsZCBiZSB1c2VkIGF0IHRoZSBiZWdnaW5pbmcgb2YgdGhlIGNvZGUgdG8gc3RhcnQgdGhlIGFwcCBwcm9wZXJseSAqL1xuICBjb25zdCBpbml0aWFsaXNlID0gKCkgPT4ge1xuICAgIGNvbnN0IHN0b3JlZFByb2plY3RzID0gc3RvcmFnZU1hbmFnZXIuZ2V0U3RvcmFnZSgpO1xuICAgIGlmIChzdG9yZWRQcm9qZWN0cy5sZW5ndGggPT09IDApIHtcbiAgICAgIGNyZWF0ZU5ld1Byb2plY3QoJ0luYm94JywgJycpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0b3JlZFByb2plY3RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHByb2plY3RzLnB1c2goc3RvcmVkUHJvamVjdHNbaV0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmV2ZWFsQWxsUHJvamVjdHMoKTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIHJldmVhbFByb2plY3QsXG4gICAgcmV2ZWFsUHJvamVjdFRhc2tzTGVuZ3RoLFxuICAgIHJldmVhbEFsbFByb2plY3RzLFxuICAgIGNyZWF0ZU5ld1Byb2plY3QsXG4gICAgZGVsZXRlUHJvamVjdCxcbiAgICBkZWxldGVQcm9qZWN0QnlOYW1lLFxuICAgIGVkaXRQcm9qZWN0VGl0bGUsXG4gICAgZWRpdFByb2plY3REZXNjcmlwdGlvbixcbiAgICBpbml0aWFsaXNlLFxuICB9O1xufSkoKTtcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi0gVGFzayBNYW5hZ2VyXG4gIC0gQ3JlYXRlIGEgc2FmZSBjb3B5IG9mIGEgc2luZ2xlIHRhc2sgZm9yIHB1YmxpYyB1c2VcbiAgLSBDcmVhdGUgJiBkZWxldGUgdGFza3MgaW4gYSBwcm9qZWN0XG4gIC0gRWRpdCB0YXNrIHRpdGxlLCBkZXNjcmlwdGlvbiwgZHVlIGRhdGUsIHByaW9yaXR5ICYgc3RhdHVzXG4gIC0gU3Vic2NyaWJlIHRvIG1lZGlhdG9yIGV2ZW50c1xuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbmNvbnN0IHRhc2tNYW5hZ2VyID0gKCgpID0+IHtcbiAgY29uc3QgcmV2ZWFsVGFzayA9IChwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCkgPT4ge1xuICAgIGNvbnN0IHRhc2tDb3B5ID0gZGVlcENvcHlPYmplY3QoXG4gICAgICBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0udGFza3NbTnVtYmVyKHRhc2tJbmRleCldLFxuICAgICk7XG5cbiAgICByZXR1cm4gdGFza0NvcHk7XG4gIH07XG5cbiAgY29uc3QgY3JlYXRlTmV3VGFzayA9IChcbiAgICBwcm9qZWN0SW5kZXgsXG4gICAgdGl0bGUsXG4gICAgZGVzY3JpcHRpb24sXG4gICAgZHVlRGF0ZSxcbiAgICBwcmlvcml0eSxcbiAgICBzdGF0dXMsXG4gICkgPT4ge1xuICAgIGNvbnN0IHByb2plY3QgPSBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV07XG4gICAgcHJvamVjdC50YXNrcy5wdXNoKG5ldyBUYXNrKHRpdGxlLCBkZXNjcmlwdGlvbiwgZHVlRGF0ZSwgcHJpb3JpdHksIHN0YXR1cykpO1xuXG4gICAgc2V0U3RvcmFnZSgpO1xuICAgIHJldHVybiByZXZlYWxUYXNrKE51bWJlcihwcm9qZWN0SW5kZXgpLCBwcm9qZWN0LnRhc2tzLmxlbmd0aCAtIDEpO1xuICB9O1xuXG4gIGNvbnN0IGRlbGV0ZVRhc2sgPSAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgpID0+IHtcbiAgICBjb25zdCBwcm9qZWN0ID0gcHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldO1xuICAgIGNvbnN0IGluZGV4ID0gTnVtYmVyKHRhc2tJbmRleCk7XG4gICAgcHJvamVjdC50YXNrcy5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gICAgc2V0U3RvcmFnZSgpO1xuICAgIHJldHVybiBwcm9qZWN0TWFuYWdlci5yZXZlYWxQcm9qZWN0KE51bWJlcihwcm9qZWN0SW5kZXgpKTtcbiAgfTtcblxuICBjb25zdCBlZGl0VGFza1RpdGxlID0gKHByb2plY3RJbmRleCwgdGFza0luZGV4LCBuZXdUaXRsZSkgPT4ge1xuICAgIGNvbnN0IHRhc2sgPSBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0udGFza3NbTnVtYmVyKHRhc2tJbmRleCldO1xuICAgIHRhc2sudGl0bGUgPSBuZXdUaXRsZTtcblxuICAgIHNldFN0b3JhZ2UoKTtcbiAgICByZXR1cm4gcmV2ZWFsVGFzayhOdW1iZXIocHJvamVjdEluZGV4KSwgTnVtYmVyKHRhc2tJbmRleCkpO1xuICB9O1xuXG4gIGNvbnN0IGVkaXRUYXNrRGVzY3JpcHRpb24gPSAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgsIG5ld0Rlc2NyaXB0aW9uKSA9PiB7XG4gICAgY29uc3QgdGFzayA9IHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXS50YXNrc1tOdW1iZXIodGFza0luZGV4KV07XG4gICAgdGFzay5kZXNjcmlwdGlvbiA9IG5ld0Rlc2NyaXB0aW9uO1xuXG4gICAgc2V0U3RvcmFnZSgpO1xuICAgIHJldHVybiByZXZlYWxUYXNrKE51bWJlcihwcm9qZWN0SW5kZXgpLCBOdW1iZXIodGFza0luZGV4KSk7XG4gIH07XG5cbiAgY29uc3QgZWRpdFRhc2tEdWVEYXRlID0gKHByb2plY3RJbmRleCwgdGFza0luZGV4LCBuZXdEdWVEYXRlKSA9PiB7XG4gICAgY29uc3QgdGFzayA9IHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXS50YXNrc1tOdW1iZXIodGFza0luZGV4KV07XG4gICAgdGFzay5kdWVEYXRlID0gbmV3RHVlRGF0ZTtcblxuICAgIHNldFN0b3JhZ2UoKTtcbiAgICByZXR1cm4gcmV2ZWFsVGFzayhOdW1iZXIocHJvamVjdEluZGV4KSwgTnVtYmVyKHRhc2tJbmRleCkpO1xuICB9O1xuXG4gIGNvbnN0IGVkaXRUYXNrUHJpb3JpdHkgPSAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgsIG5ld1ByaW9yaXR5KSA9PiB7XG4gICAgY29uc3QgdGFzayA9IHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXS50YXNrc1tOdW1iZXIodGFza0luZGV4KV07XG4gICAgdGFzay5wcmlvcml0eSA9IG5ld1ByaW9yaXR5O1xuXG4gICAgc2V0U3RvcmFnZSgpO1xuICAgIHJldHVybiByZXZlYWxUYXNrKE51bWJlcihwcm9qZWN0SW5kZXgpLCBOdW1iZXIodGFza0luZGV4KSk7XG4gIH07XG5cbiAgY29uc3QgZWRpdFRhc2tTdGF0dXMgPSAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgsIG5ld1N0YXR1cykgPT4ge1xuICAgIGNvbnN0IHRhc2sgPSBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0udGFza3NbTnVtYmVyKHRhc2tJbmRleCldO1xuICAgIHRhc2suc3RhdHVzID0gbmV3U3RhdHVzO1xuXG4gICAgc2V0U3RvcmFnZSgpO1xuICAgIHJldHVybiByZXZlYWxUYXNrKE51bWJlcihwcm9qZWN0SW5kZXgpLCBOdW1iZXIodGFza0luZGV4KSk7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICByZXZlYWxUYXNrLFxuICAgIGNyZWF0ZU5ld1Rhc2ssXG4gICAgZGVsZXRlVGFzayxcbiAgICBlZGl0VGFza1RpdGxlLFxuICAgIGVkaXRUYXNrRGVzY3JpcHRpb24sXG4gICAgZWRpdFRhc2tEdWVEYXRlLFxuICAgIGVkaXRUYXNrUHJpb3JpdHksXG4gICAgZWRpdFRhc2tTdGF0dXMsXG4gIH07XG59KSgpO1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLSBTdGVwIE1hbmFnZXJcbiAgLSBDcmVhdGUgJiBkZWxldGUgc3RlcHMgaW4gYSB0YXNrXG4gIC0gRWRpdCBzdGVwIGRlc2NyaXB0aW9uICYgc3RhdHVzXG4gIC0gQ3JlYXRlIGEgc2ZlIGNvcHkgb2YgYSBzaW5nbGUgc3RlcCBmb3IgcHVibGljIHVzZVxuICAtIFN1YnNjcmliZSB0byBtZWRpYXRvciBldmVudHNcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5jb25zdCBzdGVwTWFuYWdlciA9ICgoKSA9PiB7XG4gIGNvbnN0IHJldmVhbFN0ZXAgPSAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgsIHN0ZXBJbmRleCkgPT4ge1xuICAgIGNvbnN0IHN0ZXBDb3B5ID0gZGVlcENvcHlPYmplY3QoXG4gICAgICBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0udGFza3NbTnVtYmVyKHRhc2tJbmRleCldLnN0ZXBzW1xuICAgICAgICBOdW1iZXIoc3RlcEluZGV4KVxuICAgICAgXSxcbiAgICApO1xuXG4gICAgcmV0dXJuIHN0ZXBDb3B5O1xuICB9O1xuXG4gIGNvbnN0IGNyZWF0ZU5ld1N0ZXAgPSAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgsIGRlc2NyaXB0aW9uLCBzdGF0dXMpID0+IHtcbiAgICBjb25zdCB0YXNrID0gcHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldLnRhc2tzW051bWJlcih0YXNrSW5kZXgpXTtcbiAgICB0YXNrLnN0ZXBzLnB1c2gobmV3IFN0ZXAoZGVzY3JpcHRpb24sIHN0YXR1cykpO1xuXG4gICAgc2V0U3RvcmFnZSgpO1xuICAgIHJldHVybiByZXZlYWxTdGVwKFxuICAgICAgTnVtYmVyKHByb2plY3RJbmRleCksXG4gICAgICBOdW1iZXIodGFza0luZGV4KSxcbiAgICAgIHRhc2suc3RlcHMubGVuZ3RoIC0gMSxcbiAgICApO1xuICB9O1xuXG4gIGNvbnN0IGRlbGV0ZVN0ZXAgPSAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgsIHN0ZXBJbmRleCkgPT4ge1xuICAgIGNvbnN0IHRhc2sgPSBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0udGFza3NbTnVtYmVyKHRhc2tJbmRleCldO1xuICAgIGNvbnN0IGluZGV4ID0gTnVtYmVyKHN0ZXBJbmRleCk7XG4gICAgdGFzay5zdGVwcy5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gICAgc2V0U3RvcmFnZSgpO1xuICAgIHJldHVybiB0YXNrTWFuYWdlci5yZXZlYWxUYXNrKE51bWJlcihwcm9qZWN0SW5kZXgpLCBOdW1iZXIodGFza0luZGV4KSk7XG4gIH07XG5cbiAgY29uc3QgZWRpdFN0ZXBEZXNjcmlwdGlvbiA9IChcbiAgICBwcm9qZWN0SW5kZXgsXG4gICAgdGFza0luZGV4LFxuICAgIHN0ZXBJbmRleCxcbiAgICBuZXdEZXNjcmlwdGlvbixcbiAgKSA9PiB7XG4gICAgY29uc3Qgc3RlcCA9XG4gICAgICBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0udGFza3NbTnVtYmVyKHRhc2tJbmRleCldLnN0ZXBzW1xuICAgICAgICBOdW1iZXIoc3RlcEluZGV4KVxuICAgICAgXTtcbiAgICBzdGVwLmRlc2NyaXB0aW9uID0gbmV3RGVzY3JpcHRpb247XG5cbiAgICBzZXRTdG9yYWdlKCk7XG4gICAgcmV0dXJuIHJldmVhbFN0ZXAoXG4gICAgICBOdW1iZXIocHJvamVjdEluZGV4KSxcbiAgICAgIE51bWJlcih0YXNrSW5kZXgpLFxuICAgICAgTnVtYmVyKHN0ZXBJbmRleCksXG4gICAgKTtcbiAgfTtcblxuICBjb25zdCBlZGl0U3RlcFN0YXR1cyA9IChwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCwgc3RlcEluZGV4LCBuZXdTdGF0dXMpID0+IHtcbiAgICBjb25zdCBzdGVwID1cbiAgICAgIHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXS50YXNrc1tOdW1iZXIodGFza0luZGV4KV0uc3RlcHNbXG4gICAgICAgIE51bWJlcihzdGVwSW5kZXgpXG4gICAgICBdO1xuICAgIHN0ZXAuc3RhdHVzID0gbmV3U3RhdHVzO1xuXG4gICAgc2V0U3RvcmFnZSgpO1xuICAgIHJldHVybiByZXZlYWxTdGVwKFxuICAgICAgTnVtYmVyKHByb2plY3RJbmRleCksXG4gICAgICBOdW1iZXIodGFza0luZGV4KSxcbiAgICAgIE51bWJlcihzdGVwSW5kZXgpLFxuICAgICk7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICByZXZlYWxTdGVwLFxuICAgIGNyZWF0ZU5ld1N0ZXAsXG4gICAgZGVsZXRlU3RlcCxcbiAgICBlZGl0U3RlcERlc2NyaXB0aW9uLFxuICAgIGVkaXRTdGVwU3RhdHVzLFxuICB9O1xufSkoKTtcblxuZXhwb3J0IHsgcHJvamVjdE1hbmFnZXIsIHRhc2tNYW5hZ2VyLCBzdGVwTWFuYWdlciB9O1xuIiwiLyogQ29udGVudHM6XG5cblx0LSBHZW5lcmFsXG5cblx0LSBIZWFkZXIgbW9kdWxlXG5cblx0LSBOYXZiYXIgbW9kdWxlXG5cbiAgLSBNYWluIG1vZHVsZVxuXG4gIC0gQXNpZGUgbW9kdWxlXG5cdFxuXHQtIE1vZHVsZSB0byBjb250cm9sIHRoaW5ncyBjb21tb24gbW9zdCBtb2RhbHNcblxuXHQtICdOZXcgTGlzdCcgbW9kYWwgbW9kdWxlXG5cbiAgLSAnRWRpdCBsaXN0JyBtb2RhbCBtb2R1bGVcblxuICAtICdEZWxldGUgbGlzdCcgbW9kYWwgbW9kdWxlXG5cbiAgLSAnTmV3IHRhc2snIG1vZGFsIG1vZHVsZVxuXG4gIC0gU3RlcHMgY29tcG9uZW50IG1vZHVsZVxuXG4gIC0gJ0VkaXQgdGFzaycgbW9kYWwgbW9kdWxlXG5cbiAgLSAnRGVsZXRlIHRhc2snIG1vZGFsIG1vZHVsZVxuXG5cdC0gSW5pdGlhbGlzZXIgZnVuY3Rpb25cbiovXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLSBHZW5lcmFsXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuaW1wb3J0IHsgcHJvamVjdE1hbmFnZXIsIHRhc2tNYW5hZ2VyLCBzdGVwTWFuYWdlciB9IGZyb20gJy4vdG9Eb0xpc3QnO1xuXG5jb25zdCB0b2dnbGVIaWRkZW4gPSAoZWxlbWVudCkgPT4ge1xuICBlbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoJ2hpZGRlbicpO1xufTtcblxuY29uc3QgaGFzRGF0ZVBhc3QgPSAoZGF0ZSkgPT4ge1xuICBjb25zdCBkYXRlVG9Db21wYXJlID0gZGF0ZS5zcGxpdCgnLScpO1xuICBjb25zdCBjdXJyZW50RGF0ZSA9IG5ldyBEYXRlKCk7XG4gIGNvbnN0IGN1cnJlbnRZZWFyID0gY3VycmVudERhdGUuZ2V0RnVsbFllYXIoKTtcbiAgY29uc3QgY3VycmVudE1vbnRoID0gY3VycmVudERhdGUuZ2V0TW9udGgoKSArIDE7XG4gIGNvbnN0IGN1cnJlbnREYXkgPSBjdXJyZW50RGF0ZS5nZXREYXRlKCk7XG5cbiAgaWYgKFxuICAgIGN1cnJlbnRZZWFyID4gTnVtYmVyKGRhdGVUb0NvbXBhcmVbMF0pIHx8XG4gICAgKGN1cnJlbnRZZWFyID09PSBOdW1iZXIoZGF0ZVRvQ29tcGFyZVswXSkgJiZcbiAgICAgIGN1cnJlbnRNb250aCA+IE51bWJlcihkYXRlVG9Db21wYXJlWzFdKSkgfHxcbiAgICAoY3VycmVudFllYXIgPT09IE51bWJlcihkYXRlVG9Db21wYXJlWzBdKSAmJlxuICAgICAgY3VycmVudE1vbnRoID09PSBOdW1iZXIoZGF0ZVRvQ29tcGFyZVsxXSkgJiZcbiAgICAgIGN1cnJlbnREYXkgPiBOdW1iZXIoZGF0ZVRvQ29tcGFyZVsyXSkpXG4gICkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4tIEhlYWRlciBtb2R1bGVcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5jb25zdCBoZWFkZXIgPSAoKCkgPT4ge1xuICAvKiBGdW5jdGlvbiB0byBpbnZva2Ugb24gaW5pdGlsaXNlLCBmb3IgdGhlIGNvbXBvbmVudCB0byB3b3JrIHByb3Blcmx5ICovXG4gIGNvbnN0IGFkZEhlYWRlckxpc3RlbmVycyA9ICgpID0+IHtcbiAgICBjb25zdCB0b2dnbGVOYXZCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndG9nZ2xlLW5hdi1idXR0b24nKTtcbiAgICBjb25zdCB0b2dnbGVBc2lkZUJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0b2dnbGUtYXNpZGUtYnV0dG9uJyk7XG4gICAgY29uc3QgbmF2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbmF2Jyk7XG4gICAgY29uc3QgYXNpZGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdhc2lkZScpO1xuXG4gICAgdG9nZ2xlTmF2QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gdG9nZ2xlSGlkZGVuKG5hdikpO1xuICAgIHRvZ2dsZUFzaWRlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gdG9nZ2xlSGlkZGVuKGFzaWRlKSk7XG4gIH07XG5cbiAgcmV0dXJuIHsgYWRkSGVhZGVyTGlzdGVuZXJzIH07XG59KSgpO1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLSBOYXZiYXIgbW9kdWxlXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuY29uc3QgbmF2YmFyID0gKCgpID0+IHtcbiAgY29uc3QgbmF2TGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduYXYtdG9kby1saXN0cycpO1xuXG4gIGNvbnN0IHNldFByb2plY3REYXRhSW5kZXggPSAoZWxlbWVudCwgaW5kZXgpID0+IHtcbiAgICBlbGVtZW50LmRhdGFzZXQucHJvamVjdEluZGV4ID0gaW5kZXg7XG4gIH07XG5cbiAgY29uc3QgY2FsY3VsYXRlTmV3UHJvamVjdEluZGV4ID0gKCkgPT4ge1xuICAgIGNvbnN0IGxpc3RzID0gbmF2TGlzdC5jaGlsZHJlbjtcbiAgICBjb25zdCBuZXdJbmRleCA9IGxpc3RzLmxlbmd0aCArIDE7XG4gICAgcmV0dXJuIG5ld0luZGV4O1xuICB9O1xuXG4gIGNvbnN0IHVwZGF0ZUFsbFByb2plY3RJbmRpY2VzID0gKCkgPT4ge1xuICAgIGNvbnN0IGN1cnJlbnRMaXN0cyA9IG5hdkxpc3QuY2hpbGRyZW47XG4gICAgbGV0IHVwZGF0ZWRJbmRleCA9IDE7XG4gICAgZm9yIChjb25zdCBsaXN0IG9mIGN1cnJlbnRMaXN0cykge1xuICAgICAgY29uc3QgbGluayA9IGxpc3QucXVlcnlTZWxlY3RvcignYScpO1xuICAgICAgY29uc3QgYnV0dG9ucyA9IGxpc3QucXVlcnlTZWxlY3RvckFsbCgnYnV0dG9uJyk7XG4gICAgICBsaW5rLmRhdGFzZXQucHJvamVjdEluZGV4ID0gdXBkYXRlZEluZGV4O1xuICAgICAgYnV0dG9ucy5mb3JFYWNoKChidXR0b24pID0+IHtcbiAgICAgICAgYnV0dG9uLmRhdGFzZXQucHJvamVjdEluZGV4ID0gdXBkYXRlZEluZGV4O1xuICAgICAgfSk7XG4gICAgICB1cGRhdGVkSW5kZXggKz0gMTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgcmVuZGVyTmV3TGlzdCA9IChsaXN0LCBsaXN0SW5kZXgpID0+IHtcbiAgICBjb25zdCBsaXN0SXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgY29uc3QgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjb25zdCBlZGl0QnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgY29uc3QgZWRpdEltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgIGNvbnN0IGRlbGV0ZUJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGNvbnN0IGRlbGV0ZUltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuXG4gICAgbGluay5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCAnIycpO1xuICAgIGxpbmsudGV4dENvbnRlbnQgPSBgJHtsaXN0LnRpdGxlfWA7XG4gICAgZGl2LmNsYXNzTGlzdC5hZGQoJ25hdi1saXN0LWJ1dHRvbnMnKTtcbiAgICBlZGl0SW1nLnNldEF0dHJpYnV0ZSgnc3JjJywgJy4vaWNvbnMvZWRpdC5zdmcnKTtcbiAgICBlZGl0SW1nLnNldEF0dHJpYnV0ZSgnYWx0JywgJ2J1dHRvbiB0byBlZGl0IGxpc3QnKTtcbiAgICBkZWxldGVJbWcuc2V0QXR0cmlidXRlKCdzcmMnLCAnLi9pY29ucy9kZWxldGUuc3ZnJyk7XG4gICAgZGVsZXRlSW1nLnNldEF0dHJpYnV0ZSgnYWx0JywgJ2J1dHRvbiB0byBkZWxldGUgbGlzdCcpO1xuXG4gICAgc2V0UHJvamVjdERhdGFJbmRleChsaW5rLCBsaXN0SW5kZXgpO1xuICAgIHNldFByb2plY3REYXRhSW5kZXgoZWRpdEJ0biwgbGlzdEluZGV4KTtcbiAgICBzZXRQcm9qZWN0RGF0YUluZGV4KGRlbGV0ZUJ0biwgbGlzdEluZGV4KTtcblxuICAgIGVkaXRCdG4uYXBwZW5kQ2hpbGQoZWRpdEltZyk7XG4gICAgZGVsZXRlQnRuLmFwcGVuZENoaWxkKGRlbGV0ZUltZyk7XG4gICAgZGl2LmFwcGVuZENoaWxkKGVkaXRCdG4pO1xuICAgIGRpdi5hcHBlbmRDaGlsZChkZWxldGVCdG4pO1xuICAgIGxpc3RJdGVtLmFwcGVuZENoaWxkKGxpbmspO1xuICAgIGxpc3RJdGVtLmFwcGVuZENoaWxkKGRpdik7XG4gICAgbmF2TGlzdC5hcHBlbmRDaGlsZChsaXN0SXRlbSk7XG5cbiAgICBsaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgbWFpbi5yZW5kZXJNYWluKFxuICAgICAgICBwcm9qZWN0TWFuYWdlci5yZXZlYWxQcm9qZWN0KE51bWJlcihsaW5rLmRhdGFzZXQucHJvamVjdEluZGV4KSksXG4gICAgICAgIE51bWJlcihsaW5rLmRhdGFzZXQucHJvamVjdEluZGV4KSxcbiAgICAgICk7XG4gICAgfSk7XG4gICAgZWRpdEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+XG4gICAgICBlZGl0TGlzdE1vZGFsLm9wZW5FZGl0TW9kYWwoZWRpdEJ0bi5kYXRhc2V0LnByb2plY3RJbmRleCksXG4gICAgKTtcbiAgICBkZWxldGVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PlxuICAgICAgZGVsZXRlTGlzdE1vZGFsLm9wZW5EZWxldGVNb2RhbChkZWxldGVCdG4uZGF0YXNldC5wcm9qZWN0SW5kZXgpLFxuICAgICk7XG4gIH07XG5cbiAgY29uc3QgcmVuZGVyRGVsZXRlZExpc3QgPSAobGlzdEluZGV4KSA9PiB7XG4gICAgY29uc3QgbGlzdFRvRGVsZXRlID0gbmF2TGlzdC5xdWVyeVNlbGVjdG9yKFxuICAgICAgYFtkYXRhLXByb2plY3QtaW5kZXg9JyR7bGlzdEluZGV4fSddYCxcbiAgICApLnBhcmVudEVsZW1lbnQ7XG4gICAgbGlzdFRvRGVsZXRlLnJlbW92ZSgpO1xuICAgIHVwZGF0ZUFsbFByb2plY3RJbmRpY2VzKCk7XG4gIH07XG5cbiAgY29uc3QgcmVuZGVyRWRpdGVkTGlzdCA9IChsaXN0SW5kZXgsIHByb2plY3QpID0+IHtcbiAgICBjb25zdCBsaXN0VG9FZGl0ID0gbmF2TGlzdC5xdWVyeVNlbGVjdG9yKFxuICAgICAgYGFbZGF0YS1wcm9qZWN0LWluZGV4PScke2xpc3RJbmRleH0nXWAsXG4gICAgKTtcbiAgICBsaXN0VG9FZGl0LnRleHRDb250ZW50ID0gcHJvamVjdC50aXRsZTtcbiAgfTtcblxuICBjb25zdCByZW5kZXJDdXJyZW50TGlzdHMgPSAoKSA9PiB7XG4gICAgY29uc3QgbGlzdHMgPSBwcm9qZWN0TWFuYWdlci5yZXZlYWxBbGxQcm9qZWN0cygpO1xuICAgIGxpc3RzLmZvckVhY2goKGxpc3QpID0+IHtcbiAgICAgIGlmIChsaXN0cy5pbmRleE9mKGxpc3QpID4gMCkge1xuICAgICAgICByZW5kZXJOZXdMaXN0KGxpc3QsIGxpc3RzLmluZGV4T2YobGlzdCkpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IHNldEluYm94SW5kZXhBbmRMaXN0ZW5lciA9ICgpID0+IHtcbiAgICBjb25zdCBpbmJveCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduYXYtbGlzdC1pbmJveCcpO1xuICAgIHNldFByb2plY3REYXRhSW5kZXgoaW5ib3gsIDApO1xuICAgIGluYm94LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgbWFpbi5yZW5kZXJNYWluKHByb2plY3RNYW5hZ2VyLnJldmVhbFByb2plY3QoMCksIDApO1xuICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IGFkZE5ld0xpc3RCdG5MaXN0ZW5lciA9ICgpID0+IHtcbiAgICBjb25zdCBuZXdMaXN0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5hdi1uZXctbGlzdC1idXR0b24nKTtcbiAgICBjb25zdCBtb2RhbE5ld0xpc3QgPVxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5ldy1saXN0LW1vZGFsJykucGFyZW50RWxlbWVudDtcbiAgICBuZXdMaXN0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gdG9nZ2xlSGlkZGVuKG1vZGFsTmV3TGlzdCkpO1xuICB9O1xuXG4gIC8qIEZ1bmN0aW9uIHRvIGludm9rZSBvbiBpbml0aWxpc2UsIGZvciB0aGUgY29tcG9uZW50IHRvIHdvcmsgcHJvcGVybHkgKi9cbiAgY29uc3QgaW5pdCA9ICgpID0+IHtcbiAgICByZW5kZXJDdXJyZW50TGlzdHMoKTtcbiAgICBzZXRJbmJveEluZGV4QW5kTGlzdGVuZXIoKTtcbiAgICBhZGROZXdMaXN0QnRuTGlzdGVuZXIoKTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGNhbGN1bGF0ZU5ld1Byb2plY3RJbmRleCxcbiAgICByZW5kZXJOZXdMaXN0LFxuICAgIHJlbmRlckRlbGV0ZWRMaXN0LFxuICAgIHJlbmRlckVkaXRlZExpc3QsXG4gICAgaW5pdCxcbiAgfTtcbn0pKCk7XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4tIE1haW4gbW9kdWxlXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuY29uc3QgbWFpbiA9ICgoKSA9PiB7XG4gIGNvbnN0IG1haW5UYXNrcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ21haW4nKTtcbiAgY29uc3QgbmV3VGFza0J0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluLW5ldy10YXNrLWJ1dHRvbicpO1xuICBjb25zdCB1bmZpbmlzaGVkRGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnVuZmluaXNoZWQtdGFza3MnKTtcbiAgY29uc3QgZmluaXNoZWREaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZmluaXNoZWQtdGFza3MnKTtcblxuICAvKiBIZWFkZXIgc2VjdGlvbiAqL1xuICBjb25zdCByZW5kZXJIZWFkZXIgPSAocHJvamVjdCkgPT4ge1xuICAgIGNvbnN0IGxpc3RUaXRsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluLWxpc3QtdGl0bGUnKTtcbiAgICBjb25zdCBsaXN0RGVzY3JpcHRpb24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbi1saXN0LWRlc2NyaXB0aW9uJyk7XG4gICAgbGlzdFRpdGxlLnRleHRDb250ZW50ID0gcHJvamVjdC50aXRsZTtcbiAgICBsaXN0RGVzY3JpcHRpb24udGV4dENvbnRlbnQgPSBwcm9qZWN0LmRlc2NyaXB0aW9uO1xuICB9O1xuXG4gIGNvbnN0IHNldE5ld1Rhc2tCdG5JbmRleCA9IChpbmRleCkgPT4ge1xuICAgIG5ld1Rhc2tCdG4uZGF0YXNldC5wcm9qZWN0SW5kZXggPSBpbmRleDtcbiAgfTtcblxuICBjb25zdCBhZGROZXdUYXNrQnRuTGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgbmV3VGFza0J0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+XG4gICAgICBuZXdUYXNrTW9kYWwub3Blbk5ld1Rhc2tNb2RhbChuZXdUYXNrQnRuLmRhdGFzZXQucHJvamVjdEluZGV4KSxcbiAgICApO1xuICB9O1xuXG4gIC8qIFRhc2tzIHNlY3Rpb24gKi9cbiAgY29uc3QgY2xlYXJUYXNrcyA9ICgpID0+IHtcbiAgICBjb25zdCB0YXNrR3JvdXBzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm1haW4tdGFza3MnKTtcbiAgICB0YXNrR3JvdXBzLmZvckVhY2goKHRhc2tHcm91cCkgPT4ge1xuICAgICAgdGFza0dyb3VwLmlubmVySFRNTCA9ICcnO1xuICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IHNlbmRUb0ZpbmlzaGVkRGl2ID0gKHRhc2tJbmRleCkgPT4ge1xuICAgIGNvbnN0IHRhc2tUb01vdmUgPSB1bmZpbmlzaGVkRGl2LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICBgZGl2W2RhdGEtdGFzay1pbmRleD0nJHt0YXNrSW5kZXh9J11gLFxuICAgICk7XG4gICAgZmluaXNoZWREaXYucHJlcGVuZCh0YXNrVG9Nb3ZlKTtcbiAgfTtcblxuICBjb25zdCBzZW5kVG9VbmZpbmlzaGVkRGl2ID0gKHRhc2tJbmRleCkgPT4ge1xuICAgIGNvbnN0IHRhc2tUb01vdmUgPSBmaW5pc2hlZERpdi5xdWVyeVNlbGVjdG9yKFxuICAgICAgYGRpdltkYXRhLXRhc2staW5kZXg9JyR7dGFza0luZGV4fSddYCxcbiAgICApO1xuICAgIHVuZmluaXNoZWREaXYuYXBwZW5kQ2hpbGQodGFza1RvTW92ZSk7XG4gIH07XG5cbiAgY29uc3QgdG9nZ2xlVGFza1N0YXR1cyA9IChjaGVja2JveCwgcHJvamVjdEluZGV4LCB0YXNrSW5kZXgpID0+IHtcbiAgICBpZiAoY2hlY2tib3guY2hlY2tlZCkge1xuICAgICAgdGFza01hbmFnZXIuZWRpdFRhc2tTdGF0dXMocHJvamVjdEluZGV4LCB0YXNrSW5kZXgsICdkb25lJyk7XG4gICAgICBzZW5kVG9GaW5pc2hlZERpdih0YXNrSW5kZXgpO1xuICAgIH0gZWxzZSBpZiAoIWNoZWNrYm94LmNoZWNrZWQpIHtcbiAgICAgIHRhc2tNYW5hZ2VyLmVkaXRUYXNrU3RhdHVzKHByb2plY3RJbmRleCwgdGFza0luZGV4LCAndG8gZG8nKTtcbiAgICAgIHNlbmRUb1VuZmluaXNoZWREaXYodGFza0luZGV4KTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgdG9nZ2xlU3RlcFN0YXR1cyA9IChjaGVja2JveCwgcHJvamVjdEluZGV4LCB0YXNrSW5kZXgsIHN0ZXBJbmRleCkgPT4ge1xuICAgIGlmIChjaGVja2JveC5jaGVja2VkKSB7XG4gICAgICBzdGVwTWFuYWdlci5lZGl0U3RlcFN0YXR1cyhwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCwgc3RlcEluZGV4LCAnZG9uZScpO1xuICAgIH0gZWxzZSBpZiAoIWNoZWNrYm94LmNoZWNrZWQpIHtcbiAgICAgIHN0ZXBNYW5hZ2VyLmVkaXRTdGVwU3RhdHVzKHByb2plY3RJbmRleCwgdGFza0luZGV4LCBzdGVwSW5kZXgsICd0byBkbycpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCByZW5kZXJUYXNrQ29udGVudCA9IChwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCkgPT4ge1xuICAgIGNvbnN0IHRhc2sgPSB0YXNrTWFuYWdlci5yZXZlYWxUYXNrKHByb2plY3RJbmRleCwgdGFza0luZGV4KTtcbiAgICBjb25zdCB0YXNrSXRlbSA9IG1haW5UYXNrc1xuICAgICAgLnF1ZXJ5U2VsZWN0b3IoYGRpdltkYXRhLXRhc2staW5kZXg9JyR7dGFza0luZGV4fSddYClcbiAgICAgIC5xdWVyeVNlbGVjdG9yKCcudGFzay1pdGVtJyk7XG4gICAgY29uc3QgcHJpb3JpdHlMZXZlbCA9IHRhc2tJdGVtLnF1ZXJ5U2VsZWN0b3IoJy50YXNrLXByaW9yaXR5LWxldmVsJyk7XG4gICAgY29uc3QgdGl0bGVEaXYgPSB0YXNrSXRlbS5xdWVyeVNlbGVjdG9yKCcudGFzay10aXRsZScpO1xuICAgIGNvbnN0IHRpdGxlQ2hlY2tib3ggPSB0aXRsZURpdi5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpO1xuICAgIGNvbnN0IHRpdGxlTGFiZWwgPSB0aXRsZURpdi5xdWVyeVNlbGVjdG9yKCdsYWJlbCcpO1xuICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gdGFza0l0ZW0ucXVlcnlTZWxlY3RvcignLnRhc2stZGVzY3JpcHRpb24nKTtcbiAgICBjb25zdCBzdGVwc0xpc3QgPSB0YXNrSXRlbS5xdWVyeVNlbGVjdG9yKCcudGFzay1zdGVwcycpO1xuXG4gICAgc3dpdGNoICh0YXNrLnByaW9yaXR5KSB7XG4gICAgICBjYXNlICdsb3cnOlxuICAgICAgICB0YXNrSXRlbS5jbGFzc05hbWUgPSAnJztcbiAgICAgICAgdGFza0l0ZW0uY2xhc3NMaXN0LmFkZCgndGFzay1pdGVtJywgJ3ByaW9yaXR5LWxvdycpO1xuICAgICAgICBwcmlvcml0eUxldmVsLnRleHRDb250ZW50ID0gJ0xvdyc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbWVkaXVtJzpcbiAgICAgICAgdGFza0l0ZW0uY2xhc3NOYW1lID0gJyc7XG4gICAgICAgIHRhc2tJdGVtLmNsYXNzTGlzdC5hZGQoJ3Rhc2staXRlbScsICdwcmlvcml0eS1tZWRpdW0nKTtcbiAgICAgICAgcHJpb3JpdHlMZXZlbC50ZXh0Q29udGVudCA9ICdNZWRpdW0nO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2hpZ2gnOlxuICAgICAgICB0YXNrSXRlbS5jbGFzc05hbWUgPSAnJztcbiAgICAgICAgdGFza0l0ZW0uY2xhc3NMaXN0LmFkZCgndGFzay1pdGVtJywgJ3ByaW9yaXR5LWhpZ2gnKTtcbiAgICAgICAgcHJpb3JpdHlMZXZlbC50ZXh0Q29udGVudCA9ICdIaWdoJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0YXNrSXRlbS5jbGFzc05hbWUgPSAnJztcbiAgICAgICAgdGFza0l0ZW0uY2xhc3NMaXN0LmFkZCgndGFzay1pdGVtJywgJ3ByaW9yaXR5LW5vbmUnKTtcbiAgICAgICAgcHJpb3JpdHlMZXZlbC50ZXh0Q29udGVudCA9ICdOb25lJztcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGlmICh0YXNrLnN0YXR1cyA9PT0gJ3RvIGRvJykge1xuICAgICAgdGl0bGVDaGVja2JveC5jaGVja2VkID0gZmFsc2U7XG4gICAgfSBlbHNlIGlmICh0YXNrLnN0YXR1cyA9PT0gJ2RvbmUnKSB7XG4gICAgICB0aXRsZUNoZWNrYm94LmNoZWNrZWQgPSB0cnVlO1xuICAgIH1cbiAgICB0aXRsZUxhYmVsLnRleHRDb250ZW50ID0gdGFzay50aXRsZTtcbiAgICBkZXNjcmlwdGlvbi50ZXh0Q29udGVudCA9IHRhc2suZGVzY3JpcHRpb247XG4gICAgc3RlcHNMaXN0LmlubmVySFRNTCA9ICcnO1xuICAgIHRhc2suc3RlcHMuZm9yRWFjaCgoc3RlcCkgPT4ge1xuICAgICAgY29uc3QgbGlzdEl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgY29uc3Qgc3RlcENoZWNrYm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICAgIGNvbnN0IHN0ZXBMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gICAgICBjb25zdCBpbmRleCA9IHRhc2suc3RlcHMuaW5kZXhPZihzdGVwKTtcblxuICAgICAgc3RlcENoZWNrYm94LnNldEF0dHJpYnV0ZSgndHlwZScsICdjaGVja2JveCcpO1xuICAgICAgc3RlcENoZWNrYm94LnNldEF0dHJpYnV0ZShcbiAgICAgICAgJ25hbWUnLFxuICAgICAgICBgcHJvamVjdCR7cHJvamVjdEluZGV4fS10YXNrJHt0YXNrSW5kZXh9LXN0ZXAke2luZGV4fWAsXG4gICAgICApO1xuICAgICAgc3RlcENoZWNrYm94LnNldEF0dHJpYnV0ZShcbiAgICAgICAgJ2lkJyxcbiAgICAgICAgYHByb2plY3Qke3Byb2plY3RJbmRleH0tdGFzayR7dGFza0luZGV4fS1zdGVwJHtpbmRleH1gLFxuICAgICAgKTtcbiAgICAgIGlmIChzdGVwLnN0YXR1cyA9PT0gJ3RvIGRvJykge1xuICAgICAgICBzdGVwQ2hlY2tib3guY2hlY2tlZCA9IGZhbHNlO1xuICAgICAgfSBlbHNlIGlmIChzdGVwLnN0YXR1cyA9PT0gJ2RvbmUnKSB7XG4gICAgICAgIHN0ZXBDaGVja2JveC5jaGVja2VkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHN0ZXBDaGVja2JveC5kYXRhc2V0LnByb2plY3RJbmRleCA9IHByb2plY3RJbmRleDtcbiAgICAgIHN0ZXBDaGVja2JveC5kYXRhc2V0LnRhc2tJbmRleCA9IHRhc2tJbmRleDtcbiAgICAgIHN0ZXBDaGVja2JveC5kYXRhc2V0LnN0ZXBJbmRleCA9IGluZGV4O1xuICAgICAgc3RlcExhYmVsLnNldEF0dHJpYnV0ZShcbiAgICAgICAgJ2ZvcicsXG4gICAgICAgIGBwcm9qZWN0JHtwcm9qZWN0SW5kZXh9LXRhc2ske3Rhc2tJbmRleH0tc3RlcCR7aW5kZXh9YCxcbiAgICAgICk7XG4gICAgICBzdGVwTGFiZWwudGV4dENvbnRlbnQgPSBzdGVwLmRlc2NyaXB0aW9uO1xuXG4gICAgICBzdGVwQ2hlY2tib3guYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKCkgPT5cbiAgICAgICAgdG9nZ2xlU3RlcFN0YXR1cyhzdGVwQ2hlY2tib3gsIHByb2plY3RJbmRleCwgdGFza0luZGV4LCBpbmRleCksXG4gICAgICApO1xuXG4gICAgICBsaXN0SXRlbS5hcHBlbmRDaGlsZChzdGVwQ2hlY2tib3gpO1xuICAgICAgbGlzdEl0ZW0uYXBwZW5kQ2hpbGQoc3RlcExhYmVsKTtcbiAgICAgIHN0ZXBzTGlzdC5hcHBlbmRDaGlsZChsaXN0SXRlbSk7XG4gICAgfSk7XG4gICAgaWYgKHRhc2suZHVlRGF0ZSAhPT0gJycpIHtcbiAgICAgIGNvbnN0IGRhdGVTcGFuID0gdGFza0l0ZW0ucXVlcnlTZWxlY3RvcignLnRhc2staW5mbycpO1xuICAgICAgY29uc3QgdGFza0R1ZURhdGUgPSB0YXNrSXRlbS5xdWVyeVNlbGVjdG9yKCcudGFzay1kdWUtZGF0ZScpO1xuICAgICAgY29uc3QgaXNMYXRlID0gdGFza0l0ZW0ucXVlcnlTZWxlY3RvcignLnRhc2stZGF0ZS1pbmZvJyk7XG5cbiAgICAgIGRhdGVTcGFuLnRleHRDb250ZW50ID0gJ0R1ZSBieTogJztcbiAgICAgIHRhc2tEdWVEYXRlLnRleHRDb250ZW50ID0gdGFzay5kdWVEYXRlO1xuICAgICAgaWYgKGhhc0RhdGVQYXN0KHRhc2suZHVlRGF0ZSkgPT09IHRydWUpIHtcbiAgICAgICAgaXNMYXRlLnRleHRDb250ZW50ID0gJ0xhdGUhJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlzTGF0ZS50ZXh0Q29udGVudCA9ICcnO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBjb25zdCB0b2dnbGVUYXNrRGV0YWlscyA9IChpbWcsIGJvZHkpID0+IHtcbiAgICBjb25zdCBidG5JbWcgPSBpbWcuZ2V0QXR0cmlidXRlKCdzcmMnKTtcblxuICAgIGlmIChidG5JbWcgPT09ICcuL2ljb25zL2Ryb3BfZG93bi5zdmcnKSB7XG4gICAgICBpbWcuc2V0QXR0cmlidXRlKCdzcmMnLCAnLi9pY29ucy9kcm9wX2Rvd25fbGVmdC5zdmcnKTtcbiAgICB9IGVsc2UgaWYgKGJ0bkltZyA9PT0gJy4vaWNvbnMvZHJvcF9kb3duX2xlZnQuc3ZnJykge1xuICAgICAgaW1nLnNldEF0dHJpYnV0ZSgnc3JjJywgJy4vaWNvbnMvZHJvcF9kb3duLnN2ZycpO1xuICAgIH1cbiAgICB0b2dnbGVIaWRkZW4oYm9keSk7XG4gIH07XG5cbiAgY29uc3QgcmVuZGVyVGFzayA9IChwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCkgPT4ge1xuICAgIGNvbnN0IHRhc2tSb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjb25zdCB0YXNrSXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbnN0IHRhc2tJdGVtSGVhZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29uc3QgdGFza1RpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29uc3QgdGl0bGVDaGVja2JveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgY29uc3QgdGl0bGVMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gICAgY29uc3QgdGFza0l0ZW1SZXZlYWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjb25zdCB0YXNrUmV2ZWFsQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgY29uc3QgdGFza1JldmVhbEltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgIGNvbnN0IHRhc2tJdGVtQm9keSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbnN0IHRhc2tEZXNjcmlwdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICBjb25zdCB0YXNrU3RlcHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICAgIGNvbnN0IHRhc2tEYXRlRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29uc3QgZGF0ZVNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgY29uc3QgdGFza0R1ZURhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgY29uc3QgZGF0ZUluZm9TcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIGNvbnN0IHRhc2tQcmlvcml0eURpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbnN0IHByaW9yaXR5U3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBjb25zdCB0YXNrUHJpb3JpdHlMZXZlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBjb25zdCB0YXNrUm93QnRucyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbnN0IGVkaXRUYXNrQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgY29uc3QgZWRpdFRhc2tJbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICBjb25zdCBkZWxldGVUYXNrQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgY29uc3QgZGVsZXRlVGFza0ltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuXG4gICAgdGFza1Jvdy5jbGFzc0xpc3QuYWRkKCd0YXNrLXJvdycpO1xuICAgIHRhc2tSb3cuZGF0YXNldC5wcm9qZWN0SW5kZXggPSBwcm9qZWN0SW5kZXg7XG4gICAgdGFza1Jvdy5kYXRhc2V0LnRhc2tJbmRleCA9IHRhc2tJbmRleDtcbiAgICB0YXNrSXRlbS5jbGFzc0xpc3QuYWRkKCd0YXNrLWl0ZW0nKTtcbiAgICB0YXNrSXRlbUhlYWRlci5jbGFzc0xpc3QuYWRkKCd0YXNrLWl0ZW0taGVhZGVyJyk7XG4gICAgdGFza1RpdGxlLmNsYXNzTGlzdC5hZGQoJ3Rhc2stdGl0bGUnKTtcbiAgICB0aXRsZUNoZWNrYm94LnNldEF0dHJpYnV0ZSgndHlwZScsICdjaGVja2JveCcpO1xuICAgIHRpdGxlQ2hlY2tib3guc2V0QXR0cmlidXRlKFxuICAgICAgJ25hbWUnLFxuICAgICAgYHByb2plY3Qke3Byb2plY3RJbmRleH0tdGFzayR7dGFza0luZGV4fWAsXG4gICAgKTtcbiAgICB0aXRsZUNoZWNrYm94LnNldEF0dHJpYnV0ZSgnaWQnLCBgcHJvamVjdCR7cHJvamVjdEluZGV4fS10YXNrJHt0YXNrSW5kZXh9YCk7XG4gICAgdGl0bGVDaGVja2JveC5kYXRhc2V0LnByb2plY3RJbmRleCA9IHByb2plY3RJbmRleDtcbiAgICB0aXRsZUNoZWNrYm94LmRhdGFzZXQudGFza0luZGV4ID0gdGFza0luZGV4O1xuICAgIHRpdGxlTGFiZWwuc2V0QXR0cmlidXRlKCdmb3InLCBgcHJvamVjdCR7cHJvamVjdEluZGV4fS10YXNrJHt0YXNrSW5kZXh9YCk7XG4gICAgdGFza0l0ZW1SZXZlYWwuY2xhc3NMaXN0LmFkZCgndGFzay1pdGVtLXJldmVhbCcpO1xuICAgIHRhc2tSZXZlYWxCdG4uY2xhc3NMaXN0LmFkZCgndGFzay1yZXZlYWwtYnV0dG9uJyk7XG4gICAgdGFza1JldmVhbEltZy5zZXRBdHRyaWJ1dGUoJ3NyYycsICcuL2ljb25zL2Ryb3BfZG93bi5zdmcnKTtcbiAgICB0YXNrUmV2ZWFsSW1nLnNldEF0dHJpYnV0ZSgnYWx0JywgJ3Nob3cgdGFzayBkZXRhaWxzIGRyb3Bkb3duJyk7XG4gICAgdGFza0l0ZW1Cb2R5LmNsYXNzTGlzdC5hZGQoJ3Rhc2staXRlbS1ib2R5JywgJ2hpZGRlbicpO1xuICAgIHRhc2tEZXNjcmlwdGlvbi5jbGFzc0xpc3QuYWRkKCd0YXNrLWRlc2NyaXB0aW9uJyk7XG4gICAgdGFza1N0ZXBzLmNsYXNzTGlzdC5hZGQoJ3Rhc2stc3RlcHMnKTtcbiAgICBkYXRlU3Bhbi5jbGFzc0xpc3QuYWRkKCd0YXNrLWluZm8nKTtcbiAgICB0YXNrRHVlRGF0ZS5jbGFzc0xpc3QuYWRkKCd0YXNrLWR1ZS1kYXRlJyk7XG4gICAgZGF0ZUluZm9TcGFuLmNsYXNzTGlzdC5hZGQoJ3Rhc2stZGF0ZS1pbmZvJyk7XG4gICAgcHJpb3JpdHlTcGFuLmNsYXNzTGlzdC5hZGQoJ3Rhc2staW5mbycpO1xuICAgIHByaW9yaXR5U3Bhbi50ZXh0Q29udGVudCA9ICdQcmlvcml0eTogJztcbiAgICB0YXNrUHJpb3JpdHlMZXZlbC5jbGFzc0xpc3QuYWRkKCd0YXNrLXByaW9yaXR5LWxldmVsJyk7XG4gICAgdGFza1Jvd0J0bnMuY2xhc3NMaXN0LmFkZCgndGFzay1yb3ctYnV0dG9ucycpO1xuICAgIGVkaXRUYXNrSW1nLnNldEF0dHJpYnV0ZSgnc3JjJywgJy4vaWNvbnMvZWRpdC5zdmcnKTtcbiAgICBlZGl0VGFza0ltZy5zZXRBdHRyaWJ1dGUoJ2FsdCcsICdlZGl0IHRhc2sgYnV0dG9uJyk7XG4gICAgZWRpdFRhc2tCdG4uZGF0YXNldC5wcm9qZWN0SW5kZXggPSBwcm9qZWN0SW5kZXg7XG4gICAgZWRpdFRhc2tCdG4uZGF0YXNldC50YXNrSW5kZXggPSB0YXNrSW5kZXg7XG4gICAgZGVsZXRlVGFza0ltZy5zZXRBdHRyaWJ1dGUoJ3NyYycsICcuL2ljb25zL2RlbGV0ZS5zdmcnKTtcbiAgICBkZWxldGVUYXNrSW1nLnNldEF0dHJpYnV0ZSgnYWx0JywgJ2RlbGV0ZSB0YXNrIGJ1dHRvbicpO1xuICAgIGRlbGV0ZVRhc2tCdG4uZGF0YXNldC5wcm9qZWN0SW5kZXggPSBwcm9qZWN0SW5kZXg7XG4gICAgZGVsZXRlVGFza0J0bi5kYXRhc2V0LnRhc2tJbmRleCA9IHRhc2tJbmRleDtcblxuICAgIHVuZmluaXNoZWREaXYuYXBwZW5kQ2hpbGQodGFza1Jvdyk7XG4gICAgdGFza1Jvdy5hcHBlbmRDaGlsZCh0YXNrSXRlbSk7XG4gICAgdGFza0l0ZW0uYXBwZW5kQ2hpbGQodGFza0l0ZW1IZWFkZXIpO1xuICAgIHRhc2tJdGVtSGVhZGVyLmFwcGVuZENoaWxkKHRhc2tUaXRsZSk7XG4gICAgdGFza1RpdGxlLmFwcGVuZENoaWxkKHRpdGxlQ2hlY2tib3gpO1xuICAgIHRhc2tUaXRsZS5hcHBlbmRDaGlsZCh0aXRsZUxhYmVsKTtcbiAgICB0YXNrSXRlbUhlYWRlci5hcHBlbmRDaGlsZCh0YXNrSXRlbVJldmVhbCk7XG4gICAgdGFza0l0ZW1SZXZlYWwuYXBwZW5kQ2hpbGQodGFza1JldmVhbEJ0bik7XG4gICAgdGFza1JldmVhbEJ0bi5hcHBlbmRDaGlsZCh0YXNrUmV2ZWFsSW1nKTtcbiAgICB0YXNrSXRlbS5hcHBlbmRDaGlsZCh0YXNrSXRlbUJvZHkpO1xuICAgIHRhc2tJdGVtQm9keS5hcHBlbmRDaGlsZCh0YXNrRGVzY3JpcHRpb24pO1xuICAgIHRhc2tJdGVtQm9keS5hcHBlbmRDaGlsZCh0YXNrU3RlcHMpO1xuICAgIHRhc2tJdGVtQm9keS5hcHBlbmRDaGlsZCh0YXNrRGF0ZURpdik7XG4gICAgdGFza0RhdGVEaXYuYXBwZW5kQ2hpbGQoZGF0ZVNwYW4pO1xuICAgIHRhc2tEYXRlRGl2LmFwcGVuZENoaWxkKHRhc2tEdWVEYXRlKTtcbiAgICB0YXNrRGF0ZURpdi5hcHBlbmRDaGlsZChkYXRlSW5mb1NwYW4pO1xuICAgIHRhc2tJdGVtQm9keS5hcHBlbmRDaGlsZCh0YXNrUHJpb3JpdHlEaXYpO1xuICAgIHRhc2tQcmlvcml0eURpdi5hcHBlbmRDaGlsZChwcmlvcml0eVNwYW4pO1xuICAgIHRhc2tQcmlvcml0eURpdi5hcHBlbmRDaGlsZCh0YXNrUHJpb3JpdHlMZXZlbCk7XG4gICAgdGFza1Jvdy5hcHBlbmRDaGlsZCh0YXNrUm93QnRucyk7XG4gICAgdGFza1Jvd0J0bnMuYXBwZW5kQ2hpbGQoZWRpdFRhc2tCdG4pO1xuICAgIGVkaXRUYXNrQnRuLmFwcGVuZENoaWxkKGVkaXRUYXNrSW1nKTtcbiAgICB0YXNrUm93QnRucy5hcHBlbmRDaGlsZChkZWxldGVUYXNrQnRuKTtcbiAgICBkZWxldGVUYXNrQnRuLmFwcGVuZENoaWxkKGRlbGV0ZVRhc2tJbWcpO1xuXG4gICAgcmVuZGVyVGFza0NvbnRlbnQocHJvamVjdEluZGV4LCB0YXNrSW5kZXgpO1xuXG4gICAgdGFza1JldmVhbEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+XG4gICAgICB0b2dnbGVUYXNrRGV0YWlscyh0YXNrUmV2ZWFsSW1nLCB0YXNrSXRlbUJvZHkpLFxuICAgICk7XG4gICAgdGl0bGVDaGVja2JveC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoKSA9PlxuICAgICAgdG9nZ2xlVGFza1N0YXR1cyh0aXRsZUNoZWNrYm94LCBwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCksXG4gICAgKTtcbiAgICBlZGl0VGFza0J0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+XG4gICAgICBlZGl0VGFza01vZGFsLm9wZW5FZGl0VGFza01vZGFsKFxuICAgICAgICBlZGl0VGFza0J0bi5kYXRhc2V0LnByb2plY3RJbmRleCxcbiAgICAgICAgZWRpdFRhc2tCdG4uZGF0YXNldC50YXNrSW5kZXgsXG4gICAgICApLFxuICAgICk7XG4gICAgZGVsZXRlVGFza0J0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+XG4gICAgICBkZWxldGVUYXNrTW9kYWwub3BlbkRlbGV0ZU1vZGFsKFxuICAgICAgICBkZWxldGVUYXNrQnRuLmRhdGFzZXQucHJvamVjdEluZGV4LFxuICAgICAgICBkZWxldGVUYXNrQnRuLmRhdGFzZXQudGFza0luZGV4LFxuICAgICAgKSxcbiAgICApO1xuXG4gICAgaWYgKHRpdGxlQ2hlY2tib3guY2hlY2tlZCkge1xuICAgICAgc2VuZFRvRmluaXNoZWREaXYodGFza0luZGV4KTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgdXBkYXRlVGFza0luZGljZXMgPSAoZGVsZXRlZEluZGV4KSA9PiB7XG4gICAgY29uc3QgYWxsVGFza0luZGljZXMgPSBtYWluVGFza3MucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtdGFzay1pbmRleF0nKTtcbiAgICBhbGxUYXNrSW5kaWNlcy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICBjb25zdCBjdXJyZW50SW5kZXggPSBOdW1iZXIoZWxlbWVudC5kYXRhc2V0LnRhc2tJbmRleCk7XG4gICAgICBpZiAoY3VycmVudEluZGV4ID49IE51bWJlcihkZWxldGVkSW5kZXgpKSB7XG4gICAgICAgIGVsZW1lbnQuZGF0YXNldC50YXNrSW5kZXggPSBjdXJyZW50SW5kZXggLSAxO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IHJlbmRlckRlbGV0ZWRUYXNrID0gKHRhc2tJbmRleCkgPT4ge1xuICAgIGNvbnN0IHRhc2tUb0RlbGV0ZSA9IG1haW5UYXNrcy5xdWVyeVNlbGVjdG9yKFxuICAgICAgYGRpdltkYXRhLXRhc2staW5kZXg9JyR7dGFza0luZGV4fSddYCxcbiAgICApO1xuICAgIHRhc2tUb0RlbGV0ZS5yZW1vdmUoKTtcbiAgICB1cGRhdGVUYXNrSW5kaWNlcyh0YXNrSW5kZXgpO1xuICB9O1xuXG4gIGNvbnN0IHJlbmRlck1haW4gPSAocHJvamVjdCwgcHJvamVjdEluZGV4KSA9PiB7XG4gICAgcmVuZGVySGVhZGVyKHByb2plY3QpO1xuICAgIHNldE5ld1Rhc2tCdG5JbmRleChwcm9qZWN0SW5kZXgpO1xuICAgIGNsZWFyVGFza3MoKTtcbiAgICBpZiAocHJvamVjdC50YXNrcy5sZW5ndGggPiAwKSB7XG4gICAgICBwcm9qZWN0LnRhc2tzLmZvckVhY2goKHRhc2spID0+XG4gICAgICAgIHJlbmRlclRhc2socHJvamVjdEluZGV4LCBwcm9qZWN0LnRhc2tzLmluZGV4T2YodGFzaykpLFxuICAgICAgKTtcbiAgICB9XG4gIH07XG5cbiAgLyogRnVuY3Rpb24gdG8gaW52b2tlIG9uIGluaXRpbGlzZSwgZm9yIHRoZSBjb21wb25lbnQgdG8gd29yayBwcm9wZXJseSAqL1xuICBjb25zdCBpbml0ID0gKCkgPT4ge1xuICAgIGNvbnN0IGZpcnN0UHJvamVjdCA9IHByb2plY3RNYW5hZ2VyLnJldmVhbFByb2plY3QoMCk7XG4gICAgcmVuZGVyTWFpbihmaXJzdFByb2plY3QsIDApO1xuICAgIGFkZE5ld1Rhc2tCdG5MaXN0ZW5lcigpO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgcmVuZGVySGVhZGVyLFxuICAgIHNldE5ld1Rhc2tCdG5JbmRleCxcbiAgICBhZGROZXdUYXNrQnRuTGlzdGVuZXIsXG4gICAgY2xlYXJUYXNrcyxcbiAgICByZW5kZXJUYXNrQ29udGVudCxcbiAgICByZW5kZXJUYXNrLFxuICAgIHJlbmRlckRlbGV0ZWRUYXNrLFxuICAgIHJlbmRlck1haW4sXG4gICAgaW5pdCxcbiAgfTtcbn0pKCk7XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4tIEFzaWRlIG1vZHVsZVxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbmNvbnN0IGFzaWRlID0gKCgpID0+IHtcbiAgLyogY29uc3QgZmlsdGVyc0FzaWRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYXNpZGUnKTsgKi9cbiAgY29uc3QgbWFpblRhc2tzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnVuZmluaXNoZWQtdGFza3MnKTtcbiAgY29uc3Qgc2VhcmNoYmFyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlYXJjaC10YXNrcycpO1xuXG4gIGNvbnN0IHNlYXJjaEZvck1hdGNoID0gKCkgPT4ge1xuICAgIGNvbnN0IGluZGV4ID0gTnVtYmVyKFxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW4tbmV3LXRhc2stYnV0dG9uJykuZGF0YXNldC5wcm9qZWN0SW5kZXgsXG4gICAgKTtcbiAgICBjb25zdCBjdXJyZW50UHJvamVjdCA9IHByb2plY3RNYW5hZ2VyLnJldmVhbFByb2plY3QoaW5kZXgpO1xuICAgIGNvbnN0IHRleHRUb0NvbXBhcmUgPSBzZWFyY2hiYXIudmFsdWU7XG4gICAgY29uc3QgZmlsdGVyVGFza3MgPSAodGFzaykgPT4ge1xuICAgICAgaWYgKFxuICAgICAgICB0YXNrLnRpdGxlLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXModGV4dFRvQ29tcGFyZS50b0xvd2VyQ2FzZSgpKSB8fFxuICAgICAgICB0YXNrLmRlc2NyaXB0aW9uLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXModGV4dFRvQ29tcGFyZS50b0xvd2VyQ2FzZSgpKSB8fFxuICAgICAgICB0YXNrLnN0ZXBzLmZpbHRlcigoc3RlcCkgPT5cbiAgICAgICAgICBzdGVwLmRlc2NyaXB0aW9uLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXModGV4dFRvQ29tcGFyZS50b0xvd2VyQ2FzZSgpKSxcbiAgICAgICAgKS5sZW5ndGggPiAwXG4gICAgICApIHtcbiAgICAgICAgbWFpbi5yZW5kZXJUYXNrKGluZGV4LCBjdXJyZW50UHJvamVjdC50YXNrcy5pbmRleE9mKHRhc2spKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcblxuICAgIGlmICh0ZXh0VG9Db21wYXJlICE9PSAnJykge1xuICAgICAgbWFpbi5jbGVhclRhc2tzKCk7XG4gICAgICBjb25zdCBmaWx0ZXJlZFRhc2tzID0gY3VycmVudFByb2plY3QudGFza3MuZmlsdGVyKCh0YXNrKSA9PlxuICAgICAgICBmaWx0ZXJUYXNrcyh0YXNrKSxcbiAgICAgICk7XG4gICAgICBpZiAoZmlsdGVyZWRUYXNrcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgY29uc3Qgbm9UYXNrc01lc3NhZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICAgIG5vVGFza3NNZXNzYWdlLnRleHRDb250ZW50ID0gJ05vIG1hdGNoZXMgZm91bmQnO1xuICAgICAgICBtYWluVGFza3MuYXBwZW5kQ2hpbGQobm9UYXNrc01lc3NhZ2UpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGV4dFRvQ29tcGFyZSA9PT0gJycpIHtcbiAgICAgIG1haW4uY2xlYXJUYXNrcygpO1xuICAgICAgbWFpbi5yZW5kZXJNYWluKGN1cnJlbnRQcm9qZWN0LCBpbmRleCk7XG4gICAgfVxuICB9O1xuXG4gIC8qIEZ1bmN0aW9uIHRvIGludm9rZSBvbiBpbml0aWxpc2UsIGZvciB0aGUgY29tcG9uZW50IHRvIHdvcmsgcHJvcGVybHkgKi9cbiAgY29uc3QgYWRkU2VhcmNoYmFyTElzdGVuZXIgPSAoKSA9PiB7XG4gICAgc2VhcmNoYmFyLmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgc2VhcmNoRm9yTWF0Y2gpO1xuICB9O1xuXG4gIHJldHVybiB7IHNlYXJjaEZvck1hdGNoLCBhZGRTZWFyY2hiYXJMSXN0ZW5lciB9O1xufSkoKTtcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi0gTW9kdWxlIHRvIGNvbnRyb2wgdGhpbmdzIGNvbW1vbiBtb3N0IG1vZGFsc1xuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbmNvbnN0IGFsbE1vZGFscyA9ICgoKSA9PiB7XG4gIC8qIEdlbmVyYWwgZnVuY3Rpb25zIHRvIGNsb3NlIG1vZGFscyBhbmQgY2xlYXIgaW5wdXRzICovXG4gIGNvbnN0IGNsZWFySW5wdXRzID0gKG1vZGFsKSA9PiB7XG4gICAgY29uc3QgaW5wdXRzID0gbW9kYWwucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQnKTtcbiAgICBjb25zdCB0ZXh0YXJlYXMgPSBtb2RhbC5xdWVyeVNlbGVjdG9yQWxsKCd0ZXh0YXJlYScpO1xuICAgIGNvbnN0IHNlbGVjdE9wdGlvbiA9IG1vZGFsLnF1ZXJ5U2VsZWN0b3IoJ29wdGlvbicpO1xuICAgIGNvbnN0IHN0ZXBzTGlzdCA9IG1vZGFsLnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbC1zdGVwcy1saXN0Jyk7XG4gICAgaWYgKGlucHV0cykge1xuICAgICAgaW5wdXRzLmZvckVhY2goKGlucHV0KSA9PiB7XG4gICAgICAgIGlucHV0LnZhbHVlID0gJyc7XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKHRleHRhcmVhcykge1xuICAgICAgdGV4dGFyZWFzLmZvckVhY2goKHRleHRhcmVhKSA9PiB7XG4gICAgICAgIHRleHRhcmVhLnZhbHVlID0gJyc7XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKHNlbGVjdE9wdGlvbikge1xuICAgICAgc2VsZWN0T3B0aW9uLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKHN0ZXBzTGlzdCkge1xuICAgICAgc3RlcHNDb21wb25lbnQuY2xlYXJBbGxTdGVwcyhzdGVwc0xpc3QpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBjbG9zZU1vZGFsID0gKG1vZGFsKSA9PiB7XG4gICAgY2xlYXJJbnB1dHMobW9kYWwpO1xuICAgIHRvZ2dsZUhpZGRlbihtb2RhbCk7XG4gIH07XG5cbiAgLyogRnVuY3Rpb25zIHRvIGludm9rZSBvbiBpbml0aWxpc2UsIGZvciB0aGUgY29tcG9uZW50IHRvIHdvcmsgcHJvcGVybHkgKi9cbiAgY29uc3QgYWRkQ2xvc2VCdG5MaXN0ZW5lcnMgPSAoKSA9PiB7XG4gICAgY29uc3QgY2xvc2VNb2RhbEJ0bnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubW9kYWwtY2xvc2UtYnV0dG9uJyk7XG5cbiAgICBjbG9zZU1vZGFsQnRucy5mb3JFYWNoKChidG4pID0+IHtcbiAgICAgIGNvbnN0IG1vZGFsID0gYnRuLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50O1xuICAgICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gY2xvc2VNb2RhbChtb2RhbCkpO1xuICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IGFkZENsb3NlQmFja2dyb3VuZExpc3RlbmVycyA9ICgpID0+IHtcbiAgICBjb25zdCBtb2RhbEJhY2tncm91bmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm1vZGFsLWJhY2tncm91bmQnKTtcbiAgICBjb25zdCBjbG9zZSA9IChlLCBtb2RhbEJhY2tncm91bmQpID0+IHtcbiAgICAgIGlmICghZS50YXJnZXQuY2xvc2VzdCgnLm1vZGFsJykpIHtcbiAgICAgICAgY2xvc2VNb2RhbChtb2RhbEJhY2tncm91bmQpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBtb2RhbEJhY2tncm91bmRzLmZvckVhY2goKGJhY2tncm91bmQpID0+IHtcbiAgICAgIGJhY2tncm91bmQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4gY2xvc2UoZSwgYmFja2dyb3VuZCkpO1xuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiB7IGNsb3NlTW9kYWwsIGFkZENsb3NlQnRuTGlzdGVuZXJzLCBhZGRDbG9zZUJhY2tncm91bmRMaXN0ZW5lcnMgfTtcbn0pKCk7XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4tICdOZXcgTGlzdCcgbW9kYWwgbW9kdWxlXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuY29uc3QgbmV3TGlzdE1vZGFsID0gKCgpID0+IHtcbiAgY29uc3QgbW9kYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmV3LWxpc3QtbW9kYWwnKS5wYXJlbnRFbGVtZW50O1xuICBjb25zdCBzdWJtaXRCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmV3LWxpc3Qtc3VibWl0LWJ1dHRvbicpO1xuXG4gIGNvbnN0IGNyZWF0TmV3TGlzdCA9IChlKSA9PiB7XG4gICAgY29uc3QgdGl0bGVJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZXctbGlzdC1uYW1lJykudmFsdWU7XG4gICAgY29uc3QgZGVzY3JpcHRpb25JbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuICAgICAgJ25ldy1saXN0LWRlc2NyaXB0aW9uJyxcbiAgICApLnZhbHVlO1xuICAgIGNvbnN0IGluZGV4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25hdi10b2RvLWxpc3RzJykuY2hpbGRyZW4ubGVuZ3RoO1xuXG4gICAgaWYgKHRpdGxlSW5wdXQgIT09ICcnKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIGNvbnN0IG5ld0xpc3QgPSBwcm9qZWN0TWFuYWdlci5jcmVhdGVOZXdQcm9qZWN0KFxuICAgICAgICB0aXRsZUlucHV0LFxuICAgICAgICBkZXNjcmlwdGlvbklucHV0LFxuICAgICAgKTtcbiAgICAgIG5hdmJhci5yZW5kZXJOZXdMaXN0KG5ld0xpc3QsIG5hdmJhci5jYWxjdWxhdGVOZXdQcm9qZWN0SW5kZXgoKSk7XG4gICAgICBtYWluLnJlbmRlck1haW4ocHJvamVjdE1hbmFnZXIucmV2ZWFsUHJvamVjdChpbmRleCArIDEpLCBpbmRleCArIDEpO1xuXG4gICAgICBhbGxNb2RhbHMuY2xvc2VNb2RhbChtb2RhbCk7XG4gICAgfVxuICB9O1xuXG4gIC8qIEZ1bmN0aW9uIHRvIGludm9rZSBvbiBpbml0aWxpc2UsIGZvciB0aGUgY29tcG9uZW50IHRvIHdvcmsgcHJvcGVybHkgKi9cbiAgY29uc3QgYWRkU3VibWl0QnRuTGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgc3VibWl0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IGNyZWF0TmV3TGlzdChlKSk7XG4gIH07XG5cbiAgcmV0dXJuIHsgYWRkU3VibWl0QnRuTGlzdGVuZXIgfTtcbn0pKCk7XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4tICdFZGl0IGxpc3QnIG1vZGFsIG1vZHVsZVxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbmNvbnN0IGVkaXRMaXN0TW9kYWwgPSAoKCkgPT4ge1xuICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5lZGl0LWxpc3QtbW9kYWwnKS5wYXJlbnRFbGVtZW50O1xuICBjb25zdCBlZGl0QnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VkaXQtbGlzdC1zdWJtaXQtYnV0dG9uJyk7XG5cbiAgY29uc3Qgc2V0UHJvamVjdERhdGFJbmRleCA9IChwcm9qZWN0SW5kZXgpID0+IHtcbiAgICBlZGl0QnRuLmRhdGFzZXQucHJvamVjdEluZGV4ID0gcHJvamVjdEluZGV4O1xuICB9O1xuXG4gIGNvbnN0IG9wZW5FZGl0TW9kYWwgPSAocHJvamVjdEluZGV4KSA9PiB7XG4gICAgY29uc3QgdGl0bGVJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlZGl0LWxpc3QtbmFtZScpO1xuICAgIGNvbnN0IGRlc2NyaXB0aW9uSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZWRpdC1saXN0LWRlc2NyaXB0aW9uJyk7XG4gICAgY29uc3QgcHJvamVjdFRvRWRpdCA9IHByb2plY3RNYW5hZ2VyLnJldmVhbFByb2plY3QoTnVtYmVyKHByb2plY3RJbmRleCkpO1xuXG4gICAgdGl0bGVJbnB1dC52YWx1ZSA9IHByb2plY3RUb0VkaXQudGl0bGU7XG4gICAgZGVzY3JpcHRpb25JbnB1dC52YWx1ZSA9IHByb2plY3RUb0VkaXQuZGVzY3JpcHRpb247XG5cbiAgICBzZXRQcm9qZWN0RGF0YUluZGV4KHByb2plY3RJbmRleCk7XG4gICAgdG9nZ2xlSGlkZGVuKG1vZGFsKTtcbiAgfTtcblxuICBjb25zdCBlZGl0TGlzdCA9IChlKSA9PiB7XG4gICAgY29uc3QgdGl0bGVJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlZGl0LWxpc3QtbmFtZScpLnZhbHVlO1xuICAgIGNvbnN0IGRlc2NyaXB0aW9uSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcbiAgICAgICdlZGl0LWxpc3QtZGVzY3JpcHRpb24nLFxuICAgICkudmFsdWU7XG4gICAgY29uc3QgaW5kZXggPSBOdW1iZXIoZWRpdEJ0bi5kYXRhc2V0LnByb2plY3RJbmRleCk7XG5cbiAgICBpZiAodGl0bGVJbnB1dCAhPT0gJycpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHByb2plY3RNYW5hZ2VyLmVkaXRQcm9qZWN0VGl0bGUoaW5kZXgsIHRpdGxlSW5wdXQpO1xuICAgICAgcHJvamVjdE1hbmFnZXIuZWRpdFByb2plY3REZXNjcmlwdGlvbihpbmRleCwgZGVzY3JpcHRpb25JbnB1dCk7XG4gICAgICBjb25zdCBlZGl0ZWRQcm9qZWN0ID0gcHJvamVjdE1hbmFnZXIucmV2ZWFsUHJvamVjdChpbmRleCk7XG4gICAgICBuYXZiYXIucmVuZGVyRWRpdGVkTGlzdChpbmRleCwgZWRpdGVkUHJvamVjdCk7XG4gICAgICBtYWluLnJlbmRlck1haW4oZWRpdGVkUHJvamVjdCwgaW5kZXgpO1xuICAgICAgYWxsTW9kYWxzLmNsb3NlTW9kYWwobW9kYWwpO1xuICAgIH1cbiAgfTtcblxuICAvKiBGdW5jdGlvbiB0byBpbnZva2Ugb24gaW5pdGlsaXNlLCBmb3IgdGhlIGNvbXBvbmVudCB0byB3b3JrIHByb3Blcmx5ICovXG4gIGNvbnN0IGFkZEVkaXRCdG5MaXN0ZW5lciA9ICgpID0+IHtcbiAgICBlZGl0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IGVkaXRMaXN0KGUpKTtcbiAgfTtcblxuICByZXR1cm4geyBvcGVuRWRpdE1vZGFsLCBhZGRFZGl0QnRuTGlzdGVuZXIgfTtcbn0pKCk7XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4tICdEZWxldGUgbGlzdCcgbW9kYWwgbW9kdWxlXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuY29uc3QgZGVsZXRlTGlzdE1vZGFsID0gKCgpID0+IHtcbiAgY29uc3QgbW9kYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZGVsZXRlLWxpc3QtbW9kYWwnKS5wYXJlbnRFbGVtZW50O1xuICBjb25zdCBjYW5jZWxCdG4gPSBtb2RhbC5xdWVyeVNlbGVjdG9yKCcuY2FuY2VsLWJ1dHRvbicpO1xuICBjb25zdCBkZWxldGVCdG4gPSBtb2RhbC5xdWVyeVNlbGVjdG9yKCcuZGVsZXRlLWJ1dHRvbicpO1xuXG4gIGNvbnN0IHNldFByb2plY3REYXRhSW5kZXggPSAocHJvamVjdEluZGV4KSA9PiB7XG4gICAgZGVsZXRlQnRuLmRhdGFzZXQucHJvamVjdEluZGV4ID0gcHJvamVjdEluZGV4O1xuICB9O1xuXG4gIGNvbnN0IG9wZW5EZWxldGVNb2RhbCA9IChwcm9qZWN0SW5kZXgpID0+IHtcbiAgICBzZXRQcm9qZWN0RGF0YUluZGV4KHByb2plY3RJbmRleCk7XG4gICAgdG9nZ2xlSGlkZGVuKG1vZGFsKTtcbiAgfTtcblxuICBjb25zdCBkZWxldGVMaXN0ID0gKCkgPT4ge1xuICAgIGNvbnN0IGluZGV4ID0gTnVtYmVyKGRlbGV0ZUJ0bi5kYXRhc2V0LnByb2plY3RJbmRleCk7XG4gICAgcHJvamVjdE1hbmFnZXIuZGVsZXRlUHJvamVjdChpbmRleCk7XG4gICAgbmF2YmFyLnJlbmRlckRlbGV0ZWRMaXN0KGluZGV4KTtcbiAgICBtYWluLnJlbmRlck1haW4ocHJvamVjdE1hbmFnZXIucmV2ZWFsUHJvamVjdCgwKSwgMCk7XG4gICAgdG9nZ2xlSGlkZGVuKG1vZGFsKTtcbiAgfTtcblxuICAvKiBGdW5jdGlvbnMgdG8gaW52b2tlIG9uIGluaXRpbGlzZSwgZm9yIHRoZSBjb21wb25lbnQgdG8gd29yayBwcm9wZXJseSAqL1xuICBjb25zdCBhZGRDYW5jZWxCdG5MaXN0ZW5lciA9ICgpID0+IHtcbiAgICBjYW5jZWxCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB0b2dnbGVIaWRkZW4obW9kYWwpKTtcbiAgfTtcblxuICBjb25zdCBhZGREZWxldGVCdG5MaXN0ZW5lciA9ICgpID0+IHtcbiAgICBkZWxldGVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBkZWxldGVMaXN0KTtcbiAgfTtcblxuICByZXR1cm4geyBvcGVuRGVsZXRlTW9kYWwsIGFkZENhbmNlbEJ0bkxpc3RlbmVyLCBhZGREZWxldGVCdG5MaXN0ZW5lciB9O1xufSkoKTtcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi0gJ05ldyB0YXNrJyBtb2RhbCBtb2R1bGVcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5jb25zdCBuZXdUYXNrTW9kYWwgPSAoKCkgPT4ge1xuICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uZXctdGFzay1tb2RhbCcpLnBhcmVudEVsZW1lbnQ7XG4gIGNvbnN0IG5ld1Rhc2tCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmV3LXRhc2stc3VibWl0LWJ1dHRvbicpO1xuICBjb25zdCBzdGVwc0xpc3QgPSBtb2RhbC5xdWVyeVNlbGVjdG9yKCcubW9kYWwtc3RlcHMtbGlzdCcpO1xuXG4gIGNvbnN0IHNldFByb2plY3REYXRhSW5kZXggPSAocHJvamVjdEluZGV4KSA9PiB7XG4gICAgbmV3VGFza0J0bi5kYXRhc2V0LnByb2plY3RJbmRleCA9IHByb2plY3RJbmRleDtcbiAgfTtcblxuICBjb25zdCBvcGVuTmV3VGFza01vZGFsID0gKHByb2plY3RJbmRleCkgPT4ge1xuICAgIHNldFByb2plY3REYXRhSW5kZXgocHJvamVjdEluZGV4KTtcbiAgICBzdGVwc0NvbXBvbmVudC5jbGVhckFsbFN0ZXBzKHN0ZXBzTGlzdCk7XG4gICAgdG9nZ2xlSGlkZGVuKG1vZGFsKTtcbiAgfTtcblxuICBjb25zdCBzdWJtaXROZXdUYXNrID0gKGUpID0+IHtcbiAgICBjb25zdCBwcm9qZWN0SW5kZXggPSBOdW1iZXIobmV3VGFza0J0bi5kYXRhc2V0LnByb2plY3RJbmRleCk7XG4gICAgY29uc3QgbmV3VGl0bGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmV3LXRhc2stbmFtZScpLnZhbHVlO1xuICAgIGNvbnN0IG5ld0Rlc2NyaXB0aW9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG4gICAgICAnbmV3LXRhc2stZGVzY3JpcHRpb24nLFxuICAgICkudmFsdWU7XG4gICAgY29uc3QgbmV3RGF0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZXctdGFzay1kYXRlJykudmFsdWU7XG4gICAgY29uc3QgbmV3UHJpb3JpdHkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmV3LXRhc2stcHJpb3JpdHknKS52YWx1ZTtcbiAgICBjb25zdCBuZXdTdGVwcyA9IHN0ZXBzQ29tcG9uZW50LnJldmVhbFN0ZXBzKCk7XG5cbiAgICBpZiAobmV3VGl0bGUgIT09ICcnKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB0YXNrTWFuYWdlci5jcmVhdGVOZXdUYXNrKFxuICAgICAgICBwcm9qZWN0SW5kZXgsXG4gICAgICAgIG5ld1RpdGxlLFxuICAgICAgICBuZXdEZXNjcmlwdGlvbixcbiAgICAgICAgbmV3RGF0ZSxcbiAgICAgICAgbmV3UHJpb3JpdHksXG4gICAgICAgICd0byBkbycsXG4gICAgICApO1xuICAgICAgY29uc3QgbGVuZ3RoID0gcHJvamVjdE1hbmFnZXIucmV2ZWFsUHJvamVjdFRhc2tzTGVuZ3RoKHByb2plY3RJbmRleCk7XG4gICAgICBuZXdTdGVwcy5mb3JFYWNoKChzdGVwKSA9PiB7XG4gICAgICAgIHN0ZXBNYW5hZ2VyLmNyZWF0ZU5ld1N0ZXAoXG4gICAgICAgICAgcHJvamVjdEluZGV4LFxuICAgICAgICAgIGxlbmd0aCAtIDEsXG4gICAgICAgICAgc3RlcC5kZXNjcmlwdGlvbixcbiAgICAgICAgICBzdGVwLnN0YXR1cyxcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgICAgbWFpbi5yZW5kZXJUYXNrKHByb2plY3RJbmRleCwgbGVuZ3RoIC0gMSk7XG4gICAgICBhbGxNb2RhbHMuY2xvc2VNb2RhbChtb2RhbCk7XG4gICAgfVxuICB9O1xuXG4gIC8qIEZ1bmN0aW9ucyB0byBpbnZva2Ugb24gaW5pdGlsaXNlLCBmb3IgdGhlIGNvbXBvbmVudCB0byB3b3JrIHByb3Blcmx5ICovXG4gIGNvbnN0IGFkZE5ld1Rhc2tCdG5MSXN0ZW5lciA9ICgpID0+IHtcbiAgICBuZXdUYXNrQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHN1Ym1pdE5ld1Rhc2soZSkpO1xuICB9O1xuXG4gIHJldHVybiB7IG9wZW5OZXdUYXNrTW9kYWwsIGFkZE5ld1Rhc2tCdG5MSXN0ZW5lciB9O1xufSkoKTtcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi0gJ0VkaXQgdGFzaycgbW9kYWwgbW9kdWxlXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuY29uc3QgZWRpdFRhc2tNb2RhbCA9ICgoKSA9PiB7XG4gIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmVkaXQtdGFzay1tb2RhbCcpLnBhcmVudEVsZW1lbnQ7XG4gIGNvbnN0IGVkaXRCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZWRpdC10YXNrLXN1Ym1pdC1idXR0b24nKTtcbiAgY29uc3Qgc3RlcHNMaXN0ID0gbW9kYWwucXVlcnlTZWxlY3RvcignLm1vZGFsLXN0ZXBzLWxpc3QnKTtcbiAgY29uc3QgdGl0bGVJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlZGl0LXRhc2stbmFtZScpO1xuICBjb25zdCBkZXNjcmlwdGlvbklucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VkaXQtdGFzay1kZXNjcmlwdGlvbicpO1xuICBjb25zdCBkYXRlSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZWRpdC10YXNrLWRhdGUnKTtcbiAgY29uc3QgcHJpb3JpdHlJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlZGl0LXRhc2stcHJpb3JpdHknKTtcblxuICBjb25zdCBzZXRQcm9qZWN0RGF0YUluZGV4ID0gKHByb2plY3RJbmRleCkgPT4ge1xuICAgIGVkaXRCdG4uZGF0YXNldC5wcm9qZWN0SW5kZXggPSBwcm9qZWN0SW5kZXg7XG4gIH07XG5cbiAgY29uc3Qgc2V0VGFza0RhdGFJbmRleCA9ICh0YXNrSW5kZXgpID0+IHtcbiAgICBlZGl0QnRuLmRhdGFzZXQudGFza0luZGV4ID0gdGFza0luZGV4O1xuICB9O1xuXG4gIGNvbnN0IG9wZW5FZGl0VGFza01vZGFsID0gKHByb2plY3RJbmRleCwgdGFza0luZGV4KSA9PiB7XG4gICAgY29uc3QgdGFza1RvRWRpdCA9IHRhc2tNYW5hZ2VyLnJldmVhbFRhc2socHJvamVjdEluZGV4LCB0YXNrSW5kZXgpO1xuXG4gICAgc2V0UHJvamVjdERhdGFJbmRleChwcm9qZWN0SW5kZXgpO1xuICAgIHNldFRhc2tEYXRhSW5kZXgodGFza0luZGV4KTtcbiAgICB0aXRsZUlucHV0LnZhbHVlID0gdGFza1RvRWRpdC50aXRsZTtcbiAgICBkZXNjcmlwdGlvbklucHV0LnZhbHVlID0gdGFza1RvRWRpdC5kZXNjcmlwdGlvbjtcbiAgICB0YXNrVG9FZGl0LnN0ZXBzLmZvckVhY2goKHN0ZXApID0+XG4gICAgICBzdGVwc0NvbXBvbmVudC5tYWtlU3RlcChzdGVwLCBzdGVwc0xpc3QpLFxuICAgICk7XG4gICAgaWYgKHRhc2tUb0VkaXQuZHVlRGF0ZSAhPT0gJycpIHtcbiAgICAgIGRhdGVJbnB1dC52YWx1ZSA9IHRhc2tUb0VkaXQuZHVlRGF0ZTtcbiAgICB9XG4gICAgcHJpb3JpdHlJbnB1dC52YWx1ZSA9IHRhc2tUb0VkaXQucHJpb3JpdHk7XG4gICAgdG9nZ2xlSGlkZGVuKG1vZGFsKTtcbiAgfTtcblxuICBjb25zdCBlZGl0VGFzayA9IChlKSA9PiB7XG4gICAgaWYgKHRpdGxlSW5wdXQudmFsdWUgIT09ICcnKSB7XG4gICAgICBjb25zdCBwcm9qZWN0SW5kZXggPSBOdW1iZXIoZWRpdEJ0bi5kYXRhc2V0LnByb2plY3RJbmRleCk7XG4gICAgICBjb25zdCB0YXNrSW5kZXggPSBOdW1iZXIoZWRpdEJ0bi5kYXRhc2V0LnRhc2tJbmRleCk7XG4gICAgICBjb25zdCB0YXNrVG9FZGl0ID0gdGFza01hbmFnZXIucmV2ZWFsVGFzayhwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCk7XG4gICAgICBjb25zdCBvbGRTdGVwcyA9IHRhc2tUb0VkaXQuc3RlcHM7XG4gICAgICBjb25zdCBlZGl0ZWRTdGVwcyA9IHN0ZXBzQ29tcG9uZW50LnJldmVhbFN0ZXBzKCk7XG5cbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHRhc2tNYW5hZ2VyLmVkaXRUYXNrVGl0bGUocHJvamVjdEluZGV4LCB0YXNrSW5kZXgsIHRpdGxlSW5wdXQudmFsdWUpO1xuICAgICAgdGFza01hbmFnZXIuZWRpdFRhc2tEZXNjcmlwdGlvbihcbiAgICAgICAgcHJvamVjdEluZGV4LFxuICAgICAgICB0YXNrSW5kZXgsXG4gICAgICAgIGRlc2NyaXB0aW9uSW5wdXQudmFsdWUsXG4gICAgICApO1xuICAgICAgdGFza01hbmFnZXIuZWRpdFRhc2tEdWVEYXRlKHByb2plY3RJbmRleCwgdGFza0luZGV4LCBkYXRlSW5wdXQudmFsdWUpO1xuICAgICAgdGFza01hbmFnZXIuZWRpdFRhc2tQcmlvcml0eShcbiAgICAgICAgcHJvamVjdEluZGV4LFxuICAgICAgICB0YXNrSW5kZXgsXG4gICAgICAgIHByaW9yaXR5SW5wdXQudmFsdWUsXG4gICAgICApO1xuICAgICAgaWYgKG9sZFN0ZXBzLmxlbmd0aCA+IDAgJiYgZWRpdGVkU3RlcHMubGVuZ3RoID4gMCkge1xuICAgICAgICBmb3IgKFxuICAgICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgICBpIDwgTWF0aC5taW4ob2xkU3RlcHMubGVuZ3RoLCBlZGl0ZWRTdGVwcy5sZW5ndGgpO1xuICAgICAgICAgIGkrK1xuICAgICAgICApIHtcbiAgICAgICAgICBpZiAoZWRpdGVkU3RlcHNbaV0uZGVzY3JpcHRpb24gIT09IG9sZFN0ZXBzW2ldLmRlc2NyaXB0aW9uKSB7XG4gICAgICAgICAgICBzdGVwTWFuYWdlci5lZGl0U3RlcERlc2NyaXB0aW9uKFxuICAgICAgICAgICAgICBwcm9qZWN0SW5kZXgsXG4gICAgICAgICAgICAgIHRhc2tJbmRleCxcbiAgICAgICAgICAgICAgaSxcbiAgICAgICAgICAgICAgZWRpdGVkU3RlcHNbaV0uZGVzY3JpcHRpb24sXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZWRpdGVkU3RlcHNbaV0uc3RhdHVzICE9PSBvbGRTdGVwc1tpXS5zdGF0dXMpIHtcbiAgICAgICAgICAgIHN0ZXBNYW5hZ2VyLmVkaXRTdGVwU3RhdHVzKFxuICAgICAgICAgICAgICBwcm9qZWN0SW5kZXgsXG4gICAgICAgICAgICAgIHRhc2tJbmRleCxcbiAgICAgICAgICAgICAgaSxcbiAgICAgICAgICAgICAgZWRpdGVkU3RlcHNbaV0uc3RhdHVzLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9sZFN0ZXBzLmxlbmd0aCA+IGVkaXRlZFN0ZXBzLmxlbmd0aCkge1xuICAgICAgICAgIGxldCBpID0gb2xkU3RlcHMubGVuZ3RoIC0gMTtcbiAgICAgICAgICB3aGlsZSAoaSA+PSBlZGl0ZWRTdGVwcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHN0ZXBNYW5hZ2VyLmRlbGV0ZVN0ZXAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgsIGkpO1xuICAgICAgICAgICAgaS0tO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChvbGRTdGVwcy5sZW5ndGggPCBlZGl0ZWRTdGVwcy5sZW5ndGgpIHtcbiAgICAgICAgICBmb3IgKGxldCBpID0gb2xkU3RlcHMubGVuZ3RoOyBpIDwgZWRpdGVkU3RlcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHN0ZXBNYW5hZ2VyLmNyZWF0ZU5ld1N0ZXAoXG4gICAgICAgICAgICAgIHByb2plY3RJbmRleCxcbiAgICAgICAgICAgICAgdGFza0luZGV4LFxuICAgICAgICAgICAgICBlZGl0ZWRTdGVwc1tpXS5kZXNjcmlwdGlvbixcbiAgICAgICAgICAgICAgZWRpdGVkU3RlcHNbaV0uc3RhdHVzLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAob2xkU3RlcHMubGVuZ3RoID09PSAwICYmIGVkaXRlZFN0ZXBzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZWRpdGVkU3RlcHMuZm9yRWFjaCgoc3RlcCkgPT4ge1xuICAgICAgICAgIHN0ZXBNYW5hZ2VyLmNyZWF0ZU5ld1N0ZXAoXG4gICAgICAgICAgICBwcm9qZWN0SW5kZXgsXG4gICAgICAgICAgICB0YXNrSW5kZXgsXG4gICAgICAgICAgICBzdGVwLmRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgc3RlcC5zdGF0dXMsXG4gICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKG9sZFN0ZXBzLmxlbmd0aCA+IDAgJiYgZWRpdGVkU3RlcHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGxldCBpID0gb2xkU3RlcHMubGVuZ3RoIC0gMTtcbiAgICAgICAgd2hpbGUgKGkgPj0gMCkge1xuICAgICAgICAgIHN0ZXBNYW5hZ2VyLmRlbGV0ZVN0ZXAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgsIGkpO1xuICAgICAgICAgIGktLTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbWFpbi5yZW5kZXJUYXNrQ29udGVudChwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCk7XG4gICAgICBhbGxNb2RhbHMuY2xvc2VNb2RhbChtb2RhbCk7XG4gICAgfVxuICB9O1xuXG4gIC8qIEZ1bmN0aW9uIHRvIGludm9rZSBvbiBpbml0aWxpc2UsIGZvciB0aGUgY29tcG9uZW50IHRvIHdvcmsgcHJvcGVybHkgKi9cbiAgY29uc3QgYWRkRWRpdEJ0bkxpc3RlbmVyID0gKCkgPT4ge1xuICAgIGVkaXRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4gZWRpdFRhc2soZSkpO1xuICB9O1xuXG4gIHJldHVybiB7IG9wZW5FZGl0VGFza01vZGFsLCBhZGRFZGl0QnRuTGlzdGVuZXIgfTtcbn0pKCk7XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4tICdEZWxldGUgdGFzaycgbW9kYWwgbW9kdWxlXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuY29uc3QgZGVsZXRlVGFza01vZGFsID0gKCgpID0+IHtcbiAgY29uc3QgbW9kYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZGVsZXRlLXRhc2stbW9kYWwnKS5wYXJlbnRFbGVtZW50O1xuICBjb25zdCBjYW5jZWxCdG4gPSBtb2RhbC5xdWVyeVNlbGVjdG9yKCcuY2FuY2VsLWJ1dHRvbicpO1xuICBjb25zdCBkZWxldGVCdG4gPSBtb2RhbC5xdWVyeVNlbGVjdG9yKCcuZGVsZXRlLWJ1dHRvbicpO1xuXG4gIGNvbnN0IHNldFByb2plY3REYXRhSW5kZXggPSAocHJvamVjdEluZGV4KSA9PiB7XG4gICAgZGVsZXRlQnRuLmRhdGFzZXQucHJvamVjdEluZGV4ID0gcHJvamVjdEluZGV4O1xuICB9O1xuXG4gIGNvbnN0IHNldFRhc2tEYXRhSW5kZXggPSAodGFza0luZGV4KSA9PiB7XG4gICAgZGVsZXRlQnRuLmRhdGFzZXQudGFza0luZGV4ID0gdGFza0luZGV4O1xuICB9O1xuXG4gIGNvbnN0IG9wZW5EZWxldGVNb2RhbCA9IChwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCkgPT4ge1xuICAgIHNldFByb2plY3REYXRhSW5kZXgocHJvamVjdEluZGV4KTtcbiAgICBzZXRUYXNrRGF0YUluZGV4KHRhc2tJbmRleCk7XG4gICAgdG9nZ2xlSGlkZGVuKG1vZGFsKTtcbiAgfTtcblxuICBjb25zdCBkZWxldGVUYXNrID0gKCkgPT4ge1xuICAgIGNvbnN0IHByb2plY3RJbmRleCA9IE51bWJlcihkZWxldGVCdG4uZGF0YXNldC5wcm9qZWN0SW5kZXgpO1xuICAgIGNvbnN0IHRhc2tJbmRleCA9IE51bWJlcihkZWxldGVCdG4uZGF0YXNldC50YXNrSW5kZXgpO1xuICAgIHRhc2tNYW5hZ2VyLmRlbGV0ZVRhc2socHJvamVjdEluZGV4LCB0YXNrSW5kZXgpO1xuICAgIG1haW4ucmVuZGVyRGVsZXRlZFRhc2sodGFza0luZGV4KTtcbiAgICB0b2dnbGVIaWRkZW4obW9kYWwpO1xuICB9O1xuXG4gIC8qIEZ1bmN0aW9ucyB0byBpbnZva2Ugb24gaW5pdGlsaXNlLCBmb3IgdGhlIGNvbXBvbmVudCB0byB3b3JrIHByb3Blcmx5ICovXG4gIGNvbnN0IGFkZENhbmNlbEJ0bkxpc3RlbmVyID0gKCkgPT4ge1xuICAgIGNhbmNlbEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHRvZ2dsZUhpZGRlbihtb2RhbCkpO1xuICB9O1xuXG4gIGNvbnN0IGFkZERlbGV0ZUJ0bkxpc3RlbmVyID0gKCkgPT4ge1xuICAgIGRlbGV0ZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGRlbGV0ZVRhc2spO1xuICB9O1xuICByZXR1cm4geyBvcGVuRGVsZXRlTW9kYWwsIGFkZENhbmNlbEJ0bkxpc3RlbmVyLCBhZGREZWxldGVCdG5MaXN0ZW5lciB9O1xufSkoKTtcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi0gU3RlcHMgY29tcG9uZW50IG1vZHVsZVxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbmNvbnN0IHN0ZXBzQ29tcG9uZW50ID0gKCgpID0+IHtcbiAgLyogVmFyaWFibGVzIGZvciB0aGUgJ05ldyB0YXNrJyBtb2RhbCAqL1xuICBjb25zdCBtb2RhbE5ldyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uZXctdGFzay1tb2RhbCcpLnBhcmVudEVsZW1lbnQ7XG4gIGNvbnN0IHN0ZXBzTGlzdE5ldyA9IG1vZGFsTmV3LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbC1zdGVwcy1saXN0Jyk7XG4gIGNvbnN0IGFkZFN0ZXBCdG5OZXcgPSBtb2RhbE5ldy5xdWVyeVNlbGVjdG9yKCcuYWRkLXN0ZXAtYnV0dG9uJyk7XG4gIC8qIFZhcmlhYmxlcyBmb3IgdGhlICdFZGl0IHRhc2snIG1vZGFsICovXG4gIGNvbnN0IG1vZGFsRWRpdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5lZGl0LXRhc2stbW9kYWwnKS5wYXJlbnRFbGVtZW50O1xuICBjb25zdCBzdGVwc0xpc3RFZGl0ID0gbW9kYWxFZGl0LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbC1zdGVwcy1saXN0Jyk7XG4gIGNvbnN0IGFkZFN0ZXBCdG5FZGl0ID0gbW9kYWxFZGl0LnF1ZXJ5U2VsZWN0b3IoJy5hZGQtc3RlcC1idXR0b24nKTtcblxuICBjb25zdCBzdGVwcyA9IFtdO1xuXG4gIGNvbnN0IGNsZWFyQWxsU3RlcHMgPSAodWwpID0+IHtcbiAgICBjb25zdCB1bFRvQ2xlYXIgPSB1bDtcbiAgICBzdGVwcy5sZW5ndGggPSAwO1xuICAgIHVsVG9DbGVhci5pbm5lckhUTUwgPSAnJztcbiAgfTtcblxuICBjb25zdCByZXZlYWxTdGVwcyA9ICgpID0+IHN0ZXBzO1xuXG4gIGNvbnN0IHJlbmRlclN0ZXAgPSAobGlzdEl0ZW0sIHN0ZXAsIGluZGV4LCBzdGVwc0xpc3QpID0+IHtcbiAgICBjb25zdCBjaGVja2JveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgY29uc3QgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICAgIGNvbnN0IGVkaXRTdGVwQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgY29uc3QgZWRpdFN0ZXBJbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICBjb25zdCBkZWxldGVTdGVwQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgY29uc3QgZGVsZXRlU3RlcEltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuXG4gICAgY2hlY2tib3guc2V0QXR0cmlidXRlKCd0eXBlJywgJ2NoZWNrYm94Jyk7XG4gICAgY2hlY2tib3guc2V0QXR0cmlidXRlKCduYW1lJywgYHN0ZXAtc3RhdHVzLSR7aW5kZXh9YCk7XG4gICAgY2hlY2tib3guc2V0QXR0cmlidXRlKCdpZCcsIGBzdGVwLXN0YXR1cy0ke2luZGV4fWApO1xuICAgIGNoZWNrYm94LmRhdGFzZXQuc3RlcEluZGV4ID0gaW5kZXg7XG4gICAgaWYgKHN0ZXAuc3RhdHVzID09PSAnZG9uZScpIHtcbiAgICAgIGNoZWNrYm94LmNoZWNrZWQgPSB0cnVlO1xuICAgIH1cbiAgICBsYWJlbC5zZXRBdHRyaWJ1dGUoJ2ZvcicsIGBzdGVwLXN0YXR1cy0ke2luZGV4fWApO1xuICAgIGxhYmVsLnRleHRDb250ZW50ID0gc3RlcC5kZXNjcmlwdGlvbjtcbiAgICBlZGl0U3RlcEJ0bi5jbGFzc0xpc3QuYWRkKCdzdGVwcy1saXN0LWl0ZW0tYnV0dG9uJyk7XG4gICAgZWRpdFN0ZXBCdG4uZGF0YXNldC5zdGVwSW5kZXggPSBpbmRleDtcbiAgICBlZGl0U3RlcEltZy5zZXRBdHRyaWJ1dGUoJ3NyYycsICcuL2ljb25zL2VkaXQuc3ZnJyk7XG4gICAgZWRpdFN0ZXBJbWcuc2V0QXR0cmlidXRlKCdhbHQnLCAnZWRpdCBzdGVwIGJ1dHRvbicpO1xuICAgIGRlbGV0ZVN0ZXBCdG4uY2xhc3NMaXN0LmFkZCgnc3RlcHMtbGlzdC1pdGVtLWJ1dHRvbicpO1xuICAgIGRlbGV0ZVN0ZXBCdG4uZGF0YXNldC5zdGVwSW5kZXggPSBpbmRleDtcbiAgICBkZWxldGVTdGVwSW1nLnNldEF0dHJpYnV0ZSgnc3JjJywgJy4vaWNvbnMvZGVsZXRlLnN2ZycpO1xuICAgIGRlbGV0ZVN0ZXBJbWcuc2V0QXR0cmlidXRlKCdhbHQnLCAnZGVsZXRlIHN0ZXAgYnV0dG9uJyk7XG5cbiAgICBjaGVja2JveC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoKSA9PlxuICAgICAgdXBkYXRlU3RlcFN0YXR1cyhjaGVja2JveC5jaGVja2VkLCBOdW1iZXIoY2hlY2tib3guZGF0YXNldC5zdGVwSW5kZXgpKSxcbiAgICApO1xuICAgIGVkaXRTdGVwQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2KSA9PlxuICAgICAgcmVuZGVyRWRpdFN0ZXAoZXYsIGVkaXRTdGVwQnRuLmRhdGFzZXQuc3RlcEluZGV4LCBzdGVwc0xpc3QpLFxuICAgICk7XG4gICAgZGVsZXRlU3RlcEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldikgPT5cbiAgICAgIGRlbGV0ZVN0ZXAoZXYsIGRlbGV0ZVN0ZXBCdG4uZGF0YXNldC5zdGVwSW5kZXgsIHN0ZXBzTGlzdCksXG4gICAgKTtcblxuICAgIGxpc3RJdGVtLmFwcGVuZENoaWxkKGNoZWNrYm94KTtcbiAgICBsaXN0SXRlbS5hcHBlbmRDaGlsZChsYWJlbCk7XG4gICAgbGlzdEl0ZW0uYXBwZW5kQ2hpbGQoZWRpdFN0ZXBCdG4pO1xuICAgIGVkaXRTdGVwQnRuLmFwcGVuZENoaWxkKGVkaXRTdGVwSW1nKTtcbiAgICBsaXN0SXRlbS5hcHBlbmRDaGlsZChkZWxldGVTdGVwQnRuKTtcbiAgICBkZWxldGVTdGVwQnRuLmFwcGVuZENoaWxkKGRlbGV0ZVN0ZXBJbWcpO1xuICB9O1xuXG4gIGNvbnN0IHVwZGF0ZVN0ZXBJZGljZXMgPSAoc3RlcHNMaXN0KSA9PiB7XG4gICAgY29uc3QgYWxsU3RlcHMgPSBzdGVwc0xpc3QuY2hpbGRyZW47XG4gICAgbGV0IGluZGV4ID0gMDtcbiAgICBmb3IgKGNvbnN0IGxpc3RJdGVtIG9mIGFsbFN0ZXBzKSB7XG4gICAgICBjb25zdCBjaGVja2JveCA9IGxpc3RJdGVtLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0Jyk7XG4gICAgICBjb25zdCBsYWJlbCA9IGxpc3RJdGVtLnF1ZXJ5U2VsZWN0b3IoJ2xhYmVsJyk7XG4gICAgICBjb25zdCBidXR0b25zID0gbGlzdEl0ZW0ucXVlcnlTZWxlY3RvckFsbCgnLnN0ZXBzLWxpc3QtaXRlbS1idXR0b24nKTtcblxuICAgICAgY2hlY2tib3guc2V0QXR0cmlidXRlKCduYW1lJywgYHN0ZXAtc3RhdHVzLSR7aW5kZXh9YCk7XG4gICAgICBjaGVja2JveC5zZXRBdHRyaWJ1dGUoJ2lkJywgYHN0ZXAtc3RhdHVzLSR7aW5kZXh9YCk7XG4gICAgICBjaGVja2JveC5kYXRhc2V0LnN0ZXBJbmRleCA9IGluZGV4O1xuICAgICAgbGFiZWwuc2V0QXR0cmlidXRlKCdmb3InLCBgc3RlcC1zdGF0dXMtJHtpbmRleH1gKTtcbiAgICAgIGJ1dHRvbnMuZm9yRWFjaCgoYnV0dG9uKSA9PiB7XG4gICAgICAgIGJ1dHRvbi5kYXRhc2V0LnN0ZXBJbmRleCA9IGluZGV4O1xuICAgICAgfSk7XG4gICAgICBpbmRleCArPSAxO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCB1cGRhdGVTdGVwU3RhdHVzID0gKG5ld1N0YXR1cywgaW5kZXgpID0+IHtcbiAgICBpZiAobmV3U3RhdHVzID09PSB0cnVlKSB7XG4gICAgICBzdGVwc1tpbmRleF0uc3RhdHVzID0gJ2RvbmUnO1xuICAgIH0gZWxzZSBpZiAobmV3U3RhdHVzID09PSBmYWxzZSkge1xuICAgICAgc3RlcHNbaW5kZXhdLnN0YXR1cyA9ICd0byBkbyc7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGVkaXRTdGVwID0gKGUsIHN0ZXBJbmRleCwgZWRpdGVkU3RlcFZhbHVlLCBzdGVwc0xpc3QpID0+IHtcbiAgICBjb25zdCBzdGVwVG9FZGl0ID0gZS50YXJnZXQuY2xvc2VzdCgnbGknKTtcbiAgICBjb25zdCBpbnB1dCA9IHN0ZXBUb0VkaXQucXVlcnlTZWxlY3RvcignaW5wdXQnKTtcbiAgICBjb25zdCBzdWJtaXRTdGVwQnRuID0gaW5wdXQubmV4dEVsZW1lbnRTaWJsaW5nO1xuXG4gICAgaWYgKGVkaXRlZFN0ZXBWYWx1ZSAhPT0gJycpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBzdGVwc1tzdGVwSW5kZXhdLmRlc2NyaXB0aW9uID0gZWRpdGVkU3RlcFZhbHVlO1xuICAgICAgaW5wdXQucmVtb3ZlKCk7XG4gICAgICBzdWJtaXRTdGVwQnRuLnJlbW92ZSgpO1xuICAgICAgcmVuZGVyU3RlcChzdGVwVG9FZGl0LCBzdGVwc1tzdGVwSW5kZXhdLCBzdGVwSW5kZXgsIHN0ZXBzTGlzdCk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IHJlbmRlckVkaXRTdGVwID0gKGV2LCBpbmRleCwgc3RlcHNMaXN0KSA9PiB7XG4gICAgY29uc3Qgc3RlcEluZGV4ID0gTnVtYmVyKGluZGV4KTtcbiAgICBjb25zdCBzdGVwVG9FZGl0ID0gZXYudGFyZ2V0LmNsb3Nlc3QoJ2xpJyk7XG4gICAgY29uc3QgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIGNvbnN0IHN1Ym1pdFN0ZXBCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBjb25zdCBzdWJtaXRJbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcblxuICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgc3RlcFRvRWRpdC5pbm5lckhUTUwgPSAnJztcblxuICAgIGlucHV0LnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0Jyk7XG4gICAgaW5wdXQuc2V0QXR0cmlidXRlKCduYW1lJywgJ21vZGFsLWVkaXQtc3RlcCcpO1xuICAgIGlucHV0LnNldEF0dHJpYnV0ZSgnaWQnLCAnbW9kYWwtZWRpdC1zdGVwJyk7XG4gICAgaW5wdXQucmVxdWlyZWQgPSB0cnVlO1xuICAgIGlucHV0LnZhbHVlID0gc3RlcHNbc3RlcEluZGV4XS5kZXNjcmlwdGlvbjtcbiAgICBzdWJtaXRTdGVwQnRuLnRleHRDb250ZW50ID0gJ0FsdGVyIHN0ZXAnO1xuICAgIHN1Ym1pdEltZy5zZXRBdHRyaWJ1dGUoJ3NyYycsICcuL2ljb25zL2NvbmZpcm0uc3ZnJyk7XG4gICAgc3VibWl0SW1nLnNldEF0dHJpYnV0ZSgnYWx0JywgJ2NvbmZpcm0gZWRpdCBidXR0b24nKTtcblxuICAgIHN0ZXBUb0VkaXQuYXBwZW5kQ2hpbGQoaW5wdXQpO1xuICAgIHN0ZXBUb0VkaXQuYXBwZW5kQ2hpbGQoc3VibWl0U3RlcEJ0bik7XG4gICAgc3VibWl0U3RlcEJ0bi5hcHBlbmRDaGlsZChzdWJtaXRJbWcpO1xuXG4gICAgc3VibWl0U3RlcEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PlxuICAgICAgZWRpdFN0ZXAoZSwgc3RlcEluZGV4LCBpbnB1dC52YWx1ZSwgc3RlcHNMaXN0KSxcbiAgICApO1xuICB9O1xuXG4gIGNvbnN0IGRlbGV0ZVN0ZXAgPSAoZXYsIGluZGV4LCBzdGVwc0xpc3QpID0+IHtcbiAgICBjb25zdCBzdGVwSW5kZXggPSBOdW1iZXIoaW5kZXgpO1xuICAgIGNvbnN0IHN0ZXBUb0RlbGV0ZSA9IGV2LnRhcmdldC5jbG9zZXN0KCdsaScpO1xuXG4gICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBzdGVwcy5zcGxpY2Uoc3RlcEluZGV4LCAxKTtcbiAgICBzdGVwVG9EZWxldGUucmVtb3ZlKCk7XG4gICAgdXBkYXRlU3RlcElkaWNlcyhzdGVwc0xpc3QpO1xuICB9O1xuXG4gIGNvbnN0IG1ha2VTdGVwID0gKHN0ZXAsIHN0ZXBzTGlzdCkgPT4ge1xuICAgIGNvbnN0IGxpc3RJdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcblxuICAgIHN0ZXBzLnB1c2goc3RlcCk7XG4gICAgc3RlcHNMaXN0LmFwcGVuZENoaWxkKGxpc3RJdGVtKTtcbiAgICByZW5kZXJTdGVwKGxpc3RJdGVtLCBzdGVwc1tzdGVwcy5sZW5ndGggLSAxXSwgc3RlcHMubGVuZ3RoIC0gMSwgc3RlcHNMaXN0KTtcbiAgfTtcblxuICBjb25zdCBhZGROZXdTdGVwID0gKGV2dCwgc3RlcHNMaXN0LCBuZXdTdGVwQnRuKSA9PiB7XG4gICAgY29uc3QgbmV3U3RlcERlc2NyaXB0aW9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGFsLWFkZC1zdGVwJyk7XG4gICAgY29uc3Qgc3RlcENyZWF0b3IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kYWwtYWRkLXN0ZXAnKS5wYXJlbnRFbGVtZW50O1xuXG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGlmIChuZXdTdGVwRGVzY3JpcHRpb24udmFsdWUgIT09ICcnKSB7XG4gICAgICBjb25zdCBzdGVwID0ge1xuICAgICAgICBkZXNjcmlwdGlvbjogbmV3U3RlcERlc2NyaXB0aW9uLnZhbHVlLFxuICAgICAgICBzdGF0dXM6ICd0byBkbycsXG4gICAgICB9O1xuICAgICAgbWFrZVN0ZXAoc3RlcCwgc3RlcHNMaXN0KTtcbiAgICB9XG4gICAgdG9nZ2xlSGlkZGVuKG5ld1N0ZXBCdG4pO1xuICAgIHN0ZXBDcmVhdG9yLnJlbW92ZSgpO1xuICB9O1xuXG4gIGNvbnN0IHJlbmRlckNyZWF0ZVN0ZXAgPSAoZSwgc3RlcHNMaXN0LCBuZXdTdGVwQnRuKSA9PiB7XG4gICAgY29uc3QgbGlzdEl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICBjb25zdCBzdWJtaXRTdGVwQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgY29uc3Qgc3VibWl0SW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG5cbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgaW5wdXQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQnKTtcbiAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoJ25hbWUnLCAnbW9kYWwtYWRkLXN0ZXAnKTtcbiAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoJ2lkJywgJ21vZGFsLWFkZC1zdGVwJyk7XG4gICAgc3VibWl0U3RlcEJ0bi50ZXh0Q29udGVudCA9ICdBZGQgc3RlcCc7XG4gICAgc3VibWl0SW1nLnNldEF0dHJpYnV0ZSgnc3JjJywgJy4vaWNvbnMvY29uZmlybS5zdmcnKTtcbiAgICBzdWJtaXRJbWcuc2V0QXR0cmlidXRlKCdhbHQnLCAnY29uZmlybSBzdGVwIGJ1dHRvbicpO1xuXG4gICAgc3VibWl0U3RlcEJ0bi5hcHBlbmRDaGlsZChzdWJtaXRJbWcpO1xuICAgIGxpc3RJdGVtLmFwcGVuZENoaWxkKGlucHV0KTtcbiAgICBsaXN0SXRlbS5hcHBlbmRDaGlsZChzdWJtaXRTdGVwQnRuKTtcbiAgICBzdGVwc0xpc3QuYXBwZW5kQ2hpbGQobGlzdEl0ZW0pO1xuXG4gICAgc3VibWl0U3RlcEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldnQpID0+XG4gICAgICBhZGROZXdTdGVwKGV2dCwgc3RlcHNMaXN0LCBuZXdTdGVwQnRuKSxcbiAgICApO1xuICAgIHRvZ2dsZUhpZGRlbihuZXdTdGVwQnRuKTtcbiAgfTtcblxuICAvKiBGdW5jdGlvbiB0byBpbnZva2Ugb24gaW5pdGlsaXNlLCBmb3IgdGhlIGNvbXBvbmVudCB0byB3b3JrIHByb3Blcmx5ICovXG4gIGNvbnN0IGFkZE5ld1N0ZXBCdG5MaXN0ZW5lcnMgPSAoKSA9PiB7XG4gICAgYWRkU3RlcEJ0bk5ldy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PlxuICAgICAgcmVuZGVyQ3JlYXRlU3RlcChlLCBzdGVwc0xpc3ROZXcsIGFkZFN0ZXBCdG5OZXcpLFxuICAgICk7XG4gICAgYWRkU3RlcEJ0bkVkaXQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT5cbiAgICAgIHJlbmRlckNyZWF0ZVN0ZXAoZSwgc3RlcHNMaXN0RWRpdCwgYWRkU3RlcEJ0bkVkaXQpLFxuICAgICk7XG4gIH07XG5cbiAgcmV0dXJuIHsgY2xlYXJBbGxTdGVwcywgcmV2ZWFsU3RlcHMsIG1ha2VTdGVwLCBhZGROZXdTdGVwQnRuTGlzdGVuZXJzIH07XG59KSgpO1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLSBJbml0aWFsaXNlciBmdW5jdGlvblxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbmNvbnN0IGluaXRpYWxpc2VVSSA9ICgpID0+IHtcbiAgaGVhZGVyLmFkZEhlYWRlckxpc3RlbmVycygpO1xuXG4gIG5hdmJhci5pbml0KCk7XG5cbiAgbWFpbi5pbml0KCk7XG5cbiAgYWxsTW9kYWxzLmFkZENsb3NlQnRuTGlzdGVuZXJzKCk7XG4gIGFsbE1vZGFscy5hZGRDbG9zZUJhY2tncm91bmRMaXN0ZW5lcnMoKTtcblxuICBuZXdMaXN0TW9kYWwuYWRkU3VibWl0QnRuTGlzdGVuZXIoKTtcbiAgZWRpdExpc3RNb2RhbC5hZGRFZGl0QnRuTGlzdGVuZXIoKTtcbiAgZGVsZXRlTGlzdE1vZGFsLmFkZENhbmNlbEJ0bkxpc3RlbmVyKCk7XG4gIGRlbGV0ZUxpc3RNb2RhbC5hZGREZWxldGVCdG5MaXN0ZW5lcigpO1xuICBuZXdUYXNrTW9kYWwuYWRkTmV3VGFza0J0bkxJc3RlbmVyKCk7XG4gIGVkaXRUYXNrTW9kYWwuYWRkRWRpdEJ0bkxpc3RlbmVyKCk7XG4gIGRlbGV0ZVRhc2tNb2RhbC5hZGRDYW5jZWxCdG5MaXN0ZW5lcigpO1xuICBkZWxldGVUYXNrTW9kYWwuYWRkRGVsZXRlQnRuTGlzdGVuZXIoKTtcblxuICBzdGVwc0NvbXBvbmVudC5hZGROZXdTdGVwQnRuTGlzdGVuZXJzKCk7XG5cbiAgYXNpZGUuYWRkU2VhcmNoYmFyTElzdGVuZXIoKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGluaXRpYWxpc2VVSTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgcHJvamVjdE1hbmFnZXIgfSBmcm9tICcuL3RvRG9MaXN0JztcbmltcG9ydCBpbml0aWFsaXNlVUkgZnJvbSAnLi91aSc7XG5cbnByb2plY3RNYW5hZ2VyLmluaXRpYWxpc2UoKTtcbmluaXRpYWxpc2VVSSgpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9