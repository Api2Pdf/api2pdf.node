"use strict";

const API2PDF_BASE_ENDPOINT = "https://v2018.api2pdf.com";
const API2PDF_MERGE = API2PDF_BASE_ENDPOINT + "/merge";
const API2PDF_WKHTMLTOPDF_HTML = API2PDF_BASE_ENDPOINT + "/wkhtmltopdf/html";
const API2PDF_WKHTMLTOPDF_URL = API2PDF_BASE_ENDPOINT + "/wkhtmltopdf/url";
const API2PDF_CHROME_HTML = API2PDF_BASE_ENDPOINT + "/chrome/html";
const API2PDF_CHROME_URL = API2PDF_BASE_ENDPOINT + "/chrome/url";
const API2PDF_LIBREOFFICE_CONVERT = API2PDF_BASE_ENDPOINT + "/libreoffice/convert";

const request = require('request');

module.exports = class Api2Pdf {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  headlessChromeFromUrl(url, inline = false, filename = null, options = null) {
    var payload = { url: url, inlinePdf: inline };
    if (filename != null) {
      payload['fileName'] = filename;
    }
    if (options != null) {
      payload['options'] = options;
    }
    return this._makeRequest(API2PDF_CHROME_URL, payload);
  }

  headlessChromeFromHtml(html, inline = false, filename = null, options = null) {
    var payload = { html: html, inlinePdf: inline };
    if (filename != null) {
      payload['fileName'] = filename;
    }
    if (options != null) {
      payload['options'] = options;
    }
    return this._makeRequest(API2PDF_CHROME_HTML, payload);
  }

  wkhtmltopdfFromUrl(url, inline = false, filename = null, options = null) {
    var payload = { url: url, inlinePdf: inline };
    if (filename != null) {
      payload['fileName'] = filename;
    }
    if (options != null) {
      payload['options'] = options;
    }
    return this._makeRequest(API2PDF_WKHTMLTOPDF_URL, payload);
  }

  wkhtmltopdfFromHtml(html, inline = false, filename = null, options = null) {
    var payload = { html: html, inlinePdf: inline };
    if (filename != null) {
      payload['fileName'] = filename;
    }
    if (options != null) {
      payload['options'] = options;
    }
    return this._makeRequest(API2PDF_WKHTMLTOPDF_HTML, payload);
  }

  merge(urls, inline = false, filename = null) {
    var payload = { urls: urls, inlinePdf: inline };
    if (filename != null) {
      payload['fileName'] = filename;
    }
    return this._makeRequest(API2PDF_MERGE, payload);
  }

  libreofficeConvert(url, inline = false, filename = null) {
    var payload = { url: url, inlinePdf: inline };
    if (filename != null) {
      payload['fileName'] = filename;
    }
    return this._makeRequest(API2PDF_LIBREOFFICE_CONVERT, payload);
  }

    delete(responseId) {
    var endpoint = API2PDF_BASE_ENDPOINT + `/pdf/${responseId}`;
    return new Promise((resolve, reject) => {
      request.delete(endpoint, { headers: { Authorization: this.apiKey } }, function(e, r, body) {
        try {
            var result = JSON.parse(body);
            if (r.statusCode == 200 && result.success == true) {
            return resolve(result);
            }
            else {
            return reject(result);
            }
        }
        catch (e) {
            return reject(result)
        };
      });
    });
  }

  _makeRequest(endpoint, payload) {
    return new Promise((resolve, reject) => {
      request.post({ url: endpoint, body: JSON.stringify(payload), headers: { Authorization: this.apiKey } }, function(e, r, body) {
        try {
            var result = JSON.parse(body);
            if (r.statusCode == 200 && result.success == true) {
            return resolve(result);
            }
            else {
            return reject(result);
            }
        }
        catch (e) {
            return reject(result)
        };
      });
    });
  }
};
