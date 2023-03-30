import jwt from "jsonwebtoken"

const generarJwt = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" })
}

export default generarJwt
