import { JoiRequestValidationError } from "../helpers/error-handler";
import { Request } from "express";
import { ObjectSchema } from "joi";


type IJoiDecorator = (targer: any, key: string, descriptor: PropertyDescriptor) => void;

export function joiValidation(schema: ObjectSchema): IJoiDecorator {
    return (_targer: any, _key: string, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            const req: Request = args[0];
            // validateAsync or validate 
            const { error} = await Promise.resolve(schema.validate(req.body));
            if (error?.details) {
                throw new JoiRequestValidationError(error.details[0].message);
            }
            return originalMethod.apply(this, args);
        };
        return descriptor;
    };
}