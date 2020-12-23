# 2-Color Gradient Generator <br>
# https://akshayubc.github.io/gradient-generator/ 
Through DOM Manipulation <br>

<b>Index.html:</b> Use it to understand the class and ID's name for different input elements. <br>
<b>color1</b> assigned class for color input 1 <br>
<b>color2</b> assigned class for color input 2 <br> 
<b>gradient</b> assigned id for webpage's body tag

<b> style.css:</b> Used to assign body tag the following property: <br>
```background:linear-gradient(to right, #4DAC4D, #3EC1B1); ```//color 1=#4DAC4D & color 2= #3EC1B1
  
<b> script.js:</b> Used to change the earlier declared CSS based on user's color input <br>

```function update() {
    body.style.background="linear-gradient(to right, " + color1.value + "," 
    + color2.value + ")";
}

color1.addEventListener('input', update);

color2.addEventListener('input',update);```
