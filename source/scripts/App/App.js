import Keyboard from './Keyboard.js'

export default class App {
  elements = {
    app: null,
    heading: null,
    textarea: null,
    keyboard: null,
  }

  init(callback = () => null) {
    this.elements.app = document.createElement('div')
    this.elements.heading = document.createElement('h1')
    this.elements.textarea = document.createElement('textarea')

    const keyboard = new Keyboard(this.elements.textarea)
    this.elements.keyboard = keyboard.fragment()

    this.elements.heading.textContent = 'Virtual keyboard'
    this.elements.textarea.textContent = ''

    this.elements.app.classList.add('app')
    this.elements.heading.classList.add('heading')
    this.elements.textarea.classList.add('textarea')

    this.elements.app.appendChild(this.elements.heading)
    this.elements.app.appendChild(this.elements.textarea)
    this.elements.app.appendChild(this.elements.keyboard)

    document.body.appendChild(this.elements.app)

    callback()
    return this
  }
}
