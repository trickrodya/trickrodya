// Функция для форматирования числа с разделителями
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

// Синхронизация ползунка и поля ввода
const oborotInput = document.getElementById('oborot_v_mesyats');
const oborotSlider = document.getElementById('oborot_slider');
const sliderValue = document.querySelector('.slider-value');

// Обновление значения при изменении ползунка
oborotSlider.addEventListener('input', function() {
    const value = this.value;
    oborotInput.value = value;
    sliderValue.textContent = formatNumber(value) + ' ₽';
});

// Обновление ползунка при изменении поля ввода
oborotInput.addEventListener('input', function() {
    const value = Math.min(Math.max(parseInt(this.value) || 100000, 100000), 100000000);
    oborotSlider.value = value;
    sliderValue.textContent = formatNumber(value) + ' ₽';
    updateOborotMaybeRuble();
});

// Функция обновления значения в рублях для процента оборота
function updateOborotMaybeRuble() {
    const oborot = parseFloat(document.getElementById('oborot_v_mesyats').value) || 0;
    const percent = parseFloat(document.getElementById('oborot_maybe').value) || 0;
    const rubleValue = (oborot * percent) / 100;
    document.getElementById('oborot_maybe_ruble').textContent = formatNumber(rubleValue.toFixed(2)) + ' ₽';
}

// Добавляем слушатель для поля ввода процента
document.getElementById('oborot_maybe').addEventListener('input', updateOborotMaybeRuble);

document.getElementById('calcForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Получаем значения из полей ввода
    const oborot = parseFloat(document.getElementById('oborot_v_mesyats').value);
    const stavaBanka = parseFloat(document.getElementById('stava_banka').value);
    const stavaNetmonet = parseFloat(document.getElementById('stavaka_netmonet').value);
    const oborotMaybePercent = parseFloat(document.getElementById('oborot_maybe').value);
    
    // Проверяем, что все поля заполнены
    if (isNaN(oborot) || isNaN(stavaBanka) || isNaN(stavaNetmonet) || isNaN(oborotMaybePercent)) {
        document.getElementById('result').textContent = 'Пожалуйста, заполните все поля';
        return;
    }
    
    // Выполняем расчеты
    const var1 = oborot * (stavaBanka / 100) * (oborotMaybePercent / 100); // Комиссия банка с учетом процента оборота
    const var2 = oborot * (stavaNetmonet / 100) * (oborotMaybePercent / 100); // Комиссия нетмонет с учетом процента оборота
    const finalEconomy = var1 - var2; // Финальная экономия
    const yearlyEconomy = finalEconomy * 12; // Годовая экономия
    
    // Обновляем текст комиссии банка
    document.getElementById('bank-commission-label').textContent = `Комиссия банка за ${oborotMaybePercent}% от оборота`;
    
    // Обновляем текст комиссии нетмонет
    document.getElementById('netmonet-commission-label').textContent = `Комиссия нетмонет за ${oborotMaybePercent}% от оборота`;
    
    // Обновляем результаты
    document.getElementById('bank-commission').textContent = formatNumber(var1.toFixed(2)) + ' ₽';
    document.getElementById('netmonet-commission').textContent = formatNumber(var2.toFixed(2)) + ' ₽';
    document.getElementById('monthly-economy').textContent = formatNumber(finalEconomy.toFixed(2)) + ' ₽';
    document.getElementById('yearly-economy').textContent = formatNumber(yearlyEconomy.toFixed(2)) + ' ₽';
});

document.getElementById('developer-link').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('image-modal').classList.add('active');
});

// Закрытие модального окна при клике вне изображения
document.getElementById('image-modal').addEventListener('click', function(e) {
    if (e.target === this) {
        this.classList.remove('active');
    }
}); 
