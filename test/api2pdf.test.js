"use strict"

const assert = require("node:assert/strict")
const { EventEmitter } = require("node:events")
const test = require("node:test")

const Api2Pdf = require("../index")

function createMockTransport(handler) {
  return {
    request(options, callback) {
      const req = new EventEmitter()
      let payload = ""

      req.write = chunk => {
        payload += chunk.toString()
      }

      req.end = () => {
        Promise.resolve(handler({ options, payload, callback, req })).catch(error => {
          req.emit("error", error)
        })
      }

      return req
    }
  }
}

function respond(callback, response) {
  const res = new EventEmitter()
  res.statusCode = response.statusCode || 200
  res.headers = response.headers || { "content-type": "application/json" }

  callback(res)

  for (const chunk of response.chunks || []) {
    res.emit("data", Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }

  res.emit("end")
}

test("chromeUrlToPdf posts JSON payload and parses chunked JSON responses", async () => {
  const client = new Api2Pdf("test-key")
  client._requestTransport = createMockTransport(({ options, payload, callback }) => {
    assert.equal(options.method, "POST")
    assert.equal(options.path, "/chrome/pdf/url?outputBinary=false")
    assert.equal(options.headers.Authorization, "test-key")
    assert.deepEqual(JSON.parse(payload), {
      inline: false,
      fileName: "demo.pdf",
      options: { landscape: true },
      url: "https://example.com"
    })

    respond(callback, {
      chunks: ['{"Success":', "true,\"FileUrl\":\"https://files.example.com/demo.pdf\"}"]
    })
  })

  const result = await client.chromeUrlToPdf("https://example.com", {
    inline: false,
    filename: "demo.pdf",
    options: { landscape: true },
    outputBinary: false
  })

  assert.equal(result.Success, true)
  assert.equal(result.FileUrl, "https://files.example.com/demo.pdf")
})

test("constructor supports base URLs and exposes known base URL constants", async () => {
  assert.equal(Api2Pdf.BaseUrls.V2, "https://v2.api2pdf.com")
  assert.equal(Api2Pdf.BaseUrls.V2Xl, "https://v2-xl.api2pdf.com")

  const client = new Api2Pdf("test-key", "http://localhost:18080/custom-prefix", false)
  client._requestTransport = createMockTransport(({ options, callback }) => {
    assert.equal(options.protocol, "http:")
    assert.equal(options.hostname, "localhost")
    assert.equal(options.port, 18080)
    assert.equal(options.path, "/custom-prefix/status")

    respond(callback, {
      headers: { "content-type": "text/plain; charset=utf-8" },
      chunks: ["ok"]
    })
  })

  const result = await client.utilityStatus()
  assert.equal(result, "ok")
})

test("libreOfficeHtmlToDocx accepts either HTML or a URL", async () => {
  const client = new Api2Pdf("test-key")
  const seenPayloads = []

  client._requestTransport = createMockTransport(({ options, payload, callback }) => {
    seenPayloads.push({ path: options.path, body: JSON.parse(payload) })
    respond(callback, {
      chunks: ['{"Success":true}']
    })
  })

  await client.libreOfficeHtmlToDocx("<html><body>hello</body></html>")
  await client.libreOfficeHtmlToDocx("https://example.com/template.html")

  assert.equal(seenPayloads[0].path, "/libreoffice/html-to-docx")
  assert.equal(seenPayloads[0].body.html, "<html><body>hello</body></html>")
  assert.equal(seenPayloads[1].body.url, "https://example.com/template.html")
})

test("pdfsharpExtractPages sends the request with start and end values", async () => {
  const client = new Api2Pdf("test-key")

  client._requestTransport = createMockTransport(({ options, payload, callback }) => {
    assert.equal(options.path, "/pdfsharp/extract-pages")
    assert.deepEqual(JSON.parse(payload), {
      inline: true,
      url: "https://example.com/report.pdf",
      start: 1,
      end: 3
    })

    respond(callback, {
      chunks: ['{"Success":true,"ResponseId":"extract-1"}']
    })
  })

  const result = await client.pdfsharpExtractPages("https://example.com/report.pdf", 1, 3)
  assert.equal(result.ResponseId, "extract-1")
})

test("pdfsharpAddPassword supports legacy and owner-password overloads", async () => {
  const client = new Api2Pdf("test-key")
  const payloads = []

  client._requestTransport = createMockTransport(({ payload, callback }) => {
    payloads.push(JSON.parse(payload))
    respond(callback, {
      chunks: ['{"Success":true}']
    })
  })

  await client.pdfsharpAddPassword("https://example.com/report.pdf", "user-secret", { inline: false })
  await client.pdfsharpAddPassword("https://example.com/report.pdf", "user-secret", "owner-secret", { inline: false })

  assert.deepEqual(payloads[0], {
    inline: false,
    url: "https://example.com/report.pdf",
    userpassword: "user-secret"
  })
  assert.deepEqual(payloads[1], {
    inline: false,
    url: "https://example.com/report.pdf",
    userpassword: "user-secret",
    ownerpassword: "owner-secret"
  })
})

test("new swagger-backed methods map to their expected endpoints", async () => {
  const client = new Api2Pdf("test-key")
  const seenPaths = []

  client._requestTransport = createMockTransport(({ options, payload, callback }) => {
    seenPaths.push({ path: options.path, payload: payload ? JSON.parse(payload) : null })

    respond(callback, {
      chunks: ['{"Success":true}']
    })
  })

  await client.chromeMarkdownToPdf("# Hello")
  await client.chromeMarkdownToImage("# Hello")
  await client.markitdownToMarkdown("https://example.com/file.docx")
  await client.openDataLoaderPdfToJson("https://example.com/file.pdf")
  await client.openDataLoaderPdfToMarkdown("https://example.com/file.pdf")
  await client.openDataLoaderPdfToHtml("https://example.com/file.pdf")

  assert.deepEqual(seenPaths.map(entry => entry.path), [
    "/chrome/pdf/markdown",
    "/chrome/image/markdown",
    "/markitdown",
    "/opendataloader/json",
    "/opendataloader/markdown",
    "/opendataloader/html"
  ])

  assert.equal(seenPaths[0].payload.markdown, "# Hello")
  assert.equal(seenPaths[2].payload.url, "https://example.com/file.docx")
})

test("zipGenerate defaults to binary output and zebra uses query parameters", async () => {
  const client = new Api2Pdf("test-key")
  const responses = []

  client._requestTransport = createMockTransport(({ options, payload, callback }) => {
    responses.push({ path: options.path, payload: payload ? JSON.parse(payload) : null })

    if (options.path.startsWith("/zip")) {
      respond(callback, {
        headers: { "content-type": "application/octet-stream" },
        chunks: [Buffer.from("zip-binary")]
      })
      return
    }

    respond(callback, {
      headers: { "content-type": "application/octet-stream" },
      chunks: [Buffer.from("png-binary")]
    })
  })

  const zipResult = await client.zipGenerate([
    { url: "https://example.com/a.pdf", fileName: "docs/a.pdf" }
  ])
  const zebraResult = await client.zebraGenerateBarcode("QR_CODE", "https://api2pdf.com", {
    width: 300,
    height: 300,
    showLabel: false
  })

  assert.ok(Buffer.isBuffer(zipResult))
  assert.equal(zipResult.toString(), "zip-binary")
  assert.ok(Buffer.isBuffer(zebraResult))
  assert.equal(zebraResult.toString(), "png-binary")

  assert.equal(responses[0].path, "/zip?outputBinary=true")
  assert.deepEqual(responses[0].payload, {
    inline: true,
    files: [{ url: "https://example.com/a.pdf", fileName: "docs/a.pdf" }]
  })
  assert.equal(
    responses[1].path,
    "/zebra?format=QR_CODE&value=https%3A%2F%2Fapi2pdf.com&height=300&width=300&showlabel=false&outputBinary=true"
  )
})

test("utility endpoints return text and unsuccessful JSON responses reject", async () => {
  const client = new Api2Pdf("test-key")
  let callCount = 0

  client._requestTransport = createMockTransport(({ options, callback }) => {
    callCount += 1

    if (callCount === 1) {
      assert.equal(options.path, "/balance")
      respond(callback, {
        headers: { "content-type": "text/plain; charset=utf-8" },
        chunks: ["12.34"]
      })
      return
    }

    respond(callback, {
      chunks: ['{"Success":false,"Error":"conversion failed"}']
    })
  })

  const balance = await client.utilityBalance()
  assert.equal(balance, "12.34")

  await assert.rejects(
    () => client.chromeHtmlToPdf("<p>broken</p>"),
    error => error && error.Error === "conversion failed"
  )
})
