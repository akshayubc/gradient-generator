var color1 = document.querySelector(".c1");
var color2 = document.querySelector(".c2");
var body = document.getElementById("gradient")

function update() {
    body.style.background="linear-gradient(to right, " + color1.value + "," 
    + color2.value + ")";
}

color1.addEventListener('input', update);

color2.addEventListener('input',update);