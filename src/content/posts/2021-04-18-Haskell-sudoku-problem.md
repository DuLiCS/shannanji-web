---
title: Haskell Sudoku Problem
date: 2021-04-18
tags: [Haskell, Code]
---
```haskell
-- Returns every solution of the 4x4 sudoku.
-- Provide two functions to solve the problem.
-- One is bruteForceSolve using the brute force method.
-- The optimizeSolve is the optimized version of the bruteForceSolve.
-- These two functions will return all solution of the 4x4 sudoku.
-- If there is no valid solution of the puzzle,function will return [].
-- Usage: 1. Load the haskell file     :l sudoku.hs
--        2. bruteForceSolve input (brute force method)
--        e.g bruteForceSolve [[3,4,0,0],[2,0,3,0],[0,3,0,2],[0,0,1,3]]
--        3. optimizedSolve input  (optimized version)
--        e.g optimizeSolve [[3,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,1,0]]
--        4. Using bruteForceSolve examplePuzzle or optimizedSolve multipleSolutionsPuzzle for test.

--Main>bruteForceSolve [[3,4,0,0],[2,0,3,0],[0,3,0,2],[0,0,1,3]]
--[[[3,4,2,1],[2,1,3,4],[1,3,4,2],[4,2,1,3]]]

--Main>optimizeSolve [[3,0,0,0],[0,2,0,0],[4,0,0,3],[0,0,1,0]]
--[]
--empty list if there is no solution

--Main>optimizeSolve multipleSolutionsPuzzle 
--[[[3,1,2,4],[2,4,3,1],[1,3,4,2],[4,2,1,3]],[[3,1,4,2],[2,4,3,1],[1,3,2,4],[4,2,1,3]],[[3,4,2,1],[2,1,3,4],[1,3,4,2],[4,2,1,3]]]


import Data.List

{-
The input is a matrix, represented as a list 
of rows, where each row is a list of the numbers
in the grid. The numbers are either 1, 2, 3, 4 and
0 represent the field is empty. 

According to the description above，I construct the following
types.


-}
type Grid = Matrix Value
type Matrix a = [Row a]
type Row a = [a]
type Value = Int

--The box size of the 4x4 sudoku is 2
boxSize :: Int
boxSize = 2

--the element of the 4x4 sudoku is 1,2,3,4
values :: [Value]
values = [1 .. 4]

--the value 0 indicating an empty cell.
empty :: Value -> Bool
empty = (== 0)


--The sample input here 
examplePuzzle :: Grid
examplePuzzle = [[3,4,0,0],
         [2,0,3,0],
         [0,3,0,2],
         [0,0,1,3]]
--The example of multiple solutions puzzle
multipleSolutionsPuzzle :: Grid
multipleSolutionsPuzzle =
        [[3,0,0,0],
         [2,0,3,0],
         [0,3,0,0],
         [0,0,1,3]]


{-Determining whether a grid is solved or not
our rows,columns and boxes must have all the digits(1,2,3,4)
without duplicates.validGrid function extract rows,columns and boxes and
check this criteria.
-}
validGrid :: Grid -> Bool
validGrid g = all noDups (rows g) && 
          all noDups (cols g) &&
          all noDups (boxes g)

--noDups function iterate the list and determine whether the 
--list have duplicate elements or not 
noDups :: (Eq a, Num a) => [a] -> Bool
noDups [] = True
--list like [1,2,0,0] should be True
noDups (x : xt) = if x == 0 then  (noDups xt) else (not (elem x xt) && noDups xt) 


--The next three is extraction function
rows :: Matrix a -> [Row a]
rows =  id

--columns are the transpose of the rows
cols :: Matrix a -> [Row a]
cols = transpose


--let the element from one box in one sublist,transpose the element in pairs
boxes :: Matrix a -> [Row a]
boxes = unpack . map transpose . pack
        where
 -- pack the puzzle list in pairs
 --[[[[3,4],[0,0]],[[2,0],[3,0]]],[[[0,3],[0,2]],[[0,0],[1,3]]]]
 --map the transpose to the subelements like [[[3,4],[0,0]],[[2,0],[3,0]]]
 --then concat the subelement
          pack   = split . map split
          split  = chop boxSize
          unpack = map concat . concat

--recombine the list
--chop 2 [1,2,3,4] = [[1,2],[3,4]]
chop :: Int -> [a] -> [[a]]
chop n [] = []
chop n xs = take n xs : chop n (drop n xs)


--a list of grids with every possibility for the empty squares filled in.
--a combination of deterministic and non-deter­ministic elements 
collapse :: Matrix [a] -> [Matrix a]
collapse =  sequence . map sequence

--map the choice function into every list 
choices g = map (map choice) g
            where
             --retain non-zero element and replace the 0 with [1..4]
              choice v = if empty v then values else [v]

--iterate all the possible grids,get all grids that meet the criterion of 4x4 sudoku
--The brute force solution 
bruteForceSolve :: Grid -> [Grid]
bruteForceSolve =  filter validGrid . collapse . choices

--Optimize

--Enumerating all digits for empty spaces doesn’t take into account the constraints of the puzzle itself.
{-It take so long to solve the problem like 
        [[3,0,0,0],
         [2,0,0,0],
         [0,3,0,0],
         [0,0,1,3]]
For each non-deterministic cell, we can throw away any inconsistent choice.
-}

--throw away inconsistent choices in rows,columns and boxes
optimize =  optimizeIn boxes . optimizeIn cols . optimizeIn rows
         where optimizeIn f = f . map reduce . f

--determine it is a single element list or not
single :: [a] -> Bool
single [_] = True
single _   = False

--throw away inconsistent choice.
--reduce [[3],[4],[1,2,3,4],[1,2,3,4]] = [[3],[4],[1,2],[1,2]]
reduce xss =  [xs `minus` singles | xs <- xss]
--singles choose all single elements and concatenate them
              where singles = concat (filter single xss)

{-if there are only one element,eg. [3] in [[3],[4],[1,2,3,4],[1,2,3,4]],remain unchanged，
  if there are more than one element eg. [1,2,3,4] in [[3],[4],[1,2,3,4],[1,2,3,4]],throw away 
    element dupulicate in singles
-}
xs `minus` ys = if single xs then xs else xs \\ ys

--a list of grids with every possibility for the empty squares filled in.
--a combination of deter­min­is­tic and non-deter­min­is­tic elements,the non-deter­min­is­tic elements here are reduced
--iterate all the possible grids,get all grids that meet the criterion of 4x4 sudoku
optimizeSolve :: Grid -> [Grid]
optimizeSolve =  filter validGrid . collapse . optimize . choices
```