async function actualizar() {

    const response = await fetch('/api/uv');
    const data = await response.json();

    document.getElementById("uv").innerHTML =
        data[0].uv_value;
    actualizarEstado(data[0].uv_value);
}
const estado = document.getElementById("estado");

function actualizarEstado(valor){

    if(valor <=2){

        estado.innerHTML="🟢 Riesgo Bajo";

    }
    else if(valor<=5){

        estado.innerHTML="🟡 Riesgo Moderado";

    }
    else if(valor<=7){

        estado.innerHTML="🟠 Riesgo Alto";

    }
    else if(valor<=10){

        estado.innerHTML="🔴 Riesgo Muy Alto";

    }
    else{

        estado.innerHTML="🟣 Riesgo Extremo";

    }

}


setInterval(actualizar, 2000);