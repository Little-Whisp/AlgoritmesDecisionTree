import { DecisionTree } from "./libraries/decisiontree.js"
import { VegaTree } from "./libraries/vegatree.js"

//
// DATA
//
const csvFile = "data/diabetes.csv"
const trainingLabel = "Label"
const ignored = ["Label", "Pregnant", "Glucose", "Bp", "Skin", "Insulin", "Age"]


const display = document.getElementById("display");
const trueTrue = document.getElementById("1");
const falseTrue = document.getElementById("2");
const trueFalse = document.getElementById("3");
const falseFalse = document.getElementById("4")

//
// Laad csv data als json
//
function loadData() {
    Papa.parse("data/diabetes.csv", {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: results => trainModel(results.data)   // Gebruik deze data om te trainen
    })
}

// MACHINE LEARNING - Decision Tree
//
function trainModel(data) {

    // todo : splits data in traindata en testdata
    data.sort(() => (Math.random() - 0.5))

    let trainData = data.slice(0, Math.floor(data.length * 0.8))
    let testData = data.slice(Math.floor(data.length * 0.8) + 1)


    // maak het algoritme aan
    let decisionTree = new DecisionTree({
        ignoredAttributes: ignored,
            trainingSet: trainData,
            categoryAttr: trainingLabel,
            maxTreeDepth: 4
    })


    // Teken de boomstructuur - DOM element, breedte, hoogte, decision tree
    let visual = new VegaTree('#view', 800, 400, decisionTree.toJSON())

    let amountCorrect = 0;

    let predictedDiabetesDiabetes = 0;
    let predictedDiabetesHealthy = 0;
    let predictedHealthyHealthy = 0;
    let predictedHealthyDiabetes = 0;
    for (let row of testData) {
        let prediction = decisionTree.predict(row)
        if (prediction == row.Label) {
            amountCorrect++
        }
        if (prediction == 1 && row.Label == 1) {
            predictedDiabetesDiabetes++
        }
        if (prediction == 1 && row.Label == 0) {
            predictedDiabetesHealthy++
        }
        if (prediction == 0 && row.Label == 0) {
            predictedHealthyHealthy++
        }
        if (prediction == 0 && row.Label == 1) {
            predictedHealthyDiabetes++
        }
    }



    // todo : maak een prediction met een sample uit de testdata
    let accuracy = amountCorrect / testData.length
    console.log(accuracy)
    display.innerText = `Accuracy: ${accuracy}`;



    // todo : bereken de accuracy met behulp van alle test data
    trueTrue.innerText = `${predictedDiabetesDiabetes}`;
    trueFalse.innerText = `${predictedDiabetesHealthy}`;
    falseTrue.innerText = `${predictedHealthyHealthy}`;
    falseFalse.innerText = `${predictedHealthyDiabetes}`;


    //Save
    let json = decisionTree.stringify()
    console.log(`JSON: ${json}`)
}


loadData()