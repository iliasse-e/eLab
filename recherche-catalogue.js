// Class livre
class Book {
    constructor(title, author, genre, year, editor, cote, available, rating, evaluation) {
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.year = year ;
        this.editor = editor;
        this.cote = cote;
        this.available = available;
        this.rating = rating;
        this.evaluation = evaluation;
    }
};

// Instances de la Class livre
let books = [];
fetch('https://69bfcb30-2d68-42d6-8198-7cf1391f8775.mock.pstmn.io/getBooks')
.then(res => {
    if (res.ok) {
        res.json().then(data => {
            books = data
        })
    }
    else { 
        alert("ERREUR")
    }
})


// Fonction ajouter les valeurs dans les listes déroulantes de la recherche avancée
function selectAdder (selectName, bookCategory) {
    
    let parent = document.getElementById(selectName);
    let ArrayOfOptions = [];

    for (book of books) {
        let category = book[bookCategory];
        
        if (!ArrayOfOptions.includes(category)) {
            let option = document.createElement("option");
            ArrayOfOptions.push(category);
            parent.appendChild(option);
            option.innerHTML = category;
        }
    }
}

// Création des listes déroulante de la recherche avancée
document.getElementById("editor-select").onclick = selectAdder("editor-select", "editor");
document.getElementById("genre-select").onclick = selectAdder("genre-select", "genre");
document.getElementById("author-select").onclick = selectAdder("author-select", "author");

// Fonction afficher les résultats de la recherche
function cardCreator(value, baliseType, bootstrapClass, parentId, id) {

    var element = document.createElement(baliseType);   // type de balise
    element.className = bootstrapClass;                 // Classe Bootstrap de l'élément
    element.innerHTML = value;                          // valeur contenue
    element.id = id;                                    // id HTML
    var parent = document.getElementById(parentId);     // contenant/Parent
    parent.appendChild(element)                         //
}

// Contient l'appel de la f() cardCreator
function showCards () {

    // Appel de la fonction "afficher les résultats de la recherche"
   cardCreator("", "div", "card w-50", "book-information", book.cote);
   cardCreator("", "div", "card-body", book.cote, "div2" + book.cote);
   cardCreator(book.title, "h5", "card-title", "div2"+ book.cote, "title");
   cardCreator(book.author, "h6", "card-subtitle mb-2 text-muted", "div2"+ book.cote, "author");
   cardCreator(book.genre, "p", "card-text", "div2"+ book.cote, "genre");
   cardCreator(book.year, "p", "card-text", "div2"+ book.cote, "year");
   cardCreator(book.cote, "p", "card-text", "div2"+ book.cote, "cote");

   if (book.available) {
   cardCreator("Emprunter", "button", "btn btn-outline-primary" +" , borrow", "div2"+ book.cote, "available");
        if (book.rating) {
                cardCreator("<strong>"+book.rating+"</strong>" + "/5<span>&#9733;</span>", "h6", "card-text", "div2"+ book.cote, "rating");
            }
    }
    else {
   cardCreator("Non disponible", "a", "card-subtitle mb-2 text-muted", "div2"+ book.cote, "available");
    }

    
}

// Récupérer les entrées utilisateur (dans Input ou liste déroulante)
function userResearch (classeName, number) {
    return document.getElementsByClassName(classeName)[number]
}

// La bibliothèque traite la requête utilisateur
function searchBy (number) {
    
    switch (userResearch("masthead_search" ,number).value){ // Récupération du choix du type de recherche (selon titre, auteur, genre, ...)
    case "title" :
        return book.title;
        break;
    case "author" :
        return book.author;
        break;
    case "year" :
        return book.year;
        break;
    case "cote" :
        return book.cote;
        break;
    case "genre":
        return book.genre;
        break;
    case "editor" :
        return book.editor;
        break;
    }
}

// Définit le type de recherche (simple ou avancé)
function searchType (evt, searchType) {
    
    let searchTypeIndex = 0;
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");

    for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    
    for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(searchType).style.display = "block";
    evt.currentTarget.className += " active";
   
    if (searchType==="advanced-search") {
        searchTypeIndex = 1;
    }
    else {searchTypeIndex = 0}

    return searchTypeIndex
}

// Lance la recherche et l'affichage au moment du click du bouton valider
function mySearch (bool) {
    let myAdvancedSearchType = bool;
    let resultCount = 0;
    let borrowBook = true;

    //Permet de supprimer le résultat de recherche précédent après la nouvelle recherche
    document.getElementById("book-information").remove();
    let div0 = document.getElementById("div0");

    //Création d'une nouvelle balise dans laquelle s'incrémentera le resultat recherche
    let elt = document.createElement("div");
    elt.id="book-information";
    div0.appendChild(elt);
    
    if (!myAdvancedSearchType) {
        let userInput = userResearch("userResearch", 0).value.toLowerCase();

        for (book of books) {
            if (searchBy(0).toLowerCase().includes(userInput)) {          
                resultCount += 1;
                showCards()
                }
            } 
            if (resultCount === 0) {
            elt.innerHTML = "Document non trouvé";
            }
    }
    else {  
            // Récupération de la saisie du texte utilisateur
    let userInput = userResearch("userResearch", 1).value.toLowerCase();
    let userSelect = userResearch("search-select", 0).value;
    let userSelect1 = userResearch("search-select", 1).value;
    let userSelect2 = userResearch("search-select", 2).value;

    for (book of books) {
        if (book[userResearch("search-select", 0).name].includes(userSelect) &&
            book[userResearch("search-select", 1).name].includes(userSelect1) && 
            book[userResearch("search-select", 2).name].includes(userSelect2) && 
            book.title.toLowerCase().includes(userInput)) {          
             resultCount += 1;
             showCards()
        }
    } 
    
    if (resultCount === 0) {
        elt.innerHTML = "Document non trouvé";
        }
    }
    return borrowBook
}

// Affiche la recherche simple par défaut
document.getElementById("defaultOpen").click();
