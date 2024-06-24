document.addEventListener("DOMContentLoaded", function() {
    ymaps.ready(init);
});

function addMarkers(map, objects) {
    map.geoObjects.removeAll();

    objects.forEach(object => {
        try {
            const coordinates = object.coordinates.split(',').map(parseFloat);
            
            const placemark = new ymaps.Placemark(coordinates, {
                hintContent: object.title,
                balloonContentHeader: `<h4>${object.title}</h4>`,
                balloonContentBody: `
                    <div class="custom-balloon">
                        <img src="/img/photoObjects/${object.titleEng}.jpg" class="custom-balloon__photo" alt="${object.title}">
                        <p>${object.address}</p>
                        <a href="/api/objects/${object.titleEng}" class="custom-balloon__link btn">Подробнее</a>
                    </div>
                `
            }, {
                balloonPanelMaxMapArea: 0
            });

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
        addMarkers(map, data);
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

        const queryParams = {};

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

        const queryString = Object.keys(queryParams)
            .map(key => {
                if (queryParams[key].length > 0) {
                    return `${key}=${queryParams[key].join(',')}`;
                }
                return '';
            })
            .filter(param => param !== '')
            .join('&');

        if (queryString) {
            url += '?' + queryString;
        }
        console.log(url);

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch filtered objects');
        }
        const data = await response.json();

        map.geoObjects.removeAll();

        addMarkers(map, data);
    } catch (error) {
        console.error('Error fetching filtered objects:', error);
    }
}

function init() {
    var map = new ymaps.Map("map", {
        center: [55.8346, 37.54876],
        zoom: 5
    });
    map.controls.remove('searchControl');
    map.controls.remove('trafficControl');

    getMapObjects(map);

    document.querySelectorAll('.maps__filters-container input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            fetchFilteredObjects(map);
        });
    });
}
