import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from "@nestjs/common";

import { Public } from "@/common/decorators";
import { RealIp } from "@/common/decorators/real-ip.decorator";
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

  @Put(":nid")
  async update(@Param("nid") nid: number, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(nid, updatePostDto);
  }

  @Delete(":nid")
  async delete(@Param("nid") nid: number) {
    return this.postService.delete(nid);
  }

  @Public()
  @Patch(":nid/like")
  async like(@Param("nid") nid: number, @RealIp() ip: string) {
    return this.postService.increaseToLikes(nid, ip);
  }

  @Public()
  @Patch(":nid/unlike")
  async unlike(@Param("nid") nid: number, @RealIp() ip: string) {
    return this.postService.decreaseToLikes(nid, ip);
  }

  @Public()
  @Get()
  async getPosts(@Query() query: GetPostsDto) {
    return this.postService.getAll(query);
  }

  @Public()
  @Get(":nid")
  async getPost(@Param("nid") nid: number, @RealIp() ip: string) {
    await this.postService.increaseToViews(nid, ip);

    const post = await this.postService.getByNumId(nid, ip);

    return post;
  }

  @Public()
  @Get(":nid/sibling")
  async getSiblingPost(@Param("nid") nid: number) {
    return this.postService.getSibling(nid);
  }
}
