const { password } = require("pg/lib/defaults");

exports.up = (pgm) => {
  pgm.createTable("users", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },

    // For reference, GitHub limits usernames up to 39 caracters
    username: {
      type: "varchar(30)",
      notNull: true,
      unique: true,
    },

    // For reference, 254 character because: https://stackoverflow.com/a/1199238
    email: {
      type: "varchar(254)",
      notNull: true,
      unique: true,
    },

    // For reference, 72 character because: https://security.stackexchange.com/a/39851
    password: {
      type: "varchar(72)",
      notNull: true,
    },

    // For reference, timestamptz because: https://justatheory.com/2012/04/postgres-use-timestamptz/
    created_at: {
      type: "timestamptz",
      default: pgm.func("now()"),
    },

    updated_at: {
      type: "timestamptz",
      default: pgm.func("now()"),
    },
  });
};

exports.down = false;
