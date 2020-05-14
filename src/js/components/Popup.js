export default class Popup {
  constructor(content, container) {
    this.content = content;
    this.container = container;
    this.form = content.querySelector('.popup__form');
  }

  clearContent() {
    this.content.classList.add('popup_hidden')
    
  }

  setContent() {
    this.content.classList.remove('popup_hidden')
  }

  open() {
    this.container.classList.add('popup_opened');
  }

  close() {
    this.container.classList.remove('popup_opened');
  }
}