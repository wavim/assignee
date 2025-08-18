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

Items marked with #sym.dagger denote features unimplemented in initial versions, primarily due to lower priority.
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
Roles: (User, Member, Admin #sym.dagger, Owner)

*User*

- Create team #h(1fr) User $arrow$ Member

- Accept invite #h(1fr) User $arrow$ Member

*Member* #sym.in User

- Leave team #h(1fr) Member $arrow$ User

*Admin* #sym.in Member

- Invite members #h(1fr) User $arrow^*$ Member

*Owner* #sym.in Admin

- Disband #h(1fr) Member $arrow^*$ User

- Appoint admins #h(1fr) Member $arrow^*$ Admin

- Dismiss admins #h(1fr) Admin $arrow^*$ Member

- Modify team title

- Modify team description

The team system backs Assignee's flexible group mechanism. Key design principles:

+ Global invitation:

  - Join teams via global invitation codes

  - Eliminates need for complex authorization

  - Security imposed by rotating unique codes

+ Team usage flexibility:

  - Promotes creation of scoped small teams

  - Not strictly limited to school assignments

#sym.dagger
Initial versions exclude explicit admin role implementation for faster iterations, though owner retains full
administrative privileges via inheritance. The role schema persists for potential expansion.

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

- Attach submission file

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
Side systems remain intentionally undeveloped in initial releases, conserving resources while maintaining
straightforward implementation paths via existing core architecture.

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

  - `schema/`: Interaction layer

  - `client/`: Presentation layer

=== Prebuilt Binary
To accommodate environments without development dependencies, prebuilt archives are available in #link(
  "https://github.com/wavim/assignee/releases",
)[Releases] for invigilators.

To execute the application:

+ Extract the archive to your preferred location

+ Run the prebuilt binary `app.exe` and follow prompts

Database records persist in the `app.db` file.
