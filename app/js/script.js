'use strict';

const app = (function() {
  
  const loader = document.querySelector('.loader');
  const container = document.querySelector('.infinite-scroll-container');
  const APIKEY = 'FG_lsD6Zlivtgn4xnB6455NlsvDPuLGjBSX-1fG00mY';
  const ENDPOINT = 'https://api.unsplash.com/photos/';

  let page = 1;

  // === FETCH DATA:
  const getData = async (limit = 12) => {
    try {
      const res = await fetch(`${ENDPOINT}?client_id=${APIKEY}&per_page=${limit}&page=${page}`);
      const data = await res.json();
      
      return data;
      
    } catch(err) {
      console.error(err);
    };
  };

  // === RENDER:
  const showLoader = function() {
    loader.classList.add('show')
  }

  const renderImgs = async () => {
    try {
      showLoader();

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
      
    } catch(err) {
      console.error(err.message);
    };
  };

  // HANDLING INTERSECT:
  const obsOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.25,
  }

  const handleIntersect = function(entries) {
    const [entry] = entries;
    if (entry.isIntersecting) {
      page++;
      renderImgs();
    } 
  }

  const observer = new IntersectionObserver(handleIntersect, obsOptions);
  observer.observe(loader); 

  return {
    renderImgs
  }
})();

app.renderImgs();

