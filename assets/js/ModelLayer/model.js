// Gemmer alle lister til localStorage
export function saveLocalData(appName = 'ToDoApp') {
  localStorage.setItem(appName, JSON.stringify(userData));
}
export let userData = {
  lists: [],
  theme: 'light',
};
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
