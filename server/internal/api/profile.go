package api

import (
	"context"
	"encoding/json"
	"net/http"

	"portfolio-api/internal/models"
)

func (s *Server) handleGetProfile(w http.ResponseWriter, r *http.Request) {
	var p models.Profile
	var languagesRaw []byte

	err := s.db.QueryRow(r.Context(), `
		SELECT id, name, tagline, bio, email, phone, location, linkedin_url,
		       github_url, twitter_url, youtube_url, instagram_url, scholar_url,
		       orcid_url, website_url, avatar_url, resume_url, languages,
		       academic_skills, hero_roles, hero_motto, hero_badge, updated_at
		FROM profile WHERE id = 1`,
	).Scan(&p.ID, &p.Name, &p.Tagline, &p.Bio, &p.Email, &p.Phone, &p.Location,
		&p.LinkedinURL, &p.GithubURL, &p.TwitterURL, &p.YoutubeURL, &p.InstagramURL,
		&p.ScholarURL, &p.OrcidURL, &p.WebsiteURL, &p.AvatarURL, &p.ResumeURL,
		&languagesRaw, &p.AcademicSkills, &p.HeroRoles, &p.HeroMotto, &p.HeroBadge, &p.UpdatedAt)
	if err != nil {
		writeError(w, http.StatusNotFound, "profile not set up yet")
		return
	}
	_ = json.Unmarshal(languagesRaw, &p.Languages)

	writeJSON(w, http.StatusOK, p)
}

type updateProfileRequest struct {
	Name           string            `json:"name"`
	Tagline        string            `json:"tagline"`
	Bio            string            `json:"bio"`
	Email          string            `json:"email"`
	Phone          *string           `json:"phone"`
	Location       *string           `json:"location"`
	LinkedinURL    *string           `json:"linkedinUrl"`
	GithubURL      *string           `json:"githubUrl"`
	TwitterURL     *string           `json:"twitterUrl"`
	YoutubeURL     *string           `json:"youtubeUrl"`
	InstagramURL   *string           `json:"instagramUrl"`
	ScholarURL     *string           `json:"scholarUrl"`
	OrcidURL       *string           `json:"orcidUrl"`
	WebsiteURL     *string           `json:"websiteUrl"`
	AvatarURL      *string           `json:"avatarUrl"`
	ResumeURL      *string           `json:"resumeUrl"`
	Languages      []models.Language `json:"languages"`
	AcademicSkills []string          `json:"academicSkills"`
	HeroRoles      []string          `json:"heroRoles"`
	HeroMotto      *string           `json:"heroMotto"`
	HeroBadge      *string           `json:"heroBadge"`
}

func (s *Server) handleUpdateProfile(w http.ResponseWriter, r *http.Request) {
	var req updateProfileRequest
	if err := decodeJSON(r, &req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}
	if req.Name == "" || req.Tagline == "" || req.Bio == "" || req.Email == "" {
		writeError(w, http.StatusBadRequest, "name, tagline, bio, and email are required")
		return
	}

	ctx := r.Context()

	// Clean up storage for image fields that changed, same as before.
	var oldAvatar, oldResume *string
	_ = s.db.QueryRow(ctx, `SELECT avatar_url, resume_url FROM profile WHERE id = 1`).Scan(&oldAvatar, &oldResume)
	if oldAvatar != nil {
		go s.storage.DeleteIfChanged(context.Background(), *oldAvatar, deref(req.AvatarURL))
	}
	if oldResume != nil {
		go s.storage.DeleteIfChanged(context.Background(), *oldResume, deref(req.ResumeURL))
	}

	languagesJSON, _ := json.Marshal(req.Languages)
	if req.Languages == nil {
		languagesJSON = []byte("[]")
	}

	_, err := s.db.Exec(ctx, `
		INSERT INTO profile (id, name, tagline, bio, email, phone, location,
			linkedin_url, github_url, twitter_url, youtube_url, instagram_url,
			scholar_url, orcid_url, website_url, avatar_url, resume_url,
			languages, academic_skills, hero_roles, hero_motto, hero_badge, updated_at)
		VALUES (1, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, now())
		ON CONFLICT (id) DO UPDATE SET
			name = EXCLUDED.name, tagline = EXCLUDED.tagline, bio = EXCLUDED.bio,
			email = EXCLUDED.email, phone = EXCLUDED.phone, location = EXCLUDED.location,
			linkedin_url = EXCLUDED.linkedin_url, github_url = EXCLUDED.github_url,
			twitter_url = EXCLUDED.twitter_url, youtube_url = EXCLUDED.youtube_url,
			instagram_url = EXCLUDED.instagram_url, scholar_url = EXCLUDED.scholar_url,
			orcid_url = EXCLUDED.orcid_url, website_url = EXCLUDED.website_url,
			avatar_url = EXCLUDED.avatar_url, resume_url = EXCLUDED.resume_url,
			languages = EXCLUDED.languages, academic_skills = EXCLUDED.academic_skills,
			hero_roles = EXCLUDED.hero_roles, hero_motto = EXCLUDED.hero_motto,
			hero_badge = EXCLUDED.hero_badge, updated_at = now()`,
		req.Name, req.Tagline, req.Bio, req.Email, req.Phone, req.Location,
		req.LinkedinURL, req.GithubURL, req.TwitterURL, req.YoutubeURL, req.InstagramURL,
		req.ScholarURL, req.OrcidURL, req.WebsiteURL, req.AvatarURL, req.ResumeURL,
		languagesJSON, orEmptySlice(req.AcademicSkills), orEmptySlice(req.HeroRoles),
		req.HeroMotto, req.HeroBadge)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to save profile")
		return
	}

	s.handleGetProfile(w, r)
}

func deref(s *string) string {
	if s == nil {
		return ""
	}
	return *s
}

func orEmptySlice(s []string) []string {
	if s == nil {
		return []string{}
	}
	return s
}
