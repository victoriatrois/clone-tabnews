import { User } from "types/types";
import database from "infra/database";
import { ValidationError } from "infra/errors";

async function create(userInput: User) {
  await validateUniqueEmail(userInput.email);
  await validateUniqueUsername(userInput.username);

  const newUser = await runInsertQuery(userInput);

  return newUser;

  async function validateUniqueEmail(email: string) {
    const result = await database.query({
      text: `
        SELECT
          email
        FROM
          users
        WHERE
          LOWER(email) = LOWER($1)
      ;`,
      values: [email],
    });

    if (result.rowCount > 0) {
      throw new ValidationError({
        message: "The informed email address has already signed up",
        action: "Use a different email address to sign up.",
      });
    }
  }
  async function validateUniqueUsername(username: string) {
    const result = await database.query({
      text: `
        SELECT
          username
        FROM
          users
        WHERE
          LOWER(username) = LOWER($1)
      ;`,
      values: [username],
    });

    if (result.rowCount > 0) {
      throw new ValidationError({
        message: "The informed username has already signed up",
        action: "Use a different username to sign up.",
      });
    }
  }

  async function runInsertQuery(userInput: User) {
    const result = await database.query({
    text: `
      INSERT INTO
        users (username, email, password)
      VALUES
        ($1, $2, $3)
      RETURNING
        *
    ;`,
    values: [
      userInput.username,
      userInput.email,
      userInput.password],
  });

  return result.rows[0];
  }
}

const user = {
  create,
}

export default user;