---
title: ROS2 Journey Part IX
subtitle: Creating a workspace and package
date: 2023-03-13
tags: [ROS]
---
# ROS2 Journey IX



## 1. Creating a workspace

A workspace is a directory containing ROS 2 packages。

From the root of your workspace (`ros2_ws`), you can now build your packages using the command:

```
colcon build
```

Other useful arguments for `colcon build`:

- `--packages-up-to` builds the package you want, plus all its dependencies, but not the whole workspace (saves time)

- `--symlink-install` saves you from having to rebuild every time you tweak python scripts

- `--event-handlers console_direct+` shows console output while building (can otherwise be found in the `log`directory)