import random

dice = [1, 2, 3, 4, 5, 6]
result = []

for i in range(5):
    result.append(random.choice(dice)) #append：出た目をリストに追加する

print("出た目", result)