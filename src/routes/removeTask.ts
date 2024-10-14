import { Router, Request, Response } from 'express';
import { removeTask } from '../db';

const router = Router();

router.delete('/', async (req: Request, res: Response) => {
    try{
        const username = req.body.username;
        const index = req.body.index;
        await removeTask(username, index);
        res.status(200).send('Task removed.');
    }
    catch(error) {
        console.error("Error removing task:", error);
        res.status(500).send('An error occurred while removing a task.');
    }
});

export default router;