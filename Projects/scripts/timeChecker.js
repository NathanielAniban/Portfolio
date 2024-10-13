const getData = (id) => document.getElementById(id);

const submit = () => {
    const startDate = new Date(getData('startDate').value);
    const endDate = new Date(getData('endDate').value);
    const weekDaysLate = Number(getData('weekDaysLate').value);
    const saturdayLate = Number(getData('saturdayLate').value);
    const weekdaysAbsent = Number(getData('weekDaysAbsents').value);
    const saturdayAbsent = Number(getData('saturdayAbsents').value);
    const isExcluded = getData('saturdayExcluded').checked;

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    let daysCount = 0;
    let totalHoursAccomplished = 0;
    let currentDate = startDate;

    while (currentDate < endDate) {
        const day = currentDate.getDay();

        // Skip Sunday
        if (day === 0) {
            currentDate.setDate(currentDate.getDate() + 1);
            continue;
        } 

        if (day === 6 && !isExcluded) { // Saturday
            totalHoursAccomplished += 4;
        } else { // Weekdays (Monday to Friday)
            totalHoursAccomplished += 8;
        }

        daysCount++;
        currentDate.setDate(currentDate.getDate() + 1);
    }

    const totalHoursOfAbsents = !isExcluded ? (weekdaysAbsent * 8) + (saturdayAbsent * 4) : weekdaysAbsent * 8;
    const totalMinutesOfLate = !isExcluded ? weekDaysLate + saturdayLate : weekDaysLate;
    const minutesToFloat = totalMinutesOfLate / 60;

   if(startDate > endDate){
    getData('errorHandler').innerText = 'Error 2: Start date must be before end date.';
    return;
   }

   if(getData('startDate').value == '' || getData('endDate').value == ''){
        getData('errorHandler').innerText = 'Error: Date must not be empty.';
        return;
   }

    const Result = getData('result');
    const totalHoursToAccomplish = 486;
    const monthNames = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
    ];

    const boldItalic = (data) => `<b><i>${data}</b></i>`;

    const incrementTime = (floatHours, integerMinutes) => {
        const totalMinutes = (floatHours * 60) + integerMinutes;
        const hours = Math.floor(totalMinutes / 60);
        const minutes = Math.floor(totalMinutes % 60);
        return `${Math.max(hours, 0)} hours, ${Math.max(minutes, 0)} minutes`;
    };

    const decrementTime = (floatHours, integerMinutes) => {
        const totalMinutes = (floatHours * 60) - integerMinutes;
        const hours = Math.floor(totalMinutes / 60);
        const minutes = Math.floor(totalMinutes % 60);
        return `${Math.max(hours, 0)} hours, ${Math.max(minutes, 0)} minutes`;
    };

    Result.innerHTML = `
        <p class="text-center" style="margin-bottom: 1rem">Results: From ${boldItalic(String(getData('startDate').value))} To ${boldItalic(String(getData('endDate').value))}</p>
        <ul class="display-grid">
            <li>
                <span>Total Presents: </span>
                <span>${boldItalic((!isExcluded ? daysCount - (weekdaysAbsent + saturdayAbsent) : daysCount - weekdaysAbsent) + ' day/s')}</span>
            </li>
            <li>
                <span>Total Absents: </span>
                <span>${boldItalic((!isExcluded ? weekdaysAbsent + saturdayAbsent : weekdaysAbsent) + ' day/s')}</span>
            </li>
            <li>
                <span>Number of Days Passed: </span>
                <span>${boldItalic(daysCount + ' day/s')}</span>
            </li>
            <li>
                <span>Total Lates: </span>
                <span>${boldItalic((!isExcluded ? weekDaysLate + saturdayLate : weekDaysLate) + ' minute/s')}</span>
            </li>
            <li>
                <span>Total Hours Accomplished: </span>
                <span>${boldItalic(decrementTime(totalHoursAccomplished, totalHoursOfAbsents + totalMinutesOfLate))}</span>
            </li>
            <li>
                <span>Total Hours Left: </span>
                <span>${boldItalic(incrementTime(totalHoursToAccomplish - totalHoursAccomplished, totalHoursOfAbsents + totalMinutesOfLate))}</span>
            </li>
        </ul>
    `;
};

const reset = () => {
    getData('startDate').value = '';
    getData('endDate').value = '';
    getData('weekDaysLate').value = 0;
    getData('saturdayLate').value = 0;
    getData('weekDaysAbsents').value = 0;
    getData('saturdayAbsents').value = 0;
    getData('saturdayExcluded').checked = false;
    getData('result').innerHTML = '';
    getData('errorHandler').innerText = '';
}