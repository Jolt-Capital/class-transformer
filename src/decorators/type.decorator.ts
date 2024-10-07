import { defaultMetadataStorage } from '../storage';
import { TypeHelpOptions, TypeOptions } from '../interfaces';
import { FieldMetadata, getFieldMetadata } from './commons.decorator';

/**
 * Specifies a type of the property.
 * The given TypeFunction can return a constructor. A discriminator can be given in the options.
 *
 * Can be applied to properties only.
 */
export function TypeExperimental(
  typeFunction?: (type?: TypeHelpOptions) => Function,
  options: TypeOptions = {}
): PropertyDecorator {
  return function (target: any, propertyName: string | Symbol): void {
    const reflectedType = (Reflect as any).getMetadata('design:type', target, propertyName);
    defaultMetadataStorage.addTypeMetadata({
      target: target.constructor,
      propertyName: propertyName as string,
      reflectedType,
      typeFunction,
      options,
    });
  };
}

// Note: at compilation time we can test the type of the property to check if it is a Map, a Set or an Array (or a type extending one of these).
// But since we have avoided the use of reflect-metadata (incompatible with for instance esbuild), at runtime we can't access to the type of the property
// but we need to know it in order to chose the right constructor... so we have created two more decorators, one for Map and one for Set
// A better way shall to have a decorator

type Iterated<T> = T extends Array<infer V> ? V : T extends Set<infer V> ? V : T extends Map<string, infer V> ? V : T;

type EnsureIsNeitherMapNorSet<T> = T extends Map<any, any> ? never : T extends Set<any> ? never : T;

/**
 * If you have a compilation error, it's maybe because the property is a Map or a Set. In these cases you should use the @TypeForMap or @TypeForSet decorators
 * @param typeFunction
 * @param options
 * @returns
 */
export function Type<T>(typeFunction?: (type?: TypeHelpOptions) => Function, options: TypeOptions = {}) {
  return function (
    target: any,
    context:
      | ClassFieldDecoratorContext<unknown, EnsureIsNeitherMapNorSet<T>>
      | ClassAccessorDecoratorContext<unknown, EnsureIsNeitherMapNorSet<T>>
      | ClassGetterDecoratorContext<unknown, EnsureIsNeitherMapNorSet<T>>
      | ClassSetterDecoratorContext<unknown, EnsureIsNeitherMapNorSet<T>>
  ): void {
    const fieldMetadata: FieldMetadata = getFieldMetadata(context, context.name);
    fieldMetadata.type = { typeFunction, options };
  };
}

type EnsureIsMap<T> = T extends Map<any, any> ? T : never;

/**
 * If you have a compilation error, it's maybe because the property doesn't extend a Map
 * @param typeFunction
 * @param options
 * @returns
 */
export function TypeForMap<T extends Map<string, any>>(
  typeFunction?: (type?: TypeHelpOptions) => new (...args: any[]) => Iterated<T>, // Function, // ClassConstructor<Iterated<T>>,
  options: TypeOptions = {}
) {
  return function (target: any, context: ClassFieldDecoratorContext<unknown, EnsureIsMap<T>>): void {
    const fieldMetadata: FieldMetadata = getFieldMetadata(context, context.name);
    fieldMetadata.type = { typeFunction, options, reflectedType: Map };
  };
}

type EnsureIsSet<T> = T extends Set<any> ? T : never;
/**
 * If you have a compilation error, it's maybe because the property doesn't extend a Set
 * @param typeFunction
 * @param options
 * @returns
 */
export function TypeForSet<T extends Set<any>>(
  typeFunction?: (type?: TypeHelpOptions) => new (...args: any[]) => Iterated<T>,
  options: TypeOptions = {}
) {
  return function (target: any, context: ClassFieldDecoratorContext<unknown, EnsureIsSet<T>>): void {
    const fieldMetadata: FieldMetadata = getFieldMetadata(context, context.name);
    fieldMetadata.type = { typeFunction, options, reflectedType: Set };
  };
}
