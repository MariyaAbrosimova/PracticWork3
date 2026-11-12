const stickerInput = document.getElementById('stickerInput');
const addBtn = document.getElementById('addBtn');
const stickerPool = document.getElementById('stickerPool');
const board = document.getElementById('board');
const clearPoolBtn = document.getElementById('clearPoolBtn');
const clearBoardBtn = document.getElementById('clearBoardBtn');

let draggedSticker = null;
let offsetX = 0;
let offsetY = 0;
let zIndexCounter = 1;

// Создание стикера
function createSticker() {
    const text = stickerInput.value.trim();
    if (text === '') {
        alert('Введите текст стикера!');
        return;
    }

    const sticker = document.createElement('div');
    sticker.classList.add('sticker');
    sticker.draggable = true;

    const content = document.createElement('span');
    content.textContent = text;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '×';
    deleteBtn.classList.add('delete-sticker-btn');
    deleteBtn.title = 'Удалить стикер';

    deleteBtn.addEventListener('click', () => {
        sticker.remove();
    });

    // Начало перетаскивания (запоминаем, за какое место внутри стикера схватили)
    sticker.addEventListener('dragstart', (e) => {
        draggedSticker = sticker;
        const rect = sticker.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
    });

    sticker.addEventListener('dragend', () => {
        draggedSticker = null;
    });

    sticker.append(deleteBtn, content);
    stickerPool.append(sticker);

    stickerInput.value = '';
    stickerInput.focus();
}

// Разрешаем сброс на борд
board.addEventListener('dragover', (e) => {
    e.preventDefault();
});

// Сброс стикера в произвольную точку борда
board.addEventListener('drop', (e) => {
    e.preventDefault();
    if (!draggedSticker) return;

    const boardRect = board.getBoundingClientRect();

    // Вычисляем координаты внутри борда с учетом смещения курсора
    let x = e.clientX - boardRect.left - offsetX;
    let y = e.clientY - boardRect.top - offsetY;

    // Не даем стикеру вылететь за границы борда
    const maxX = board.clientWidth - draggedSticker.offsetWidth;
    const maxY = board.clientHeight - draggedSticker.offsetHeight;
    x = Math.max(0, Math.min(x, maxX));
    y = Math.max(0, Math.min(y, maxY));

    board.append(draggedSticker);
    draggedSticker.style.left = `${x}px`;
    draggedSticker.style.top = `${y}px`;
    draggedSticker.style.zIndex = ++zIndexCounter; // последний перетащенный поверх остальных
});

// Кнопки добавления и очистки
addBtn.addEventListener('click', createSticker);

stickerInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        createSticker();
    }
});

clearPoolBtn.addEventListener('click', () => {
    stickerPool.innerHTML = '';
});

clearBoardBtn.addEventListener('click', () => {
    board.innerHTML = '';
});