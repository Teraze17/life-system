
'''
content type : text/plain
'''

import requests
from openpyxl import Workbook
import json

# Initialize Excel workbook and worksheet
wb = Workbook()
ws = wb.active

# Add the title row
ws.append(['Cancer Name'])

# Define the headers for the HTTP request
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

# The URL of the API endpoint
url = 'http://bio-bigdata.hrbmu.edu.cn/SORC/0_files/innerpath/home_stats.txt'

# Send GET request to the API
response = requests.get(url, headers=headers)

# Check if the request was successful
if response.ok:
    # Parse the JSON content from the response text
    data = json.loads(response.text)
    
    # Extract the 'cancer_names' list
    cancer_names = data['cancer_names'].split(',')
    
    # Add each cancer name to the Excel sheet
    for name in cancer_names:
        ws.append([name])

    # Save the workbook to a file
    wb.save('scrap_SORC.xlsx')
else:
    print("Failed to retrieve data:", response.status_code)

# Print out the status code for debugging
print("Status Code:", response.status_code)
