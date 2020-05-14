export default class Form {
  constructor(form) {
    this.form = form
  }

  validateForm(event) {
    const error = this._hasError(event.target);

    if(error) {
      this._showError(event.target, error);
      return;
    }

    this._removeError(event.target);
  }

  _hasError(input) {
    // if (input.type === 'submit' || input.type === 'button') return;

    const validity = input.validity;
    if (validity.valid) return;

    // Пустое поле
    if (validity.valueMissing) return 'Поле должно быть заполнено';

    // Короткое поле
    if (validity.tooShort) {
      if (input.type === 'text') return 'Минимальное количество знаков 2';

      if (input.type === 'password') return 'Минимальное количество знаков 8';
    }

    // Длинное поле
    if (validity.tooLong) return 'Максимальное количество знаков 30'

    // Шаблон по регулярке
    if (validity.patternMismatch) {
      if (input.type === 'password') return 'Пароль в формате: Qwerty@1 (минимум один символ, цифра, строчная и заглавная буква)'
    
      if (input.type === 'email') return 'Введите корректный email'
    }

    return 'Поле заполнено некорректно'
  }

  _showError(input, error) {
    const id = input.id;
    const errorField = input.form.querySelector('.error#error-for-' + id)

    errorField.textContent = error;
  }

  _removeError(input) {
    const id = input.id;
    const errorField = input.form.querySelector('.error#error-for-' + id);

    errorField.textContent = '';
  }

  validInput(event) {
    return Array.from(event.elements).reduce((total, item) => {
      if(item.type !== 'submit') return total + (item.validity.valid ? 1 : 0);
      return total
  }, 0)
  }

  disableForm(event) {
    if (this.validInput(event) === event.elements.length - 1){
      this.unlockButton(event);
    } else {
      this.lockButton(event);
    } 
  }

  lockButton(event) {
    event.querySelector('button').setAttribute('disabled', true);
  }

  unlockButton(event) {
    event.querySelector('button').removeAttribute('disabled');
  }
}