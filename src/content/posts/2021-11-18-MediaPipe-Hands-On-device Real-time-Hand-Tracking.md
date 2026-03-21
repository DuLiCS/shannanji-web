---
title: MediaPipe Hands:On-device Real-time Hand Tracking
subtitle: Paper Reading
date: 2021-11-18
tags: [Paper Reading, Machine Learning]
---
## MediaPipe Hands: On-device Real-time Hand Tracking



这篇论文笔记是对文章MediaPipe Hands: On-device Real-time Hand Tracking的阅读笔记。

阅读等级：

*  泛读

分类：

*  感兴趣文章


### Abstract

We present **a real-time on-device hand tracking solution** that predicts a hand skeleton of a human from a single RGB camera for AR/VR applications.

Our pipeline consists of two models: **1) a palm detector**, that is providing a bounding box of a hand to, 2) **a hand landmark model**, that is predicting the hand skeleton.

### Intro

Our main contributions are:

An efficient two-stage hand tracking pipeline that can track multiple hands in real-time on mobile devices.
A hand pose estimation model that is capable of pre- dicting 2.5D hand pose with only RGB input.
And open source hand tracking pipeline as a ready-to-go solution on a variety of platforms, including An- droid, iOS, Web and desktop PCs.

### Architecture

Our hand tracking solution utilizes an ML pipeline consisting of two models working together:
1


Apalmdetectorthatoperatesonafullinputimageand locates palms via an oriented hand bounding box.
A hand landmark model that operates on the cropped hand bounding box provided by the palm detector and returns high-fidelity 2.5D landmarks.


### Datasets

In-the-wild dataset: This dataset contains 6K images of large variety, e.g. geographical diversity, various lighting conditions and hand appearance. The limita- tion of this dataset is that it doesn’t contain complex articulation of hands.
In-house collected gesture dataset: This dataset con- tains 10K images that cover various angles of all phys- ically possible hand gestures. The limitation of this dataset is that it’s collected from only 30 people with limited variation in background. The in-the-wild and in-house dataset are great complements to each other to improve robustness.
Synthetic dataset: To even better cover the possi- ble hand poses and provide additional supervision for depth, we render a high-quality synthetic hand model over various backgrounds and map it to the corre- sponding 3D coordinates. We use a commercial 3D hand model that is rigged with 24 bones and includes 36 blendshapes, which control fingers and palm thick- ness. The model also provides 5 textures with differ- ent skin tones. We created video sequences of trans- formation between hand poses and sampled 100K im- ages from the videos. We rendered each pose with a random high-dynamic-range lighting environment and three different cameras. See Figure 4 for examples.


### Implementation

* One key optimization MediaPipe provides is that the palm detector only runs as needed (fairly infrequently), saving significant computation. 

### Conclusion

In this paper, we proposed MediaPipe Hands, an end-to- end hand tracking solution that achieves real-time perfor- mance on multiple platforms. Our pipeline predicts 2.5D landmarks without any specialized hardware and thus, can be easily deployed to commodity devices. We open sourced the pipeline to encourage researchers and engineers to build gesture control and creative AR/VR applications with our pipeline.



### 读后感


通篇文章很简单，没有数学公式。优越性在于实时，包含了几个部分，手掌检测和关键点。手掌检测只在开始和没有检测到手的时候开启。
构建了数据集，使用了神经网络作为decoder。

主要是使用，文章看了下没有什么，主要是块可以实时，再就是多平台包括移动设备通用。