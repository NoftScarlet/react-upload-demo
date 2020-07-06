import React, {FC, useEffect, useState} from 'react';
import Message from './Message';
import * as STATIC_V from '../static/StaticValuesPDF';
import {simpleFileValidation} from '../static/utility';
import * as pdfjsLib from 'pdfjs-dist/es5/build/pdf'
import axios from 'axios'

import { ReactSortable } from "react-sortablejs";

pdfjsLib.GlobalWorkerOptions.workerSrc = '//cdn.jsdelivr.net/npm/pdfjs-dist@2.4.456/es5/build/pdf.worker.js';


const pdfData = [

    { id: 1, docuName: "xyz.pdf", roationDeg:0, pageNumOfThisDoc:1 },
    { id: 2, name: "fiona" },
    { id: 3, name: "asfasf" },
    { id: 4, name: "fio3333na" },
    { id: 5, name: "fioddna" },
    { id: 6, name: "fion3t4a" },

]


//https://jsfiddle.net/95031khg/1/
//USE es5 build with IE

//https://codesandbox.io/s/99v0ebpy?file=/Container.js
//https://codepen.io/fitri/pen/VbrZQm


//https://medium.com/@deepakkadarivel/drag-and-drop-dnd-for-mobile-browsers-fc9bcd1ad3c5 mobile drag drop

let url = require("../static/helloworld.pdf")
let url2 = require ("../static/HFC3BD44E.pdf")
let url3 = require ("../static/50-pages.pdf")

const PDFRender = props => {
    const [state, setState] = useState([props.pageData]);

    return (
        <div className={"col"}>
            <ReactSortable list={state} setList={setState} >
                {state.map(doc =>{
                    let canvases = []
                    for (let i=0;i<doc.pageCount;i++) {
                        canvases.push(
                            <div key={doc.fingerprint +"-"+i} className={"grid-square"}>
                                <canvas id={`canvas-${doc.filename}-${doc.fingerprint}-${i}`} />
                            </div>)
                    }
                    return canvases
                })}

            </ReactSortable>
        </div>
    );
};

const FileUpload = () => {

    const divs = document.createElement('div');

    const [file, setFile] = useState([]);
    const [pages, setPages] = useState([]);
    const [fileDisplayNames, setFileDisplayNames] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(()=>{
        console.log(pages)
    })


    const renderIntoCanvas =  async (docFiles) => {
        console.log("render into canveas")

         function prepareDataForCanvas (singleFile, singleFileName) {
             let fileReader = new FileReader();
             fileReader.onload =  async function() {
                 let typedArray = new Uint8Array(this.result);
                 const c = await pdfjsLib.getDocument(typedArray).promise
                     .then(function(pdfDoc) {
                     return {
                         pageCount: pdfDoc._pdfInfo.numPages,
                         fingerprint: pdfDoc._pdfInfo.fingerprint,
                         fileName:singleFileName
                     }
                 });
                 console.log(c)

             }
             fileReader.readAsArrayBuffer(singleFile);

        }

         function renderPages(singleFile) {
             let fileReader = new FileReader();
             fileReader.onload =  function() {
                 let typedArray = new Uint8Array(this.result);
                 const loadingTask = pdfjsLib.getDocument(typedArray);
                 loadingTask.promise.then(function(pdfDoc) {
                     for(let i = 1; i <= pdfDoc.numPages; i++) {
                         pdfDoc.getPage(i).then(renderPage);
                     }
                 });
             }
             fileReader.readAsArrayBuffer(singleFile);
        }

        function renderPage(page) {

            console.log("pbifas")

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



        const exec =  (docFiles) =>{
            for(let i = 0; i < docFiles.length; i++) {
                prepareDataForCanvas(docFiles[i])
            }

            //for(let i = 1; i <= docFiles.length; i++) {
                // renderPages(docFiles[i])
          //  }
        }
        exec(docFiles)

    }

    /*   */
    //Drag and drop event handling definition
    const handleDragOver =e=>{
        e.preventDefault()
        e.stopPropagation()
    }

    const handleDragEnter =e=>{
        e.preventDefault()
        console.log("enter")
    }

    const handleDragLeave =e=> {
        e.preventDefault()
        console.log ("leave")
    }

    const handleDrop = e => {
        console.log("handle Drop")
        e.preventDefault();
        let files=[];

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
            let names=[];
            for (let i = 0; i < files.length ; i++) {
                names.push(files[i].name)
            }
            setFileDisplayNames([...fileDisplayNames, ...names])
            renderIntoCanvas(files)
        }
        else {
            console.log(validation.validationMessage)
        }
    }

    const onChange = e => {

        let files =  [...e.target.files]; //Loading
        let validation = simpleFileValidation(files, STATIC_V)
        if (validation.validationResult) {
            let names=[];
            for (let i = 0; i < files.length ; i++) {
                names.push(files[i].name)
            }
            setFileDisplayNames([...fileDisplayNames, ...names])
            renderIntoCanvas(files)
        }
        else {
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
            {pages ? <PDFRender pageData={pages}/> : null}

            <h1>Yixiao's React-PDF Assignment 🚀</h1>

            <div className={"drag-area"} onDragOver={handleDragOver} onDropCapture={handleDrop} onDragEnterCapture={handleDragEnter} onDragLeaveCapture={handleDragLeave}>
                <form onSubmit={onSubmit}  className="upload-form" >

                    <div className="pdf_input">
                        <label htmlFor="files" className="btn">Select Files</label>

                        <input className="pdf_file_select"
                               accept='application/pdf'
                               type="file"
                               name="files[]"
                               id="files"
                               multiple="multiple"
                               onChange={onChange}
                               style={{width:"0px"}}
                        />
                            { ("draggable" in divs || ("ondragstart" in divs && "ondrop" in divs))
                                ?

                                <div className="pdf_dragndrop"> Or drag n drop here</div>
                                :
                                ''
                            }

                        <button className="pdf_button" type="submit" value='Upload'>Upload</button>
                    </div>
                </form>
            </div>
            <br />
            <Message msg={fileDisplayNames} />

        </>
    );
};
{/*// eslint-disable-next-line import/no-webpack-loader-syntax
//import PDFJSWorker from "worker-loader!pdfjs-dist/build/pdf.worker.js";
//pdfjsLib.GlobalWorkerOptions.workerPort = new PDFJSWorker();*/}
export default FileUpload;