
'''
content type : application/json
'''

import requests
from openpyxl import Workbook

# Initialize Excel workbook and worksheet
wb = Workbook()
ws = wb.active

# Add the title row
ws.append(['Disease Name'])

# Define the headers for the HTTP request
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

# The URL of the API endpoint
url = 'https://singlecell.broadinstitute.org/single_cell/api/v1/search/facets'

# Send GET request to the API
response = requests.get(url, headers=headers, verify=False)

# Set to store unique disease names
unique_diseases = set()

# Check if the request was successful
if response.ok:
    # Load the JSON content of the response into a Python list
    facets = response.json()
    
    # Access the 'disease' element in the list, which is identified by its position
    # It's safer to search for the element with the 'id' of 'disease'
    disease_facet = next((item for item in facets if item['id'] == 'disease'), None)
    
    # Check if the 'disease' facet was found and it has the 'filters' key
    if disease_facet and 'filters' in disease_facet:
        # Iterate through each filter in the 'filters' list
        for filter_item in disease_facet['filters']:
            # Extract the 'name' value
            disease_name = filter_item.get('name', 'N/A')
            
            # Check if the disease name has already been encountered
            if disease_name not in unique_diseases:
                # Add the new disease name to the set and the Excel sheet
                unique_diseases.add(disease_name)
                ws.append([disease_name])

    # Save the workbook to a file
    wb.save('SingleCellPortal.xlsx')
else:
    print("Failed to retrieve data:", response.status_code)

# Print out the status code for debugging
print("Status Code:", response.status_code)
