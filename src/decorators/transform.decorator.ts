import { defaultMetadataStorage } from '../storage';
import { TransformFnParams, TransformOptions } from '../interfaces';
import { FieldMetadata, getFieldMetadata } from './commons.decorator';

/**
 * Defines a custom logic for value transformation.
 *
 * Can be applied to properties only.
 */
export function TransformExperimental(
  transformFn: (params: TransformFnParams) => any,
  options: TransformOptions = {}
): PropertyDecorator {
  return function (target: any, propertyName: string | Symbol): void {
    defaultMetadataStorage.addTransformMetadata({
      target: target.constructor,
      propertyName: propertyName as string,
      transformFn,
      options,
    });
  };
}

export function Transform(transformFn: (params: TransformFnParams) => any, options: TransformOptions = {}) {
  return function (target: any, context: ClassMemberDecoratorContext): void {
    const fieldMetadata: FieldMetadata = getFieldMetadata(context, context.name);
    fieldMetadata.transform.push({ transformFn, options });
  };
}
