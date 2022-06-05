// Def Interface and Type
export interface Answer {
    name: string;
    map: number[][];
    category?: string;
}

// interface StorageData018 {
//     version: '0.1.8';
//     answers: Answers;
//     categories: string[];
// }

export type Answers = Answer[]
export interface AnswerStorageState {
    answers: Answers;
    categories: string[];
    currentCategory: string;
}
export type Errno = '0' | '10001' | '10002' | '20001'
