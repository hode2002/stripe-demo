import { Module } from '@nestjs/common';
import { SupabaseModule } from 'src/supabse/supabase.module';
import { AuthController } from 'src/auth/auth.controller';

@Module({
    imports: [SupabaseModule],
    controllers: [AuthController],
    providers: [],
})
export class AuthModule { }
