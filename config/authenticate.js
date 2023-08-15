const jwt = require("jsonwebtoken");
const { pool } = require("./db");

const generateToken = async (id) => {
  console.log(id);
  return await jwt.sign({ id: id }, process.env.SECRET_KEY, {
    expiresIn: process.env.EXPIRE_JWT,
  });
};

const userAuthenticate = async (req, res, next) => {
  const token = req.headers.bearertoken;
  if (token) {
    const verify = await jwt.verify(token, process.env.SECRET_KEY);
    const result = await pool.query(
      "select * from public where id = $1",
      [verify.id]
    );
    return next();

  }
  return res.json({
    success: false,
    msg: "Please login to access the resource",
  });
};

const adminAuthenticate = async (req, res, next) => {
  const token = req.headers.bearertoken;
  if (token) {
    const verify = await jwt.verify(token, process.env.SECRET_KEY);
    const result = await pool.query(
      "select * from public where id = $1",
      [verify.id]
    );
    const admin = result.rows[0].isadmin;
    if (!admin) {
      return res.json({
        success: false,
        msg: "Ypu are not allowed to access this resource, please contact admin",
      });
    }
    return next();
  }
  return res.json({
    success: false,
    msg: "Please login to access the resource",
  });
};


module.exports = { generateToken, userAuthenticate, adminAuthenticate };
