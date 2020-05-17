import NewsCard from './NewsCard';

const notFoundBlock = document.querySelector('.not-found');
const articlesBlock = document.querySelector('.articles');
const moreButton = document.querySelector('.articles__more-button');
const logged = localStorage.getItem("header");

export default class NewsCardList {
  constructor(array, container, firstNumberArticles) {
    this.array = array;
    this.container = container;
    this.firstNumberArticles = firstNumberArticles;
  }

  render() {
    if(this.array.length === 0) {
      notFoundBlock.classList.remove('not-found_hidden');
      articlesBlock.classList.add('articles_hidden');
    } else {
      notFoundBlock.classList.add('not-found_hidden');
      articlesBlock.classList.remove('articles_hidden');
    }  
  }

  renderResults() {
    const article = new NewsCard();
    
    this.render();
    const firstArticles = this.array.splice(0, this.firstNumberArticles);
        firstArticles.forEach(content => {
          this.container.insertAdjacentHTML('beforeend', article.create(content));
          this.clickMoreButton();

          if(logged) {
            article.renderIconAuth();
          }
        });
  }

  renderSavedResults() {
    const article = new NewsCard();
    this.array.forEach(card => {
      this.container.insertAdjacentHTML('beforeend', article.createSave(card));
      
    })
  }

  clickMoreButton() {
    if (this.array.length === 0) {
      moreButton.classList.add('articles__more-button_hidden');
    } else {
      moreButton.classList.remove('articles__more-button_hidden');
    }
  }

  clear() {
    while (this.container.firstChild) this.container.removeChild(this.container.firstChild);
  }
}