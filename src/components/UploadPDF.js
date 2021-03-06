import React, { useEffect, useState } from "react";
import { simpleFileValidation } from "../static/utility";
import * as STATIC_V from "../static/StaticValuesPDF";
import * as pdfjsLib from "pdfjs-dist/es5/build/pdf";
import PDFGridRender from "./PDFGridRender";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdn.jsdelivr.net/npm/pdfjs-dist@2.4.456/es5/build/pdf.worker.js";

const FileUpload = () => {
  const divs = document.createElement("div");
  const [canvasAttributeData, setCanvasAttributeData] = useState([]);
  const [fileDisplayNames, setFileDisplayNames] = useState([]);
  const [imgData, setImgData] = useState({});

  const createCanvases = async (docs) => {
    let buffer = [];

    function prepareDataForCanvas(sf, sfn) {
      let singlePageData = [];
      pdfjsLib
        .getDocument(sf)
        .promise.then(function (pdfDoc) {
          for (let i = 0; i < pdfDoc._pdfInfo.numPages; i++) {
            singlePageData.push({
              pageNum: i + 1,
              fingerprint: pdfDoc._pdfInfo.fingerprint,
              fileName: sfn,
              rotateDeg: 0,
              key: pdfDoc._pdfInfo.fingerprint + "-" + (i + 1),
            });
          }
          buffer = [...singlePageData];
          setCanvasAttributeData(buffer);
          return pdfDoc;
        })
        .then(function (pdfDoc) {
          for (let i = 0; i < pdfDoc._pdfInfo.numPages; i++) {
            pdfDoc.getPage(i + 1).then(function (_pdfPage) {
              renderSinglePage(_pdfPage, {
                pageNum: i + 1,
                fingerprint: pdfDoc._pdfInfo.fingerprint,
              });
            });
          }
        });
    }

    async function exec(docFiles) {
      for (let i = 0; i < docFiles.length; i++) {
        convertToUnit8Array(
          docFiles[i],
          docFiles[i].name,
          prepareDataForCanvas
        );
      }
    }

    function convertToUnit8Array(singleFile, singleFileName, callback) {
      let fileReader = new FileReader();
      fileReader.onload = function (event) {
        let typedArray = new Uint8Array(this.result);
        callback(typedArray, singleFileName);
      };
      fileReader.readAsArrayBuffer(singleFile);
    }

    function renderSinglePage(_page, _canvasAttr) {
      let id = "canvas-" + _canvasAttr.fingerprint + "-" + _canvasAttr.pageNum;
      let scale = 0.25;
      let viewport = _page.getViewport({ scale: scale });
      let canvas = document.getElementById(id);
      let context = canvas.getContext("2d");
      canvas.height = 220;
      canvas.width = 160;

      // Render PDF page into canvas context
      let renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
      let renderTask = _page.render(renderContext);
      renderTask.promise.then(function () {
        let canvas = document.getElementById(id);
        let context = canvas.getContext("2d");
        let imgData = context.getImageData(0, 0, canvas.width, canvas.height);
        setImgData({
          key: _canvasAttr.fingerprint + "-" + _canvasAttr.pageNum,
          imgData: imgData,
        });
      });
    }

    return await exec(docs);
  };

  /*   */
  //Drag and drop event handling definition
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    let files = [];
    if (e.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (let i = 0; i < e.dataTransfer.items.length; i++) {
        // If dropped items aren't files, reject them
        if (e.dataTransfer.items[i].kind === "file") {
          files.push(e.dataTransfer.items[i].getAsFile());
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        files.push(e.dataTransfer.files[i]);
      }
    }
    let validation = simpleFileValidation(files, STATIC_V);
    if (validation.validationResult) {
      let names = [];
      for (let i = 0; i < files.length; i++) {
        names.push(files[i].name);
      }
      setFileDisplayNames([...fileDisplayNames, ...names]);
      createCanvases(files);
    } else {
      console.log(validation.validationMessage);
    }
  };

  const onChange = (e) => {
    let files = [...e.target.files]; //Loading
    let validation = simpleFileValidation(files, STATIC_V);
    if (validation.validationResult) {
      let names = [];
      for (let i = 0; i < files.length; i++) {
        names.push(files[i].name);
      }
      setFileDisplayNames([...fileDisplayNames, ...names]);
      createCanvases(files);
    } else {
      console.log(validation.validationMessage);
    }
  };

  return (
    <>
      <h1 className="text-align-center">React-PDF Assignment 🚀</h1>
      <div
        className={"drag-area"}
        onDragOver={handleDragOver}
        onDropCapture={handleDrop}
        onDragEnterCapture={handleDragEnter}
        onDragLeaveCapture={handleDragLeave}
      >
        <form className="upload-form">
          <div className="pdf_input">
            <label htmlFor="files" className="btn btn-lg btn-info">
              Select Files
            </label>
            <input
              className="pdf_file_select"
              accept="application/pdf"
              type="file"
              name="files[]"
              id="files"
              multiple="multiple"
              onChange={onChange}
              style={{ width: "0px" }}
            />
            {"draggable" in divs ||
            ("ondragstart" in divs && "ondrop" in divs) ? (
              <div className="pdf_dragndrop"> Or drag n drop here</div>
            ) : (
              ""
            )}
          </div>
        </form>
        {canvasAttributeData ? (
          <PDFGridRender pageData={canvasAttributeData} imageData={imgData} />
        ) : null}
      </div>

      <br />
    </>
  );
};

export default FileUpload;
