//pt 3 teme e nevoie de un vector

//window.onload se incarca abia dupa ce sunt puse toate imaginile/bibliotecile/css-uri etc
//o varianta e sa pun in loc de onload -> 

//nu merge pt produse pt ca am si acolo un window.onload -> isi da overwrite
// si la "load" si la "DOMContentLoaded" avem un delay( mai mare sau mai mic )

//vreau asta sa se intample instant
let tema = localStorage.getItem("tema");
if(tema){
    document.body.classList.add("dark");
}
//Problema: dureaza ceva ca tema sa se schimbe
//la produse nu se schimba tema

//clickul pe buton are sens sa fie setat abia dupa ce am incarcat pagina
window.addEventListener("DOMContentLoaded", function(){
    document.getElementById("tema").onclick= function(){
        //classList modifica clase
        if(document.body.classList.contains("dark")){
            document.body.classList.remove("dark");
            localStorage.removeItem("tema");
        }
        else{
            document.body.classList.add("dark")
            localStorage.setItem("tema", "dark");
        }
    }
})