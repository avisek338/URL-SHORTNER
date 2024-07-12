const express  = require('express')
const app = express()
const connectDB  = require('./DB/connect')
const urlRouter = require('./router/urls')
require('dotenv').config()


app.use(express.static('public'))

app.use(express.json())
//router
app.get('/',(req,res)=>{

    res.send('hello');
})
app.use('/api',urlRouter)


const port = process.env.PORT || 4000
const url = process.env.MONGO_URI

const start = async()=>{
    try{
      await connectDB(url)
      app.listen(port,()=>{
        console.log(`server is listening at port ${port}`)
      })
    }catch(e){
        console.log(e);
    }
}
start()