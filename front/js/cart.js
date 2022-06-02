let containerQty = document.createElement('p')

// Récupération de formulaire à vérifier
let form = document.getElementsByClassName('cart__order__form');
containerQty.innerHTML='Total (<span id="totalQuantity"><!-- 2 --></span> articles) : <span id="totalPrice"><!-- 84,00 --></span> €';
let cart = document.getElementsByClassName('cart');
let containerCart = document.getElementById('cartAndFormContainer');
let cart__items = document.getElementById("cart__items");
let errorNoProducts = document.createElement('div');
errorNoProducts.id = "no_products_error";
errorNoProducts.innerHTML = 'Votre panier est vide. Veuillez continuer votre achat dans la  <a href="./index.html">Boutique</a>'
let totalCart = 0;
let qtyArticles = 0;
// Liste des produits dans le localStorage
let productsStorage = JSON.parse(localStorage.getItem('Products'));
let elementShowOrderId = document.getElementById('orderId');

//--> enregistrement d'un changement de quantité de la part de l'utilisateur
// Récupération de la classe pour les inputs de champs quantité
let choiceQty = document.getElementsByClassName('itemQuantity');
let kanapPrices = [];

let arr = Array.prototype.slice.call(choiceQty);


//Afficher les produits
function displayCart(products) {
    if(products) {
        for (let product of products) {
            totalCart += product.price;
            qtyArticles += parseInt(product.qty);
            let articleKanap = document.createElement("article");
            articleKanap.classList.add('cart__item');
            // Ajout id pour chaque item
            articleKanap.setAttribute('data-id', product.id)
            articleKanap.setAttribute('data-color', product.color)
            cart__items.appendChild(articleKanap);
            let divImg = document.createElement("div");
            divImg.classList.add('cart__item__img');
            articleKanap.appendChild(divImg)
            let imgKanap = document.createElement("img");
            imgKanap.src = product.img;
            divImg.appendChild(imgKanap)
            //Pour imgKanap, ne pas oublier de faire "imgKanap.src = ...[i].imageUrl;"
            let divContent = document.createElement("div");
            divContent.classList.add('cart__item__content');
            articleKanap.appendChild(divContent);

            let divDescription = document.createElement("div");
            divDescription.classList.add('cart__item__content__description');
            divContent.appendChild(divDescription)

            let h2Kanap = document.createElement("h2");
            h2Kanap.innerText = product.name;
            divDescription.appendChild(h2Kanap)
            let pKanap = document.createElement("p");
            pKanap.innerText = product.color;
            let prceKanap = document.createElement("p");
            prceKanap.innerText = product.price + "  €";
            divDescription.appendChild(pKanap);
            divDescription.appendChild(prceKanap);

            let cartItemContentSettings = document.createElement("div");
            cartItemContentSettings.classList.add("cart__item__content__settings");
            divContent.appendChild(cartItemContentSettings);

            let cartItemContentSettingsQty = document.createElement("div");
            cartItemContentSettingsQty.classList.add("cart__item__content__settings__quantity");
            cartItemContentSettings.appendChild(cartItemContentSettingsQty);

            let qty = document.createElement("p");
            qty.innerText = "Qté :";
            let inputItemQty = document.createElement("input");
            inputItemQty.setAttribute("type", "number");
            inputItemQty.setAttribute("name", "itemQuantity");
            inputItemQty.setAttribute("class", "itemQuantity");
            inputItemQty.setAttribute("min", "1");
            inputItemQty.setAttribute("max", "100");
            inputItemQty.setAttribute("value", product.qty);

            cartItemContentSettingsQty.appendChild(qty);
            cartItemContentSettingsQty.appendChild(inputItemQty);

            let deleteItem = document.createElement("div");
            deleteItem.classList.add("cart__item__content__settings__delete");
            let delteteP = document.createElement("p");
            delteteP.classList.add("deleteItem");
            delteteP.textContent = "Supprimer";
            deleteItem.appendChild(delteteP);

            cartItemContentSettings.appendChild(deleteItem);
        }
        cart__items.appendChild(containerQty);
    }
}
if(productsStorage !== undefined || productsStorage.length !== 0) {
    if(productsStorage !== null) {
        displayCart(productsStorage);
    } else {
        cart__items.appendChild(errorNoProducts);
        cart__items.appendChild(containerQty);
        let contactForm = document.getElementsByClassName("cart__order");
        contactForm[0].remove()
    }
} else {
    cart__items.appendChild(errorNoProducts);
    cart__items.appendChild(containerQty);
    let contactForm = document.getElementsByClassName("cart__order");
    contactForm[0].style.visibility = "hidden";
}

let totalPrice = document.getElementById('totalPrice');
let totalArticles = document.getElementById('totalQuantity');
if(totalPrice && totalPrice) {
    totalPrice.textContent = totalCart;
    totalArticles.innerText = qtyArticles;
}


//Changement de quantité 

const onChange = function() {

    arr.forEach(function(el) {
        result = result + +el.value;
    });

};

function getTotal() {
    let total = 0;
    let result = 0;
    let finalProducts = JSON.parse(localStorage.getItem('Products'));
    for (let product of finalProducts) {
        total += product.qty * product.price;
        result += product.qty;
    }
    totalArticles.innerText = result;
    return total;
}


// La boucle pour parcourir chaque input
for (let item of choiceQty) {
    // Ecoute l'événement lors du changement de quantité
    item.addEventListener("change", function(e) {
        let closetElementData = item.closest(".cart__item");
        // Récupération de l'id et couleur de canapé
        let idElementData = closetElementData.getAttribute("data-id");
        let colorElementData = closetElementData.getAttribute("data-color");
        // onChange();

        // Boucle pour parcourir et modifier le canapé avec l'id et couleur
        for (let i = 0; i < productsStorage.length; i++) {
            if (colorElementData === productsStorage[i].color && idElementData === productsStorage[i].id) {
                productsStorage[i].qty = parseInt(item.value);
                localStorage.setItem('Products', JSON.stringify(productsStorage));
            }
        }
        document.getElementById('totalPrice').innerText = getTotal();
    });
}
//Suppression dans le panier
let deleteIitem = document.getElementsByClassName('deleteItem');

  for (let item of deleteIitem) {
    item.addEventListener("click", function(e) {
      if (confirm("Vous êtes sur que vous voulez supprimer cet article? ")) {
        // Code à éxécuter si le l'utilisateur clique sur "OK"
        let closetElementData = item.closest(".cart__item");
        let idElementData = closetElementData.getAttribute("data-id");
        let colorElementData = closetElementData.getAttribute("data-color");
        closetElementData.remove();
        for (let i = 0; i < productsStorage.length; i++) {
            if (colorElementData === productsStorage[i].color && idElementData === productsStorage[i].id) {
                productsStorage.splice(i, 1);
                localStorage.setItem('Products', JSON.stringify(productsStorage));
            }
          }
          if(productsStorage.length === 0) {
              form[0].remove();
              errorNoProducts.remove();
              cart__items.appendChild(errorNoProducts)
              cart__items.appendChild(containerQty);
              totalPrice.textContent = 0;
              totalArticles.innerText = 0;
            localStorage.removeItem("Products");
        }
      } 
    });
  }



// L'objet avec les informations de contact
let contact = {
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    email: ""
}

let products = [];

if(productsStorage) {
    for (let product of productsStorage) {
        products.push(product.id)
    }
}

let order = {
    contact,
    products,
}

// Lancer la vérification en cliquant le boutton commander
if(form[0]) {
    form[0].addEventListener("submit", function(event) {
        verifyContactForm(event);
        event.preventDefault();
    });    
}

// Afficher le message d'erreur grace à son id
const showErrorMsg = (id, msgError) => {
    let elementErr = document.getElementById(id);
    elementErr.innerText = msgError;
}

// Cacher le message d'erreur grace à son id
const hideMsgError = (id) => {
    let elementErr = document.getElementById(id);
    elementErr.innerText = '';
}

// Analyse des données saisies par l'utilisateur 

// La fonction pour verifier les élements entrées par l'utilisateur
const verifyContactForm = (event) => {
    // Recupération des valeurs grace target de eventlistener et name
    let firstName = event.target.elements["firstName"].value;
    let lastName = event.target.elements["lastName"].value;
    let address = event.target.elements["address"].value;
    let city = event.target.elements["city"].value;
    let email = event.target.elements["email"].value;

    // Verification si les champs sont correctement renseignés
    if (firstName.length > 0 && firstName.length <= 50) {
        if (checkRulesReg(firstName, /^[A-Za-z]+([\ A-Za-z]+)*/) === true) {
            // Tout est bon ajout dans l'objet contact
            contact.firstName = firstName;
            // Cacher le message d'erreur
            hideMsgError(event.target.elements["firstName"].nextElementSibling.id);
        } else {
            // Regex n'est pas respecte affiche message d'erreur
            contact.firstName = false;
            event.preventDefault();
            showErrorMsg(event.target.elements["firstName"].nextElementSibling.id, "Veillez entrer le prenom correct");
        }
    } else {
        // La longuer incorrecte affiche message d'erreur
        contact.firstName = false;
        event.preventDefault();
        showErrorMsg(event.target.elements["firstName"].nextElementSibling.id, "Le champ obligatoire");
    }

    if (lastName.length > 0 && lastName.length <= 50) {
        if (checkRulesReg(lastName, /^[A-Za-z]+([\ A-Za-z]+)*/) === true) {
            // Tout est bon ajout dans l'objet contact
            contact.lastName = lastName;
            // Cacher le message d'erreur
            hideMsgError(event.target.elements["lastName"].nextElementSibling.id);
        } else {
            // Regex n'est pas respecte affiche message d'erreur
            contact.lastName = false;
            event.preventDefault();
            showErrorMsg(event.target.elements["lastName"].nextElementSibling.id, "Veillez entrer le nom correct");
        }
    } else {
        // La longuer incorrecte affiche message d'erreur
        contact.lastName = false;
        event.preventDefault();
        showErrorMsg(event.target.elements["lastName"].nextElementSibling.id, "Le champ obligatoire");
    }

    if (address.length > 0 && address.length <= 255) {
        if (checkRulesReg(address, /^[a-zA-Z0-9\s,.'-]{3,}$/) === true) {
            // Tout est bon ajout dans l'objet contact
            contact.address = address;
            // Cacher le message d'erreur
            hideMsgError(event.target.elements["address"].nextElementSibling.id);
        } else {
            // Regex n'est pas respecte affiche message d'erreur
            contact.address = false;
            event.preventDefault();
            showErrorMsg(event.target.elements["address"].nextElementSibling.id, "Veillez entrer l'address correct");
        }
    } else {
        // La longuer incorrecte affiche message d'erreur
        contact.address = false;
        event.preventDefault();
        showErrorMsg(event.target.elements["address"].nextElementSibling.id, "Le champ obligatoire");
    }

    if (city.length > 0 && city.length <= 255) {
        if (checkRulesReg(city, /^[A-Za-z]+([\ A-Za-z]+)*/) === true) {
            // Tout est bon ajout dans l'objet contact
            contact.city = city;
            // Cacher le message d'erreur
            hideMsgError(event.target.elements["city"].nextElementSibling.id);
        } else {
            // Regex n'est pas respecte affiche message d'erreur
            contact.city = false;
            event.preventDefault();
            showErrorMsg(event.target.elements["city"].nextElementSibling.id, "Veillez entrer la ville correct");
        }
    } else {
        // La longuer incorrecte affiche message d'erreur
        contact.city = false;
        event.preventDefault();
        showErrorMsg(event.target.elements["city"].nextElementSibling.id, "Le champ obligatoire");
    }

    if (email.length > 0 && email.length <= 255) {
        if (checkRulesReg(email, /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/) === true) {
            // Tout est bon ajout dans l'objet contact
            contact.email = email;
            // Cacher le message d'erreur
            hideMsgError(event.target.elements["email"].nextElementSibling.id);
        } else {
            // Regex n'est pas respecte affiche message d'erreur
            contact.email = false;
            event.preventDefault();
            showErrorMsg(event.target.elements["email"].nextElementSibling.id, "Veillez entrer l'email correct");
        }
    } else {
        // La longuer incorrecte affiche message d'erreur
        contact.email = false;
        event.preventDefault();
        showErrorMsg(event.target.elements["email"].nextElementSibling.id, "Le champ obligatoire");
    }

    if(contact.firstName!==false && 
      contact.lastName !== false &&
      contact.address !== false &&
      contact.city !== false &&
      contact.email !== false &&
      order.products.length !==0)
      {
        if(productsStorage.length!==0) {
            let checkQty = true;
            for (let item of choiceQty) {
                // console.log(item.value)
                if(item.value == 0) {
                    alert("La quantité ne doit pas être inférieure à 1")
                    checkQty = false;
                    break;
                }
            }
            if(checkQty) {
                orderProducts("http://localhost:3000/api/products/order/", order);
            }
        }
      }
}

// Function pour envoyer la commande
function orderProducts(url, order) {
    const postData = fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
    });
    // reponse de la demande
    postData.then(response => {
      console.log(response.status)
            // Si erreur afficher l'erreur dans la console
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            return response.json()
        })
        // Récupération des données postées avec l'id de la commande
        .then(json => {
            this.contact = json;
            // Envoyer sur la page avec l'id de la commande
            window.location = "./confirmation.html?id=" + this.contact.orderId;
            elementShowOrderId.innerText = this.contact.orderId;
        })
        // En cas d'erreur
        .catch(function() {
            this.dataError = true;
        })
};

// Vérification de la regle regex si c'est bon return true
const checkRulesReg = (input, ruleRegex) => {
    let checkOk = false;
    if (input.match(ruleRegex)) {
        // Si la valeur ne match avec regex return true
        checkOk = true;
    } else {
        // Si la valeur ne match pas avec regex return false
        checkOk = false;
    }
    return checkOk;
}