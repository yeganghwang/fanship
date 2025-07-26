import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt'; // bcrypt import 추가

// Mock bcrypt (파일 최상단으로 이동)
jest.mock('bcrypt', () => ({
  hash: jest.fn((password) => Promise.resolve(`hashed_${password}`)),
  compare: jest.fn((password, hashedPassword) => Promise.resolve(`hashed_${password}` === hashedPassword)),
}));

interface MockRepository {
  findOne: jest.Mock;
  create: jest.Mock;
  save: jest.Mock;
}

describe('UserService', () => {
  let userService: UserService;
  let usersRepository: MockRepository; // Type changed to MockRepository

  // Mock Repository 정의
  const mockRepository: MockRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository, // useValue로 변경
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    usersRepository = mockRepository; // mockRepository 직접 할당

    // 모든 jest.Mock 함수 초기화
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('register', () => {
    const createUserDto = {
      username: 'testuser',
      password: 'testpassword123',
      mail: 'test@example.com',
      nickname: '테스트유저',
      position: 'fan',
      dob: '1990-01-01',
      ig_url: null,
      pfp_img_url: null,
      company_id: null,
      celeb_type: null,
    };

    it('should successfully register a new user', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockImplementation((dto) => ({
        ...dto,
        password: `hashed_${dto.password}`,
        dob: dto.dob ? new Date(dto.dob) : null,
      }));
      mockRepository.save.mockImplementation((user) => Promise.resolve({ ...user, userId: 1 }));
      bcrypt.hash.mockResolvedValue(`hashed_${createUserDto.password}`); // bcrypt.hash 모킹

      const result = await userService.register(createUserDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: [
          { username: createUserDto.username },
          { mail: createUserDto.mail },
          { nickname: createUserDto.nickname },
          ...(createUserDto.ig_url !== null && createUserDto.ig_url !== undefined ? [{ ig_url: createUserDto.ig_url }] : []),
        ],
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
      
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result).toEqual({
        ...createUserDto,
        userId: 1,
        password: `hashed_${createUserDto.password}`,
        dob: createUserDto.dob ? new Date(createUserDto.dob) : null,
      });
    });

    it('should throw ConflictException if username already exists', async () => {
      mockRepository.findOne.mockResolvedValue({ username: createUserDto.username });
      bcrypt.hash.mockResolvedValue(`hashed_${createUserDto.password}`); // bcrypt.hash 모킹

      await expect(userService.register(createUserDto)).rejects.toThrow(ConflictException);
      expect(mockRepository.findOne).toHaveBeenCalled();
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(mockRepository.create).not.toHaveBeenCalled();
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should throw ConflictException if email already exists', async () => {
      mockRepository.findOne.mockResolvedValue({ mail: createUserDto.mail });
      bcrypt.hash.mockResolvedValue(`hashed_${createUserDto.password}`); // bcrypt.hash 모킹

      await expect(userService.register(createUserDto)).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException if nickname already exists', async () => {
      mockRepository.findOne.mockResolvedValue({ nickname: createUserDto.nickname });
      bcrypt.hash.mockResolvedValue(`hashed_${createUserDto.password}`); // bcrypt.hash 모킹

      await expect(userService.register(createUserDto)).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException if instagram URL already exists', async () => {
      const testCreateUserDto = { ...createUserDto, ig_url: 'test_instagram_url' };
      mockRepository.findOne.mockResolvedValue({ ig_url: testCreateUserDto.ig_url });
      bcrypt.hash.mockResolvedValue(`hashed_${testCreateUserDto.password}`);

      await expect(userService.register(testCreateUserDto)).rejects.toThrow(ConflictException);
    });

    it('should throw InternalServerErrorException if password hashing fails', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      bcrypt.hash.mockImplementationOnce(() => {
        throw new Error('Hashing failed');
      });

      await expect(userService.register(createUserDto)).rejects.toThrow(InternalServerErrorException);
      expect(bcrypt.hash).toHaveBeenCalled();
      expect(mockRepository.create).not.toHaveBeenCalled();
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findOneByUsername', () => {
    it('should return a user if found', async () => {
      const user = { userId: 1, username: 'testuser' };
      mockRepository.findOne.mockResolvedValue(user);

      const result = await userService.findOneByUsername('testuser');
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { username: 'testuser' } });
      expect(result).toEqual(user);
    });

    it('should return null if user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await userService.findOneByUsername('nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('findOneByUserId', () => {
    it('should return a user if found', async () => {
      const user = { userId: 1, username: 'testuser' };
      mockRepository.findOne.mockResolvedValue(user);

      const result = await userService.findOneByUserId(1);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { userId: 1 } });
      expect(result).toEqual(user);
    });

    it('should return null if user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await userService.findOneByUserId(999);
      expect(result).toBeNull();
    });
  });
});