// Function to get the value of an input by its ID
const getDataValue = (id) => document.getElementById(id).value;
const getElementId = (id) => document.getElementById(id);

const convertDecimalHoursToHM = (decimalHours) => {
    const hours = Math.floor(decimalHours);
    const minutes = Math.round((decimalHours - hours) * 60);
    return `${hours} hour/s ${minutes} minute/s`;
};

// Function to calculate the number of days between two dates
const calculateResult = () => {
    const startDate = new Date(getDataValue('Start'));
    const endDate = new Date(getDataValue('End'));
    const isExcluded = document.getElementById('excludeSaturday').checked;
    const hoursToAccomplish = getDataValue('time'); // Fixed hours



    // Check if the dates are valid
    if (isNaN(startDate) || isNaN(endDate)) {
        displayError('Invalid date format. Please use YYYY-MM-DD.');
        return;
    }

    if(hoursToAccomplish <= 0){
        displayError('Enter your work hours needed to accomplish.');
        return;
    }

    let totalWorkingHours = 0;
    let presentDaysCount = 0;

    for (let currentDate = new Date(startDate); currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
        const dayOfWeek = currentDate.getDay();
        if (dayOfWeek === 0) {
            console.log(`Skipping Sunday: ${currentDate.toDateString()}`);
            continue; // Skip Sundays
        } else if (dayOfWeek === 6 && isExcluded) {
            totalWorkingHours += 4; // Half hours for Saturday
            continue;
        } else {
            totalWorkingHours += 8; // Whole hours for weekdays
            presentDaysCount++;
        }
    }

    const absentWeekdays = Number(getElementId('absentWeekdays').value);
    const absentSaturdays = Number(getElementId('absentSaturday').value);
    const lateMinutes = Number(getElementId('late').value);

    if (absentWeekdays < 0 || absentSaturdays < 0 || lateMinutes < 0) {
        displayError('Please do not use negative numbers. Thank you :)');
        return;
    }

    let effectiveHoursPresent = totalWorkingHours - (absentWeekdays * 8);
    let effectiveDaysPresent = presentDaysCount - absentWeekdays;

    if (!isExcluded) {
        effectiveHoursPresent -= (absentSaturdays / 2) * 8; // Adjust for absent Saturdays
        effectiveDaysPresent -= absentSaturdays;
    }

    effectiveHoursPresent -= (lateMinutes / 60); // Convert late minutes to hours
    let daysNeeded = 0;
    let finalDate = new Date();
    for(let start = new Date(startDate), hoursNeeded = 0; hoursNeeded < hoursToAccomplish; start.setDate(start.getDate() + 1)){
        if (start.getDay() === 0) {
            continue; // Skip Sundays
        } else if (start.getDay() === 6 && isExcluded) {
            hoursNeeded += 4; // Half hours for Saturday
            daysNeeded++;
            continue;
        } else {
            hoursNeeded += 8; // Whole hours for weekdays
            daysNeeded++;
        }
        finalDate = new Date(start);
    }
    finalDate = new Date(finalDate.setDate(finalDate.getDate() + absentWeekdays + 1));
    if(!isExcluded){
            finalDate = new Date(finalDate.setDate(finalDate.getDate() + (absentSaturdays / 2) + 1));
        }
    

    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = finalDate.toLocaleDateString('en-US', options);

    displayResults(effectiveHoursPresent, effectiveDaysPresent, absentWeekdays + absentSaturdays, hoursToAccomplish, daysNeeded, formattedDate);
};

const displayError = (message) => {
    const errorHandler = getElementId('errorHandler');
    errorHandler.style.textAlign = 'center';
    errorHandler.style.color = 'red';
    errorHandler.innerText = message;
};

const displayResults = (hoursPresent, daysPresent, totalAbsents, hoursToAccomplish, daysNeeded, formattedDate) => {
    const totalHoursLeft = hoursToAccomplish - hoursPresent;
    getElementId('errorHandler').innerText = '';
    getElementId('startToEnd').innerHTML = `Overall Results:`;
    getElementId('result').innerHTML = `
        <li class="display-flex">No. of Hours Accomplished: <i><b>${convertDecimalHoursToHM(hoursPresent.toFixed(2))}</b></i></li>
        <li class="display-flex">No. of Days Accomplished: <i><b>${daysPresent} day/s</b></i></li>
        <li class="display-flex">No. of Absents: <i><b>${totalAbsents === 0 ? "None" : totalAbsents + " day/s"}</b></i></li>
        <li class="display-flex">No. of Hours Needed to Accomplish: <i><b>${hoursToAccomplish} hour/s</b></i></li>
        <li class="display-flex">No. of Hours Left to Accomplish: <i><b>${convertDecimalHoursToHM(totalHoursLeft.toFixed(2))}</b></i></li>
        <li class="display-flex">No. of Days to Accomplish: <i><b>${daysNeeded} day/s</b></i></li>
        <li class="display-flex">Expected Date to Finish: <i><b>${formattedDate}</b></i></li>
    
    `;
};

// Add event listener to the submit button
document.getElementById('submit').addEventListener('click', calculateResult);
