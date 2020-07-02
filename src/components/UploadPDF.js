import React, {useEffect, useState} from 'react';
import Message from './Message';
import * as STATIC_V from '../static/StaticValuesPDF';
import {simpleFileValidation} from '../static/utility';
import * as pdfjsLib from 'pdfjs-dist'
import axios from 'axios'

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.4.456/pdf.worker.js';


let url = require("../static/helloworld.pdf")

var loadingTask = pdfjsLib.getDocument(url);
loadingTask.promise.then(function(pdf) {
    console.log('PDF loaded');

    // Fetch the first page
    var pageNumber = 1;
    pdf.getPage(pageNumber).then(function(page) {
        console.log('Page loaded');

        var scale = 1.5;
        var viewport = page.getViewport({scale: scale});

        // Prepare canvas using PDF page dimensions
        var canvas = document.getElementById('the-canvas');
        var context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render PDF page into canvas context
        var renderContext = {
            canvasContext: context,
            viewport: viewport
        };
        var renderTask = page.render(renderContext);
        renderTask.promise.then(function () {
            console.log('Page rendered');
        });
    });
}, function (reason) {
    // PDF loading error
    console.error(reason);
});


const FileUpload = () => {

    const [file, setFile] = useState([]);
    const [fileDisplayNames, setFileDisplayNames] = useState([]);
    const [uploadedFile, setUploadedFile] = useState({});
    const [message, setMessage] = useState('');
    const [uploadPercentage, setUploadPercentage] = useState(0);
    const divs = document.createElement('div');

    const prepareFiles = (files) => {
        setFile(files)
        for (let i = 0; i < files.length ; i++) {
            setFileDisplayNames([...fileDisplayNames, files[i].name])
        }
        console.log(fileDisplayNames)

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
            console.log("set file")
            setFile(files)
            setFileDisplayNames(files)
        }
        else {
            console.log(validation.validationMessage)
        }
    }



    const onChange = e => {

        let validation = simpleFileValidation(e.target.files, STATIC_V)
        if (validation.validationResult) {
            prepareFiles(e.target.files)
        }
        else {
            console.log(validation.validationMessage)
        }
    };

    const onSubmit = async evt => {
        evt.preventDefault();
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await axios.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: progressEvent => {
                    setUploadPercentage(
                        parseInt(
                            Math.round((progressEvent.loaded * 100) / progressEvent.total)
                        )
                    );

                    // Clear percentage
                    setTimeout(() => setUploadPercentage(0), 10000);
                }
            });

            const { fileDisplayName, filePath } = res.data;

            setUploadedFile({ fileDisplayName, filePath });

            setMessage('File Uploaded');
        } catch (err) {
            if (err.response.status === 500) {
                setMessage('There was a problem with the server');
            } else {
                setMessage(err.response.data.msg);
            }
        }
    };

    useEffect(() => {

    });

    return (

        <>
            <h1>PDF.js 'Hello, world!' example</h1>

            <canvas id="the-canvas"> </canvas>

            {message ? <Message msg={message} /> : null}

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
            <Message msg={fileDisplayNames} />

            {uploadedFile ? (
                <div className='row mt-5'>
                    <div className='col-md-6 m-auto'>
                        <h3 className='text-center'>{uploadedFile.fileDisplayName}</h3>
                        <img style={{ width: '100%' }} src={uploadedFile.filePath} alt='' />
                    </div>
                </div>
            ) : null}



        </>
    );
};
{/*// eslint-disable-next-line import/no-webpack-loader-syntax
//import PDFJSWorker from "worker-loader!pdfjs-dist/build/pdf.worker.js";
//pdfjsLib.GlobalWorkerOptions.workerPort = new PDFJSWorker();*/}
export default FileUpload;