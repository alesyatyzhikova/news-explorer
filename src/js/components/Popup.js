export default class Popup {
  constructor(content, container) {
    this.content = content;
    this.container = container;
    this.form = content.querySelector('.popup__form');
  }

  clearContent() {
    this.content.classList.add('popup_hidden')
    // this.container.querySelector('.popup__content .popup__inner').innerHTML = '';
    
  }

  setContent() {
    this.content.classList.remove('popup_hidden')
  }

  open() {
    this.container.classList.add('popup_opened');
  }
}