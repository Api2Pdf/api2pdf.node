# api2pdf.node
Nodejs client for [Api2Pdf REST API](https://www.api2pdf.com/documentation/v2) 

Api2Pdf.com is a powerful REST API for instantly generating PDF and Office documents from HTML, URLs, Microsoft Office Documents (Word, Excel, PPT), Email files, and images. You can generate image preview or thumbnail of a PDF, office document, or email file. The API also supports merge / concatenation of two or more PDFs, setting passwords on PDFs, and adding bookmarks to PDFs. Api2Pdf is a wrapper for popular libraries such as **wkhtmltopdf**, **Headless Chrome**, **PdfSharp**, and **LibreOffice**.

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
a2pClient.chromeUrlToPdf('https://www.github.com')
    .then(function(result) {
        console.log(result); //successful api call
    }, function(rejected) {
        console.log(rejected); //an error occurred
    }
);
```
    
### Successful Result Format

    {
	    'FileUrl': 'https://link-to-file-only-available-for-24-hours',
	    'MbOut': 0.08830547332763672,
	    'Cost': 0.00017251586914062501,
	    'Success': true,
	    'Error': null,
	    'ResponseId': '6e46637a-650d-46d5-af0b-3d7831baccbb'
    }
    
### Failed Result Format

    {
	    'Success': false,
	    'Error': 'some reason for the error',
	    'ResponseId': '6e46637a-650d-46d5-af0b-3d7831baccbb'
    }
    
## <a name="wkhtmltopdf"></a> wkhtmltopdf

**Convert HTML to PDF**

```
a2pClient.wkHtmlToPdf('<p>Hello, World</p>').then(function(result) {
    console.log(result);
});
```    

**Convert HTML to PDF (download PDF as a file and specify a file name)**

```
a2pClient.wkHtmlToPdf('<p>Hello, World</p>', { inline: false, filename: 'test.pdf' }).then(function(result) {
    console.log(result);
});
```
    
**Convert HTML to PDF (use object for advanced wkhtmltopdf settings)**
[View full list of wkhtmltopdf options available.](https://www.api2pdf.com/documentation/advanced-options-wkhtmltopdf/)

```
var options = { orientation: 'landscape', pageSize: 'A4'};
a2pClient.wkHtmlToPdf('<p>Hello, World</p>', { options: options }).then(function(result) {
    console.log(result);
});
```

**Convert URL to PDF**

```
a2pClient.wkUrlToPdf('https://www.github.com').then(function(result) {
    console.log(result);
});
```
    
**Convert URL to PDF (download PDF as a file and specify a file name)**

```
a2pClient.wkUrlToPdf('https://www.github.com', { inline: false, filename: 'test.pdf' }).then(function(result) {
    console.log(result);
});
```
    
**Convert URL to PDF (use object for advanced wkhtmltopdf settings)**
[View full list of wkhtmltopdf options available.](https://www.api2pdf.com/documentation/advanced-options-wkhtmltopdf/)

```
var options = { orientation: 'landscape', pageSize: 'A4'};
a2pClient.wkUrlToPdf('https://www.github.com', { options: options }).then(function(result) {
    console.log(result);
});
```

---

## <a name="chrome"></a>Headless Chrome

**Convert HTML to PDF**

```
a2pClient.chromeHtmlToPdf('<p>Hello, World</p>').then(function(result) {
    console.log(result);
});
``` 
    
**Convert HTML to PDF (download PDF as a file and specify a file name)**

```
a2pClient.chromeHtmlToPdf('<p>Hello, World</p>', { inline: false, filename: 'test.pdf' }).then(function(result) {
    console.log(result);
});
``` 
    
**Convert HTML to PDF (use options for advanced Headless Chrome settings)**
[View full list of Headless Chrome options available.](https://www.api2pdf.com/documentation/advanced-options-headless-chrome/)

```
var options = { landscape: true };
a2pClient.chromeHtmlToPdf('<p>Hello, World</p>', { options: options }).then(function(result) {
    console.log(result);
});
```

**Convert URL to PDF**

```
a2pClient.chromeUrlToPdf('https://www.github.com').then(function(result) {
    console.log(result);
});
``` 
    
**Convert URL to PDF (download PDF as a file and specify a file name)**

```
a2pClient.chromeUrlToPdf('https://www.github.com', { inline: false, filename: 'test.pdf' }).then(function(result) {
    console.log(result);
});
``` 
    
**Convert URL to PDF (use keyword arguments for advanced Headless Chrome settings)**
[View full list of Headless Chrome options available.](https://www.api2pdf.com/documentation/advanced-options-headless-chrome/)

```
var options = { landscape: true };
a2pClient.chromeUrlToPdf('https://www.github.com', { options: options }).then(function(result) {
    console.log(result);
});
```
    
**Convert HTML to Image**

```
a2pClient.chromeHtmlToImage('<p>Hello, World</p>').then(function(result) {
    console.log(result);
});
``` 

**Convert URL to Image**

```
a2pClient.chromeUrlToImage('https://www.github.com').then(function(result) {
    console.log(result);
});
``` 
---

## <a name="libreoffice"></a>LibreOffice

Convert any office file to PDF, image file to PDF, email file to PDF, HTML to Word, HTML to Excel, and PDF to HTML. Any file that can be reasonably opened by LibreOffice should be convertible. Additionally, we have an endpoint for generating a *thumbnail* of the first page of your PDF or Office Document. This is great for generating an image preview of your files to users.

You must provide a url to the file. Our engine will consume the file at that URL and convert it.

**Convert Microsoft Office Document or Image to PDF**

```
a2pClient.libreOfficeAnyToPdf('https://www.api2pdf.com/wp-content/themes/api2pdf/assets/samples/sample-word-doc.docx').then(function(result) {
    console.log(result);
});
``` 
    
**Convert Microsoft Office Document or Image to PDF (download PDF as a file and specify a file name)**

```
a2pClient.libreOfficeAnyToPdf('https://www.api2pdf.com/wp-content/themes/api2pdf/assets/samples/sample-word-doc.docx', { inline: false, filename: 'test.pdf' }).then(function(result) {
    console.log(result);
});
```

**Thumbnail or Image Preview of a PDF or Office Document or Email file**

```
a2pClient.libreOfficeThumbnail('https://www.api2pdf.com/wp-content/themes/api2pdf/assets/samples/sample-word-doc.docx').then(function(result) {
    console.log(result);
});
``` 

**Convert HTML to Microsoft Word or Docx**

```
a2pClient.libreOfficeHtmlToDocx('http://www.api2pdf.com/wp-content/uploads/2021/01/sampleHtml.html').then(function(result) {
    console.log(result);
});
``` 

**Convert HTML to Microsoft Excel or Xlsx**

```
a2pClient.libreOfficeHtmlToXlsx('http://www.api2pdf.com/wp-content/uploads/2021/01/sampleTables.html').then(function(result) {
    console.log(result);
});
``` 

**Convert PDF to HTML**

```
a2pClient.libreOfficePdfToHtml('http://www.api2pdf.com/wp-content/uploads/2021/01/1a082b03-2bd6-4703-989d-0443a88e3b0f-4.pdf').then(function(result) {
    console.log(result);
});
``` 
    
---
    
## <a name="merge"></a>PdfSharp - Merge / Concatenate Two or More PDFs, Add bookmarks to pdfs, add passwords to pdfs

To use the merge endpoint, supply a list of urls to existing PDFs. The engine will consume all of the PDFs and merge them into a single PDF, in the order in which they were provided in the list.

**Merge PDFs from list of URLs to existing PDFs**

```
var urls = ['url-to-pdf1', 'url-to-pdf2'];
a2pClient.pdfsharpMerge(urls).then(function(result) {
    console.log(result);
});
``` 

**Add bookmarks to existing PDF**

```
var url = 'https://LINK-TO-PDF';
var bookmarks = [
    { Page: 0, Title: "Introduction"},
    { Page: 1, Title: "Second page"}
]
a2pClient.pdfsharpAddBookmarks(url, bookmarks).then(function(result) {
    console.log(result);
});
``` 

**Add password to existing PDF**
```
var url = 'https://LINK-TO-PDF';
var userpassword = "hello";
a2pClient.pdfsharpAddPassword(url, userpassword).then(function(result) {
    console.log(result);
});
``` 

**Compress existing PDF**
```
var url = 'https://LINK-TO-PDF';
a2pClient.pdfsharpCompress(url).then(function(result) {
    console.log(result);
});
``` 

**Extract pages from existing PDF**
```
var url = 'https://LINK-TO-PDF';
var start = "2";
var end = null;
a2pClient.pdfsharpExtractPages(url, start, end).then(function(result) {
    console.log(result);
});
``` 

---

## <a name="helpers"></a>Helper Methods

**Delete a PDF on Command with delete(responseId)**

By default, Api2Pdf will delete your generated file 24 hours after it has been generated. For those with high security needs, you may want to delete your file on command. You can do so by making an DELETE api call with the `responseId` attribute that was returned on the original JSON payload.

```
var responseId = result.ResponseId //from previous api call
a2pClient.utilityDelete(responseId);
```
