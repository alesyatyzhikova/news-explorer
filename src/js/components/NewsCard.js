import { getDateForArticles } from '../utils/date';

export default class NewsCard {
  constructor() {
    
  }

  create(options) {
  return `<a class="article" href="${options.url}" target="_blank">
    <div class="article__nav">
      <img class="article__image" src="${options.urlToImage}" alt="Изображение для новости">
      <div class="article__tags">
        <span class="article__tag article__tag_save article__tag_save-not-auth"></span>
        <span class="article__tag article__tag_message">
          Войдите, чтобы сохранять статьи
        </span>
      </div>
    </div>
    <div class="article__wrapper">
      <div class="article__info">
        <span class="article__date">
          ${getDateForArticles(new Date(options.publishedAt))}
        </span>
        <h3 class="title article__title">
          ${options.title}
        </h3>
        <p class="article__text">
          ${options.description}
        </p>
      </div>
      <span class="article__source">
        ${options.source.name}
      </span>
    </div>
  </a>`;
  }

  createSave(options) {
    return `<a class="article" href="${options.link}" target="_blank" id="${options._id}">
    <div class="article__nav">
      <img class="article__image" src="${options.image}">
      <div class="article__tags">
        <span class="article__tag article__tag_delete"></span>
        <span class="text article__tag article__tag_message">
          Убрать из сохранённых
        </span>
        <span class="text article__tag article__tag_keyword">
          ${options.keyword}
        </span>
      </div>
    </div>
    <div class="article__wrapper">
      <div class="article__info">
        <span class="text article__date">
          ${options.date}
        </span>
        <h3 class="title article__title">
        ${options.title}
        </h3>
        <p class="text article__text">
          ${options.text}
        </p>
      </div>
      <span class="title article__source">
        ${options.source}
      </span>
    </div>
  </a>`
  }

  remove(event) {
    const article = event.target.closest('.article');
    event.currentTarget.removeChild(article);
  }

  renderIconAuth() {
    document.querySelectorAll('.article__tag_save').forEach(item => {
      item.classList.remove('article__tag_save-not-auth');
      item.classList.add('article__tag_for-save');
    })
  }

  renderIconNotAuth() {
    document.querySelectorAll('.article__tag_save').forEach(item => {
      item.classList.add('article__tag_save-not-auth');
    })
  }

  renderIconForSave(event) {
    event.target.classList.add('article__tag_saved')
  }

  renderIconForDelete(event) {
    event.target.classList.remove('article__tag_for-save')
    event.target.classList.remove('article__tag_saved')
  }
}