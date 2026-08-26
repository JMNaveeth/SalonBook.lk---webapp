/**
 * Helper utilities for dates and time slot generation
 */

// Generate standard 30-min or 60-min time slots between open & close hours (e.g., 09:00 to 18:00)
const generateDailyTimeSlots = (openTime = '09:00', closeTime = '18:00', intervalMins = 30) => {
  const slots = [];
  let [currentHour, currentMin] = openTime.split(':').map(Number);
  const [endHour, endMin] = closeTime.split(':').map(Number);

  const startTotal = currentHour * 60 + currentMin;
  const endTotal = endHour * 60 + endMin;

  for (let mins = startTotal; mins < endTotal; mins += intervalMins) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    const timeString = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`;
    slots.push(timeString);
  }

  return slots;
};

// Check if a date string YYYY-MM-DD is valid
const isValidDateString = (dateStr) => {
  return !isNaN(Date.parse(dateStr));
};

module.exports = {
  generateDailyTimeSlots,
  isValidDateString,
};
