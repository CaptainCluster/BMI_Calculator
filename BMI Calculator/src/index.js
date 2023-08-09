/** 
@author CaptainCluster
@link https://github.com/CaptainCluster
*/
import { config } from "./config.js"; //A bunch of keys with fixed value pairs
import { determineUnitParameters, buttonSetup } from "./modules/functionality.js";

if (document.readyState !== "loading") {
    mainFunction();
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      mainFunction();
    });
}

/**
 * The function that the program will execute first
 */
function mainFunction(){
    let unitOfMeasurement = config.MEASUREMENT_METRIC; //We have metric units by default
    determineUnitParameters(unitOfMeasurement);
    unitOfMeasurement = buttonSetup(unitOfMeasurement);
}

