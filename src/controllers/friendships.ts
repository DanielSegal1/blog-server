import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { User } from '../models';

const follow = async (req: AuthenticatedRequest, res: Response) => {
	try {
		const followingUserId = req.userId;
		const {id: followedUserId} = req.params;

		if  (followingUserId === followedUserId) {
			return res.status(400).send({ message: 'You cant follow yourself'});
		}

		const followingUser = await User.findById(followingUserId);
		const followedUser = await User.findById(followedUserId);

		if (!followingUser || !followedUser) {
			return res.status(400).send({ message: 'couldn\'t find the users' });
		}

		if (!followingUser.following.includes(followedUserId)) {
			followingUser.following = [...followingUser.following, followedUserId];
			await followingUser.save();
		}

		if (!followedUser.followers.includes(followingUserId)) {
			followedUser.followers = [...followedUser.following, followingUserId];
			await followedUser.save();
		}
	}
	catch {
		return res.status(400).send({ message: 'couldn\'t perform the follow' });
	}

	return res.sendStatus(200);
}

const unfollow = async (req: AuthenticatedRequest, res: Response) => {
	try {
		const unfollowingUserId = req.userId;
		const {id: unfollowedUserId} = req.params;

		if (unfollowingUserId === unfollowedUserId) {
			return res.status(400).send({ message: 'You cant unfollow yourself'});
		}

		const unfollowingUser = await User.findById(unfollowingUserId);
		const unfollowedUser = await User.findById(unfollowedUserId);

		if (!unfollowingUser || !unfollowedUser) {
			return res.status(400).send({ message: 'couldn\'t find the users' });
		}

		unfollowingUser.following = unfollowingUser.following.filter(id => id != unfollowedUserId);
		unfollowedUser.followers = unfollowedUser.followers.filter(id => id != unfollowingUserId);

		await unfollowingUser.save();
		await unfollowedUser.save();
	}
	catch {
		return res.status(400).send({ message: 'couldn\'t perform the follow' });
	}

	return res.sendStatus(200);
}

export default {
	follow,
	unfollow
};
