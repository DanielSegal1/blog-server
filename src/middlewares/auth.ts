import jwt from 'jsonwebtoken';
import { authConfig } from '../config';

const verifyToken = (req, res, next) => {
	const token = req.headers["x-access-token"];

	if (!token)  {
		return res.status(403).send({ message: "No token was Provided"});
	}

	jwt.verify(token, authConfig.secret, (err, decoded) => {
		if (err) {
			return res.status(401).send({ message: "Unauthorized"});
		}

		req.userId = decoded.id;
		next();
	});
};

export default {
	verifyToken
};
