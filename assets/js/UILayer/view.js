// View-lag for ToDOAPP
// Håndterer DOM-events og UI

import { appController, handleListAction } from '../ControllerLayer/controller.js';
import { createEditableRow } from './editableRow.js';
import * as model from '../ModelLayer/model.js';

document.addEventListener('DOMContentLoaded', appController); // Kald controlleren når siden er klar

// Tilføj event listener til "Tilføj liste"-knap
const addListBtn = document.getElementById('addNewList');
if (addListBtn) {
  addListBtn.addEventListener('click', () => {
    // Tjek om der allerede findes et inputfelt
    if (document.getElementById('newListForm')) return;

    const container = document.getElementById('listsContainer');
    const form = document.createElement('form');
    form.id = 'newListForm';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Navn på ny liste';
    input.required = true;
    input.autofocus = true;

    form.appendChild(input);
    container.appendChild(form);

    input.focus();

    // Gem og opret listen hvis man klikker udenfor input (og ikke på addNewList)
    setTimeout(() => {
      function handleClickOutside(e) {
        if (!form.contains(e.target) && e.target !== addListBtn) {
          const listName = input.value.trim();
          if (listName) {
            handleListAction('add', listName);
          }
          form.remove();
          document.removeEventListener('mousedown', handleClickOutside);
          document.removeEventListener('touchstart', handleClickOutside);
        }
      }
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }, 0);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const listName = input.value.trim();
      if (listName) {
        handleListAction('add', listName);
        form.remove();
      }
    });

    // Escape lukker form
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        form.remove();
      }
    });
  });
}

export function renderLists(lists) {
  const container = document.getElementById('listsContainer');
  container.innerHTML = '';
  lists.forEach((list, index) => {
    const row = createEditableRow({
      text: list.name,
      beingEdited: !!list.beingEdited,
      onPrimaryClick: () => {
        window.location.href = `listitems.html?list=${encodeURIComponent(list.name)}`;
      },
      onStartEdit: () => {
        lists.forEach((l, i) => (l.beingEdited = i === index));
        renderLists(lists);
      },
      onSubmit: (newText) => {
        if (newText !== list.name) {
          handleListAction('update', index, newText);
        } else {
          list.beingEdited = false;
          renderLists(lists);
        }
      },
      onDelete: () => {
        if (confirm('Er du sikker på, at du vil slette listen?')) {
          handleListAction('delete', list.name);
        }
      },
      classes: ['list-card'],
    });
    container.appendChild(row);
  });
}

// Theme toggling
const moonIcon = document.getElementById('moonIcon');
const sunIcon = document.getElementById('sunIcon');

export function setTheme(theme) {
  if (theme === 'dark') {
    document.body.classList.add('dark-mode');
    document.body.classList.remove('light-mode');
    moonIcon.style.display = 'none';
    sunIcon.style.display = '';
  } else {
    document.body.classList.add('light-mode');
    document.body.classList.remove('dark-mode');
    moonIcon.style.display = '';
    sunIcon.style.display = 'none';
  }
  model.saveTheme(theme);
}

// On page load, set theme from localStorage
document.addEventListener('DOMContentLoaded', () => {
  const theme = model.loadTheme();
  setTheme(theme);
  const inp = document.getElementById('addItemInput');
  if (inp) inp.style.background = ''; // ensure CSS applies
});

// Toggle handlers
moonIcon.addEventListener('click', () => setTheme('dark'));
sunIcon.addEventListener('click', () => setTheme('light'));
