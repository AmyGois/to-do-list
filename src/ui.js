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
  /* Function to invoke in initiliser function, for the component to work properly */
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
  const renderNewList = (list) => {
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

    editBtn.appendChild(editImg);
    deleteBtn.appendChild(deleteImg);
    div.appendChild(editBtn);
    div.appendChild(deleteBtn);
    listItem.appendChild(link);
    listItem.appendChild(div);
    navList.appendChild(listItem);
  };

  /* Functions to invoke in initiliser function, for the component to work properly */
  const renderCurrentLists = () => {
    const lists = projectManager.revealAllProjects();
    lists.forEach((list) => {
      if (lists.indexOf(list) > 0) {
        renderNewList(list);
      }
    });
  };

  const addNewListBtnListener = () => {
    const newListBtn = document.querySelector('.nav-new-list-button');
    const modalNewList =
      document.querySelector('.new-list-modal').parentElement;
    newListBtn.addEventListener('click', () => toggleHidden(modalNewList));
  };

  return { renderNewList, renderCurrentLists, addNewListBtnListener };
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

  /* Functions to invoke in initiliser function, for the component to work properly */
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
  const submitBtn = document.getElementById('new-list-submit-button');

  const creatNewList = (e) => {
    const titleInput = document.getElementById('new-list-name').value;
    const descriptionInput = document.getElementById(
      'new-list-description',
    ).value;
    const modal = document.querySelector('.new-list-modal').parentElement;
    if (titleInput.value !== '') {
      e.preventDefault();

      const newList = projectManager.createNewProject(
        titleInput,
        descriptionInput,
      );
      navbar.renderNewList(newList);

      allModals.closeModal(modal);
    }
  };

  /* Function to invoke in initiliser function, for the component to work properly */
  const addSubmitBtnListener = () => {
    submitBtn.addEventListener('click', (e) => creatNewList(e));
  };

  return { addSubmitBtnListener };
})();

/* **************************************************************
- Initialiser function
************************************************************** */
const initialiseUI = () => {
  header.addHeaderListeners();

  navbar.renderCurrentLists();
  navbar.addNewListBtnListener();

  allModals.addCloseBtnListeners();
  allModals.addCloseBackgroundListeners();

  newListModal.addSubmitBtnListener();
};

export default initialiseUI;