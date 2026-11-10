document.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.getElementById('testimonialsWrapper');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsContainer = document.getElementById('dotsContainer');
  const filterBtns = document.querySelectorAll('.tab-btn');
  const sliderContainer = document.getElementById('sliderContainer');

  let cards = Array.from(document.querySelectorAll('.testimonial-card'));
  let currentIndex = 0;
  let visibleCardsCount = getVisibleCardsCount();
  let maxIndex = Math.max(0, cards.length - visibleCardsCount);
  let autoplayTimer = null;


  function getVisibleCardsCount() {
    if (window.innerWidth <= 640) return 1;
    if (window.innerWidth <= 992) return 2;
    return 3;
  }


  function setupDots() {
    dotsContainer.innerHTML = '';
    const totalDots = maxIndex + 1;

    for (let i = 0; i < totalDots; i++) {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (i === currentIndex) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }


  function updateSlider() {
    if (cards.length === 0) return;


    const cardWidth = cards[0].offsetWidth;
    const gap = 24; 
    const offset = currentIndex * (cardWidth + gap);

    wrapper.style.transform = `translateX(-${offset}px)`;

  
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  }

  function goToSlide(index) {
    currentIndex = Math.min(Math.max(index, 0), maxIndex);
    updateSlider();
  }

  function nextSlide() {
    currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
    updateSlider();
  }

  function prevSlide() {
    currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
    updateSlider();
  }


  function filterCards(category) {
    cards.forEach(card => {
      const match = category === 'all' || card.dataset.category === category;
      card.style.display = match ? 'flex' : 'none';
    });


    const activeCards = cards.filter(card => card.style.display !== 'none');
    maxIndex = Math.max(0, activeCards.length - visibleCardsCount);
    currentIndex = 0;

    setupDots();
    updateSlider();
  }


  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(nextSlide, 5000);
  }

  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
  }


  nextBtn.addEventListener('click', () => {
    nextSlide();
    startAutoplay();
  });

  prevBtn.addEventListener('click', () => {
    prevSlide();
    startAutoplay();
  });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      filterCards(e.target.dataset.filter);
    });
  });


  sliderContainer.addEventListener('mouseenter', stopAutoplay);
  sliderContainer.addEventListener('mouseleave', startAutoplay);


  window.addEventListener('resize', () => {
    visibleCardsCount = getVisibleCardsCount();
    maxIndex = Math.max(0, cards.length - visibleCardsCount);
    if (currentIndex > maxIndex) currentIndex = maxIndex;
    setupDots();
    updateSlider();
  });


  setupDots();
  updateSlider();
  startAutoplay();
});


const themeToggleBtn = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');


const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  document.body.classList.add('light-theme');
  themeIcon.classList.replace('fa-moon', 'fa-sun');
}

themeToggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('light-theme');
  
  const isLight = document.body.classList.contains('light-theme');
  

  if (isLight) {
    themeIcon.classList.replace('fa-moon', 'fa-sun');
    localStorage.setItem('theme', 'light');
  } else {
    themeIcon.classList.replace('fa-sun', 'fa-moon');
    localStorage.setItem('theme', 'dark');
  }
});