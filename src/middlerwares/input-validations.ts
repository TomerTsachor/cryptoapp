import { NextFunction, Request, Response } from "express";
import createHttpError, {InternalServerError, BadRequest} from "http-errors";
import { ObjectSchema } from "joi";

export default function validate(validtor: ObjectSchema){
    return async function (req:Request, res:Response, next:NextFunction){
        try{
            req.body = await validtor.validateAsync(req.body);
            return next()
        } catch(err){
            if (err.isJoi){
                return next({status: 400, message: 'bad request'})
            }
            return next(createHttpError(InternalServerError(err)))
        }
    }
}