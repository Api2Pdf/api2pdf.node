declare namespace Api2Pdf {
  interface BaseRequestOptions {
    inline?: boolean
    inlinePdf?: boolean
    filename?: string
    fileName?: string
    options?: Record<string, unknown>
    useCustomStorage?: boolean
    storage?: StorageOptions
    enableToc?: boolean
    tocOptions?: Record<string, unknown>
    extraHTTPHeaders?: Record<string, string>
    outputBinary?: boolean
  }

  interface StorageOptions {
    method: string
    url: string
    extraHTTPHeaders?: Record<string, string>
  }

  interface ZebraOptions {
    height?: number
    width?: number
    showLabel?: boolean
    outputBinary?: boolean
  }

  interface ZipFileInfo {
    url: string
    fileName: string
  }

  interface Api2PdfResult {
    FileUrl?: string
    fileUrl?: string
    MbOut?: number
    mbOut?: number
    Cost?: number
    cost?: number
    Seconds?: number
    seconds?: number
    Success?: boolean
    success?: boolean
    Error?: string | null
    error?: string | null
    ResponseId?: string
    responseId?: string
    [key: string]: unknown
  }

  type JsonOrBinaryResponse = Api2PdfResult | Buffer

  interface BaseUrlsMap {
    V2: string
    V2Xl: string
  }
}

declare class Api2Pdf {
  static readonly BaseUrls: Api2Pdf.BaseUrlsMap

  constructor(apiKey: string, hostname?: string, port?: number | boolean, verbose?: boolean)

  chromeUrlToPdf(url: string, options?: Api2Pdf.BaseRequestOptions | null): Promise<Api2Pdf.JsonOrBinaryResponse>
  chromeHtmlToPdf(html: string, options?: Api2Pdf.BaseRequestOptions | null): Promise<Api2Pdf.JsonOrBinaryResponse>
  chromeMarkdownToPdf(markdown: string, options?: Api2Pdf.BaseRequestOptions | null): Promise<Api2Pdf.JsonOrBinaryResponse>
  chromeUrlToImage(url: string, options?: Api2Pdf.BaseRequestOptions | null): Promise<Api2Pdf.JsonOrBinaryResponse>
  chromeHtmlToImage(html: string, options?: Api2Pdf.BaseRequestOptions | null): Promise<Api2Pdf.JsonOrBinaryResponse>
  chromeMarkdownToImage(markdown: string, options?: Api2Pdf.BaseRequestOptions | null): Promise<Api2Pdf.JsonOrBinaryResponse>

  wkUrlToPdf(url: string, options?: Api2Pdf.BaseRequestOptions | null): Promise<Api2Pdf.JsonOrBinaryResponse>
  wkHtmlToPdf(html: string, options?: Api2Pdf.BaseRequestOptions | null): Promise<Api2Pdf.JsonOrBinaryResponse>

  libreOfficeAnyToPdf(url: string, options?: Api2Pdf.BaseRequestOptions | null): Promise<Api2Pdf.JsonOrBinaryResponse>
  libreOfficeThumbnail(url: string, options?: Api2Pdf.BaseRequestOptions | null): Promise<Api2Pdf.JsonOrBinaryResponse>
  libreOfficePdfToHtml(url: string, options?: Api2Pdf.BaseRequestOptions | null): Promise<Api2Pdf.JsonOrBinaryResponse>
  libreOfficeHtmlToDocx(htmlOrUrl: string, options?: Api2Pdf.BaseRequestOptions | null): Promise<Api2Pdf.JsonOrBinaryResponse>
  libreOfficeHtmlToXlsx(htmlOrUrl: string, options?: Api2Pdf.BaseRequestOptions | null): Promise<Api2Pdf.JsonOrBinaryResponse>

  markitdownToMarkdown(url: string, options?: Api2Pdf.BaseRequestOptions | null): Promise<Api2Pdf.JsonOrBinaryResponse>

  openDataLoaderPdfToJson(url: string, options?: Api2Pdf.BaseRequestOptions | null): Promise<Api2Pdf.JsonOrBinaryResponse>
  openDataLoaderPdfToMarkdown(url: string, options?: Api2Pdf.BaseRequestOptions | null): Promise<Api2Pdf.JsonOrBinaryResponse>
  openDataLoaderPdfToHtml(url: string, options?: Api2Pdf.BaseRequestOptions | null): Promise<Api2Pdf.JsonOrBinaryResponse>

  pdfsharpMerge(urls: string[], options?: Api2Pdf.BaseRequestOptions | null): Promise<Api2Pdf.JsonOrBinaryResponse>
  pdfsharpCompress(url: string, options?: Api2Pdf.BaseRequestOptions | null): Promise<Api2Pdf.JsonOrBinaryResponse>
  pdfsharpExtractPages(url: string, start?: number | null, end?: number | null, options?: Api2Pdf.BaseRequestOptions | null): Promise<Api2Pdf.JsonOrBinaryResponse>
  pdfsharpAddBookmarks(url: string, bookmarks: Array<Record<string, unknown>>, options?: Api2Pdf.BaseRequestOptions | null): Promise<Api2Pdf.JsonOrBinaryResponse>
  pdfsharpAddPassword(url: string, userpassword: string, options?: Api2Pdf.BaseRequestOptions | null): Promise<Api2Pdf.JsonOrBinaryResponse>
  pdfsharpAddPassword(url: string, userpassword: string, ownerpassword: string, options?: Api2Pdf.BaseRequestOptions | null): Promise<Api2Pdf.JsonOrBinaryResponse>

  zipGenerate(files: Api2Pdf.ZipFileInfo[], options?: Api2Pdf.BaseRequestOptions | null): Promise<Api2Pdf.JsonOrBinaryResponse>
  zipFiles(files: Api2Pdf.ZipFileInfo[], options?: Api2Pdf.BaseRequestOptions | null): Promise<Api2Pdf.JsonOrBinaryResponse>

  zebraGenerateBarcode(format: string, value: string, options?: Api2Pdf.ZebraOptions | null): Promise<Api2Pdf.JsonOrBinaryResponse>
  zebraGenerate(format: string, value: string, options?: Api2Pdf.ZebraOptions | null): Promise<Api2Pdf.JsonOrBinaryResponse>

  utilityDelete(responseId: string): Promise<Api2Pdf.Api2PdfResult | string | null>
  utilityStatus(): Promise<string | Buffer | null>
  utilityBalance(): Promise<string | Buffer | null>
}

export = Api2Pdf
