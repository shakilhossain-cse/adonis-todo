import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Comment from 'App/Models/Comment'

export default class CommentsController {
  /**
   * store comment
   */
  public async store({ request, response, auth }: HttpContextContract) {
    try {
      const comment = new Comment()
      comment.comment = request.input('comment')
      comment.user_id = auth.use('api').user?.id ?? 1
      comment.todo_id = request.input('todo_id')
      comment.save()
      response.created({ message: 'Comment added successfully' })
    } catch (error) {
      console.log(error)
      response.internalServerError({ message: 'someting went wrong' })
    }
  }
}
