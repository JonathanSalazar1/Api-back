import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import twofactor from "node-2fa"
import PrismaSessionStore from "@quixo3/prisma-session-store"
import session from "express-session"

const registro = async (req, res) => {
	const { nombre, email, password } = req.body

	const prisma = new PrismaClient()

	const existeUsuario = await prisma.usuarios.findFirst({
		where: { email },
	})

	if (existeUsuario) {
		return res.status(400).json({ msg: "El usuario ya existe" })
	}

	try {
		await prisma.usuarios.create({
			data: {
				nombre,
				email,
				password: await bcrypt.hash(password, 10),
				Activar2fa: true,
			},
		})
		res.status(201).json({ msg: "Usuario creado correctamente" })
	} catch (error) {
		console.log(error)
	}
}

const login = async (req, res) => {
	const { email, password } = req.body
	const prisma = new PrismaClient()

	const usario = await prisma.usuarios.findFirst({
		where: { email },
	})

	if (!usario) {
		return res.status(400).json({ msg: "El usuario no existe" })
	}

	if (await bcrypt.compare(password, usario.password)) {
		res.status(200).json({ msg: "Usuario logeado correctamente" })
		const id = usario.id
		req.session.userId = id
		req.session.save()
	} else {
		res.status(400).json({ msg: "Contraseña incorrecta" })
	}
}

const MostarQR2FA = async (req, res) => {
	const { userId } = req.session
	const prisma = new PrismaClient()

	const usuario = await prisma.usuarios.findFirst({
		where: { id: userId },
	})

	if (!usuario) {
		return res.status(400).json({ msg: "El usuario no existe" })
	}

	const newSecret = twofactor.generateSecret({
		name: "Aplicacion de jona",
		account: usuario.nombre,
	})

	await prisma.usuarios.update({
		where: { id: userId },
		data: {
			token2FA: newSecret?.secret,
		},
	})

	res.status(200).json({ qr: newSecret.qr })
}

const Activar2FA = async (req, res) => {
	const { userId } = req.session
	const { token } = req.body

	const prisma = new PrismaClient()

	const usuario = await prisma.usuarios.findFirst({
		where: { id: userId },
	})

	if (!usuario) {
		return res.status(400).json({ msg: "El usuario no existe" })
	}

	const { token2FA } = usuario

	const verificacion = twofactor?.verifyToken(token2FA, token)

	const { delta } = verificacion

	if (delta === 0) {
		res.status(200).json({ msg: "Activacio del 2FA correcta" })
	} else {
		return res.status(400).json({
			msg: "Se acabo el tiempo del codigo o puso el codigo incorrecto",
		})
	}
}

const Login2fa = async (req, res) => {
	const { email, token } = req?.body
	const prisma = new PrismaClient()

	const usuario = await prisma.usuarios.findFirst({
		where: { email },
	})

	if (!usuario) {
		return res.status(400).json({ msg: "El usuario no existe" })
	}

	const { token2FA } = usuario

	const verificacion = twofactor.verifyToken(token2FA, token)

	const { delta } = verificacion

	if (delta === 0) {
		res.status(200).json({ msg: "Logeado correctamente" })
		const id = usuario.id
		req.session.userId = id
		req.session.save()
	} else {
		return res.status(400).json({
			msg: "Se acabo el tiempo del codigo o puso el codigo incorrecto",
		})
	}
}

export { registro, login, MostarQR2FA, Activar2FA, Login2fa }
