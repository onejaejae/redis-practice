type MutableArray<T> = Array<Mutable<T>>;
type MutableObject<T> = {
  -readonly [P in keyof T]: Mutable<T[P]>;
};
export type Mutable<T> =
  T extends Array<infer U>
    ? MutableArray<U>
    : T extends object
      ? MutableObject<T>
      : T;

type ValueType = string | number | boolean;

export type Union<T> =
  T extends ReadonlyArray<infer U>
    ? Union<U>
    : T extends { [key: string]: infer U }
      ? Union<U>
      : T extends ValueType
        ? T
        : never;
