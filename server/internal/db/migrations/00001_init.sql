-- +goose Up
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE experience_type AS ENUM ('research', 'internship', 'job');
CREATE TYPE project_category AS ENUM ('ml', 'systems', 'networks');
CREATE TYPE project_status AS ENUM ('completed', 'ongoing', 'published');
CREATE TYPE skill_proficiency AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');
CREATE TYPE post_status AS ENUM ('draft', 'published');
CREATE TYPE post_type AS ENUM ('blog', 'learning-log');

-- Single seeded admin, no public signup — mirrors the old Supabase Auth
-- setup but owned by this service now.
CREATE TABLE admin_users (
    id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email         text NOT NULL UNIQUE,
    password_hash text NOT NULL,
    created_at    timestamptz NOT NULL DEFAULT now()
);

-- Singleton row (id always 1).
CREATE TABLE profile (
    id               integer PRIMARY KEY DEFAULT 1,
    name             text NOT NULL,
    tagline          text NOT NULL,
    bio              text NOT NULL,
    email            text NOT NULL,
    phone            text,
    location         text,
    linkedin_url     text,
    github_url       text,
    twitter_url      text,
    youtube_url      text,
    instagram_url    text,
    scholar_url      text,
    orcid_url        text,
    website_url      text,
    avatar_url       text,
    resume_url       text,
    languages        jsonb NOT NULL DEFAULT '[]'::jsonb, -- [{name, level}]
    academic_skills  text[] NOT NULL DEFAULT '{}',
    updated_at       timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT profile_singleton CHECK (id = 1)
);

CREATE TABLE experience (
    id               text PRIMARY KEY,
    title            text NOT NULL,
    company          text NOT NULL,
    location         text,
    type             experience_type NOT NULL,
    start_date       text NOT NULL, -- "YYYY-MM"
    end_date         text,
    description      text NOT NULL,
    responsibilities text[] NOT NULL DEFAULT '{}',
    technologies     text[] NOT NULL DEFAULT '{}',
    achievements     text[] NOT NULL DEFAULT '{}',
    company_url      text,
    sort_order       integer NOT NULL DEFAULT 0,
    created_at       timestamptz NOT NULL DEFAULT now(),
    updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE experience_sub_roles (
    id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    experience_id    text NOT NULL REFERENCES experience(id) ON DELETE CASCADE,
    title            text NOT NULL,
    company          text NOT NULL,
    start_date       text NOT NULL,
    end_date         text,
    description      text NOT NULL,
    responsibilities text[] NOT NULL DEFAULT '{}',
    technologies     text[] NOT NULL DEFAULT '{}',
    achievements     text[] NOT NULL DEFAULT '{}',
    sort_order       integer NOT NULL DEFAULT 0
);
CREATE INDEX idx_experience_sub_roles_experience_id ON experience_sub_roles(experience_id);

CREATE TABLE projects (
    id               text PRIMARY KEY,
    title            text NOT NULL,
    description      text NOT NULL,
    long_description text,
    technologies     text[] NOT NULL DEFAULT '{}',
    github_url       text,
    live_url         text,
    paper_url        text,
    image_url        text,
    featured         boolean NOT NULL DEFAULT false,
    category         project_category NOT NULL,
    start_date       text NOT NULL,
    end_date         text,
    status           project_status,
    impact           text,
    metrics          text[] NOT NULL DEFAULT '{}',
    sort_order       integer NOT NULL DEFAULT 0,
    created_at       timestamptz NOT NULL DEFAULT now(),
    updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE education (
    id                   text PRIMARY KEY,
    institution          text NOT NULL,
    degree               text NOT NULL,
    field                text NOT NULL,
    start_date           text NOT NULL,
    end_date             text,
    gpa                  text,
    location             text,
    description          text,
    achievements         text[] NOT NULL DEFAULT '{}',
    relevant_coursework  text[] NOT NULL DEFAULT '{}',
    thesis               text,
    sort_order           integer NOT NULL DEFAULT 0
);

CREATE TABLE skills (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    category    text NOT NULL,
    skills      text[] NOT NULL DEFAULT '{}',
    proficiency skill_proficiency,
    sort_order  integer NOT NULL DEFAULT 0
);

CREATE TABLE posts (
    id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    type             post_type NOT NULL DEFAULT 'blog',
    slug             text NOT NULL UNIQUE,
    title            text NOT NULL,
    excerpt          text,
    content_markdown text NOT NULL,
    cover_image_url  text,
    tags             text[] NOT NULL DEFAULT '{}',
    status           post_status NOT NULL DEFAULT 'draft',
    published_at     timestamptz,
    created_at       timestamptz NOT NULL DEFAULT now(),
    updated_at       timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_posts_type_status ON posts(type, status);

CREATE TABLE contact_messages (
    id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name       text NOT NULL,
    email      text NOT NULL,
    subject    text,
    message    text NOT NULL,
    read       boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- +goose Down
DROP TABLE contact_messages;
DROP TABLE posts;
DROP TABLE skills;
DROP TABLE education;
DROP TABLE projects;
DROP TABLE experience_sub_roles;
DROP TABLE experience;
DROP TABLE profile;
DROP TABLE admin_users;
DROP TYPE post_type;
DROP TYPE post_status;
DROP TYPE skill_proficiency;
DROP TYPE project_status;
DROP TYPE project_category;
DROP TYPE experience_type;
