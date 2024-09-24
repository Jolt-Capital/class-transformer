// import { Expose5 } from '../../src/decorators/expose.decorator';
import '../../src/symbol-polyfill.ts';
import { instanceToPlain, Expose5 } from '../../src';
import { defaultMetadataStorage } from '../../src/storage';

class User {
  id: number;

  @Expose5({ name: 'lala' })
  firstName: string;

  @Expose5({ groups: ['user'] })
  lastName: string;

  password: string;
}

describe('ignoring specific decorators', () => {
  it('when ignoreDecorators is set to true it should ignore all decorators', () => {
    defaultMetadataStorage.clear();

    const user = new User();
    user.firstName = 'Umed';
    user.lastName = 'Khudoiberdiev';
    user.password = 'imnosuperman';
    console.log(user);

    const ourMetadata = User[Symbol.metadata];
    console.log('ourMetadata:', ourMetadata);

    const plainedUser = instanceToPlain(user, { excludeExtraneousValues: true });
    expect(plainedUser).toEqual({
      firstName: 'Umed',
      lastName: 'Khudoiberdiev',
      password: 'imnosuperman',
    });
  });
});
