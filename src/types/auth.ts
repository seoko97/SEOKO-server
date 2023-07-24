import { Response } from "express";

const enum EJwtTokenType {
  ACCESS = "access",
  REFRESH = "refresh",
}

interface IRegisterTokenInCookieArgs {
  type: EJwtTokenType;
  token: string;
  res: Response;
}

export { EJwtTokenType, IRegisterTokenInCookieArgs };
