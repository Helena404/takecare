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

// 	 // Создание новой статьи
// 	 const newArticle = new Architecture({
// 		title: "Памятник в честь 50-летия Советского Союза",
// 		titleEng:"pamyatnik-50-let",
// 		address: "Челябинская область, г. Сатка, ул. 2-ая речная",
// 		gosreester: "-",
// 		category: "Памятник",
// 		securityStatus: "-",
// 		date: "1972",
// 		coordinates: "55.04083, 58.967079",
// 		photoUrl: "/img/photoObjects/pamyatnik-50-let.jpg",
// 		century: "XX",
// 		state: "middle",
// 		typeRu: "Сооружение",
// 		type: "monument",
// 		text: `Челябинская область, город Сатка, "Серп и молот". Скульптурная композиция возвышается на сопке в центральной части города. Памятник был установлен в городе в 1972 году в честь 50-летия образования СССР, по инициативе Саткинского ГК КПСС и исполкома городского совета народных депутатов.
// Виталий Чернецов, саткинский краевед, считает памятный знак уродливым гибридом из серпа, молота и пятиконечной звезды – символов СССР. Он пишет: «Поскольку в брежневский застойный период экономические и политические структуры страны были поставлены задом наперёд, то и государственную символику сварганили шиворот-навыворот. Никакой исторической ценности памятный знак не представляет. Зато в полной мере он отразил нашу идеологическую, мировоззренческую отсталость, упадок отечественной культуры, серость и однобокость доперестроечной, дореформенной эпохи, закат «развитого социализма»
		
// 		`
// 	});

// 	// Сохранение новой статьи в базу данных
// 	newArticle.save()
// 		.then(article => {
// 			console.log('Architecture saved:', article);
// 		})
// 		.catch(error => {
// 			console.error('Error saving article:', error);
// 		});

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

// Отправка страницы последней статьи
app.get('/highlight', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'article.html'));
});

// Маршрут для получения статьи по ID
app.get('/articles/:id', async (req, res) => {
    try {
        // Ищем статью по ID
        const article = await Article.findById(req.params.id);
        if (!article) {
            return res.status(404).send('Article not found');
        }
        // Рендерим страницу с данными статьи
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

