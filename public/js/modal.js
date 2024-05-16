// Получаем ссылки на элементы
const modal = document.getElementById('addObjectForm');
const btnOpenModal = document.getElementById('addObjectBtn');
const spanClose = document.getElementsByClassName('close')[0];

// Функция для открытия модального окна
function openModal() {
  modal.style.display = 'block';
}

// Функция для закрытия модального окна
function closeModal() {
  modal.style.display = 'none';
}

// Обработчик события для открытия модального окна при клике на кнопку
btnOpenModal.addEventListener('click', openModal);

// Обработчик события для закрытия модального окна при клике на крестик
spanClose.addEventListener('click', closeModal);

// Обработчик события для закрытия модального окна при клике вне модального окна
window.addEventListener('click', function(event) {
  if (event.target == modal) {
    closeModal();
  }
});
