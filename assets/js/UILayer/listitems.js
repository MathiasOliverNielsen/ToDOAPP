// Theme sync: hent og sæt theme fra localStorage på page load
function setTheme(theme) {
  if (theme === 'dark') {
    document.body.classList.add('dark-mode');
    document.body.classList.remove('light-mode');
  } else {
    document.body.classList.add('light-mode');
    document.body.classList.remove('dark-mode');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const theme = model.loadTheme ? model.loadTheme() : localStorage.getItem('theme') || 'light';
  setTheme(theme);
});
import * as model from '../ModelLayer/model.js';
import { createEditableRow } from './editableRow.js';

const params = new URLSearchParams(window.location.search);
const listName = params.get('list');
const backBtn = document.getElementById('backBtn');
const listTitle = document.getElementById('listTitle');
const itemsUl = document.getElementById('itemsUl');
const addItemInput = document.getElementById('addItemInput');
const addItemBtn = document.getElementById('addItemBtn');
const totalCount = document.getElementById('totalCount');
const doneCount = document.getElementById('doneCount');
const leftCount = document.getElementById('leftCount');

backBtn.onclick = () => (window.location.href = 'index.html');

function renderItems() {
  const list = model.userData.lists.find((l) => l.name === listName);
  if (!list) {
    listTitle.textContent = 'Liste ikke fundet';
    addItemInput.placeholder = 'Tilføj opgave...';
    itemsUl.innerHTML = '';
    totalCount.textContent = '0 Total';
    doneCount.textContent = '0 Fuldført';
    leftCount.textContent = '0 Tilbage';
    return;
  }
  listTitle.textContent = list.name;
  addItemInput.placeholder = `Tilføj opgave til ${list.name}...`;
  let done = 0;
  itemsUl.innerHTML = '';
  list.items.forEach((item) => {
    if (item.done) done++;
    const checkSpan = document.createElement('span');
    checkSpan.className = 'li-checkmark';
    checkSpan.textContent = item.done ? '✔️' : '';
    const row = createEditableRow({
      text: item.text,
      beingEdited: !!item.beingEdited,
      onPrimaryClick: () => {
        /* Toggle done on label click */
        model.toggleListItemDone(listName, item.id);
        renderItems();
      },
      onStartEdit: () => {
        list.items.forEach((i) => (i.beingEdited = i.id === item.id));
        renderItems();
      },
      onSubmit: (newText) => {
        if (newText !== item.text) {
          model.updateListItem(listName, item.id, newText);
        }
        item.beingEdited = false;
        renderItems();
      },
      onDelete: () => {
        if (confirm('Slet denne opgave?')) {
          model.deleteListItem(listName, item.id);
          renderItems();
        }
      },
      leftContent: [checkSpan],
      classes: ['li-item-row'],
    });
    if (item.done) row.classList.add('done');
    itemsUl.appendChild(row);
  });
  totalCount.textContent = `${list.items.length} Total`;
  doneCount.textContent = `${done} Fuldført`;
  leftCount.textContent = `${list.items.length - done} Tilbage`;
}

// Tilføj opgave via model
addItemBtn.addEventListener('click', () => {
  const value = addItemInput.value.trim();
  if (value) {
    model.addListItem(listName, value);
    model.saveLocalData();
    addItemInput.value = '';
    addItemInput.focus();
    renderItems();
  }
});

// Old delegation removed – each row now has its own handlers

// Enter = klik på knap
addItemInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    addItemBtn.click();
  }
});

model.loadLocalData();
renderItems();
