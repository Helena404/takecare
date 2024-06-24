// Функция для создания карточки статьи
function createArticleCard(article) {
    const listItem = document.createElement('li');
    listItem.classList.add('articles__item');

    const link = document.createElement('a');
    link.classList.add('articles__link');
    link.href = `/articles/${article._id}`;

    const imageContainer = document.createElement('div');
    imageContainer.classList.add('articles__image');

    const image = document.createElement('img');
    image.src = article.img;
    image.alt = article.title;

    const infoContainer = document.createElement('div');
    infoContainer.classList.add('articles__info');

    const category = document.createElement('p');
    category.classList.add('articles__category');
    category.textContent = article.category;

    const title = document.createElement('h3');
    title.classList.add('articles__title');
    title.textContent = article.title;

    const description = document.createElement('p');
    description.classList.add('articles__description');
    description.textContent = article.content;

    imageContainer.appendChild(image);
    infoContainer.appendChild(category);
    infoContainer.appendChild(title);
    infoContainer.appendChild(description);
    link.appendChild(imageContainer);
    link.appendChild(infoContainer);
    listItem.appendChild(link);

    return listItem;
}

// Функция для отображения статей
function displayArticles(articles) {
    const container = document.querySelector('.articles__list');
    container.innerHTML = '';

    articles.forEach(article => {
        const card = createArticleCard(article);
        container.appendChild(card);
    });
}

// Функция для получения и отображения статей по категории
async function getArticles(category = '') {
    try {
        let url = '/api/articles';
        if (category) {
            url += `?category=${encodeURIComponent(category)}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch articles');
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            displayArticles(data);
        } else {
            const text = await response.text();
            console.error('Expected JSON, got:', text);
            throw new Error('Invalid response format');
        }
    } catch (error) {
        console.error('Error fetching articles:', error);
    }
}

// Вызов функции для получения и отображения статей при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    getArticles();

    const categoryLinks = document.querySelectorAll('.categories__link');
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const category = link.textContent.trim();

            categoryLinks.forEach(link => link.classList.remove('category-active'));

            link.classList.add('category-active');

            getArticles(category);
        });
    });
});