// dynamisk dataobject der holder styr på alle lister og tema
export let userData = {
  lists: [],
  theme: 'light',
};
// Tilføjer et item til en liste
export function addListItem(listName, itemText) {
  const list = userData.lists.find((l) => l.name === listName);
  if (!list.items) list.items = [];
  list.items.push({
    id: Date.now().toString(),
    text: itemText,
    done: false,
  });
  saveLocalData();
}

// Opdaterer et item
export function updateListItem(listName, itemId, newText) {
  const list = userData.lists.find((l) => l.name === listName);
  if (!list) return;
  const item = list.items.find((i) => i.id === itemId);
  if (item) {
    item.text = newText;
    saveLocalData();
  }
}

// Sletter et item
export function deleteListItem(listName, itemId) {
  const list = userData.lists.find((l) => l.name === listName);
  if (!list) return;
  list.items = list.items.filter((i) => i.id !== itemId);
  saveLocalData();
}

// Toggler done-status på et item
export function toggleListItemDone(listName, itemId) {
  const list = userData.lists.find((l) => l.name === listName);
  if (!list) return;
  const item = list.items.find((i) => i.id === itemId);
  if (item) {
    item.done = !item.done;
    saveLocalData();
  }
}
// Tilføjer en ny liste med et givet navn
export function addNewList(name) {
  userData.lists.push({ name, items: [] });
  saveLocalData();
}

// Opdaterer navnet på en liste ud fra dens indeks
export function updateListName(index, newName) {
  if (userData.lists[index]) {
    userData.lists[index].name = newName;
    saveLocalData();
  }
}

// Sletter en liste ud fra dens navn (sletter første match)
export function deleteListByName(name) {
  const idx = userData.lists.findIndex((list) => list.name === name);
  if (idx !== -1) {
    userData.lists.splice(idx, 1);
    saveLocalData();
  }
}
// Gemmer alle lister til localStorage
export function saveLocalData(appName = 'ToDoApp') {
  localStorage.setItem(appName, JSON.stringify(userData));
}
export function addFirstList() {
  userData.lists.push({ name: 'Min første liste', items: [] });
  saveLocalData();
}

// Henter alle lister fra localStorage ved opstart
export function loadLocalData(appName = 'ToDoApp') {
  const saved = localStorage.getItem(appName);
  if (saved) {
    const parsed = JSON.parse(saved);
    userData.lists = parsed.lists || [];
    userData.theme = parsed.theme || 'light';
  } else {
    userData.lists = [];
    userData.theme = 'light';
  }
}
export function saveTheme(theme) {
  userData.theme = theme;
  localStorage.setItem('ToDoAppTheme', theme);
}

export function loadTheme() {
  const saved = localStorage.getItem('ToDoAppTheme');
  return saved ? saved : 'light';
}
