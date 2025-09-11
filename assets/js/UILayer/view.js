// View-lag for ToDOAPP
// Håndterer DOM-events og UI

import { appController, handleListAction } from '../ControllerLayer/controller.js';
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
    form.style.marginTop = '1rem';

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
    const listElem = document.createElement('div');
    listElem.style.display = 'flex';
    listElem.style.alignItems = 'center';
    listElem.style.gap = '0.5rem';

    // Tjek om denne liste er i redigeringsmode
    if (list.beingEdited) {
      listElem.style.background = '#ffeeba'; // Gul baggrund for at vise redigering
      const form = document.createElement('form');
      form.style.display = 'inline';
      form.style.margin = 0;
      const input = document.createElement('input');
      input.type = 'text';
      input.value = list.name;
      input.required = true;
      input.autofocus = true;
      form.appendChild(input);

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const newName = input.value.trim();
        if (newName && newName !== list.name) {
          handleListAction('update', index, newName);
        }
        list.beingEdited = false;
        renderLists(lists);
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          list.beingEdited = false;
          renderLists(lists);
        }
      });

      // Klik udenfor input afslutter redigering
      setTimeout(() => {
        function handleClickOutside(event) {
          if (!form.contains(event.target)) {
            list.beingEdited = false;
            renderLists(lists);
            document.removeEventListener('mousedown', handleClickOutside);
          }
        }
        document.addEventListener('mousedown', handleClickOutside);
      }, 0);

      listElem.appendChild(form);
    } else {
      // Klik på listenavn åbner ny side med items, men vises som label
      const nameLabel = document.createElement('span');
      nameLabel.textContent = list.name;
      nameLabel.style.flex = '1';
      nameLabel.style.textAlign = 'left';
      nameLabel.style.background = 'none';
      nameLabel.style.border = 'none';
      nameLabel.style.font = 'inherit';
      nameLabel.style.cursor = 'pointer';
      nameLabel.style.textDecoration = 'none';
      nameLabel.style.padding = '0.2em 0';
      nameLabel.style.userSelect = 'none';
      nameLabel.style.display = 'inline-block';
      nameLabel.style.color = 'inherit';
      nameLabel.addEventListener('mouseenter', () => {
        nameLabel.style.background = '#f0f0f0';
      });
      nameLabel.addEventListener('mouseleave', () => {
        nameLabel.style.background = 'none';
      });
      nameLabel.addEventListener('click', () => {
        window.location.href = `listitems.html?list=${encodeURIComponent(list.name)}`;
      });
      listElem.appendChild(nameLabel);
    }

    // Rediger-ikon
    const editImg = document.createElement('img');
    editImg.src = 'assets/img/edit.svg';
    editImg.alt = 'Rediger';
    editImg.className = 'li-icon';
    editImg.style.cursor = 'pointer';
    editImg.title = 'Rediger';
    editImg.addEventListener('click', () => {
      lists.forEach((l, i) => (l.beingEdited = i === index));
      renderLists(lists);
    });
    listElem.appendChild(editImg);

    // Slet-ikon
    const deleteImg = document.createElement('img');
    deleteImg.src = 'assets/img/trash.svg';
    deleteImg.alt = 'Slet';
    deleteImg.className = 'li-icon';
    deleteImg.style.cursor = 'pointer';
    deleteImg.title = 'Slet';
    deleteImg.addEventListener('click', () => {
      if (confirm('Er du sikker på, at du vil slette listen?')) {
        handleListAction('delete', list.name);
      }
    });
    listElem.appendChild(deleteImg);

    container.appendChild(listElem);
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
});

// Toggle handlers
moonIcon.addEventListener('click', () => setTheme('dark'));
sunIcon.addEventListener('click', () => setTheme('light'));
