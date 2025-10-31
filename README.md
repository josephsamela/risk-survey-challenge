# Risk Survey Challenge

Use your camera to discover safety technology in the real world!

## About

The **Risk Survey Challenge** is a digital scavenger hunt where players use their phone camera to discover safety technology in the real world. When players discover an item, they can use the capture button to add it to their collection log. Discover all 12 types of safety technology to finish the collection log and complete the challenge!

The goal for this experience is to incentivize people explore their homes and workplaces and learn more about the safety technology all around us.

## Install

This app is available as a Progressive Web App (PWA). Add to Home Screen for the best experience!

### https://samela.io/risk-survey-challenge

### Apple

1. Open link in Safari.
2. Go to Share > Add to Home Screen > Add. Select "Open As Web App".

<img src="docs/ios.jpg" width="400px">

### Android

1. Open link in Chrome.
2. Go to ... > Add to Home screen > Install.

<img src="docs/android.jpg" width="400px">

## Collection Log

In the app, swipe down to access the *Collection Log*. Find an item with your camera and use the capture button to add it to your collection log. Discover all 12 types of safety technology to complete the collection log!

| Item              | Example                                              |
|-------------------|------------------------------------------------------|
| Ear Muffs         | <img src="docs/ear_muffs.jpg" width="200px">         |
| Emergency Lights  | <img src="docs/emergency_lights.jpg" width="200px">  |
| Exit Sign         | <img src="docs/exit_sign.jpg" width="200px">         |
| Fire Alarm        | <img src="docs/fire_alarm.jpg" width="200px">        |
| Fire Extinguisher | <img src="docs/fire_extinguisher.jpg" width="200px"> |
| Goggles           | <img src="docs/goggles.jpg" width="200px">           |
| Life Jacket       | <img src="docs/life_jacket.jpg" width="200px">       |
| Respirator        | <img src="docs/respirator.jpg" width="200px">        |
| Traffic Cone      | <img src="docs/traffic_cone.jpg" width="200px">      |
| Water Sensor      | <img src="docs/water_sensor.jpg" width="200px">      |
| Work Boots        | <img src="docs/work_boots.jpg" width="200px">        |
| Work Gloves       | <img src="docs/work_gloves.jpg" width="200px">       |

> [!NOTE]
> The computer vision component of this app uses a custom object recognition model developed specifically for this app. The model runs in the browser with [tensorflow.js](https://www.tensorflow.org/js). The model has only been trained to identify these 12 items with images of these exact items as training data. This means, it may not correctly recognize other versions of these items that are visually different.
