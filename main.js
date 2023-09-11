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
  const mainFinished = document.querySelector('.finished-tasks');
  const searchbar = document.getElementById('search-tasks');
  const orderOptions = document.getElementById('order-options');
  const priorityFilter = document.getElementById('filter-priority-options');
  const statusFilter = document.getElementById('filter-status-options');

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
      main.renderMain(currentProject, index);
    }
  };

  const sortAToZ = () => {
    const tasksToDo = Array.from(mainTasks.querySelectorAll('.task-row'));
    const tasksDone = Array.from(mainFinished.querySelectorAll('.task-row'));
    tasksToDo.sort((a, b) => {
      const aTitle = a.querySelector('label');
      const bTitle = b.querySelector('label');
      if (aTitle.textContent.toLowerCase() < bTitle.textContent.toLowerCase()) {
        mainTasks.insertBefore(a, b);
        return -1;
      }
      if (aTitle.textContent.toLowerCase() > bTitle.textContent.toLowerCase()) {
        mainTasks.insertBefore(b, a);
        return 1;
      }
      return 0;
    });
    tasksDone.sort((a, b) => {
      const aTitle = a.querySelector('label');
      const bTitle = b.querySelector('label');
      if (aTitle.textContent.toLowerCase() < bTitle.textContent.toLowerCase()) {
        mainFinished.insertBefore(a, b);
        return -1;
      }
      if (aTitle.textContent.toLowerCase() > bTitle.textContent.toLowerCase()) {
        mainFinished.insertBefore(b, a);
        return 1;
      }
      return 0;
    });
  };

  const sortZToA = () => {
    const tasksToDo = Array.from(mainTasks.querySelectorAll('.task-row'));
    const tasksDone = Array.from(mainFinished.querySelectorAll('.task-row'));
    tasksToDo.sort((a, b) => {
      const aTitle = a.querySelector('label');
      const bTitle = b.querySelector('label');
      if (aTitle.textContent.toLowerCase() > bTitle.textContent.toLowerCase()) {
        mainTasks.insertBefore(a, b);
        return -1;
      }
      if (aTitle.textContent.toLowerCase() < bTitle.textContent.toLowerCase()) {
        mainTasks.insertBefore(b, a);
        return 1;
      }
      return 0;
    });
    tasksDone.sort((a, b) => {
      const aTitle = a.querySelector('label');
      const bTitle = b.querySelector('label');
      if (aTitle.textContent.toLowerCase() > bTitle.textContent.toLowerCase()) {
        mainFinished.insertBefore(a, b);
        return -1;
      }
      if (aTitle.textContent.toLowerCase() < bTitle.textContent.toLowerCase()) {
        mainFinished.insertBefore(b, a);
        return 1;
      }
      return 0;
    });
  };

  const filterPriority = (task, priorityLevel, projectIndex, taskIndex) => {
    if (task.priority === priorityLevel) {
      main.renderTask(projectIndex, taskIndex);
      if (task.status === 'done') {
        const renderedTask = mainFinished.querySelector(
          `.task-row[data-task-index='${taskIndex}']`,
        );
        mainFinished.appendChild(renderedTask);
      }
      return true;
    }
    return false;
  };

  const orderTasks = () => {
    const index = Number(
      document.getElementById('main-new-task-button').dataset.projectIndex,
    );
    const currentProject = _toDoList__WEBPACK_IMPORTED_MODULE_0__.projectManager.revealProject(index);

    switch (orderOptions.value) {
      case 'priority-highest':
        main.clearTasks();
        currentProject.tasks.filter((task) =>
          filterPriority(
            task,
            'high',
            index,
            currentProject.tasks.indexOf(task),
          ),
        );
        currentProject.tasks.filter((task) =>
          filterPriority(
            task,
            'medium',
            index,
            currentProject.tasks.indexOf(task),
          ),
        );
        currentProject.tasks.filter((task) =>
          filterPriority(
            task,
            'low',
            index,
            currentProject.tasks.indexOf(task),
          ),
        );
        currentProject.tasks.filter((task) =>
          filterPriority(
            task,
            'none',
            index,
            currentProject.tasks.indexOf(task),
          ),
        );
        break;
      case 'priority-lowest':
        main.clearTasks();
        currentProject.tasks.filter((task) =>
          filterPriority(
            task,
            'none',
            index,
            currentProject.tasks.indexOf(task),
          ),
        );
        currentProject.tasks.filter((task) =>
          filterPriority(
            task,
            'low',
            index,
            currentProject.tasks.indexOf(task),
          ),
        );
        currentProject.tasks.filter((task) =>
          filterPriority(
            task,
            'medium',
            index,
            currentProject.tasks.indexOf(task),
          ),
        );
        currentProject.tasks.filter((task) =>
          filterPriority(
            task,
            'high',
            index,
            currentProject.tasks.indexOf(task),
          ),
        );
        break;
      case 'A-Z':
        sortAToZ();
        break;
      case 'Z-A':
        sortZToA();
        break;
      default:
        main.renderMain(currentProject, index);
        break;
    }
  };

  const filterPriorityOptions = () => {
    const index = Number(
      document.getElementById('main-new-task-button').dataset.projectIndex,
    );
    const currentProject = _toDoList__WEBPACK_IMPORTED_MODULE_0__.projectManager.revealProject(index);

    switch (priorityFilter.value) {
      case 'high':
        main.clearTasks();
        currentProject.tasks.filter((task) =>
          filterPriority(
            task,
            'high',
            index,
            currentProject.tasks.indexOf(task),
          ),
        );
        break;
      case 'medium':
        main.clearTasks();
        currentProject.tasks.filter((task) =>
          filterPriority(
            task,
            'medium',
            index,
            currentProject.tasks.indexOf(task),
          ),
        );
        break;
      case 'low':
        main.clearTasks();
        currentProject.tasks.filter((task) =>
          filterPriority(
            task,
            'low',
            index,
            currentProject.tasks.indexOf(task),
          ),
        );
        break;
      case 'none':
        main.clearTasks();
        currentProject.tasks.filter((task) =>
          filterPriority(
            task,
            'none',
            index,
            currentProject.tasks.indexOf(task),
          ),
        );
        break;
      default:
        main.renderMain(currentProject, index);
        break;
    }
  };

  const filterStatus = (task, taskStatus, projectIndex, taskIndex) => {
    if (task.status === taskStatus) {
      main.renderTask(projectIndex, taskIndex);
      /* if (task.status === 'done') {
        const renderedTask = mainFinished.querySelector(
          `.task-row[data-task-index='${taskIndex}']`,
        );
        mainFinished.appendChild(renderedTask);
      } */
      return true;
    }
    return false;
  };

  const filterStatusOptions = () => {
    const index = Number(
      document.getElementById('main-new-task-button').dataset.projectIndex,
    );
    const currentProject = _toDoList__WEBPACK_IMPORTED_MODULE_0__.projectManager.revealProject(index);

    switch (statusFilter.value) {
      case 'to-do':
        main.clearTasks();
        currentProject.tasks.filter((task) =>
          filterStatus(
            task,
            'to do',
            index,
            currentProject.tasks.indexOf(task),
          ),
        );
        break;
      case 'done':
        main.clearTasks();
        currentProject.tasks.filter((task) =>
          filterStatus(task, 'done', index, currentProject.tasks.indexOf(task)),
        );
        break;
      default:
        main.renderMain(currentProject, index);
        break;
    }
  };

  const addSearchbarLIstener = () => {
    searchbar.addEventListener('keyup', searchForMatch);
  };

  const addOrderOptionsListener = () => {
    orderOptions.addEventListener('change', orderTasks);
  };

  const addPriorityFilterListener = () => {
    priorityFilter.addEventListener('change', filterPriorityOptions);
  };

  const addStatusFilterListener = () => {
    statusFilter.addEventListener('change', filterStatusOptions);
  };

  /* Function to invoke on initilise, for the component to work properly */
  const init = () => {
    addSearchbarLIstener();
    addOrderOptionsListener();
    addPriorityFilterListener();
    addStatusFilterListener();
  };

  return { init };
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

  aside.init();

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsV0FBVztBQUNYLENBQUM7O0FBRUQsaUVBQWUsY0FBYyxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNuQjlCOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDdUM7O0FBRXZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEVBQUUsZ0RBQWM7QUFDaEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwyQkFBMkIsZ0RBQWM7QUFDekM7QUFDQTtBQUNBLE1BQU07QUFDTixzQkFBc0IsMkJBQTJCO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFbUQ7Ozs7Ozs7Ozs7Ozs7Ozs7QUNoV3BEOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ3NFOztBQUV0RTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsV0FBVztBQUNYLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwwQkFBMEIsV0FBVztBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsUUFBUSxxREFBYztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw4QkFBOEIsVUFBVTtBQUN4QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsK0JBQStCLFVBQVU7QUFDekM7QUFDQTtBQUNBOztBQUVBO0FBQ0Esa0JBQWtCLHFEQUFjO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLHFEQUFjO0FBQ3BDLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBLDhCQUE4QixVQUFVO0FBQ3hDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsOEJBQThCLFVBQVU7QUFDeEM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFNLGtEQUFXO0FBQ2pCO0FBQ0EsTUFBTTtBQUNOLE1BQU0sa0RBQVc7QUFDakI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFNLGtEQUFXO0FBQ2pCLE1BQU07QUFDTixNQUFNLGtEQUFXO0FBQ2pCO0FBQ0E7O0FBRUE7QUFDQSxpQkFBaUIsa0RBQVc7QUFDNUI7QUFDQSw2Q0FBNkMsVUFBVTtBQUN2RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLGFBQWEsT0FBTyxVQUFVLE9BQU8sTUFBTTtBQUM3RDtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsYUFBYSxPQUFPLFVBQVUsT0FBTyxNQUFNO0FBQzdEO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixhQUFhLE9BQU8sVUFBVSxPQUFPLE1BQU07QUFDN0Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsYUFBYSxPQUFPLFVBQVU7QUFDOUM7QUFDQSwrQ0FBK0MsYUFBYSxPQUFPLFVBQVU7QUFDN0U7QUFDQTtBQUNBLDZDQUE2QyxhQUFhLE9BQU8sVUFBVTtBQUMzRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQSw4QkFBOEIsVUFBVTtBQUN4QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EseUJBQXlCLHFEQUFjO0FBQ3ZDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJEQUEyRDtBQUMzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIscURBQWM7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0MsVUFBVTtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQixxREFBYzs7QUFFekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIscURBQWM7O0FBRXpDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3QyxVQUFVO0FBQ2xEO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIscURBQWM7O0FBRXpDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFdBQVc7QUFDWCxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBLFdBQVc7QUFDWCxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxzQkFBc0IscURBQWM7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0IscURBQWM7O0FBRXBDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxXQUFXO0FBQ1gsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQixxREFBYzs7QUFFeEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFNLHFEQUFjO0FBQ3BCLE1BQU0scURBQWM7QUFDcEIsNEJBQTRCLHFEQUFjO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsV0FBVztBQUNYLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxJQUFJLHFEQUFjO0FBQ2xCO0FBQ0Esb0JBQW9CLHFEQUFjO0FBQ2xDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLFdBQVc7QUFDWCxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBTSxrREFBVztBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixxREFBYztBQUNuQztBQUNBLFFBQVEsa0RBQVc7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxXQUFXO0FBQ1gsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx1QkFBdUIsa0RBQVc7O0FBRWxDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCLGtEQUFXO0FBQ3BDO0FBQ0E7O0FBRUE7QUFDQSxNQUFNLGtEQUFXO0FBQ2pCLE1BQU0sa0RBQVc7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLGtEQUFXO0FBQ2pCLE1BQU0sa0RBQVc7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksa0RBQVc7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLGtEQUFXO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxrREFBVztBQUN2QjtBQUNBO0FBQ0EsVUFBVTtBQUNWLHdDQUF3Qyx3QkFBd0I7QUFDaEUsWUFBWSxrREFBVztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBLFVBQVUsa0RBQVc7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxRQUFRO0FBQ1I7QUFDQTtBQUNBLFVBQVUsa0RBQVc7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsV0FBVztBQUNYLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUksa0RBQVc7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpREFBaUQsTUFBTTtBQUN2RCwrQ0FBK0MsTUFBTTtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZDQUE2QyxNQUFNO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsbURBQW1ELE1BQU07QUFDekQsaURBQWlELE1BQU07QUFDdkQ7QUFDQSwrQ0FBK0MsTUFBTTtBQUNyRDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsV0FBVztBQUNYLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxpRUFBZSxZQUFZLEVBQUM7Ozs7Ozs7VUN4L0M1QjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7OztBQ040QztBQUNaOztBQUVoQyxxREFBYztBQUNkLCtDQUFZIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdG8tZG8tbGlzdC8uL3NyYy9zdG9yYWdlLmpzIiwid2VicGFjazovL3RvLWRvLWxpc3QvLi9zcmMvdG9Eb0xpc3QuanMiLCJ3ZWJwYWNrOi8vdG8tZG8tbGlzdC8uL3NyYy91aS5qcyIsIndlYnBhY2s6Ly90by1kby1saXN0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3RvLWRvLWxpc3Qvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3RvLWRvLWxpc3Qvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly90by1kby1saXN0L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdG8tZG8tbGlzdC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBzdG9yYWdlTWFuYWdlciA9ICgoKSA9PiB7XG4gIC8qIEluaXRpYWwgZnVuY3Rpb24gdG8gZ2V0IGFueXRoaW5nIHNhdmVkIGluIGxvY2FsU3RvcmFnZSAqL1xuICBjb25zdCBnZXRTdG9yYWdlID0gKCkgPT4ge1xuICAgIGxldCB0b0RvTGlzdCA9IFtdO1xuICAgIGlmIChsb2NhbFN0b3JhZ2UudG9Eb0xpc3QpIHtcbiAgICAgIHRvRG9MaXN0ID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndG9Eb0xpc3QnKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRvRG9MaXN0O1xuICB9O1xuXG4gIGNvbnN0IHNldFN0b3JhZ2UgPSAocHJvamVjdHMpID0+IHtcbiAgICBjb25zdCB0b0RvTGlzdCA9IEpTT04uc3RyaW5naWZ5KHByb2plY3RzKTtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndG9Eb0xpc3QnLCB0b0RvTGlzdCk7XG4gIH07XG5cbiAgcmV0dXJuIHsgZ2V0U3RvcmFnZSwgc2V0U3RvcmFnZSB9O1xufSkoKTtcblxuZXhwb3J0IGRlZmF1bHQgc3RvcmFnZU1hbmFnZXI7XG4iLCIvKiBDb250ZW50czpcblxuICAtIENvbnN0cnVjdG9ycyAtIFRhc2ssIFN0ZXAgJiBQcm9qZWN0XG5cbiAgLSBGdW5jdGlvbnMgdG8gZGVlcCBjbG9uZSBhcnJheXMgJiBvYmplY3RzLCAmIHVwZGF0ZSBsb2NhbCBzdG9yYWdlXG5cbiAgLSBQcm9qZWN0IE1hbmFnZXJcblxuICAtIFRhc2sgTWFuYWdlclxuXG4gIC0gU3RlcCBNYW5hZ2VyXG4qL1xuaW1wb3J0IHN0b3JhZ2VNYW5hZ2VyIGZyb20gJy4vc3RvcmFnZSc7XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4tIENvbnN0cnVjdG9ycyAtIFRhc2ssIFN0ZXAgJiBQcm9qZWN0XG4gIC0gU3RlcCBnb2VzIGluc2lkZSBUYXNrLnN0ZXBzW11cbiAgLSBUYXNrIGdvZXMgaW5zaWRlIFByb2plY3QudGFza3NbXVxuICAtIFByb2plY3QgZ29lcyBpbnNpZGUgcHJvamVjdHNbXVxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbmNsYXNzIFRhc2sge1xuICBjb25zdHJ1Y3Rvcih0aXRsZSwgZGVzY3JpcHRpb24sIGR1ZURhdGUsIHByaW9yaXR5LCBzdGF0dXMpIHtcbiAgICB0aGlzLnRpdGxlID0gdGl0bGU7XG4gICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xuICAgIHRoaXMuc3RlcHMgPSBbXTtcbiAgICB0aGlzLmR1ZURhdGUgPSBkdWVEYXRlO1xuICAgIHRoaXMucHJpb3JpdHkgPSBwcmlvcml0eTtcbiAgICB0aGlzLnN0YXR1cyA9IHN0YXR1cztcbiAgfVxufVxuXG5jbGFzcyBTdGVwIHtcbiAgY29uc3RydWN0b3IoZGVzY3JpcHRpb24sIHN0YXR1cykge1xuICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcbiAgICB0aGlzLnN0YXR1cyA9IHN0YXR1cztcbiAgfVxufVxuXG5jbGFzcyBQcm9qZWN0IHtcbiAgY29uc3RydWN0b3IodGl0bGUsIGRlc2NyaXB0aW9uKSB7XG4gICAgdGhpcy50aXRsZSA9IHRpdGxlO1xuICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcbiAgICB0aGlzLnRhc2tzID0gW107XG4gIH1cbn1cblxuY29uc3QgcHJvamVjdHMgPSBbXTtcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi0gRnVuY3Rpb25zIHRvIGRlZXAgY2xvbmUgYXJyYXlzICYgb2JqZWN0cywgJiB1cGRhdGUgbG9jYWwgc3RvcmFnZVxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbmNvbnN0IGRlZXBDb3B5QXJyYXkgPSAoYXJyYXkpID0+IHtcbiAgY29uc3QgYXJyYXlDb3B5ID0gW107XG4gIGFycmF5LmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShpdGVtKSkge1xuICAgICAgYXJyYXlDb3B5LnB1c2goZGVlcENvcHlBcnJheShpdGVtKSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgaXRlbSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGFycmF5Q29weS5wdXNoKGRlZXBDb3B5T2JqZWN0KGl0ZW0pKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXJyYXlDb3B5LnB1c2goaXRlbSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGFycmF5Q29weTtcbn07XG5cbmNvbnN0IGRlZXBDb3B5T2JqZWN0ID0gKG9iamVjdCkgPT4ge1xuICBjb25zdCBvYmplY3RDb3B5ID0ge307XG4gIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKG9iamVjdCkpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgIG9iamVjdENvcHlba2V5XSA9IGRlZXBDb3B5QXJyYXkodmFsdWUpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgICAgb2JqZWN0Q29weVtrZXldID0gZGVlcENvcHlPYmplY3QodmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvYmplY3RDb3B5W2tleV0gPSB2YWx1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG9iamVjdENvcHk7XG59O1xuXG5jb25zdCBzZXRTdG9yYWdlID0gKCkgPT4ge1xuICBjb25zdCBwcm9qZWN0c0NvcHkgPSBkZWVwQ29weUFycmF5KHByb2plY3RzKTtcbiAgc3RvcmFnZU1hbmFnZXIuc2V0U3RvcmFnZShwcm9qZWN0c0NvcHkpO1xufTtcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi0gUHJvamVjdCBNYW5hZ2VyXG4gIC0gQ3JlYXRlIGEgc2FmZSBjb3B5IG9mIGEgcHJvamVjdCAmIG9mIHRoZSBwcm9qZWN0cyBhcnJheSBmb3IgcHVibGljIHVzZVxuICAtIENyZWF0ZSAmIGRlbGV0ZSBwcm9qZWN0c1xuICAtIEVkaXQgcHJvamVjdCB0aXRsZXMgJiBkZXNjcmlwdGlvbnNcbiAgLSBJbml0aWFsaXNlIGJ5IGNoZWNraW5nIGZvciBsb2NhbGx5IHN0b3JlZCBwcm9qZWN0c1xuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbmNvbnN0IHByb2plY3RNYW5hZ2VyID0gKCgpID0+IHtcbiAgY29uc3QgcmV2ZWFsUHJvamVjdCA9IChwcm9qZWN0SW5kZXgpID0+IHtcbiAgICBjb25zdCBwcm9qZWN0Q29weSA9IGRlZXBDb3B5T2JqZWN0KHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXSk7XG5cbiAgICByZXR1cm4gcHJvamVjdENvcHk7XG4gIH07XG5cbiAgY29uc3QgcmV2ZWFsUHJvamVjdFRhc2tzTGVuZ3RoID0gKHByb2plY3RJbmRleCkgPT4ge1xuICAgIGNvbnN0IHRhc2tzTGVuZ3RoID0gcHJvamVjdHNbcHJvamVjdEluZGV4XS50YXNrcy5sZW5ndGg7XG4gICAgcmV0dXJuIHRhc2tzTGVuZ3RoO1xuICB9O1xuXG4gIGNvbnN0IHJldmVhbEFsbFByb2plY3RzID0gKCkgPT4ge1xuICAgIGNvbnN0IHByb2plY3RzQ29weSA9IGRlZXBDb3B5QXJyYXkocHJvamVjdHMpO1xuXG4gICAgcmV0dXJuIHByb2plY3RzQ29weTtcbiAgfTtcblxuICBjb25zdCBjcmVhdGVOZXdQcm9qZWN0ID0gKHRpdGxlLCBkZXNjcmlwdGlvbikgPT4ge1xuICAgIGNvbnN0IG5ld1Byb2plY3QgPSBuZXcgUHJvamVjdCh0aXRsZSwgZGVzY3JpcHRpb24pO1xuICAgIHByb2plY3RzLnB1c2gobmV3UHJvamVjdCk7XG5cbiAgICBzZXRTdG9yYWdlKCk7XG4gICAgcmV0dXJuIHJldmVhbFByb2plY3QocHJvamVjdHMubGVuZ3RoIC0gMSk7XG4gIH07XG5cbiAgY29uc3QgZGVsZXRlUHJvamVjdCA9IChwcm9qZWN0SW5kZXgpID0+IHtcbiAgICBjb25zdCBpbmRleCA9IE51bWJlcihwcm9qZWN0SW5kZXgpO1xuICAgIHByb2plY3RzLnNwbGljZShpbmRleCwgMSk7XG5cbiAgICBzZXRTdG9yYWdlKCk7XG4gICAgcmV0dXJuIHJldmVhbEFsbFByb2plY3RzKCk7XG4gIH07XG5cbiAgLyogTWlnaHQgbm90IG5lZWQgdGhpcyAqL1xuICBjb25zdCBkZWxldGVQcm9qZWN0QnlOYW1lID0gKHByb2plY3RUaXRsZSkgPT4ge1xuICAgIHByb2plY3RzLmZvckVhY2goKHByb2plY3QpID0+IHtcbiAgICAgIGlmIChwcm9qZWN0LnRpdGxlID09PSBwcm9qZWN0VGl0bGUpIHtcbiAgICAgICAgcHJvamVjdHMuc3BsaWNlKHByb2plY3RzLmluZGV4T2YocHJvamVjdCksIDEpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgc2V0U3RvcmFnZSgpO1xuICAgIHJldHVybiByZXZlYWxBbGxQcm9qZWN0cygpO1xuICB9O1xuXG4gIGNvbnN0IGVkaXRQcm9qZWN0VGl0bGUgPSAocHJvamVjdEluZGV4LCBuZXdUaXRsZSkgPT4ge1xuICAgIHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXS50aXRsZSA9IG5ld1RpdGxlO1xuXG4gICAgc2V0U3RvcmFnZSgpO1xuICAgIHJldHVybiByZXZlYWxQcm9qZWN0KE51bWJlcihwcm9qZWN0SW5kZXgpKTtcbiAgfTtcblxuICBjb25zdCBlZGl0UHJvamVjdERlc2NyaXB0aW9uID0gKHByb2plY3RJbmRleCwgbmV3RGVzY3JpcHRpb24pID0+IHtcbiAgICBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0uZGVzY3JpcHRpb24gPSBuZXdEZXNjcmlwdGlvbjtcblxuICAgIHNldFN0b3JhZ2UoKTtcbiAgICByZXR1cm4gcmV2ZWFsUHJvamVjdChOdW1iZXIocHJvamVjdEluZGV4KSk7XG4gIH07XG5cbiAgLyogVGhpcyBzaG91bGQgYmUgdXNlZCBhdCB0aGUgYmVnZ2luaW5nIG9mIHRoZSBjb2RlIHRvIHN0YXJ0IHRoZSBhcHAgcHJvcGVybHkgKi9cbiAgY29uc3QgaW5pdGlhbGlzZSA9ICgpID0+IHtcbiAgICBjb25zdCBzdG9yZWRQcm9qZWN0cyA9IHN0b3JhZ2VNYW5hZ2VyLmdldFN0b3JhZ2UoKTtcbiAgICBpZiAoc3RvcmVkUHJvamVjdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICBjcmVhdGVOZXdQcm9qZWN0KCdJbmJveCcsICcnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdG9yZWRQcm9qZWN0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBwcm9qZWN0cy5wdXNoKHN0b3JlZFByb2plY3RzW2ldKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJldmVhbEFsbFByb2plY3RzKCk7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICByZXZlYWxQcm9qZWN0LFxuICAgIHJldmVhbFByb2plY3RUYXNrc0xlbmd0aCxcbiAgICByZXZlYWxBbGxQcm9qZWN0cyxcbiAgICBjcmVhdGVOZXdQcm9qZWN0LFxuICAgIGRlbGV0ZVByb2plY3QsXG4gICAgZGVsZXRlUHJvamVjdEJ5TmFtZSxcbiAgICBlZGl0UHJvamVjdFRpdGxlLFxuICAgIGVkaXRQcm9qZWN0RGVzY3JpcHRpb24sXG4gICAgaW5pdGlhbGlzZSxcbiAgfTtcbn0pKCk7XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4tIFRhc2sgTWFuYWdlclxuICAtIENyZWF0ZSBhIHNhZmUgY29weSBvZiBhIHNpbmdsZSB0YXNrIGZvciBwdWJsaWMgdXNlXG4gIC0gQ3JlYXRlICYgZGVsZXRlIHRhc2tzIGluIGEgcHJvamVjdFxuICAtIEVkaXQgdGFzayB0aXRsZSwgZGVzY3JpcHRpb24sIGR1ZSBkYXRlLCBwcmlvcml0eSAmIHN0YXR1c1xuICAtIFN1YnNjcmliZSB0byBtZWRpYXRvciBldmVudHNcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5jb25zdCB0YXNrTWFuYWdlciA9ICgoKSA9PiB7XG4gIGNvbnN0IHJldmVhbFRhc2sgPSAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgpID0+IHtcbiAgICBjb25zdCB0YXNrQ29weSA9IGRlZXBDb3B5T2JqZWN0KFxuICAgICAgcHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldLnRhc2tzW051bWJlcih0YXNrSW5kZXgpXSxcbiAgICApO1xuXG4gICAgcmV0dXJuIHRhc2tDb3B5O1xuICB9O1xuXG4gIGNvbnN0IGNyZWF0ZU5ld1Rhc2sgPSAoXG4gICAgcHJvamVjdEluZGV4LFxuICAgIHRpdGxlLFxuICAgIGRlc2NyaXB0aW9uLFxuICAgIGR1ZURhdGUsXG4gICAgcHJpb3JpdHksXG4gICAgc3RhdHVzLFxuICApID0+IHtcbiAgICBjb25zdCBwcm9qZWN0ID0gcHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldO1xuICAgIHByb2plY3QudGFza3MucHVzaChuZXcgVGFzayh0aXRsZSwgZGVzY3JpcHRpb24sIGR1ZURhdGUsIHByaW9yaXR5LCBzdGF0dXMpKTtcblxuICAgIHNldFN0b3JhZ2UoKTtcbiAgICByZXR1cm4gcmV2ZWFsVGFzayhOdW1iZXIocHJvamVjdEluZGV4KSwgcHJvamVjdC50YXNrcy5sZW5ndGggLSAxKTtcbiAgfTtcblxuICBjb25zdCBkZWxldGVUYXNrID0gKHByb2plY3RJbmRleCwgdGFza0luZGV4KSA9PiB7XG4gICAgY29uc3QgcHJvamVjdCA9IHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXTtcbiAgICBjb25zdCBpbmRleCA9IE51bWJlcih0YXNrSW5kZXgpO1xuICAgIHByb2plY3QudGFza3Muc3BsaWNlKGluZGV4LCAxKTtcblxuICAgIHNldFN0b3JhZ2UoKTtcbiAgICByZXR1cm4gcHJvamVjdE1hbmFnZXIucmV2ZWFsUHJvamVjdChOdW1iZXIocHJvamVjdEluZGV4KSk7XG4gIH07XG5cbiAgY29uc3QgZWRpdFRhc2tUaXRsZSA9IChwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCwgbmV3VGl0bGUpID0+IHtcbiAgICBjb25zdCB0YXNrID0gcHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldLnRhc2tzW051bWJlcih0YXNrSW5kZXgpXTtcbiAgICB0YXNrLnRpdGxlID0gbmV3VGl0bGU7XG5cbiAgICBzZXRTdG9yYWdlKCk7XG4gICAgcmV0dXJuIHJldmVhbFRhc2soTnVtYmVyKHByb2plY3RJbmRleCksIE51bWJlcih0YXNrSW5kZXgpKTtcbiAgfTtcblxuICBjb25zdCBlZGl0VGFza0Rlc2NyaXB0aW9uID0gKHByb2plY3RJbmRleCwgdGFza0luZGV4LCBuZXdEZXNjcmlwdGlvbikgPT4ge1xuICAgIGNvbnN0IHRhc2sgPSBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0udGFza3NbTnVtYmVyKHRhc2tJbmRleCldO1xuICAgIHRhc2suZGVzY3JpcHRpb24gPSBuZXdEZXNjcmlwdGlvbjtcblxuICAgIHNldFN0b3JhZ2UoKTtcbiAgICByZXR1cm4gcmV2ZWFsVGFzayhOdW1iZXIocHJvamVjdEluZGV4KSwgTnVtYmVyKHRhc2tJbmRleCkpO1xuICB9O1xuXG4gIGNvbnN0IGVkaXRUYXNrRHVlRGF0ZSA9IChwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCwgbmV3RHVlRGF0ZSkgPT4ge1xuICAgIGNvbnN0IHRhc2sgPSBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0udGFza3NbTnVtYmVyKHRhc2tJbmRleCldO1xuICAgIHRhc2suZHVlRGF0ZSA9IG5ld0R1ZURhdGU7XG5cbiAgICBzZXRTdG9yYWdlKCk7XG4gICAgcmV0dXJuIHJldmVhbFRhc2soTnVtYmVyKHByb2plY3RJbmRleCksIE51bWJlcih0YXNrSW5kZXgpKTtcbiAgfTtcblxuICBjb25zdCBlZGl0VGFza1ByaW9yaXR5ID0gKHByb2plY3RJbmRleCwgdGFza0luZGV4LCBuZXdQcmlvcml0eSkgPT4ge1xuICAgIGNvbnN0IHRhc2sgPSBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0udGFza3NbTnVtYmVyKHRhc2tJbmRleCldO1xuICAgIHRhc2sucHJpb3JpdHkgPSBuZXdQcmlvcml0eTtcblxuICAgIHNldFN0b3JhZ2UoKTtcbiAgICByZXR1cm4gcmV2ZWFsVGFzayhOdW1iZXIocHJvamVjdEluZGV4KSwgTnVtYmVyKHRhc2tJbmRleCkpO1xuICB9O1xuXG4gIGNvbnN0IGVkaXRUYXNrU3RhdHVzID0gKHByb2plY3RJbmRleCwgdGFza0luZGV4LCBuZXdTdGF0dXMpID0+IHtcbiAgICBjb25zdCB0YXNrID0gcHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldLnRhc2tzW051bWJlcih0YXNrSW5kZXgpXTtcbiAgICB0YXNrLnN0YXR1cyA9IG5ld1N0YXR1cztcblxuICAgIHNldFN0b3JhZ2UoKTtcbiAgICByZXR1cm4gcmV2ZWFsVGFzayhOdW1iZXIocHJvamVjdEluZGV4KSwgTnVtYmVyKHRhc2tJbmRleCkpO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgcmV2ZWFsVGFzayxcbiAgICBjcmVhdGVOZXdUYXNrLFxuICAgIGRlbGV0ZVRhc2ssXG4gICAgZWRpdFRhc2tUaXRsZSxcbiAgICBlZGl0VGFza0Rlc2NyaXB0aW9uLFxuICAgIGVkaXRUYXNrRHVlRGF0ZSxcbiAgICBlZGl0VGFza1ByaW9yaXR5LFxuICAgIGVkaXRUYXNrU3RhdHVzLFxuICB9O1xufSkoKTtcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi0gU3RlcCBNYW5hZ2VyXG4gIC0gQ3JlYXRlICYgZGVsZXRlIHN0ZXBzIGluIGEgdGFza1xuICAtIEVkaXQgc3RlcCBkZXNjcmlwdGlvbiAmIHN0YXR1c1xuICAtIENyZWF0ZSBhIHNmZSBjb3B5IG9mIGEgc2luZ2xlIHN0ZXAgZm9yIHB1YmxpYyB1c2VcbiAgLSBTdWJzY3JpYmUgdG8gbWVkaWF0b3IgZXZlbnRzXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuY29uc3Qgc3RlcE1hbmFnZXIgPSAoKCkgPT4ge1xuICBjb25zdCByZXZlYWxTdGVwID0gKHByb2plY3RJbmRleCwgdGFza0luZGV4LCBzdGVwSW5kZXgpID0+IHtcbiAgICBjb25zdCBzdGVwQ29weSA9IGRlZXBDb3B5T2JqZWN0KFxuICAgICAgcHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldLnRhc2tzW051bWJlcih0YXNrSW5kZXgpXS5zdGVwc1tcbiAgICAgICAgTnVtYmVyKHN0ZXBJbmRleClcbiAgICAgIF0sXG4gICAgKTtcblxuICAgIHJldHVybiBzdGVwQ29weTtcbiAgfTtcblxuICBjb25zdCBjcmVhdGVOZXdTdGVwID0gKHByb2plY3RJbmRleCwgdGFza0luZGV4LCBkZXNjcmlwdGlvbiwgc3RhdHVzKSA9PiB7XG4gICAgY29uc3QgdGFzayA9IHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXS50YXNrc1tOdW1iZXIodGFza0luZGV4KV07XG4gICAgdGFzay5zdGVwcy5wdXNoKG5ldyBTdGVwKGRlc2NyaXB0aW9uLCBzdGF0dXMpKTtcblxuICAgIHNldFN0b3JhZ2UoKTtcbiAgICByZXR1cm4gcmV2ZWFsU3RlcChcbiAgICAgIE51bWJlcihwcm9qZWN0SW5kZXgpLFxuICAgICAgTnVtYmVyKHRhc2tJbmRleCksXG4gICAgICB0YXNrLnN0ZXBzLmxlbmd0aCAtIDEsXG4gICAgKTtcbiAgfTtcblxuICBjb25zdCBkZWxldGVTdGVwID0gKHByb2plY3RJbmRleCwgdGFza0luZGV4LCBzdGVwSW5kZXgpID0+IHtcbiAgICBjb25zdCB0YXNrID0gcHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldLnRhc2tzW051bWJlcih0YXNrSW5kZXgpXTtcbiAgICBjb25zdCBpbmRleCA9IE51bWJlcihzdGVwSW5kZXgpO1xuICAgIHRhc2suc3RlcHMuc3BsaWNlKGluZGV4LCAxKTtcblxuICAgIHNldFN0b3JhZ2UoKTtcbiAgICByZXR1cm4gdGFza01hbmFnZXIucmV2ZWFsVGFzayhOdW1iZXIocHJvamVjdEluZGV4KSwgTnVtYmVyKHRhc2tJbmRleCkpO1xuICB9O1xuXG4gIGNvbnN0IGVkaXRTdGVwRGVzY3JpcHRpb24gPSAoXG4gICAgcHJvamVjdEluZGV4LFxuICAgIHRhc2tJbmRleCxcbiAgICBzdGVwSW5kZXgsXG4gICAgbmV3RGVzY3JpcHRpb24sXG4gICkgPT4ge1xuICAgIGNvbnN0IHN0ZXAgPVxuICAgICAgcHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldLnRhc2tzW051bWJlcih0YXNrSW5kZXgpXS5zdGVwc1tcbiAgICAgICAgTnVtYmVyKHN0ZXBJbmRleClcbiAgICAgIF07XG4gICAgc3RlcC5kZXNjcmlwdGlvbiA9IG5ld0Rlc2NyaXB0aW9uO1xuXG4gICAgc2V0U3RvcmFnZSgpO1xuICAgIHJldHVybiByZXZlYWxTdGVwKFxuICAgICAgTnVtYmVyKHByb2plY3RJbmRleCksXG4gICAgICBOdW1iZXIodGFza0luZGV4KSxcbiAgICAgIE51bWJlcihzdGVwSW5kZXgpLFxuICAgICk7XG4gIH07XG5cbiAgY29uc3QgZWRpdFN0ZXBTdGF0dXMgPSAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgsIHN0ZXBJbmRleCwgbmV3U3RhdHVzKSA9PiB7XG4gICAgY29uc3Qgc3RlcCA9XG4gICAgICBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0udGFza3NbTnVtYmVyKHRhc2tJbmRleCldLnN0ZXBzW1xuICAgICAgICBOdW1iZXIoc3RlcEluZGV4KVxuICAgICAgXTtcbiAgICBzdGVwLnN0YXR1cyA9IG5ld1N0YXR1cztcblxuICAgIHNldFN0b3JhZ2UoKTtcbiAgICByZXR1cm4gcmV2ZWFsU3RlcChcbiAgICAgIE51bWJlcihwcm9qZWN0SW5kZXgpLFxuICAgICAgTnVtYmVyKHRhc2tJbmRleCksXG4gICAgICBOdW1iZXIoc3RlcEluZGV4KSxcbiAgICApO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgcmV2ZWFsU3RlcCxcbiAgICBjcmVhdGVOZXdTdGVwLFxuICAgIGRlbGV0ZVN0ZXAsXG4gICAgZWRpdFN0ZXBEZXNjcmlwdGlvbixcbiAgICBlZGl0U3RlcFN0YXR1cyxcbiAgfTtcbn0pKCk7XG5cbmV4cG9ydCB7IHByb2plY3RNYW5hZ2VyLCB0YXNrTWFuYWdlciwgc3RlcE1hbmFnZXIgfTtcbiIsIi8qIENvbnRlbnRzOlxuXG5cdC0gR2VuZXJhbFxuXG5cdC0gSGVhZGVyIG1vZHVsZVxuXG5cdC0gTmF2YmFyIG1vZHVsZVxuXG4gIC0gTWFpbiBtb2R1bGVcblxuICAtIEFzaWRlIG1vZHVsZVxuXHRcblx0LSBNb2R1bGUgdG8gY29udHJvbCB0aGluZ3MgY29tbW9uIG1vc3QgbW9kYWxzXG5cblx0LSAnTmV3IExpc3QnIG1vZGFsIG1vZHVsZVxuXG4gIC0gJ0VkaXQgbGlzdCcgbW9kYWwgbW9kdWxlXG5cbiAgLSAnRGVsZXRlIGxpc3QnIG1vZGFsIG1vZHVsZVxuXG4gIC0gJ05ldyB0YXNrJyBtb2RhbCBtb2R1bGVcblxuICAtIFN0ZXBzIGNvbXBvbmVudCBtb2R1bGVcblxuICAtICdFZGl0IHRhc2snIG1vZGFsIG1vZHVsZVxuXG4gIC0gJ0RlbGV0ZSB0YXNrJyBtb2RhbCBtb2R1bGVcblxuXHQtIEluaXRpYWxpc2VyIGZ1bmN0aW9uXG4qL1xuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi0gR2VuZXJhbFxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbmltcG9ydCB7IHByb2plY3RNYW5hZ2VyLCB0YXNrTWFuYWdlciwgc3RlcE1hbmFnZXIgfSBmcm9tICcuL3RvRG9MaXN0JztcblxuY29uc3QgdG9nZ2xlSGlkZGVuID0gKGVsZW1lbnQpID0+IHtcbiAgZWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKCdoaWRkZW4nKTtcbn07XG5cbmNvbnN0IGhhc0RhdGVQYXN0ID0gKGRhdGUpID0+IHtcbiAgY29uc3QgZGF0ZVRvQ29tcGFyZSA9IGRhdGUuc3BsaXQoJy0nKTtcbiAgY29uc3QgY3VycmVudERhdGUgPSBuZXcgRGF0ZSgpO1xuICBjb25zdCBjdXJyZW50WWVhciA9IGN1cnJlbnREYXRlLmdldEZ1bGxZZWFyKCk7XG4gIGNvbnN0IGN1cnJlbnRNb250aCA9IGN1cnJlbnREYXRlLmdldE1vbnRoKCkgKyAxO1xuICBjb25zdCBjdXJyZW50RGF5ID0gY3VycmVudERhdGUuZ2V0RGF0ZSgpO1xuXG4gIGlmIChcbiAgICBjdXJyZW50WWVhciA+IE51bWJlcihkYXRlVG9Db21wYXJlWzBdKSB8fFxuICAgIChjdXJyZW50WWVhciA9PT0gTnVtYmVyKGRhdGVUb0NvbXBhcmVbMF0pICYmXG4gICAgICBjdXJyZW50TW9udGggPiBOdW1iZXIoZGF0ZVRvQ29tcGFyZVsxXSkpIHx8XG4gICAgKGN1cnJlbnRZZWFyID09PSBOdW1iZXIoZGF0ZVRvQ29tcGFyZVswXSkgJiZcbiAgICAgIGN1cnJlbnRNb250aCA9PT0gTnVtYmVyKGRhdGVUb0NvbXBhcmVbMV0pICYmXG4gICAgICBjdXJyZW50RGF5ID4gTnVtYmVyKGRhdGVUb0NvbXBhcmVbMl0pKVxuICApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLSBIZWFkZXIgbW9kdWxlXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuY29uc3QgaGVhZGVyID0gKCgpID0+IHtcbiAgLyogRnVuY3Rpb24gdG8gaW52b2tlIG9uIGluaXRpbGlzZSwgZm9yIHRoZSBjb21wb25lbnQgdG8gd29yayBwcm9wZXJseSAqL1xuICBjb25zdCBhZGRIZWFkZXJMaXN0ZW5lcnMgPSAoKSA9PiB7XG4gICAgY29uc3QgdG9nZ2xlTmF2QnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RvZ2dsZS1uYXYtYnV0dG9uJyk7XG4gICAgY29uc3QgdG9nZ2xlQXNpZGVCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndG9nZ2xlLWFzaWRlLWJ1dHRvbicpO1xuICAgIGNvbnN0IG5hdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ25hdicpO1xuICAgIGNvbnN0IGFzaWRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYXNpZGUnKTtcblxuICAgIHRvZ2dsZU5hdkJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHRvZ2dsZUhpZGRlbihuYXYpKTtcbiAgICB0b2dnbGVBc2lkZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHRvZ2dsZUhpZGRlbihhc2lkZSkpO1xuICB9O1xuXG4gIHJldHVybiB7IGFkZEhlYWRlckxpc3RlbmVycyB9O1xufSkoKTtcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi0gTmF2YmFyIG1vZHVsZVxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbmNvbnN0IG5hdmJhciA9ICgoKSA9PiB7XG4gIGNvbnN0IG5hdkxpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmF2LXRvZG8tbGlzdHMnKTtcblxuICBjb25zdCBzZXRQcm9qZWN0RGF0YUluZGV4ID0gKGVsZW1lbnQsIGluZGV4KSA9PiB7XG4gICAgZWxlbWVudC5kYXRhc2V0LnByb2plY3RJbmRleCA9IGluZGV4O1xuICB9O1xuXG4gIGNvbnN0IGNhbGN1bGF0ZU5ld1Byb2plY3RJbmRleCA9ICgpID0+IHtcbiAgICBjb25zdCBsaXN0cyA9IG5hdkxpc3QuY2hpbGRyZW47XG4gICAgY29uc3QgbmV3SW5kZXggPSBsaXN0cy5sZW5ndGggKyAxO1xuICAgIHJldHVybiBuZXdJbmRleDtcbiAgfTtcblxuICBjb25zdCB1cGRhdGVBbGxQcm9qZWN0SW5kaWNlcyA9ICgpID0+IHtcbiAgICBjb25zdCBjdXJyZW50TGlzdHMgPSBuYXZMaXN0LmNoaWxkcmVuO1xuICAgIGxldCB1cGRhdGVkSW5kZXggPSAxO1xuICAgIGZvciAoY29uc3QgbGlzdCBvZiBjdXJyZW50TGlzdHMpIHtcbiAgICAgIGNvbnN0IGxpbmsgPSBsaXN0LnF1ZXJ5U2VsZWN0b3IoJ2EnKTtcbiAgICAgIGNvbnN0IGJ1dHRvbnMgPSBsaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoJ2J1dHRvbicpO1xuICAgICAgbGluay5kYXRhc2V0LnByb2plY3RJbmRleCA9IHVwZGF0ZWRJbmRleDtcbiAgICAgIGJ1dHRvbnMuZm9yRWFjaCgoYnV0dG9uKSA9PiB7XG4gICAgICAgIGJ1dHRvbi5kYXRhc2V0LnByb2plY3RJbmRleCA9IHVwZGF0ZWRJbmRleDtcbiAgICAgIH0pO1xuICAgICAgdXBkYXRlZEluZGV4ICs9IDE7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IHJlbmRlck5ld0xpc3QgPSAobGlzdCwgbGlzdEluZGV4KSA9PiB7XG4gICAgY29uc3QgbGlzdEl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgIGNvbnN0IGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29uc3QgZWRpdEJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGNvbnN0IGVkaXRJbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICBjb25zdCBkZWxldGVCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBjb25zdCBkZWxldGVJbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcblxuICAgIGxpbmsuc2V0QXR0cmlidXRlKCdocmVmJywgJyMnKTtcbiAgICBsaW5rLnRleHRDb250ZW50ID0gYCR7bGlzdC50aXRsZX1gO1xuICAgIGRpdi5jbGFzc0xpc3QuYWRkKCduYXYtbGlzdC1idXR0b25zJyk7XG4gICAgZWRpdEltZy5zZXRBdHRyaWJ1dGUoJ3NyYycsICcuL2ljb25zL2VkaXQuc3ZnJyk7XG4gICAgZWRpdEltZy5zZXRBdHRyaWJ1dGUoJ2FsdCcsICdidXR0b24gdG8gZWRpdCBsaXN0Jyk7XG4gICAgZGVsZXRlSW1nLnNldEF0dHJpYnV0ZSgnc3JjJywgJy4vaWNvbnMvZGVsZXRlLnN2ZycpO1xuICAgIGRlbGV0ZUltZy5zZXRBdHRyaWJ1dGUoJ2FsdCcsICdidXR0b24gdG8gZGVsZXRlIGxpc3QnKTtcblxuICAgIHNldFByb2plY3REYXRhSW5kZXgobGluaywgbGlzdEluZGV4KTtcbiAgICBzZXRQcm9qZWN0RGF0YUluZGV4KGVkaXRCdG4sIGxpc3RJbmRleCk7XG4gICAgc2V0UHJvamVjdERhdGFJbmRleChkZWxldGVCdG4sIGxpc3RJbmRleCk7XG5cbiAgICBlZGl0QnRuLmFwcGVuZENoaWxkKGVkaXRJbWcpO1xuICAgIGRlbGV0ZUJ0bi5hcHBlbmRDaGlsZChkZWxldGVJbWcpO1xuICAgIGRpdi5hcHBlbmRDaGlsZChlZGl0QnRuKTtcbiAgICBkaXYuYXBwZW5kQ2hpbGQoZGVsZXRlQnRuKTtcbiAgICBsaXN0SXRlbS5hcHBlbmRDaGlsZChsaW5rKTtcbiAgICBsaXN0SXRlbS5hcHBlbmRDaGlsZChkaXYpO1xuICAgIG5hdkxpc3QuYXBwZW5kQ2hpbGQobGlzdEl0ZW0pO1xuXG4gICAgbGluay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIG1haW4ucmVuZGVyTWFpbihcbiAgICAgICAgcHJvamVjdE1hbmFnZXIucmV2ZWFsUHJvamVjdChOdW1iZXIobGluay5kYXRhc2V0LnByb2plY3RJbmRleCkpLFxuICAgICAgICBOdW1iZXIobGluay5kYXRhc2V0LnByb2plY3RJbmRleCksXG4gICAgICApO1xuICAgIH0pO1xuICAgIGVkaXRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PlxuICAgICAgZWRpdExpc3RNb2RhbC5vcGVuRWRpdE1vZGFsKGVkaXRCdG4uZGF0YXNldC5wcm9qZWN0SW5kZXgpLFxuICAgICk7XG4gICAgZGVsZXRlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT5cbiAgICAgIGRlbGV0ZUxpc3RNb2RhbC5vcGVuRGVsZXRlTW9kYWwoZGVsZXRlQnRuLmRhdGFzZXQucHJvamVjdEluZGV4KSxcbiAgICApO1xuICB9O1xuXG4gIGNvbnN0IHJlbmRlckRlbGV0ZWRMaXN0ID0gKGxpc3RJbmRleCkgPT4ge1xuICAgIGNvbnN0IGxpc3RUb0RlbGV0ZSA9IG5hdkxpc3QucXVlcnlTZWxlY3RvcihcbiAgICAgIGBbZGF0YS1wcm9qZWN0LWluZGV4PScke2xpc3RJbmRleH0nXWAsXG4gICAgKS5wYXJlbnRFbGVtZW50O1xuICAgIGxpc3RUb0RlbGV0ZS5yZW1vdmUoKTtcbiAgICB1cGRhdGVBbGxQcm9qZWN0SW5kaWNlcygpO1xuICB9O1xuXG4gIGNvbnN0IHJlbmRlckVkaXRlZExpc3QgPSAobGlzdEluZGV4LCBwcm9qZWN0KSA9PiB7XG4gICAgY29uc3QgbGlzdFRvRWRpdCA9IG5hdkxpc3QucXVlcnlTZWxlY3RvcihcbiAgICAgIGBhW2RhdGEtcHJvamVjdC1pbmRleD0nJHtsaXN0SW5kZXh9J11gLFxuICAgICk7XG4gICAgbGlzdFRvRWRpdC50ZXh0Q29udGVudCA9IHByb2plY3QudGl0bGU7XG4gIH07XG5cbiAgY29uc3QgcmVuZGVyQ3VycmVudExpc3RzID0gKCkgPT4ge1xuICAgIGNvbnN0IGxpc3RzID0gcHJvamVjdE1hbmFnZXIucmV2ZWFsQWxsUHJvamVjdHMoKTtcbiAgICBsaXN0cy5mb3JFYWNoKChsaXN0KSA9PiB7XG4gICAgICBpZiAobGlzdHMuaW5kZXhPZihsaXN0KSA+IDApIHtcbiAgICAgICAgcmVuZGVyTmV3TGlzdChsaXN0LCBsaXN0cy5pbmRleE9mKGxpc3QpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBjb25zdCBzZXRJbmJveEluZGV4QW5kTGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgY29uc3QgaW5ib3ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmF2LWxpc3QtaW5ib3gnKTtcbiAgICBzZXRQcm9qZWN0RGF0YUluZGV4KGluYm94LCAwKTtcbiAgICBpbmJveC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIG1haW4ucmVuZGVyTWFpbihwcm9qZWN0TWFuYWdlci5yZXZlYWxQcm9qZWN0KDApLCAwKTtcbiAgICB9KTtcbiAgfTtcblxuICBjb25zdCBhZGROZXdMaXN0QnRuTGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgY29uc3QgbmV3TGlzdEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uYXYtbmV3LWxpc3QtYnV0dG9uJyk7XG4gICAgY29uc3QgbW9kYWxOZXdMaXN0ID1cbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uZXctbGlzdC1tb2RhbCcpLnBhcmVudEVsZW1lbnQ7XG4gICAgbmV3TGlzdEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHRvZ2dsZUhpZGRlbihtb2RhbE5ld0xpc3QpKTtcbiAgfTtcblxuICAvKiBGdW5jdGlvbiB0byBpbnZva2Ugb24gaW5pdGlsaXNlLCBmb3IgdGhlIGNvbXBvbmVudCB0byB3b3JrIHByb3Blcmx5ICovXG4gIGNvbnN0IGluaXQgPSAoKSA9PiB7XG4gICAgcmVuZGVyQ3VycmVudExpc3RzKCk7XG4gICAgc2V0SW5ib3hJbmRleEFuZExpc3RlbmVyKCk7XG4gICAgYWRkTmV3TGlzdEJ0bkxpc3RlbmVyKCk7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBjYWxjdWxhdGVOZXdQcm9qZWN0SW5kZXgsXG4gICAgcmVuZGVyTmV3TGlzdCxcbiAgICByZW5kZXJEZWxldGVkTGlzdCxcbiAgICByZW5kZXJFZGl0ZWRMaXN0LFxuICAgIGluaXQsXG4gIH07XG59KSgpO1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLSBNYWluIG1vZHVsZVxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbmNvbnN0IG1haW4gPSAoKCkgPT4ge1xuICBjb25zdCBtYWluVGFza3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdtYWluJyk7XG4gIGNvbnN0IG5ld1Rhc2tCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbi1uZXctdGFzay1idXR0b24nKTtcbiAgY29uc3QgdW5maW5pc2hlZERpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy51bmZpbmlzaGVkLXRhc2tzJyk7XG4gIGNvbnN0IGZpbmlzaGVkRGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZpbmlzaGVkLXRhc2tzJyk7XG5cbiAgLyogSGVhZGVyIHNlY3Rpb24gKi9cbiAgY29uc3QgcmVuZGVySGVhZGVyID0gKHByb2plY3QpID0+IHtcbiAgICBjb25zdCBsaXN0VGl0bGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbi1saXN0LXRpdGxlJyk7XG4gICAgY29uc3QgbGlzdERlc2NyaXB0aW9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW4tbGlzdC1kZXNjcmlwdGlvbicpO1xuICAgIGxpc3RUaXRsZS50ZXh0Q29udGVudCA9IHByb2plY3QudGl0bGU7XG4gICAgbGlzdERlc2NyaXB0aW9uLnRleHRDb250ZW50ID0gcHJvamVjdC5kZXNjcmlwdGlvbjtcbiAgfTtcblxuICBjb25zdCBzZXROZXdUYXNrQnRuSW5kZXggPSAoaW5kZXgpID0+IHtcbiAgICBuZXdUYXNrQnRuLmRhdGFzZXQucHJvamVjdEluZGV4ID0gaW5kZXg7XG4gIH07XG5cbiAgY29uc3QgYWRkTmV3VGFza0J0bkxpc3RlbmVyID0gKCkgPT4ge1xuICAgIG5ld1Rhc2tCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PlxuICAgICAgbmV3VGFza01vZGFsLm9wZW5OZXdUYXNrTW9kYWwobmV3VGFza0J0bi5kYXRhc2V0LnByb2plY3RJbmRleCksXG4gICAgKTtcbiAgfTtcblxuICAvKiBUYXNrcyBzZWN0aW9uICovXG4gIGNvbnN0IGNsZWFyVGFza3MgPSAoKSA9PiB7XG4gICAgY29uc3QgdGFza0dyb3VwcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5tYWluLXRhc2tzJyk7XG4gICAgdGFza0dyb3Vwcy5mb3JFYWNoKCh0YXNrR3JvdXApID0+IHtcbiAgICAgIHRhc2tHcm91cC5pbm5lckhUTUwgPSAnJztcbiAgICB9KTtcbiAgfTtcblxuICBjb25zdCBzZW5kVG9GaW5pc2hlZERpdiA9ICh0YXNrSW5kZXgpID0+IHtcbiAgICBjb25zdCB0YXNrVG9Nb3ZlID0gdW5maW5pc2hlZERpdi5xdWVyeVNlbGVjdG9yKFxuICAgICAgYGRpdltkYXRhLXRhc2staW5kZXg9JyR7dGFza0luZGV4fSddYCxcbiAgICApO1xuICAgIGZpbmlzaGVkRGl2LnByZXBlbmQodGFza1RvTW92ZSk7XG4gIH07XG5cbiAgY29uc3Qgc2VuZFRvVW5maW5pc2hlZERpdiA9ICh0YXNrSW5kZXgpID0+IHtcbiAgICBjb25zdCB0YXNrVG9Nb3ZlID0gZmluaXNoZWREaXYucXVlcnlTZWxlY3RvcihcbiAgICAgIGBkaXZbZGF0YS10YXNrLWluZGV4PScke3Rhc2tJbmRleH0nXWAsXG4gICAgKTtcbiAgICB1bmZpbmlzaGVkRGl2LmFwcGVuZENoaWxkKHRhc2tUb01vdmUpO1xuICB9O1xuXG4gIGNvbnN0IHRvZ2dsZVRhc2tTdGF0dXMgPSAoY2hlY2tib3gsIHByb2plY3RJbmRleCwgdGFza0luZGV4KSA9PiB7XG4gICAgaWYgKGNoZWNrYm94LmNoZWNrZWQpIHtcbiAgICAgIHRhc2tNYW5hZ2VyLmVkaXRUYXNrU3RhdHVzKHByb2plY3RJbmRleCwgdGFza0luZGV4LCAnZG9uZScpO1xuICAgICAgc2VuZFRvRmluaXNoZWREaXYodGFza0luZGV4KTtcbiAgICB9IGVsc2UgaWYgKCFjaGVja2JveC5jaGVja2VkKSB7XG4gICAgICB0YXNrTWFuYWdlci5lZGl0VGFza1N0YXR1cyhwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCwgJ3RvIGRvJyk7XG4gICAgICBzZW5kVG9VbmZpbmlzaGVkRGl2KHRhc2tJbmRleCk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IHRvZ2dsZVN0ZXBTdGF0dXMgPSAoY2hlY2tib3gsIHByb2plY3RJbmRleCwgdGFza0luZGV4LCBzdGVwSW5kZXgpID0+IHtcbiAgICBpZiAoY2hlY2tib3guY2hlY2tlZCkge1xuICAgICAgc3RlcE1hbmFnZXIuZWRpdFN0ZXBTdGF0dXMocHJvamVjdEluZGV4LCB0YXNrSW5kZXgsIHN0ZXBJbmRleCwgJ2RvbmUnKTtcbiAgICB9IGVsc2UgaWYgKCFjaGVja2JveC5jaGVja2VkKSB7XG4gICAgICBzdGVwTWFuYWdlci5lZGl0U3RlcFN0YXR1cyhwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCwgc3RlcEluZGV4LCAndG8gZG8nKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgcmVuZGVyVGFza0NvbnRlbnQgPSAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgpID0+IHtcbiAgICBjb25zdCB0YXNrID0gdGFza01hbmFnZXIucmV2ZWFsVGFzayhwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCk7XG4gICAgY29uc3QgdGFza0l0ZW0gPSBtYWluVGFza3NcbiAgICAgIC5xdWVyeVNlbGVjdG9yKGBkaXZbZGF0YS10YXNrLWluZGV4PScke3Rhc2tJbmRleH0nXWApXG4gICAgICAucXVlcnlTZWxlY3RvcignLnRhc2staXRlbScpO1xuICAgIGNvbnN0IHByaW9yaXR5TGV2ZWwgPSB0YXNrSXRlbS5xdWVyeVNlbGVjdG9yKCcudGFzay1wcmlvcml0eS1sZXZlbCcpO1xuICAgIGNvbnN0IHRpdGxlRGl2ID0gdGFza0l0ZW0ucXVlcnlTZWxlY3RvcignLnRhc2stdGl0bGUnKTtcbiAgICBjb25zdCB0aXRsZUNoZWNrYm94ID0gdGl0bGVEaXYucXVlcnlTZWxlY3RvcignaW5wdXQnKTtcbiAgICBjb25zdCB0aXRsZUxhYmVsID0gdGl0bGVEaXYucXVlcnlTZWxlY3RvcignbGFiZWwnKTtcbiAgICBjb25zdCBkZXNjcmlwdGlvbiA9IHRhc2tJdGVtLnF1ZXJ5U2VsZWN0b3IoJy50YXNrLWRlc2NyaXB0aW9uJyk7XG4gICAgY29uc3Qgc3RlcHNMaXN0ID0gdGFza0l0ZW0ucXVlcnlTZWxlY3RvcignLnRhc2stc3RlcHMnKTtcblxuICAgIHN3aXRjaCAodGFzay5wcmlvcml0eSkge1xuICAgICAgY2FzZSAnbG93JzpcbiAgICAgICAgdGFza0l0ZW0uY2xhc3NOYW1lID0gJyc7XG4gICAgICAgIHRhc2tJdGVtLmNsYXNzTGlzdC5hZGQoJ3Rhc2staXRlbScsICdwcmlvcml0eS1sb3cnKTtcbiAgICAgICAgcHJpb3JpdHlMZXZlbC50ZXh0Q29udGVudCA9ICdMb3cnO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21lZGl1bSc6XG4gICAgICAgIHRhc2tJdGVtLmNsYXNzTmFtZSA9ICcnO1xuICAgICAgICB0YXNrSXRlbS5jbGFzc0xpc3QuYWRkKCd0YXNrLWl0ZW0nLCAncHJpb3JpdHktbWVkaXVtJyk7XG4gICAgICAgIHByaW9yaXR5TGV2ZWwudGV4dENvbnRlbnQgPSAnTWVkaXVtJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdoaWdoJzpcbiAgICAgICAgdGFza0l0ZW0uY2xhc3NOYW1lID0gJyc7XG4gICAgICAgIHRhc2tJdGVtLmNsYXNzTGlzdC5hZGQoJ3Rhc2staXRlbScsICdwcmlvcml0eS1oaWdoJyk7XG4gICAgICAgIHByaW9yaXR5TGV2ZWwudGV4dENvbnRlbnQgPSAnSGlnaCc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGFza0l0ZW0uY2xhc3NOYW1lID0gJyc7XG4gICAgICAgIHRhc2tJdGVtLmNsYXNzTGlzdC5hZGQoJ3Rhc2staXRlbScsICdwcmlvcml0eS1ub25lJyk7XG4gICAgICAgIHByaW9yaXR5TGV2ZWwudGV4dENvbnRlbnQgPSAnTm9uZSc7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBpZiAodGFzay5zdGF0dXMgPT09ICd0byBkbycpIHtcbiAgICAgIHRpdGxlQ2hlY2tib3guY2hlY2tlZCA9IGZhbHNlO1xuICAgIH0gZWxzZSBpZiAodGFzay5zdGF0dXMgPT09ICdkb25lJykge1xuICAgICAgdGl0bGVDaGVja2JveC5jaGVja2VkID0gdHJ1ZTtcbiAgICB9XG4gICAgdGl0bGVMYWJlbC50ZXh0Q29udGVudCA9IHRhc2sudGl0bGU7XG4gICAgZGVzY3JpcHRpb24udGV4dENvbnRlbnQgPSB0YXNrLmRlc2NyaXB0aW9uO1xuICAgIHN0ZXBzTGlzdC5pbm5lckhUTUwgPSAnJztcbiAgICB0YXNrLnN0ZXBzLmZvckVhY2goKHN0ZXApID0+IHtcbiAgICAgIGNvbnN0IGxpc3RJdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgIGNvbnN0IHN0ZXBDaGVja2JveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICBjb25zdCBzdGVwTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICAgICAgY29uc3QgaW5kZXggPSB0YXNrLnN0ZXBzLmluZGV4T2Yoc3RlcCk7XG5cbiAgICAgIHN0ZXBDaGVja2JveC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnY2hlY2tib3gnKTtcbiAgICAgIHN0ZXBDaGVja2JveC5zZXRBdHRyaWJ1dGUoXG4gICAgICAgICduYW1lJyxcbiAgICAgICAgYHByb2plY3Qke3Byb2plY3RJbmRleH0tdGFzayR7dGFza0luZGV4fS1zdGVwJHtpbmRleH1gLFxuICAgICAgKTtcbiAgICAgIHN0ZXBDaGVja2JveC5zZXRBdHRyaWJ1dGUoXG4gICAgICAgICdpZCcsXG4gICAgICAgIGBwcm9qZWN0JHtwcm9qZWN0SW5kZXh9LXRhc2ske3Rhc2tJbmRleH0tc3RlcCR7aW5kZXh9YCxcbiAgICAgICk7XG4gICAgICBpZiAoc3RlcC5zdGF0dXMgPT09ICd0byBkbycpIHtcbiAgICAgICAgc3RlcENoZWNrYm94LmNoZWNrZWQgPSBmYWxzZTtcbiAgICAgIH0gZWxzZSBpZiAoc3RlcC5zdGF0dXMgPT09ICdkb25lJykge1xuICAgICAgICBzdGVwQ2hlY2tib3guY2hlY2tlZCA9IHRydWU7XG4gICAgICB9XG4gICAgICBzdGVwQ2hlY2tib3guZGF0YXNldC5wcm9qZWN0SW5kZXggPSBwcm9qZWN0SW5kZXg7XG4gICAgICBzdGVwQ2hlY2tib3guZGF0YXNldC50YXNrSW5kZXggPSB0YXNrSW5kZXg7XG4gICAgICBzdGVwQ2hlY2tib3guZGF0YXNldC5zdGVwSW5kZXggPSBpbmRleDtcbiAgICAgIHN0ZXBMYWJlbC5zZXRBdHRyaWJ1dGUoXG4gICAgICAgICdmb3InLFxuICAgICAgICBgcHJvamVjdCR7cHJvamVjdEluZGV4fS10YXNrJHt0YXNrSW5kZXh9LXN0ZXAke2luZGV4fWAsXG4gICAgICApO1xuICAgICAgc3RlcExhYmVsLnRleHRDb250ZW50ID0gc3RlcC5kZXNjcmlwdGlvbjtcblxuICAgICAgc3RlcENoZWNrYm94LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsICgpID0+XG4gICAgICAgIHRvZ2dsZVN0ZXBTdGF0dXMoc3RlcENoZWNrYm94LCBwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCwgaW5kZXgpLFxuICAgICAgKTtcblxuICAgICAgbGlzdEl0ZW0uYXBwZW5kQ2hpbGQoc3RlcENoZWNrYm94KTtcbiAgICAgIGxpc3RJdGVtLmFwcGVuZENoaWxkKHN0ZXBMYWJlbCk7XG4gICAgICBzdGVwc0xpc3QuYXBwZW5kQ2hpbGQobGlzdEl0ZW0pO1xuICAgIH0pO1xuICAgIGlmICh0YXNrLmR1ZURhdGUgIT09ICcnKSB7XG4gICAgICBjb25zdCBkYXRlU3BhbiA9IHRhc2tJdGVtLnF1ZXJ5U2VsZWN0b3IoJy50YXNrLWluZm8nKTtcbiAgICAgIGNvbnN0IHRhc2tEdWVEYXRlID0gdGFza0l0ZW0ucXVlcnlTZWxlY3RvcignLnRhc2stZHVlLWRhdGUnKTtcbiAgICAgIGNvbnN0IGlzTGF0ZSA9IHRhc2tJdGVtLnF1ZXJ5U2VsZWN0b3IoJy50YXNrLWRhdGUtaW5mbycpO1xuXG4gICAgICBkYXRlU3Bhbi50ZXh0Q29udGVudCA9ICdEdWUgYnk6ICc7XG4gICAgICB0YXNrRHVlRGF0ZS50ZXh0Q29udGVudCA9IHRhc2suZHVlRGF0ZTtcbiAgICAgIGlmIChoYXNEYXRlUGFzdCh0YXNrLmR1ZURhdGUpID09PSB0cnVlKSB7XG4gICAgICAgIGlzTGF0ZS50ZXh0Q29udGVudCA9ICdMYXRlISc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpc0xhdGUudGV4dENvbnRlbnQgPSAnJztcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgY29uc3QgdG9nZ2xlVGFza0RldGFpbHMgPSAoaW1nLCBib2R5KSA9PiB7XG4gICAgY29uc3QgYnRuSW1nID0gaW1nLmdldEF0dHJpYnV0ZSgnc3JjJyk7XG5cbiAgICBpZiAoYnRuSW1nID09PSAnLi9pY29ucy9kcm9wX2Rvd24uc3ZnJykge1xuICAgICAgaW1nLnNldEF0dHJpYnV0ZSgnc3JjJywgJy4vaWNvbnMvZHJvcF9kb3duX2xlZnQuc3ZnJyk7XG4gICAgfSBlbHNlIGlmIChidG5JbWcgPT09ICcuL2ljb25zL2Ryb3BfZG93bl9sZWZ0LnN2ZycpIHtcbiAgICAgIGltZy5zZXRBdHRyaWJ1dGUoJ3NyYycsICcuL2ljb25zL2Ryb3BfZG93bi5zdmcnKTtcbiAgICB9XG4gICAgdG9nZ2xlSGlkZGVuKGJvZHkpO1xuICB9O1xuXG4gIGNvbnN0IHJlbmRlclRhc2sgPSAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgpID0+IHtcbiAgICBjb25zdCB0YXNrUm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29uc3QgdGFza0l0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjb25zdCB0YXNrSXRlbUhlYWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbnN0IHRhc2tUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbnN0IHRpdGxlQ2hlY2tib3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIGNvbnN0IHRpdGxlTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICAgIGNvbnN0IHRhc2tJdGVtUmV2ZWFsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29uc3QgdGFza1JldmVhbEJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGNvbnN0IHRhc2tSZXZlYWxJbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICBjb25zdCB0YXNrSXRlbUJvZHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjb25zdCB0YXNrRGVzY3JpcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgY29uc3QgdGFza1N0ZXBzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcbiAgICBjb25zdCB0YXNrRGF0ZURpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbnN0IGRhdGVTcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIGNvbnN0IHRhc2tEdWVEYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIGNvbnN0IGRhdGVJbmZvU3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBjb25zdCB0YXNrUHJpb3JpdHlEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjb25zdCBwcmlvcml0eVNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgY29uc3QgdGFza1ByaW9yaXR5TGV2ZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgY29uc3QgdGFza1Jvd0J0bnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjb25zdCBlZGl0VGFza0J0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGNvbnN0IGVkaXRUYXNrSW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgY29uc3QgZGVsZXRlVGFza0J0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGNvbnN0IGRlbGV0ZVRhc2tJbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcblxuICAgIHRhc2tSb3cuY2xhc3NMaXN0LmFkZCgndGFzay1yb3cnKTtcbiAgICB0YXNrUm93LmRhdGFzZXQucHJvamVjdEluZGV4ID0gcHJvamVjdEluZGV4O1xuICAgIHRhc2tSb3cuZGF0YXNldC50YXNrSW5kZXggPSB0YXNrSW5kZXg7XG4gICAgdGFza0l0ZW0uY2xhc3NMaXN0LmFkZCgndGFzay1pdGVtJyk7XG4gICAgdGFza0l0ZW1IZWFkZXIuY2xhc3NMaXN0LmFkZCgndGFzay1pdGVtLWhlYWRlcicpO1xuICAgIHRhc2tUaXRsZS5jbGFzc0xpc3QuYWRkKCd0YXNrLXRpdGxlJyk7XG4gICAgdGl0bGVDaGVja2JveC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnY2hlY2tib3gnKTtcbiAgICB0aXRsZUNoZWNrYm94LnNldEF0dHJpYnV0ZShcbiAgICAgICduYW1lJyxcbiAgICAgIGBwcm9qZWN0JHtwcm9qZWN0SW5kZXh9LXRhc2ske3Rhc2tJbmRleH1gLFxuICAgICk7XG4gICAgdGl0bGVDaGVja2JveC5zZXRBdHRyaWJ1dGUoJ2lkJywgYHByb2plY3Qke3Byb2plY3RJbmRleH0tdGFzayR7dGFza0luZGV4fWApO1xuICAgIHRpdGxlQ2hlY2tib3guZGF0YXNldC5wcm9qZWN0SW5kZXggPSBwcm9qZWN0SW5kZXg7XG4gICAgdGl0bGVDaGVja2JveC5kYXRhc2V0LnRhc2tJbmRleCA9IHRhc2tJbmRleDtcbiAgICB0aXRsZUxhYmVsLnNldEF0dHJpYnV0ZSgnZm9yJywgYHByb2plY3Qke3Byb2plY3RJbmRleH0tdGFzayR7dGFza0luZGV4fWApO1xuICAgIHRhc2tJdGVtUmV2ZWFsLmNsYXNzTGlzdC5hZGQoJ3Rhc2staXRlbS1yZXZlYWwnKTtcbiAgICB0YXNrUmV2ZWFsQnRuLmNsYXNzTGlzdC5hZGQoJ3Rhc2stcmV2ZWFsLWJ1dHRvbicpO1xuICAgIHRhc2tSZXZlYWxJbWcuc2V0QXR0cmlidXRlKCdzcmMnLCAnLi9pY29ucy9kcm9wX2Rvd24uc3ZnJyk7XG4gICAgdGFza1JldmVhbEltZy5zZXRBdHRyaWJ1dGUoJ2FsdCcsICdzaG93IHRhc2sgZGV0YWlscyBkcm9wZG93bicpO1xuICAgIHRhc2tJdGVtQm9keS5jbGFzc0xpc3QuYWRkKCd0YXNrLWl0ZW0tYm9keScsICdoaWRkZW4nKTtcbiAgICB0YXNrRGVzY3JpcHRpb24uY2xhc3NMaXN0LmFkZCgndGFzay1kZXNjcmlwdGlvbicpO1xuICAgIHRhc2tTdGVwcy5jbGFzc0xpc3QuYWRkKCd0YXNrLXN0ZXBzJyk7XG4gICAgZGF0ZVNwYW4uY2xhc3NMaXN0LmFkZCgndGFzay1pbmZvJyk7XG4gICAgdGFza0R1ZURhdGUuY2xhc3NMaXN0LmFkZCgndGFzay1kdWUtZGF0ZScpO1xuICAgIGRhdGVJbmZvU3Bhbi5jbGFzc0xpc3QuYWRkKCd0YXNrLWRhdGUtaW5mbycpO1xuICAgIHByaW9yaXR5U3Bhbi5jbGFzc0xpc3QuYWRkKCd0YXNrLWluZm8nKTtcbiAgICBwcmlvcml0eVNwYW4udGV4dENvbnRlbnQgPSAnUHJpb3JpdHk6ICc7XG4gICAgdGFza1ByaW9yaXR5TGV2ZWwuY2xhc3NMaXN0LmFkZCgndGFzay1wcmlvcml0eS1sZXZlbCcpO1xuICAgIHRhc2tSb3dCdG5zLmNsYXNzTGlzdC5hZGQoJ3Rhc2stcm93LWJ1dHRvbnMnKTtcbiAgICBlZGl0VGFza0ltZy5zZXRBdHRyaWJ1dGUoJ3NyYycsICcuL2ljb25zL2VkaXQuc3ZnJyk7XG4gICAgZWRpdFRhc2tJbWcuc2V0QXR0cmlidXRlKCdhbHQnLCAnZWRpdCB0YXNrIGJ1dHRvbicpO1xuICAgIGVkaXRUYXNrQnRuLmRhdGFzZXQucHJvamVjdEluZGV4ID0gcHJvamVjdEluZGV4O1xuICAgIGVkaXRUYXNrQnRuLmRhdGFzZXQudGFza0luZGV4ID0gdGFza0luZGV4O1xuICAgIGRlbGV0ZVRhc2tJbWcuc2V0QXR0cmlidXRlKCdzcmMnLCAnLi9pY29ucy9kZWxldGUuc3ZnJyk7XG4gICAgZGVsZXRlVGFza0ltZy5zZXRBdHRyaWJ1dGUoJ2FsdCcsICdkZWxldGUgdGFzayBidXR0b24nKTtcbiAgICBkZWxldGVUYXNrQnRuLmRhdGFzZXQucHJvamVjdEluZGV4ID0gcHJvamVjdEluZGV4O1xuICAgIGRlbGV0ZVRhc2tCdG4uZGF0YXNldC50YXNrSW5kZXggPSB0YXNrSW5kZXg7XG5cbiAgICB1bmZpbmlzaGVkRGl2LmFwcGVuZENoaWxkKHRhc2tSb3cpO1xuICAgIHRhc2tSb3cuYXBwZW5kQ2hpbGQodGFza0l0ZW0pO1xuICAgIHRhc2tJdGVtLmFwcGVuZENoaWxkKHRhc2tJdGVtSGVhZGVyKTtcbiAgICB0YXNrSXRlbUhlYWRlci5hcHBlbmRDaGlsZCh0YXNrVGl0bGUpO1xuICAgIHRhc2tUaXRsZS5hcHBlbmRDaGlsZCh0aXRsZUNoZWNrYm94KTtcbiAgICB0YXNrVGl0bGUuYXBwZW5kQ2hpbGQodGl0bGVMYWJlbCk7XG4gICAgdGFza0l0ZW1IZWFkZXIuYXBwZW5kQ2hpbGQodGFza0l0ZW1SZXZlYWwpO1xuICAgIHRhc2tJdGVtUmV2ZWFsLmFwcGVuZENoaWxkKHRhc2tSZXZlYWxCdG4pO1xuICAgIHRhc2tSZXZlYWxCdG4uYXBwZW5kQ2hpbGQodGFza1JldmVhbEltZyk7XG4gICAgdGFza0l0ZW0uYXBwZW5kQ2hpbGQodGFza0l0ZW1Cb2R5KTtcbiAgICB0YXNrSXRlbUJvZHkuYXBwZW5kQ2hpbGQodGFza0Rlc2NyaXB0aW9uKTtcbiAgICB0YXNrSXRlbUJvZHkuYXBwZW5kQ2hpbGQodGFza1N0ZXBzKTtcbiAgICB0YXNrSXRlbUJvZHkuYXBwZW5kQ2hpbGQodGFza0RhdGVEaXYpO1xuICAgIHRhc2tEYXRlRGl2LmFwcGVuZENoaWxkKGRhdGVTcGFuKTtcbiAgICB0YXNrRGF0ZURpdi5hcHBlbmRDaGlsZCh0YXNrRHVlRGF0ZSk7XG4gICAgdGFza0RhdGVEaXYuYXBwZW5kQ2hpbGQoZGF0ZUluZm9TcGFuKTtcbiAgICB0YXNrSXRlbUJvZHkuYXBwZW5kQ2hpbGQodGFza1ByaW9yaXR5RGl2KTtcbiAgICB0YXNrUHJpb3JpdHlEaXYuYXBwZW5kQ2hpbGQocHJpb3JpdHlTcGFuKTtcbiAgICB0YXNrUHJpb3JpdHlEaXYuYXBwZW5kQ2hpbGQodGFza1ByaW9yaXR5TGV2ZWwpO1xuICAgIHRhc2tSb3cuYXBwZW5kQ2hpbGQodGFza1Jvd0J0bnMpO1xuICAgIHRhc2tSb3dCdG5zLmFwcGVuZENoaWxkKGVkaXRUYXNrQnRuKTtcbiAgICBlZGl0VGFza0J0bi5hcHBlbmRDaGlsZChlZGl0VGFza0ltZyk7XG4gICAgdGFza1Jvd0J0bnMuYXBwZW5kQ2hpbGQoZGVsZXRlVGFza0J0bik7XG4gICAgZGVsZXRlVGFza0J0bi5hcHBlbmRDaGlsZChkZWxldGVUYXNrSW1nKTtcblxuICAgIHJlbmRlclRhc2tDb250ZW50KHByb2plY3RJbmRleCwgdGFza0luZGV4KTtcblxuICAgIHRhc2tSZXZlYWxCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PlxuICAgICAgdG9nZ2xlVGFza0RldGFpbHModGFza1JldmVhbEltZywgdGFza0l0ZW1Cb2R5KSxcbiAgICApO1xuICAgIHRpdGxlQ2hlY2tib3guYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKCkgPT5cbiAgICAgIHRvZ2dsZVRhc2tTdGF0dXModGl0bGVDaGVja2JveCwgcHJvamVjdEluZGV4LCB0YXNrSW5kZXgpLFxuICAgICk7XG4gICAgZWRpdFRhc2tCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PlxuICAgICAgZWRpdFRhc2tNb2RhbC5vcGVuRWRpdFRhc2tNb2RhbChcbiAgICAgICAgZWRpdFRhc2tCdG4uZGF0YXNldC5wcm9qZWN0SW5kZXgsXG4gICAgICAgIGVkaXRUYXNrQnRuLmRhdGFzZXQudGFza0luZGV4LFxuICAgICAgKSxcbiAgICApO1xuICAgIGRlbGV0ZVRhc2tCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PlxuICAgICAgZGVsZXRlVGFza01vZGFsLm9wZW5EZWxldGVNb2RhbChcbiAgICAgICAgZGVsZXRlVGFza0J0bi5kYXRhc2V0LnByb2plY3RJbmRleCxcbiAgICAgICAgZGVsZXRlVGFza0J0bi5kYXRhc2V0LnRhc2tJbmRleCxcbiAgICAgICksXG4gICAgKTtcblxuICAgIGlmICh0aXRsZUNoZWNrYm94LmNoZWNrZWQpIHtcbiAgICAgIHNlbmRUb0ZpbmlzaGVkRGl2KHRhc2tJbmRleCk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IHVwZGF0ZVRhc2tJbmRpY2VzID0gKGRlbGV0ZWRJbmRleCkgPT4ge1xuICAgIGNvbnN0IGFsbFRhc2tJbmRpY2VzID0gbWFpblRhc2tzLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXRhc2staW5kZXhdJyk7XG4gICAgYWxsVGFza0luZGljZXMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgY29uc3QgY3VycmVudEluZGV4ID0gTnVtYmVyKGVsZW1lbnQuZGF0YXNldC50YXNrSW5kZXgpO1xuICAgICAgaWYgKGN1cnJlbnRJbmRleCA+PSBOdW1iZXIoZGVsZXRlZEluZGV4KSkge1xuICAgICAgICBlbGVtZW50LmRhdGFzZXQudGFza0luZGV4ID0gY3VycmVudEluZGV4IC0gMTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBjb25zdCByZW5kZXJEZWxldGVkVGFzayA9ICh0YXNrSW5kZXgpID0+IHtcbiAgICBjb25zdCB0YXNrVG9EZWxldGUgPSBtYWluVGFza3MucXVlcnlTZWxlY3RvcihcbiAgICAgIGBkaXZbZGF0YS10YXNrLWluZGV4PScke3Rhc2tJbmRleH0nXWAsXG4gICAgKTtcbiAgICB0YXNrVG9EZWxldGUucmVtb3ZlKCk7XG4gICAgdXBkYXRlVGFza0luZGljZXModGFza0luZGV4KTtcbiAgfTtcblxuICBjb25zdCByZW5kZXJNYWluID0gKHByb2plY3QsIHByb2plY3RJbmRleCkgPT4ge1xuICAgIHJlbmRlckhlYWRlcihwcm9qZWN0KTtcbiAgICBzZXROZXdUYXNrQnRuSW5kZXgocHJvamVjdEluZGV4KTtcbiAgICBjbGVhclRhc2tzKCk7XG4gICAgaWYgKHByb2plY3QudGFza3MubGVuZ3RoID4gMCkge1xuICAgICAgcHJvamVjdC50YXNrcy5mb3JFYWNoKCh0YXNrKSA9PlxuICAgICAgICByZW5kZXJUYXNrKHByb2plY3RJbmRleCwgcHJvamVjdC50YXNrcy5pbmRleE9mKHRhc2spKSxcbiAgICAgICk7XG4gICAgfVxuICB9O1xuXG4gIC8qIEZ1bmN0aW9uIHRvIGludm9rZSBvbiBpbml0aWxpc2UsIGZvciB0aGUgY29tcG9uZW50IHRvIHdvcmsgcHJvcGVybHkgKi9cbiAgY29uc3QgaW5pdCA9ICgpID0+IHtcbiAgICBjb25zdCBmaXJzdFByb2plY3QgPSBwcm9qZWN0TWFuYWdlci5yZXZlYWxQcm9qZWN0KDApO1xuICAgIHJlbmRlck1haW4oZmlyc3RQcm9qZWN0LCAwKTtcbiAgICBhZGROZXdUYXNrQnRuTGlzdGVuZXIoKTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIHJlbmRlckhlYWRlcixcbiAgICBzZXROZXdUYXNrQnRuSW5kZXgsXG4gICAgYWRkTmV3VGFza0J0bkxpc3RlbmVyLFxuICAgIGNsZWFyVGFza3MsXG4gICAgcmVuZGVyVGFza0NvbnRlbnQsXG4gICAgcmVuZGVyVGFzayxcbiAgICByZW5kZXJEZWxldGVkVGFzayxcbiAgICByZW5kZXJNYWluLFxuICAgIGluaXQsXG4gIH07XG59KSgpO1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLSBBc2lkZSBtb2R1bGVcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5jb25zdCBhc2lkZSA9ICgoKSA9PiB7XG4gIC8qIGNvbnN0IGZpbHRlcnNBc2lkZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2FzaWRlJyk7ICovXG4gIGNvbnN0IG1haW5UYXNrcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy51bmZpbmlzaGVkLXRhc2tzJyk7XG4gIGNvbnN0IG1haW5GaW5pc2hlZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5maW5pc2hlZC10YXNrcycpO1xuICBjb25zdCBzZWFyY2hiYXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VhcmNoLXRhc2tzJyk7XG4gIGNvbnN0IG9yZGVyT3B0aW9ucyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdvcmRlci1vcHRpb25zJyk7XG4gIGNvbnN0IHByaW9yaXR5RmlsdGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbHRlci1wcmlvcml0eS1vcHRpb25zJyk7XG4gIGNvbnN0IHN0YXR1c0ZpbHRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaWx0ZXItc3RhdHVzLW9wdGlvbnMnKTtcblxuICBjb25zdCBzZWFyY2hGb3JNYXRjaCA9ICgpID0+IHtcbiAgICBjb25zdCBpbmRleCA9IE51bWJlcihcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluLW5ldy10YXNrLWJ1dHRvbicpLmRhdGFzZXQucHJvamVjdEluZGV4LFxuICAgICk7XG4gICAgY29uc3QgY3VycmVudFByb2plY3QgPSBwcm9qZWN0TWFuYWdlci5yZXZlYWxQcm9qZWN0KGluZGV4KTtcbiAgICBjb25zdCB0ZXh0VG9Db21wYXJlID0gc2VhcmNoYmFyLnZhbHVlO1xuICAgIGNvbnN0IGZpbHRlclRhc2tzID0gKHRhc2spID0+IHtcbiAgICAgIGlmIChcbiAgICAgICAgdGFzay50aXRsZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHRleHRUb0NvbXBhcmUudG9Mb3dlckNhc2UoKSkgfHxcbiAgICAgICAgdGFzay5kZXNjcmlwdGlvbi50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHRleHRUb0NvbXBhcmUudG9Mb3dlckNhc2UoKSkgfHxcbiAgICAgICAgdGFzay5zdGVwcy5maWx0ZXIoKHN0ZXApID0+XG4gICAgICAgICAgc3RlcC5kZXNjcmlwdGlvbi50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHRleHRUb0NvbXBhcmUudG9Mb3dlckNhc2UoKSksXG4gICAgICAgICkubGVuZ3RoID4gMFxuICAgICAgKSB7XG4gICAgICAgIG1haW4ucmVuZGVyVGFzayhpbmRleCwgY3VycmVudFByb2plY3QudGFza3MuaW5kZXhPZih0YXNrKSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG5cbiAgICBpZiAodGV4dFRvQ29tcGFyZSAhPT0gJycpIHtcbiAgICAgIG1haW4uY2xlYXJUYXNrcygpO1xuICAgICAgY29uc3QgZmlsdGVyZWRUYXNrcyA9IGN1cnJlbnRQcm9qZWN0LnRhc2tzLmZpbHRlcigodGFzaykgPT5cbiAgICAgICAgZmlsdGVyVGFza3ModGFzayksXG4gICAgICApO1xuICAgICAgaWYgKGZpbHRlcmVkVGFza3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGNvbnN0IG5vVGFza3NNZXNzYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICBub1Rhc2tzTWVzc2FnZS50ZXh0Q29udGVudCA9ICdObyBtYXRjaGVzIGZvdW5kJztcbiAgICAgICAgbWFpblRhc2tzLmFwcGVuZENoaWxkKG5vVGFza3NNZXNzYWdlKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRleHRUb0NvbXBhcmUgPT09ICcnKSB7XG4gICAgICBtYWluLnJlbmRlck1haW4oY3VycmVudFByb2plY3QsIGluZGV4KTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3Qgc29ydEFUb1ogPSAoKSA9PiB7XG4gICAgY29uc3QgdGFza3NUb0RvID0gQXJyYXkuZnJvbShtYWluVGFza3MucXVlcnlTZWxlY3RvckFsbCgnLnRhc2stcm93JykpO1xuICAgIGNvbnN0IHRhc2tzRG9uZSA9IEFycmF5LmZyb20obWFpbkZpbmlzaGVkLnF1ZXJ5U2VsZWN0b3JBbGwoJy50YXNrLXJvdycpKTtcbiAgICB0YXNrc1RvRG8uc29ydCgoYSwgYikgPT4ge1xuICAgICAgY29uc3QgYVRpdGxlID0gYS5xdWVyeVNlbGVjdG9yKCdsYWJlbCcpO1xuICAgICAgY29uc3QgYlRpdGxlID0gYi5xdWVyeVNlbGVjdG9yKCdsYWJlbCcpO1xuICAgICAgaWYgKGFUaXRsZS50ZXh0Q29udGVudC50b0xvd2VyQ2FzZSgpIDwgYlRpdGxlLnRleHRDb250ZW50LnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgbWFpblRhc2tzLmluc2VydEJlZm9yZShhLCBiKTtcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgfVxuICAgICAgaWYgKGFUaXRsZS50ZXh0Q29udGVudC50b0xvd2VyQ2FzZSgpID4gYlRpdGxlLnRleHRDb250ZW50LnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgbWFpblRhc2tzLmluc2VydEJlZm9yZShiLCBhKTtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgICB9XG4gICAgICByZXR1cm4gMDtcbiAgICB9KTtcbiAgICB0YXNrc0RvbmUuc29ydCgoYSwgYikgPT4ge1xuICAgICAgY29uc3QgYVRpdGxlID0gYS5xdWVyeVNlbGVjdG9yKCdsYWJlbCcpO1xuICAgICAgY29uc3QgYlRpdGxlID0gYi5xdWVyeVNlbGVjdG9yKCdsYWJlbCcpO1xuICAgICAgaWYgKGFUaXRsZS50ZXh0Q29udGVudC50b0xvd2VyQ2FzZSgpIDwgYlRpdGxlLnRleHRDb250ZW50LnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgbWFpbkZpbmlzaGVkLmluc2VydEJlZm9yZShhLCBiKTtcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgfVxuICAgICAgaWYgKGFUaXRsZS50ZXh0Q29udGVudC50b0xvd2VyQ2FzZSgpID4gYlRpdGxlLnRleHRDb250ZW50LnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgbWFpbkZpbmlzaGVkLmluc2VydEJlZm9yZShiLCBhKTtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgICB9XG4gICAgICByZXR1cm4gMDtcbiAgICB9KTtcbiAgfTtcblxuICBjb25zdCBzb3J0WlRvQSA9ICgpID0+IHtcbiAgICBjb25zdCB0YXNrc1RvRG8gPSBBcnJheS5mcm9tKG1haW5UYXNrcy5xdWVyeVNlbGVjdG9yQWxsKCcudGFzay1yb3cnKSk7XG4gICAgY29uc3QgdGFza3NEb25lID0gQXJyYXkuZnJvbShtYWluRmluaXNoZWQucXVlcnlTZWxlY3RvckFsbCgnLnRhc2stcm93JykpO1xuICAgIHRhc2tzVG9Eby5zb3J0KChhLCBiKSA9PiB7XG4gICAgICBjb25zdCBhVGl0bGUgPSBhLnF1ZXJ5U2VsZWN0b3IoJ2xhYmVsJyk7XG4gICAgICBjb25zdCBiVGl0bGUgPSBiLnF1ZXJ5U2VsZWN0b3IoJ2xhYmVsJyk7XG4gICAgICBpZiAoYVRpdGxlLnRleHRDb250ZW50LnRvTG93ZXJDYXNlKCkgPiBiVGl0bGUudGV4dENvbnRlbnQudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICBtYWluVGFza3MuaW5zZXJ0QmVmb3JlKGEsIGIpO1xuICAgICAgICByZXR1cm4gLTE7XG4gICAgICB9XG4gICAgICBpZiAoYVRpdGxlLnRleHRDb250ZW50LnRvTG93ZXJDYXNlKCkgPCBiVGl0bGUudGV4dENvbnRlbnQudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICBtYWluVGFza3MuaW5zZXJ0QmVmb3JlKGIsIGEpO1xuICAgICAgICByZXR1cm4gMTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAwO1xuICAgIH0pO1xuICAgIHRhc2tzRG9uZS5zb3J0KChhLCBiKSA9PiB7XG4gICAgICBjb25zdCBhVGl0bGUgPSBhLnF1ZXJ5U2VsZWN0b3IoJ2xhYmVsJyk7XG4gICAgICBjb25zdCBiVGl0bGUgPSBiLnF1ZXJ5U2VsZWN0b3IoJ2xhYmVsJyk7XG4gICAgICBpZiAoYVRpdGxlLnRleHRDb250ZW50LnRvTG93ZXJDYXNlKCkgPiBiVGl0bGUudGV4dENvbnRlbnQudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICBtYWluRmluaXNoZWQuaW5zZXJ0QmVmb3JlKGEsIGIpO1xuICAgICAgICByZXR1cm4gLTE7XG4gICAgICB9XG4gICAgICBpZiAoYVRpdGxlLnRleHRDb250ZW50LnRvTG93ZXJDYXNlKCkgPCBiVGl0bGUudGV4dENvbnRlbnQudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICBtYWluRmluaXNoZWQuaW5zZXJ0QmVmb3JlKGIsIGEpO1xuICAgICAgICByZXR1cm4gMTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAwO1xuICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IGZpbHRlclByaW9yaXR5ID0gKHRhc2ssIHByaW9yaXR5TGV2ZWwsIHByb2plY3RJbmRleCwgdGFza0luZGV4KSA9PiB7XG4gICAgaWYgKHRhc2sucHJpb3JpdHkgPT09IHByaW9yaXR5TGV2ZWwpIHtcbiAgICAgIG1haW4ucmVuZGVyVGFzayhwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCk7XG4gICAgICBpZiAodGFzay5zdGF0dXMgPT09ICdkb25lJykge1xuICAgICAgICBjb25zdCByZW5kZXJlZFRhc2sgPSBtYWluRmluaXNoZWQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICBgLnRhc2stcm93W2RhdGEtdGFzay1pbmRleD0nJHt0YXNrSW5kZXh9J11gLFxuICAgICAgICApO1xuICAgICAgICBtYWluRmluaXNoZWQuYXBwZW5kQ2hpbGQocmVuZGVyZWRUYXNrKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgY29uc3Qgb3JkZXJUYXNrcyA9ICgpID0+IHtcbiAgICBjb25zdCBpbmRleCA9IE51bWJlcihcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluLW5ldy10YXNrLWJ1dHRvbicpLmRhdGFzZXQucHJvamVjdEluZGV4LFxuICAgICk7XG4gICAgY29uc3QgY3VycmVudFByb2plY3QgPSBwcm9qZWN0TWFuYWdlci5yZXZlYWxQcm9qZWN0KGluZGV4KTtcblxuICAgIHN3aXRjaCAob3JkZXJPcHRpb25zLnZhbHVlKSB7XG4gICAgICBjYXNlICdwcmlvcml0eS1oaWdoZXN0JzpcbiAgICAgICAgbWFpbi5jbGVhclRhc2tzKCk7XG4gICAgICAgIGN1cnJlbnRQcm9qZWN0LnRhc2tzLmZpbHRlcigodGFzaykgPT5cbiAgICAgICAgICBmaWx0ZXJQcmlvcml0eShcbiAgICAgICAgICAgIHRhc2ssXG4gICAgICAgICAgICAnaGlnaCcsXG4gICAgICAgICAgICBpbmRleCxcbiAgICAgICAgICAgIGN1cnJlbnRQcm9qZWN0LnRhc2tzLmluZGV4T2YodGFzayksXG4gICAgICAgICAgKSxcbiAgICAgICAgKTtcbiAgICAgICAgY3VycmVudFByb2plY3QudGFza3MuZmlsdGVyKCh0YXNrKSA9PlxuICAgICAgICAgIGZpbHRlclByaW9yaXR5KFxuICAgICAgICAgICAgdGFzayxcbiAgICAgICAgICAgICdtZWRpdW0nLFxuICAgICAgICAgICAgaW5kZXgsXG4gICAgICAgICAgICBjdXJyZW50UHJvamVjdC50YXNrcy5pbmRleE9mKHRhc2spLFxuICAgICAgICAgICksXG4gICAgICAgICk7XG4gICAgICAgIGN1cnJlbnRQcm9qZWN0LnRhc2tzLmZpbHRlcigodGFzaykgPT5cbiAgICAgICAgICBmaWx0ZXJQcmlvcml0eShcbiAgICAgICAgICAgIHRhc2ssXG4gICAgICAgICAgICAnbG93JyxcbiAgICAgICAgICAgIGluZGV4LFxuICAgICAgICAgICAgY3VycmVudFByb2plY3QudGFza3MuaW5kZXhPZih0YXNrKSxcbiAgICAgICAgICApLFxuICAgICAgICApO1xuICAgICAgICBjdXJyZW50UHJvamVjdC50YXNrcy5maWx0ZXIoKHRhc2spID0+XG4gICAgICAgICAgZmlsdGVyUHJpb3JpdHkoXG4gICAgICAgICAgICB0YXNrLFxuICAgICAgICAgICAgJ25vbmUnLFxuICAgICAgICAgICAgaW5kZXgsXG4gICAgICAgICAgICBjdXJyZW50UHJvamVjdC50YXNrcy5pbmRleE9mKHRhc2spLFxuICAgICAgICAgICksXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncHJpb3JpdHktbG93ZXN0JzpcbiAgICAgICAgbWFpbi5jbGVhclRhc2tzKCk7XG4gICAgICAgIGN1cnJlbnRQcm9qZWN0LnRhc2tzLmZpbHRlcigodGFzaykgPT5cbiAgICAgICAgICBmaWx0ZXJQcmlvcml0eShcbiAgICAgICAgICAgIHRhc2ssXG4gICAgICAgICAgICAnbm9uZScsXG4gICAgICAgICAgICBpbmRleCxcbiAgICAgICAgICAgIGN1cnJlbnRQcm9qZWN0LnRhc2tzLmluZGV4T2YodGFzayksXG4gICAgICAgICAgKSxcbiAgICAgICAgKTtcbiAgICAgICAgY3VycmVudFByb2plY3QudGFza3MuZmlsdGVyKCh0YXNrKSA9PlxuICAgICAgICAgIGZpbHRlclByaW9yaXR5KFxuICAgICAgICAgICAgdGFzayxcbiAgICAgICAgICAgICdsb3cnLFxuICAgICAgICAgICAgaW5kZXgsXG4gICAgICAgICAgICBjdXJyZW50UHJvamVjdC50YXNrcy5pbmRleE9mKHRhc2spLFxuICAgICAgICAgICksXG4gICAgICAgICk7XG4gICAgICAgIGN1cnJlbnRQcm9qZWN0LnRhc2tzLmZpbHRlcigodGFzaykgPT5cbiAgICAgICAgICBmaWx0ZXJQcmlvcml0eShcbiAgICAgICAgICAgIHRhc2ssXG4gICAgICAgICAgICAnbWVkaXVtJyxcbiAgICAgICAgICAgIGluZGV4LFxuICAgICAgICAgICAgY3VycmVudFByb2plY3QudGFza3MuaW5kZXhPZih0YXNrKSxcbiAgICAgICAgICApLFxuICAgICAgICApO1xuICAgICAgICBjdXJyZW50UHJvamVjdC50YXNrcy5maWx0ZXIoKHRhc2spID0+XG4gICAgICAgICAgZmlsdGVyUHJpb3JpdHkoXG4gICAgICAgICAgICB0YXNrLFxuICAgICAgICAgICAgJ2hpZ2gnLFxuICAgICAgICAgICAgaW5kZXgsXG4gICAgICAgICAgICBjdXJyZW50UHJvamVjdC50YXNrcy5pbmRleE9mKHRhc2spLFxuICAgICAgICAgICksXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnQS1aJzpcbiAgICAgICAgc29ydEFUb1ooKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdaLUEnOlxuICAgICAgICBzb3J0WlRvQSgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIG1haW4ucmVuZGVyTWFpbihjdXJyZW50UHJvamVjdCwgaW5kZXgpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgZmlsdGVyUHJpb3JpdHlPcHRpb25zID0gKCkgPT4ge1xuICAgIGNvbnN0IGluZGV4ID0gTnVtYmVyKFxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW4tbmV3LXRhc2stYnV0dG9uJykuZGF0YXNldC5wcm9qZWN0SW5kZXgsXG4gICAgKTtcbiAgICBjb25zdCBjdXJyZW50UHJvamVjdCA9IHByb2plY3RNYW5hZ2VyLnJldmVhbFByb2plY3QoaW5kZXgpO1xuXG4gICAgc3dpdGNoIChwcmlvcml0eUZpbHRlci52YWx1ZSkge1xuICAgICAgY2FzZSAnaGlnaCc6XG4gICAgICAgIG1haW4uY2xlYXJUYXNrcygpO1xuICAgICAgICBjdXJyZW50UHJvamVjdC50YXNrcy5maWx0ZXIoKHRhc2spID0+XG4gICAgICAgICAgZmlsdGVyUHJpb3JpdHkoXG4gICAgICAgICAgICB0YXNrLFxuICAgICAgICAgICAgJ2hpZ2gnLFxuICAgICAgICAgICAgaW5kZXgsXG4gICAgICAgICAgICBjdXJyZW50UHJvamVjdC50YXNrcy5pbmRleE9mKHRhc2spLFxuICAgICAgICAgICksXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbWVkaXVtJzpcbiAgICAgICAgbWFpbi5jbGVhclRhc2tzKCk7XG4gICAgICAgIGN1cnJlbnRQcm9qZWN0LnRhc2tzLmZpbHRlcigodGFzaykgPT5cbiAgICAgICAgICBmaWx0ZXJQcmlvcml0eShcbiAgICAgICAgICAgIHRhc2ssXG4gICAgICAgICAgICAnbWVkaXVtJyxcbiAgICAgICAgICAgIGluZGV4LFxuICAgICAgICAgICAgY3VycmVudFByb2plY3QudGFza3MuaW5kZXhPZih0YXNrKSxcbiAgICAgICAgICApLFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2xvdyc6XG4gICAgICAgIG1haW4uY2xlYXJUYXNrcygpO1xuICAgICAgICBjdXJyZW50UHJvamVjdC50YXNrcy5maWx0ZXIoKHRhc2spID0+XG4gICAgICAgICAgZmlsdGVyUHJpb3JpdHkoXG4gICAgICAgICAgICB0YXNrLFxuICAgICAgICAgICAgJ2xvdycsXG4gICAgICAgICAgICBpbmRleCxcbiAgICAgICAgICAgIGN1cnJlbnRQcm9qZWN0LnRhc2tzLmluZGV4T2YodGFzayksXG4gICAgICAgICAgKSxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdub25lJzpcbiAgICAgICAgbWFpbi5jbGVhclRhc2tzKCk7XG4gICAgICAgIGN1cnJlbnRQcm9qZWN0LnRhc2tzLmZpbHRlcigodGFzaykgPT5cbiAgICAgICAgICBmaWx0ZXJQcmlvcml0eShcbiAgICAgICAgICAgIHRhc2ssXG4gICAgICAgICAgICAnbm9uZScsXG4gICAgICAgICAgICBpbmRleCxcbiAgICAgICAgICAgIGN1cnJlbnRQcm9qZWN0LnRhc2tzLmluZGV4T2YodGFzayksXG4gICAgICAgICAgKSxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBtYWluLnJlbmRlck1haW4oY3VycmVudFByb2plY3QsIGluZGV4KTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGZpbHRlclN0YXR1cyA9ICh0YXNrLCB0YXNrU3RhdHVzLCBwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCkgPT4ge1xuICAgIGlmICh0YXNrLnN0YXR1cyA9PT0gdGFza1N0YXR1cykge1xuICAgICAgbWFpbi5yZW5kZXJUYXNrKHByb2plY3RJbmRleCwgdGFza0luZGV4KTtcbiAgICAgIC8qIGlmICh0YXNrLnN0YXR1cyA9PT0gJ2RvbmUnKSB7XG4gICAgICAgIGNvbnN0IHJlbmRlcmVkVGFzayA9IG1haW5GaW5pc2hlZC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAgIGAudGFzay1yb3dbZGF0YS10YXNrLWluZGV4PScke3Rhc2tJbmRleH0nXWAsXG4gICAgICAgICk7XG4gICAgICAgIG1haW5GaW5pc2hlZC5hcHBlbmRDaGlsZChyZW5kZXJlZFRhc2spO1xuICAgICAgfSAqL1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICBjb25zdCBmaWx0ZXJTdGF0dXNPcHRpb25zID0gKCkgPT4ge1xuICAgIGNvbnN0IGluZGV4ID0gTnVtYmVyKFxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW4tbmV3LXRhc2stYnV0dG9uJykuZGF0YXNldC5wcm9qZWN0SW5kZXgsXG4gICAgKTtcbiAgICBjb25zdCBjdXJyZW50UHJvamVjdCA9IHByb2plY3RNYW5hZ2VyLnJldmVhbFByb2plY3QoaW5kZXgpO1xuXG4gICAgc3dpdGNoIChzdGF0dXNGaWx0ZXIudmFsdWUpIHtcbiAgICAgIGNhc2UgJ3RvLWRvJzpcbiAgICAgICAgbWFpbi5jbGVhclRhc2tzKCk7XG4gICAgICAgIGN1cnJlbnRQcm9qZWN0LnRhc2tzLmZpbHRlcigodGFzaykgPT5cbiAgICAgICAgICBmaWx0ZXJTdGF0dXMoXG4gICAgICAgICAgICB0YXNrLFxuICAgICAgICAgICAgJ3RvIGRvJyxcbiAgICAgICAgICAgIGluZGV4LFxuICAgICAgICAgICAgY3VycmVudFByb2plY3QudGFza3MuaW5kZXhPZih0YXNrKSxcbiAgICAgICAgICApLFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2RvbmUnOlxuICAgICAgICBtYWluLmNsZWFyVGFza3MoKTtcbiAgICAgICAgY3VycmVudFByb2plY3QudGFza3MuZmlsdGVyKCh0YXNrKSA9PlxuICAgICAgICAgIGZpbHRlclN0YXR1cyh0YXNrLCAnZG9uZScsIGluZGV4LCBjdXJyZW50UHJvamVjdC50YXNrcy5pbmRleE9mKHRhc2spKSxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBtYWluLnJlbmRlck1haW4oY3VycmVudFByb2plY3QsIGluZGV4KTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGFkZFNlYXJjaGJhckxJc3RlbmVyID0gKCkgPT4ge1xuICAgIHNlYXJjaGJhci5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIHNlYXJjaEZvck1hdGNoKTtcbiAgfTtcblxuICBjb25zdCBhZGRPcmRlck9wdGlvbnNMaXN0ZW5lciA9ICgpID0+IHtcbiAgICBvcmRlck9wdGlvbnMuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgb3JkZXJUYXNrcyk7XG4gIH07XG5cbiAgY29uc3QgYWRkUHJpb3JpdHlGaWx0ZXJMaXN0ZW5lciA9ICgpID0+IHtcbiAgICBwcmlvcml0eUZpbHRlci5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmaWx0ZXJQcmlvcml0eU9wdGlvbnMpO1xuICB9O1xuXG4gIGNvbnN0IGFkZFN0YXR1c0ZpbHRlckxpc3RlbmVyID0gKCkgPT4ge1xuICAgIHN0YXR1c0ZpbHRlci5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmaWx0ZXJTdGF0dXNPcHRpb25zKTtcbiAgfTtcblxuICAvKiBGdW5jdGlvbiB0byBpbnZva2Ugb24gaW5pdGlsaXNlLCBmb3IgdGhlIGNvbXBvbmVudCB0byB3b3JrIHByb3Blcmx5ICovXG4gIGNvbnN0IGluaXQgPSAoKSA9PiB7XG4gICAgYWRkU2VhcmNoYmFyTElzdGVuZXIoKTtcbiAgICBhZGRPcmRlck9wdGlvbnNMaXN0ZW5lcigpO1xuICAgIGFkZFByaW9yaXR5RmlsdGVyTGlzdGVuZXIoKTtcbiAgICBhZGRTdGF0dXNGaWx0ZXJMaXN0ZW5lcigpO1xuICB9O1xuXG4gIHJldHVybiB7IGluaXQgfTtcbn0pKCk7XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4tIE1vZHVsZSB0byBjb250cm9sIHRoaW5ncyBjb21tb24gbW9zdCBtb2RhbHNcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5jb25zdCBhbGxNb2RhbHMgPSAoKCkgPT4ge1xuICAvKiBHZW5lcmFsIGZ1bmN0aW9ucyB0byBjbG9zZSBtb2RhbHMgYW5kIGNsZWFyIGlucHV0cyAqL1xuICBjb25zdCBjbGVhcklucHV0cyA9IChtb2RhbCkgPT4ge1xuICAgIGNvbnN0IGlucHV0cyA9IG1vZGFsLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0Jyk7XG4gICAgY29uc3QgdGV4dGFyZWFzID0gbW9kYWwucXVlcnlTZWxlY3RvckFsbCgndGV4dGFyZWEnKTtcbiAgICBjb25zdCBzZWxlY3RPcHRpb24gPSBtb2RhbC5xdWVyeVNlbGVjdG9yKCdvcHRpb24nKTtcbiAgICBjb25zdCBzdGVwc0xpc3QgPSBtb2RhbC5xdWVyeVNlbGVjdG9yKCcubW9kYWwtc3RlcHMtbGlzdCcpO1xuICAgIGlmIChpbnB1dHMpIHtcbiAgICAgIGlucHV0cy5mb3JFYWNoKChpbnB1dCkgPT4ge1xuICAgICAgICBpbnB1dC52YWx1ZSA9ICcnO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGlmICh0ZXh0YXJlYXMpIHtcbiAgICAgIHRleHRhcmVhcy5mb3JFYWNoKCh0ZXh0YXJlYSkgPT4ge1xuICAgICAgICB0ZXh0YXJlYS52YWx1ZSA9ICcnO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChzZWxlY3RPcHRpb24pIHtcbiAgICAgIHNlbGVjdE9wdGlvbi5zZWxlY3RlZCA9IHRydWU7XG4gICAgfVxuICAgIGlmIChzdGVwc0xpc3QpIHtcbiAgICAgIHN0ZXBzQ29tcG9uZW50LmNsZWFyQWxsU3RlcHMoc3RlcHNMaXN0KTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgY2xvc2VNb2RhbCA9IChtb2RhbCkgPT4ge1xuICAgIGNsZWFySW5wdXRzKG1vZGFsKTtcbiAgICB0b2dnbGVIaWRkZW4obW9kYWwpO1xuICB9O1xuXG4gIC8qIEZ1bmN0aW9ucyB0byBpbnZva2Ugb24gaW5pdGlsaXNlLCBmb3IgdGhlIGNvbXBvbmVudCB0byB3b3JrIHByb3Blcmx5ICovXG4gIGNvbnN0IGFkZENsb3NlQnRuTGlzdGVuZXJzID0gKCkgPT4ge1xuICAgIGNvbnN0IGNsb3NlTW9kYWxCdG5zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm1vZGFsLWNsb3NlLWJ1dHRvbicpO1xuXG4gICAgY2xvc2VNb2RhbEJ0bnMuZm9yRWFjaCgoYnRuKSA9PiB7XG4gICAgICBjb25zdCBtb2RhbCA9IGJ0bi5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudDtcbiAgICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IGNsb3NlTW9kYWwobW9kYWwpKTtcbiAgICB9KTtcbiAgfTtcblxuICBjb25zdCBhZGRDbG9zZUJhY2tncm91bmRMaXN0ZW5lcnMgPSAoKSA9PiB7XG4gICAgY29uc3QgbW9kYWxCYWNrZ3JvdW5kcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5tb2RhbC1iYWNrZ3JvdW5kJyk7XG4gICAgY29uc3QgY2xvc2UgPSAoZSwgbW9kYWxCYWNrZ3JvdW5kKSA9PiB7XG4gICAgICBpZiAoIWUudGFyZ2V0LmNsb3Nlc3QoJy5tb2RhbCcpKSB7XG4gICAgICAgIGNsb3NlTW9kYWwobW9kYWxCYWNrZ3JvdW5kKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgbW9kYWxCYWNrZ3JvdW5kcy5mb3JFYWNoKChiYWNrZ3JvdW5kKSA9PiB7XG4gICAgICBiYWNrZ3JvdW5kLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IGNsb3NlKGUsIGJhY2tncm91bmQpKTtcbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4geyBjbG9zZU1vZGFsLCBhZGRDbG9zZUJ0bkxpc3RlbmVycywgYWRkQ2xvc2VCYWNrZ3JvdW5kTGlzdGVuZXJzIH07XG59KSgpO1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLSAnTmV3IExpc3QnIG1vZGFsIG1vZHVsZVxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbmNvbnN0IG5ld0xpc3RNb2RhbCA9ICgoKSA9PiB7XG4gIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5ldy1saXN0LW1vZGFsJykucGFyZW50RWxlbWVudDtcbiAgY29uc3Qgc3VibWl0QnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25ldy1saXN0LXN1Ym1pdC1idXR0b24nKTtcblxuICBjb25zdCBjcmVhdE5ld0xpc3QgPSAoZSkgPT4ge1xuICAgIGNvbnN0IHRpdGxlSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmV3LWxpc3QtbmFtZScpLnZhbHVlO1xuICAgIGNvbnN0IGRlc2NyaXB0aW9uSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcbiAgICAgICduZXctbGlzdC1kZXNjcmlwdGlvbicsXG4gICAgKS52YWx1ZTtcbiAgICBjb25zdCBpbmRleCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduYXYtdG9kby1saXN0cycpLmNoaWxkcmVuLmxlbmd0aDtcblxuICAgIGlmICh0aXRsZUlucHV0ICE9PSAnJykge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICBjb25zdCBuZXdMaXN0ID0gcHJvamVjdE1hbmFnZXIuY3JlYXRlTmV3UHJvamVjdChcbiAgICAgICAgdGl0bGVJbnB1dCxcbiAgICAgICAgZGVzY3JpcHRpb25JbnB1dCxcbiAgICAgICk7XG4gICAgICBuYXZiYXIucmVuZGVyTmV3TGlzdChuZXdMaXN0LCBuYXZiYXIuY2FsY3VsYXRlTmV3UHJvamVjdEluZGV4KCkpO1xuICAgICAgbWFpbi5yZW5kZXJNYWluKHByb2plY3RNYW5hZ2VyLnJldmVhbFByb2plY3QoaW5kZXggKyAxKSwgaW5kZXggKyAxKTtcblxuICAgICAgYWxsTW9kYWxzLmNsb3NlTW9kYWwobW9kYWwpO1xuICAgIH1cbiAgfTtcblxuICAvKiBGdW5jdGlvbiB0byBpbnZva2Ugb24gaW5pdGlsaXNlLCBmb3IgdGhlIGNvbXBvbmVudCB0byB3b3JrIHByb3Blcmx5ICovXG4gIGNvbnN0IGFkZFN1Ym1pdEJ0bkxpc3RlbmVyID0gKCkgPT4ge1xuICAgIHN1Ym1pdEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiBjcmVhdE5ld0xpc3QoZSkpO1xuICB9O1xuXG4gIHJldHVybiB7IGFkZFN1Ym1pdEJ0bkxpc3RlbmVyIH07XG59KSgpO1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLSAnRWRpdCBsaXN0JyBtb2RhbCBtb2R1bGVcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5jb25zdCBlZGl0TGlzdE1vZGFsID0gKCgpID0+IHtcbiAgY29uc3QgbW9kYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZWRpdC1saXN0LW1vZGFsJykucGFyZW50RWxlbWVudDtcbiAgY29uc3QgZWRpdEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlZGl0LWxpc3Qtc3VibWl0LWJ1dHRvbicpO1xuXG4gIGNvbnN0IHNldFByb2plY3REYXRhSW5kZXggPSAocHJvamVjdEluZGV4KSA9PiB7XG4gICAgZWRpdEJ0bi5kYXRhc2V0LnByb2plY3RJbmRleCA9IHByb2plY3RJbmRleDtcbiAgfTtcblxuICBjb25zdCBvcGVuRWRpdE1vZGFsID0gKHByb2plY3RJbmRleCkgPT4ge1xuICAgIGNvbnN0IHRpdGxlSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZWRpdC1saXN0LW5hbWUnKTtcbiAgICBjb25zdCBkZXNjcmlwdGlvbklucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VkaXQtbGlzdC1kZXNjcmlwdGlvbicpO1xuICAgIGNvbnN0IHByb2plY3RUb0VkaXQgPSBwcm9qZWN0TWFuYWdlci5yZXZlYWxQcm9qZWN0KE51bWJlcihwcm9qZWN0SW5kZXgpKTtcblxuICAgIHRpdGxlSW5wdXQudmFsdWUgPSBwcm9qZWN0VG9FZGl0LnRpdGxlO1xuICAgIGRlc2NyaXB0aW9uSW5wdXQudmFsdWUgPSBwcm9qZWN0VG9FZGl0LmRlc2NyaXB0aW9uO1xuXG4gICAgc2V0UHJvamVjdERhdGFJbmRleChwcm9qZWN0SW5kZXgpO1xuICAgIHRvZ2dsZUhpZGRlbihtb2RhbCk7XG4gIH07XG5cbiAgY29uc3QgZWRpdExpc3QgPSAoZSkgPT4ge1xuICAgIGNvbnN0IHRpdGxlSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZWRpdC1saXN0LW5hbWUnKS52YWx1ZTtcbiAgICBjb25zdCBkZXNjcmlwdGlvbklucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG4gICAgICAnZWRpdC1saXN0LWRlc2NyaXB0aW9uJyxcbiAgICApLnZhbHVlO1xuICAgIGNvbnN0IGluZGV4ID0gTnVtYmVyKGVkaXRCdG4uZGF0YXNldC5wcm9qZWN0SW5kZXgpO1xuXG4gICAgaWYgKHRpdGxlSW5wdXQgIT09ICcnKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBwcm9qZWN0TWFuYWdlci5lZGl0UHJvamVjdFRpdGxlKGluZGV4LCB0aXRsZUlucHV0KTtcbiAgICAgIHByb2plY3RNYW5hZ2VyLmVkaXRQcm9qZWN0RGVzY3JpcHRpb24oaW5kZXgsIGRlc2NyaXB0aW9uSW5wdXQpO1xuICAgICAgY29uc3QgZWRpdGVkUHJvamVjdCA9IHByb2plY3RNYW5hZ2VyLnJldmVhbFByb2plY3QoaW5kZXgpO1xuICAgICAgbmF2YmFyLnJlbmRlckVkaXRlZExpc3QoaW5kZXgsIGVkaXRlZFByb2plY3QpO1xuICAgICAgbWFpbi5yZW5kZXJNYWluKGVkaXRlZFByb2plY3QsIGluZGV4KTtcbiAgICAgIGFsbE1vZGFscy5jbG9zZU1vZGFsKG1vZGFsKTtcbiAgICB9XG4gIH07XG5cbiAgLyogRnVuY3Rpb24gdG8gaW52b2tlIG9uIGluaXRpbGlzZSwgZm9yIHRoZSBjb21wb25lbnQgdG8gd29yayBwcm9wZXJseSAqL1xuICBjb25zdCBhZGRFZGl0QnRuTGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgZWRpdEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiBlZGl0TGlzdChlKSk7XG4gIH07XG5cbiAgcmV0dXJuIHsgb3BlbkVkaXRNb2RhbCwgYWRkRWRpdEJ0bkxpc3RlbmVyIH07XG59KSgpO1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLSAnRGVsZXRlIGxpc3QnIG1vZGFsIG1vZHVsZVxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbmNvbnN0IGRlbGV0ZUxpc3RNb2RhbCA9ICgoKSA9PiB7XG4gIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRlbGV0ZS1saXN0LW1vZGFsJykucGFyZW50RWxlbWVudDtcbiAgY29uc3QgY2FuY2VsQnRuID0gbW9kYWwucXVlcnlTZWxlY3RvcignLmNhbmNlbC1idXR0b24nKTtcbiAgY29uc3QgZGVsZXRlQnRuID0gbW9kYWwucXVlcnlTZWxlY3RvcignLmRlbGV0ZS1idXR0b24nKTtcblxuICBjb25zdCBzZXRQcm9qZWN0RGF0YUluZGV4ID0gKHByb2plY3RJbmRleCkgPT4ge1xuICAgIGRlbGV0ZUJ0bi5kYXRhc2V0LnByb2plY3RJbmRleCA9IHByb2plY3RJbmRleDtcbiAgfTtcblxuICBjb25zdCBvcGVuRGVsZXRlTW9kYWwgPSAocHJvamVjdEluZGV4KSA9PiB7XG4gICAgc2V0UHJvamVjdERhdGFJbmRleChwcm9qZWN0SW5kZXgpO1xuICAgIHRvZ2dsZUhpZGRlbihtb2RhbCk7XG4gIH07XG5cbiAgY29uc3QgZGVsZXRlTGlzdCA9ICgpID0+IHtcbiAgICBjb25zdCBpbmRleCA9IE51bWJlcihkZWxldGVCdG4uZGF0YXNldC5wcm9qZWN0SW5kZXgpO1xuICAgIHByb2plY3RNYW5hZ2VyLmRlbGV0ZVByb2plY3QoaW5kZXgpO1xuICAgIG5hdmJhci5yZW5kZXJEZWxldGVkTGlzdChpbmRleCk7XG4gICAgbWFpbi5yZW5kZXJNYWluKHByb2plY3RNYW5hZ2VyLnJldmVhbFByb2plY3QoMCksIDApO1xuICAgIHRvZ2dsZUhpZGRlbihtb2RhbCk7XG4gIH07XG5cbiAgLyogRnVuY3Rpb25zIHRvIGludm9rZSBvbiBpbml0aWxpc2UsIGZvciB0aGUgY29tcG9uZW50IHRvIHdvcmsgcHJvcGVybHkgKi9cbiAgY29uc3QgYWRkQ2FuY2VsQnRuTGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgY2FuY2VsQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gdG9nZ2xlSGlkZGVuKG1vZGFsKSk7XG4gIH07XG5cbiAgY29uc3QgYWRkRGVsZXRlQnRuTGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgZGVsZXRlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZGVsZXRlTGlzdCk7XG4gIH07XG5cbiAgcmV0dXJuIHsgb3BlbkRlbGV0ZU1vZGFsLCBhZGRDYW5jZWxCdG5MaXN0ZW5lciwgYWRkRGVsZXRlQnRuTGlzdGVuZXIgfTtcbn0pKCk7XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4tICdOZXcgdGFzaycgbW9kYWwgbW9kdWxlXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuY29uc3QgbmV3VGFza01vZGFsID0gKCgpID0+IHtcbiAgY29uc3QgbW9kYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmV3LXRhc2stbW9kYWwnKS5wYXJlbnRFbGVtZW50O1xuICBjb25zdCBuZXdUYXNrQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25ldy10YXNrLXN1Ym1pdC1idXR0b24nKTtcbiAgY29uc3Qgc3RlcHNMaXN0ID0gbW9kYWwucXVlcnlTZWxlY3RvcignLm1vZGFsLXN0ZXBzLWxpc3QnKTtcblxuICBjb25zdCBzZXRQcm9qZWN0RGF0YUluZGV4ID0gKHByb2plY3RJbmRleCkgPT4ge1xuICAgIG5ld1Rhc2tCdG4uZGF0YXNldC5wcm9qZWN0SW5kZXggPSBwcm9qZWN0SW5kZXg7XG4gIH07XG5cbiAgY29uc3Qgb3Blbk5ld1Rhc2tNb2RhbCA9IChwcm9qZWN0SW5kZXgpID0+IHtcbiAgICBzZXRQcm9qZWN0RGF0YUluZGV4KHByb2plY3RJbmRleCk7XG4gICAgc3RlcHNDb21wb25lbnQuY2xlYXJBbGxTdGVwcyhzdGVwc0xpc3QpO1xuICAgIHRvZ2dsZUhpZGRlbihtb2RhbCk7XG4gIH07XG5cbiAgY29uc3Qgc3VibWl0TmV3VGFzayA9IChlKSA9PiB7XG4gICAgY29uc3QgcHJvamVjdEluZGV4ID0gTnVtYmVyKG5ld1Rhc2tCdG4uZGF0YXNldC5wcm9qZWN0SW5kZXgpO1xuICAgIGNvbnN0IG5ld1RpdGxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25ldy10YXNrLW5hbWUnKS52YWx1ZTtcbiAgICBjb25zdCBuZXdEZXNjcmlwdGlvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuICAgICAgJ25ldy10YXNrLWRlc2NyaXB0aW9uJyxcbiAgICApLnZhbHVlO1xuICAgIGNvbnN0IG5ld0RhdGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmV3LXRhc2stZGF0ZScpLnZhbHVlO1xuICAgIGNvbnN0IG5ld1ByaW9yaXR5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25ldy10YXNrLXByaW9yaXR5JykudmFsdWU7XG4gICAgY29uc3QgbmV3U3RlcHMgPSBzdGVwc0NvbXBvbmVudC5yZXZlYWxTdGVwcygpO1xuXG4gICAgaWYgKG5ld1RpdGxlICE9PSAnJykge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgdGFza01hbmFnZXIuY3JlYXRlTmV3VGFzayhcbiAgICAgICAgcHJvamVjdEluZGV4LFxuICAgICAgICBuZXdUaXRsZSxcbiAgICAgICAgbmV3RGVzY3JpcHRpb24sXG4gICAgICAgIG5ld0RhdGUsXG4gICAgICAgIG5ld1ByaW9yaXR5LFxuICAgICAgICAndG8gZG8nLFxuICAgICAgKTtcbiAgICAgIGNvbnN0IGxlbmd0aCA9IHByb2plY3RNYW5hZ2VyLnJldmVhbFByb2plY3RUYXNrc0xlbmd0aChwcm9qZWN0SW5kZXgpO1xuICAgICAgbmV3U3RlcHMuZm9yRWFjaCgoc3RlcCkgPT4ge1xuICAgICAgICBzdGVwTWFuYWdlci5jcmVhdGVOZXdTdGVwKFxuICAgICAgICAgIHByb2plY3RJbmRleCxcbiAgICAgICAgICBsZW5ndGggLSAxLFxuICAgICAgICAgIHN0ZXAuZGVzY3JpcHRpb24sXG4gICAgICAgICAgc3RlcC5zdGF0dXMsXG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICAgIG1haW4ucmVuZGVyVGFzayhwcm9qZWN0SW5kZXgsIGxlbmd0aCAtIDEpO1xuICAgICAgYWxsTW9kYWxzLmNsb3NlTW9kYWwobW9kYWwpO1xuICAgIH1cbiAgfTtcblxuICAvKiBGdW5jdGlvbnMgdG8gaW52b2tlIG9uIGluaXRpbGlzZSwgZm9yIHRoZSBjb21wb25lbnQgdG8gd29yayBwcm9wZXJseSAqL1xuICBjb25zdCBhZGROZXdUYXNrQnRuTElzdGVuZXIgPSAoKSA9PiB7XG4gICAgbmV3VGFza0J0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiBzdWJtaXROZXdUYXNrKGUpKTtcbiAgfTtcblxuICByZXR1cm4geyBvcGVuTmV3VGFza01vZGFsLCBhZGROZXdUYXNrQnRuTElzdGVuZXIgfTtcbn0pKCk7XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4tICdFZGl0IHRhc2snIG1vZGFsIG1vZHVsZVxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbmNvbnN0IGVkaXRUYXNrTW9kYWwgPSAoKCkgPT4ge1xuICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5lZGl0LXRhc2stbW9kYWwnKS5wYXJlbnRFbGVtZW50O1xuICBjb25zdCBlZGl0QnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VkaXQtdGFzay1zdWJtaXQtYnV0dG9uJyk7XG4gIGNvbnN0IHN0ZXBzTGlzdCA9IG1vZGFsLnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbC1zdGVwcy1saXN0Jyk7XG4gIGNvbnN0IHRpdGxlSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZWRpdC10YXNrLW5hbWUnKTtcbiAgY29uc3QgZGVzY3JpcHRpb25JbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlZGl0LXRhc2stZGVzY3JpcHRpb24nKTtcbiAgY29uc3QgZGF0ZUlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VkaXQtdGFzay1kYXRlJyk7XG4gIGNvbnN0IHByaW9yaXR5SW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZWRpdC10YXNrLXByaW9yaXR5Jyk7XG5cbiAgY29uc3Qgc2V0UHJvamVjdERhdGFJbmRleCA9IChwcm9qZWN0SW5kZXgpID0+IHtcbiAgICBlZGl0QnRuLmRhdGFzZXQucHJvamVjdEluZGV4ID0gcHJvamVjdEluZGV4O1xuICB9O1xuXG4gIGNvbnN0IHNldFRhc2tEYXRhSW5kZXggPSAodGFza0luZGV4KSA9PiB7XG4gICAgZWRpdEJ0bi5kYXRhc2V0LnRhc2tJbmRleCA9IHRhc2tJbmRleDtcbiAgfTtcblxuICBjb25zdCBvcGVuRWRpdFRhc2tNb2RhbCA9IChwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCkgPT4ge1xuICAgIGNvbnN0IHRhc2tUb0VkaXQgPSB0YXNrTWFuYWdlci5yZXZlYWxUYXNrKHByb2plY3RJbmRleCwgdGFza0luZGV4KTtcblxuICAgIHNldFByb2plY3REYXRhSW5kZXgocHJvamVjdEluZGV4KTtcbiAgICBzZXRUYXNrRGF0YUluZGV4KHRhc2tJbmRleCk7XG4gICAgdGl0bGVJbnB1dC52YWx1ZSA9IHRhc2tUb0VkaXQudGl0bGU7XG4gICAgZGVzY3JpcHRpb25JbnB1dC52YWx1ZSA9IHRhc2tUb0VkaXQuZGVzY3JpcHRpb247XG4gICAgdGFza1RvRWRpdC5zdGVwcy5mb3JFYWNoKChzdGVwKSA9PlxuICAgICAgc3RlcHNDb21wb25lbnQubWFrZVN0ZXAoc3RlcCwgc3RlcHNMaXN0KSxcbiAgICApO1xuICAgIGlmICh0YXNrVG9FZGl0LmR1ZURhdGUgIT09ICcnKSB7XG4gICAgICBkYXRlSW5wdXQudmFsdWUgPSB0YXNrVG9FZGl0LmR1ZURhdGU7XG4gICAgfVxuICAgIHByaW9yaXR5SW5wdXQudmFsdWUgPSB0YXNrVG9FZGl0LnByaW9yaXR5O1xuICAgIHRvZ2dsZUhpZGRlbihtb2RhbCk7XG4gIH07XG5cbiAgY29uc3QgZWRpdFRhc2sgPSAoZSkgPT4ge1xuICAgIGlmICh0aXRsZUlucHV0LnZhbHVlICE9PSAnJykge1xuICAgICAgY29uc3QgcHJvamVjdEluZGV4ID0gTnVtYmVyKGVkaXRCdG4uZGF0YXNldC5wcm9qZWN0SW5kZXgpO1xuICAgICAgY29uc3QgdGFza0luZGV4ID0gTnVtYmVyKGVkaXRCdG4uZGF0YXNldC50YXNrSW5kZXgpO1xuICAgICAgY29uc3QgdGFza1RvRWRpdCA9IHRhc2tNYW5hZ2VyLnJldmVhbFRhc2socHJvamVjdEluZGV4LCB0YXNrSW5kZXgpO1xuICAgICAgY29uc3Qgb2xkU3RlcHMgPSB0YXNrVG9FZGl0LnN0ZXBzO1xuICAgICAgY29uc3QgZWRpdGVkU3RlcHMgPSBzdGVwc0NvbXBvbmVudC5yZXZlYWxTdGVwcygpO1xuXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB0YXNrTWFuYWdlci5lZGl0VGFza1RpdGxlKHByb2plY3RJbmRleCwgdGFza0luZGV4LCB0aXRsZUlucHV0LnZhbHVlKTtcbiAgICAgIHRhc2tNYW5hZ2VyLmVkaXRUYXNrRGVzY3JpcHRpb24oXG4gICAgICAgIHByb2plY3RJbmRleCxcbiAgICAgICAgdGFza0luZGV4LFxuICAgICAgICBkZXNjcmlwdGlvbklucHV0LnZhbHVlLFxuICAgICAgKTtcbiAgICAgIHRhc2tNYW5hZ2VyLmVkaXRUYXNrRHVlRGF0ZShwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCwgZGF0ZUlucHV0LnZhbHVlKTtcbiAgICAgIHRhc2tNYW5hZ2VyLmVkaXRUYXNrUHJpb3JpdHkoXG4gICAgICAgIHByb2plY3RJbmRleCxcbiAgICAgICAgdGFza0luZGV4LFxuICAgICAgICBwcmlvcml0eUlucHV0LnZhbHVlLFxuICAgICAgKTtcbiAgICAgIGlmIChvbGRTdGVwcy5sZW5ndGggPiAwICYmIGVkaXRlZFN0ZXBzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZm9yIChcbiAgICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgICAgaSA8IE1hdGgubWluKG9sZFN0ZXBzLmxlbmd0aCwgZWRpdGVkU3RlcHMubGVuZ3RoKTtcbiAgICAgICAgICBpKytcbiAgICAgICAgKSB7XG4gICAgICAgICAgaWYgKGVkaXRlZFN0ZXBzW2ldLmRlc2NyaXB0aW9uICE9PSBvbGRTdGVwc1tpXS5kZXNjcmlwdGlvbikge1xuICAgICAgICAgICAgc3RlcE1hbmFnZXIuZWRpdFN0ZXBEZXNjcmlwdGlvbihcbiAgICAgICAgICAgICAgcHJvamVjdEluZGV4LFxuICAgICAgICAgICAgICB0YXNrSW5kZXgsXG4gICAgICAgICAgICAgIGksXG4gICAgICAgICAgICAgIGVkaXRlZFN0ZXBzW2ldLmRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGVkaXRlZFN0ZXBzW2ldLnN0YXR1cyAhPT0gb2xkU3RlcHNbaV0uc3RhdHVzKSB7XG4gICAgICAgICAgICBzdGVwTWFuYWdlci5lZGl0U3RlcFN0YXR1cyhcbiAgICAgICAgICAgICAgcHJvamVjdEluZGV4LFxuICAgICAgICAgICAgICB0YXNrSW5kZXgsXG4gICAgICAgICAgICAgIGksXG4gICAgICAgICAgICAgIGVkaXRlZFN0ZXBzW2ldLnN0YXR1cyxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChvbGRTdGVwcy5sZW5ndGggPiBlZGl0ZWRTdGVwcy5sZW5ndGgpIHtcbiAgICAgICAgICBsZXQgaSA9IG9sZFN0ZXBzLmxlbmd0aCAtIDE7XG4gICAgICAgICAgd2hpbGUgKGkgPj0gZWRpdGVkU3RlcHMubGVuZ3RoKSB7XG4gICAgICAgICAgICBzdGVwTWFuYWdlci5kZWxldGVTdGVwKHByb2plY3RJbmRleCwgdGFza0luZGV4LCBpKTtcbiAgICAgICAgICAgIGktLTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAob2xkU3RlcHMubGVuZ3RoIDwgZWRpdGVkU3RlcHMubGVuZ3RoKSB7XG4gICAgICAgICAgZm9yIChsZXQgaSA9IG9sZFN0ZXBzLmxlbmd0aDsgaSA8IGVkaXRlZFN0ZXBzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBzdGVwTWFuYWdlci5jcmVhdGVOZXdTdGVwKFxuICAgICAgICAgICAgICBwcm9qZWN0SW5kZXgsXG4gICAgICAgICAgICAgIHRhc2tJbmRleCxcbiAgICAgICAgICAgICAgZWRpdGVkU3RlcHNbaV0uZGVzY3JpcHRpb24sXG4gICAgICAgICAgICAgIGVkaXRlZFN0ZXBzW2ldLnN0YXR1cyxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKG9sZFN0ZXBzLmxlbmd0aCA9PT0gMCAmJiBlZGl0ZWRTdGVwcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGVkaXRlZFN0ZXBzLmZvckVhY2goKHN0ZXApID0+IHtcbiAgICAgICAgICBzdGVwTWFuYWdlci5jcmVhdGVOZXdTdGVwKFxuICAgICAgICAgICAgcHJvamVjdEluZGV4LFxuICAgICAgICAgICAgdGFza0luZGV4LFxuICAgICAgICAgICAgc3RlcC5kZXNjcmlwdGlvbixcbiAgICAgICAgICAgIHN0ZXAuc3RhdHVzLFxuICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmIChvbGRTdGVwcy5sZW5ndGggPiAwICYmIGVkaXRlZFN0ZXBzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBsZXQgaSA9IG9sZFN0ZXBzLmxlbmd0aCAtIDE7XG4gICAgICAgIHdoaWxlIChpID49IDApIHtcbiAgICAgICAgICBzdGVwTWFuYWdlci5kZWxldGVTdGVwKHByb2plY3RJbmRleCwgdGFza0luZGV4LCBpKTtcbiAgICAgICAgICBpLS07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIG1haW4ucmVuZGVyVGFza0NvbnRlbnQocHJvamVjdEluZGV4LCB0YXNrSW5kZXgpO1xuICAgICAgYWxsTW9kYWxzLmNsb3NlTW9kYWwobW9kYWwpO1xuICAgIH1cbiAgfTtcblxuICAvKiBGdW5jdGlvbiB0byBpbnZva2Ugb24gaW5pdGlsaXNlLCBmb3IgdGhlIGNvbXBvbmVudCB0byB3b3JrIHByb3Blcmx5ICovXG4gIGNvbnN0IGFkZEVkaXRCdG5MaXN0ZW5lciA9ICgpID0+IHtcbiAgICBlZGl0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IGVkaXRUYXNrKGUpKTtcbiAgfTtcblxuICByZXR1cm4geyBvcGVuRWRpdFRhc2tNb2RhbCwgYWRkRWRpdEJ0bkxpc3RlbmVyIH07XG59KSgpO1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLSAnRGVsZXRlIHRhc2snIG1vZGFsIG1vZHVsZVxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbmNvbnN0IGRlbGV0ZVRhc2tNb2RhbCA9ICgoKSA9PiB7XG4gIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRlbGV0ZS10YXNrLW1vZGFsJykucGFyZW50RWxlbWVudDtcbiAgY29uc3QgY2FuY2VsQnRuID0gbW9kYWwucXVlcnlTZWxlY3RvcignLmNhbmNlbC1idXR0b24nKTtcbiAgY29uc3QgZGVsZXRlQnRuID0gbW9kYWwucXVlcnlTZWxlY3RvcignLmRlbGV0ZS1idXR0b24nKTtcblxuICBjb25zdCBzZXRQcm9qZWN0RGF0YUluZGV4ID0gKHByb2plY3RJbmRleCkgPT4ge1xuICAgIGRlbGV0ZUJ0bi5kYXRhc2V0LnByb2plY3RJbmRleCA9IHByb2plY3RJbmRleDtcbiAgfTtcblxuICBjb25zdCBzZXRUYXNrRGF0YUluZGV4ID0gKHRhc2tJbmRleCkgPT4ge1xuICAgIGRlbGV0ZUJ0bi5kYXRhc2V0LnRhc2tJbmRleCA9IHRhc2tJbmRleDtcbiAgfTtcblxuICBjb25zdCBvcGVuRGVsZXRlTW9kYWwgPSAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgpID0+IHtcbiAgICBzZXRQcm9qZWN0RGF0YUluZGV4KHByb2plY3RJbmRleCk7XG4gICAgc2V0VGFza0RhdGFJbmRleCh0YXNrSW5kZXgpO1xuICAgIHRvZ2dsZUhpZGRlbihtb2RhbCk7XG4gIH07XG5cbiAgY29uc3QgZGVsZXRlVGFzayA9ICgpID0+IHtcbiAgICBjb25zdCBwcm9qZWN0SW5kZXggPSBOdW1iZXIoZGVsZXRlQnRuLmRhdGFzZXQucHJvamVjdEluZGV4KTtcbiAgICBjb25zdCB0YXNrSW5kZXggPSBOdW1iZXIoZGVsZXRlQnRuLmRhdGFzZXQudGFza0luZGV4KTtcbiAgICB0YXNrTWFuYWdlci5kZWxldGVUYXNrKHByb2plY3RJbmRleCwgdGFza0luZGV4KTtcbiAgICBtYWluLnJlbmRlckRlbGV0ZWRUYXNrKHRhc2tJbmRleCk7XG4gICAgdG9nZ2xlSGlkZGVuKG1vZGFsKTtcbiAgfTtcblxuICAvKiBGdW5jdGlvbnMgdG8gaW52b2tlIG9uIGluaXRpbGlzZSwgZm9yIHRoZSBjb21wb25lbnQgdG8gd29yayBwcm9wZXJseSAqL1xuICBjb25zdCBhZGRDYW5jZWxCdG5MaXN0ZW5lciA9ICgpID0+IHtcbiAgICBjYW5jZWxCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB0b2dnbGVIaWRkZW4obW9kYWwpKTtcbiAgfTtcblxuICBjb25zdCBhZGREZWxldGVCdG5MaXN0ZW5lciA9ICgpID0+IHtcbiAgICBkZWxldGVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBkZWxldGVUYXNrKTtcbiAgfTtcbiAgcmV0dXJuIHsgb3BlbkRlbGV0ZU1vZGFsLCBhZGRDYW5jZWxCdG5MaXN0ZW5lciwgYWRkRGVsZXRlQnRuTGlzdGVuZXIgfTtcbn0pKCk7XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4tIFN0ZXBzIGNvbXBvbmVudCBtb2R1bGVcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5jb25zdCBzdGVwc0NvbXBvbmVudCA9ICgoKSA9PiB7XG4gIC8qIFZhcmlhYmxlcyBmb3IgdGhlICdOZXcgdGFzaycgbW9kYWwgKi9cbiAgY29uc3QgbW9kYWxOZXcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmV3LXRhc2stbW9kYWwnKS5wYXJlbnRFbGVtZW50O1xuICBjb25zdCBzdGVwc0xpc3ROZXcgPSBtb2RhbE5ldy5xdWVyeVNlbGVjdG9yKCcubW9kYWwtc3RlcHMtbGlzdCcpO1xuICBjb25zdCBhZGRTdGVwQnRuTmV3ID0gbW9kYWxOZXcucXVlcnlTZWxlY3RvcignLmFkZC1zdGVwLWJ1dHRvbicpO1xuICAvKiBWYXJpYWJsZXMgZm9yIHRoZSAnRWRpdCB0YXNrJyBtb2RhbCAqL1xuICBjb25zdCBtb2RhbEVkaXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZWRpdC10YXNrLW1vZGFsJykucGFyZW50RWxlbWVudDtcbiAgY29uc3Qgc3RlcHNMaXN0RWRpdCA9IG1vZGFsRWRpdC5xdWVyeVNlbGVjdG9yKCcubW9kYWwtc3RlcHMtbGlzdCcpO1xuICBjb25zdCBhZGRTdGVwQnRuRWRpdCA9IG1vZGFsRWRpdC5xdWVyeVNlbGVjdG9yKCcuYWRkLXN0ZXAtYnV0dG9uJyk7XG5cbiAgY29uc3Qgc3RlcHMgPSBbXTtcblxuICBjb25zdCBjbGVhckFsbFN0ZXBzID0gKHVsKSA9PiB7XG4gICAgY29uc3QgdWxUb0NsZWFyID0gdWw7XG4gICAgc3RlcHMubGVuZ3RoID0gMDtcbiAgICB1bFRvQ2xlYXIuaW5uZXJIVE1MID0gJyc7XG4gIH07XG5cbiAgY29uc3QgcmV2ZWFsU3RlcHMgPSAoKSA9PiBzdGVwcztcblxuICBjb25zdCByZW5kZXJTdGVwID0gKGxpc3RJdGVtLCBzdGVwLCBpbmRleCwgc3RlcHNMaXN0KSA9PiB7XG4gICAgY29uc3QgY2hlY2tib3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIGNvbnN0IGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgICBjb25zdCBlZGl0U3RlcEJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGNvbnN0IGVkaXRTdGVwSW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgY29uc3QgZGVsZXRlU3RlcEJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGNvbnN0IGRlbGV0ZVN0ZXBJbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcblxuICAgIGNoZWNrYm94LnNldEF0dHJpYnV0ZSgndHlwZScsICdjaGVja2JveCcpO1xuICAgIGNoZWNrYm94LnNldEF0dHJpYnV0ZSgnbmFtZScsIGBzdGVwLXN0YXR1cy0ke2luZGV4fWApO1xuICAgIGNoZWNrYm94LnNldEF0dHJpYnV0ZSgnaWQnLCBgc3RlcC1zdGF0dXMtJHtpbmRleH1gKTtcbiAgICBjaGVja2JveC5kYXRhc2V0LnN0ZXBJbmRleCA9IGluZGV4O1xuICAgIGlmIChzdGVwLnN0YXR1cyA9PT0gJ2RvbmUnKSB7XG4gICAgICBjaGVja2JveC5jaGVja2VkID0gdHJ1ZTtcbiAgICB9XG4gICAgbGFiZWwuc2V0QXR0cmlidXRlKCdmb3InLCBgc3RlcC1zdGF0dXMtJHtpbmRleH1gKTtcbiAgICBsYWJlbC50ZXh0Q29udGVudCA9IHN0ZXAuZGVzY3JpcHRpb247XG4gICAgZWRpdFN0ZXBCdG4uY2xhc3NMaXN0LmFkZCgnc3RlcHMtbGlzdC1pdGVtLWJ1dHRvbicpO1xuICAgIGVkaXRTdGVwQnRuLmRhdGFzZXQuc3RlcEluZGV4ID0gaW5kZXg7XG4gICAgZWRpdFN0ZXBJbWcuc2V0QXR0cmlidXRlKCdzcmMnLCAnLi9pY29ucy9lZGl0LnN2ZycpO1xuICAgIGVkaXRTdGVwSW1nLnNldEF0dHJpYnV0ZSgnYWx0JywgJ2VkaXQgc3RlcCBidXR0b24nKTtcbiAgICBkZWxldGVTdGVwQnRuLmNsYXNzTGlzdC5hZGQoJ3N0ZXBzLWxpc3QtaXRlbS1idXR0b24nKTtcbiAgICBkZWxldGVTdGVwQnRuLmRhdGFzZXQuc3RlcEluZGV4ID0gaW5kZXg7XG4gICAgZGVsZXRlU3RlcEltZy5zZXRBdHRyaWJ1dGUoJ3NyYycsICcuL2ljb25zL2RlbGV0ZS5zdmcnKTtcbiAgICBkZWxldGVTdGVwSW1nLnNldEF0dHJpYnV0ZSgnYWx0JywgJ2RlbGV0ZSBzdGVwIGJ1dHRvbicpO1xuXG4gICAgY2hlY2tib3guYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKCkgPT5cbiAgICAgIHVwZGF0ZVN0ZXBTdGF0dXMoY2hlY2tib3guY2hlY2tlZCwgTnVtYmVyKGNoZWNrYm94LmRhdGFzZXQuc3RlcEluZGV4KSksXG4gICAgKTtcbiAgICBlZGl0U3RlcEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldikgPT5cbiAgICAgIHJlbmRlckVkaXRTdGVwKGV2LCBlZGl0U3RlcEJ0bi5kYXRhc2V0LnN0ZXBJbmRleCwgc3RlcHNMaXN0KSxcbiAgICApO1xuICAgIGRlbGV0ZVN0ZXBCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXYpID0+XG4gICAgICBkZWxldGVTdGVwKGV2LCBkZWxldGVTdGVwQnRuLmRhdGFzZXQuc3RlcEluZGV4LCBzdGVwc0xpc3QpLFxuICAgICk7XG5cbiAgICBsaXN0SXRlbS5hcHBlbmRDaGlsZChjaGVja2JveCk7XG4gICAgbGlzdEl0ZW0uYXBwZW5kQ2hpbGQobGFiZWwpO1xuICAgIGxpc3RJdGVtLmFwcGVuZENoaWxkKGVkaXRTdGVwQnRuKTtcbiAgICBlZGl0U3RlcEJ0bi5hcHBlbmRDaGlsZChlZGl0U3RlcEltZyk7XG4gICAgbGlzdEl0ZW0uYXBwZW5kQ2hpbGQoZGVsZXRlU3RlcEJ0bik7XG4gICAgZGVsZXRlU3RlcEJ0bi5hcHBlbmRDaGlsZChkZWxldGVTdGVwSW1nKTtcbiAgfTtcblxuICBjb25zdCB1cGRhdGVTdGVwSWRpY2VzID0gKHN0ZXBzTGlzdCkgPT4ge1xuICAgIGNvbnN0IGFsbFN0ZXBzID0gc3RlcHNMaXN0LmNoaWxkcmVuO1xuICAgIGxldCBpbmRleCA9IDA7XG4gICAgZm9yIChjb25zdCBsaXN0SXRlbSBvZiBhbGxTdGVwcykge1xuICAgICAgY29uc3QgY2hlY2tib3ggPSBsaXN0SXRlbS5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpO1xuICAgICAgY29uc3QgbGFiZWwgPSBsaXN0SXRlbS5xdWVyeVNlbGVjdG9yKCdsYWJlbCcpO1xuICAgICAgY29uc3QgYnV0dG9ucyA9IGxpc3RJdGVtLnF1ZXJ5U2VsZWN0b3JBbGwoJy5zdGVwcy1saXN0LWl0ZW0tYnV0dG9uJyk7XG5cbiAgICAgIGNoZWNrYm94LnNldEF0dHJpYnV0ZSgnbmFtZScsIGBzdGVwLXN0YXR1cy0ke2luZGV4fWApO1xuICAgICAgY2hlY2tib3guc2V0QXR0cmlidXRlKCdpZCcsIGBzdGVwLXN0YXR1cy0ke2luZGV4fWApO1xuICAgICAgY2hlY2tib3guZGF0YXNldC5zdGVwSW5kZXggPSBpbmRleDtcbiAgICAgIGxhYmVsLnNldEF0dHJpYnV0ZSgnZm9yJywgYHN0ZXAtc3RhdHVzLSR7aW5kZXh9YCk7XG4gICAgICBidXR0b25zLmZvckVhY2goKGJ1dHRvbikgPT4ge1xuICAgICAgICBidXR0b24uZGF0YXNldC5zdGVwSW5kZXggPSBpbmRleDtcbiAgICAgIH0pO1xuICAgICAgaW5kZXggKz0gMTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgdXBkYXRlU3RlcFN0YXR1cyA9IChuZXdTdGF0dXMsIGluZGV4KSA9PiB7XG4gICAgaWYgKG5ld1N0YXR1cyA9PT0gdHJ1ZSkge1xuICAgICAgc3RlcHNbaW5kZXhdLnN0YXR1cyA9ICdkb25lJztcbiAgICB9IGVsc2UgaWYgKG5ld1N0YXR1cyA9PT0gZmFsc2UpIHtcbiAgICAgIHN0ZXBzW2luZGV4XS5zdGF0dXMgPSAndG8gZG8nO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBlZGl0U3RlcCA9IChlLCBzdGVwSW5kZXgsIGVkaXRlZFN0ZXBWYWx1ZSwgc3RlcHNMaXN0KSA9PiB7XG4gICAgY29uc3Qgc3RlcFRvRWRpdCA9IGUudGFyZ2V0LmNsb3Nlc3QoJ2xpJyk7XG4gICAgY29uc3QgaW5wdXQgPSBzdGVwVG9FZGl0LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0Jyk7XG4gICAgY29uc3Qgc3VibWl0U3RlcEJ0biA9IGlucHV0Lm5leHRFbGVtZW50U2libGluZztcblxuICAgIGlmIChlZGl0ZWRTdGVwVmFsdWUgIT09ICcnKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgc3RlcHNbc3RlcEluZGV4XS5kZXNjcmlwdGlvbiA9IGVkaXRlZFN0ZXBWYWx1ZTtcbiAgICAgIGlucHV0LnJlbW92ZSgpO1xuICAgICAgc3VibWl0U3RlcEJ0bi5yZW1vdmUoKTtcbiAgICAgIHJlbmRlclN0ZXAoc3RlcFRvRWRpdCwgc3RlcHNbc3RlcEluZGV4XSwgc3RlcEluZGV4LCBzdGVwc0xpc3QpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCByZW5kZXJFZGl0U3RlcCA9IChldiwgaW5kZXgsIHN0ZXBzTGlzdCkgPT4ge1xuICAgIGNvbnN0IHN0ZXBJbmRleCA9IE51bWJlcihpbmRleCk7XG4gICAgY29uc3Qgc3RlcFRvRWRpdCA9IGV2LnRhcmdldC5jbG9zZXN0KCdsaScpO1xuICAgIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICBjb25zdCBzdWJtaXRTdGVwQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgY29uc3Qgc3VibWl0SW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG5cbiAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIHN0ZXBUb0VkaXQuaW5uZXJIVE1MID0gJyc7XG5cbiAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAndGV4dCcpO1xuICAgIGlucHV0LnNldEF0dHJpYnV0ZSgnbmFtZScsICdtb2RhbC1lZGl0LXN0ZXAnKTtcbiAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoJ2lkJywgJ21vZGFsLWVkaXQtc3RlcCcpO1xuICAgIGlucHV0LnJlcXVpcmVkID0gdHJ1ZTtcbiAgICBpbnB1dC52YWx1ZSA9IHN0ZXBzW3N0ZXBJbmRleF0uZGVzY3JpcHRpb247XG4gICAgc3VibWl0U3RlcEJ0bi50ZXh0Q29udGVudCA9ICdBbHRlciBzdGVwJztcbiAgICBzdWJtaXRJbWcuc2V0QXR0cmlidXRlKCdzcmMnLCAnLi9pY29ucy9jb25maXJtLnN2ZycpO1xuICAgIHN1Ym1pdEltZy5zZXRBdHRyaWJ1dGUoJ2FsdCcsICdjb25maXJtIGVkaXQgYnV0dG9uJyk7XG5cbiAgICBzdGVwVG9FZGl0LmFwcGVuZENoaWxkKGlucHV0KTtcbiAgICBzdGVwVG9FZGl0LmFwcGVuZENoaWxkKHN1Ym1pdFN0ZXBCdG4pO1xuICAgIHN1Ym1pdFN0ZXBCdG4uYXBwZW5kQ2hpbGQoc3VibWl0SW1nKTtcblxuICAgIHN1Ym1pdFN0ZXBCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT5cbiAgICAgIGVkaXRTdGVwKGUsIHN0ZXBJbmRleCwgaW5wdXQudmFsdWUsIHN0ZXBzTGlzdCksXG4gICAgKTtcbiAgfTtcblxuICBjb25zdCBkZWxldGVTdGVwID0gKGV2LCBpbmRleCwgc3RlcHNMaXN0KSA9PiB7XG4gICAgY29uc3Qgc3RlcEluZGV4ID0gTnVtYmVyKGluZGV4KTtcbiAgICBjb25zdCBzdGVwVG9EZWxldGUgPSBldi50YXJnZXQuY2xvc2VzdCgnbGknKTtcblxuICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgc3RlcHMuc3BsaWNlKHN0ZXBJbmRleCwgMSk7XG4gICAgc3RlcFRvRGVsZXRlLnJlbW92ZSgpO1xuICAgIHVwZGF0ZVN0ZXBJZGljZXMoc3RlcHNMaXN0KTtcbiAgfTtcblxuICBjb25zdCBtYWtlU3RlcCA9IChzdGVwLCBzdGVwc0xpc3QpID0+IHtcbiAgICBjb25zdCBsaXN0SXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG5cbiAgICBzdGVwcy5wdXNoKHN0ZXApO1xuICAgIHN0ZXBzTGlzdC5hcHBlbmRDaGlsZChsaXN0SXRlbSk7XG4gICAgcmVuZGVyU3RlcChsaXN0SXRlbSwgc3RlcHNbc3RlcHMubGVuZ3RoIC0gMV0sIHN0ZXBzLmxlbmd0aCAtIDEsIHN0ZXBzTGlzdCk7XG4gIH07XG5cbiAgY29uc3QgYWRkTmV3U3RlcCA9IChldnQsIHN0ZXBzTGlzdCwgbmV3U3RlcEJ0bikgPT4ge1xuICAgIGNvbnN0IG5ld1N0ZXBEZXNjcmlwdGlvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RhbC1hZGQtc3RlcCcpO1xuICAgIGNvbnN0IHN0ZXBDcmVhdG9yID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGFsLWFkZC1zdGVwJykucGFyZW50RWxlbWVudDtcblxuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBpZiAobmV3U3RlcERlc2NyaXB0aW9uLnZhbHVlICE9PSAnJykge1xuICAgICAgY29uc3Qgc3RlcCA9IHtcbiAgICAgICAgZGVzY3JpcHRpb246IG5ld1N0ZXBEZXNjcmlwdGlvbi52YWx1ZSxcbiAgICAgICAgc3RhdHVzOiAndG8gZG8nLFxuICAgICAgfTtcbiAgICAgIG1ha2VTdGVwKHN0ZXAsIHN0ZXBzTGlzdCk7XG4gICAgfVxuICAgIHRvZ2dsZUhpZGRlbihuZXdTdGVwQnRuKTtcbiAgICBzdGVwQ3JlYXRvci5yZW1vdmUoKTtcbiAgfTtcblxuICBjb25zdCByZW5kZXJDcmVhdGVTdGVwID0gKGUsIHN0ZXBzTGlzdCwgbmV3U3RlcEJ0bikgPT4ge1xuICAgIGNvbnN0IGxpc3RJdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgY29uc3Qgc3VibWl0U3RlcEJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGNvbnN0IHN1Ym1pdEltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGlucHV0LnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0Jyk7XG4gICAgaW5wdXQuc2V0QXR0cmlidXRlKCduYW1lJywgJ21vZGFsLWFkZC1zdGVwJyk7XG4gICAgaW5wdXQuc2V0QXR0cmlidXRlKCdpZCcsICdtb2RhbC1hZGQtc3RlcCcpO1xuICAgIHN1Ym1pdFN0ZXBCdG4udGV4dENvbnRlbnQgPSAnQWRkIHN0ZXAnO1xuICAgIHN1Ym1pdEltZy5zZXRBdHRyaWJ1dGUoJ3NyYycsICcuL2ljb25zL2NvbmZpcm0uc3ZnJyk7XG4gICAgc3VibWl0SW1nLnNldEF0dHJpYnV0ZSgnYWx0JywgJ2NvbmZpcm0gc3RlcCBidXR0b24nKTtcblxuICAgIHN1Ym1pdFN0ZXBCdG4uYXBwZW5kQ2hpbGQoc3VibWl0SW1nKTtcbiAgICBsaXN0SXRlbS5hcHBlbmRDaGlsZChpbnB1dCk7XG4gICAgbGlzdEl0ZW0uYXBwZW5kQ2hpbGQoc3VibWl0U3RlcEJ0bik7XG4gICAgc3RlcHNMaXN0LmFwcGVuZENoaWxkKGxpc3RJdGVtKTtcblxuICAgIHN1Ym1pdFN0ZXBCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZ0KSA9PlxuICAgICAgYWRkTmV3U3RlcChldnQsIHN0ZXBzTGlzdCwgbmV3U3RlcEJ0biksXG4gICAgKTtcbiAgICB0b2dnbGVIaWRkZW4obmV3U3RlcEJ0bik7XG4gIH07XG5cbiAgLyogRnVuY3Rpb24gdG8gaW52b2tlIG9uIGluaXRpbGlzZSwgZm9yIHRoZSBjb21wb25lbnQgdG8gd29yayBwcm9wZXJseSAqL1xuICBjb25zdCBhZGROZXdTdGVwQnRuTGlzdGVuZXJzID0gKCkgPT4ge1xuICAgIGFkZFN0ZXBCdG5OZXcuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT5cbiAgICAgIHJlbmRlckNyZWF0ZVN0ZXAoZSwgc3RlcHNMaXN0TmV3LCBhZGRTdGVwQnRuTmV3KSxcbiAgICApO1xuICAgIGFkZFN0ZXBCdG5FZGl0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+XG4gICAgICByZW5kZXJDcmVhdGVTdGVwKGUsIHN0ZXBzTGlzdEVkaXQsIGFkZFN0ZXBCdG5FZGl0KSxcbiAgICApO1xuICB9O1xuXG4gIHJldHVybiB7IGNsZWFyQWxsU3RlcHMsIHJldmVhbFN0ZXBzLCBtYWtlU3RlcCwgYWRkTmV3U3RlcEJ0bkxpc3RlbmVycyB9O1xufSkoKTtcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi0gSW5pdGlhbGlzZXIgZnVuY3Rpb25cbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5jb25zdCBpbml0aWFsaXNlVUkgPSAoKSA9PiB7XG4gIGhlYWRlci5hZGRIZWFkZXJMaXN0ZW5lcnMoKTtcblxuICBuYXZiYXIuaW5pdCgpO1xuXG4gIG1haW4uaW5pdCgpO1xuXG4gIGFzaWRlLmluaXQoKTtcblxuICBhbGxNb2RhbHMuYWRkQ2xvc2VCdG5MaXN0ZW5lcnMoKTtcbiAgYWxsTW9kYWxzLmFkZENsb3NlQmFja2dyb3VuZExpc3RlbmVycygpO1xuXG4gIG5ld0xpc3RNb2RhbC5hZGRTdWJtaXRCdG5MaXN0ZW5lcigpO1xuICBlZGl0TGlzdE1vZGFsLmFkZEVkaXRCdG5MaXN0ZW5lcigpO1xuICBkZWxldGVMaXN0TW9kYWwuYWRkQ2FuY2VsQnRuTGlzdGVuZXIoKTtcbiAgZGVsZXRlTGlzdE1vZGFsLmFkZERlbGV0ZUJ0bkxpc3RlbmVyKCk7XG4gIG5ld1Rhc2tNb2RhbC5hZGROZXdUYXNrQnRuTElzdGVuZXIoKTtcbiAgZWRpdFRhc2tNb2RhbC5hZGRFZGl0QnRuTGlzdGVuZXIoKTtcbiAgZGVsZXRlVGFza01vZGFsLmFkZENhbmNlbEJ0bkxpc3RlbmVyKCk7XG4gIGRlbGV0ZVRhc2tNb2RhbC5hZGREZWxldGVCdG5MaXN0ZW5lcigpO1xuXG4gIHN0ZXBzQ29tcG9uZW50LmFkZE5ld1N0ZXBCdG5MaXN0ZW5lcnMoKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGluaXRpYWxpc2VVSTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgcHJvamVjdE1hbmFnZXIgfSBmcm9tICcuL3RvRG9MaXN0JztcbmltcG9ydCBpbml0aWFsaXNlVUkgZnJvbSAnLi91aSc7XG5cbnByb2plY3RNYW5hZ2VyLmluaXRpYWxpc2UoKTtcbmluaXRpYWxpc2VVSSgpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9