import { Edit2, Plus, ThumbsUp, Trash2 } from 'lucide-react'
import { Button } from '../../shared/ui'
import { NewComment } from '../models/types'
import { highlightText } from '../utils/highligtText'
import { Dispatch, SetStateAction } from 'react'
import { Comment } from '../models/types'
import { useDeleteComment, useUpdateCommentLikes } from '../queries/comments.query'
type CommentsProps = {
  comments: Comment[] | undefined
  postId: number
  searchQuery: string
  setNewComment: Dispatch<SetStateAction<NewComment>>
  setShowAddCommentDialog: Dispatch<SetStateAction<boolean>>
  setSelectedComment: Dispatch<SetStateAction<Comment | null>>
  setShowEditCommentDialog: Dispatch<SetStateAction<boolean>>
}
export const Comments = ({
  comments,
  postId,
  searchQuery,
  setNewComment,
  setShowAddCommentDialog,
  setSelectedComment,
  setShowEditCommentDialog,
}: CommentsProps) => {
  const { mutate: updateLikes } = useUpdateCommentLikes()
  const { mutate: deleteComment } = useDeleteComment()

  const handleLikeComment = (commentId: number, commentLikes: number) => {
    updateLikes({ id: commentId, likes: commentLikes + 1 })
  }

  if (!comments || !Array.isArray(comments)) return null

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>
        <Button
          size="sm"
          onClick={() => {
            setNewComment((prev) => ({ ...prev, postId }))
            setShowAddCommentDialog(true)
          }}
        >
          <Plus className="w-3 h-3 mr-1" />
          댓글 추가
        </Button>
      </div>
      <div className="space-y-1">
        {comments?.map((comment) => (
          <div key={comment.id} className="flex items-center justify-between text-sm border-b pb-1">
            <div className="flex items-center space-x-2 overflow-hidden">
              <span className="font-medium truncate">{comment.user.username}:</span>
              <span className="truncate">{highlightText(comment.body, searchQuery)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm" onClick={() => handleLikeComment(comment.id, comment.likes)}>
                <ThumbsUp className="w-3 h-3" />
                <span className="ml-1 text-xs">{comment.likes}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedComment(comment)
                  setShowEditCommentDialog(true)
                }}
              >
                <Edit2 className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => deleteComment(comment.id)}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
