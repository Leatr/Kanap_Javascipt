let search_params = new URLSearchParams(window.location.search);
let imgContainer = document.getElementsByClassName("item__img");

let productNamePrice = document.getElementsByClassName("item__content__titlePrice");
let titleId = document.getElementById("title");
let priceId = document.getElementById("price");
let descriptionKanap = document.getElementsByClassName("item__content__description");
let descriptionTitle = document.getElementsByClassName("item__content__description__title")
let description = document.getElementById("description");

//valeur  pour les couleurs (faire un array of string  )//
let settingColor = document.getElementsByClassName("item__content__settings__color");
let colorsSelect = document.getElementById("colors");
let quantity = document.getElementById("quantity");
//btn pour la redirection vers le panier
let btnAddPanier = document.getElementById("addToCart");


function afficherKanap(product) {
    // On affecte l'id du produit dans l'objet
    let img = document.createElement('img');
    img.src = product.imageUrl;
    title.innerText = product.name;
    price.innerText = product.price;
    description.innerText = product.description;
    let colors = product.colors;

    for (let i = 0; i < colors.length; i++) {
        let optionColor = document.createElement("option");
        optionColor.value = colors[i];
        optionColor.innerText = colors[i];
        colorsSelect.appendChild(optionColor);
    }
    imgContainer[0].appendChild(img);
    productNamePrice[0].appendChild(titleId);
    descriptionTitle[0].appendChild(description);
}

// Création de tableau vide avec l'id, quantité et couleur
let jsonProducts = [];

//fonction addToCart est un objet qui contient
// les elements du produit pour le panier
function addToCart(product) {
    let pdt = {
        id: product._id,
        qty: parseInt(quantity.value),
        color: colors.value,
        price: product.price,
        img: product.imageUrl,
        name: product.name
    }
    addLocalStorage(pdt);
}

// Function pour ajouer les canapés dans localStorage
const addLocalStorage = (pdt) => {
    //S'il y a pas de produits dans local storage on le crée
    if (!localStorage.getItem('Products')) {
        if(pdt.color.length !== 0 && pdt.qty !== 0) {
          window.location = "./cart.html";
          jsonProducts.push(pdt);
          localStorage.setItem('Products', JSON.stringify(jsonProducts));
        } else {
          alert("Choisissez la quantité et la couleur");
        }
    } else {
        // S'il y a des produits on ajoute un nouveau dans la liste
        // On récupère le localstorage avec getItem
        jsonProducts = JSON.parse(localStorage.getItem('Products'));
        //Si le produit q'on veut ajouter existe pas alors on l'ajoute

        if (!checkIfExist(jsonProducts, pdt)) {
          if(pdt.color.length !== 0 && pdt.qty !== 0) {
            window.location = "./cart.html";
            jsonProducts.push(pdt);
            localStorage.setItem('Products', JSON.stringify(jsonProducts));
          } else {
            alert("Choisissez la quantité et la couleur");
          }
            //Sinon si le produit existe on verifie si c'est la même couleur 
        } else if (checkIfExist(jsonProducts, pdt)) {
          if(pdt.color.length !== 0 && pdt.qty !== 0) {
            // findIndex permet de vérifier si la couleur correspond à celle qu'on veut ajouter
            // Si cela correspond elle retourne un index de produit qui correspond
            let productIndexColor = jsonProducts.findIndex((product => product.color === pdt.color));
            //Si la couleur est la même que dans la liste alor ajouter que la quantité
            // -1 est ce qui est retourné par findIndex en cas si la couleur est pas trouvé
            if (productIndexColor !== -1) {
                // on additionne la quantité au produit
                jsonProducts[productIndexColor].qty += parseInt(pdt.qty);
                jsonProducts[productIndexColor].price = parseInt(jsonProducts[productIndexColor].qty) * parseInt(pdt.price);
                localStorage.setItem('Products', JSON.stringify(jsonProducts));
                // Si c'est pas la même couleur alors on ajoute un nouveau 
            } else {
                window.location = "./cart.html";
                jsonProducts.push(pdt);
                localStorage.setItem('Products', JSON.stringify(jsonProducts));
            }
          } else {
            alert("Choisissez la quantité et la couleur");
          }
        } 
    }
}

// La fonction vérifie si le produit q'on veut ajouter n'existe pas déjà
// S'il existe la fonction retourne true
const checkIfExist = (jsonProducts, pdt) => {
    let isExist = false;
    // On parcours la liste de local storage
    for (let i = 0; i < jsonProducts.length; i++) {
        // Vérification si le même ID
        if (pdt.id === jsonProducts[i].id) {
            isExist = true;
        }
    }
    return isExist;
}

//fonction getKanap url + id -> fetch contient url + id, alors, il retourne la réponse en format Json
function getKanap(url, id) {
    fetch(url + id).then(response => {
        return response.json();
    }).then(canape => {
      // console.log(Object.entries(canape).length)
      if(canape !== undefined && canape.length || Object.entries(canape).length !== 0) {
        // Les détails du produit est écoutés au clique pour rediriger vers le panier 
        afficherKanap(canape);
      } else {
        // Erreur si pas de canapé
        errorProuct();
      }
        btnAddPanier.addEventListener("click", function(e) {
            addToCart(canape);
        })
    })   
    // Erreur si pas de canapé
    .catch(error => errorProuct());
}

// SI search params a un id alors, il obtient l'Id avec L'API getKanap url , id 
if (search_params.has('id')) {
    let id = search_params.get('id');
    getKanap("http://localhost:3000/api/products/", id);
}

const errorProuct = () => {
  let itemContent = document.getElementsByClassName("item");
  itemContent[0].removeChild(itemContent[0].childNodes[1]);
  itemContent[0].textContent = "Produit n'existe pas";
}

