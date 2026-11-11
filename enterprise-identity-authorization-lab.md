# Enterprise Identity & Authorization Lab

## Practical Learning Roadmap

The goal of this project is to learn authentication, authorization, identity federation, provisioning, and security by **building a realistic enterprise SaaS identity platform** rather than studying each concept in isolation.

Recommended stack:

- **Backend:** Node.js + Express + TypeScript
- **Frontend:** React / Next.js
- **Database:** PostgreSQL
- **Cache / queues:** Redis when needed
- **Authorization:** Start in application code, later integrate OpenFGA / a policy engine
- **Testing:** Jest/Vitest + Supertest
- **API documentation:** OpenAPI / Scalar
- **Deployment:** Docker + AWS when the application is mature

The project should begin as a **modular monolith** and only extract services when there is a genuine architectural reason.

---

# 1. Understand the Vocabulary First

One of the biggest sources of confusion is mixing authentication, authorization, federation, and identity lifecycle.

## Authentication

> **Who are you?**

Examples:

- Password
- Session
- JWT
- OIDC
- WebAuthn / Passkeys
- MFA

Example:

```text
email + password
       ↓
authentication
       ↓
User #123
```

---

## Authorization

> **What are you allowed to do?**

Example:

```text
User #123
   ↓
Can this user
DELETE project #55?
```

Authorization models:

- RBAC
- Permission-based authorization
- ABAC
- Policy-based authorization
- ReBAC

---

## Identity Lifecycle

> **How does a user's identity enter, change, and leave an organization?**

Examples:

- SCIM provisioning
- Deprovisioning
- Group synchronization
- Role assignment
- Account suspension

---

## Enterprise Federation

> **How does another organization's identity system authenticate users into your application?**

Example:

```text
Company
  │
  │ Microsoft Entra ID / Okta
  │
  ▼
Your SaaS
```

Protocols:

- OIDC
- SAML

---

# 2. Overall Learning Roadmap

Build the system progressively:

```text
PHASE 1
Password Authentication
        ↓
PHASE 2
Session Management
        ↓
PHASE 3
JWT + Access/Refresh Tokens
        ↓
PHASE 4
RBAC
        ↓
PHASE 5
Permission-based Authorization
        ↓
PHASE 6
Multi-tenant Authorization
        ↓
PHASE 7
ABAC
        ↓
PHASE 8
Policy-based Authorization
        ↓
PHASE 9
ReBAC / Zanzibar Concepts
        ↓
PHASE 10
OIDC
        ↓
PHASE 11
Build Your Own SSO
        ↓
PHASE 12
SAML
        ↓
PHASE 13
SCIM
        ↓
PHASE 14
WebAuthn / Passkeys
        ↓
PHASE 15
MFA / TOTP
        ↓
PHASE 16
Security Hardening
        ↓
PHASE 17
Compliance Architecture
```

The order matters.

You should first understand the basic primitives before using products that hide the details.

---

# 3. The Project: Enterprise Identity & Authorization Lab

Build one realistic SaaS platform throughout the entire learning journey.

Think of it as a small enterprise identity and authorization platform.

```text
                         ┌──────────────────────┐
                         │      Web Client      │
                         │   Next.js / React    │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │     API Gateway      │
                         │  Auth / Rate Limits  │
                         └──────────┬───────────┘
                                    │
                  ┌─────────────────┼──────────────────┐
                  ▼                 ▼                  ▼
           ┌────────────┐   ┌──────────────┐   ┌──────────────┐
           │ Identity   │   │ Authorization│   │   Resources  │
           │            │   │              │   │              │
           │ Password   │   │ RBAC         │   │ Projects     │
           │ Sessions   │   │ Permissions  │   │ Documents    │
           │ OIDC       │   │ ABAC         │   │ Teams        │
           │ SAML       │   │ Policies      │   │ Billing      │
           │ WebAuthn   │   │ ReBAC        │   │ Reports      │
           └────────────┘   └──────────────┘   └──────────────┘
                  │                 │
                  ▼                 ▼
           ┌────────────┐   ┌──────────────┐
           │ PostgreSQL │   │ Policy /     │
           │            │   │ Relationship │
           │ Users      │   │ Engine       │
           │ Orgs       │   │ OpenFGA      │
           │ Sessions   │   │              │
           └────────────┘   └──────────────┘
                  ▲
                  │
           ┌──────┴───────┐
           │     SCIM     │
           │ provisioning │
           └──────────────┘
```

---

# 4. Phase 1 — Basic Password Authentication

Start with simple authentication.

## Database

Create:

```text
users
```

Suggested fields:

```text
id
email
password_hash
name
status
created_at
updated_at
```

Implement:

```http
POST /auth/register
POST /auth/login
POST /auth/logout
GET  /auth/me
```

Never store plaintext passwords.

Bad:

```text
password = "mypassword123"
```

Good:

```text
password_hash = "$argon2id$..."
```

Use a strong password hashing algorithm such as:

- Argon2id
- bcrypt

---

# 5. Phase 2 — Session Management

Before jumping into JWT, implement traditional sessions.

```text
Browser
   │
   │ email/password
   ▼
POST /login
   │
   ▼
Server
   │
   ├── authenticate user
   │
   └── create session
            │
            ▼
       PostgreSQL
       ┌──────────────┐
       │ session_id   │
       │ user_id      │
       │ expires_at   │
       └──────────────┘
```

Browser receives:

```http
Set-Cookie: session_id=...
```

Subsequent request:

```http
GET /me
Cookie: session_id=...
```

Server:

```text
session_id
    ↓
lookup session
    ↓
user_id
    ↓
user
```

Important lesson:

> Authentication is not synonymous with JWT.

JWT is only one authentication/token mechanism.

---

# 6. Phase 3 — JWT + Refresh Tokens

Now implement:

```text
Access Token
+
Refresh Token
```

Typical conceptual model:

```text
access_token
   ↓
short lifetime

refresh_token
   ↓
longer lifetime
```

Flow:

```text
Login
 │
 ▼
Access Token
 │
 ├───────────────→ API
 │
 │ expired
 ▼
Refresh Token
 │
 ▼
New Access Token
```

Study and implement:

- Access token expiration
- Refresh token expiration
- Refresh token rotation
- Refresh token reuse detection
- Token revocation
- Logout
- Account suspension
- Password-change invalidation
- `iss`
- `aud`
- `sub`
- `exp`
- `iat`
- `jti`

Do not stop at the statement:

> JWT is stateless.

Ask:

- What happens when the user logs out?
- What happens when the account is suspended?
- How do you revoke a compromised refresh token?
- What happens when a refresh token is replayed?
- What happens after a password change?

---

# 7. Phase 4 — RBAC

RBAC = **Role-Based Access Control**.

Users are assigned roles.

Example:

```text
ADMIN
MANAGER
MEMBER
VIEWER
```

Database:

```text
users
roles
user_roles
```

Example:

```text
Rutvik
   ↓
ADMIN
```

Middleware:

```ts
requireRole("ADMIN")
```

Example route:

```http
DELETE /users/:id
```

Flow:

```text
Request
  ↓
Authentication
  ↓
User
  ↓
Role
  ↓
ADMIN?
  ↓
Allow / Deny
```

## Problem with simple RBAC

Suppose:

```text
Rutvik = ADMIN
```

and:

```text
Admin can delete projects
```

What if an admin should only delete projects belonging to their own organization?

Simple RBAC is no longer enough.

---

# 8. Phase 5 — Fine-Grained Permissions

Introduce:

```text
permissions
roles
role_permissions
user_roles
```

Example permissions:

```text
user:read
user:create
user:update
user:delete

project:read
project:create
project:update
project:delete

billing:read
billing:update
```

Example:

```text
roles

ADMIN
MANAGER
DEVELOPER
VIEWER
```

Permission mapping:

```text
ADMIN
  → project:create
  → project:read
  → project:update
  → project:delete

MANAGER
  → project:read
  → project:update

DEVELOPER
  → project:read
  → project:update

VIEWER
  → project:read
```

Now middleware can become:

```ts
requirePermission("project:delete")
```

instead of:

```ts
requireRole("ADMIN")
```

This is more flexible because permissions can evolve independently from routes.

---

# 9. Phase 6 — Multi-Tenant Authorization

Make the project a realistic SaaS.

Introduce:

```text
organizations
users
organization_members
roles
permissions
```

Example:

```text
Acme Corp
   │
   ├── Rutvik
   ├── John
   └── Sarah

Globex
   │
   ├── Alice
   └── Bob
```

User context:

```text
Rutvik
   ↓
Acme
   ↓
Admin
```

Now this must be rejected:

```text
Rutvik → Globex project
```

Authorization becomes:

```text
Is authenticated?
        +
Has permission?
        +
Belongs to organization?
        +
Resource belongs to organization?
```

This teaches:

- Multi-tenancy
- Tenant isolation
- Organization membership
- Tenant-scoped roles
- Cross-tenant access prevention

---

# 10. Phase 7 — Resource-Level Authorization

Introduce resource ownership.

Example:

```text
Project #101

owner = Rutvik
organization = Acme
```

Rules:

```text
User can read project
IF
user belongs to organization

User can update project
IF
user has project:update

User can delete project
IF
user is owner
OR
user has project:delete
```

Authorization now depends on:

```text
user
+
organization
+
role
+
permission
+
resource
+
relationship
```

This is much more expressive than:

```ts
user.role === "ADMIN"
```

---

# 11. Phase 8 — ABAC

ABAC = **Attribute-Based Access Control**.

Authorization decisions use attributes of:

- Subject/user
- Resource
- Environment
- Action

Example user:

```json
{
  "department": "engineering",
  "country": "IN",
  "clearanceLevel": 3
}
```

Resource:

```json
{
  "department": "engineering",
  "country": "IN",
  "classification": "confidential",
  "requiredClearance": 2
}
```

Policy:

```text
ALLOW

IF
user.department == resource.department

AND

user.clearanceLevel >= resource.requiredClearance
```

Example:

```text
Rutvik
department = engineering
clearance = 3

Document
department = engineering
requiredClearance = 2

=> ALLOW
```

But:

```text
Document
department = finance
```

results in:

```text
DENY
```

---

# 12. Phase 9 — Policy-Based Authorization

Eventually controllers can become polluted with authorization logic.

Bad:

```ts
if (
  user.role === "ADMIN" ||
  (
    user.department === resource.department &&
    user.clearanceLevel >= resource.requiredClearance
  )
) {
   ...
}
```

Another controller might contain different logic.

Another service might duplicate it.

Centralize authorization.

```text
Controller
    │
    ▼
Authorization Service
    │
    ▼
Policy
    │
    ▼
ALLOW / DENY
```

Useful abstraction:

```ts
authorization.can({
  subject: user,
  action: "document:update",
  resource: document,
});
```

Response:

```ts
{
  allowed: true
}
```

The application doesn't need to know how the authorization decision was calculated.

---

# 13. Phase 10 — ReBAC

ReBAC = **Relationship-Based Access Control**.

This becomes important when permissions depend on relationships between entities.

Example:

```text
Organization
   │
   ├── Team
   │     │
   │     └── Project
   │            │
   │            └── Document
   │
   └── User
```

Relationships:

```text
Rutvik
  └── member_of → Backend Team

Backend Team
  └── member_of → Acme

Project A
  └── parent → Backend Team

Document X
  └── parent → Project A
```

Question:

```text
Can Rutvik read Document X?
```

Conceptually:

```text
Rutvik
 ↓
member_of
 ↓
Backend Team
 ↓
has access to
 ↓
Project A
 ↓
contains
 ↓
Document X
```

This is the conceptual foundation behind Google's Zanzibar-style authorization model.

For practical learning, use an authorization system such as **OpenFGA** rather than immediately writing your own graph authorization engine.

Learn:

- Tuples
- Relations
- Usersets
- Recursive relationships
- Relationship inheritance
- Authorization checks
- Consistency considerations

---

# 14. Phase 11 — OIDC

Only after understanding authentication should you learn OIDC.

Important distinction:

## OAuth 2.0

Primarily:

> Delegated authorization.

## OpenID Connect

Adds an identity layer on top of OAuth 2.0:

> Authentication / identity.

Flow:

```text
Your Application
       │
       │ Login
       ▼
Identity Provider
       │
       │ authorization
       ▼
callback
       │
       ▼
Your Application
```

Deeply understand:

```text
Authorization Code
PKCE
state
nonce
redirect_uri
client_id
client_secret
ID Token
Access Token
Refresh Token
issuer
JWKS
```

Trace the protocol manually before relying completely on libraries:

```text
/browser
    ↓
/authorize
    ↓
Identity Provider
    ↓
callback?code=...
    ↓
/token
    ↓
ID Token
Access Token
```

---

# 15. Phase 12 — Build Your Own Mini SSO

Create two applications and one identity provider.

```text
          ┌──────────────────┐
          │ Identity Provider│
          │                  │
          │ auth.local       │
          └────────┬─────────┘
                   │
          ┌────────┴─────────┐
          │                  │
          ▼                  ▼
       App A              App B
     CRM App           Project App
```

User visits:

```text
crm.local
```

Not authenticated.

Redirect:

```text
auth.local/authorize
```

User logs in.

Then:

```text
auth.local
      ↓
authorization code
      ↓
crm.local/callback
      ↓
token exchange
      ↓
logged in
```

Now open:

```text
project.local
```

and the user should already be authenticated.

This is where SSO should become intuitive.

---

# 16. Phase 13 — SAML

Learn SAML after OIDC.

Build:

```text
Your SaaS
   │
   │ SAML
   ▼
Fake Enterprise IdP
```

Learn these concepts:

```text
SP
IdP
metadata
Entity ID
ACS URL
SAML Request
SAML Response
Assertion
Signature
Certificate
NameID
```

Mental model:

```text
OIDC:

JSON + HTTP + OAuth


SAML:

XML + browser redirects + signed assertions
```

Do not only configure an enterprise provider and copy settings.

Inspect the SAML assertion and understand:

```text
Who authenticated?
When?
Which attributes?
Which audience?
Which recipient?
Was it signed?
Which certificate verified it?
```

---

# 17. Phase 14 — SCIM

SCIM solves a different problem.

Imagine Acme buys your SaaS.

Their IT administrator says:

> When I create an employee in our identity system, automatically create them in our application.

That's SCIM.

```text
             Enterprise IdP
                  │
             SCIM provisioning
                  │
                  ▼
          Your SaaS
                  │
                  ▼
              Database
```

Implement:

```http
POST   /scim/v2/Users
GET    /scim/v2/Users
GET    /scim/v2/Users/:id
PUT    /scim/v2/Users/:id
PATCH  /scim/v2/Users/:id
DELETE /scim/v2/Users/:id
```

Lifecycle:

```text
Employee joins
     ↓
SCIM create
     ↓
Your DB

Employee changes department
     ↓
SCIM PATCH
     ↓
Your DB

Employee leaves
     ↓
SCIM deactivate
     ↓
Your DB
```

Now you'll understand why:

> Identity lifecycle is different from authentication.

---

# 18. Phase 15 — WebAuthn / Passkeys

Implement:

```text
Register passkey
       ↓
Browser
       ↓
Authenticator
       ↓
Public/private key pair
```

Server stores:

```text
credential_id
public_key
sign_count
user_id
```

The private key remains with the authenticator.

Authentication:

```text
Server
  ↓
challenge
  ↓
browser
  ↓
authenticator
  ↓
signature
  ↓
server verifies public key
  ↓
authenticated
```

Important concept:

> Your server does not need to receive or store the user's biometric data.

The authenticator uses Face ID, fingerprint, PIN, or another local mechanism to unlock the credential.

Passkeys can be used for:

```text
Passwordless login
```

or:

```text
Second factor
```

depending on the architecture.

---

# 19. Phase 16 — MFA / TOTP

Implement Google Authenticator-style TOTP.

Flow:

```text
User
 ↓
Generate secret
 ↓
QR code
 ↓
Authenticator app
 ↓
6 digit code
 ↓
Server validates
```

Learn:

```text
shared secret
TOTP
time window
clock drift
backup codes
recovery
rate limiting
```

Then combine:

```text
Password
+
TOTP
```

and:

```text
Password
+
Passkey
```

and finally:

```text
Passkey-only
```

---

# 20. Phase 17 — Security Laboratory

Once the features work, attack your own system.

This phase is extremely important.

---

## 20.1 Brute Force Protection

Attempt:

```text
POST /login
× 10,000
```

Implement:

```text
IP rate limiting
+
account rate limiting
+
progressive delays
```

Test:

- Per-IP limits
- Per-account limits
- Distributed attacks
- Login enumeration
- Password spraying

---

## 20.2 Session Fixation

Test:

```text
old session
      ↓
login
      ↓
does session ID change?
```

The session identifier should be rotated after authentication.

---

## 20.3 CSRF

Create:

```text
evil.example
```

Attempt:

```text
POST /api/change-email
```

using a victim's browser cookies.

Learn:

```text
SameSite cookies
CSRF tokens
Origin
Referer
```

---

## 20.4 CORS

Test:

```text
http://localhost:3000
```

against:

```text
http://localhost:4000
```

Understand:

```text
CORS ≠ Authentication
CORS ≠ Authorization
CORS ≠ CSRF protection
```

---

## 20.5 JWT Security

Test:

```text
expired token
wrong issuer
wrong audience
wrong signature
algorithm confusion
stolen refresh token
refresh token replay
```

Verify that your server rejects invalid tokens.

---

# 21. Compliance Architecture

After understanding the technical security model, study how enterprise requirements influence architecture.

Topics:

```text
SOC 2
GDPR
HIPAA
```

Focus on technical concepts such as:

- Audit logs
- Access control
- Least privilege
- Data retention
- Data deletion
- Encryption
- Key management
- Security monitoring
- Incident response
- User access reviews
- Data isolation
- Backup and recovery

Compliance is not simply:

```text
"Add a compliance checkbox."
```

It affects architecture, operations, security, logging, policies, and processes.

---

# 22. Database Schema Evolution

Do not create everything on day one.

Eventually your PostgreSQL schema could contain:

```text
users
organizations
organization_members

roles
permissions
role_permissions
user_roles

sessions
refresh_tokens

oauth_clients
oauth_authorization_codes
oauth_consents

identity_providers
federated_identities

webauthn_credentials
mfa_factors
backup_codes

scim_tokens
scim_external_ids

teams
team_members

projects
project_members

documents
document_permissions

audit_logs
```

For subscription-based SaaS authorization:

```text
subscriptions
features
feature_entitlements
```

---

# 23. Real SaaS Authorization Problem

Make the application subscription-aware.

Organization:

```text
Organization
    │
    ├── Subscription
    │
    ├── Members
    │
    ├── Teams
    │
    └── Projects
```

Plans:

```text
FREE
PRO
ENTERPRISE
```

Now authorization isn't only:

```text
Can user X perform action Y?
```

It becomes:

```text
Can user X perform action Y
on resource Z
within organization O
given role R
and attributes A
and subscription S?
```

Example:

```http
POST /projects/:id/export
```

Decision:

```text
Authenticated?
       ↓
Organization member?
       ↓
project:export permission?
       ↓
Project belongs to organization?
       ↓
Plan allows exports?
       ↓
User satisfies policy?
       ↓
ALLOW
```

This is real SaaS authorization architecture.

---

# 24. Standardize Authorization Behind an Interface

Eventually standardize your authorization API.

Example:

```ts
type AuthorizationContext = {
  subject: User;

  action: string;

  resource: {
    type: string;
    id: string;
    organizationId?: string;
  };

  environment?: {
    ip?: string;
    time?: Date;
  };
};

type AuthorizationDecision = {
  allowed: boolean;
  reason?: string;
};
```

Usage:

```ts
const decision = await authorization.check({
  subject: user,
  action: "project:update",
  resource: {
    type: "project",
    id: project.id,
    organizationId: project.organizationId,
  },
});
```

Response:

```ts
{
  allowed: true
}
```

The controller should not need to know whether authorization is implemented using:

```text
RBAC
```

or:

```text
RBAC + Permissions
```

or:

```text
ABAC
```

or:

```text
OPA / policy engine
```

or:

```text
OpenFGA
```

This abstraction is an important architectural lesson.

---

# 25. Authorization Evolution

You should deliberately experience this progression.

## Level 1 — Role

```ts
if (user.role === "admin") {
}
```

↓

## Level 2 — Permission

```ts
if (user.permissions.includes("project:update")) {
}
```

↓

## Level 3 — Resource Permission

```ts
can(user, "update", project)
```

↓

## Level 4 — Tenant-Aware

```ts
can(user, "update", project, organization)
```

↓

## Level 5 — ABAC

```ts
user.department === project.department
```

↓

## Level 6 — Policy

```ts
policy.evaluate(subject, action, resource)
```

↓

## Level 7 — ReBAC

```text
user → team → project → document
```

↓

## Level 8 — External Authorization Engine

```text
Application
     ↓
Authorization API
     ↓
OpenFGA / Policy Engine
```

If you implement these transitions yourself, you will understand **why each model exists** rather than memorizing definitions.

---

# 26. Do Not Start With Managed Identity Platforms

Initially, avoid hiding the fundamentals behind:

```text
Auth0
Clerk
Firebase Auth
Keycloak
Okta
```

If you configure everything through a UI, you may learn:

> Click here, enable OIDC, copy client ID.

Instead:

1. Build the fundamentals yourself.
2. Trace the actual protocols.
3. Write integration tests.
4. Then integrate commercial/open-source identity platforms.
5. Compare what they abstract away.

Later your architecture can integrate:

```text
Your Identity System
        │
        ├── Google OIDC
        ├── Microsoft OIDC
        ├── GitHub OIDC
        ├── SAML IdP
        ├── SCIM
        └── Passkeys
```

Then you'll understand what these platforms are actually doing.

---

# 27. Final Target Architecture

After completing the lab, aim for:

```text
                         ┌─────────────────┐
                         │    Next.js      │
                         └────────┬────────┘
                                  │
                                  ▼
                       ┌────────────────────┐
                       │    API Gateway     │
                       │                    │
                       │ rate limit         │
                       │ CORS               │
                       │ request context    │
                       └─────────┬──────────┘
                                 │
              ┌──────────────────┼─────────────────┐
              │                  │                 │
              ▼                  ▼                 ▼
       ┌──────────────┐   ┌──────────────┐  ┌──────────────┐
       │   Identity   │   │Authorization │  │ Application  │
       │              │   │              │  │              │
       │ Password     │   │ RBAC         │  │ Projects     │
       │ Session      │   │ Permissions  │  │ Documents    │
       │ JWT          │   │ ABAC         │  │ Teams        │
       │ OIDC         │   │ Policies     │  │ Billing      │
       │ SAML         │   │ ReBAC        │  │ Reports      │
       │ WebAuthn     │   │              │  │              │
       │ MFA          │   │              │  │              │
       └──────┬───────┘   └──────┬───────┘  └──────────────┘
              │                  │
              ▼                  ▼
       ┌──────────────┐   ┌──────────────┐
       │ PostgreSQL   │   │ OpenFGA /    │
       │              │   │ Policy Engine│
       └──────────────┘   └──────────────┘
              ▲
              │
       ┌──────┴───────┐
       │     SCIM     │
       │ Provisioning │
       └──────────────┘
```

Everything should produce auditable security events:

```text
                    ┌───────────────┐
                    │  Audit Events │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ audit_logs    │
                    └───────────────┘
```

---

# 28. Project Milestones

Turn the learning journey into separate implementation milestones.

| # | Build | Main Concept |
|---|---|---|
| 01 | Register/Login | Password authentication |
| 02 | Sessions | Cookie/session authentication |
| 03 | JWT | Access + refresh tokens |
| 04 | RBAC | Roles |
| 05 | Permissions | Fine-grained RBAC |
| 06 | Multi-tenant SaaS | Tenant isolation |
| 07 | Resource authorization | Ownership |
| 08 | ABAC | Attributes |
| 09 | Policy engine | Central authorization |
| 10 | ReBAC | Relationships |
| 11 | OIDC client | Login with IdP |
| 12 | Mini Identity Provider | SSO |
| 13 | SAML | Enterprise federation |
| 14 | SCIM | Provisioning |
| 15 | WebAuthn | Passkeys |
| 16 | MFA | TOTP + recovery |
| 17 | Security lab | CSRF/CORS/rate limits/audit |
| 18 | Enterprise Identity Platform | Combine everything |

Each milestone should have:

```text
Implementation
       ↓
Tests
       ↓
Attack / failure scenarios
       ↓
Documentation
       ↓
Architecture diagram
       ↓
Git commit
```

---

# 29. Important Conceptual Correction

A useful way to organize the concepts is:

```text
Authentication
├── Password
├── Session
├── WebAuthn / Passkeys
└── OIDC

Delegated Authorization
└── OAuth 2.0

Enterprise Federation
├── OIDC
└── SAML

Authorization
├── RBAC
├── Permission-based
├── ABAC
├── Policy-based
└── ReBAC

Identity Lifecycle
└── SCIM

Security
├── Password hashing
├── Session management
├── CSRF
├── CORS
├── Rate limiting
├── Token security
├── Audit logging
└── Account recovery
```

This distinction prevents a lot of confusion when learning enterprise identity systems.

---

# 30. The Real Learning Goal

Do not aim to memorize:

> RBAC means roles, ABAC means attributes, ReBAC means relationships.

Aim to reach the point where you can look at a requirement such as:

```text
"We're building a multi-tenant SaaS for 50,000 organizations.

Employees authenticate through Microsoft Entra.

Enterprise customers need SSO and SCIM.

Managers can access their team's projects.

Project owners can share individual documents.

Finance features require the Enterprise plan.

Employees leaving the company must lose access immediately."
```

and independently design the:

```text
Authentication
+
Authorization
+
Federation
+
Identity Lifecycle
+
Tenant Isolation
+
Security
+
Audit
```

architecture.

That is the level of practical understanding that translates well to backend engineering and system-design interviews.

---

# 31. Recommended Development Philosophy

For every feature, follow this loop:

```text
1. Understand the problem
        ↓
2. Design the simplest model
        ↓
3. Implement it yourself
        ↓
4. Write integration tests
        ↓
5. Try to break it
        ↓
6. Fix security problems
        ↓
7. Refactor into clean modules
        ↓
8. Document the protocol
        ↓
9. Add observability
        ↓
10. Commit the milestone
```

Do not optimize for:

```text
"How quickly can I finish authentication?"
```

Optimize for:

```text
"Can I explain exactly why the system works?"
```

---

# 32. Suggested Repository Structure

A practical initial structure:

```text
enterprise-identity-lab/
│
├── apps/
│   ├── api/
│   ├── web/
│   └── identity-provider/
│
├── packages/
│   ├── auth/
│   ├── authorization/
│   ├── database/
│   ├── security/
│   ├── observability/
│   └── shared/
│
├── docs/
│   ├── architecture/
│   ├── authentication/
│   ├── authorization/
│   ├── oidc/
│   ├── saml/
│   ├── scim/
│   ├── webauthn/
│   └── security/
│
├── tests/
│   ├── integration/
│   ├── security/
│   └── e2e/
│
├── docker-compose.yml
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

Start as a modular monolith if that keeps development simpler. Extract components only after you understand the boundaries.

---

# 33. The End State

At the end of the project, you should be able to explain and implement:

```text
Authentication
    ├── Password
    ├── Sessions
    ├── JWT
    ├── MFA
    ├── OIDC
    ├── SAML
    └── Passkeys

Authorization
    ├── RBAC
    ├── Permissions
    ├── Resource authorization
    ├── ABAC
    ├── Policy-based authorization
    └── ReBAC

Identity Lifecycle
    └── SCIM

Security
    ├── Password hashing
    ├── Token security
    ├── Session security
    ├── CSRF
    ├── CORS
    ├── Brute-force protection
    ├── Rate limiting
    ├── Recovery
    └── Audit logging

Enterprise SaaS
    ├── Multi-tenancy
    ├── Teams
    ├── Subscription gating
    ├── SSO
    ├── Provisioning
    └── Tenant isolation
```

The final project should not merely demonstrate that you know the terminology. It should demonstrate that you can **design, implement, secure, test, and explain an enterprise identity and authorization system from first principles**.
