import * as ui from './ui.js';
import * as audio from './audio.js';
import * as camera from './camera.js';
import * as selectors from './selectors.js';
import * as model from './model.js';

class Game {
    constructor() {

        this.view_start = new ui.View(selectors.view_start)
        this.view_loading = new ui.View(selectors.view_loading)
        this.view_countdown = new ui.View(selectors.view_countdown)
        this.view_game = new ui.View(selectors.view_game)
        this.view_finish = new ui.View(selectors.view_finish)

        this.views = [
            this.view_start,
            this.view_loading,
            this.view_countdown,
            this.view_game,
            this.view_finish
        ]

        this.screen = new ui.ViewController(this.views)
        // this.ai = new model.Model(selectors.view_game_video, cocoSsd)

        this.ai = new model.Model(
            selectors.view_game_video, 
            'https://teachablemachine.withgoogle.com/models/PHngkbAAu/'
        )

        this.foundItems = new Set()
        this.gallery = []
        this.interval_game = null
        this.detectionQueue = new model.Queue(5)
        this.detectionTimeout = Date.now()
    }
    
    viewStart() {
        this.sound.play('button')

        this.screen.show(this.view_start)

        ui.resetLogo()

        this.score = 0
        this.gallery = []
        selectors.view_finish_gallery.innerHTML = ''
        this.detectionQueue.empty()
        this.foundItems.clear()
        this.sound.reset()
    }
    viewLoading() {
        this.sound = new audio.Sound()

        this.sound.play('button')

        this.screen.show(this.view_loading)
        var camera_permission = camera.start();
    }
    viewCountdown() {
        this.sound.play('button')
        this.screen.show(this.view_countdown)
        new ui.Countdown(selectors.view_countdown_value, 3, 'GO!', this.viewGame, this)
        this.ai.start()
        this.sound.play('countdown')

    }
    viewGame() {
        this.screen.show(this.view_game)
        new ui.Countdown(selectors.view_game_timer, 30, '0', this.viewFinish, this)
        this.sound.play('game')


        selectors.view_game_score.innerText = this.foundItems.size
        selectors.view_game_item_status.innerText = 'SEARCHING'
        selectors.view_game_item.innerText = '...'

        this.interval_game = setInterval(()=> {

            this.detectionQueue.add(this.ai.current_predictions)

            // A detection is successful when...
            //  1. All detections in the queue agree (avoid one-off mistakes)
            var result = this.detectionQueue.found(this.detectionQueue)
            if (
                result.detectionResult
            ) {
                // When an item is detected, write the name to the UI
                selectors.view_game_item_status.innerText = 'FOUND'
                selectors.view_game_item.innerText = result.detectedItem

                // If the item has not be detected before...
                if (!this.foundItems.has(result.detectedItem) & Date.now() > this.detectionTimeout) {

                    // Celebrate with audio, add to foundItems and update score
                    this.sound.play('found')
                    this.foundItems.add(result.detectedItem)
                    selectors.view_game_score.innerText = this.foundItems.size
                    this.detectionTimeout = Date.now() + 2000

                    var canvas = document.createElement("canvas");
                    canvas.width = 480;
                    canvas.height = 480;
                    canvas.getContext('2d').drawImage(selectors.view_game_video, 0, 0, 480, 480);

                    this.gallery.push(canvas)

                }

            } else {
                // If no item is detected, write ... to UI
                selectors.view_game_item_status.innerText = 'SEARCHING'
                selectors.view_game_item.innerText = '...'
            }

        }, 100)

    }
    viewFinish() {
        this.sound.play('win')

        clearInterval(this.interval_game)
        this.ai.stop()
        camera.stop()

        selectors.view_finish_message.innerText = 'You found '+this.foundItems.size+' types of safety equipment.'

        for (let i = 0; i < this.foundItems.size; i++) {
            

            var photo = document.createElement('div')
            photo.classList.add('grid-item')

            var photoText = document.createElement('p')
            photoText.innerText = [...this.foundItems][i]

            photo.appendChild(this.gallery[i])
            photo.appendChild(photoText)

            selectors.view_finish_gallery.appendChild(photo)

        }
        
        this.screen.show(this.view_finish)
    }
}

var game = new Game()

selectors.view_start_button.addEventListener("click", game.viewLoading.bind(game), false);
selectors.view_loading_button.addEventListener("click", game.viewCountdown.bind(game), false);
selectors.view_finish_button.addEventListener("click", game.viewStart.bind(game), false);
