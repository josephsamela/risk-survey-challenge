import * as camera from './camera.js';
import * as selectors from './selectors.js';
import * as audio from './audio.js';

// BUTTONS
export function buttonStart() {
    audio.button.play()
    ui.show(view_loading)
    var camera_permission = camera.start();
}
export function buttonLoading() {
    audio.button.play()
    ui.show(view_countdown)
    new Countdown(selectors.view_countdown_value, 3, 'GO!', buttonCountdown)
    audio.countdown.play()
}
export function buttonCountdown() {
    ui.show(view_game)
    new Countdown(selectors.view_game_timer, 30, '0', buttonFound)
    audio.game.play()
}
export function buttonGame() {
    ui.show(view_found)
}
export function buttonFound() {
    audio.win.play()
    ui.show(view_finish)
    camera.stop()
}
export function buttonFinish() {
    audio.button.play()
    ui.show(view_start)
    restartGif(selectors.view_start_logo)
}
selectors.button_start.addEventListener("click", buttonStart.bind(), false);
selectors.button_loading.addEventListener("click", buttonLoading.bind(), false);
// selectors.button_countdown.addEventListener("click", buttonCountdown.bind(), false);
// selectors.button_game.addEventListener("click", buttonGame.bind(), false);
selectors.button_found.addEventListener("click", buttonFound.bind(), false);
selectors.button_finish.addEventListener("click", buttonFinish.bind(), false);

// VIEWS
class View {
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

class ViewController {
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

var view_start = new View(selectors.view_start)
var view_loading = new View(selectors.view_loading)
var view_countdown = new View(selectors.view_countdown)
var view_game = new View(selectors.view_game)
var view_found = new View(selectors.view_found)
var view_finish = new View(selectors.view_finish)

var views = [
    view_start,
    view_loading,
    view_countdown,
    view_game,
    view_found,
    view_finish
]

var ui = new ViewController(views)

class Countdown {
    constructor(element, duration, done, next_func) {
        this.element = element
        this.value = duration
        this.done = done
        this.next_func = next_func
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
            t.next_func()
            return
        } else {
            t.element.innerText = t.value
        }
    }
}

function restartGif(element){ 
  if (element) {
     var imgSrc = element.src;
     element.src = imgSrc; 
  }
}
