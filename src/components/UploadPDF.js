import React, { Fragment, useState } from 'react';
import Message from './Message';
import ProgressBar from './ProgressBar';
import DragDropArea from "./DragDropArea";
import axios from 'axios';

const FileUpload = () => {
    const [file, setFile] = useState('');
    const [fileDisplayName, setFileDisplayName] = useState(' ');
    const [uploadedFile, setUploadedFile] = useState({});
    const [message, setMessage] = useState('');
    const [uploadPercentage, setUploadPercentage] = useState(0);

    const FILE_SIZE_LIMIT_MB = 10;

    const FILE_TYPE_INVALID_MSG = "The file you provided is invalid. Please upload PDF files only."
    const FILE_SIZE_INVALID_MSG = "PDF size should be under 10MB."
    const FILE_AMOUNT_INVALID_MSG = "You can only upload up to 5 PDFs at a time."
    const FILE_PASSED_VALIDATION = ""

    const divs = document.createElement('div');

    const simpleFileValidation = (file) => {

        if (file.name.split('.').pop() !== ('pdf'||'PDF'))
        {return FILE_TYPE_INVALID_MSG;}

        else if (file.size /1024/1024 > FILE_SIZE_LIMIT_MB)
        {return FILE_SIZE_INVALID_MSG}

        return file.name;
    }

    const handleDrop = e => {
        e.preventDefault()

        /*

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            this.props.handleDrop(e.dataTransfer.files)
            e.dataTransfer.clearData()

        }*/
        let file1 = e.dataTransfer.items[0].getAsFile()
        console.log(file1.name)

    }


    const onChange = e => {

        //Validate file on the front end. Block the file(s) if it doesn't pass validation.

        setFileDisplayName(simpleFileValidation(e.target.files[0]));

        if (simpleFileValidation(e.target.files[0]) === FILE_PASSED_VALIDATION) {
            setFile(e.target.files[0]);

        }
        else {

            //show error message
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
            <form onSubmit={onSubmit} onDrop={handleDrop}>
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