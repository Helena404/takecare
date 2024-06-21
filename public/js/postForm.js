document.getElementById('objectForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    try {
        const response = await fetch('/submit-object', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to submit object');
        }

        const result = await response.text();
        alert(result); // Сообщение об успешной отправке
        e.target.reset(); // Сброс формы
    } catch (error) {
        console.error('Error submitting object:', error);
    }
});
