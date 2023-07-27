import mediator from './mediator';

const storageManager = (() => {
  /* Initial function to get anything saved in localStorage - must be called  second in index.js, 
  immediately after the subscribe functions */
  const getStorage = () => {
    let toDoList = [];
    if (localStorage.toDoList) {
      toDoList = JSON.parse(localStorage.getItem('toDoList'));
    }

    mediator.publish('stored projects', toDoList);
  };

  const setStorage = (projects) => {
    const toDoList = JSON.stringify(projects);
    localStorage.setItem('toDoList', toDoList);
  };

  const subscribe = () => {
    mediator.subscribe('updated all projects', setStorage);
  };

  return { getStorage, setStorage, subscribe };
})();

export default storageManager;
