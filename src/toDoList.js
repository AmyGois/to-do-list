/* Contents:

  Constructors - Task, Step & Project

  Functions to deep clone arrays and objects

  Project Manager

  Task Manager

  Step Manager
*/

import mediator from './mediator';

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

    mediator.publish('updated all projects', deepCopyArray(projects));
    mediator.publish(
      'new project created',
      deepCopyObject(projects[projects.length - 1]),
    );
  };

  const deleteProject = (projectIndex) => {
    const index = Number(projectIndex);
    projects.splice(index, 1);

    mediator.publish('updated all projects', deepCopyArray(projects));
  };

  /* Might not need this */
  const deleteProjectByName = (projectTitle) => {
    projects.forEach((project) => {
      if (project.title === projectTitle) {
        projects.splice(projects.indexOf(project), 1);
      }
    });

    mediator.publish('updated all projects', deepCopyArray(projects));
  };

  const editProjectTitle = (projectIndex, newTitle) => {
    projects[Number(projectIndex)].title = newTitle;

    mediator.publish('updated all projects', deepCopyArray(projects));
    mediator.publish(
      'updated project',
      deepCopyObject(projects[Number(projectIndex)]),
    );
  };

  const editProjectDescription = (projectIndex, newDescription) => {
    projects[Number(projectIndex)].description = newDescription;

    mediator.publish('updated all projects', deepCopyArray(projects));
    mediator.publish(
      'updated project',
      deepCopyObject(projects[Number(projectIndex)]),
    );
  };

  const revealProject = (projectIndex) => {
    const projectCopy = deepCopyObject(projects[Number(projectIndex)]);

    mediator.publish('revealed project', projectCopy);
  };

  const revealAllProjects = () => {
    const projectsCopy = deepCopyArray(projects);

    mediator.publish('revealed all projects', projectsCopy);
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

    mediator.publish('updated all projects', deepCopyArray(projects));
    mediator.publish(
      'new task created',
      deepCopyObject(project.tasks[project.tasks.length - 1]),
    );
  };

  const deleteTask = (projectIndex, taskIndex) => {
    const project = projects[Number(projectIndex)];
    const index = Number(taskIndex);
    project.tasks.splice(index, 1);

    mediator.publish('updated all projects', deepCopyArray(projects));
  };

  const editTaskTitle = (projectIndex, taskIndex, newTitle) => {
    const task = projects[Number(projectIndex)].tasks[Number(taskIndex)];
    task.title = newTitle;

    mediator.publish('updated all projects', deepCopyArray(projects));
    mediator.publish('updated task', deepCopyObject(task));
  };

  const editTaskDescription = (projectIndex, taskIndex, newDescription) => {
    const task = projects[Number(projectIndex)].tasks[Number(taskIndex)];
    task.description = newDescription;

    mediator.publish('updated all projects', deepCopyArray(projects));
    mediator.publish('updated task', deepCopyObject(task));
  };

  const editTaskDueDate = (projectIndex, taskIndex, newDueDate) => {
    const task = projects[Number(projectIndex)].tasks[Number(taskIndex)];
    task.dueDate = newDueDate;

    mediator.publish('updated all projects', deepCopyArray(projects));
    mediator.publish('updated task', deepCopyObject(task));
  };

  const editTaskPriority = (projectIndex, taskIndex, newPriority) => {
    const task = projects[Number(projectIndex)].tasks[Number(taskIndex)];
    task.priority = newPriority;

    mediator.publish('updated all projects', deepCopyArray(projects));
    mediator.publish('updated task', deepCopyObject(task));
  };

  const editTaskStatus = (projectIndex, taskIndex, newStatus) => {
    const task = projects[Number(projectIndex)].tasks[Number(taskIndex)];
    task.status = newStatus;

    mediator.publish('updated all projects', deepCopyArray(projects));
    mediator.publish('updated task', deepCopyObject(task));
  };

  const revealTask = (projectIndex, taskIndex) => {
    const taskCopy = deepCopyObject(
      projects[Number(projectIndex)].tasks[Number(taskIndex)],
    );

    mediator.publish('revealed task', taskCopy);
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

    mediator.publish('updated all projects', deepCopyArray(projects));
    mediator.publish(
      'new step created',
      deepCopyObject(task.steps[task.steps.length - 1]),
    );
  };

  const deleteStep = (projectIndex, taskIndex, stepIndex) => {
    const task = projects[Number(projectIndex)].tasks[Number(taskIndex)];
    const index = Number(stepIndex);
    task.steps.splice(index, 1);

    mediator.publish('updated all projects', deepCopyArray(projects));
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

    mediator.publish('updated all projects', deepCopyArray(projects));
    mediator.publish('updated step', deepCopyObject(step));
  };

  const editStepStatus = (projectIndex, taskIndex, stepIndex, newStatus) => {
    const step =
      projects[Number(projectIndex)].tasks[Number(taskIndex)].steps[
        Number(stepIndex)
      ];
    step.status = newStatus;

    mediator.publish('updated all projects', deepCopyArray(projects));
    mediator.publish('updated step', deepCopyObject(step));
  };

  const revealStep = (projectIndex, taskIndex, stepIndex) => {
    const stepCopy = deepCopyObject(
      projects[Number(projectIndex)].tasks[Number(taskIndex)].steps[
        Number(stepIndex)
      ],
    );

    mediator.publish('revealed step', stepCopy);
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

export { projectManager, taskManager, stepManager };
