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
import { projectManager, taskManager, stepManager } from './toDoList';

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

  /* Functions to invoke on initilise, for the component to work properly */
  const renderCurrentLists = () => {
    const lists = projectManager.revealAllProjects();
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
    renderCurrentLists,
    setInboxProjectIndex,
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

      const newList = projectManager.createNewProject(
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
    projectManager.deleteProject(index);
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
- Initialiser function
************************************************************** */
const initialiseUI = () => {
  header.addHeaderListeners();

  navbar.renderCurrentLists();
  navbar.setInboxProjectIndex();
  navbar.addNewListBtnListener();

  allModals.addCloseBtnListeners();
  allModals.addCloseBackgroundListeners();

  newListModal.addSubmitBtnListener();
  deleteListModal.addCancelBtnListener();
  deleteListModal.addDeleteBtnListener();
};

export default initialiseUI;
