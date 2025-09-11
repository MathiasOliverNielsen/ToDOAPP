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
export function handleListAction(action, arg1, arg2, arg3, arg4) {
  switch (action) {
    case 'add':
      model.addNewList(arg1); // arg1 = listName
      renderLists(model.userData.lists);
      break;
    case 'update':
      model.updateListName(arg1, arg2); // arg1 = listIndex, arg2 = newName
      renderLists(model.userData.lists);
      break;
    case 'delete':
      model.deleteListByName(arg1); // arg1 = listName
      renderLists(model.userData.lists);
      break;
    case 'addFirst':
      model.addFirstList();
      renderLists(model.userData.lists);
      break;
    case 'theme':
      setTheme(arg1); // arg1 should be 'light' or 'dark'
      break;
    // --- List item CRUD ---
    case 'addItem':
      // arg1 = listName, arg2 = itemText
      model.addListItem(arg1, arg2);
      break;
    case 'updateItem':
      // arg1 = listName, arg2 = itemId, arg3 = newText
      model.updateListItem(arg1, arg2, arg3);
      break;
    case 'deleteItem':
      // arg1 = listName, arg2 = itemId
      model.deleteListItem(arg1, arg2);
      break;
    case 'toggleItemDone':
      // arg1 = listName, arg2 = itemId
      model.toggleListItemDone(arg1, arg2);
      break;
    default:
      console.warn('Ukendt handling:', action);
  }
  // Bemærk: renderLists kaldes kun for listehandlinger. For item-handlinger skal vi kalde en separat render-funktion for items i modal.
}
