function openModal() {
    document.querySelector(".modal").style.display = "flex"
}

function closeModal() {
    document.querySelector(".modal").style.display = "none"
}

function outsideClick(e) {
    if (e.target == document.querySelector(".modal")) {
        closeModal()
    }
}

function updateCart() {
    document.querySelector(".cartCounter").innerText = shoppingCartArray.length
    let cartItemsContainer = document.querySelector("#cartItemsContainer")
    var totalPrice = 0
    if (shoppingCartArray.length == 0) {
        cartItemsContainer.innerText = "Shopping cart is empty!"
        cartItemsContainer.style["font-size"] = "5vh"
    } else {
        cartItemsContainer.innerHTML = ''
        shoppingCartArray.forEach((element, index) => {
            var newContainer = document.createElement("div")
                newContainer.className = "itemContainer"
                    var img = document.createElement("img")
                    img.src = element.image
                    var newName = document.createElement("span")
                    newName.innerText = element.name
                    var newPrice = document.createElement("span")
                    newPrice.innerText = element.price + " Souls"
                    var newRemove = document.createElement("span")
                        newRemove.innerText = 'X'
                        newRemove.className = "removeItem"
                        newRemove.onclick = function() {
                            shoppingCartArray.splice(index, 1)
                            updateCart()
                        }
                    newContainer.appendChild(img)
                    newContainer.appendChild(newName)
                    newContainer.appendChild(newPrice)
                    newContainer.appendChild(newRemove)
                    totalPrice += Number(element.price)
                cartItemsContainer.appendChild(newContainer)
        })
        
    }
    document.querySelector(".totalPrice").innerText = "Total price: " +totalPrice+ " Souls"
}

function createDetailView(index) {
    $.getJSON("./products.json", function(jsonFile) {

        document.querySelector("#main").innerHTML = ''

        var newDetail = document.createElement("div")
        newDetail.id = "detail"
        document.querySelector("#main").appendChild(newDetail)

        let detail = document.querySelector("#detail")

        var imgAndButtonContainer = document.createElement("div")
        imgAndButtonContainer.className = "imgAndButtonContainer"
        detail.appendChild(imgAndButtonContainer)

            var imgBox = document.createElement("div")
            imgBox.className = "imgBox"
            imgAndButtonContainer.appendChild(imgBox)

            var newImg = document.createElement("img");
            newImg.src = jsonFile[index].image
            imgBox.appendChild(newImg)

            var newBtton = document.createElement("button")
            newBtton.className = "detailBtton"
            newBtton.innerText = "Add to cart"
            newBtton.onclick = function() {
                shoppingCartArray.push(jsonFile[index])
                updateCart()
            }
            imgAndButtonContainer.appendChild(newBtton)

        var descriptionBox = document.createElement("div")
        descriptionBox.className = "descriptionBox"
        detail.appendChild(descriptionBox)

            var newName = document.createElement("span")
            newName.className = "name"
            newName.innerText = jsonFile[index].name;
            descriptionBox.appendChild(newName)

            var description = document.createElement("span")
            description.className = "description"
            description.innerText = jsonFile[index].description
            descriptionBox.appendChild(description)

            var newPrice = document.createElement("span")
            newPrice.className = "price"
            newPrice.innerText = "Price: " + jsonFile[index].price + " Souls";
            descriptionBox.appendChild(newPrice)
    });
}

function createProductsGrid() {
    $.getJSON("./products.json", function(jsonFile) {

        document.querySelector("#main").innerHTML = ''

        var newGrid = document.createElement("div")
        newGrid.id = "grid"
        document.querySelector("#main").appendChild(newGrid)

        jsonFile.forEach(element => {
            var newBox = document.createElement("div");
            newBox.className = "box";
            document.querySelector("#grid").appendChild(newBox)
        });

        document.querySelectorAll(".box").forEach((element, index) => {
            var newImg = document.createElement("img");
            newImg.src = jsonFile[index].image
            element.appendChild(newImg)

            var newName = document.createElement("span")
            newName.innerText = jsonFile[index].name;
            element.appendChild(newName)

            var newPrice = document.createElement("span")
            newPrice.innerText = jsonFile[index].price + " Souls";
            element.appendChild(newPrice)

            element.onclick = function() {createDetailView(index)}
        });
    });
}

function pageReload() {
    window.location.reload()
}
