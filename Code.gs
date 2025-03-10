// Code.gs
// Continuous Capture Script
function startContinuousPacketCapture() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const configSheet = ss.getSheetByName("Getting Started");
  const orgId = configSheet.getRange("B1").getValue();
  const apiKey = configSheet.getRange("B2").getValue();
  const serial = configSheet.getRange("B3").getValue();
  const interfaceType = configSheet.getRange("B5").getValue();
  
  const baseUrl = `https://api.meraki.com/api/v1/organizations/${orgId}/devices/packetCapture/captures`;
  const headers = { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" };
  let captureCount = 1;
  
  while (true) {
    try {
      const payload = {
        "serials": [serial], "name": `Capture no. ${captureCount}`, "outputType": "upload_to_cloud",
        "ports": "1, 3", "captureReason": "Continuous network monitoring", "duration": 120,
        "interface": interfaceType
      };
      const options = { "method": "post", "headers": headers, "payload": JSON.stringify(payload), "muteHttpExceptions": true };
      const response = UrlFetchApp.fetch(baseUrl, options);
      Logger.log(`Started capture ${captureCount}: ${response.getResponseCode()}`);
      Utilities.sleep(130000);
      captureCount++;
    } catch (e) {
      Logger.log(`Error in capture loop: ${e}`);
      Utilities.sleep(60000);
    }
  }
}

// PCAP List Retriever Script (Manual)
function getPcapListAndUrls() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const configSheet = ss.getSheetByName("Getting Started");
  const orgId = configSheet.getRange("B1").getValue();
  const apiKey = configSheet.getRange("B2").getValue();
  
  let pcapSheet = ss.getSheetByName("pcap list");
  if (!pcapSheet) { 
    pcapSheet = ss.insertSheet("pcap list"); 
    Logger.log("Created pcap list sheet; please add headers manually in row 1");
  }
  
  const listUrl = `https://api.meraki.com/api/v1/organizations/${orgId}/devices/packetCapture/captures`;
  const headers = { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" };
  
  try {
    const listOptions = { "method": "get", "headers": headers, "muteHttpExceptions": true };
    const listResponse = UrlFetchApp.fetch(listUrl, listOptions);
    Logger.log("List API Response Code: " + listResponse.getResponseCode());
    Logger.log("List API Response: " + listResponse.getContentText());
    const captures = JSON.parse(listResponse.getContentText()).items || [];
    Logger.log("Number of captures found: " + captures.length);
    
    const newUrls = [];
    
    for (let capture of captures) {
      const captureId = capture.captureId;
      const urlEndpoint = `https://api.meraki.com/api/v1/organizations/${orgId}/devices/packetCapture/captures/${captureId}/downloadUrl`;
      const urlResponse = UrlFetchApp.fetch(urlEndpoint, listOptions);
      Logger.log(`URL API Response for ${captureId}: ` + urlResponse.getContentText());
      const urlData = JSON.parse(urlResponse.getContentText());
      
      const lastRow = pcapSheet.getLastRow();
      let shouldAdd = true;
      if (lastRow > 1) {
        const existingIds = pcapSheet.getRange(2, 1, lastRow - 1, 1).getValues();
        shouldAdd = !existingIds.some(row => row[0] === captureId);
      }
      
      if (shouldAdd) {
        const timestamp = new Date();
        const nextRow = lastRow + 1;
        pcapSheet.getRange(nextRow, 1).setValue(captureId);
        pcapSheet.getRange(nextRow, 2).setValue(urlData.downloadUrl || "");
        pcapSheet.getRange(nextRow, 3).setValue(timestamp);
        Logger.log(`Added capture ${captureId} to row ${nextRow}`);
        
        if (urlData.downloadUrl) {
          newUrls.push(urlData.downloadUrl);
        }
      } else {
        Logger.log(`Capture ${captureId} already exists in sheet`);
      }
    }
    
    if (newUrls.length > 0) {
      const htmlContent = `
        <html>
          <body>
            <p>Opening ${newUrls.length} new PCAP download URLs...</p>
            <script>
              ${newUrls.map(url => `window.open("${url}", "_blank");`).join("\n")}
              setTimeout(() => window.close(), 5000);
            </script>
          </body>
        </html>
      `;
      const htmlOutput = HtmlService.createHtmlOutput(htmlContent)
        .setWidth(300)
        .setHeight(100);
      SpreadsheetApp.getUi().showModalDialog(htmlOutput, "Downloading New PCAPs");
      Logger.log(`Opened ${newUrls.length} new URLs: ${newUrls.join(", ")}`);
    }
    
    Logger.log("PCAP list updated successfully");
  } catch (e) {
    Logger.log(`Error in PCAP list retrieval: ${e}`);
  }
}

// Custom menu for manual run
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("PCAP Tools")
    .addItem("Update List & Download", "getPcapListAndUrls")
    .addToUi();
}
