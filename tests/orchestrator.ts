import retry from "async-retry";
import { faker } from "@faker-js/faker";

import database from "../infra/database";
import migrator from "../models/migrator";
import user from "../models/user";
import { CreateUserInput, User } from "../types/types";

async function waitForAllServices(): Promise<void> {
  await waitForWebServices();

  async function waitForWebServices(): Promise<void> {
    return retry(fetchStatusPage, {
      retries: 1000,
      minTimeout: 100,
      maxTimeout: 1000,
    });

    async function fetchStatusPage(): Promise<void> {
      const response = await fetch("http://localhost:3000/api/v1/status");

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      await response.json;
    }
  }
}
async function resetDatabase() {
  await database.query({
    text: "drop schema public cascade; create schema public;",
  });
}

async function applyPendingMigrations() {
  await migrator.applyPendingMigrations();
}

async function createUser(userData: Partial<CreateUserInput>): Promise<User> {
  return await user.create({
    username:
      userData.username || faker.internet.username().replace(/[_.-]/g, ""),
    email: userData.email || faker.internet.email(),
    password: userData.password || "validPassword",
  });
}

const orchestrator = {
  waitForAllServices,
  resetDatabase,
  applyPendingMigrations,
  createUser,
};

export default orchestrator;
