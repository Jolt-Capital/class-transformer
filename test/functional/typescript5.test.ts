// import { Expose5 } from '../../src/decorators/expose.decorator';
import { instanceToPlain, Expose, Type, plainToInstance, TransformInstanceToInstance } from '../../src';
import { defaultMetadataStorage } from '../../src/storage';

describe('Jolt capital short tests', () => {
  it('first test', () => {
    defaultMetadataStorage.clear();

    class User {
      id: number;

      @Expose({ name: 'lala' })
      firstName: string;

      @Expose({ groups: ['user'] })
      lastName: string;

      @Expose()
      password: string;

      @Expose({ toClassOnly: true })
      passwordToClass: string;

      @Expose() @Type(() => User) manager?: User;
    }

    class Group {
      @Expose()
      @Type(() => User)
      users: User[];
    }

    class UserController {
      @TransformInstanceToInstance()
      getUser(): User {
        const user = new User();
        user.firstName = 'Snir';
        user.lastName = 'Segal';
        user.password = 'imnosuperman';
        user.passwordToClass = 'imnosupermanTOCLASS';

        return user;
      }
    }

    const user = new User();
    user.firstName = 'Umed';
    user.lastName = 'Khudoiberdiev';
    user.password = 'imnosuperman';

    const fromPlain = plainToInstance(User, {
      lala: 'Umed',
      // lastName: 'Khudoiberdiev',
      password: 'imnosuperman',
    });

    const manager = new User();
    manager.firstName = 'Filip';
    manager.lastName = 'Laval';
    manager.password = 'passssss';

    const group = new Group();
    group.users = [user];

    const userMetadata = User[Symbol.metadata];
    const groupMetadata = Group[Symbol.metadata];

    const plainedUser = instanceToPlain(user, { excludeExtraneousValues: true });
    expect(plainedUser).toEqual({
      lala: 'Umed',
      // lastName: 'Khudoiberdiev',
      password: 'imnosuperman',
    });
    const plainedManager = instanceToPlain(manager, { excludeExtraneousValues: true });

    const plainedGroup = instanceToPlain(group, { excludeExtraneousValues: true });
    expect(plainedGroup.users).toBeDefined();
    expect(plainedGroup.users).toHaveLength(1);
    expect(plainedGroup.users[0]).toEqual({
      lala: 'Umed',
      // lastName: 'Khudoiberdiev',
      password: 'imnosuperman',
    });

    const groupCopy = plainToInstance(Group, plainedGroup);
    expect(groupCopy).toBeDefined();
    expect(groupCopy.users).toBeDefined();
    expect(groupCopy.users).toHaveLength(1);
    expect(group.users[0]).toBeInstanceOf(User);
    expect(groupCopy.users).toBeInstanceOf(Array<User>);

    plainedUser.manager = plainedManager;
    plainedUser.passwordToClass = 'imnosupermanTOCLASS';
    plainedUser.password = 'imnosuperman';

    const userCopy = plainToInstance(User, plainedUser);
    expect(userCopy).toBeDefined();
    expect(userCopy.passwordToClass).toEqual('imnosupermanTOCLASS');
    expect(userCopy.manager).toBeDefined();
    expect(userCopy.manager).toBeInstanceOf(User);
  });
});
