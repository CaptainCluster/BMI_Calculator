/** 
@author CaptainCluster
@link https://github.com/CaptainCluster
*/

/**
 * @description - Puts the error in a h5 tag for the user to see
 * @param {error} error 
 */
function mainErrorProcess(error){
    const errorMessageHolder = document.getElementById("error-message");
    errorMessageHolder.textContent = "The program ran into the following error: " + error.message;
}

/**
 * @description - If, for some odd reason, none of the conditions are met when the
 * program tries to determine the user's obesity class, this error occurs.
 */
function obesityClassError(){
    const errorMessageHolder = document.getElementById("error-message");
    errorMessageHolder.textContent = "Failed to determine the obesity class. Try again?"
}

export { mainErrorProcess, obesityClassError }