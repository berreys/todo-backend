import { MongoClient, InsertOneResult } from 'mongodb';
import { UserInfo, Task } from './types';

const config = {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    hostname: process.env.DB_HOSTNAME
}

const url: string = `mongodb+srv://${config.username}:${config.password}@${config.hostname}`;
const client: MongoClient = new MongoClient(url);

export async function loginOrRegister(username: string) : Promise<UserInfo | null> {
    let userInfo = await login(username);
    if(userInfo !== null) return userInfo;
    return register(username);
}

async function login(username: string) : Promise<UserInfo | null> {
    try {
        await client.connect();
        const database = client.db('todo-db');
        const collection = database.collection('userInfo');
        const document = await collection.findOne({username: username});
        if(document === null) return null;
        return {
            username: document.username,
            tasks: document.tasks
        }
    }
    catch(error) {
        console.error("Error logging in:", error);
        return null;
    }
    finally {
        await client.close();
    }
}

async function register(username: string) : Promise<UserInfo | null> {
    try {
        await client.connect();
        const database = client.db('todo-db');
        const collection = database.collection('userInfo');
        const userInfoToInsert: UserInfo = {
            username: username,
            tasks: []
        } 
        const result: InsertOneResult = await collection.insertOne(userInfoToInsert);
        console.log("Success adding", result);
        return userInfoToInsert;
    }
    catch(error) {
        console.error("Error registering user:", error);
        return null;
    }
    finally {
        await client.close();
    }
}

export async function addItem(username: string, task: Task) {
    try {
        await client.connect();
        const database = client.db('todo-db');
        const collection = database.collection<UserInfo>('userInfo');
        const result = await collection.updateOne(
            { username: username },
            { $push: { tasks: task } }
        );

        if(result.matchedCount === 0) {
            console.log("User not found");
        }
        else {
            console.log("Task added successfully");
        }
    }
    catch(error) {
        console.error("Error adding task:", error);
    }
    finally {
        await client.close();
    }
}

export async function editItem(username: string, index: number, newText: string) {
    try {
        await client.connect();
        const database = client.db('todo-db');
        const collection = database.collection('userInfo');
        const result = await collection.updateOne(
            { username: username },
            { $set: { [`tasks.${index}.text`]: newText } }
        );

        if(result.matchedCount === 0) {
            console.log("User not found or invalid index");
        }
        else {
            console.log("Task edited successfully");
        }
    }
    catch(error) {
        console.error("Error editing text:", error);
    }
    finally {
        await client.close();
    }
}

export async function removeTask(username: string, index: number) {
    try {
        await client.connect();
        const database = client.db('todo-db');
        const collection = database.collection('userInfo');
        const document = await collection.findOne({ username: username });
        if(!document){
            console.log("User not found");
            return;
        }
        const updatedTasks = document.tasks.filter((_:any, i:any) => index !== i);
        const result = await collection.updateOne(
            { username: username},
            { $set: { tasks: updatedTasks}}
        )
        if(result.modifiedCount > 0) {
            console.log("Successfully edited task.");
        }
        else {
            console.log("No tasks were edited.");
        }
    }
    catch(error) {
        console.error("Error removing item:", error);
    }
    finally {
        await client.close();
    }
}

export async function completeTask(username: string, index: number) {
    try {
        await client.connect();
        const database = client.db('todo-db');
        const collection = database.collection('userInfo');
        const result = await collection.updateOne(
            { username: username },
            { $set: { [`tasks.${index}.state`]: 'complete' } }
        )
        
        if(result.matchedCount === 0) {
            console.log("User not found or invalid index");
        }
        else {
            console.log("Task completed");
        }
    }
    catch(error) {
        console.error("Error completing task:", error);
    }
    finally {
        await client.close();
    }
}