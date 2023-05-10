const mongoose= require("mongoose")
const connectDB =async()=>{
    try{
        const connect = await mongoose.connect(process.env.MONGO_URL)
        console.log(`connection to mongodb database ${mongoose.connection.host}`)

    }catch(error){
        console.log(`mongodb eroor ${error}`)
    }

};

module.exports= {connectDB} ;