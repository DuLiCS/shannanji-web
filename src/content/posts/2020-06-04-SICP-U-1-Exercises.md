---
title: SICP exercises
subtitle: U1 Part I
date: 2020-06-04
tags: [SICP, Lisp]
---
### 1.2 写前缀形式

```Lisp
(/ (+ 5 4 (- 2 (- 3 (+ 6 (/ 4 5)))))
   (* 3 (- 6 2) (- 2 7)))
```

### 1.3 定义一个过程,以三个数为参数,返回其中较大两个数的平方和.
```LISP
(define (sum-of-squares x y)
  (+ (* x x) (* y y)))

(define (f a b c)
  (cond ((> a b) (cond ((> b c) (sum-of-squares a b))
                       ((< b c) (sum-of-squares a c))))
        ((< a b) (if (< a c)
                     (sum-of-squares b c)
                     (sum-of-squares a b)))))
```

### 1.4 描述以下过程

```
(define (a-plus-abs-b a b)
	((if (> b 0) + -) a b))
```

根据b是否大于零来决定a和b的运算符.

### 1.5 解释正则序和应用序执行下列代码发生什么

```
(define (p) (p))

(define (test x y)
  (if (= x 0)
      0
      y))

(test 0 (p))
```

(define (p) (p))是一个不断调用自己的过程,因此一旦执行,就会无限循环.那么正则序和应用序的不同在于,先调用还是先展开,如果是正则序,先展开,再执行,则会输出0,因为(p)始终没有调用.而应用序则相反,先调用,那么就会进入无限循环.


### 实例1.1.7 牛顿法求平方根

$$
f(x) = x^2-2
$$

为了求$x^2 = 2$的值,也就是求$x^2-2 = 0$的根.($x_n$,0)切线方程为

$$y = f^{’}(x_n)x +f(x_n)-f^{’}(x_n)x_n$$

将这个直线和横轴的交点求出,这个点是$(\frac{f^{’}(x_n)x_n - f(x_n)}{f^{’}(x_n)},0)$.对于本题来说,$f(x) = x^2-2$,$f^{’}(x) = 2x$,因此$x_{n+1} = \frac{x_n+\frac{2}{x_n}}{2}$.


理论分析结束,代码如下:
```
(define (square-iter guess x)
  (if (good-enough? guess x)
      guess
      (square-iter (improve guess x) x)))

(define (improve guess x)
  (average guess (/ x guess)))

(define (average x y)
  (/ (+ x y) 2))

(define (good-enough? guess x)
  (< (abs (- (square guess) x)) 0.0001))


(define (square x)
  (* x x))
```


### 1.6 
运行结果显示;Aborting!: maximum recursion depth exceeded,也就是说超过了最大递归深度,自己写的new-if函数因为递归被多次调用,超过了最大的深度,因此报错.

根据书本 12 页所说， if 语句是一种特殊形式，当它的 predicate 部分为真时， then-clause 分支会被求值，否则的话， else-clause 分支被求值，两个 clause 只有一个会被求值。

而另一方面，新定义的 new-if 只是一个普通函数，它没有 if 所具有的特殊形式，根据解释器所使用的应用序求值规则，每个函数的实际参数在传入的时候都会被求值，因此，当使用 new-if 函数时，无论 predicate 是真还是假， then-clause 和 else-clause 两个分支都会被求值。

### 1.7

```
(define (good-enough? guess x)
  (< (abs (/ (abs (- (square guess) x)) x)) 0.001))
```


### 1.8

```
(define (cube-iter guess x)
  (if (good-enough? guess x)
      guess
      (cube-iter (improve guess x) x)))

(define (improve guess x)
  (third-div (* guess 2) (/ x (square guess))))

(define (third-div x y)
  (/ (+ x y) 3))

(define (good-enough? guess x)
  (< (abs (/ (abs (- (cube guess) x)) x)) 0.001))


(define (square x)
  (* x x))
(define (cube x)
  (* x x x))

(cube-iter 1.0 8.0)
```