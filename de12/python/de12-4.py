#--ダイスポーカー--(1回振って終わり)

import random

import collections

dice = [1, 2, 3, 4, 5, 6]
result = []

for i in range(5):
    result.append(random.choice(dice)) #append：出た目をリストに追加する

print("出た目：", result)

#--並べ替え--
result_list = sorted(result) 

#--要素のカウント--
count_list = collections.Counter(result_list) 
#print(count_list)

#--カウントの並び替え--
new_count_list = sorted(count_list.values(), reverse=True)
#print(new_count_list)

#--役--
if new_count_list == [5]:
    yaku = "ファイブカード"
elif new_count_list == [4, 1]:
    yaku = "フォーカード"
elif new_count_list == [3, 2]:
    yaku = "フルハウス"
elif result_list == [1, 2, 3, 4, 5] or result_list == [2, 3, 4, 5, 6]:
    yaku = "ストレート"
elif new_count_list == [3, 1, 1]:
    yaku = "スリーカード"
elif new_count_list == [2, 2, 1]:
    yaku = "ツーペア"
elif new_count_list == [2, 1, 1, 1]:
    yaku = "ワンペア"
else:
    yaku = "ハイカード"

print("役　　：", yaku)