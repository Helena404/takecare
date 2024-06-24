import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import routes from './routes/routes.js'; // Импортируем файл маршрутов
import Architecture from './models/architecture.js';
import Article from './models/article.js';

const app = express();
const __dirname = path.resolve();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Указываем Express использовать EJS в качестве движка представлений
app.set('view engine', 'ejs');


// Подключение к базе данных MongoDB
mongoose.connect('mongodb://localhost:27017/objectsbox')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB', err);
    });



// Использование маршрутов API
app.use('/api', routes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// Отправка главной страницы
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Отправка страницы объектов
app.get('/objects', (req, res) => {
	
    res.sendFile(path.join(__dirname, 'public', 'objects.html'));
});


app.get('/api/objects/:titleEng', async (req, res) => {
    try {
		const object = await Architecture.findOne({ titleEng: req.params.titleEng });
        if (!object) {
            return res.status(404).send('Object not found'); 
        }
        res.render('object', { object });
    } catch (error) {
        console.error('Error handling request:', error);
        res.status(500).send('Server Error');
    }
});


// Отправка страницы карты
app.get('/map', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'map.html'));
});

// Отправка страницы образования
app.get('/education', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'education.html'));
});

// Отправка страницы последней статьи
app.get('/highlight', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'article.html'));
});

// Маршрут для получения статьи по ID
app.get('/articles/:id', async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) {
            return res.status(404).send('Article not found');
        }
        res.render('article', { article });
    } catch (error) {
        console.error('Error handling request:', error);
        res.status(500).send('Server Error');
    }
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log(`Server is running on port ${PORT}`);
});

