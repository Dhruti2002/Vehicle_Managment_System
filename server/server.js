const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path'); 

const app = express();

const allowedOrigins = ['http://localhost:5173'];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true // Allow credentials (cookies, authorization headers)
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up static folder for images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer setup for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage: storage });

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'vehicle_portal'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL connected...');
});

// Mock session storage
let currentUser = null; // Simple variable to store logged-in user

// Register
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  // Validate input
  if (!name || !email || !password) {
    return res.status(400).send('Name, email, and password are required');
  }

  // Hash the password
  const hashedPassword = bcrypt.hashSync(password, 10);

  db.query(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, hashedPassword],
    (err) => {
      if (err) return res.status(500).send('Server error during registration');
      res.status(201).send('Registration successful');
    }
  );
});

// Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
    if (err) return res.status(500).send('Server error during login');
    if (result.length === 0) return res.status(404).send('User not found');

    const user = result[0];
    const passwordValid = bcrypt.compareSync(password, user.password);
    if (!passwordValid) return res.status(401).send('Invalid password');

    currentUser = { id: user.id, name: user.name };
    console.log(`User logged in: ${user.name}`); // Log successful login
    res.status(200).send({ message: 'Login successful', name: user.name });
  });
});

// Logout
app.post('/logout', (req, res) => {
  currentUser = null; // Clear the currentUser
  console.log(`User logged out`); // Log logout action
  res.send('Logout successful');
});

// Check Authentication
app.get('/check-auth', (req, res) => {
  if (currentUser) {
      return res.status(200).send('User is logged in');
  } else {
      return res.status(403).send('User not logged in');
  }
});

// Fetch all vehicles for the logged-in user
app.get('/vehicles', (req, res) => {
  if (!currentUser) {
    return res.status(403).send('User not logged in');
  }

  db.query('SELECT * FROM vehicles WHERE user_id = ?', [currentUser.id], (err, results) => {
    if (err) return res.status(500).send('Error fetching vehicles');
    res.status(200).json(results);
  });
});

// Add Vehicle
app.post('/vehicles', upload.single('vehicleImage'), (req, res) => {
  const { model, registrationNumber, vehicleType, purchaseDate } = req.body;
  const vehicleImage = req.file ? `/uploads/${req.file.filename}` : null;

  // Ensure currentUser is set and has an id
  if (!currentUser) {
    return res.status(403).send('User not logged in');
  }

  db.query(
    'INSERT INTO vehicles (model, registration_number, vehicle_type, purchase_date, vehicle_image, user_id) VALUES (?, ?, ?, ?, ?, ?)',
    [model, registrationNumber, vehicleType, purchaseDate, vehicleImage, currentUser.id],
    (err) => {
      if (err) return res.status(500).send('Error adding vehicle');
      res.status(201).send('Vehicle added successfully');
    }
  );
});

app.get('/maintenance', (req, res) => {
  if (!currentUser) {
      return res.status(403).send('User not logged in');
  }
  db.query('SELECT * FROM maintenance WHERE user_id = ?', [currentUser.id], (err, results) => {
      if (err) {
          console.error('Database query error:', err);
          return res.status(500).send('Error fetching maintenance records');
      }
      res.status(200).json(results);
  });
});

app.post('/maintenance', (req, res) => {
  if (!currentUser) {
      return res.status(403).send('User not logged in');
  }
  const { vehicleId, maintenanceType, maintenanceDate, cost } = req.body;
  db.query(
      'INSERT INTO maintenance (vehicle_id, maintenance_type, maintenance_date, cost, user_id) VALUES (?, ?, ?, ?, ?)',
      [vehicleId, maintenanceType, maintenanceDate, cost, currentUser.id],
      (err) => {
          if (err) {
              console.error('Error adding maintenance record:', err);
              return res.status(500).send('Error adding maintenance record');
          }
          res.status(201).send('Maintenance record added successfully');
      }
  );
});
// Fetch the current logged-in user
app.get('/users', (req, res) => {
  if (!currentUser) {
      return res.status(403).send('User not logged in');
  }

  db.query('SELECT id, name, email FROM users WHERE id = ?', [currentUser.id], (err, results) => {
      if (err) {
          console.error('Error fetching user:', err);
          return res.status(500).send('Error fetching user');
      }
      // Return the single user object
      res.status(200).json(results[0]);
  });
});

// Update user profile
app.put('/users', (req, res) => {
  if (!currentUser) {
      return res.status(403).send('User not logged in');
  }

  const { name, email } = req.body;

  // Validate input
  if (!name || !email) {
      return res.status(400).send('Name and email are required');
  }

  db.query(
      'UPDATE users SET name = ?, email = ? WHERE id = ?',
      [name, email, currentUser.id],
      (err) => {
          if (err) {
              console.error('Error updating user:', err);
              return res.status(500).send('Error updating user');
          }
          res.status(200).send('Profile updated successfully');
      }
  );
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});