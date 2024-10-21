window.addEventListener('DOMContentLoaded', () => {
    const screenWidth = window.innerWidth;
    if (screenWidth > 900) {
      // Redirect to a restricted page
      window.location.href = '/restricted';
      
      // Or display a message
      // document.body.innerHTML = '<h1>This website cannot be accessed on screens wider than 900px</h1>';
    }
  });