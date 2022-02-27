const jsonFile = require("./products.json")

for (let index = 0; index < jsonFile.length; index++) {
    const element = jsonFile[index];
    element.image = "./images/";
}

console.log(JSON.stringify(jsonFile))

