import HTTP_STATUS from 'http-status-codes';
import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import { joiValidation } from '@root/shared/globals/decorators/joi-validation.decorators';
import { signupSchema } from '@auth/schemes/signup';
import { IAuthDocument, ISignUpData } from '@auth/interfaces/auth.interface';
import { BadRequestError } from '@root/shared/globals/helpers/error-handler';
import { authService } from '@service/db/auth.service';
import { Helpers } from '@root/shared/globals/helpers/helpers';
import { uploads } from '@root/shared/globals/helpers/cloudinary-upload';
import { UploadApiResponse } from 'cloudinary';


export class SignUp {
    @joiValidation(signupSchema)
    public async create(req: Request, res: Response): Promise<void> {
        const {username, email, password, avatarColor, avatarImage} = req.body;
        const checkIfUserExist: IAuthDocument = await authService.getUserByUsernameOrEmail(username, email);
        if (checkIfUserExist) {
            throw new BadRequestError('Invalid credentials');
        }

        const authObjectId: ObjectId = new ObjectId();
        const userObjectId: ObjectId = new ObjectId();
        const uId = `${Helpers.generateRandomIntegers(12)}`;
        const authData: IAuthDocument = SignUp.prototype.singupData({
          _id: authObjectId,
          uId,
          username,
          email,
          password,
          avatarColor
        });
        const result: UploadApiResponse = await uploads(avatarImage, `${userObjectId}`, true, true) as UploadApiResponse;
        if (!result?.public_id) {
          throw new BadRequestError('File upload: Error occurred. Try again.');
        }

        res.status(HTTP_STATUS.CREATED).json({message: 'User created successfully', authData});
    }

    private singupData(data: ISignUpData): IAuthDocument {
      const {_id, username, password, email, avatarColor, uId} = data;
      return {
        _id,
        uId,
        username: Helpers.firstLetterUppercase(username),
        email: Helpers.lowerCase(email),
        password,
        avatarColor,
        createdAt: new Date()
      } as IAuthDocument;
    }
}
