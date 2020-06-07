const fs = require('fs');
const path = require('path');
var Solver = require('js-solver')

const filePath = path.join(__dirname, '../configuration/equationFile.json');

let smartEquationEvaluator = (req, res) => {
    fs.readFile(filePath, 'utf8', function (err, data) {
        if (err) {
            throw err;
        } else {
            let equationObject = JSON.parse(data);
            let equation = equationObject.lhs.lhs + operatorEvaluation(equationObject.lhs.op) + '(' + equationObject.lhs.rhs.lhs + operatorEvaluation(equationObject.lhs.rhs.op) + equationObject.lhs.rhs.rhs + ')' + operatorEvaluation(equationObject.op) + equationObject.rhs;
            let evaluatedEquation = evaludateEquation(equationObject);
            let apiResponse = {
                "equation": equation,
                "value": evaluatedEquation
            }
            res.send(apiResponse);
        }
    });
}

let bestBearEvaluator = (req, res) => {
    if (req.body.orderNumber) {
        let orderNumber = req.body.orderNumber;
        let orderNumberDivisorList = divisor(orderNumber);
        let subsetsList = divisorSubsets(orderNumberDivisorList, orderNumber);
        let firstCaseResult = caseFirstEval(orderNumberDivisorList, orderNumber);
        let secondCaseResult = caseSecondEval(subsetsList, orderNumber);
        if (firstCaseResult > orderNumber && secondCaseResult < orderNumber) {
            let apiResponse = {
                status: 200,
                sumOfDivisorsList: firstCaseResult,
                sumOfSubsetList: secondCaseResult,
                status_message: "Conditions passed successfully"
            }
            res.send(apiResponse);
        } else if (firstCaseResult > orderNumber && secondCaseResult > orderNumber) {
            let apiResponse = {
                status: 200,
                sumOfDivisorsList: firstCaseResult,
                sumOfSubsetList: secondCaseResult,
                status_message: "Second condition is voilated"
            }
            res.send(apiResponse);
        } else if (firstCaseResult < orderNumber) {
            let apiResponse = {
                status: 200,
                sumOfDivisorsList: firstCaseResult,
                sumOfSubsetList: secondCaseResult,
                status_message: "First condition is voilated"
            }
            res.send(apiResponse);
        }
    } else {
        let apiResponse = {
            status: 404,
            status_message: "Order number is required to find the best beer"
        }
        res.send(apiResponse);
    }
}

let divisor = (orderNumber) => {
    let orderNumberDivisorList = [];
    [...Array(orderNumber + 1).keys()].slice(1)
        .reduce((s, a) => {
            var divisor = !(orderNumber % a) && a;
            if (divisor && divisor < orderNumber) {
                orderNumberDivisorList.push(divisor);
            }
            return s + divisor;
        }, 0);
    console.log(orderNumberDivisorList)
    return orderNumberDivisorList;
}

let divisorSubsets = (divisorList, orderNumber) => {
    let subsetList = [];
    divisorList.forEach(element => {
        if (element > 1 && orderNumber % element == 0) {
            subsetList.push(element)
        }
    });
    return subsetList;
}

let caseFirstEval = (orderNumberDivisorList, orderNumber) => {
    let sumOfDivisorList = orderNumberDivisorList.reduce((elem, elem1) => elem + elem1, 0);
    return sumOfDivisorList
    // if(sumOfDivisorList > orderNumber) {
    //     return true;
    // } else {
    //     return false;
    // }
}

let caseSecondEval = (subsetList, orderNumber) => {
    let sumOfSubsetList = subsetList.reduce((elem, elem1) => elem + elem1, 0);
    return sumOfSubsetList;
    // if(sumOfSubsetList > orderNumber) {
    //     return false;
    // } else {
    //     return true;
    // }
}

let evaludateEquation = (equationObject) => {
    let rhsEvaluation = (equationObject.rhs + (BODMASS_evaluation(equationObject.lhs.op)) + equationObject.lhs.lhs);
    var lhsSolver = new Solver({
        lhsValue: rhsEvaluation,
    });
    let value = lhsSolver.solve({
        lhsValue: rhsEvaluation,
    })
    let rhsEvaluation2 = (value.lhsValue + (BODMASS_evaluation(equationObject.lhs.rhs.op) + equationObject.lhs.rhs.rhs));
    var rhsSolver = new Solver({
        lhsValue: rhsEvaluation2,
    });
    let finalValue = rhsSolver.solve({
        lhsValue: rhsEvaluation2,
    })

    return finalValue.lhsValue;
}

let operatorEvaluation = (operator) => {
    if (operator == "equal") {
        return "=";
    } else if (operator == "add") {
        return "+";
    } else if (operator == "multiply") {
        return "*";
    } else if (operator == "subtract") {
        return "-";
    } else if (operator == "divide") {
        return "/";
    }
}

let BODMASS_evaluation = (operation) => {
    if (operation == "add") {
        return `-`;
    } else if (operation == "multiply") {
        return "/";
    } else if (operation == "subtract") {
        return "+";
    } else if (operation == "divide") {
        return "*";
    }
}

module.exports = {
    smartEquationEvaluator,
    bestBearEvaluator
}