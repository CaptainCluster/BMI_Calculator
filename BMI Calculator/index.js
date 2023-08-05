/** 
@author CaptainCluster
@link https://github.com/CaptainCluster
*/

if (document.readyState !== "loading") {
    mainFunction();
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      mainFunction();
    });
}

/**
 * @function mainFunction
 */
function mainFunction(){
    let unitOfMeasurement = "metric"; //We have metric units by default
    determineUnitParameters(unitOfMeasurement);
    unitOfMeasurement = buttonProcess(unitOfMeasurement);
}

/**
 * @function buttonProcess
 * @description - Handling the functionality of each button the user can press
 * @param {String} unitOfMeasurement 
 * @returns {String} - Returning variable unitOfMeasurement to avoid discarding the changes
 */
function buttonProcess(unitOfMeasurement){
    //submitButton launches the BMI calculation process and sends the user input
    const submitButton = document.getElementById("submitButton");
    submitButton.addEventListener("click", () => {
        calculateBMI(unitOfMeasurement);
        submitButtonVisualResponse(submitButton);
    });
    //metricButton changes the measurement system to metric
    const metricButton = document.getElementById("buttonMetric");
    metricButton.style.backgroundColor = "darkgreen";
    metricButton.addEventListener("click", () => {
        if(unitOfMeasurement != "metric"){
            metricButton.style.backgroundColor = "darkgreen";
            imperialButton.style.backgroundColor = "#4caf50";
            unitOfMeasurement = "metric";
            determineUnitParameters(unitOfMeasurement);
        }
    });
    //imperialButton changes the measurement system to imperial.
    const imperialButton = document.getElementById("buttonUS");
    imperialButton.addEventListener("click", () => {
        if(unitOfMeasurement != "US"){
            imperialButton.style.backgroundColor = "darkgreen";
            metricButton.style.backgroundColor = "#4caf50";
            unitOfMeasurement = "US";
            determineUnitParameters(unitOfMeasurement);
        }
    });
    return unitOfMeasurement;
}

/**
 * @function submitButtonVisualResponse
 * @description - The button shows a visual response to the user
 * @param {buttonHtmlTag} submitButton - The html button element that the user can press
 */
function submitButtonVisualResponse(submitButton){
    submitButton.classList.add("clicked");
    setTimeout(function(){
        submitButton.classList.remove("clicked");
    }, 100);
}

/**
 * @function calculateBMI
 * @description - Calculates BMI, after verifying that the user inputs are correct
 * @param {String} unitOfMeasurement - Imperial or metric, affects how the BMI is calculated
 */
function calculateBMI(unitOfMeasurement){
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

/**
 * @function noInputProcess
 * @description - Takes a height input and then turns it into a valid one
 * to avoid errors and to improve the user experience
 * @param {number} heightType - Height in feet, meters, centimeters or inches
 * @returns {number}
 */
function noInputProcess(heightType){
    //If the user forgets to add an input to one of the height boxes, we assume
    //it is a zero in order to make the program better for the user.
    if(heightType == "" || isNaN(heightType)){
        heightType = 0;
    }
    return heightType;
}

/**
 * @function analyzeBMI
 * @description - //Making conclusions based on the BMI and getting them ready for display
 * @param {number} bodyMassIndex 
 * @param {number} height - Combines both meters and centimeters (or feet and inches)
 * @param {number} multiplier - 1 if metric system is used, 703 if imperial system is used
 */
function analyzeBMI(bodyMassIndex, height, multiplier){
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


/**
 * @function determineObesityClass
 * @description - If the user is obese, this function measures its severity
 * @param {number} bodyMassIndex 
 * @returns {String} - the obesity class
 */
function determineObesityClass(bodyMassIndex){
    //There are three different obesity classes (class 3 = severe obesity)
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
/**
 * @function determineUnitParameters
 * @param {String} unit - Metric or imperial 
 */
function determineUnitParameters(unit){
    if(unit == "metric"){
        changeMeasuresHTML(["[m]", "[cm]", "[kg]"]);
    } else{
        changeMeasuresHTML(["[ft]", "[in]", "[lb]"]);
    }
}

/**
 * @function changeMeasuresHTML
 * @description - Updates the symbols in the HTML, depending on the used system
 * @param {Array} unitList - Contains the strings to be displayed in html
 */
function changeMeasuresHTML(unitList){
    //Changing the unit symbols in the HTML to make the program more easy to use
    let heightText = document.getElementById("height");
    let lesserHeightText = document.getElementById("heightLesser");
    let weightText = document.getElementById("weight");

    heightText.textContent = "Your height " + unitList[0];
    lesserHeightText.textContent = unitList[1];
    weightText.textContent = unitList[2];
}

/**
 * @function displayResults
 * @param {number} bodyMassIndex
 * @param {String} userStatus - Underweight / Normal / Overweight / Obese
 * @param {String} obesityClass - Class 1 / Class 2 / Class 3
 */
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
    const defaultTextElement = document.getElementById("defaultText");
    defaultTextElement.textContent = "";
}

/**
 * @function giveAppropriateWeight
 * @description - shows the user, whose BMI is not "healthy" what their weight should be 
 * @param {number} height 
 * @param {String} userStatus - Underweight / Normal / Overweight / Obese
 * @param {number} multiplier - 1 if metric system is used, 703 if imperial system is used
 */
function giveAppropriateWeight(height, userStatus, multiplier){
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

    //There is no need to suggest a target height when the user's BMI is in 
    //the healthy range. This is why we will clear the textContent.
    if(userStatus == "Healthy"){
        adviceDisplay.textContent = "";
    }
}