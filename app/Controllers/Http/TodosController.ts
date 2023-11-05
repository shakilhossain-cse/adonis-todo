import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'

import Todo from 'App/Models/Todo'

export default class TodosController {
  /**
   * index method
   * @return all todo
   */
  public async index() {
    const todos = await Todo.query().preload('author').preload('comments').paginate(1, 20)
    return todos
  }

  /**
   * store method
   */
  public async store({ request, response, auth }: HttpContextContract) {
    try {
      const todoValidationSchema = schema.create({
        title: schema.string(),
        is_completed: schema.boolean(),
      })
      // validate  user request
      const payload = await request.validate({
        schema: todoValidationSchema,
      })
      // create todo instance
      const todo = new Todo()
      todo.title = payload.title
      todo.is_completed = payload.is_completed
      todo.user_id = auth.use('api').user?.id ?? 1

      await todo.save()

      // send created success response
      response.created({ message: 'Todo created successfully' })
    } catch (error) {
      console.error(error)
      // error message
      response.internalServerError({ message: 'Something went wrong' })
    }
  }

  /**
   * distroy method
   */
  public async destroy({ response, params, auth }: HttpContextContract) {
    try {
      const authenticatedUser = auth.user

      if (!authenticatedUser) {
        return response.status(401).send({ message: 'Unauthorized' })
      }

      const todo = await Todo.findOrFail(params.id)

      if (todo.user_id !== authenticatedUser.id) {
        return response
          .status(403)
          .send({ message: "You don't have permission to delete this Todo" })
      }

      // Delete the Todo
      await todo.delete()

      return response.status(200).send({ message: 'Todo deleted successfully' })
    } catch (error) {
      console.error(error)
      return response.status(500).send({ message: 'Something went wrong' })
    }
  }
}
