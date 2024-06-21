let currentPage = 1;
const itemsPerPage = 5;

// Функция для запроса объектов с сервера с поддержкой пагинации
async function getObjects(page = 1, limit = 5, filters = {}) {
    try {
        let url = `/api/objects?page=${page}&limit=${limit}`;
        const queryParams = { ...filters };

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
            url += '&' + queryString; // Собираем URL-адрес с параметрами
        }
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch objects');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching objects:', error);
        return null;
    }
}

// Функция для отображения объектов на странице с пагинацией
async function displayObjects(page = 1) {
    const filters = getFilters(); // Получаем текущие фильтры
    const { objects, totalPages } = await getObjects(page, itemsPerPage, filters);
    
    if (!objects) {
        console.error('Failed to fetch objects');
        return;
    }
    
    const container = document.querySelector('.objects__cards-container');

    // Очистить контейнер перед добавлением новых объектов
    container.innerHTML = '';

    // Перебрать массив объектов и отобразить каждый из них
    objects.forEach(object => {
        const card = createObjectCard(object); // Создаем карточку объекта
        container.appendChild(card); // Добавляем карточку в контейнер
    });

    // Отобразить кнопки постраничной навигации
    displayPagination(totalPages, page);
}

// Функция для отображения кнопок постраничной навигации
function displayPagination(totalPages, currentPage) {
    const paginationContainer = document.querySelector('.pagination-container');
    paginationContainer.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.classList.toggle('active', i === currentPage);
        button.addEventListener('click', () => displayObjects(i));
        paginationContainer.appendChild(button);
    }
}

// Функция для получения текущих фильтров
function getFilters() {
    const selectedStatuses = document.querySelectorAll('input[name="state"]:checked');
    const selectedCenturies = document.querySelectorAll('input[name="century"]:checked');
    const selectedTypes = document.querySelectorAll('input[name="type"]:checked');

    const filters = {
        state: [],
        century: [],
        type: []
    };

    selectedStatuses.forEach(status => {
        filters.state.push(status.value);
    });

    selectedCenturies.forEach(century => {
        filters.century.push(century.value);
    });

    selectedTypes.forEach(type => {
        filters.type.push(type.value);
    });

    return filters;
}

// Вызываем функцию для отображения объектов при загрузке страницы
window.onload = () => displayObjects(currentPage);

// Обработчик события изменения фильтров
document.querySelectorAll('.objects__filters-container input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', () => displayObjects(currentPage));
});

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
