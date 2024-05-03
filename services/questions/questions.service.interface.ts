import { Question } from "../../models/question";

export interface IQuestionServiceInterface {
    getQuestion() : Promise<Question[]>
    addQuestion(question: Question): Promise<Boolean>
}