package auth

import (
	"context"
	"net/http"
	"strings"
)

type contextKey string

const claimsContextKey contextKey = "claims"

// RequireAdmin gates every /api/admin/* route. Expects
// "Authorization: Bearer <token>"; anything else is a 401.
func RequireAdmin(secret string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			header := r.Header.Get("Authorization")
			token, ok := strings.CutPrefix(header, "Bearer ")
			if !ok || token == "" {
				http.Error(w, `{"error":"missing bearer token"}`, http.StatusUnauthorized)
				return
			}

			claims, err := VerifyToken(secret, token)
			if err != nil {
				http.Error(w, `{"error":"invalid or expired token"}`, http.StatusUnauthorized)
				return
			}

			ctx := context.WithValue(r.Context(), claimsContextKey, claims)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

// ClaimsFromContext retrieves the verified claims RequireAdmin stashed on
// the request context, for handlers that want to know who's calling.
func ClaimsFromContext(ctx context.Context) (*Claims, bool) {
	claims, ok := ctx.Value(claimsContextKey).(*Claims)
	return claims, ok
}
