import { Router, Request, Response } from 'express';
import { loginOrRegister } from '../db';
import { UserInfo } from '../types';

const router = Router();

router.get('/:username', async (req: Request, res: Response) => {
    try {
        const username: string = req.params.username;
        const result: UserInfo | null = await loginOrRegister(username);
        if(result !== null) {
            res.status(210).send(result);
        }
        else {
            res.status(400).send('Failed to login.');
        }
    }
    catch(error) {
        console.error('Error adding user:', error);
        res.status(500).send('An error occurred while logging in.');
    }
});

export default router;