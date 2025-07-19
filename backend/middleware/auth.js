import { getAuth } from '@clerk/express'
import { clerkClient } from '@clerk/express'

export const protectAdmin = async (req, res, next) => {
  try {
    const { userId } = getAuth(req)
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" })

    const user = await clerkClient.users.getUser(userId)

    if (user.privateMetadata?.role !== "admin") {
      return res.status(403).json({ success: false, message: "Forbidden: Not admin" })
    }

    next()
  } catch (error) {
    console.error(" Middleware Error:", error)
    res.status(500).json({ success: false, message: "Server error" })
  }
}
