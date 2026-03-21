---
title: ROS2 Journey Part II
subtitle: Understanding Nodes
date: 2023-03-03
tags: [ROS]
---
# ROS2 Journey II



Nodes是ROS2的核心概念之一，值得单独拿出来写一节。



### 1. Nodes in ROS 2

ROS中的每一个node都应该负责一个单独的模块化的任务，比如在ROS控制的小车里，一个node控制电机，一个控制激光测距仪。每一个node可以通过topics，services，actions or parameters接收和发送数据。下面的图说的很清楚。

![](/img/Nodes-TopicandService.gif)

在ROS 2中，一个C++或Python可执行文件可以包含一个或多个nodes。

### 2. Tasks

`ros2 run <package_name> <executable_name>`

以上是ros2 从package中运行可执行文件的基本方式。对于我们这个例子，应该是如下形式：

`ros2 run turtlesim turtlesim_node`

这将打开一个窗口。

![](/img/2023-03-03_23-20-08.png)

在这里package名为turtlesim，可执行文件名为turtlesim_node。同时用`ro2 node list`查看正在运行的node name。

![](/img/2023-03-03_23-22-36.png)

这时候再打开一个terminal，运行teleop node。

`ros2 run turtlesim turtle_teleop_key`

这时候依然是在turtlesim package中运行另外一个可执行文件，turtle_teleop_key。这时用`ros2 node list`命令可以看到此时有两个活跃的nodes。

![](/img/2023-03-03_23-58-54.png)

### 3. Remapping

node的性质可以用remapping来重新指定，例如node name，topic name，service name 等等。首先试试重命名 /turtlesim node。

`ros2 run turtlesim turtlesim_node --ros-args --remap __node:=my_turtle`

这时候会有3个nodes在运行。

### 4. ros2 node info

`	ros2 node info <node_name>`可以查看node的信息。

`ros2 node info /my_turtle`

返回subscriber，publisher，services and actions的列表。

![](/img/2023-03-04_00-13-23.png)

最后给出 node 的定义：

A node is a participant in the ROS graph. ROS nodes use a ROS client library to communicate with other nodes. Nodes can publish or subscribe to Topics. Nodes can also provide or use Services and Actions. There are configurable Parameters associated with a node. Connections between nodes are established through a distributed discovery process. Nodes may be located in the same process, in different processes, or on different machines. These concepts will be described in more detail in the sections that follow.