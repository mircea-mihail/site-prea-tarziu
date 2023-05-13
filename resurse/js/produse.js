///NUJ DC NU MERGE DOAR IA_L DE PE TEAMS
///asta se ia de pe teams +++ sa nu uit sa adaug sortarea de pe teams din apel din chat
//---------------------------------------- EZ bonnus --------------------------------
    // pt bonusul cu onchange -> iau 8 inputuri si onchange
    // pt fiecare input sa punem functia filtrare
    // gen pui sa se modifice direct cand apesi pe buton nu sa dai filtrare de fiecare data
        

const { all } = require("express/lib/application");

window.onload=function(){
    document.getElementById("inp-pret").onchange=function(){
        document.getElementById("infoRange").innerHTML=`(${this.val})`;
    }

    document.getElementById("filtrare").onclick = function(){
        let val_nume=document.getElementById("inp-nume").value.toLowerCase();
        let val_calorii;
        var produse=document.getElementsByClassName("produs");
        

        let gr_radio=document.getElementsByName("gr_rad");
        for(let r of gr_radio){
            if(r.checked){
                val_calorii=r.value;
                break;
            }
        }
        let val_pret = document.getElementById("inp-pret").value;
        let val_categ = document.getElementById("inp-categorie").value;

        for(let prod of produse){
            prod.style.display="none";
            let nume=prod.getElementsByClassName("val-nume")[0].innerHTML.toLowerCase();
            //cate o conditie pt fiecare filtru
            let cond1=nume.startsWith(val_nume);
            
            let cond2 = true;                
            if(val_calorii != "toate"){
                [nra, nrb]=val_calorii.split(":");

                //transforma nra si nrb din string in int
                nra = parseInt(nra);
                nrb = parseInt(nrb);
                let calorii = prod.getElementsByClassName("val-calorii")[0].innerHTML;
                calorii = parseInt(calorii);

                cond2 = (nra <= calorii && calorii < nrb);
            }

            pret=parseInt(prod.getElementsByClassName("val-pret")[0].innerHTML);
            cond3=(val_pret <= pret);
            //nu stiu totusi cat e pretul pe site

            let categorie = prod.getElementsByClassName("val-categorie")[0].innerHTML;
            let cond4 = (val_categ==categorie || val_categ=="toate");

            if(cond1 && cond2 && cond3 && cond4){
                prod.style.display="block";
            }
        }
    }

    //aici forul
    
    document.getElementById("resetare").onclick = function(){
        //resetam inputurile
        document.getElementById("inp-nume").value = "";
        document.getElementById("inp-pret").value = document.getElementById("inp-pret").min;

        document.getElementById("inp-categorie").value="toate";
        document.getElementById("i_rad4").checked=true;

        for(let prod of produse){
            //vreau sa afisez tot on reset
            prod.style.display="block";
        }
    }
}