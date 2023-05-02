export default interface Page<T> {
  content: T
  totalPages: number
  empty: boolean
}