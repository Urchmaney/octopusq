import { Question } from "../../models/question.model";

export interface IQuestionService {
    getQuestion() : Promise<Question[]>
    addQuestion(question: Question): Promise<Boolean>
}