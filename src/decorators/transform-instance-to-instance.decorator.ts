import { ClassTransformer } from '../ClassTransformer';
import { ClassTransformOptions } from '../interfaces';

/**
 * Return the class instance only with the exposed properties.
 *
 * Can be applied to functions and getters/setters only.
 */
export function TransformInstanceToInstanceExperimental(params?: ClassTransformOptions): MethodDecorator {
  return function (target: Record<string, any>, propertyKey: string | Symbol, descriptor: PropertyDescriptor): void {
    const classTransformer: ClassTransformer = new ClassTransformer();
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]): Record<string, any> {
      const result: any = originalMethod.apply(this, args);
      const isPromise =
        !!result && (typeof result === 'object' || typeof result === 'function') && typeof result.then === 'function';
      return isPromise
        ? result.then((data: any) => classTransformer.instanceToInstance(data, params))
        : classTransformer.instanceToInstance(result, params);
    };
  };
}

// TODO is it the right way to invoke this decorator?...
/**
 *
 * @param options
 * @returns
 */
export function TransformInstanceToInstance(options?: ClassTransformOptions) {
  return function (originalMethod: Function) {
    return function (...args: any[]) {
      const classTransformer: ClassTransformer = new ClassTransformer();
      const result: any = originalMethod.apply(this, args);
      const isPromise =
        !!result && (typeof result === 'object' || typeof result === 'function') && typeof result.then === 'function';
      return isPromise
        ? result.then((data: any) => classTransformer.instanceToInstance(data, options))
        : classTransformer.instanceToInstance(result, options);
    };
  };
}
