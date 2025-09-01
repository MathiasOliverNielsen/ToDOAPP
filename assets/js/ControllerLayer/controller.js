// Controller-lag for ToDOAPP
// Her håndteres logik mellem model og view, ænder data

function appController(userData) {
  // Tjek om der er eksisterende lister
  if (userData.lists && userData.lists.length > 0) {
    showLists(userData.lists);
  } else {
    addFirstList();
  }
  // Sæt tema uanset
  setUserTheme(userData.theme);
}
