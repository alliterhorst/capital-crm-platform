import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MetricsService } from './metrics.service';
import { DashboardResponseDto } from './dto/dashboard-response.dto';
import { MonthlyGrowthDto } from './dto/growth-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MESSAGES_HELPER } from '../common/constants/messages.helper';
import { ApiBaseAuthResponses } from '../common/decorators/api-base-responses.decorator';

@ApiTags(MESSAGES_HELPER.SWAGGER.METRICS_TAG)
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: MESSAGES_HELPER.SWAGGER.METRICS_DASHBOARD_SUMMARY })
  @ApiBaseAuthResponses()
  @ApiResponse({
    status: HttpStatus.OK,
    description: MESSAGES_HELPER.METRICS.DASHBOARD_SUCCESS,
    type: DashboardResponseDto,
  })
  getDashboard(): Promise<DashboardResponseDto> {
    return this.metricsService.getDashboardData();
  }

  @Get('growth')
  @ApiOperation({ summary: MESSAGES_HELPER.SWAGGER.METRICS_GROWTH_SUMMARY })
  @ApiBaseAuthResponses()
  @ApiResponse({
    status: HttpStatus.OK,
    description: MESSAGES_HELPER.METRICS.DASHBOARD_SUCCESS,
    type: [MonthlyGrowthDto],
  })
  getGrowth(): Promise<MonthlyGrowthDto[]> {
    return this.metricsService.getGrowthMetrics();
  }
}
