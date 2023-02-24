//imports
import express from 'express';
import cookieParser from 'cookie-parser';

//routes imports
import { authenticationRouter } from './routes/authenticationRouter.mjs';
import registerRouter from './routes/registerRouter.mjs';
import { userRouter } from './routes/userRouter.mjs';

//constants
const app = express();
const PORT = process.env.PORT || 3000;

//middlewares
app.use(express.json());
app.use(cookieParser())

//routes
app.use('/register', registerRouter);
app.use('/auth', authenticationRouter);
app.use('/users', userRouter)


app.listen(PORT, () => {
    console.log('Server is running on port %s', PORT)
})

