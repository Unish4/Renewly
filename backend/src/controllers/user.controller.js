import { getUserId } from "../middleware/auth.middleware.js";

export const getMe = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    res
      .status(200)
      .json({
        success: true,
        data: { userId, message: "You are successfully authenticated." },
      });
  } catch (error) {
    next(error); 
  }
};
