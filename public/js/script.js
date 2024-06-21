document.addEventListener('DOMContentLoaded', function() {
    const menuLinks = document.querySelectorAll('.menu__link');

    menuLinks.forEach(link => {
        // Проверяем, содержит ли ссылка якорь
        if (link.href.includes('#')) {
            return; // Пропускаем якорные ссылки
        }

        // Получаем путь ссылки
        const linkPath = new URL(link.href).pathname;

        // Получаем текущий путь страницы
        const currentPath = window.location.pathname;

        // Если пути совпадают, добавляем класс 'active' к ссылке
        if (linkPath === currentPath) {
            link.classList.add('active');
        }
    });
});
