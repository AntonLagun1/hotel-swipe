// Данные об отелях
const hotels = [
    {
        id: 1,
        name: "Лесная Усадьба",
        location: "Подмосковье, Московская область",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
        rating: 5,
        price: "₽8,500",
        description: "Уютный загородный отель в сосновом лесу. Деревянные домики, русская баня, ресторан с домашней кухней. Идеально для семейного отдыха и корпоративов."
    },
    {
        id: 2,
        name: "Озерный Берег",
        location: "Карелия, Республика Карелия",
        image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
        rating: 4,
        price: "₽6,200",
        description: "Загородный комплекс на берегу чистого озера. Рыбалка, катание на лодках, походы в лес. Уютные номера с видом на воду и камин."
    },
    {
        id: 3,
        name: "Горная Вершина",
        location: "Красная Поляна, Сочи",
        image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800",
        rating: 5,
        price: "₽12,000",
        description: "Роскошный загородный отель в горах. Зимой - горнолыжные трассы, летом - пешие походы. SPA-центр, бассейн с подогревом и ресторан высокой кухни."
    },
    {
        id: 4,
        name: "Золотые Поля",
        location: "Золотое Кольцо, Ярославская область",
        image: "https://images.unsplash.com/photo-1520250497591-112f2f6a13db?w=800",
        rating: 4,
        price: "₽5,800",
        description: "Усадьба в стиле русской классики. Исторические интерьеры, экскурсии по старинным городам, мастер-классы по народным ремеслам. Аутентичная атмосфера."
    },
    {
        id: 5,
        name: "Березовая Роща",
        location: "Тверская область",
        image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
        rating: 4,
        price: "₽7,200",
        description: "Эко-отель в березовом лесу. Экологически чистые материалы, органическая еда, йога-студия. Конные прогулки и велосипедные маршруты по окрестностям."
    },
    {
        id: 6,
        name: "Волжские Просторы",
        location: "Волга, Нижегородская область",
        image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
        rating: 5,
        price: "₽9,500",
        description: "Загородный комплекс на берегу Волги. Пляж, водные развлечения, прогулки на теплоходе. Современные номера с панорамными окнами и террасами."
    },
    {
        id: 7,
        name: "Сибирская Тайга",
        location: "Байкал, Иркутская область",
        image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
        rating: 5,
        price: "₽11,000",
        description: "Лодж в сибирской тайге недалеко от Байкала. Уникальная природа, наблюдение за дикими животными, баня по-черному. Незабываемый опыт дикой природы."
    },
    {
        id: 8,
        name: "Царская Усадьба",
        location: "Псковская область",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
        rating: 5,
        price: "₽10,500",
        description: "Восстановленная дворянская усадьба 19 века. Исторические интерьеры, парк с вековыми деревьями, концерты классической музыки. Роскошь и история."
    }
];

let currentCardIndex = 0;
let currentCard = null;
let startX = 0;
let startY = 0;
let isDragging = false;
let matchedHotel = null;

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    initializeCards();
    setupEventListeners();
    setMinDate();
});

function initializeCards() {
    const cardStack = document.getElementById('cardStack');
    cardStack.innerHTML = '';
    
    // Показываем первые 3 карточки
    for (let i = 0; i < Math.min(3, hotels.length - currentCardIndex); i++) {
        const hotel = hotels[currentCardIndex + i];
        if (hotel) {
            createCard(hotel, i);
        }
    }
    
    currentCard = document.querySelector('.hotel-card');
}

function createCard(hotel, index) {
    const cardStack = document.getElementById('cardStack');
    const card = document.createElement('div');
    card.className = 'hotel-card';
    card.style.zIndex = 100 - index;
    card.style.transform = `scale(${1 - index * 0.05}) translateY(${index * 10}px)`;
    card.dataset.hotelId = hotel.id;
    
    const stars = '⭐'.repeat(hotel.rating);
    
    card.innerHTML = `
        <img src="${hotel.image}" alt="${hotel.name}" onerror="this.src='https://via.placeholder.com/400x400?text=Hotel'">
        <div class="hotel-info">
            <h3>${hotel.name}</h3>
            <div class="hotel-location">📍 ${hotel.location}</div>
            <div class="hotel-rating">
                <span class="stars">${stars}</span>
                <span class="rating-text">${hotel.rating}/5</span>
            </div>
            <div class="hotel-price">${hotel.price} / ночь</div>
            <div class="hotel-description">${hotel.description}</div>
        </div>
    `;
    
    cardStack.appendChild(card);
    
    // Добавляем обработчики событий для свайпа
    setupCardEvents(card);
}

function setupCardEvents(card) {
    card.addEventListener('mousedown', handleStart);
    card.addEventListener('touchstart', handleStart, { passive: false });
    card.addEventListener('mousemove', handleMove);
    card.addEventListener('touchmove', handleMove, { passive: false });
    card.addEventListener('mouseup', handleEnd);
    card.addEventListener('touchend', handleEnd);
    card.addEventListener('mouseleave', handleEnd);
}

function handleStart(e) {
    if (!currentCard || currentCard !== e.currentTarget) return;
    
    isDragging = true;
    currentCard.classList.add('dragging');
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    startX = clientX;
    startY = clientY;
}

function handleMove(e) {
    if (!isDragging || !currentCard) return;
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const deltaX = clientX - startX;
    const deltaY = clientY - startY;
    
    const rotation = deltaX * 0.1;
    
    currentCard.style.transform = `translateX(${deltaX}px) translateY(${deltaY}px) rotate(${rotation}deg)`;
    
    // Изменяем прозрачность при свайпе
    const opacity = 1 - Math.abs(deltaX) / 300;
    currentCard.style.opacity = Math.max(0.5, opacity);
}

function handleEnd(e) {
    if (!isDragging || !currentCard) return;
    
    isDragging = false;
    currentCard.classList.remove('dragging');
    
    const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const deltaX = clientX - startX;
    
    const threshold = 100;
    
    if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0) {
            // Свайп вправо - лайк
            swipeRight();
        } else {
            // Свайп влево - дизлайк
            swipeLeft();
        }
    } else {
        // Возвращаем карточку на место
        currentCard.style.transform = '';
        currentCard.style.opacity = '';
    }
}

function swipeLeft() {
    currentCard.classList.add('swipe-left');
    setTimeout(() => {
        nextCard();
    }, 300);
}

function swipeRight() {
    const hotelId = parseInt(currentCard.dataset.hotelId);
    matchedHotel = hotels.find(h => h.id === hotelId);
    
    currentCard.classList.add('swipe-right');
    setTimeout(() => {
        showMatchOverlay();
        nextCard();
    }, 300);
}

function nextCard() {
    currentCardIndex++;
    
    if (currentCardIndex >= hotels.length) {
        // Все отели просмотрены
        const cardStack = document.getElementById('cardStack');
        cardStack.innerHTML = '<div style="text-align: center; color: white; padding: 50px;"><h2>Вы просмотрели все отели!</h2><p>Обновите страницу, чтобы начать заново.</p></div>';
        return;
    }
    
    initializeCards();
}

function showMatchOverlay() {
    const overlay = document.getElementById('matchOverlay');
    const hotelInfo = document.getElementById('matchHotelInfo');
    
    hotelInfo.innerHTML = `
        <h3>${matchedHotel.name}</h3>
        <p>📍 ${matchedHotel.location}</p>
        <p>${matchedHotel.price} / ночь</p>
    `;
    
    overlay.classList.add('show');
}

function setupEventListeners() {
    // Кнопки действий
    document.getElementById('rejectBtn').addEventListener('click', () => {
        if (currentCard) swipeLeft();
    });
    
    document.getElementById('likeBtn').addEventListener('click', () => {
        if (currentCard) swipeRight();
    });
    
    // Кнопки в модальном окне матча
    document.getElementById('bookBtn').addEventListener('click', () => {
        document.getElementById('matchOverlay').classList.remove('show');
        showBookingModal();
    });
    
    document.getElementById('continueBtn').addEventListener('click', () => {
        document.getElementById('matchOverlay').classList.remove('show');
        matchedHotel = null;
    });
    
    // Модальное окно бронирования
    document.getElementById('closeModal').addEventListener('click', () => {
        document.getElementById('bookingModal').classList.remove('show');
    });
    
    document.getElementById('bookingForm').addEventListener('submit', (e) => {
        e.preventDefault();
        handleBooking();
    });
    
    // Кнопка OK в сообщении об успехе
    document.getElementById('okBtn').addEventListener('click', () => {
        document.getElementById('successMessage').classList.remove('show');
        document.getElementById('bookingModal').classList.remove('show');
        matchedHotel = null;
    });
    
    // Закрытие модальных окон при клике вне их
    document.getElementById('matchOverlay').addEventListener('click', (e) => {
        if (e.target.id === 'matchOverlay') {
            document.getElementById('matchOverlay').classList.remove('show');
        }
    });
    
    document.getElementById('bookingModal').addEventListener('click', (e) => {
        if (e.target.id === 'bookingModal') {
            document.getElementById('bookingModal').classList.remove('show');
        }
    });
}

function showBookingModal() {
    const modal = document.getElementById('bookingModal');
    const hotelInfo = document.getElementById('bookingHotelInfo');
    
    hotelInfo.innerHTML = `
        <h3>${matchedHotel.name}</h3>
        <p>📍 ${matchedHotel.location}</p>
        <p><strong>${matchedHotel.price}</strong> / ночь</p>
    `;
    
    modal.classList.add('show');
}

function handleBooking() {
    const formData = {
        checkIn: document.getElementById('checkIn').value,
        checkOut: document.getElementById('checkOut').value,
        guests: document.getElementById('guests').value,
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        hotel: matchedHotel.name
    };
    
    // Здесь можно отправить данные на сервер
    console.log('Бронирование:', formData);
    
    // Показываем сообщение об успехе
    document.getElementById('bookingModal').classList.remove('show');
    setTimeout(() => {
        document.getElementById('successMessage').classList.add('show');
    }, 300);
    
    // Очищаем форму
    document.getElementById('bookingForm').reset();
}

function setMinDate() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const checkIn = document.getElementById('checkIn');
    const checkOut = document.getElementById('checkOut');
    
    checkIn.min = tomorrow.toISOString().split('T')[0];
    checkOut.min = tomorrow.toISOString().split('T')[0];
    
    checkIn.addEventListener('change', () => {
        const checkInDate = new Date(checkIn.value);
        const minCheckOut = new Date(checkInDate);
        minCheckOut.setDate(minCheckOut.getDate() + 1);
        checkOut.min = minCheckOut.toISOString().split('T')[0];
        
        if (checkOut.value && new Date(checkOut.value) <= checkInDate) {
            checkOut.value = '';
        }
    });
}
