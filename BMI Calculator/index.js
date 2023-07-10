/** 
@author CaptainCluster
https://github.com/CaptainCluster
*/

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
    let unitOfMeasurement = "metric"; //We have metric units by default
    determineUnitParameters(unitOfMeasurement);
    const submitButton = document.getElementById("submitButton");
    submitButton.addEventListener("click", function(){
        calculateBMI(unitOfMeasurement);
        submitButtonVisualResponse(submitButton);

    });
    const metricButton = document.getElementById("buttonMetric");
    metricButton.style.backgroundColor = "darkgreen";
    metricButton.addEventListener("click", function(){
        if(unitOfMeasurement != "metric"){
            metricButton.style.backgroundColor = "darkgreen";
            USButton.style.backgroundColor = "#4caf50";
            unitOfMeasurement = "metric";
            determineUnitParameters(unitOfMeasurement);
        }
    });
    const USButton = document.getElementById("buttonUS");
    USButton.addEventListener("click", function(){
        if(unitOfMeasurement != "US"){
            USButton.style.backgroundColor = "darkgreen";
            metricButton.style.backgroundColor = "#4caf50";
            unitOfMeasurement = "US";
            determineUnitParameters(unitOfMeasurement);
        }
    });
}
function submitButtonVisualResponse(submitButton){
    submitButton.classList.add("clicked");
    setTimeout(function(){
        submitButton.classList.remove("clicked");
    }, 100);
}

function calculateBMI(unitOfMeasurement){
    //The BMI calculation process. Also makes sure user has given proper inputs.
    //We have multipliers and dividers with default values to suit metric system. 
    //The default values change when using the US units
    let multiplier = 1;
    let multiplierFeetToInches = 1;
    let divider = 100;
    let userHeightUpper = document.getElementById("heightInput1").value;
    let userHeightLesser = document.getElementById("heightInput2").value;
    const userWeight = document.getElementById("weightInput").value;
    if(unitOfMeasurement == "US"){
        multiplier = 703;
        multiplierFeetToInches = 12;
        divider = 1;
    }
    userHeightLesser = noInputProcess(userHeightLesser);
    userHeightUpper = noInputProcess(userHeightUpper);
    if(userHeightLesser + userHeightUpper != 0 && isNaN(userWeight) == false && userWeight != ""){
        const userHeight = parseInt(userHeightUpper) * multiplierFeetToInches + parseInt(userHeightLesser)/divider;
        const bodyMassIndex = (userWeight / userHeight ** 2) * multiplier;
        if(isNaN(bodyMassIndex) == false){
            analyzeBMI(bodyMassIndex.toFixed(1), userHeight, multiplier);
        }
    }
}

function noInputProcess(heightType){
    //If the user forgets to add an input to one of the height boxes, we assume
    //it is a zero in order to make the program better for the user.
    if(heightType == "" || isNaN(heightType)){
        heightType = 0;
    }
    return heightType;
}

function analyzeBMI(bodyMassIndex, height, multiplier){
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
    giveAppropriateWeight(height, userStatus, multiplier);
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
    let heightText = document.getElementById("height");
    let lesserHeightText = document.getElementById("lesserHeight");
    let weightText = document.getElementById("weight");

    heightText.textContent = unitList[0];
    lesserHeightText.textContent = unitList[1];
    weightText.textContent = unitList[2];
}

function displayResults(bodyMassIndex, userStatus, obesityClass){
    //Showing the results to the user in the h1 tag 
    const resultDisplay = document.getElementById("results");
    if(obesityClass == "Not determined"){
        resultDisplay.textContent = "Your BMI: " + bodyMassIndex + "  ==>  " + userStatus; 
    } else{
        resultDisplay.textContent = "Your BMI: " + bodyMassIndex + "  ==>  " + userStatus + ",  " + obesityClass; 
    }
    if(userStatus == "Healthy"){
        resultDisplay.style.color = "#4caf50";
    } else{
        resultDisplay.style.color = "red";
    }
}

function giveAppropriateWeight(height, userStatus, multiplier){
    //This function shows a user, whose BMI is not considered "healthy" what their 
    //weight should be in order to be considered "healthy".
    //The results will be displayed on the HTML

    //The ideal BMI will be the closest healthy value to the user
    let idealBodyMassIndex = "Not determined";
    let idealWeight = "Not determined";
    let weightUnit = "Not determined";
    const adviceDisplay = document.getElementById("weightSuggestion");

    //We need the multiplier to use the same calculation to calculate BMI
    //in both the US unit and the metric unit. We can also use this to
    //determine the weight unit we want to show the user.
    if(multiplier == 1){
        weightUnit = "kg";
    } else{
        weightUnit = "lbs";
    }

    if(userStatus == "Obese" || userStatus == "Overweight"){
        idealBodyMassIndex = 24.99;
    } else if(userStatus == "Underweight"){
        idealBodyMassIndex = 18.51;
    }
    if(isNaN(idealBodyMassIndex) == false){
        idealWeight = (idealBodyMassIndex * height ** 2) / multiplier;
    adviceDisplay.textContent = "Your weight should be about " + idealWeight.toFixed(1) + " " + weightUnit + " to be considered healthy." 
    }

    //There is no need to suggest a target height when the user's BMI is in the
    //healthy range. This is why we will clear the textContent.
    if(userStatus == "Healthy"){
        adviceDisplay.textContent = "";
    }
}