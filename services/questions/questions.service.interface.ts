import { Question } from "../../models/question";

export interface IQuestionServiceInterface {
    getProjectQuestions(projectId: string[]) : Promise<Question[]>
    addProjectQuestion(question: Question, projectId: string[]): Promise<Question>
}