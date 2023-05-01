export default class Keyboard {
  CLASSES = {
    KEYBOARD: 'keyboard',
    CONTAINER: 'keyboard__keys-container',
  }

  elements = {
    textarea: null,
    keyboard: null,
    keysContainer: null,
    keys: [],
  }

  constructor(textarea) {
    this.bindInput(textarea)
  }

  bindInput(textarea) {
    this.elements.textarea = textarea
  }

  fragment() {
    this.elements.keyboard = document.createElement('div')
    this.elements.keysContainer = document.createElement('div')

    this.elements.keyboard.classList.add(this.CLASSES.KEYBOARD)
    this.elements.keysContainer.classList.add(this.CLASSES.CONTAINER)

    this.elements.keyboard.appendChild(this.elements.keysContainer)
    return this.elements.keyboard
  }
}
