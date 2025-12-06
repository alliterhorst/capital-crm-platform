import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { MESSAGES_HELPER } from '../common/constants/messages.helper';
import { AuthenticatedUser, RequestWithUser } from './interfaces/auth.interfaces';

@ApiTags(MESSAGES_HELPER.SWAGGER.AUTH_TAG)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: MESSAGES_HELPER.SWAGGER.LOGIN_SUMMARY })
  @ApiResponse({
    status: HttpStatus.OK,
    description: MESSAGES_HELPER.SWAGGER.LOGIN_SUCCESS_DESC,
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: MESSAGES_HELPER.SWAGGER.LOGIN_UNAUTHORIZED_DESC,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: MESSAGES_HELPER.SWAGGER.LOGIN_BAD_REQUEST,
  })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter dados do usuário logado' })
  @ApiResponse({ status: 200, description: 'Dados do perfil recuperados.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  getProfile(@Req() req: RequestWithUser): AuthenticatedUser {
    return req.user;
  }
}
