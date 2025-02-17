import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';

@Catch(BadRequestException)
export class ErrorMessageResponseFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();

    const responseBody = exception.getResponse() as any;

    const message = Array.isArray(responseBody.message)
      ? responseBody.message[0]
      : responseBody.message;

    response.status(status).json({
      statusCode: status,
      message: message,
      error: responseBody.error,
    });
  }
}
