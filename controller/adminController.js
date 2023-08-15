const { generateToken } = require("../config/authenticate");
const { pool } = require("../config/db");

const adminSignUp = async (req, res) => {
  const { name, email, password } = req.body;
  //check if user already exists
  const isExist = await pool.query(
    "select email from public where email = $1",
    [email]
  );
  if (isExist.rowCount >= 1) {
    return res.json({ msg: "admin user already exists" });
  }

  const result = await pool.query(
    "insert into public(name, email, password, isAdmin) values($1,$2,$3,$4) returning *",
    [name, email, password, true]
  );
  const token = await generateToken(result.rows[0].id);
  return res.json({
    data: result.rows[0],
    msg: "admin created successfully",
    token: token,
  });
};
const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  //check if user already exists
  const isExist = await pool.query("select * from public where email = $1", [
    email,
  ]);
  console.log(isExist.rowCount);
  if (isExist.rowCount == 0) {
    return res.json({ success: false, msg: "wrong credentials" });
  } else {
    const isPasswordMatch = comparePassword(isExist.rows[0].password, password);
    if (!isPasswordMatch) {
      return res.json({ success: false, msg: "wrong credentials" });
    }
    const token = await generateToken(isExist.rows[0].id);
    return res.json({
      data: isExist.rows[0],
      msg: "user loggedIn successfully",
      token: token,
    });
  }
};

const createCourse = async (req, res) => {
  console.log(req.body)
  const { title, description, price, imagelink, published } = req.body;
  if(!title || !description || !price || !imagelink){
    return res.json({success:false, msg:'Please provide all the data'})
  }
  
  const result = await pool.query(
    "insert into course(title, description,price,imagelink,published) values($1,$2,$3,$4,$5) returning *",
    [title, description, price, imagelink, published]
  );
  return res.json({ data: result.rows[0], msg: "course created" });
};
const getAllCourse = async (req, res) => {
  const result = await pool.query("select * from course");

  return res.json({ courses: result.rows });
};

const getCourseById = async (req, res) => {
  const id = parseInt(req.params.courseId);
  const result = await pool.query(`select * from course where courseId = $1`, [
    id,
  ]);
  if(result.rowCount === 0){
    return res.json({msg:'No course is available for given Id'})
  }
  return res.json({ course: result.rows[0] });
};
const deleteCourse = async (req, res) => {
  const id = parseInt(req.params.courseId);
  const result = await pool.query(`delete from course where courseId = $1 returning *`, [
    id,
  ]);
  return res.json({ deletedRows: result.rows[0], msg: "course deleted" });
};
const updateCourse = async (req, res) => {
  const id = parseInt(req.params.courseId);
  const { title, description, price, imagelink, published } = req.body;
  const result = await pool.query(
    `update course set title = $1, description = $2, price = $3, imageLink = $4, published = $5 where courseId = $6`,
    [title, description, price, imagelink, published, id]
  );
  return res.json({ data: result.rows[0], msg: "course updated" });
};

module.exports = {
  adminSignUp,
  adminLogin,
  createCourse,
  getAllCourse,
  getCourseById,
  deleteCourse,
  updateCourse,
};

//Utitlities functions
const comparePassword = (dbPassword, incomingPassword) => {
  return dbPassword === incomingPassword;
};

