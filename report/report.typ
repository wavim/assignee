#import "@preview/ilm:+1.4.1": *

#show: ilm.with(title: "Assignee", author: "David W")
#show link: underline

= Overview
== Introduction
This report details Assignee, a full-stack web application developed for the ICT SBA task of implementing an assignment
management system.

Items marked with #sym.dagger denote features unimplemented in initial phases, primarily due to lower priority.
Accompanying dagger symbols in subsequent paragraphs provide relevant details where applicable.

Within this chapter, we:

- Outline user capabilities of Assignee,
- Present core design systems guiding later sections,
- Discuss auxiliary systems extending the core functionality,
- Reference materials and validation resources conclude the chapter.

== Capabilities
This section describes user roles in Assignee and their core workflows. It provides a high-level overview, omitting
secondary capabilities (e.g., accessibility features) which are covered in later chapters.

- Role inheritance: $in$
- Role transitions: $arrow$
- Multi transition: $arrow^*$

Where:

- Role inheritance indicates all parent capabilities are available to child
- Role transitions occur when a user performs a certain trigger action

=== User System
Roles: (Visitor, User)

*Visitor*

- Sign in #h(1fr) Visitor $arrow$ User
- Sign up #h(1fr) Visitor $arrow$ User

*User*

- Logout #h(1fr) User $arrow$ Visitor
- Revoke #h(1fr) User $arrow$ Visitor
- Modify email
- Modify password
- Modify display name
- Modify other settings #sym.dagger

The user system forms Assignee's foundation for account management. Key design principles:

+ Email-as-identifier:
  - Uses email addresses as primary identifiers
  - Eliminates need for unique usernames during signup
  - Supports institutional emails (school/corporate domains)
+ Display name flexibility:
  - Users may customize display names post-registration

#sym.dagger
Additional settings are excluded from initial versions because Assignee employs opinionated defaults optimized for core
functionality

=== Team System
Roles: (User, Member, Owner)

*User*

- Create team #h(1fr) User $arrow$ Member
- Accept invite #h(1fr) User $arrow$ Member

*Member* #sym.in User

- Leave team #h(1fr) Member $arrow$ User

*Owner* #sym.in Member

- Disband #h(1fr) Member $arrow^*$ User
- Invite members #h(1fr) User $arrow^*$ Member
- Appoint owners #h(1fr) Member $arrow^*$ Owner
- Dismiss owners #h(1fr) Owner $arrow^*$ Member
- Modify team title
- Modify team description

The team system backs Assignee's flexible group mechanism. Key design principles:

+ Global invitation:
  - Eliminates need for complex authorization
  - Security imposed by rotating unique codes
+ Multiple owners' schema:
  - Eliminates appointment complexity
  - Enables hassle-free role management
+ Team usage flexibility:
  - Promotes creation of scoped small teams
  - Not strictly limited to school assignments

=== Task System
Roles: (Owner, (Member, ) Assignee)

*Owner*

- Create tasks #h(1fr) Member $arrow^*$ Assignee
- Revoke tasks #h(1fr) Assignee $arrow^*$ Member
- Modify instructions
- Attach reference file
- Review submitted file
- Modify feedback comments

*Assignee* #sym.in Member

- Attach work file
- Return submission
- Revoke submission

The task system backs Assignee's powerful assignment features. Key design principles:

+ Atomic task assigning:
  - Promotes small scoped tasks
  - Enables simpler submission review and tracking
+ Task goal flexibility:
  - Allows arbitrary attachment types
  - Suitable for reference and works

== Auxiliary
Apart from the above-mentioned three core systems, the flexibility of design of Assignee allows extending to extra
systems.

For instance:

- Notification channels via Server-Side Polling
- Instant messaging via WebRTC or Web Sockets

#sym.dagger
Side systems remain intentionally undeveloped in initial phases, conserving resources while maintaining straightforward
implementation paths via existing core architecture.

== Resources
The following resources are provided for SBA invigilators' reference and validation purposes.

=== Repository
The complete project is hosted in a repository, accessible at #link(
  "https://github.com/wavim/assignee",
)[Repository] for inspection.

A modular approach ensures clear separation of concerns:

- `report/`: Contains the Typst source for this report
- `site/`: Houses the web application, organized into:
  - `server/`: Application layer
  - `schema/`: Communication layer
  - `client/`: Presentation layer

=== Prebuilt Binary
To accommodate environments without development dependencies, prebuilt archives are available in #link(
  "https://github.com/wavim/assignee/releases",
)[Releases] for invigilators.

To execute the application:

+ Extract the archive to your preferred location
+ Run the prebuilt binary `app.exe` and follow prompts

Database records persist in the `app.db` file.

= Data Layer
Backing the application is a relational database storing user data. This chapter covers the database design rationale
first, followed by implementation details.

Within this chapter, we:

- Detail the design of tables, fields, and data types,
- Rationalize relational mappings between tables,
- Explain the partial adoption of normal forms,
- Conclude with actual implementation details.

Unless specified otherwise, all table fields are ```sql NOT NULL``` to prevent inconsistency, reduce anomalies, and
simplify backend logic.

Since SQLite is adopted for the actual implementation, which employs dynamic typing, field types are described using
generics. Specific data constraints are implemented in the communication layer instead. Besides, note that
```sql INTEGER PRIMARY KEY``` in SQLite implies Auto-Increment.

== User System
Tables:

- `User` user information
- `Pass` user password
- `Sess` user sessions
- `Code` user 2FA codes #sym.dagger
- `Pref` user preferences #sym.dagger

#figure(image("assets/user-system.svg", width: 100%), caption: "User System ERD", placement: bottom)

Relations:

`User` = `Pass` #h(1fr) `1–1`

- User must have one password
- Password belongs to one user

`User` = `Sess` #h(1fr) `1–N`

- User may have many sessions
- Session belongs to one user

`User` = `Code` #sym.dagger #h(1fr) `1–1`

- User may have one code
- Code belongs to one user

`User` = `Pref` #sym.dagger #h(1fr) `1–1`

- User must have one preference's set
- Preference's set belongs to one user

=== User
`uid` #h(1fr) `INTEGER PRIMARY KEY`

Primary key chosen over candidate key (mail) for:

- Indexing speed: Magnitudes faster
- Efficiency: Smaller than text references
- Consistency: Guaranteed uniform values
- Flexibility: Immune to authentication changes

Recurring primary key pattern, omitted elsewhere.

`mail` #h(1fr) `TEXT UNIQUE`

Unique authentication identifier.

`name` #h(1fr) `TEXT`

User-defined display name.

`created/updated` #h(1fr) `DATETIME`

Entry creation/modification timestamps.

Recurring table metadata, omitted elsewhere.

=== Pass
`uid` (=User.uid) #h(1fr) `INTEGER PRIMARY KEY`

Primary key and foreign key. (1:1 user mapping)

`hash/salt` #h(1fr) `BLOB`

Secured credentials storage:

- Hashed via K12 (SHA3 Keccak-p variant, 256-bit digest, parallelism optimal)
- Salted (128-bit CSPRNG)

+ Append CSPRNG salt to key
+ Hash with K12, store digest+salt
+ Verification: Repeat with stored salt

Collision probability $approx 1.5 dot 10^(-31)$ (negligible).

Recurring authentication pattern; omitted elsewhere.

=== Sess
`sid` #h(1fr) `INTEGER PRIMARY KEY`

Primary key.

`uid` (=User.uid) #h(1fr) `INTEGER`

Foreign key. (N:1 user mapping)

`hash/salt` #h(1fr) `BLOB`

+ User authenticated through signin or signup
+ Token generated: sid reversible-hashed with pepper, CSPRNG 256-bit hex key.
+ Bearer token sent to client as cookie with secure configurations.

Authentication flow:

- Search cookie for session bearer token
- Compute sid from hashed ID, loop up session
- If session age passed expiration limit i.e. 1 day:
  - Invalid session, respond with error
- Else:
  - If session age passed rotation limit i.e. 1 hour:
    - Rotate token and return the new token
  - Else:
    - Return original token and authenticate

Cron jobs are run on the server side to periodically remove expired tokens.

Session validity is checked on all API routes to protect Assignee from unauthenticated access.

=== Code
#sym.dagger
Email 2FA omitted to prevent private API key leakage.

`uid` (=User.uid) #h(1fr) `INTEGER PRIMARY KEY`

Primary key and foreign key. (1:1 user mapping)

`hash/salt` #h(1fr) `BLOB`

Secured user 2FA code storage.

=== Pref
#sym.dagger
Not implemented since Assignee is highly opinionated, adds implementation complexity.

`uid` (=User.uid) #h(1fr) `INTEGER PRIMARY KEY`

Primary key and foreign key. (1:1 user mapping)

`data` #h(1fr) `JSON`

Partial settings storage:

- Merged with global defaults
- Only stores user-modified values

Benefits:

+ Defaults flexibility
+ Space efficiency

JSON violates 1NF but enables nested organization (scholars have argued that this may not be a violation since 1NF
allows any self-contained entity).

== Team System
Tables:

- `User` user information
- `Team` team information
- `Invite` team invitation
- `Member` team membership

#figure(image("assets/team-system.svg", width: 100%), caption: "Team System ERD", placement: bottom)

Relations:

`Team` = `Invite` #h(1fr) `1–1`

- Team may have one invitation
- Invite code belongs to one team

`User` = `Member` #h(1fr) `1–N`

- User may have many memberships
- Membership belongs to one user

`Team` = `Member` #h(1fr) `1–N`

- Team may have many memberships
- Membership belongs to one team

=== Team
`tid` #h(1fr) `INTEGER PRIMARY KEY`

Primary key.

`name` #h(1fr) `TEXT`

Owner-defined display name.

`desc` #h(1fr) `TEXT`

Owner-defined team description.

=== Invite
`tid` (=Team.tid) #h(1fr) `INTEGER PRIMARY KEY`

Primary key and foreign key. (1:1 team mapping)

`code` #h(1fr) `BLOB`

Globally unique team invitation code stored as raw binary.

Benefits:

- More straightforward i.e. CSPRNG returns buffer
- Faster than TEXT for query and uniqueness checks

Cron jobs are run on the server side to periodically remove expired tokens.

Invitation codes are validated and rotated with a similar mechanism to session tokens.

=== Member
`uid` (=User.uid) #h(1fr) `INTEGER COMPOSITE KEY`

Composite key and foreign key. (N:1 user mapping)

`tid` (=Team.tid) #h(1fr) `INTEGER COMPOSITE KEY`

Composite key and foreign key. (N:1 team mapping)

`auth` #h(1fr) `BOOLEAN`

If checked, the member would be considered an owner of the team.

Rationale:

- Flexible role management framework
- Eliminates the need for embedding team owner

This flag, and the entry in general, is used in endpoints to ensure authorized access.

== Task System
Tables:

- `User` user information
- `Team` team information
- `Task` task information
- `Work` work information
- `TaskFile` task attachment file
- `WorkFile` work attachment file

#figure(image("assets/task-system1.svg", width: 100%), caption: "Task System ERD (1)", placement: bottom)
#figure(image("assets/task-system2.svg", width: 100%), caption: "Task System ERD (2)", placement: bottom)

Relations:

`Team` = `Task` #h(1fr) `1–N`

- Team may have many tasks
- Task belongs to one team

`Task` = `Work` #h(1fr) `1–N`

- Task may have many works
- Work belongs to one task

`User` = `Work` #h(1fr) `1–N`

- User may have many works
- Work belongs to one user

`Task` = `TaskFile` #h(1fr) `1–1`

- Task may have one attachment
- Attached file belongs to one task

`Work` = `WorkFile` #h(1fr) `1–1`

- Work may have one attachment
- Attached file belongs to one work

=== Task
`aid` #h(1fr) `INTEGER PRIMARY KEY`

Primary key. ('a' for assignment)

`tid` (=Team.tid) #h(1fr) `INTEGER`

Foreign key. (N:1 team mapping)

`name` #h(1fr) `TEXT`

Assigner-defined task name.

`desc` #h(1fr) `TEXT`

Assigner-defined task instructions.

`dead` #h(1fr) `DATETIME`

Assigner-defined task deadline.

=== Work
`sid` #h(1fr) `INTEGER PRIMARY KEY`

Primary key. ('s' for submission)

`uid` (=User.uid) #h(1fr) `INTEGER`

Foreign key. (N:1 user mapping)

`aid` (=Task.aid) #h(1fr) `INTEGER`

Foreign key. (N:1 task mapping)

`done` #h(1fr) `BOOLEAN`

Flag indicating submission status.

`comm` #h(1fr) `TEXT NULLABLE`

Optional feedback comment set by assigner after returning.

=== TaskFile
`aid` (=Task.aid) #h(1fr) `INTEGER PRIMARY KEY`

Primary key and foreign key. (1:1 task mapping)

`name` #h(1fr) `TEXT`

Attachment file name.

`mime` #h(1fr) `TEXT`

Attachment file Multi-purpose Internet Mail Extensions type.

`blob` #h(1fr) `BLOB`

Attachment file raw binary data.

=== WorkFile
`sid` (=Work.sid) #h(1fr) `INTEGER PRIMARY KEY`

Primary key and foreign key. (1:1 work mapping)

`name` #h(1fr) `TEXT`

Attachment file name.

`mime` #h(1fr) `TEXT`

Attachment file Multi-purpose Internet Mail Extensions type.

`blob` #h(1fr) `BLOB`

Attachment file raw binary data.

== Normal Form
Tables satisfy 3NF/4NF (extended normal forms) in general, with practical compromises:

- JSON values (e.g. Pref #sym.dagger): Space efficiency > strict 1NF, debatable violation
- Separate tables (e.g. Pass): Security metadata tracking or flexibility concerns

All exceptions could be justified by performance/maintainability.

== Implementation
The database is implemented in SQLite for:

- Simplicity of setup allowing quick iterations
- Dynamic data typing system easing configuration
- Portability backs prebuilt binaries for reviewers' inspection

=== Indexing
SQLite automatically indexes primary keys and unique fields. The following is manually indexed:

- Foreign keys: For efficient 1-N relational queries
- Composite's subset fields: [B] for composite [A, B], A via prefix-index

Modern DBMS utilizes B-Trees, instead of relying on binary search. B-Trees are self-balancing and the time complexities
for search, insert, and delete are all $O(log(n))$. No re-indexing is required in most cases.

=== Relation Handling
All foreign keys in Assignee are set to `ONUPDATE: RESTRICT, ONDELETE: CASCADE`.

Attempting to update referenced fields would be prohibited; And if the parent entry is deleted, all entries referencing
it would be removed automatically.

= Application Layer
Backing the application logic is an Express.js server leveraging Prisma ORM for type-safe database interactions. This
chapter outlines the architectural design principles first, followed by concrete implementation patterns.

Within this chapter, we:

- Detail Express.js services design, route organization, and middleware stacks,
- Rationalize Prisma’s integration for seamless data access and type safety,
- Address application performance and security considerations,
- Conclude with implementation specifics for portability.

== Framework
The application is implemented in Express.js (Node.js library) instead of PHP servers for:

- Control: Express middleware
- Async I/O: Non-blocking requests
- Full-stack: Shared TypeScript interface
- Ecosystem: Rich tooling (ESLint, Prisma)

Being a superset of JavaScript, TypeScript provides extraordinary static typing. In contrast, PHP is getting obsolete
and has been lacking ecosystem support for several years. JavaScript backed by Google's V8 engine is simply a more
performant and developer-friendly choice.

== Static Resource
Assignee uses a client side router, thus only minimal static asset is served. This includes:

- HTML entry
- Frontend framework JS files
- TailwindCSS compiled stylesheet
- Other assets e.g. fonts

Fonts used by the frontend is self-hosted to reduce reliance on Google Fonts, and potentially improves performance.

Appropriate HTTP Cache-Control header is set to ensure proper static resource caching, flagging assets as immutable.

== DB Integration
Prisma ORM (Object–relational mapping) is used for interacting with the SQLite database. Prisma accepts a schema and
generates database CRUD interaction functions for client usage.

Benefits:

- SQL statement like functions
- Straightforward relational queries
- Sanitization to prevent SQL injection
- Strict typing interfaces for validation

For the application to be portable, the native add-ons used by Prisma must be copied to the output destination to be
linked by packager.

== Services
Services handle different requests by interacting with the database.

For instance:

- Creating a user with the provided data
- Rotating a session and returning token
- Updating a work file with the new payload

The actual authentication logic is also implemented here with cryptography utilities.

== Middleware
Assignee uses a middleware stack to ensure proper authentication and authorization for endpoints, and enforces correct
usage of response headers.

=== Authen
Validates against the cookie from request to see if the user bears a valid session cookie.

=== Member
Validates against the team ID to see if the authenticated user bears a team membership.

=== Assign
Validates against the assignment ID to see if the authenticated user is involved within.

=== CCache
Sets the HTTP Cache-Control header to no-cache for API endpoints, forcing validation.

== Routes
Routers are the primary way we define API endpoints in Express.js for RPC/REST requests. After authentication,
authorization, and validating the payload, corresponding services are called to perform the requested action.

Most endpoints are GET or POST requests, but some are defined to be PUT. Both GET and PUT are assumed to be idempotent
(which means the same request yields the same results) and thus enables better caching. Actions that could not be safely
cached usually goes with the POST method, e.g. authentication.

It is worth noting that although the CCache middleware is used to set Cache-Control to no-cache, it doesn't really mean
to force no caching (which is the case for no-store). Instead, data validity must be checked before proceeding with the
cached asset. This is typically not required for static assets, but inherently important for API endpoints.

Having a global configuration file, there are rate limiters on certain routes such as signin and signup to prevent abuse
and enumeration attacks. The rate limiters are set to use key generators suitable for the case, i.e. email address for
signin/signup, and uses client IP otherwise.

== Deployment
For inspection of invigilators, the Node.js application is bundled and compiled into a prebuilt binary, by packing in
Node.js internals into the single executable.

The server would try to host on 0.0.0.0, which is the reserved wildcard address. It would then resolve to the client's
current IPv4 address, and start Assignee on port 5450 (a number I love personally). All computers in the same LAN would
be able to access the web application.

By correctly configuring path resolution, static files are retrieved inside a virtual file system at runtime, and the
`app.db` file is resolved relative to cwd. This allows database records to be preserved.

= Communication Layer
This is a short chapter on the validation of requests and response between the server and client.

By using TypeScript on backend, a fullstack application allows global TS schema validators. The library used in
Assignee's case is Zod, which adds support for sophisticated runtime type validation.

The rules are used to enforce business rules and maintain data consistency, blocking further actions if failing to parse
payloads. They include:

- Checking for valid email address format
- Checking for password security strength
- Checking for dates earlier than expected

And more. This evens include validating complex data types such as arrays and discriminated object unions.

Schemas are structured by API endpoints for ease of management, e.g. PostTaskRequest, PostTaskResults, validating data
both coming to and from the server, by sharing the Zod schema between the server and client.

Zod schemas fill up the inadequacy of SQLite dynamic data types, and allows even more specific constraints. This ensures
development goes smoothly and different layers agree on the same interface, catching errors early in development.
