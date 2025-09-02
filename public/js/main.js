document.addEventListener('DOMContentLoaded', function() {
const menuToggle = document.getElementById('toggle-aside');
const sidebar = document.getElementById('sidebar');
if(menuToggle && sidebar) {
  console.log('Menu toggle and sidebar elements found');
  menuToggle.addEventListener('click', () => {
    console.log('Sidebar toggled');
    sidebar.classList.toggle('aside-open');
  });
} 

})
