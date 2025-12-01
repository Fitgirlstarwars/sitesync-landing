# SiteSync V3 Foundation Documentation Plan

> **Purpose**: This document outlines the complete plan for creating the foundational "bare bones" documentation that must exist before building dashboards, AI features, or advanced functionality.

> **Status**: Planning Complete | Implementation In Progress

---

## Executive Summary

Based on comprehensive research and gap analysis, we identified that SiteSync V3 has excellent schemas and data models but lacks the foundational documentation showing:

1. How entities relate to each other
2. How to create profiles (organization, building, user, asset)
3. Who can do what (permissions)
4. What states entities can be in (state machines)
5. What data is required vs optional (validation)

This plan addresses all gaps systematically.

---

## Research Sources & Best Practices Applied

### SaaS Architecture
- [AWS SaaS Lens - General Design Principles](https://docs.aws.amazon.com/wellarchitected/latest/saas-lens/general-design-principles.html)
- [CloudZero - SaaS Architecture Best Practices 2024](https://www.cloudzero.com/blog/saas-architecture/)
- [AWS SaaS Architecture Fundamentals](https://docs.aws.amazon.com/whitepapers/latest/saas-architecture-fundamentals/saas-architecture-fundamentals.html)

### Entity Relationship Diagrams
- [Lucidchart - ERD Guide](https://www.lucidchart.com/pages/er-diagrams)
- [Atlassian - Entity Relationship Diagrams](https://www.atlassian.com/work-management/project-management/entity-relationship-diagram)
- [Diligent - ERD Best Practices](https://www.diligent.com/resources/blog/what-are-the-best-practices-for-entity-relationship-diagramming)
- [Mermaid ERD Syntax](https://mermaid.js.org/syntax/entityRelationshipDiagram.html)

### RBAC & Permissions
- [NocoBase - How to Design RBAC](https://www.nocobase.com/en/blog/how-to-design-rbac-role-based-access-control-system)
- [ArgonDigital - Roles & Permissions Matrices](https://argondigital.com/resource/tools-templates/rml-people-models/roles-and-permissions-matrices/)
- [Oso - RBAC vs ABAC Patterns](https://www.osohq.com/post/role-based-access-control-attribute-based-access-control-defined)
- [NIST RBAC Specification](https://csrc.nist.gov/CSRC/media/Presentations/Role-based-Access-Control/images-media/Role-based%20Access%20Control2.pdf)

### Property/Facilities Management
- [Access-DIVA - Property Management Data Model](https://www.access-diva.com/dm3.html)
- [Sloboda Studio - Property Management Software Guide](https://sloboda-studio.com/blog/how-to-create-a-property-management-system/)
- [TabsFM - CAFM Asset Management](https://www.tabsfm.com/CAFM/modules/asset/)
- [Accruent - CMMS/CAFM/EAM Guide](https://www.accruent.com/resources/blog-posts/cmms-cafm-eam-your-guide-facility-management-software)

### User Onboarding
- [Userflow - SaaS Onboarding Flow Guide](https://www.userflow.com/blog/saas-onboarding-flow-a-complete-guide)
- [UserPilot - Onboarding User Flow Examples](https://userpilot.com/blog/onboarding-user-flow-examples/)
- [ProductLed - SaaS Onboarding Best Practices 2025](https://productled.com/blog/5-best-practices-for-better-saas-user-onboarding)

### State Machines
- [Microsoft - State Machine Workflows](https://learn.microsoft.com/en-us/dotnet/framework/windows-workflow-foundation/state-machine-workflows)
- [SourceMaking - State Design Pattern](https://sourcemaking.com/design_patterns/state)
- [WorkflowEngine - Workflow vs State Machine](https://workflowengine.io/blog/workflow-engine-vs-state-machine/)

### Multi-Tenancy & Data Isolation
- [AWS - Multi-tenant Data Isolation with PostgreSQL RLS](https://aws.amazon.com/blogs/database/multi-tenant-data-isolation-with-postgresql-row-level-security/)
- [TheNile - Multi-tenant RLS](https://www.thenile.dev/blog/multi-tenant-rls)
- [AWS - Tenant Isolation Fundamentals](https://docs.aws.amazon.com/whitepapers/latest/saas-architecture-fundamentals/tenant-isolation.html)

### Data Validation
- [Wikipedia - Data Validation](https://en.wikipedia.org/wiki/Data_validation)
- [Flatfile - Beginner's Guide to Data Validation](https://flatfile.com/blog/the-beginners-guide-to-data-validation/)
- [Stack Exchange - Field Validation in Documentation](https://softwareengineering.stackexchange.com/questions/180653/how-to-properly-include-field-validation-in-a-software-documenation)

---

## Document Creation Order

Documents must be created in this order due to dependencies:

```
Phase 1: Core Structure (Must be first)
├── 01-system-overview.md      ← Start here
├── 02-entity-relationships.md ← Depends on 01
│
Phase 2: Profile Definitions (Can be parallel)
├── 03-organization-profiles.md
├── 04-building-profiles.md
├── 05-user-profiles.md
├── 06-asset-profiles.md
│
Phase 3: Operational Docs (Depends on Phase 2)
├── 07-creation-flows.md       ← Depends on 03-06
├── 08-permissions-matrix.md   ← Depends on 05
├── 09-state-machines.md       ← Depends on 06
└── 10-validation-rules.md     ← Depends on 03-06
```

---

## Document Specifications

### 01-system-overview.md

**Purpose**: High-level system architecture showing how SiteSync works as a multi-tenant building management platform.

**Contents**:
1. System Purpose & Scope
2. Multi-Tenant Architecture Diagram
3. Core Entity Hierarchy (visual)
4. Technology Stack Summary
5. Key Design Principles
   - Building-centric data ownership
   - Multi-tenant isolation via RLS
   - AI-assisted workflows
6. System Boundaries
   - What SiteSync manages
   - What it doesn't manage
7. Glossary Reference

**Format**: Prose with Mermaid diagrams

**Estimated Length**: 400-600 lines

---

### 02-entity-relationships.md

**Purpose**: Complete entity relationship documentation showing how all core entities connect.

**Contents**:
1. Entity Hierarchy Diagram (Mermaid ERD)
2. Relationship Types Explained
   - One-to-Many (1:N)
   - Many-to-Many (M:N)
   - Optional vs Required
3. Core Entity Relationships
   - Organization → Sites
   - Organization → Users
   - Site → Elevators
   - Elevator → Work Orders
   - Work Order → Tasks/Parts/Labor
   - Organization → Contractors
4. Foreign Key Constraints
5. Cascade Delete Rules
6. RLS Policy Summary
7. Subject Areas (logical groupings)

**Format**: Diagrams + Tables + Explanations

**Diagram Style**: Crow's Foot notation via Mermaid

**Estimated Length**: 500-800 lines

---

### 03-organization-profiles.md

**Purpose**: Complete specification for organization/company profiles.

**Contents**:
1. What is an Organization?
2. Organization Types
   - service_company
   - building_owner
   - manufacturer
   - supplier
   - insurance
   - trade_school
   - regulatory_body
   - individual
3. Profile Field Reference Table
   - Field name
   - Type
   - Required/Optional
   - Description
   - Example
   - Validation rules
4. Subscription Tiers
   - free (5 assets, 2 users)
   - pro (50 assets, 10 users)
   - expert (unlimited, 50 users)
   - enterprise (unlimited, unlimited)
5. Settings Schema
6. Creation Requirements
7. Minimum Viable Profile
8. Complete Profile Example
9. Related Entities

**Format**: Tables + JSON examples

**Estimated Length**: 300-500 lines

---

### 04-building-profiles.md

**Purpose**: Complete specification for site/building profiles.

**Contents**:
1. What is a Site/Building?
2. Site Types
   - commercial, residential, mixed, industrial
   - healthcare, education, retail, hospitality, government
3. Profile Field Reference Table
   - All fields with types, requirements, descriptions
4. Address & Geolocation
5. Contact Information
6. Access Information (codes, instructions)
7. Health Score Components
   - equipment_condition
   - maintenance_compliance
   - incident_frequency
   - first_time_fix_rate
   - predictive_risk
8. Creation Requirements
9. Minimum Viable Building Profile
10. Complete Building Profile Example
11. Building-Specific Settings
12. Related Entities (elevators, work orders)

**Format**: Tables + JSON examples

**Estimated Length**: 400-600 lines

---

### 05-user-profiles.md

**Purpose**: Complete specification for user profiles and roles.

**Contents**:
1. What is a User?
2. User Types
   - standard, technician, manager, admin, system
3. Roles Hierarchy
   - owner (full control + billing)
   - admin (full control, no billing)
   - manager (site management)
   - user (standard access)
   - technician (field work)
   - readonly (view only)
   - guest (temporary)
4. Profile Field Reference Table
5. Authentication Fields
6. Notification Preferences Schema
7. Privacy Settings Schema
8. Internal vs External Users
9. Contractor-Linked Users
10. Creation Requirements
11. Minimum Viable User Profile
12. Complete User Profile Example
13. Role Assignment Rules
14. Session Management

**Format**: Tables + JSON examples

**Estimated Length**: 400-600 lines

---

### 06-asset-profiles.md

**Purpose**: Complete specification for elevator/equipment profiles.

**Contents**:
1. What is an Asset/Elevator?
2. Asset Status Types
   - operational, degraded, out_of_service
   - maintenance, decommissioned
3. Profile Field Reference Table
   - Identification (unit_number, serial, registration, asset_tag)
   - Equipment Details (manufacturer, model, controller, drive)
   - Specifications (capacity, speed, floors, dimensions)
   - Dates (installation, modernization, service)
   - Compliance (inspection dates, certificates)
   - Health Score
4. Specifications JSON Schema
5. Known Quirks (AI-learned notes)
6. Creation Requirements
7. Minimum Viable Asset Profile
8. Complete Asset Profile Example
9. Asset Hierarchy Considerations
   - Current: Elevator as atomic unit
   - Future: Component sub-assets
10. Linking to V2 Documents

**Format**: Tables + JSON examples

**Estimated Length**: 500-700 lines

---

### 07-creation-flows.md

**Purpose**: Step-by-step guides for creating each entity type.

**Contents**:
1. Creation Order Dependencies
   ```
   Organization → Users/Sites/Contractors → Elevators → Work Orders
   ```
2. System Bootstrap Flow
   - First organization creation
   - First admin user creation
   - Platform initialization
3. Manager Creates Organization
   - Prerequisites
   - Required fields
   - API endpoint
   - Response
   - Next steps
4. Manager Creates Building/Site
   - Prerequisites
   - Required fields
   - Validation
   - API endpoint
   - Auto-applied settings
5. Manager Creates User
   - Prerequisites
   - Required fields
   - Role assignment
   - Email verification
6. Manager/Trade Creates Asset
   - Prerequisites
   - Required fields
   - Smart capture (camera/nameplate)
   - Validation
7. Creating Work Orders
   - From breakdown report
   - From scheduled maintenance
   - From inspection
8. Inviting Contractors
   - Invitation flow
   - Acceptance flow
   - Permission assignment
9. Error Handling
   - Common creation errors
   - Validation failures
   - Recovery paths

**Format**: Step-by-step with code examples

**Estimated Length**: 600-900 lines

---

### 08-permissions-matrix.md

**Purpose**: Complete RBAC permission matrix showing who can do what.

**Contents**:
1. RBAC Overview
2. Role Definitions (detailed)
3. Permission Categories
   - Organization management
   - Site management
   - Asset management
   - Work order management
   - User management
   - Contractor management
   - Reports & analytics
   - System settings
4. **Master Permission Matrix Table**
   ```
   Action              | owner | admin | manager | user | tech | readonly
   --------------------|-------|-------|---------|------|------|--------
   Create Organization | Yes   | No    | No      | No   | No   | No
   Edit Organization   | Yes   | Yes   | No      | No   | No   | No
   Create Site         | Yes   | Yes   | Yes     | No   | No   | No
   Edit Site           | Yes   | Yes   | Yes     | No   | No   | No
   Delete Site         | Yes   | Yes   | No      | No   | No   | No
   Create Asset        | Yes   | Yes   | Yes     | Yes  | No   | No
   ... (full matrix)
   ```
5. Resource-Level Permissions
6. Data Access Rules
   - Organization isolation
   - Site-level access
   - Work order visibility
7. API Authorization
8. Permission Inheritance
9. Special Cases
   - Cross-organization access (contractors)
   - Temporary elevated access
   - Emergency access

**Format**: Tables (primary), prose for explanations

**Estimated Length**: 400-600 lines

---

### 09-state-machines.md

**Purpose**: Document all entity state machines and valid transitions.

**Contents**:
1. State Machine Concepts
2. Work Order State Machine
   - States: draft, pending, scheduled, in_progress, on_hold, completed, cancelled, invoiced
   - Transitions diagram
   - Who can trigger each transition
   - Actions on transition
   - Validation rules per transition
3. Elevator Status State Machine
   - States: operational, degraded, out_of_service, maintenance, decommissioned
   - Transitions diagram
   - Trigger conditions
   - Automatic transitions (e.g., inspection failure)
4. User Account States
   - active, inactive, suspended, deleted
   - Email verification states
5. Contractor Status States
   - active, inactive, preferred, suspended
6. Work Order Task States
   - pending, in_progress, completed, skipped
7. State History Tracking
8. Audit Trail Requirements

**Format**: Mermaid state diagrams + tables

**Estimated Length**: 500-700 lines

---

### 10-validation-rules.md

**Purpose**: Document all data validation rules for every entity.

**Contents**:
1. Validation Philosophy
2. Validation Categories
   - Required fields
   - Data types
   - Format constraints (regex)
   - Range constraints
   - Referential integrity
   - Business rules
3. Organization Validation Rules
   - name: required, 1-255 chars
   - slug: required, 1-100 chars, unique, lowercase alphanumeric + hyphen
   - email: optional, valid email format
   - abn: optional, 11 digits (Australian)
   - etc.
4. Site Validation Rules
   - Full field validation table
5. User Validation Rules
   - Full field validation table
6. Elevator Validation Rules
   - Full field validation table
7. Work Order Validation Rules
   - Full field validation table
8. Cross-Entity Validation
   - Foreign key requirements
   - Uniqueness constraints
   - Business logic rules
9. Error Messages
   - Standard error format
   - User-friendly messages
   - Developer error codes
10. Validation in UI vs API
11. Validation Testing

**Format**: Tables (primary)

**Estimated Length**: 600-900 lines

---

## Implementation Checklist

### Phase 1: Core Structure
- [ ] Create 01-system-overview.md
- [ ] Create 02-entity-relationships.md
- [ ] Review & validate diagrams

### Phase 2: Profile Definitions
- [ ] Create 03-organization-profiles.md
- [ ] Create 04-building-profiles.md
- [ ] Create 05-user-profiles.md
- [ ] Create 06-asset-profiles.md
- [ ] Cross-reference with existing schemas

### Phase 3: Operational Docs
- [ ] Create 07-creation-flows.md
- [ ] Create 08-permissions-matrix.md
- [ ] Create 09-state-machines.md
- [ ] Create 10-validation-rules.md

### Phase 4: Integration
- [ ] Update docs/README.md to include foundation docs
- [ ] Update CLAUDE.md reading order
- [ ] Update llms.txt index
- [ ] Validate all cross-references

---

## Quality Criteria

Each document must:

1. **Be Self-Contained**: Can be read independently
2. **Be Accurate**: Match existing schemas in `data-model.md` and `database-schema-complete.md`
3. **Use Consistent Notation**: Crow's Foot for ERDs, standard state diagram notation
4. **Include Examples**: Real JSON/code examples, not placeholders
5. **Be Developer-Ready**: Sufficient detail to implement from
6. **Cross-Reference**: Link to related documents
7. **Follow Diátaxis**: Appropriate category (reference, explanation, tutorial, how-to)

---

## Next Steps

1. Begin with `01-system-overview.md` - the foundation of foundations
2. Each document builds on previous ones
3. If interrupted, resume from last incomplete document
4. Use todo list to track progress

---

## Notes

- All documents go in `/docs/foundation/`
- Use existing schemas as source of truth
- Don't invent new fields - document what exists
- Flag any gaps found in existing schemas for future consideration
