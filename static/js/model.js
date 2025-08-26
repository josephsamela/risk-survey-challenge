
// export class Model {
//     constructor(source, model) {
//         this.source = source
//         this.model = model
//         this.current_predictions = []
//         this.interval = null
//     }
//     predict(t) {

//         tf.tidy( ()=> {

//             t.model.load()
//             .then(model => {
//                 model.detect(
//                     t.source
//                 )
//                 .then(predictions => {
//                     t.current_predictions = []
//                     predictions.forEach(p => {
//                         t.current_predictions.push(p.class)
//                     });
//                 })
//             })
//         })

//     }
//     start() {
//         this.interval = setInterval(this.predict, 1000, this)
//     }
//     stop() {
//         clearInterval(this.interval)
//     }
// }

export class Model {
    constructor(source, model_url) {
        this.source = source

        this.modelURL = model_url + "model.json";
        this.metadataURL = model_url + "metadata.json";
        this.interval = null
        
    }
    async predict(t) {

        if (!t.hasOwnProperty('model')) {
            t.model = await tmImage.load(t.modelURL, t.metadataURL);
        }

        tf.tidy( ()=> {
            t.model.predict(t.source).then((result) => {
                t.current_predictions = result
            })
        })
    }
    start() {
        this.interval = setInterval(this.predict, 100, this)
    }
    stop() {
        clearInterval(this.interval)
    }
}

export class Queue {
    constructor(size) {
        this.size = size
        this.empty()
    }
    add(predictions) {

        var maxProbability = 0
        var maxPrediction = null

        predictions.forEach(p => {
            if (p.probability > maxProbability) {
                maxProbability = p.probability
                maxPrediction = p
            }
        });

        this.array.push(maxPrediction)
        if (this.array.length > this.size) {
            this.array.shift()
        }
    }
    // equal() {
    //     if (new Set(this.array).size == 1) {
    //         return true
    //     } else {
    //         return false
    //     }
    // }

    found() {
        var predictionClasses = new Set()

        for (let i = 0; i < this.array.length; i++) {

            var p = this.array[i]
            
            if (p == null) {
                return {
                    detectionResult: false,
                    detectedItem: null
                }
            }

            if (p.probability < 0.98) {
                return {
                    detectionResult: false,
                    detectedItem: null
                }
            }
            predictionClasses.add(p.className)

        }

        var detectedItem = [...predictionClasses][0]

        if (predictionClasses.size == 1 & detectedItem != 'Nothing') {

            return {
                detectionResult: true,
                detectedItem: detectedItem
            }

        } 
        else {
            return {
                detectionResult: false,
                detectedItem: null
            }
        }

    }

    empty() {
        this.array = Array(this.size).fill(null)
    }
}
