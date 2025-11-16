import { expectType, expectError, expectAssignable } from "tsd";
import type {
  DeepReadonly,
  DeepRequired,
  Exact,
  Maybe,
  NonEmptyArray,
  Nullish,
  RequireAtLeastOne,
  Truthy,
  Falsy,
  UnionToIntersection,
  Mutable,
  ValueOf,
} from "../dist/types.js";
import { assertNever } from "../dist/asserts.js";
import { isDiscriminatedUnionMember } from "../dist/typeguards.js";

// Exact should reject extra keys in either direction
type Shape = { a: string; b?: number };
expectAssignable<Exact<Shape, Shape>>({ a: "x" });
expectError(() => {
  const tooWide: Exact<Shape, { a: string; c: boolean }> = { a: "x", c: true };
  return tooWide;
});

// RequireAtLeastOne enforces presence
type Opts = { a?: string; b?: number; c?: boolean };
expectAssignable<RequireAtLeastOne<Opts>>({ a: "x" });
expectError(() => {
  const none: RequireAtLeastOne<Opts> = {};
  void none;
});
type OnlyAB = RequireAtLeastOne<Opts, "a" | "b">;
expectAssignable<OnlyAB>({ a: "x" });
expectAssignable<OnlyAB>({ b: 1 });
expectError(() => {
  const noneAB: OnlyAB = {};
  void noneAB;
});

// DeepReadonly / Mutable
type Nested = { a: { b: number[] } };
expectAssignable<DeepReadonly<Nested>>({ a: { b: [1, 2] } as const });
expectAssignable<Mutable<DeepReadonly<Nested>>>({ a: { b: [1, 2] } });

// DeepRequired enforces nested presence
expectError(() => {
  const incomplete: DeepRequired<{ a?: { b?: number } }> = {};
  void incomplete;
});
expectType<DeepRequired<{ a?: { b?: number } }>>({ a: { b: 1 } });

// NonEmptyArray narrows tuple
const nonEmpty: NonEmptyArray<number> = [1, 2, 3];
expectType<number>(nonEmpty[0]);
expectError(() => {
  const shouldFail: NonEmptyArray<number> = [];
  void shouldFail;
});

// Nullish / Maybe / Truthy / Falsy
const maybeStr: Maybe<string> = undefined as Nullish;
expectType<Nullish>(maybeStr);
type TruthyStr = Truthy<string | "">;
expectAssignable<TruthyStr>("hello");
expectAssignable<Falsy>(false);
type Mixed = Truthy<"" | 0 | "hi" | null>;
expectAssignable<Mixed>("hi");

// UnionToIntersection
type U = { a: string } | { b: number };
expectAssignable<UnionToIntersection<U>>({ a: "x", b: 1 });

// ValueOf
type Obj = { foo: 1; bar: 2 };
expectAssignable<ValueOf<Obj>>(1 as const);
expectAssignable<ValueOf<Obj>>(2 as const);

// assertNever maintains never input
declare const neverFn: (v: never) => typeof assertNever;
expectError(() => neverFn("oops" as any));

// Discriminated union guard retains tag semantics
type Kinded = { kind: "a"; a: number } | { kind: "b"; b: string };
declare const maybeKinded: Kinded;
if (isDiscriminatedUnionMember(maybeKinded, "kind", "a")) {
  expectType<{ kind: "a"; a: number }>(maybeKinded);
} else {
  expectType<{ kind: "b"; b: string }>(maybeKinded);
}
