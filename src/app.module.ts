import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";

import { AccessJwtAuthGuard } from "@/common/guards";
import { CommonModule } from "@/common/modules";
import { SequenceModule } from "@/common/sequence/sequence.module";
import { AuthModule } from "@/routes/auth/auth.module";
import { ImageModule } from "@/routes/image/image.module";
import { PostModule } from "@/routes/post/post.module";
import { ProjectModule } from "@/routes/project/project.module";
import { SeriesModule } from "@/routes/series/series.module";
import { TagModule } from "@/routes/tag/tag.module";
import { UserModule } from "@/routes/user/user.module";

@Module({
  imports: [
    CommonModule,
    SequenceModule,
    UserModule,
    AuthModule,
    PostModule,
    SeriesModule,
    TagModule,
    ProjectModule,
    ImageModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: AccessJwtAuthGuard }],
})
export class AppModule {}
