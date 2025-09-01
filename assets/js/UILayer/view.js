// View-lag for ToDOAPP
// Håndterer DOM-events og UI

import { appController } from '../ControllerLayer/controller.js';

document.addEventListener('DOMContentLoaded', appController); // Kald controlleren når siden er klar

export function renderLists(lists) {
  const container = document.getElementById('listsContainer');
  container.innerHTML = '';
  lists.forEach((list) => {
    const listElem = document.createElement('div');
    listElem.textContent = list.name;
    container.appendChild(listElem);
  });
}
