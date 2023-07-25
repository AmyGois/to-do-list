import { projectManager } from './toDoList';
import storageManager from './storage';

projectManager.subscribe();
storageManager.subscribe();

storageManager.getStorage();
