
'''
content type : application/json
'''

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
url = 'https://www.immunesinglecell.org/api//vishuo/sample/all'

# Send GET request to the API
response = requests.get(url, headers=headers)

# Set to store unique disease names
unique_diseases = set()

# Check if the request was successful
if response.ok:
    # Load the JSON content of the response into a Python list
    datasets = response.json()
    
    # Iterate through each dataset in the list
    for dataset in datasets:
        # Extract the 'disease' value
        disease_label = dataset.get('disease')
        
        # Only process non-None and non-'N/A' disease labels
        if disease_label and disease_label not in unique_diseases:
            # Add the new disease label to the set and the Excel sheet
            unique_diseases.add(disease_label)
            ws.append([disease_label])

    # Save the workbook to a file
    wb.save('scrap_Disco.xlsx')
else:
    print("Failed to retrieve data:", response.status_code)

# Print out the status code for debugging
print("Status Code:", response.status_code)
