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