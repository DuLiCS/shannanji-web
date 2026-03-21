---
title: ROS2 Journey Part X
subtitle: Writing a simple publisher and subscriber
date: 2023-03-15
tags: [ROS]
---
# ROS2 Journey X



## 1. C++ Version

 In this tutorial, the nodes will pass information in the form of string messages to each other over a [topic](https://docs.ros.org/en/humble/Tutorials/Beginner-CLI-Tools/Understanding-ROS2-Topics/Understanding-ROS2-Topics.html).(talker and listener)

### 1.1 Ceate a package

Navigate into `ros2_ws/src`, and run the package creation command:

```
ros2 pkg create --build-type ament_cmake cpp_pubsub
```

![](/img/2023-03-16_09-37-15.png)

### 1.2 Write the publisher node

```
wget -O publisher_member_function.cpp https://raw.githubusercontent.com/ros2/examples/humble/rclcpp/topics/minimal_publisher/member_function.cpp
```

Content:

```c++
// Copyright 2016 Open Source Robotics Foundation, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

#include <chrono>
#include <functional>
#include <memory>
#include <string>

#include "rclcpp/rclcpp.hpp"
#include "std_msgs/msg/string.hpp"

using namespace std::chrono_literals;

/* This example creates a subclass of Node and uses std::bind() to register a
 * member function as a callback from the timer. */

class MinimalPublisher : public rclcpp::Node
{
public:
  MinimalPublisher()
  : Node("minimal_publisher"), count_(0)
  {
    publisher_ = this->create_publisher<std_msgs::msg::String>("topic", 10);
    timer_ = this->create_wall_timer(
      500ms, std::bind(&MinimalPublisher::timer_callback, this));
  }

private:
  void timer_callback()
  {
    auto message = std_msgs::msg::String();
    message.data = "Hello, world! " + std::to_string(count_++);
    RCLCPP_INFO(this->get_logger(), "Publishing: '%s'", message.data.c_str());
    publisher_->publish(message);
  }
  rclcpp::TimerBase::SharedPtr timer_;
  rclcpp::Publisher<std_msgs::msg::String>::SharedPtr publisher_;
  size_t count_;
};

int main(int argc, char * argv[])
{
  rclcpp::init(argc, argv);
  rclcpp::spin(std::make_shared<MinimalPublisher>());
  rclcpp::shutdown();
  return 0;
}
```



Headers:

```c++
#include <chrono>
#include <functional>
#include <memory>
#include <string>

#include "rclcpp/rclcpp.hpp"
#include "std_msgs/msg/string.hpp"

using namespace std::chrono_literals;
```



The next line creates the node class `MinimalPublisher` by inheriting from `rclcpp::Node`. Every `this` in the code is referring to the node.

```c++
class MinimalPublisher : public rclcpp::Node
```

The public constructor names the node `minimal_publisher` and initializes `count_` to 0. Inside the constructor, the publisher is initialized with the `String`message type, the topic name `topic`, and the required queue size to limit messages in the event of a backup. Next, `timer_` is initialized, which causes the `timer_callback` function to be executed twice a second.

```c++
public:
  MinimalPublisher()
  : Node("minimal_publisher"), count_(0)
  {
    publisher_ = this->create_publisher<std_msgs::msg::String>("topic", 10);
    timer_ = this->create_wall_timer(
    500ms, std::bind(&MinimalPublisher::timer_callback, this));
  }
```

The `timer_callback` function is where the message data is set and the messages are actually published. The `RCLCPP_INFO` macro ensures every published message is printed to the console.

```c++
private:
  void timer_callback()
  {
    auto message = std_msgs::msg::String();
    message.data = "Hello, world! " + std::to_string(count_++);
    RCLCPP_INFO(this->get_logger(), "Publishing: '%s'", message.data.c_str());
    publisher_->publish(message);
  }
```

Last is the declaration of the timer, publisher, and counter fields.

```c++
rclcpp::TimerBase::SharedPtr timer_;
rclcpp::Publisher<std_msgs::msg::String>::SharedPtr publisher_;
size_t count_;
```

Following the `MinimalPublisher` class is `main`, where the node actually executes. `rclcpp::init` initializes ROS 2, and `rclcpp::spin` starts processing data from the node, including callbacks from the timer.

```c++
int main(int argc, char * argv[])
{
  rclcpp::init(argc, argv);
  rclcpp::spin(std::make_shared<MinimalPublisher>());
  rclcpp::shutdown();
  return 0;
}
```

### 1.3 Add dependencies

Open `package.xml` with your text editor.

```xml
<?xml version="1.0"?>
<?xml-model href="http://download.ros.org/schema/package_format3.xsd" schematypens="http://www.w3.org/2001/XMLSchema"?>
<package format="3">
  <name>cpp_pubsub</name>
  <version>0.0.0</version>
  <description>Example of minimal publisher/subscriber using rclcpp</description>
  <maintainer email="dulics811@gmail.com">parallels</maintainer>
  <license>TODO: License declaration</license>

  <buildtool_depend>ament_cmake</buildtool_depend>
  <depend>rclcpp</depend>
  <depend>std_msgs</depend>

  <test_depend>ament_lint_auto</test_depend>
  <test_depend>ament_lint_common</test_depend>

  <export>
    <build_type>ament_cmake</build_type>
  </export>
</package>
```

Now open the `CMakeLists.txt` file.

```
add_executable(talker src/publisher_member_function.cpp)
ament_target_dependencies(talker rclcpp std_msgs)
```

这段代码是ROS 2中使用CMake编译和构建工具的相关语句。具体含义如下：

- `add_executable(talker src/publisher_member_function.cpp)`：定义一个名为`talker`的可执行文件，其源代码为`src/publisher_member_function.cpp`。
- `ament_target_dependencies(talker rclcpp std_msgs)`：定义`talker`可执行文件所依赖的ROS 2包，包括`rclcpp`和`std_msgs`。

其中，`add_executable`是CMake语句，用于定义一个可执行文件。`ament_target_dependencies`是ROS 2中的宏，用于定义一个可执行文件所依赖的ROS 2包。

```
install(TARGETS
  talker
  DESTINATION lib/${PROJECT_NAME})
```

这段CMake代码用于指定将构建出的可执行文件 `talker` 安装到哪里。其中 `TARGETS` 表示要安装的目标是可执行文件 `talker`。`DESTINATION` 指定了安装的路径，`${PROJECT_NAME}` 表示 CMakeLists.txt 中指定的项目名称。

一般来说，安装的目标路径会根据平台的不同而有所区别。在 Linux 平台上，安装路径一般为 `/usr/local/bin` 或 `/usr/bin` 等系统路径。在 Windows 平台上，则可以选择将可执行文件安装到系统环境变量 `PATH` 所包含的目录中，这样用户就可以在任意位置通过命令行直接执行该程序。

```cmake
cmake_minimum_required(VERSION 3.5)
project(cpp_pubsub)

Default to C++14
if(NOT CMAKE_CXX_STANDARD)
  set(CMAKE_CXX_STANDARD 14)
endif()

if(CMAKE_COMPILER_IS_GNUCXX OR CMAKE_CXX_COMPILER_ID MATCHES "Clang")
  add_compile_options(-Wall -Wextra -Wpedantic)
endif()

find_package(ament_cmake REQUIRED)
find_package(rclcpp REQUIRED)
find_package(std_msgs REQUIRED)

add_executable(talker src/publisher_member_function.cpp)
ament_target_dependencies(talker rclcpp std_msgs)

install(TARGETS
  talker
  DESTINATION lib/${PROJECT_NAME})

ament_package()
```

### 3. Write the subscriber node

```bash
wget -O subscriber_member_function.cpp https://raw.githubusercontent.com/ros2/examples/humble/rclcpp/topics/minimal_subscriber/member_function.cpp
```

```c++
#include <memory>

#include "rclcpp/rclcpp.hpp"
#include "std_msgs/msg/string.hpp"
using std::placeholders::_1;

class MinimalSubscriber : public rclcpp::Node
{
  public:
    MinimalSubscriber()
    : Node("minimal_subscriber")
    {
      subscription_ = this->create_subscription<std_msgs::msg::String>(
      "topic", 10, std::bind(&MinimalSubscriber::topic_callback, this, _1));
    }

  private:
    void topic_callback(const std_msgs::msg::String & msg) const
    {
      RCLCPP_INFO(this->get_logger(), "I heard: '%s'", msg.data.c_str());
    }
    rclcpp::Subscription<std_msgs::msg::String>::SharedPtr subscription_;
};

int main(int argc, char * argv[])
{
  rclcpp::init(argc, argv);
  rclcpp::spin(std::make_shared<MinimalSubscriber>());
  rclcpp::shutdown();
  return 0;
}
```

这是一个使用ROS 2的C++编写的最小订阅者程序。程序会监听一个名为"topic"的话题，一旦接收到该话题上发布的消息，就会打印该消息的内容。

程序中的类MinimalSubscriber继承自rclcpp::Node，即为ROS 2节点。在该类中，定义了一个名为subscription_的成员变量，类型为rclcpp::Subscription<std_msgs::msg::String>::SharedPtr，即一个std_msgs::msg::String类型的订阅器。在MinimalSubscriber的构造函数中，调用this->create_subscription函数创建了该订阅器，订阅了名为"topic"的话题，消息队列长度为10。

当订阅器接收到消息时，就会调用topic_callback函数进行处理。该函数中，通过get_logger()获取ROS 2节点的日志记录器，并使用RCLCPP_INFO宏打印消息内容。需要注意的是，因为topic_callback函数是一个const成员函数，所以订阅器subscription_也必须是const类型。

```c++
public:
  MinimalSubscriber()
  : Node("minimal_subscriber")
  {
    subscription_ = this->create_subscription<std_msgs::msg::String>(
    "topic", 10, std::bind(&MinimalSubscriber::topic_callback, this, _1));
  }
```

这是一个C++程序，它使用ROS 2中的rclcpp库创建了一个订阅者节点`MinimalSubscriber`。在构造函数中，它首先调用`Node`类的构造函数来初始化节点并设置节点名称为`"minimal_subscriber"`。接着，它使用`create_subscription`函数创建一个订阅器，并将其绑定到一个回调函数`topic_callback`上。`create_subscription`函数的参数包括要订阅的主题名称`"topic"`、队列大小`10`和回调函数`topic_callback`。回调函数将在每次接收到消息时调用。最后，它将订阅器的指针保存在`subscription_`成员变量中。

```c++
private:
  void topic_callback(const std_msgs::msg::String & msg) const
  {
    RCLCPP_INFO(this->get_logger(), "I heard: '%s'", msg.data.c_str());
  }
  rclcpp::Subscription<std_msgs::msg::String>::SharedPtr subscription_;
```

这段代码是定义了一个名为`MinimalSubscriber`的类，继承了`rclcpp::Node`。在构造函数中，通过`create_subscription`函数创建了一个订阅器`subscription_`，订阅了名为`topic`的话题，消息类型为`std_msgs::msg::String`，回调函数为`topic_callback`，订阅队列长度为10。在`topic_callback`中，定义了接收到消息后的处理函数，这里简单地输出了收到的消息。`subscription_`的类型为`rclcpp::Subscription<std_msgs::msg::String>::SharedPtr`，是一个指向订阅器的智能指针。

Reopen `CMakeLists.txt` and add the executable and target for the subscriber node below the publisher’s entries.

```cmake
add_executable(listener src/subscriber_member_function.cpp)
ament_target_dependencies(listener rclcpp std_msgs)

install(TARGETS
  talker
  listener
  DESTINATION lib/${PROJECT_NAME})
```

### 1.4 Build and run

```bash
rosdep install -i --from-path src --rosdistro humble -y
```

```bash
colcon build --packages-select cpp_pubsub
```

```
. install/setup.bash
```

![](/img/2023-03-16_11-47-49.png)

You created two nodes to publish and subscribe to data over a topic. Before compiling and running them, you added their dependencies and executables to the package configuration files.

## 2. Python Version

In this tutorial, you will create [nodes](https://docs.ros.org/en/humble/Tutorials/Beginner-CLI-Tools/Understanding-ROS2-Nodes/Understanding-ROS2-Nodes.html) that pass information in the form of string messages to each other over a [topic](https://docs.ros.org/en/humble/Tutorials/Beginner-CLI-Tools/Understanding-ROS2-Topics/Understanding-ROS2-Topics.html).

### 2.1 Create a package

```bash
ros2 pkg create --build-type ament_python py_pubsub
```

Navigate into `ros2_ws/src/py_pubsub/py_pubsub`. 

### 2.2 Write the publisher node

```bash
wget https://raw.githubusercontent.com/ros2/examples/humble/rclpy/topics/minimal_publisher/examples_rclpy_minimal_publisher/publisher_member_function.py
```

```python
# Copyright 2016 Open Source Robotics Foundation, Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import rclpy
from rclpy.node import Node

from std_msgs.msg import String


class MinimalPublisher(Node):

    def __init__(self):
        super().__init__('minimal_publisher')
        self.publisher_ = self.create_publisher(String, 'topic', 10)
        timer_period = 0.5  # seconds
        self.timer = self.create_timer(timer_period, self.timer_callback)
        self.i = 0

    def timer_callback(self):
        msg = String()
        msg.data = 'Hello World: %d' % self.i
        self.publisher_.publish(msg)
        self.get_logger().info('Publishing: "%s"' % msg.data)
        self.i += 1


def main(args=None):
    rclpy.init(args=args)

    minimal_publisher = MinimalPublisher()

    rclpy.spin(minimal_publisher)

    # Destroy the node explicitly
    # (optional - otherwise it will be done automatically
    # when the garbage collector destroys the node object)
    minimal_publisher.destroy_node()
    rclpy.shutdown()


if __name__ == '__main__':
    main()
```

This is a Python code for a minimal ROS2 publisher node that publishes a string message on the topic "topic" every 0.5 seconds. The message contains the string "Hello World" followed by an incrementing integer value.

The code uses the ROS2 Python client library called rclpy, which provides a Python interface for ROS2 communication. The rclpy.init() function initializes the ROS2 client library and the rclpy.shutdown() function shuts it down. The rclpy.spin() function keeps the node running until it is stopped.

The code defines a class called MinimalPublisher, which inherits from the Node class in the rclpy.node module. The constructor of the MinimalPublisher class creates a publisher object that publishes messages of type String on the "topic" topic. It also creates a timer object that calls the timer_callback() function every 0.5 seconds. The timer_callback() function creates a string message containing the string "Hello World" followed by an integer value that is incremented every time the function is called. It then publishes the message using the publisher object and logs the message using the get_logger().info() function.

Finally, the main() function initializes the ROS2 client library, creates an instance of the MinimalPublisher class, and starts the node using the rclpy.spin() function. It also destroys the node explicitly using the destroy_node() function and shuts down the ROS2 client library using the rclpy.shutdown() function. The if **name** == '**main**' block at the end of the code ensures that the main() function is called when the script is run as the main program.

Open `package.xml` with your text editor.

```xml
<?xml version="1.0"?>
<?xml-model href="http://download.ros.org/schema/package_format3.xsd" schematypens="http://www.w3.org/2001/XMLSchema"?>
<package format="3">
  <name>py_pubsub</name>
  <version>0.0.0</version>
  <description>Example of minimal publisher/subscriber using rclpy</description>
  <maintainer email="dulics811@gmail.com">parallels</maintainer>
  <license>TODO: License declaration</license>
  
  <exec_depend>rclpy</exec_depend>
  <exec_depend>std_msgs</exec_depend>

  <test_depend>ament_copyright</test_depend>
  <test_depend>ament_flake8</test_depend>
  <test_depend>ament_pep257</test_depend>
  <test_depend>python3-pytest</test_depend>

  <export>
    <build_type>ament_python</build_type>
  </export>
</package>
```

Open the `setup.py` file.

```python
from setuptools import setup

package_name = 'py_pubsub'

setup(
    name=package_name,
    version='0.0.0',
    packages=[package_name],
    data_files=[
        ('share/ament_index/resource_index/packages',
            ['resource/' + package_name]),
        ('share/' + package_name, ['package.xml']),
    ],
    install_requires=['setuptools'],
    zip_safe=True,
    maintainer='duli',
    maintainer_email='dulics811@gmail.com',
    description='Example of minimal publisher/subscriber using rclpy',
    license='Apache License 2.0',
    tests_require=['pytest'],
    entry_points={
        'console_scripts': [
        'talker = py_pubsub.publisher_member_function:main',
        ],
    },
)
```



### 2.3 Write the subscriber node

Return to `ros2_ws/src/py_pubsub/py_pubsub` to create the next node. Enter the following code in your terminal:

```bash
wget https://raw.githubusercontent.com/ros2/examples/humble/rclpy/topics/minimal_subscriber/examples_rclpy_minimal_subscriber/subscriber_member_function.py
```



```python
# Copyright 2016 Open Source Robotics Foundation, Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import rclpy
from rclpy.node import Node

from std_msgs.msg import String


class MinimalSubscriber(Node):

    def __init__(self):
        super().__init__('minimal_subscriber')
        self.subscription = self.create_subscription(
            String,
            'topic',
            self.listener_callback,
            10)
        self.subscription  # prevent unused variable warning

    def listener_callback(self, msg):
        self.get_logger().info('I heard: "%s"' % msg.data)


def main(args=None):
    rclpy.init(args=args)

    minimal_subscriber = MinimalSubscriber()

    rclpy.spin(minimal_subscriber)

    # Destroy the node explicitly
    # (optional - otherwise it will be done automatically
    # when the garbage collector destroys the node object)
    minimal_subscriber.destroy_node()
    rclpy.shutdown()


if __name__ == '__main__':
    main()
```

This is a Python code for a minimal ROS2 subscriber node that listens to a string message on the topic "topic" and logs the message to the console.

The code uses the ROS2 Python client library called rclpy, which provides a Python interface for ROS2 communication. The rclpy.init() function initializes the ROS2 client library and the rclpy.shutdown() function shuts it down. The rclpy.spin() function keeps the node running until it is stopped.

The code defines a class called MinimalSubscriber, which inherits from the Node class in the rclpy.node module. The constructor of the MinimalSubscriber class creates a subscription object that subscribes to messages of type String on the "topic" topic. It also specifies the listener_callback() function to be called whenever a message is received on the topic. The listener_callback() function simply logs the message to the console using the get_logger().info() function.

Finally, the main() function initializes the ROS2 client library, creates an instance of the MinimalSubscriber class, and starts the node using the rclpy.spin() function. It also destroys the node explicitly using the destroy_node() function and shuts down the ROS2 client library using the rclpy.shutdown() function. The if **name** == '**main**' block at the end of the code ensures that the main() function is called when the script is run as the main program.

Reopen `setup.py` 

```python
entry_points={
        'console_scripts': [
                'talker = py_pubsub.publisher_member_function:main',
                'listener = py_pubsub.subscriber_member_function:main',
        ],
},
```

### 2.4 Build an run

```bash
colcon build --packages-select py_pubsub
```

```bash
. install/setup.bash
```

```bash
ros2 run py_pubsub talker
```

```bash
ros2 run py_pubsub listener
```

![](/img/2023-03-16_16-06-00.png)

You created two nodes to publish and subscribe to data over a topic. Before running them, you added their dependencies and entry points to the package configuration files.