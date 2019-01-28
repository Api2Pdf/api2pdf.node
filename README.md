# api2pdf.node
Nodejs client for [Api2Pdf REST API](https://www.api2pdf.com/documentation) 

Api2Pdf.com is a REST API for instantly generating PDF documents from HTML, URLs, Microsoft Office Documents (Word, Excel, PPT), and images. The API also supports merge / concatenation of two or more PDFs. Api2Pdf is a wrapper for popular libraries such as **wkhtmltopdf**, **Headless Chrome**, and **LibreOffice**.

- [Installation](#installation)
- [Resources](#resources)
- [Authorization](#authorization)
- [Usage](#usage)
- [FAQ](https://www.api2pdf.com/faq)


## <a name="installation"></a>Installation

    npm install --save api2pdf

## <a name="resources"></a>Resources

Resources this API supports:

- [wkhtmltopdf](#wkhtmltopdf)
- [Headless Chrome](#chrome)
- [LibreOffice](#libreoffice)
- [Merge / Concatenate PDFs](#merge)
- [Helper Methods](#helpers)

## <a name="authorization"></a>Authorization

### Acquire API Key

Create an account at [portal.api2pdf.com](https://portal.api2pdf.com/register) to get your API key.
    
## <a name="#usage"></a>Usage

### Initialize the Client

All usage starts by requiring api2pdf and creating a new object.

    var Api2Pdf = require('api2pdf');   
    var a2pClient = new Api2Pdf('YOUR-API-KEY');

Once you initialize the client, you can make calls like so:

```
a2pClient.headlessChromeFromUrl('https://www.github.com')
    .then(function(result) {
        console.log(result); //successful api call
    }, function(rejected) {
        console.log(rejected); //an error occurred
    }
);
```
    
### Successful Result Format

    {
	    'pdf': 'https://link-to-pdf-only-available-for-24-hours',
	    'mbIn': 0.08421039581298828,
	    'mbOut': 0.08830547332763672,
	    'cost': 0.00017251586914062501,
	    'success': true,
	    'error': null,
	    'responseId': '6e46637a-650d-46d5-af0b-3d7831baccbb'
    }
    
### Failed Result Format

    {
	    'success': false,
	    'error': 'some reason for the error',
	    'responseId': '6e46637a-650d-46d5-af0b-3d7831baccbb'
    }
    
## <a name="wkhtmltopdf"></a> wkhtmltopdf

**Convert HTML to PDF**

```
a2pClient.wkhtmltopdfFromHtml('<p>Hello, World</p>').then(function(result) {
    console.log(result);
});
```    

**Convert HTML to PDF (load PDF in browser window and specify a file name)**

```
a2pClient.wkhtmltopdfFromHtml('<p>Hello, World</p>', inline = true, filename = 'test.pdf').then(function(result) {
    console.log(result);
});
```
    
**Convert HTML to PDF (use object for advanced wkhtmltopdf settings)**
[View full list of wkhtmltopdf options available.](https://www.api2pdf.com/documentation/advanced-options-wkhtmltopdf/)

```
var options = { orientation: 'landscape', pageSize: 'A4'};
a2pClient.wkhtmltopdfFromHtml('<p>Hello, World</p>', inline = true, filename = 'test.pdf', options = options).then(function(result) {
    console.log(result);
});
```

**Convert URL to PDF**

```
a2pClient.wkhtmltopdfFromUrl('https://www.github.com').then(function(result) {
    console.log(result);
});
```
    
**Convert URL to PDF (load PDF in browser window and specify a file name)**

```
a2pClient.wkhtmltopdfFromUrl('https://www.github.com', inline = true, filename = 'test.pdf').then(function(result) {
    console.log(result);
});
```
    
**Convert URL to PDF (use object for advanced wkhtmltopdf settings)**
[View full list of wkhtmltopdf options available.](https://www.api2pdf.com/documentation/advanced-options-wkhtmltopdf/)

```
var options = { orientation: 'landscape', pageSize: 'A4'};
a2pClient.wkhtmltopdfFromUrl('https://www.github.com', inline = true, filename = 'test.pdf', options = options).then(function(result) {
    console.log(result);
});
```

---

## <a name="chrome"></a>Headless Chrome

**Convert HTML to PDF**

```
a2pClient.headlessChromeFromHtml('<p>Hello, World</p>').then(function(result) {
    console.log(result);
});
``` 
    
**Convert HTML to PDF (load PDF in browser window and specify a file name)**

```
a2pClient.headlessChromeFromHtml('<p>Hello, World</p>', inline = true, filename = 'test.pdf').then(function(result) {
    console.log(result);
});
``` 
    
**Convert HTML to PDF (use options for advanced Headless Chrome settings)**
[View full list of Headless Chrome options available.](https://www.api2pdf.com/documentation/advanced-options-headless-chrome/)

```
var options = { landscape: true };
a2pClient.headlessChromeFromHtml('<p>Hello, World</p>', inline = true, filename = 'test.pdf', options = options).then(function(result) {
    console.log(result);
});
```

**Convert URL to PDF**

```
a2pClient.headlessChromeFromUrl('https://www.github.com').then(function(result) {
    console.log(result);
});
``` 
    
**Convert URL to PDF (load PDF in browser window and specify a file name)**

```
a2pClient.headlessChromeFromUrl('https://www.github.com', inline = true, filename = 'test.pdf').then(function(result) {
    console.log(result);
});
``` 
    
**Convert URL to PDF (use keyword arguments for advanced Headless Chrome settings)**
[View full list of Headless Chrome options available.](https://www.api2pdf.com/documentation/advanced-options-headless-chrome/)

```
var options = { landscape: true };
a2pClient.headlessChromeFromUrl('https://www.github.com', inline = true, filename = 'test.pdf', options = options).then(function(result) {
    console.log(result);
});
```
    
---

## <a name="libreoffice"></a>LibreOffice

LibreOffice supports the conversion to PDF from the following file formats:

- doc, docx, xls, xlsx, ppt, pptx, gif, jpg, png, bmp, rtf, txt, html

You must provide a url to the file. Our engine will consume the file at that URL and convert it to the PDF.

**Convert Microsoft Office Document or Image to PDF**

```
a2pClient.libreofficeConvert('https://www.api2pdf.com/wp-content/themes/api2pdf/assets/samples/sample-word-doc.docx').then(function(result) {
    console.log(result);
});
``` 
    
**Convert Microsoft Office Document or Image to PDF (load PDF in browser window and specify a file name)**

```
a2pClient.libreofficeConvert('https://www.api2pdf.com/wp-content/themes/api2pdf/assets/samples/sample-word-doc.docx', inline = true, filename = 'test.pdf').then(function(result) {
    console.log(result);
});
```
    
---
    
## <a name="merge"></a>Merge / Concatenate Two or More PDFs

To use the merge endpoint, supply a list of urls to existing PDFs. The engine will consume all of the PDFs and merge them into a single PDF, in the order in which they were provided in the list.

**Merge PDFs from list of URLs to existing PDFs**

```
var urls = ['url-to-pdf1', 'url-to-pdf2'];
a2pClient.merge(urls).then(function(result) {
    console.log(result);
});
``` 

**Merge PDFs from list of URLs to existing PDFs (load PDF in browser window and specify a file name)**

```
var urls = ['url-to-pdf1', 'url-to-pdf2'];
a2pClient.merge(urls, inline = true, filename = 'test.pdf').then(function(result) {
    console.log(result);
});
``` 
---

## <a name="helpers"></a>Helper Methods

**Delete a PDF on Command with delete(responseId)**

By default, Api2Pdf will automatically delete your PDFs after 24 hours. If you have higher security requirements and need to delete the PDFs at-will, you can do so by calling the `delete(responseId)` method on the Api2Pdf object where `responseId` parameter comes from the responseId attribute in the result.

```
a2pClient.headlessChromeFromHtml('<p>Hello, World</p>').then(function(result) {
    console.log(result);
    a2pClient.delete(result.responseId); //delete pdf by using responseId attribute
});
```