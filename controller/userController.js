const { generateToken } = require("../config/authenticate");
const { pool } = require("../config/db");

const userSignUp = async (req, res) => {
  const { name, email, password } = req.body;
  //check if user already exists
  const isExist = await pool.query(
    "select email from public where email = $1",
    [email]
  );
  if (isExist.rowCount >= 1) {
    return res.json({ msg: "user already exists" });
  }

  const result = await pool.query(
    "insert into public(name, email, password, isAdmin) values($1,$2,$3,$4) returning *",
    [name, email, password, false]
  );
  const token = await generateToken(result.rows[0].id);
  return res.json({
    data: result.rows[0],
    msg: "user created successfully",
    token: token,
  });
};
const userLogin = async (req, res) => {
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

const updateUser = async (req, res) => {
  const { publicId } = parseInt(req.params.publicId);
  const { name, email, password } = req.body;
  const result = await pool.query(
    "update public set name = $1, email = $2, password = $3 where id = $4",
    [name, email, password, publicId]
  );
  return res.json({
    success: true,
    msg: "user updated successfully",
    user: result.rows[0],
  });
};
const deleteUser = async (req, res) => {
  const { publicId } = parseInt(req.params.publicId);
  const result = await pool.query(
    `delete from public where id = $1 returning *`,
    [publicId]
  );
  return res.json({
    deletedRows: result.rows[0],
    message: "user deleted deleted",
  });
};

const purchaseCourse = async (req, res) => {
  const { publicid } = req.body;
  console.log(publicid);
  const courseid = parseInt(req.params.courseId);
  const addingCourse = await pool.query(
    "update public set courseid = array_append(courseid, $1) where id= $2",
    [courseid, publicid]
  );
  console.log(addingCourse);
  const purchased = await pool.query(
    "select * from course where courseId = $1",
    [courseid]
  );
  console.log(purchased.rows[0])
  return res.json({ purchasedCourse: purchased.rows[0] });
};
const getPurchasedCourse = async (req, res) => {
  const { publicid } = req.body;
  const courseIds = await pool.query(
    "select courseId from public where publicId = $1",
    [publicid]
  );
  console.log(courseIds)

  const purchasedCourses = await pool.query(
    "select * from course where courseId = ANY($1::int[])",
    [courseIds.rows[0].courseid]
  );
  return res.json({ courses: purchasedCourses.rows });
};

module.exports = {
  userLogin,
  userSignUp,
  getPurchasedCourse,
  purchaseCourse,
  updateUser,
  deleteUser,
};

//Utitlities functions
const comparePassword = (dbPassword, incomingPassword) => {
  return dbPassword === incomingPassword;
};
