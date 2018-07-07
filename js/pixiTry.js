//Create the renderer
let renderer = PIXI.autoDetectRenderer(512, 512);
//Add the canvas to the HTML document
document.body.appendChild(renderer.view);
//Create a container object called the `stage`
let stage = new PIXI.Container();
//Tell the `renderer` to `render` the `stage`
renderer.render(stage);

renderer.view.style.border = "1px dashed black";
renderer.backgroundColor = 0x0000FF; 
renderer.view.style.width = window.innerWidth -300 + "px";
renderer.view.style.height =   window.innerHeight -300 + "px";
renderer.view.style.margin =   150 + "px";


window.addEventListener("resize", () => { scaleToWindow(renderer.view); });

function scaleToWindow(canvas, backgroundColor) {
    var scaleX, scaleY, scale, center;
  
    //1. Scale the canvas to the correct size
    //Figure out the scale amount on each axis
    scaleX = window.innerWidth / canvas.offsetWidth;
    scaleY = window.innerHeight / canvas.offsetHeight;
  
    //Scale the canvas based on whichever value is less: `scaleX` or `scaleY`
    scale = Math.min(scaleX, scaleY);
    canvas.style.transformOrigin = "0 0";
    canvas.style.transform = "scale(" + scale + ")";
  
    //2. Center the canvas.
    //Decide whether to center the canvas vertically or horizontally.
    //Wide canvases should be centered vertically, and 
    //square or tall canvases should be centered horizontally
    if (canvas.offsetWidth > canvas.offsetHeight) {
      if (canvas.offsetWidth * scale < window.innerWidth) {
        center = "horizontally";
      } else {
        center = "vertically";
      }
    } else {
      if (canvas.offsetHeight * scale < window.innerHeight) {
        center = "vertically";
      } else {
        center = "horizontally";
      }
    }
  
    //Center horizontally (for square or tall canvases)
    var margin;
    if (center === "horizontally") {
      margin = (window.innerWidth - canvas.offsetWidth * scale) / 2;
      canvas.style.marginTop = 0 + "px";
      canvas.style.marginBottom = 0 + "px";
      canvas.style.marginLeft = margin + "px";
      canvas.style.marginRight = margin + "px";
    }
  
    //Center vertically (for wide canvases) 
    if (center === "vertically") {
      margin = (window.innerHeight - canvas.offsetHeight * scale) / 2;
      canvas.style.marginTop = margin + "px";
      canvas.style.marginBottom = margin + "px";
      canvas.style.marginLeft = 0 + "px";
      canvas.style.marginRight = 0 + "px";
    }
  
    //3. Remove any padding from the canvas  and body and set the canvas
    //display style to "block"
    canvas.style.paddingLeft = 0 + "px";
    canvas.style.paddingRight = 0 + "px";
    canvas.style.paddingTop = 0 + "px";
    canvas.style.paddingBottom = 0 + "px";
    canvas.style.display = "block";
  
    //4. Set the color of the HTML body background
    document.body.style.backgroundColor = backgroundColor;
  
    //Fix some quirkiness in scaling for Safari
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf("safari") != -1) {
      if (ua.indexOf("chrome") > -1) {
        // Chrome
      } else {
        // Safari
        //canvas.style.maxHeight = "100%";
        //canvas.style.minHeight = "100%";
      }
    }
  
    //5. Return the `scale` value. This is important, because you'll nee this value 
    //for correct hit testing between the pointer and sprites
    return scale;
  }