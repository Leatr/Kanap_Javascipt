let search_params = new URLSearchParams(window.location.search);
// SI search params a un id alors, il obtient l'Id avec L'API getKanap url , id 
if (search_params.has('id')) {
    let id = search_params.get('id');
    let idOrder = document.getElementById("orderId");
    idOrder.innerText = id;
}