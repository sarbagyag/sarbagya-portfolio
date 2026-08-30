--
-- PostgreSQL database dump
--

\restrict 0vqCOXfn0RTx4yN2bChZTKuW9IxGBG4bqFf0LHYbdIffzlCkj0yNUZclAcSXv80

-- Dumped from database version 16.15 (Debian 16.15-1.pgdg13+2)
-- Dumped by pg_dump version 16.15 (Debian 16.15-1.pgdg13+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.showcase_items DROP CONSTRAINT IF EXISTS showcase_items_category_id_fkey;
ALTER TABLE IF EXISTS ONLY public.experience_sub_roles DROP CONSTRAINT IF EXISTS experience_sub_roles_experience_id_fkey;
DROP INDEX IF EXISTS public.idx_showcase_items_category_id;
DROP INDEX IF EXISTS public.idx_posts_type_status;
DROP INDEX IF EXISTS public.idx_experience_sub_roles_experience_id;
ALTER TABLE IF EXISTS ONLY public.skills DROP CONSTRAINT IF EXISTS skills_pkey;
ALTER TABLE IF EXISTS ONLY public.showcase_items DROP CONSTRAINT IF EXISTS showcase_items_pkey;
ALTER TABLE IF EXISTS ONLY public.showcase_categories DROP CONSTRAINT IF EXISTS showcase_categories_pkey;
ALTER TABLE IF EXISTS ONLY public.projects DROP CONSTRAINT IF EXISTS projects_pkey;
ALTER TABLE IF EXISTS ONLY public.profile DROP CONSTRAINT IF EXISTS profile_pkey;
ALTER TABLE IF EXISTS ONLY public.posts DROP CONSTRAINT IF EXISTS posts_slug_key;
ALTER TABLE IF EXISTS ONLY public.posts DROP CONSTRAINT IF EXISTS posts_pkey;
ALTER TABLE IF EXISTS ONLY public.goose_db_version DROP CONSTRAINT IF EXISTS goose_db_version_pkey;
ALTER TABLE IF EXISTS ONLY public.experience_sub_roles DROP CONSTRAINT IF EXISTS experience_sub_roles_pkey;
ALTER TABLE IF EXISTS ONLY public.experience DROP CONSTRAINT IF EXISTS experience_pkey;
ALTER TABLE IF EXISTS ONLY public.education DROP CONSTRAINT IF EXISTS education_pkey;
ALTER TABLE IF EXISTS ONLY public.contact_messages DROP CONSTRAINT IF EXISTS contact_messages_pkey;
ALTER TABLE IF EXISTS ONLY public.admin_users DROP CONSTRAINT IF EXISTS admin_users_pkey;
ALTER TABLE IF EXISTS ONLY public.admin_users DROP CONSTRAINT IF EXISTS admin_users_email_key;
DROP TABLE IF EXISTS public.skills;
DROP TABLE IF EXISTS public.showcase_items;
DROP TABLE IF EXISTS public.showcase_categories;
DROP TABLE IF EXISTS public.projects;
DROP TABLE IF EXISTS public.profile;
DROP TABLE IF EXISTS public.posts;
DROP TABLE IF EXISTS public.goose_db_version;
DROP TABLE IF EXISTS public.experience_sub_roles;
DROP TABLE IF EXISTS public.experience;
DROP TABLE IF EXISTS public.education;
DROP TABLE IF EXISTS public.contact_messages;
DROP TABLE IF EXISTS public.admin_users;
DROP TYPE IF EXISTS public.skill_proficiency;
DROP TYPE IF EXISTS public.project_status;
DROP TYPE IF EXISTS public.project_category;
DROP TYPE IF EXISTS public.post_type;
DROP TYPE IF EXISTS public.post_status;
DROP TYPE IF EXISTS public.experience_type;
DROP EXTENSION IF EXISTS pgcrypto;
--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: experience_type; Type: TYPE; Schema: public; Owner: portfolio
--

CREATE TYPE public.experience_type AS ENUM (
    'research',
    'internship',
    'job'
);


ALTER TYPE public.experience_type OWNER TO portfolio;

--
-- Name: post_status; Type: TYPE; Schema: public; Owner: portfolio
--

CREATE TYPE public.post_status AS ENUM (
    'draft',
    'published'
);


ALTER TYPE public.post_status OWNER TO portfolio;

--
-- Name: post_type; Type: TYPE; Schema: public; Owner: portfolio
--

CREATE TYPE public.post_type AS ENUM (
    'blog',
    'learning-log'
);


ALTER TYPE public.post_type OWNER TO portfolio;

--
-- Name: project_category; Type: TYPE; Schema: public; Owner: portfolio
--

CREATE TYPE public.project_category AS ENUM (
    'ml',
    'systems',
    'networks'
);


ALTER TYPE public.project_category OWNER TO portfolio;

--
-- Name: project_status; Type: TYPE; Schema: public; Owner: portfolio
--

CREATE TYPE public.project_status AS ENUM (
    'completed',
    'ongoing',
    'published'
);


ALTER TYPE public.project_status OWNER TO portfolio;

--
-- Name: skill_proficiency; Type: TYPE; Schema: public; Owner: portfolio
--

CREATE TYPE public.skill_proficiency AS ENUM (
    'beginner',
    'intermediate',
    'advanced',
    'expert'
);


ALTER TYPE public.skill_proficiency OWNER TO portfolio;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admin_users; Type: TABLE; Schema: public; Owner: portfolio
--

CREATE TABLE public.admin_users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email text NOT NULL,
    password_hash text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.admin_users OWNER TO portfolio;

--
-- Name: contact_messages; Type: TABLE; Schema: public; Owner: portfolio
--

CREATE TABLE public.contact_messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    subject text,
    message text NOT NULL,
    read boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.contact_messages OWNER TO portfolio;

--
-- Name: education; Type: TABLE; Schema: public; Owner: portfolio
--

CREATE TABLE public.education (
    id text NOT NULL,
    institution text NOT NULL,
    degree text NOT NULL,
    field text NOT NULL,
    start_date text NOT NULL,
    end_date text,
    gpa text,
    location text,
    description text,
    achievements text[] DEFAULT '{}'::text[] NOT NULL,
    relevant_coursework text[] DEFAULT '{}'::text[] NOT NULL,
    thesis text,
    sort_order integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.education OWNER TO portfolio;

--
-- Name: experience; Type: TABLE; Schema: public; Owner: portfolio
--

CREATE TABLE public.experience (
    id text NOT NULL,
    title text NOT NULL,
    company text NOT NULL,
    location text,
    type public.experience_type NOT NULL,
    start_date text NOT NULL,
    end_date text,
    description text NOT NULL,
    responsibilities text[] DEFAULT '{}'::text[] NOT NULL,
    technologies text[] DEFAULT '{}'::text[] NOT NULL,
    achievements text[] DEFAULT '{}'::text[] NOT NULL,
    company_url text,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.experience OWNER TO portfolio;

--
-- Name: experience_sub_roles; Type: TABLE; Schema: public; Owner: portfolio
--

CREATE TABLE public.experience_sub_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    experience_id text NOT NULL,
    title text NOT NULL,
    company text NOT NULL,
    start_date text NOT NULL,
    end_date text,
    description text NOT NULL,
    responsibilities text[] DEFAULT '{}'::text[] NOT NULL,
    technologies text[] DEFAULT '{}'::text[] NOT NULL,
    achievements text[] DEFAULT '{}'::text[] NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.experience_sub_roles OWNER TO portfolio;

--
-- Name: goose_db_version; Type: TABLE; Schema: public; Owner: portfolio
--

CREATE TABLE public.goose_db_version (
    id integer NOT NULL,
    version_id bigint NOT NULL,
    is_applied boolean NOT NULL,
    tstamp timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.goose_db_version OWNER TO portfolio;

--
-- Name: goose_db_version_id_seq; Type: SEQUENCE; Schema: public; Owner: portfolio
--

ALTER TABLE public.goose_db_version ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.goose_db_version_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: posts; Type: TABLE; Schema: public; Owner: portfolio
--

CREATE TABLE public.posts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    type public.post_type DEFAULT 'blog'::public.post_type NOT NULL,
    slug text NOT NULL,
    title text NOT NULL,
    excerpt text,
    content_markdown text NOT NULL,
    cover_image_url text,
    tags text[] DEFAULT '{}'::text[] NOT NULL,
    status public.post_status DEFAULT 'draft'::public.post_status NOT NULL,
    published_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.posts OWNER TO portfolio;

--
-- Name: profile; Type: TABLE; Schema: public; Owner: portfolio
--

CREATE TABLE public.profile (
    id integer DEFAULT 1 NOT NULL,
    name text NOT NULL,
    tagline text NOT NULL,
    bio text NOT NULL,
    email text NOT NULL,
    phone text,
    location text,
    linkedin_url text,
    github_url text,
    twitter_url text,
    youtube_url text,
    instagram_url text,
    scholar_url text,
    orcid_url text,
    website_url text,
    avatar_url text,
    resume_url text,
    languages jsonb DEFAULT '[]'::jsonb NOT NULL,
    academic_skills text[] DEFAULT '{}'::text[] NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    hero_roles text[] DEFAULT '{}'::text[] NOT NULL,
    hero_motto text,
    hero_badge text,
    logo_initials text DEFAULT 'sgs'::text NOT NULL,
    favorite_track_label text,
    favorite_track_audio_url text,
    favorite_track_cover_url text,
    favorite_track_title text,
    favorite_track_artist text,
    favorite_track_source_url text,
    CONSTRAINT profile_singleton CHECK ((id = 1))
);


ALTER TABLE public.profile OWNER TO portfolio;

--
-- Name: projects; Type: TABLE; Schema: public; Owner: portfolio
--

CREATE TABLE public.projects (
    id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    long_description text,
    technologies text[] DEFAULT '{}'::text[] NOT NULL,
    github_url text,
    live_url text,
    paper_url text,
    image_url text,
    featured boolean DEFAULT false NOT NULL,
    category public.project_category NOT NULL,
    start_date text NOT NULL,
    end_date text,
    status public.project_status,
    impact text,
    metrics text[] DEFAULT '{}'::text[] NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.projects OWNER TO portfolio;

--
-- Name: showcase_categories; Type: TABLE; Schema: public; Owner: portfolio
--

CREATE TABLE public.showcase_categories (
    id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    featured_name text NOT NULL,
    featured_url text NOT NULL,
    featured_image_url text,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.showcase_categories OWNER TO portfolio;

--
-- Name: showcase_items; Type: TABLE; Schema: public; Owner: portfolio
--

CREATE TABLE public.showcase_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    category_id text NOT NULL,
    name text NOT NULL,
    url text NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.showcase_items OWNER TO portfolio;

--
-- Name: skills; Type: TABLE; Schema: public; Owner: portfolio
--

CREATE TABLE public.skills (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    category text NOT NULL,
    skills text[] DEFAULT '{}'::text[] NOT NULL,
    proficiency public.skill_proficiency,
    sort_order integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.skills OWNER TO portfolio;

--
-- Data for Name: admin_users; Type: TABLE DATA; Schema: public; Owner: portfolio
--

COPY public.admin_users (id, email, password_hash, created_at) FROM stdin;
37f37cbf-cc85-468e-baad-dc6a81dac22a	sarbagyaghoshrestha@gmail.com	$2a$10$T4IpDWigSQu6Ww6vtq4LU.GY9CuUlxCDRONtXxfVtjhlKXcKU2iiW	2026-08-16 11:49:53.07804+00
\.


--
-- Data for Name: contact_messages; Type: TABLE DATA; Schema: public; Owner: portfolio
--

COPY public.contact_messages (id, name, email, subject, message, read, created_at) FROM stdin;
dcbd22d4-08fb-46cf-8def-d3672c1b7536	Linus Torvalds	torvalds@gmail.com	Collaboration on Linux	Can we collab on Embedded Systems?	t	2026-08-17 03:06:54.433997+00
\.


--
-- Data for Name: education; Type: TABLE DATA; Schema: public; Owner: portfolio
--

COPY public.education (id, institution, degree, field, start_date, end_date, gpa, location, description, achievements, relevant_coursework, thesis, sort_order) FROM stdin;
sos-plus2	SOS Hermann Gmeiner School, Sanothimi, Bhaktapur, Nepal	+2 Science	Physics and Mathematics	2019	2021	A+	Sanothimi, Bhaktapur, Nepal	Higher secondary education with strong foundation in science and mathematics. Grade 11: Physics, Chemistry, Mathematics, English, Biology (Minor). Grade 12: Physics, Chemistry, Mathematics (Major), English, Nepali.	{"Achieved Grade A+","Bestmanship Awardee 2019","Music Club President"}	{}	\N	0
ioe-bachelor	Tribhuvan University, IOE, Pulchowk Campus	Bachelor of Engineering (B.E.)	Electronics, Communication and Information Engineering	2021-05	2026-05	74.64%	Pulchowk Campus, Lalitpur, Nepal	Comprehensive engineering program with focus on electronics, communication systems, information theory, and signal processing. Strong foundation in mathematics, algorithms, and systems design.	{"Active member of IEEE Student Branch (Chair 2023-2024)","Creative Director at IEEE Pulchowk Student Branch","Executive Committee Member at Pulchowk Music Club"}	{"Data Structures & Algorithms","Digital Signal Processing","Communication Systems","Computer Networks","Machine Learning","Operating Systems","Microprocessor Systems","Information Theory","Probability & Statistics","Network Programming"}	\N	0
\.


--
-- Data for Name: experience; Type: TABLE DATA; Schema: public; Owner: portfolio
--

COPY public.experience (id, title, company, location, type, start_date, end_date, description, responsibilities, technologies, achievements, company_url, sort_order, created_at, updated_at) FROM stdin;
ryc-global-officer	Officer	RYC Global	\N	job	2020-03	2022-08	Served as an Officer at RYC Global, contributing to organizational operations and initiatives.	{"Managed organizational operations","Coordinated with team members on various initiatives","Contributed to organizational growth and development"}	{"Operations Management","Team Coordination"}	{}	\N	0	2026-08-16 06:52:06.52169+00	2026-08-16 06:52:06.52169+00
pointzeroo-frontend	Frontend Developer	PointZeroo	Nepal	job	2022-03	2022-09	Maintained an e-commerce website and developed a web application for SSoChe, Pulchowk Campus, focusing on frontend development with modern web technologies.	{"Maintained an e-commerce website","Developed a web application for SSoChe, Pulchowk Campus","Implemented frontend features using HTML5, CSS, and JavaScript","Worked with SQL databases for data management"}	{JavaScript,HTML5,CSS,SQL,"Front-End Development"}	{"Successfully maintained and enhanced e-commerce platform","Delivered web application for educational institution"}	\N	0	2026-08-16 06:52:06.224011+00	2026-08-16 06:52:06.224011+00
pulchowk-music	Executive Committee Member	Pulchowk Music Club And Research Center	Pulchowk, Lalitpur, Nepal	internship	2022-05	2023-07	Served as Executive Committee Member at Pulchowk Music Club And Research Center, contributing to music-related activities and events.	{"Participated in executive committee decisions","Organized music events and activities","Contributed to club operations and management"}	{Music,"Event Organization","Committee Management"}	{}	\N	0	2026-08-16 06:52:05.921376+00	2026-08-16 06:52:05.921376+00
ieee-creative	Creative Director	IEEE Pulchowk Student Branch	Pulchowk	internship	2023-03	2024-05	Served as Creative Director for IEEE Pulchowk Student Branch, managing creative content and visual communications for the branch.	{"Managed creative content for IEEE Pulchowk Student Branch","Designed visual communications and promotional materials","Coordinated creative initiatives and campaigns"}	{"Creative Design","Visual Communications","Content Management"}	{"Enhanced branch visibility through creative initiatives"}	\N	0	2026-08-16 06:52:05.62407+00	2026-08-16 06:52:05.62407+00
ieee-chair	Chair	IEEE Pulchowk Student Branch	Lalitpur District, Nepal	internship	2023-04	2024-06	Led IEEE Pulchowk Student Branch as Chair, organizing technical events, workshops, and coordinating student activities.	{"Led the IEEE Pulchowk Student Branch as Chair","Organized technical events and workshops","Coordinated student activities and initiatives","Managed branch operations and member engagement"}	{Leadership,"Event Management","Team Coordination","Technical Workshops"}	{"Successfully led the student branch for over a year","Organized multiple technical events and workshops"}	\N	0	2026-08-16 06:52:05.317724+00	2026-08-16 06:52:05.317724+00
ibtidaa-fullstack	Full Stack Developer	Ibtidaa Softwares Pvt. Ltd.	Nepal	job	2023-10	2024-12	Developed and maintained full-stack applications including 'Bidesh' App and Website for RP Srijan Way To Success using Next.js, and an Event Management and Visualization Tool using Django and JavaScript for Shramik Sanjal.	{"Developed and maintained 'Bidesh' App and Website using Next.js","Built Event Management and Visualization Tool using Django and JavaScript","Served as Tech Lead for development projects","Implemented data visualization features using Chart.js"}	{Next.js,PostgreSQL,NestJS,Express.js,MongoDB,Jenkins,Redux.js,Node.js,JavaScript,React.js,"Django REST Framework",Python,Chart.js}	{"Successfully delivered multiple full-stack applications","Led technical development as Tech Lead"}	\N	0	2026-08-16 06:52:05.02251+00	2026-08-16 06:52:05.02251+00
isrc-ninja-combined	Full Stack Engineer / Tech Lead	Intensive Study and Research Center (ISRC), later Ninja Infosys	Kathmandu, Nepal	job	2024-01	2026-02	Drove large-scale digital transformation across Nepal's municipal governance ecosystem — from building survey and digital profile infrastructure for 10+ municipalities, to leading architecture for platforms serving 50+ municipalities and 100+ government websites.	{"Deployed digital profile systems for 10+ municipalities including Pokhara Metropolitan City in 4 months with a 2-person team, serving 100,000+ citizens","Built a Survey Management System with custom ODK Fetcher processing 100,000+ survey responses with real-time analytics and live monitoring","Managed end-to-end DevOps pipelines (CI/CD, Docker, AWS EC2/S3, MinIO, Jenkins) ensuring 99.9% uptime for resource-constrained regions","Trained 300+ local officials and enumerators in digital tools for sustainable civic digitization"}	{Next.js,NestJS,tRPC,PostgreSQL,MongoDB,Docker,AWS,MinIO,"ODK Collect/Central",Nginx}	{"10+ municipal digital profiles deployed in 4 months with a 2-person team","100,000+ survey responses processed with real-time analytics","300+ local officials trained in digital tools"}	\N	0	2026-08-16 06:52:04.126635+00	2026-08-16 06:52:04.126635+00
mandala-foods-consultant	AI & Automation Consultant	Mandala Foods	Remote, Nepal	job	2026-01	\N	Sole technical architect for a purpose-driven fruit upcycling startup, building AI and automation infrastructure from the ground up. Designed conversational AI systems and self-hosted production infrastructure to streamline operations and enable intelligent commerce.	{"Designed and deployed Maya — an internal RAG-based knowledge chatbot for querying SOPs and operational documentation through natural language","Architected Maya Genie, a multi-channel conversational commerce platform (WhatsApp, Viber, Messenger) with a Go-based message orchestration gateway, LangChain RAG core, and Nepal payment integrations (Khalti, eSewa)","Built a public-facing product chatbot on a loosely coupled microservices architecture with independently deployable channels, orchestration, and cognitive core","Engineered a Go document sync service processing Vikunja task attachments (XLSX, CSV, DOCX) and auto-uploading to Google Drive to feed the n8n RAG embedding pipeline","Self-hosted and maintained a production VPS (Ubuntu 24.04, 12-core AMD EPYC, 48 GB RAM) running 10+ Dockerised services including n8n, Supabase, Traefik, Open WebUI, and a Claude API proxy","Built n8n automation workflows for document ingestion, Gemini-powered embedding pipelines, operational reporting, and industry news digests"}	{Go,Python,LangChain,n8n,Docker,"Supabase (pgvector)","Anthropic Claude API",Redis,"RAG Architecture",Microservices,Traefik,"Open WebUI"}	{"Maya Genie submitted to the AI by HER: Global Impact Challenge","10+ Dockerised production services self-hosted on a single VPS with full observability","Multi-channel commerce platform spanning WhatsApp, Viber, and Messenger"}	\N	0	2026-08-16 06:52:04.725912+00	2026-08-16 06:52:04.725912+00
\.


--
-- Data for Name: experience_sub_roles; Type: TABLE DATA; Schema: public; Owner: portfolio
--

COPY public.experience_sub_roles (id, experience_id, title, company, start_date, end_date, description, responsibilities, technologies, achievements, sort_order) FROM stdin;
5211214f-96ce-4f83-b715-c1bc6fd96328	isrc-ninja-combined	Tech Lead	Ninja Infosys	2025-02	2026-02	Led technical architecture for Digital e-Palika and the Integrated Content Management System — a distributed, event-driven microservices platform powering national-scale governance infrastructure.	{"Led technical architecture for Digital e-Palika platform serving 50+ municipalities, streamlining citizen services, revenue collection, and grievance handling","Architected the ICMS powering 100+ government websites nationwide on a distributed, event-driven microservices architecture built for high availability","Coordinated cross-functional teams to deliver governance solutions while maintaining scalability, resilience, and security across containerised deployments"}	{Next.js,NestJS,Kafka,Kubernetes,PostgreSQL,Docker,Redis,CI/CD}	{"100+ government websites powered by the ICMS platform","Digital e-Palika platform serving 50+ municipalities"}	0
\.


--
-- Data for Name: goose_db_version; Type: TABLE DATA; Schema: public; Owner: portfolio
--

COPY public.goose_db_version (id, version_id, is_applied, tstamp) FROM stdin;
1	0	t	2026-08-16 11:49:52.829561
2	1	t	2026-08-16 11:49:52.854302
3	2	t	2026-08-17 02:53:42.671413
4	3	t	2026-08-17 03:11:50.353361
5	4	t	2026-08-17 03:39:29.361281
6	5	t	2026-08-17 06:00:58.718336
7	6	t	2026-08-18 13:57:53.707264
8	7	t	2026-08-18 14:40:52.437554
\.


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: portfolio
--

COPY public.posts (id, type, slug, title, excerpt, content_markdown, cover_image_url, tags, status, published_at, created_at, updated_at) FROM stdin;
d0ef1635-7ac4-4453-a964-6bb73cdb02ec	learning-log	building-jlox-tree-walk-interpreter	Building jlox - A Tree-Walk Interpreter in Java	Built a complete interpreter for the Lox programming language from scratch in Java, covering every phase from scanning to closures and static variable resolution.	Worked through Part I of Robert Nystrom's *Crafting Interpreters*, building jlox by hand in Java with IntelliSense disabled — every line typed, every mechanism traced until it stopped being mysterious.\r\n\r\n## The Pipeline\r\n\r\nA **Scanner** converts raw source text into tokens using a two-pointer approach and maximal munch. A **Parser** uses recursive descent to build an abstract syntax tree, with operator precedence encoded directly into the grammar's rule hierarchy — lower-precedence rules delegating to higher-precedence ones, so the tree's shape enforces evaluation order structurally rather than through any explicit precedence-checking logic.\r\n\r\n## The Visitor Pattern\r\n\r\nThe **Interpreter** walks that tree using the Visitor pattern — a dispatch mechanism where each node type routes to the correct evaluation method through two stages: runtime polymorphism picks which `accept()` runs, and that method makes a fixed compile-time call to the right visit method on the Interpreter. The same pattern drives three completely separate tree walks: the Interpreter evaluates, the AstPrinter prints structure, and the Resolver performs static analysis.\r\n\r\n## Environments and Scope\r\n\r\nVariables live in a parent-chained **Environment** structure — a linked list of hash maps where each scope points outward to its enclosing one. Lookup walks outward until the variable is found or the chain ends. Block scope is managed by `executeBlock`, which saves the current environment, switches to a new inner one, and restores the original in a `finally` block — guaranteeing cleanup even on errors.\r\n\r\n## Functions and Closures\r\n\r\nFunctions are first-class values. Each function declaration creates a `LoxFunction` object capturing the environment active at definition time as its closure. Every call creates a fresh environment whose parent is that captured closure — not the current environment. This single distinction is the entire closure mechanism:\r\n\r\n```java\r\nnew Environment(closure)      // function — parent is defining scope\r\nnew Environment(environment)  // block — parent is current scope\r\n```\r\n\r\nThe `Return` statement unwinds the call stack via a Java exception, caught only in `LoxFunction.call()` — the same exception-as-control-flow trick used for panic-mode error recovery in the Parser.\r\n\r\n## The Resolver\r\n\r\nThe **Resolver** exists because closures alone are not enough. Capturing an environment object is insufficient when that object is mutable — a variable declared after a function definition can contaminate the function's closure at runtime, causing it to see a binding that did not exist when the function was written.\r\n\r\nThe Resolver fixes this by walking the AST once before interpretation, computing for every variable reference exactly how many scope hops up it lives, and storing those distances in a hash map. The Interpreter then jumps directly to the right scope instead of walking dynamically — making later mutations to intermediate scopes structurally invisible.\r\n\r\n## What's Next\r\n\r\njlox is complete and correct. The same language gets reimplemented next as **clox** — a bytecode virtual machine written in C, where everything Java provided for free (garbage collection, object identity, dynamic arrays, hash tables) gets built from scratch, and the AST disappears entirely in favor of flat bytecode executed by a stack-based VM.	https://portfolio.mandalafoods.co/media/7e39de24-dbc5-4db8-88a6-102270579c7a.png	{crafting-interpreters,compilers,interpreters,java,lox,ast,parsing,lexing,tree-walk-interpreter,visitor-pattern,closures,lexical-scoping,recursive-descent,programming-languages}	published	2026-08-16 07:39:39.092+00	2026-08-16 07:38:59.435847+00	2026-08-17 03:14:13.574142+00
\.


--
-- Data for Name: profile; Type: TABLE DATA; Schema: public; Owner: portfolio
--

COPY public.profile (id, name, tagline, bio, email, phone, location, linkedin_url, github_url, twitter_url, youtube_url, instagram_url, scholar_url, orcid_url, website_url, avatar_url, resume_url, languages, academic_skills, updated_at, hero_roles, hero_motto, hero_badge, logo_initials, favorite_track_label, favorite_track_audio_url, favorite_track_cover_url, favorite_track_title, favorite_track_artist, favorite_track_source_url) FROM stdin;
1	Sarbagya Gho Shrestha	सर्वज्ञ घो श्रेष्ठ	Engineer who builds with purpose. I’m drawn to technology that connects people with services, automates meaningful work, and scales what matters, from governance platforms serving thousands of citizens to the first intelligent system at a startup. Comfortable working across the stack, from embedded hardware to distributed systems. Always learning, always building, always shipping.	sarbagyaghoshrestha@gmail.com	+977 9823833365	Kathmandu, Nepal	https://linkedin.com/in/sarbagyashrestha	https://github.com/sarbagyag	\N	https://www.youtube.com/@Sarbagya42	https://www.instagram.com/sarbu.wav	\N	\N	https://sarbagyaghoshrestha.com.np	https://portfolio.mandalafoods.co/media-sarbu/9c1286e4-4999-43a9-8284-c7979651b211.jpg	https://portfolio.mandalafoods.co/media/0d1ab32f-43f7-4bb8-8048-8cdcaa8a91c8.pdf	[{"name": "German", "level": "B1"}, {"name": "English", "level": "(IELTS 8.0:L9|R8.5|W7|S7)"}, {"name": "Nepali", "level": "Native"}, {"name": "Newari", "level": "Native"}, {"name": "Hindi", "level": "Intermediate"}]	{"Research Design & Methodology","Technical Writing","Data Analysis & Visualization","Literature Review","Experimental Design","Performance Analysis","Mathematical Modeling","Scientific Programming","Presentation & Communication","Collaborative Research"}	2026-08-19 04:35:16.450076+00	{"Full Stack Software Engineer",AI/ML,"Embedded & Edge AI","Music Producer"}	Arbeit in jeder wachen Stunde	B.E. Electronics, Communication & Information • IOE, Pulchowk Campus • Class of 2025	sgs	On repeat	https://portfolio.mandalafoods.co/media-sarbu/9aaab5c9-c2d5-4b88-99f3-82b7f6c7e7fc.mp3	https://portfolio.mandalafoods.co/media-sarbu/1a2e114b-b976-414a-9250-8ca4a2a4f3c8.jpg	ten	Fred again.. & Jozzy	https://www.youtube.com/watch?v=x4RXNO9oaS0
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: portfolio
--

COPY public.projects (id, title, description, long_description, technologies, github_url, live_url, paper_url, image_url, featured, category, start_date, end_date, status, impact, metrics, sort_order, created_at, updated_at) FROM stdin;
8bit-breadboard-computer	8-bit Breadboard Computer (Ben Eater Inspired)	Built a complete 8-bit computer from scratch on breadboards inspired by Ben Eater's design. 6th semester minor project at IOE Pulchowk Campus featuring custom-built 128-bit RAM due to IC unavailability.	Designed and constructed a fully functional 8-bit computer from the ground up using discrete logic ICs, inspired by Ben Eater's architecture. As BEI students passionate about the intricate dance between hardware and software, Rohit Joshi, Yugal Pariyar, and I delved deep into computer architecture, building every component manually on breadboards. Faced with IC unavailability challenges, we innovatively created a homemade 128-bit RAM module, demonstrating our problem-solving abilities and determination. The project encompasses the complete architecture: ALU, control unit, registers, program counter, instruction decoder, clock module, and output display. This hardware-focused project exemplifies our passion for deep understanding of technology from first principles.	{"Digital Logic","Computer Architecture","74-series Logic ICs","Breadboard Design","Hardware Engineering","ALU Design","Control Unit","Custom RAM"}	\N	https://www.linkedin.com/feed/update/urn:li:activity:7199849262543749120/	\N	\N	t	systems	2024-01	2024-05	completed	Deep understanding of computer architecture from first principles	{"Custom 128-bit RAM module","Complete 8-bit CPU implementation","Hardware-only design","3-person team achievement"}	0	2026-08-16 06:52:08.009679+00	2026-08-16 06:52:08.009679+00
survey-management-system	Survey Management System (SMS)	Full-scale web platform for live monitoring, analytics, and visualization of municipal field surveys. Real-time dashboards enabling data-driven decisions for local administrations before survey completion.	Engineered a comprehensive Survey Management System integrating field data collection with cloud-based analytics. Built custom ODK Fetcher (NestJS-based parser) to automate data flow from ODK Collect mobile app to centralized PostgreSQL database. Created real-time dashboards using Next.js and tRPC showing live survey progress, building counts, demographic analytics, and geographic visualizations. Enabled local governments to monitor enumeration teams, track survey completion rates, and identify data quality issues in real-time. System processed 100,000+ survey responses across multiple municipalities.	{Next.js,NestJS,tRPC,PostgreSQL,TypeScript,"ODK Collect","ODK Central","Data Visualization","Real-time Analytics",Chart.js,Docker}	\N	https://duduwa-admin.vercel.app/	\N	\N	t	systems	2024-09	2026-01	completed	Enabled real-time field survey monitoring for 10+ municipalities	{"100,000+ survey responses processed","Real-time monitoring for 10+ municipalities","Custom ODK integration pipeline","Live analytics dashboards"}	5	2026-08-16 06:52:08.607839+00	2026-08-17 03:18:50.069321+00
vikunja-task-tracking	Vikunja Task Tracking System	Deployed and customized Vikunja as an internal task tracking and project management system for Mandala Foods. Configured production infrastructure with monitoring and data acquisition capabilities.	Implemented Vikunja as the internal task tracking and project management solution for Mandala Foods operations. Configured production-grade infrastructure including Docker containerization, Traefik reverse proxy for traffic management and SSL termination, and PostgreSQL database backend. Extended the system with custom integrations for fruit processing operations data acquisition and monitoring. Set up automated backups, logging, and DNS configuration for reliable production deployment.	{Vikunja,Docker,Traefik,PostgreSQL,Redis,"Linux Administration",SSL/TLS,"DNS Management"}	\N	\N	\N	\N	t	systems	2026-01	\N	completed	Streamlined internal operations and project management for food tech startup	{"Production-grade infrastructure","Traefik reverse proxy setup","Automated SSL management","Custom data acquisition integrations"}	7	2026-08-16 06:52:07.420277+00	2026-08-17 03:20:16.949548+00
mandala-internal-chatbot	Mandala Foods Internal AI Chatbot	Built an internal AI assistant for Mandala Foods operations using n8n automation and RAG-based decision systems. Streamlines internal queries, SOPs, and operational knowledge access.	Developed an internal AI chatbot for Mandala Foods to enhance team productivity and operational efficiency. The system leverages n8n workflow automation with RAG-based architecture to provide instant access to company SOPs, policies, and operational knowledge. Integrated with multiple business systems including CRM, inventory, and customer support platforms. Built automated data pipelines for business intelligence and reporting. Deployed on production infrastructure with Docker containerization.	{"n8n Automation","RAG Architecture",Docker,PostgreSQL,"API Integrations","Workflow Automation"}	\N	\N	\N	\N	t	systems	2026-01	\N	completed	Reduced manual operational overhead through AI-powered internal assistance	{"RAG-based knowledge retrieval","Multi-system integrations","Automated business workflows","Production Docker deployment"}	3	2026-08-16 06:52:07.122618+00	2026-08-17 03:18:26.445413+00
icms-platform	Integrated Content Management System (ICMS)	Enterprise-scale CMS platform powering 100+ government websites across Nepal. Designed and engineered at Ninja Infosys for unified digital governance at national scale.	Architected and led development of ICMS, a comprehensive content management system now serving 100+ government institutions across Nepal. The platform provides unified website management, content publishing workflows, document management, citizen service portals, and analytics dashboards. Built with modern tech stack incorporating Kafka for event streaming, Kubernetes for orchestration, and microservices architecture for scalability. Enables municipalities and government agencies to maintain professional web presence with minimal technical expertise while ensuring security, compliance, and performance at scale.	{Next.js,NestJS,Kafka,Kubernetes,PostgreSQL,Docker,Microservices,TypeScript,Redis,CI/CD}	\N	http://sddodang.lumbini.gov.np/ne	\N	\N	t	systems	2026-06	\N	completed	Powering 100+ government websites nationwide	{"100+ government sites live","National-scale deployment","Microservices architecture","Event-driven with Kafka"}	1	2026-08-16 06:52:08.909072+00	2026-08-17 03:18:04.174065+00
eshasan	eShasan: The OS for Digital Governance	The comprehensive digital ecosystem driving the modernization of Nepal's public sector. A Multi-Tenant Digital Governance Platform unifying internal office automation, public service delivery, and citizen engagement.	Architected by Ninja Infosys, eShasan represents the cutting edge of GovTech engineering. It transforms complex bureaucratic processes into a streamlined, reactive digital experience using a Cloud-Native Microservices Architecture. The platform integrates Office Automation (Darta Chalani) with a robust Integrated Content Management System (ICMS), breaking down administrative silos. Features a modular Microfrontend architecture (Module Federation), polyglot backend services (Go, NestJS), and event-driven consistency via Apache Kafka. Containerized on Docker and orchestrated via Kubernetes for national-scale resilience.	{"Microservices (Go)","Module Federation",Docker,React,Postgres,Traefik,"Ory Kratos, Oathkeeper",Kafka,Kubernetes}	\N	\N	\N	\N	t	systems	2026-01	\N	ongoing	Future-proof digital infrastructure for national-scale governance	{"Multi-Tenant Architecture","Unified Command & Control (C2)","Digital Office Automation","100+ Government Portals"}	2	2026-08-16 06:52:07.713279+00	2026-08-17 03:18:14.303718+00
municipal-digital-profiles	Municipal Digital Profile Platform	Architected and deployed comprehensive digital profile systems for 10+ municipalities across Nepal, including Pokhara Metropolitan City. Built end-to-end platform transforming civic data into accessible, analytics-ready systems for local governance.	Led the design and implementation of digital profile platforms for over 10 municipalities in just 4 months with a 2-person team (Sarbagya & Trilochan Bhusal). Built complete full-stack systems featuring real-time data visualization, interactive dashboards, and citizen information portals. The platform integrates field data collection (ODK), automated data processing pipelines, and responsive web interfaces serving thousands of citizens. Deployed on scalable cloud infrastructure with CI/CD pipelines ensuring 99.9% uptime.	{Next.js,NestJS,tRPC,PostgreSQL,TypeScript,Docker,Vercel,"ODK Central","Data Visualization","Responsive Design"}	\N	https://pokhara.digprofile.com/en	\N	\N	t	systems	2024-09	2026-01	completed	Digitized 10+ municipalities, serving 100,000+ citizens	{"10+ municipalities digitized in 4 months","2-person team achievement","100,000+ citizen records processed","99.9% platform uptime"}	4	2026-08-16 06:52:08.305725+00	2026-08-17 03:18:39.98402+00
maya-genie	Maya Genie - AI Conversational Commerce Platform	Developing an intelligent nutrition assistance chatbot for Nepali market using RAG architecture. Enables customers to receive personalized nutrition recommendations and place orders through natural language.	Architecting Maya Genie, an AI-powered conversational commerce platform for Mandala Foods. The system uses Retrieval Augmented Generation (RAG) to provide context-aware nutrition guidance by integrating product catalog knowledge with AI inference. Customers can interact naturally to get personalized recommendations based on their health goals and dietary preferences, then seamlessly place orders through the conversation. Building scalable infrastructure for production deployment with vector databases for semantic search and efficient retrieval.	{"RAG Architecture","Vector Databases","Conversational AI",NLP,Python,LangChain,PostgreSQL,Docker}	\N	\N	\N	\N	t	systems	2024-08	\N	ongoing	Enabling conversational commerce for nutrition-focused e-commerce in Nepal	{"RAG-powered nutrition recommendations","Natural language order placement","Product catalog knowledge integration","Localized for Nepali market"}	6	2026-08-16 06:52:06.821428+00	2026-08-17 03:19:15.047648+00
\.


--
-- Data for Name: showcase_categories; Type: TABLE DATA; Schema: public; Owner: portfolio
--

COPY public.showcase_categories (id, title, description, featured_name, featured_url, featured_image_url, sort_order, created_at, updated_at) FROM stdin;
task-management	Task Management	Kanban-style project and task tracking for operations	Vikunja Task Tracking System	https://tasks.mandalafoods.co	/vikunja-mandala-foods.png	2	2026-08-17 03:39:29.361281+00	2026-08-17 03:39:29.361281+00
icms	iCMS	Integrated Content Management Systems for government	FANSEP-Ministry of Agriculture and Livestock Development (MoALD)	https://fansep.moald.gov.np/ne	https://portfolio.mandalafoods.co/media/20894cbf-c992-41d9-9c7b-8a894bf6fe26.png	0	2026-08-17 03:39:29.361281+00	2026-08-17 03:41:30.356116+00
digital-profiles	Digital Profiles	Modern digital governance platforms for municipalities	Pokhara Metropolitan City	https://pokhara.digprofile.com	https://portfolio.mandalafoods.co/media/16c43a07-64fc-4586-a937-3b36713077de.png	1	2026-08-17 03:39:29.361281+00	2026-08-17 03:41:58.081527+00
sms	SMS	Survey Management Systems for data collection and analysis	Buddhashanti Admin	#	https://portfolio.mandalafoods.co/media/1dc5842c-9bbc-4686-919f-485a6c216047.png	2	2026-08-17 03:39:29.361281+00	2026-08-17 03:42:31.871762+00
n8n-automation	n8n Automation	RAG-powered workflow automation and AI agents	Mandala Foods RAG Chat Engine	https://n8n.mandalafoods.co	https://portfolio.mandalafoods.co/media/cfafbe6e-d3c6-4ec5-aed8-a0d2a51343e2.png	3	2026-08-17 03:39:29.361281+00	2026-08-17 03:42:59.697976+00
ai-chatbot	AI Chatbot	Internal AI assistant for operations and knowledge access	Mandala Internal Support Chatbot	https://internal.mandalafoods.co	https://portfolio.mandalafoods.co/media/bdc5ffe9-da5b-4b19-a134-495c7ec8c997.png	4	2026-08-17 03:39:29.361281+00	2026-08-17 03:43:54.735319+00
\.


--
-- Data for Name: showcase_items; Type: TABLE DATA; Schema: public; Owner: portfolio
--

COPY public.showcase_items (id, category_id, name, url, sort_order) FROM stdin;
de66d212-ffdc-4776-8dc0-330bbca500a2	icms	SDDO Dang	https://sddodang.lumbini.gov.np	0
bb133f59-b4d5-47b5-94a8-948acb37334d	icms	SDO Dolpa - Karnali	https://icms.sdodolpa.karnali.easypalika.com	1
e5ad28d6-577d-43d2-8413-0dd1c4004f3b	icms	MoLMAC - Gandaki Province (pending launch)	https://molmac.gandaki.gov.np	2
9fdb7ded-bb3a-49f4-afd8-72572849c34c	icms	DFO Bardiya (pending launch)	https://dfobardiya.gov.np	3
1c436241-29a5-4787-9577-9b78803d0edb	icms	Hospital Banke - Lumbini (pending launch)	https://hobanke.lumbini.gov.np	4
ccd438bb-e4a2-4abb-9bfd-5bad03083df2	icms	IAL - Karnali Province (pending launch)	https://ial.karnali.gov.np	5
9b45c8b1-713d-4dde-aedb-f628ec0c8e58	icms	PBIP - DWRI (pending launch)	https://pbip.dwri.gov.np	6
aedda294-5fa2-478b-8759-924a8e21fa88	icms	SDDO Rupandehi (pending launch)	https://sddorupandehi.lumbini.gov.np	7
183978ee-5709-4b24-b6d8-d9116011615e	digital-profiles	Buddhashanti Digital Profile	https://digital.buddhashantimun.gov.np	0
6a8bbd68-3253-4b84-93e6-b9ce47677b67	digital-profiles	Kerabari Digital Profile	https://digital.kerabarimun.gov.np	1
5cfa5b1c-cdde-4d42-ac3d-9e4e00970d4b	digital-profiles	Lungri Digital Profile	https://digital.lungrimun.gov.np	2
e5cf21e5-ddd4-4ce8-afe6-4f98cd682af3	digital-profiles	Pariwartan Digital Profile	https://digital.pariwartanmun.gov.np	3
a493d7ee-1ffb-449e-90b1-24e7a03fa9d5	digital-profiles	Khajura Digital Profile	https://digital.khajuramun.gov.np	4
ddf15511-cb8b-4787-8d0f-c98229478ee8	digital-profiles	Gadhawa Digital Profile	https://gadhawa.digprofile.com	5
156891d2-e52c-4d23-ade1-6d316d090bfb	digital-profiles	Duduwa Digital Profile	https://digital.duduwa.gov.np	6
289b0bf8-195d-4dce-8f25-fdaf1bdc7b12	sms	Kerabari Admin	https://kerabari-admin.vercel.app	0
25c66a85-a4f9-467a-ad2e-a2af9d85550e	sms	Gadhawa Admin	https://gadhawa-admin-eq6q.vercel.app/	1
f4d99ffb-e202-4c7f-9ff3-28979ba7a7dd	sms	Lungri Admin	https://lungri-admin.vercel.app	2
d6b7b2fa-12a0-46e1-8478-b2156a796fb5	sms	Duduwa Admin	https://duduwa-admin.vercel.app	3
\.


--
-- Data for Name: skills; Type: TABLE DATA; Schema: public; Owner: portfolio
--

COPY public.skills (id, category, skills, proficiency, sort_order) FROM stdin;
51634d05-2608-436f-a666-b25fc0ad15d9	Programming Languages	{TypeScript/JavaScript,Python,C/C++,Golang,SQL,"Shell Scripting"}	advanced	0
7de0176d-4050-49d5-a0fc-e03864a9d01d	Frontend Development	{"Microfrontend (MFE)","Module Federation",Webpack,Next.js,React.js,Redux.js,HTML5,"CSS/Tailwind CSS","Responsive Design",UI/UX}	advanced	1
68b5758d-7d34-408a-a333-b2c8d86d872c	Backend Development	{Go,Microservices,NestJS,Express.js,tRPC,Django,"Django REST Framework",Node.js,"API Design"}	advanced	2
389e7851-8f29-487f-a9e3-5cb6daa5c8b6	Databases & Data	{PostgreSQL,MongoDB,Redis,SQL,"Data Modeling","ODK Collect","ODK Central","Data Visualization"}	advanced	3
c65ecae0-155c-4da6-bc22-8bbfea6c6726	DevOps & Cloud	{Docker,Kubernetes,Jenkins,Kafka,"AWS (EC2, S3, Lambda)",CI/CD,Nginx,PM2,Coolify}	advanced	4
7298e9cd-a69f-4ae5-851b-31c8e261fd74	AI & Embedded Systems	{"Machine Learning","Deep Learning",TensorFlow,PyTorch,"Embedded Systems",UAVs,Avionics,IoT}	intermediate	5
\.


--
-- Name: goose_db_version_id_seq; Type: SEQUENCE SET; Schema: public; Owner: portfolio
--

SELECT pg_catalog.setval('public.goose_db_version_id_seq', 8, true);


--
-- Name: admin_users admin_users_email_key; Type: CONSTRAINT; Schema: public; Owner: portfolio
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_email_key UNIQUE (email);


--
-- Name: admin_users admin_users_pkey; Type: CONSTRAINT; Schema: public; Owner: portfolio
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_pkey PRIMARY KEY (id);


--
-- Name: contact_messages contact_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: portfolio
--

ALTER TABLE ONLY public.contact_messages
    ADD CONSTRAINT contact_messages_pkey PRIMARY KEY (id);


--
-- Name: education education_pkey; Type: CONSTRAINT; Schema: public; Owner: portfolio
--

ALTER TABLE ONLY public.education
    ADD CONSTRAINT education_pkey PRIMARY KEY (id);


--
-- Name: experience experience_pkey; Type: CONSTRAINT; Schema: public; Owner: portfolio
--

ALTER TABLE ONLY public.experience
    ADD CONSTRAINT experience_pkey PRIMARY KEY (id);


--
-- Name: experience_sub_roles experience_sub_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: portfolio
--

ALTER TABLE ONLY public.experience_sub_roles
    ADD CONSTRAINT experience_sub_roles_pkey PRIMARY KEY (id);


--
-- Name: goose_db_version goose_db_version_pkey; Type: CONSTRAINT; Schema: public; Owner: portfolio
--

ALTER TABLE ONLY public.goose_db_version
    ADD CONSTRAINT goose_db_version_pkey PRIMARY KEY (id);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: portfolio
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- Name: posts posts_slug_key; Type: CONSTRAINT; Schema: public; Owner: portfolio
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_slug_key UNIQUE (slug);


--
-- Name: profile profile_pkey; Type: CONSTRAINT; Schema: public; Owner: portfolio
--

ALTER TABLE ONLY public.profile
    ADD CONSTRAINT profile_pkey PRIMARY KEY (id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: portfolio
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: showcase_categories showcase_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: portfolio
--

ALTER TABLE ONLY public.showcase_categories
    ADD CONSTRAINT showcase_categories_pkey PRIMARY KEY (id);


--
-- Name: showcase_items showcase_items_pkey; Type: CONSTRAINT; Schema: public; Owner: portfolio
--

ALTER TABLE ONLY public.showcase_items
    ADD CONSTRAINT showcase_items_pkey PRIMARY KEY (id);


--
-- Name: skills skills_pkey; Type: CONSTRAINT; Schema: public; Owner: portfolio
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT skills_pkey PRIMARY KEY (id);


--
-- Name: idx_experience_sub_roles_experience_id; Type: INDEX; Schema: public; Owner: portfolio
--

CREATE INDEX idx_experience_sub_roles_experience_id ON public.experience_sub_roles USING btree (experience_id);


--
-- Name: idx_posts_type_status; Type: INDEX; Schema: public; Owner: portfolio
--

CREATE INDEX idx_posts_type_status ON public.posts USING btree (type, status);


--
-- Name: idx_showcase_items_category_id; Type: INDEX; Schema: public; Owner: portfolio
--

CREATE INDEX idx_showcase_items_category_id ON public.showcase_items USING btree (category_id);


--
-- Name: experience_sub_roles experience_sub_roles_experience_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: portfolio
--

ALTER TABLE ONLY public.experience_sub_roles
    ADD CONSTRAINT experience_sub_roles_experience_id_fkey FOREIGN KEY (experience_id) REFERENCES public.experience(id) ON DELETE CASCADE;


--
-- Name: showcase_items showcase_items_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: portfolio
--

ALTER TABLE ONLY public.showcase_items
    ADD CONSTRAINT showcase_items_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.showcase_categories(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict 0vqCOXfn0RTx4yN2bChZTKuW9IxGBG4bqFf0LHYbdIffzlCkj0yNUZclAcSXv80

