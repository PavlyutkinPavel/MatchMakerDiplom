/**
 * Утилиты для работы с датами
 */

/**
 * Конвертирует строку даты в ISO формат (YYYY-MM-DDTHH:mm:ss.sssZ)
 * @param {string|Date} dateInput - Строка даты или объект Date
 * @returns {string|null} Дата в ISO формате или null при ошибке
 */
export const toISOString = (dateInput) => {
  if (!dateInput) return null;
  
  try {
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    return isNaN(date.getTime()) ? null : date.toISOString();
  } catch (error) {
    console.error('Date conversion error:', error);
    return null;
  }
};

/**
 * Форматирует ISO строку в человекочитаемый вид (DD.MM.YYYY HH:mm)
 * @param {string} isoString - Дата в ISO формате
 * @returns {string} Отформатированная строка даты
 */
export const fromISOToLocal = (isoString) => {
  if (!isoString) return '';
  
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '';

    const pad = (num) => num.toString().padStart(2, '0');
    
    return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
  } catch (error) {
    console.error('Date formatting error:', error);
    return '';
  }
};