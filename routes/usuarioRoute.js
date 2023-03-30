import express from "express"
import {
	registro,
	login,
	MostarQR2FA,
	Activar2FA,
	Login2fa,
} from "../Controllers/usuarioController.js"
import checkCookies from "../middleware/checkCookies.js"

const router = express.Router()

router.post("/", registro)
router.post("/login", login)
router.get("/MostrarQR", checkCookies, MostarQR2FA)
router.post("/Activar2FA", checkCookies, Activar2FA)
router.post("/login2fa", Login2fa)

export default router
