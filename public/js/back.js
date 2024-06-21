document.addEventListener('DOMContentLoaded', function() {
    const backButton = document.querySelector('.back__a');
    backButton.addEventListener('click', function(event) {
        event.preventDefault(); // Отменяем стандартное действие перехода по ссылке
        history.back(); // Возвращаемся на предыдущую страницу в истории
		console.log(event)
    });
});
