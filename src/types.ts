export interface Task {
    state: 'pending' | 'complete';
    text: string;
}

export interface UserInfo {
    username: string;
    tasks: Task[];
}