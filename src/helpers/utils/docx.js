import fs from "fs";
import path from "path";
import moment from "moment";

import XmlHelper from "./xml";
import ImageHelper from "./image";
import FolderHelper from "./folder";
import DownloadHelper from "./download";

async function generateDocxTableInJSON(folder, columns, items) {
  // Initialize Table
  let jsonContent = initializeTable();

  // Initialize Headers
  const headers = initializeHeaders(columns);
  jsonContent.elements.push(headers);

  // Download Media (If it exists)
  const media = await downloadMedia(folder, columns, items);
  if (media.length > 0) {
    syncRelsFile(folder, media);
  }

  const content = populateRecords(columns, items, media);
  jsonContent.elements.push(...content);
  return jsonContent;
}

function initializeTable() {
  return {
    type: "element",
    name: "w:tbl",
    elements: [
      {
        type: "element",
        name: "w:tblPr",
        elements: [
          {
            type: "element",
            name: "w:tblStyle",
            attributes: { "w:val": "TableGrid" },
          },
          {
            type: "element",
            name: "w:tblW",
            attributes: { "w:w": "9000", "w:type": "pct" },
          },
          {
            type: "element",
            name: "w:tblBorders",
            elements: [
              {
                type: "element",
                name: "w:top",
                attributes: {
                  "w:val": "single",
                  "w:color": "auto",
                  "w:sz": "6",
                  "w:space": "0",
                },
              },
              {
                type: "element",
                name: "w:bottom",
                attributes: {
                  "w:val": "single",
                  "w:color": "auto",
                  "w:sz": "6",
                  "w:space": "0",
                },
              },
              {
                type: "element",
                name: "w:left",
                attributes: {
                  "w:val": "single",
                  "w:color": "auto",
                  "w:sz": "6",
                  "w:space": "0",
                },
              },
              {
                type: "element",
                name: "w:right",
                attributes: {
                  "w:val": "single",
                  "w:color": "auto",
                  "w:sz": "6",
                  "w:space": "0",
                },
              },
              {
                type: "element",
                name: "w:insideH",
                attributes: {
                  "w:val": "single",
                  "w:color": "auto",
                  "w:sz": "6",
                  "w:space": "0",
                },
              },
              {
                type: "element",
                name: "w:insideV",
                attributes: {
                  "w:val": "single",
                  "w:color": "auto",
                  "w:sz": "6",
                  "w:space": "0",
                },
              },
            ],
          },
        ],
      },
      {
        type: "element",
        name: "w:tblGrid",
        elements: [
          {
            type: "element",
            name: "w:gridCol",
            attributes: { "w:w": "1800" },
          },
          {
            type: "element",
            name: "w:gridCol",
            attributes: { "w:w": "1800" },
          },
          {
            type: "element",
            name: "w:gridCol",
            attributes: { "w:w": "1800" },
          },
          {
            type: "element",
            name: "w:gridCol",
            attributes: { "w:w": "1800" },
          },
          {
            type: "element",
            name: "w:gridCol",
            attributes: { "w:w": "1800" },
          },
        ],
      },
    ],
  };
}

function initializeHeaders(columns) {
  return {
    type: "element",
    name: "w:tr",
    elements: [
      ...columns.map((column) => ({
        type: "element",
        name: "w:tc",
        elements: [
          {
            type: "element",
            name: "w:tcPr",
            elements: [
              {
                type: "element",
                name: "w:tcW",
                attributes: { "w:w": "1800", "w:type": "dxa" },
              },
            ],
          },
          {
            type: "element",
            name: "w:p",
            elements: [
              {
                type: "element",
                name: "w:r",
                elements: [
                  {
                    type: "element",
                    name: "w:t",
                    elements: [{ type: "text", text: column.title }],
                  },
                ],
              },
            ],
          },
        ],
      })),
    ],
  };
}

function populateRecords(columns, items, media) {
  return items.map((item, row) => ({
    type: "element",
    name: "w:tr",
    elements: [
      {
        type: "element",
        name: "w:tc",
        elements: [
          {
            type: "element",
            name: "w:tcPr",
            elements: [
              {
                type: "element",
                name: "w:tcW",
                attributes: { "w:w": "1800", "w:type": "dxa" },
              },
            ],
          },
          {
            type: "element",
            name: "w:p",
            elements: [
              {
                type: "element",
                name: "w:r",
                elements: [
                  {
                    type: "element",
                    name: "w:t",
                    elements: [{ type: "text", text: item.name }],
                  },
                ],
              },
            ],
          },
        ],
      },
      ...item.column_values.map((column, index) => {
        const columnIndex = index + 1;
        const isFileColumn =
          columns.findIndex((item) => item.type === "file") === columnIndex;
        
        if (isFileColumn) {
          const mediaItem = media.find(item => item.row === row && item.column === columnIndex)
          return {
            type: "element",
            name: "w:tc",
            elements: [
              {
                type: "element",
                name: "w:tcPr",
                elements: [
                  {
                    type: "element",
                    name: "w:tcW",
                    attributes: { "w:w": "1800", "w:type": "dxa" },
                  },
                ],
              },
              {
                type: "element",
                name: "w:p",
                elements: [
                  {
                    type: "element",
                    name: "w:r",
                    elements: [
                      {
                        type: "element",
                        name: "w:drawing",
                        elements: [
                          {
                            type: "element",
                            name: "wp:inline",
                            attributes: {
                              distT: "0",
                              distB: "0",
                              distL: "0",
                              distR: "0",
                            },
                            elements: [
                              {
                                type: "element",
                                name: "wp:extent",
                                attributes: {
                                  cx: "950976",
                                  cy: "534924",
                                },
                              },
                              {
                                type: "element",
                                name: "wp:effectExtent",
                                attributes: {
                                  l: "0",
                                  t: "0",
                                  r: "0",
                                  b: "0",
                                },
                              },
                              {
                                type: "element",
                                name: "wp:docPr",
                                attributes: {
                                  id: "1",
                                  name: `${mediaItem?.id}.jpg`,
                                },
                              },
                              {
                                type: "element",
                                name: "wp:cNvGraphicFramePr",
                                elements: [
                                  {
                                    type: "element",
                                    name: "a:graphicFrameLocks",
                                    attributes: {
                                      noChangeAspect: "1",
                                    },
                                  },
                                ],
                              },
                              {
                                type: "element",
                                name: "a:graphic",
                                elements: [
                                  {
                                    type: "element",
                                    name: "a:graphicData",
                                    attributes: {
                                      uri: "http://schemas.openxmlformats.org/drawingml/2006/picture",
                                    },
                                    elements: [
                                      {
                                        type: "element",
                                        name: "pic:pic",
                                        elements: [
                                          {
                                            type: "element",
                                            name: "pic:nvPicPr",
                                            elements: [
                                              {
                                                type: "element",
                                                name: "pic:cNvPr",
                                                attributes: {
                                                  id: "0",
                                                  name: `${mediaItem?.id}.jpg`,
                                                },
                                              },
                                              {
                                                type: "element",
                                                name: "pic:cNvPicPr",
                                              },
                                            ],
                                          },
                                          {
                                            type: "element",
                                            name: "pic:blipFill",
                                            elements: [
                                              {
                                                type: "element",
                                                name: "a:blip",
                                                attributes: {
                                                  "r:embed":
                                                    mediaItem?.id,
                                                  cstate: "print",
                                                },
                                                elements: [
                                                  {
                                                    type: "element",
                                                    name: "a:extLst",
                                                    elements: [
                                                      {
                                                        type: "element",
                                                        name: "a:ext",
                                                        attributes: {
                                                          uri: `{${mediaItem?.id}}`,
                                                        },
                                                      },
                                                      {
                                                        type: "element",
                                                        name: "a14:useLocalDpi",
                                                        attributes: {
                                                          val: "0",
                                                          "xmlns:a14":
                                                            "http://schemas.microsoft.com/office/drawing/2010/main",
                                                        },
                                                      },
                                                    ],
                                                  },
                                                ],
                                              },
                                              {
                                                type: "element",
                                                name: "a:stretch",
                                                elements: [
                                                  {
                                                    type: "element",
                                                    name: "a:fillRect",
                                                  },
                                                ],
                                              },
                                            ],
                                          },
                                          {
                                            type: "element",
                                            name: "pic:spPr",
                                            elements: [
                                              {
                                                type: "element",
                                                name: "a:xfrm",
                                                elements: [
                                                  {
                                                    type: "element",
                                                    name: "a:off",
                                                    attributes: {
                                                      x: "0",
                                                      y: "0",
                                                    },
                                                  },
                                                  {
                                                    type: "element",
                                                    name: "a:ext",
                                                    attributes: {
                                                      cx: "950976",
                                                      cy: "534924",
                                                    },
                                                  },
                                                ],
                                              },
                                              {
                                                type: "element",
                                                name: "a:prstGeom",
                                                attributes: {
                                                  prst: "rect",
                                                },
                                                elements: [
                                                  {
                                                    type: "element",
                                                    name: "a:avLst",
                                                  },
                                                ],
                                              },
                                            ],
                                          },
                                        ],
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          };
        } else {
          return {
            type: "element",
            name: "w:tc",
            elements: [
              {
                type: "element",
                name: "w:tcPr",
                elements: [
                  {
                    type: "element",
                    name: "w:tcW",
                    attributes: { "w:w": "1800", "w:type": "dxa" },
                  },
                ],
              },
              {
                type: "element",
                name: "w:p",
                elements: [
                  {
                    type: "element",
                    name: "w:r",
                    elements: [
                      {
                        type: "element",
                        name: "w:t",
                        elements: [{ type: "text", text: column.text }],
                      },
                    ],
                  },
                ],
              },
            ],
          };
        }
      }),
    ],
  }));
}

async function downloadMedia(folder, columns, items) {
  const index = columns.findIndex((item) => item.type === "file");
  if (index === -1) {
    return [];
  }

  const mediaDirectory = `${folder}/media`;
  await FolderHelper.create(mediaDirectory);

  return await Promise.all(
    items.map(async (item, i) => {
      if (index === 0) {
        return [];
      }
      const file = item?.column_values[index - 1]?.text || null;
      const filePublicUrl = item?.assets?.find(asset => asset.url === file)?.public_url || null;
      let destination;
      const id = `R${Buffer.from(Math.random().toString()).toString("base64").substring(5,15)}`
      if (file && filePublicUrl) {
        destination = `${folder}/media/${id}${decodeURI(path.extname(file))}`;
        await DownloadHelper.downloadFile(file, destination);
      }

      return {
        id,
        row: i,
        column: index,
        file: destination,
        target: `/media/${path.basename(destination)}`,
      };
    })
  );
}

function syncRelsFile(folder, media) {
  const relFile = `${folder}/word/_rels/document.xml.rels`;
  const jsonContent = XmlHelper.xml2js(fs.readFileSync(relFile).toString());
  jsonContent.elements[0]?.elements.push(
    ...media.map((item) => ({
      type: "element",
      name: "Relationship",
      attributes: {
        Id: item.id,
        Type: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/image",
        Target: item.target,
      },
    }))
  );

  const xmlContent = XmlHelper.js2xml(jsonContent);
  fs.writeFileSync(relFile, xmlContent);
  return relFile;
}

export default {
  generateDocxTableInJSON,
};
