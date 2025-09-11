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
  itemsUl.innerHTML = list.items
    .map((item) => {
      if (item.done) done++;
      return `<li>
      <span class="li-checkmark">${item.done ? '✔️' : ''}</span>
      <span style="flex:1;${item.done ? 'text-decoration:line-through;' : ''}">${item.text}</span>
  <button class="li-edit-btn" data-id="${item.id}" title="Rediger"><img src="assets/img/edit.svg" alt="Rediger" class="li-icon" /></button>
  <button class="li-delete-btn" data-id="${item.id}" title="Slet"><img src="assets/img/trash.svg" alt="Slet" class="li-icon" /></button>
      <input type="checkbox" ${item.done ? 'checked' : ''} data-id="${item.id}" class="done-toggle" style="display:none;" />
    </li>`;
    })
    .join('');
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

// Event delegation for edit og delete på alle li'er (model-baseret)
itemsUl.addEventListener('click', (e) => {
  const target = e.target.closest('button');
  if (!target) return;
  const id = target.dataset.id;
  if (target.classList.contains('li-delete-btn')) {
    if (confirm('Slet denne opgave?')) {
      model.deleteListItem(listName, id);
      model.saveLocalData();
      renderItems();
    }
  } else if (target.classList.contains('li-edit-btn')) {
    const list = model.userData.lists.find((l) => l.name === listName);
    if (!list) return;
    const item = list.items.find((i) => i.id === id);
    const oldText = item.text;
    const newText = prompt('Rediger opgave:', oldText);
    if (newText && newText.trim() && newText !== oldText) {
      model.updateListItem(listName, id, newText.trim());
      model.saveLocalData();
      renderItems();
    }
  }
});

// Enter = klik på knap
addItemInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    addItemBtn.click();
  }
});

model.loadLocalData();
renderItems();
