import { NextFunction, Request, Response } from "express";
import getModel from "../../models/user-symbol/factory";
import { DTO } from "../../models/user-symbol/dto";
import getSymbolValueModel from "../../models/symbol-value/factory"
import config from 'config';

export async function dashboard (req:Request, res:Response, next:NextFunction){
    try{
    const userSymbols = await getModel().getForUser(req.user.id);
    const symbolValues = await Promise.all(userSymbols.map(symbol => 
        getSymbolValueModel().getLatest(symbol.symbol)))
    res.render('users/dashboard',{
        userSymbols,
        symbolValues,
        io: config.get("app.io")
    });
}
catch(err){
    next(err)
}
}

declare global{
    namespace Express{
        interface User{
            id: number;
        }
    }
}


export async function addSymbol(req:Request,res:Response,next:NextFunction){
    try{
        const userSymbolModel = getModel();
        const inputUserSymbol:DTO = {
            ...req.body,
            userId: req.user.id
        }
        const newUserSymbol = await userSymbolModel.add(inputUserSymbol as DTO)
        console.log(`new user-symbol added with id ${newUserSymbol.id}`)
        res.redirect('/users/dashboard')

    }catch(err){
        next(err);
    }
}

export function logout(req: Request, res: Response, next: NextFunction) {
    req.logout(() => {
        res.redirect('/');
    });
}