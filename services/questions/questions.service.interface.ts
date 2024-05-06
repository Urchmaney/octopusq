import { Question } from "../../models/question";

export interface IQuestionServiceInterface {
    getProjectQuestions() : Promise<Question[]>
    addProjectQuestion(question: Question, projectId: string[]): Promise<Boolean>
}