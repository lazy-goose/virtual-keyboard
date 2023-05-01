export default class Keyboard {
  CLASSES = {
    KEYBOARD: 'keyboard',
    CONTAINER: 'keyboard__keys-container',
    ROW: 'keyboard__row',
    KEY: 'key',
    KEY_MOD_PRESSED: 'key_pressed',
    KEY_MOD_INDICATOR: 'key_indicator',
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
    pressed: [],
  }

  events = {
    oninput: null,
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
    this.elements.keysContainer.appendChild(this.createKeys())
    return this.elements.keyboard
  }

  createKeys() {
    const fragment = document.createDocumentFragment()

    // prettier-ignore
    const keys = [
      [
        { code: 'Backquote', sym: { en: ['`', '~'], ru: ['ё', 'Ё'] }, element: null },
        { code: 'Digit1',    sym: { en: ['1', '!'], ru: ['1', '!'] }, element: null },
        { code: 'Digit2',    sym: { en: ['2', '@'], ru: ['2', '"'] }, element: null },
        { code: 'Digit3',    sym: { en: ['3', '#'], ru: ['3', '№'] }, element: null },
        { code: 'Digit4',    sym: { en: ['4', '$'], ru: ['4', ';'] }, element: null },
        { code: 'Digit5',    sym: { en: ['5', '%'], ru: ['5', '%'] }, element: null },
        { code: 'Digit6',    sym: { en: ['6', '^'], ru: ['6', ':'] }, element: null },
        { code: 'Digit7',    sym: { en: ['7', '&'], ru: ['7', '?'] }, element: null },
        { code: 'Digit8',    sym: { en: ['8', '*'], ru: ['8', '*'] }, element: null },
        { code: 'Digit9',    sym: { en: ['9', '('], ru: ['9', '('] }, element: null },
        { code: 'Digit0',    sym: { en: ['0', ')'], ru: ['0', ')'] }, element: null },
        { code: 'Minus',     sym: { en: ['-', ')'], ru: ['-', '_'] }, element: null },
        { code: 'Equal',     sym: { en: ['=', ')'], ru: ['=', '+'] }, element: null },
        { code: 'Backspace', sym: { material: 'backspace' },          element: null, view: { size: 2 } },
      ],
      [
        { code: 'Tab',          sym: { material: 'keyboard_tab' },       element: null, view: { size: 2 } },
        { code: 'KeyQ',         sym: { en: ['q', 'Q'], ru: ['й', 'Й'] }, element: null },
        { code: 'KeyW',         sym: { en: ['w', 'Q'], ru: ['ц', 'Ц'] }, element: null },
        { code: 'KeyE',         sym: { en: ['e', 'Q'], ru: ['у', 'У'] }, element: null },
        { code: 'KeyR',         sym: { en: ['r', 'Q'], ru: ['к', 'К'] }, element: null },
        { code: 'KeyT',         sym: { en: ['t', 'Q'], ru: ['е', 'Е'] }, element: null },
        { code: 'KeyY',         sym: { en: ['y', 'Q'], ru: ['н', 'Н'] }, element: null },
        { code: 'KeyU',         sym: { en: ['u', 'Q'], ru: ['г', 'Г'] }, element: null },
        { code: 'KeyI',         sym: { en: ['i', 'Q'], ru: ['ш', 'Ш'] }, element: null },
        { code: 'KeyO',         sym: { en: ['o', 'Q'], ru: ['щ', 'Щ'] }, element: null },
        { code: 'KeyP',         sym: { en: ['p', 'Q'], ru: ['з', 'З'] }, element: null },
        { code: 'BracketLeft',  sym: { en: ['[', '{'], ru: ['х', 'Х'] }, element: null },
        { code: 'BracketRight', sym: { en: [']', '}'], ru: ['ъ', 'Ъ'] }, element: null },
      ],
      [
        { code: 'CapsLock',  sym: { material: 'keyboard_capslock' },   element: null, view: { size: 2 } },
        { code: 'KeyA',      sym: { en: ['a', 'A'], ru: ['ф', 'Ф'] },  element: null },
        { code: 'KeyS',      sym: { en: ['s', 'S'], ru: ['ы', 'Ы'] },  element: null },
        { code: 'KeyD',      sym: { en: ['d', 'D'], ru: ['в', 'В'] },  element: null },
        { code: 'KeyF',      sym: { en: ['f', 'F'], ru: ['а', 'А'] },  element: null },
        { code: 'KeyG',      sym: { en: ['g', 'G'], ru: ['п', 'П'] },  element: null },
        { code: 'KeyH',      sym: { en: ['h', 'H'], ru: ['р', 'Р'] },  element: null },
        { code: 'KeyJ',      sym: { en: ['j', 'J'], ru: ['о', 'О'] },  element: null },
        { code: 'KeyK',      sym: { en: ['k', 'K'], ru: ['л', 'Л'] },  element: null },
        { code: 'KeyL',      sym: { en: ['l', 'L'], ru: ['д', 'Д'] },  element: null },
        { code: 'Semicolon', sym: { en: [';', ':'], ru: ['ж', 'Ж'] },  element: null },
        { code: 'Quote',     sym: { en: ['\'', '"'], ru: ['э', 'Э'] }, element: null },
        { code: 'Enter',     sym: { material: 'keyboard_return' },     element: null, view: { size: 2 } },
      ],
      [
        { code: 'ShiftLeft',  sym: { material: 'shift' },              element: null, view: { size: 2 } },
        { code: 'KeyZ',       sym: { en: ['z', 'Z'], ru: ['я', 'Я'] }, element: null },
        { code: 'KeyX',       sym: { en: ['x', 'X'], ru: ['ч', 'Ч'] }, element: null },
        { code: 'KeyC',       sym: { en: ['c', 'C'], ru: ['с', 'С'] }, element: null },
        { code: 'KeyV',       sym: { en: ['v', 'V'], ru: ['м', 'М'] }, element: null },
        { code: 'KeyB',       sym: { en: ['b', 'B'], ru: ['и', 'И'] }, element: null },
        { code: 'KeyN',       sym: { en: ['n', 'N'], ru: ['т', 'Т'] }, element: null },
        { code: 'KeyM',       sym: { en: ['m', 'M'], ru: ['ь', 'Ь'] }, element: null },
        { code: 'Comma',      sym: { en: [',', '<'], ru: ['б', 'Б'] }, element: null },
        { code: 'Period',     sym: { en: ['.', '>'], ru: ['ю', 'Ю'] }, element: null },
        { code: 'Slash',      sym: { en: ['/', '?'], ru: ['.', ','] }, element: null },
        { code: 'ShiftRight', sym: { material: 'shift' },              element: null, view: { size: 2 } },
      ],
      [
        { code: 'ControlLeft',  sym: 'Ctrl',                          element: null },
        { code: 'OSLeft',       sym: 'Win',                           element: null },
        { code: 'AltLeft',      sym: 'Alt',                           element: null },
        { code: 'Space',        sym: { material: 'space_bar' },       element: null, view: { size: 6 } },
        { code: 'ArrowUp',      sym: { material: 'arrow_drop_up' },   element: null },
        { code: 'ArrowLeft',    sym: { material: 'arrow_left' },      element: null },
        { code: 'ArrowRight',   sym: { material: 'arrow_right' },     element: null },
        { code: 'ArrowDown',    sym: { material: 'arrow_drop_down' }, element: null },
        { code: 'ControlRight', sym: 'Ctrl',                          element: null },
      ],
    ]

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

        const uppercaseIndex = Number(isUppercase())

        if (key.sym.material) {
          content.textContent = key.sym.material
          content.classList.add(this.CLASSES.MATERIAL_ICON)
        } else if (typeof key.sym === 'string') {
          content.textContent = key.sym
        } else if (Array.isArray(key.sym)) {
          content.textContent = key.sym.at(uppercaseIndex)
        } else if (this.state.language === 'en') {
          content.textContent = key.sym.en.at(uppercaseIndex)
        } else if (this.state.language === 'ru') {
          content.textContent = key.sym.ru.at(uppercaseIndex)
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

    document.addEventListener('keydown', (e) => {
      const target = findKey(e.code)

      if (target) {
        target.element.classList.add(this.CLASSES.KEY_MOD_PRESSED)

        switch (target.code) {
          case 'Backspace':
            this.state.value = this.state.value.slice(0, -1)
            break
          case 'Tab': {
            this.state.value += '\t'
            break
          }
          case 'Enter': {
            this.state.value += '\n'
            break
          }
          case 'ArrowUp': {
            this.state.value += '↑'
            break
          }
          case 'ArrowRight': {
            this.state.value += '→'
            break
          }
          case 'ArrowDown': {
            this.state.value += '↓'
            break
          }
          case 'ArrowLeft': {
            this.state.value += '←'
            break
          }
          case 'Space': {
            this.state.value += ' '
            break
          }
          default:
            break
        }
        this.triggerInput()
      }
    })

    document.addEventListener('keyup', (e) => {
      const target = findKey(e.code)
      if (target) {
        target.element.classList.remove(this.CLASSES.KEY_MOD_PRESSED)
      }
    })

    document.addEventListener('keypress', (e) => {
      const target = findKey(e.code)
      const uppercaseIndex = Number(isUppercase())

      e.preventDefault()

      if (target) {
        switch (target.code) {
          case 'CapsLock': {
            this.state.capsLock = !this.state.capsLock
            break
          }
          case 'Backspace':
          case 'ArrowUp':
          case 'ArrowRight':
          case 'ArrowDown':
          case 'ArrowLeft':
          case 'Enter':
          case 'Space':
            break

          default: {
            if (target.sym.material) {
              this.state.value += target.sym.material
            } else if (Array.isArray(target.sym)) {
              this.state.value += target.sym.at(uppercaseIndex)
            } else if (this.state.language === 'en') {
              this.state.value += target.sym.en.at(uppercaseIndex)
            } else if (this.state.language === 'ru') {
              this.state.value += target.sym.ru.at(uppercaseIndex)
            } else {
              this.state.value += target.code
            }
            break
          }
        }
        this.triggerInput()
      }
    })

    this.elements.keyboard.addEventListener('click', (e) => {})

    return fragment
  }

  triggerInput() {
    this.elements.textarea.value = this.state.value
  }
}

Keyboard.LOCALSTORAGE_STATE = 'KEYBOARD_STATE'
