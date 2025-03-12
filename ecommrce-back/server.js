import express from 'express'
import router from  './routes/PublicRoutes.js'
import cors from 'cors'
import protectedRouter from './routes/PrivateRoutes.js'

const app = express()
const port =  5000

app.use(express.json())
app.use(cors({origin:'http://localhost:5173'}))


app.use("/api", router);//publica
app.use("/api/protegido", protectedRouter);//privada

app.listen(port,()=>{
    console.log(`Servidor rodando na porta:${port}`)
})