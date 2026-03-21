---
title: ROS2 Journey Part I
subtitle: Installation
date: 2023-03-03
tags: [ROS]
---
# ROS2 Journey I



从今天开始更新ROS2的系列。这一切的起因都源于一直以来想造车的冲动。同时也希望做一个能够持续迭代的项目。这个ROS2 Journey的系列应该可以持续更新下去，下周和学生一起开始一边做项目一边学习。



## Installation

#### 1. ROS or ROS2？

ROS还是ROS2想必是每一个学习ROS的人都会面临的第一个选择，ROS2作为ROS的进化版本，支持了很多新的特性，在ROS继续主导机器人领域的前提下，选择ROS2想必是更好的选择，缺点可能是资源较少，不过没关系，这也都是探索的过程。

ROS2有一系列版本，官网上ROS和ROS2最新的版本如下图所示。

![](/img/2023-03-03_20-22-44.png)

ROS的最新版本是Noetic，对应的是Ubuntu20.04。ROS2的最新版本是Humble，对应Ubuntu22.04。既然选择了ROS2，那自然就是ROS Humble了。值得一提的是，这个Hawksbill是玳瑁。

#### 2. 安装

Mac我选择在虚拟机安装Ubuntu22.04的方式安装ROS2，这也是目前来看较为便捷的方式。虚拟机软件Mac上还是选择Parallels Desktop，PD上安装Ubuntu相对简单，直接用自带的安装就可以安装ARM版的Ubuntu22.04。

![](/img/2023-03-03_20-52-17.png)

ROS2的安装也比较简单，跟着官方的[Tutorial](https://docs.ros.org/en/humble/Installation/Alternatives/Ubuntu-Development-Setup.html)就可以成功，主要还是需要科学上网。但是其中也遇到个别问题，这里简单总结一下。

首先第一个运行sudo apt update的时候提示  The following signatures couldn't be verified because the public key is not available: NO_PUBKEY F42ED6FBAB17C654。[解决办法](https://blog.csdn.net/shanpenghui/article/details/90755148)

其余遇到的坑已经不记得了，在安装的时候还是需要仔细一些。在运行的每一步的时候要多观察输出，出现任何错误都可能导致后续安装失败。最后使用talker和listener简单测试一下。

![](/img/2023-03-03_21-11-02.png)