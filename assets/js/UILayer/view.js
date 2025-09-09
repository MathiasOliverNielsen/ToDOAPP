// View-lag for ToDOAPP
// Håndterer DOM-events og UI

import { appController, handleListAction } from '../ControllerLayer/controller.js';

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

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const listName = input.value.trim();
      if (listName) {
        handleListAction('add', listName);
        form.remove();
      }
    });

    // Fjern form hvis man klikker udenfor eller trykker Escape
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        form.remove();
      }
    });
    document.addEventListener('mousedown', function handler(e) {
      if (!form.contains(e.target) && e.target !== addListBtn) {
        form.remove();
        document.removeEventListener('mousedown', handler);
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
      listElem.textContent = list.name;
    }

    // Rediger-knap
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Rediger';
    editBtn.addEventListener('click', () => {
      // Sæt kun denne liste i redigeringsmode
      lists.forEach((l, i) => (l.beingEdited = i === index));
      renderLists(lists);
    });
    listElem.appendChild(editBtn);

    // Slet-knap
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Slet';
    deleteBtn.addEventListener('click', () => {
      if (confirm('Er du sikker på, at du vil slette listen?')) {
        handleListAction('delete', list.name);
      }
    });
    listElem.appendChild(deleteBtn);

    container.appendChild(listElem);
  });
}
