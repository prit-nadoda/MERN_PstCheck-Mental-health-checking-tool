export const generateToken = (user, message, statusCode, res) => {
  const token = user.generateAuthToken();
  const cookieName = user.type === "Admin" ? "adminToken" : "patientToken";
  console.log(user.type);
  res
    .status(statusCode)
    .cookie(cookieName, token, {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: true,
      sameSite: "None",
    })
    .json({
      success: true,
      message: message,
      user,
      token: token,
      cookieName: cookieName,
    });
};

export const oAuthGenerateJwtToken = (user) => {
  return user.generateAuthToken();
};

export const oAuthSetCookies = (res, token, userType) => {
  const cookieName = userType === "Admin" ? "adminToken" : "patientToken";

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  res.cookie(cookieName, token, cookieOptions);
};
