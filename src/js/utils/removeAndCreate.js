  // Функция для удаления и сохранения карточки
  import MainApi from '../api/MainApi';
  const api = new MainApi({
    url: 'https://api.explorer-news.tk',
  })

  export default function clickArticle(event) {

        if(event.target.classList.contains('article__tag_save-not-auth') || event.target.classList.contains('article__tag_save')) {
          event.preventDefault();
        }

        // Удаление статьи
        if(event.target.classList.contains('article__tag_saved')) {
          event.preventDefault();

           api.removeArticle(`/articles/${event.target.closest('.article').id}`, event)
            .then((res) => {
              if(res.ok) {
                return res.text();
              }
              return Promise.reject(res);
            })
            .then(() => {
              event.target.classList.remove('article__tag_saved')
              event.target.classList.add('article__tag_for-save')
            })
            .catch(err => console.log(err))
          }

        // Сохранение статьи
        if(event.target.classList.contains('article__tag_for-save')) {
          event.preventDefault();

          api.createArticle('/articles', event)
          .then((res) => {
            if(res.ok) {
              return res.json()
            }
            return Promise.reject(res);
          })
          .then((res) => {
            const createdArticle = event.target.closest('.article');
            
            createdArticle.id = res.data.id;
            event.target.classList.remove('article__tag_for-save')
            event.target.classList.add('article__tag_saved')
          })
          .catch(err => console.log(err))
        }
  }