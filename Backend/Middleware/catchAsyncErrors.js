//we need not to write try and catch again and again
//res req next

module.exports  = theFunc => (req,res,next) => {
    Promise.resolve(theFunc(req,res,next)).catch(next);
};

