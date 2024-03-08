import pandas as pd

# Paths to the uploaded Excel files
file_paths = [
    'scrap_Disco.xlsx',
    'scrap_Methy.xlsx',
    'scrap_SingleCellPortal.xlsx',
    'scrap_SORC.xlsx',
    'scrap_STOmics.xlsx',
    'scrap_CellxGene.xlsx'
]

# Read each Excel file and store in a list
dataframes = [pd.read_excel(file) for file in file_paths]

# Merge all dataframes on columns
merged_df = pd.concat(dataframes, axis=1)

# Save the merged dataframe to a new Excel file
merged_file_path = 'merged_file.xlsx'
merged_df.to_excel(merged_file_path, index=False)

# Return the path to the merged file
merged_file_path
