document.addEventListener('DOMContentLoaded', () => {
  const slider = document.getElementById('slider');
  const box = document.getElementById('box2');

  slider.addEventListener('input', () => {
    const value = slider.value;

    // Optionally, change the color based on the slider value

    const hue = (value * 3.6);
    box.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;
  });
});

const button = document.getElementById("Submit");

function onClick(){
  console.log("done");
  let box1 = document.getElementById('box1');
  let box2 = document.getElementById('box2');
  
  ComputedStyle1 = getComputedStyle(box1);
  color1 = ComputedStyle1.backgroundColor;
  rgb1 = color1.match(/\d+/g).map(Number);
  console.log(rgb1);
  console.log(rgb1[0]);
  
  ComputedStyle2 = getComputedStyle(box2);
  color2 = ComputedStyle1.backgroundColor;
  rgb2 = color2.match(/\d+/g).map(Number);


  redError = Math.abs((rgb1[0]-rgb2[0]))

  greenError = Math.abs((rgb1[1]-rgb2[1]));

  blueError = Math.abs((rgb1[2]-rgb2[2]));

  tolerance = 30; 

  console.log(redError +","+ greenError +","+ blueError);
}
button.addEventListener('click', onClick);