export type TPlayer = {
    id: string;
    type: 'human' | 'ai';
    name: string;
    path: number;
    color: string;
    index?: number;
    last_path?: number;
    roll?: number;
};

export type TTile = {
    type: 'plain',
    occupants: string[];
    edge: boolean;
    path: number;
    index: number;
};