---
title: Haskell 99 questions 1 to 10
subtitle: 1-10
date: 2021-04-15
tags: [Haskell, Code]
---
## Problem 1
(*) Find the last element of a list.

(Note that the Lisp transcription of this problem is incorrect.)

Example in Haskell:

```
λ> myLast [1,2,3,4]
4
λ> myLast ['x','y','z']
'z'
```

### solution

```haskell
myLast :: [a] -> a
myLast [] = "empty"
myLast [x] = x
myLast (_:xs) = myLast xs
```

## Problem 2
(*) Find the last but one element of a list.

(Note that the Lisp transcription of this problem is incorrect.)

Example in Haskell:
```
λ> myButLast [1,2,3,4]
3
λ> myButLast ['a'..'z']
'y'
```

```haskell
--solution1
myButLast :: [a] -> a
myButLast x = reverse x !! 1

--solution2
myButLast' [x,_] = x
myButLast' [_:xs] = myButLast' xs
```
## Problem 3
(*) Find the K'th element of a list. The first element in the list is number 1.

Example:
```
* (element-at '(a b c d e) 3)
c
```

Example in Haskell:

```
λ> elementAt [1,2,3] 2
2
λ> elementAt "haskell" 5
'e'
```


```haskell
--solution1
elementAt :: [a] -> Int -> a
elementAt list n = list !! (n - 1)

--solution2
elementAt' (x:_) 1 = x
elementAt' [] _ = error "out of bounds"
elementAt' (_:xs) k = elementAt' xs (k - 1)
```

## Problem 4
(*) Find the number of elements of a list.

Example in Haskell:

```
λ> myLength [123, 456, 789]
3
λ> myLength "Hello, world!"
13
```
## Problem 5
(*) Reverse a list.

Example in Haskell:

、、、
λ> myReverse "A man, a plan, a canal, panama!"
"!amanap ,lanac a ,nalp a ,nam A"
λ> myReverse [1,2,3,4]
[4,3,2,1]
、、、



```haskell
--solution1
myReverse :: [a] -> [a]
myReverse [] = []
myReverse (x:xs) = reverse xs ++ [x]

```
## Problem 6
(*) Find out whether a list is a palindrome. A palindrome can be read forward or backward; e.g. (x a m a x).

Example in Haskell:

、、、
λ> isPalindrome [1,2,3]
False
λ> isPalindrome "madamimadam"
True
λ> isPalindrome [1,2,4,8,16,8,4,2,1]
True
、、、

```haskell
isPalindrome :: (Eq a) => [a] -> Bool
isPalindrome x = x == (reverse x)
```

## Problem 7
(**) Flatten a nested list structure.

Transform a list, possibly holding lists as elements into a `flat' list by replacing each list with its elements (recursively).

Example:

* (my-flatten '(a (b (c d) e)))
(A B C D E)
Example in Haskell:

We have to define a new data type, because lists in Haskell are homogeneous.

 data NestedList a = Elem a | List [NestedList a]
λ> flatten (Elem 5)
[5]
λ> flatten (List [Elem 1, List [Elem 2, List [Elem 3, Elem 4], Elem 5]])
[1,2,3,4,5]
λ> flatten (List [])
[]


```haskell
--to be written

```

## Problem 8
(**) Eliminate consecutive duplicates of list elements.

If a list contains repeated elements they should be replaced with a single copy of the element. The order of the elements should not be changed.

Example:

、、、
* (compress '(a a a a b c c a a d e e e e))
(A B C A D E)
、、、

Example in Haskell:

、、、
λ> compress "aaaabccaadeeee"
"abcade"
、、、

```haskell
```
```haskell


```
```haskell

```
```haskell

```
```haskell

```
```haskell

```
```haskell

```
```haskell

```
```haskell

```
```haskell

```
```haskell

```
```haskell

```