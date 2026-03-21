---
title: Jetbot Series Part I
subtitle: Overview
date: 2020-01-21
tags: [Jetbot, Jetson Nano]
---

<p style="text-indent:2em">经过了半个多月的更新,我发现完全使用英文会在一定程度上拖慢更新的节奏,说白了还是英语太渣了,无法很快的使用另一种语言把想表达的东西表达清楚.之后可能会穿插着进行,毕竟写这些post并不是完全为了练习英文表达.</p>
<p style="text-indent:2em">这次准备继续开坑(貌似之前的坑还没有填完的样子,说的就是你,Kaggle和感知器学习算法).不过无所谓了,就是要把新坑开起来.</p>

### 1.背景
<p style="text-indent:2em">先说下为什么要开这个新的系列.第一是因为放假了,有一段较长的时间可以准备开这个新坑,还有就是手头可以玩的东西不少,光吃灰可不行.最早因为感兴趣买了树莓派回来,直接上图.</p>

![imge here](/img/Raspberry.jpg)

<p style="text-indent:2em">树莓派的好处是便宜,资源多以及其他不少好处.拿他做的东西也不算多.去年夏天的时候,为了做一个简单的垃圾分类系统,用了下树莓派.东西的原理很简单,就是通过摄像头识别预先学习好的样本,也就是简单的用了下tensorflow的基本知识,搭建了一个小型的系统,但是树莓派的机能毕竟有限,从采集图像到最终分类成功,至少需要10s以上,这样的速度显然是无法让人满意的,如果今后由于样本的增多,使用神经网络更复杂的话,显然就超出了树莓派的能力范围了.</p>
<p style="text-indent:2em">为了寻找他的替代品,我们就把目光投向了Jetson系列产品.入门款当然就是<a href="https://www.nvidia.cn/autonomous-machines/embedded-systems/jetson-nano/">Jetson Nano</a>,官方网站有比较详细的介绍,对比树莓派来说,在于对构建机器学习项目上天生的优势(cuda),毕竟有Nvidia强大的支持.功耗同样非常小,在10W以内.再加上其小巧的特点,因此应用场景非常丰富.</p>
<p style="text-indent:2em">我们的标题是Jetbot,那Jetbot又是什么呢?简而言之就是官方提供的一种Jetson Nano的实现形式.还是直接上图.</p>

![imge here](/img/jetbot.jpg)

<p style="text-indent:2em">图中所示就是组装好的Jetbot小车,最上面是风扇,中间那块板子就是Jetson Nano,最下面是电机电池等等.这一系列文章将记录我捣鼓这块板子的过程.</p>

<p style="text-indent:2em">Jetbot的好处在于资源很丰富,主要的第一手学习资料来自于<a href="https://github.com/NVIDIA-AI-IOT/jetbot">NVIDIA-AI-IOT</a>.这里简单说一下开始前的准备工作.主要有三步.</p>

1. 硬件清单

<p style="text-indent:2em">官方给出了所有零件的清单以及购买链接,这个在官方的guide里就能找到.另外对于一部分部件,给出了STL文件可以进行3D打印,我是直接购买的部件,这部分简单略过.</p>
2. 硬件组装

<p style="text-indent:2em">由于之前组装的过程并没有进行记录,因此只有现在的成品给大家展示,硬件组装这部分有很多资料,很快就能组装完成.</p>

3. 软件安装

软件这部分算是重头戏.

Step 1:烧写镜像到SD卡.

1.下载链接没有VPN打不开,因此可能需要想点办法.

2.SD卡放在读卡器插入电脑.

3.用Etcher烧写.

Step 2:启动Jetson Nano

烧写完将SD卡插入板子就可以开机了.系统默认用户名和密码都是jetbot.

Step 3:连接WiFi

我买的套件里并没有无线网卡,因此自己额外花钱买了无线网卡,安装起来也很简单M.2接口,也不需要专业工具.因为作为小车,连着网线自然是不现实的,而且没有WIFi的情况下,piOLED屏也不显示.所有这些配置完毕后,就不需要再连接显示器和鼠标键盘了.之后的操作都在自己的电脑上完成.

<p style="text-indent:2em">接下来先看一下万事俱备后是什么样的,以及piOLED屏上显示的都是什么</p>

![imge here](/img/jetbot_led.jpg)

<p style="text-indent:2em">第一行eth0指的有线连接的信息,这个暂时没有什么用,由于没有连接,所以是None.第二行wlan0就是无线连接信息,显示的是IP地址,这个在之后会用到.第四行mem指的内存使用情况,一共是4G内存.最后一行是内存使用量,我们使用的是128G内存卡.</p>

Step 4:使用浏览器连接Jetbot并进行控制

连接过程非常简单,之前piOLED显示屏上显示有IP地址,我们直接在同一网段下的另一台电脑上输入IP地址:8888,我这里输入192.168.0.107:8888,输入默认密码jetbot就会远程连接上jupyter lab.

![remote_connection](/img/remote_connection.png)

现在就可以直接在这个环境下进行操作了.

最后我们要将Jetson nano调整到5W模式.首先连接http://<jetbot_ip_address>:8888,点击+,新建一个terminal,这相当于在系统中的控制台.接着输入下面代码设置并检查是否进入5W模式.

```
sudo nvpmodel -m1
sudo nvpmodel -q
```
![](/img/5W_model.png)

Step 5:官方examples
接下来我们要准备跑一些简单的例子,通过这些例子来进行学习.首先进入terminal,将官方仓库clone到本机.

```
git clone https://github.com/NVIDIA-AI-IOT/jetbot
cd jetbot
sudo python3 setup.py install
```
<p style="text-indent:2em">打开文件目录Notebooks我们看到主要有4个简单的程序.分别是basic motion,collision avoidence,object following以及teleoperation,这四个部分会各写一个post进行介绍.</p>

EOF