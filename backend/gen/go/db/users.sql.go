// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.25.0
// source: users.sql

package db_queries

import (
	"context"

	"github.com/jackc/pgx/v5/pgtype"
	pg_models "github.com/nucleuscloud/neosync/backend/sql/postgresql/models"
)

const convertPersonalAccountToTeam = `-- name: ConvertPersonalAccountToTeam :one
UPDATE neosync_api.accounts
SET account_slug = $1,
    account_type = 1,
    max_allowed_records = NULL
WHERE id = $2
RETURNING id, created_at, updated_at, account_type, account_slug, temporal_config, onboarding_config, max_allowed_records, stripe_customer_id
`

type ConvertPersonalAccountToTeamParams struct {
	TeamName  string
	AccountId pgtype.UUID
}

func (q *Queries) ConvertPersonalAccountToTeam(ctx context.Context, db DBTX, arg ConvertPersonalAccountToTeamParams) (NeosyncApiAccount, error) {
	row := db.QueryRow(ctx, convertPersonalAccountToTeam, arg.TeamName, arg.AccountId)
	var i NeosyncApiAccount
	err := row.Scan(
		&i.ID,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.AccountType,
		&i.AccountSlug,
		&i.TemporalConfig,
		&i.OnboardingConfig,
		&i.MaxAllowedRecords,
		&i.StripeCustomerID,
	)
	return i, err
}

const createAccountInvite = `-- name: CreateAccountInvite :one
INSERT INTO neosync_api.account_invites (
  account_id, sender_user_id, email, expires_at
) VALUES (
  $1, $2, $3, $4
)
RETURNING id, account_id, sender_user_id, email, token, accepted, created_at, updated_at, expires_at
`

type CreateAccountInviteParams struct {
	AccountID    pgtype.UUID
	SenderUserID pgtype.UUID
	Email        string
	ExpiresAt    pgtype.Timestamp
}

func (q *Queries) CreateAccountInvite(ctx context.Context, db DBTX, arg CreateAccountInviteParams) (NeosyncApiAccountInvite, error) {
	row := db.QueryRow(ctx, createAccountInvite,
		arg.AccountID,
		arg.SenderUserID,
		arg.Email,
		arg.ExpiresAt,
	)
	var i NeosyncApiAccountInvite
	err := row.Scan(
		&i.ID,
		&i.AccountID,
		&i.SenderUserID,
		&i.Email,
		&i.Token,
		&i.Accepted,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.ExpiresAt,
	)
	return i, err
}

const createAccountUserAssociation = `-- name: CreateAccountUserAssociation :exec
INSERT INTO neosync_api.account_user_associations (
  account_id, user_id
) VALUES (
  $1, $2
)
ON CONFLICT (account_id, user_id) DO NOTHING
`

type CreateAccountUserAssociationParams struct {
	AccountID pgtype.UUID
	UserID    pgtype.UUID
}

func (q *Queries) CreateAccountUserAssociation(ctx context.Context, db DBTX, arg CreateAccountUserAssociationParams) error {
	_, err := db.Exec(ctx, createAccountUserAssociation, arg.AccountID, arg.UserID)
	return err
}

const createIdentityProviderAssociation = `-- name: CreateIdentityProviderAssociation :one
INSERT INTO neosync_api.user_identity_provider_associations (
  user_id, provider_sub
) VALUES (
  $1, $2
)
RETURNING id, user_id, provider_sub, created_at, updated_at
`

type CreateIdentityProviderAssociationParams struct {
	UserID      pgtype.UUID
	ProviderSub string
}

func (q *Queries) CreateIdentityProviderAssociation(ctx context.Context, db DBTX, arg CreateIdentityProviderAssociationParams) (NeosyncApiUserIdentityProviderAssociation, error) {
	row := db.QueryRow(ctx, createIdentityProviderAssociation, arg.UserID, arg.ProviderSub)
	var i NeosyncApiUserIdentityProviderAssociation
	err := row.Scan(
		&i.ID,
		&i.UserID,
		&i.ProviderSub,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const createMachineUser = `-- name: CreateMachineUser :one
INSERT INTO neosync_api.users (
  id, created_at, updated_at, user_type
) VALUES (
  DEFAULT, DEFAULT, DEFAULT, 1
)
RETURNING id, created_at, updated_at, user_type
`

func (q *Queries) CreateMachineUser(ctx context.Context, db DBTX) (NeosyncApiUser, error) {
	row := db.QueryRow(ctx, createMachineUser)
	var i NeosyncApiUser
	err := row.Scan(
		&i.ID,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.UserType,
	)
	return i, err
}

const createNonMachineUser = `-- name: CreateNonMachineUser :one
INSERT INTO neosync_api.users (
  id, created_at, updated_at, user_type
) VALUES (
  DEFAULT, DEFAULT, DEFAULT, 0
)
RETURNING id, created_at, updated_at, user_type
`

func (q *Queries) CreateNonMachineUser(ctx context.Context, db DBTX) (NeosyncApiUser, error) {
	row := db.QueryRow(ctx, createNonMachineUser)
	var i NeosyncApiUser
	err := row.Scan(
		&i.ID,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.UserType,
	)
	return i, err
}

const createPersonalAccount = `-- name: CreatePersonalAccount :one
INSERT INTO neosync_api.accounts (
  account_type, account_slug, max_allowed_records
) VALUES (
  0, $1, $2
)
RETURNING id, created_at, updated_at, account_type, account_slug, temporal_config, onboarding_config, max_allowed_records, stripe_customer_id
`

type CreatePersonalAccountParams struct {
	AccountSlug       string
	MaxAllowedRecords pgtype.Int8
}

func (q *Queries) CreatePersonalAccount(ctx context.Context, db DBTX, arg CreatePersonalAccountParams) (NeosyncApiAccount, error) {
	row := db.QueryRow(ctx, createPersonalAccount, arg.AccountSlug, arg.MaxAllowedRecords)
	var i NeosyncApiAccount
	err := row.Scan(
		&i.ID,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.AccountType,
		&i.AccountSlug,
		&i.TemporalConfig,
		&i.OnboardingConfig,
		&i.MaxAllowedRecords,
		&i.StripeCustomerID,
	)
	return i, err
}

const createTeamAccount = `-- name: CreateTeamAccount :one
INSERT INTO neosync_api.accounts (
  account_type, account_slug
) VALUES (
  1, $1
)
RETURNING id, created_at, updated_at, account_type, account_slug, temporal_config, onboarding_config, max_allowed_records, stripe_customer_id
`

func (q *Queries) CreateTeamAccount(ctx context.Context, db DBTX, accountSlug string) (NeosyncApiAccount, error) {
	row := db.QueryRow(ctx, createTeamAccount, accountSlug)
	var i NeosyncApiAccount
	err := row.Scan(
		&i.ID,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.AccountType,
		&i.AccountSlug,
		&i.TemporalConfig,
		&i.OnboardingConfig,
		&i.MaxAllowedRecords,
		&i.StripeCustomerID,
	)
	return i, err
}

const getAccount = `-- name: GetAccount :one
SELECT id, created_at, updated_at, account_type, account_slug, temporal_config, onboarding_config, max_allowed_records, stripe_customer_id from neosync_api.accounts
WHERE id = $1
`

func (q *Queries) GetAccount(ctx context.Context, db DBTX, id pgtype.UUID) (NeosyncApiAccount, error) {
	row := db.QueryRow(ctx, getAccount, id)
	var i NeosyncApiAccount
	err := row.Scan(
		&i.ID,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.AccountType,
		&i.AccountSlug,
		&i.TemporalConfig,
		&i.OnboardingConfig,
		&i.MaxAllowedRecords,
		&i.StripeCustomerID,
	)
	return i, err
}

const getAccountInvite = `-- name: GetAccountInvite :one
SELECT id, account_id, sender_user_id, email, token, accepted, created_at, updated_at, expires_at FROM neosync_api.account_invites
WHERE id = $1
`

func (q *Queries) GetAccountInvite(ctx context.Context, db DBTX, id pgtype.UUID) (NeosyncApiAccountInvite, error) {
	row := db.QueryRow(ctx, getAccountInvite, id)
	var i NeosyncApiAccountInvite
	err := row.Scan(
		&i.ID,
		&i.AccountID,
		&i.SenderUserID,
		&i.Email,
		&i.Token,
		&i.Accepted,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.ExpiresAt,
	)
	return i, err
}

const getAccountInviteByToken = `-- name: GetAccountInviteByToken :one
SELECT id, account_id, sender_user_id, email, token, accepted, created_at, updated_at, expires_at FROM neosync_api.account_invites
WHERE token = $1
`

func (q *Queries) GetAccountInviteByToken(ctx context.Context, db DBTX, token string) (NeosyncApiAccountInvite, error) {
	row := db.QueryRow(ctx, getAccountInviteByToken, token)
	var i NeosyncApiAccountInvite
	err := row.Scan(
		&i.ID,
		&i.AccountID,
		&i.SenderUserID,
		&i.Email,
		&i.Token,
		&i.Accepted,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.ExpiresAt,
	)
	return i, err
}

const getAccountOnboardingConfig = `-- name: GetAccountOnboardingConfig :one
SELECT onboarding_config
FROM neosync_api.accounts
WHERE id = $1
`

func (q *Queries) GetAccountOnboardingConfig(ctx context.Context, db DBTX, id pgtype.UUID) (*pg_models.AccountOnboardingConfig, error) {
	row := db.QueryRow(ctx, getAccountOnboardingConfig, id)
	var onboarding_config *pg_models.AccountOnboardingConfig
	err := row.Scan(&onboarding_config)
	return onboarding_config, err
}

const getAccountUserAssociation = `-- name: GetAccountUserAssociation :one
SELECT aua.id, aua.account_id, aua.user_id, aua.created_at, aua.updated_at from neosync_api.account_user_associations aua
INNER JOIN neosync_api.accounts a ON a.id = aua.account_id
INNER JOIN neosync_api.users u ON u.id = aua.user_id
WHERE a.id = $1 AND u.id = $2
`

type GetAccountUserAssociationParams struct {
	AccountId pgtype.UUID
	UserId    pgtype.UUID
}

func (q *Queries) GetAccountUserAssociation(ctx context.Context, db DBTX, arg GetAccountUserAssociationParams) (NeosyncApiAccountUserAssociation, error) {
	row := db.QueryRow(ctx, getAccountUserAssociation, arg.AccountId, arg.UserId)
	var i NeosyncApiAccountUserAssociation
	err := row.Scan(
		&i.ID,
		&i.AccountID,
		&i.UserID,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const getAccountsByUser = `-- name: GetAccountsByUser :many
SELECT a.id, a.created_at, a.updated_at, a.account_type, a.account_slug, a.temporal_config, a.onboarding_config, a.max_allowed_records, a.stripe_customer_id
FROM neosync_api.accounts a
INNER JOIN neosync_api.account_api_keys aak ON aak.account_id = a.id
INNER JOIN neosync_api.users u ON u.id = aak.user_id
WHERE u.id = $1

UNION

SELECT a.id, a.created_at, a.updated_at, a.account_type, a.account_slug, a.temporal_config, a.onboarding_config, a.max_allowed_records, a.stripe_customer_id
FROM neosync_api.accounts a
INNER JOIN neosync_api.account_user_associations aua ON aua.account_id = a.id
INNER JOIN neosync_api.users u ON u.id = aua.user_id
WHERE u.id = $1
`

func (q *Queries) GetAccountsByUser(ctx context.Context, db DBTX, id pgtype.UUID) ([]NeosyncApiAccount, error) {
	rows, err := db.Query(ctx, getAccountsByUser, id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []NeosyncApiAccount
	for rows.Next() {
		var i NeosyncApiAccount
		if err := rows.Scan(
			&i.ID,
			&i.CreatedAt,
			&i.UpdatedAt,
			&i.AccountType,
			&i.AccountSlug,
			&i.TemporalConfig,
			&i.OnboardingConfig,
			&i.MaxAllowedRecords,
			&i.StripeCustomerID,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getActiveAccountInvites = `-- name: GetActiveAccountInvites :many
SELECT id, account_id, sender_user_id, email, token, accepted, created_at, updated_at, expires_at FROM neosync_api.account_invites
WHERE account_id = $1 AND expires_at > CURRENT_TIMESTAMP AND accepted = false
`

func (q *Queries) GetActiveAccountInvites(ctx context.Context, db DBTX, accountid pgtype.UUID) ([]NeosyncApiAccountInvite, error) {
	rows, err := db.Query(ctx, getActiveAccountInvites, accountid)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []NeosyncApiAccountInvite
	for rows.Next() {
		var i NeosyncApiAccountInvite
		if err := rows.Scan(
			&i.ID,
			&i.AccountID,
			&i.SenderUserID,
			&i.Email,
			&i.Token,
			&i.Accepted,
			&i.CreatedAt,
			&i.UpdatedAt,
			&i.ExpiresAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getAnonymousUser = `-- name: GetAnonymousUser :one
SELECT id, created_at, updated_at, user_type from neosync_api.users
WHERE id = '00000000-0000-0000-0000-000000000000'
`

func (q *Queries) GetAnonymousUser(ctx context.Context, db DBTX) (NeosyncApiUser, error) {
	row := db.QueryRow(ctx, getAnonymousUser)
	var i NeosyncApiUser
	err := row.Scan(
		&i.ID,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.UserType,
	)
	return i, err
}

const getBilledAccounts = `-- name: GetBilledAccounts :many
SELECT id, created_at, updated_at, account_type, account_slug, temporal_config, onboarding_config, max_allowed_records, stripe_customer_id
FROM neosync_api.accounts
WHERE stripe_customer_id IS NOT NULL AND ($1::uuid[] = '{}' OR id = ANY($1::uuid[]))
`

func (q *Queries) GetBilledAccounts(ctx context.Context, db DBTX, accountids []pgtype.UUID) ([]NeosyncApiAccount, error) {
	rows, err := db.Query(ctx, getBilledAccounts, accountids)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []NeosyncApiAccount
	for rows.Next() {
		var i NeosyncApiAccount
		if err := rows.Scan(
			&i.ID,
			&i.CreatedAt,
			&i.UpdatedAt,
			&i.AccountType,
			&i.AccountSlug,
			&i.TemporalConfig,
			&i.OnboardingConfig,
			&i.MaxAllowedRecords,
			&i.StripeCustomerID,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getPersonalAccountByUserId = `-- name: GetPersonalAccountByUserId :one
SELECT a.id, a.created_at, a.updated_at, a.account_type, a.account_slug, a.temporal_config, a.onboarding_config, a.max_allowed_records, a.stripe_customer_id from neosync_api.accounts a
INNER JOIN neosync_api.account_user_associations aua ON aua.account_id = a.id
INNER JOIN neosync_api.users u ON u.id = aua.user_id
WHERE u.id = $1 AND a.account_type = 0
`

func (q *Queries) GetPersonalAccountByUserId(ctx context.Context, db DBTX, userid pgtype.UUID) (NeosyncApiAccount, error) {
	row := db.QueryRow(ctx, getPersonalAccountByUserId, userid)
	var i NeosyncApiAccount
	err := row.Scan(
		&i.ID,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.AccountType,
		&i.AccountSlug,
		&i.TemporalConfig,
		&i.OnboardingConfig,
		&i.MaxAllowedRecords,
		&i.StripeCustomerID,
	)
	return i, err
}

const getTeamAccountsByUserId = `-- name: GetTeamAccountsByUserId :many
SELECT a.id, a.created_at, a.updated_at, a.account_type, a.account_slug, a.temporal_config, a.onboarding_config, a.max_allowed_records, a.stripe_customer_id from neosync_api.accounts a
INNER JOIN neosync_api.account_user_associations aua ON aua.account_id = a.id
INNER JOIN neosync_api.users u ON u.id = aua.user_id
WHERE u.id = $1 AND a.account_type = 1
`

func (q *Queries) GetTeamAccountsByUserId(ctx context.Context, db DBTX, userid pgtype.UUID) ([]NeosyncApiAccount, error) {
	rows, err := db.Query(ctx, getTeamAccountsByUserId, userid)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []NeosyncApiAccount
	for rows.Next() {
		var i NeosyncApiAccount
		if err := rows.Scan(
			&i.ID,
			&i.CreatedAt,
			&i.UpdatedAt,
			&i.AccountType,
			&i.AccountSlug,
			&i.TemporalConfig,
			&i.OnboardingConfig,
			&i.MaxAllowedRecords,
			&i.StripeCustomerID,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getTemporalConfigByAccount = `-- name: GetTemporalConfigByAccount :one
SELECT temporal_config
FROM neosync_api.accounts
WHERE id = $1
`

func (q *Queries) GetTemporalConfigByAccount(ctx context.Context, db DBTX, id pgtype.UUID) (*pg_models.TemporalConfig, error) {
	row := db.QueryRow(ctx, getTemporalConfigByAccount, id)
	var temporal_config *pg_models.TemporalConfig
	err := row.Scan(&temporal_config)
	return temporal_config, err
}

const getTemporalConfigByUserAccount = `-- name: GetTemporalConfigByUserAccount :one
SELECT a.temporal_config
FROM neosync_api.accounts a
INNER JOIN neosync_api.account_user_associations aua ON aua.account_id = a.id
INNER JOIN neosync_api.users u ON u.id = aua.user_id
WHERE a.id = $1 AND u.id = $2
`

type GetTemporalConfigByUserAccountParams struct {
	AccountId pgtype.UUID
	UserId    pgtype.UUID
}

func (q *Queries) GetTemporalConfigByUserAccount(ctx context.Context, db DBTX, arg GetTemporalConfigByUserAccountParams) (*pg_models.TemporalConfig, error) {
	row := db.QueryRow(ctx, getTemporalConfigByUserAccount, arg.AccountId, arg.UserId)
	var temporal_config *pg_models.TemporalConfig
	err := row.Scan(&temporal_config)
	return temporal_config, err
}

const getUser = `-- name: GetUser :one
SELECT id, created_at, updated_at, user_type FROM neosync_api.users
WHERE id = $1
`

func (q *Queries) GetUser(ctx context.Context, db DBTX, id pgtype.UUID) (NeosyncApiUser, error) {
	row := db.QueryRow(ctx, getUser, id)
	var i NeosyncApiUser
	err := row.Scan(
		&i.ID,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.UserType,
	)
	return i, err
}

const getUserAssociationByProviderSub = `-- name: GetUserAssociationByProviderSub :one
SELECT id, user_id, provider_sub, created_at, updated_at from neosync_api.user_identity_provider_associations
WHERE provider_sub = $1
`

func (q *Queries) GetUserAssociationByProviderSub(ctx context.Context, db DBTX, providerSub string) (NeosyncApiUserIdentityProviderAssociation, error) {
	row := db.QueryRow(ctx, getUserAssociationByProviderSub, providerSub)
	var i NeosyncApiUserIdentityProviderAssociation
	err := row.Scan(
		&i.ID,
		&i.UserID,
		&i.ProviderSub,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const getUserByProviderSub = `-- name: GetUserByProviderSub :one
SELECT u.id, u.created_at, u.updated_at, u.user_type from neosync_api.users u
INNER JOIN neosync_api.user_identity_provider_associations uipa ON uipa.user_id = u.id
WHERE uipa.provider_sub = $1 and u.user_type = 0
`

func (q *Queries) GetUserByProviderSub(ctx context.Context, db DBTX, providerSub string) (NeosyncApiUser, error) {
	row := db.QueryRow(ctx, getUserByProviderSub, providerSub)
	var i NeosyncApiUser
	err := row.Scan(
		&i.ID,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.UserType,
	)
	return i, err
}

const getUserIdentitiesByTeamAccount = `-- name: GetUserIdentitiesByTeamAccount :many
SELECT aipa.id, aipa.user_id, aipa.provider_sub, aipa.created_at, aipa.updated_at FROM neosync_api.user_identity_provider_associations aipa
JOIN neosync_api.account_user_associations aua ON aua.user_id = aipa.user_id
JOIN neosync_api.accounts a ON a.id = aua.account_id
WHERE aua.account_id = $1 AND a.account_type = 1
`

func (q *Queries) GetUserIdentitiesByTeamAccount(ctx context.Context, db DBTX, accountid pgtype.UUID) ([]NeosyncApiUserIdentityProviderAssociation, error) {
	rows, err := db.Query(ctx, getUserIdentitiesByTeamAccount, accountid)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []NeosyncApiUserIdentityProviderAssociation
	for rows.Next() {
		var i NeosyncApiUserIdentityProviderAssociation
		if err := rows.Scan(
			&i.ID,
			&i.UserID,
			&i.ProviderSub,
			&i.CreatedAt,
			&i.UpdatedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getUserIdentityAssociationsByUserIds = `-- name: GetUserIdentityAssociationsByUserIds :many
SELECT id, user_id, provider_sub, created_at, updated_at from neosync_api.user_identity_provider_associations
WHERE user_id = ANY($1::uuid[])
`

func (q *Queries) GetUserIdentityAssociationsByUserIds(ctx context.Context, db DBTX, dollar_1 []pgtype.UUID) ([]NeosyncApiUserIdentityProviderAssociation, error) {
	rows, err := db.Query(ctx, getUserIdentityAssociationsByUserIds, dollar_1)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []NeosyncApiUserIdentityProviderAssociation
	for rows.Next() {
		var i NeosyncApiUserIdentityProviderAssociation
		if err := rows.Scan(
			&i.ID,
			&i.UserID,
			&i.ProviderSub,
			&i.CreatedAt,
			&i.UpdatedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getUserIdentityByUserId = `-- name: GetUserIdentityByUserId :one
SELECT aipa.id, aipa.user_id, aipa.provider_sub, aipa.created_at, aipa.updated_at FROM neosync_api.user_identity_provider_associations aipa
WHERE aipa.user_id = $1
`

func (q *Queries) GetUserIdentityByUserId(ctx context.Context, db DBTX, userID pgtype.UUID) (NeosyncApiUserIdentityProviderAssociation, error) {
	row := db.QueryRow(ctx, getUserIdentityByUserId, userID)
	var i NeosyncApiUserIdentityProviderAssociation
	err := row.Scan(
		&i.ID,
		&i.UserID,
		&i.ProviderSub,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const isUserInAccount = `-- name: IsUserInAccount :one
SELECT count(aua.id) from neosync_api.account_user_associations aua
INNER JOIN neosync_api.accounts a ON a.id = aua.account_id
INNER JOIN neosync_api.users u ON u.id = aua.user_id
WHERE a.id = $1 AND u.id = $2
`

type IsUserInAccountParams struct {
	AccountId pgtype.UUID
	UserId    pgtype.UUID
}

func (q *Queries) IsUserInAccount(ctx context.Context, db DBTX, arg IsUserInAccountParams) (int64, error) {
	row := db.QueryRow(ctx, isUserInAccount, arg.AccountId, arg.UserId)
	var count int64
	err := row.Scan(&count)
	return count, err
}

const removeAccountInvite = `-- name: RemoveAccountInvite :exec
DELETE FROM neosync_api.account_invites
WHERE id = $1
`

func (q *Queries) RemoveAccountInvite(ctx context.Context, db DBTX, id pgtype.UUID) error {
	_, err := db.Exec(ctx, removeAccountInvite, id)
	return err
}

const removeAccountUser = `-- name: RemoveAccountUser :exec
DELETE FROM neosync_api.account_user_associations
WHERE account_id = $1 AND user_id = $2
`

type RemoveAccountUserParams struct {
	AccountId pgtype.UUID
	UserId    pgtype.UUID
}

func (q *Queries) RemoveAccountUser(ctx context.Context, db DBTX, arg RemoveAccountUserParams) error {
	_, err := db.Exec(ctx, removeAccountUser, arg.AccountId, arg.UserId)
	return err
}

const setAccountMaxAllowedRecords = `-- name: SetAccountMaxAllowedRecords :one
UPDATE neosync_api.accounts
SET max_allowed_records = $1
WHERE id = $2
RETURNING id, created_at, updated_at, account_type, account_slug, temporal_config, onboarding_config, max_allowed_records, stripe_customer_id
`

type SetAccountMaxAllowedRecordsParams struct {
	MaxAllowedRecords pgtype.Int8
	AccountId         pgtype.UUID
}

func (q *Queries) SetAccountMaxAllowedRecords(ctx context.Context, db DBTX, arg SetAccountMaxAllowedRecordsParams) (NeosyncApiAccount, error) {
	row := db.QueryRow(ctx, setAccountMaxAllowedRecords, arg.MaxAllowedRecords, arg.AccountId)
	var i NeosyncApiAccount
	err := row.Scan(
		&i.ID,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.AccountType,
		&i.AccountSlug,
		&i.TemporalConfig,
		&i.OnboardingConfig,
		&i.MaxAllowedRecords,
		&i.StripeCustomerID,
	)
	return i, err
}

const setAnonymousUser = `-- name: SetAnonymousUser :one
INSERT INTO neosync_api.users (
  id, created_at, updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000', DEFAULT, DEFAULT
)
ON CONFLICT (id)
DO
  UPDATE SET updated_at = current_timestamp
RETURNING id, created_at, updated_at, user_type
`

func (q *Queries) SetAnonymousUser(ctx context.Context, db DBTX) (NeosyncApiUser, error) {
	row := db.QueryRow(ctx, setAnonymousUser)
	var i NeosyncApiUser
	err := row.Scan(
		&i.ID,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.UserType,
	)
	return i, err
}

const setNewAccountStripeCustomerId = `-- name: SetNewAccountStripeCustomerId :one
UPDATE neosync_api.accounts
SET stripe_customer_id = $1
WHERE id = $2 AND stripe_customer_id IS NULL
RETURNING id, created_at, updated_at, account_type, account_slug, temporal_config, onboarding_config, max_allowed_records, stripe_customer_id
`

type SetNewAccountStripeCustomerIdParams struct {
	StripeCustomerID pgtype.Text
	AccountId        pgtype.UUID
}

func (q *Queries) SetNewAccountStripeCustomerId(ctx context.Context, db DBTX, arg SetNewAccountStripeCustomerIdParams) (NeosyncApiAccount, error) {
	row := db.QueryRow(ctx, setNewAccountStripeCustomerId, arg.StripeCustomerID, arg.AccountId)
	var i NeosyncApiAccount
	err := row.Scan(
		&i.ID,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.AccountType,
		&i.AccountSlug,
		&i.TemporalConfig,
		&i.OnboardingConfig,
		&i.MaxAllowedRecords,
		&i.StripeCustomerID,
	)
	return i, err
}

const updateAccountInviteToAccepted = `-- name: UpdateAccountInviteToAccepted :one
UPDATE neosync_api.account_invites
SET accepted = true
WHERE id = $1
RETURNING id, account_id, sender_user_id, email, token, accepted, created_at, updated_at, expires_at
`

func (q *Queries) UpdateAccountInviteToAccepted(ctx context.Context, db DBTX, id pgtype.UUID) (NeosyncApiAccountInvite, error) {
	row := db.QueryRow(ctx, updateAccountInviteToAccepted, id)
	var i NeosyncApiAccountInvite
	err := row.Scan(
		&i.ID,
		&i.AccountID,
		&i.SenderUserID,
		&i.Email,
		&i.Token,
		&i.Accepted,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.ExpiresAt,
	)
	return i, err
}

const updateAccountOnboardingConfig = `-- name: UpdateAccountOnboardingConfig :one
UPDATE neosync_api.accounts
SET onboarding_config = $1
WHERE id = $2
RETURNING id, created_at, updated_at, account_type, account_slug, temporal_config, onboarding_config, max_allowed_records, stripe_customer_id
`

type UpdateAccountOnboardingConfigParams struct {
	OnboardingConfig *pg_models.AccountOnboardingConfig
	AccountId        pgtype.UUID
}

func (q *Queries) UpdateAccountOnboardingConfig(ctx context.Context, db DBTX, arg UpdateAccountOnboardingConfigParams) (NeosyncApiAccount, error) {
	row := db.QueryRow(ctx, updateAccountOnboardingConfig, arg.OnboardingConfig, arg.AccountId)
	var i NeosyncApiAccount
	err := row.Scan(
		&i.ID,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.AccountType,
		&i.AccountSlug,
		&i.TemporalConfig,
		&i.OnboardingConfig,
		&i.MaxAllowedRecords,
		&i.StripeCustomerID,
	)
	return i, err
}

const updateActiveAccountInvitesToExpired = `-- name: UpdateActiveAccountInvitesToExpired :one
UPDATE neosync_api.account_invites
SET expires_at = CURRENT_TIMESTAMP
WHERE account_id = $1 AND email = $2 AND expires_at > CURRENT_TIMESTAMP
RETURNING id, account_id, sender_user_id, email, token, accepted, created_at, updated_at, expires_at
`

type UpdateActiveAccountInvitesToExpiredParams struct {
	AccountId pgtype.UUID
	Email     string
}

func (q *Queries) UpdateActiveAccountInvitesToExpired(ctx context.Context, db DBTX, arg UpdateActiveAccountInvitesToExpiredParams) (NeosyncApiAccountInvite, error) {
	row := db.QueryRow(ctx, updateActiveAccountInvitesToExpired, arg.AccountId, arg.Email)
	var i NeosyncApiAccountInvite
	err := row.Scan(
		&i.ID,
		&i.AccountID,
		&i.SenderUserID,
		&i.Email,
		&i.Token,
		&i.Accepted,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.ExpiresAt,
	)
	return i, err
}

const updateTemporalConfigByAccount = `-- name: UpdateTemporalConfigByAccount :one
UPDATE neosync_api.accounts
SET temporal_config = $1
WHERE id = $2
RETURNING id, created_at, updated_at, account_type, account_slug, temporal_config, onboarding_config, max_allowed_records, stripe_customer_id
`

type UpdateTemporalConfigByAccountParams struct {
	TemporalConfig *pg_models.TemporalConfig
	AccountId      pgtype.UUID
}

func (q *Queries) UpdateTemporalConfigByAccount(ctx context.Context, db DBTX, arg UpdateTemporalConfigByAccountParams) (NeosyncApiAccount, error) {
	row := db.QueryRow(ctx, updateTemporalConfigByAccount, arg.TemporalConfig, arg.AccountId)
	var i NeosyncApiAccount
	err := row.Scan(
		&i.ID,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.AccountType,
		&i.AccountSlug,
		&i.TemporalConfig,
		&i.OnboardingConfig,
		&i.MaxAllowedRecords,
		&i.StripeCustomerID,
	)
	return i, err
}
