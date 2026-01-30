//Инициализация Sequelize и подключение к базе SQLite

import { Sequelize } from 'sequelize';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

//Получаем путь к текущей директории (для ESM модулей нет __dirname по умолчанию)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Папка и файлы базы банных
const dataDir = path.resolve(__dirname, '..', 'data');
const dbPath = path.join(dataDir, 'dogbreeds.sqlite');

//Гарантируем, что директоряи для БД существует (SQLite сам файл создаст, но не диреторию)
fs.mkdirSync(dataDir, { recursive: true });

//Создаем экземпляр Squelize для работы с SQLite
//storage - путь к файлу базы; logging отключаем для аккуратных логов
export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: false,
});

//Функция-хелпер для безопасного подключения к БД (можно вызвать при старте сервера)
export async function connectDB() {
    try {
        await sequelize.authenticate();
        // Если подключение прошло успешно = возвращаем true
        return true;
    } catch (err) {
        console.error('Не удалось подключиться к базе данных: ', err);
        throw err;
    }
}

