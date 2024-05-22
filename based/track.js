
function main(){

  const shouldTrackText = get('shouldTrack', "true");
  let shouldTrack = (shouldTrackText === "true");

  const url = window.location.href;

  if (url.startsWith('file://')) {
    console.log('[Local file, not tracking]');
    return;
  }

  if(shouldTrack){
    const currentDateTimeString = getCurrentDateTimeString();

    // if url is a local file, don't track

    console.log('Hello, Firebase!');
    const db = firebase.database();
    // make the databse a list and just push each time a person views a page to the list a string
  
    const ref = db.ref('views');
    const visitRef = ref.push();
    visitRef.set({
      url: url,
      dateTime: currentDateTimeString,
    });

  }else{
    console.log('...');
  }
}








// const playersRef = db.ref('players');
// const playerRef = playersRef.push();
// const playerKey = playerRef.key;
// playerRef.onDisconnect().remove();










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







document.addEventListener('DOMContentLoaded', main);