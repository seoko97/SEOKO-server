import { applyDecorators } from "@nestjs/common";

import { IsNotEmpty, IsOptional } from "class-validator";

const IsOptionalCustom = (..._decorators: PropertyDecorator[]) => {
  return applyDecorators(IsOptional(), IsNotEmpty(), ..._decorators);
};

export { IsOptionalCustom };
