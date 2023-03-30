import session from "express-session"

const checkCookies = async (req, res, next) => {
	if (req.session?.userId) {
		return next()
	} else {
		res.status(404).json({ msg: "Hubo un error" })
	}

	next()
}

export default checkCookies
