import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import jwt from 'jsonwebtoken';
import routes from './routes/routes.js'; // Импортируем файл маршрутов
import Architecture from './models/architecture.js';

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
app.use('/api', routes); // Используем файл маршрутов

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
        // Здесь можно добавить логику для получения информации о конкретном объекте,
        // используя значение параметра :titleEng из запроса
		const object = await Architecture.findOne({ titleEng: req.params.titleEng });
        if (!object) {
            return res.status(404).send('Object not found'); 
        }
		// Отправляем HTML страницу с внедренными данными объекта
        res.render('object', { object });
        // Затем отправляем файл object.html в ответ на запрос
        //res.sendFile(path.join(__dirname, 'public', 'object.html'));
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

// // Этот маршрут перенаправляет все остальные запросы на главную страницу
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });


// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log(`Server is running on port ${PORT}`);
});

