-- The Showcase page (components/Sections/Showcase.tsx) was still fully
-- hardcoded static data — never migrated to the DB like every other
-- section. Adds the tables and backfills them with the current hardcoded
-- content (same category/project data, verbatim) so the page looks
-- unchanged until edited via /admin. Mirrors the experience/
-- experience_sub_roles shape: a parent row (category, with one "featured"
-- project baked directly into it) and a child list (its other projects).
--
-- +goose Up
CREATE TABLE showcase_categories (
    id                 text PRIMARY KEY,
    title              text NOT NULL,
    description        text NOT NULL,
    featured_name      text NOT NULL,
    featured_url       text NOT NULL,
    featured_image_url text,
    sort_order         integer NOT NULL DEFAULT 0,
    created_at         timestamptz NOT NULL DEFAULT now(),
    updated_at         timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE showcase_items (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id text NOT NULL REFERENCES showcase_categories(id) ON DELETE CASCADE,
    name        text NOT NULL,
    url         text NOT NULL,
    sort_order  integer NOT NULL DEFAULT 0
);
CREATE INDEX idx_showcase_items_category_id ON showcase_items(category_id);

INSERT INTO showcase_categories (id, title, description, featured_name, featured_url, featured_image_url, sort_order) VALUES ('n8n-automation', 'n8n Automation', 'RAG-powered workflow automation and AI agents', 'Mandala Foods RAG Chat Engine', 'https://n8n.mandalafoods.co', '/n8n-mandala-rag.png', 0) ON CONFLICT (id) DO NOTHING;
INSERT INTO showcase_categories (id, title, description, featured_name, featured_url, featured_image_url, sort_order) VALUES ('ai-chatbot', 'AI Chatbot', 'Internal AI assistant for operations and knowledge access', 'Mandala Internal Support Chatbot', 'https://internal.mandalafoods.co', '/mandala-chatbot.png', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO showcase_categories (id, title, description, featured_name, featured_url, featured_image_url, sort_order) VALUES ('task-management', 'Task Management', 'Kanban-style project and task tracking for operations', 'Vikunja Task Tracking System', 'https://tasks.mandalafoods.co', '/vikunja-mandala-foods.png', 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO showcase_categories (id, title, description, featured_name, featured_url, featured_image_url, sort_order) VALUES ('digital-profiles', 'Digital Profiles', 'Modern digital governance platforms for municipalities', 'Pokhara Metropolitan City', 'https://pokhara.digprofile.com', '/pokhara-digprofile.png', 3) ON CONFLICT (id) DO NOTHING;
INSERT INTO showcase_categories (id, title, description, featured_name, featured_url, featured_image_url, sort_order) VALUES ('icms', 'iCMS', 'Integrated Content Management Systems for government', 'FANSEP-Ministry of Agriculture and Livestock Development (MoALD)', 'https://fansep.moald.gov.np/ne', '/icms-main.png', 4) ON CONFLICT (id) DO NOTHING;
INSERT INTO showcase_categories (id, title, description, featured_name, featured_url, featured_image_url, sort_order) VALUES ('sms', 'SMS', 'Survey Management Systems for data collection and analysis', 'Buddhashanti Admin', '#', '/buddhashanti.png', 5) ON CONFLICT (id) DO NOTHING;

INSERT INTO showcase_items (category_id, name, url, sort_order) VALUES ('digital-profiles', 'Buddhashanti Digital Profile', 'https://digital.buddhashantimun.gov.np', 0);
INSERT INTO showcase_items (category_id, name, url, sort_order) VALUES ('digital-profiles', 'Kerabari Digital Profile', 'https://digital.kerabarimun.gov.np', 1);
INSERT INTO showcase_items (category_id, name, url, sort_order) VALUES ('digital-profiles', 'Lungri Digital Profile', 'https://digital.lungrimun.gov.np', 2);
INSERT INTO showcase_items (category_id, name, url, sort_order) VALUES ('digital-profiles', 'Pariwartan Digital Profile', 'https://digital.pariwartanmun.gov.np', 3);
INSERT INTO showcase_items (category_id, name, url, sort_order) VALUES ('digital-profiles', 'Khajura Digital Profile', 'https://digital.khajuramun.gov.np', 4);
INSERT INTO showcase_items (category_id, name, url, sort_order) VALUES ('digital-profiles', 'Gadhawa Digital Profile', 'https://gadhawa.digprofile.com', 5);
INSERT INTO showcase_items (category_id, name, url, sort_order) VALUES ('digital-profiles', 'Duduwa Digital Profile', 'https://digital.duduwa.gov.np', 6);
INSERT INTO showcase_items (category_id, name, url, sort_order) VALUES ('icms', 'SDDO Dang', 'https://sddodang.lumbini.gov.np', 0);
INSERT INTO showcase_items (category_id, name, url, sort_order) VALUES ('icms', 'SDO Dolpa - Karnali', 'https://icms.sdodolpa.karnali.easypalika.com', 1);
INSERT INTO showcase_items (category_id, name, url, sort_order) VALUES ('icms', 'MoLMAC - Gandaki Province (pending launch)', 'https://molmac.gandaki.gov.np', 2);
INSERT INTO showcase_items (category_id, name, url, sort_order) VALUES ('icms', 'DFO Bardiya (pending launch)', 'https://dfobardiya.gov.np', 3);
INSERT INTO showcase_items (category_id, name, url, sort_order) VALUES ('icms', 'Hospital Banke - Lumbini (pending launch)', 'https://hobanke.lumbini.gov.np', 4);
INSERT INTO showcase_items (category_id, name, url, sort_order) VALUES ('icms', 'IAL - Karnali Province (pending launch)', 'https://ial.karnali.gov.np', 5);
INSERT INTO showcase_items (category_id, name, url, sort_order) VALUES ('icms', 'PBIP - DWRI (pending launch)', 'https://pbip.dwri.gov.np', 6);
INSERT INTO showcase_items (category_id, name, url, sort_order) VALUES ('icms', 'SDDO Rupandehi (pending launch)', 'https://sddorupandehi.lumbini.gov.np', 7);
INSERT INTO showcase_items (category_id, name, url, sort_order) VALUES ('sms', 'Kerabari Admin', 'https://kerabari-admin.vercel.app', 0);
INSERT INTO showcase_items (category_id, name, url, sort_order) VALUES ('sms', 'Gadhawa Admin', 'https://gadhawa-admin-eq6q.vercel.app/', 1);
INSERT INTO showcase_items (category_id, name, url, sort_order) VALUES ('sms', 'Lungri Admin', 'https://lungri-admin.vercel.app', 2);
INSERT INTO showcase_items (category_id, name, url, sort_order) VALUES ('sms', 'Duduwa Admin', 'https://duduwa-admin.vercel.app', 3);

-- +goose Down
DROP TABLE showcase_items;
DROP TABLE showcase_categories;
