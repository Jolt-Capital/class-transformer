import { defaultMetadataStorage } from '../storage';
import {
  ClassConstructor,
  ExcludeMetadata,
  ExposeMetadata,
  ExposeOptions,
  TransformMetadata,
  TypeHelpOptions,
  TypeMetadata,
} from '../interfaces';
import { FieldMetadata, getFieldMetadata } from './commons.decorator';
import { Type, TypeForMap, TypeForSet } from './type.decorator';
import { stringify } from 'querystring';

/**
 * Marks the given class or property as included. By default the property is included in both
 * constructorToPlain and plainToConstructor transformations. It can be limited to only one direction
 * via using the `toPlainOnly` or `toClassOnly` option.
 *
 * Can be applied to class definitions and properties.
 */
export function ExposeExperimental(options: ExposeOptions = {}): any /* PropertyDecorator & ClassDecorator */ {
  /**
   * NOTE: The `propertyName` property must be marked as optional because
   * this decorator used both as a class and a property decorator and the
   * Typescript compiler will freak out if we make it mandatory as a class
   * decorator only receives one parameter.
   */
  return function (object: any, propertyName?: string | Symbol): void {
    defaultMetadataStorage.addExposeMetadata({
      target: object instanceof Function ? object : object.constructor,
      propertyName: propertyName as string,
      options,
    });
  };
}

/**
 * When a Class is Expose, all Class Fields are inspected and (Expose|Exclude|Type|Transform)metadata are added to the default defaultMetadataStorage
 */
export function Expose(options: ExposeOptions = {}) {
  return function (target: any, context: ClassMemberDecoratorContext | ClassDecoratorContext): void {
    if (context.kind === 'field') {
      const fieldMetadata: FieldMetadata = getFieldMetadata(context, context.name);
      fieldMetadata.expose = { options };
    } else if (context.kind === 'class') {
      const exposeMetadata: ExposeMetadata = { target, propertyName: undefined, options: options };
      defaultMetadataStorage.addExposeMetadata(exposeMetadata);
    }
  };
}

function Expose2<This, Value>(exposedType: ClassConstructor<Value>, options: ExposeOptions = {}) {
  return function (target: This, context: ClassFieldDecoratorContext<This, Value>): void {
    if (context.kind === 'field') {
      const fieldMetadata: FieldMetadata = getFieldMetadata(context, context.name);
      fieldMetadata.expose = { options };
    } else if (context.kind === 'class') {
      const exposeMetadata: ExposeMetadata = { target: target as Function, propertyName: undefined, options: options };
      defaultMetadataStorage.addExposeMetadata(exposeMetadata);
    }
  };
}

class User {
  kind: 'user';
}

class Weapon {
  kind: 'weapon';
}

// Avant
class TestExpose {
  @Expose() aString: string;

  @Expose() aNumber: number;

  @Expose() aBoolean: boolean;

  @Type(() => User) aUser: User;

  @Type(() => User) someUsers: User[];
}

// Après
class TestExpose2 {
  @Expose2(String) aString: string;

  @Expose2(Number) aNumber: number;

  @Expose2(Boolean) aBoolean: boolean;

  @Expose2(String) anInvalidProperty: boolean;

  @Expose2(User) aUser: User;

  @Expose2(Weapon) anotherInvalidProperty: User;

  @Type(() => User) arrayOfUsers: Array<User>;
  @TypeForMap(() => User) mapOfUsers: Map<string, User>;
  @TypeForSet(() => User) setOfUsers: Set<User>;
  @TypeForMap(() => User) invalidSetProperty: Set<User>;

  // ou mieux (compile errors car pas encore implémenté)
  @Type(() => Array<User>, () => User) anotherArrayOfUsers: User[];
  @Type(() => Map<string, User>, () => User) anotherMapOfUsers: Map<string, User>;
  @Type(() => Set<User>, () => User) anotherSetOfUsers: Map<string, User>;
}
