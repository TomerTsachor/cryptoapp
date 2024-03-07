import { Router } from "express";
import auth from '../middlerwares/github-auth'


const router = Router()
router.get('/authorize', auth.authenticate('github', { scope:['user:email']}))
router.get('/callback', auth.authenticate('github',{successRedirect:'/users/dashboard', failureRedirect:'/'}))
export default router