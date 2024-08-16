import { InMemoryDBService } from "@nestjs-addons/in-memory-db";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { ProductEntity } from "../../../api/src/modules/product/entity/product";
import { ProductInputCreateDto } from "../../../api/src/modules/product/product-input-create.dto";
import { ProductController } from "../../../api/src/modules/product/product.controller";

describe("ProductController", () => {
  let controller: ProductController;
  let productService: InMemoryDBService<ProductEntity>;
  let products: ProductEntity[] = [
    { id:"1", name: "First Product", price: 100.0, barcode: 123456, },
    { id:"2", name: "Second Product", price: 200.0, barcode: 246810, },
  ]

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: InMemoryDBService,
          useValue: {
            getAll: jest.fn(),
            get: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    productService = module.get<InMemoryDBService<ProductEntity>>(InMemoryDBService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should create a product successfully", async () => {
    const input: ProductInputCreateDto = {
      name: "Third Product",
      price: 300.0,
      barcode: 369963,
    };

    const createdProduct = { ...input, id: "3" };
    jest.spyOn(productService, "getAll").mockReturnValue(products);
    jest.spyOn(productService, "create").mockReturnValue(createdProduct);

    const result = await controller.create(input);

    expect(result).toEqual(createdProduct);
    expect(productService.create).toHaveBeenCalledWith(input);
  });

  it("should throw BadRequestException when creating a product with duplicate barcode", async () => {
    const input: ProductInputCreateDto = {
      name: "Outher Product",
      price: 900.0,
      barcode: 123456,
    };

    jest.spyOn(productService, "getAll").mockReturnValue([products[0]]);

    await expect(controller.create(input)).rejects.toThrow(BadRequestException);
  });

  it("should update a product successfully", async () => {
    const productId = "10";
    const input: ProductInputCreateDto = {
      name: "Updated Product",
      price: 200.0,
      barcode: 654321,
    };

    const existingProduct = products[0];

    jest.spyOn(productService, "get").mockReturnValue(existingProduct);
    jest.spyOn(productService, "getAll").mockReturnValue([existingProduct]);
    jest.spyOn(productService, "update").mockImplementation((product) => product);

    const result = await controller.update(input, productId);

    expect(result).toEqual({ id: productId, ...input });
    expect(productService.update).toHaveBeenCalledWith({ id: productId, ...input });
  });

  it("should throw NotFoundException when updating a non-existent product", async () => {
    const input: ProductInputCreateDto = {
      name: "Non Existent Product",
      price: 200.0,
      barcode: 654321,
    };

    jest.spyOn(productService, "get").mockReturnValue(null);

    const result = controller.update(input, "99")
    await expect(result).rejects.toThrow(NotFoundException);
  });

  it("should throw BadRequestException when updating a product with duplicate barcode", async () => {
    const productId = "1";
    const input: ProductInputCreateDto = {
      name: "Updated Product",
      price: 200.0,
      barcode: 246810,
    };
    const existingProduct = products[0]

    jest.spyOn(productService, "get").mockReturnValue(existingProduct);
    jest.spyOn(productService, "getAll").mockReturnValue(products);

    const result = controller.update(input, productId)
    await expect(result).rejects.toThrow(BadRequestException);
  });

  it("should delete a product successfully", async () => {
    const existingProduct = products[0]

    jest.spyOn(productService, "get").mockReturnValue(existingProduct);
    jest.spyOn(productService, "delete").mockImplementation(() => {});

    await controller.delete({ ...existingProduct }, existingProduct.id);

    expect(productService.delete).toHaveBeenCalledWith(existingProduct.id);
  });

  it("should throw NotFoundException when deleting a non-existent product", async () => {
    const input: ProductInputCreateDto = {
      name: "Non Existent Product",
      price: 200.0,
      barcode: 654321,
    }
    jest.spyOn(productService, "get").mockReturnValue(null);

    const result = controller.delete(input, "99")

    await expect(result).rejects.toThrow(NotFoundException);
  });

  it("should list products successfully", async () => {
    jest.spyOn(productService, "getAll").mockReturnValue(products);

    const firstSearch = await controller.findAll({ name: products[0].name, barcode: products[0].barcode.toString()});
    const secondSearch = await controller.findAll({ name: products[1].name, barcode: products[1].barcode.toString()});

    expect(firstSearch).toEqual([products[0]]);
    expect(secondSearch).toEqual([products[1]]);
  });

  it("should list products with filters", async () => {
    jest.spyOn(productService, "getAll").mockReturnValue(products);

    const resultByName = await controller.findAll({ barcode: "", name: "Second Product" });
    const resultByBarcode = await controller.findAll({ barcode: "123456", name: "" });

    expect(resultByName).toEqual([products[1]]);
    expect(resultByBarcode).toEqual([products[0]]);
  });
});
