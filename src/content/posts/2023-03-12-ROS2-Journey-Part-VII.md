---
title: ROS2 Journey Part VII
subtitle: Others of CLI tools
date: 2023-03-12
tags: [ROS]
---
# ROS2 Journey VII



## 1. Using `rqt_console`

`rqt_console` is a GUI tool used to introspect log messages in ROS 2. 

`ros2 run rqt_console rqt_console`

![](/img/2023-03-13_14-16-22.png)

The first section of the console is where log messages from your system will display.

In the middle you have the option to filter messages by excluding severity levels. You can also add more exclusion filters using the plus-sign button to the right.

The bottom section is for highlighting messages that include a string you input. You can add more filters to this section as well.

`ros2 run turtlesim turtlesim_node`

![](/img/2023-03-13_14-18-44.png)

`ros2 topic pub -r 1 /turtle1/cmd_vel geometry_msgs/msg/Twist "{linear: {x: 2.0, y: 0.0, z: 0.0}, angular: {x: 0.0,y: 0.0,z: 0.0}}"`

![](/img/2023-03-13_14-20-34.png)

共有五个级别：

`Fatal
Error
Warn
Info
Debug`

- `Fatal` messages indicate the system is going to terminate to try to protect itself from detriment.
- `Error` messages indicate significant issues that won’t necessarily damage the system, but are preventing it from functioning properly.
- `Warn` messages indicate unexpected activity or non-ideal results that might represent a deeper issue, but don’t harm functionality outright.
- `Info` messages indicate event and status updates that serve as a visual verification that the system is running as expected.
- `Debug` messages detail the entire step-by-step process of the system execution.

`ros2 run turtlesim turtlesim_node --ros-args --log-level WARN`

#### Summary

`rqt_console` can be very helpful if you need to closely examine the log messages from your system. You might want to examine log messages for any number of reasons, usually to find out where something went wrong and the series of events leading up to that.



## 2. Launching nodes

Launch files allow you to start up and configure a number of executables containing ROS 2 nodes simultaneously.

Running a single launch file with the `ros2 launch` command will start up your entire system - all nodes and their configurations - at once.

`ros2 launch turtlesim multisim.launch.py`

```python
# turtlesim/launch/multisim.launch.py

from launch import LaunchDescription
import launch_ros.actions

def generate_launch_description():
    return LaunchDescription([
        launch_ros.actions.Node(
            namespace= "turtlesim1", package='turtlesim', executable='turtlesim_node', output='screen'),
        launch_ros.actions.Node(
            namespace= "turtlesim2", package='turtlesim', executable='turtlesim_node', output='screen'),
    ])
```



#### Summary

The significance of what you’ve done so far is that you’ve run two turtlesim nodes with one command. Once you learn to write your own launch files, you’ll be able to run multiple nodes - and setup their configuration - in a similar way, with the `ros2 launch`command。



## 3. Recording and playing back data

`ros2 bag` is a command line tool for recording data published on topics in your system. It accumulates the data passed on any number of topics and saves it in a database. You can then replay the data to reproduce the results of your tests and experiments. Recording topics is also a great way to share your work and allow others to recreate it.

Installation

`sudo apt-get install ros-humble-ros2bag \
                     ros-humble-rosbag2-storage-default-plugins`

You’ll be recording your keyboard input in the `turtlesim` system to save and replay later on, so begin by starting up the `/turtlesim` and `/teleop_turtle` nodes.

`ros2 run turtlesim turtlesim_node`

`ros2 run turtlesim turtle_teleop_key`

#### Choose a topic

`ros2 bag` can only record data from topics that are published on. 

`ros2 topic list`

`/parameter_events
/rosout
/turtle1/cmd_vel
/turtle1/color_sensor
/turtle1/pose`

To see the data that `/turtle1/cmd_vel` is publishing, run the command:

`ros2 topic echo /turtle1/cmd_vel`

```
linear:
  x: 2.0
  y: 0.0
  z: 0.0
angular:
  x: 0.0
  y: 0.0
  z: 0.0
  ---
```

#### ros2 bag record

```
ros2 bag record <topic_name>
```

```
ros2 bag record /turtle1/cmd_vel
```

Recording start

Press `Ctrl+C` to stop recording.

You can also record multiple topics, as well as change the name of the file `ros2 bag` saves to.

```
ros2 bag record -o subset /turtle1/cmd_vel /turtle1/pose
```

```
ros2 bag info <bag_file_name>
```

```
ros2 bag info subset
```

![](/img/2023-03-13_14-59-29.png)

#### Repaly

```
ros2 bag play subset
```

![](/img/2023-03-13_15-01-26.png)

#### Summary

You can record data passed on topics in your ROS 2 system using the `ros2 bag` command. Whether you’re sharing your work with others or introspecting on your own experiments, it’s a great tool to know about.