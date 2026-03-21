---
title: 动手深度学习
subtitle: 3  深度学习基础
date: 2021-03-18
tags: [Deep learning, Reading]
---
# 3 深度学习基础

## 3.1 线性回归

线性回归输出连续值，因此适用于回归问题。Softmax适应于分类问题。

线性回归和softmax都可以理解成单层神经网络。


### 3.1.1 线性回归的基本要素

#### 3.1.1.1 模型定义

举个例子，设房屋面积为$x_1$,房龄$x_2$,售出价格$y$，有下面的关系：


$$
\hat{y}=x_{1} w_{1}+x_{2} w_{2}+b
$$

$w_1$和$w_2$是权重，$b$是偏差，$\hat{y}$是对真实价格的预测或者估计。

#### 3.1.1.2 模型训练

接下来我们需要通过数据来寻找特定的模型参数值，使模型在数据上的误差尽可能小。这个过程叫作模型训练（model training）。

**(1) 训练数据**

在机器学习术语里，该数据集被称为训练数据集（training data set）或训练集（training set），一栋房屋被称为一个样本（sample），其真实售出价格叫作标签（label），用来预测标签的两个因素叫作特征（feature）。特征用来表征样本的特点。

假设我们采集的样本数为 $n$，索引为 $i$ 的样本的特征为 $x_{1}^{(i)}$ 和 $x_{2}^{(i)}$

$$
\hat{y}^{(i)}=x_{1}^{(i)} w_{1}+x_{2}^{(i)} w_{2}+b
$$

**(2) 损失函数**

$$
\ell^{(i)}\left(w_{1}, w_{2}, b\right)=\frac{1}{2}\left(\hat{y}^{(i)}-y^{(i)}\right)^{2}
$$

在机器学习里，将衡量误差的函数称为损失函数（loss function）。这里使用的平方误差函数也称为平方损失（square loss）。

我们用训练数据集中所有样本误差的平均来衡量模型预测的质量，即：

$$
\begin{array}{l}
\ell\left(w_{1}, w_{2}, b\right)=\frac{1}{n} \sum_{i=1}^{n} \ell^{(i)}\left(w_{1}, w_{2}, b\right)= \\
\frac{1}{n} \sum_{i=1}^{n} \frac{1}{2}\left(x_{1}^{(i)} w_{1}+x_{2}^{(i)} w_{2}+b-y^{(i)}\right)^{2}
\end{array}
$$

$$
w_{1}^{*}, w_{2}^{*}, b^{*}=\underset{w_{1}, w_{2}, b}{\arg \min } \ell\left(w_{1}, w_{2}, b\right)
$$

**(3) 优化算法**

在求数值解的优化算法中，小批量随机梯度下降（mini-batch stochastic gradient descent）在深度学习中被广泛使用。它的算法很简单：先选取一组模型参数的初始值，如随机选取；接下来对参数进行多次迭代，使每次迭代都可能降低损失函数的值。在每次迭代中，先随机均匀采样一个由固定数目训练数据样本所组成的小批量（mini-batch）BB，然后求小批量中数据样本的平均损失有关模型参数的导数（梯度），最后用此结果与预先设定的一个正数的乘积作为模型参数在本次迭代的减小量。

$$
\begin{array}{l}
w_{1} \leftarrow w_{1}-\frac{\eta}{|\mathcal{B}|} \sum_{i \in \mathcal{B}} \frac{\partial \ell^{(i)}\left(w_{1}, w_{2}, b\right)}{\partial w_{1}}=w_{1}-\frac{\eta}{|\mathcal{B}|} \sum_{i \in \mathcal{B}} x_{1}^{(i)}\left(x_{1}^{(i)} w_{1}+x_{2}^{(i)} w_{2}+b-y^{(i)}\right) \\
w_{2} \leftarrow w_{2}-\frac{\eta}{|\mathcal{B}|} \sum_{i \in \mathcal{B}} \frac{\partial \ell^{(i)}\left(w_{1}, w_{2}, b\right)}{\partial w_{2}}=w_{2}-\frac{\eta}{|\mathcal{B}|} \sum_{i \in \mathcal{B}} x_{2}^{(i)}\left(x_{1}^{(i)} w_{1}+x_{2}^{(i)} w_{2}+b-y^{(i)}\right) \\
b \leftarrow b-\frac{\eta}{|\mathcal{B}|} \sum_{i \in \mathcal{B}} \frac{\partial \ell^{(i)}\left(w_{1}, w_{2}, b\right)}{\partial b}=b-\frac{\eta}{|\mathcal{B}|} \sum_{i \in \mathcal{B}}\left(x_{1}^{(i)} w_{1}+x_{2}^{(i)} w_{2}+b-y^{(i)}\right)
\end{array}
$$


#### 3.1.1.3 模型预测

### 3.1.2 线性回归表示方法

#### 3.1.2.1 神经网络图
![3.1_linreg.svg](/img/3.1_linreg.svg)

#### 3.1.2.2 矢量计算表达式

**归结为一句话，使用矢量计算可以大大提高计算效率**

## 3.2 线性回归从零开始实现


首先导入所需的包和模块

```python
%matplotlib inline
import torch
from IPython import display
from matplotlib import pyplot as plt
import numpy as np
import random
```

#### 3.2.1 生成数据集

```python
num_inputs = 2  #特征数为2
num_examples = 1000 #数据集里有1000个样本
true_w = [2, -3.4] #权重
true_b = 4.2    #偏置
features = torch.randn(num_examples, num_inputs,dtype=torch.float32) #随机生成100X2个浮点数据
labels = true_w[0] * features[:, 0] + true_w[1] * features[:, 1] + true_b  #根据计算y的值
labels +=torch.tensor(np.random.normal(0,0.01,size=labels.size()),dtype=torch.float32) #加入白噪音
```

这里的features是1000行2列，labels是一个标量。接下来画出特征和标签之间的散点图。


```python

def use_svg_display():
    # 用矢量图显示
    display.set_matplotlib_formats('svg')

def set_figsize(figsize=(3.5, 2.5)):
    use_svg_display()
    # 设置图的尺寸
    plt.rcParams['figure.figsize'] = figsize

# # 在../d2lzh_pytorch里面添加上面两个函数后就可以这样导入
# import sys
# sys.path.append("..")
# from d2lzh_pytorch import *

set_figsize()
plt.scatter(features[:, 0].numpy(), labels.numpy(), 1);

set_figsize()
plt.scatter(features[:, 1].numpy(), labels.numpy(), 1);
```

![linear1](/img/liner1.svg)

可以看出比较明显的线性关系。

### 3.2.2 读取数据


```python
# 本函数已保存在d2lzh包中方便以后使用
def data_iter(batch_size, features, labels):
    num_examples = len(features) #总长度
    indices = list(range(num_examples)) #[0, 1, 2, 3 ···]
    random.shuffle(indices)  # 样本的读取顺序是随机的
    for i in range(0, num_examples, batch_size):  #
        j = torch.LongTensor(indices[i: min(i + batch_size, num_examples)]) # 最后一次可能不足一个batch
        yield  features.index_select(0, j), labels.index_select(0, j) #index_select第一个参数表示从第几维挑选数据 这里是第0维，也就是按行取
```

### 3.2.3 初始化模型参数

首先初始化权重，偏置初始化为0.

```python
w = torch.tensor(np.random.normal(0, 0.01, (num_inputs, 1)), dtype=torch.float32)
b = torch.zeros(1, dtype=torch.float32)
w.requires_grad_(requires_grad=True)  #自动求导
b.requires_grad_(requires_grad=True)
```

### 3.2.4 定义模型

```python
def linreg(X, w, b):
  return torch.mm(X, w) + b
```

### 3.2.5 定义损失函数

```python
def square_loss(y_hat, y):
  return (y_hat - y.view(y_hat.size())) ** 2 / 2
```

### 3.2.6 定义优化算法

def sgd(params, lr, batch_size):

```python
def sgd(params, lr, batch_size):
  for param in params:
    param.data -= lr * param.grad / batch_size
```

### 3.2.7 训练模型

```python
lr = 0.03
num_epochs = 3
batch_size = 10
net = linreg
loss = squared_loss

for epoch in range(num_epochs):  # 训练模型一共需要num_epochs个迭代周期
    # 在每一个迭代周期中，会使用训练数据集中所有样本一次（假设样本数能够被批量大小整除）。X
    # 和y分别是小批量样本的特征和标签
    for X, y in data_iter(batch_size, features, labels):
        l = loss(net(X, w, b), y).sum()  # l是有关小批量X和y的损失
        l.backward()  # 小批量的损失对模型参数求梯度
        sgd([w, b], lr, batch_size)  # 使用小批量随机梯度下降迭代模型参数

        # 不要忘了梯度清零
        w.grad.data.zero_()
        b.grad.data.zero_()
    train_l = loss(net(features, w, b), labels)
    print('epoch %d, loss %f' % (epoch + 1, train_l.mean().item()))

print(true_w, '\n', w)
print(true_b, '\n', b)
```

## 3.3 线性回归的简洁实现

### 3.3.1 生成数据集

方法和上一节相同。

```python
num_inputs = 2  #特征数为2
num_examples = 1000 #数据集里有1000个样本
true_w = [2, -3.4] #权重
true_b = 4.2    #偏置
features = torch.randn(num_examples, num_inputs,dtype=torch.float32) #随机生成100X2个浮点数据
labels = true_w[0] * features[:, 0] + true_w[1] * features[:, 1] + true_b  #根据计算y的值
labels +=torch.tensor(np.random.normal(0,0.01,size=labels.size()),dtype=torch.float32) #加入白噪音
```
### 3.3.2 读取数据

使用内置函数data读取数据

```python
import torch.utils.data as Data

batch_size = 10
# 将训练数据的特征和标签组合
dataset = Data.TensorDataset(features, labels)
# 随机读取小批量
data_iter = Data.DataLoader(dataset, batch_size, shuffle=True)

```
### 3.3.3 定义模型


```python
class LinearNet(torch.nn.Module):
    def __init__(self, n_feature):
        super(LinearNet, self).__init__()
        self.linear = nn.Linear(n_feature, 1)
    # forward 定义前向传播
    def forward(self, x):
        y = self.linear(x)
        return y

net = LinearNet(num_inputs)
print(net) # 使用print可以打印出网络的结构

```
也可以用nn.Seqential来构建网络

```python
# 写法一
net = nn.Sequential(
    nn.Linear(num_inputs, 1)
    # 此处还可以传入其他层
    )

# 写法二
net = nn.Sequential()
net.add_module('linear', nn.Linear(num_inputs, 1))
# net.add_module ......

# 写法三
from collections import OrderedDict
net = nn.Sequential(OrderedDict([
          ('linear', nn.Linear(num_inputs, 1))
          # ......
        ]))

print(net)
print(net[0])

```