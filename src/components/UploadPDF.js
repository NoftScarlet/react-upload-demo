import React, { Fragment, useState } from 'react';
import Message from './Message';
import ProgressBar from './ProgressBar';
import axios from 'axios';

const FileUpload = () => {

    const [file, setFile] = useState([]);
    const [fileDisplayName, setFileDisplayName] = useState(' ');
    const [uploadedFile, setUploadedFile] = useState({});
    const [message, setMessage] = useState('');
    const [uploadPercentage, setUploadPercentage] = useState(0);

    const FILE_TYPE_LIMIT = 'pdf';
    const FILE_SIZE_LIMIT_MB = 2;
    const FILE_AMOUNT_LIMIT = 5;

    const FILE_TYPE_INVALID_MSG = "Invalid file(s). Please upload PDF files only."
    const FILE_SIZE_INVALID_MSG = "PDF size should be under 10MB each."
    const FILE_AMOUNT_INVALID_MSG = "You can only upload up to 5 PDFs"
    const FILE_PASSED_VALIDATION = "File(s) are valid"

    const divs = document.createElement('div');

    const simpleFileValidation = (file) => {
        //Validate files on the front end.
        //Returns an array with boolean result and validation message.
        console.log(file)

        let msgArray = [];

        if (file.length > FILE_AMOUNT_LIMIT) {
            return [false, FILE_AMOUNT_INVALID_MSG]
        }

        for (let i = 0; i < file.length ; i++) {
            if (file[i].name.split('.').pop().toLowerCase() !== FILE_TYPE_LIMIT)
            {
                return [false, FILE_TYPE_INVALID_MSG];
            }

            else if (file[i].size /1024/1024 > FILE_SIZE_LIMIT_MB)
            {
                return [false, FILE_SIZE_INVALID_MSG]
            }
        }
        msgArray = [true, FILE_PASSED_VALIDATION]
        return msgArray

    }

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
        console.log("handle Dr")
        e.preventDefault();

        let files=[];
        if (e.dataTransfer.items) {
            // Use DataTransferItemList interface to access the file(s)
            for (let i = 0; i < e.dataTransfer.items.length; i++) {
                // If dropped items aren't files, reject them
                if (e.dataTransfer.items[i].kind === 'file') {
                    files.push(e.dataTransfer.items[i].getAsFile());
                    console.log(files);
                }
            }
        } else {
            // Use DataTransfer interface to access the file(s)
            for (let i = 0; i < e.dataTransfer.files.length; i++) {
                files.push(e.dataTransfer.files[i])
                console.log(files);
            }
        }

        let validation = simpleFileValidation(files)
        if (validation[0]) {
            console.log("set file")
            setFile(files)
        }
        else {
            console.log(validation[1])
        }
    }


    const onChange = e => {
        console.log(e.target.files)
        let validation = simpleFileValidation(e.target.files)
        if (validation[0]) {
            console.log("set file!!!!!!!!!!!!")
            setFile(e.target.files)
        }
        else {
            console.log(validation[1])
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

    return (
        <>

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

export default FileUpload;