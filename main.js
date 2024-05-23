// console.log("main.js loaded");


function getLinkElement(link) {
    return "<a href='" + link + "' target='_blank'>" + link + "</a>";
}




function getOrganizerProfileImagePath(index){
    //the path is the name but no spaces and no special characters
   
    const onganizerImage = eventsJson[index].organizer.image;
    if(onganizerImage){
        return `images/profiles/${onganizerImage}`;
    }else{
        const organizerName = eventsJson[index].organizer.name;
        const organizerPath = organizerName.replace(/[^a-zA-Z0-9]/g, '');
        const organizerProfileImagePath = `Organizers/${organizerPath}/profile.png`;
        return organizerProfileImagePath;
    }
}

function calculateDayNameFromDateString(dateString){
    const date = new Date(dateString);
    const dayName = date.toLocaleString('de-DE', { weekday: 'long' });
    return dayName;
}

function calculateTimeEnd(startTime, duration) {

    const minutesNumberString = duration.match(/\d+/)[0];  //"133 Min." => 133
    const minutesToAdd = parseInt(minutesNumberString);

    const [hours, minutes] = startTime.split(':').map(Number); //"19:30" => [19,30]
    const totalMinutes = hours * 60 + minutes + minutesToAdd;
    const newHours = Math.floor(totalMinutes / 60);
    const newMinutes = totalMinutes % 60;
    const formattedTime = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
    return formattedTime; // "21:43"
}


function getTimeStringCurrentLanguage(timeString) {
    if (CURRENT_LANGUAGE === "de") {
        return timeString;
    } else if (CURRENT_LANGUAGE === "en") {
        return convertTimeToEnglish(timeString);
    }
    
}
function convertTimeToEnglish(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    const ampm = hours >= 12 ? 'pm' : 'am';
    const newHours = hours % 12 || 12;
    return `${newHours}:${String(minutes).padStart(2, '0')} ${ampm}`;
}

function getMyTimeEntryString(index) {
    let event = eventsJson[index];
    if (event.timeEntry) {
        const timeEntry = getTimeStringCurrentLanguage(event.timeEntry);
        const timeEntryText = `🚪 ${timeEntry}`;
        return timeEntryText;
    } else {
        return "";
    }  
}

function getMyTimeString(index) {
    let event = eventsJson[index];
    let myTimeString = "⏱️ ";
    const startTimeText = getTimeStringCurrentLanguage(event.timeStart);
    myTimeString += startTimeText;

    if (event.timeEnd) {
        timeEnd = " - " + event.timeEnd;
        const timeEndText = getTimeStringCurrentLanguage(event.timeEnd);
        myTimeString += " - " + timeEndText;
    } else if (event.timeStart && event.duration) {
        const calculatedTimeEnd = calculateTimeEnd(event.timeStart, event.duration);
        const calculatedTimeEndText = getTimeStringCurrentLanguage(calculatedTimeEnd);
        myTimeString += " - " + calculatedTimeEndText;
    }
    return myTimeString;

}



// localStorage.clear();

function loadLanguage(){
    const language = localStorage.getItem('language');
    // console.log(language);
    if (language === null || language === undefined) {
        // console.log('language is null');
        return getNaviagatorLanguage();
    } else {
        return language;
    }
}


let CURRENT_LANGUAGE = loadLanguage();
// console.log("getLanguage() loaded:", CURRENT_LANGUAGE);

function setLanguage(language){
    CURRENT_LANGUAGE = language;
    localStorage.setItem('language', language);
}


function getLanguage(){
    return CURRENT_LANGUAGE;
}

function getNaviagatorLanguage(){
    const nav = navigator.language || navigator.userLanguage;
    // console.log(nav);

    if(nav.includes('de')){
        return 'de';
    }else{
        return 'en';
    }
}






function getDayName(dateString, language) {

    const dateParts = dateString.split(".");
    const day = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1; // Months are zero-based in JavaScript
    const year = parseInt(dateParts[2]);

    const date = new Date(year, month, day);
    const dayIndex = date.getDay();

    switch (language) {
        case "en":
            return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][dayIndex];
        case "de":
            return ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"][dayIndex];
        case "es":
            return ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"][dayIndex];
        default:
            return "Invalid language";
    }
}


function dateToString(date) {
    const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if needed
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    // return `${day}.${month}.${year}`;
    return `${day}.${month}.${year}`;
}

function calculateNextDate(dayNumber) {


    var today = new Date();
    var dayOfWeek = today.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
    var daysUntilTuesday = dayNumber - dayOfWeek; // Tuesday is 2 days after Monday

    

    // if (daysUntilTuesday <= 0) {
    //     daysUntilTuesday += 7; // If today is Tuesday or later in the week, add 7 days to get to the next Tuesday

    // }

    var nextDate = new Date(today);
    nextDate.setDate(today.getDate() + daysUntilTuesday + 7);

    // console.log("dayNumber:",dayNumber,"nextDate:",nextDate)
    return nextDate;
}


function calculateDates(calculateString){

    let dateStringList = [];
    let nextDateString = ''
        var numberStr = calculateString.split(":")[1]; // Splitting the string and getting the part after the colon
        const calculateMultipleDates = numberStr.includes(',')
        if (calculateMultipleDates) {
            const nextDateStrings = numberStr.split(',').map(function (numberText) {
                var number = parseInt(numberText);
                return calculateNextDate(number);
            });

            dateStringList = nextDateStrings;
           
        } else {
            var number = parseInt(numberStr);
            nextDateString = calculateNextDate(number);
            dateStringList = [nextDateString];
        }

        return dateStringList;   
}

function stringToDate(str) {
    const dateRegex = /\b(\d{2}\.\d{2}\.\d{4})\b/;
    const foundDateString = dateRegex.exec(str)[1]; //15.05.2024
    var parts = foundDateString.split(".");
    var day = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10) - 1; // Months are zero-indexed in JavaScript Date objects
    var year = parseInt(parts[2], 10);
    var date = new Date(year, month, day);

    return date    
}

function calculateDateInfo(dateString){
    const toReturn = {};    
    let dates = [];
    if(dateString.startsWith("calculate:")){
        dates = calculateDates(dateString);  
        toReturn["weekly"] = true;
    }else{
        const date = stringToDate(dateString);
        dates = [date];
    }


    let dateText = "";

    for (let i = 0; i < dates.length; i++) {
        const date = dates[i];
        let dateString = dateToString(date);

       if (i > 0) {
            dateText += " ";
            // dateText += ", ";
        }

        dateText += getDayName(dateString, CURRENT_LANGUAGE);
        dateText += " ";
        dateText += dateString;


    }

    toReturn["date"] = dates[0];
    toReturn["dateString"] = dateToString(dates[0]);
    toReturn["dateText"] = dateText;
    // toReturn['name'] = getDayName(dateString, "en")



    return toReturn;
}







function getImages(eventID){

    const event = eventsJson[eventID];

    let imagePaths = [];

    if(event.images){

        if (event.images.length > 0) {
            imagePaths = event.images.map(image => `images/${eventID}/${image}`);
        }else{
            imagePaths.push("images/icons/quest.jpg");
        }

       
    }else if(event.imagePaths){
        if (event.folder) {
            console.log("event.folder:", `images/${event.folder}/`)
            imagePaths = event.imagePaths.map(image => `images/${event.folder}/${image}`);
        } else {
            imagePaths = event.imagePaths.map(image => `images/path/${image}`);
        }
    }
    
    console.log("imagePaths:",imagePaths)
    


    // console.log("imagePaths:",imagePaths)
    

    // return images.map(image => "<img src='images/" + eventID + "/" + image + "' alt='img'>").join('');
    return imagePaths


}










// const followStateJsonText = localStorage.getItem('followStateJson');
// const followStateJson = followStateJsonText ? JSON.parse(followStateJsonText) : {};
// const followState = followStateJson[eventID] ? followStateJson[eventID] : 'unfollowed';

// if (followState == 'followed') {
//     followStateJson[eventID] = 'unfollowed';

//     // localStorage.setItem('followState', 'unfollowed');
//     document.getElementById('followBtn').innerHTML = "Follow";
//     document.body.style.backgroundColor = "white";
// }
// else {
//     followStateJson[eventID] = 'followed';
//     // localStorage.setItem('followState', 'followed');
//     document.getElementById('followBtn').innerHTML = "Unfollow";
//     document.body.style.backgroundColor = "rgba(0, 0, 255, 0.1)";
// }

// localStorage.setItem('followStateJson', JSON.stringify(followStateJson));

function setFollowedState(eventID, isFollowed){
    const followStateJson = getFollowedStateJson();
    followStateJson[eventID] = isFollowed ? 'followed' : 'unfollowed';
    localStorage.setItem('followStateJson', JSON.stringify(followStateJson));

    console.log(`Event ${eventID} is : ${followStateJson[eventID]}`);
}


function getFollowedStateJson(){
    const followStateJsonText = localStorage.getItem('followStateJson');
    return followStateJsonText ? JSON.parse(followStateJsonText) : {};
}

function hasFollowedThisEvent(eventID){
    const followStateJson = getFollowedStateJson();
    const followState = followStateJson[eventID] ? followStateJson[eventID] : 'unfollowed';
    const isFollowed = followState == 'followed';
    if(isFollowed){
        console.log(`Event ${eventID} is : ${followState}`);
    }
    return isFollowed;
}




function calculateDateTime(eventID) {
    const event = eventsJson[eventID];
    const dateInfo = calculateDateInfo(event.date);
    const date = dateInfo["date"];
    const startTimeString = getMyTimeString(eventID);

    const [hours, minutes] = startTimeString.split(':').map(Number); //"19:30" => [19,30]
    const totalMinutes = hours * 60 + minutes + minutesToAdd;
    const newHours = Math.floor(totalMinutes / 60);
    const newMinutes = totalMinutes % 60;

    const newDateWithTime = new Date(date);
    newDateWithTime.setHours(newHours);
    newDateWithTime.setMinutes(newMinutes);

    console.log("date:",date,"newDateWithTime:", newDateWithTime);
    return newDateWithTime;    
}

function calculateEndTime(eventID){
    const event = eventsJson[eventID];
    let endTime = event.endTime;
    if (!endTime) {
        const timeStart = event.timeStart.split(':');
        const hours = parseInt(timeStart[0]) + 2;
        endTime = `${hours}:${timeStart[1]}`;

    }
}