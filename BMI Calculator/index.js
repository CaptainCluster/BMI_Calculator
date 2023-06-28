if (document.readyState !== "loading") {
    console.log("Document is ready!");
    mainFunction();
  } else {
    document.addEventListener("DOMContentLoaded", function () {
      console.log("Document is ready after waiting!");
      mainFunction();
    });
}

function mainFunction(){
    var unit = "metric"; //We have metric units by default
    determineUnitParameters(unit);
    const submitButton = document.getElementById("submitButton");
    submitButton.addEventListener("click", function(){
        calculateBMI(unit);
    });
    const metricButton = document.getElementById("buttonMetric");
    metricButton.addEventListener("click", function(){
        if(unit != "metric"){
            unit = "metric";
            determineUnitParameters(unit);
        }
    });
    const USButton = document.getElementById("buttonUS");
    USButton.addEventListener("click", function(){
        if(unit != "US"){
            unit = "US";
            determineUnitParameters(unit);
        }
    });
}

function calculateBMI(unit){
    //The BMI calculation process. Also makes sure user has given proper inputs.
    //We have multipliers and dividers with default values to suit metric system. 
    //The default values change when using the US units
    let multiplier = 1;
    let multiplierFeetToInches = 1;
    let divider = 100;
    let userHeightUpper = document.getElementById("heightInput1").value;
    let userHeightLesser = document.getElementById("heightInput2").value;
    const userWeight = document.getElementById("weightInput").value;
    if(unit == "US"){
        multiplier = 703;
        multiplierFeetToInches = 12;
        divider = 1;
    }
    if(userHeightLesser == ""){
        userHeightLesser = 0;
    }
    if(userHeightUpper == ""){
        userHeightUpper = 0;
    }
    if(userHeightLesser + userHeightUpper != 0){
        const userHeight = parseInt(userHeightUpper) * multiplierFeetToInches + parseInt(userHeightLesser)/divider;
        const bodyMassIndex = (userWeight / userHeight ** 2) * multiplier;
        analyzeBMI(bodyMassIndex.toFixed(1));
    }
}

function analyzeBMI(bodyMassIndex){
    //Making conclusions based on the BMI and getting them ready for display
    //For instance, a BMI of 31 means we will tell the user they are obese,
    let userStatus = "Not determined";
    let userObesityClass = "Not determined";
    if (bodyMassIndex < 18.5) {
        userStatus = "Underweight";
    } else if (bodyMassIndex >= 18.5 && bodyMassIndex < 25.0) {
        userStatus = "Healthy";
    } else if (bodyMassIndex >= 25.0 && bodyMassIndex < 30.0) {
        userStatus = "Overweight";
    } else {
        userStatus = "Obese";
        userObesityClass = determineObesityClass(bodyMassIndex);
    }
    displayResults(bodyMassIndex, userStatus, userObesityClass);
}

function determineObesityClass(bodyMassIndex){
    //There are three different obesity classes (class 3 = severe obesity)
    //This function is used when the BMI indicated the user is obese
    let userObesityClass = "Not determined";
    if(bodyMassIndex >= 30 && bodyMassIndex < 35){
        userObesityClass = "Class 1";
    } else if(bodyMassIndex >= 35 && bodyMassIndex < 40){
        userObesityClass = "Class 2";
    } else if(bodyMassIndex >= 40){
        userObesityClass = "Class 3"; 
    }
    return userObesityClass;
}

function determineUnitParameters(unit){
    if(unit == "metric"){
        changeMeasuresHTML(["[m]", "[cm]", "[kg]"]);
    } else{
        changeMeasuresHTML(["[ft]", "[in]", "[lb]"]);
    }
}

function changeMeasuresHTML(unitList){
    //Changing the unit symbols in the HTML to make the program more easy to use
    var heightText = document.getElementById("height");
    var lesserHeightText = document.getElementById("lesserHeight");
    var weightText = document.getElementById("weight");

    heightText.textContent = unitList[0];
    lesserHeightText.textContent = unitList[1];
    weightText.textContent = unitList[2];
}

function displayResults(bodyMassIndex, userStatus, obesityClass){
    //Showing the results to the user in the h1 tag 
    const resultDisplay = document.getElementById("results");
    if(obesityClass == "Not determined"){
        resultDisplay.textContent = bodyMassIndex + "  ==>  " + userStatus; 
    } else{
        resultDisplay.textContent = bodyMassIndex + "  ==>  " + userStatus + ",  " + obesityClass; 
    }
}
