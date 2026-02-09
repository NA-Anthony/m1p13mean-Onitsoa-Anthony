const mongoose = require('mongoose');

mongoose.connect(
  'mongodb+srv://nakanyanthony_db_user:L5qB9uO2ycKODbbL@cluster0.7dkjyap.mongodb.net/mean_db?retryWrites=true&w=majority'
)
.then(() => console.log('MongoDB Atlas connected ✅'))
.catch(err => console.error('MongoDB connection error ❌', err));
