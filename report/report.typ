#import "@preview/ilm:+1.4.1": *

#show: ilm.with(
  title: "Assignee",
  author: "David W",
)
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
functionality.

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
  - Avoids appointment complexity
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

- Notification channels with long-polling
- Instant messaging via WS or server-sent events (SSE)

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

#figure(image("assets/db/user-system.svg", width: 100%), caption: "User System ERD", placement: bottom)

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

It would not be possible to reconstruct password from hash/salt, thus password reset endpoints must be present.

Recurring authentication pattern; omitted elsewhere.

=== Sess
`sid` #h(1fr) `INTEGER PRIMARY KEY`

Primary key.

`uid` (=User.uid) #h(1fr) `INTEGER`

Foreign key. (N:1 user mapping)

`hash/salt` #h(1fr) `BLOB`

+ User authenticated through signin or signup
+ Token generated: sid reversible-hashed with pepper, CSPRNG 256-bit hex key
+ Bearer token sent to client as cookie with secure configurations

Authentication flow:

- Search cookie for session bearer token
- Compute sid from hashed ID, loop up session
- If session age passed expiration limit (i.e. 1 day):
  - Invalid session, respond with error
- Else:
  - If session age passed rotation limit (i.e. 1 hour):
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

#figure(image("assets/db/team-system.svg", width: 100%), caption: "Team System ERD", placement: bottom)

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

The bytes would be converted to hex as code, this is particularly helpful since it is case-insensitive and hard to
confuse.

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

#figure(image("assets/db/task-system1.svg", width: 100%), caption: "Task System ERD (1)", placement: bottom)
#figure(image("assets/db/task-system2.svg", width: 100%), caption: "Task System ERD (2)", placement: bottom)

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

- JSON values (e.g. Pref #sym.dagger): Space efficiency #sym.gt strict 1NF, debatable violation
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

=== Integrity
All foreign keys in Assignee are set to `ONUPDATE: RESTRICT, ONDELETE: CASCADE` to maintain referential integrity:

- Updating referenced parent fields is prohibited
- Deleting a parent entry would remove all related child entries

=== Views/Triggers
Advanced features like views and trigger are deliberately not implemented. The data layer of Assignee is meant to be
simple yet efficient, thus complex logic is transferred to the application layer instead.

= Application Layer
Backing the application logic is an Express.js server leveraging Prisma ORM for type-safe database interactions. This
chapter outlines the architectural design principles first, followed by concrete implementation patterns.

Within this chapter, we:

- Detail Express.js services design, route organization, and middleware stacks,
- Rationalize Prisma's integration for seamless data access and type safety,
- Address application performance and security considerations,
- Conclude with implementation specifics for portability.

== Framework
The application is implemented in Express.js (Node.js library) instead of PHP servers for:

- Control: Express middleware
- Async I/O: Non-blocking requests
- Full-stack: Shared TypeScript interface
- Ecosystem: Rich tooling (ESLint, Prisma)

Being a superset of JavaScript, using end-to-end TypeScript provides extraordinary static typing. In contrast, PHP is
getting obsolete and has been lacking ecosystem support for several years. JavaScript backed by Google's V8 engine is
simply a more performant and developer-friendly choice.

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

Also, all responses of Express (no matter static or API) are compressed with Brotli for bandwidth and transition
performance.

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

== Quality Assurance
Google Issues is used extensively to enforce HTTP response best practices, including response headers and caching
directives.

== Deployment
For inspection of invigilators, the Node.js application is bundled and compiled into a prebuilt binary, by packing in
Node.js internals into the single executable.

The server would try to host on 0.0.0.0, which is the reserved wildcard address. It would then resolve to the client's
current IPv4 address, and start Assignee on port 5450 (a number I love personally). All computers in the same LAN would
be able to access the web application.

By correctly configuring path resolution, static files are retrieved inside a virtual file system at runtime, and the
`app.db` file is resolved relative to CWD. This allows database records to be preserved.

= Communication Layer
This is a short chapter on the validation of requests and response between the server and client.

By using TypeScript for backend, a full-stack application allows global TS schema validators. The library used in
Assignee's case is Zod, which adds support for sophisticated runtime type validation.

The rules are used to enforce business rules and maintain data consistency, blocking further actions if failing to parse
payloads. They include:

- Checking for valid email address format
- Checking for password security strength
- Checking for dates earlier than expected

And more. These evens include validating complex data types such as arrays and discriminated object unions.

Schemas are structured by API endpoints for ease of management, e.g. PostTaskRequest, PostTaskResults, validating data
both coming to and from the server, by sharing the Zod schema between the server and client.

Zod schemas fill up the inadequacy of SQLite dynamic data types, and allows even more specific constraints. This ensures
development goes smoothly, and different layers agree on the same interface, catching errors early in development.

== Reference
Please refer to the repository source code for details on schemas. The code is meant to be self-documenting, and would
not be hard to interpret after having a rough understanding of the site after reading this report.

= Presentation Layer
The essence of an application is the interface that presents data to users. This chapter covers the frontend website
design first, followed by implementation details.

Within this chapter, we:

- Detail the philosophy of theme, palette, and font,
- Demonstrate the landing pages and the application,
- Detail the accessibility options of the application,
- Detail user experience and mobile-friendliness,
- Conclude with actual implementation details.

== Philosophy
Essence, Clarity, Calm

Assignee is a deliberate rebellion against digital noise. It champions radical simplicity, cognitive ease, and
undistracted focus to transform task management into a serene, intentional ritual.

Inspired by the tactile honesty of paper and the precision of modernist typography, every element serves a
purpose—nothing more, nothing less.

=== Palette
Assignee uses a neutral palette carefully crafted by expert designers. The theme colors bear OKLCH values with zero
chroma and hue, only varying the lightness.

#figure(image("assets/theme/palette.png", width: 100%), caption: "Neutral Palette", gap: .5cm)

Employing a neutral palette within a minimalist website design is fundamentally driven by the core principle of
intentional reduction. Colors like whites, grays, beiges, and blacks inherently possess low chromatic distraction,
allowing the essential elements to command attention without visual competition.

This absence of strong color saturation minimizes cognitive load for the user, fostering a sense of calm, clarity, and
sophistication. Furthermore, a neutral foundation enhances readability, promotes timelessness over fleeting trends, and
creates a sense of spaciousness and order that aligns perfectly with minimalist goals of focusing purely on essential
content and user experience.

=== Font Face
Assignee uses Plus Jakarta Sans as the sole typeface, directly reinforces the core values of elegance, timelessness, and
superior legibility. Its clean, geometric structure embodies elegance through balanced letterforms with subtle,
sophisticated details, avoiding sterility while maintaining refined simplicity.

#figure(image("assets/theme/jakarta.png", width: 100%), caption: "Plus Jakarta Sans", gap: .5cm)

This elegance complements a neutral palette, ensuring typography becomes a harmonious element of the aesthetic rather
than a distraction. The font's timelessness stems from its blend of contemporary clarity and humanist proportions,
ensuring relevance and sophistication for years, much like the neutral backdrop it sits upon.

Most critically, Plus Jakarta Sans excels in legibility: its generous x-height, clear letter differentiation, and
well-considered spacing optimize readability across devices and sizes, reducing user strain and ensuring content remains
effortlessly accessible.

=== Logo Design
Assignee uses a logo directly referencing its name.

#figure(image("assets/theme/logo.png", width: 25%), caption: "Assignee Logo", gap: .5cm)

The *ΔSSIGNEE* logo embodies minimalist principles through potent symbolism and intentional restraint. The delta (Δ)
serves a dual function: its sharp, geometric form acts as a pen tip, instantly evoking the core action of assignment,
and injects dynamism into the neutral "paper-like" backdrop, while also representing the letter "A", an elegant,
efficient integration of brand identity.

It achieves essential harmony: the precision of the delta anchors the word mark, while the neutrality ensures both
symbol and text remain crisp, uncluttered, and effortlessly comprehensible. Ultimately, the logo exemplifies minimalist
power: using fundamental forms like geometric symbols and clear letterforms, to communicate core purpose with timeless
elegance.

== Demonstration
=== Hero Section
The landing page starts with the hero section. A compelling hero section serves as the immediate visual and functional
gateway to the platform's purpose. This section bridges elegance and utility—leveraging minimalist principles to reduce
cognitive load while using asymmetry to create movement, making the interface feel alive and intentional from the first
glance.

The strategic use of Bauhaus L Fade tiles as section separator embodies a functional asymmetry that energizes the
minimalist framework while honoring modernist principles of dynamic composition, creating deliberate visual tension
against the neutral backdrop. Their asymmetry prevents rigid predictability without overwhelming users.

#figure(image("assets/demo/hero.png", width: 50%), caption: "Hero Section", gap: .5cm)
#figure(image("assets/demo/hero.md.png", width: 100%), caption: "Hero Section
MD Variant", gap: .5cm)

Uncompromising geometry of interlocking squares and triangles structure the interface: they anchor content zones, guide
the eye toward the critical action, and partition whitespace with rhythmic tension. It also acts as a dynamic visual
threshold, using sharp angles and staggered collisions to signal transition without disruption.

In larger screens, these tiles recede entirely, allowing the hero to expand edge-to-edge, signifying the presence of
space and forces focus.

=== Header
#figure(image("assets/demo/scroll.png", width: 50%), caption: "Header Scrolled", gap: .5cm)
#figure(image("assets/demo/scroll.md.png", width: 100%), caption: "Header Scrolled
MD Variant", gap: .5cm)

The header's transformative scroll behavior embodies minimalist utility through adaptive elegance. Initially transparent
and embedded within the hero's natural flow, it avoids visual imposition. As scrolling commences, it transitions into a
subtle overlay with soft elevation shadow, signaling a shift from introduction to action.

=== Features Section
Following the hero, the features section leverages medium-screen asymmetry through a purposeful split: a persistent
"Features" anchor sticks rigidly to the left viewport edge, while feature details scroll independently on the right.

This creates a content-rich rhythm: the anchored text acts as both a minimalist compass orienting users within the page,
and a structural counterweight to the dynamic content flow. Meanwhile, the right side's scrollable column allows
features to unfold with breathing room, ensuring no pixel is wasted.

#figure(image("assets/demo/feat.png", width: 50%), caption: "Features Section", gap: .5cm)
#figure(image("assets/demo/feat.md.png", width: 100%), caption: "Features Section
MD Variant", gap: .5cm)

=== Call To Action
The landing page ends with a Call-to-Action section, deliberately mirrors the hero's text positioning and spatial logic,
creating rhythmic closure that bookends the user journey with purposeful familiarity.

Its mirrored structure triggering subconscious recognition while amplifying urgency. By echoing the hero's architecture,
the CTA transforms functional symmetry into psychological momentum: a final, frictionless pivot from exploration to
commitment.

Symmetry, Asymmetry. Rigid structural symmetry beneath the surface enables bold asymmetric expression in Assignee's
visual language. Where symmetry whispers order, asymmetry shouts intention, together creating an experience that feels
simultaneously anchored and alive. Every imbalance is calculated, every fracture purposeful, and every pixel a testament
to minimalist discipline wielded with avant-garde audacity.

Did this beautiful philosophy not reign the grounds of Assignee?

#figure(image("assets/demo/ctoa.png", width: 50%), caption: "Features Section", gap: .5cm)
#figure(image("assets/demo/ctoa.md.png", width: 100%), caption: "Features Section
MD Variant", gap: .5cm)

=== Footer
The footer embodies a subtle logo paired with a clean copyright linking to my GitHub. No dividers, no social icons, no
excess: just geometric purity and creator credit on a neutral canvas. What a final whisper of a system where every
element serves purpose?

=== Signin/Signup
#figure(image("assets/demo/signer.png", width: 50%), caption: "Dynamic Signer", gap: .5cm)

Two fields, one button. No extras. Assignee strips authentication to its essence. Task clarity through disciplined
design. The asymmetry is quiet, the palette calm, the interaction profound in its simplicity: a silent handshake between
human and machine.

Placeholders shift to titles as one inputs, preserving context without cluttering the input zone. The asymmetry of
moving labels against static fields creates kinetic hierarchy, providing the user generous interaction feedback.

The sole button transcends static labeling through adaptive text. Morphing dynamically to error messages, Assignee turns
a button into a self-contained dialogue, eliminating pop-ups that disrupt flow: errors resolve within the element.

Only signin could be reached via the landing page, with signup accessible through it. Burying signup within the signin
flow isn't a hidden feature, it's a strategic reduction of decision fatigue. One problem, one solution.

#figure(image("assets/demo/signer.md.png", width: 100%), caption: "Dynamic Signer
MD Variant", gap: .5cm)

In fact, all visible ASCII characters (and space `\x20`) are allowed characters in the password. This increases entropy
and enhances security. This also aligns well with modern password managers.

=== Not Found
A generous 404 page is also implemented just in case users get lost (unlikely!)

Maybe, umm, try to navigate back to the landing page by clicking on that button...?

#figure(image("assets/demo/e404.md.png", width: 100%), caption: "Not Found
MD Variant", gap: .5cm)

=== Dashboard/Teams/Tasks

#figure(image("assets/demo/dash.md.png", width: 100%), caption: "Dashboard, Teams
MD Variant", gap: .5cm)

The dashboard elegantly weaponizes negative space, transforming emptiness into focused potential. Below the welcome
prompt, the two action button set up a dynamic duo, pairing primary action and secondary action with asymmetry.

The emptiness is the metaphor: a pristine workspace awaiting action.

#figure(image("assets/demo/create.md.png", width: 100%), caption: "Dashboard, Create Team
MD Variant", gap: .5cm)

Subtle shadows below the overlay and the backdrop blur gives a sense of elevation, directing users to focus on the
immediate action.

#figure(image("assets/demo/team.md.png", width: 100%), caption: "Team Hub
MD Variant", gap: .5cm)

#figure(image("assets/demo/teams.md.png", width: 100%), caption: "Dashboard, Teams
MD Variant", gap: .5cm)

Cards flow in staggered columns, offset by deliberate white-space intervals. Hairline strokes with subtle radii soften
combine to form gentle card edges.

By treating every stroke, curve, and alignment as deliberate concessions to human perception, the dashboard transcends
utility to sanctuary.

#figure(image("assets/demo/accept.png", width: 50%), caption: "Dashboard, Accept Invite
MD Variant", gap: .5cm)

Embrace invitations via generous modal prompts. Enter code, done. Team invitation at its simplest, takes you to the team
hub without needing manual actions.

Team owner? Assign tasks through the simplest modal interface. Modals aren't interruptions, they are graceful extensions
of the workflow, designed with monastic restraint and geometric intentionality. When invoking task assignment, the modal
emerges not as a layer, but as a focused thought.

Click, click, done. Sensible defaults are already set for comment use cases. Autocompletion had never been so
convenient. That being said, Assignee forces the presence of task instructions (also team description), to ease the
experience of not only one, but everyone.

The team invitation code would be immediately visible to team owners on the right end of the team banner.

#figure(image("assets/demo/assign.md.png", width: 100%), caption: "Team, Assign
MD Variant", gap: .5cm)

Both team IDs and task IDs are reversible-hashed with pepper to prevent database data leakage, similar to hashed session
IDs in bearer tokens.

- Easily update task reference file through the task overview
- Easily track member submission status
- Easily contact members who haven't finished yet via email (I'm sorry)

#figure(image("assets/demo/task.md.png", width: 100%), caption: "Task Overview
MD Variant", gap: .5cm)

#figure(image("assets/demo/work.md.png", width: 100%), caption: "Submissions
MD Variant", gap: .5cm)

Review members' work with unparalleled ease. Download work attachment for review (if any), and optionally provide
encouraging feedback via comments.

#figure(image("assets/demo/tasks.md.png", width: 100%), caption: "Dashboard, Tasks
MD Variant", gap: .5cm)

Track assignments simply in the integrated dashboard. Filter by completion status, and search with name, team, or
description (typos taken into consideration).

#figure(image("assets/demo/ttasks.md.png", width: 100%), caption: "Team Hub, Tasks
MD Variant", gap: .5cm)

Equivalently in the team hub. Team owners will not see the filter. Instead, they would be able to peek over tasks'
current submission count.

== Responsive Design
Assignee is fully responsive to different screen sizes. This is achieved through TailwindCSS `md:` media width
breakpoint.

Notice that demonstration images provided in the last section may come with an "MD Variant" postfix. This is because
Assignee's styling is mobile-first, since the majority of Internet users nowadays are mobile users.

Refer to the previous section for examples (compare non-MD and MD variants). Apart from apparent UI changes, Assignee is
also mobile user interface friendly, optimizing UX for hassle-free mobile usage.

A deliberate decision has been made to forgo the implementation of dedicated print variants. The rationale is grounded
in several key considerations. The primary use case of a dynamic task assignment site resides inherently within its
digital, interactive environment. User workflows center on real-time viewing, updating, and managing tasks directly
within the application interface. The fundamental nature of the content possesses low inherent value in a static,
printed format, which cannot reflect real-time updates or enable interaction.

== Accessibility
Assignee provides numerous accessibility options to align with web standards.

(Default #sym.tiny)

Font size
- Small
- Medium #sym.tiny
- Large
Language
- System #sym.tiny
- English
- 中文(繁)
Color theme
- System #sym.tiny
- Light
- Dark
Motion effects
- System #sym.tiny
- On
- Off

The options are configurable through the iconic accessibility button (blue man), which is present on all pages. The
configuration would be stored in local storage, allowing it to be persisted over sessions.

#figure(image("assets/demo/a11y.md.png", width: 100%), caption: "Accessibility
MD Variant", gap: .5cm)

Although the options are fully interoperable with each other and plays well with responsive design (128 combinations),
only a selected few could be demonstrated here to compact the report (mobile screenshots' aspect ratio would take up too
many space).

#figure(image("assets/demo/fontl.md.png", width: 100%), caption: "Accessibility, Font Large
MD Variant", gap: .5cm)

#figure(image("assets/demo/langzh.md.png", width: 100%), caption: "Accessibility, Lang 中文(繁)
MD Variant", gap: .5cm)

In fact, even date, time, hidden accessibility ARIA labels, would be translated to the specified locale. Translation is
implemented everywhere across the application, not just specific parts. Doesn't rely on machine translate, localization
is done by me manually to ensure conciseness (a lot of work...).

#figure(image("assets/demo/dark.md.png", width: 100%), caption: "Accessibility, Dark Mode
MD Variant", gap: .5cm)

Dark mode is achieved through global theme variable declaration in TailwindCSS, all colors in both themes are carefully
curated by me manually to ensure contrast.

Reduce motion cannot be demonstrated directly, in words: it disables scroll smoothing, scroll-triggered animations, and
CSS interaction-triggered transitions.

Apart from the aforementioned options, other practices are also implemented to ensure maximum accessibility.

This includes:

- Including ARIA labels for non-text components
- Separate signin/up pages to avoid confusing password managers
- Keyboard navigation support e.g. Esc to close modal, Tab to inputs
- Ensuring theme colors bear enough contrast (WCAG AAA compliance)
- Following form accessibility guidelines e.g. autocomplete, spellcheck, labels
- Using appropriate semantic elements to define content type e.g. ```html <header>, <footer>, <search>```

Together, Assignee helps to build a web accessible to everyone.

== Implementation
The frontend is implemented in TypeScript with the SolidJS framework, bundling with Vite.

Benefits:

- Simple JSX component reuse
- Reactive component updates
- Performant element renderer

Client-side page routing is implemented with SolidJS/router.

The styling is done primarily through TailwindCSS, which compiles inline classes into corresponding CSS statements,
simplifying style reuse and reduces output CSS size. (e.g. `h-4` #sym.arrow ```css { height: 1rem }```).

Note the usage of relative EM units (and dynamic viewport units). They are used instead of absolute units to ensure
style consistency, and backed the font size accessibility option.

Some subtle animations (header on scroll) are created with GSAP, a sophisticated animation platform featuring a scroll
trigger.

Smooth scrolling of the webpage is enabled by Lenis, a lightweight scroll-smoother library.

Fetching data from the backend is done via Axios, enabling async I/O operations with automatic request header
configuration.

=== Media
The deliberate use of minimal black and white SVGs within Assignee is a design rooted in essentialism and sophisticated
clarity. The scalability and crisp precision of SVGs ensure icons and graphic elements remain sharp and adaptable at any
size, perfectly complementing the clean lines and uncluttered spaces inherent in minimalism. It embodies functional
elegance, enhancing readability, ensuring timelessness, and improves load times, resulting in an experience that feels
both refined and effortlessly intuitive.

All SVGs used in Assignee are available under public domain from SVG Repo.

=== Performance
SolidJS is one of the most performant frontend libraries currently available. But to deliver maximum application
performance, the application is bundled, tree-shaked, and minified. Certain assets are externalized to enable better
static resource caching.

=== Quality Assurance
Google Issues and Lighthouse are used extensively to enforce web best practices. This includes loading speed, contentful
paint (FCP/LCP), and accessibility.

By reducing load times and network dependency chain, speeding up initial rendering, Assignee delivers the best level of
user satisfaction and engagement.

= Credits
The success of Assignee relied heavily on the extensive use of ecosystem tools. While only a fraction are listed here,
it's important to acknowledge that even a quarter of them couldn't be fully covered.

Items marked with #sym.tiny are written by myself.

== Core
- #link("https://git-scm.com")[Git]
- #link("https://github.com")[GitHub]
- #link("https://code.visualstudio.com")[VSCode]
- #link("https://github.com/vivaxy/vscode-conventional-commits")[Conventional Commits]
- #link("https://pnpm.io")[PNPM]
- #link("https://www.typescriptlang.org")[TypeScript]
- #link("https://eslint.org")[ESLint]
- #link("https://prettier.io")[Prettier]
- #link("https://github.com/typicode/husky")[Husky]
- #link("https://github.com/okonet/lint-staged")[Lint Staged]
- #link("https://github.com/catppuccin/vscode")[Catppuccin]
- #link("https://github.com/wavim/vscode-alt-delete")[Alt Delete] #sym.tiny
- #link("https://github.com/wavim/vscode-istrainless")[IstrainLess] #sym.tiny
- #link("https://github.com/wavim/vscode-git-branch")[Git Branch] #sym.tiny
- #link("https://github.com/wavim/vscode-better-memo")[Better Memo] #sym.tiny

== DBMS
- #link("https://www.sqlite.org")[SQLite]
- #link("https://sqlitestudio.pl")[SQLite Studio]
- #link("https://www.dbvis.com")[DB Visualizer]

== Server
- #link("https://nodejs.org")[Node.js]
- #link("https://www.prisma.io")[Prisma]
- #link("https://expressjs.com")[Express.js]
- #link("https://github.com/expressjs/compression")[Compression]
- #link("https://github.com/express-rate-limit/express-rate-limit")[Express Rate Limit]
- #link("https://github.com/expressjs/multer")[Multer]
- #link("https://hashids.org")[HashIDs]
- #link("https://github.com/paulmillr/noble-hashes")[Noble Hashes]
- #link("https://github.com/wavim/http-error")[HTTP Error] #sym.tiny
- #link("https://github.com/privatenumber/tsx")[TSX]
- #link("https://github.com/davglass/cpr")[CPR]
- #link("https://github.com/yao-pkg/pkg")[PKG]
- #link("https://developer.chrome.com/docs/devtools/issues")[Google Issues]

== Schema
- #link("https://github.com/colinhacks/zod")[Zod]
- #link("https://github.com/rollup/rollup")[Rollup]

== Design
- #link("https://www.svgrepo.com")[SVG Repo]
- #link("https://www.siteinspire.com")[Site Inspire]
- #link("https://patternpad.com")[Pattern Pad]
- #link("https://fonts.google.com")[Google Fonts]
- #link("https://github.com/tokotype/PlusJakartaSans")[Plus Jakarta Sans]
- #link("https://webaim.org/resources/contrastchecker")[WebAIM Contrast Checker]

== Client
- #link("https://vitejs.dev")[Vite]
- #link("https://solidjs.com")[SolidJS]
- #link("https://github.com/solidjs/solid-router")[Solid Router]
- #link("https://github.com/solidjs-community/solid-primitives/tree/main/packages/i18n")[Solid I18n]
- #link("https://github.com/wavim/solid-filter")[Solid Filter] #sym.tiny
- #link("https://tailwindcss.com")[TailwindCSS]
- #link("https://github.com/lukeed/clsx")[CLSX]
- #link("https://github.com/darkroomengineering/lenis")[Lenis]
- #link("https://greensock.com/gsap")[GSAP]
- #link("https://github.com/aceakash/string-similarity")[String Similarity]
- #link("https://github.com/wavim/vscode-wrap-jsx")[Wrap JSX] #sym.tiny
- #link("https://github.com/wavim/gfont-loader")[GFont Loader] #sym.tiny
- #link("https://github.com/wavim/omnires")[Omnires] #sym.tiny
- #link("https://github.com/wavim/natural-log")[Natural Log] #sym.tiny
- #link("https://developer.chrome.com/docs/lighthouse")[Lighthouse]
- #link("https://developer.chrome.com/docs/devtools/issues")[Google Issues]

== Report
- #link("https://www.latex-project.org")[LaTeX]
- #link("https://typst.app")[Typst]
- #link("https://github.com/Myriad-Dreamin/tinymist")[Tiny Mist]
- #link("https://github.com/ltex-plus/vscode-ltex-plus")[LTeX+]
- #link("https://github.com/tomoki1207/vscode-pdfviewer")[PDF Viewer]

While only a selection is mentioned here, I am deeply grateful for the entire ecosystem that made Assignee possible.

= Final Remarks
This report reflects original research, analysis, and insights. While generative AI tools were selectively used to
enhance the clarity of this report, all core ideas, findings, and conclusions remain the product of human effort.

In the AI-augmented era, I have taken care to uphold academic and professional integrity throughout this work, by
acknowledging how to use AI tools responsibly.

As I wrap up this report, I extend my thanks to the many tools, contributors, and collaborators who made Assignee a
reality. I want to affirm my commitment to respecting intellectual property and licensing rights. In an era of boundless
digital collaboration, we believe progress thrives when credit is given fairly, and innovation is built responsibly.
