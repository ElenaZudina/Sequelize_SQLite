//сервер на Express для приложения "Kinoman"
// - Обслуживает статические файлы из /public
// - REST API маршрут /api/movies для получения списка фильмов из SQLite (через Seqelize)

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB, sequelize } from './models/index.js';
import { Dog } from './models/dog.js';

//получаем __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

//Включаем CORS (на случай, если форнтенд и бэкенд будут на разных хостах)
app.use(cors());

///Позволяем Express парсить JSONтела  запросов (на будущееЮ если будем добавлять/редактировать файлы)
app.use(express.json());

//Отдаем статические файлы (HTML/CSS/JS и изображения) из папки public
app.use(express.static(path.join(__dirname, 'public')));

//API: получить список фильмов
app.get('/api/breeds', async (req, res) => {
    try {
        const dogs = await Dog.findAll({ order: [['createdAt', 'DESC']] });
        res.json(dogs);
    } catch (err) {
        console.error('Ошибка при получении пород: ', err);
    }
});

//Запуск сервера с предварительным подключением к базе и синхронизацией моделей
async function start() {
    try {
        await connectDB();
        //Создаем таблицы если их еще нет. force=false - не удаляем данные при рестарте
        await sequelize.sync();

        app.listen(PORT, () => {
            console.log(`DogBreeds сервер запущен: http://localhost:${PORT}`);
            console.log('Откройте в браузере http://localhost:' + PORT);
        });
    } catch(err) {
        console.log('Критическая ошибка при запуске:', err);
    }
}

start();



