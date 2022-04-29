import { Request, Response } from "express";
import { CreateUserDTO } from "../models/dto/UserDTO";
import UserRepository from "../models/repositories/UserRepository" ;
import { loginSchema, registerSchema } from "../models/validators/userSchemas";

export default class AuthController{
  public readonly login = async (req:Request, res: Response) => {
    const credencials = req.body

    try{
      await loginSchema.validateAsync(credencials)
    }catch (err) {
      res.status(400).json({ error: err.message})
      return
    }

    const repository = new UserRepository()

    const userFRomDb = await repository.findByEmail(credencials.email)

    if (!userFRomDb || userFRomDb.password !== credencials.password){
    res.status(401).json({message: 'invalid Credentials'})
  }
    res.sendStatus(200)
  }

  public readonly register = async (req: Request, res: Response) => {
    const user = req.body as CreateUserDTO

    try{
      await registerSchema.validateAsync(user)
    }catch (error) {
      res.status(400).json ({error: error.message})
      return
    }

    const repository = new UserRepository()
    const newUser = await repository.create(user)

    res.status(201).json (newUser)
  }

}