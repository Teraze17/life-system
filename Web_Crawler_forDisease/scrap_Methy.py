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
url = 'https://ngdc.cncb.ac.cn/methbank/scm/repository/basic?field=sample_condition&val=cancer&relationship=&order=asc&offset=0&limit=10'

# Send GET request to the API
response = requests.get(url, headers=headers)

# Set to store unique disease names
unique_diseases = set()

# Check if the request was successful
if response.ok:
    # Load the JSON content of the response into a Python dictionary
    data = response.json()
    
    # Navigate to the 'content' part of the response
    content = data.get('content', [])  # Ensure we have a list to iterate over
    
    # Iterate through each dataset in the content list
    for dataset in content:
        # Extract the 'Disease' value
        disease_label = dataset.get('Disease')  # Using the correct key 'Disease' from the JSON
        
        # Only process non-None and non-empty disease labels
        if disease_label and disease_label not in unique_diseases:
            # Add the new disease label to the set and the Excel sheet
            unique_diseases.add(disease_label)
            ws.append([disease_label])

    # Save the workbook to a file
    wb.save('scrap_Methy.xlsx')
else:
    print("Failed to retrieve data:", response.status_code)

# Print out the status code for debugging
print("Status Code:", response.status_code)
