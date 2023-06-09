window.addEventListener("load", function() {


    document.getElementById("inp-pret").onchange=function(){
        document.getElementById("infoRange").innerHTML=`(${this.value})`
    }


    document.getElementById("filtrare").onclick= function(){
        let val_nume=document.getElementById("inp-nume").value.toLowerCase();

        let radiobuttons=document.getElementsByName("gr_rad");
        let val_calorii;
        for(let r of radiobuttons){
            if(r.checked){
                val_calorii=r.value;
                break;
            }
        }

        var cal_a, cal_b;
        if(val_calorii!="toate")
        {
            [cal_a, cal_b]=val_calorii.split(":");
            cal_a=parseInt(cal_a);
            cal_b=parseInt(cal_b);
        }

        let val_pret=document.getElementById("inp-pret").value;

        let val_categ=document.getElementById("inp-categorie").value;

        var produse=document.getElementsByClassName("produs");

        for (let prod of produse){
            prod.style.display="none";
            let nume=prod.getElementsByClassName("val-nume")[0].innerHTML.toLowerCase();
            let cond1= (nume.startsWith(val_nume));
            let calorii=parseInt(prod.getElementsByClassName("val-calorii")[0].innerHTML);
            let cond2= (val_calorii=="toate" || cal_a<=calorii && calorii <cal_b);
            let pret=parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML);
            let cond3= (pret>=val_pret);

            let categorie=prod.getElementsByClassName("val-categorie")[0].innerHTML;
            let cond4= ( val_categ=="toate" ||  val_categ==categorie)

            if(cond1 && cond2 && cond3 && cond4){
                prod.style.display="block";
            }
        }
    }

    document.getElementById("resetare").onclick= function(){
                
        document.getElementById("inp-nume").value="";
        
        document.getElementById("inp-pret").value=document.getElementById("inp-pret").min;
        document.getElementById("inp-categorie").value="toate";
        document.getElementById("i_rad4").checked=true;
        var produse=document.getElementsByClassName("produs");
        document.getElementById("infoRange").innerHTML="(0)";
        for (let prod of produse){
            prod.style.display="block";
        }
    }
    function sortare (semn){
        var produse=document.getElementsByClassName("produs");
        var v_produse= Array.from(produse);
        v_produse.sort(function (a,b){
            let pret_a=parseFloat(a.getElementsByClassName("val-pret")[0].innerHTML);
            let pret_b=parseFloat(b.getElementsByClassName("val-pret")[0].innerHTML);
            if(pret_a==pret_b){
                let nume_a=a.getElementsByClassName("val-nume")[0].innerHTML;
                let nume_b=b.getElementsByClassName("val-nume")[0].innerHTML;
                return semn*nume_a.localeCompare(nume_b);
            }
            return semn*(pret_a-pret_b);
        });
        for(let prod of v_produse){
            prod.parentElement.appendChild(prod);
        }
    }
    document.getElementById("sortCrescNume").onclick=function(){
        sortare(1);
    }
    document.getElementById("sortDescrescNume").onclick=function(){
        sortare(-1);
    }

    //onkeyup, onkeypress
    //se poate detecta apasarea shift/ctrl/alt
    //poate fi util un switch     
    window.onkeydown= function(e){
        if(e.key == "c" && e.altKey){
            if(document.getElementById("info-suma")){
                return;
                //daca exista suma deja, ies din functie
            }
            
            var produse = document.getElementsByClassName("produs");
            let suma = 0;
            //vreau sa iau doar produsele care nu au display none!!
            for(let prod of produse){
                //afiseaza suma doar pt produselel vizibile
                if(prod.style.display != "none"){
                    let pret = parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML);
                    suma += pret;
                }
            }
            let p = document.createElement("p"); //vreau sa creez un paragraf -> "p"
            p.innerHTML = suma;
            
            p.id = "info-suma";

            //trebuie push si in arbore html-ul
            //containerul e defapt un nod parinte (parintele continutului)
            ps = document.getElementById("p-suma");
            container = ps.parentNode;//id-ul +1?
            //ma duc la fratele mai din dreapta si inserez in fata lui, care e dupa ps
            frate=ps.nextElementSibling;
            container.insertBefore(p, frate);
        
            //pana aici pot crea mai multe paragrafe si as vrea si sa dispara dupa o secunda
            //setTimeout -> dupa x ms ceva se intampla
            //setInterval(f, 1500) -> face f() la fiecare secunda jumate
            //clearInterval -> opreste setInterval

            //cum simulez set interval cu set timeout -> fac f() "recursiva" (sa se autoapeleze)
            setTimeout(function(){
                let info = document.getElementById("info-suma");
                if(info){
                    info.remove();
                }
                //pun elementul in info si daca exista (dupa o sec ) il sterg
            }, 1000) //la o secunda se intampla functia

            //vreau sa apara si sa dispara fara sa miste mai sus/jos produsele

            //task: afisarea pretului intr-ul element cu position fixed 
            //care nu afecteaza containerul in care se gasesete
        }
    }
})