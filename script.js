$(function () {
    // write todays date
    writeCurrentDate();
    // set classes based on time
    setClasses();
    // set event listeners for save button click events
    setListeners();
    // clear out local storage from previous day(s) so we don't load old data
    clearLocalStorage();
    // set the text for each time block if any exists
    setText();
});

function writeCurrentDate(){
  let $currentDay = document.getElementById('currentDay');
  let day = dayjs().format('dddd');
  let month = dayjs().format('MMMM');
  let date = dayjs().format('DD');
  $currentDay.innerText = `${day}, ${month} ${date}`;
}

function getTimeStamp(){
  const currentDay = dayjs().day();
  const currentMonth = dayjs().month();
  const currentYear = dayjs().year();

  return `${currentDay}${currentMonth}${currentYear}`;
}

function setListeners(){
  const saveBtns = document.querySelectorAll('.saveBtn');
  saveBtns.forEach((btn) => {
    btn.addEventListener('click', (event) => {
      onSaveClick(event);
    });
  });
}

function onSaveClick(event){
  const textAreaValue = event.target.parentElement.querySelector('textarea').value;
  const timeBlockParent = event.target.closest('.time-block');
  const timeBlockId = timeBlockParent.id;
  localStorage.setItem(`${timeBlockId.split('hour-')[1]}-${getTimeStamp()}`, textAreaValue);
}

function setClasses(){
  let currentHour = dayjs().hour();
  let $timeBlocks = document.getElementsByClassName('time-block');
  for(let i=0;i<$timeBlocks.length;i++){
    let $timeBlock = $timeBlocks[i];
    let id = $timeBlock.id;
    let h = parseInt(id.split("-")[1]);
    if (h < currentHour) {
      $timeBlock.classList.add('past');
    } else if (h === currentHour) {
      $timeBlock.classList.add('present');
    } else {
      $timeBlock.classList.add('future');
    }
  }
}

function clearLocalStorage(){
  let timeStamp = getTimeStamp();
  clearLocalStorageExceptPattern(`-${timeStamp}`);
}

function setText(){
  const timeStamp = getTimeStamp();
  const $timeBlocks = document.querySelectorAll('.time-block');
  //convert the map to a traditional for loop
  for (let i = 0; i < $timeBlocks.length; i++){
    let $timeBlock = $timeBlocks[i];
    let id = $timeBlock.id;
    let hour = parseInt(id.split('-')[1]);
    let savedText = localStorage.getItem(`${hour}-${timeStamp}`);
    $timeBlock.querySelector('textarea').value = savedText || '';
  }
}

function clearLocalStorageExceptPattern(pattern) {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key.endsWith(pattern)) {
      localStorage.removeItem(key);
    }
  }
}