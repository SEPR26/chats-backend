import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import { joiValidation } from '@root/shared/globals/decorators/joi-validation.decorators';
import { signupSchema } from '@auth/schemes/signup';
import { IAuthDocument } from '@auth/interfaces/auth.interface';
import { BadRequestError } from '@root/shared/globals/helpers/error-handler';
import { authService } from '@service/db/auth.service';


export class SignUp {
    @joiValidation(signupSchema)
    public async create(req: Request, res: Response): Promise<void> {
        const {username, email, password, avatarColor, avatarImage} = req.body;
        const checkIfUserExist: IAuthDocument = await authService.getUserByUsernameOrEmail(username, email);
        if (checkIfUserExist) {
            throw new BadRequestError('Invalid credentials');
        }
    }
}