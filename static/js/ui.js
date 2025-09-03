import * as selectors from './selectors.js';

// VIEWS
export class View {
    constructor(view) {
        this.view = view;
    }
    show() {
        this.view.classList.remove('hidden')
    }
    hide() {
        this.view.classList.add('hidden')
    }
}

export class ViewController {
    constructor(views) {
        this.views = views
    }
    show(view) {
        this.views.forEach(element => {
            if (element == view ) {
                element.show()
            } else {
                element.hide()
            }
        })
    }
}

    export class Countdown {
    constructor(element, duration, done, next_func, ctx) {
        this.element = element
        this.value = duration
        this.done = done
        this.next_func = next_func
        this.ctx = ctx
        //
        this.element.innerText = duration
        this.interval = setInterval(this.countdown, 1000, this)
    }
    countdown(t) {
        t.value -= 1

        if (t.value == 0) {
            t.element.innerText = t.done
        }
        else if (t.value < 0) {
            clearInterval(t.interval)
            t.next_func.call(t.ctx)
            return
        } else {
            t.element.innerText = t.value
        }
    }
}

export function resetLogo(){
    selectors.view_start_logo.src = selectors.view_start_logo.src
}

export function haptic() {
  try {
    if (navigator.vibrate) {
      navigator.vibrate(50)
      return
    }

    const labelEl = document.createElement('label')
    labelEl.ariaHidden = 'true'
    labelEl.style.display = 'none'

    const inputEl = document.createElement('input')
    inputEl.type = 'checkbox'
    inputEl.setAttribute('switch', '')
    labelEl.appendChild(inputEl)

    document.head.appendChild(labelEl)
    labelEl.click()
    document.head.removeChild(labelEl)
  }
  catch {
    // do nothing
  }
};
