// Функция для отправки запроса на сервер и получения списка всех объектов
async function getObjects() {
    try {
        const response = await fetch('/api/objects');
        if (!response.ok) {
            throw new Error('Failed to fetch objects');
        }
        const data = await response.json();
        displayObjects(data); // Отображение всех объектов
    } catch (error) {
        console.error('Error fetching objects:', error);
    }
}

async function fetchFilteredObjects() {
    try {
        await getObjects(); // Сначала получаем все объекты

        const selectedStatuses = document.querySelectorAll('input[name="state"]:checked');
        const selectedCenturies = document.querySelectorAll('input[name="century"]:checked');
        const selectedTypes = document.querySelectorAll('input[name="type"]:checked');

        let url = '/api/objects/filter';

        const queryParams = {}; // Объект для хранения параметров запроса

        // Добавляем параметры фильтрации в объект queryParams
        queryParams.state = [];
        selectedStatuses.forEach(status => {
            queryParams.state.push(status.value);
        });

        queryParams.century = [];
        selectedCenturies.forEach(century => {
            queryParams.century.push(century.value);
        });

        queryParams.type = [];
        selectedTypes.forEach(type => {
            queryParams.type.push(type.value);
        });

        // Преобразуем массивы значений параметров в строку
        const queryString = Object.keys(queryParams)
            .map(key => {
                if (queryParams[key].length > 0) {
                    return `${key}=${queryParams[key].join(',')}`;
                }
                return '';
            })
            .filter(param => param !== '')
            .join('&');

        // Проверяем, есть ли параметры для добавления к URL
        if (queryString) {
            url += '?' + queryString; // Собираем URL-адрес с параметрами
        }
		console.log(url);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch filtered objects');
        }
        const data = await response.json();
        displayObjects(data); // Отображение отфильтрованных объектов
    } catch (error) {
        console.error('Error fetching filtered objects:', error);
    }
}





function displayObjects(objects) {
    const container = document.querySelector('.objects__cards-container');

    // Очистить контейнер перед добавлением новых объектов
    container.innerHTML = '';

    // Перебрать массив объектов и отобразить каждый из них
    objects.forEach(object => {
        const card = createObjectCard(object); // Создаем карточку объекта
        container.appendChild(card); // Добавляем карточку в контейнер
    });
}

// Функция для создания карточки объекта
function createObjectCard(object) {
    const card = document.createElement('a');
    card.classList.add('objects__card');
	card.href = `/api/objects/${object.titleEng}`;

    const img = document.createElement('img');
    img.classList.add('objects__card-img');
    img.src = object.photoUrl;
    img.alt = object.title; 

    const info = document.createElement('div');
    info.classList.add('object__card-info');

    const title = document.createElement('h3');
    title.classList.add('objects__card-title');
    title.textContent = object.title;

    const address = document.createElement('span');
    address.innerHTML = `<strong>Адрес:</strong> ${object.address}`;

    const gosreester = document.createElement('span');
    gosreester.innerHTML = `<strong>Номер в госреестре: </strong> ${object.gosreester}`;

    const category = document.createElement('span');
    category.innerHTML = `<strong>Категория: </strong> ${object.category}`;

    const typeRu = document.createElement('span');
    typeRu.innerHTML = `<strong>Вид объекта: </strong> ${object.typeRu}`;

    const date = document.createElement('span');
    date.innerHTML = `<strong>Дата: </strong> ${object.date}`;

    info.appendChild(title);
    info.appendChild(address);
    info.appendChild(gosreester);
    info.appendChild(category);
    info.appendChild(typeRu);
    info.appendChild(date);

    card.appendChild(img);
    card.appendChild(info);

    return card;
}

// Вызываем функцию для отображения объектов при загрузке страницы
window.onload = fetchFilteredObjects;

// Обработчик события изменения фильтров
document.querySelectorAll('.objects__filters-container input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', fetchFilteredObjects);
});
