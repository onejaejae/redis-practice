import { Union } from 'src/common/type/common.interface';
import { FindOptionsRelations } from 'typeorm';

export type OmitUppercaseProps<T> = {
  [K in keyof T as K extends string
    ? K extends `${Uppercase<string>}${string}`
      ? never
      : K
    : K]: T[K];
};

export type OmitNotJoinedProps<T, R extends FindOptionsRelations<T>> = {
  [K in keyof T as K extends string
    ? K extends `${Uppercase<string>}${string}`
      ? K extends keyof R
        ? K
        : never
      : K
    : K]: K extends keyof R
    ? R[K] extends true
      ? T[K] extends (infer U)[]
        ? OmitUppercaseProps<U>[]
        : OmitUppercaseProps<T[K]>
      : R[K] extends object
        ? T[K] extends (infer U)[]
          ? OmitNotJoinedProps<U, R[K]>[]
          : OmitNotJoinedProps<T[K], R[K]>
        : T[K]
    : T[K];
};

export const LockMode = {
  PessimisticWrite: 'pessimistic_write',
} as const;
export type LockMode = Union<typeof LockMode>;
