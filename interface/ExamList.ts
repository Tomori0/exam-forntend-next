import ExamDetail from "./ExamDetail";

export default interface ExamList {
  categoryId: number
  categoryName: string
  infoList: ExamDetail[]
}