import express from "express"
import usuarioRoute from "./routes/usuarioRoute.js"
import { PrismaClient } from "@prisma/client"
import { PrismaSessionStore } from "@quixo3/prisma-session-store"
import expressSession from "express-session"

const app = express()

app.use(express.json())

app.use(
	"/api/usario",
	expressSession({
		cookie: {
			maxAge: 7 * 24 * 60 * 60 * 1000,
		},
		secret: "adaerwstfeswre",
		resave: true,
		saveUninitialized: true,
		store: new PrismaSessionStore(new PrismaClient(), {
			checkPeriod: 2 * 60 * 1000,
			dbRecordIdIsSessionId: true,
			dbRecordIdFunction: undefined,
		}),
	}),
	usuarioRoute
)

const Port = 4000

const server = app.listen(Port, () => {
	console.log(`Puerto habilitado que es http://localhost:${Port}`)
})
