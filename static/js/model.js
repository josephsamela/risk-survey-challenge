
export class Model {
    constructor(source, model_url) {
        this.source = source

        this.modelURL = 'static/model/model.json'
        this.metadataURL = 'static/model/metadata.json'

        // this.modelURL = model_url + "model.json";
        // this.metadataURL = model_url + "metadata.json";
        this.interval = null
        
    }
    async predict(t) {

        if (!t.hasOwnProperty('model')) {
            t.model = await tmImage.load(t.modelURL, t.metadataURL);
        }

        if (!t.hasOwnProperty('labels')) {
            t.labels = new Set(t.model._metadata.labels)
  
            t.labels.delete('Nothing')
            t.labels.delete('Background')
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

        if (!predictions) {
            return
        }

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
