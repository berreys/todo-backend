import express from 'express';
import { readdirSync } from 'fs';
import path from 'path';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors({
    origin: true
}));
import { Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();
const port = process.env.PORT || 3000;

// Dynamically load each route in ./routes
const loadRoutes = (app: express.Application) => {
    const routesPath = path.join(__dirname, 'routes');
  
    // Read all files from the routes directory
    readdirSync(routesPath).forEach((file) => {
        const route = path.join(routesPath, file);
    
        // Dynamically import each route and use it
        const routeModule = require(route).default;
        const routeName = `/${file.split('.')[0]}`;
    
        // Each route is the name of the file (eg. health.ts -> '/health')
        app.use(routeName, routeModule);
    });
};

// Call the function to load routes
loadRoutes(app);

app.get('/', (req: Request, res: Response) => {
    res.send('Evie\nConnecting EV drivers to thousands of chargers around the country.');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
