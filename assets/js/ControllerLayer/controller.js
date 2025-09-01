import * as model from '../ModelLayer/model.js';
import { renderLists } from '../UILayer/view.js';

export function appController() {
  // If there are no lists, add a default list and update the DOM
  if (model.userData.lists.length === 0) {
    model.addFirstList();
  }
  renderLists(model.userData.lists);
}
