const newsapi = '75aade2a46cb41519f510acc71528813';

export default class NewsApi {
  constructor(options) {
    this.q = options.q;
    this.from = options.from;
    this.to = options.to;
    this.pageSize = options.pageSize;

  }

  getNews() {
    return fetch(`https://cors-anywhere.herokuapp.com/https://newsapi.org/v2/everything?q=${this.q}&language=ru&from=${this.from}&to=${this.to}&pageSize=${this.pageSize}&apiKey=${newsapi}`)
  }
}