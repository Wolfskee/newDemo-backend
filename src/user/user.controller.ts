import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/user-input.dto';
import {
  UserResponseDto,
  PaginatedUserResponseDto,
} from './dto/user-response.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

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

  @Get(':id')
  @ApiOperation({
    summary: 'Get single user by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
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
    example: '123e4567-e89b-12d3-a456-426614174000',
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
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiCreatedResponse({
    type: UserResponseDto,
    description: 'User deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  async deleteUser(@Param('id') id: string): Promise<UserResponseDto> {
    return this.userService.deleteUser(id);
  }
}
