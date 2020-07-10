/* _ */
//Simple front end validation. Returns an object with boolean result and validation message
export const simpleFileValidation = (files, STATIC_V) => {

    //check amount of files
    if (files.length > STATIC_V.FILE_AMOUNT_LIMIT) {
        return {validationResult: false, validationMessage: STATIC_V.FILE_AMOUNT_INVALID_MSG}
    }

    //check file extension type and file size
    for (let i = 0; i < files.length; i++) {
        if (files[i].name.split('.').pop().toLowerCase() !== STATIC_V.FILE_TYPE_LIMIT) {

            return {validationResult: false, validationMessage: STATIC_V.FILE_TYPE_INVALID_MSG}
        } else if (files[i].size / 1024 / 1024 > STATIC_V.FILE_SIZE_LIMIT_MB) {
            return {validationResult: false, validationMessage: STATIC_V.FILE_SIZE_INVALID_MSG}
        }
    }
    return {validationResult: true, validationMessage: STATIC_V.FILE_PASSED_VALIDATION}

}

export const classSafeStr = (strings) => {
    return strings.replace(/[^a-z0-9]/g, function (s) {
        let c = s.charCodeAt(0);
        if (c === 32) return '-';
        if (c >= 65 && c <= 90) return '_' + s.toLowerCase();
        return '__' + ('000' + c.toString(16)).slice(-4);
    });
}

export const getOptions = (resultArray) => {

    let masterArray = []
    let rollingArray = []
    let fileMap = {}
    for (let i = 0; i < resultArray.length; i++) {

        //append fileName to result file. The first step is to get a list of current values.
        let values = []
        let keys = Object.keys(fileMap)
        for (let j = 0; j < keys.length; j++) {
            values.push(fileMap[keys[j]])
        }

        //if fileMap doesn't have this file, add it in
        if (values.indexOf(resultArray[i].fileName) === -1) {
            fileMap[keys.length.toString()] = resultArray[i].fileName
        }


        //extract options string

        if (i === 0) {
            rollingArray.push(resultArray[i].fileName, resultArray[i].pageNum, resultArray[i].pageNum, resultArray[i].rotateDeg)
            if (resultArray.length === 1) {
                masterArray.push(rollingArray)
            }
        } else if (
            i > 0 &&
            resultArray[i].fingerprint === resultArray[i - 1].fingerprint &&
            resultArray[i].rotateDeg === resultArray[i - 1].rotateDeg &&
            resultArray[i].pageNum === (resultArray[i - 1].pageNum + 1)
        ) {
            rollingArray[2] = resultArray[i].pageNum;
            if (i === (resultArray.length - 1)) {
                masterArray.push(rollingArray);
            }//save last


        } else {
            masterArray.push(rollingArray)
            rollingArray = []
            rollingArray.push(resultArray[i].fileName, resultArray[i].pageNum, resultArray[i].pageNum, resultArray[i].rotateDeg)
            if (i === (resultArray.length - 1)) {
                masterArray.push(rollingArray)
            }
        }

    }

    function swap(obj) {
        let ret = {};
        for (let key in obj) {
            ret[obj[key]] = key;
        }
        return ret;
    }

    let optionString = ""
    let transposedFileMap = swap(fileMap)
    for (let i = 0; i < masterArray.length; i++) {
        optionString += `${transposedFileMap[masterArray[i][0]]}:${masterArray[i][1]}-${masterArray[i][2]}:${masterArray[i][3]},`
    }

    return JSON.stringify({files:fileMap, options:optionString.slice(0, -1)})
}
