window.onload = function () {
    console.log("accessed");
    if (localStorage.getItem('tritanopia') === 'true') {
        var link = document.querySelector('link[rel="stylesheet"]');
        if (link) {
            link.href = 'tritanopia.css';
        }
       
    }
    
    if (localStorage.getItem('deuteranopia') === 'true') {
        var link = document.querySelector('link[rel="stylesheet"]');
        if (link) {
            link.href = 'deuteranopia.css';
        }
    
    }
   
    if (localStorage.getItem('protanopia') === 'true') {
        var link = document.querySelector('link[rel="stylesheet"]');
        if (link) {
            link.href = 'protanopia.css';
        }
       
    }

};