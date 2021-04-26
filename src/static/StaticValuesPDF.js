export const FILE_TYPE_LIMIT = 'PDF';
export const FILE_SIZE_LIMIT_MB = 50;
export const FILE_AMOUNT_LIMIT = 20;

export const FILE_TYPE_INVALID_MSG = `Invalid file(s). Please upload ${FILE_TYPE_LIMIT} files only.`;
export const FILE_SIZE_INVALID_MSG = `PDF size should be under ${FILE_SIZE_LIMIT_MB.toString()} MB each.`;
export const FILE_AMOUNT_INVALID_MSG = `You can only upload up to ${FILE_AMOUNT_LIMIT.toString()} PDFs`;

export const FILE_PASSED_VALIDATION = "File(s) are valid";