# MerakiPacketCaptureTool

A Google Apps Script tool for managing Cisco Meraki packet captures. This tool allows you to:
- Continuously capture network packets on a Meraki device and upload them to the cloud.
- Manually retrieve a list of packet captures (PCAPs), log them in a spreadsheet, and download new PCAP files.

## Features
- **Continuous Packet Capture**: Runs indefinitely, capturing packets every 130 seconds (120s capture + 10s buffer).
- **Manual PCAP Retrieval**: Updates a list of captures and opens download URLs in browser tabs via a custom menu.
- **Spreadsheet Integration**: Stores capture metadata in a Google Spreadsheet.

## Prerequisites
- A Cisco Meraki account with API access.
- A Google account to use Google Sheets and Apps Script.
- Basic familiarity with GitHub and Google Apps Script.

## Setup Instructions

### 1. Clone the Repository
bash
git clone https://github.com/yourusername/MerakiPacketCaptureTool.git
cd MerakiPacketCaptureTool

2. Set Up the Spreadsheet
Open MerakiPacketCaptureTemplate.xlsx in Google Sheets:
Upload the file to Google Drive, then open it with Google Sheets.
Alternatively, create a new spreadsheet and manually set up two sheets:
Getting Started: Add labels in column A:
A1: "Organization ID"
A2: "API Key"
A3: "Device Serial Number"
A5: "Interface Type (e.g., wan1)"
pcap list: Add headers in row 1:
A1: "Capture ID"
B1: "Download URL"
C1: "Timestamp"
Fill in the "Getting Started" sheet (column B):
B1: Your Meraki Organization ID
B2: Your Meraki API Key (generate from the Meraki Dashboard)
B3: The serial number of the Meraki device to monitor
B5: The interface type (e.g., "wan1")

4. Install the Script
In your Google Sheet, go to Extensions > Apps Script.
Delete any existing code.
Copy the contents of Code.gs from this repository and paste it into the script editor.
Save the project (e.g., name it "MerakiPacketCaptureTool").

6. Authorize the Script
Run the onOpen function manually from the Apps Script editor to create the "PCAP Tools" menu.
Grant the necessary permissions when prompted (access to Spreadsheet, external APIs, etc.).
Usage
Start Continuous Capture:
In the Apps Script editor, run startContinuousPacketCapture().
This will begin capturing packets every 130 seconds. To stop, manually halt the script execution.

Retrieve and Download PCAPs:
In the Google Sheet, click PCAP Tools > Update List & Download.
This updates the "pcap list" sheet with new captures and opens download URLs in new browser tabs.

View Logs:
Check the Apps Script logs (View > Logs) for debugging information.
Files

Code.gs: The Google Apps Script containing all functions.
MerakiPacketCaptureTemplate.xlsx: A template spreadsheet with preconfigured sheets.


Notes
The continuous capture runs indefinitely; stop it manually in the Apps Script editor if needed.
Ensure your Meraki API key has appropriate permissions for packet capture operations.
Downloaded PCAP files can be analyzed with tools like Wireshark.


Contributing
Feel free to fork this repository, submit issues, or create pull requests with improvements!
