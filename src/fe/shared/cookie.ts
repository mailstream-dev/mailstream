import cookie from "cookie";

export const parseCookies = (req) => {
  const cookies =
    typeof document === "undefined" ? req?.headers?.cookie : document?.cookie;
  return cookie.parse(cookies || "");
};
