const equationEvaluator = require('../controllers/equationEvaluator.controller');
const appConfig = require('../configuration/appConfig');


module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/smart-eq`;

    // Defining Routes

    app.get(baseUrl + '/equation-evaluator', equationEvaluator.smartEquationEvaluator);
    app.get(baseUrl + '/best-beers-evaluator', equationEvaluator.bestBearEvaluator);


}
