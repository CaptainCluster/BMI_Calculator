/** 
@author CaptainCluster
@link https://github.com/CaptainCluster
*/

import { user } from "../user.js";
import { config } from "../config.js";

/**
 * @description The button shows a visual response to the user
 * @param {buttonHtmlTag} submitButton - The html button element that the user can press
 */
function submitButtonVisualResponse(submitButton){
    submitButton.classList.add("clicked");
    setTimeout(() => { submitButton.classList.remove("clicked"); }, config.BUTTON_CLICKED_DURATION);
}
 /**
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
    //Changing the unit symbols in the HTML to make the program more easy to use
    let heightText = document.getElementById("height");
    let lesserHeightText = document.getElementById("heightLesser");
    let weightText = document.getElementById("weight");

    heightText.textContent = "Your height " + unitList[0];
    lesserHeightText.textContent = unitList[1];
    weightText.textContent = unitList[2];
}

/**
 * @description - Displays the results based on the user's BMI
 */
function displayResults(){
    //Showing the results to the user in the h1 tag 
    const resultDisplay = document.getElementById("results");
    try{
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
        const defaultTextElement = document.getElementById("defaultText");
        defaultTextElement.textContent = "";
    } catch(error){
        resultDisplay.textContent = "The program ran into the following error: " +  error.message;
    }
}

export { submitButtonVisualResponse, measurementUnitButtonVisualResponse, changeMeasuresHTML, displayResults }