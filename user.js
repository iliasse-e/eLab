// Class utilisateur
var myBooks = []; //Les livres ajoutés dans le panier par l'utilisateur
var borrowedBooksLength = 0;
class User {
    constructor(name, surname, adress, zip, city, mail, id, password, booksBorrowed) {
    this.name = name;
    this.surname = surname;
    this.adress = adress;
    this.zip = zip;
    this.city = city;
    this.mail = mail;
    this.id = id;
    this.password = password;
    this.booksBorrowed = booksBorrowed;
    }

    borrow(book){
        for (i=0; i<books.length; i++) {
           
            if (books[i].title === book) {
                    if (books[i].available === true) {
                        books[i].available = false;
                        //myBooks.push([books[i]]);
                        //localStorage.setItem("myBooksLength", myBooks.length); // Taille du tableau dans un localStorage
                        //if (myBooks[i] != undefined) {
                        localStorage.setItem("myBooks"+i, JSON.stringify(books[i]));
                        //}
                        myBooks.push(localStorage.setItem("myBooks"+i, JSON.stringify(books[i])));
                        borrowedBooksLength++;
                        document.getElementById("cart-number-article").innerHTML = borrowedBooksLength; //Ajoute le nombre de livre dans le bouton panier
                    }
                    else {alert("Ce document est indisponible")}
            }
        }
    }
};

// Instance de la Class utilisateur
let users = []
/*    new User("Vaserely", "Jean", "7 avenue de l'Europe", 75008, "Paris", "jean.vasarely@gmail.com", 20001245, "jesuisJean", []),
    new User("Golovkin", "Gennady", "18 grossenStraat", 88500, "Wolfsburg", "gennady@golovkin.kz", 20001246, "0", [])
]*/

fetch('https://69bfcb30-2d68-42d6-8198-7cf1391f8775.mock.pstmn.io/getUsers')
.then(res => {
    if (res.ok) {
        res.json().then(data => {
            users = data
        })
    }
    else { 
        alert("ERREUR")
    }
})

// S'enregistrer ETQ nouvel utilisateur
function signIn() {
    var newUser = new User();
    for (i=0; i<8; i++) {
        newUser.name = document.getElementsByClassName("form-control")[0].value;
        newUser.surname = document.getElementsByClassName("form-control")[1].value;
        newUser.adress = document.getElementsByClassName("form-control")[5].value;
        newUser.zip = document.getElementsByClassName("form-control")[3].value;
        newUser.city = document.getElementsByClassName("form-control")[4].value;
        newUser.mail = document.getElementsByClassName("form-control")[2].value;
        newUser.id = Math.random()+Math.random() * 100000000000000000;
        newUser.password = document.getElementsByClassName("form-control")[6].value;
    }
}

// s'identifier, connecter à son compte utilisateur
var userConnected = false;
var getUserId;
var userNumber = localStorage.getItem("userIndex");

function getUser() {
    for (i=0; i<users.length; i++) {
        if (users[i].id === getUserId) {
            localStorage.setItem("userIndex", i)
            userNumber = localStorage.getItem("userIndex");
            }
    }
}

const connexion = () => {
    let userMail = document.getElementsByClassName("form-control")[8].value;
    let userPassword = document.getElementsByClassName("form-control")[9].value;
    let alertMsg = true;
 
    for (user of users) {
        if (user.mail === userMail && user.password === userPassword) {
            userConnected = true;
            document.getElementById("member-id").innerText = user.surname + " " + user.name;
            var node = document.createElement("button");
            var textnode = document.createTextNode("Déconnexion");
            node.appendChild(textnode);
            document.getElementById("member-id").appendChild(node);
            node.className = "btn btn-secondary btn-sm";

            node.onclick = () => {
                localStorage.clear()
                location.reload()
            }

            alertMsg = false;
            getUserId = user.id;
            getUser();
        }
    }
    if (alertMsg == true) {alert("Mot de passe ou identifiant erroné")}
}

// var qui servira le paramètre de la function "borrow" afin de lui dire quel livre emprunter
var titleBookName;
// Ouvre la modale pour emprunter un livre lors du click sur le bouton "emprunter" & recupère le nom du livre à envoyer à la fonction "borrow"
function borrowButtonAvailable() {
    if (document.getElementById("available")) {
        let cards = document.getElementsByClassName("borrow");

        for (i=0; i<cards.length; i++) {
            let borrowButton = document.getElementsByClassName("borrow")[i]
            let borrowButtonParent = borrowButton.parentNode;
            let borrowBookName = borrowButtonParent.firstChild.textContent;

            borrowButton.onclick = function getBookName(event) { 
                if (userConnected===true) {
                    $("#borrowModal").modal()
                    titleBookName = event.currentTarget.parentNode.firstChild.innerText;
                }
                else {
                    alert("Vous devez vous identifier avant d'emprunter un document")
                }
            }
        }; 
    };
}

//Valeur de retour pour les deux dernières fonctions (userConnected & titleBookName)

function getRow(x) {
    let index = x.parentNode.parentNode.rowIndex-1;
    console.log(index);
    alert(cart[index].title);
    for (i=0; i<books.length; i++) {                   
       /* if (books[i].title === cell1.innerHTML) {
            books[i].available = true;
        }*/
    };
    localStorage.removeItem(bookNameCart[index]);
    cart.splice(index, 1);
    table.deleteRow(index);    

    location.reload()
};

// Ajoute une fonction onlick (retirer) à chaque ligne du panier
function addOnclick(element) {
    element.setAttribute("onclick", "getRow(this)"); 
};

//Insert l'élément ajouté au panier et retire
let cart = [];
let trashes = [];
let table = document.getElementById("table-cart");
let bookNameCart = [];

//Ajoute les livres sélectionnés dans le panier à l'ouverture de la fenetre "Panier"
function addToCart () {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.includes("myBooks")) {

            cart.push(JSON.parse(localStorage.getItem(key)));
            bookNameCart.push(key)
            console.log(key)
        }
    }
}

// Affiche une "table" dans la fenetre Panier (a executer à l'aide d'un forEach)
function addTab (element) {
    let row = table.insertRow(0+cart.indexOf(element)); //Ajoute les cellules du tableau
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);
    cell1.innerHTML = element.title;
    cell2.innerHTML = element.author;
    cell3.innerHTML = element.year;
    let trash = document.createElement("button"); //Ajoute boutton "retirer" et lui lie une fonction
    cell4.appendChild(trash);
    trash.className = "btn btn-link";
    trash.innerHTML = "Retirer";
    trash.type = "button";
    trashes.push(trash);
    trashes.forEach(addOnclick);
}

function tableCart() {
    cart.forEach(addTab)
}

// Checkout panier
function checkout() {
    let titleBooks= [];
    
    for (let book = 0; book < cart.length; book++) {
    users[userNumber].booksBorrowed.push(cart[book])
    titleBooks.push(cart[book].title)
    }

    alert (
        "Vous pouvez emprunter le(s) document(s) suivant(s) : \n" + " - " + titleBooks.join('\n - ')
    )
}

