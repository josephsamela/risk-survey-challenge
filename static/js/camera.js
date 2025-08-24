
export function start(){
    var video = document.querySelector("#videoElement");
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia(
            { 
                video: {
                    facingMode: 'environment'
                }
            }
        )
        .then(function (stream) {
            video.srcObject = stream;
            return true
        })
        .catch(function (error) {
            console.log(error);
            return false
        });
    }
}

export function stop(){
    var video = document.querySelector("#videoElement");
    video.srcObject.getTracks().forEach(function(track) {
        track.stop();
    });
}
