import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './entities/brand.entity';
import { ProductsService } from '../products/products.service';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,

    @Inject(forwardRef(() => ProductsService))
    private readonly productsService: ProductsService,
  ) {}

  // Criar Marca
  async create(createBrandDto: CreateBrandDto): Promise<Brand> {
    // Verificar duplicidade
    const existingBrand = await this.brandRepository.findOne({
      where: {
        name: createBrandDto.name,
      },
    });

    if (existingBrand) {
      throw new ConflictException(
        'Já existe uma marca cadastrada com este nome.',
      );
    }

    // Criação
    const brand = this.brandRepository.create(createBrandDto);

    // Retorno
    return this.brandRepository.save(brand);
  }

  // Busca e criação Via Nome
  async findOrCreateByName(name: string): Promise<Brand> {
    // Tirar espaços em branco
    const normalizedName = name.trim();

    // Buscar
    const brand = await this.brandRepository.findOne({
      where: {
        name: normalizedName,
      },
    });

    if (brand) {
      return brand;
    }

    const newBrand = this.brandRepository.create({
      name,
    });

    return this.brandRepository.save(newBrand);
  }

  // Listar Todas as Marcas ou usar filtros
  async findAll(name?: string): Promise<Brand[]> {
    if (name) {
      return this.brandRepository
        .createQueryBuilder('brand')
        .where('brand.name LIKE :name', {
          name: `%${name}%`,
        })
        .getMany();
    }

    return this.brandRepository.find();
  }

  // Buscar Por ID
  async findOne(id: number): Promise<Brand> {
    const brand = await this.brandRepository.findOneBy({
      id,
    });

    if (!brand) {
      throw new NotFoundException('Marca não encontrada');
    }

    return brand;
  }

  // Atualizar
  async update(id: number, updateBrandDto: UpdateBrandDto): Promise<Brand> {
    const brand = await this.findOne(id);

    if (updateBrandDto.name !== undefined) {
      const existingBrand = await this.brandRepository.findOne({
        where: {
          name: updateBrandDto.name,
        },
      });

      if (existingBrand && existingBrand.id !== id) {
        throw new ConflictException(
          'Já existe uma marca cadastrada com este nome.',
        );
      }
    }

    Object.assign(brand, updateBrandDto);

    return this.brandRepository.save(brand);
  }

  // Excluir
  async remove(id: number): Promise<void> {
    const brand = await this.findOne(id);

    const productCount = await this.productsService.countByBrandId(id);

    if (productCount !== undefined) {
      throw new ConflictException({
        message:
          'Não é possível excluir a marca, pois existem produtos cadastrados com ela.',
        products: productCount,
      });
    }

    await this.brandRepository.remove(brand);
  }
}
