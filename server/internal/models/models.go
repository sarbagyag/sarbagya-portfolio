package models

import "time"

type Language struct {
	Name  string `json:"name"`
	Level string `json:"level"`
}

type Profile struct {
	ID             int        `json:"id"`
	Name           string     `json:"name"`
	Tagline        string     `json:"tagline"`
	Bio            string     `json:"bio"`
	Email          string     `json:"email"`
	Phone          *string    `json:"phone"`
	Location       *string    `json:"location"`
	LinkedinURL    *string    `json:"linkedinUrl"`
	GithubURL      *string    `json:"githubUrl"`
	TwitterURL     *string    `json:"twitterUrl"`
	YoutubeURL     *string    `json:"youtubeUrl"`
	InstagramURL   *string    `json:"instagramUrl"`
	ScholarURL     *string    `json:"scholarUrl"`
	OrcidURL       *string    `json:"orcidUrl"`
	WebsiteURL     *string    `json:"websiteUrl"`
	AvatarURL      *string    `json:"avatarUrl"`
	ResumeURL      *string    `json:"resumeUrl"`
	Languages      []Language `json:"languages"`
	AcademicSkills []string   `json:"academicSkills"`
	UpdatedAt      time.Time  `json:"updatedAt"`
}

type ExperienceSubRole struct {
	ID               string   `json:"id"`
	ExperienceID     string   `json:"experienceId"`
	Title            string   `json:"title"`
	Company          string   `json:"company"`
	StartDate        string   `json:"startDate"`
	EndDate          *string  `json:"endDate"`
	Description      string   `json:"description"`
	Responsibilities []string `json:"responsibilities"`
	Technologies     []string `json:"technologies"`
	Achievements     []string `json:"achievements"`
	SortOrder        int      `json:"sortOrder"`
}

type Experience struct {
	ID               string              `json:"id"`
	Title            string              `json:"title"`
	Company          string              `json:"company"`
	Location         *string             `json:"location"`
	Type             string              `json:"type"` // research | internship | job
	StartDate        string              `json:"startDate"`
	EndDate          *string             `json:"endDate"`
	Description      string              `json:"description"`
	Responsibilities []string            `json:"responsibilities"`
	Technologies     []string            `json:"technologies"`
	Achievements     []string            `json:"achievements"`
	CompanyURL       *string             `json:"companyUrl"`
	SortOrder        int                 `json:"sortOrder"`
	CreatedAt        time.Time           `json:"createdAt"`
	UpdatedAt        time.Time           `json:"updatedAt"`
	SubRoles         []ExperienceSubRole `json:"subRoles"`
}

type Project struct {
	ID              string    `json:"id"`
	Title           string    `json:"title"`
	Description     string    `json:"description"`
	LongDescription *string   `json:"longDescription"`
	Technologies    []string  `json:"technologies"`
	GithubURL       *string   `json:"githubUrl"`
	LiveURL         *string   `json:"liveUrl"`
	PaperURL        *string   `json:"paperUrl"`
	ImageURL        *string   `json:"imageUrl"`
	Featured        bool      `json:"featured"`
	Category        string    `json:"category"` // ml | systems | networks
	StartDate       string    `json:"startDate"`
	EndDate         *string   `json:"endDate"`
	Status          *string   `json:"status"` // completed | ongoing | published
	Impact          *string   `json:"impact"`
	Metrics         []string  `json:"metrics"`
	SortOrder       int       `json:"sortOrder"`
	CreatedAt       time.Time `json:"createdAt"`
	UpdatedAt       time.Time `json:"updatedAt"`
}

type Education struct {
	ID                 string   `json:"id"`
	Institution        string   `json:"institution"`
	Degree             string   `json:"degree"`
	Field              string   `json:"field"`
	StartDate          string   `json:"startDate"`
	EndDate            *string  `json:"endDate"`
	GPA                *string  `json:"gpa"`
	Location           *string  `json:"location"`
	Description        *string  `json:"description"`
	Achievements       []string `json:"achievements"`
	RelevantCoursework []string `json:"relevantCoursework"`
	Thesis             *string  `json:"thesis"`
	SortOrder          int      `json:"sortOrder"`
}

type Skill struct {
	ID          string   `json:"id"`
	Category    string   `json:"category"`
	Skills      []string `json:"skills"`
	Proficiency *string  `json:"proficiency"` // beginner | intermediate | advanced | expert
	SortOrder   int      `json:"sortOrder"`
}

type Post struct {
	ID              string     `json:"id"`
	Type            string     `json:"type"` // blog | learning-log
	Slug            string     `json:"slug"`
	Title           string     `json:"title"`
	Excerpt         *string    `json:"excerpt"`
	ContentMarkdown string     `json:"contentMarkdown"`
	CoverImageURL   *string    `json:"coverImageUrl"`
	Tags            []string   `json:"tags"`
	Status          string     `json:"status"` // draft | published
	PublishedAt     *time.Time `json:"publishedAt"`
	CreatedAt       time.Time  `json:"createdAt"`
	UpdatedAt       time.Time  `json:"updatedAt"`
}

type ContactMessage struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Subject   *string   `json:"subject"`
	Message   string    `json:"message"`
	Read      bool      `json:"read"`
	CreatedAt time.Time `json:"createdAt"`
}
