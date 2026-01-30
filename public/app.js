//Чтобы верстка не "прыгала"
const FALLBACK_IMG = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

//Рендер одной карточки фильма (чистая фукнция, возвращает DOM-элемент)
function renderDogCard(dog) {
    const card = document.createElement('article');
    card.className = 'dog-card';

    //Изображение обложки. В БД хранится относительный путь (например, "/images/test.jpg")
    const img = document.createElement('img');
    img.className = 'dog-cover';
    img.alt = `Постер породы: ${dog.title}`;
    img.src = dog.image || '/images/test.jpg';
    img.onerror = () => {
        //если файл не найден = заменяем на прозрачный пиксель
        // это поможет избежать "битого" изображения
        img.src = FALLBACK_IMG;
    };
    
    //Текстовая часть
    const body = document.createElement('div');
    body.className = 'dog-body';

    const title = document.createElement('h3');
    title.className = 'dog-title';
    title.textContent = dog.title;

    const metaOrigin = document.createElement('div');
    metaOrigin.className = 'dog-meta';
    metaOrigin.textContent = `Страна: ${dog.origin}`;

    const metaYear = document.createElement('div');
    metaYear.className = 'dog-meta';
    metaYear.textContent = `Год: ${dog.year}`;

    const desc = document.createElement('p');
    desc.className = 'dog-desc';
    desc.textContent = dog.description;

    body.appendChild(title);
    body.appendChild(metaOrigin);
    body.appendChild(metaYear);
    body.appendChild(desc);

    card.appendChild(img);
    card.appendChild(body);

    return card;
}

//Точка входа: получаем фильмы с сервера и вставляем на страницу
async function loadDogs() {
    const container = document.getElementById('dogs');

    //Простейший лоадер
    container.textContent = 'загрузка пород...';

    try {
        const res = await fetch('/api/breeds');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const dogs = await res.json();

        //Очищаем контейнер и вставляем карточки
        container.innerHTML = '';
        if (!Array.isArray(dogs) || dogs.length === 0) {
            container.textContent = 'В базе пока нет пород.';
            return;
        }

        dogs.forEach((d) => container.appendChild(renderDogCard(d)));
    } catch (err) {
        //Показываем ошибку пользователю и пишем в консоль
        console.error('Не удалось загрузить породы', err);
        container.textContent = 'Ошибка загрузки пород. Прверьте сервер';
    }
}

//загружаем при готовности DOM
document.addEventListener('DOMContentLoaded', loadDogs);