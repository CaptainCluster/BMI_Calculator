/** 
@author CaptainCluster
@link https://github.com/CaptainCluster
*/

import { config } from "./config.js";

let user = {
    weight : 0,
    height : 0,
    bodyMassIndex : 0,
    obesityClass : config.STRING_UNDEFINED, //Only defined if the user is obese (BMI >= 30)
    status : config.STRING_UNDEFINED, //Underweight / Healthy / Overweight / Obese
}

export { user }
