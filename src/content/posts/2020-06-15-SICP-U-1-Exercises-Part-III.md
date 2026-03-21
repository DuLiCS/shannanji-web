---
title: SICP exercises
subtitle: U1 Part III
date: 2020-06-15
tags: [SICP, Lisp]
---
### 实例:换零钱方式统计

问题描述:共有50,25,10,5,1美分五种面值的钱币,现在要计算的是共有多少种换法.

解题思路会有一点点难想,主要思想是

**1美元换成五种零钱 ＝（包含半美元的所有换法）＋（不包含半美元的换法）**

包含半美元的换法要求保证至少有一张半美元，余下的（1美元－半美元）继续用五种面值兑换。不包含半美元的换法也就是对1美元进行剩余四种面值兑换.根据上面的思路进行数学表达式的推理：

设f(a,n)为对数量为a的钱进行n种面值的兑换法的总数，则有：

**f(a,n)=f(a-value(n),n) + f(a,n-1)**

递归必须要有停止条件，在这里的递归停止条件是：

**a=0 return 1 （a＝0说明分配完了，得到一种分配方法)**

**a<0 or n=0 return 0 （a<0或者n=0说明未分配成功)**

以下是python实现:

```python
 V = [ 1, 5, 10 , 25, 50]

def f(a , n):
    if a == 0:
        return 1
    if (a < 0 or n == 0):
        return 0
    else:
        return f(a,n-1)+f(a-V[n-1],n) 
```

书中的Lisp实现

```
(define (count-change amount) (cc amount 5))

(define (cc amount kinds-of-coins)
(cond ((= amount 0) 1)
((or (< amount 0) (= kinds-of-coins 0)) 0)
(else (+ (cc amount
(- kinds-of-coins 1)) (cc (- amount
(first-denomination kinds-of-coins))
kinds-of-coins)))))


(define (first-denomination kinds-of-coins)
(cond ((= kinds-of-coins 1) 1)
((= kinds-of-coins 2) 5)
((= kinds-of-coins 3) 10)
((= kinds-of-coins 4) 25)
((= kinds-of-coins 5) 50)))
```

### Exercise 1.11: A function f is defined by the rule that

$$
f(n)=\left\{\begin{array}{l}
n \text { if } n<3 \\
f(n-1)+2 f(n-2)+3 f(n-3) \text { if } n \geq 3
\end{array}\right.
$$

Write a procedure that computes f by means of a recursive process.Write a procedure that computes f by means of an iterative process.

**recursive process:**

```
(define (f n)
  (cond ((< n 3) n)
        (else (+ (f (- n 1)) (* (f (- n 2)) 2) (* (f (- n 3)) 3)))))
```

**iterative process:**

```

```