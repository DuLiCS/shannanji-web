---
title: ROS2 Journey Part VI
subtitle: Understanding Actions
date: 2023-03-12
tags: [ROS]
---
# ROS2 Journey VI



## 1. Background

Actions是一种通信类型，主要面向长时运行的任务。包含三个方面：goal, feedback, and a result。

Actions基于topics和services构建。功能上近似于services，actions可以被取消。同时还提供稳定的反馈，相对的，services返回一个单一的response。

Actions使用client- server 模型。Action client节点传递goal到action server节点认可goal并返回反馈流和结果。

![](/img/Action-SingleActionClient.gif)

## Tasks

`ros2 run turtlesim turtlesim_node`

`ros2 run turtlesim turtle_teleop_key`

![](/img/2023-03-13_12-20-20.png)

以上是`/teleop_turtle`的显示。

每当完成一个动作就会有如下显示。

![](/img/2023-03-13_12-24-24.png)

按下F可以取消。

`[INFO] [turtlesim]: Rotation goal canceled`

在上一个动作结束前也可以取消。

![](/img/2023-03-13_12-27-50.png)

the `/turtle1/rotate_absolute` action for `/turtlesim`is under `Action Servers`. This means `/turtlesim` responds to and provides feedback for the `/turtle1/rotate_absolute` action.

The `/teleop_turtle` node has the name `/turtle1/rotate_absolute` under `Action Clients` meaning that it sends goals for that action name.

`ros2 action list`和`ros2 action list -t`可以查看action和类型。

![](/img/2023-03-13_12-34-50.png)

依旧可以查看接口。

`ros2 interface show turtlesim/action/RotateAbsolute`

![](/img/2023-03-13_12-36-40.png)

`ros2 action send_goal <action_name> <action_type> <values>`

这个values应该是一个YAML格式的。

`ros2 action send_goal /turtle1/rotate_absolute turtlesim/action/RotateAbsolute "{theta: 1.57}"`

`Waiting for an action server to become available...
Sending goal:
   theta: 1.57

Goal accepted with ID: f8db8f44410849eaa93d3feb747dd444

Result:
  delta: -1.568000316619873

Goal finished with status: SUCCEEDED`

还可以用`--feedback`查看反馈。

`ros2 action send_goal /turtle1/rotate_absolute turtlesim/action/RotateAbsolute "{theta: -1.57}" --feedback`

`Sending goal:
   theta: -1.57

Goal accepted with ID: e6092c831f994afda92f0086f220da27

Feedback:
  remaining: -3.1268222332000732

Feedback:
  remaining: -3.1108222007751465

…

Result:
  delta: 3.1200008392333984

Goal finished with status: SUCCEEDED`

## Summary

Actions are like services that allow you to execute long running tasks, provide regular feedback, and are cancelable.

A robot system would likely use actions for navigation. An action goal could tell a robot to travel to a position. While the robot navigates to the position, it can send updates along the way (i.e. feedback), and then a final result message once it’s reached its destination.

Turtlesim has an action server that action clients can send goals to for rotating turtles. In this tutorial, you introspected that action, `/turtle1/rotate_absolute`, to get a better idea of what actions are and how they work.