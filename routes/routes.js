// routes.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import Architecture from '../models/architecture.js'; 
import UserSubmission from '../models/userSubmission.js';
import Article from '../models/article.js'; // Импорт моделей
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();


// Маршрут для получения всех объектов для карты
router.get('/objectsForMap', async (req, res) => {
    try {
        const objects = await Architecture.find();
        res.json(objects);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/objects', async (req, res) => {
    try {
        // Получаем параметры пагинации из запроса
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;

        // Вычисляем индексы для выборки из базы данных
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        // Создаем объект фильтров на основе запроса
        const query = {};

        if (req.query.state) {
            query.state = { $in: req.query.state.split(',') };
        }
        if (req.query.century) {
            query.century = { $in: req.query.century.split(',') };
        }
        if (req.query.type) {
            query.type = { $in: req.query.type.split(',') };
        }

        // Получаем общее количество объектов для текущих фильтров
        const totalObjects = await Architecture.countDocuments(query).exec();
        const totalPages = Math.ceil(totalObjects / limit);

        // Получаем объекты с учетом фильтров и пагинации
        const objects = await Architecture.find(query).limit(limit).skip(startIndex).exec();

        // Отправляем ответ с объектами и количеством страниц
        res.json({
            objects,
            totalPages,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});



// Маршрут для получения объектов с координатами
router.get('/objects/coordinates', async (req, res) => {
    try {
        // Ищем объекты, у которых есть координаты
        const objectsWithCoordinates = await Architecture.find({ coordinates: { $exists: true, $ne: null } });

        // Отправляем массив объектов с координатами
        res.json(objectsWithCoordinates);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Маршрут для получения трех случайных объектов
router.get('/objects/random', async (req, res) => {
    try {
        const objects = await Architecture.aggregate([{ $sample: { size: 3 } }]);
        res.json(objects);
    } catch (error) {
        console.error('Error fetching random objects:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Маршрут для фильтрации объектов
router.get('/objects/filter', async (req, res) => {
    try {
        // Извлечение параметров фильтрации из запроса
        const { century, state, type } = req.query;

        // Построение объекта запроса на основе переданных параметров
        const query = {};

        if (century) {
            const centuries = century.split(',');
            query.century = { $in: centuries };
        }
        if (state) {
			const states = state.split(',');
            query.state = { $in: states };
        }
        if (type) {
			const types = type.split(',');
            query.type = { $in: types };
        }

        // Поиск объектов в базе данных согласно параметрам запроса
        const objects = await Architecture.find(query);
        // Возвращение найденных объектов в качестве ответа на запрос
        res.json(objects);
    } catch (err) {
        // Обработка ошибок
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});


// Настройка multer для обработки файлов
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/submit-object', upload.single('photo'), async (req, res) => {
    try {
        const { name, address, description } = req.body;
        const photo = req.file ? `/uploads/${req.file.filename}` : null;

        const newSubmission = new UserSubmission({
            userId: null, // Убираем зависимость от userId
            objectInfo: {
                name,
                address,
                description,
                photo
            },
            submissionDate: new Date(),
            status: 'на рассмотрении'
        });

        await newSubmission.save();
        res.status(201).send('Submission successful');
    } catch (error) {
        console.error('Error saving submission:', error);
        res.status(500).send('Server error');
    }
});

router.get('/articles', async (req, res) => {
try {
	const category = req.query.category;
	let articles;
	
	if (category) {
		articles = await Article.find({ category: category });
	} else {
		articles = await Article.find();
	}
	
	res.json(articles);
} catch (error) {
	console.error('Error fetching articles:', error);
	res.status(500).send('Server Error');
}
});

export default router;
