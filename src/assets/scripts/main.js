function toggleMenu(){
  const nav = document.getElementById("nav");
  const hamburger = document.getElementById('hamburger');
  nav.classList.toggle('active');
  hamburger.classList.toggle('active');
}

function closeMenu(){
  const nav = document.getElementById("nav");
  const hamburger = document.getElementById('hamburger');
  nav.classList.remove('active');
  hamburger.classList.remove('active');
}