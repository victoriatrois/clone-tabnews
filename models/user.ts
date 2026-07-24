import database from "../infra/database";
import password from "../models/password";
import { User } from "../types/types";
import { NotFoundError, ValidationError } from "../infra/errors";

async function findOneByUsername(username: string): Promise<User> {
  const returnedUser = await runSelectQuery(username);

  return returnedUser;

  async function runSelectQuery(username: string): Promise<User> {
    const result = await database.query({
      text: `
        SELECT
          *
        FROM
          users
        WHERE
          LOWER(username) = LOWER($1)
        LIMIT
          1
      ;`,
      values: [username],
    });

    if (result.rowCount === 0) {
      throw new NotFoundError({
        message: "The informed user was not found",
        action: "Check the if the username is correct.",
      });
    }

    return result.rows[0];
  }
}

async function create(userInput: User) {
  await validateUniqueUsername(userInput.username);
  await validateUniqueEmail(userInput.email);
  await hashPasswordInObject(userInput);

  const newUser = await runInsertQuery(userInput);

  return newUser;

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
      values: [userInput.username, userInput.email, userInput.password],
    });

    return result.rows[0];
  }
}

async function update(username: string, userInput: User) {
  const currentUser = await findOneByUsername(username);

  if ("username" in userInput) {
    await validateUniqueUsername(userInput.username);
  }

  if ("email" in userInput) {
    await validateUniqueEmail(userInput.email);
  }

  if ("password" in userInput) {
    await hashPasswordInObject(userInput);
  }

  const userUpdatedData = {
    ...currentUser,
    ...userInput,
  };

  const updatedUser = await runUpdateQuery(userUpdatedData);
  return updatedUser;

  async function runUpdateQuery(userUpdatedData: User): Promise<User> {
    const results = await database.query({
      text: `
        UPDATE
          users
        SET
          username = $2,
          email = $3,
          password = $4,
          updated_at = timezone('utc', now())
        WHERE
          id = $1
        RETURNING
          *
      `,
      values: [
        userUpdatedData.id,
        userUpdatedData.username,
        userUpdatedData.email,
        userUpdatedData.password,
      ],
    });

    return results.rows[0];
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
      message: "The informed username has already been used",
      action: "Use a different username in this opperation.",
    });
  }
}

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
      message: "The informed email address has already been used",
      action: "Use a different email address in this operation.",
    });
  }
}

async function hashPasswordInObject(userInput: User) {
  const hashedPassword = await password.hash(userInput.password);
  userInput.password = hashedPassword;
}

const user = {
  create,
  update,
  findOneByUsername,
};

export default user;
