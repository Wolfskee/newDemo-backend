import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/user-input.dto';
import {
  UserResponseDto,
  PaginatedUserResponseDto,
} from './dto/user-response.dto';
import { multerImageOptions } from 'src/common/config/multer-image.config';
import { Public } from 'src/common/decorators';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all users with pagination' })
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
    description: 'Page number to retrieve (default = 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 10,
    description: 'Number of users per page (default = 10)',
  })
  @ApiOkResponse({
    type: PaginatedUserResponseDto,
    description: 'List of users with pagination metadata.',
  })
  async getAllUsers(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<PaginatedUserResponseDto> {
    return this.userService.getAllUsers(Number(page), Number(limit));
  }

  @Public()
  @Get(':id')
  @ApiOperation({
    summary: 'Get single user by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID of the user',
  })
  @ApiOkResponse({
    type: UserResponseDto,
    description: 'Successfully retrieved user',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  async getUserById(@Param('id') id: string): Promise<UserResponseDto> {
    return this.userService.getUserById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing user' })
  @ApiParam({
    name: 'id',
    description: 'UUID of the user to update',
  })
  @ApiCreatedResponse({
    type: UserResponseDto,
    description: 'User updated successfully',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  async updateUser(
    @Param('id') id: string,
    @Body() data: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.updateUser(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an user by ID' })
  @ApiParam({
    name: 'id',
    description: 'UUID of the user to delete',
  })
  @ApiCreatedResponse({
    type: UserResponseDto,
    description: 'User deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  async deleteUser(@Param('id') id: string): Promise<UserResponseDto> {
    return this.userService.deleteUser(id);
  }

  @Post('profile-image/:id')
  @UseInterceptors(FileInterceptor('profileImage', multerImageOptions))
  @ApiOperation({ summary: 'Get presigned URL for user profile image' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  async uploadProfileImageUrl(
    @Param('id') id: string,
    @UploadedFile() profileImage: Express.Multer.File,
  ): Promise<{ url: string }> {
    const url = await this.userService.uploadUserProfileImage(id, profileImage);
    return { url };
  }

  @Delete('profile-image/:id')
  @ApiOperation({ summary: 'Delete user profile image' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  async deleteProfileImage(
    @Param('id') id: string,
  ): Promise<{ message: string }> {
    await this.userService.deleteUserProfileImage(id);
    return { message: 'Image deleted successfully' };
  }
}
