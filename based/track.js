
function main(){

  const shouldTrackText = get('shouldTrack', "true");
  let shouldTrack = (shouldTrackText === "true");

  const url = window.location.href;

  const isLocalFile = url.startsWith('file://');


  const currentDateTimeString = getCurrentDateTimeString();


  if(shouldTrack && !isLocalFile){
   
    console.log('+');
    const ref = db.ref('views');
    const visitRef = ref.push();
    visitRef.set({
      url: url,
      dateTime: currentDateTimeString,
    });
  }else{
    console.log('.');
  }

  const browser = navigator.userAgent;



  const lastVisit = localStorage.getItem('lastVisit');

  const uniqueUsersRef = db.ref('uniqueUsers');
  const uniqueUserRef = uniqueUsersRef.push();
  const uniqueUsersEachDayRef = db.ref('uniqueUsersEachDay');
  const uniqueUsersEachDay = uniqueUsersEachDayRef.push(lastVisit);
 

  const isNewUser = (lastVisit == null);



  if (isNewUser) {
    // console.log('First visit:', currentDateTimeString);
    uniqueUserRef.set({
      url:url,
      dateTime: currentDateTimeString,
      browser: browser,
    });
  }else{
    const todayDate = currentDateTimeString.split(' ')[0];
    const lastVisitDate = lastVisit.split(' ')[0];
    const firstVisitToday = (todayDate !== lastVisitDate);


    if (firstVisitToday){
      // console.log('First Visited today:', currentDateTimeString);
      uniqueUserRef.set({
        url: url,
        dateTime: currentDateTimeString,
        browser: browser,
      });

    }else{
      // console.log('Already visited today:', currentDateTimeString);
    }
  }


  if (lastVisit) {
    console.log('Last visit was at:', currentDateTimeString);
    // uniqueUsersEachDay.set
    uniqueUsersEachDay.set({
      url:url,
      dateTime: lastVisit,
      browser: browser,
    });

  } 





  localStorage.setItem('lastVisit', currentDateTimeString);









  const liveRightNowRef = db.ref('liveRightNow');
  const liveRightNow = liveRightNowRef.push();
  liveRightNow.set({url:url, startedAt: currentDateTimeString, browser: browser});
  liveRightNow.onDisconnect().remove();



  // const datesRef = db.ref('dates');
  // // datesRef.set([currentDateTimeString])

  // // get dates list from db
  // datesRef.once('value', (snapshot) => {
  //   const dates = snapshot.val();
  //   // console.log('dates:', dates);

  //   const dateDay = currentDateTimeString.split(' ')[0];
  //   // console.log("dateDay:", dateDay);
  //   // add current date if not exists
  //   if (!dates.includes(dateDay)){
     
  //   }
  // });


  //add if not exists already
  // dateRef.set(currentDateTimeString);


loadDatabase();


}




function loadDatabase() {
  console.log('Load usersValues');

    const usersDatabase = db.ref('users');
    usersDatabase.once('value', (snapshot) => {
    let usersValues = snapshot.val()||{};

    const userCount = Object.keys(usersValues).length;
    let userID = getuserID();
    // console.log('User ID:', userID);  
    if (!userID){
      userID = `(${userCount})${getCurrentDateTimeString()}`;
      // userID = "hi"
      // console.log('User ID:', userID);
      userID = userID.replace(/[/]/g, '-');    //replace / with with -
      userID = userID.replace(/ /g, '');    //remove all spaces
      setuserID(userID);
      // console.log('User ID:', userID);
    }

    console.log('User ID:', userID);

    user = usersValues[userID]

    if (!user) {
      console.log('User does not exist, creating new user');
      localStorage.setItem('userID', userID);
      user = {
        userAgent: navigator.userAgent,
        joinedTime: getCurrentDateTimeString(),
        joinedUrl: window.location.href
      };
      usersValues[userID] = user;
    }

      views = user.views;
      if (!views) {
          views = {};
          user.views = views;
        }


        let dateTimeKey = getCurrentDateTimeString();
        dateTimeKey = dateTimeKey.replace(/[/]/g, '-');    //replace / with with -
        dateTimeKey = dateTimeKey.replace(/ /g, ''); 

        views[dateTimeKey] = window.location.href;
         



     
      usersDatabase.set(usersValues);

  });

}

function getuserID() {
    const userID = localStorage.getItem('userID');
    console.log('Get userID:', userID);
    return userID;
}
function setuserID(userID) {
    console.log('Set userID:', userID);
    localStorage.setItem('userID', userID);
}


function myDateToString(date) {
    let options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    };
    return date.toLocaleString('en-GB', options);
  }


function getCurrentDateTimeString() {
  let date = new Date();
  let options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  };
  return date.toLocaleString('en-GB', options);
}













///////////////////////////////////////

function get(key, defaultValue = 1) {
  const defaultValueIsNumber = (typeof defaultValue === 'number')
  const defaultValueIsArray = (defaultValue.constructor === [].constructor)
  const defaultValueIsObject = (defaultValue.constructor === ({}).constructor)
  let json = false;
  if ((defaultValueIsNumber == false) && (defaultValueIsArray || defaultValueIsObject)) {
    json = true;
  }
  const value = localStorage.getItem(key);
  if (value == null) {
    set(key, defaultValue, json);
    return defaultValue;
  } else if (defaultValueIsNumber) {
    return parseInt(value);
  } else if (json || defaultValueIsArray || defaultValueIsObject) {
    return JSON.parse(value);
  } else {
    return value;
  }
}
///////////////////////////////////////

function en(x) {
  let y = "";
  for (let i = 0; i < x.length; i++) {
    let charCode = x.charCodeAt(i) + 3 + (i % 2);
    y += String.fromCharCode(charCode);
  }
  return y;
}
function de(x) {
  let y = "";
  for (let i = 0; i < x.length; i++) {
    let charCode = x.charCodeAt(i) - 3 - (i % 2);
    y += String.fromCharCode(charCode);
  }
  return y;
}

let xf = "DM}eV}F{|RD]9ovEJToitI7eV~U6zLqrs9su:fj"
xf = de(xf);



const firebaseConfig = {
    apiKey: xf,
    authDomain: "fir-v10html.firebaseapp.com",
    databaseURL: "https://fir-v10html-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "fir-v10html",
    storageBucket: "fir-v10html.appspot.com",
    messagingSenderId: "399835574809",
    appId: "1:399835574809:web:a963ee301a890bf05a7088"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();






document.addEventListener('DOMContentLoaded', main);