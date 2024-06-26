// Функция для запроса трех случайных объектов с сервера
async function getRandomObjects() {
    try {
        const response = await fetch('/api/objects/random');
        if (!response.ok) {
            throw new Error('Failed to fetch random objects');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching random objects:', error);
        return null;
    }
}

// Функция для отображения случайных объектов на странице
async function displayRandomObjects() {
    try {
        const objects = await getRandomObjects();
        if (!objects) {
            console.error('Failed to fetch objects');
            return;
        }
        
        const container = document.querySelector('.catalog__cards');

        container.innerHTML = '';

        objects.forEach(object => {
            const card = document.createElement('div');
            card.classList.add('catalog__card');

            const img = document.createElement('img');
            img.classList.add('catalog__card-img');
            img.src = object.photoUrl;
            img.alt = object.title; 

            const title = document.createElement('div');
            title.classList.add('catalog__card-title');
            title.textContent = object.title;

            const address = document.createElement('div');
            address.classList.add('catalog__card-adress');
            address.textContent = object.address;

            const button = document.createElement('a');
            button.classList.add('catalog__card-btn');
            button.classList.add('btn');
            button.textContent = 'Подробнее';
			button.href = `/api/objects/${object.titleEng}`;
			
            card.appendChild(img);
            card.appendChild(title);
            card.appendChild(address);
            card.appendChild(button);

            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error displaying objects:', error);
    }
}

window.onload = async function() {
    await displayRandomObjects();
};
