document.addEventListener("DOMContentLoaded", function() {
    ymaps.ready(init);
});

function addMarkers(map, objects) {
    // Очищаем все текущие маркеры на карте
    map.geoObjects.removeAll();

    // Перебираем массив объектов и добавляем маркеры на карту
    objects.forEach(object => {
        // Извлекаем координаты объекта
        const coordinates = object.coordinates.split(',').map(parseFloat);
        
        // Создаем маркер
        const placemark = new ymaps.Placemark(coordinates, {
            // Здесь можно указать информацию о маркере
            hintContent: object.title,// заголовок объекта
			balloonContent: `<a href="/api/objects/${object.titleEng}">${object.title}</a>` // Ссылка на страницу объекта
        });

        // Добавляем маркер на карту
        map.geoObjects.add(placemark);

        // // Добавляем обработчик события клика по маркеру
		// placemark.events.add('click', () => {
		// 	displayObjectInfo(object);
		// 	console.log('hello');
		// });
    });


}

// Функция для отправки запроса на сервер и получения списка всех объектов
async function getMapObjects(map) {
    try {
        const response = await fetch('/api/objects');
        if (!response.ok) {
            throw new Error('Failed to fetch objects');
        }
        const data = await response.json();
        addMarkers(map, data); // Добавляем маркеры на карту
    } catch (error) {
        console.error('Error fetching objects:', error);
    }
}

async function fetchFilteredObjects(map) {
    try {
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

        // Удаляем текущие маркеры с карты
        map.geoObjects.removeAll();

        // Добавляем новые маркеры на карту
        addMarkers(map, data);
    } catch (error) {
        console.error('Error fetching filtered objects:', error);
    }
}


function init() {
    var map = new ymaps.Map("map", {
        center: [55.8346,37.54876], // Координаты центра карты
        zoom: 5 // Уровень масштабирования
    });
    map.controls.remove('searchControl');
    map.controls.remove('trafficControl');

    getMapObjects(map); // Получаем объекты с сервера и добавляем маркеры на карту

    // Передаем переменную map в обработчик события
    document.querySelectorAll('.maps__filters-container input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            fetchFilteredObjects(map);
        });
    });
}




// function displayObjectInfo(object) {
//     const objectInfoBlock = document.getElementById('objectInfo');
//     // Очищаем блок перед добавлением новой информации
//     objectInfoBlock.innerHTML = '';
    
// 	const objectInfoLink = document.getElementById('objectInfo');
// 	const objectTitleEng = object.titleEng;
// 	const linkHref = `/api/objects/${objectTitleEng}`;

// 	// Добавляем атрибут href к ссылке
// 	objectInfoLink.setAttribute('href', linkHref);

//     // Создаем элементы для отображения информации об объекте
//     const title = document.createElement('h2');
//     title.textContent = object.title;

//     const address = document.createElement('p');
//     address.textContent = object.address;

//     // Добавляем созданные элементы в блок информации об объекте
//     objectInfoBlock.appendChild(title);
//     objectInfoBlock.appendChild(address);

//     // Показываем блок информации об объекте
//     objectInfoBlock.style.display = 'block';
// }
