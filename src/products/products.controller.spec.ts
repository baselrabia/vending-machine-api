import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let controller: ProductsController;


  const mockProductService = {}

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [ProductsService],
    })
      .overrideProvider(ProductsService)
      .useValue(mockProductService)
      .compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

   it('should be defined', () => {
     expect(
       controller.create({
         name: 'iphone',
         amount: 33,
         price: 3000,
       },{
        id: 123,
        username:"seller",
        role:"seller",
       }: User),
     ).toEqual({
      
     });
   });
});
