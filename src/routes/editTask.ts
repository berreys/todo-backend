import { Router, Request, Response } from 'express';
import { editItem } from '../db';

const router = Router();

router.put('/', async (req: Request, res: Response) => {
    try {
        const username: string = req.body.username;
        const index: number = req.body.index;
        const newText: string = req.body.newText;
        await editItem(username, index, newText);
        res.status(200).send('Success');
    }
    catch(error) {
        console.error('Error editing task:', error);
        res.status(500).send('An error occurred while editing task.');
    }
});

export default router;