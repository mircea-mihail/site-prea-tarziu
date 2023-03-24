// pt a accesa site-ul

// localhost:8080/despre
// localhost:8080/index

// pt erori am un folder json cu erori.json

// ; de la sfarsit e optional

// VOM AVEA VIDEOCLIP:
//      mergem la cursul 1 -> cautam track (subtitrari)
//      webVTT
// plus avem si in cursrul 2 -> css -> WebVTT

const express = require("express");
const fs = require("fs");

const res = require("express/lib/response");

app = express();

obGlobal = {
    obErori: null,
    obImagini: null
}

// folder proiect
console.log("proiect", __dirname);



app.set("view engine", "ejs");

// in views vom pune toate templateurile pt site 
// in pagini -> pagini intregi
// in fragmente -> doar bucati de cod

// ia recursiv si directoarele din resurse
app.use("/resurse", express.static(__dirname+"/resurse"))

app.get("/ceva", function(req, res){
    // din request obtin url-ul
    console.log("cale: ", req.url);
    
    // tot din request pot obtine ip-uri, dar discutia e mai lunga
    // aici va fi ip-ul clientului 
    res.send("<h1>ceva<h1> ip:"+req.ip);
})

// trebuie sa accesez si / pt ceva.. problema e ca nu vrem sa facem 100 de app.geturi

// vrem sa ascundem extensiile 

// [ vector cu aliasuri unde sa se uite appgetul ]

// req e request si res e result
app.get(["/index", "/", "/home"], function(req, res){
    // fara sendfile
    // res.sendFile(__dirname+"index.html")
    // trebuie sa compileze

    // am zis pagini ca stie el unde sa se uite (in views) si atunci ii zic direct unde in views sa se uite

    // am zis pagini ca stie el unde sa se uite (in views) si atunci ii zic direct unde in views sa se uite
    // req.ip e un fel de dictionar? 
    // in css: {proprietati intre acolade}
    // practic am facut proprietatea ip: cu valoarea req.ip.
    // am definit (ca ex) obiectul a cu proprietatea 10 si d cu proprietatea 20
    // acum pot folosi toatea astea prin locals in index.ejs
    res.render("pagini/index", {ip: req.ip, a: 10, b:20});
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
    // for(let i=0; i < obErori.info_erori.length; i++)
    // {

    // }
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

// toate argumentele pot fi null ( afiseazaEroare() )
function afiseazaEroare(res, identificator, titlu, text, imagine){
    // fiecare eroare are cate un identificator
    // daca vreau sa fac un overwrite la titlu sau text sau imagine 
    // pot face aici la afisare

    // cand primesc identificatorul trebuie sa ma uit in obErori sa vad daca exista 
    // identificatorul meu -> pot fie cu un for si if, sau cu o functie array -> find()
    // find primeste ca parametru o functie cu iesire tru esau false

    // identificatorul din elemErreste egal cu identificatorul din afiseaza eroare (functia curenta)
    let eroare = obGlobal.obErori.info_erori.find(function(elemErr){return elemErr.identificator==identificator});
    
    // eroare poate fi null asa ca zicem if eroare (!= null)
    if(eroare){
        // am sters aici niste varuri ...
        
        // nu am setat inca un status pt paginile mele: dam un mesaj cu statusul site-ului printr-un cod
        if(eroare.status){
            // in momentul asta as putea randa eroarea
            // proprietatea titlu ia valoarea variabilei titlu de mai sus
            
            res.status(eroare.identificator).render("pagini/eroare", {titlu: var_titlu, text: var_text, imagine: var_imagine});
        }
        else{
            // daca e eroare custom(fara status cunoscut) randez normal (daca e un identificator necunoscut)
            res.render("pagini/eroare", {titlu: var_titlu, text: var_text, imagine: var_imagine});
        }
    }
    else{
        res.render("pagini/eroare", {
            titlu: obGlobal.obErori.eroare_default.titlu,
            text: obGlobal.obErori.eroare_default.text,
            imagine: obGlobal.obErori.eroare_default.imagine
        });
    }
}

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
                afiseazaEroare(res, 404);
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

app.listen(8080);
console.log("serverul a pornit");

// acum putem face a doua pagina
