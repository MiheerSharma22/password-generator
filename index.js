let sliderValue = document.querySelector('#password-length');
let len = document.querySelector('.length-number');
let generatePass = document.querySelector('.generate');
let passDisplayArea = document.querySelector('[passwordDisplayArea]');
let copyBtn = document.querySelector('.copy');
let displayCopyMessage = document.querySelector('[copied-tooltip]')
let checkBoxesList = document.querySelectorAll('[checkboxes]')
let numOfCheckedBoxes = 0;
let passLen = 0;

let password = "";

function setPasswordLength() {
    len.textContent = sliderValue.value;
    passLen = sliderValue.value;
    // NEED TO UNDERSTAND BELOW 3 LINES
    // const min = sliderValue.min;
    // const max = sliderValue.max;
    // sliderValue.style.backgroundSize = ( (sliderValue.value - min))*100 / (max-min)  +"% 100%";
};
// show the default length of the slider
setPasswordLength();

async function handleCopyEvent() {
    try{
        await navigator.clipboard.writeText(passDisplayArea.value);

        displayCopyMessage.innerHTML = "Copied";
    }
    catch(err) {
        displayCopyMessage.innerHTML = "Failed";
    }

    displayCopyMessage.classList.add("active");
    setTimeout(() => {
        displayCopyMessage.classList.remove("active");
    }, 2000);
};
// event listener for the copy button
copyBtn.addEventListener('click', ()=>{
        if(passDisplayArea.value)
            handleCopyEvent();
});


// event Listener for SLIDER -> each time slider changes change the length in the display
sliderValue.addEventListener('input' , () => {setPasswordLength();});


// handling checkboxes
function findNumberOfCheckedBoxes() {
    numOfCheckedBoxes = 0;
    for(let i of checkBoxesList) {
        if(i.checked) {
            numOfCheckedBoxes++;
        }
    };
};

findNumberOfCheckedBoxes();


// event listeners for CHECK-BOXES , every time a box is checked/unchecked -> calculate number of checked boxes
for(let i of checkBoxesList) {
    i.addEventListener('change' , ()=> {findNumberOfCheckedBoxes()});
};


// return the uppercase characters  formula used is -> (max - min) + min , max+1 coz random funtion generates from 0 to n-1 not till n
function getUpperCase() {
    return String.fromCharCode(Math.floor( Math.random()*(91 - 65) + 65 )) ;
};


// return the lowercase characters  formula used is -> (max - min) + min
function getLowerCase() {
    return String.fromCharCode(Math.floor( Math.random()*(123 - 97) + 97 ));
};


// return a digit from 0 to 9
function getNumber(){
    return Math.floor(Math.random()*10);
};


// return a random symbol from a string of desired symbols
function getSymbols() {
    let symbols = `~!@#$%^&*()_-+={[}]|\:;<,>.?/`;
    let i = Math.floor(Math.random()* symbols.length)
    return symbols[i];
};

// shuffle the generated password                          (NEED TO UNDERSTAND THE BELOW LOGIC from line 73)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
  }

// event listener for GENERATE-PASSWORD BUTTON
generatePass.addEventListener('click' , ()=>{

    if(numOfCheckedBoxes >= 1) {
        // clearing the previously generated password (if any)
        password = "";

        setPasswordLength();

        // after every click on generate password check how many boxes are checked
        findNumberOfCheckedBoxes();

        // handling the least number of characters in the password , the ones ticked are added below
        for(let key of checkBoxesList) {
            if(key.checked) {
                if(key.id === "uppercase") {
                    password += getUpperCase();
                    passLen--;
                }

                if(key.id === "lowercase") {
                    password += getLowerCase();
                    passLen--;
                }

                if(key.id === "numbers") {
                    password += getNumber();
                    passLen--;
                }

                if(key.id === "symbols") {
                    password += getSymbols();
                    passLen--;
                }
            };
        }

        // handling the remaining length of the password to be generated
        let functionsList = [];
        if(checkBoxesList[0].checked)
            functionsList.push(getUpperCase);
        if(checkBoxesList[1].checked)
            functionsList.push(getLowerCase);
        if(checkBoxesList[2].checked)
            functionsList.push(getNumber);
        if(checkBoxesList[3].checked)
            functionsList.push(getSymbols);

        for(; passLen>0; passLen--){
            let funcToBeCalled = Math.floor(Math.random() * functionsList.length);
            password += functionsList[funcToBeCalled]();
        };

        // shuffling the generated password
        password = shuffleArray(Array.from(password));

        // displaying the generated password on the UI
        passDisplayArea.value = password;
    }
    
});