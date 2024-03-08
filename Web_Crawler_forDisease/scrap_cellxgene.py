import requests
from openpyxl import Workbook

# Initialize Excel workbook and worksheet
wb = Workbook()
ws = wb.active

# Add the title row
ws.append(['Disease Label'])

# Define the headers for the HTTP request
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

# The URL of the API endpoint
url = 'https://api.cellxgene.cziscience.com/dp/v1/datasets/index'

# Send GET request to the API
response = requests.get(url, headers=headers)

# Set to store unique disease labels
unique_diseases = set()

# Check if the request was successful
if response.ok:
    # Load the JSON content of the response into a Python list
    datasets = response.json()
    
    # Iterate through each dataset in the list
    for dataset in datasets:
        # Extract the 'disease' key's list
        disease_list = dataset.get('disease', [])
        
        # Check if the disease_list is non-empty and contains a dictionary
        if disease_list and isinstance(disease_list[0], dict):
            # Extract the 'label' value from the first dictionary in the list
            disease_label = disease_list[0].get('label', 'N/A')
            
            # Check if the disease label has already been encountered
            if disease_label not in unique_diseases:
                # Add the new disease label to the set and the Excel sheet
                unique_diseases.add(disease_label)
                ws.append([disease_label])

    # Save the workbook to a file
    wb.save('CellxGene_1.xlsx')
else:
    print("Failed to retrieve data:", response.status_code)

# Print out the status code for debugging
print("Status Code:", response.status_code)
