import requests
from openpyxl import Workbook

# Initialize Excel Workbook and Worksheet
wb = Workbook()
ws = wb.active

# Add the title row
ws.append(['Disease Label'])

# Define the headers for the HTTP request
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

# The url of the API endpoint
url = 'https://db.cngb.org/stomics/ajax/get_samples_statistics/'

# Send GET request to the API
response = requests.get(url, headers = headers)

# Check if the request was successful
if response.ok:
    # Load the json content of the response into a Python Dictionary
    data = response.json()
    
    # Navigate to the 'disease' part of the response
    diseases = data['data']['diseases']  # Directly access the 'diseases' key as shown in the JSON structure
    
    # Iterate through each disease in the list
    for disease in diseases:
        
        # Extract the 'name' value
        disease_name = disease['name'] # Directly access the 'name' key as shown in the JSON structure
        
        # Add the disease name to the Excel sheet
        ws.append([disease_name])
        
    # Save the workbook to a file
    file_path = 'scrap_STOmics.xlsx'
    wb.save(file_path)
    print(f"The Excel file has been created at {file_path}.")
else:
    print("Failed to retrieve data:", response.status_code)

# Print out the status code for debugging
print("Status Code:", response.status_code)