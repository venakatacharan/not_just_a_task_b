import {NextFunction, Request, Response} from 'express';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    console.log(req.user)
    if (req.user) {
        return next();
    }else{
        res.status(401).send('Not Authorised ✋');
    }
}