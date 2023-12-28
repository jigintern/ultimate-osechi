import {Cell,Mino,Field,Coordinate} from "./logic.js";
import { showRetry } from "./modal.js";

export function timer_start(){
    let time=60;
    function timer_update(){
        time--;
        document.getElementById("timer").innerHTML=time+"sec";
        if(time==0){
            clearInterval(timer);
            console.log("timeup");
            showRetry();
        }
    }
    let timer=setInterval(timer_update,1000);
}

