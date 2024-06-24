document.addEventListener('DOMContentLoaded', function() {
    const backButton = document.querySelector('.back__a');
    backButton.addEventListener('click', function(event) {
        event.preventDefault();
        history.back();
		console.log(event)
    });
});
