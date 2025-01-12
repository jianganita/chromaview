document.addEventListener('DOMContentLoaded', () => {
  const slider = document.getElementById('slider');
  const box = document.getElementById('box2');
  const button = document.getElementById('Submit');

  // Handle slider input
  slider.addEventListener('input', () => {
    const value = slider.value;
    const hue = (value * 3.6);
    box.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;
  });

  // Handle submit button click
  button.addEventListener('click', () => {
    let box1 = document.getElementById('box1');
    let box2 = document.getElementById('box2');
    
    const style1 = getComputedStyle(box1);
    const style2 = getComputedStyle(box2);
    
    const color1 = style1.backgroundColor;
    const color2 = style2.backgroundColor;
    
    const rgb1 = color1.match(/\d+/g).map(Number);
    const rgb2 = color2.match(/\d+/g).map(Number);

    const redError = Math.abs(rgb1[0] - rgb2[0]);
    const greenError = Math.abs(rgb1[1] - rgb2[1]);
    const blueError = Math.abs(rgb1[2] - rgb2[2]);

    console.log(`Color difference - R:${redError}, G:${greenError}, B:${blueError}`);
    
    // Store results if needed
    localStorage.setItem('colorMatchResult', JSON.stringify({
      redError,
      greenError,
      blueError,
      timestamp: Date.now()
    }));

    // Navigate to results page
    window.location.href = 'results.html';
  });
});