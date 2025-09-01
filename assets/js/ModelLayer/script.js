import { appController } from '../ControllerLayer/controller.js';
// Kald userStartApp når siden er klar
document.addEventListener('DOMContentLoaded', userStartApp);

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
  // Brug controller-laget til at initialisere appen
  appController(userData);
}
