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

    const FILE_SIZE_LIMIT_MB = 2;

    const FILE_TYPE_INVALID_MSG = "Invalid file(s). Please upload PDF files only."
    const FILE_SIZE_INVALID_MSG = "PDF size should be under 10MB each."
    const FILE_PASSED_VALIDATION = "File(s) are valid"

    const divs = document.createElement('div');

    const simpleFileValidation = (file) => {

        //Validate files on the front end.
        //Returns an array with boolean result and validation message.

        console.log(file)

        let msgArray = [];

        for (let i = 0; i < file.length ; i++) {
            if (file[i].name.split('.').pop() !== ('pdf'||'PDF'))
            {
                msgArray = [false, FILE_TYPE_INVALID_MSG]
                return msgArray;
            }

            else if (file[i].size /1024/1024 > FILE_SIZE_LIMIT_MB)
            {
                msgArray = [false, FILE_SIZE_INVALID_MSG]
                return msgArray
            }
        }
        msgArray = [true, FILE_PASSED_VALIDATION]
        return msgArray

    }

    const handleDrop = e => {
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
            <form onSubmit={onSubmit} onDrop={handleDrop} className="upload-form">
                {("draggable" in divs || ("ondragstart" in divs && "ondrop" in divs)) ?

                        <div className="box__input">
                            <input className="box__file" type="file" name="files[]" id="fil "
                                   data-multiple-caption="{count} files selected" multiple="multiple"/>
                            <label htmlFor="file"><strong>Choose a file</strong><span className="box__dragndrop"> or drag it here</span>.</label>
                            <button className="box__button" type="submit">Upload</button>
                        </div>

                    :
                    <div className='custom-file mb-4'>
                        <input
                            type='file'
                            accept='application/pdf'
                            className='custom-file-input'
                            id='customFile'
                            onChange={onChange}
                        />
                        <label className='custom-file-label' htmlFor='customFile'>
                            {fileDisplayName}
                        </label>
                    </div>
                }
                <ProgressBar percentage={uploadPercentage} />

                <input
                    type='submit'
                    value='Upload'
                    className='btn btn-primary btn-block mt-4'
                />
            </form>

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