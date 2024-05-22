const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const { MongoClient, GridFSBucket, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const { createCanvas, loadImage } = require('canvas');
const jwt = require('jsonwebtoken');
const { z: zod } = require('zod');
const app = express();
const port = 3000;

const mongoURI = 'mongodb://localhost:27017';
const dbName = 'imageStore';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/hevc', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only JPG, PNG, and MP4 files are allowed'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

let db;
let gridFSBucket;

MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        db = client.db(dbName);
        gridFSBucket = new GridFSBucket(db);
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1);
    });

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.collection('users').insertOne({ username, password: hashedPassword });

        if (result && result.ops && result.ops.length > 0) {
            console.log('User registered:', result.ops[0]);
            res.redirect('/login/login.html');
        } else {
            console.error('Failed to register user: No data returned from MongoDB');
            res.status(500).send('Internal Server Error');
        }
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await db.collection('users').findOne({ username });

        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                res.send('Login successful');
            } else {
                res.status(401).send('Invalid username or password');
            }
        } else {
            res.status(401).send('Invalid username or password');
        }
    } catch (err) {
        console.error('Error finding user:', err);
        res.status(500).send('Internal Server Error');
    }
});


// Define the schema for user data
const userSchema = zod.object({
  username: zod.string().min(3),
  password: zod.string().min(6),
});

// Sample database of users (replace this with your actual database)
const users = [
  { id: 1, username: 'user1', password: 'password1' },
  { id: 2, username: 'user2', password: 'password2' },
  // Add more users as needed
];

// Generate JWT token for authentication
function generateToken(userId) {
  return jwt.sign({ userId }, 'your_secret_key', { expiresIn: '1h' });
}

// Authenticate user and generate token
function authenticateUser(username, password) {
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    throw new Error('Invalid username or password');
  }
  return generateToken(user.id);
}

// Verify JWT token
function verifyToken(token) {
  return jwt.verify(token, 'your_secret_key');
}


function encryptImageData(imageData) {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        data[i] ^= 255;
        data[i + 1] ^= 255;
        data[i + 2] ^= 255;

        const temp = data[i];
        data[i] = data[i + 1];
        data[i + 1] = data[i + 2];
        data[i + 2] = temp;
    }
    return imageData;
}

app.post('/upload', upload.single('image'), async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).send('No file uploaded');
        }

        const img = await loadImage(file.buffer);
        const canvas = createCanvas(img.width, img.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, img.width, img.height);

        const imageData = ctx.getImageData(0, 0, img.width, img.height);

        encryptImageData(imageData);

        ctx.putImageData(imageData, 0, 0);

        const encryptedBuffer = canvas.toBuffer('image/jpeg');

        const readableStream = require('stream').Readable.from(encryptedBuffer);

        const options = {
            contentType: 'image/jpeg',
            metadata: {
                originalname: file.originalname,
            }
        };

        const uploadStream = gridFSBucket.openUploadStream(file.originalname, options);
        readableStream.pipe(uploadStream);

        uploadStream.on('error', err => {
            console.error('Error uploading file to GridFS:', err);
            res.status(500).send('Internal Server Error');
        });

        uploadStream.on('finish', () => {
            res.status(200).send('File uploaded successfully');
        });
    } catch (err) {
        console.error('Error handling file upload:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/image/:id', (req, res) => {
    const imageId = req.params.id;
    const objectId = new ObjectId(imageId);
    const downloadStream = gridFSBucket.openDownloadStream(objectId);

    downloadStream.pipe(res);
    downloadStream.on('error', err => {
        console.error('Error retrieving image:', err);
        res.status(404).send('Image not found');
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
