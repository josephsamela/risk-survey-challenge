
export class Sound {
    constructor() {
        this.countdown = new Audio('static/audio/countdown.mp4');
        this.game = new Audio('static/audio/game.mp3');
        this.win = new Audio('static/audio/win.mp4');
        this.button = new Audio('static/audio/button.mp3');
        this.found = new Audio('static/audio/found.mp3');
        this.capture_open = new Audio('static/audio/capture_open.mp3');
        this.capture_close = new Audio('static/audio/capture_close.mp3');
        this.shutter = new Audio('static/audio/shutter.mp3');

        this.reset()
    }
    reset() {
        this.countdown.play()
        this.game.play()
        this.win.play()
        this.button.play()
        this.found.play()

        this.countdown.pause()
        this.game.pause()
        this.win.pause()
        this.button.pause()
        this.found.pause()
    }
    play(name) {

        switch (name) {
            case 'countdown':
                this.countdown.play()
                break;
            case 'game':
                this.game.play()
                break;
            case 'win':
                this.win.play()
                break;
            case 'button':
                this.button.play()
                break;
            case 'found':
                this.found.play()
                break;
            case 'capture_open':
                this.capture_open.play()
                break;
            case 'capture_close':
                this.capture_close.play()
                break;
            case 'shutter':
                this.shutter.play()
                break;
        
        }

    }

}
