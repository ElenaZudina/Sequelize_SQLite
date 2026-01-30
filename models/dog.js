//Описание модели "Movie" для таблицы в SQLite через Sequelize
//Поля: title (название), image (путь к картинке), description (описание), year (год выпуска)

import { DataTypes, Model } from 'sequelize';
import { sequelize } from './index.js';

export class Dog extends Model {}

Dog.init(
    {
        //Название фильма (обязательное, стркоа не пустая)
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },

        origin: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },

        //Путь к картинке (относительный путь в /public), пока используем один и тот  же файл test.jpg
        image: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '/images/test.jpg',
            validate: {
                notEmpty: true,
            },
        },

        //Короткое описание/синопсис
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },

        //Год выпуска (целое число, базовая валидация на разумный диапозон)
        year: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1700, 
                max: new Date().getFullYear() + 1, //допускаме ближайшую перспективу
            },
        },
    },
    {
        sequelize,
        modelName: 'Dog',
        tableName: 'dogs',
        timestamps: true, //createdAt/updatedAt - полезно для отладки
    }
);