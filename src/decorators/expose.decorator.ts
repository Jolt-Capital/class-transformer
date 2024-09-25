import { defaultMetadataStorage } from '../storage';
import {
  ExcludeMetadata,
  ExposeMetadata,
  ExposeOptions,
  TransformMetadata,
  TypeHelpOptions,
  TypeMetadata,
} from '../interfaces';
import { FieldMetadata, getFieldMetadata } from './commons.decorator';

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
