
const circle = document.getElementById("circle");
const inputs = document.querySelectorAll(".js_input-day, .js_input-month, .js_input-year");
const labels = document.querySelectorAll(".js_label");
const errorTexts = document.querySelectorAll(".error-text");
const today = new Date();
const year = today.getFullYear();  // 年 
const month = today.getMonth() + 1; // 月 (0始まりなので+1)
const day = today.getDate(); // 日
const non = "--";
let isValid = true;


const displayYear = (resultYear)=>{
    document.getElementById("displayYears").textContent = resultYear;
};
const displayMonth = (resultMonth)=>{
    document.getElementById("displayMonths").textContent = resultMonth;
};
const displayDay = (resultDay)=>{
    document.getElementById("displayDays").textContent = resultDay;
};


circle.addEventListener("click", ()=>{

    // クリックするたびに表示を初期化する
    displayDay(non);
    displayMonth(non);
    displayYear(non);
    console.log(non);
    console.log(displayDay(non));

    const monthValue = Number(document.getElementById("month").value);
    const dayValue = Number(document.getElementById("day").value);
    const yearValue = Number(document.getElementById("year").value);

    //30日までの月
    const monthsWith30Days = [4, 6, 9, 11];
    

    inputs.forEach((input, index)=>{
        const value = input.value.trim();
        
        //inputが空欄の時
        if(value === ""){
            displayError(index, "This field is required");
            isValid = false;
        }  // 数字以外のとき（空欄以外）
        else if (isNaN(Number(value))) {
            displayError(index, "Please enter a number.");
            isValid = false;
        } else {
            displayNon(index);
        };
    });

    if (!isValid) {
        return
    };


    validation(monthValue, dayValue, yearValue, monthsWith30Days);
    console.log(isValid);

    if (isValid) {
        
        console.log("error")
        const todaysDay = dayCaluculation(monthValue, dayValue);
        const [todaysMonth, resultMonth] = monthCaluculation(dayValue, todaysDay, monthValue);
        yearsCaluculation(todaysMonth, resultMonth, yearValue);
    };
    
});

const validation = (monthValue, dayValue, yearValue, monthsWith30Days)=>{

    //年が今年より大きい際
    if (yearValue > year) {
        displayError(2 , "Must be in the past");
        isValid = false;
    } else {
        displayNon(2);
    };
    //日付が31より大きい、または、年と月が今年、今月で日付が未来の時、またはうるう年を含む2月のチェック
    if ((dayValue > 31) || (dayValue > day && monthValue == month && yearValue == year) || (monthValue === 2 && dayValue > (isLeapYear(yearValue) ? 29 : 28)) ){
        console.log("error1")
        displayError(0 , "Must be a valid day");
        isValid = false;
        
    };
    //月が12より大きい且つ、今年且つ月が未来、もしくは、今年且つ月も日付も未来の時
    if ((monthValue > 12) || (monthValue > month && yearValue == year) || (dayValue > day && monthValue > month && yearValue == year)){
        displayError(1 , "Must be a valid month");
        isValid = false;
        console.log("error2")
    };
    //月の日付が30日までの月且つ日付が30より大きい時
    if (monthsWith30Days.includes(monthValue) && dayValue > 30) {
        displayError(0 , "Must be a valid day");
        isValid = false;
        console.log("error3")
        
    };
    
};


//今年の誕生月が何日だったかを計測
const getDaysInMonth = (monthValue) => {
    const year = new Date().getFullYear(); // 今年の年を取得
    const month = Number(monthValue); // 入力が文字列だった場合に備えて数値に
    // 月は 0～11 で指定するため、次の月の0日目＝その月の最終日
    const lastDay = new Date(year, month, 0).getDate();

    return lastDay;
}

    //閏年の計算
    const  isLeapYear = (year) => {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }

//日の計算
const dayCaluculation = (monthValue, dayValue)=>{
    let todaysDay = 0;
    let resultDay = 0;
    let myLastDay = getDaysInMonth(monthValue); // 4月 → 30が返る

    
    todaysDay = day - dayValue
    if(todaysDay < 0){//day - dayValueが0より小さい時
        resultDay = myLastDay + todaysDay
    } else {
        resultDay = todaysDay;
    };
    displayDay(resultDay);
    return todaysDay;
};


//月の計算
const monthCaluculation = (dayValue, todaysDay, monthValue)=>{
    let todaysMonth = 0;
    let resultMonth = 0;
    
    
    todaysMonth = month - monthValue;
    if (todaysMonth < 0){//month - monthValueが0より小さい時
        resultMonth = 12 + (todaysMonth);
    } else if (todaysMonth == month){//今月と誕生月が同じ時
        resultMonth = 0;
    } else {
        resultMonth = todaysMonth;
    };
    if (todaysDay < 0 && month > monthValue){//day - dayValueが0より小さいい且つ　誕生月が今月より小さいなら
        resultMonth = resultMonth - 1;
    } else if (todaysDay < 0 && month == monthValue){//day - dayValueが0より小さいい且つ　今月と誕生月が同じなら　resultMonthは11にする
        resultMonth = 12 - 1;
    };
    if (dayValue > day && monthValue > month){ //誕生日が今日より大きく月も今月より大きい際
        resultMonth = 12 + (todaysMonth) - 1;
    };
    
    displayMonth(resultMonth);
    return [todaysMonth, resultMonth];
};


//年の計算
const yearsCaluculation = (todaysMonth, resultMonth, yearValue)=>{
    let todaysYear = 0;
    let resultYear = 0;
    
    todaysYear = year - yearValue;
    if(todaysMonth < 0){//month - monthValueが0より小さい時
        resultYear = todaysYear - 1;
    } else {
        resultYear = todaysYear;
    };

    if(resultMonth == 11){//month - monthValueが11と等しい時
        resultYear = resultYear - 1;
    };
    displayYear(resultYear);
};


//エラー表示を無くす
const displayNon = (index)=> {
    labels[index].classList.remove("label-active");
    inputs[index].classList.remove("input-active");
    errorTexts[index].classList.add("hidden");
};

//エラー表示にさせる
const displayError = (index, txt) => {
    labels[index].classList.add("label-active");
    inputs[index].classList.add("input-active");
    errorTexts[index].classList.remove("hidden");
    errorTexts[index].textContent = txt;
};

