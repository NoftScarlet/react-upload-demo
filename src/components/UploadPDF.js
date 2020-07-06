import React, { useEffect, useState} from 'react';
import Message from './Message';
import * as STATIC_V from '../static/StaticValuesPDF';
import {simpleFileValidation, classSafeStr} from '../static/utility';
import * as pdfjsLib from 'pdfjs-dist/es5/build/pdf'
import PDFGridRender from "./PDFGridRender";
import {ReactSortable} from "react-sortablejs";

pdfjsLib.GlobalWorkerOptions.workerSrc = '//cdn.jsdelivr.net/npm/pdfjs-dist@2.4.456/es5/build/pdf.worker.js';
const canvasCreationDataBuffer = []

//https://jsfiddle.net/95031khg/1/
//USE es5 build with IE
//https://codesandbox.io/s/99v0ebpy?file=/Container.js
//https://codepen.io/fitri/pen/VbrZQm

const FileUpload = () => {

    const divs = document.createElement('div');

    const [file, setFile] = useState([]);
    const [pages, setPages] = useState([]);
    const [fileDisplayNames, setFileDisplayNames] = useState([]);
    const [message, setMessage] = useState('');

  /*  useEffect(()=>{
        setPages([canvasCreationDataBuffer])
    },[fileDisplayNames])*/

    const renderIntoCanvas = async (docFiles) => {
        console.log("render into canvas")

        function createCanvasAttributeData(x) {
            let dataBuffer = []
            for (let i=0; i<x.pageCount;i++){
                dataBuffer.push({
                    pageNums:i+1, fingerprint:x.fingerprint,name:x.fileName
                })
            }
            return dataBuffer
        }

        function prepareDataForCanvas(singleFile, singleFileName) {
            let fileReader = new FileReader();
            fileReader.onload = async function () {
                let typedArray = new Uint8Array(this.result);
                const pageData = await pdfjsLib.getDocument(typedArray).promise
                    .then(function (pdfDoc) {
                        return {
                            pageCount: pdfDoc._pdfInfo.numPages,
                            fingerprint: pdfDoc._pdfInfo.fingerprint,
                            fileName: singleFileName
                        }
                    });
                setPages(createCanvasAttributeData(pageData))
            }

            fileReader.readAsArrayBuffer(singleFile);
        }

        function renderPages(singleFile) {
            let fileReader = new FileReader();
            fileReader.onload = async function () {
                let typedArray = new Uint8Array(this.result);
                const loadingTask = pdfjsLib.getDocument(typedArray);
                loadingTask.promise.then(function (pdfDoc) {
                    for (let i = 0; i < pdfDoc.numPages; i++) {
                        pdfDoc.getPage(i+1).then(function(_pdfPage){
                            renderPage(_pdfPage, {pageNum:i+1,fingerprint:pdfDoc._pdfInfo.fingerprint })
                        });
                    }
                });
            }
            fileReader.readAsArrayBuffer(singleFile);
        }

        function renderPage(page,canvasAttr) {

            console.log(page,canvasAttr)

            /*
            let scale = 0.4;
            let viewport = page.getViewport({scale: scale});


            let canvas = document.getElementById(page.name );
            let context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            // Render PDF page into canvas context
            let renderContext = {
                canvasContext: context,
                viewport: viewport
            };
            let renderTask = page.render(renderContext);
            renderTask.promise.then(function () {
                console.log('Page rendered');
            });*/

        }


        const exec = (docFiles) => {
            for (let i = 0; i < docFiles.length; i++) {
                prepareDataForCanvas(docFiles[i],docFiles[i].name)
            }
            setPages(canvasCreationDataBuffer)
            for (let i=0;i<docFiles.length;i++) {
                renderPages(docFiles[i])
            }



            //for(let i = 1; i <= docFiles.length; i++) {
            // renderPages(docFiles[i])
            //  }
        }
        exec(docFiles)

    }

    /*   */
    //Drag and drop event handling definition
    const handleDragOver = e => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleDragEnter = e => {
        e.preventDefault()
        console.log("enter")
    }

    const handleDragLeave = e => {
        e.preventDefault()
        console.log("leave")
    }

    const handleDrop = e => {
        console.log("handle Drop")
        e.preventDefault();
        let files = [];

        if (e.dataTransfer.items) {
            // Use DataTransferItemList interface to access the file(s)
            for (let i = 0; i < e.dataTransfer.items.length; i++) {
                // If dropped items aren't files, reject them
                if (e.dataTransfer.items[i].kind === 'file') {
                    files.push(e.dataTransfer.items[i].getAsFile());

                }
            }
        } else {
            // Use DataTransfer interface to access the file(s)
            for (let i = 0; i < e.dataTransfer.files.length; i++) {
                files.push(e.dataTransfer.files[i])

            }
        }

        let validation = simpleFileValidation(files, STATIC_V)
        if (validation.validationResult) {
            let names = [];
            for (let i = 0; i < files.length; i++) {
                names.push(files[i].name)
            }
            setFileDisplayNames([...fileDisplayNames, ...names])
            renderIntoCanvas(files)
        } else {
            console.log(validation.validationMessage)
        }
    }

    const onChange = e => {

        let files = [...e.target.files]; //Loading
        let validation = simpleFileValidation(files, STATIC_V)
        if (validation.validationResult) {
            let names = [];
            for (let i = 0; i < files.length; i++) {
                names.push(files[i].name)
            }
            setFileDisplayNames([...fileDisplayNames, ...names])
            renderIntoCanvas(files)
        } else {
            console.log(validation.validationMessage)
        }
    };

    const onSubmit = async evt => {
        evt.preventDefault();
        const formData = new FormData();
        formData.append('file', file);
    };


    return (

        <>
            {pages ? <PDFGridRender pageData={pages}/> : null}

            <h1>Yixiao's React-PDF Assignment 🚀</h1>

            <div className={"drag-area"} onDragOver={handleDragOver} onDropCapture={handleDrop}
                 onDragEnterCapture={handleDragEnter} onDragLeaveCapture={handleDragLeave}>
                <form onSubmit={onSubmit} className="upload-form">

                    <div className="pdf_input">
                        <label htmlFor="files" className="btn">Select Files</label>

                        <input className="pdf_file_select"
                               accept='application/pdf'
                               type="file"
                               name="files[]"
                               id="files"
                               multiple="multiple"
                               onChange={onChange}
                               style={{width: "0px"}}
                        />
                        {("draggable" in divs || ("ondragstart" in divs && "ondrop" in divs))
                            ?

                            <div className="pdf_dragndrop"> Or drag n drop here</div>
                            :
                            ''
                        }

                        <button className="pdf_button" type="submit" value='Upload'>Upload</button>
                    </div>
                </form>
            </div>
            <br/>
            <Message msg={fileDisplayNames}/>

        </>
    );
};
{/*// eslint-disable-next-line import/no-webpack-loader-syntax
//import PDFJSWorker from "worker-loader!pdfjs-dist/build/pdf.worker.js";
//pdfjsLib.GlobalWorkerOptions.workerPort = new PDFJSWorker();*/
}
export default FileUpload;