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
