import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
    constructor(
        @Inject('SUPABASE_CLIENT')
        private readonly supabase: SupabaseClient,
        private readonly reflector: Reflector,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            throw new UnauthorizedException('No authorization header');
        }

        const token = this.extractTokenFromHeader(authHeader);
        if (!token) {
            throw new UnauthorizedException('Invalid authorization header format');
        }

        try {
            const { data: { user }, error } = await this.supabase
                .auth.getUser(token);

            if (error || !user) {
                throw new UnauthorizedException('Invalid token');
            }

            request.user = user;
            return true;
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }

    private extractTokenFromHeader(header: string): string | undefined {
        const [type, token] = header.split(' ');
        return type === 'Bearer' ? token : undefined;
    }
} 