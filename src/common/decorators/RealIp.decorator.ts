import { createParamDecorator } from "@nestjs/common";

const RealIp = createParamDecorator((data, ctx) => {
  const req = ctx.switchToHttp().getRequest();
  const ip = req.headers["x-forwarded-for"] || req.headers["x-real-ip"] || "0.0.0.0";

  return ip;
});

export { RealIp };
