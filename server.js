const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const bookRoutes = require('./routes/bookRoutes');
const projectRoutes = require('./routes/projectRoutes');
const examRoutes = require('./routes/examRoutes');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());




/// It is Work ???
app.get('/', (req, res) => {
  res.json({ 
    message: '👋 مرحباً بك في مكتبتي API!',
    version: '1.0.0'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/exams', examRoutes);




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 السيرفر يعمل على http://localhost:${PORT}`);
});