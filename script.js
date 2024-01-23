'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2023-11-22T23:36:17.929Z',
    '2023-11-24T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2023-10-14T14:43:26.374Z',
    '2023-11-21T18:49:59.371Z',
    '2023-11-25T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions
// console.log(account1.movementsDates);

const ganrateDate = (ISODate) => {
  const date = new Date(ISODate);
  const day = `${date.getDate()}`.padStart(2, 0);
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;

}



const daysCalc = ISODate =>{

  const date = new Date(ISODate);
  const currentDate = new Date();
  

  const daysPassed = Math.abs(Math.floor((+currentDate - +date)/(24 * 60 * 60 * 1000)));

  // console.log(daysPassed);
  
  if(daysPassed===0) return 'Today';
  if(daysPassed===1) return 'Yesterday';
  if(daysPassed<=7) return `${daysPassed} ago`;

  return ganrateDate(ISODate);

}

// daysCalc(new Date(2023, 10, 15 ));




const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    // const movDate = ganrateDate(acc.movementsDates[i]);
    const displayTime = daysCalc(acc.movementsDates[i]);
    
    


    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1
      } ${type}</div>
      <div class="movements__date">${displayTime}</div>
        <div class="movements__value">${mov}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

const startLogOutTimer = function(){
  // Set time to 5 min:
  let time = 600;

  const tick = ()=>{

    const min = `${Math.floor(time / 60)}`.padStart(2 ,0);
    const sec = `${time % 60}`.padStart(2, 0);


    // In each call, display time to UI:
    labelTimer.textContent = min + ':' + sec;

    

    // When 0 seconds, stop timer and log out user:
    if(time === 0) {
      currentAccount = '';
      containerApp.style.opacity = 0;
      clearInterval(timer);
    }

    // Decrese 1s:
    time--;
    
  };

  tick();


  // Call the timer every second:
  const timer =  setInterval(tick, 1000);

  return timer;

}



///////////////////////////////////////
// Event handlers
let currentAccount, timer;

// Fake login::
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;







btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  if(timer){
    clearInterval(timer);
  }
  timer = startLogOutTimer();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  // console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]
      }`;
    containerApp.style.opacity = 100;

    // Display Current Date:
    // const currentDate = new Date();
    // const day = `${currentDate.getDate()}`.padStart(2, 0);
    // const month = `${currentDate.getMonth() + 1}`.padStart(2, 0);
    // const year = currentDate.getFullYear();
    // const hour = `${currentDate.getHours()}`.padStart(2, 0);
    // const minute = `${currentDate.getMinutes()}`.padStart(2, 0);

    // labelDate.innerHTML = `${day}/${month}/${year},${hour}:${minute}`;

    // Internationaliztion API:


    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    const currentDate = new Date().toISOString();
    receiverAcc.movementsDates.push(currentDate);
    currentAccount.movementsDates.push(currentDate);


    // Update UI
    updateUI(currentAccount);

    if(timer){
      clearTimeout(timer);
      timer = startLogOutTimer();
    }

  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount);
    const currentDate = new Date().toISOString();
    // console.log(currentDate);
    currentAccount.movementsDates.push(currentDate);
    // console.log(currentAccount.movementsDates);
    // Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';

  if(timer){
    clearTimeout(timer);
    timer = startLogOutTimer();
  }

});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';

  
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES



// PRACTICE: DATE ::::

// const now = new Date();

// // Get Current Date:
// console.log("Current Date: ", now);


// // Create Date: 
// // year, month, day, hour, min, sec:
// // date is 0 based:
// console.log('Full Specific Date: ', new Date(2037, 10, 19, 15, 23, 5));

// // Adding wrong date will add up:
// console.log('Wrong Date: ', new Date(2023, 11, 32));

// // Get Specific Date:
// console.log("My Date: ",new Date('sep 15 1995 20:05:41'));
// console.log('New Year Date: ', new Date('31 dec, 2023'));

// // Get Account Date:
// console.log('Account Date: ',new Date(account1.movementsDates[0]));

// // Unix Time: JS starting main time:
// console.log(new Date(0));

// // Convert Days to Milliseconds:
// // day * day_hours * hour_min * min_sec * 1000_milisecond:
// // day * 24 * 60 * 60 * 1000:
// // ITC: 3 days after Unix Time:
// console.log('3 days after Unix Time: ', new Date(3 * 24 * 60 * 60 * 1000));

// Convert Milliseconds in Days:
// const days = Math.floor(ms / (24*60*60*1000));


// Methods of  Date:
// const future = new Date(2037, 10, 19, 15, 23);
// console.log('Future Date: ', future);
// console.log(future.getFullYear());
// console.log(future.getMonth() + 1);
// console.log(future.getDay());
// console.log(future.getHours());
// console.log(future.getMinutes());

// // to convert in String:
// console.log(future.toISOString());

// // to conver in Date:
// console.log(new Date(future));

// // Timestamp : miliseconds since Unix Time:
// console.log(future.getTime());

// // create Date using Timestamp:
// console.log(new Date(future.getTime()));

// // get current timestamp:
// console.log(Date.now());

// // SET Method:
// future.setFullYear(2023);
// console.log(future);


// Oparation in Dates::
// const future = new Date(2023, 10, 30, 15, 23);
// const present = new Date();
// console.log(future);
// // In Miliseconds
// // console.log(Number(future));
// console.log(+future);

// const daysCalc = (date1, date2) => Math.abs(+date2 - +date1);
// const ms = daysCalc(new Date(2037, 3, 14), new Date(2037, 3, 4));
// const days = Math.floor(ms / (24*60*60*1000));
// console.log(days);



