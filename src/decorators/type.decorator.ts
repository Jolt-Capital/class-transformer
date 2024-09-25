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

export function Type(typeFunction?: (type?: TypeHelpOptions) => Function, options: TypeOptions = {}) {
  return function (target: any, context: ClassFieldDecoratorContext | ClassAccessorDecoratorContext): void {
    const fieldMetadata: FieldMetadata = getFieldMetadata(context, context.name);
    fieldMetadata.type = { typeFunction, options };
  };
}
