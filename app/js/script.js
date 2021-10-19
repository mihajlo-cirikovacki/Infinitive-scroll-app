'use strict';

const app = (function() {
  
  const header = document.querySelector('.header');
  const container = document.querySelector('.container');
  const loader = document.querySelector('.loader');
  const loader2 = document.querySelector('.loader-2');
  const lightBox = document.querySelector('.lightbox');
  const close = document.querySelector('.close');
  const overlay = document.querySelector('.overlay');

  const APIKEY = 'FG_lsD6Zlivtgn4xnB6455NlsvDPuLGjBSX-1fG00mY';
  const ENDPOINT = 'https://api.unsplash.com/photos/';

  // ========== FETCH DATA:
  const getData = async (limit = 6) => {
    try {
      const res = await fetch(`${ENDPOINT}?client_id=${APIKEY}&per_page=${limit}`);
      const data = await res.json();
      
      return data;
      
    } catch(err) {
      console.error(err);
    };
  };

  // ==========  RENDER:
  const showLoader = function() {
    loader.classList.add('show');
  }

  const renderImgs = async () => {
    try {
      
      const data = await getData();
      if(!data) throw new Error('Problem with loading data. 💥💥💥');

      data.forEach(data => {
        const figureEl = document.createElement('figure');
        figureEl.classList.add('img-container');
        container.prepend(figureEl);

        const html = `
          <img class="img-container__img" src=${data.urls.full} alt="img">

          <blockquote class="img-container__likes"><img src="/assets/icons-heart-.png" class="img-container__icon" alt="heart icon">Likes:<span>${data.likes}</span></blockquote>
          <blockquote class="img-container__downloads"><img src="/assets/icons-downloads.png" class="img-container__icon" alt="Download icon">Downloads:<span>${data.height}</span></blockquote>
          <div class="profile-box">
            <img src=${data.user.profile_image.large} class="profile-box__img">
            <div class="profile-box__info">
            <h4 class="profile-box__name">${data.user.name}</h4>
              <a href"" class="profile-box__insta"><img src="/assets/icons-instagram.png" alt="instagram"></a>
            </div>
          </div>
        `;

        figureEl.insertAdjacentHTML('afterbegin', html );
      });

      showLoader()
      
    } catch(err) {
      console.error(err.message);
    };
  };

  // ========== HANDLING INTERSECT:
  const obsOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 1,
  }

  const handleIntersect = function(entries) {
    console.log(entries);
    const [entry] = entries;
    if (entry.isIntersecting) {
      setTimeout(() => renderImgs(), 300);
    } 
  }

  const observer = new IntersectionObserver(handleIntersect, obsOptions);
  observer.observe(loader); 


  // ========== ADD/REMOVES LIGHTBOX/OVERLAY:
  const removeLightBox = function() {
    lightBox.classList.add('hidden');
    overlay.classList.add('hidden');
    lightBox.querySelector('img').remove();
  }

  const addLightBox = function() {
    lightBox.classList.remove('hidden');
    overlay.classList.remove('hidden');
    close.classList.remove('hidden')
  }

  // ==========  EVENT LISTENERS:
  header.addEventListener('click', (e) => {
    const currView = e.target.closest('.view');
    if(!currView) return;

    if (currView.classList.contains('view-list')) {
      container.classList.remove('container');
      container.classList.add('view-list');
    } 
    if (currView.classList.contains('view-grid')) {
      container.classList.add('container');
      container.classList.remove('view-list');
    }
  });

  container.addEventListener('click', (e) => {
    const currImg = e.target.closest('.img-container');
    if(!currImg) return;
    
    const img = currImg.querySelector('.img-container__img');
    const imgHtml = `
      <img src="${img.src}" alt="${img.alt}">  
    `;

    lightBox.insertAdjacentHTML('afterbegin', imgHtml)
    addLightBox();
  });

  overlay.addEventListener('click', (e) => {
    removeLightBox();
  });

  close.addEventListener('click', (e) => {
    removeLightBox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') removeLightBox();
  }); 
    
  return {
    renderImgs
  }
})();

app.renderImgs();

