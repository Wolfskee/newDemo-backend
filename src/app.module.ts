import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ItemModule } from './item/item.module';
import { AppointmentModule } from './appointment/appointment.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Ensures .env loads for all modules
    }),
    PrismaModule,
    UserModule,
    ItemModule,
    AppointmentModule,
    AuthModule,
  ],
})
export class AppModule {}
