import { defaultMetadataStorage } from '../storage';
import { ExcludeMetadata, ExcludeOptions } from '../interfaces';
import { FieldMetadata, getFieldMetadata } from './commons.decorator';

/**
 * Marks the given class or property as excluded. By default the property is excluded in both
 * constructorToPlain and plainToConstructor transformations. It can be limited to only one direction
 * via using the `toPlainOnly` or `toClassOnly` option.
 *
 * Can be applied to class definitions and properties.
 */
export function ExcludeExperimental(options: ExcludeOptions = {}): PropertyDecorator & ClassDecorator {
  /**
   * NOTE: The `propertyName` property must be marked as optional because
   * this decorator used both as a class and a property decorator and the
   * Typescript compiler will freak out if we make it mandatory as a class
   * decorator only receives one parameter.
   */
  return function (object: any, propertyName?: string | Symbol): void {
    defaultMetadataStorage.addExcludeMetadata({
      target: object instanceof Function ? object : object.constructor,
      propertyName: propertyName as string,
      options,
    });
  };
}

export function Exclude(options: ExcludeOptions = {}) {
  return function (target: any, context: ClassMemberDecoratorContext | ClassDecoratorContext): void {
    if (context.kind === 'field') {
      const fieldMetadata: FieldMetadata = getFieldMetadata(context, context.name);
      fieldMetadata.exclude = { options };
    } else if (context.kind === 'class') {
      const excludeMetadata: ExcludeMetadata = { target, propertyName: undefined, options: options };
      defaultMetadataStorage.addExcludeMetadata(excludeMetadata);
    }
  };
}
