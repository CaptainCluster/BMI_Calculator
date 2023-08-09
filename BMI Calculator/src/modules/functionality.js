/**
 * Handling the functionality of each button the user can press
 * @param {String} unitOfMeasurement 
 * @returns {String} - Returning variable unitOfMeasurement to avoid discarding the changes
 */

import { config } from "../config.js"; //A bunch of keys with fixed value pairs

function buttonSetup(unitOfMeasurement){
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
        if(unitOfMeasurement != config.MEASUREMENT_METRIC){
            metricButton.style.backgroundColor = "darkgreen";
            imperialButton.style.backgroundColor = "#4caf50";
            unitOfMeasurement = config.MEASUREMENT_METRIC;
            determineUnitParameters(unitOfMeasurement);
        }
    });
    //imperialButton changes the measurement system to imperial.
    const imperialButton = document.getElementById("buttonUS");
    imperialButton.addEventListener("click", () => {
        if(unitOfMeasurement != config.MEASUREMENT_IMPERIAL){
            imperialButton.style.backgroundColor = "darkgreen";
            metricButton.style.backgroundColor = "#4caf50";
            unitOfMeasurement = config.MEASUREMENT_IMPERIAL;
            determineUnitParameters(unitOfMeasurement);
        }
    });
    return unitOfMeasurement;
}

/**
 * The button shows a visual response to the user
 * @param {buttonHtmlTag} submitButton - The html button element that the user can press
 */
function submitButtonVisualResponse(submitButton){
    submitButton.classList.add("clicked");
    setTimeout(() => { submitButton.classList.remove("clicked"); }, config.BUTTON_CLICKED_DURATION);
}

/**
 * Takes a height input and then turns it into a valid one
 * to avoid errors and to improve the user experience
 * @param {number} heightType - Height in feet, meters, centimeters or inches
 * @returns {number}
 */
function noInputProcess(heightType){
    //If the user forgets to add an input to one of the height boxes, we assume
    //it is a zero in order to make the program better for the user.
    if(heightType == "" || isNaN(heightType)){
        heightType = config.HEIGHT_DEFAULT;
    }
    return heightType;
}

/**
 * @param {String} unit - Metric or imperial 
 */
function determineUnitParameters(unit){
    if(unit == config.MEASUREMENT_METRIC){
        changeMeasuresHTML(["[m]", "[cm]", "[kg]"]);
    } else{
        changeMeasuresHTML(["[ft]", "[in]", "[lb]"]);
    }
}

/**
 * Updates the symbols in the HTML, depending on the used system
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
 * Calculates BMI, after verifying that the user inputs are correct
 * @param {String} unitOfMeasurement - Imperial or metric, affects how the BMI is calculated
 */
function calculateBMI(unitOfMeasurement){
    try{
        //Metric system is used on default when the program is started.
        let multiplier = config.BMI_MULTIPLIER_METRIC;
        let multiplierFeetToInches = config.BMI_MULTIPLIER_METRIC;
        let divider = config.BMI_DIVIDER_METRIC;

        //Let's store the input given by the user into variables.
        let userHeightUpper = document.getElementById("heightInput1").value; //Meters or feet
        let userHeightLesser = document.getElementById("heightInput2").value; //Centimeters or inches
        const userWeight = document.getElementById("weightInput").value; //Kilograms or pounds

        if(unitOfMeasurement == config.MEASUREMENT_IMPERIAL){
            multiplier = config.BMI_MULTIPLIER_IMPERIAL;
            multiplierFeetToInches = config.BMI_MULTIPLIER_IMPERIAL_FEET;
            divider = config.BMI_DIVIDER_IMPERIAL;
        }
        //Responding to a potential situation where the user has not given inputs.
        userHeightLesser = noInputProcess(userHeightLesser);
        userHeightUpper = noInputProcess(userHeightUpper);
        //Should the user's inputs be considered valid, the program will proceed to calculate the BMI
        //based on them.
        if(userHeightLesser + userHeightUpper != 0 && isNaN(userWeight) == false && userWeight != ""){
            const userHeight = parseInt(userHeightUpper) * multiplierFeetToInches + parseInt(userHeightLesser)/divider;
            const bodyMassIndex = (userWeight / userHeight ** config.POWER) * multiplier;
            if(isNaN(bodyMassIndex) == false){
                analyzeBMI(bodyMassIndex.toFixed(config.BMI_DECIMAL), userHeight, multiplier, userWeight);
            }
        }
    } catch(error){
        console.error("The program ran into the following error:", error.message);
    };
}

/**
 * Making conclusions based on the BMI and getting them ready for display
 * @param {number} bodyMassIndex 
 * @param {number} height - Combines both meters and centimeters (or feet and inches)
 * @param {number} multiplier - 1 if metric system is used, 703 if imperial system is used
 */
function analyzeBMI(bodyMassIndex, height, multiplier, userWeight){
    const resultDisplay = document.getElementById("results");
    try{
        let userStatus = config.STATE_NOT_DETERMINED;
        let userObesityClass = config.STATE_NOT_DETERMINED; //Only determined if the BMI is above 30

        if (bodyMassIndex < config.BMI_UNDERWEIGHT) {
            userStatus = "Underweight";
        } else if (bodyMassIndex >= config.BMI_UNDERWEIGHT && bodyMassIndex < config.BMI_OVERWEIGHT) {
            userStatus = "Healthy";
        } else if (bodyMassIndex >= config.BMI_OVERWEIGHT && bodyMassIndex < config.BMI_OBESE) {
            userStatus = "Overweight";
        } else {
            userStatus = "Obese";
            userObesityClass = determineObesityClass(bodyMassIndex);
        }
        displayResults(bodyMassIndex, userStatus, userObesityClass);
        giveAppropriateWeight(height, userStatus, multiplier, userWeight);
    } catch(error){
        resultDisplay.textContent = "The program ran into the following error: " + error.message;
    }
}

/**
 * If the user is obese, this function measures its severity
 * @param {number} bodyMassIndex 
 * @returns {String} - the obesity class
 */
function determineObesityClass(bodyMassIndex){
    //There are three different obesity classes (class 3 = severe obesity)
    let userObesityClass = config.STATE_NOT_DETERMINED;
    if(bodyMassIndex >= config.OBESITY_CLASS_1 && bodyMassIndex < config.OBESITY_CLASS_2){
        userObesityClass = "Class 1";
    } else if(bodyMassIndex >= config.OBESITY_CLASS_2 && bodyMassIndex < config.OBESITY_CLASS_3){
        userObesityClass = "Class 2";
    } else if(bodyMassIndex >= config.OBESITY_CLASS_3){
        userObesityClass = "Class 3"; 
    }
    return userObesityClass;
}

/**
 * @param {number} bodyMassIndex
 * @param {String} userStatus - Underweight / Normal / Overweight / Obese
 * @param {String} obesityClass - Class 1 / Class 2 / Class 3
 */
function displayResults(bodyMassIndex, userStatus, obesityClass){
    //Showing the results to the user in the h1 tag 
    const resultDisplay = document.getElementById("results");
    try{
        if(obesityClass == config.STATE_NOT_DETERMINED){
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
    } catch(error){
        resultDisplay.textContent = "The program ran into the following error: " +  error.message;
    }
}

/**
 * Shows the user, whose BMI is not "healthy" what their weight should be 
 * @param {number} height 
 * @param {String} userStatus - Underweight / Normal / Overweight / Obese
 * @param {number} multiplier - 1 if metric system is used, 703 if imperial system is used
 */
function giveAppropriateWeight(height, userStatus, multiplier, userWeight){
    //The results will be displayed on the HTML
    //The ideal BMI will be the closest healthy value to the user
    let idealBodyMassIndex = config.STATE_NOT_DETERMINED;
    let idealWeight = config.STATE_NOT_DETERMINED;
    let weightUnit = config.STATE_NOT_DETERMINED;
    const adviceDisplay = document.getElementById("weightSuggestion");
    //We need the multiplier to use the same calculation to calculate BMI
    //in both the US unit and the metric unit. We can also use this to
    //determine the weight unit we want to show the user.
    if(multiplier == config.BMI_MULTIPLIER_METRIC){
        weightUnit = "kg";
    } else{
        weightUnit = "lbs";
    }
    if(userStatus == "Obese" || userStatus == "Overweight"){
        idealBodyMassIndex = config.BMI_NORMAL_HIGHER;
    } else if(userStatus == "Underweight"){
        idealBodyMassIndex = config.BMI_NORMAL_LOWER;
    }
    if(isNaN(idealBodyMassIndex) == false){
        idealWeight = (idealBodyMassIndex * height ** config.POWER) / multiplier;
    adviceDisplay.textContent = "Your weight should be about " + idealWeight.toFixed(config.IDEAL_WEIGHT_DECIMAL) + " " + weightUnit + " to be considered healthy." 
    }
    //There is no need to suggest a target height when the user's BMI is in 
    //the healthy range. This is why we will clear the textContent.
    if(userStatus == "Healthy"){
        adviceDisplay.textContent = "";
    }
    measureWeightDifferences(userWeight, idealWeight, userStatus, weightUnit);
}
/**
 * @function measureWeightDifferences
 * @description - Measures the difference between the user's weight and the ideal one
 */
function measureWeightDifferences(userWeight, idealWeight, userStatus, weightUnit){
    const weightComparisonHolder = document.getElementById("weightComparison");
    let weightDifference = null;
    if(userStatus == "Underweight"){
        weightDifference = idealWeight - userWeight;
        weightComparisonHolder.textContent = "You should gain " + weightDifference.toFixed(config.BMI_DECIMAL) + weightUnit + " to be considered healthy.";
    } else if(userStatus == "Overweight" || userStatus == "Obese"){
        weightDifference = userWeight - idealWeight;
        weightComparisonHolder.textContent = "You should lose " + weightDifference.toFixed(config.BMI_DECIMAL) + weightUnit + " to be considered healthy.";
    } else {
        weightComparisonHolder.textContent = "According to the calculator, you are healthy weight-wise! Keep it up!";
    }
}

export { determineUnitParameters,  buttonSetup }