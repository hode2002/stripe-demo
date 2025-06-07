import { Controller, Get } from "@nestjs/common";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";

@Controller('auth')
export class AuthController {

    @Get('me')
    getMe(@CurrentUser() user: any) {
        return user;
    }
}