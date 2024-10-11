import { MongoClient, InsertOneResult } from 'mongodb';
import { UserInfo } from './types';

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
    return null;
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