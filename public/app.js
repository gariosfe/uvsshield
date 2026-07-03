async function actualizar() {

    const response = await fetch('/api/uv');
    const data = await response.json();

    document.getElementById('uv').innerText =
        `UV actual: ${data[0].uv_value}`;
}

setInterval(actualizar, 2000);