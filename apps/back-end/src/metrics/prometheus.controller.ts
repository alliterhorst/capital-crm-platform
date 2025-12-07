import { Controller, Get, Res } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { PrometheusController as PrometheusLibController } from '@willsoto/nestjs-prometheus';
import { MESSAGES_HELPER } from '../common/constants/messages.helper';

@ApiTags(MESSAGES_HELPER.SWAGGER.HEALTH_TAG)
@Controller('metrics')
export class PrometheusController extends PrometheusLibController {
  @Get()
  @ApiOperation({ summary: MESSAGES_HELPER.SWAGGER.PROMETHEUS_SUMMARY })
  @ApiResponse({ status: 200, description: 'Dados de métricas no formato Prometheus.' })
  async index(@Res() response: unknown): Promise<string> {
    return super.index(response);
  }
}
