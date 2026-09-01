# The Story Box — Product Scope

**Document:** `docs/product-scope.md`  
**Status:** Published — Phase 1 Scope  
**Scope:** Initial system definition only; implementation is intentionally out of scope for this document.

## 1. Purpose

The Story Box is a book-focused commerce and operations platform. The initial system is designed around a central **Book Catalog**, with supporting entities for authors, publishers, categories, languages, media, users, authentication, inventory, warehouses, and inventory transactions.

This document defines the initial product boundaries before database implementation and API development.

> **Important:** Defining a module here does not mean that it must be implemented immediately.

## 2. Technology Direction

The project will be developed and maintained directly as a custom application.

### Admin / Application Frontend

- **Frontend:** React.js

### Backend

- **Backend:** NestJS
- **Database:** PostgreSQL
- **ORM:** TypeORM

React will provide the application UI, while NestJS will provide the API and business logic layer. PostgreSQL will be the primary system database.

The system will be designed so that the database and backend remain the source of truth for catalog, inventory, users, and future commerce functionality.

## 3. Initial Modules

1. Authentication
2. Users
3. Authors
4. Books
5. Categories
6. Languages
7. Publishers
8. Media
9. Inventory
10. Warehouses
11. Inventory Transactions

## 4. Module Scope

### 4.1 Authentication

**Purpose:** Provide secure authentication for users accessing the administrative platform.

**Initial responsibilities:**
- User sign-in
- Authentication/session management
- Password/security management
- Authentication status
- Access-control foundation

**Future considerations:**
- Role-based access control (RBAC)
- Permission management
- Refresh tokens/session policies
- Password reset
- Multi-factor authentication if required

Authentication implementation is not part of the current catalog/database-first milestone.

### 4.2 Users

**Purpose:** Represent people who interact with the administrative system.

**Initial responsibilities:**
- User identity
- User account status
- User information required for audit fields
- Association with created/updated records

**Future considerations:**
- Roles and permissions
- Teams/departments
- Warehouse-specific access
- Activity/audit history

Other entities may reference users through `createdBy` and `updatedBy`.

### 4.3 Authors

**Purpose:** Maintain reusable author information for the book catalog.

**Initial responsibilities:**
- Author identity
- Author name
- Author profile information
- Author source information
- Author publishing status
- Author metadata

**Relationship:**
```text
Author
   ↕
BookAuthor
   ↕
Book
```

One author can be associated with many books, and one book can have multiple authors.

**Rule:** Author information must not be stored as an array of author IDs inside Book.

### 4.4 Books

**Purpose:** The **Book** entity is the central entity of the Story Box catalog.

The initial Phase 1 objective is to establish a reliable book catalog that can receive large amounts of data from web scraping and bulk import.

**Initial responsibilities:**
- Book identity
- Title, subtitle, short description, and description
- ISBN information
- Edition
- Publication date
- Page count
- Publisher relationship
- Language relationship
- Source/import information
- Publishing status
- Metadata
- Audit information

**Data workflow:**
```text
Web Scraping
    ↓
Excel File
    ↓
Data Verification / Cleaning
    ↓
Bulk Import
    ↓
PostgreSQL
```

**Expected relationships:**
```text
Book
 ├── Publisher
 ├── Language
 ├── BookAuthor → Author
 ├── BookCategory → Category
 └── BookMedia → Media
```

**Design principles:**
- `id` is a UUID primary key.
- UUID primary keys are the standard for future modules/entities.
- Author IDs are not stored as arrays.
- Category IDs are not stored as arrays.
- Language is initially represented by a single `languageId`.
- Images/media are handled through the Media module.
- Catalog data and commercial/inventory data remain separated.

### 4.5 Categories

**Purpose:** Classify books for catalogue navigation, filtering, discovery, and future customer-facing experiences.

**Initial responsibilities:**
- Category name
- Category slug
- Category description
- Active/inactive state
- Hierarchical category support

Categories support parent/child relationships.

```text
Kids
├── Story Books
├── Activity Books
└── Board Books

Fiction
├── Mystery
├── Thriller
└── Romance
```

**Relationship:**
```text
Book
  ↕
BookCategory
  ↕
Category
```

A book may belong to multiple categories.

### 4.6 Languages

**Purpose:** Maintain controlled language data used by books.

**Initial responsibilities:**
- Language name
- Language code
- Active/inactive state

**Relationship:**
```text
Language
    ↓
Book
```

A book initially references one primary language.

The catalog is expected to support multiple languages, including regional Indian languages.

### 4.7 Publishers

**Purpose:** Maintain reusable publisher information associated with books.

**Initial responsibilities:**
- Publisher identity
- Publisher name
- Publisher slug
- Publisher description
- Publisher logo/media relationship
- Website
- Contact information
- Country
- Publisher type
- Source/import information
- Status
- Metadata
- Audit information

**Relationship:**
```text
Publisher
    ↓
Books
```

One publisher can publish many books.

Publisher information should not be duplicated inside every Book record where a reusable publisher relationship is appropriate.

### 4.8 Media

**Purpose:** Provide a reusable media/asset system instead of creating separate image tables for each entity.

Expected asset types include:
- Book covers
- Book previews
- Author profile images
- Publisher logos
- Category images/icons
- Event banners
- Box images
- Marketing banners
- Other website assets

**Initial responsibilities:**
- File identity
- File name
- MIME type
- File size
- Storage information
- Public URL
- Image dimensions
- Alt text/caption
- Source information
- Media status
- Metadata

**Book relationship:**
```text
Book
   ↓
BookMedia
   ↓
Media
```

`BookMedia` should support media role/type, display order, and primary-media flag.

The architecture prefers one generic `Media` table with entity-specific relation tables rather than a `BookImage` table.

### 4.9 Inventory

**Purpose:** Manage the current stock state of books.

Inventory is separate from Book because bibliographic identity is different from commercial/operational stock.

**Initial responsibilities:**
- Book reference
- Warehouse reference
- Opening quantity
- Received quantity
- Reserved quantity
- Sold quantity
- Damaged quantity
- Available quantity
- Reorder level
- Inventory status

**Relationship:**
```text
Book
   ↓
Inventory
   ↓
Warehouse
```

A book can eventually have stock in multiple warehouses or operational locations.

### 4.10 Warehouses

**Purpose:** Represent physical locations where inventory is stored or managed.

**Initial responsibilities:**
- Warehouse identity
- Warehouse name
- Address
- Contact information
- Active/inactive state

The system should support the current warehouse setup while remaining capable of supporting additional warehouses later.

**Relationship:**
```text
Warehouse
    ↓
Inventory
```

### 4.11 Inventory Transactions

**Purpose:** Maintain an auditable history of inventory changes.

**Initial transaction types:**
- Opening stock
- Stock received
- Reservation
- Reservation release
- Sale
- Return
- Damage
- Adjustment increase
- Adjustment decrease

**Relationship:**
```text
Inventory
    ↓
InventoryTransaction
```

**Rule:** Inventory transactions should not be silently deleted after they affect stock. Corrections should be represented through corrective transactions.

## 5. Initial Relationship Map

```text
                         ┌─────────────┐
                         │   Author    │
                         └──────▲──────┘
                                │
                           BookAuthor
                                │
                                ▼
┌─────────────┐          ┌─────────────┐          ┌─────────────┐
│  Publisher  │─────────►│    Book     │◄─────────│  Language   │
└─────────────┘          └──────┬──────┘          └─────────────┘
                                │
                       ┌────────┼─────────┐
                       │        │         │
                       ▼        ▼         ▼
                 BookCategory BookMedia Inventory
                       │        │         │
                       ▼        ▼         ▼
                   Category    Media    Warehouse
                                           │
                                           ▼
                                  InventoryTransaction
```

## 6. Module Dependencies

```text
Users
  ↓
Authors ─────────┐
                 │
Publishers ──────┤
                 │
Languages ───────┤
                 ▼
              Books
                 │
        ┌────────┼─────────┐
        ▼        ▼         ▼
   Categories   Media   Inventory
                            │
                            ▼
                        Warehouses
                            │
                            ▼
                  Inventory Transactions
```

## 7. Phase Boundaries

### Phase 1 — Catalog and Data Foundation

Immediate implementation priority:

```text
Book
Author
BookAuthor
Publisher
Language
Category
BookCategory
Media
BookMedia
```

Primary objective:

```text
Scraper
   ↓
Excel
   ↓
Validation
   ↓
Bulk Import
   ↓
PostgreSQL
```

### Phase 2 — Inventory Foundation

After the catalog model is stable:

```text
Warehouse
Inventory
InventoryTransaction
```

### Later Modules

The broader product is expected to require additional modules such as:

```text
Orders
Order Items
Payments
Shipments
Events
Offers
Customers
B2B
Integrations
Sync
```

These are intentionally not included in the current Phase 1 database implementation.

## 8. Application Data Ownership

The custom application will own the core business data and business logic.

### PostgreSQL

PostgreSQL is the primary source of truth for structured application data, including:

- Users
- Authors
- Books
- Categories
- Languages
- Publishers
- Media
- Inventory
- Warehouses
- Inventory Transactions
- Future commerce and operational entities

### NestJS

NestJS owns:

- API layer
- Business rules
- Validation
- Authentication and authorization
- Database access through TypeORM
- Import/scraping processing
- Inventory logic
- Future order, payment, fulfillment, and event logic

### React

React owns the application presentation layer and user interactions.

## 9. Current Entry Gate

Before implementation begins:

- [ ] Product scope reviewed
- [ ] Module list approved
- [ ] Book entity frozen
- [ ] Author entity frozen
- [ ] Publisher entity frozen
- [ ] Language entity reviewed
- [ ] Category entity reviewed
- [ ] Media architecture approved
- [ ] Book relationship/junction tables approved
- [ ] UUID convention approved
- [ ] Catalog ERD approved
- [ ] PostgreSQL schema approved

Only after these items are approved should PostgreSQL migrations and TypeORM entities be created.

## 10. Scope Status

**Current status:** Published — Phase 1 Scope

**Next design activity:** Review and freeze the remaining Catalog entities and relationships.

**No implementation should be considered final until the Phase 1 ERD and database specification are approved.**
