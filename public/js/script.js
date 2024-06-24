document.addEventListener('DOMContentLoaded', function() {
    const menuLinks = document.querySelectorAll('.menu__link');

    menuLinks.forEach(link => {
        if (link.href.includes('#')) {
            return;
        }

        const linkPath = new URL(link.href).pathname;

        const currentPath = window.location.pathname;

        if (linkPath === currentPath) {
            link.classList.add('active');
        }
    });
});
