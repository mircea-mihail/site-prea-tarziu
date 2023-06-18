window.addEventListener("load", function() {
    var v_produse_original_order = null;
    document.getElementById("inp-nume").placeholder = document.getElementsByClassName("produs")[0].getElementsByClassName("val-nume")[0].innerHTML.split(" ")[0] + 
        " " + document.getElementsByClassName("produs")[0].getElementsByClassName("val-nume")[0].innerHTML.split(" ")[1];
    document.getElementById("inp-cuvant-desc").placeholder = document.getElementsByClassName("produs")[0].getElementsByClassName("val-descriere")[0].innerHTML.split(" ")[1];

    
    document.getElementById("inp-pret").onchange=function(){
        document.getElementById("infoRange").innerHTML=`(${this.value})`
    }

    document.getElementById("filtrare").onclick= function(){
        let empty_display = document.getElementById("nu_exista_produse");
        empty_display.style.display="none";
        let val_nume=document.getElementById("inp-nume").value.toLowerCase();
        console.log(val_nume[0])
        let radiobuttons=document.getElementsByName("gr_rad");
        let durata_garantiei;
        for(let r of radiobuttons){
            if(r.checked){
                durata_garantiei=r.value;
                break;
            }
        }
        
        var inceput_garantie, sfarsit_garantie;
        if(durata_garantiei!="toate")
        {
            [inceput_garantie, sfarsit_garantie]=durata_garantiei.split(":");
            inceput_garantie=parseInt(inceput_garantie);
            sfarsit_garantie=parseInt(sfarsit_garantie);
        }

        let something_to_display = false;

        let val_pret=document.getElementById("inp-pret").value;
        let val_categ=document.getElementById("inp-categorie").value;

        let v_materiale = [];
        for( checked_material of document.getElementById("inp-materiale")){
            if(checked_material.selected){
                v_materiale.push(checked_material.value);
            }
        }
        var produse=document.getElementsByClassName("produs");
        
        let cuvant_descriere=document.getElementById("inp-cuvant-desc").value; 
        let checkbox = document.getElementById("inp-checkbox");
        let data_curenta = new Date;

        let culoare_produs = document.getElementById("inp-culori").value;

        let zile_considerate_noutate = 7;
        for (let prod of produse){
            prod.style.display="none";
            
            let cond1 = true;
            if(val_nume != null){
                document.getElementById("inp-nume").style.backgroundColor = "white";
                let nume=prod.getElementsByClassName("val-nume")[0].innerHTML.toLowerCase();
                cond1= (nume.startsWith(val_nume));    
            }
            if(val_nume.startsWith(".") || val_nume.startsWith(",") || val_nume.startsWith(" ")){
                cond1 = true;
                document.getElementById("inp-nume").style.backgroundColor = "red";
            }
            
            let garantie=parseInt(prod.getElementsByClassName("val_garantie")[0].innerHTML);
            let cond2= (durata_garantiei=="toate" || inceput_garantie<=garantie && garantie < sfarsit_garantie);

            let pret=parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML);
            let cond3= (pret>=val_pret);

            let categorie=prod.getElementsByClassName("val-categorie")[0].innerHTML;
            let cond4= ( val_categ=="toate" ||  val_categ==categorie)

            let descriere=prod.getElementsByClassName("val-descriere")[0].innerHTML.split(" ");
            let cond5 = false;
            if(cuvant_descriere.startsWith(".") || cuvant_descriere.startsWith(",") || cuvant_descriere.startsWith(" ")){
                cond5 = true;
                document.getElementById("inp-cuvant-desc").style.backgroundColor = "red";
            }
            else{
                document.getElementById("inp-cuvant-desc").style.backgroundColor = "white";
                for(let cuvant in descriere){
                    if(descriere[cuvant].startsWith(cuvant_descriere)){
                        cond5 = true;
                    }
                }
            }

            if(cuvant_descriere == ""){
                cond5 = true;
            }
            
            let cond6 = true;
            if(checkbox.checked){
                inp_unix_time_date = prod.getElementsByClassName("inp_data_curenta_unix_time")[0].innerHTML;
                if(parseInt(inp_unix_time_date) < (parseInt(data_curenta.getTime()) - zile_considerate_noutate * 24 * 60 * 60 * 1000)){
                    cond6 = false;
                }
            }

            let cond7 = true;
            if(culoare_produs.startsWith(".") || culoare_produs.startsWith(",") || culoare_produs.startsWith(" ")){
                document.getElementById("inp-culori").style.backgroundColor = "red";
            }
            else if( culoare_produs != ""){
                cond7 = false;
                document.getElementById("inp-culori").style.backgroundColor = "white";
                let culori_produs = prod.getElementsByClassName("inp-culori")[0].innerHTML.split(",");
                for (pos_culoare in culori_produs){
                    if (culori_produs[pos_culoare] == culoare_produs.toLowerCase()){
                        cond7 = true;
                    }
                }
            }
            let cond8 = false;
            for (let material of v_materiale){
                if(material == "toate"){
                    cond8 = true;
                }
            }
            if(cond8 != true){
                for (let material of v_materiale){
                    for(let material_produs of prod.getElementsByClassName("val-material")[0].innerHTML.split(" ")){
                        if(material == material_produs){
                            cond8 = true;
                        }
                    }
                }
            }

            if(cond1 && cond2 && cond3 && cond4 && cond5 && cond6 && cond7 && cond8){
                prod.style.display="block";
                something_to_display = something_to_display || true;
            }
            else{
                something_to_display = something_to_display || false;
            }
        }
        if(!something_to_display){
            empty_display.style.display="block";
        }
    }

    document.getElementById("resetare").onclick= function(){
        document.getElementById("container-resetare-sigura").style.display = "flex";
    }

    document.getElementById("reset_for_sure").onclick = function(){
        document.getElementById("container-resetare-sigura").style.display = "none";
        let empty_display = document.getElementById("nu_exista_produse");
        empty_display.style.display="none";
        document.getElementById("inp-nume").value="";
        document.getElementById("inp-culori").value="";
        document.getElementById("inp-pret").value=document.getElementById("inp-pret").min;
        document.getElementById("inp-categorie").value="toate";
        document.getElementById("i_rad4").checked=true;
        document.getElementById("inp-checkbox").checked=false;
        var produse=document.getElementsByClassName("produs");
        document.getElementById("infoRange").innerHTML="(0)";
        document.getElementById("inp-cuvant-desc").value="";
        document.getElementById("inp-materiale").value="toate";
        for (let prod of produse){
            prod.style.display="block";
        }
        if(v_produse_original_order != null){
            for(let prod of v_produse_original_order){
                prod.parentElement.appendChild(prod);
            }
        }
        document.getElementById("inp-nume").style.backgroundColor = "white";
        document.getElementById("inp-cuvant-desc").style.backgroundColor = "white";
        document.getElementById("inp-culori").style.backgroundColor = "white";
    }
    
    document.getElementById("changed_my_mind").onclick = function(){
        document.getElementById("container-resetare-sigura").style.display = "none";
    }

    function sortare (semn){
        var produse=document.getElementsByClassName("produs");
        var v_produse= Array.from(produse);
        if(v_produse_original_order == null){
            v_produse_original_order = v_produse.slice();
        }
        v_produse.sort(function (a,b){
            let nume_a=a.getElementsByClassName("val-nume")[0].innerHTML;
            let nume_b=b.getElementsByClassName("val-nume")[0].innerHTML;
            if(nume_a==nume_b){
                let rap_garantie_pret_a=parseFloat(a.getElementsByClassName("val_garantie")[0].innerHTML) / parseFloat(a.getElementsByClassName("val-pret")[0].innerHTML);
                let rap_garantie_pret_b=parseFloat(b.getElementsByClassName("val_garantie")[0].innerHTML) / parseFloat(b.getElementsByClassName("val-pret")[0].innerHTML);
                return semn*(rap_garantie_pret_a - rap_garantie_pret_b);
            }
            return semn*nume_a.localeCompare(nume_b);            
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
    window.onkeydown = function(e){
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

            let div = document.createElement("div"); //vreau sa creez un paragraf -> "p"
            div.innerHTML = "&nbsp;suma:\n&nbsp;&nbsp;" + suma;
            div.id = "info-suma";

            //trebuie push si in arbore html-ul
            //containerul e defapt un nod parinte (parintele continutului)
            ps = document.getElementById("div-suma");
            container = ps.parentNode;//id-ul +1?
            //ma duc la fratele mai din dreapta si inserez in fata lui, care e dupa ps
            frate=ps.nextElementSibling;
            container.insertBefore(div, frate);
        
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
            }, 2000) //la o secunda se intampla functia

            //vreau sa apara si sa dispara fara sa miste mai sus/jos produsele

            //task: afisarea pretului intr-ul element cu position fixed 
            //care nu afecteaza containerul in care se gasesete
        }
    }
    
    toggleVisibility();
})

function toggleVisibility(){
    let displayType;
    if(window.innerWidth < 700){
        displayType = "none";
    }
    else{
        displayType = "block";
    }
    
    let i = 0;
    elementInvizibil = document.getElementsByClassName("invizibil_pe_mobile")[i];
    while(elementInvizibil){
        elementInvizibil.style.display = displayType;
        i += 1;
        elementInvizibil = document.getElementsByClassName("invizibil_pe_mobile")[i];
    }
}

window.addEventListener("resize", toggleVisibility);