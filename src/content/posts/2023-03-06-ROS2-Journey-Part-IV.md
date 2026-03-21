---
title: ROS2 Journey Part IV
subtitle: Understanding Services
date: 2023-03-06
tags: [ROS]
---
# ROS2 Journey IV



## 1. Background

Services是另一种节点间通信的方式。Service基于call-and-response 模型，对应着的是topic的publisher- subscriber模型。对比来说，topic可以让节点持续的更新数据，services知识在被client请求时才传数据。

![](/img/Service-SingleServiceClient.gif)

![](/img/Service-MultipleServiceClient.gif)

## Tasks

### 1. Setup

打开`/turtlesim` and `/teleop_turtle`

运行`ros2 service list`

![](/img/2023-03-09_21-45-56.png)

每个节点有6个service

### 2. ros2 service type

`ros2 service type <service_name>`

`ros2 service type /clear`

![](/Users/duli/CS/Github Personal Website/dulics.github.io/img/2023-03-09_21-50-21.png)

这里的Empty指当请求时不接收任何数据。

`ros2 service list -t`可以查看service的类型。

![](/img/2023-03-09_22-05-37.png)

`ros2 service find std_srvs/srv/Empty`

可以返回所有Empty类型的services。

`ros2 interface show <type_name>`

如果想要手动请求service，需要首先知道输入的结构。就可以用interface来查看。

![](/img/2023-03-09_22-33-39.png)

接下来我们就可以call。

`ros2 service call /clear std_srvs/srv/Empty`

![](/img/2023-03-09_22-38-19.png)

![](/img/2023-03-09_22-57-22.png)

轨迹被清除掉了。

`ros2 service call /spawn turtlesim/srv/Spawn "{x: 2, y: 2, theta: 0.2, name: ''}"`	

生成了一个新的turtle。

![](/img/2023-03-09_23-00-41.png)

## Summary

Nodes can communicate using services in ROS 2. Unlike a topic - a one way communication pattern where a node publishes information that can be consumed by one or more subscribers - a service is a request/response pattern where a client makes a request to a node providing the service and the service processes the request and generates a response.

You generally don’t want to use a service for continuous calls; topics or even actions would be better suited.