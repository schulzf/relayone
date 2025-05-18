import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import * as twilio from 'twilio';

@Injectable()
export class TwilioGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    if (!authToken) {
      throw new Error('TWILIO_AUTH_TOKEN is not configured');
    }

    const signature = request.headers['x-twilio-signature'];
    const protocol = request.headers['x-forwarded-proto'] || 'https';
    const host = request.headers.host;
    const path = request.originalUrl.split('?')[0];
    const webhookUrl = `${protocol}://${host}${path}`;

    const sortedParams = Object.keys(request.body || {})
      .sort()
      .reduce((acc, key) => {
        acc[key] = request.body[key];

        return acc;
      }, {});

    return twilio.validateRequest(authToken, signature as string, webhookUrl, sortedParams);
  }
}
