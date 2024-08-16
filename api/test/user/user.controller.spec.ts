import { UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { LoginInputDto } from "../../../api/src/modules/user/login-input.dto";
import { UserController } from "../../../api/src/modules/user/user.controller";

describe("UserController", () => {
  let controller: UserController;
  let jwtService: JwtService;
  const mockToken = "mock-jwt-token";

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue(mockToken),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    jwtService = module.get<JwtService>(JwtService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should login successfully with valid credentials", async () => {
    const input: LoginInputDto = {
      mail: "qa@raffinato.com",
      password: "test-qa",
    };

    jest.spyOn(jwtService, "signAsync").mockResolvedValue(mockToken);

    const response = await controller.login(input);

    expect(response).toHaveProperty("user");
    expect(response).toHaveProperty("token", mockToken);
    expect(response.user.mail).toBe(input.mail);
    expect(response.user.name).toBe("Raffinato QA");
    expect(response.user.id).toBeDefined();
  });

  it("should throw UnauthorizedException with invalid credentials", async () => {
    const input: LoginInputDto = {
      mail: "invalid@user.com",
      password: "wrong-password",
    };

    await expect(controller.login(input)).rejects.toThrow(UnauthorizedException);
  });
});
