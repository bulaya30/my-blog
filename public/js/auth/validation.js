function checkPhone(val) {
    let pattern =/^[\+]?\d{0,3}-{1}\d{9}$/;
    return pattern.test(val)
}
function checkName(val) {
    let pattern = /^[a-zA-Z_]+[a-zA-Z0-9_.-\s]+$/
    return pattern.test(val)
}
function checkString(val) {
    return val.length > 0
}
function checkNumber(val) {
    let pattern = /[0-9]$/
    return pattern.test(val)
}
function checkMail(val) {
    let pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return pattern.test(val)

}
function checkPassword(val) {
    let pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
    return pattern.test(val)
}
function checkURL(val) {
    let pattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i
    return pattern.test(val)
}
function checkImage(file) {
    const allowedTypes = ['image/jpeg', 'image/png',  'image/gif']
    const maxSize = 5 * 1024 * 1024 // 5MB
    if(!allowedTypes.includes(file.type)) {
        return 'Invalid file type. Only JPEG, PNG and GIF are allowed'
    }
    if(file.sise > maxSize) {
        return `File size exceeds the maximum allowed size of ${maxSize/1024/1024}MB`
    }
    return true
}