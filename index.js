const express = require('express')
const {PORT} = require('./src/config/serverConfig.js')
const morgan = require('morgan')
const { createProxyMiddleware } = require('http-proxy-middleware')
const rateLimit = require('express-rate-limit')
const axios = require('axios')

const app = express()

const limiter = rateLimit({
	windowMs: 2 * 60 * 1000, // 2 minutes
	limit: 5 // Limit each IP to 5 requests per `window` (here, per 2 minutes)
})


app.use(morgan('combined'))
app.use(limiter)

app.use('/bookingservice', async (req, res, next) => {
  const token = req.headers['x-access-token'];

  try {
    const response = await axios.get('http://localhost:3001/api/v1/isAuthenticated', {
      headers: {
        'x-access-token': token
      }
    });

    if (response.data.success) {
      return next();
    } else {
      return res.status(401).json({ message: 'Unauthorized' });
    }

  } catch (error) {
    if (error.response && error.response.status === 401) {
      return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
    }

    console.log('Unexpected Error:', error.message);

    return res.status(500).json({
      message: 'Something went wrong',
      error: error.message
    });
  }
});


app.use('/bookingservice',createProxyMiddleware({target:'http://localhost:3002',changeOrigin:true}))

app.get('/home',(req,res) => {
    return res.json({message:"OK"})
})

app.listen(PORT,() => {
    console.log(`Server started on Port : ${PORT}`);
    
})