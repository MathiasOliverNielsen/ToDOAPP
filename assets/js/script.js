// Funktion der kaldes ved opstart af Appen
function userStartApp() {
  const appName = 'ToDoApp';
  // Hent data fra localStorage
  const savedData = localStorage.getItem(appName);
  let userData = {
    lists: [],
    //standard theme
    theme: 'light',
  };
  if (savedData) {
    userData = JSON.parse(savedData);
  }
  // Initialiser brugerens lister og tema
  initUserLists(userData.lists);
  setUserTheme(userData.theme);
}
// Kald userStartApp når siden er klar
document.addEventListener('DOMContentLoaded', userStartApp);
