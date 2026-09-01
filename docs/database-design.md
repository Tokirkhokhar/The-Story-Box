# The Story Box — Database Design Specification

**Document:** `docs/database-design.md`  
**Status:** Draft — for review  
**Database:** PostgreSQL  
**ORM:** TypeORM  
**Primary Key Standard:** Prefixed UUID

---

## 1. Purpose

This document is the database-design specification for The Story Box.

It is derived from the approved product scope and the entity decisions made during the Phase 1 design process.

The database will be designed first at the domain/schema level. PostgreSQL migrations and TypeORM entities will be created only after the relevant Phase 1 entities and relationships are reviewed and frozen.

---

## 2. Design Principles

### 2.1 UUID Primary Keys

All application entities will use prefixed UUID-based primary keys.

Conceptual standard:

```text
id = <entity_prefix>_<uuid>
```

This is a project-wide convention and will also apply to future modules.

### 2.2 Database as the Source of Truth

PostgreSQL is the primary source of truth for application data.

NestJS owns business logic, validation, application workflows, and database access through TypeORM.

React is the presentation layer.

### 2.3 Catalog and Commercial Data Separation

The `Book` entity represents the bibliographic/catalog identity of a book.

Commercial and operational concerns such as inventory, warehouse stock, reservations, sales, offers, and orders must not be unnecessarily mixed into the Book entity.

### 2.4 Normalized Relationships

Do not store relational IDs as arrays when a proper relationship can be modeled.

Examples:

```text
Book
  ↕
BookAuthor
  ↕
Author
```

```text
Book
  ↕
BookCategory
  ↕
Category
```

```text
Book
  ↓
BookMedia
  ↓
Media
```

### 2.5 Source and Import Traceability

Because the catalog will be populated through scraping and bulk imports, source information must be retained so imported records can be traced and deduplicated.

---

## 2.6 Prefixed UUID Primary Keys

All application entities will use UUID-based primary keys with a short entity-specific prefix.

Examples:

```text
Book       → bk_<uuid>
Author     → au_<uuid>
Publisher  → pub_<uuid>
Category   → cat_<uuid>
Language   → lang_<uuid>
Media      → med_<uuid>
Warehouse  → wh_<uuid>
Inventory  → inv_<uuid>
```

The prefix makes identifiers easier to recognize in logs, API responses, debugging, imports, and database operations.

### Implementation approach

The ID generation should be centralized rather than implemented separately in every entity.

NestJS/TypeORM entities should extend a common base entity, for example:

```text
BaseEntity
├── id
├── createdAt
├── updatedAt
├── createdBy
├── updatedBy
└── deletedAt
```

The base entity will provide the common UUID generation mechanism, while each concrete entity supplies its own short prefix.

Conceptually:

```text
BaseEntity
      ↓
Book extends BaseEntity
      ↓
bk_<uuid>

Author extends BaseEntity
      ↓
au_<uuid>

Publisher extends BaseEntity
      ↓
pub_<uuid>
```

The exact TypeORM implementation (entity hooks, subscribers, transformer, or another centralized mechanism) will be finalized during implementation.

### Important database consideration

A prefixed UUID such as `bk_<uuid>` is no longer a native PostgreSQL `uuid` value. Therefore, the physical primary-key column should be evaluated as a string-compatible type such as `VARCHAR`/`TEXT`, while the UUID portion remains generated using PostgreSQL/Node UUID facilities.

Foreign keys must use the same identifier type as their referenced primary keys.

The prefix is an application/database identifier convention, not a replacement for UUID uniqueness.

---

# 3. Phase 1 Database Modules

The approved initial modules are:

```text
Authentication
Users

Catalog
├── Books
├── Authors
├── BookAuthor
├── Categories
├── BookCategory
├── Languages
├── Publishers
├── Media
└── BookMedia

Inventory
├── Warehouses
├── Inventory
└── InventoryTransactions
```

The immediate database-first milestone is the Catalog module and its bulk-import foundation.

---

# 4. Entity: Book

## Purpose

`Book` is the central catalog entity.

It represents the bibliographic identity of a book independently of its inventory or sales state.

## Phase 1 Fields

### Identity

| Field | PostgreSQL Type | Required | Notes |
|---|---|---:|---|
| id | UUID | Yes | Primary key |
| title | VARCHAR(500) | Yes | Main title |
| subtitle | VARCHAR(500) | No | Subtitle |
| slug | VARCHAR(600) | Yes | Auto-generated, unique |

### Description

| Field | PostgreSQL Type | Required |
|---|---|---:|
| shortDescription | TEXT | No |
| description | TEXT | No |

### Publication

| Field | PostgreSQL Type | Required |
|---|---|---:|
| isbn10 | VARCHAR(20) | No |
| isbn13 | VARCHAR(20) | No |
| edition | VARCHAR(100) | No |
| publicationDate | DATE | No |
| pages | INTEGER | No |

`edition` is intentionally VARCHAR rather than PostgreSQL ENUM so publisher-provided values can evolve without schema migrations.

### Relationships

| Field | Relationship |
|---|---|
| publisherId | FK → Publisher |
| languageId | FK → Language |

Authors, categories, and media are represented through dedicated relationship entities.

### Source / Import

| Field | PostgreSQL Type |
|---|---|
| source | VARCHAR(100) |
| sourceBookId | VARCHAR(255) |
| sourceUrl | TEXT |
| importedAt | TIMESTAMP |

### Import Status

| Field | PostgreSQL Type |
|---|---|
| importStatus | VARCHAR / controlled value |

Initial values:

```text
SCRAPED
VALIDATED
IMPORTED
REJECTED
```

### Publishing

| Field | PostgreSQL Type |
|---|---|
| status | VARCHAR / controlled value |
| isActive | BOOLEAN |

Initial status values:

```text
DRAFT
UNDER_REVIEW
PUBLISHED
ARCHIVED
```

### Metadata

| Field | PostgreSQL Type |
|---|---|
| metadata | JSONB |

This allows source-specific metadata to be retained without repeatedly changing the core schema.

### Audit

| Field | PostgreSQL Type |
|---|---|
| createdAt | TIMESTAMP |
| updatedAt | TIMESTAMP |
| createdBy | UUID |
| updatedBy | UUID |
| deletedAt | TIMESTAMP NULL |

---

# 5. Entity: Author

## Purpose

Represents a reusable author record.

One author can be associated with many books, and one book can have multiple authors.

## Phase 1 Fields

### Identity

| Field | PostgreSQL Type | Required |
|---|---|---:|
| id | UUID | Yes |
| fullName | VARCHAR(255) | Yes |
| slug | VARCHAR(300) | Yes |

### Profile

| Field | PostgreSQL Type |
|---|---|
| biography | TEXT |
| birthDate | DATE |
| deathDate | DATE |
| profileImage | TEXT |
| website | TEXT |
| nationality | VARCHAR(100) |
| gender | VARCHAR(50) |

### Professional Information

| Field | PostgreSQL Type |
|---|---|
| awards | TEXT |
| socialLinks | JSONB |

### Source / Import

| Field | PostgreSQL Type |
|---|---|
| source | VARCHAR(100) |
| sourceAuthorId | VARCHAR(255) |
| sourceUrl | TEXT |
| importedAt | TIMESTAMP |

### Publishing

| Field | PostgreSQL Type |
|---|---|
| status | VARCHAR(30) |
| isActive | BOOLEAN |

Initial status values:

```text
DRAFT
UNDER_REVIEW
PUBLISHED
ARCHIVED
```

### Metadata

`metadata JSONB`

### Audit

```text
createdAt
updatedAt
createdBy
updatedBy
deletedAt
```

---

# 6. Entity: BookAuthor

## Purpose

Junction entity connecting Books and Authors.

## Fields

| Field | PostgreSQL Type | Required |
|---|---|---:|
| id | UUID | Yes |
| bookId | UUID | Yes |
| authorId | UUID | Yes |
| role | VARCHAR(30) | Yes |
| displayOrder | INTEGER | Yes |
| createdAt | TIMESTAMP | Yes |

Initial roles:

```text
AUTHOR
CO_AUTHOR
EDITOR
TRANSLATOR
ILLUSTRATOR
```

Relationship:

```text
Book 1 ─── N BookAuthor N ─── 1 Author
```

A unique constraint should prevent the same author from being attached to the same book more than once for the same relationship.

---

# 7. Entity: Publisher

## Purpose

Represents a reusable publisher organization.

One publisher can publish many books.

## Fields

| Field | PostgreSQL Type | Required |
|---|---|---:|
| id | UUID | Yes |
| name | VARCHAR(255) | Yes |
| slug | VARCHAR(300) | Yes |
| description | TEXT | No |
| logo | TEXT | No |
| website | TEXT | No |
| email | VARCHAR(255) | No |
| phone | VARCHAR(50) | No |
| address | TEXT | No |
| country | VARCHAR(100) | No |
| foundedYear | INTEGER | No |
| publisherType | VARCHAR(30) | No |
| source | VARCHAR(100) | No |
| sourcePublisherId | VARCHAR(255) | No |
| sourceUrl | TEXT | No |
| importedAt | TIMESTAMP | No |
| status | VARCHAR(30) | Yes |
| isActive | BOOLEAN | Yes |
| metadata | JSONB | No |
| createdAt | TIMESTAMP | Yes |
| updatedAt | TIMESTAMP | Yes |
| createdBy | UUID | No |
| updatedBy | UUID | No |
| deletedAt | TIMESTAMP | No |

Relationship:

```text
Publisher 1 ─── N Book
```

---

# 8. Entity: Language

## Purpose

Maintain controlled language values used by books.

## Proposed Phase 1 Fields

| Field | PostgreSQL Type | Required | Notes |
|---|---|---:|---|
| id | UUID | Yes | Primary key |
| name | VARCHAR(100) | Yes | Display name |
| code | VARCHAR(10) | Yes | Standardized language code |
| isActive | BOOLEAN | Yes | Availability |
| createdAt | TIMESTAMP | Yes | Audit |
| updatedAt | TIMESTAMP | Yes | Audit |
| createdBy | UUID | No | Audit |
| updatedBy | UUID | No | Audit |
| deletedAt | TIMESTAMP | No | Soft delete |

Relationship:

```text
Language 1 ─── N Book
```

---

# 9. Entity: Category

## Purpose

Classify books for catalogue navigation, filtering, discovery, and future customer experiences.

## Proposed Phase 1 Fields

| Field | PostgreSQL Type | Required |
|---|---|---:|
| id | UUID | Yes |
| name | VARCHAR(255) | Yes |
| slug | VARCHAR(300) | Yes |
| parentId | UUID | No |
| description | TEXT | No |
| isActive | BOOLEAN | Yes |
| createdAt | TIMESTAMP | Yes |
| updatedAt | TIMESTAMP | Yes |
| createdBy | UUID | No |
| updatedBy | UUID | No |
| deletedAt | TIMESTAMP | No |

`parentId` is a self-reference:

```text
Category
   │
   └── parentCategory
```

Example:

```text
Kids
├── Story Books
├── Activity Books
└── Board Books
```

---

# 10. Entity: BookCategory

## Purpose

Junction entity connecting Books and Categories.

## Fields

| Field | PostgreSQL Type | Required |
|---|---|---:|
| id | UUID | Yes |
| bookId | UUID | Yes |
| categoryId | UUID | Yes |
| createdAt | TIMESTAMP | Yes |

Relationship:

```text
Book 1 ─── N BookCategory N ─── 1 Category
```

A unique constraint should prevent duplicate Book/Category relationships.

---

# 11. Entity: Media

## Purpose

Provide a reusable digital-asset system.

The Media entity is not limited to book images. It should eventually support:

- Book covers
- Book previews
- Author profile images
- Publisher logos
- Category assets
- Event banners
- Box images
- Marketing assets
- Website assets

## Proposed Phase 1 Fields

| Field | PostgreSQL Type | Required |
|---|---|---:|
| id | UUID | Yes |
| fileName | VARCHAR(255) | Yes |
| originalFileName | VARCHAR(255) | No |
| mimeType | VARCHAR(100) | Yes |
| extension | VARCHAR(20) | No |
| size | BIGINT | No |
| storageProvider | VARCHAR(50) | Yes |
| storageKey | TEXT | No |
| publicUrl | TEXT | Yes |
| width | INTEGER | No |
| height | INTEGER | No |
| altText | VARCHAR(500) | No |
| caption | TEXT | No |
| source | VARCHAR(100) | No |
| sourceUrl | TEXT | No |
| status | VARCHAR(30) | Yes |
| isActive | BOOLEAN | Yes |
| metadata | JSONB | No |
| createdAt | TIMESTAMP | Yes |
| updatedAt | TIMESTAMP | Yes |
| createdBy | UUID | No |
| updatedBy | UUID | No |
| deletedAt | TIMESTAMP | No |

The exact storage provider will be finalized during implementation.

---

# 12. Entity: BookMedia

## Purpose

Connect Books with Media while retaining information about how each asset is used.

## Fields

| Field | PostgreSQL Type | Required |
|---|---|---:|
| id | UUID | Yes |
| bookId | UUID | Yes |
| mediaId | UUID | Yes |
| mediaRole | VARCHAR(50) | Yes |
| displayOrder | INTEGER | Yes |
| isPrimary | BOOLEAN | Yes |
| createdAt | TIMESTAMP | Yes |

Initial media roles may include:

```text
COVER_FRONT
COVER_BACK
SPINE
INSIDE
PREVIEW
THUMBNAIL
BANNER
```

Relationship:

```text
Book 1 ─── N BookMedia N ─── 1 Media
```

The same Media architecture can later be extended through separate relation entities such as:

```text
AuthorMedia
PublisherMedia
CategoryMedia
EventMedia
BoxMedia
```

---

# 13. Inventory Entities

Inventory is part of the initial product scope but should be implemented after the catalog foundation is frozen.

## Warehouse

Represents a physical inventory location.

Initial fields:

```text
id
name
address
contactPerson
phone
isActive
createdAt
updatedAt
createdBy
updatedBy
deletedAt
```

## Inventory

Represents the current stock state of a Book at a Warehouse.

Initial fields:

```text
id
bookId
warehouseId
openingQuantity
receivedQuantity
reservedQuantity
soldQuantity
damagedQuantity
availableQuantity
reorderLevel
status
createdAt
updatedAt
```

The exact quantity-calculation strategy will be finalized with the Inventory module design.

## InventoryTransaction

Maintains an auditable history of stock movements.

Initial fields:

```text
id
inventoryId
transactionType
quantity
reference
notes
createdBy
createdAt
```

Initial transaction types:

```text
OPENING
RECEIVE
RESERVE
RESERVATION_RELEASE
SALE
RETURN
DAMAGE
ADJUSTMENT_IN
ADJUSTMENT_OUT
```

---

# 14. Initial ER Relationship Summary

```text
Publisher
    │
    └──────────< Book >────────── Language
                    │
                    ├────────< BookAuthor >──────── Author
                    │
                    ├────────< BookCategory >───── Category
                    │
                    └────────< BookMedia >──────── Media
                    │
                    └────────< Inventory >──────── Warehouse
                                      │
                                      └──────< InventoryTransaction
```

---

# 15. Catalog Import Architecture

The initial catalog objective is bulk ingestion from scraped data.

```text
External Sources
       ↓
Scraper
       ↓
Raw Data
       ↓
Excel
       ↓
Validation / Cleaning
       ↓
Duplicate Detection
       ↓
Approved Import
       ↓
NestJS Import Service
       ↓
PostgreSQL
```

The import process should resolve or create related records such as:

```text
Author
Publisher
Language
Category
Media
```

before creating the final Book relationships.

---

# 16. Duplicate Prevention

The import system must be designed to prevent duplicate catalog records.

Potential matching keys include:

1. `isbn13`
2. `isbn10`
3. `source + sourceBookId`
4. Carefully normalized title/author matching when ISBN is unavailable

ISBN fields should be indexed and uniqueness rules should be designed around real-world data quality rather than blindly enforcing uniqueness on nullable fields.

---

# 17. Indexing Strategy

Initial candidates:

```text
Book.slug
Book.isbn10
Book.isbn13
Book.status
Book.isActive
Book.publisherId
Book.languageId

Author.slug
Author.fullName

Publisher.slug
Publisher.name

Category.slug
Category.parentId

Language.code

BookAuthor.bookId
BookAuthor.authorId

BookCategory.bookId
BookCategory.categoryId

BookMedia.bookId
BookMedia.mediaId

Inventory.bookId
Inventory.warehouseId
```

Exact indexes will be finalized after reviewing query patterns and expected data volume.

---

# 18. Implementation Order

The recommended implementation order is:

```text
1. Database project setup
2. Book
3. Author
4. BookAuthor
5. Publisher
6. Language
7. Category
8. BookCategory
9. Media
10. BookMedia
11. Catalog import/validation pipeline
12. Warehouse
13. Inventory
14. InventoryTransaction
```

Authentication and Users will be implemented according to the application's access-control requirements and should be connected to audit fields when those requirements are finalized.

---

# 19. Current Status

**Document status:** Draft

**Frozen entities:**

- Book
- Author
- BookAuthor
- Publisher

**Under review:**

- Language
- Category
- BookCategory
- Media
- BookMedia
- Warehouse
- Inventory
- InventoryTransaction

The database schema should not be treated as implementation-ready until the remaining Phase 1 entities and relationships are reviewed and frozen.
