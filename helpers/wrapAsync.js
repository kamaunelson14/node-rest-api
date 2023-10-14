// handle exceptions inside of async routes and pass them to express error handler
const wrapAsync = function wrapAsync(fn){
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    }
}

module.exports = wrapAsync;