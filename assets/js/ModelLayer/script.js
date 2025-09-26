import { appController } from '../ControllerLayer/controller.js';
import '../UILayer/view.js'; // Import to run the theme toggle setup

// Call userStartApp when the page is ready
document.addEventListener('DOMContentLoaded', () => {
  // Small delay to ensure view.js DOM listener runs first
  setTimeout(userStartApp, 10);
});

function userStartApp() {
  const appName = 'ToDoApp';
  const savedData = localStorage.getItem(appName);
  let userData = {
    lists: [],
    theme: 'light',
  };
  if (savedData) {
    userData = JSON.parse(savedData);
  }
  appController();
}
