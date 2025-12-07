import { Body, Controller, HttpStatus, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MESSAGES_HELPER } from '../common/constants/messages.helper';
import { RequestWithUser } from '../auth/interfaces/auth.interfaces';
import { ApiBaseAuthResponses } from '../common/decorators/api-base-responses.decorator';

@ApiTags(MESSAGES_HELPER.SWAGGER.USERS_TAG)
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('profile')
  @ApiOperation({ summary: MESSAGES_HELPER.SWAGGER.USER_UPDATE_SUMMARY })
  @ApiBaseAuthResponses()
  @ApiResponse({
    status: HttpStatus.OK,
    description: MESSAGES_HELPER.USERS.UPDATE_SUCCESS,
  })
  updateProfile(@Req() req: RequestWithUser, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersService.updateName(req.user.id, updateUserDto.name);
  }
}
