import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
import { Order } from '../../common/enums/order-filter.enum';
import { FindUsersQueryDto } from './dto/find-users-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from './entities/user.entity';
import { UserRole } from './enums/users-enums.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Criar --> Usado no Auth
  async create(email: string, password: string): Promise<User> {
    const existingUser = await this.findByEmail(email);

    if (existingUser) {
      throw new ConflictException(
        'Já existe um usuário cadastrado com este e-mail.',
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      email,
      passwordHash,
      role: UserRole.USER,
    });

    return this.userRepository.save(user);
  }

  // Buscar todos ou filtrar
  async findAll(
    query: FindUsersQueryDto,
  ): Promise<PaginatedResponseDto<UserResponseDto>> {
    const { page = 1, limit = 10, order = Order.DESC, email, role } = query;

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.email',
        'user.role',
        'user.createdAt',
        'user.updatedAt',
      ]);

    if (email) {
      queryBuilder.andWhere('user.email LIKE :email', {
        email: `%${email}%`,
      });
    }

    if (role) {
      queryBuilder.andWhere('user.role = :role', {
        role,
      });
    }

    queryBuilder
      .orderBy('user.id', order)
      .skip((page - 1) * limit)
      .take(limit);

    const [users, total] = await queryBuilder.getManyAndCount();

    return {
      data: users.map((user) => this.toResponse(user)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Buscar Por iD
  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.findOneEntity(id);

    return this.toResponse(user);
  }

  async findOneEntity(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  // Buscar Por email
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({
      email,
    });
  }

  // Atualizar
  async update(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<{ message: string }> {
    const user = await this.findOneEntity(userId);

    user.passwordHash = await bcrypt.hash(updateUserDto.password, 10);

    await this.userRepository.save(user);

    return {
      message: 'Senha atualizada com sucesso.',
    };
  }

  // Excluir
  async remove(userId: number): Promise<void> {
    const user = await this.findOneEntity(userId);

    await this.userRepository.remove(user);
  }

  // Transformação para resposta
  private toResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
    };
  }
}
