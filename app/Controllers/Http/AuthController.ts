import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class AuthController {
  /**
   * register method
   */
  public async register({ request, response, auth }: HttpContextContract) {
    try {
      const userData = request.only(['name', 'email', 'password'])
      const user = await User.create(userData)
      const token = await auth.use('api').generate(user)
      return response.status(201).json({
        message: 'User registered successfully',
        user,
        token,
      })
    } catch (error) {
      console.error(error)

      response.status(500).json({
        message: 'Something went wrong during user registration',
      })
    }
  }

  /**
   * login method
   */
  public async login({ request, response, auth }: HttpContextContract) {
    const { email, password } = request.only(['email', 'password'])
    try {
      const user = await User.findBy('email', email)

      if (!user) {
        return response.status(404).json({
          message: 'User not found',
        })
      }
      const token = await auth.attempt(email, password)
      return response.status(200).json({
        message: 'Login successful',
        user,
        token,
      })
    } catch (error) {
      console.error(error)

      response.status(500).json({
        message: 'Something went wrong during login',
      })
    }
  }
}
