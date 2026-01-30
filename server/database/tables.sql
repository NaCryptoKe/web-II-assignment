CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username        VARCHAR(50) UNIQUE NOT NULL,
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   TEXT NOT NULL,
    role            VARCHAR(20) NOT NULL DEFAULT 'user',
    is_verified     BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT valid_role
        CHECK (role IN ('user', 'admin'))
);

CREATE TABLE games (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title            VARCHAR(255) NOT NULL,
    description      TEXT NOT NULL,
    price            NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    owner_id         UUID NOT NULL,
    status           VARCHAR(20) NOT NULL DEFAULT 'pending',
    file_path        TEXT NOT NULL,
    image_path       TEXT,
    downloads_count  INTEGER NOT NULL DEFAULT 0,
    rating_count     INTEGER DEFAULT 0,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    review_count     INTEGER,

    CONSTRAINT valid_game_status
        CHECK (status IN ('pending', 'active', 'rejected')),

    CONSTRAINT fk_games_owner
        FOREIGN KEY (owner_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE orders (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id       UUID NOT NULL,
    total_price   NUMERIC(10, 2) NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_orders_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE order_items (
    id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id           UUID NOT NULL,
    game_id            UUID NOT NULL,
    price_at_purchase  NUMERIC(10, 2) NOT NULL,

    CONSTRAINT fk_order_items_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_order_items_game
        FOREIGN KEY (game_id)
        REFERENCES games(id)
        ON DELETE RESTRICT,

    CONSTRAINT unique_order_game
        UNIQUE (order_id, game_id)
);

CREATE TABLE otp (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email       VARCHAR(255) NOT NULL,
    code        VARCHAR(10) NOT NULL,
    expires_at  TIMESTAMPTZ NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE reviews (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_id     UUID NOT NULL,
    user_id     UUID NOT NULL,
    rating      INTEGER NOT NULL,
    review      TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_reviews_game
        FOREIGN KEY (game_id)
        REFERENCES games(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_reviews_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT rating_check
        CHECK (rating >= 1 AND rating <= 5)
);