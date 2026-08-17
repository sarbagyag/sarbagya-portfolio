-- Wipes the seed content that ships baked into the shared server image
-- (sarbagya's profile/experience/projects/education/skills/showcase from
-- internal/db/migrations/00002-00004) and replaces it with Aditya
-- Timalsina's real content, scraped from his existing site
-- (www.adityatimalsina.com.np).
--
-- This is a PLAIN SQL script, not a goose migration — it deliberately does
-- NOT live under internal/db/migrations/, so it is never embedded into the
-- binary (see //go:embed migrations/*.sql in internal/db/db.go) and never
-- auto-runs on container boot. Run it once, by hand, after the aditya
-- stack has come up and the built-in migrations (00001-00004) have already
-- applied and seeded sarbagya's placeholder content.
--
-- NOT touched by this script:
--   - admin_users    (seeded separately from ADMIN_EMAIL/ADMIN_PASSWORD on
--                      first boot — unrelated to portfolio content)
--   - contact_messages (real user submissions, not seed/template data)
--
-- Known gaps, left as placeholders — fix via /admin once you have real
-- values:
--   - avatar_url, resume_url: left NULL. The old site's CV link points at
--     adityatimalsina.com.np's own static files, not this instance's MinIO.
--   - projects 'distributed-nn-training' and 'blockchain-consensus-golang'
--     had no dates listed on the source site — start_date is a guess
--     ('2024'), end_date left NULL/guessed to match project status.
--   - technology tag lists were truncated on the source site behind "+N"
--     badges (e.g. "C++ OMNET++ MQTT ZeroMQ +4") — only the visible tags
--     are seeded here; add the rest via /admin if you have them.
--   - showcase_categories/showcase_items are cleared and left empty —
--     that section (Mandala Foods automation demos) doesn't apply to
--     Aditya's site. Fill in via /admin only if his site has a Showcase
--     section that needs it.

BEGIN;

-- ---- wipe (children before parents, FK-safe) ----
DELETE FROM public.experience_sub_roles;
DELETE FROM public.showcase_items;
DELETE FROM public.experience;
DELETE FROM public.showcase_categories;
DELETE FROM public.projects;
DELETE FROM public.education;
DELETE FROM public.skills;
DELETE FROM public.posts;
DELETE FROM public.profile;

-- ---- profile ----
INSERT INTO public.profile (
    id, name, tagline, bio, email, phone, location,
    linkedin_url, github_url, twitter_url, youtube_url, instagram_url,
    scholar_url, orcid_url, website_url, avatar_url, resume_url,
    languages, academic_skills, updated_at,
    hero_roles, hero_motto, hero_badge
) VALUES (
    1,
    'Aditya Timalsina',
    'Prospective PhD Student',
    'Prospective PhD student in Electronics & Communication Engineering, currently working as a Software Engineer at Niural. B.E. in Electronics, Communication and Information Engineering from the Institute of Engineering (IOE), Pulchowk Campus, Tribhuvan University. Research interests span machine learning for earthquake early warning systems (with Duke University) and 5G vehicular network protocols (with Universidad Politecnica de Valencia, Spain). Certified in Cybersecurity (ISC2).',
    'timalsinaditya@gmail.com',
    NULL,
    'Kathmandu, Nepal',
    'https://linkedin.com/in/aditya-timalsina',
    'https://github.com/timalsinaditya',
    NULL, NULL, NULL, NULL, NULL,
    'https://www.adityatimalsina.com.np',
    NULL, NULL,
    '[{"name": "English", "level": "Fluent (Professional Working Proficiency)"}, {"name": "Nepali", "level": "Native"}, {"name": "Hindi", "level": "Intermediate"}]',
    '{OMNET++,"Network Simulation","Scientific Computing","Data Analysis",LaTeX,Jupyter,Git,Docker}',
    now(),
    '{Research,"Machine Learning","Systems & Networks","Software Engineering"}',
    'Researching machine learning and next-generation network systems.',
    'B.E. Electronics & Communication • IOE, Pulchowk Campus • 84.10%'
);

-- ---- education ----
INSERT INTO public.education (id, institution, degree, field, start_date, end_date, gpa, location, description, achievements, relevant_coursework, thesis, sort_order) VALUES
('ioe-be', 'Institute of Engineering (IOE), Tribhuvan University', 'Bachelor of Engineering (B.E.)', 'Electronics, Communication and Information Engineering', '2021-04', '2025-04', '84.10%', 'Pulchowk Campus, Lalitpur, Nepal', NULL, '{}', '{}', NULL, 0);
INSERT INTO public.education (id, institution, degree, field, start_date, end_date, gpa, location, description, achievements, relevant_coursework, thesis, sort_order) VALUES
('xaviers-plus2', E'St. Xavier''s College, Maitighar', '+2 Science', 'Physics, Chemistry, Mathematics', '2018-04', '2020-04', '3.79/4.00', 'Maitighar, Kathmandu, Nepal', NULL, '{}', '{}', NULL, 1);

-- ---- experience ----
-- (Niural is the job history entry; the Duke and LICT rows fold together
-- the source site's separate "Research Experience" and "Professional
-- Experience" listings for the same two roles into one row each.)
INSERT INTO public.experience (id, title, company, location, type, start_date, end_date, description, responsibilities, technologies, achievements, company_url, sort_order, created_at, updated_at) VALUES
('niural-swe', 'Software Engineer', 'Niural', 'Lalitpur, Nepal', 'job', '2025-05', NULL, 'Backend engineering role focusing on authentication systems, DevOps infrastructure, and product deployment on AWS cloud services.', '{}', '{Python,"AWS Cognito",Lambda,Amplify,CloudWatch,CloudFront}', '{"Reduced authentication latency by 60%","Implemented zero-downtime deployment pipeline","Built scalable serverless architecture"}', NULL, 0, now(), now());
INSERT INTO public.experience (id, title, company, location, type, start_date, end_date, description, responsibilities, technologies, achievements, company_url, sort_order, created_at, updated_at) VALUES
('duke-earthquake-research', 'Research Intern', 'Duke University & IOE, Pulchowk Campus (KtmGeo Lab)', 'Remote', 'research', '2024-09', '2025-04', 'Developed novel neural network architectures for real-time earthquake prediction and early warning systems under Prof. Dr. Henri Gavin at Duke University. Focus on improving prediction accuracy and reducing false positives in seismic event detection.', '{"Designed and implemented neural network architectures achieving 80% accuracy","Developed preprocessing pipelines for large-scale seismic datasets with advanced noise reduction techniques","Created feature engineering methods for temporal seismic pattern recognition"}', '{Python,TensorFlow,PyTorch,"Deep Learning",NumPy,Pandas,"Scikit-learn"}', '{"Achieved 80% accuracy in earthquake prediction","Published technical report (in preparation)"}', 'https://ktmgeolab.org/', 1, now(), now());
INSERT INTO public.experience (id, title, company, location, type, start_date, end_date, description, responsibilities, technologies, achievements, company_url, sort_order, created_at, updated_at) VALUES
('lict-v2x-research', 'Research Fellow', 'Laboratory for ICT Research and Development (LICT), IOE', 'Lalitpur, Nepal', 'research', '2024-03', '2025-03', 'Research fellowship at LICT focusing on implementation and performance analysis of MQTT and ZeroMQ protocols for Vehicle-to-Everything (V2X) communication over 5G infrastructure. Collaboration with Universidad Politecnica de Valencia, Spain.', '{"Implemented MQTT and ZeroMQ communication protocols from scratch in OMNET++ simulation environment","Designed realistic 5G network topologies for urban and highway vehicular scenarios","Developed performance analysis framework measuring latency, throughput, and reliability","Conducted comparative analysis of protocol performance in high-mobility scenarios"}', '{C++,OMNET++,MQTT,ZeroMQ,"5G NR","IoT Protocols","Network Simulation","Protocol Design",Linux}', '{"Implemented two major IoT protocols from scratch","International collaboration with UPV, Spain"}', 'http://lict.ioe.tu.edu.np/', 2, now(), now());

-- ---- projects ----
INSERT INTO public.projects (id, title, description, long_description, technologies, github_url, live_url, paper_url, image_url, featured, category, start_date, end_date, status, impact, metrics, sort_order, created_at, updated_at) VALUES
('distributed-nn-training', 'Distributed Neural Network Training Framework', 'Custom implementation of distributed Stochastic Gradient Descent (SGD) for training neural networks across multiple nodes in a LAN. Built from scratch in C using raw sockets, multithreading, and custom network protocols.', NULL, '{C,"Raw Sockets","POSIX Threads","Distributed SGD"}', 'https://github.com/autives/na', NULL, NULL, NULL, true, 'systems', '2024', '2024', 'completed', NULL, '{"7.2x speedup on 8 nodes","85% communication efficiency","Fault-tolerant with automatic node recovery"}', 0, now(), now());
INSERT INTO public.projects (id, title, description, long_description, technologies, github_url, live_url, paper_url, image_url, featured, category, start_date, end_date, status, impact, metrics, sort_order, created_at, updated_at) VALUES
('earthquake-early-warning-ml', 'Earthquake Early Warning System', 'Deep learning model for real-time earthquake prediction developed in collaboration with Duke University. Implemented advanced ML algorithms for seismic data analysis with focus on reducing false positives.', NULL, '{Python,TensorFlow,PyTorch,"Deep Learning"}', NULL, NULL, NULL, NULL, true, 'ml', '2024-09', '2025-04', 'completed', NULL, '{"25% improvement in prediction accuracy","40% reduction in false positives","Real-time inference <100ms"}', 1, now(), now());
INSERT INTO public.projects (id, title, description, long_description, technologies, github_url, live_url, paper_url, image_url, featured, category, start_date, end_date, status, impact, metrics, sort_order, created_at, updated_at) VALUES
('5g-v2x-protocol-implementation', '5G V2X Communication Protocol Implementation', 'Implementation and performance analysis of MQTT and ZeroMQ protocols for Vehicle-to-Everything communication over 5G networks using OMNET++. Created realistic simulation environments for protocol testing.', NULL, '{C++,OMNET++,MQTT,ZeroMQ}', 'https://github.com/timalsinaditya/MQTT-and-ZmQ-from-scratch.git', NULL, NULL, NULL, true, 'networks', '2024-03', '2025-03', 'completed', NULL, '{"30% improved delivery rate","Sub-20ms latency achieved","95% reliability in high mobility"}', 2, now(), now());
INSERT INTO public.projects (id, title, description, long_description, technologies, github_url, live_url, paper_url, image_url, featured, category, start_date, end_date, status, impact, metrics, sort_order, created_at, updated_at) VALUES
('blockchain-consensus-golang', 'Blockchain Implementation with Consensus Mechanisms', 'Custom blockchain implementation in Golang featuring proof-of-work consensus, Byzantine fault tolerance, transaction validation, and peer-to-peer networking. Includes wallet functionality and mining capabilities.', NULL, '{Golang,Blockchain,Cryptography,"P2P Networking"}', 'https://github.com/timalsinaditya/simple-container.git', NULL, NULL, NULL, true, 'systems', '2024', NULL, 'ongoing', NULL, '{"1000+ TPS throughput","Byzantine fault tolerance","Sub-second block finality"}', 3, now(), now());

-- ---- skills ----
INSERT INTO public.skills (id, category, skills, proficiency, sort_order) VALUES
(gen_random_uuid(), 'Programming Languages', '{Python,"C/C++",Golang,Rust,"JavaScript/TypeScript",SQL,"Shell Scripting"}', 'advanced', 0);
INSERT INTO public.skills (id, category, skills, proficiency, sort_order) VALUES
(gen_random_uuid(), 'Machine Learning & AI', '{TensorFlow,PyTorch,"Deep Learning","Neural Networks","Reinforcement Learning","Signal Processing","Time Series Analysis","Computer Vision"}', 'advanced', 1);
INSERT INTO public.skills (id, category, skills, proficiency, sort_order) VALUES
(gen_random_uuid(), 'Systems & Networks', '{"Linux/UNIX","Distributed Systems","Network Protocols","TCP/IP","5G/6G Networks",MQTT,ZeroMQ,"Real-time Systems"}', 'advanced', 2);
INSERT INTO public.skills (id, category, skills, proficiency, sort_order) VALUES
(gen_random_uuid(), 'Development & Cloud', '{"AWS (Lambda, ECS, Cognito)","CI/CD","Docker/Kubernetes",Terraform,"Linux Administration","System Design"}', 'intermediate', 3);

COMMIT;
