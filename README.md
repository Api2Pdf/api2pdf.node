# api2pdf.node

Node.js bindings for the [Api2Pdf REST API](https://v2.api2pdf.com).

Api2Pdf.com is a powerful REST API for document generation, file conversion, and automated content extraction in Node.js applications. It supports HTML to PDF, URL to PDF, HTML to image, URL to image, Microsoft Office document conversion, email and image file conversion, PDF page extraction, PDF password protection, file zipping, barcode and QR code generation, markdown conversion, structured PDF data extraction, and image previews or thumbnails for PDF, office, and email files. Api2Pdf is built on proven engines and libraries including wkhtmltopdf, Headless Chrome, PdfSharp, LibreOffice, and related tools to provide reliable PDF generation, document processing, and file transformation workflows through a single API.

The package preserves the classic flat method names from earlier `api2pdf.node` releases while expanding coverage to the current Api2Pdf Swagger v2 surface.

## Installation

```bash
npm install api2pdf
```

## Quick Start

Create an account at [portal.api2pdf.com](https://portal.api2pdf.com/register) to get your API key.

```js
const Api2Pdf = require("api2pdf")

async function run() {
  const client = new Api2Pdf("YOUR-API-KEY")

  const result = await client.chromeHtmlToPdf("<html><body><h1>Hello, world!</h1></body></html>")

  if (result.Success) {
    console.log(result.FileUrl)
  } else {
    console.log(result.Error)
  }
}

run().catch(console.error)
```

## Custom Domains

The default constructor uses `https://v2.api2pdf.com`.

If you want to route requests to a different Api2Pdf domain, pass a full base URL:

```js
const Api2Pdf = require("api2pdf")

const client = new Api2Pdf("YOUR-API-KEY", "https://your-custom-domain.api2pdf.com")
```

The package also exposes constants for common base URLs:

```js
const Api2Pdf = require("api2pdf")

const client = new Api2Pdf("YOUR-API-KEY", Api2Pdf.BaseUrls.V2Xl)
```

`v2-xl.api2pdf.com` provides much larger compute resources and is intended for heavier workloads, with additional cost compared to the default cluster.

Legacy hostname and port construction still works:

```js
const client = new Api2Pdf("YOUR-API-KEY", "v2.api2pdf.com", 443)
```

## Understanding Responses

Most API methods return the standard Api2Pdf JSON payload unless you opt into binary output.

```json
{
  "FileUrl": "https://link-to-file-available-for-24-hours",
  "MbOut": 0.08830547332763672,
  "Cost": 0.00017251586914062501,
  "Success": true,
  "Error": null,
  "ResponseId": "6e46637a-650d-46d5-af0b-3d7831baccbb"
}
```

Important fields:

- `Success`: whether the request succeeded.
- `Error`: error text when the request fails.
- `FileUrl`: URL of the generated file when the API returns standard JSON.
- `ResponseId`: identifier used by `utilityDelete(...)`.

When `outputBinary: true` is supported and enabled, the method resolves to a Node.js `Buffer` instead of JSON.

## Common Request Features

Most flat methods accept an optional `options` object with these common properties:

- `filename`: set the output file name.
- `inline`: `true` to open in the browser, `false` to trigger download behavior.
- `useCustomStorage` and `storage`: send the output directly to your own storage target.
- `outputBinary`: when the endpoint supports it, request binary content instead of the standard JSON payload.
- `extraHTTPHeaders`: forward custom headers when Api2Pdf fetches a source URL.

Example custom storage configuration:

```js
const result = await client.chromeHtmlToPdf("<p>Hello World</p>", {
  useCustomStorage: true,
  storage: {
    method: "PUT",
    url: "https://your-presigned-upload-url"
  }
})
```

## Chrome

### HTML or URL to PDF

```js
const htmlPdf = await client.chromeHtmlToPdf("<p>Hello World</p>", {
  options: {
    delay: 3000,
    displayHeaderFooter: true,
    headerTemplate: "<div style=\"font-size:12px;\">Header</div>",
    footerTemplate: "<div style=\"font-size:12px;\">Footer</div>",
    landscape: true,
    preferCSSPageSize: true
  }
})

const urlPdf = await client.chromeUrlToPdf("https://www.api2pdf.com", {
  extraHTTPHeaders: {
    Authorization: "Bearer token-for-the-source-site"
  },
  options: {
    puppeteerWaitForMethod: "WaitForNavigation",
    puppeteerWaitForValue: "Load"
  }
})
```

### Markdown to PDF

```js
const result = await client.chromeMarkdownToPdf("# Invoice\n\nThis PDF was generated from markdown.")
```

### HTML, URL, or Markdown to Image

```js
const htmlImage = await client.chromeHtmlToImage("<p>Hello image</p>", {
  options: {
    fullPage: true,
    viewPortOptions: {
      width: 1440,
      height: 900
    }
  }
})

const urlImage = await client.chromeUrlToImage("https://www.api2pdf.com")

const markdownImage = await client.chromeMarkdownToImage("# Screenshot\n\nGenerated from markdown.")
```

## Wkhtmltopdf

```js
const htmlPdf = await client.wkHtmlToPdf("<p>Hello World</p>", {
  enableToc: true,
  options: {
    orientation: "landscape",
    pageSize: "Letter"
  },
  tocOptions: {
    disableDottedLines: "true"
  }
})

const urlPdf = await client.wkUrlToPdf("https://www.api2pdf.com")
```

For advanced wkhtmltopdf options, see the [Api2Pdf wkhtmltopdf documentation](https://www.api2pdf.com/documentation/advanced-options-wkhtmltopdf/).

## LibreOffice

Use LibreOffice endpoints for file and Office conversions.

Convert a file URL to PDF:

```js
const result = await client.libreOfficeAnyToPdf(
  "https://www.api2pdf.com/wp-content/themes/api2pdf/assets/samples/sample-word-doc.docx"
)
```

Generate a thumbnail:

```js
const result = await client.libreOfficeThumbnail(
  "https://www.api2pdf.com/wp-content/themes/api2pdf/assets/samples/sample-word-doc.docx"
)
```

Convert HTML or a URL to DOCX or XLSX:

```js
const docx = await client.libreOfficeHtmlToDocx("<html><body><h1>Hello Word</h1></body></html>")

const xlsx = await client.libreOfficeHtmlToXlsx("https://www.api2pdf.com/wp-content/uploads/2021/01/sampleTables.html")
```

For compatibility with earlier releases, the legacy `libreOfficePdfToHtml(...)` flat method is still available.

## Markitdown

Convert a file URL to markdown:

```js
const result = await client.markitdownToMarkdown("https://example.com/sample.docx")
```

## OpenDataLoader

Extract structured content from a PDF URL:

```js
const json = await client.openDataLoaderPdfToJson("https://example.com/sample.pdf")

const markdown = await client.openDataLoaderPdfToMarkdown("https://example.com/sample.pdf")

const html = await client.openDataLoaderPdfToHtml("https://example.com/sample.pdf")
```

## PdfSharp

Merge PDFs:

```js
const result = await client.pdfsharpMerge([
  "https://LINK-TO-PDF-1",
  "https://LINK-TO-PDF-2"
])
```

Set a password:

```js
const result = await client.pdfsharpAddPassword(
  "https://LINK-TO-PDF",
  "user-password",
  "owner-password"
)
```

Extract a page range:

```js
const result = await client.pdfsharpExtractPages(
  "https://LINK-TO-PDF",
  0,
  2
)
```

For backward compatibility, legacy flat methods such as `pdfsharpAddBookmarks(...)` and `pdfsharpCompress(...)` remain available.

## Zip

Create a zip from multiple files:

```js
const zipBuffer = await client.zipGenerate(
  [
    {
      url: "https://example.com/report.pdf",
      fileName: "docs/report.pdf"
    },
    {
      url: "https://example.com/image.png",
      fileName: "images/image.png"
    }
  ],
  {
    outputBinary: true
  }
)
```

`zipFiles(...)` is provided as an alias to `zipGenerate(...)`.

## Zebra

Generate a barcode or QR code:

```js
const imageBuffer = await client.zebraGenerateBarcode("QR_CODE", "https://www.api2pdf.com", {
  width: 300,
  height: 300,
  showLabel: false,
  outputBinary: true
})
```

`zebraGenerate(...)` is provided as an alias to `zebraGenerateBarcode(...)`.

For supported Zebra format values, see the [Api2Pdf Zebra documentation](https://www.api2pdf.com/documentation/advanced-options-zxing-zebra-crossing-barcodes/).

## Utilities

Delete a generated file:

```js
const pdf = await client.chromeHtmlToPdf("<p>Hello World</p>")

await client.utilityDelete(pdf.ResponseId)
```

Check status or remaining balance:

```js
const status = await client.utilityStatus()
const balance = await client.utilityBalance()
```

## Working With Files

Save binary output to disk:

```js
const fs = require("node:fs/promises")

const pdfBuffer = await client.chromeHtmlToPdf("<p>Hello World</p>", {
  outputBinary: true
})

await fs.writeFile("output.pdf", pdfBuffer)
```

Use JSON output when you want a hosted file URL instead:

```js
const result = await client.chromeHtmlToPdf("<p>Hello World</p>")
console.log(result.FileUrl)
```

## Development

The repo uses a lightweight CommonJS layout:

- `index.js` as the package entrypoint
- `src/` for the shipping library
- `test/` for regression and contract-style tests

Run the test suite with:

```bash
npm test
```

Preview the published package contents with:

```bash
npm run pack:check
```

## Resources

- [Api2Pdf documentation](https://v2.api2pdf.com)
- [Api2Pdf FAQ](https://www.api2pdf.com/faq)
