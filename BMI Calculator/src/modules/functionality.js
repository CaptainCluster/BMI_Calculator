/**
 * Handling the functionality of each button the user can press
 * @param {String} unitOfMeasurement 
 * @returns {String} - Returning variable unitOfMeasurement to avoid discarding the changes
 */

import { config } from "../config.js"; //A bunch of keys with fixed value pairs
import { user } from "../user.js";
import { submitButtonVisualResponse, 
    measurementUnitButtonVisualResponse, 
    changeMeasuresHTML, 
    displayResults } from "./display.js";

/**
 * @description - Setting up all the buttons and how they can be interacted with
 * @param {String} unitOfMeasurement - Either metric or imperial
 * @returns {String} - Returns unitOfMeasurement to keep the potential changes
 */
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
        unitOfMeasurement = measurementSystemProcess(unitOfMeasurement, config.MEASUREMENT_METRIC);
        measurementUnitButtonVisualResponse(metricButton, imperialButton);
    });

    //imperialButton changes the measurement system to imperial.
    const imperialButton = document.getElementById("buttonUS");
    imperialButton.addEventListener("click", () => {
        unitOfMeasurement = measurementSystemProcess(unitOfMeasurement, config.MEASUREMENT_IMPERIAL);
        measurementUnitButtonVisualResponse(imperialButton, metricButton);
    });
    return unitOfMeasurement;
}

/**
 * @description - Making sure the measurement unit change changes every related thing
 * @param {String} unitOfMeasurement 
 * @param {String} desiredMeasurementSystem - What the unitOfMeasurement variable will always end up being
 * @returns {String}
 */
function measurementSystemProcess(unitOfMeasurement, desiredMeasurementSystem){
    if(unitOfMeasurement != desiredMeasurementSystem){
        unitOfMeasurement = desiredMeasurementSystem;
        determineUnitParameters(unitOfMeasurement);
    }
    return unitOfMeasurement;
}

/**
 * @description - Takes a height input and then turns it into a valid one
 * to avoid errors and to improve the user experience
 * @param {number} heightType - Height in feet, meters, centimeters or inches
 * @returns {number} - Returns either the original value or a zero (default for undefined)
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
 * @description - The parameters will end up being displayed in the HTML. 
 * Here the suitable parameters are determined.
 * @param {String} unit - Either metric or imperial 
 */
function determineUnitParameters(unitOfMeasurement){
    if(unitOfMeasurement == config.MEASUREMENT_METRIC){
        changeMeasuresHTML(["[m]", "[cm]", "[kg]"]);
    } else{
        changeMeasuresHTML(["[ft]", "[in]", "[lb]"]);
    }
}

/**
 * @description - Calculates BMI, after verifying that the given inputs are correct
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
        user.weight = document.getElementById("weightInput").value; //We got the user's weight now (kg or lbs)

        //In case the user has chosen the imperial system, we have to give some variables new values
        //in order to guarantee that the calculations are done properly.
        if(unitOfMeasurement == config.MEASUREMENT_IMPERIAL){
            multiplier = config.BMI_MULTIPLIER_IMPERIAL;
            multiplierFeetToInches = config.BMI_MULTIPLIER_IMPERIAL_FEET;
            divider = config.BMI_DIVIDER_IMPERIAL;
        }

        //Responding to a potential situation where the user has not given inputs.
        userHeightLesser = noInputProcess(userHeightLesser);
        userHeightUpper = noInputProcess(userHeightUpper);

        //Should the user's inputs be considered valid, the program will proceed to calculate the BMI
        if(userHeightLesser + userHeightUpper != 0 && isNaN(user.weight) == false && user.weight != ""){
            user.height = parseInt(userHeightUpper) * multiplierFeetToInches + parseInt(userHeightLesser)/divider;
            user.bodyMassIndex = (user.weight / user.height ** config.POWER) * multiplier;
            if(!isNaN(user.bodyMassIndex)){ //Making sure the BMI has been calculated properly before continuing
                analyzeBMI(multiplier);
            }
        }
    } catch(error){
        console.error("The program ran into the following error:", error.message);
    };
}

/**
 * @description - Making conclusions based on the BMI and getting them ready for display
 * @param {number} multiplier - 1 if metric system is used, 703 if imperial system is used
 */
function analyzeBMI(multiplier){
    const resultDisplay = document.getElementById("results"); //A h1-tag
    try{
        //Comparing the user's BMI to multiple fixed values to determine the user's status
        if (user.bodyMassIndex < config.BMI_UNDERWEIGHT) {
            user.status = "Underweight";
        } else if (user.bodyMassIndex >= config.BMI_UNDERWEIGHT && user.bodyMassIndex < config.BMI_OVERWEIGHT) {
            user.status = "Healthy";
        } else if (user.bodyMassIndex >= config.BMI_OVERWEIGHT && user.bodyMassIndex < config.BMI_OBESE) {
            user.status = "Overweight";
        } else {
            user.status = "Obese";
            determineObesityClass();
        }
        displayResults(); 
        giveAppropriateWeight(multiplier); 
    } catch(error){
        resultDisplay.textContent = "The program ran into the following error: " + error.message;
    }
}

/**
 * If the user is obese, this function measures its severity (based on classes 1, 2 and 3)
 * @returns {String} - the obesity class
 */
function determineObesityClass(){
    //There are three different obesity classes (class 3 = severe obesity)
    if(user.bodyMassIndex >= config.OBESITY_CLASS_1 && user.bodyMassIndex < config.OBESITY_CLASS_2){
        user.obesityClass = "Class 1";
    } else if(user.bodyMassIndex >= config.OBESITY_CLASS_2 && user.bodyMassIndex < config.OBESITY_CLASS_3){
        user.obesityClass = "Class 2";
    } else if(user.bodyMassIndex >= config.OBESITY_CLASS_3){
        user.obesityClass = "Class 3"; 
    }
}

/**
 * @description - Shows the user, whose BMI is not "healthy" what their weight should be 
 * @param {number} multiplier - 1 if metric system is used, 703 if imperial system is used
 */
function giveAppropriateWeight(multiplier){
    //The ideal BMI will be the closest healthy value to the user
    let idealBodyMassIndex = config.STRING_UNDEFINED;
    let idealWeight = config.STRING_UNDEFINED;
    let weightUnit = config.STRING_UNDEFINED;

    const adviceDisplay = document.getElementById("weightSuggestion"); //h1 tag

    //We want the program to be descriptive, thus we display kg/lbs after the suggested weight number
    if(multiplier == config.BMI_MULTIPLIER_METRIC){
        weightUnit = "kg";
    } else{
        weightUnit = "lbs";
    }

    if(user.status == "Obese" || user.status == "Overweight"){
        idealBodyMassIndex = config.BMI_NORMAL_HIGHER; 
    } else if(user.status == "Underweight"){
        idealBodyMassIndex = config.BMI_NORMAL_LOWER; 
    }

    //We need the multiplier to use the same calculation we used to calculate BMI
    //in both the US unit and the metric unit. We can also use this to determine 
    //the weight unit we want to show the user.
    if(!isNaN(idealBodyMassIndex)){
        idealWeight = (idealBodyMassIndex * user.height ** config.POWER) / multiplier;
    adviceDisplay.textContent = "Your weight should be about " + idealWeight.toFixed(config.IDEAL_WEIGHT_DECIMAL) + " " + weightUnit + " to be considered healthy." 
    }
    //There is no need to suggest a target height when the user's BMI is in 
    //the healthy range. This is why we will clear the textContent.
    if(user.status == "Healthy"){
        adviceDisplay.textContent = "";
    }
    measureWeightDifferences(idealWeight, weightUnit);
}

function calculateIdealBMI(){

}

/**
 * @function measureWeightDifferences
 * @description - Measures the difference between the user's weight and the ideal one
 */
function measureWeightDifferences(idealWeight, weightUnit){
    const weightComparisonHolder = document.getElementById("weightComparison");
    let weightDifference = config.NUMBER_UNDEFINED; //Also determines how much weight should be lost
    //Handling different scenarios (based on user status)
    if(user.status == "Underweight"){
        weightDifference = idealWeight - user.weight;
        weightComparisonHolder.textContent = "You should gain " + weightDifference.toFixed(config.BMI_DECIMAL) + " " + weightUnit + " to be considered healthy.";
    } else if(user.status == "Overweight" || user.status == "Obese"){
        weightDifference = user.weight - idealWeight;
        weightComparisonHolder.textContent = "You should lose " + weightDifference.toFixed(config.BMI_DECIMAL) + " " + weightUnit + " to be considered healthy.";
    } else {
        weightComparisonHolder.textContent = "According to the calculator, you are healthy weight-wise! Keep it up!";
    }
}
export { determineUnitParameters,  buttonSetup }