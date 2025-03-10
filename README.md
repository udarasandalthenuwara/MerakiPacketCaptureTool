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
```bash
git clone https://github.com/yourusername/MerakiPacketCaptureTool.git
cd MerakiPacketCaptureTool
