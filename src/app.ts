import express, { Express, json } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { dbConfig } from './config';
import { authRouter, friendshipsRouter, postsRouter, likesRouter, usersRouter, chatsRouter } from './routes';

const PORT: string | number = process.env.port || 8080;

const app: Express = express();

app.use(cors());
app.use(json());

app.use('/auth', authRouter);
app.use('/friendships', friendshipsRouter);
app.use('/posts', postsRouter);
app.use('/likes', likesRouter);
app.use('/users', usersRouter);
app.use('/chats', chatsRouter);

const uri = process.env.MONGODB_URI ?? `mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.NAME}`
const dbOptions = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false
};

mongoose.connect(uri, dbOptions).then(() => {
	console.log('Successfully connected to db');
});

app.listen(PORT, () => {
	console.log(`Server is running on port: ${PORT}`)
});