export const printErrorTrace = (
    func: any,
    error: any,
    includeStackTrace: boolean,
) => {
    console.log(`Error occured at ${func.name}`);
    console.log('Error code : ' + error.errorCode);
    console.log('Error message : ' + error.message);

    if (includeStackTrace) {
        console.log('Stack trace is ON');
        console.log(error);
    }
};
