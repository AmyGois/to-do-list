/* Contents:

Constructors - Task, Step & Project

Functions to deep clone arrays and objects

Project Manager
*/

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
    this.title = description;
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
  - Create a safe copy of the projects array for public use
******************************************************************** */
const projects = [];

const projectManager = (() => {
  const createNewProject = (title, description) => {
    const projectAlreadyExists = projects.find((project) => {
      return project.title === title;
    });

    if (typeof projectAlreadyExists === 'object') {
      return false; // Can't create new project because one with the same title already exists
    }
    const newProject = new Project(title, description);
    projects.push(newProject);
  };

  const deleteProject = (projectIndex) => {
    const index = Number(projectIndex);
    projects.splice(index, 1);
  };

  const deleteProjectByName = (projectTitle) => {
    projects.forEach((project) => {
      if (project.title === projectTitle) {
        projects.splice(projects.indexOf(project), 1);
      }
    });
  };

  const editProjectTitle = (projectIndex, newTitle) => {
    projects[projectIndex].title = newTitle;
  };

  const editProjectDescription = (projectIndex, newDescription) => {
    projects[projectIndex].description = newDescription;
  };

  const revealAllProjects = () => {
    const projectsCopy = deepCopyArray(projects);
    return projectsCopy;
  };

  return {
    createNewProject,
    deleteProject,
    deleteProjectByName,
    editProjectTitle,
    editProjectDescription,
    revealAllProjects,
  };
})();

export { projectManager };
