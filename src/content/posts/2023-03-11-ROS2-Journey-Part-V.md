---
title: ROS2 Journey Part V
subtitle: Understanding Parameters
date: 2023-03-11
tags: [ROS]
---
# ROS2 Journey V



## 1. Background

这里说的参数指的是节点的值。也可以认为是节点的设置，一个节点可以以 integers, floats, booleans, strings, and lists的形式保存参数。

### 2. Tasks

还是以 `/turtlesim` and `/teleop_turtle`为例。

查看方式 `ros2 param list`

查看参数的当前值可以用 `ros2 param get <node_name> <parameter_name>`

例如 `ros2 param get /turtlesim background_g`

能查看当然就能设置

`ros2 param set <node_name> <parameter_name> <value>`

例如

`ros2 param set /turtlesim background_r 150`

这个的作用是设置背景的R值。

查看所有的参数值用`ros2 param dump <node_name>`

还可以将参数出存在yaml文件里。

`ros2 param dump /turtlesim > turtlesim.yaml`

可以存储当然就可以load

`ros2 param load <node_name> <parameter_file>`

`ros2 param load /turtlesim turtlesim.yaml`

可以设置节点启动时载入参数。

`ros2 run <package_name> <executable_name> --ros-args --params-file <file_name>`

`ros2 run turtlesim turtlesim_node --ros-args --params-file turtlesim.yaml`

### Summary

Nodes have parameters to define their default configuration values. You can `get` and `set` parameter values from the command line. You can also save the parameter settings to a file to reload them in a future session.