/**
 * Run with: deno run examples/basic.ts
 */
import { error, none, pipe, type Result, some, success } from "../mod.ts";

const parseAge = (raw: string): Result<number, "NOT_A_NUMBER" | "NEGATIVE"> => {
  const n = Number(raw);
  if (Number.isNaN(n)) return error("NOT_A_NUMBER");
  if (n < 0) return error("NEGATIVE");
  return success(n);
};

const isAdult = (age: number) => age >= 18;
const describe = (isAdult: boolean) => (isAdult ? "adult" : "minor");

const label = parseAge("21")
  .bind(pipe(isAdult, describe, success))
  .fold(
    (s) => s,
    (e) => `invalid age: ${e}`,
  );

console.log(label); // "adult"

const users = new Map([["ada", "Ada Lovelace"]]);
const findUser = (id: string) => users.has(id) ? some(users.get(id)!) : none();

const greeting = findUser("ada")
  .bind((name) => some(`Hello, ${name}!`))
  .fold(
    (s) => s,
    () => "Unknown user",
  );

console.log(greeting); // "Hello, Ada Lovelace!"
