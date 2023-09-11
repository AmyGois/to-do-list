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

  /* Function to invoke on initilise, for the component to work properly */
  const addSearchbarLIstener = () => {
    searchbar.addEventListener('keyup', searchForMatch);
  };

  const addOrderOptionsListener = () => {
    orderOptions.addEventListener('change', orderTasks);
  };

  return { addSearchbarLIstener, addOrderOptionsListener };
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
  aside.addOrderOptionsListener();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsV0FBVztBQUNYLENBQUM7O0FBRUQsaUVBQWUsY0FBYyxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNuQjlCOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDdUM7O0FBRXZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEVBQUUsZ0RBQWM7QUFDaEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwyQkFBMkIsZ0RBQWM7QUFDekM7QUFDQTtBQUNBLE1BQU07QUFDTixzQkFBc0IsMkJBQTJCO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFbUQ7Ozs7Ozs7Ozs7Ozs7Ozs7QUNoV3BEOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ3NFOztBQUV0RTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsV0FBVztBQUNYLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwwQkFBMEIsV0FBVztBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsUUFBUSxxREFBYztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw4QkFBOEIsVUFBVTtBQUN4QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsK0JBQStCLFVBQVU7QUFDekM7QUFDQTtBQUNBOztBQUVBO0FBQ0Esa0JBQWtCLHFEQUFjO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLHFEQUFjO0FBQ3BDLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBLDhCQUE4QixVQUFVO0FBQ3hDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsOEJBQThCLFVBQVU7QUFDeEM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFNLGtEQUFXO0FBQ2pCO0FBQ0EsTUFBTTtBQUNOLE1BQU0sa0RBQVc7QUFDakI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFNLGtEQUFXO0FBQ2pCLE1BQU07QUFDTixNQUFNLGtEQUFXO0FBQ2pCO0FBQ0E7O0FBRUE7QUFDQSxpQkFBaUIsa0RBQVc7QUFDNUI7QUFDQSw2Q0FBNkMsVUFBVTtBQUN2RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLGFBQWEsT0FBTyxVQUFVLE9BQU8sTUFBTTtBQUM3RDtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsYUFBYSxPQUFPLFVBQVUsT0FBTyxNQUFNO0FBQzdEO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixhQUFhLE9BQU8sVUFBVSxPQUFPLE1BQU07QUFDN0Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsYUFBYSxPQUFPLFVBQVU7QUFDOUM7QUFDQSwrQ0FBK0MsYUFBYSxPQUFPLFVBQVU7QUFDN0U7QUFDQTtBQUNBLDZDQUE2QyxhQUFhLE9BQU8sVUFBVTtBQUMzRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQSw4QkFBOEIsVUFBVTtBQUN4QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EseUJBQXlCLHFEQUFjO0FBQ3ZDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJEQUEyRDtBQUMzRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQixxREFBYztBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3QyxVQUFVO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLHFEQUFjOztBQUV6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsV0FBVztBQUNYLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUEsV0FBVztBQUNYLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLHNCQUFzQixxREFBYztBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQixxREFBYzs7QUFFcEM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFdBQVc7QUFDWCxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLHFEQUFjOztBQUV4QztBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQU0scURBQWM7QUFDcEIsTUFBTSxxREFBYztBQUNwQiw0QkFBNEIscURBQWM7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxXQUFXO0FBQ1gsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLElBQUkscURBQWM7QUFDbEI7QUFDQSxvQkFBb0IscURBQWM7QUFDbEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsV0FBVztBQUNYLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFNLGtEQUFXO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLHFEQUFjO0FBQ25DO0FBQ0EsUUFBUSxrREFBVztBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFdBQVc7QUFDWCxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHVCQUF1QixrREFBVzs7QUFFbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUIsa0RBQVc7QUFDcEM7QUFDQTs7QUFFQTtBQUNBLE1BQU0sa0RBQVc7QUFDakIsTUFBTSxrREFBVztBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sa0RBQVc7QUFDakIsTUFBTSxrREFBVztBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxrREFBVztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksa0RBQVc7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLGtEQUFXO0FBQ3ZCO0FBQ0E7QUFDQSxVQUFVO0FBQ1Ysd0NBQXdDLHdCQUF3QjtBQUNoRSxZQUFZLGtEQUFXO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0EsVUFBVSxrREFBVztBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULFFBQVE7QUFDUjtBQUNBO0FBQ0EsVUFBVSxrREFBVztBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxXQUFXO0FBQ1gsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBSSxrREFBVztBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1gsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlEQUFpRCxNQUFNO0FBQ3ZELCtDQUErQyxNQUFNO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDLE1BQU07QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxtREFBbUQsTUFBTTtBQUN6RCxpREFBaUQsTUFBTTtBQUN2RDtBQUNBLCtDQUErQyxNQUFNO0FBQ3JEO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxXQUFXO0FBQ1gsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsaUVBQWUsWUFBWSxFQUFDOzs7Ozs7O1VDbjRDNUI7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7QUNONEM7QUFDWjs7QUFFaEMscURBQWM7QUFDZCwrQ0FBWSIsInNvdXJjZXMiOlsid2VicGFjazovL3RvLWRvLWxpc3QvLi9zcmMvc3RvcmFnZS5qcyIsIndlYnBhY2s6Ly90by1kby1saXN0Ly4vc3JjL3RvRG9MaXN0LmpzIiwid2VicGFjazovL3RvLWRvLWxpc3QvLi9zcmMvdWkuanMiLCJ3ZWJwYWNrOi8vdG8tZG8tbGlzdC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90by1kby1saXN0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly90by1kby1saXN0L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vdG8tZG8tbGlzdC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3RvLWRvLWxpc3QvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3Qgc3RvcmFnZU1hbmFnZXIgPSAoKCkgPT4ge1xuICAvKiBJbml0aWFsIGZ1bmN0aW9uIHRvIGdldCBhbnl0aGluZyBzYXZlZCBpbiBsb2NhbFN0b3JhZ2UgKi9cbiAgY29uc3QgZ2V0U3RvcmFnZSA9ICgpID0+IHtcbiAgICBsZXQgdG9Eb0xpc3QgPSBbXTtcbiAgICBpZiAobG9jYWxTdG9yYWdlLnRvRG9MaXN0KSB7XG4gICAgICB0b0RvTGlzdCA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3RvRG9MaXN0JykpO1xuICAgIH1cblxuICAgIHJldHVybiB0b0RvTGlzdDtcbiAgfTtcblxuICBjb25zdCBzZXRTdG9yYWdlID0gKHByb2plY3RzKSA9PiB7XG4gICAgY29uc3QgdG9Eb0xpc3QgPSBKU09OLnN0cmluZ2lmeShwcm9qZWN0cyk7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3RvRG9MaXN0JywgdG9Eb0xpc3QpO1xuICB9O1xuXG4gIHJldHVybiB7IGdldFN0b3JhZ2UsIHNldFN0b3JhZ2UgfTtcbn0pKCk7XG5cbmV4cG9ydCBkZWZhdWx0IHN0b3JhZ2VNYW5hZ2VyO1xuIiwiLyogQ29udGVudHM6XG5cbiAgLSBDb25zdHJ1Y3RvcnMgLSBUYXNrLCBTdGVwICYgUHJvamVjdFxuXG4gIC0gRnVuY3Rpb25zIHRvIGRlZXAgY2xvbmUgYXJyYXlzICYgb2JqZWN0cywgJiB1cGRhdGUgbG9jYWwgc3RvcmFnZVxuXG4gIC0gUHJvamVjdCBNYW5hZ2VyXG5cbiAgLSBUYXNrIE1hbmFnZXJcblxuICAtIFN0ZXAgTWFuYWdlclxuKi9cbmltcG9ydCBzdG9yYWdlTWFuYWdlciBmcm9tICcuL3N0b3JhZ2UnO1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLSBDb25zdHJ1Y3RvcnMgLSBUYXNrLCBTdGVwICYgUHJvamVjdFxuICAtIFN0ZXAgZ29lcyBpbnNpZGUgVGFzay5zdGVwc1tdXG4gIC0gVGFzayBnb2VzIGluc2lkZSBQcm9qZWN0LnRhc2tzW11cbiAgLSBQcm9qZWN0IGdvZXMgaW5zaWRlIHByb2plY3RzW11cbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5jbGFzcyBUYXNrIHtcbiAgY29uc3RydWN0b3IodGl0bGUsIGRlc2NyaXB0aW9uLCBkdWVEYXRlLCBwcmlvcml0eSwgc3RhdHVzKSB7XG4gICAgdGhpcy50aXRsZSA9IHRpdGxlO1xuICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcbiAgICB0aGlzLnN0ZXBzID0gW107XG4gICAgdGhpcy5kdWVEYXRlID0gZHVlRGF0ZTtcbiAgICB0aGlzLnByaW9yaXR5ID0gcHJpb3JpdHk7XG4gICAgdGhpcy5zdGF0dXMgPSBzdGF0dXM7XG4gIH1cbn1cblxuY2xhc3MgU3RlcCB7XG4gIGNvbnN0cnVjdG9yKGRlc2NyaXB0aW9uLCBzdGF0dXMpIHtcbiAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XG4gICAgdGhpcy5zdGF0dXMgPSBzdGF0dXM7XG4gIH1cbn1cblxuY2xhc3MgUHJvamVjdCB7XG4gIGNvbnN0cnVjdG9yKHRpdGxlLCBkZXNjcmlwdGlvbikge1xuICAgIHRoaXMudGl0bGUgPSB0aXRsZTtcbiAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XG4gICAgdGhpcy50YXNrcyA9IFtdO1xuICB9XG59XG5cbmNvbnN0IHByb2plY3RzID0gW107XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4tIEZ1bmN0aW9ucyB0byBkZWVwIGNsb25lIGFycmF5cyAmIG9iamVjdHMsICYgdXBkYXRlIGxvY2FsIHN0b3JhZ2VcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5jb25zdCBkZWVwQ29weUFycmF5ID0gKGFycmF5KSA9PiB7XG4gIGNvbnN0IGFycmF5Q29weSA9IFtdO1xuICBhcnJheS5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoaXRlbSkpIHtcbiAgICAgIGFycmF5Q29weS5wdXNoKGRlZXBDb3B5QXJyYXkoaXRlbSkpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGl0ZW0gPT09ICdvYmplY3QnKSB7XG4gICAgICBhcnJheUNvcHkucHVzaChkZWVwQ29weU9iamVjdChpdGVtKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFycmF5Q29weS5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBhcnJheUNvcHk7XG59O1xuXG5jb25zdCBkZWVwQ29weU9iamVjdCA9IChvYmplY3QpID0+IHtcbiAgY29uc3Qgb2JqZWN0Q29weSA9IHt9O1xuICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhvYmplY3QpKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICBvYmplY3RDb3B5W2tleV0gPSBkZWVwQ29weUFycmF5KHZhbHVlKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIG9iamVjdENvcHlba2V5XSA9IGRlZXBDb3B5T2JqZWN0KHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb2JqZWN0Q29weVtrZXldID0gdmFsdWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBvYmplY3RDb3B5O1xufTtcblxuY29uc3Qgc2V0U3RvcmFnZSA9ICgpID0+IHtcbiAgY29uc3QgcHJvamVjdHNDb3B5ID0gZGVlcENvcHlBcnJheShwcm9qZWN0cyk7XG4gIHN0b3JhZ2VNYW5hZ2VyLnNldFN0b3JhZ2UocHJvamVjdHNDb3B5KTtcbn07XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4tIFByb2plY3QgTWFuYWdlclxuICAtIENyZWF0ZSBhIHNhZmUgY29weSBvZiBhIHByb2plY3QgJiBvZiB0aGUgcHJvamVjdHMgYXJyYXkgZm9yIHB1YmxpYyB1c2VcbiAgLSBDcmVhdGUgJiBkZWxldGUgcHJvamVjdHNcbiAgLSBFZGl0IHByb2plY3QgdGl0bGVzICYgZGVzY3JpcHRpb25zXG4gIC0gSW5pdGlhbGlzZSBieSBjaGVja2luZyBmb3IgbG9jYWxseSBzdG9yZWQgcHJvamVjdHNcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5jb25zdCBwcm9qZWN0TWFuYWdlciA9ICgoKSA9PiB7XG4gIGNvbnN0IHJldmVhbFByb2plY3QgPSAocHJvamVjdEluZGV4KSA9PiB7XG4gICAgY29uc3QgcHJvamVjdENvcHkgPSBkZWVwQ29weU9iamVjdChwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0pO1xuXG4gICAgcmV0dXJuIHByb2plY3RDb3B5O1xuICB9O1xuXG4gIGNvbnN0IHJldmVhbFByb2plY3RUYXNrc0xlbmd0aCA9IChwcm9qZWN0SW5kZXgpID0+IHtcbiAgICBjb25zdCB0YXNrc0xlbmd0aCA9IHByb2plY3RzW3Byb2plY3RJbmRleF0udGFza3MubGVuZ3RoO1xuICAgIHJldHVybiB0YXNrc0xlbmd0aDtcbiAgfTtcblxuICBjb25zdCByZXZlYWxBbGxQcm9qZWN0cyA9ICgpID0+IHtcbiAgICBjb25zdCBwcm9qZWN0c0NvcHkgPSBkZWVwQ29weUFycmF5KHByb2plY3RzKTtcblxuICAgIHJldHVybiBwcm9qZWN0c0NvcHk7XG4gIH07XG5cbiAgY29uc3QgY3JlYXRlTmV3UHJvamVjdCA9ICh0aXRsZSwgZGVzY3JpcHRpb24pID0+IHtcbiAgICBjb25zdCBuZXdQcm9qZWN0ID0gbmV3IFByb2plY3QodGl0bGUsIGRlc2NyaXB0aW9uKTtcbiAgICBwcm9qZWN0cy5wdXNoKG5ld1Byb2plY3QpO1xuXG4gICAgc2V0U3RvcmFnZSgpO1xuICAgIHJldHVybiByZXZlYWxQcm9qZWN0KHByb2plY3RzLmxlbmd0aCAtIDEpO1xuICB9O1xuXG4gIGNvbnN0IGRlbGV0ZVByb2plY3QgPSAocHJvamVjdEluZGV4KSA9PiB7XG4gICAgY29uc3QgaW5kZXggPSBOdW1iZXIocHJvamVjdEluZGV4KTtcbiAgICBwcm9qZWN0cy5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gICAgc2V0U3RvcmFnZSgpO1xuICAgIHJldHVybiByZXZlYWxBbGxQcm9qZWN0cygpO1xuICB9O1xuXG4gIC8qIE1pZ2h0IG5vdCBuZWVkIHRoaXMgKi9cbiAgY29uc3QgZGVsZXRlUHJvamVjdEJ5TmFtZSA9IChwcm9qZWN0VGl0bGUpID0+IHtcbiAgICBwcm9qZWN0cy5mb3JFYWNoKChwcm9qZWN0KSA9PiB7XG4gICAgICBpZiAocHJvamVjdC50aXRsZSA9PT0gcHJvamVjdFRpdGxlKSB7XG4gICAgICAgIHByb2plY3RzLnNwbGljZShwcm9qZWN0cy5pbmRleE9mKHByb2plY3QpLCAxKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHNldFN0b3JhZ2UoKTtcbiAgICByZXR1cm4gcmV2ZWFsQWxsUHJvamVjdHMoKTtcbiAgfTtcblxuICBjb25zdCBlZGl0UHJvamVjdFRpdGxlID0gKHByb2plY3RJbmRleCwgbmV3VGl0bGUpID0+IHtcbiAgICBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0udGl0bGUgPSBuZXdUaXRsZTtcblxuICAgIHNldFN0b3JhZ2UoKTtcbiAgICByZXR1cm4gcmV2ZWFsUHJvamVjdChOdW1iZXIocHJvamVjdEluZGV4KSk7XG4gIH07XG5cbiAgY29uc3QgZWRpdFByb2plY3REZXNjcmlwdGlvbiA9IChwcm9qZWN0SW5kZXgsIG5ld0Rlc2NyaXB0aW9uKSA9PiB7XG4gICAgcHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldLmRlc2NyaXB0aW9uID0gbmV3RGVzY3JpcHRpb247XG5cbiAgICBzZXRTdG9yYWdlKCk7XG4gICAgcmV0dXJuIHJldmVhbFByb2plY3QoTnVtYmVyKHByb2plY3RJbmRleCkpO1xuICB9O1xuXG4gIC8qIFRoaXMgc2hvdWxkIGJlIHVzZWQgYXQgdGhlIGJlZ2dpbmluZyBvZiB0aGUgY29kZSB0byBzdGFydCB0aGUgYXBwIHByb3Blcmx5ICovXG4gIGNvbnN0IGluaXRpYWxpc2UgPSAoKSA9PiB7XG4gICAgY29uc3Qgc3RvcmVkUHJvamVjdHMgPSBzdG9yYWdlTWFuYWdlci5nZXRTdG9yYWdlKCk7XG4gICAgaWYgKHN0b3JlZFByb2plY3RzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgY3JlYXRlTmV3UHJvamVjdCgnSW5ib3gnLCAnJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RvcmVkUHJvamVjdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcHJvamVjdHMucHVzaChzdG9yZWRQcm9qZWN0c1tpXSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXZlYWxBbGxQcm9qZWN0cygpO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgcmV2ZWFsUHJvamVjdCxcbiAgICByZXZlYWxQcm9qZWN0VGFza3NMZW5ndGgsXG4gICAgcmV2ZWFsQWxsUHJvamVjdHMsXG4gICAgY3JlYXRlTmV3UHJvamVjdCxcbiAgICBkZWxldGVQcm9qZWN0LFxuICAgIGRlbGV0ZVByb2plY3RCeU5hbWUsXG4gICAgZWRpdFByb2plY3RUaXRsZSxcbiAgICBlZGl0UHJvamVjdERlc2NyaXB0aW9uLFxuICAgIGluaXRpYWxpc2UsXG4gIH07XG59KSgpO1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLSBUYXNrIE1hbmFnZXJcbiAgLSBDcmVhdGUgYSBzYWZlIGNvcHkgb2YgYSBzaW5nbGUgdGFzayBmb3IgcHVibGljIHVzZVxuICAtIENyZWF0ZSAmIGRlbGV0ZSB0YXNrcyBpbiBhIHByb2plY3RcbiAgLSBFZGl0IHRhc2sgdGl0bGUsIGRlc2NyaXB0aW9uLCBkdWUgZGF0ZSwgcHJpb3JpdHkgJiBzdGF0dXNcbiAgLSBTdWJzY3JpYmUgdG8gbWVkaWF0b3IgZXZlbnRzXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuY29uc3QgdGFza01hbmFnZXIgPSAoKCkgPT4ge1xuICBjb25zdCByZXZlYWxUYXNrID0gKHByb2plY3RJbmRleCwgdGFza0luZGV4KSA9PiB7XG4gICAgY29uc3QgdGFza0NvcHkgPSBkZWVwQ29weU9iamVjdChcbiAgICAgIHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXS50YXNrc1tOdW1iZXIodGFza0luZGV4KV0sXG4gICAgKTtcblxuICAgIHJldHVybiB0YXNrQ29weTtcbiAgfTtcblxuICBjb25zdCBjcmVhdGVOZXdUYXNrID0gKFxuICAgIHByb2plY3RJbmRleCxcbiAgICB0aXRsZSxcbiAgICBkZXNjcmlwdGlvbixcbiAgICBkdWVEYXRlLFxuICAgIHByaW9yaXR5LFxuICAgIHN0YXR1cyxcbiAgKSA9PiB7XG4gICAgY29uc3QgcHJvamVjdCA9IHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXTtcbiAgICBwcm9qZWN0LnRhc2tzLnB1c2gobmV3IFRhc2sodGl0bGUsIGRlc2NyaXB0aW9uLCBkdWVEYXRlLCBwcmlvcml0eSwgc3RhdHVzKSk7XG5cbiAgICBzZXRTdG9yYWdlKCk7XG4gICAgcmV0dXJuIHJldmVhbFRhc2soTnVtYmVyKHByb2plY3RJbmRleCksIHByb2plY3QudGFza3MubGVuZ3RoIC0gMSk7XG4gIH07XG5cbiAgY29uc3QgZGVsZXRlVGFzayA9IChwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCkgPT4ge1xuICAgIGNvbnN0IHByb2plY3QgPSBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV07XG4gICAgY29uc3QgaW5kZXggPSBOdW1iZXIodGFza0luZGV4KTtcbiAgICBwcm9qZWN0LnRhc2tzLnNwbGljZShpbmRleCwgMSk7XG5cbiAgICBzZXRTdG9yYWdlKCk7XG4gICAgcmV0dXJuIHByb2plY3RNYW5hZ2VyLnJldmVhbFByb2plY3QoTnVtYmVyKHByb2plY3RJbmRleCkpO1xuICB9O1xuXG4gIGNvbnN0IGVkaXRUYXNrVGl0bGUgPSAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgsIG5ld1RpdGxlKSA9PiB7XG4gICAgY29uc3QgdGFzayA9IHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXS50YXNrc1tOdW1iZXIodGFza0luZGV4KV07XG4gICAgdGFzay50aXRsZSA9IG5ld1RpdGxlO1xuXG4gICAgc2V0U3RvcmFnZSgpO1xuICAgIHJldHVybiByZXZlYWxUYXNrKE51bWJlcihwcm9qZWN0SW5kZXgpLCBOdW1iZXIodGFza0luZGV4KSk7XG4gIH07XG5cbiAgY29uc3QgZWRpdFRhc2tEZXNjcmlwdGlvbiA9IChwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCwgbmV3RGVzY3JpcHRpb24pID0+IHtcbiAgICBjb25zdCB0YXNrID0gcHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldLnRhc2tzW051bWJlcih0YXNrSW5kZXgpXTtcbiAgICB0YXNrLmRlc2NyaXB0aW9uID0gbmV3RGVzY3JpcHRpb247XG5cbiAgICBzZXRTdG9yYWdlKCk7XG4gICAgcmV0dXJuIHJldmVhbFRhc2soTnVtYmVyKHByb2plY3RJbmRleCksIE51bWJlcih0YXNrSW5kZXgpKTtcbiAgfTtcblxuICBjb25zdCBlZGl0VGFza0R1ZURhdGUgPSAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgsIG5ld0R1ZURhdGUpID0+IHtcbiAgICBjb25zdCB0YXNrID0gcHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldLnRhc2tzW051bWJlcih0YXNrSW5kZXgpXTtcbiAgICB0YXNrLmR1ZURhdGUgPSBuZXdEdWVEYXRlO1xuXG4gICAgc2V0U3RvcmFnZSgpO1xuICAgIHJldHVybiByZXZlYWxUYXNrKE51bWJlcihwcm9qZWN0SW5kZXgpLCBOdW1iZXIodGFza0luZGV4KSk7XG4gIH07XG5cbiAgY29uc3QgZWRpdFRhc2tQcmlvcml0eSA9IChwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCwgbmV3UHJpb3JpdHkpID0+IHtcbiAgICBjb25zdCB0YXNrID0gcHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldLnRhc2tzW051bWJlcih0YXNrSW5kZXgpXTtcbiAgICB0YXNrLnByaW9yaXR5ID0gbmV3UHJpb3JpdHk7XG5cbiAgICBzZXRTdG9yYWdlKCk7XG4gICAgcmV0dXJuIHJldmVhbFRhc2soTnVtYmVyKHByb2plY3RJbmRleCksIE51bWJlcih0YXNrSW5kZXgpKTtcbiAgfTtcblxuICBjb25zdCBlZGl0VGFza1N0YXR1cyA9IChwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCwgbmV3U3RhdHVzKSA9PiB7XG4gICAgY29uc3QgdGFzayA9IHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXS50YXNrc1tOdW1iZXIodGFza0luZGV4KV07XG4gICAgdGFzay5zdGF0dXMgPSBuZXdTdGF0dXM7XG5cbiAgICBzZXRTdG9yYWdlKCk7XG4gICAgcmV0dXJuIHJldmVhbFRhc2soTnVtYmVyKHByb2plY3RJbmRleCksIE51bWJlcih0YXNrSW5kZXgpKTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIHJldmVhbFRhc2ssXG4gICAgY3JlYXRlTmV3VGFzayxcbiAgICBkZWxldGVUYXNrLFxuICAgIGVkaXRUYXNrVGl0bGUsXG4gICAgZWRpdFRhc2tEZXNjcmlwdGlvbixcbiAgICBlZGl0VGFza0R1ZURhdGUsXG4gICAgZWRpdFRhc2tQcmlvcml0eSxcbiAgICBlZGl0VGFza1N0YXR1cyxcbiAgfTtcbn0pKCk7XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4tIFN0ZXAgTWFuYWdlclxuICAtIENyZWF0ZSAmIGRlbGV0ZSBzdGVwcyBpbiBhIHRhc2tcbiAgLSBFZGl0IHN0ZXAgZGVzY3JpcHRpb24gJiBzdGF0dXNcbiAgLSBDcmVhdGUgYSBzZmUgY29weSBvZiBhIHNpbmdsZSBzdGVwIGZvciBwdWJsaWMgdXNlXG4gIC0gU3Vic2NyaWJlIHRvIG1lZGlhdG9yIGV2ZW50c1xuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbmNvbnN0IHN0ZXBNYW5hZ2VyID0gKCgpID0+IHtcbiAgY29uc3QgcmV2ZWFsU3RlcCA9IChwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCwgc3RlcEluZGV4KSA9PiB7XG4gICAgY29uc3Qgc3RlcENvcHkgPSBkZWVwQ29weU9iamVjdChcbiAgICAgIHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXS50YXNrc1tOdW1iZXIodGFza0luZGV4KV0uc3RlcHNbXG4gICAgICAgIE51bWJlcihzdGVwSW5kZXgpXG4gICAgICBdLFxuICAgICk7XG5cbiAgICByZXR1cm4gc3RlcENvcHk7XG4gIH07XG5cbiAgY29uc3QgY3JlYXRlTmV3U3RlcCA9IChwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCwgZGVzY3JpcHRpb24sIHN0YXR1cykgPT4ge1xuICAgIGNvbnN0IHRhc2sgPSBwcm9qZWN0c1tOdW1iZXIocHJvamVjdEluZGV4KV0udGFza3NbTnVtYmVyKHRhc2tJbmRleCldO1xuICAgIHRhc2suc3RlcHMucHVzaChuZXcgU3RlcChkZXNjcmlwdGlvbiwgc3RhdHVzKSk7XG5cbiAgICBzZXRTdG9yYWdlKCk7XG4gICAgcmV0dXJuIHJldmVhbFN0ZXAoXG4gICAgICBOdW1iZXIocHJvamVjdEluZGV4KSxcbiAgICAgIE51bWJlcih0YXNrSW5kZXgpLFxuICAgICAgdGFzay5zdGVwcy5sZW5ndGggLSAxLFxuICAgICk7XG4gIH07XG5cbiAgY29uc3QgZGVsZXRlU3RlcCA9IChwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCwgc3RlcEluZGV4KSA9PiB7XG4gICAgY29uc3QgdGFzayA9IHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXS50YXNrc1tOdW1iZXIodGFza0luZGV4KV07XG4gICAgY29uc3QgaW5kZXggPSBOdW1iZXIoc3RlcEluZGV4KTtcbiAgICB0YXNrLnN0ZXBzLnNwbGljZShpbmRleCwgMSk7XG5cbiAgICBzZXRTdG9yYWdlKCk7XG4gICAgcmV0dXJuIHRhc2tNYW5hZ2VyLnJldmVhbFRhc2soTnVtYmVyKHByb2plY3RJbmRleCksIE51bWJlcih0YXNrSW5kZXgpKTtcbiAgfTtcblxuICBjb25zdCBlZGl0U3RlcERlc2NyaXB0aW9uID0gKFxuICAgIHByb2plY3RJbmRleCxcbiAgICB0YXNrSW5kZXgsXG4gICAgc3RlcEluZGV4LFxuICAgIG5ld0Rlc2NyaXB0aW9uLFxuICApID0+IHtcbiAgICBjb25zdCBzdGVwID1cbiAgICAgIHByb2plY3RzW051bWJlcihwcm9qZWN0SW5kZXgpXS50YXNrc1tOdW1iZXIodGFza0luZGV4KV0uc3RlcHNbXG4gICAgICAgIE51bWJlcihzdGVwSW5kZXgpXG4gICAgICBdO1xuICAgIHN0ZXAuZGVzY3JpcHRpb24gPSBuZXdEZXNjcmlwdGlvbjtcblxuICAgIHNldFN0b3JhZ2UoKTtcbiAgICByZXR1cm4gcmV2ZWFsU3RlcChcbiAgICAgIE51bWJlcihwcm9qZWN0SW5kZXgpLFxuICAgICAgTnVtYmVyKHRhc2tJbmRleCksXG4gICAgICBOdW1iZXIoc3RlcEluZGV4KSxcbiAgICApO1xuICB9O1xuXG4gIGNvbnN0IGVkaXRTdGVwU3RhdHVzID0gKHByb2plY3RJbmRleCwgdGFza0luZGV4LCBzdGVwSW5kZXgsIG5ld1N0YXR1cykgPT4ge1xuICAgIGNvbnN0IHN0ZXAgPVxuICAgICAgcHJvamVjdHNbTnVtYmVyKHByb2plY3RJbmRleCldLnRhc2tzW051bWJlcih0YXNrSW5kZXgpXS5zdGVwc1tcbiAgICAgICAgTnVtYmVyKHN0ZXBJbmRleClcbiAgICAgIF07XG4gICAgc3RlcC5zdGF0dXMgPSBuZXdTdGF0dXM7XG5cbiAgICBzZXRTdG9yYWdlKCk7XG4gICAgcmV0dXJuIHJldmVhbFN0ZXAoXG4gICAgICBOdW1iZXIocHJvamVjdEluZGV4KSxcbiAgICAgIE51bWJlcih0YXNrSW5kZXgpLFxuICAgICAgTnVtYmVyKHN0ZXBJbmRleCksXG4gICAgKTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIHJldmVhbFN0ZXAsXG4gICAgY3JlYXRlTmV3U3RlcCxcbiAgICBkZWxldGVTdGVwLFxuICAgIGVkaXRTdGVwRGVzY3JpcHRpb24sXG4gICAgZWRpdFN0ZXBTdGF0dXMsXG4gIH07XG59KSgpO1xuXG5leHBvcnQgeyBwcm9qZWN0TWFuYWdlciwgdGFza01hbmFnZXIsIHN0ZXBNYW5hZ2VyIH07XG4iLCIvKiBDb250ZW50czpcblxuXHQtIEdlbmVyYWxcblxuXHQtIEhlYWRlciBtb2R1bGVcblxuXHQtIE5hdmJhciBtb2R1bGVcblxuICAtIE1haW4gbW9kdWxlXG5cbiAgLSBBc2lkZSBtb2R1bGVcblx0XG5cdC0gTW9kdWxlIHRvIGNvbnRyb2wgdGhpbmdzIGNvbW1vbiBtb3N0IG1vZGFsc1xuXG5cdC0gJ05ldyBMaXN0JyBtb2RhbCBtb2R1bGVcblxuICAtICdFZGl0IGxpc3QnIG1vZGFsIG1vZHVsZVxuXG4gIC0gJ0RlbGV0ZSBsaXN0JyBtb2RhbCBtb2R1bGVcblxuICAtICdOZXcgdGFzaycgbW9kYWwgbW9kdWxlXG5cbiAgLSBTdGVwcyBjb21wb25lbnQgbW9kdWxlXG5cbiAgLSAnRWRpdCB0YXNrJyBtb2RhbCBtb2R1bGVcblxuICAtICdEZWxldGUgdGFzaycgbW9kYWwgbW9kdWxlXG5cblx0LSBJbml0aWFsaXNlciBmdW5jdGlvblxuKi9cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4tIEdlbmVyYWxcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5pbXBvcnQgeyBwcm9qZWN0TWFuYWdlciwgdGFza01hbmFnZXIsIHN0ZXBNYW5hZ2VyIH0gZnJvbSAnLi90b0RvTGlzdCc7XG5cbmNvbnN0IHRvZ2dsZUhpZGRlbiA9IChlbGVtZW50KSA9PiB7XG4gIGVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZSgnaGlkZGVuJyk7XG59O1xuXG5jb25zdCBoYXNEYXRlUGFzdCA9IChkYXRlKSA9PiB7XG4gIGNvbnN0IGRhdGVUb0NvbXBhcmUgPSBkYXRlLnNwbGl0KCctJyk7XG4gIGNvbnN0IGN1cnJlbnREYXRlID0gbmV3IERhdGUoKTtcbiAgY29uc3QgY3VycmVudFllYXIgPSBjdXJyZW50RGF0ZS5nZXRGdWxsWWVhcigpO1xuICBjb25zdCBjdXJyZW50TW9udGggPSBjdXJyZW50RGF0ZS5nZXRNb250aCgpICsgMTtcbiAgY29uc3QgY3VycmVudERheSA9IGN1cnJlbnREYXRlLmdldERhdGUoKTtcblxuICBpZiAoXG4gICAgY3VycmVudFllYXIgPiBOdW1iZXIoZGF0ZVRvQ29tcGFyZVswXSkgfHxcbiAgICAoY3VycmVudFllYXIgPT09IE51bWJlcihkYXRlVG9Db21wYXJlWzBdKSAmJlxuICAgICAgY3VycmVudE1vbnRoID4gTnVtYmVyKGRhdGVUb0NvbXBhcmVbMV0pKSB8fFxuICAgIChjdXJyZW50WWVhciA9PT0gTnVtYmVyKGRhdGVUb0NvbXBhcmVbMF0pICYmXG4gICAgICBjdXJyZW50TW9udGggPT09IE51bWJlcihkYXRlVG9Db21wYXJlWzFdKSAmJlxuICAgICAgY3VycmVudERheSA+IE51bWJlcihkYXRlVG9Db21wYXJlWzJdKSlcbiAgKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi0gSGVhZGVyIG1vZHVsZVxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbmNvbnN0IGhlYWRlciA9ICgoKSA9PiB7XG4gIC8qIEZ1bmN0aW9uIHRvIGludm9rZSBvbiBpbml0aWxpc2UsIGZvciB0aGUgY29tcG9uZW50IHRvIHdvcmsgcHJvcGVybHkgKi9cbiAgY29uc3QgYWRkSGVhZGVyTGlzdGVuZXJzID0gKCkgPT4ge1xuICAgIGNvbnN0IHRvZ2dsZU5hdkJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0b2dnbGUtbmF2LWJ1dHRvbicpO1xuICAgIGNvbnN0IHRvZ2dsZUFzaWRlQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RvZ2dsZS1hc2lkZS1idXR0b24nKTtcbiAgICBjb25zdCBuYXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCduYXYnKTtcbiAgICBjb25zdCBhc2lkZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2FzaWRlJyk7XG5cbiAgICB0b2dnbGVOYXZCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB0b2dnbGVIaWRkZW4obmF2KSk7XG4gICAgdG9nZ2xlQXNpZGVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB0b2dnbGVIaWRkZW4oYXNpZGUpKTtcbiAgfTtcblxuICByZXR1cm4geyBhZGRIZWFkZXJMaXN0ZW5lcnMgfTtcbn0pKCk7XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4tIE5hdmJhciBtb2R1bGVcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5jb25zdCBuYXZiYXIgPSAoKCkgPT4ge1xuICBjb25zdCBuYXZMaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25hdi10b2RvLWxpc3RzJyk7XG5cbiAgY29uc3Qgc2V0UHJvamVjdERhdGFJbmRleCA9IChlbGVtZW50LCBpbmRleCkgPT4ge1xuICAgIGVsZW1lbnQuZGF0YXNldC5wcm9qZWN0SW5kZXggPSBpbmRleDtcbiAgfTtcblxuICBjb25zdCBjYWxjdWxhdGVOZXdQcm9qZWN0SW5kZXggPSAoKSA9PiB7XG4gICAgY29uc3QgbGlzdHMgPSBuYXZMaXN0LmNoaWxkcmVuO1xuICAgIGNvbnN0IG5ld0luZGV4ID0gbGlzdHMubGVuZ3RoICsgMTtcbiAgICByZXR1cm4gbmV3SW5kZXg7XG4gIH07XG5cbiAgY29uc3QgdXBkYXRlQWxsUHJvamVjdEluZGljZXMgPSAoKSA9PiB7XG4gICAgY29uc3QgY3VycmVudExpc3RzID0gbmF2TGlzdC5jaGlsZHJlbjtcbiAgICBsZXQgdXBkYXRlZEluZGV4ID0gMTtcbiAgICBmb3IgKGNvbnN0IGxpc3Qgb2YgY3VycmVudExpc3RzKSB7XG4gICAgICBjb25zdCBsaW5rID0gbGlzdC5xdWVyeVNlbGVjdG9yKCdhJyk7XG4gICAgICBjb25zdCBidXR0b25zID0gbGlzdC5xdWVyeVNlbGVjdG9yQWxsKCdidXR0b24nKTtcbiAgICAgIGxpbmsuZGF0YXNldC5wcm9qZWN0SW5kZXggPSB1cGRhdGVkSW5kZXg7XG4gICAgICBidXR0b25zLmZvckVhY2goKGJ1dHRvbikgPT4ge1xuICAgICAgICBidXR0b24uZGF0YXNldC5wcm9qZWN0SW5kZXggPSB1cGRhdGVkSW5kZXg7XG4gICAgICB9KTtcbiAgICAgIHVwZGF0ZWRJbmRleCArPSAxO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCByZW5kZXJOZXdMaXN0ID0gKGxpc3QsIGxpc3RJbmRleCkgPT4ge1xuICAgIGNvbnN0IGxpc3RJdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICBjb25zdCBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbnN0IGVkaXRCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBjb25zdCBlZGl0SW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgY29uc3QgZGVsZXRlQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgY29uc3QgZGVsZXRlSW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG5cbiAgICBsaW5rLnNldEF0dHJpYnV0ZSgnaHJlZicsICcjJyk7XG4gICAgbGluay50ZXh0Q29udGVudCA9IGAke2xpc3QudGl0bGV9YDtcbiAgICBkaXYuY2xhc3NMaXN0LmFkZCgnbmF2LWxpc3QtYnV0dG9ucycpO1xuICAgIGVkaXRJbWcuc2V0QXR0cmlidXRlKCdzcmMnLCAnLi9pY29ucy9lZGl0LnN2ZycpO1xuICAgIGVkaXRJbWcuc2V0QXR0cmlidXRlKCdhbHQnLCAnYnV0dG9uIHRvIGVkaXQgbGlzdCcpO1xuICAgIGRlbGV0ZUltZy5zZXRBdHRyaWJ1dGUoJ3NyYycsICcuL2ljb25zL2RlbGV0ZS5zdmcnKTtcbiAgICBkZWxldGVJbWcuc2V0QXR0cmlidXRlKCdhbHQnLCAnYnV0dG9uIHRvIGRlbGV0ZSBsaXN0Jyk7XG5cbiAgICBzZXRQcm9qZWN0RGF0YUluZGV4KGxpbmssIGxpc3RJbmRleCk7XG4gICAgc2V0UHJvamVjdERhdGFJbmRleChlZGl0QnRuLCBsaXN0SW5kZXgpO1xuICAgIHNldFByb2plY3REYXRhSW5kZXgoZGVsZXRlQnRuLCBsaXN0SW5kZXgpO1xuXG4gICAgZWRpdEJ0bi5hcHBlbmRDaGlsZChlZGl0SW1nKTtcbiAgICBkZWxldGVCdG4uYXBwZW5kQ2hpbGQoZGVsZXRlSW1nKTtcbiAgICBkaXYuYXBwZW5kQ2hpbGQoZWRpdEJ0bik7XG4gICAgZGl2LmFwcGVuZENoaWxkKGRlbGV0ZUJ0bik7XG4gICAgbGlzdEl0ZW0uYXBwZW5kQ2hpbGQobGluayk7XG4gICAgbGlzdEl0ZW0uYXBwZW5kQ2hpbGQoZGl2KTtcbiAgICBuYXZMaXN0LmFwcGVuZENoaWxkKGxpc3RJdGVtKTtcblxuICAgIGxpbmsuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBtYWluLnJlbmRlck1haW4oXG4gICAgICAgIHByb2plY3RNYW5hZ2VyLnJldmVhbFByb2plY3QoTnVtYmVyKGxpbmsuZGF0YXNldC5wcm9qZWN0SW5kZXgpKSxcbiAgICAgICAgTnVtYmVyKGxpbmsuZGF0YXNldC5wcm9qZWN0SW5kZXgpLFxuICAgICAgKTtcbiAgICB9KTtcbiAgICBlZGl0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT5cbiAgICAgIGVkaXRMaXN0TW9kYWwub3BlbkVkaXRNb2RhbChlZGl0QnRuLmRhdGFzZXQucHJvamVjdEluZGV4KSxcbiAgICApO1xuICAgIGRlbGV0ZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+XG4gICAgICBkZWxldGVMaXN0TW9kYWwub3BlbkRlbGV0ZU1vZGFsKGRlbGV0ZUJ0bi5kYXRhc2V0LnByb2plY3RJbmRleCksXG4gICAgKTtcbiAgfTtcblxuICBjb25zdCByZW5kZXJEZWxldGVkTGlzdCA9IChsaXN0SW5kZXgpID0+IHtcbiAgICBjb25zdCBsaXN0VG9EZWxldGUgPSBuYXZMaXN0LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICBgW2RhdGEtcHJvamVjdC1pbmRleD0nJHtsaXN0SW5kZXh9J11gLFxuICAgICkucGFyZW50RWxlbWVudDtcbiAgICBsaXN0VG9EZWxldGUucmVtb3ZlKCk7XG4gICAgdXBkYXRlQWxsUHJvamVjdEluZGljZXMoKTtcbiAgfTtcblxuICBjb25zdCByZW5kZXJFZGl0ZWRMaXN0ID0gKGxpc3RJbmRleCwgcHJvamVjdCkgPT4ge1xuICAgIGNvbnN0IGxpc3RUb0VkaXQgPSBuYXZMaXN0LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICBgYVtkYXRhLXByb2plY3QtaW5kZXg9JyR7bGlzdEluZGV4fSddYCxcbiAgICApO1xuICAgIGxpc3RUb0VkaXQudGV4dENvbnRlbnQgPSBwcm9qZWN0LnRpdGxlO1xuICB9O1xuXG4gIGNvbnN0IHJlbmRlckN1cnJlbnRMaXN0cyA9ICgpID0+IHtcbiAgICBjb25zdCBsaXN0cyA9IHByb2plY3RNYW5hZ2VyLnJldmVhbEFsbFByb2plY3RzKCk7XG4gICAgbGlzdHMuZm9yRWFjaCgobGlzdCkgPT4ge1xuICAgICAgaWYgKGxpc3RzLmluZGV4T2YobGlzdCkgPiAwKSB7XG4gICAgICAgIHJlbmRlck5ld0xpc3QobGlzdCwgbGlzdHMuaW5kZXhPZihsaXN0KSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgY29uc3Qgc2V0SW5ib3hJbmRleEFuZExpc3RlbmVyID0gKCkgPT4ge1xuICAgIGNvbnN0IGluYm94ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25hdi1saXN0LWluYm94Jyk7XG4gICAgc2V0UHJvamVjdERhdGFJbmRleChpbmJveCwgMCk7XG4gICAgaW5ib3guYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBtYWluLnJlbmRlck1haW4ocHJvamVjdE1hbmFnZXIucmV2ZWFsUHJvamVjdCgwKSwgMCk7XG4gICAgfSk7XG4gIH07XG5cbiAgY29uc3QgYWRkTmV3TGlzdEJ0bkxpc3RlbmVyID0gKCkgPT4ge1xuICAgIGNvbnN0IG5ld0xpc3RCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmF2LW5ldy1saXN0LWJ1dHRvbicpO1xuICAgIGNvbnN0IG1vZGFsTmV3TGlzdCA9XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmV3LWxpc3QtbW9kYWwnKS5wYXJlbnRFbGVtZW50O1xuICAgIG5ld0xpc3RCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB0b2dnbGVIaWRkZW4obW9kYWxOZXdMaXN0KSk7XG4gIH07XG5cbiAgLyogRnVuY3Rpb24gdG8gaW52b2tlIG9uIGluaXRpbGlzZSwgZm9yIHRoZSBjb21wb25lbnQgdG8gd29yayBwcm9wZXJseSAqL1xuICBjb25zdCBpbml0ID0gKCkgPT4ge1xuICAgIHJlbmRlckN1cnJlbnRMaXN0cygpO1xuICAgIHNldEluYm94SW5kZXhBbmRMaXN0ZW5lcigpO1xuICAgIGFkZE5ld0xpc3RCdG5MaXN0ZW5lcigpO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgY2FsY3VsYXRlTmV3UHJvamVjdEluZGV4LFxuICAgIHJlbmRlck5ld0xpc3QsXG4gICAgcmVuZGVyRGVsZXRlZExpc3QsXG4gICAgcmVuZGVyRWRpdGVkTGlzdCxcbiAgICBpbml0LFxuICB9O1xufSkoKTtcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi0gTWFpbiBtb2R1bGVcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5jb25zdCBtYWluID0gKCgpID0+IHtcbiAgY29uc3QgbWFpblRhc2tzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbWFpbicpO1xuICBjb25zdCBuZXdUYXNrQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW4tbmV3LXRhc2stYnV0dG9uJyk7XG4gIGNvbnN0IHVuZmluaXNoZWREaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudW5maW5pc2hlZC10YXNrcycpO1xuICBjb25zdCBmaW5pc2hlZERpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5maW5pc2hlZC10YXNrcycpO1xuXG4gIC8qIEhlYWRlciBzZWN0aW9uICovXG4gIGNvbnN0IHJlbmRlckhlYWRlciA9IChwcm9qZWN0KSA9PiB7XG4gICAgY29uc3QgbGlzdFRpdGxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW4tbGlzdC10aXRsZScpO1xuICAgIGNvbnN0IGxpc3REZXNjcmlwdGlvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluLWxpc3QtZGVzY3JpcHRpb24nKTtcbiAgICBsaXN0VGl0bGUudGV4dENvbnRlbnQgPSBwcm9qZWN0LnRpdGxlO1xuICAgIGxpc3REZXNjcmlwdGlvbi50ZXh0Q29udGVudCA9IHByb2plY3QuZGVzY3JpcHRpb247XG4gIH07XG5cbiAgY29uc3Qgc2V0TmV3VGFza0J0bkluZGV4ID0gKGluZGV4KSA9PiB7XG4gICAgbmV3VGFza0J0bi5kYXRhc2V0LnByb2plY3RJbmRleCA9IGluZGV4O1xuICB9O1xuXG4gIGNvbnN0IGFkZE5ld1Rhc2tCdG5MaXN0ZW5lciA9ICgpID0+IHtcbiAgICBuZXdUYXNrQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT5cbiAgICAgIG5ld1Rhc2tNb2RhbC5vcGVuTmV3VGFza01vZGFsKG5ld1Rhc2tCdG4uZGF0YXNldC5wcm9qZWN0SW5kZXgpLFxuICAgICk7XG4gIH07XG5cbiAgLyogVGFza3Mgc2VjdGlvbiAqL1xuICBjb25zdCBjbGVhclRhc2tzID0gKCkgPT4ge1xuICAgIGNvbnN0IHRhc2tHcm91cHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubWFpbi10YXNrcycpO1xuICAgIHRhc2tHcm91cHMuZm9yRWFjaCgodGFza0dyb3VwKSA9PiB7XG4gICAgICB0YXNrR3JvdXAuaW5uZXJIVE1MID0gJyc7XG4gICAgfSk7XG4gIH07XG5cbiAgY29uc3Qgc2VuZFRvRmluaXNoZWREaXYgPSAodGFza0luZGV4KSA9PiB7XG4gICAgY29uc3QgdGFza1RvTW92ZSA9IHVuZmluaXNoZWREaXYucXVlcnlTZWxlY3RvcihcbiAgICAgIGBkaXZbZGF0YS10YXNrLWluZGV4PScke3Rhc2tJbmRleH0nXWAsXG4gICAgKTtcbiAgICBmaW5pc2hlZERpdi5wcmVwZW5kKHRhc2tUb01vdmUpO1xuICB9O1xuXG4gIGNvbnN0IHNlbmRUb1VuZmluaXNoZWREaXYgPSAodGFza0luZGV4KSA9PiB7XG4gICAgY29uc3QgdGFza1RvTW92ZSA9IGZpbmlzaGVkRGl2LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICBgZGl2W2RhdGEtdGFzay1pbmRleD0nJHt0YXNrSW5kZXh9J11gLFxuICAgICk7XG4gICAgdW5maW5pc2hlZERpdi5hcHBlbmRDaGlsZCh0YXNrVG9Nb3ZlKTtcbiAgfTtcblxuICBjb25zdCB0b2dnbGVUYXNrU3RhdHVzID0gKGNoZWNrYm94LCBwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCkgPT4ge1xuICAgIGlmIChjaGVja2JveC5jaGVja2VkKSB7XG4gICAgICB0YXNrTWFuYWdlci5lZGl0VGFza1N0YXR1cyhwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCwgJ2RvbmUnKTtcbiAgICAgIHNlbmRUb0ZpbmlzaGVkRGl2KHRhc2tJbmRleCk7XG4gICAgfSBlbHNlIGlmICghY2hlY2tib3guY2hlY2tlZCkge1xuICAgICAgdGFza01hbmFnZXIuZWRpdFRhc2tTdGF0dXMocHJvamVjdEluZGV4LCB0YXNrSW5kZXgsICd0byBkbycpO1xuICAgICAgc2VuZFRvVW5maW5pc2hlZERpdih0YXNrSW5kZXgpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCB0b2dnbGVTdGVwU3RhdHVzID0gKGNoZWNrYm94LCBwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCwgc3RlcEluZGV4KSA9PiB7XG4gICAgaWYgKGNoZWNrYm94LmNoZWNrZWQpIHtcbiAgICAgIHN0ZXBNYW5hZ2VyLmVkaXRTdGVwU3RhdHVzKHByb2plY3RJbmRleCwgdGFza0luZGV4LCBzdGVwSW5kZXgsICdkb25lJyk7XG4gICAgfSBlbHNlIGlmICghY2hlY2tib3guY2hlY2tlZCkge1xuICAgICAgc3RlcE1hbmFnZXIuZWRpdFN0ZXBTdGF0dXMocHJvamVjdEluZGV4LCB0YXNrSW5kZXgsIHN0ZXBJbmRleCwgJ3RvIGRvJyk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IHJlbmRlclRhc2tDb250ZW50ID0gKHByb2plY3RJbmRleCwgdGFza0luZGV4KSA9PiB7XG4gICAgY29uc3QgdGFzayA9IHRhc2tNYW5hZ2VyLnJldmVhbFRhc2socHJvamVjdEluZGV4LCB0YXNrSW5kZXgpO1xuICAgIGNvbnN0IHRhc2tJdGVtID0gbWFpblRhc2tzXG4gICAgICAucXVlcnlTZWxlY3RvcihgZGl2W2RhdGEtdGFzay1pbmRleD0nJHt0YXNrSW5kZXh9J11gKVxuICAgICAgLnF1ZXJ5U2VsZWN0b3IoJy50YXNrLWl0ZW0nKTtcbiAgICBjb25zdCBwcmlvcml0eUxldmVsID0gdGFza0l0ZW0ucXVlcnlTZWxlY3RvcignLnRhc2stcHJpb3JpdHktbGV2ZWwnKTtcbiAgICBjb25zdCB0aXRsZURpdiA9IHRhc2tJdGVtLnF1ZXJ5U2VsZWN0b3IoJy50YXNrLXRpdGxlJyk7XG4gICAgY29uc3QgdGl0bGVDaGVja2JveCA9IHRpdGxlRGl2LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0Jyk7XG4gICAgY29uc3QgdGl0bGVMYWJlbCA9IHRpdGxlRGl2LnF1ZXJ5U2VsZWN0b3IoJ2xhYmVsJyk7XG4gICAgY29uc3QgZGVzY3JpcHRpb24gPSB0YXNrSXRlbS5xdWVyeVNlbGVjdG9yKCcudGFzay1kZXNjcmlwdGlvbicpO1xuICAgIGNvbnN0IHN0ZXBzTGlzdCA9IHRhc2tJdGVtLnF1ZXJ5U2VsZWN0b3IoJy50YXNrLXN0ZXBzJyk7XG5cbiAgICBzd2l0Y2ggKHRhc2sucHJpb3JpdHkpIHtcbiAgICAgIGNhc2UgJ2xvdyc6XG4gICAgICAgIHRhc2tJdGVtLmNsYXNzTmFtZSA9ICcnO1xuICAgICAgICB0YXNrSXRlbS5jbGFzc0xpc3QuYWRkKCd0YXNrLWl0ZW0nLCAncHJpb3JpdHktbG93Jyk7XG4gICAgICAgIHByaW9yaXR5TGV2ZWwudGV4dENvbnRlbnQgPSAnTG93JztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtZWRpdW0nOlxuICAgICAgICB0YXNrSXRlbS5jbGFzc05hbWUgPSAnJztcbiAgICAgICAgdGFza0l0ZW0uY2xhc3NMaXN0LmFkZCgndGFzay1pdGVtJywgJ3ByaW9yaXR5LW1lZGl1bScpO1xuICAgICAgICBwcmlvcml0eUxldmVsLnRleHRDb250ZW50ID0gJ01lZGl1bSc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnaGlnaCc6XG4gICAgICAgIHRhc2tJdGVtLmNsYXNzTmFtZSA9ICcnO1xuICAgICAgICB0YXNrSXRlbS5jbGFzc0xpc3QuYWRkKCd0YXNrLWl0ZW0nLCAncHJpb3JpdHktaGlnaCcpO1xuICAgICAgICBwcmlvcml0eUxldmVsLnRleHRDb250ZW50ID0gJ0hpZ2gnO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRhc2tJdGVtLmNsYXNzTmFtZSA9ICcnO1xuICAgICAgICB0YXNrSXRlbS5jbGFzc0xpc3QuYWRkKCd0YXNrLWl0ZW0nLCAncHJpb3JpdHktbm9uZScpO1xuICAgICAgICBwcmlvcml0eUxldmVsLnRleHRDb250ZW50ID0gJ05vbmUnO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgaWYgKHRhc2suc3RhdHVzID09PSAndG8gZG8nKSB7XG4gICAgICB0aXRsZUNoZWNrYm94LmNoZWNrZWQgPSBmYWxzZTtcbiAgICB9IGVsc2UgaWYgKHRhc2suc3RhdHVzID09PSAnZG9uZScpIHtcbiAgICAgIHRpdGxlQ2hlY2tib3guY2hlY2tlZCA9IHRydWU7XG4gICAgfVxuICAgIHRpdGxlTGFiZWwudGV4dENvbnRlbnQgPSB0YXNrLnRpdGxlO1xuICAgIGRlc2NyaXB0aW9uLnRleHRDb250ZW50ID0gdGFzay5kZXNjcmlwdGlvbjtcbiAgICBzdGVwc0xpc3QuaW5uZXJIVE1MID0gJyc7XG4gICAgdGFzay5zdGVwcy5mb3JFYWNoKChzdGVwKSA9PiB7XG4gICAgICBjb25zdCBsaXN0SXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICBjb25zdCBzdGVwQ2hlY2tib3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgICAgY29uc3Qgc3RlcExhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgICAgIGNvbnN0IGluZGV4ID0gdGFzay5zdGVwcy5pbmRleE9mKHN0ZXApO1xuXG4gICAgICBzdGVwQ2hlY2tib3guc2V0QXR0cmlidXRlKCd0eXBlJywgJ2NoZWNrYm94Jyk7XG4gICAgICBzdGVwQ2hlY2tib3guc2V0QXR0cmlidXRlKFxuICAgICAgICAnbmFtZScsXG4gICAgICAgIGBwcm9qZWN0JHtwcm9qZWN0SW5kZXh9LXRhc2ske3Rhc2tJbmRleH0tc3RlcCR7aW5kZXh9YCxcbiAgICAgICk7XG4gICAgICBzdGVwQ2hlY2tib3guc2V0QXR0cmlidXRlKFxuICAgICAgICAnaWQnLFxuICAgICAgICBgcHJvamVjdCR7cHJvamVjdEluZGV4fS10YXNrJHt0YXNrSW5kZXh9LXN0ZXAke2luZGV4fWAsXG4gICAgICApO1xuICAgICAgaWYgKHN0ZXAuc3RhdHVzID09PSAndG8gZG8nKSB7XG4gICAgICAgIHN0ZXBDaGVja2JveC5jaGVja2VkID0gZmFsc2U7XG4gICAgICB9IGVsc2UgaWYgKHN0ZXAuc3RhdHVzID09PSAnZG9uZScpIHtcbiAgICAgICAgc3RlcENoZWNrYm94LmNoZWNrZWQgPSB0cnVlO1xuICAgICAgfVxuICAgICAgc3RlcENoZWNrYm94LmRhdGFzZXQucHJvamVjdEluZGV4ID0gcHJvamVjdEluZGV4O1xuICAgICAgc3RlcENoZWNrYm94LmRhdGFzZXQudGFza0luZGV4ID0gdGFza0luZGV4O1xuICAgICAgc3RlcENoZWNrYm94LmRhdGFzZXQuc3RlcEluZGV4ID0gaW5kZXg7XG4gICAgICBzdGVwTGFiZWwuc2V0QXR0cmlidXRlKFxuICAgICAgICAnZm9yJyxcbiAgICAgICAgYHByb2plY3Qke3Byb2plY3RJbmRleH0tdGFzayR7dGFza0luZGV4fS1zdGVwJHtpbmRleH1gLFxuICAgICAgKTtcbiAgICAgIHN0ZXBMYWJlbC50ZXh0Q29udGVudCA9IHN0ZXAuZGVzY3JpcHRpb247XG5cbiAgICAgIHN0ZXBDaGVja2JveC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoKSA9PlxuICAgICAgICB0b2dnbGVTdGVwU3RhdHVzKHN0ZXBDaGVja2JveCwgcHJvamVjdEluZGV4LCB0YXNrSW5kZXgsIGluZGV4KSxcbiAgICAgICk7XG5cbiAgICAgIGxpc3RJdGVtLmFwcGVuZENoaWxkKHN0ZXBDaGVja2JveCk7XG4gICAgICBsaXN0SXRlbS5hcHBlbmRDaGlsZChzdGVwTGFiZWwpO1xuICAgICAgc3RlcHNMaXN0LmFwcGVuZENoaWxkKGxpc3RJdGVtKTtcbiAgICB9KTtcbiAgICBpZiAodGFzay5kdWVEYXRlICE9PSAnJykge1xuICAgICAgY29uc3QgZGF0ZVNwYW4gPSB0YXNrSXRlbS5xdWVyeVNlbGVjdG9yKCcudGFzay1pbmZvJyk7XG4gICAgICBjb25zdCB0YXNrRHVlRGF0ZSA9IHRhc2tJdGVtLnF1ZXJ5U2VsZWN0b3IoJy50YXNrLWR1ZS1kYXRlJyk7XG4gICAgICBjb25zdCBpc0xhdGUgPSB0YXNrSXRlbS5xdWVyeVNlbGVjdG9yKCcudGFzay1kYXRlLWluZm8nKTtcblxuICAgICAgZGF0ZVNwYW4udGV4dENvbnRlbnQgPSAnRHVlIGJ5OiAnO1xuICAgICAgdGFza0R1ZURhdGUudGV4dENvbnRlbnQgPSB0YXNrLmR1ZURhdGU7XG4gICAgICBpZiAoaGFzRGF0ZVBhc3QodGFzay5kdWVEYXRlKSA9PT0gdHJ1ZSkge1xuICAgICAgICBpc0xhdGUudGV4dENvbnRlbnQgPSAnTGF0ZSEnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaXNMYXRlLnRleHRDb250ZW50ID0gJyc7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IHRvZ2dsZVRhc2tEZXRhaWxzID0gKGltZywgYm9keSkgPT4ge1xuICAgIGNvbnN0IGJ0bkltZyA9IGltZy5nZXRBdHRyaWJ1dGUoJ3NyYycpO1xuXG4gICAgaWYgKGJ0bkltZyA9PT0gJy4vaWNvbnMvZHJvcF9kb3duLnN2ZycpIHtcbiAgICAgIGltZy5zZXRBdHRyaWJ1dGUoJ3NyYycsICcuL2ljb25zL2Ryb3BfZG93bl9sZWZ0LnN2ZycpO1xuICAgIH0gZWxzZSBpZiAoYnRuSW1nID09PSAnLi9pY29ucy9kcm9wX2Rvd25fbGVmdC5zdmcnKSB7XG4gICAgICBpbWcuc2V0QXR0cmlidXRlKCdzcmMnLCAnLi9pY29ucy9kcm9wX2Rvd24uc3ZnJyk7XG4gICAgfVxuICAgIHRvZ2dsZUhpZGRlbihib2R5KTtcbiAgfTtcblxuICBjb25zdCByZW5kZXJUYXNrID0gKHByb2plY3RJbmRleCwgdGFza0luZGV4KSA9PiB7XG4gICAgY29uc3QgdGFza1JvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbnN0IHRhc2tJdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29uc3QgdGFza0l0ZW1IZWFkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjb25zdCB0YXNrVGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjb25zdCB0aXRsZUNoZWNrYm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICBjb25zdCB0aXRsZUxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgICBjb25zdCB0YXNrSXRlbVJldmVhbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbnN0IHRhc2tSZXZlYWxCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBjb25zdCB0YXNrUmV2ZWFsSW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgY29uc3QgdGFza0l0ZW1Cb2R5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29uc3QgdGFza0Rlc2NyaXB0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgIGNvbnN0IHRhc2tTdGVwcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG4gICAgY29uc3QgdGFza0RhdGVEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjb25zdCBkYXRlU3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBjb25zdCB0YXNrRHVlRGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBjb25zdCBkYXRlSW5mb1NwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgY29uc3QgdGFza1ByaW9yaXR5RGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29uc3QgcHJpb3JpdHlTcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIGNvbnN0IHRhc2tQcmlvcml0eUxldmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIGNvbnN0IHRhc2tSb3dCdG5zID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29uc3QgZWRpdFRhc2tCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBjb25zdCBlZGl0VGFza0ltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgIGNvbnN0IGRlbGV0ZVRhc2tCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBjb25zdCBkZWxldGVUYXNrSW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG5cbiAgICB0YXNrUm93LmNsYXNzTGlzdC5hZGQoJ3Rhc2stcm93Jyk7XG4gICAgdGFza1Jvdy5kYXRhc2V0LnByb2plY3RJbmRleCA9IHByb2plY3RJbmRleDtcbiAgICB0YXNrUm93LmRhdGFzZXQudGFza0luZGV4ID0gdGFza0luZGV4O1xuICAgIHRhc2tJdGVtLmNsYXNzTGlzdC5hZGQoJ3Rhc2staXRlbScpO1xuICAgIHRhc2tJdGVtSGVhZGVyLmNsYXNzTGlzdC5hZGQoJ3Rhc2staXRlbS1oZWFkZXInKTtcbiAgICB0YXNrVGl0bGUuY2xhc3NMaXN0LmFkZCgndGFzay10aXRsZScpO1xuICAgIHRpdGxlQ2hlY2tib3guc2V0QXR0cmlidXRlKCd0eXBlJywgJ2NoZWNrYm94Jyk7XG4gICAgdGl0bGVDaGVja2JveC5zZXRBdHRyaWJ1dGUoXG4gICAgICAnbmFtZScsXG4gICAgICBgcHJvamVjdCR7cHJvamVjdEluZGV4fS10YXNrJHt0YXNrSW5kZXh9YCxcbiAgICApO1xuICAgIHRpdGxlQ2hlY2tib3guc2V0QXR0cmlidXRlKCdpZCcsIGBwcm9qZWN0JHtwcm9qZWN0SW5kZXh9LXRhc2ske3Rhc2tJbmRleH1gKTtcbiAgICB0aXRsZUNoZWNrYm94LmRhdGFzZXQucHJvamVjdEluZGV4ID0gcHJvamVjdEluZGV4O1xuICAgIHRpdGxlQ2hlY2tib3guZGF0YXNldC50YXNrSW5kZXggPSB0YXNrSW5kZXg7XG4gICAgdGl0bGVMYWJlbC5zZXRBdHRyaWJ1dGUoJ2ZvcicsIGBwcm9qZWN0JHtwcm9qZWN0SW5kZXh9LXRhc2ske3Rhc2tJbmRleH1gKTtcbiAgICB0YXNrSXRlbVJldmVhbC5jbGFzc0xpc3QuYWRkKCd0YXNrLWl0ZW0tcmV2ZWFsJyk7XG4gICAgdGFza1JldmVhbEJ0bi5jbGFzc0xpc3QuYWRkKCd0YXNrLXJldmVhbC1idXR0b24nKTtcbiAgICB0YXNrUmV2ZWFsSW1nLnNldEF0dHJpYnV0ZSgnc3JjJywgJy4vaWNvbnMvZHJvcF9kb3duLnN2ZycpO1xuICAgIHRhc2tSZXZlYWxJbWcuc2V0QXR0cmlidXRlKCdhbHQnLCAnc2hvdyB0YXNrIGRldGFpbHMgZHJvcGRvd24nKTtcbiAgICB0YXNrSXRlbUJvZHkuY2xhc3NMaXN0LmFkZCgndGFzay1pdGVtLWJvZHknLCAnaGlkZGVuJyk7XG4gICAgdGFza0Rlc2NyaXB0aW9uLmNsYXNzTGlzdC5hZGQoJ3Rhc2stZGVzY3JpcHRpb24nKTtcbiAgICB0YXNrU3RlcHMuY2xhc3NMaXN0LmFkZCgndGFzay1zdGVwcycpO1xuICAgIGRhdGVTcGFuLmNsYXNzTGlzdC5hZGQoJ3Rhc2staW5mbycpO1xuICAgIHRhc2tEdWVEYXRlLmNsYXNzTGlzdC5hZGQoJ3Rhc2stZHVlLWRhdGUnKTtcbiAgICBkYXRlSW5mb1NwYW4uY2xhc3NMaXN0LmFkZCgndGFzay1kYXRlLWluZm8nKTtcbiAgICBwcmlvcml0eVNwYW4uY2xhc3NMaXN0LmFkZCgndGFzay1pbmZvJyk7XG4gICAgcHJpb3JpdHlTcGFuLnRleHRDb250ZW50ID0gJ1ByaW9yaXR5OiAnO1xuICAgIHRhc2tQcmlvcml0eUxldmVsLmNsYXNzTGlzdC5hZGQoJ3Rhc2stcHJpb3JpdHktbGV2ZWwnKTtcbiAgICB0YXNrUm93QnRucy5jbGFzc0xpc3QuYWRkKCd0YXNrLXJvdy1idXR0b25zJyk7XG4gICAgZWRpdFRhc2tJbWcuc2V0QXR0cmlidXRlKCdzcmMnLCAnLi9pY29ucy9lZGl0LnN2ZycpO1xuICAgIGVkaXRUYXNrSW1nLnNldEF0dHJpYnV0ZSgnYWx0JywgJ2VkaXQgdGFzayBidXR0b24nKTtcbiAgICBlZGl0VGFza0J0bi5kYXRhc2V0LnByb2plY3RJbmRleCA9IHByb2plY3RJbmRleDtcbiAgICBlZGl0VGFza0J0bi5kYXRhc2V0LnRhc2tJbmRleCA9IHRhc2tJbmRleDtcbiAgICBkZWxldGVUYXNrSW1nLnNldEF0dHJpYnV0ZSgnc3JjJywgJy4vaWNvbnMvZGVsZXRlLnN2ZycpO1xuICAgIGRlbGV0ZVRhc2tJbWcuc2V0QXR0cmlidXRlKCdhbHQnLCAnZGVsZXRlIHRhc2sgYnV0dG9uJyk7XG4gICAgZGVsZXRlVGFza0J0bi5kYXRhc2V0LnByb2plY3RJbmRleCA9IHByb2plY3RJbmRleDtcbiAgICBkZWxldGVUYXNrQnRuLmRhdGFzZXQudGFza0luZGV4ID0gdGFza0luZGV4O1xuXG4gICAgdW5maW5pc2hlZERpdi5hcHBlbmRDaGlsZCh0YXNrUm93KTtcbiAgICB0YXNrUm93LmFwcGVuZENoaWxkKHRhc2tJdGVtKTtcbiAgICB0YXNrSXRlbS5hcHBlbmRDaGlsZCh0YXNrSXRlbUhlYWRlcik7XG4gICAgdGFza0l0ZW1IZWFkZXIuYXBwZW5kQ2hpbGQodGFza1RpdGxlKTtcbiAgICB0YXNrVGl0bGUuYXBwZW5kQ2hpbGQodGl0bGVDaGVja2JveCk7XG4gICAgdGFza1RpdGxlLmFwcGVuZENoaWxkKHRpdGxlTGFiZWwpO1xuICAgIHRhc2tJdGVtSGVhZGVyLmFwcGVuZENoaWxkKHRhc2tJdGVtUmV2ZWFsKTtcbiAgICB0YXNrSXRlbVJldmVhbC5hcHBlbmRDaGlsZCh0YXNrUmV2ZWFsQnRuKTtcbiAgICB0YXNrUmV2ZWFsQnRuLmFwcGVuZENoaWxkKHRhc2tSZXZlYWxJbWcpO1xuICAgIHRhc2tJdGVtLmFwcGVuZENoaWxkKHRhc2tJdGVtQm9keSk7XG4gICAgdGFza0l0ZW1Cb2R5LmFwcGVuZENoaWxkKHRhc2tEZXNjcmlwdGlvbik7XG4gICAgdGFza0l0ZW1Cb2R5LmFwcGVuZENoaWxkKHRhc2tTdGVwcyk7XG4gICAgdGFza0l0ZW1Cb2R5LmFwcGVuZENoaWxkKHRhc2tEYXRlRGl2KTtcbiAgICB0YXNrRGF0ZURpdi5hcHBlbmRDaGlsZChkYXRlU3Bhbik7XG4gICAgdGFza0RhdGVEaXYuYXBwZW5kQ2hpbGQodGFza0R1ZURhdGUpO1xuICAgIHRhc2tEYXRlRGl2LmFwcGVuZENoaWxkKGRhdGVJbmZvU3Bhbik7XG4gICAgdGFza0l0ZW1Cb2R5LmFwcGVuZENoaWxkKHRhc2tQcmlvcml0eURpdik7XG4gICAgdGFza1ByaW9yaXR5RGl2LmFwcGVuZENoaWxkKHByaW9yaXR5U3Bhbik7XG4gICAgdGFza1ByaW9yaXR5RGl2LmFwcGVuZENoaWxkKHRhc2tQcmlvcml0eUxldmVsKTtcbiAgICB0YXNrUm93LmFwcGVuZENoaWxkKHRhc2tSb3dCdG5zKTtcbiAgICB0YXNrUm93QnRucy5hcHBlbmRDaGlsZChlZGl0VGFza0J0bik7XG4gICAgZWRpdFRhc2tCdG4uYXBwZW5kQ2hpbGQoZWRpdFRhc2tJbWcpO1xuICAgIHRhc2tSb3dCdG5zLmFwcGVuZENoaWxkKGRlbGV0ZVRhc2tCdG4pO1xuICAgIGRlbGV0ZVRhc2tCdG4uYXBwZW5kQ2hpbGQoZGVsZXRlVGFza0ltZyk7XG5cbiAgICByZW5kZXJUYXNrQ29udGVudChwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCk7XG5cbiAgICB0YXNrUmV2ZWFsQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT5cbiAgICAgIHRvZ2dsZVRhc2tEZXRhaWxzKHRhc2tSZXZlYWxJbWcsIHRhc2tJdGVtQm9keSksXG4gICAgKTtcbiAgICB0aXRsZUNoZWNrYm94LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsICgpID0+XG4gICAgICB0b2dnbGVUYXNrU3RhdHVzKHRpdGxlQ2hlY2tib3gsIHByb2plY3RJbmRleCwgdGFza0luZGV4KSxcbiAgICApO1xuICAgIGVkaXRUYXNrQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT5cbiAgICAgIGVkaXRUYXNrTW9kYWwub3BlbkVkaXRUYXNrTW9kYWwoXG4gICAgICAgIGVkaXRUYXNrQnRuLmRhdGFzZXQucHJvamVjdEluZGV4LFxuICAgICAgICBlZGl0VGFza0J0bi5kYXRhc2V0LnRhc2tJbmRleCxcbiAgICAgICksXG4gICAgKTtcbiAgICBkZWxldGVUYXNrQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT5cbiAgICAgIGRlbGV0ZVRhc2tNb2RhbC5vcGVuRGVsZXRlTW9kYWwoXG4gICAgICAgIGRlbGV0ZVRhc2tCdG4uZGF0YXNldC5wcm9qZWN0SW5kZXgsXG4gICAgICAgIGRlbGV0ZVRhc2tCdG4uZGF0YXNldC50YXNrSW5kZXgsXG4gICAgICApLFxuICAgICk7XG5cbiAgICBpZiAodGl0bGVDaGVja2JveC5jaGVja2VkKSB7XG4gICAgICBzZW5kVG9GaW5pc2hlZERpdih0YXNrSW5kZXgpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCB1cGRhdGVUYXNrSW5kaWNlcyA9IChkZWxldGVkSW5kZXgpID0+IHtcbiAgICBjb25zdCBhbGxUYXNrSW5kaWNlcyA9IG1haW5UYXNrcy5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS10YXNrLWluZGV4XScpO1xuICAgIGFsbFRhc2tJbmRpY2VzLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgIGNvbnN0IGN1cnJlbnRJbmRleCA9IE51bWJlcihlbGVtZW50LmRhdGFzZXQudGFza0luZGV4KTtcbiAgICAgIGlmIChjdXJyZW50SW5kZXggPj0gTnVtYmVyKGRlbGV0ZWRJbmRleCkpIHtcbiAgICAgICAgZWxlbWVudC5kYXRhc2V0LnRhc2tJbmRleCA9IGN1cnJlbnRJbmRleCAtIDE7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgY29uc3QgcmVuZGVyRGVsZXRlZFRhc2sgPSAodGFza0luZGV4KSA9PiB7XG4gICAgY29uc3QgdGFza1RvRGVsZXRlID0gbWFpblRhc2tzLnF1ZXJ5U2VsZWN0b3IoXG4gICAgICBgZGl2W2RhdGEtdGFzay1pbmRleD0nJHt0YXNrSW5kZXh9J11gLFxuICAgICk7XG4gICAgdGFza1RvRGVsZXRlLnJlbW92ZSgpO1xuICAgIHVwZGF0ZVRhc2tJbmRpY2VzKHRhc2tJbmRleCk7XG4gIH07XG5cbiAgY29uc3QgcmVuZGVyTWFpbiA9IChwcm9qZWN0LCBwcm9qZWN0SW5kZXgpID0+IHtcbiAgICByZW5kZXJIZWFkZXIocHJvamVjdCk7XG4gICAgc2V0TmV3VGFza0J0bkluZGV4KHByb2plY3RJbmRleCk7XG4gICAgY2xlYXJUYXNrcygpO1xuICAgIGlmIChwcm9qZWN0LnRhc2tzLmxlbmd0aCA+IDApIHtcbiAgICAgIHByb2plY3QudGFza3MuZm9yRWFjaCgodGFzaykgPT5cbiAgICAgICAgcmVuZGVyVGFzayhwcm9qZWN0SW5kZXgsIHByb2plY3QudGFza3MuaW5kZXhPZih0YXNrKSksXG4gICAgICApO1xuICAgIH1cbiAgfTtcblxuICAvKiBGdW5jdGlvbiB0byBpbnZva2Ugb24gaW5pdGlsaXNlLCBmb3IgdGhlIGNvbXBvbmVudCB0byB3b3JrIHByb3Blcmx5ICovXG4gIGNvbnN0IGluaXQgPSAoKSA9PiB7XG4gICAgY29uc3QgZmlyc3RQcm9qZWN0ID0gcHJvamVjdE1hbmFnZXIucmV2ZWFsUHJvamVjdCgwKTtcbiAgICByZW5kZXJNYWluKGZpcnN0UHJvamVjdCwgMCk7XG4gICAgYWRkTmV3VGFza0J0bkxpc3RlbmVyKCk7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICByZW5kZXJIZWFkZXIsXG4gICAgc2V0TmV3VGFza0J0bkluZGV4LFxuICAgIGFkZE5ld1Rhc2tCdG5MaXN0ZW5lcixcbiAgICBjbGVhclRhc2tzLFxuICAgIHJlbmRlclRhc2tDb250ZW50LFxuICAgIHJlbmRlclRhc2ssXG4gICAgcmVuZGVyRGVsZXRlZFRhc2ssXG4gICAgcmVuZGVyTWFpbixcbiAgICBpbml0LFxuICB9O1xufSkoKTtcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi0gQXNpZGUgbW9kdWxlXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuY29uc3QgYXNpZGUgPSAoKCkgPT4ge1xuICAvKiBjb25zdCBmaWx0ZXJzQXNpZGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdhc2lkZScpOyAqL1xuICBjb25zdCBtYWluVGFza3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudW5maW5pc2hlZC10YXNrcycpO1xuICBjb25zdCBtYWluRmluaXNoZWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZmluaXNoZWQtdGFza3MnKTtcbiAgY29uc3Qgc2VhcmNoYmFyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlYXJjaC10YXNrcycpO1xuICBjb25zdCBvcmRlck9wdGlvbnMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnb3JkZXItb3B0aW9ucycpO1xuXG4gIGNvbnN0IHNlYXJjaEZvck1hdGNoID0gKCkgPT4ge1xuICAgIGNvbnN0IGluZGV4ID0gTnVtYmVyKFxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW4tbmV3LXRhc2stYnV0dG9uJykuZGF0YXNldC5wcm9qZWN0SW5kZXgsXG4gICAgKTtcbiAgICBjb25zdCBjdXJyZW50UHJvamVjdCA9IHByb2plY3RNYW5hZ2VyLnJldmVhbFByb2plY3QoaW5kZXgpO1xuICAgIGNvbnN0IHRleHRUb0NvbXBhcmUgPSBzZWFyY2hiYXIudmFsdWU7XG4gICAgY29uc3QgZmlsdGVyVGFza3MgPSAodGFzaykgPT4ge1xuICAgICAgaWYgKFxuICAgICAgICB0YXNrLnRpdGxlLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXModGV4dFRvQ29tcGFyZS50b0xvd2VyQ2FzZSgpKSB8fFxuICAgICAgICB0YXNrLmRlc2NyaXB0aW9uLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXModGV4dFRvQ29tcGFyZS50b0xvd2VyQ2FzZSgpKSB8fFxuICAgICAgICB0YXNrLnN0ZXBzLmZpbHRlcigoc3RlcCkgPT5cbiAgICAgICAgICBzdGVwLmRlc2NyaXB0aW9uLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXModGV4dFRvQ29tcGFyZS50b0xvd2VyQ2FzZSgpKSxcbiAgICAgICAgKS5sZW5ndGggPiAwXG4gICAgICApIHtcbiAgICAgICAgbWFpbi5yZW5kZXJUYXNrKGluZGV4LCBjdXJyZW50UHJvamVjdC50YXNrcy5pbmRleE9mKHRhc2spKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcblxuICAgIGlmICh0ZXh0VG9Db21wYXJlICE9PSAnJykge1xuICAgICAgbWFpbi5jbGVhclRhc2tzKCk7XG4gICAgICBjb25zdCBmaWx0ZXJlZFRhc2tzID0gY3VycmVudFByb2plY3QudGFza3MuZmlsdGVyKCh0YXNrKSA9PlxuICAgICAgICBmaWx0ZXJUYXNrcyh0YXNrKSxcbiAgICAgICk7XG4gICAgICBpZiAoZmlsdGVyZWRUYXNrcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgY29uc3Qgbm9UYXNrc01lc3NhZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICAgIG5vVGFza3NNZXNzYWdlLnRleHRDb250ZW50ID0gJ05vIG1hdGNoZXMgZm91bmQnO1xuICAgICAgICBtYWluVGFza3MuYXBwZW5kQ2hpbGQobm9UYXNrc01lc3NhZ2UpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGV4dFRvQ29tcGFyZSA9PT0gJycpIHtcbiAgICAgIG1haW4ucmVuZGVyTWFpbihjdXJyZW50UHJvamVjdCwgaW5kZXgpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBzb3J0QVRvWiA9ICgpID0+IHtcbiAgICBjb25zdCB0YXNrc1RvRG8gPSBBcnJheS5mcm9tKG1haW5UYXNrcy5xdWVyeVNlbGVjdG9yQWxsKCcudGFzay1yb3cnKSk7XG4gICAgY29uc3QgdGFza3NEb25lID0gQXJyYXkuZnJvbShtYWluRmluaXNoZWQucXVlcnlTZWxlY3RvckFsbCgnLnRhc2stcm93JykpO1xuICAgIHRhc2tzVG9Eby5zb3J0KChhLCBiKSA9PiB7XG4gICAgICBjb25zdCBhVGl0bGUgPSBhLnF1ZXJ5U2VsZWN0b3IoJ2xhYmVsJyk7XG4gICAgICBjb25zdCBiVGl0bGUgPSBiLnF1ZXJ5U2VsZWN0b3IoJ2xhYmVsJyk7XG4gICAgICBpZiAoYVRpdGxlLnRleHRDb250ZW50LnRvTG93ZXJDYXNlKCkgPCBiVGl0bGUudGV4dENvbnRlbnQudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICBtYWluVGFza3MuaW5zZXJ0QmVmb3JlKGEsIGIpO1xuICAgICAgICByZXR1cm4gLTE7XG4gICAgICB9XG4gICAgICBpZiAoYVRpdGxlLnRleHRDb250ZW50LnRvTG93ZXJDYXNlKCkgPiBiVGl0bGUudGV4dENvbnRlbnQudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICBtYWluVGFza3MuaW5zZXJ0QmVmb3JlKGIsIGEpO1xuICAgICAgICByZXR1cm4gMTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAwO1xuICAgIH0pO1xuICAgIHRhc2tzRG9uZS5zb3J0KChhLCBiKSA9PiB7XG4gICAgICBjb25zdCBhVGl0bGUgPSBhLnF1ZXJ5U2VsZWN0b3IoJ2xhYmVsJyk7XG4gICAgICBjb25zdCBiVGl0bGUgPSBiLnF1ZXJ5U2VsZWN0b3IoJ2xhYmVsJyk7XG4gICAgICBpZiAoYVRpdGxlLnRleHRDb250ZW50LnRvTG93ZXJDYXNlKCkgPCBiVGl0bGUudGV4dENvbnRlbnQudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICBtYWluRmluaXNoZWQuaW5zZXJ0QmVmb3JlKGEsIGIpO1xuICAgICAgICByZXR1cm4gLTE7XG4gICAgICB9XG4gICAgICBpZiAoYVRpdGxlLnRleHRDb250ZW50LnRvTG93ZXJDYXNlKCkgPiBiVGl0bGUudGV4dENvbnRlbnQudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICBtYWluRmluaXNoZWQuaW5zZXJ0QmVmb3JlKGIsIGEpO1xuICAgICAgICByZXR1cm4gMTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAwO1xuICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IHNvcnRaVG9BID0gKCkgPT4ge1xuICAgIGNvbnN0IHRhc2tzVG9EbyA9IEFycmF5LmZyb20obWFpblRhc2tzLnF1ZXJ5U2VsZWN0b3JBbGwoJy50YXNrLXJvdycpKTtcbiAgICBjb25zdCB0YXNrc0RvbmUgPSBBcnJheS5mcm9tKG1haW5GaW5pc2hlZC5xdWVyeVNlbGVjdG9yQWxsKCcudGFzay1yb3cnKSk7XG4gICAgdGFza3NUb0RvLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgIGNvbnN0IGFUaXRsZSA9IGEucXVlcnlTZWxlY3RvcignbGFiZWwnKTtcbiAgICAgIGNvbnN0IGJUaXRsZSA9IGIucXVlcnlTZWxlY3RvcignbGFiZWwnKTtcbiAgICAgIGlmIChhVGl0bGUudGV4dENvbnRlbnQudG9Mb3dlckNhc2UoKSA+IGJUaXRsZS50ZXh0Q29udGVudC50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgIG1haW5UYXNrcy5pbnNlcnRCZWZvcmUoYSwgYik7XG4gICAgICAgIHJldHVybiAtMTtcbiAgICAgIH1cbiAgICAgIGlmIChhVGl0bGUudGV4dENvbnRlbnQudG9Mb3dlckNhc2UoKSA8IGJUaXRsZS50ZXh0Q29udGVudC50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgIG1haW5UYXNrcy5pbnNlcnRCZWZvcmUoYiwgYSk7XG4gICAgICAgIHJldHVybiAxO1xuICAgICAgfVxuICAgICAgcmV0dXJuIDA7XG4gICAgfSk7XG4gICAgdGFza3NEb25lLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgIGNvbnN0IGFUaXRsZSA9IGEucXVlcnlTZWxlY3RvcignbGFiZWwnKTtcbiAgICAgIGNvbnN0IGJUaXRsZSA9IGIucXVlcnlTZWxlY3RvcignbGFiZWwnKTtcbiAgICAgIGlmIChhVGl0bGUudGV4dENvbnRlbnQudG9Mb3dlckNhc2UoKSA+IGJUaXRsZS50ZXh0Q29udGVudC50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgIG1haW5GaW5pc2hlZC5pbnNlcnRCZWZvcmUoYSwgYik7XG4gICAgICAgIHJldHVybiAtMTtcbiAgICAgIH1cbiAgICAgIGlmIChhVGl0bGUudGV4dENvbnRlbnQudG9Mb3dlckNhc2UoKSA8IGJUaXRsZS50ZXh0Q29udGVudC50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgIG1haW5GaW5pc2hlZC5pbnNlcnRCZWZvcmUoYiwgYSk7XG4gICAgICAgIHJldHVybiAxO1xuICAgICAgfVxuICAgICAgcmV0dXJuIDA7XG4gICAgfSk7XG4gIH07XG5cbiAgY29uc3QgZmlsdGVyUHJpb3JpdHkgPSAodGFzaywgcHJpb3JpdHlMZXZlbCwgcHJvamVjdEluZGV4LCB0YXNrSW5kZXgpID0+IHtcbiAgICBpZiAodGFzay5wcmlvcml0eSA9PT0gcHJpb3JpdHlMZXZlbCkge1xuICAgICAgbWFpbi5yZW5kZXJUYXNrKHByb2plY3RJbmRleCwgdGFza0luZGV4KTtcbiAgICAgIGlmICh0YXNrLnN0YXR1cyA9PT0gJ2RvbmUnKSB7XG4gICAgICAgIGNvbnN0IHJlbmRlcmVkVGFzayA9IG1haW5GaW5pc2hlZC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAgIGAudGFzay1yb3dbZGF0YS10YXNrLWluZGV4PScke3Rhc2tJbmRleH0nXWAsXG4gICAgICAgICk7XG4gICAgICAgIG1haW5GaW5pc2hlZC5hcHBlbmRDaGlsZChyZW5kZXJlZFRhc2spO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICBjb25zdCBvcmRlclRhc2tzID0gKCkgPT4ge1xuICAgIGNvbnN0IGluZGV4ID0gTnVtYmVyKFxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW4tbmV3LXRhc2stYnV0dG9uJykuZGF0YXNldC5wcm9qZWN0SW5kZXgsXG4gICAgKTtcbiAgICBjb25zdCBjdXJyZW50UHJvamVjdCA9IHByb2plY3RNYW5hZ2VyLnJldmVhbFByb2plY3QoaW5kZXgpO1xuXG4gICAgc3dpdGNoIChvcmRlck9wdGlvbnMudmFsdWUpIHtcbiAgICAgIGNhc2UgJ3ByaW9yaXR5LWhpZ2hlc3QnOlxuICAgICAgICBtYWluLmNsZWFyVGFza3MoKTtcbiAgICAgICAgY3VycmVudFByb2plY3QudGFza3MuZmlsdGVyKCh0YXNrKSA9PlxuICAgICAgICAgIGZpbHRlclByaW9yaXR5KFxuICAgICAgICAgICAgdGFzayxcbiAgICAgICAgICAgICdoaWdoJyxcbiAgICAgICAgICAgIGluZGV4LFxuICAgICAgICAgICAgY3VycmVudFByb2plY3QudGFza3MuaW5kZXhPZih0YXNrKSxcbiAgICAgICAgICApLFxuICAgICAgICApO1xuICAgICAgICBjdXJyZW50UHJvamVjdC50YXNrcy5maWx0ZXIoKHRhc2spID0+XG4gICAgICAgICAgZmlsdGVyUHJpb3JpdHkoXG4gICAgICAgICAgICB0YXNrLFxuICAgICAgICAgICAgJ21lZGl1bScsXG4gICAgICAgICAgICBpbmRleCxcbiAgICAgICAgICAgIGN1cnJlbnRQcm9qZWN0LnRhc2tzLmluZGV4T2YodGFzayksXG4gICAgICAgICAgKSxcbiAgICAgICAgKTtcbiAgICAgICAgY3VycmVudFByb2plY3QudGFza3MuZmlsdGVyKCh0YXNrKSA9PlxuICAgICAgICAgIGZpbHRlclByaW9yaXR5KFxuICAgICAgICAgICAgdGFzayxcbiAgICAgICAgICAgICdsb3cnLFxuICAgICAgICAgICAgaW5kZXgsXG4gICAgICAgICAgICBjdXJyZW50UHJvamVjdC50YXNrcy5pbmRleE9mKHRhc2spLFxuICAgICAgICAgICksXG4gICAgICAgICk7XG4gICAgICAgIGN1cnJlbnRQcm9qZWN0LnRhc2tzLmZpbHRlcigodGFzaykgPT5cbiAgICAgICAgICBmaWx0ZXJQcmlvcml0eShcbiAgICAgICAgICAgIHRhc2ssXG4gICAgICAgICAgICAnbm9uZScsXG4gICAgICAgICAgICBpbmRleCxcbiAgICAgICAgICAgIGN1cnJlbnRQcm9qZWN0LnRhc2tzLmluZGV4T2YodGFzayksXG4gICAgICAgICAgKSxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdwcmlvcml0eS1sb3dlc3QnOlxuICAgICAgICBtYWluLmNsZWFyVGFza3MoKTtcbiAgICAgICAgY3VycmVudFByb2plY3QudGFza3MuZmlsdGVyKCh0YXNrKSA9PlxuICAgICAgICAgIGZpbHRlclByaW9yaXR5KFxuICAgICAgICAgICAgdGFzayxcbiAgICAgICAgICAgICdub25lJyxcbiAgICAgICAgICAgIGluZGV4LFxuICAgICAgICAgICAgY3VycmVudFByb2plY3QudGFza3MuaW5kZXhPZih0YXNrKSxcbiAgICAgICAgICApLFxuICAgICAgICApO1xuICAgICAgICBjdXJyZW50UHJvamVjdC50YXNrcy5maWx0ZXIoKHRhc2spID0+XG4gICAgICAgICAgZmlsdGVyUHJpb3JpdHkoXG4gICAgICAgICAgICB0YXNrLFxuICAgICAgICAgICAgJ2xvdycsXG4gICAgICAgICAgICBpbmRleCxcbiAgICAgICAgICAgIGN1cnJlbnRQcm9qZWN0LnRhc2tzLmluZGV4T2YodGFzayksXG4gICAgICAgICAgKSxcbiAgICAgICAgKTtcbiAgICAgICAgY3VycmVudFByb2plY3QudGFza3MuZmlsdGVyKCh0YXNrKSA9PlxuICAgICAgICAgIGZpbHRlclByaW9yaXR5KFxuICAgICAgICAgICAgdGFzayxcbiAgICAgICAgICAgICdtZWRpdW0nLFxuICAgICAgICAgICAgaW5kZXgsXG4gICAgICAgICAgICBjdXJyZW50UHJvamVjdC50YXNrcy5pbmRleE9mKHRhc2spLFxuICAgICAgICAgICksXG4gICAgICAgICk7XG4gICAgICAgIGN1cnJlbnRQcm9qZWN0LnRhc2tzLmZpbHRlcigodGFzaykgPT5cbiAgICAgICAgICBmaWx0ZXJQcmlvcml0eShcbiAgICAgICAgICAgIHRhc2ssXG4gICAgICAgICAgICAnaGlnaCcsXG4gICAgICAgICAgICBpbmRleCxcbiAgICAgICAgICAgIGN1cnJlbnRQcm9qZWN0LnRhc2tzLmluZGV4T2YodGFzayksXG4gICAgICAgICAgKSxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdBLVonOlxuICAgICAgICBzb3J0QVRvWigpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ1otQSc6XG4gICAgICAgIHNvcnRaVG9BKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgbWFpbi5yZW5kZXJNYWluKGN1cnJlbnRQcm9qZWN0LCBpbmRleCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfTtcblxuICAvKiBGdW5jdGlvbiB0byBpbnZva2Ugb24gaW5pdGlsaXNlLCBmb3IgdGhlIGNvbXBvbmVudCB0byB3b3JrIHByb3Blcmx5ICovXG4gIGNvbnN0IGFkZFNlYXJjaGJhckxJc3RlbmVyID0gKCkgPT4ge1xuICAgIHNlYXJjaGJhci5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIHNlYXJjaEZvck1hdGNoKTtcbiAgfTtcblxuICBjb25zdCBhZGRPcmRlck9wdGlvbnNMaXN0ZW5lciA9ICgpID0+IHtcbiAgICBvcmRlck9wdGlvbnMuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgb3JkZXJUYXNrcyk7XG4gIH07XG5cbiAgcmV0dXJuIHsgYWRkU2VhcmNoYmFyTElzdGVuZXIsIGFkZE9yZGVyT3B0aW9uc0xpc3RlbmVyIH07XG59KSgpO1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLSBNb2R1bGUgdG8gY29udHJvbCB0aGluZ3MgY29tbW9uIG1vc3QgbW9kYWxzXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuY29uc3QgYWxsTW9kYWxzID0gKCgpID0+IHtcbiAgLyogR2VuZXJhbCBmdW5jdGlvbnMgdG8gY2xvc2UgbW9kYWxzIGFuZCBjbGVhciBpbnB1dHMgKi9cbiAgY29uc3QgY2xlYXJJbnB1dHMgPSAobW9kYWwpID0+IHtcbiAgICBjb25zdCBpbnB1dHMgPSBtb2RhbC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dCcpO1xuICAgIGNvbnN0IHRleHRhcmVhcyA9IG1vZGFsLnF1ZXJ5U2VsZWN0b3JBbGwoJ3RleHRhcmVhJyk7XG4gICAgY29uc3Qgc2VsZWN0T3B0aW9uID0gbW9kYWwucXVlcnlTZWxlY3Rvcignb3B0aW9uJyk7XG4gICAgY29uc3Qgc3RlcHNMaXN0ID0gbW9kYWwucXVlcnlTZWxlY3RvcignLm1vZGFsLXN0ZXBzLWxpc3QnKTtcbiAgICBpZiAoaW5wdXRzKSB7XG4gICAgICBpbnB1dHMuZm9yRWFjaCgoaW5wdXQpID0+IHtcbiAgICAgICAgaW5wdXQudmFsdWUgPSAnJztcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAodGV4dGFyZWFzKSB7XG4gICAgICB0ZXh0YXJlYXMuZm9yRWFjaCgodGV4dGFyZWEpID0+IHtcbiAgICAgICAgdGV4dGFyZWEudmFsdWUgPSAnJztcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoc2VsZWN0T3B0aW9uKSB7XG4gICAgICBzZWxlY3RPcHRpb24uc2VsZWN0ZWQgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoc3RlcHNMaXN0KSB7XG4gICAgICBzdGVwc0NvbXBvbmVudC5jbGVhckFsbFN0ZXBzKHN0ZXBzTGlzdCk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGNsb3NlTW9kYWwgPSAobW9kYWwpID0+IHtcbiAgICBjbGVhcklucHV0cyhtb2RhbCk7XG4gICAgdG9nZ2xlSGlkZGVuKG1vZGFsKTtcbiAgfTtcblxuICAvKiBGdW5jdGlvbnMgdG8gaW52b2tlIG9uIGluaXRpbGlzZSwgZm9yIHRoZSBjb21wb25lbnQgdG8gd29yayBwcm9wZXJseSAqL1xuICBjb25zdCBhZGRDbG9zZUJ0bkxpc3RlbmVycyA9ICgpID0+IHtcbiAgICBjb25zdCBjbG9zZU1vZGFsQnRucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5tb2RhbC1jbG9zZS1idXR0b24nKTtcblxuICAgIGNsb3NlTW9kYWxCdG5zLmZvckVhY2goKGJ0bikgPT4ge1xuICAgICAgY29uc3QgbW9kYWwgPSBidG4ucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQ7XG4gICAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBjbG9zZU1vZGFsKG1vZGFsKSk7XG4gICAgfSk7XG4gIH07XG5cbiAgY29uc3QgYWRkQ2xvc2VCYWNrZ3JvdW5kTGlzdGVuZXJzID0gKCkgPT4ge1xuICAgIGNvbnN0IG1vZGFsQmFja2dyb3VuZHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubW9kYWwtYmFja2dyb3VuZCcpO1xuICAgIGNvbnN0IGNsb3NlID0gKGUsIG1vZGFsQmFja2dyb3VuZCkgPT4ge1xuICAgICAgaWYgKCFlLnRhcmdldC5jbG9zZXN0KCcubW9kYWwnKSkge1xuICAgICAgICBjbG9zZU1vZGFsKG1vZGFsQmFja2dyb3VuZCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIG1vZGFsQmFja2dyb3VuZHMuZm9yRWFjaCgoYmFja2dyb3VuZCkgPT4ge1xuICAgICAgYmFja2dyb3VuZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiBjbG9zZShlLCBiYWNrZ3JvdW5kKSk7XG4gICAgfSk7XG4gIH07XG5cbiAgcmV0dXJuIHsgY2xvc2VNb2RhbCwgYWRkQ2xvc2VCdG5MaXN0ZW5lcnMsIGFkZENsb3NlQmFja2dyb3VuZExpc3RlbmVycyB9O1xufSkoKTtcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi0gJ05ldyBMaXN0JyBtb2RhbCBtb2R1bGVcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5jb25zdCBuZXdMaXN0TW9kYWwgPSAoKCkgPT4ge1xuICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uZXctbGlzdC1tb2RhbCcpLnBhcmVudEVsZW1lbnQ7XG4gIGNvbnN0IHN1Ym1pdEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZXctbGlzdC1zdWJtaXQtYnV0dG9uJyk7XG5cbiAgY29uc3QgY3JlYXROZXdMaXN0ID0gKGUpID0+IHtcbiAgICBjb25zdCB0aXRsZUlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25ldy1saXN0LW5hbWUnKS52YWx1ZTtcbiAgICBjb25zdCBkZXNjcmlwdGlvbklucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG4gICAgICAnbmV3LWxpc3QtZGVzY3JpcHRpb24nLFxuICAgICkudmFsdWU7XG4gICAgY29uc3QgaW5kZXggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmF2LXRvZG8tbGlzdHMnKS5jaGlsZHJlbi5sZW5ndGg7XG5cbiAgICBpZiAodGl0bGVJbnB1dCAhPT0gJycpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgY29uc3QgbmV3TGlzdCA9IHByb2plY3RNYW5hZ2VyLmNyZWF0ZU5ld1Byb2plY3QoXG4gICAgICAgIHRpdGxlSW5wdXQsXG4gICAgICAgIGRlc2NyaXB0aW9uSW5wdXQsXG4gICAgICApO1xuICAgICAgbmF2YmFyLnJlbmRlck5ld0xpc3QobmV3TGlzdCwgbmF2YmFyLmNhbGN1bGF0ZU5ld1Byb2plY3RJbmRleCgpKTtcbiAgICAgIG1haW4ucmVuZGVyTWFpbihwcm9qZWN0TWFuYWdlci5yZXZlYWxQcm9qZWN0KGluZGV4ICsgMSksIGluZGV4ICsgMSk7XG5cbiAgICAgIGFsbE1vZGFscy5jbG9zZU1vZGFsKG1vZGFsKTtcbiAgICB9XG4gIH07XG5cbiAgLyogRnVuY3Rpb24gdG8gaW52b2tlIG9uIGluaXRpbGlzZSwgZm9yIHRoZSBjb21wb25lbnQgdG8gd29yayBwcm9wZXJseSAqL1xuICBjb25zdCBhZGRTdWJtaXRCdG5MaXN0ZW5lciA9ICgpID0+IHtcbiAgICBzdWJtaXRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4gY3JlYXROZXdMaXN0KGUpKTtcbiAgfTtcblxuICByZXR1cm4geyBhZGRTdWJtaXRCdG5MaXN0ZW5lciB9O1xufSkoKTtcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi0gJ0VkaXQgbGlzdCcgbW9kYWwgbW9kdWxlXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuY29uc3QgZWRpdExpc3RNb2RhbCA9ICgoKSA9PiB7XG4gIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmVkaXQtbGlzdC1tb2RhbCcpLnBhcmVudEVsZW1lbnQ7XG4gIGNvbnN0IGVkaXRCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZWRpdC1saXN0LXN1Ym1pdC1idXR0b24nKTtcblxuICBjb25zdCBzZXRQcm9qZWN0RGF0YUluZGV4ID0gKHByb2plY3RJbmRleCkgPT4ge1xuICAgIGVkaXRCdG4uZGF0YXNldC5wcm9qZWN0SW5kZXggPSBwcm9qZWN0SW5kZXg7XG4gIH07XG5cbiAgY29uc3Qgb3BlbkVkaXRNb2RhbCA9IChwcm9qZWN0SW5kZXgpID0+IHtcbiAgICBjb25zdCB0aXRsZUlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VkaXQtbGlzdC1uYW1lJyk7XG4gICAgY29uc3QgZGVzY3JpcHRpb25JbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlZGl0LWxpc3QtZGVzY3JpcHRpb24nKTtcbiAgICBjb25zdCBwcm9qZWN0VG9FZGl0ID0gcHJvamVjdE1hbmFnZXIucmV2ZWFsUHJvamVjdChOdW1iZXIocHJvamVjdEluZGV4KSk7XG5cbiAgICB0aXRsZUlucHV0LnZhbHVlID0gcHJvamVjdFRvRWRpdC50aXRsZTtcbiAgICBkZXNjcmlwdGlvbklucHV0LnZhbHVlID0gcHJvamVjdFRvRWRpdC5kZXNjcmlwdGlvbjtcblxuICAgIHNldFByb2plY3REYXRhSW5kZXgocHJvamVjdEluZGV4KTtcbiAgICB0b2dnbGVIaWRkZW4obW9kYWwpO1xuICB9O1xuXG4gIGNvbnN0IGVkaXRMaXN0ID0gKGUpID0+IHtcbiAgICBjb25zdCB0aXRsZUlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VkaXQtbGlzdC1uYW1lJykudmFsdWU7XG4gICAgY29uc3QgZGVzY3JpcHRpb25JbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuICAgICAgJ2VkaXQtbGlzdC1kZXNjcmlwdGlvbicsXG4gICAgKS52YWx1ZTtcbiAgICBjb25zdCBpbmRleCA9IE51bWJlcihlZGl0QnRuLmRhdGFzZXQucHJvamVjdEluZGV4KTtcblxuICAgIGlmICh0aXRsZUlucHV0ICE9PSAnJykge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgcHJvamVjdE1hbmFnZXIuZWRpdFByb2plY3RUaXRsZShpbmRleCwgdGl0bGVJbnB1dCk7XG4gICAgICBwcm9qZWN0TWFuYWdlci5lZGl0UHJvamVjdERlc2NyaXB0aW9uKGluZGV4LCBkZXNjcmlwdGlvbklucHV0KTtcbiAgICAgIGNvbnN0IGVkaXRlZFByb2plY3QgPSBwcm9qZWN0TWFuYWdlci5yZXZlYWxQcm9qZWN0KGluZGV4KTtcbiAgICAgIG5hdmJhci5yZW5kZXJFZGl0ZWRMaXN0KGluZGV4LCBlZGl0ZWRQcm9qZWN0KTtcbiAgICAgIG1haW4ucmVuZGVyTWFpbihlZGl0ZWRQcm9qZWN0LCBpbmRleCk7XG4gICAgICBhbGxNb2RhbHMuY2xvc2VNb2RhbChtb2RhbCk7XG4gICAgfVxuICB9O1xuXG4gIC8qIEZ1bmN0aW9uIHRvIGludm9rZSBvbiBpbml0aWxpc2UsIGZvciB0aGUgY29tcG9uZW50IHRvIHdvcmsgcHJvcGVybHkgKi9cbiAgY29uc3QgYWRkRWRpdEJ0bkxpc3RlbmVyID0gKCkgPT4ge1xuICAgIGVkaXRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4gZWRpdExpc3QoZSkpO1xuICB9O1xuXG4gIHJldHVybiB7IG9wZW5FZGl0TW9kYWwsIGFkZEVkaXRCdG5MaXN0ZW5lciB9O1xufSkoKTtcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi0gJ0RlbGV0ZSBsaXN0JyBtb2RhbCBtb2R1bGVcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5jb25zdCBkZWxldGVMaXN0TW9kYWwgPSAoKCkgPT4ge1xuICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kZWxldGUtbGlzdC1tb2RhbCcpLnBhcmVudEVsZW1lbnQ7XG4gIGNvbnN0IGNhbmNlbEJ0biA9IG1vZGFsLnF1ZXJ5U2VsZWN0b3IoJy5jYW5jZWwtYnV0dG9uJyk7XG4gIGNvbnN0IGRlbGV0ZUJ0biA9IG1vZGFsLnF1ZXJ5U2VsZWN0b3IoJy5kZWxldGUtYnV0dG9uJyk7XG5cbiAgY29uc3Qgc2V0UHJvamVjdERhdGFJbmRleCA9IChwcm9qZWN0SW5kZXgpID0+IHtcbiAgICBkZWxldGVCdG4uZGF0YXNldC5wcm9qZWN0SW5kZXggPSBwcm9qZWN0SW5kZXg7XG4gIH07XG5cbiAgY29uc3Qgb3BlbkRlbGV0ZU1vZGFsID0gKHByb2plY3RJbmRleCkgPT4ge1xuICAgIHNldFByb2plY3REYXRhSW5kZXgocHJvamVjdEluZGV4KTtcbiAgICB0b2dnbGVIaWRkZW4obW9kYWwpO1xuICB9O1xuXG4gIGNvbnN0IGRlbGV0ZUxpc3QgPSAoKSA9PiB7XG4gICAgY29uc3QgaW5kZXggPSBOdW1iZXIoZGVsZXRlQnRuLmRhdGFzZXQucHJvamVjdEluZGV4KTtcbiAgICBwcm9qZWN0TWFuYWdlci5kZWxldGVQcm9qZWN0KGluZGV4KTtcbiAgICBuYXZiYXIucmVuZGVyRGVsZXRlZExpc3QoaW5kZXgpO1xuICAgIG1haW4ucmVuZGVyTWFpbihwcm9qZWN0TWFuYWdlci5yZXZlYWxQcm9qZWN0KDApLCAwKTtcbiAgICB0b2dnbGVIaWRkZW4obW9kYWwpO1xuICB9O1xuXG4gIC8qIEZ1bmN0aW9ucyB0byBpbnZva2Ugb24gaW5pdGlsaXNlLCBmb3IgdGhlIGNvbXBvbmVudCB0byB3b3JrIHByb3Blcmx5ICovXG4gIGNvbnN0IGFkZENhbmNlbEJ0bkxpc3RlbmVyID0gKCkgPT4ge1xuICAgIGNhbmNlbEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHRvZ2dsZUhpZGRlbihtb2RhbCkpO1xuICB9O1xuXG4gIGNvbnN0IGFkZERlbGV0ZUJ0bkxpc3RlbmVyID0gKCkgPT4ge1xuICAgIGRlbGV0ZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGRlbGV0ZUxpc3QpO1xuICB9O1xuXG4gIHJldHVybiB7IG9wZW5EZWxldGVNb2RhbCwgYWRkQ2FuY2VsQnRuTGlzdGVuZXIsIGFkZERlbGV0ZUJ0bkxpc3RlbmVyIH07XG59KSgpO1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLSAnTmV3IHRhc2snIG1vZGFsIG1vZHVsZVxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbmNvbnN0IG5ld1Rhc2tNb2RhbCA9ICgoKSA9PiB7XG4gIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5ldy10YXNrLW1vZGFsJykucGFyZW50RWxlbWVudDtcbiAgY29uc3QgbmV3VGFza0J0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZXctdGFzay1zdWJtaXQtYnV0dG9uJyk7XG4gIGNvbnN0IHN0ZXBzTGlzdCA9IG1vZGFsLnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbC1zdGVwcy1saXN0Jyk7XG5cbiAgY29uc3Qgc2V0UHJvamVjdERhdGFJbmRleCA9IChwcm9qZWN0SW5kZXgpID0+IHtcbiAgICBuZXdUYXNrQnRuLmRhdGFzZXQucHJvamVjdEluZGV4ID0gcHJvamVjdEluZGV4O1xuICB9O1xuXG4gIGNvbnN0IG9wZW5OZXdUYXNrTW9kYWwgPSAocHJvamVjdEluZGV4KSA9PiB7XG4gICAgc2V0UHJvamVjdERhdGFJbmRleChwcm9qZWN0SW5kZXgpO1xuICAgIHN0ZXBzQ29tcG9uZW50LmNsZWFyQWxsU3RlcHMoc3RlcHNMaXN0KTtcbiAgICB0b2dnbGVIaWRkZW4obW9kYWwpO1xuICB9O1xuXG4gIGNvbnN0IHN1Ym1pdE5ld1Rhc2sgPSAoZSkgPT4ge1xuICAgIGNvbnN0IHByb2plY3RJbmRleCA9IE51bWJlcihuZXdUYXNrQnRuLmRhdGFzZXQucHJvamVjdEluZGV4KTtcbiAgICBjb25zdCBuZXdUaXRsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZXctdGFzay1uYW1lJykudmFsdWU7XG4gICAgY29uc3QgbmV3RGVzY3JpcHRpb24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcbiAgICAgICduZXctdGFzay1kZXNjcmlwdGlvbicsXG4gICAgKS52YWx1ZTtcbiAgICBjb25zdCBuZXdEYXRlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25ldy10YXNrLWRhdGUnKS52YWx1ZTtcbiAgICBjb25zdCBuZXdQcmlvcml0eSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZXctdGFzay1wcmlvcml0eScpLnZhbHVlO1xuICAgIGNvbnN0IG5ld1N0ZXBzID0gc3RlcHNDb21wb25lbnQucmV2ZWFsU3RlcHMoKTtcblxuICAgIGlmIChuZXdUaXRsZSAhPT0gJycpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHRhc2tNYW5hZ2VyLmNyZWF0ZU5ld1Rhc2soXG4gICAgICAgIHByb2plY3RJbmRleCxcbiAgICAgICAgbmV3VGl0bGUsXG4gICAgICAgIG5ld0Rlc2NyaXB0aW9uLFxuICAgICAgICBuZXdEYXRlLFxuICAgICAgICBuZXdQcmlvcml0eSxcbiAgICAgICAgJ3RvIGRvJyxcbiAgICAgICk7XG4gICAgICBjb25zdCBsZW5ndGggPSBwcm9qZWN0TWFuYWdlci5yZXZlYWxQcm9qZWN0VGFza3NMZW5ndGgocHJvamVjdEluZGV4KTtcbiAgICAgIG5ld1N0ZXBzLmZvckVhY2goKHN0ZXApID0+IHtcbiAgICAgICAgc3RlcE1hbmFnZXIuY3JlYXRlTmV3U3RlcChcbiAgICAgICAgICBwcm9qZWN0SW5kZXgsXG4gICAgICAgICAgbGVuZ3RoIC0gMSxcbiAgICAgICAgICBzdGVwLmRlc2NyaXB0aW9uLFxuICAgICAgICAgIHN0ZXAuc3RhdHVzLFxuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgICBtYWluLnJlbmRlclRhc2socHJvamVjdEluZGV4LCBsZW5ndGggLSAxKTtcbiAgICAgIGFsbE1vZGFscy5jbG9zZU1vZGFsKG1vZGFsKTtcbiAgICB9XG4gIH07XG5cbiAgLyogRnVuY3Rpb25zIHRvIGludm9rZSBvbiBpbml0aWxpc2UsIGZvciB0aGUgY29tcG9uZW50IHRvIHdvcmsgcHJvcGVybHkgKi9cbiAgY29uc3QgYWRkTmV3VGFza0J0bkxJc3RlbmVyID0gKCkgPT4ge1xuICAgIG5ld1Rhc2tCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4gc3VibWl0TmV3VGFzayhlKSk7XG4gIH07XG5cbiAgcmV0dXJuIHsgb3Blbk5ld1Rhc2tNb2RhbCwgYWRkTmV3VGFza0J0bkxJc3RlbmVyIH07XG59KSgpO1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLSAnRWRpdCB0YXNrJyBtb2RhbCBtb2R1bGVcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5jb25zdCBlZGl0VGFza01vZGFsID0gKCgpID0+IHtcbiAgY29uc3QgbW9kYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZWRpdC10YXNrLW1vZGFsJykucGFyZW50RWxlbWVudDtcbiAgY29uc3QgZWRpdEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlZGl0LXRhc2stc3VibWl0LWJ1dHRvbicpO1xuICBjb25zdCBzdGVwc0xpc3QgPSBtb2RhbC5xdWVyeVNlbGVjdG9yKCcubW9kYWwtc3RlcHMtbGlzdCcpO1xuICBjb25zdCB0aXRsZUlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VkaXQtdGFzay1uYW1lJyk7XG4gIGNvbnN0IGRlc2NyaXB0aW9uSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZWRpdC10YXNrLWRlc2NyaXB0aW9uJyk7XG4gIGNvbnN0IGRhdGVJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlZGl0LXRhc2stZGF0ZScpO1xuICBjb25zdCBwcmlvcml0eUlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VkaXQtdGFzay1wcmlvcml0eScpO1xuXG4gIGNvbnN0IHNldFByb2plY3REYXRhSW5kZXggPSAocHJvamVjdEluZGV4KSA9PiB7XG4gICAgZWRpdEJ0bi5kYXRhc2V0LnByb2plY3RJbmRleCA9IHByb2plY3RJbmRleDtcbiAgfTtcblxuICBjb25zdCBzZXRUYXNrRGF0YUluZGV4ID0gKHRhc2tJbmRleCkgPT4ge1xuICAgIGVkaXRCdG4uZGF0YXNldC50YXNrSW5kZXggPSB0YXNrSW5kZXg7XG4gIH07XG5cbiAgY29uc3Qgb3BlbkVkaXRUYXNrTW9kYWwgPSAocHJvamVjdEluZGV4LCB0YXNrSW5kZXgpID0+IHtcbiAgICBjb25zdCB0YXNrVG9FZGl0ID0gdGFza01hbmFnZXIucmV2ZWFsVGFzayhwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCk7XG5cbiAgICBzZXRQcm9qZWN0RGF0YUluZGV4KHByb2plY3RJbmRleCk7XG4gICAgc2V0VGFza0RhdGFJbmRleCh0YXNrSW5kZXgpO1xuICAgIHRpdGxlSW5wdXQudmFsdWUgPSB0YXNrVG9FZGl0LnRpdGxlO1xuICAgIGRlc2NyaXB0aW9uSW5wdXQudmFsdWUgPSB0YXNrVG9FZGl0LmRlc2NyaXB0aW9uO1xuICAgIHRhc2tUb0VkaXQuc3RlcHMuZm9yRWFjaCgoc3RlcCkgPT5cbiAgICAgIHN0ZXBzQ29tcG9uZW50Lm1ha2VTdGVwKHN0ZXAsIHN0ZXBzTGlzdCksXG4gICAgKTtcbiAgICBpZiAodGFza1RvRWRpdC5kdWVEYXRlICE9PSAnJykge1xuICAgICAgZGF0ZUlucHV0LnZhbHVlID0gdGFza1RvRWRpdC5kdWVEYXRlO1xuICAgIH1cbiAgICBwcmlvcml0eUlucHV0LnZhbHVlID0gdGFza1RvRWRpdC5wcmlvcml0eTtcbiAgICB0b2dnbGVIaWRkZW4obW9kYWwpO1xuICB9O1xuXG4gIGNvbnN0IGVkaXRUYXNrID0gKGUpID0+IHtcbiAgICBpZiAodGl0bGVJbnB1dC52YWx1ZSAhPT0gJycpIHtcbiAgICAgIGNvbnN0IHByb2plY3RJbmRleCA9IE51bWJlcihlZGl0QnRuLmRhdGFzZXQucHJvamVjdEluZGV4KTtcbiAgICAgIGNvbnN0IHRhc2tJbmRleCA9IE51bWJlcihlZGl0QnRuLmRhdGFzZXQudGFza0luZGV4KTtcbiAgICAgIGNvbnN0IHRhc2tUb0VkaXQgPSB0YXNrTWFuYWdlci5yZXZlYWxUYXNrKHByb2plY3RJbmRleCwgdGFza0luZGV4KTtcbiAgICAgIGNvbnN0IG9sZFN0ZXBzID0gdGFza1RvRWRpdC5zdGVwcztcbiAgICAgIGNvbnN0IGVkaXRlZFN0ZXBzID0gc3RlcHNDb21wb25lbnQucmV2ZWFsU3RlcHMoKTtcblxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgdGFza01hbmFnZXIuZWRpdFRhc2tUaXRsZShwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCwgdGl0bGVJbnB1dC52YWx1ZSk7XG4gICAgICB0YXNrTWFuYWdlci5lZGl0VGFza0Rlc2NyaXB0aW9uKFxuICAgICAgICBwcm9qZWN0SW5kZXgsXG4gICAgICAgIHRhc2tJbmRleCxcbiAgICAgICAgZGVzY3JpcHRpb25JbnB1dC52YWx1ZSxcbiAgICAgICk7XG4gICAgICB0YXNrTWFuYWdlci5lZGl0VGFza0R1ZURhdGUocHJvamVjdEluZGV4LCB0YXNrSW5kZXgsIGRhdGVJbnB1dC52YWx1ZSk7XG4gICAgICB0YXNrTWFuYWdlci5lZGl0VGFza1ByaW9yaXR5KFxuICAgICAgICBwcm9qZWN0SW5kZXgsXG4gICAgICAgIHRhc2tJbmRleCxcbiAgICAgICAgcHJpb3JpdHlJbnB1dC52YWx1ZSxcbiAgICAgICk7XG4gICAgICBpZiAob2xkU3RlcHMubGVuZ3RoID4gMCAmJiBlZGl0ZWRTdGVwcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGZvciAoXG4gICAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICAgIGkgPCBNYXRoLm1pbihvbGRTdGVwcy5sZW5ndGgsIGVkaXRlZFN0ZXBzLmxlbmd0aCk7XG4gICAgICAgICAgaSsrXG4gICAgICAgICkge1xuICAgICAgICAgIGlmIChlZGl0ZWRTdGVwc1tpXS5kZXNjcmlwdGlvbiAhPT0gb2xkU3RlcHNbaV0uZGVzY3JpcHRpb24pIHtcbiAgICAgICAgICAgIHN0ZXBNYW5hZ2VyLmVkaXRTdGVwRGVzY3JpcHRpb24oXG4gICAgICAgICAgICAgIHByb2plY3RJbmRleCxcbiAgICAgICAgICAgICAgdGFza0luZGV4LFxuICAgICAgICAgICAgICBpLFxuICAgICAgICAgICAgICBlZGl0ZWRTdGVwc1tpXS5kZXNjcmlwdGlvbixcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChlZGl0ZWRTdGVwc1tpXS5zdGF0dXMgIT09IG9sZFN0ZXBzW2ldLnN0YXR1cykge1xuICAgICAgICAgICAgc3RlcE1hbmFnZXIuZWRpdFN0ZXBTdGF0dXMoXG4gICAgICAgICAgICAgIHByb2plY3RJbmRleCxcbiAgICAgICAgICAgICAgdGFza0luZGV4LFxuICAgICAgICAgICAgICBpLFxuICAgICAgICAgICAgICBlZGl0ZWRTdGVwc1tpXS5zdGF0dXMsXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAob2xkU3RlcHMubGVuZ3RoID4gZWRpdGVkU3RlcHMubGVuZ3RoKSB7XG4gICAgICAgICAgbGV0IGkgPSBvbGRTdGVwcy5sZW5ndGggLSAxO1xuICAgICAgICAgIHdoaWxlIChpID49IGVkaXRlZFN0ZXBzLmxlbmd0aCkge1xuICAgICAgICAgICAgc3RlcE1hbmFnZXIuZGVsZXRlU3RlcChwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCwgaSk7XG4gICAgICAgICAgICBpLS07XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKG9sZFN0ZXBzLmxlbmd0aCA8IGVkaXRlZFN0ZXBzLmxlbmd0aCkge1xuICAgICAgICAgIGZvciAobGV0IGkgPSBvbGRTdGVwcy5sZW5ndGg7IGkgPCBlZGl0ZWRTdGVwcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgc3RlcE1hbmFnZXIuY3JlYXRlTmV3U3RlcChcbiAgICAgICAgICAgICAgcHJvamVjdEluZGV4LFxuICAgICAgICAgICAgICB0YXNrSW5kZXgsXG4gICAgICAgICAgICAgIGVkaXRlZFN0ZXBzW2ldLmRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgICBlZGl0ZWRTdGVwc1tpXS5zdGF0dXMsXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChvbGRTdGVwcy5sZW5ndGggPT09IDAgJiYgZWRpdGVkU3RlcHMubGVuZ3RoID4gMCkge1xuICAgICAgICBlZGl0ZWRTdGVwcy5mb3JFYWNoKChzdGVwKSA9PiB7XG4gICAgICAgICAgc3RlcE1hbmFnZXIuY3JlYXRlTmV3U3RlcChcbiAgICAgICAgICAgIHByb2plY3RJbmRleCxcbiAgICAgICAgICAgIHRhc2tJbmRleCxcbiAgICAgICAgICAgIHN0ZXAuZGVzY3JpcHRpb24sXG4gICAgICAgICAgICBzdGVwLnN0YXR1cyxcbiAgICAgICAgICApO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAob2xkU3RlcHMubGVuZ3RoID4gMCAmJiBlZGl0ZWRTdGVwcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgbGV0IGkgPSBvbGRTdGVwcy5sZW5ndGggLSAxO1xuICAgICAgICB3aGlsZSAoaSA+PSAwKSB7XG4gICAgICAgICAgc3RlcE1hbmFnZXIuZGVsZXRlU3RlcChwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCwgaSk7XG4gICAgICAgICAgaS0tO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBtYWluLnJlbmRlclRhc2tDb250ZW50KHByb2plY3RJbmRleCwgdGFza0luZGV4KTtcbiAgICAgIGFsbE1vZGFscy5jbG9zZU1vZGFsKG1vZGFsKTtcbiAgICB9XG4gIH07XG5cbiAgLyogRnVuY3Rpb24gdG8gaW52b2tlIG9uIGluaXRpbGlzZSwgZm9yIHRoZSBjb21wb25lbnQgdG8gd29yayBwcm9wZXJseSAqL1xuICBjb25zdCBhZGRFZGl0QnRuTGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgZWRpdEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiBlZGl0VGFzayhlKSk7XG4gIH07XG5cbiAgcmV0dXJuIHsgb3BlbkVkaXRUYXNrTW9kYWwsIGFkZEVkaXRCdG5MaXN0ZW5lciB9O1xufSkoKTtcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi0gJ0RlbGV0ZSB0YXNrJyBtb2RhbCBtb2R1bGVcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5jb25zdCBkZWxldGVUYXNrTW9kYWwgPSAoKCkgPT4ge1xuICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kZWxldGUtdGFzay1tb2RhbCcpLnBhcmVudEVsZW1lbnQ7XG4gIGNvbnN0IGNhbmNlbEJ0biA9IG1vZGFsLnF1ZXJ5U2VsZWN0b3IoJy5jYW5jZWwtYnV0dG9uJyk7XG4gIGNvbnN0IGRlbGV0ZUJ0biA9IG1vZGFsLnF1ZXJ5U2VsZWN0b3IoJy5kZWxldGUtYnV0dG9uJyk7XG5cbiAgY29uc3Qgc2V0UHJvamVjdERhdGFJbmRleCA9IChwcm9qZWN0SW5kZXgpID0+IHtcbiAgICBkZWxldGVCdG4uZGF0YXNldC5wcm9qZWN0SW5kZXggPSBwcm9qZWN0SW5kZXg7XG4gIH07XG5cbiAgY29uc3Qgc2V0VGFza0RhdGFJbmRleCA9ICh0YXNrSW5kZXgpID0+IHtcbiAgICBkZWxldGVCdG4uZGF0YXNldC50YXNrSW5kZXggPSB0YXNrSW5kZXg7XG4gIH07XG5cbiAgY29uc3Qgb3BlbkRlbGV0ZU1vZGFsID0gKHByb2plY3RJbmRleCwgdGFza0luZGV4KSA9PiB7XG4gICAgc2V0UHJvamVjdERhdGFJbmRleChwcm9qZWN0SW5kZXgpO1xuICAgIHNldFRhc2tEYXRhSW5kZXgodGFza0luZGV4KTtcbiAgICB0b2dnbGVIaWRkZW4obW9kYWwpO1xuICB9O1xuXG4gIGNvbnN0IGRlbGV0ZVRhc2sgPSAoKSA9PiB7XG4gICAgY29uc3QgcHJvamVjdEluZGV4ID0gTnVtYmVyKGRlbGV0ZUJ0bi5kYXRhc2V0LnByb2plY3RJbmRleCk7XG4gICAgY29uc3QgdGFza0luZGV4ID0gTnVtYmVyKGRlbGV0ZUJ0bi5kYXRhc2V0LnRhc2tJbmRleCk7XG4gICAgdGFza01hbmFnZXIuZGVsZXRlVGFzayhwcm9qZWN0SW5kZXgsIHRhc2tJbmRleCk7XG4gICAgbWFpbi5yZW5kZXJEZWxldGVkVGFzayh0YXNrSW5kZXgpO1xuICAgIHRvZ2dsZUhpZGRlbihtb2RhbCk7XG4gIH07XG5cbiAgLyogRnVuY3Rpb25zIHRvIGludm9rZSBvbiBpbml0aWxpc2UsIGZvciB0aGUgY29tcG9uZW50IHRvIHdvcmsgcHJvcGVybHkgKi9cbiAgY29uc3QgYWRkQ2FuY2VsQnRuTGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgY2FuY2VsQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gdG9nZ2xlSGlkZGVuKG1vZGFsKSk7XG4gIH07XG5cbiAgY29uc3QgYWRkRGVsZXRlQnRuTGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgZGVsZXRlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZGVsZXRlVGFzayk7XG4gIH07XG4gIHJldHVybiB7IG9wZW5EZWxldGVNb2RhbCwgYWRkQ2FuY2VsQnRuTGlzdGVuZXIsIGFkZERlbGV0ZUJ0bkxpc3RlbmVyIH07XG59KSgpO1xuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLSBTdGVwcyBjb21wb25lbnQgbW9kdWxlXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuY29uc3Qgc3RlcHNDb21wb25lbnQgPSAoKCkgPT4ge1xuICAvKiBWYXJpYWJsZXMgZm9yIHRoZSAnTmV3IHRhc2snIG1vZGFsICovXG4gIGNvbnN0IG1vZGFsTmV3ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5ldy10YXNrLW1vZGFsJykucGFyZW50RWxlbWVudDtcbiAgY29uc3Qgc3RlcHNMaXN0TmV3ID0gbW9kYWxOZXcucXVlcnlTZWxlY3RvcignLm1vZGFsLXN0ZXBzLWxpc3QnKTtcbiAgY29uc3QgYWRkU3RlcEJ0bk5ldyA9IG1vZGFsTmV3LnF1ZXJ5U2VsZWN0b3IoJy5hZGQtc3RlcC1idXR0b24nKTtcbiAgLyogVmFyaWFibGVzIGZvciB0aGUgJ0VkaXQgdGFzaycgbW9kYWwgKi9cbiAgY29uc3QgbW9kYWxFZGl0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmVkaXQtdGFzay1tb2RhbCcpLnBhcmVudEVsZW1lbnQ7XG4gIGNvbnN0IHN0ZXBzTGlzdEVkaXQgPSBtb2RhbEVkaXQucXVlcnlTZWxlY3RvcignLm1vZGFsLXN0ZXBzLWxpc3QnKTtcbiAgY29uc3QgYWRkU3RlcEJ0bkVkaXQgPSBtb2RhbEVkaXQucXVlcnlTZWxlY3RvcignLmFkZC1zdGVwLWJ1dHRvbicpO1xuXG4gIGNvbnN0IHN0ZXBzID0gW107XG5cbiAgY29uc3QgY2xlYXJBbGxTdGVwcyA9ICh1bCkgPT4ge1xuICAgIGNvbnN0IHVsVG9DbGVhciA9IHVsO1xuICAgIHN0ZXBzLmxlbmd0aCA9IDA7XG4gICAgdWxUb0NsZWFyLmlubmVySFRNTCA9ICcnO1xuICB9O1xuXG4gIGNvbnN0IHJldmVhbFN0ZXBzID0gKCkgPT4gc3RlcHM7XG5cbiAgY29uc3QgcmVuZGVyU3RlcCA9IChsaXN0SXRlbSwgc3RlcCwgaW5kZXgsIHN0ZXBzTGlzdCkgPT4ge1xuICAgIGNvbnN0IGNoZWNrYm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICBjb25zdCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gICAgY29uc3QgZWRpdFN0ZXBCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBjb25zdCBlZGl0U3RlcEltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgIGNvbnN0IGRlbGV0ZVN0ZXBCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBjb25zdCBkZWxldGVTdGVwSW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG5cbiAgICBjaGVja2JveC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnY2hlY2tib3gnKTtcbiAgICBjaGVja2JveC5zZXRBdHRyaWJ1dGUoJ25hbWUnLCBgc3RlcC1zdGF0dXMtJHtpbmRleH1gKTtcbiAgICBjaGVja2JveC5zZXRBdHRyaWJ1dGUoJ2lkJywgYHN0ZXAtc3RhdHVzLSR7aW5kZXh9YCk7XG4gICAgY2hlY2tib3guZGF0YXNldC5zdGVwSW5kZXggPSBpbmRleDtcbiAgICBpZiAoc3RlcC5zdGF0dXMgPT09ICdkb25lJykge1xuICAgICAgY2hlY2tib3guY2hlY2tlZCA9IHRydWU7XG4gICAgfVxuICAgIGxhYmVsLnNldEF0dHJpYnV0ZSgnZm9yJywgYHN0ZXAtc3RhdHVzLSR7aW5kZXh9YCk7XG4gICAgbGFiZWwudGV4dENvbnRlbnQgPSBzdGVwLmRlc2NyaXB0aW9uO1xuICAgIGVkaXRTdGVwQnRuLmNsYXNzTGlzdC5hZGQoJ3N0ZXBzLWxpc3QtaXRlbS1idXR0b24nKTtcbiAgICBlZGl0U3RlcEJ0bi5kYXRhc2V0LnN0ZXBJbmRleCA9IGluZGV4O1xuICAgIGVkaXRTdGVwSW1nLnNldEF0dHJpYnV0ZSgnc3JjJywgJy4vaWNvbnMvZWRpdC5zdmcnKTtcbiAgICBlZGl0U3RlcEltZy5zZXRBdHRyaWJ1dGUoJ2FsdCcsICdlZGl0IHN0ZXAgYnV0dG9uJyk7XG4gICAgZGVsZXRlU3RlcEJ0bi5jbGFzc0xpc3QuYWRkKCdzdGVwcy1saXN0LWl0ZW0tYnV0dG9uJyk7XG4gICAgZGVsZXRlU3RlcEJ0bi5kYXRhc2V0LnN0ZXBJbmRleCA9IGluZGV4O1xuICAgIGRlbGV0ZVN0ZXBJbWcuc2V0QXR0cmlidXRlKCdzcmMnLCAnLi9pY29ucy9kZWxldGUuc3ZnJyk7XG4gICAgZGVsZXRlU3RlcEltZy5zZXRBdHRyaWJ1dGUoJ2FsdCcsICdkZWxldGUgc3RlcCBidXR0b24nKTtcblxuICAgIGNoZWNrYm94LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsICgpID0+XG4gICAgICB1cGRhdGVTdGVwU3RhdHVzKGNoZWNrYm94LmNoZWNrZWQsIE51bWJlcihjaGVja2JveC5kYXRhc2V0LnN0ZXBJbmRleCkpLFxuICAgICk7XG4gICAgZWRpdFN0ZXBCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXYpID0+XG4gICAgICByZW5kZXJFZGl0U3RlcChldiwgZWRpdFN0ZXBCdG4uZGF0YXNldC5zdGVwSW5kZXgsIHN0ZXBzTGlzdCksXG4gICAgKTtcbiAgICBkZWxldGVTdGVwQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2KSA9PlxuICAgICAgZGVsZXRlU3RlcChldiwgZGVsZXRlU3RlcEJ0bi5kYXRhc2V0LnN0ZXBJbmRleCwgc3RlcHNMaXN0KSxcbiAgICApO1xuXG4gICAgbGlzdEl0ZW0uYXBwZW5kQ2hpbGQoY2hlY2tib3gpO1xuICAgIGxpc3RJdGVtLmFwcGVuZENoaWxkKGxhYmVsKTtcbiAgICBsaXN0SXRlbS5hcHBlbmRDaGlsZChlZGl0U3RlcEJ0bik7XG4gICAgZWRpdFN0ZXBCdG4uYXBwZW5kQ2hpbGQoZWRpdFN0ZXBJbWcpO1xuICAgIGxpc3RJdGVtLmFwcGVuZENoaWxkKGRlbGV0ZVN0ZXBCdG4pO1xuICAgIGRlbGV0ZVN0ZXBCdG4uYXBwZW5kQ2hpbGQoZGVsZXRlU3RlcEltZyk7XG4gIH07XG5cbiAgY29uc3QgdXBkYXRlU3RlcElkaWNlcyA9IChzdGVwc0xpc3QpID0+IHtcbiAgICBjb25zdCBhbGxTdGVwcyA9IHN0ZXBzTGlzdC5jaGlsZHJlbjtcbiAgICBsZXQgaW5kZXggPSAwO1xuICAgIGZvciAoY29uc3QgbGlzdEl0ZW0gb2YgYWxsU3RlcHMpIHtcbiAgICAgIGNvbnN0IGNoZWNrYm94ID0gbGlzdEl0ZW0ucXVlcnlTZWxlY3RvcignaW5wdXQnKTtcbiAgICAgIGNvbnN0IGxhYmVsID0gbGlzdEl0ZW0ucXVlcnlTZWxlY3RvcignbGFiZWwnKTtcbiAgICAgIGNvbnN0IGJ1dHRvbnMgPSBsaXN0SXRlbS5xdWVyeVNlbGVjdG9yQWxsKCcuc3RlcHMtbGlzdC1pdGVtLWJ1dHRvbicpO1xuXG4gICAgICBjaGVja2JveC5zZXRBdHRyaWJ1dGUoJ25hbWUnLCBgc3RlcC1zdGF0dXMtJHtpbmRleH1gKTtcbiAgICAgIGNoZWNrYm94LnNldEF0dHJpYnV0ZSgnaWQnLCBgc3RlcC1zdGF0dXMtJHtpbmRleH1gKTtcbiAgICAgIGNoZWNrYm94LmRhdGFzZXQuc3RlcEluZGV4ID0gaW5kZXg7XG4gICAgICBsYWJlbC5zZXRBdHRyaWJ1dGUoJ2ZvcicsIGBzdGVwLXN0YXR1cy0ke2luZGV4fWApO1xuICAgICAgYnV0dG9ucy5mb3JFYWNoKChidXR0b24pID0+IHtcbiAgICAgICAgYnV0dG9uLmRhdGFzZXQuc3RlcEluZGV4ID0gaW5kZXg7XG4gICAgICB9KTtcbiAgICAgIGluZGV4ICs9IDE7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IHVwZGF0ZVN0ZXBTdGF0dXMgPSAobmV3U3RhdHVzLCBpbmRleCkgPT4ge1xuICAgIGlmIChuZXdTdGF0dXMgPT09IHRydWUpIHtcbiAgICAgIHN0ZXBzW2luZGV4XS5zdGF0dXMgPSAnZG9uZSc7XG4gICAgfSBlbHNlIGlmIChuZXdTdGF0dXMgPT09IGZhbHNlKSB7XG4gICAgICBzdGVwc1tpbmRleF0uc3RhdHVzID0gJ3RvIGRvJztcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgZWRpdFN0ZXAgPSAoZSwgc3RlcEluZGV4LCBlZGl0ZWRTdGVwVmFsdWUsIHN0ZXBzTGlzdCkgPT4ge1xuICAgIGNvbnN0IHN0ZXBUb0VkaXQgPSBlLnRhcmdldC5jbG9zZXN0KCdsaScpO1xuICAgIGNvbnN0IGlucHV0ID0gc3RlcFRvRWRpdC5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpO1xuICAgIGNvbnN0IHN1Ym1pdFN0ZXBCdG4gPSBpbnB1dC5uZXh0RWxlbWVudFNpYmxpbmc7XG5cbiAgICBpZiAoZWRpdGVkU3RlcFZhbHVlICE9PSAnJykge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIHN0ZXBzW3N0ZXBJbmRleF0uZGVzY3JpcHRpb24gPSBlZGl0ZWRTdGVwVmFsdWU7XG4gICAgICBpbnB1dC5yZW1vdmUoKTtcbiAgICAgIHN1Ym1pdFN0ZXBCdG4ucmVtb3ZlKCk7XG4gICAgICByZW5kZXJTdGVwKHN0ZXBUb0VkaXQsIHN0ZXBzW3N0ZXBJbmRleF0sIHN0ZXBJbmRleCwgc3RlcHNMaXN0KTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgcmVuZGVyRWRpdFN0ZXAgPSAoZXYsIGluZGV4LCBzdGVwc0xpc3QpID0+IHtcbiAgICBjb25zdCBzdGVwSW5kZXggPSBOdW1iZXIoaW5kZXgpO1xuICAgIGNvbnN0IHN0ZXBUb0VkaXQgPSBldi50YXJnZXQuY2xvc2VzdCgnbGknKTtcbiAgICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgY29uc3Qgc3VibWl0U3RlcEJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGNvbnN0IHN1Ym1pdEltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuXG4gICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBzdGVwVG9FZGl0LmlubmVySFRNTCA9ICcnO1xuXG4gICAgaW5wdXQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQnKTtcbiAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoJ25hbWUnLCAnbW9kYWwtZWRpdC1zdGVwJyk7XG4gICAgaW5wdXQuc2V0QXR0cmlidXRlKCdpZCcsICdtb2RhbC1lZGl0LXN0ZXAnKTtcbiAgICBpbnB1dC5yZXF1aXJlZCA9IHRydWU7XG4gICAgaW5wdXQudmFsdWUgPSBzdGVwc1tzdGVwSW5kZXhdLmRlc2NyaXB0aW9uO1xuICAgIHN1Ym1pdFN0ZXBCdG4udGV4dENvbnRlbnQgPSAnQWx0ZXIgc3RlcCc7XG4gICAgc3VibWl0SW1nLnNldEF0dHJpYnV0ZSgnc3JjJywgJy4vaWNvbnMvY29uZmlybS5zdmcnKTtcbiAgICBzdWJtaXRJbWcuc2V0QXR0cmlidXRlKCdhbHQnLCAnY29uZmlybSBlZGl0IGJ1dHRvbicpO1xuXG4gICAgc3RlcFRvRWRpdC5hcHBlbmRDaGlsZChpbnB1dCk7XG4gICAgc3RlcFRvRWRpdC5hcHBlbmRDaGlsZChzdWJtaXRTdGVwQnRuKTtcbiAgICBzdWJtaXRTdGVwQnRuLmFwcGVuZENoaWxkKHN1Ym1pdEltZyk7XG5cbiAgICBzdWJtaXRTdGVwQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+XG4gICAgICBlZGl0U3RlcChlLCBzdGVwSW5kZXgsIGlucHV0LnZhbHVlLCBzdGVwc0xpc3QpLFxuICAgICk7XG4gIH07XG5cbiAgY29uc3QgZGVsZXRlU3RlcCA9IChldiwgaW5kZXgsIHN0ZXBzTGlzdCkgPT4ge1xuICAgIGNvbnN0IHN0ZXBJbmRleCA9IE51bWJlcihpbmRleCk7XG4gICAgY29uc3Qgc3RlcFRvRGVsZXRlID0gZXYudGFyZ2V0LmNsb3Nlc3QoJ2xpJyk7XG5cbiAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIHN0ZXBzLnNwbGljZShzdGVwSW5kZXgsIDEpO1xuICAgIHN0ZXBUb0RlbGV0ZS5yZW1vdmUoKTtcbiAgICB1cGRhdGVTdGVwSWRpY2VzKHN0ZXBzTGlzdCk7XG4gIH07XG5cbiAgY29uc3QgbWFrZVN0ZXAgPSAoc3RlcCwgc3RlcHNMaXN0KSA9PiB7XG4gICAgY29uc3QgbGlzdEl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuXG4gICAgc3RlcHMucHVzaChzdGVwKTtcbiAgICBzdGVwc0xpc3QuYXBwZW5kQ2hpbGQobGlzdEl0ZW0pO1xuICAgIHJlbmRlclN0ZXAobGlzdEl0ZW0sIHN0ZXBzW3N0ZXBzLmxlbmd0aCAtIDFdLCBzdGVwcy5sZW5ndGggLSAxLCBzdGVwc0xpc3QpO1xuICB9O1xuXG4gIGNvbnN0IGFkZE5ld1N0ZXAgPSAoZXZ0LCBzdGVwc0xpc3QsIG5ld1N0ZXBCdG4pID0+IHtcbiAgICBjb25zdCBuZXdTdGVwRGVzY3JpcHRpb24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kYWwtYWRkLXN0ZXAnKTtcbiAgICBjb25zdCBzdGVwQ3JlYXRvciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RhbC1hZGQtc3RlcCcpLnBhcmVudEVsZW1lbnQ7XG5cbiAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgaWYgKG5ld1N0ZXBEZXNjcmlwdGlvbi52YWx1ZSAhPT0gJycpIHtcbiAgICAgIGNvbnN0IHN0ZXAgPSB7XG4gICAgICAgIGRlc2NyaXB0aW9uOiBuZXdTdGVwRGVzY3JpcHRpb24udmFsdWUsXG4gICAgICAgIHN0YXR1czogJ3RvIGRvJyxcbiAgICAgIH07XG4gICAgICBtYWtlU3RlcChzdGVwLCBzdGVwc0xpc3QpO1xuICAgIH1cbiAgICB0b2dnbGVIaWRkZW4obmV3U3RlcEJ0bik7XG4gICAgc3RlcENyZWF0b3IucmVtb3ZlKCk7XG4gIH07XG5cbiAgY29uc3QgcmVuZGVyQ3JlYXRlU3RlcCA9IChlLCBzdGVwc0xpc3QsIG5ld1N0ZXBCdG4pID0+IHtcbiAgICBjb25zdCBsaXN0SXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgY29uc3QgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIGNvbnN0IHN1Ym1pdFN0ZXBCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBjb25zdCBzdWJtaXRJbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcblxuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAndGV4dCcpO1xuICAgIGlucHV0LnNldEF0dHJpYnV0ZSgnbmFtZScsICdtb2RhbC1hZGQtc3RlcCcpO1xuICAgIGlucHV0LnNldEF0dHJpYnV0ZSgnaWQnLCAnbW9kYWwtYWRkLXN0ZXAnKTtcbiAgICBzdWJtaXRTdGVwQnRuLnRleHRDb250ZW50ID0gJ0FkZCBzdGVwJztcbiAgICBzdWJtaXRJbWcuc2V0QXR0cmlidXRlKCdzcmMnLCAnLi9pY29ucy9jb25maXJtLnN2ZycpO1xuICAgIHN1Ym1pdEltZy5zZXRBdHRyaWJ1dGUoJ2FsdCcsICdjb25maXJtIHN0ZXAgYnV0dG9uJyk7XG5cbiAgICBzdWJtaXRTdGVwQnRuLmFwcGVuZENoaWxkKHN1Ym1pdEltZyk7XG4gICAgbGlzdEl0ZW0uYXBwZW5kQ2hpbGQoaW5wdXQpO1xuICAgIGxpc3RJdGVtLmFwcGVuZENoaWxkKHN1Ym1pdFN0ZXBCdG4pO1xuICAgIHN0ZXBzTGlzdC5hcHBlbmRDaGlsZChsaXN0SXRlbSk7XG5cbiAgICBzdWJtaXRTdGVwQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2dCkgPT5cbiAgICAgIGFkZE5ld1N0ZXAoZXZ0LCBzdGVwc0xpc3QsIG5ld1N0ZXBCdG4pLFxuICAgICk7XG4gICAgdG9nZ2xlSGlkZGVuKG5ld1N0ZXBCdG4pO1xuICB9O1xuXG4gIC8qIEZ1bmN0aW9uIHRvIGludm9rZSBvbiBpbml0aWxpc2UsIGZvciB0aGUgY29tcG9uZW50IHRvIHdvcmsgcHJvcGVybHkgKi9cbiAgY29uc3QgYWRkTmV3U3RlcEJ0bkxpc3RlbmVycyA9ICgpID0+IHtcbiAgICBhZGRTdGVwQnRuTmV3LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+XG4gICAgICByZW5kZXJDcmVhdGVTdGVwKGUsIHN0ZXBzTGlzdE5ldywgYWRkU3RlcEJ0bk5ldyksXG4gICAgKTtcbiAgICBhZGRTdGVwQnRuRWRpdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PlxuICAgICAgcmVuZGVyQ3JlYXRlU3RlcChlLCBzdGVwc0xpc3RFZGl0LCBhZGRTdGVwQnRuRWRpdCksXG4gICAgKTtcbiAgfTtcblxuICByZXR1cm4geyBjbGVhckFsbFN0ZXBzLCByZXZlYWxTdGVwcywgbWFrZVN0ZXAsIGFkZE5ld1N0ZXBCdG5MaXN0ZW5lcnMgfTtcbn0pKCk7XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4tIEluaXRpYWxpc2VyIGZ1bmN0aW9uXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuY29uc3QgaW5pdGlhbGlzZVVJID0gKCkgPT4ge1xuICBoZWFkZXIuYWRkSGVhZGVyTGlzdGVuZXJzKCk7XG5cbiAgbmF2YmFyLmluaXQoKTtcblxuICBtYWluLmluaXQoKTtcblxuICBhbGxNb2RhbHMuYWRkQ2xvc2VCdG5MaXN0ZW5lcnMoKTtcbiAgYWxsTW9kYWxzLmFkZENsb3NlQmFja2dyb3VuZExpc3RlbmVycygpO1xuXG4gIG5ld0xpc3RNb2RhbC5hZGRTdWJtaXRCdG5MaXN0ZW5lcigpO1xuICBlZGl0TGlzdE1vZGFsLmFkZEVkaXRCdG5MaXN0ZW5lcigpO1xuICBkZWxldGVMaXN0TW9kYWwuYWRkQ2FuY2VsQnRuTGlzdGVuZXIoKTtcbiAgZGVsZXRlTGlzdE1vZGFsLmFkZERlbGV0ZUJ0bkxpc3RlbmVyKCk7XG4gIG5ld1Rhc2tNb2RhbC5hZGROZXdUYXNrQnRuTElzdGVuZXIoKTtcbiAgZWRpdFRhc2tNb2RhbC5hZGRFZGl0QnRuTGlzdGVuZXIoKTtcbiAgZGVsZXRlVGFza01vZGFsLmFkZENhbmNlbEJ0bkxpc3RlbmVyKCk7XG4gIGRlbGV0ZVRhc2tNb2RhbC5hZGREZWxldGVCdG5MaXN0ZW5lcigpO1xuXG4gIHN0ZXBzQ29tcG9uZW50LmFkZE5ld1N0ZXBCdG5MaXN0ZW5lcnMoKTtcblxuICBhc2lkZS5hZGRTZWFyY2hiYXJMSXN0ZW5lcigpO1xuICBhc2lkZS5hZGRPcmRlck9wdGlvbnNMaXN0ZW5lcigpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgaW5pdGlhbGlzZVVJO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBwcm9qZWN0TWFuYWdlciB9IGZyb20gJy4vdG9Eb0xpc3QnO1xuaW1wb3J0IGluaXRpYWxpc2VVSSBmcm9tICcuL3VpJztcblxucHJvamVjdE1hbmFnZXIuaW5pdGlhbGlzZSgpO1xuaW5pdGlhbGlzZVVJKCk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=