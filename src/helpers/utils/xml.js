import converter from 'xml-js'

export default {
  js2xml,
  xml2js
}

function xml2js (payload) {
  return converter.xml2js(payload)
}

function js2xml (payload) {
  return converter.js2xml(payload)
}
