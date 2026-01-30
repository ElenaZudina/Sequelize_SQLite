// scripts/seed.js
//Скрипт первичного наполнения базы (сидирования)
// Используем одну и ту же картинку: /images/test.jpg

import { sequelize, connectDB } from  '../models/index.js';
import { Dog } from '../models/dog.js';

async function seed() {
    try {
        await connectDB();

        //Создаем таблицы, если их еще нет
        await sequelize.sync();

        //Набор из ПЯТИ тестовых пород
        const dogs = [
            {
                title: 'Лабрадор ретривер',
                origin: 'Канада',
                description: 'Одна из самых популярных пород, известна своим дружелюбным характером и интеллектом.',
                year: 1915,
                image: '/images/labrador.jpg',
            },
            {
                title: 'Немецкая овчарка',
                origin: 'Германия',
                description: 'Порода, известная своей преданностью и отличными рабочими качествами.',
                year: 1899,
                image: '/images/german_shepherd.jpg',
            },
            {
                title: 'Чихуахуа',
                origin: 'Мексика',
                description: 'Миниатюрная собака с большим характером, известна своей преданностью и энергией.',
                year: 1950,
                image: '/images/chihuahua.jpg',
            },
            {
                title: 'Русская псовая борзая',
                origin: 'Россия',
                description: 'Охотничья борзая с великолепной скоростью и выносливостью, гордость России.',
                year: 1900,
                image: '/images/russian_borzaya.jpg',
        
            },
            {
                title: 'Эстонская гончая',
                origin: 'Эстония',
                description: 'Средняя по размеру охотничья собака с отличным нюхом и выносливостью.',
                year: 1930,
                image: '/images/estonian_hound.jpg',
            },
              {
                title: 'Шотландская овчарка',
                origin: 'Великобритания',
                description: 'Шотландская овчарка — умная и преданная собака среднего размера, известная своей отличной обучаемостью и ласковым характером.',
                year: 1870,
                image: '/images/test.jpg',
            },
        ];
        //Идемпотентное сидирование: добавляем недостающие фильмы по их названию
        let created = 0;
        for (const d of dogs) {
            const [_, isCreated] = await Dog.findOrCreate({
                where: { title: d.title },
                defaults: d,
            });
            if (isCreated) created += 1;
        }

        const total = await Dog.count();
        console.log(`Сидирование завершено. Гарантировано 5 пород. Добавлено новых: ${created}. Всего в базе: ${total}.`);
        process.exit(0);
    } catch(err) {
        console.error('Ошибка при сидировании: ', err);
        process.exit(1);
    }
}

seed();
