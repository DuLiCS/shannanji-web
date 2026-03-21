---
title: Dive into DL TF
subtitle: 预备知识
date: 2022-08-18
tags: [tensorflow, deep learning]
---
# Dive into DL TF

[Dive-into-DL-TF2.0](https://trickygo.github.io/Dive-into-DL-TensorFlow2.0/#/)

# 1.   预备知识

## 1.1  环境配置

略

## 1.2 数据操作

### 1.2.1 创建tensor

```python
import tensorflow as tf

print(tf.__version__)
# 我们用arange函数创建一个行向量。
x = tf.constant(range(12))
# 我们可以通过shape属性来获取tensor实例的形状。
print(x.shape)
print(x)
# 我们也能够通过len得到tensor实例中元素（element）的总数。
print(len(x))
# 下面使用reshape函数把行向量x的形状改为(3, 4)，也就是一个3行4列的矩阵，并记作X。除了形状改变之外，X中的元素保持不变。
X = tf.reshape(x, (3, 4))
print(X)
# 创建一个各元素为0，形状为(2, 3, 4)的张量。实际上，之前创建的向量和矩阵都是特殊的张量。
print(tf.zeros((2, 3, 4)))
# 创建各元素为1的张量。
print(tf.ones((3, 4)))
# 随机生成tensor中每个元素的值。下面我们创建一个形状为(3, 4)的tensor。它的每个元素都随机采样于均值为0、标准差为1的正态分布。
print(tf.random.normal(shape=[3, 4], mean=0, stddev=1))
# 通过Python的列表（list）指定需要创建的tensor中每个元素的值。
Y = tf.constant([[2, 1, 4, 3], [1, 2, 3, 4], [4, 3, 2, 1]])
print(Y)
```

### 1.2.2 运算

```python
# 按元素加
print(X + Y)
# 按元素除
print(X / Y)
# 按元素做指数运算
Y = tf.cast(Y, tf.float32)
print(tf.exp(Y))
# 除了按元素计算外，我们还可以使用matmul函数做矩阵乘法。下面将X与Y的转置做矩阵乘法。由于X是3行4列的矩阵，Y转置为4行3列的矩阵，因此两个矩阵相乘得到3行3列的矩阵。
Y = tf.cast(Y, tf.int32)
print(tf.matmul(X, tf.transpose(Y)))
# 可以将多个tensor连结（concatenate）。下面分别在行上（维度0，即形状中的最左边元素）和列上（维度1，即形状中左起第二个元素）连结两个矩阵。可以看到，输出的第一个tensor在维度0的长度（ 6
# ）为两个输入矩阵在维度0的长度之和（ 3+3 ），而输出的第二个tensor在维度1的长度（ 8 ）为两个输入矩阵在维度1的长度之和（ 4+4 ）。
print(tf.concat([X, Y], axis=0), tf.concat([X, Y], axis=1))
# 使用条件判断式可以得到元素为0或1的新的tensor。以X == Y为例，如果X和Y在相同位置的条件判断为真（值相等），那么新的tensor在相同位置的值为1；反之为0。
print(tf.equal(X, Y))
# 对tensor中的所有元素求和得到只有一个元素的tensor。
print(tf.reduce_sum(X))

X = tf.cast(X, tf.float32)
print(X)
# 求范数
print(tf.norm(X))
```

### 1.2.3 广播机制

```python
# 我们看到如何对两个形状相同的tensor做按元素运算。当对两个形状不同的tensor按元素运算时，可能会触发广播（broadcasting）机制：先适当复制元素使这两个tensor形状相同后再按元素运算。
# 定义两个tensor
A = tf.reshape(tf.constant(range(3)), (3, 1))
B = tf.reshape(tf.constant(range(2)), (1, 2))
print(A, B)

# 计算A+B
# 扩充到2X3矩阵相加
print(A + B)
```

### 1.2.4 索引

```python
# 在tensor中，索引（index）代表了元素的位置。tensor的索引从0开始逐一递增。例如，一个3行2列的矩阵的行索引分别为0、1和2，列索引分别为0和1。
# 在下面的例子中，我们指定了tensor的行索引截取范围[1:3]。依据左闭右开指定范围的惯例，它截取了矩阵X中行索引为1和2的两行。
print(X)
print(X[1:3])
# 我们可以指定tensor中需要访问的单个元素的位置，如矩阵中行和列的索引，并为该元素重新赋值。
X = tf.Variable(X)
# M1 GPU tensorflow报错
# X[1, 2].assign(9)
# X[1:2,:].assign(tf.ones(X[1:2,:].shape, dtype = tf.float32)*12)
print(X)
```

### 1.2.5 运算内存开销

```python
before = id(Y)
Y = X + Y
# False
print(id(Y) == before)
# 如果想指定结果到特定内存，我们可以使用前面介绍的索引来进行替换操作。在下面的例子中，我们先通过zeros_like创建和Y形状相同且元素为0的tensor，记为Z。接下来，我们把X + Y的结果通过[:]写进Z对应的内存中。
Z = tf.Variable(tf.zeros_like(Y))
before = id(Z)
# Z[:].assign(X + Y)
print(id(Z) == before)
Z = tf.add(X, Y)
print(id(Z) == before)

before = id(X)
X.assign_add(Y)
print(id(X) == before)
```

### 1.2.6 tensor和numpy的相互转换

```python
# 通过array函数和asnumpy函数令数据在NDArray和NumPy格式之间相互变换。下面将NumPy实例变换成tensor实例。
import numpy as np

P = np.ones((2, 3))
D = tf.constant(P)
print(D)
# 再将NDArray实例变换成NumPy实例。
print(np.array(D))
```

## 1.3 自动求梯度

在深度学习中，我们经常需要对函数求梯度（gradient）。本节将介绍如何使用tensorflow2.0提供的GradientTape来自动求梯度。

GradientTape 可以理解为“梯度流 记录磁带”：

在记录阶段：记录被 GradientTape 包裹的运算过程中，依赖于 source node （被 watch “监视”的变量）的关系图。

在求导阶段：通过搜索 source node 到 target node 的路径，进而计算出偏微分。

source node 在记录运算过程之前进行指定：

自动“监控”所有可训练变量：GradientTape 默认（`watch_accessed_variables=True`）将所有可训练变量（`created by tf.Variable, where trainable=True`）视为需要“监控”的 source node 。

对于不可训练的变量（比如`tf.constant`）可以使用tape.watch()对其进行“监控”。

此外，还可以设定`watch_accessed_variables=False`，然后使用tf.watch()精确控制需要“监控”哪些变量。

### 1.3.1 简单示例

我们先看一个简单例子：对函数$y = 2x^Tx$求关于列向量$x$的梯度。我们先创建变量$x$,并赋初值。

```python
x = tf.reshape(tf.Variable(range(4), dtype=tf.float32), (4, 1))
print(x)
```

函数$y = 2x^Tx$关于$x$的梯度为$4x$

```python
with tf.GradientTape() as t:
    t.watch(x)
    y = 2 * tf.matmul(tf.transpose(x), x)

dy_dx = t.gradient(y, x)
print(dy_dx)
```

### 1.3.2 训练模式和预测模式

```python
with tf.GradientTape(persistent=True) as g:
    g.watch(x)
    y = x * x
    z = y * y
    dz_dx = g.gradient(z, x)
    dy_dx = g.gradient(y, x)
print(dz_dx, dy_dx)
```

### 1.3.3 对Python控制流求梯度

即使函数的计算图包含了Python的控制流（如条件和循环控制），我们也有可能对变量求梯度。

考虑下面程序，其中包含Python的条件和循环控制。需要强调的是，这里循环（while循环）迭代的次数和条件判断（if语句）的执行都取决于输入a的值。

```python
# c = 2a or 200a
# c' = 2 or 200
# c' = c/a
a = tf.random.normal((1, 1), dtype=tf.float32)
with tf.GradientTape() as t:
    t.watch(a)
    c = f(a)
print(t.gradient(c, a) == c / a)
```

### 1.3.4

想知道一个模块里面提供了哪些可以调用的函数和类的时候，可以使用`dir`
函数。下面我们打印`dtypes`和`random`模块中所有的成员或属性。

```python
dir(tf.dtypes)

['DType',
 'QUANTIZED_DTYPES',
 '__builtins__',
 '__cached__',
 '__doc__',
 '__file__',
 '__loader__',
 '__name__',
 '__package__',
 '__path__',
 '__spec__',
 '_sys',
 'as_dtype',
 'bfloat16',
 'bool',
 'cast',
 'complex',
 'complex128',
 'complex64',
 'double',
 'float16',
 'float32',
 'float64',
 'half',
 'int16',
 'int32',
 'int64',
 'int8',
 'qint16',
 'qint32',
 'qint8',
 'quint16',
 'quint8',
 'resource',
 'saturate_cast',
 'string',
 'uint16',
 'uint32',
 'uint64',
 'uint8',
 'variant']

dir(tf.random)

['__builtins__',
 '__cached__',
 '__doc__',
 '__file__',
 '__loader__',
 '__name__',
 '__package__',
 '__path__',
 '__spec__',
 '_sys',
 'all_candidate_sampler',
 'categorical',
 'experimental',
 'fixed_unigram_candidate_sampler',
 'gamma',
 'learned_unigram_candidate_sampler',
 'log_uniform_candidate_sampler',
 'normal',
 'poisson',
 'set_seed',
 'shuffle',
 'stateless_categorical',
 'stateless_normal',
 'stateless_truncated_normal',
 'stateless_uniform',
 'truncated_normal',
 'uniform',
 'uniform_candidate_sampler']
```

### 1.4.2 use of functions

```python
help(tf.ones)

Help on function ones in module tensorflow.python.ops.array_ops:

ones(shape, dtype=tf.float32, name=None)
    Creates a tensor with all elements set to 1.

    This operation returns a tensor of type `dtype` with shape `shape` and all
    elements set to 1.

    For example:

    ```python
    tf.ones([2, 3], tf.int32)  # [[1, 1, 1], [1, 1, 1]]
    ```

    Args:
      shape: A list of integers, a tuple of integers, or a 1-D `Tensor` of type
        `int32`.
      dtype: The type of an element in the resulting `Tensor`.
      name: A name for the operation (optional).

    Returns:
      A `Tensor` with all elements set to 1.
```