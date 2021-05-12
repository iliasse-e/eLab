// Class utilisateur
class Rate {
    constructor(name, id) {
    this.name = name;
    this.id = id;
    }
    };
    
// Instance de la Class utilisateur
let newUser = new User("Vaserely", 20001245);

function connexion () {
    let myAccount = document.getElementsByClassName("member-id");
    myAccount.innerHTML = newUser[0].name;
}