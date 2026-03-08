"use strict"

const http = require("node:http")
const https = require("node:https")

const BASE_URLS = Object.freeze({
  V2: "https://v2.api2pdf.com",
  V2Xl: "https://v2-xl.api2pdf.com"
})

function defaultPort(protocol) {
  return protocol === "http:" ? 80 : 443
}

function looksLikeUrl(value) {
  return typeof value === "string" && /^https?:\/\//i.test(value)
}

function normalizeConfig(hostnameOrBaseUrl, port, verbose) {
  let resolvedVerbose = verbose
  let resolvedPort = port

  if (typeof resolvedPort === "boolean" && resolvedVerbose === false) {
    resolvedVerbose = resolvedPort
    resolvedPort = undefined
  }

  if (looksLikeUrl(hostnameOrBaseUrl)) {
    const baseUrl = new URL(hostnameOrBaseUrl)
    return {
      protocol: baseUrl.protocol,
      hostname: baseUrl.hostname,
      port: baseUrl.port ? Number(baseUrl.port) : defaultPort(baseUrl.protocol),
      basePath: baseUrl.pathname.replace(/\/$/, ""),
      verbose: resolvedVerbose
    }
  }

  return {
    protocol: "https:",
    hostname: hostnameOrBaseUrl || "v2.api2pdf.com",
    port: resolvedPort == null ? 443 : resolvedPort,
    basePath: "",
    verbose: resolvedVerbose
  }
}

function buildQueryString(query) {
  const searchParams = new URLSearchParams()

  Object.entries(query || {}).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return
    }

    if (Array.isArray(value)) {
      value.forEach(item => searchParams.append(key, String(item)))
      return
    }

    searchParams.append(key, String(value))
  })

  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ""
}

function shouldParseJson(contentType, buffer) {
  if (contentType.includes("application/json") || contentType.includes("text/json")) {
    return true
  }

  const trimmed = buffer.toString("utf8").trim()
  return trimmed.startsWith("{") || trimmed.startsWith("[")
}

function isFailureResponse(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return false
  }

  if ("Success" in body) {
    return body.Success === false
  }

  if ("success" in body) {
    return body.success === false
  }

  return false
}

module.exports = class Api2Pdf {
  static get BaseUrls() {
    return BASE_URLS
  }

  constructor(apiKey, hostname = "v2.api2pdf.com", port = 443, verbose = false) {
    const config = normalizeConfig(hostname, port, verbose)

    this.apiKey = apiKey
    this.protocol = config.protocol
    this.hostname = config.hostname
    this.port = config.port
    this.basePath = config.basePath
    this.verbose = config.verbose
    this._requestTransport = this.protocol === "http:" ? http : https
  }

  chromeUrlToPdf(url, options = null) {
    return this._post("/chrome/pdf/url", { url }, options)
  }

  chromeHtmlToPdf(html, options = null) {
    return this._post("/chrome/pdf/html", { html }, options)
  }

  chromeMarkdownToPdf(markdown, options = null) {
    return this._post("/chrome/pdf/markdown", { markdown }, options)
  }

  chromeUrlToImage(url, options = null) {
    return this._post("/chrome/image/url", { url }, options)
  }

  chromeHtmlToImage(html, options = null) {
    return this._post("/chrome/image/html", { html }, options)
  }

  chromeMarkdownToImage(markdown, options = null) {
    return this._post("/chrome/image/markdown", { markdown }, options)
  }

  wkUrlToPdf(url, options = null) {
    return this._post("/wkhtml/pdf/url", { url }, options)
  }

  wkHtmlToPdf(html, options = null) {
    return this._post("/wkhtml/pdf/html", { html }, options)
  }

  libreOfficeAnyToPdf(url, options = null) {
    return this._post("/libreoffice/any-to-pdf", { url }, options)
  }

  libreOfficeThumbnail(url, options = null) {
    return this._post("/libreoffice/thumbnail", { url }, options)
  }

  libreOfficePdfToHtml(url, options = null) {
    return this._post("/libreoffice/pdf-to-html", { url }, options)
  }

  libreOfficeHtmlToDocx(htmlOrUrl, options = null) {
    return this._post("/libreoffice/html-to-docx", this._htmlOrUrlPayload(htmlOrUrl), options)
  }

  libreOfficeHtmlToXlsx(htmlOrUrl, options = null) {
    return this._post("/libreoffice/html-to-xlsx", this._htmlOrUrlPayload(htmlOrUrl), options)
  }

  markitdownToMarkdown(url, options = null) {
    return this._post("/markitdown", { url }, options)
  }

  openDataLoaderPdfToJson(url, options = null) {
    return this._post("/opendataloader/json", { url }, options)
  }

  openDataLoaderPdfToMarkdown(url, options = null) {
    return this._post("/opendataloader/markdown", { url }, options)
  }

  openDataLoaderPdfToHtml(url, options = null) {
    return this._post("/opendataloader/html", { url }, options)
  }

  pdfsharpMerge(urls, options = null) {
    return this._post("/pdfsharp/merge", { urls }, options)
  }

  pdfsharpCompress(url, options = null) {
    return this._post("/pdfsharp/compress", { url }, options)
  }

  pdfsharpExtractPages(url, start = null, end = null, options = null) {
    const payload = { url }

    if (start != null) {
      payload.start = start
    }

    if (end != null) {
      payload.end = end
    }

    return this._post("/pdfsharp/extract-pages", payload, options)
  }

  pdfsharpAddBookmarks(url, bookmarks, options = null) {
    return this._post("/pdfsharp/bookmarks", { url, bookmarks }, options)
  }

  pdfsharpAddPassword(url, userpassword, ownerpasswordOrOptions = null, options = null) {
    let ownerpassword = ownerpasswordOrOptions
    let requestOptions = options

    if (this._looksLikeOptions(ownerpasswordOrOptions) && options == null) {
      ownerpassword = null
      requestOptions = ownerpasswordOrOptions
    }

    const payload = { url, userpassword }

    if (ownerpassword != null) {
      payload.ownerpassword = ownerpassword
    }

    return this._post("/pdfsharp/password", payload, requestOptions)
  }

  zipGenerate(files, options = null) {
    return this._post("/zip", { files }, options, { defaultOutputBinary: true })
  }

  zipFiles(files, options = null) {
    return this.zipGenerate(files, options)
  }

  zebraGenerateBarcode(format, value, options = null) {
    const requestOptions = options || {}
    return this._request("/zebra", {
      method: "GET",
      query: {
        format,
        value,
        height: requestOptions.height,
        width: requestOptions.width,
        showlabel: requestOptions.showLabel,
        outputBinary: this._resolveOutputBinary(requestOptions, true)
      }
    })
  }

  zebraGenerate(format, value, options = null) {
    return this.zebraGenerateBarcode(format, value, options)
  }

  utilityDelete(responseId) {
    return this._request(`/file/${encodeURIComponent(responseId)}`, { method: "DELETE" })
  }

  utilityStatus() {
    return this._request("/status", { method: "GET" })
  }

  utilityBalance() {
    return this._request("/balance", { method: "GET" })
  }

  _htmlOrUrlPayload(htmlOrUrl) {
    if (looksLikeUrl(htmlOrUrl)) {
      return { url: htmlOrUrl }
    }

    return { html: htmlOrUrl }
  }

  _post(endpoint, payloadFields, options, config = {}) {
    return this._request(endpoint, {
      method: "POST",
      payload: {
        ...this._createBaseOptions(options),
        ...payloadFields
      },
      query: this._createQueryOptions(options, config.defaultOutputBinary)
    })
  }

  _createBaseOptions(options) {
    if (options == null) {
      return { inline: true }
    }

    const requestOptions = {}

    requestOptions.inline = "inline" in options ? options.inline : true

    if ("inlinePdf" in options) {
      requestOptions.inlinePdf = options.inlinePdf
    }

    if ("filename" in options) {
      requestOptions.fileName = options.filename
    } else if ("fileName" in options) {
      requestOptions.fileName = options.fileName
    }

    if ("options" in options) {
      requestOptions.options = options.options
    }

    if ("useCustomStorage" in options) {
      requestOptions.useCustomStorage = options.useCustomStorage
    }

    if ("storage" in options) {
      requestOptions.storage = options.storage
    }

    if ("enableToc" in options) {
      requestOptions.enableToc = options.enableToc
    }

    if ("tocOptions" in options) {
      requestOptions.tocOptions = options.tocOptions
    }

    if ("extraHTTPHeaders" in options) {
      requestOptions.extraHTTPHeaders = options.extraHTTPHeaders
    }

    return requestOptions
  }

  _createQueryOptions(options, defaultOutputBinary) {
    return {
      outputBinary: this._resolveOutputBinary(options, defaultOutputBinary)
    }
  }

  _resolveOutputBinary(options, defaultValue) {
    if (options && "outputBinary" in options) {
      return options.outputBinary
    }

    return defaultValue
  }

  _looksLikeOptions(value) {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value)
  }

  _request(endpoint, requestConfig) {
    const path = `${this.basePath}${endpoint}${buildQueryString(requestConfig.query)}`
    const payload = requestConfig.payload == null ? null : JSON.stringify(requestConfig.payload)
    const headers = {
      Authorization: this.apiKey
    }

    if (payload != null) {
      headers["Content-Type"] = "application/json"
      headers["Content-Length"] = Buffer.byteLength(payload)
    }

    if (this.verbose) {
      console.log(`[Api2Pdf] ${requestConfig.method} ${path}`)
      if (payload != null) {
        console.log(payload)
      }
    }

    return new Promise((resolve, reject) => {
      const req = this._requestTransport.request(
        {
          protocol: this.protocol,
          hostname: this.hostname,
          port: this.port,
          path,
          method: requestConfig.method,
          headers
        },
        res => {
          const chunks = []

          res.on("data", chunk => {
            chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
          })

          res.on("end", () => {
            const buffer = Buffer.concat(chunks)
            const contentType = String(res.headers["content-type"] || "").toLowerCase()

            if (this.verbose) {
              console.log(`[Api2Pdf] statusCode=${res.statusCode}`)
            }

            try {
              if (buffer.length === 0) {
                resolve(null)
                return
              }

              if (shouldParseJson(contentType, buffer)) {
                const body = JSON.parse(buffer.toString("utf8"))

                if (isFailureResponse(body)) {
                  reject(body)
                  return
                }

                resolve(body)
                return
              }

              if (contentType.startsWith("text/")) {
                resolve(buffer.toString("utf8"))
                return
              }

              resolve(buffer)
            } catch (error) {
              reject(error)
            }
          })
        }
      )

      req.on("error", error => {
        reject(error)
      })

      if (payload != null) {
        req.write(payload)
      }

      req.end()
    })
  }
}
