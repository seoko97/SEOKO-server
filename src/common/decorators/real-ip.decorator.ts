import { createParamDecorator } from "@nestjs/common";

const RealIp = createParamDecorator((_, ctx) => {
  const req = ctx.switchToHttp().getRequest();

  const forwarded = req.headers["x-forwarded-for"]?.split(", ");

  const ip = forwarded?.[0] || req.ip || req.header("x-real-ip") || "0.0.0.0";

  return ip;
});

export { RealIp };
