module.exports = asyncErrorAsTryCatch => (req, res, next) => {
    Promise.resolve(asyncErrorAsTryCatch(req, res, next)).catch(next);
}