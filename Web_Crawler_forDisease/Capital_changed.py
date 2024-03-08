#-----------------------------------------------------------------------------------
#### Highlights of Original File is not preserved #####

import pandas as pd

# Load the Excel file
file_path = 'merged_file.xlsx'
df = pd.read_excel(file_path)

# Display the first few rows of the dataframe to understand its structure
df.head()


# Adjusting the function to handle non-string (e.g., NaN) values properly
def convert_to_lowercase(s):
    if pd.notna(s):
        return ' '.join([word.lower() if word else '' for word in s.split()])
    else:
        return s

# Apply the function to the last column
df['STOmics'] = df['STOmics'].apply(convert_to_lowercase)

# Save the corrected DataFrame to a new Excel file
corrected_output_file_path = 'merged_file_modified.xlsx'
df.to_excel(corrected_output_file_path, index=False)

corrected_output_file_path

# ---------------------------------------------------------------------------------------