export function checkDarkMode(value){
    if(value){
        document.body.classList.add("darkmode")
    }else{
        document.body.classList.remove("darkmode")
    } 
}