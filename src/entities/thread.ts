export function getThreadId(boardId: string, postN: string): string {
  return boardId + ":" + postN
}