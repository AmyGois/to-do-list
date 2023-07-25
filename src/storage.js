import mediator from './mediator';

const storageManager = (() => {
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
    mediator.subscribe('updated projects', setStorage);
  };

  return { getStorage, setStorage, subscribe };
})();

export default storageManager;
