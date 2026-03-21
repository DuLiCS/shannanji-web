---
title: SICP exercises
subtitle: U1 Part II
date: 2020-06-08
tags: [SICP, Lisp]
---
### 1.9 

```
(define (+ a b)
(if (= a 0) b (inc (+ (dec a) b))))
```
原文中相当于重载了+这个运算,在这里写成plus会更直观一些.

```
(plus 4 5)
(inc (plus (3) 5))
(inc (inc (plus (2) 5)))
(inc (inc (inc (plus (1) 5))))
(inc (inc (inc (inc (plus (0) 5)))))
(inc (inc (inc (inc 5))))
(inc (inc (inc 6)))
(inc (inc 7))
(inc 8)
(9)
```
通过观察可知这样的运算过程是线性递归

```
(define (+ a b)
(if (= a 0) b (+ (dec a) (inc b))))
```

这里也用plus代替+
```
(plus 4 5)
(plus (dec 4) (inc 5))
(plus 3 6)
(plus 2 7)
(plus 1 8)
(plus 0 9)
(9)
```
上面的运算过程是线性迭代.


### 1.9 Ackermann’s function.

```
(define (A x y) (cond ((= y 0) 0)
((= x 0) (* 2 y))
((= y 1) 2)
(else (A (- x 1) (A x (- y 1))))))
```

Consider the following procedures, where A is the proce- dure defined above:
```
(define (f n) (A 0 n)) 
(define (g n) (A 1 n)) 
(define (h n) (A 2 n))
(define (k n) (* 5 n n))
```

(f n)计算的是$2*y$

(g n)计算的是$2^{y}$

(h n)计算的是$2^{2^{\dots2}}$