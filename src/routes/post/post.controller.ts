import { Body, Controller, Delete, Get, Ip, Param, Patch, Post, Put, Query } from "@nestjs/common";

import { Public } from "@/common/decorators";
import { ValidateObjectIdPipe } from "@/common/pipes/validate-objectid.pipe";
import { CreatePostDto } from "@/routes/post/dto/create-post.dto";
import { GetPostsDto } from "@/routes/post/dto/get-posts.dto";
import { UpdatePostDto } from "@/routes/post/dto/update-post.dto";
import { PostService } from "@/routes/post/post.service";

@Controller("posts")
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  @Put(":_id")
  async update(
    @Param("_id", ValidateObjectIdPipe) _id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.update(_id, updatePostDto);
  }

  @Delete(":_id")
  async delete(@Param("_id", ValidateObjectIdPipe) _id: string) {
    return this.postService.delete(_id);
  }

  @Public()
  @Patch(":_id/like")
  async like(@Param("_id") _id: string, @Ip() ip: string) {
    return this.postService.increaseToLikes(_id, ip);
  }

  @Public()
  @Patch(":_id/unlike")
  async unlike(@Param("_id") _id: string, @Ip() ip: string) {
    return this.postService.decreaseToLikes(_id, ip);
  }

  @Public()
  @Get()
  async getPosts(@Query() query: GetPostsDto) {
    return this.postService.getAll(query);
  }

  @Public()
  @Get(":nid")
  async getPost(@Param("nid") nid: number, @Ip() ip: string) {
    const post = await this.postService.getByNumId(nid, ip);

    await this.postService.increaseToViews(post._id, ip);

    return post;
  }

  @Public()
  @Get(":nid/sibling")
  async getSiblingPost(@Param("nid") nid: number) {
    return this.postService.getSibling(nid);
  }
}
