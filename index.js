//CURS 12 -> LOGIN LOGOUT


//LAB 13 -> de vazut de ce nu merge!! ( la final pe la 11:20-11:30 )

// GALERIE ANIMATA -> TASK BONUS DE 45 DE PUNCTE
//      sa vad in exemplele din curs 5 -> reverse engineering 
//      se poate intampla sa am un nr schimbator de imagini -> treubie sa ma folosesc de scss
//      acolo definim procentajele cu o formula in functie de nr de imagini
//      final curs 8 -> niste comentarii ( + inceput lab 8 pt explicatiii de js si SCSS)

// am ramas pe la minutul 58 din lab 8

// sa facem un cont de gmail pt web!!

// ; de la sfarsit e optional

// VOM AVEA VIDEOCLIP:
//      mergem la cursul 1 -> cautam track (subtitrari)
//      webVTT
// plus avem si in cursrul 2 -> css -> WebVTT

// importa modulul express care face web building mai usor
// si il asigneaza unei constante 
const path=require("path")
const express = require("express");
// file system module
const fs = require("fs");
// importa modulul response din modulul express
const res = require("express/lib/response");
const sass=require('sass');
const sharp = require('sharp');
const {Client} =require('pg');
const AccessBD = require("./resurse/js/accesbd.js");

const formidable=require("formidable");
const {Utilizator}=require("./module_proprii/utilizator.js")
const session=require('express-session');
const Drepturi = require("./module_proprii/drepturi.js");

// query builder:
AccessBD.getInstanta().select({
    tabel:"merchendise",
    campuri: ["nume", "pret", "greutate"],
    conditii:[["pret>100", "greutate<0.5"], ["pret<40", "greutate<0.02"]]}, 
    function(err, rez){
        console.log(err);
        console.log(rez);
    }
)

// obiect server express 
app = express();

// /////////////////////////client -> sa ma uit pe teams pe recording//////////////////////////////

var client= new Client({database:"db_prea_tarziu",
        user:"mihail",
        password:"mihail",
        host:"localhost",
        port:5432});
client.connect();

// client.query("select * from lab8_test", function(err, rez){
//     console.log("eroare:", err);
//     console.log("rezultat:", rez);
// })

obGlobal = {
    obErori: null,
    obImagini: null,
    // nu sunt bune astea pt un motiv dar am nevoie de ele pt compilare automata
    folderScss: path.join(__dirname, "resurse/scss"),
    folderCss: path.join(__dirname, "resurse/css"),
    folderBackup: path.join(__dirname, "backup"), 
    // vreau sa generez meniul pe baza datelor din tabel -> ar putea exista elemente ce difera de la o 
    // schimbare la alta -> mereu va trebui un programator sa intre in cod la fiecare schimbare
    
    // vreau doar sa schimb baza de date (tabelul), nu si codul.
    optiuniMeniu:[],
    materiale:[]
}

client.query("select * from unnest(enum_range(null::categorii))",function(err, rezTipuri){
    // asta va fi cod executat la pornirea serverululi    
    if(err){
        console.log(err);
    }
    else{
        //vreau sa am acces la aceste tipuri din toate paginile
        obGlobal.optiuniMeniu = rezTipuri.rows;
    }
});

client.query("select * from unnest(enum_range(null::materiale))",function(err, rezTipuri){
    // asta va fi cod executat la pornirea serverululi    
    if(err){
        console.log(err);
    }
    else{
        //vreau sa am acces la aceste tipuri din toate paginile
        obGlobal.materiale = rezTipuri.rows;
    }
});

// a mers si cu mai multe foldere
// daca nu exista vrem sa il creem
vectorFoldere=["temp", "backup"]
for(let folder of vectorFoldere){
    let caleFolder = path.join(__dirname, folder);
    // let caleFolder = path.join(__dirname, folder);
    if (!fs.existsSync(caleFolder)){
        fs.mkdirSync(caleFolder);
        console.log("am creat un nou folder pt generat fisiere", caleFolder);
    }
}

// functie care compileaza scss-ul
function compileazaScss(caleScss, caleCss){
    if(!caleCss){
        let numeFisExt = path.basename(caleScss);
        let numeFis = numeFisExt.split(".")[0];
        caleCss = numeFis + ".css";
    }
    // cale scss deja exista ca incercam sa compilam scss-ul :)

    // daca nu exista o cale absoluta pun tot pe calea default
    if(!path.isAbsolute(caleScss))
        caleScss=path.join(obGlobal.folderScss, caleScss)    

    if(!path.isAbsolute(caleCss))
        caleCss=path.join(obGlobal.folderCss, caleCss)

    //cale resurse backup
    let caleResBackup=path.join(obGlobal.folderBackup, "resurse/css");
    if (!fs.existsSync(caleResBackup))
        fs.mkdirSync(caleResBackup, {recursive:true});

    let numeFisCss=path.basename(caleCss);
    if (fs.existsSync(caleCss)){
        data_curenta = new Date();
        let numeFisCssData = numeFisCss.split(".")[0] + "_" + data_curenta.toISOString().slice(0, 19) + "." + numeFisCss.split(".")[1]
        fs.copyFileSync(caleCss, path.join(obGlobal.folderBackup,"resurse/css",numeFisCssData))// +(new Date()).getTime()
    }

    // sourcemap ma ajuta sa vad linia din fisierul sass care a generat o anumita chestie din site
    rez = sass.compile(caleScss, {"sourceMap":true});
    fs.writeFileSync(caleCss, rez.css);
}
//-------------------------------------------------------compilare bootstrap--------------------------------------------------------------------------
// compileazaScss("customizare_bootstrap.scss");

// de fiecare data cand pornesc serverul sa se compileze toate fisierele scss!
v = fs.readdirSync(obGlobal.folderScss) 
// v e un array cu fiecare fisier din folderul folder.SCSS
// console.log(v);

for (let numeFisierScss of v){
    if(path.extname(numeFisierScss) == ".scss"){
        compileazaScss(numeFisierScss);
    }
}

// watch -> se uita la fisiere si verifica daca au aparut schimbari
// deci se compileaza scss doar cand apar modificari la folderul de scss
fs.watch(obGlobal.folderScss, function(eveniment, numeFis){
    console.log(eveniment, numeFis);
    // evenimente:  change (daca modific ceva)
    //              rename (adca redenumesc/creez un fisier)
    if(eveniment == "change" || eveniment == "rename"){
        // daca un fisier a fost sters tot rename primesc -> verific daca exista mai intai!!
        let caleCompleta = path.join(obGlobal.folderScss, numeFis);
        if(fs.existsSync(caleCompleta)){
            compileazaScss(caleCompleta);
            // nu e nevoie sa ii dau neaparat numele fisierului -> isi extrage el fisierul din calea data
            console.log("a fost creat un fisier nou, pe care l-am si compilat", numeFis)
        }
    } 
});


// embedded javascript
app.set("view engine", "ejs");

// in views vom pune toate templateurile pt site 
// in pagini -> pagini intregi
// in fragmente -> doar bucati de cod

// ia recursiv si directoarele din resurse
app.use("/resurse", express.static(__dirname+"/resurse"))

app.use("/node_modules", express.static(__dirname + "/node_modules"));

// asa pun in locals variabila mea cu optiuniMeniu
// problema e ca nu se mai uita in niciun alt app.use
// deoarece asta vreau sa fie in toate paginile, voi adauga parametrul next
app.use("/*", function(req, res, next){
    //o alta versiune de a pune ceva in locals
    res.locals.optiuniMeniu=obGlobal.optiuniMeniu;
    next();
    // next trece mai departe la urmatorul app.use
})

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
    res.sendFile(__dirname+"/resurse/icon/favicon.ico");
});

//pot scrie si cu wildcarduri acelasi lucru
app.get("/*.ejs", function(req, res){
    afiseazaEroare(res, 400);
});

app.get("/*.*", function(req, res){
    afiseazaEroare(res, 400);
});

app.get("/pisica", function(req, res){
    // din request obtin url-ul
    console.log("Felicitari! Ai gasit secretul acestei pagini folosind calea", req.url);
    
    res.send("<h1>Nu pot sa cred! Un secret??</h1><h2>Da! Este o pisica dansatoare!</h2><iframe src=\"https://giphy.com/embed/BK1EfIsdkKZMY\" width=\"377\" height=\"480\" frameBorder=\"0\" class=\"giphy-embed\" allowFullScreen></iframe><br>for more information click the link: <a href=\"https://pebit.github.io/\">  PisiSite </a>");
})


app.get(["/index", "/", "/home"], function(req, res){
    // fara sendfile
    // res.sendFile(__dirname+"index.html")
    // trebuie sa compileze

    // am definit (ca ex) obiectul a cu proprietatea 10 si d cu proprietatea 20
    // si obiectul ip avand in el ip-ul curent prin req.ip
    // acum pot folosi toatea astea prin locals in index.ejs (daca decomentez ce e mai jos)
    res.render("pagini/index", {ip: req.ip});
})

// // pe langa varianta asta cu copy paste, mai exista o varianta mai rapida care genereaza pagini

// // as vrea sa nu am un app.get pt fiecare pagina
// app.get("/despre", function(req, res){
//     // fara sendfile
//     // res.sendFile(__dirname+"index.html")
//     // trebuie sa compileze

//     res.render("pagini/despre");
// })

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
    // console.log("o eroare", obGlobal.obErori.info_erori[1]);

    // acum am in obiectul global obErori toate erorile mele din json
}

initializeazaErori();

//////////////////////////////////  lab7  //////////////////////////////////////
// functie similara cu initializeaza erori, folosita pentru imagini
function initializeazaImagini(){
    var continut= fs.readFileSync(__dirname+"/resurse/json/galerie.json").toString("utf-8");
    
    obGlobal.obImagini=JSON.parse(continut);
    // ceva de facut cu imagini mici si medii
    let vImagini = obGlobal.obImagini.imagini;
    
    let cale_abs = path.join(__dirname, obGlobal.obImagini.cale_galerie);
    let cale_abs_mediu = path.join(cale_abs, "mediu");
    let cale_abs_mic = path.join(cale_abs, "mic");
    if(!fs.existsSync(cale_abs_mediu)) {
        fs.mkdirSync(cale_abs_mediu);
    }

    if(!fs.existsSync(cale_abs_mic)) {
        fs.mkdirSync(cale_abs_mic);
    }

    // pt fiecare imagine din vectorul de imagini fac una mica
    // webp are un encoding mai eficient decat png si jpg
    for(let imag of vImagini){
        // astea sunt imagini mari
        [numeFis, ext] = imag.cale_relativa.split(".");
        // aici tratez fisierele de marime medie
        imag.fisier_mediu ="/" + path.join(obGlobal.obImagini.cale_galerie, "mediu", numeFis + ".webp")
        let cale_abs_fis_mediu = path.join(__dirname, imag.fisier_mediu);
    
        imag.fisier_mic ="/" + path.join(obGlobal.obImagini.cale_galerie, "mic", numeFis + ".webp")
        let cale_abs_fis_mic = path.join(__dirname, imag.fisier_mic);
        

        // sharp lucreaza pe imagini -> il folosim sa redimensionam imagini
        // by default resize ia doar width si modifica height accordingly, apoi fisierul e pus in cale_abs_fis_mediu
        sharp(path.join(cale_abs, imag.cale_relativa)).resize(500).toFile(cale_abs_fis_mediu);
        sharp(path.join(cale_abs, imag.cale_relativa)).resize(300).toFile(cale_abs_fis_mic);


        imag.cale_relativa ="/" + path.join(obGlobal.obImagini.cale_galerie, imag.cale_relativa)
    }
}

initializeazaImagini();

// daca programatorul seteaza titlul se ia cel din argument
//daca nu e setat se ia cel din json
//daca nu e setat in json se ia cel din valoarea default
//idem pt celelalte

function afiseazaEroare(res, _identificator, _titlu="Eroare nedefinita", _text , _imagine){
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
        // let titlu2 = _titlu=="Eroare nedefinita" ? (errDef.titlu || _titlu) : _titlu;
        // let text2 = _text || errDef.text;
        // let imagine2 = _imagine || obGlobal.obErori.cale_baza+"/"+errDef.imagine;

        let errDef=obGlobal.obErori.eroare_default;
        res.render("pagini/eroare.ejs", {titlu: errDef.titlu, text: errDef.text, imagine: obGlobal.obErori.cale_baza+"/"+errDef.imagine});
    }
}
 
// -------------------------------------------- PRODUSE ------------------------------------------------


// TREBUIE SA FAC CURSUL 8 PT A PUTEA VERIFICA PAGINA ASTA

// proprietati: acolate -> inseamna ca e un obiect 
//ar putea da eroare ca nu avem imaginile de pe teams,
//dar ddaca vedem textele it's okay

// pt incarcarea produselor din tabele
app.get("/produse",function(req, res){
    // acest query ajuta sa faca dropdown-ul posibil
    client.query("select * from unnest(enum_range(null::categorii))",function(err, rezCategorie){
        //query-uri imbricate pt ca nu putem folosi mereu await?
        let conditieWhere = "";
        //console.log("\n\nreq.query: ", req.query, "\n\nreq.query.tip: ", req.query.tip, "\n\n");
        if(req.query.tip){
            // pot da comenzi de js in 
            // tip produs e coloana care defineste tipul produsului
            conditieWhere = ` where categorie = '${req.query.tip}'`;
        }
        // daca nu am un wehre ramane doar select, dar daca am se concateneaza si e executata
        client.query("select * from merchendise " + conditieWhere , function( err, rez){
            if(err){
                console.log(err);
                afiseazaEroare(res, 2);
            }
            else
                // de aici sunt trimise optiunile pt dropdown
                res.render("pagini/produse", {produse: rez.rows, optiuni:rezCategorie.rows, materiale:obGlobal.materiale});
        }); 
    });
});

app.post("/inregistrare",function(req, res){
    var username;
    var poza;
    var formular= new formidable.IncomingForm()
    // dupa ce au venit toate fisierele -> se executa parsarea
    formular.parse(req, function(err, campuriText, campuriFisier ){//4
        console.log("Inregistrare:",campuriText);

        console.log(campuriFisier);
        var eroare="";

        var utilizNou=new Utilizator();
        try{
            utilizNou.setareNume=campuriText.nume;
            utilizNou.setareUsername=campuriText.username;
            utilizNou.email=campuriText.email
            utilizNou.prenume=campuriText.prenume
            
            utilizNou.parola=campuriText.parola;
            utilizNou.culoare_chat=campuriText.culoare_chat;
            utilizNou.poza= poza;
            Utilizator.getUtilizDupaUsername(campuriText.username, {}, function(u, parametru ,eroareUser ){
                if (eroareUser==-1){//nu exista username-ul in BD
                    utilizNou.salvareUtilizator();
                }
                else{
                    eroare+="Mai exista username-ul";
                }

                if(!eroare){
                    res.render("pagini/inregistrare", {raspuns:"Inregistrare cu succes!"})
                    
                }
                else
                    res.render("pagini/inregistrare", {err: "Eroare: "+eroare});
            })
            
        }
        catch(e){ 
            console.log(e);
            eroare+= "Eroare site; reveniti mai tarziu";
            console.log(eroare);
            res.render("pagini/inregistrare", {err: "Eroare: "+eroare})
        }
    });
    formular.on("field", function(nume,val){  // 1 
	
        console.log(`--- ${nume}=${val}`);
		
        if(nume=="username")
            username=val;
    }) 
    formular.on("fileBegin", function(nume,fisier){ //2
        console.log("fileBegin");
		
        console.log(nume,fisier);
		//TO DO in folderul poze_uploadate facem folder cu numele utilizatorului
        let folderUser=path.join(__dirname, "poze_uploadate",username);
        //folderUser=__dirname+"/poze_uploadate/"+username
        console.log(folderUser);
        if (!fs.existsSync(folderUser))
            fs.mkdirSync(folderUser);
        fisier.filepath=path.join(folderUser, fisier.originalFilename)
        poza=fisier.originalFilename
        //fisier.filepath=folderUser+"/"+fisier.originalFilename

    })    
    formular.on("file", function(nume,fisier){//3
        console.log("file");
        console.log(nume,fisier);
    }); 
});

// cu asta filtrez: pot pune in link ce vreau sa imi afiseze in pagina
// gelaterie&a=10&nu&stiu&ce&altceva
// app.get("/produs/:id",function(req, res){
//     console.log(req.params);
//     // vad in console log ce am in req.params si cum am ales id-ul si toate cele    
//     client.query("select * from unnest(enum_range(null::categ_prajitura))",function(err, rez){
//         // console.log(err);
//         // console.log(rez);
//         let conditieWhere = "";
//         if(req.query.tip){
//             // pot da comenzi de js in 
//             conditieWhere = ` where tip_produs = '${req.query.tip}'`;
//         }
//         // daca nu am un wehre ramane doar select, dar daca am se concateneaza si e executata
//         client.query("select * from prajituri " + conditieWhere , function( err, rez){
//             console.log(300)
//             if(err){
//                 console.log(err);
//                 afiseazaEroare(res, 2);
//             }
//             else
//                 res.render("pagini/produse", {produse: rez.rows, optiuni:[]});
//         });
//     });  
// });

app.get("/produs/:id",function(req, res){
    console.log(req.params);
   
    client.query(`select * from merchendise where id = '${req.params.id}'`, function( err, rezultat){
        if(err){
            console.log(err);
            afiseazaEroare(res, 2);
        }
        else
            res.render("pagini/produs", {prod:rezultat.rows[0]});
    });
});


// in rows-> enum range apare rezultatul {intre acolade}
// tote valorile sunt puse in stringuri. Pt a le accesa ne putem folosi de funcita unnest


// asta trebuie sa fie ultima pagina randata si trateaza toate paginile posibile
app.get("/*", function(req, res){
    //console.log("cale: ", req.url);
    // in request.url va fi tot ce scrie utilizatorul dupa /
    res.render("pagini"+req.url, {imagini: obGlobal.obImagini.imagini}, function(err, rezRandare){ 
        // pot avea dupa functie callback (functie transmisa ca parametru)
        //console.log("eroare: ", err);
        //console.log("rezultat randare: ", rezRandare);
        if(err){
            //console.log(err);
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


///////////////////////////////lab7 -> json cu imagini/////////////////////////
//exista informatii care depind de o perioada a lunii sau a anului 
//exista informatii de timp pe care va trebui sa le modificam + ceva tranzitie
//resurse/imagini/galerie -> ne punem niste imagini specifice, pe care le modificam noi dupa

///////////////////////////////////////////////////////////////////////////////