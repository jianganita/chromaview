document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('slider');
    const box = document.getElementById('box2');
  
    slider.addEventListener('input', () => {
      const value = slider.value;

      // Optionally, change the color based on the slider value
      const red = Math.min(255, value * 2);
      const blue = 255 - value * 2;
      box.style.backgroundColor = `rgb(${red}, 0, ${blue})`;
    });
  });