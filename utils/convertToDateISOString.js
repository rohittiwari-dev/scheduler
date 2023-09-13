function convertToDateISOString(dateInput) {
    const [day, month, year] = dateInput.split('/').map(Number);

    const adjustedYear = year < 100 ? (year < 50 ? 2000 + year : 1900 + year) : year;

    const dateObj = new Date(Date.UTC(adjustedYear, month - 1, day, 0, 0, 0));
    return dateObj.toISOString().split('T')[0];
}

export default convertToDateISOString;