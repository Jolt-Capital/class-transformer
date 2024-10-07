import {
  ExcludeOptions,
  ExposeOptions,
  TransformFnParams,
  TypeHelpOptions,
  TypeOptions,
  TransformOptions,
  TypeMetadata,
  ExposeMetadata,
  ExcludeMetadata,
  TransformMetadata,
} from '../interfaces';
import { defaultMetadataStorage } from '../storage';

export type FieldMetadata = {
  expose?: { options: ExposeOptions };
  type?: { typeFunction?: (type?: TypeHelpOptions) => Function; options: TypeOptions; reflectedType?: Function };
  exclude?: { options: ExcludeOptions };
  transform: { transformFn: (params: TransformFnParams) => any; options: TransformOptions }[];
};

function getEmptyFieldMetadata() {
  return {
    transform: [],
  };
}

export function getFieldMetadata(context: ClassMemberDecoratorContext, propertyName: PropertyKey): FieldMetadata {
  context.metadata[propertyName] ??= getEmptyFieldMetadata();
  return context.metadata[propertyName] as FieldMetadata;
}

export function storeTargetMetadata(target: Function | TypeMetadata) {
  if (typeof target === 'function' && target[Symbol.metadata] && !defaultMetadataStorage.isProcessed(target)) {
    const classMetadata: DecoratorMetadataObject = target[Symbol.metadata];
    Object.entries(classMetadata).forEach(([key, value]: [string, FieldMetadata]) => {
      if (value.expose) {
        const exposeMetadata: ExposeMetadata = { target, propertyName: key, options: value.expose.options };
        defaultMetadataStorage.addExposeMetadata(exposeMetadata);
      }

      if (value.exclude) {
        const excludeMetadata: ExcludeMetadata = { target, propertyName: key, options: value.exclude.options };
        defaultMetadataStorage.addExcludeMetadata(excludeMetadata);
      }

      if (value.type) {
        const reflectedType =
          // set by @TypeOfMap() or by @TypeOfSet()
          value.type.reflectedType
            ? value.type.reflectedType
            : // set by @Type()?
              typeof value.type.typeFunction === 'function'
              ? value.type.typeFunction()
              : // don't know what is reflectedType
                undefined;
        const typeMetadata: TypeMetadata = {
          target,
          propertyName: key,
          reflectedType,
          typeFunction: value.type.typeFunction,
          options: value.type.options,
        };
        defaultMetadataStorage.addTypeMetadata(typeMetadata);
      }

      (value.transform ?? []).forEach(transform => {
        const transformMetadata: TransformMetadata = {
          target: target,
          propertyName: key,
          transformFn: transform.transformFn,
          options: transform.options,
        };
        defaultMetadataStorage.addTransformMetadata(transformMetadata);
      });
    });
    defaultMetadataStorage.addProcessed(target);
  }
}
