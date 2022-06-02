//Recuperation de l'élément des canapés
let items = document.getElementById("items");
let errorProducts = document.getElementById('errorProducts');

// cette fonction est utile pour afficher les produits demandés , ici on en demande que 8,
// et la boucle sert à afficher le nombre de produit sur la page d'accueil
function afficher (products){
    for(let i = 0; i<products.length;i++) {
        let a = document.createElement("a");
        let canapArticle = document.createElement("article");
        let canapImg = document.createElement("img");
        let canapH3 = document.createElement("h3")
        let canapP = document.createElement ("p");
        canapP.classList.add('productDescription');
        canapH3.classList.add('productName');
        canapArticle.appendChild(canapImg)
        canapArticle.appendChild(canapH3)
        canapArticle.appendChild(canapP)
        a.appendChild(canapArticle)
//"a.href"permet de rediriger le produit vers la page produit
        a.href = "./product.html?id="+products[i]._id;
        canapImg.src = products[i].imageUrl; 
        canapH3.textContent = products[i].name;
        canapP.textContent = products[i].description;
        items.appendChild(a);
    }
}

// Affiche les produits dans la page d'accueil
// On recupère les produits dépuis l'api
function getKanaps (url) {
fetch(url)
   // use response of network on fetch Promise resolve
   .then(response => {
        return response.json();
    })
    .then(canapes => {
        if(canapes!==null || canapes!== undefined) {
            afficher (canapes);
        } else {
            // Si canapes vide afficher le message d'erreur
            errorProducts.innerText = "Erreur de chargement"
        }
    })
   // Si erreur afficher le message d'erreur
   .catch(error => errorProducts.innerText = "Erreur de chargement");
}
getKanaps("http://localhost:3000/api/products");

