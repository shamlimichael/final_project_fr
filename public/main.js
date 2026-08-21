let menuBtn = document.querySelector('.menu_btn');
let sidebar = document.querySelector('.sidebar');
let dashboardMain = document.querySelector('.dashboard_main');
menuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('active');
    dashboardMain.classList.toggle('shifted');
});

let navButtons = document.querySelectorAll('.sidebar_btn[data-target]');
let allSections = document.querySelectorAll('.dashboard_section');
navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        allSections.forEach(section => section.classList.add('hidden_section'));
        const targetId = btn.getAttribute('data-target');
        document.getElementById(targetId).classList.remove('hidden_section');
    });
});