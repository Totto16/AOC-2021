module Main where

main = do
    txt <- readFile "input.txt"
    let nums = read <$> lines txt
    let n = countIncreases nums
    print ("Solution 1: " ++ show n)
    let sums = slidingSums nums
    let n2 = countIncreases sums
    print ("Solution 2: " ++ show n2)

countIncreases :: [Int] -> Int
countIncreases nums = sum [if x>y then 1 else 0 | (y,x) <- zip nums (tail nums)]

slidingSums :: [Int] -> [Int]
slidingSums xs = zipWith3 (\a b c -> a+b+c) xs (tail xs) (tail $ tail xs)