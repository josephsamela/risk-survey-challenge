import * as selectors from './selectors.js';

export function start(){
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia(
            {
                video: {
                    facingMode: "environment"
                }
            }
        )
        .then(function (stream) {
            selectors.view_game_discover_camera.srcObject = stream;
            return true
        })
        .catch(function (error) {
            console.log(error);
            return false
        });
    }
}

export function stop(){
    selectors.view_game_discover_camera.srcObject.getTracks().forEach(function(track) {
        track.stop();
    });
}
