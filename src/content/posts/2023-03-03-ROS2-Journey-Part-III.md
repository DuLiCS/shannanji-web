---
title: ROS2 Journey Part III
subtitle: Understanding Topics
date: 2023-03-03
tags: [ROS]
---
# ROS2 Journey III



## 1. Background

Topics 扮演的角色主要是 nodes 间交换信息用。

![](/img/Topic-SinglePublisherandSingleSubscriber.gif)

同样的，这个传递不是 1 to 1 的，可以是 1 to 1， 1 to many, many to 1 或 many to many。

![](/img/Topic-MultiplePublisherandMultipleSubscriber.gif)

Topics 是数据在节点或系统不同部分传递的主要方式。

### 2. Tasks

首先打开 `/turtlesim_node`和`/turtle_teleop_key`。

接下来使用rqt_graph来可视化。直接输入`rqt_graph`

![](/img/2023-03-04_11-12-27.png)

这张图上，`/turtlesim` node 和 `/tele_turtle`通过topic互相交互。`/teleop_turtle`节点通过`/turtle1/cmd_vel`推数据。

### 3.ros2 topic list

`ros2 topic list`来查看当前的活跃话题。

![](/img/2023-03-04_18-14-35.png)

`ros2 topic list -t`会额外显示话题类型。

![](/img/2023-03-04_18-17-30.png)

### 4. Ros2 topic echo

要看数据就用 `ros2 topic echo <topic_name>`，在这里，teleop通过cmd_vel将数据传递到/turtlesim。用`ros2 topic echo /turtle1/cmd_vel`

![](/img/2023-03-06_10-34-05.png)

rqt_gui_py_node_11547是echo创建的node。

![](/img/2023-03-06_10-51-08.png)

### 5. ros2 topic info

`ros2 topic info /turtle1/cmd_vel`将返回

![](/Users/duli/CS/Github Personal Website/dulics.github.io/img/2023-03-06_10-55-05.png)

这里看到这个topic有1个publisher，两个subscription。



### 6. Ros2 interface show

`ros2 topic list -t`输出type。

![](/img/2023-03-06_10-58-26.png)

代表在geometry_msgs 里有一个叫msg

用`ros2 interface show /geometry_msgs/msg/Twist`可以查看具体的数据类型。

![](/img/2023-03-06_11-01-54.png)

这说明/turtlesim节点传递了两个vectors，Linear and angular。

### 7. ros2 topic pub

也可以手动publish data。

`ros2 topic pub <topic_name> <msg_type> 'args'`

例如这里测试一下/turtle1/cmd_vel geometry_msgs/msg/Twist。

`ros2 topic pub --once /turtle1/cmd_vel geometry_msgs/msg/Twist "{linear: {x: 2.0, y: 0.0, z: 0.0}, angular: {x: 0.0, y: 0.0, z: 1.8}}"`

![](/img/2023-03-06_11-11-39.png)

除了用--once表示之外，还可以用-- rate 1表示按1Hz执行。

![](/img/2023-03-06_11-13-14.png)

下图可以很明显看出/turtle1/cmd_vel接收两个输入。

![](/Users/duli/CS/Github Personal Website/dulics.github.io/img/2023-03-06_11-16-14.png)

### 8. ros2 topic hz

可以查看rate。



## Summary

Nodes publish information over topics, which allows any number of other nodes to subscribe to and access that information. In this tutorial you examined the connections between several nodes over topics using rqt_graph and command line tools. You should now have a good idea of how data moves around a ROS 2 system.