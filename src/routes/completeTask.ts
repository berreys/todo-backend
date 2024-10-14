import { Router, Request, Response } from 'express';
import { completeTask } from '../db';

const router = Router();

router.put('/', async (req: Request, res: Response) => {
    try {
        const username: string = req.body.username;
        const index: number = req.body.index;
        await completeTask(username, index);
        res.status(200).send('Success');
    }
    catch(error) {
        console.error('Error completing task:', error);
        res.status(500).send('An error occurred while completing task.');
    }
});

export default router;