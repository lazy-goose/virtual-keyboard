import keys from './keys.js'

export default class Keyboard {
  CLASSES = {
    KEYBOARD: 'keyboard',
    CONTAINER: 'keyboard__keys-container',
    ROW: 'keyboard__row',
    KEY: 'key',
    KEY_MOD_PRESSED: 'key_pressed',
    KEY_MOD_INDICATOR: 'key_indicator',
    KEY_MOD_INDICATOR_ON: 'key_indicator_on',
    KEY_MOD_DARK: 'key_inverse',
    KEY_SYM: 'key__sym',
    KEYSIZE: (s = 1) => `key_size_${s}w`,
    MATERIAL_ICON: 'material-symbols-outlined',
  }

  elements = {
    textarea: null,
    keyboard: null,
    keysContainer: null,
  }

  state = {
    value: '',
    capsLock: false,
    language: 'en',
    shift: false,
    ctrl: false,
    alt: false,
    cursor: 0,
    pressed: new Set(),
  }

  events = {
    oninput: null,
  }

  constructor(textarea) {
    let savedState
    try {
      savedState = JSON.parse(localStorage.getItem(Keyboard.LOCALSTORAGE_STATE))
    } catch (e) {
      savedState = null
    }

    if (savedState) {
      this.state = {
        ...savedState,
        pressed: new Set(),
      }
    }

    this.bindInput(textarea)
  }

  bindInput(textarea) {
    this.elements.textarea = textarea
    this.elements.textarea.value = this.state.value
    this.elements.textarea.addEventListener('keypress', (e) => {
      e.preventDefault()
    })
    this.elements.textarea.addEventListener('click', () => {
      this.state.cursor = textarea.selectionEnd
    })
  }

  fragment() {
    this.elements.keyboard = document.createElement('div')
    this.elements.keysContainer = document.createElement('div')
    this.elements.keyboard.classList.add(this.CLASSES.KEYBOARD)
    this.elements.keysContainer.classList.add(this.CLASSES.CONTAINER)
    this.elements.keyboard.appendChild(this.elements.keysContainer)
    this.elements.keysContainer.appendChild(this.createKeys())
    return this.elements.keyboard
  }

  saveState() {
    localStorage.setItem(
      Keyboard.LOCALSTORAGE_STATE,
      JSON.stringify(this.state)
    )
  }

  deriveSymbol(key) {
    let output = ''
    if (key.sym.material) {
      output = key.sym.material
    } else if (typeof key.sym === 'string') {
      output = key.sym
    } else if (Array.isArray(key.sym)) {
      if (this.state.shift && key.sym.at(1)) {
        output = key.sym.at(1)
      } else {
        output = key.sym.at(0)
      }
    } else if (this.state.language) {
      const lang = key.sym[this.state.language]
      if (key.code.startsWith('Key')) {
        const isUpperCase = (this.state.capsLock + this.state.shift) % 2
        output = lang[isUpperCase]
      } else {
        output = lang[Number(this.state.shift)]
      }
    } else {
      output = key.code
    }
    return output
  }

  update() {
    keys.flat().forEach((key) => {
      const node = key.element.firstChild
      if (key.sym.material) {
        node.textContent = key.sym.material
        node.classList.add(this.CLASSES.MATERIAL_ICON)
      } else if (typeof key.sym === 'string') {
        node.textContent = key.sym
      } else if (Array.isArray(key.sym)) {
        if (this.state.shift && key.sym.at(1)) {
          node.textContent = key.sym.at(1)
        } else {
          node.textContent = key.sym.at(0)
        }
      } else if (this.state.language) {
        const lang = key.sym[this.state.language]
        if (key.code.startsWith('Key')) {
          const isUpperCase = (this.state.capsLock + this.state.shift) % 2
          node.textContent = lang[isUpperCase]
        } else {
          node.textContent = lang[Number(this.state.shift)]
        }
      } else {
        node.textContent = key.code
      }
    })
  }

  createKeys() {
    const fragment = document.createDocumentFragment()

    const isUppercase = () =>
      Boolean((this.state.capsLock + this.state.shift) % 2)

    keys.forEach((row) => {
      const rowElement = document.createElement('div')
      rowElement.classList.add(this.CLASSES.ROW)
      row.forEach((rowkey) => {
        const key = rowkey
        const button = document.createElement('button')
        const content = document.createElement('span')
        content.classList.add(this.CLASSES.KEY_SYM)

        if (key.code === 'CapsLock') {
          if (this.state.capsLock) {
            button.classList.toggle(
              this.CLASSES.KEY_MOD_INDICATOR_ON,
              this.state.capsLock
            )
          }
        }

        if (key.sym.material) {
          content.textContent = key.sym.material
          content.classList.add(this.CLASSES.MATERIAL_ICON)
        } else if (typeof key.sym === 'string') {
          content.textContent = key.sym
        } else if (Array.isArray(key.sym)) {
          content.textContent = key.sym.at(Number(isUppercase()))
        } else if (this.state.language === 'en') {
          content.textContent = key.sym.en.at(Number(isUppercase()))
        } else if (this.state.language === 'ru') {
          content.textContent = key.sym.ru.at(Number(isUppercase()))
        } else {
          content.textContent = key.code
        }

        if (key.view) {
          if (key.view.size > 0) {
            button.classList.add(this.CLASSES.KEYSIZE(key.view.size))
          }
          if (key.view.indicator) {
            button.classList.add(this.CLASSES.KEY_MOD_INDICATOR)
          }
          if (key.view.dark) {
            button.classList.add(this.CLASSES.KEY_MOD_DARK)
          }
        }

        button.dataset.keycode = key.code

        content.style.pointerEvents = 'none'

        button.appendChild(content)
        button.setAttribute('type', 'button')
        button.classList.add(this.CLASSES.KEY)

        key.element = button
        rowElement.appendChild(button)
      })
      fragment.appendChild(rowElement)
    })

    const findKey = (code) => keys.flat().find((el) => el.code === code)

    const keydown = (target) => {
      if (target) {
        target.element.classList.add(this.CLASSES.KEY_MOD_PRESSED)

        this.state.pressed.add(target.code)

        switch (target.code) {
          case 'Tab':
            this.state.value += '\t'
            break
          case 'CapsLock':
            this.state.capsLock = !this.state.capsLock
            if (this.state.capsLock) {
              target.element.classList.add(this.CLASSES.KEY_MOD_INDICATOR_ON)
            } else {
              target.element.classList.remove(this.CLASSES.KEY_MOD_INDICATOR_ON)
            }
            this.update()
            break
          case 'ShiftLeft':
          case 'ShiftRight':
            this.state.shift = true
            this.update()
            break
          case 'Enter':
            this.state.value += '\n'
            break
          case 'ArrowUp':
            this.state.value += '↑'
            break
          case 'ArrowRight':
            this.state.value += '→'
            break
          case 'ArrowDown':
            this.state.value += '↓'
            break
          case 'ArrowLeft':
            this.state.value += '←'
            break
          case 'Space':
            this.state.value += ' '
            break
          case 'MetaLeft':
          case 'OSLeft':
            break
          case 'user_clear':
            this.state.value = ''
            break
          case 'Backspace': {
            const x = this.elements.textarea.selectionStart
            this.state.value =
              this.state.value.slice(0, Math.max(x - 1, 0)) +
              this.state.value.slice(x)
            this.state.cursor = Math.max(x - 1, 0)
            break
          }
          case 'Delete': {
            const x = this.elements.textarea.selectionStart
            this.state.value =
              this.state.value.slice(0, x) + this.state.value.slice(x + 1)
            this.state.cursor = x
            break
          }
          default: {
            if (
              target.code === 'ControlLeft' ||
              target.cpde === 'ControlRight'
            ) {
              this.state.ctrl = true
            }
            if (target.code === 'AltLeft' || target.cpde === 'AltRight') {
              this.state.alt = true
            }
            const layoutKeys = [
              'ControlLeft',
              'ControlRight',
              'AltLeft',
              'AltRight',
            ]
            if (layoutKeys.includes(target.code)) {
              const pressed = [...this.state.pressed.values()]
              if (
                this.state.pressed.size === 2 &&
                !pressed.every((v) => v.startsWith('Control')) &&
                !pressed.every((v) => v.startsWith('Alt')) &&
                pressed.every((v) => layoutKeys.includes(v))
              ) {
                this.state.language = this.state.language === 'en' ? 'ru' : 'en'
                this.update()
              }
            } else {
              const x = this.state.cursor
              this.state.value =
                this.state.value.slice(0, x) +
                this.deriveSymbol(target) +
                this.state.value.substring(x)
              this.state.cursor += 1
              console.log(this.state.cursor)
            }
            break
          }
        }
        this.updateOutput()
      }
      this.elements.textarea.selectionStart = this.state.cursor
      this.elements.textarea.selectionEnd = this.state.cursor
      this.saveState()
    }
    const keyup = (target) => {
      if (target) {
        this.state.pressed.delete(target.code)
        target.element.classList.remove(this.CLASSES.KEY_MOD_PRESSED)

        if (
          !this.state.pressed.has('ShiftLeft') &&
          !this.state.pressed.has('ShiftRight')
        ) {
          this.state.shift = false
        }

        if (
          !this.state.pressed.has('ShiftLeft') &&
          !this.state.pressed.has('ShiftRight')
        ) {
          this.state.ctrl = false
        }

        if (
          !this.state.pressed.has('AltLeft') &&
          !this.state.pressed.has('AltRight')
        ) {
          this.state.alt = false
        }

        this.update()
      }

      this.saveState()
    }

    document.addEventListener('keydown', (e) => {
      keydown(findKey(e.code))
      e.preventDefault()
    })
    document.addEventListener('keyup', (e) => {
      keyup(findKey(e.code))
    })

    let mousedownLast

    this.elements.keyboard.addEventListener('mousedown', (e) => {
      e.preventDefault()
      keydown(findKey(e.target.dataset.keycode))
      mousedownLast = e.target.dataset.keycode
    })
    document.addEventListener('mouseup', (e) => {
      e.preventDefault()
      keyup(findKey(mousedownLast))
    })

    window.addEventListener('mouseout', (e) => {
      if (e.target === document.documentElement) {
        keys.flat().forEach((key) => {
          key.element.classList.remove(this.CLASSES.KEY_MOD_PRESSED)
        })
      }
    })

    window.addEventListener('focusin', (e) => {
      if (e.target === document.documentElement) {
        keys.flat().forEach((key) => {
          key.element.classList.remove(this.CLASSES.KEY_MOD_PRESSED)
        })
      }
    })

    return fragment
  }

  updateOutput() {
    this.elements.textarea.value = this.state.value
  }
}

Keyboard.LOCALSTORAGE_STATE = 'KEYBOARD_STATE'
