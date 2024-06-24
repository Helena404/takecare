const modal = document.getElementById('addObjectForm');
const btnOpenModal = document.getElementById('addObjectBtn');
const spanClose = document.getElementsByClassName('close')[0];

function openModal() {
  modal.style.display = 'block';
}

function closeModal() {
  modal.style.display = 'none';
}

btnOpenModal.addEventListener('click', openModal);

spanClose.addEventListener('click', closeModal);

window.addEventListener('click', function(event) {
  if (event.target == modal) {
    closeModal();
  }
});

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('objectForm');
    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const formData = new FormData(form);

        try {
            const response = await fetch('/api/submit-object', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                alert('Объект успешно добавлен');
                form.reset();
                closeModal();
            } else {
                alert('Ошибка при добавлении объекта');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка при добавлении объекта');
        }
    });
});
