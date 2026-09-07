---
trigger: always_on
---

# Backend Conventions

## Architecture

The server follows a **NestJS Modular Architecture** with controller-service-entity (TypeORM repository) separation of concerns:

| Layer | Purpose | File Pattern / Directory |
| --- | --- | --- |
| **Controllers** (Route handlers) | Handle HTTP requests, URI versioning, request guards, Swagger documentation, and response formatting | `*.controller.ts` |
| **Services** (Business logic) | Domain business logic, transaction management, data operations via TypeORM | `*.service.ts` |
| **Data access layer** (Entities) | TypeORM PostgreSQL entity definitions extending `BaseEntity` with KSUID primary keys | `*.entity.ts` |
| **DTOs & Validators** | Input validation rules (`class-validator`) and transformation logic (`class-transformer`) | `*.dto.ts`, `*.validator.service.ts` |
| **Shared Services & Core** | Cross-cutting concerns: Auth, JWT, Redis, Sentry, Logging, Worker/Bull queues, Filters, Interceptors | `src/auth/`, `src/guards/`, `src/services/`, `src/filters/`, `src/logger/`, `src/worker/` |

No direct database operations outside of TypeORM repositories or module service layers.

## Module Structure

```
src/modules/my-module/
├── my-module.module.ts         # NestJS module definition (@Module)
├── my-module.controller.ts     # Express/NestJS request handlers (@Controller)
├── my-module.service.ts        # Business logic & repository operations (@Injectable)
├── my-module.service.spec.ts   # Unit and integration test specs
├── my-module.entity.ts         # TypeORM entity definition (@Entity extending BaseEntity)
├── my-module.dto.ts            # Request DTOs with class-validator decorators
├── my-module.response.dto.ts   # Response DTOs for Swagger & class-transformer
├── my-module.constant.ts       # Module-specific constants & messages
├── my-module.interface.ts      # (Optional) TypeScript interfaces
├── my-module.types.ts          # (Optional) Type definitions
└── my-module.helpers.ts        # (Optional) Module-specific helper functions
```

## Routes

Routes are defined inside controllers using NestJS decorators mirroring the URL structure and API resources:

- Controller class-level decorator specifies route base path: `@Controller('customers')`
- HTTP method decorators: `@Get()`, `@Post('signup')`, `@Put(':id')`, `@Delete(':id')`
- URI Versioning is enabled globally via NestJS versioning (e.g., `@Version('1')` → `/v1/customers/signup`)
- Access Control & Guard Decorators: `@UseGuards(JwtAuthGuard, PermissionGuard)`, `@Permission(PERMISSIONS...)`
- OpenAPI / Swagger documentation decorators: `@ApiTags(ApiTag.Customers)`, `@ApiCommonResponse()`, `@ApiBearerAuth()`

```ts
@ApiTags(ApiTag.Customers)
@Controller('customers')
export class CustomersController {
  constructor(
    private readonly customersService: CustomersService,
    private readonly logger: CustomLogger,
  ) {}

  @Version('1')
  @Post('signup')
  @UseGuards(AntiReplayGuard)
  async signup(@Res() res: Response, @Body() dto: CreateCustomerDto) {
    try {
      const { otp } = await this.customersService.signup(dto);
      return responseUtils.success(res, {
        data: { message: 'OTP sent successfully', otp },
        transformWith: CommonOtpResponseDto,
      });
    } catch (error) {
      return responseUtils.error({ res, error });
    }
  }
}
```

## Input Validation

- Use `class-validator` and `class-transformer` for all user input validation.
- Validation DTOs go in `module-name.dto.ts` (or `dto/` directory for larger modules).
- NestJS global `ValidationPipe` automatically validates incoming payload objects (`@Body()`, `@Query()`, `@Param()`) with `{ transform: true, whitelist: true }`.
- Example DTO definition:
  ```ts
  export class CreateCustomerDto extends CommonManageUserDto {
    @ApiProperty({ description: 'Mobile number', example: '+919859632478' })
    @IsString()
    @IsPhoneNumber('IN')
    @Matches(REGEX.INDIAN_MOBILE_NUMBER, {
      message: 'Mobile number must start with +91 and be followed by 10 digits.',
    })
    @IsNotEmpty()
    mobileNumber: string;

    @ApiPropertyOptional({ description: 'Address', example: '123 Main St' })
    @IsOptional()
    @ValidateIf((_, v) => v != null && v !== '')
    @Transform(trimString)
    @IsString()
    @MaxLength(1000)
    @IsSafeAddressHtml()
    address?: string;
  }
  ```

## Error Handling

Handled globally via `MainExceptionFilter` registered in `src/main.ts` (with automated Sentry reporting for status >= 500). Use standard NestJS HTTP exceptions or `responseUtils.error()` — never set raw Express error statuses manually in route handlers:

```ts
try {
  // business logic
} catch (error: unknown) {
  this.logger.error(`Operation failed: ${error.message}`);
  return responseUtils.error({ res, error });
}
```

Available error classes & HTTP status codes:

- `BadRequestException` / `HttpStatus.BAD_REQUEST` → **400**
- `UnauthorizedException` / `HttpStatus.UNAUTHORIZED` → **401**
- `ForbiddenException` / `HttpStatus.FORBIDDEN` → **403**
- `NotFoundException` / `HttpStatus.NOT_FOUND` → **404**
- `UnprocessableEntityException` / `HttpStatus.UNPROCESSABLE_ENTITY` → **422**
- Unhandled errors (`HttpException` catch / `HttpStatus.INTERNAL_SERVER_ERROR`) → **500**

## Responses

- Format data as JSON by default using standard envelope format `{ data, status, message }`.
- Handled in controllers using `responseUtils.success(res, { data, status, transformWith, message })` or `ResponseHandlerInterceptor`.
- Response DTOs (`module-name.response.dto.ts`) transform outgoing objects with `class-transformer` (`plainToInstance` with `excludeExtraneousValues: true`).
- Module-specific errors and exceptions are sanitized by `MainExceptionFilter` so database implementation details (e.g. raw PostgreSQL / TypeORM error messages) do not leak to the client.

## Server Testing

- Tests use `@nestjs/testing` (`Test.createTestingModule`) with **Jest** (`*.spec.ts`).
- Unit and integration tests mock TypeORM repositories via `getRepositoryToken(EntityClass)` and `jest.fn()`.
- End-to-end (E2E) tests use `supertest` with NestJS testing modules configured in `./test/` (`jest-e2e.json`).
- Standard test commands:
  - `pnpm test`: Run unit and integration tests (`*.spec.ts`)
  - `pnpm test:watch`: Run tests in watch mode
  - `pnpm test:cov`: Generate code coverage report
  - `pnpm test:e2e`: Run end-to-end tests
