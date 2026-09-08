import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

// Tirar Senha
type SafeUser = Omit<User, 'passwordHash'>;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Criar
  async create(email: string, password: string): Promise<SafeUser> {
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
    });

    const savedUser = await this.userRepository.save(user);

    return this.removePasswordHash(savedUser);
  }

  // Buscar todos
  async findAll(): Promise<SafeUser[]> {
    const users = await this.userRepository.find();

    return users.map((user) => this.removePasswordHash(user));
  }

  // Buscar Por iD
  async findOne(id: number): Promise<SafeUser> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return this.removePasswordHash(user);
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

  // Tirar a senha dos retornos
  private removePasswordHash(user: User): SafeUser {
    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  // Busca sem Formatação
  private async findOneEntity(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }
}
