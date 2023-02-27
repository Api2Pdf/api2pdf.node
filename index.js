"use strict"

const https = require('https')

module.exports = class Api2Pdf {
  constructor(apiKey, hostname = "v2.api2pdf.com", port = 443, verbose = false) {
    this.apiKey = apiKey
    this.hostname = hostname
    this.port = port
    this.verbose = verbose
  }

  chromeUrlToPdf(url, options = null) {
    var payload = this._createBaseOptions(options)
    payload['url'] = url
    return this._makeRequest("/chrome/pdf/url", payload)
  }

  chromeHtmlToPdf(html, options = null) {
    var payload = this._createBaseOptions(options)
    payload['html'] = html
    return this._makeRequest("/chrome/pdf/html", payload)
  }

  chromeUrlToImage(url, options = null) {
    var payload = this._createBaseOptions(options)
    payload['url'] = url
    return this._makeRequest("/chrome/image/url", payload)
  }

  chromeHtmlToImage(html, options = null) {
    var payload = this._createBaseOptions(options)
    payload['html'] = html
    return this._makeRequest("/chrome/image/html", payload)
  }

  wkUrlToPdf(url, options = null) {
    var payload = this._createBaseOptions(options)
    payload['url'] = url
    return this._makeRequest("/wkhtml/pdf/url", payload)
  }

  wkHtmlToPdf(html, options = null) {
    var payload = this._createBaseOptions(options)
    payload['html'] = html
    return this._makeRequest("/wkhtml/pdf/html", payload)
  }

  libreOfficeAnyToPdf(url, options = null) {
    var payload = this._createBaseOptions(options)
    payload['url'] = url
    return this._makeRequest("/libreoffice/any-to-pdf", payload)
  }

  libreOfficeThumbnail(url, options = null) {
    var payload = this._createBaseOptions(options)
    payload['url'] = url
    return this._makeRequest("/libreoffice/thumbnail", payload)
  }

  libreOfficePdfToHtml(url, options = null) {
    var payload = this._createBaseOptions(options)
    payload['url'] = url
    return this._makeRequest("/libreoffice/pdf-to-html", payload)
  }

  libreOfficeHtmlToDocx(url, options = null) {
    var payload = this._createBaseOptions(options)
    payload['url'] = url
    return this._makeRequest("/libreoffice/html-to-docx", payload)
  }

  libreOfficeHtmlToXlsx(url, options = null) {
    var payload = this._createBaseOptions(options)
    payload['url'] = url
    return this._makeRequest("/libreoffice/html-to-xlsx", payload)
  }

  pdfsharpMerge(urls, options = null) {
    var payload = this._createBaseOptions(options)
    payload['urls'] = urls
    return this._makeRequest("/pdfsharp/merge", payload)
  }
  
  pdfsharpCompress(url, options = null) {
    var payload = this._createBaseOptions(options)
    payload['url'] = url
    return this._makeRequest("/pdfsharp/compress", payload)
  }

  pdfsharpExtractPages(url, start = null, end = null, options = null) {
    var payload = this._createBaseOptions(options)
    payload['url'] = url
    if (start != null) {
      payload['start'] = start
    }
    if (end != null) {
      payload['end'] = end
    }
  }

  pdfsharpAddBookmarks(url, bookmarks, options = null) {
    var payload = this._createBaseOptions(options)
    payload['url'] = url
    payload['bookmarks'] = bookmarks
    return this._makeRequest("/pdfsharp/bookmarks", payload)
  }

  pdfsharpAddPassword(url, userpassword, options = null) {
    var payload = this._createBaseOptions(options)
    payload['url'] = url
    payload['userpassword'] = userpassword
    return this._makeRequest("/pdfsharp/password", payload)
  }

  pdfsharpAddPassword(url, userpassword, ownerpassword, options = null) {
    var payload = this._createBaseOptions(options)
    payload['url'] = url
    payload['userpassword'] = userpassword
    payload['ownerpassword'] = ownerpassword
    return this._makeRequest("/pdfsharp/password", payload)
  }

  utilityDelete(responseId) {
    const options = {
      hostname: this.hostname,
      port: this.port,
      path: `/file/${responseId}`,
      method: "DELETE",
      headers: {
        'Authorization': this.apiKey
      }
    }

    const req = https.request(options, res => {
      if (this.verbose)
        console.log(`statusCode: ${res.statusCode}`)

      res.on('data', d => {})
    })

    req.on('error', error => {
      console.error(error)
    })

    req.end()
  }

  _createBaseOptions(options) {
    var newOptions = {}

    if (options == null)
      return { inline: true }
    
    if (!('inline' in options)) {
      newOptions['inline'] = true
    } else {
      newOptions['inline'] = options.inline
    }
  
    if ('filename' in options) {
      newOptions['fileName'] = options.filename
    }

    if ('options' in options) {
      newOptions['options'] = options.options
    }

    if ('useCustomStorage' in options) {
      newOptions['useCustomStorage'] = options.useCustomStorage
    }

    if ('storage' in options) {
      newOptions['storage'] = options.storage
    }

    if ('enableToc' in options) {
      newOptions['enableToc'] = options.enableToc
    }

    if ('tocOptions' in options) {
      newOptions['tocOptions'] = options.tocOptions
    }

    if ('extraHTTPHeaders' in options) {
      newOptions['extraHTTPHeaders'] = options.extraHTTPHeaders
    }

    return newOptions
  }

  _makeRequest(endpoint, payload, method = "POST") {
    var parent = this
    return new Promise(function(resolve, reject) {
      const data = JSON.stringify(payload)

      if (parent.verbose)
        console.log(data)

      const options = {
        hostname: parent.hostname,
        port: parent.port,
        path: endpoint,
        method: method,
        headers: {
          'Authorization': parent.apiKey,
          'Content-Type': 'application/json'
        }
      }
  
      const req = https.request(options, res => {
        if (parent.verbose)
          console.log(`statusCode: ${res.statusCode}`)
      
        var body
        res.on('data', d => {
          body = d
        })

        res.on('end', function() {
          try {
            body = JSON.parse(body);
            if (!body.Success) {
              reject(body)
            }
          } catch(e) {
              reject(e);
          }
          resolve(body);
        })
      })
  
      req.on('error', error => {
        reject(error)
      })
  
      req.write(data)
      req.end()
    })
  }
}
