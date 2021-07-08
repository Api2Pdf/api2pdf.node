"use strict"

const https = require('https')

module.exports = class Api2Pdf {
  constructor(apiKey, hostname = "v2.api2pdf.com", port = 443, verbose = false) {
    this.apiKey = apiKey
    this.hostname = hostname
    this.port = port
    this.verbose = verbose
  }

  chromeUrlToPdf(url, inline = true, filename = null, options = null) {
    var payload = { url: url, inline: inline }
    if (filename != null) {
      payload['fileName'] = filename
    }
    if (options != null) {
      payload['options'] = options
    }
    return this._makeRequest("/chrome/pdf/url", payload)
  }

  chromeHtmlToPdf(html, inline = true, filename = null, options = null) {
    var payload = { html: html, inline: inline }
    if (filename != null) {
      payload['fileName'] = filename
    }
    if (options != null) {
      payload['options'] = options
    }
    return this._makeRequest("/chrome/pdf/html", payload)
  }

  chromeUrlToImage(url, filename = null, options = null) {
    var payload = { url: url, inline: inline }
    if (filename != null) {
      payload['fileName'] = filename
    }
    if (options != null) {
      payload['options'] = options
    }
    return this._makeRequest("/chrome/image/url", payload)
  }

  chromeHtmlToImage(html, filename = null, options = null) {
    var payload = { html: html, inline: inline }
    if (filename != null) {
      payload['fileName'] = filename
    }
    if (options != null) {
      payload['options'] = options
    }
    return this._makeRequest("/chrome/image/html", payload)
  }

  wkUrlToPdf(url, inline = true, filename = null, options = null) {
    var payload = { url: url, inline: inline }
    if (filename != null) {
      payload['fileName'] = filename
    }
    if (options != null) {
      payload['options'] = options
    }
    return this._makeRequest("/wkhtml/pdf/url", payload)
  }

  wkHtmlToPdf(html, inline = true, filename = null, options = null) {
    var payload = { html: html, inline: inline }
    if (filename != null) {
      payload['fileName'] = filename
    }
    if (options != null) {
      payload['options'] = options
    }
    return this._makeRequest("/wkhtml/pdf/html", payload)
  }

  libreOfficeAnyToPdf(url, inline = true, filename = null) {
    var payload = { url: url, inline: inline }
    if (filename != null) {
      payload['fileName'] = filename
    }
    return this._makeRequest("/libreoffice/any-to-pdf", payload)
  }

  libreOfficeThumbnail(url, inline = true, filename = null) {
    var payload = { url: url, inline: inline }
    if (filename != null) {
      payload['fileName'] = filename
    }
    return this._makeRequest("/libreoffice/thumbnail", payload)
  }

  libreOfficePdfToHtml(url, filename = null) {
    var payload = { url: url, inline: inline }
    if (filename != null) {
      payload['fileName'] = filename
    }
    return this._makeRequest("/libreoffice/pdf-to-html", payload)
  }

  libreOfficeHtmlToDocx(url, filename = null) {
    var payload = { url: url, inline: inline }
    if (filename != null) {
      payload['fileName'] = filename
    }
    return this._makeRequest("/libreoffice/html-to-docx", payload)
  }

  libreOfficeHtmlToXlsx(url, filename = null) {
    var payload = { url: url, inline: inline }
    if (filename != null) {
      payload['fileName'] = filename
    }
    return this._makeRequest("/libreoffice/html-to-xlsx", payload)
  }

  pdfsharpMerge(urls, filename = null) {
    var payload = { urls: urls, inline: inline }
    if (filename != null) {
      payload['fileName'] = filename
    }
    return this._makeRequest("/pdfsharp/merge", payload)
  }

  pdfsharpAddBookmarks(url, bookmarks, inline = true, filename = null) {
    var payload = { url: url, bookmarks: bookmarks, inline: inline }
    if (filename != null) {
      payload['fileName'] = filename
    }
    return this._makeRequest("/pdfsharp/bookmarks", payload)
  }

  pdfsharpAddPassword(url, userpassword, ownerpassword = null, inline = true, filename = null) {
    var payload = { url: url, userpassword: userpassword, inline: inline }
    if (ownerpassword != null) {
      payload['ownerpassword'] = ownerpassword
    }
    if (filename != null) {
      payload['fileName'] = filename
    }
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
