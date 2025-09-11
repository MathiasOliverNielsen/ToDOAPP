// Generic factory for an editable row (list or item)
// options: {
//   text, beingEdited, onSubmit(newText), onStartEdit(), onDelete(),
//   onPrimaryClick(), // label click (e.g. open list)
//   leftContent?, rightExtras? (DOM Nodes arrays)
//   classes?: string[] additional classes for outer container
// }
export function createEditableRow(options) {
  const { text, beingEdited, onSubmit, onStartEdit, onDelete, onPrimaryClick, leftContent = [], rightExtras = [], classes = [] } = options;

  const wrapper = document.createElement('div');
  wrapper.className = 'editable-row';
  classes.forEach((c) => wrapper.classList.add(c));
  if (beingEdited) wrapper.classList.add('editing');

  // Editing state
  if (beingEdited) {
    const form = document.createElement('form');
    form.className = 'editable-row-form';
    const input = document.createElement('input');
    input.type = 'text';
    input.value = text;
    input.required = true;
    input.autofocus = true;
    input.className = 'editable-row-input';
    form.appendChild(input);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = input.value.trim();
      if (val) onSubmit && onSubmit(val);
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        // cancel editing just by submitting original text (no change)
        onSubmit && onSubmit(text);
      }
    });

    // outside click ends edit (keeps original if unchanged)
    setTimeout(() => {
      function handleOutside(ev) {
        if (!form.contains(ev.target)) {
          onSubmit && onSubmit(input.value.trim() || text);
          document.removeEventListener('mousedown', handleOutside);
          document.removeEventListener('touchstart', handleOutside);
        }
      }
      document.addEventListener('mousedown', handleOutside);
      document.addEventListener('touchstart', handleOutside);
    }, 0);

    wrapper.append(...leftContent, form, ...rightExtras);
    return wrapper;
  }

  // Normal (non-editing) state
  const label = document.createElement('span');
  label.className = 'editable-row-label';
  label.textContent = text;
  if (onPrimaryClick) {
    label.tabIndex = 0;
    label.addEventListener('click', onPrimaryClick);
    label.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onPrimaryClick();
      }
    });
  }

  const editBtn = document.createElement('button');
  editBtn.type = 'button';
  editBtn.className = 'row-edit-btn';
  editBtn.title = 'Rediger';
  editBtn.innerHTML = '<img src="assets/img/edit.svg" alt="Rediger" class="li-icon" />';
  editBtn.addEventListener('click', () => onStartEdit && onStartEdit());

  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.className = 'row-delete-btn';
  deleteBtn.title = 'Slet';
  deleteBtn.innerHTML = '<img src="assets/img/trash.svg" alt="Slet" class="li-icon" />';
  deleteBtn.addEventListener('click', () => onDelete && onDelete());

  wrapper.append(...leftContent, label, editBtn, deleteBtn, ...rightExtras);
  return wrapper;
}
