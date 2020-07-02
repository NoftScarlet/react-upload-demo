/* _ */
//Simple front end validation. Returns an object with boolean result and validation message
export const simpleFileValidation = (files, STATIC_V) => {
    console.log(files)


    //check amount of files
    if (files.length > STATIC_V.FILE_AMOUNT_LIMIT) {
        return  { validationResult:false, validationMessage: STATIC_V.FILE_AMOUNT_INVALID_MSG}
    }

    //check file extension type and file size
    for (let i = 0; i < files.length ; i++) {
        if (files[i].name.split('.').pop().toLowerCase() !== STATIC_V.FILE_TYPE_LIMIT)
        {

            return { validationResult:false, validationMessage: STATIC_V.FILE_TYPE_INVALID_MSG}
        }

        else if (files[i].size /1024/1024 > STATIC_V.FILE_SIZE_LIMIT_MB)
        {
            return { validationResult:false, validationMessage: STATIC_V.FILE_SIZE_INVALID_MSG}
        }
    }
    return { validationResult:true, validationMessage: STATIC_V.FILE_PASSED_VALIDATION}

}
