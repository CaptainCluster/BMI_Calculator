/** 
@author CaptainCluster
@link https://github.com/CaptainCluster
*/

//This contains a bunch of variables with fixed values to make the code in index.js
//more maintainable.

const config = {
    //BMI status related conditions
    BMI_UNDERWEIGHT : 18.50,
    //Normal weight is between BMI_UNDERWEIGHT and BMI_OVERWEIGHT
    BMI_OVERWEIGHT : 25.00,
    BMI_OBESE : 30.00,
    //Obesity classes (Only needed when the BMI is 30 or above)
    OBESITY_CLASS_1 : 30.00,
    OBESITY_CLASS_2 : 35.00,
    OBESITY_CLASS_3 : 40.00,

    //For estimating an ideal BMI
    BMI_NORMAL_HIGHER : 24.99, 
    BMI_NORMAL_LOWER : 18.51,

    //Multipliers for calculating BMI (To make the program function for multiple measurement systems)
    BMI_MULTIPLIER_METRIC : 1,
    BMI_DIVIDER_METRIC : 100,
    BMI_MULTIPLIER_IMPERIAL : 703,
    BMI_MULTIPLIER_IMPERIAL_FEET : 12,
    BMI_DIVIDER_IMPERIAL : 1,

    //For displaying information
    BMI_DECIMAL : 1,
    IDEAL_WEIGHT_DECIMAL : 1,
    
    //Others...
    BUTTON_CLICKED_DURATION : 100,
    HEIGHT_DEFAULT : 0, //If the user gives no height input, it's 0 by default
}

export { config }