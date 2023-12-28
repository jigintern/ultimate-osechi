import {Cell,Mino,Field,Coordinate} from "./logic.js";
let time=60;
function timer_start(){
    function timer_update(){
        time--;
        document.getElementById("timer").innerHTML=time+"sec";
        if(time==0){
            clearInterval(timer);
            console.log("timeup");
            //GameEnd();
        }
    }
    let timer=setInterval(timer_update,1000);
}
timer_start();