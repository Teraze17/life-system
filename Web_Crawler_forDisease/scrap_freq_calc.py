import pandas as pd
import re
from collections import Counter

# 讀取Excel文件
file_path = 'merged_file.xlsx'
data = pd.read_excel(file_path)

# 顯示文件的前幾行以了解結構
print(data.head())

# 函數用於從字符串中提取中文詞組
def extract_chinese(text):
    if not isinstance(text, str):
        return []
    return re.findall(r'[\u4e00-\u9fff]+', text)

# 提取所有欄位中的中文詞組並計算頻率
chinese_phrases = []
for column in data.columns:
    # 不使用.unique()以便計算整個數據集中詞組的總體頻率
    chinese_phrases.extend(data[column].apply(extract_chinese).sum())

# 計算每個中文詞組的出現頻率
chinese_phrase_frequency = Counter(chinese_phrases)

# 顯示結果
print(chinese_phrase_frequency.most_common())
