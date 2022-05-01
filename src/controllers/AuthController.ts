import { Request, Response } from "express";
import bcrypt from 'bcryptjs'
import { generateToken } from "../lib/jwt";
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

    try{

      const userFRomDb = await repository.findByEmail(credencials.email)
        
      if (!userFRomDb || !bcrypt.compareSync (credencials.password,userFRomDb.password)){
        
        res.status(401).json({message: 'invalid Credentials'})
        return
      } 

      const token = generateToken(userFRomDb)

      res.json({ token })
    }catch (error) {
      console.log(error)
      res.status(500).json({message: 'Something went wrong'})
    }
  }

  public readonly register = async (req: Request, res: Response) => {
    const user = req.body as CreateUserDTO

    try{
      await registerSchema.validateAsync(user)
    }catch (error) {
      res.status(400).json ({error: error.message})
      return
    }

    const hashedPassword = bcrypt.hashSync(user.password, 10)

    const repository = new UserRepository()

    try{
      const newUser = await repository.create({ ...user, password: hashedPassword })

      res.status(201).json (newUser)
    }catch (error){
      if(error.code === 'P2002'){
        res.status(409).json({ message:'User already exists'})
        return
      }
      console.log(error)
      res.status(500).json({message: 'Something went wrong'})
    }
  }

}