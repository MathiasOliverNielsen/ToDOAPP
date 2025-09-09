import * as model from '../ModelLayer/model.js';
import { renderLists } from '../UILayer/view.js';

export function appController() {
  // make sure to load data first
  model.loadLocalData();
  // If there are no lists, add a default list and update the DOM
  if (model.userData.lists.length === 0) {
    model.addFirstList();
  }
  renderLists(model.userData.lists);
}

// Central controllerfunktion med switch til listehandlinger
export function handleListAction(action, arg1, arg2) {
  switch (action) {
    case 'add':
      model.addNewList(arg1); // arg1 = listName
      break;
    case 'update':
      model.updateListName(arg1, arg2); // arg1 = listIndex, arg2 = newName
      break;
    case 'delete':
      model.deleteListByName(arg1); // arg1 = listName
      break;
    case 'addFirst':
      model.addFirstList();
      break;
    case 'theme':
      setTheme(arg1); // arg1 should be 'light' or 'dark'
      break;
    default:
      console.warn('Ukendt handling:', action);
  }
  renderLists(model.userData.lists);
}
