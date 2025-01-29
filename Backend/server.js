const express = require('express');
const path = require('path');
const multer = require('multer');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());  
const port = 3000;

const db = mysql.createConnection({
  host: 'localhost', 
  user: 'root', 
  password: 'password', 
  database: 'clickFit'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});


const createUsersTable = `
CREATE TABLE IF NOT EXISTS users (
  ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) CHARACTER SET 'utf8mb4' NOT NULL,
  password VARCHAR(255) CHARACTER SET 'utf8mb4' NOT NULL,
  type VARCHAR(255) CHARACTER SET 'utf8mb4' NOT NULL,
  active TINYINT DEFAULT 1
);
`;
db.query(createUsersTable, (err) => {
  if (err) {
    console.error('Error creating users table:', err);
  } else {
    console.log('Users table is ready.');
  }
});

const createStoredProcedure = `
DELIMITER $$

CREATE PROCEDURE IF NOT EXISTS addUser(
    IN userEmail VARCHAR(255),
    IN userPassword VARCHAR(255),
    IN userType VARCHAR(255),
    IN userActive TINYINT
)
BEGIN
    INSERT INTO users (email, password, type, active)
    VALUES (userEmail, userPassword, userType, userActive);
END $$

DELIMITER ;
`;
db.query(createStoredProcedure, (err) => {
  if (err) {
    console.error('Error creating stored procedure:', err);
  } else {
    console.log('Stored procedure addUser is ready.');
  }
});


app.post('/add-user', (req, res) => {
  const { email, password, type, active } = req.body;

  const query = 'CALL addUser(?, ?, ?, ?)';
  db.execute(query, [email, password, type, active], (err, results) => {
    if (err) {
      console.error('Error adding user:', err);
      return res.status(500).json({ message: 'Error adding user' });
    }

    res.status(200).json({ message: 'User added successfully', results });
  });
});


const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');  
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);  
  }
});
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  }
});


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use(express.static(path.join(__dirname, '../Frontend')));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../Frontend/index.html'));
});


app.post('/upload', upload.single('image'), (req, res) => {
  if (req.file) {
    res.status(200).send({ filePath: 'uploads/' + req.file.filename });
  } else {
    res.status(400).send({ message: 'Failed to upload image.' });
  }
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
