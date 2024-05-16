// routes.js
import express from 'express';
import path from 'path';
import Architecture from '../models/architecture.js'; 

const router = express.Router();





// Маршрут для получения всех объектов
router.get('/objects', async (req, res) => {
    try {
        const objects = await Architecture.find();
        res.json(objects);
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


// // Маршрут для получения информации об объекте по его ID
// router.get('/objects/:objectId', async (req, res) => {
//     try {
//         const objectId = req.params.objectId;
//         const object = await getObjectById(objectId);
//         res.render('object', { object }); // Шаблонизация данных и отправка HTML страницы
//     } catch (error) {
//         console.error('Error fetching object:', error);
//         res.status(500).send('Server Error');
//     }
// });




export default router;
