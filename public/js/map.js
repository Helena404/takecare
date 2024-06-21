document.addEventListener("DOMContentLoaded", function() {
    ymaps.ready(init);
});

function addMarkers(map, objects) {
    // Очищаем все текущие маркеры на карте
    map.geoObjects.removeAll();

    // Перебираем массив объектов и добавляем маркеры на карту
    objects.forEach(object => {
        try {
            // Извлекаем координаты объекта
            const coordinates = object.coordinates.split(',').map(parseFloat);
            
            // Создаем маркер
            const placemark = new ymaps.Placemark(coordinates, {
                // Здесь можно указать информацию о маркере
                hintContent: object.title, // Всплывающая подсказка при наведении
                balloonContentHeader: `<h4>${object.title}</h4>`, // Заголовок всплывающего окна
                balloonContentBody: `
                    <div class="custom-balloon">
                        <img src="/img/photoObjects/${object.titleEng}.jpg" class="custom-balloon__photo" alt="${object.title}">
                        <p>${object.address}</p>
                        <a href="/api/objects/${object.titleEng}" class="custom-balloon__link btn">Подробнее</a>
                    </div>
                ` // Тело всплывающего окна
            }, {
                balloonPanelMaxMapArea: 0 // Ограничиваем размер области карты, при открытии панели
            });

            // Добавляем маркер на карту
            map.geoObjects.add(placemark);
        } catch (error) {
            console.error('Error adding marker:', error);
        }
    });

}


// Функция для отправки запроса на сервер и получения списка всех объектов
async function getMapObjects(map) {
    try {
        const response = await fetch('/api/objectsForMap');
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
        center: [55.8346, 37.54876], // Координаты центра карты
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
