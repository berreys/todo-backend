import { Router, Request, Response } from 'express';
import { addItem } from '../db';
import { UserInfo, Task } from '../types';

const router = Router();

router.put('/', async (req: Request, res: Response) => {
    try {
        const username: string = req.body.username;
        const task: Task = req.body.task;
    
        if (!username || !task || !task.state || !task.text) {
            res.status(400).send('Invalid request data');
        
        }
        await addItem(username, task);
        res.status(200).send('Success');
    }
    catch(error) {
        console.error('Error adding task:', error);
        res.status(500).send('An error occurred while adding task.');
    }
});

export default router;