# Webforum: Heck

## Initial Conceptualisation

This document will outline a PEEN (PostgreSQL, Express, EJS, Node.js) webstack website for a discussion forum. I chose PEEN for my familiarity with Relational Databases and DBMSs. Node.js serves as the backbone, while Express simplifies route generation and request handling. EJS was chosen because it offers both flexibility and simplicity for designing web pages. It is reminiscent of PHP, providing seamless document integration while allowing greater control over injection than templating engines like HBS.

There should be tools for automation, i.e. logging access and errors, auto-renewing authentications, assigning usernames based on signed-in users and guests.

### MoSCoW

#### Must:

- Handle user authentication, including sign-in, login/logout, and guest name assignment. Auto-renew authentication tokens within a set timeframe (modifiable only by the webmaster via .env).
- Log user access and errors daily, retaining logs for 14 days.
- Use a PostgreSQL database to manage users, boards, threads, and posts. Moderators can manage user conduct within threads.

#### Should

- Relate posts to threads and users.
- Implement a search function that finds and ranks thread and user matches.

#### Could

- Allow users to add signatures to posts, subject to content policies and moderation.

* Maintain a log of signature changes and notify users of acceptance or rejection.

#### Won't

- No API for external integrations.

### Database

As the driving DB language is PostgreSQL, the database will follow a relational model. I will begin by designing an ERD (entity-relationship diagram), to map out general relationships and entities. After that, I will generate a flatsheet that enumerates each post along with all related details, including the associated thread, board, and user information. This data will then be normalized to 3NF to ensure consistency and reduce redundancy.

3NF is chosen as it normalises the database to a point where transitory keys are considered. The process begins with developing tables in 1NF, ensuring atomicity. Then, relationships and foreign keys are built in 2NF to reduce redundancy. Finally, in 3NF, many-to-many relationships are resolved, and transitory keys are incorporated to ensure data integrity. This level of normalization sufficiently covers the requirements for a basic web forum.

We know some of the entities we will have:

- Posts
- Reactions
- Threads
- Boards
- Users
- Admins
- Reports
- Signature\_Reviews
- Sanctions
- Appeals

#### 0NF

`post_id | thread_name | board_name | post_time | post_message | username | user_email | user_password(hashed) | user_avatar | user_tagline | user_signature | awards` 

This is what I would envision the 0NF of the Database schema to look like. To reduce to 1NF, we need to take all data that can be grouped reasonably into its own table.

#### 1NF

```
posts:
  post_id - serial
  post_message - text
  post_time - datetime
  awards - int (packed int, each award is a bit (on/off) and is pulled from a list defeined by the webmaster as only the webmaster can use it)
  thread_id - foreign key to thread
  user_id - foreign key to user

threads:
  thread_id - serial
  thread_title - text
  thread_update - datetime
  board_id - foreign key to boards

boards:
  board_id - serial
  board_name - text
  board_desc - text

users:
  user_id - serial
  username - text unique
  email - text unique
  password - text (hashed)
  avatar - text
  tagline - text
  signature - text
  
reactions:
  post_id - composite foreign key to posts
  user_id - composite foreign key to users
  reaction_type - enum (like, dislike, etc., dynamically allocated by the webmaster)
```

#### 2NF

```
admins:
  board_id - foreign key to boards
  user_id - foreign key to users
  role - enum (moderator, admin, super-admin)

sanctions:
  sanction_id - serial
  user_id - foreign key to users
  admin_id - foreign key to users (assigned admin)
  sanction_type - enum (timeout, ban, warning)
  related_post_id - foreign key to posts (nullable)
  sanction_reason - text
  sanction_date - timestamp
  expiration_date - timestamp (nullable, for temporary bans)

appeals:
  appeal_id - serial
  sanction_id - foreign key to sanctions
  user_id - foreign key to users (appealing user)
  appeal_text - text
  appeal_status - enum (pending, accepted, rejected)
  appeal_date - timestamp
  reviewed_by - foreign key to admins (nullable)
  decision_date - timestamp (nullable)

reports:
  report_id - serial
  post_id - foreign key to posts
  reported_by - foreign key to users
  report_reason - text
  report_date - timestamp
  report_status - enum (pending, reviewed, resolved, dismissed)
  resolved_by - foreign key to admins (nullable)
  resolution_date - timestamp (nullable)

signature_reviews:
  review_id - serial
  user_id - foreign key to users
  signature_content - text
  review_status - enum (pending, approved, rejected)
  review_date - timestamp
  reviewed_by - foreign key to admins (nullable)
  decision_date - timestamp (nullable)

posts:
  post_id - serial
  post_message - text
  post_time - datetime
  awards - int (packed int, each award is a bit (on/off) and is pulled from a list defeined by the webmaster as only the webmaster can use it)
  thread_id - foreign key to thread
  user_id - foreign key to user

threads:
  thread_id - serial
  thread_title - text
  thread_update - datetime
  board_id - foreign key to boards

boards:
  board_id - serial
  board_name - text
  board_desc - text

users:
  user_id - serial
  username - text unique
  email - text unique
  password - text (hashed)
  avatar - text
  tagline - text
  signature - text
  
reactions:
  post_id - composite foreign key to posts
  user_id - composite foreign key to users
  reaction_type - enum (like, dislike, etc., dynamically allocated by the webmaster)
```

