import os
import cv2

base_path = 'training'
categories = os.listdir(f'{base_path}/raw')

for category in categories:

    if category.startswith('.'):
        continue

    training_videos = os.listdir(f'{base_path}/raw/{category}')
    os.mkdir(f'{base_path}/processed/{category}')

    for training_video in training_videos:
        video = cv2.VideoCapture(f'{base_path}/raw/{category}/{training_video}')
        success,image = video.read()
    
        frame = 1
        skip = 0
        while success:
            success,image = video.read()
            frame += 1
            if skip > 24:
                try:
                    cv2.imwrite(
                        f'{base_path}/processed/{category}/{training_video}-{frame}.jpg', 
                        image
                    )
                except:
                    continue
                print(f'IMAGE | {category}/{training_video}-{frame}.jpg')
                skip = 0
            else:
                skip += 1         
