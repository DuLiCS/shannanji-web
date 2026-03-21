---
title: Lerobot SO-ARM100 Part II
subtitle: 软件调试
date: 2025-04-27
tags: [Project, Robot]
---
# Lerobot 软件调试

硬件部分参见[文章](https://dulics.github.io/2025-04-23-Lerobot-SO-ARM100-Part-I/)。这一篇主要是软件部分，现在还在等东西陆续到位，五一前应该没有问题，现在刚好提前把要做的事情过一下，提高效率。

## 1. Install LeRobot

1. 安装Miniconda（anconda也可以，总而言之，能执行conda命令就可以）。
2. 重启shell。
3. 创建并激活conda环境

   ```
   conda create -y -n lerobot python=3.10
   conda activate lerobot
   ```

4. 克隆LeRobot
   ```
   git clone https://github.com/huggingface/lerobot.git ~/lerobot
   ```

5. 安装ffmpeg
   ```
   conda install ffmpeg -c conda-forge
   ```

6. 安装飞特电机的依赖
   ```
   cd ~/lerobot && pip install -e ".[feetech]"
   ```

## 2.配置电机

### 2.1 配置电机

1. 找到每条机械臂的 USB 端口
   
   驱动板连接电源、type c连接驱动板和计算机（我这里是mac）。运行下面的程序,出现Remove the USB cable from your MotorsBus and press Enter when done.后拔下usb按回车：

   ```
   python lerobot/scripts/find_motors_bus_port.py
   ```
   我的输出如下：

   ```
   python lerobot/scripts/find_motors_bus_port.py
   Finding all available ports for the MotorsBus.
   Ports before disconnecting: ['/dev/tty', '/dev/ttyp0', '/dev/ttyp1', '/dev/ttyp2', '/dev/ttyp3', '/dev/ttyp4', '/dev/ttyp5', '/dev/ttyp6', '/dev/ttyp7', '/dev/ttyp8', '/dev/ttyp9', '/dev/ttypa', '/dev/ttypb', '/dev/ttypc', '/dev/ttypd', '/dev/ttype', '/dev/ttypf', '/dev/ttyq0', '/dev/ttyq1', '/dev/ttyq2', '/dev/ttyq3', '/dev/ttyq4', '/dev/ttyq5', '/dev/ttyq6', '/dev/ttyq7', '/dev/ttyq8', '/dev/ttyq9', '/dev/ttyqa', '/dev/ttyqb', '/dev/ttyqc', '/dev/ttyqd', '/dev/ttyqe', '/dev/ttyqf', '/dev/ttyr0', '/dev/ttyr1', '/dev/ttyr2', '/dev/ttyr3', '/dev/ttyr4', '/dev/ttyr5', '/dev/ttyr6', '/dev/ttyr7', '/dev/ttyr8', '/dev/ttyr9', '/dev/ttyra', '/dev/ttyrb', '/dev/ttyrc', '/dev/ttyrd', '/dev/ttyre', '/dev/ttyrf', '/dev/ttys0', '/dev/ttys1', '/dev/ttys2', '/dev/ttys3', '/dev/ttys4', '/dev/ttys5', '/dev/ttys6', '/dev/ttys7', '/dev/ttys8', '/dev/ttys9', '/dev/ttysa', '/dev/ttysb', '/dev/ttysc', '/dev/ttysd', '/dev/ttyse', '/dev/ttysf', '/dev/ttyt0', '/dev/ttyt1', '/dev/ttyt2', '/dev/ttyt3', '/dev/ttyt4', '/dev/ttyt5', '/dev/ttyt6', '/dev/ttyt7', '/dev/ttyt8', '/dev/ttyt9', '/dev/ttyta', '/dev/ttytb', '/dev/ttytc', '/dev/ttytd', '/dev/ttyte', '/dev/ttytf', '/dev/ttyu0', '/dev/ttyu1', '/dev/ttyu2', '/dev/ttyu3', '/dev/ttyu4', '/dev/ttyu5', '/dev/ttyu6', '/dev/ttyu7', '/dev/ttyu8', '/dev/ttyu9', '/dev/ttyua', '/dev/ttyub', '/dev/ttyuc', '/dev/ttyud', '/dev/ttyue', '/dev/ttyuf', '/dev/ttyv0', '/dev/ttyv1', '/dev/ttyv2', '/dev/ttyv3', '/dev/ttyv4', '/dev/ttyv5', '/dev/ttyv6', '/dev/ttyv7', '/dev/ttyv8', '/dev/ttyv9', '/dev/ttyva', '/dev/ttyvb', '/dev/ttyvc', '/dev/ttyvd', '/dev/ttyve', '/dev/ttyvf', '/dev/ttyw0', '/dev/ttyw1', '/dev/ttyw2', '/dev/ttyw3', '/dev/ttyw4', '/dev/ttyw5', '/dev/ttyw6', '/dev/ttyw7', '/dev/ttyw8', '/dev/ttyw9', '/dev/ttywa', '/dev/ttywb', '/dev/ttywc', '/dev/ttywd', '/dev/ttywe', '/dev/ttywf', '/dev/tty.OTR', '/dev/tty.vector', '/dev/tty.EMBERTON', '/dev/tty.Pyra', '/dev/tty.Bluetooth-Incoming-Port', '/dev/ttys001', '/dev/ttys000', '/dev/ttys002', '/dev/tty.wchusbserial5A460840351', '/dev/tty.usbmodem5A460840351', '/dev/ttys003']
   Remove the USB cable from your MotorsBus and press Enter when done.

   Traceback (most recent call last):
   File "/Users/duli/CS/Project/lerobot-ARM/lerobot/lerobot/scripts/find_motors_bus_port.py", line 55, in <module>
      find_port()
      ~~~~~~~~~^^
   File "/Users/duli/CS/Project/lerobot-ARM/lerobot/lerobot/scripts/find_motors_bus_port.py", line 50, in find_port
      raise OSError(f"Could not detect the port. More than one port was found ({ports_diff}).")
   OSError: Could not detect the port. More than one port was found (['/dev/tty.usbmodem5A460840351', '/dev/tty.wchusbserial5A460840351']).
   ```

   这里是因为找到了两个port，原因和mac的端口机制有关。参照官方示例选择了usbmodem5A460840351。

2. 修改配置。

   根据主从臂的端口号修改配置文件。同一块驱动板改动usb端口并不改变端口号。文件位置在lerobot/common/robot_devices/robots/configs.py 434行的位置。

   ```
   @RobotConfig.register_subclass("so100")
   @dataclass
   class So100RobotConfig(ManipulatorRobotConfig):
      calibration_dir: str = ".cache/calibration/so100"
      # `max_relative_target` limits the magnitude of the relative positional target vector for safety purposes.
      # Set this to a positive scalar to have the same value for all motors, or a list that is the same length as
      # the number of motors in your follower arms.
      max_relative_target: int | None = None

      leader_arms: dict[str, MotorsBusConfig] = field(
         default_factory=lambda: {
               "main": FeetechMotorsBusConfig(
                  port="/dev/tty.usbmodem58760431091",  <-- UPDATE HERE
                  motors={
                     # name: (index, model)
                     "shoulder_pan": [1, "sts3215"],
                     "shoulder_lift": [2, "sts3215"],
                     "elbow_flex": [3, "sts3215"],
                     "wrist_flex": [4, "sts3215"],
                     "wrist_roll": [5, "sts3215"],
                     "gripper": [6, "sts3215"],
                  },
               ),
         }
      )

      follower_arms: dict[str, MotorsBusConfig] = field(
         default_factory=lambda: {
               "main": FeetechMotorsBusConfig(
                  port="/dev/tty.usbmodem585A0076891",  <-- UPDATE HERE
                  motors={
                     # name: (index, model)
                     "shoulder_pan": [1, "sts3215"],
                     "shoulder_lift": [2, "sts3215"],
                     "elbow_flex": [3, "sts3215"],
                     "wrist_flex": [4, "sts3215"],
                     "wrist_roll": [5, "sts3215"],
                     "gripper": [6, "sts3215"],
                  },
               ),
         }
      )
    ```

3. 设置电机ID

   分别插入电机运行代码如下,配置ID1-6，主从电机分别执行。执行后贴标签：

   ```
      python lerobot/scripts/configure_motor.py \
   --port /dev/tty.usbmodem58760432961 \
   --brand feetech \
   --model sts3215 \
   --baudrate 1000000 \
   --ID 1
   ```
   、、、
   python lerobot/scripts/configure_motor.py \
  --port /dev/tty.usbmodem5A460831501 \
  --brand feetech \
  --model sts3215 \
  --baudrate 1000000 \
  --ID 1
   Connected on port /dev/tty.usbmodem5A460831501
   Scanning all baudrates and motor indices
   100%|████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████| 9/9 [00:00<00:00, 16.42it/s]
   Motor index found at: 1
   Setting its index to desired index 1
   Present Position [2047]
   Offset [0]
   Disconnected from motor bus.
   python lerobot/scripts/configure_motor.py \
   --port /dev/tty.usbmodem5A460831501 \
   --brand feetech \
   --model sts3215 \
   --baudrate 1000000 \
   --ID 2
   Connected on port /dev/tty.usbmodem5A460831501
   Scanning all baudrates and motor indices
   100%|████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████| 9/9 [00:00<00:00, 16.44it/s]
   Motor index found at: 1
   Setting its index to desired index 2
   Present Position [2047]
   Offset [0]
   Disconnected from motor bus.
   python lerobot/scripts/configure_motor.py \
   --port /dev/tty.usbmodem5A460831501 \
   --brand feetech \
   --model sts3215 \
   --baudrate 1000000 \
   --ID 3
   Connected on port /dev/tty.usbmodem5A460831501
   Scanning all baudrates and motor indices
   100%|████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████| 9/9 [00:00<00:00, 16.44it/s]
   Motor index found at: 1
   Setting its index to desired index 3
   Present Position [2051]
   Offset [0]
   Disconnected from motor bus.
   python lerobot/scripts/configure_motor.py \
   --port /dev/tty.usbmodem5A460831501 \
   --brand feetech \
   --model sts3215 \
   --baudrate 1000000 \
   --ID 4
   Connected on port /dev/tty.usbmodem5A460831501
   Scanning all baudrates and motor indices
   100%|████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████| 9/9 [00:00<00:00, 16.44it/s]
   Motor index found at: 1
   Setting its index to desired index 4
   Present Position [2046]
   Offset [0]
   Disconnected from motor bus.
   python lerobot/scripts/configure_motor.py \
   --port /dev/tty.usbmodem5A460831501 \
   --brand feetech \
   --model sts3215 \
   --baudrate 1000000 \
   --ID 5
   Connected on port /dev/tty.usbmodem5A460831501
   Scanning all baudrates and motor indices
   100%|████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████| 9/9 [00:00<00:00, 16.44it/s]
   Motor index found at: 1
   Setting its index to desired index 5
   Present Position [2050]
   Offset [0]
   Disconnected from motor bus.
   python lerobot/scripts/configure_motor.py \
   --port /dev/tty.usbmodem5A460831501 \
   --brand feetech \
   --model sts3215 \
   --baudrate 1000000 \
   --ID 6
   Connected on port /dev/tty.usbmodem5A460831501
   Scanning all baudrates and motor indices
   100%|████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████| 9/9 [00:00<00:00, 16.44it/s]
   Motor index found at: 1
   Setting its index to desired index 6
   Present Position [2049]
   Offset [0]
   Disconnected from motor bus.
   ```


### 2.2 拆除主臂电机的齿轮。

   开盖后去除齿轮。** 特别强调：拆除时不能移动轴，否则很麻烦！！！！ **。另外，螺丝非常紧，一定要找好趁手的工具，拆了4个手快废了，上面的两个螺丝非常难拆，有一颗螺丝差点滑丝，用钳子取下来的。今天已经买了电动工具，工欲善其事，必先利其器。


## 3. 校准

安装好所有后，需要对电机进行校准。


```
python lerobot/scripts/control_robot.py \
  --robot.type=so100 \
  --robot.cameras='{}' \
  --control.type=calibrate \
  --control.arms='["main_follower"]'
```



按照提示摆所有的位置。



| 1. Middle position | 2. Zero position                                                                                                                                       | 3. Rotated position                                                                                                                                             | 4. Rest position                                                                                                                                       |
| ------------ |------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ![](/img/follower_middle.jpg)| ![](/img/follower_zero.jpg) | ![](/img/follower_rotated.jpg) | ![](/img/follower_rest.jpg) |



对主机械臂的校准也是一样的。


```
python lerobot/scripts/control_robot.py \
  --robot.type=so100 \
  --robot.cameras='{}' \
  --control.type=calibrate \
  --control.arms='["main_leader"]'
```

## 4.遥控

这部分检查主机械臂和从机械臂的随动功能。也就是从机械臂按照从机械臂的动作来行动。

```
python lerobot/scripts/control_robot.py \
  --robot.type=so100 \
  --robot.cameras='{}' \
  --control.type=teleoperate
```

## 5.录制dataset


录制的第一步时先在hugging-face生成一个有写入权限的token，[地址如下](https://huggingface.co/settings/tokens)。** 特别要注意的是，token的值只会在生成时出现一次，一定要记好了。**

![](/img/2025-05-29_10-37-46.jpg)

```
huggingface-cli login --token ${HUGGINGFACE_TOKEN} --add-to-git-credential
```
${HUGGINGFACE_TOKEN}这个就是token的value。

![](/img/2025-05-29_10-59-19.jpg)


下一步就是测试摄像头。我拿了两个一样型号的USB摄像头进行录制，结果两个都插在拓展坞就只能显示一个，想办法用OBS转换虚拟摄像头也不行，最后的方案是iPhone摄像头加USB摄像头的方式，然后就可以录制了。



```
python lerobot/scripts/control_robot.py \
  --robot.type=so100 \
  --control.type=record \
  --control.fps=30 \
  --control.single_task="Grasp a lego block and put it in the bin." \
  --control.repo_id=${HF_USER}/so100_test \
  --control.tags='["so100","tutorial"]' \
  --control.warmup_time_s=5 \
  --control.episode_time_s=30 \
  --control.reset_time_s=30 \
  --control.num_episodes=2 \
  --control.push_to_hub=true

```

## 6.可视化

录制完毕之后可以进行可视化。


```
python lerobot/scripts/visualize_dataset_html.py \
  --repo-id dulics/so100_test \
  --port 9091
```

默认是9090端口，这里是因为被占用，换了一个。

![](/img/2025-05-29_11-09-26.jpg)

![](/img/2025-05-29_11-13-51.jpg)

这里是测试的录制，忽略摄像头的位置。


## 7.回放

```
python lerobot/scripts/control_robot.py \
  --robot.type=so100 \
  --control.type=replay \
  --control.fps=30 \
  --control.repo_id=${HF_USER}/so100_test \
  --control.episode=0
```

执行命令后就可以回放刚才的动作。

![](/img/2025-05-29_11-40-48.jpg)

## 7.训练策略

现在要训练首先需要找到dataset，位置在/Users/{Username}/.cache/huggingface/datasets/。我没有显卡，于是需要开云服务器训练，我用了矩池云的服务器。首先还是装环境，和之前完全一样。

```
conda create -n lerobot python=3.10 -y
conda activate lerobot
pip install torch torchvision
# 你用的 LeRobot 版本，建议用源码安装或 requirements.txt 安装
git clone https://github.com/huggingface/lerobot.git
cd lerobot
pip install -e ".[feetech]"
```

安装好后，我把so100_test文件夹放在了lerobot文件夹下，然后运行下面的命令就可以。

```
(lerobot) root@ZkpE5J:/lerobot# python lerobot/scripts/train.py   --dataset.repo_id=so100_test   --dataset.root=so100_test   --policy.type=act   --output_dir=outputs/train/act_so100_test   --job_name=act_so100_test   --policy.device=cuda
```

在这其中有各种小问题，一般是缺包或者ffmpeg没有安装安装相应的东西就可以。

```
conda install -c conda-forge ffmpeg
```

我用的3090的服务器，训练时间大约需要3小时。

```
INFO 2025-05-30 23:52:00 ts/train.py:117 Logs will be saved locally.
INFO 2025-05-30 23:52:00 ts/train.py:127 Creating dataset
INFO 2025-05-30 23:52:01 ts/train.py:138 Creating policy
INFO 2025-05-30 23:52:02 ts/train.py:144 Creating optimizer and scheduler
INFO 2025-05-30 23:52:02 ts/train.py:156 Output dir: outputs/train/act_so100_test
INFO 2025-05-30 23:52:02 ts/train.py:159 cfg.steps=100000 (100K)
INFO 2025-05-30 23:52:02 ts/train.py:160 dataset.num_frames=1792 (2K)
INFO 2025-05-30 23:52:02 ts/train.py:161 dataset.num_episodes=2
INFO 2025-05-30 23:52:02 ts/train.py:162 num_learnable_params=51597190 (52M)
INFO 2025-05-30 23:52:02 ts/train.py:163 num_total_params=51597238 (52M)
INFO 2025-05-30 23:52:02 ts/train.py:202 Start offline training on a fixed dataset
INFO 2025-05-30 23:52:29 ts/train.py:232 step:200 smpl:2K ep:2 epch:0.89 loss:6.849 grdn:154.061 lr:1.0e-05 updt_s:0.132 data_s:0.003
INFO 2025-05-30 23:52:55 ts/train.py:232 step:400 smpl:3K ep:4 epch:1.79 loss:2.965 grdn:84.900 lr:1.0e-05 updt_s:0.126 data_s:0.004
INFO 2025-05-30 23:53:21 ts/train.py:232 step:600 smpl:5K ep:5 epch:2.68 loss:2.489 grdn:73.559 lr:1.0e-05 updt_s:0.125 data_s:0.004
INFO 2025-05-30 23:53:47 ts/train.py:232 step:800 smpl:6K ep:7 epch:3.57 loss:2.226 grdn:68.934 lr:1.0e-05 updt_s:0.125 data_s:0.004
INFO 2025-05-30 23:54:13 ts/train.py:232 step:1K smpl:8K ep:9 epch:4.46 loss:2.003 grdn:63.689 lr:1.0e-05 updt_s:0.126 data_s:0.004
INFO 2025-05-30 23:54:39 ts/train.py:232 step:1K smpl:10K ep:11 epch:5.36 loss:1.830 grdn:61.683 lr:1.0e-05 updt_s:0.126 data_s:0.004
INFO 2025-05-30 23:55:06 ts/train.py:232 step:1K smpl:11K ep:12 epch:6.25 loss:1.638 grdn:58.646 lr:1.0e-05 updt_s:0.126 data_s:0.003
```

明天真正训练一个策略再说。


## 8.评价策略

训练好的模型放在lerobot文件夹下。如下就可以验证。
今天的一个是正前方，一个是后上方，尤其是后上方遮挡比较严重，训练的模型效果并不理想，训练的时候只做了3个episode也是一部分原因，明天再次测试训练，训练时间有点长，3090用了将近四个小时。

```
python lerobot/scripts/control_robot.py \
  --robot.type=so100 \
  --control.type=record \
  --control.fps=30 \
  --control.single_task="Grasp a wood brick and put it in the bin." \
  --control.repo_id=dulics/eval_act_so100_hellolerobot \
  --control.tags='["tutorial"]' \
  --control.warmup_time_s=5 \
  --control.episode_time_s=60 \
  --control.reset_time_s=30 \
  --control.num_episodes=10 \
  --control.push_to_hub=true \
  --control.policy.path=pretrained_model
```


经过研究发现episode的次数过小可能对训练来说是远远不够的，前两次训练都是5个episode以内。昨天晚上测试使用40个episode训练后得到了明显的提升，效果还是令人满意的。