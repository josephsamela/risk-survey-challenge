import * as ui from './ui.js';
import * as audio from './audio.js';
import * as camera from './camera.js';
import * as selectors from './selectors.js';
import * as model from './model.js';

class Game {
    constructor() {

        this.view_start = new ui.View(selectors.view_start)
        this.view_instructions = new ui.View(selectors.view_instructions)
        this.view_camera_permission = new ui.View(selectors.view_camera_permission)
        this.view_countdown = new ui.View(selectors.view_countdown)
        this.view_game = new ui.View(selectors.view_game)

        this.views = [
            this.view_start,
            this.view_instructions,
            this.view_camera_permission,
            this.view_countdown,
            this.view_game
        ]

        this.screen = new ui.ViewController(this.views)
        // this.ai = new model.Model(selectors.view_game_video, cocoSsd)
        // this.ai = new model.TFModel(selectors.view_game_discover_camera)

        this.ai = new model.Model(
            selectors.view_game_discover_camera, 
            './static/model/'
        )

        this.foundItems = new Set()
        this.interval_game = null
        this.detectionQueue = new model.Queue(10)
        this.captureOpen = false
        this.collectionLogBuilt = false
    }
    
    callbackStart() {
        this.sound = new audio.Sound()
        this.sound.play('button')
        ui.haptic()
        this.ai.start()
        // this.viewCountdown()
        this.viewCameraPermission()
    }

    viewCameraPermission() {
        this.screen.show(this.view_camera_permission)
        var camera_permission = camera.start()
        var checkCameraPermissionInterval = setInterval(()=>{
            navigator.permissions.query({name: 'camera'})
            .then((result) => {
                if (result.state == 'granted') {
                    clearInterval(checkCameraPermissionInterval)
                    this.viewCountdown()
                }
            })
        }, 100)
    }

    viewCountdown() {
        this.sound.play('button')
        this.screen.show(this.view_countdown)
        new ui.Countdown(selectors.view_countdown_value, 3, 'GO!', this.callbackGame, this)
        this.ai.start()
        this.sound.play('countdown')
    }

    buildCollectionLog() {
        selectors.view_game_drawer_toolbar_score_text.innerText = `${this.foundItems.size}/${this.ai.labels.size}`

        for (let label of this.ai.labels) {
            var item = document.createElement('div')
            var placeholder = document.createElement('div')
            var title = document.createElement('p')

            title.innerText = label

            item.classList.add('view_game_drawer_log_gallery_item')
            item.classList.add('not_collected')
            item.id = `view_game_drawer_log_gallery_item_${label}`
            item.appendChild(placeholder)
            item.appendChild(title)

            selectors.view_game_drawer_log_gallery.appendChild(item)
        }

        this.collectionLogBuilt = true
    }

    callbackGame() {
        this.screen.show(this.view_game)
        window.scrollTo(0, document.body.scrollHeight);

        var camera_permission = camera.start()
        // this.sound.play('game')

        this.interval_game = setInterval(()=> {

            this.detectionQueue.add(this.ai.current_predictions)

            if (!this.collectionLogBuilt & this.ai.hasOwnProperty('labels')) {
                this.buildCollectionLog()
            }

            // A detection is successful when...
            //  1. All detections in the queue agree
            var result = this.detectionQueue.found(this.detectionQueue)
            if (
                result.detectionResult
            ) {
                if (!this.captureOpen) {
                    selectors.view_game_discover_capture.classList.add('view_game_discover_capture_detection')
                    this.sound.play('capture_open')
                    ui.haptic()
                    selectors.view_game_discover_capture_title.innerText = result.detectedItem
                    selectors.view_game_discover_capture_subtitle.innerText = 'FOUND'
                    this.captureOpen = true
                }
            } else {

                if (this.captureOpen) {
                    selectors.view_game_discover_capture.classList.remove('view_game_discover_capture_detection')
                    this.sound.play('capture_close')
                    ui.haptic()
                    selectors.view_game_discover_capture_title.innerText = '...'
                    selectors.view_game_discover_capture_subtitle.innerText = 'SEARCHING'
                    this.captureOpen = false
                }
            }

        }, 100)

    }

    callbackCapture() {
        this.sound.play('shutter')

        var result = this.detectionQueue.found(this.detectionQueue)

        // Add image to collection log
        var canvas = document.createElement("canvas");
        canvas.width = 480;
        canvas.height = 480;
        canvas.getContext('2d').drawImage(selectors.view_game_discover_camera, 0, 0, 480, 480);

        var text = document.createElement('p')
        text.innerText = result.detectedItem

        var item = document.getElementById(`view_game_drawer_log_gallery_item_${result.detectedItem}`)

        item.innerHTML = ''
        item.classList.remove('not_collected')
        item.appendChild(canvas)
        item.appendChild(text)

        // If the item has not be detected before...
        if (!this.foundItems.has(result.detectedItem)) {

            this.sound.play('found')

            // Celebrate with audio, add to foundItems and update score
            this.foundItems.add(result.detectedItem)
            selectors.view_game_drawer_toolbar_score_text.innerText = `${this.foundItems.size}/${this.ai.labels.size}`

            // If all items are found...
            if (this.foundItems.size == this.ai.labels.size) {
                this.sound.play('win')
            }


        }

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

selectors.view_start_button.addEventListener("click", game.callbackStart.bind(game));
selectors.view_game_discover_capture_button.addEventListener("click", game.callbackCapture.bind(game));
