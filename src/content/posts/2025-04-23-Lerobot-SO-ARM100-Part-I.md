---
title: Lerobot SO-ARM100 Part I机械臂调试记录
subtitle: 硬件组装调试
date: 2025-04-23
tags: [Project, Robot]
---
# Lerobot

前一阵子偶然看到了Lerobot的项目，和自己心中设想的很契合。之前一直准备做带移动底盘的多功能平台。从零开始确实有点太麻烦，就借这个机会先复现别人的东西再进行改装。
首先明确一下这个项目是做什么的。Github页面上的介绍如下，题目是State-of-the-art AI for real-world robotics：
🤗 LeRobot aims to provide models, datasets, and tools for real-world robotics in PyTorch. The goal is to lower the barrier to entry to robotics so that everyone can contribute and benefit from sharing datasets and pretrained models.

🤗 LeRobot contains state-of-the-art approaches that have been shown to transfer to the real-world with a focus on imitation learning and reinforcement learning.

🤗 LeRobot already provides a set of pretrained models, datasets with human collected demonstrations, and simulation environments to get started without assembling a robot. In the coming weeks, the plan is to add more and more support for real-world robotics on the most affordable and capable robots out there.

🤗 LeRobot hosts pretrained models and datasets on this Hugging Face community page: huggingface.co/lerobot

总结一下关键字，就是Pytorch的real-world robotics。Imitation learning and reinforcement learning。Pretrained models。这里的Imitation learning指的是由人指导机械臂做事，机械臂就可以按照同样的规则模仿。简而言之是一个入门机器人的好项目，成本也适合，一只七百多搞定。

## 1.BOM

BOM是bill of materials的缩写，也就是物料清单。这也是我要做的第一步，这里分两个部分，一个部分是硬件，一个部分是3D打印件。

### 1.1 3D打印件

关于3D打印的材质和打印件在[如下链接](https://github.com/TheRobotStudio/SO-ARM100)。以下总结要点：
* 材质：PLA
* 喷嘴直径：0.4mm喷嘴、0.2层高或0.6mm喷嘴、0.4层高。
* 填充密度：13%
* 打印机设置
	1.	校准与调平
	•	按照打印机说明书进行校准，确保打印床水平正确。
	2.	清洁打印床
	•	清除打印床上的灰尘或油污。
	•	如果用水或其他液体清洁，务必彻底擦干打印床。
	3.	涂胶处理（如需）
	•	若打印机推荐，使用标准胶棒，在打印区域薄薄均匀涂一层胶水。
	•	避免出现胶水堆积或不均匀的情况。
	4.	装载耗材
	•	根据打印机说明，正确装载打印耗材。
	5.	核对打印设置
	•	确保打印机的参数设置符合要求（选择最接近推荐参数的设置）。
	6.	支撑设置
	•	开启全面支撑（Supports Everywhere）。
	•	忽略倾斜角大于45°（相对于水平）的地方，不生成支撑。
	•	螺丝孔（水平轴向）内部不允许生成支撑结构。

设置这里其实没什么说的，主要是最前面的参数比较重要。下面根据自己的需要选择不同的文件就可以了，对我们自己来说，使用拓竹的概率大一些。下面有A系列和P系列对应的文件，打印就可以了。

还有一些可能要打印的就是一些可选配件，这部分最好按需要打印。

### 1.2 硬件购买

这部分主要是购买的东西。我把表格直接放在下面：

---

两只机械臂的版本：

| Part                 | Amount | Unit Cost (RMB) | Buy CN  |
|----------------------|--------|------------------|---------|
| STS3215 Servo        | 12     | ¥97.72           | [TaoBao](https://item.taobao.com/item.htm?id=712179366565&skuId=5268252241438)  |
| Motor Control Board  | 2      | ¥27              | [TaoBao](https://detail.tmall.com/item.htm?id=738817173460&skuId=5096283384143)  |
| USB-C Cable 2 pcs    | 1      | ¥23.9 * 2        | [TaoBao](https://detail.tmall.com/item.htm?id=44425281296)  |
| Power Supply         | 2      | ¥22.31           | [TaoBao](https://item.taobao.com/item.htm?id=544862301228&pisk=goKxj2whXYevG0xAEKuuSdZv-Y-vk4vV2IJQj1f05QdJCI1csZs6FL6dL-a11d61XQOi3svsgCKONi_wo1fc6Gpw9thnxDv23GSjtXmhezdMHMPfh1NGFT6hXtMy_MSy3GSst8qs-Dp2gggc2l61FYBcHls1lt_5P_WOCoO1GaN5p9S1fCZsVz6cCP61CsM8V9WQ1P_1GLs5BOV1fGO6FYBNNts1fBVZkOaftlLFeR-zvRS0fltRHa_khTsOfAXfkqvANl6y2thFOK18flCdpBGMCCGTjMTewhQCFceOeepW_s9jXRBJJLOR-3Vl49AH9kfgt6BgkYK_7P7fUxnq1HzVmVz1e6DELPzNy4WRtYhQ5PNMzTCnHn4a7a3P.&skuId=4857242456164&spm=a21xtw.29178619.0.0)  |
| Table Clamp 4pcs     | 1      | ¥9.2             | [TaoBao](https://detail.tmall.com/item.htm?id=801399113134&skuId=5633627126649)  |
| Screwdriver Set      | 1      | ¥14.9            | [TaoBao](https://detail.tmall.com/item.htm?id=675684600845&skuId=4856851392176)  |
| **Total**            | —      | ¥1343.16         | —       |

---

一只机械臂版本：

| Part                 | Amount | Unit Cost (RMB) | Buy CN  |
|----------------------|--------|------------------|---------|
| STS3215 Servo        | 6      | ¥97.72           | [TaoBao](https://item.taobao.com/item.htm?id=712179366565&skuId=5268252241438)  |
| Motor Control Board  | 1      | ¥27              | [TaoBao](https://detail.tmall.com/item.htm?id=738817173460&skuId=5096283384143)  |
| USB-C Cable 2 pcs    | 1      | ¥23.9            | [TaoBao](https://detail.tmall.com/item.htm?id=44425281296)  |
| Power Supply         | 1      | ¥22.31           | [TaoBao](https://item.taobao.com/item.htm?id=544862301228&pisk=goKxj2whXYevG0xAEKuuSdZv-Y-vk4vV2IJQj1f05QdJCI1csZs6FL6dL-a11d61XQOi3svsgCKONi_wo1fc6Gpw9thnxDv23GSjtXmhezdMHMPfh1NGFT6hXtMy_MSy3GSst8qs-Dp2gggc2l61FYBcHls1lt_5P_WOCoO1GaN5p9S1fCZsVz6cCP61CsM8V9WQ1P_1GLs5BOV1fGO6FYBNNts1fBVZkOaftlLFeR-zvRS0fltRHa_khTsOfAXfkqvANl6y2thFOK18flCdpBGMCCGTjMTewhQCFceOeepW_s9jXRBJJLOR-3Vl49AH9kfgt6BgkYK_7P7fUxnq1HzVmVz1e6DELPzNy4WRtYhQ5PNMzTCnHn4a7a3P.&skuId=4857242456164&spm=a21xtw.29178619.0.0)  |
| Table Clamp 2pcs     | 1      | ¥7.8             | [TaoBao](https://detail.tmall.com/item.htm?id=801399113134&skuId=5633627126649)|
| Screwdriver Set      | 1      | ¥14.9            | [TaoBao](https://detail.tmall.com/item.htm?id=675684600845&skuId=4856851392176)  |
| **Total**            | —      | ¥682.23          | —       |

页面上也提供了整买的链接，这里我们不考虑。

这里需要提前注明一下，STS3215 舵机有两个版本。7.4V版本和12V版本，我们这里直接上12V版本，为了应对更多情况。需要变的就是电源需要买12V 5A+（这里推荐12V6A或者12V7A而不是12V5A）的版本，其他都保持一致。

因此我们要购买的就是STS3215（12V）12个，舵机驱动板2个，12V电源1个，USB-C数据线2根。夹器4个，最后一个是精密螺丝刀。

## 2.组装