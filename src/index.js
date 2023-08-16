import { projectManager } from './toDoList';
import storageManager from './storage';
import initialiseUI from './ui';

projectManager.subscribe();
storageManager.subscribe();

storageManager.getStorage();

initialiseUI();
