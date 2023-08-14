/** 
@author CaptainCluster
@link https://github.com/CaptainCluster
*/

import { user } from "../user.js";
import { config } from "../config.js";
import { mainErrorProcess } from "./errorHandling.js";



 /**
  * @description - When the user presses one of the buttons (US or metric), that button will change
  * color to help the user understand which one he has selected.
  * @param {button} chosenButton 
  * @param {button} notChosenButton 
  */
function measurementUnitButtonVisualResponse(chosenButton, notChosenButton){
    chosenButton.style.backgroundColor = "darkgreen";
    notChosenButton.style.backgroundColor = "#4caf50";
}

/**
 * @description - Updates the symbols in the HTML, depending on the used measurement system
 * @param {Array} unitList - Contains the strings to be displayed in HTML
 */
function changeMeasuresHTML(unitList){
    try{
        //Changing the unit symbols in the HTML to make the program more easy to use
        const heightInputUpperHolder = document.getElementById("height-input1");
        const heightInputLesserHolder = document.getElementById("height-input2");
        const weightInputHolder = document.getElementById("weight-input");

        heightInputUpperHolder.placeholder = "Your height " + unitList[0];
        heightInputLesserHolder.placeholder = "Your height " + unitList[1];
        weightInputHolder.placeholder = "Your weight " + unitList[2];
    } catch(error){
        mainErrorProcess(error);
    }
}

/**
 * @description - Displays the results based on the user's BMI (in a h5 tag)
 */
function displayResults(){
    const resultDisplay = document.getElementById("results");
    try{
        //Checking if the user has an obesity class. If they do, it will be displayed among the other results.
        if(user.obesityClass == config.STRING_UNDEFINED){
            resultDisplay.textContent = "Your BMI: " + user.bodyMassIndex.toFixed(config.BMI_DECIMAL) + "  ==>  " + user.status; 
        } else{
            resultDisplay.textContent = "Your BMI: " + user.bodyMassIndex.toFixed(config.BMI_DECIMAL) + "  ==>  " + user.status + ",  " + user.obesityClass; 
        }
        if(user.status == "Healthy"){
            resultDisplay.style.color = "#4caf50"; //"Healthy" BMI ==> green text
        } else{
            resultDisplay.style.color = "red"; //"Unhealthy" BMI ==> red text
        }
        const defaultTextElement = document.getElementById("default-text");
        defaultTextElement.textContent = "";
    } catch(error){
        mainErrorProcess(error);
    }
}

/**
 * @description - When the user changes the measurement units, the current inputs will be removed
 */
function resetUserInputs(){
    try{
        const heightInputUpperHolder = document.getElementById("height-input1");
        const heightInputLesserHolder = document.getElementById("height-input2");
        const weightInputHolder = document.getElementById("weight-input");
        //Wiping off the user input
        heightInputUpperHolder.value = "";
        heightInputLesserHolder.value = "";
        weightInputHolder.value = "";
    }
    catch(error){
        mainErrorProcess(error);
    }
}

export { measurementUnitButtonVisualResponse, changeMeasuresHTML, displayResults, resetUserInputs }