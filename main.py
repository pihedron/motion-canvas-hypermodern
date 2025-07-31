from math import *

def xor(a, b):
    return max(a, b) - min(a, b)

def solve(a, b):
    return min(a, b) + xor(a, b)

print(solve(1, 3))