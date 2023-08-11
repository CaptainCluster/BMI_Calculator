/** 
@author CaptainCluster
@link https://github.com/CaptainCluster
*/

/**
 * @description - Puts the error on a h1 tag for the user to see
 * @param {error} error 
 */
function mainErrorProcess(error){
    const errorMessageHolder = document.getElementById("errorMessage");
    errorMessageHolder.textContent = "The program ran into the following error: " + error.message;
}

export { mainErrorProcess }