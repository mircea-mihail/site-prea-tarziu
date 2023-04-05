// ; de la sfarsit e optional

// VOM AVEA VIDEOCLIP:
//      mergem la cursul 1 -> cautam track (subtitrari)
//      webVTT
// plus avem si in cursrul 2 -> css -> WebVTT

// importa modulul express care face web building mai usor
// si il asigneaza unei constante 
const express = require("express");

// file system module
const fs = require("fs");

// importa modulul response din modulul express
const res = require("express/lib/response");

// obiect server express 
app = express();

// 

// vectorFoldere=["temp", "temp1"]
// for(let folder of vectorFoldere){
//     //let calefolder = __dirname+"/"+folder
//     let caleFolder = path.join(__dirname, folder);
//     if (!fs.existsSync(caleFolder))
//         fs.mkdirSync(caleFolder);
// }

obGlobal = {
    obErori: null,
    obImagini: null
}

// folder proiect
console.log("proiect", __dirname);

// task 3
console.log("cale fisier", __filename);
console.log("director de lucru", process.cwd());

// dirname si process.cwd() nu sunt mereu la fel. Dirname contine calea absoluta pentru fisierul curent, pe cand 
// process.cwd() (current working directory) reprezinta directorul curent al procesului, care ar putea fi diferita
// in functie de proces 

// embedded javascript
app.set("view engine", "ejs");

// in views vom pune toate templateurile pt site 
// in pagini -> pagini intregi
// in fragmente -> doar bucati de cod

// ia recursiv si directoarele din resurse
app.use("/resurse", express.static(__dirname+"/resurse"))

//-------------------------------------------------------------------

//pt a testa / / scriu node si experimentez cu node
// node 
//"aBC/A".match(/^[a-z][A-Z]+\/[A-Z]/)

//^format$
//inseamna ca trebuie sa respecte formatul
//format 
//inseamna ca trebuie sa existe undeva in sir formatul

// ?=A
// ?=B

// / / marcheaza o expresie regulata
// se asteapta sa apara litera mica litera mare cifra

app.use(/^\/resurse(\/[a-zA-Z0-9]*)*$/, function(req,res){
    afiseazaEroare(res,403);
});


app.get("/favicon.ico", function(req, res){
    //aici pun evident calea spre favicon
    res.sendFile(__dirname+"/resurse/imagini/favicon.ico");
});

//trebuie sa stiu si cum adaug erori noi
// expresie regulata
// app.get(/ \.ejs$ /);
//asta se va potrivi pt orice se termina in .ejs

//pot scrie si cu wildcarduri acelasi lucru
app.get("/*.ejs", function(req, res){
    afiseazaEroare(res, 400);
});
// putin mai simplu decat mai sus ( orice cu extensia ejs )

//-------------------------------------------------------------------

app.get("/pisica", function(req, res){
    // din request obtin url-ul
    console.log("Felicitari! Ai gasit secretul acestei pagini folosind calea", req.url);
    
    res.send("<h1>Nu pot sa cred! Un secret??</h1><h2>Da! Este o pisica dansatoare!</h2><iframe src=\"https://giphy.com/embed/BK1EfIsdkKZMY\" width=\"377\" height=\"480\" frameBorder=\"0\" class=\"giphy-embed\" allowFullScreen></iframe>");
})

app.get(["/index", "/", "/home"], function(req, res){
    // fara sendfile
    // res.sendFile(__dirname+"index.html")
    // trebuie sa compileze

    // am definit (ca ex) obiectul a cu proprietatea 10 si d cu proprietatea 20
    // si obiectul ip avand in el ip-ul curent prin req.ip
    // acum pot folosi toatea astea prin locals in index.ejs (daca decomentez ce e mai jos)
    res.render("pagini/index", {ip: req.ip});
    res.render("pagini/index");

})

// pe langa varianta asta cu copy paste, mai exista o varianta mai rapida care genereaza pagini

// as vrea sa nu am un app.get pt fiecare pagina
app.get("/despre", function(req, res){
    // fara sendfile
    // res.sendFile(__dirname+"index.html")
    // trebuie sa compileze

    res.render("pagini/despre");
})

// parsare json cu erori, transformare in string si 
function initializeazaErori(){
    var continut= fs.readFileSync(__dirname+"/resurse/json/erori.json").toString("utf-8");
    var obErori=JSON.parse(continut);

    for(let eroare of obErori.info_erori){//eroare e pe rand fiecare el al vectorului
        // de acum toate caile catre resurse incep cu / (root-ul site-ului)
        eroare.imagine="/"+obErori.cale_baza+"/"+eroare.imagine;
    }
    // obErori e vizibil doar in functie si avem nevoie de el global
    // obiectul erori din obiectul global ia valoarea obErori din initializeazaErori 
    obGlobal.obErori=obErori;

    // acum am in obiectul global obErori toate erorile mele din json
}

initializeazaErori();

// daca programatorul seteaza titlul se ia cel din argument
//daca nu e setat se ia cel din json
//daca nu e setat in json se ia cel din valoarea default
//idem pt celelalte

function afiseazaEroare(res, _identificator, _titlu="Eroare nedefinita", _text, _imagine){
    let vErori=obGlobal.obErori.info_erori;

    let eroare=vErori.find(function(elem) {return elem.identificator==_identificator;} )
    // adica daca nu e null
    if(eroare){ 
        // ca la titlu1 ... etc poate fi facut si la text si imagine...
        let titlu1 = _titlu=="Eroare nedefinita" ? (eroare.titlu || _titlu) : _titlu;
        let text1 = _text || eroare.text;
        let imagine1 = _imagine || eroare.imagine;
        // seteaza un status custom pt http daca el exista
        if(eroare.status)
            res.status(eroare.identificator).render("pagini/eroare.ejs", {titlu:titlu1, text:text1, imagine:imagine1});
        else
            res.render("pagini/eroare.ejs", {titlu:titlu1, text:text1, imagine:imagine1});
    }
    else{
        let errDef=obGlobal.obErori.eroare_default;
        res.render("pagini/eroare.ejs", {titlu:errDef.titlu, text:errDef.text, imagine:obGlobal.obErori.cale_baza+"/"+errDef.imagine});
    }
}

// asta trebuie sa fie ultima pagina randata si trateaza toate paginile posibile

app.get("/*", function(req, res){
    console.log("cale: ", req.url);
    // in request.url va fi tot ce scrie utilizatorul dupa /
    res.render("pagini"+req.url, function(err, rezRandare){ 
        // pot avea dupa functie callback (functie transmisa ca parametru)
        console.log("eroare: ", err);
        console.log("rezultat randare: ", rezRandare);
        if(err){
            console.log(err);
            // daca e eroare afisam un text
            if(err.message.startsWith("Failed to lookup view")){
                // res.send("Eroare 404");
                // eu vreau (res, identificator = 404, titlu="ceva")
                // pt a face treaba asta avem nevoie de un obiect si in loc de egal vor fi :
                afiseazaEroare(res, 404);
                // se poate face cu afisare(res, _identificator = 404, _titlu="ceva")
                // sau ceva gen dar e cam complication
            }
            else{
                // res.send("Alta eroare"); 
                afiseazaEroare(res);   
            }
        }
        else{
            // altfel trimitem pagina in sine
            res.send(rezRandare);
        }
    }); 
})


// daca dau o pagina random vreau sa apara eroarea 404, nu cannot get etc..

// daca avem mai multe pagini .html in directorul principal

// obiectul express asculta pe portul 8080
app.listen(8080);
console.log("serverul a pornit");

// acum putem face a doua pagina
