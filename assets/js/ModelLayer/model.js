export let userData = {
  lists: [],
  theme: 'light',
};
export function addFirstList() {
  userData.lists.push({ name: 'Min første liste', items: [] });
  saveData();
}
