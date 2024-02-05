import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as FormData from 'form-data';
import { firstValueFrom } from 'rxjs';
import { ISmsSend } from './types/sms-send.type';
import { TRefreshToken } from './types/sms-refresh.type';

@Injectable()
export class SmsService {
  private globalToken: string =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDk1MzE1MzMsImlhdCI6MTcwNjkzOTUzMywicm9sZSI6InRlc3QiLCJzaWduIjoiNzUzNTM4ZDYxNDA1MjUyNjA4Nzc4M2Y4Y2FlNTY3YWMxMTg5YTNmNmMxMGZiZDQ3ZTNjZjllZjY3ZDU2YTI5MiIsInN1YiI6IjU5MjcifQ.8XQfpVSfUIhrFTpRb_FPQvu7_EKfyTBTlc8ultQFKhA';
  constructor(private readonly httpService: HttpService) {}

  async sendSms(phone: string, message: string) {
    const data = new FormData();
    data.append('mobile_phone', phone);
    data.append('message', message);
    data.append('from', '4546');
    return await firstValueFrom(
      this.httpService.post<ISmsSend>(
        'http://notify.eskiz.uz/api/message/sms/send',
        data,
        {
          headers: {
            ...data.getHeaders(),
            Authorization: `Bearer ${this.globalToken}`,
          },
        },
      ),
    );
  }
  async errorHandler(phone: string, message: string) {
    console.log(`error fix: ${process.env.SMS_LOGIN}`);
    const formData = new FormData();
    formData.append('email', process.env.SMS_LOGIN);
    formData.append('password', process.env.SMS_KEY);
    const { data } = await firstValueFrom(
      this.httpService.post<TRefreshToken>(
        'http://notify.eskiz.uz/api/auth/login',
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
        },
      ),
    );
    this.globalToken = data.data.token;
    await this.sendSms(phone, message);
    return { response: 'activation key sent' };
  }
}
