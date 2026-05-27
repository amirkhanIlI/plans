const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');

// Загрузка данных или дефолтный список, если памяти нет
let tasks = JSON.parse(localStorage.getItem('my-todo-list')) || [
    { start: "15:00", end: "16:00", text: "Зал" },
    { start: "16:00", end: "17:00", text: "Бассейн" },
    { start: "18:00", end: "19:00", text: "Английский" },
    { start: "20:00", end: "21:00", text: "Бег" }
];

// Функция отрисовки списка
function renderTasks() {
    todoList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.dataset.index = index;
        
        li.innerHTML = `
            <div class="time-section">
                <div class="time-picker-wrapper">
                    <span class="time-text">${task.start}</span>
                    <input type="time" class="time-input" value="${task.start}" onchange="updateTime(${index}, 'start', this.value)">
                </div>
                <span class="time-separator">-</span>
                <div class="time-picker-wrapper">
                    <span class="time-text">${task.end}</span>
                    <input type="time" class="time-input" value="${task.end}" onchange="updateTime(${index}, 'end', this.value)">
                </div>
            </div>
            
            <div class="text-section">
                <input type="text" class="task-text" value="${task.text}" onchange="updateText(${index}, this.value)" onblur="updateText(${index}, this.value)">
            </div>
            
            <button class="delete-btn" onclick="deleteTask(${index})">✕</button>
        `;
        todoList.appendChild(li);
    });
}

// Сохранение в LocalStorage
function saveToStorage() {
    localStorage.setItem('my-todo-list', JSON.stringify(tasks));
}

// Добавление новой строки
function addTask() {
    const text = input.value.trim();
    if (text !== '') {
        tasks.push({
            start: "12:00",
            end: "13:00",
            text: text
        });
        input.value = '';
        saveToStorage();
        renderTasks();
    }
}

// Обновление времени
window.updateTime = function(index, type, value) {
    if(value) {
        tasks[index][type] = value;
        saveToStorage();
        renderTasks(); // Перерисовываем, чтобы обновить видимый текстовый таймстамп
    }
};

// Обновление текста при изменении
window.updateText = function(index, value) {
    tasks[index].text = value.trim();
    saveToStorage();
};

// Удаление задачи
window.deleteTask = function(index) {
    tasks.splice(index, 1);
    saveToStorage();
    renderTasks();
};

// Слушатели для ввода нового пункта
addBtn.addEventListener('click', addTask);
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

// Инициализация плавного Sortable
new Sortable(todoList, {
    animation: 280,            // Сделали анимацию перемещения более плавной и мягкой (было 150)
    delay: 50,                 // Небольшая задержка перед перетаскиванием, чтобы случайно не дергать при кликах
    delayOnTouchOnly: true,    // Задержка активна только на экранах телефонов
    ghostClass: 'sortable-ghost',
    chosenClass: 'sortable-chosen',
    handle: '.time-section, .text-section', // Тянуть можно за любую часть, кроме крестика
    filter: 'input',           // Запрещаем тащить, когда фокус внутри ввода текста
    preventOnFilter: false,
    onEnd: function () {
        // Выстраиваем новый массив по актуальному порядку элементов на экране
        const currentLis = todoList.querySelectorAll('li');
        const updatedTasks = [];
        currentLis.forEach(li => {
            const index = li.dataset.index;
            // Собираем актуальные данные прямо с экрана на случай, если фокус не потерялся
            const start = li.querySelectorAll('.time-text')[0].innerText;
            const end = li.querySelectorAll('.time-text')[1].innerText;
            const text = li.querySelector('.task-text').value;
            updatedTasks.push({ start, end, text });
        });
        tasks = updatedTasks;
        saveToStorage(); // Сохраняем измененный порядок
        renderTasks();   // Обновляем индексы в дата-атрибутах
    }
});

// Первая отрисовка
renderTasks();
