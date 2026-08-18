package api

import (
	"testing"

	"portfolio-api/internal/config"
)

// Route registration in chi panics eagerly at construction time if there's
// a genuine conflict, not lazily on first request — so just building the
// router once is enough to catch it. Worth having as a real test since the
// favorite-track route deliberately sits outside the router.go r.Group
// wrapping everything else in the standard 30s timeout (it needs a longer
// one), which is a slightly unusual sibling-registration shape.
func TestRouterConstructs(t *testing.T) {
	s := NewServer(nil, nil, &config.Config{JWTSecret: "test", CORSAllowedOrigins: []string{"*"}})

	defer func() {
		if r := recover(); r != nil {
			t.Fatalf("Router() panicked: %v", r)
		}
	}()

	if s.Router() == nil {
		t.Fatal("Router() returned nil")
	}
}
