// -----------------------ERROR MIDDLEWARE----------------------------------

const errorMiddleware = (err, req, res, next) => {
    console.log(err)
    return res.status(500).send({ status: false, msg: "something went wrong", err });
};

module.exports = errorMiddleware;