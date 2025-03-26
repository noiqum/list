export type loginDTO = {
    email: string,
    password: string
}
export type TFile = {
    "name": string,
    "filetype": string,
    "url": string
}

export type Todo = {
    "tags": [],
    "image": null,
    "file": null,
    "id": string,
    "userId": string,
    "content": string,
    "dueDate": string,
    "completed": false,
    "advice": string
}
export type User = {
    id: string,
    name: string,
    email: string
}
export const baseURL = {
    "development": "https://list-api-7mn9.onrender.com/api",
    "test": "https://list-api-7mn9.onrender.com/api",
    "production": "https://list-api-7mn9.onrender.com/api"

}