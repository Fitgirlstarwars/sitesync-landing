# SiteSync V3 - Security & Compliance

## Trust, Privacy, and Regulatory Framework

> This document details SiteSync's security architecture, compliance certifications, privacy practices, and regulatory alignment for building services.

---

## Security Philosophy

```
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║   YOUR DATA. YOUR CONTROL.                                       ║
║                                                                  ║
║   SiteSync is built on the principle that buildings own their   ║
║   data. This isn't just philosophy—it's architecture.            ║
║                                                                  ║
║   Every security decision starts with: "Does this protect the    ║
║   building's ownership and control of their information?"        ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

### Security Principles

| Principle | Implementation |
|-----------|----------------|
| **Defense in Depth** | Multiple security layers at every level |
| **Least Privilege** | Access only what's needed, nothing more |
| **Zero Trust** | Verify everything, trust nothing by default |
| **Encryption Everywhere** | Data protected at rest and in transit |
| **Auditability** | Every action logged, traceable, immutable |
| **Transparency** | Clear about what we do with your data |

---

## Compliance Certifications

### Current Certifications

```
COMPLIANCE STATUS
═══════════════════════════════════════════════════════════════════

SOC 2 Type II                                        ✓ Certified
────────────────────────────────────────────────────
Scope: Security, Availability, Confidentiality
Auditor: [Independent Third Party]
Last Audit: [Date]
Report Available: On request (NDA required)

ISO 27001                                            ◐ In Progress
────────────────────────────────────────────────────
Expected: [Target Date]
Scope: Information Security Management System

GDPR Compliant                                       ✓ Compliant
────────────────────────────────────────────────────
Data Processing Agreement available
EU Data Storage option available
Privacy Impact Assessment completed

Australian Privacy Act                               ✓ Compliant
────────────────────────────────────────────────────
APP compliance verified
Privacy Policy aligned with OAIC guidance
Data breach notification procedures in place

═══════════════════════════════════════════════════════════════════
```

### SOC 2 Trust Service Criteria

**Security:**
- Access controls and authentication
- Network security and monitoring
- Vulnerability management
- Incident response procedures

**Availability:**
- System uptime commitments
- Disaster recovery procedures
- Backup and restoration
- Capacity planning

**Confidentiality:**
- Data classification
- Encryption standards
- Access restrictions
- Secure disposal

**Processing Integrity:**
- Data accuracy controls
- Change management
- Quality assurance
- Error handling

**Privacy:**
- Data collection practices
- Use limitation
- Consent management
- Individual rights

---

## Data Protection

### Encryption Standards

```
ENCRYPTION ARCHITECTURE
═══════════════════════════════════════════════════════════════════

DATA IN TRANSIT
───────────────
Protocol: TLS 1.3 (minimum TLS 1.2)
Certificate: EV SSL, auto-renewal
HSTS: Enabled, preloaded
API: All endpoints HTTPS-only

DATA AT REST
────────────
Database: AES-256 encryption (Google Cloud SQL)
Files: AES-256 (Google Cloud Storage)
Backups: AES-256, separate key management
Audit Logs: Encrypted, append-only

KEY MANAGEMENT
──────────────
Provider: Google Cloud KMS
Rotation: Automatic, 90-day cycle
Access: Strictly controlled, audited
Separation: Per-customer keys available (Enterprise)

SENSITIVE FIELDS
────────────────
Passwords: Argon2id hashing
API Keys: SHA-256 hashing
PII: Field-level encryption option
Tokens: Cryptographically random, short-lived

═══════════════════════════════════════════════════════════════════
```

### Data Classification

| Classification | Definition | Examples | Protection |
|----------------|------------|----------|------------|
| **Public** | Non-sensitive, shareable | Marketing content | Basic |
| **Internal** | Business operations | Aggregate analytics | Standard |
| **Confidential** | Customer data | Work orders, equipment | Enhanced |
| **Restricted** | Highly sensitive | Credentials, billing | Maximum |

### Data Isolation

**Multi-Tenant Architecture:**

```
TENANT ISOLATION
═══════════════════════════════════════════════════════════════════

DATABASE LEVEL
──────────────
• Row-Level Security (RLS) enforced in PostgreSQL
• Every query filtered by organization_id
• Application cannot bypass RLS
• Tested and audited regularly

                    ┌─────────────────────────────┐
                    │     SiteSync Platform      │
                    └─────────────────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
   ┌─────▼─────┐        ┌─────▼─────┐        ┌─────▼─────┐
   │ Building A │        │ Building B │        │ Building C │
   │   (RLS)    │        │   (RLS)    │        │   (RLS)    │
   └───────────┘        └───────────┘        └───────────┘

   Building A cannot see Building B's data.
   Ever. By architecture, not just policy.

APPLICATION LEVEL
─────────────────
• Tenant context set at request start
• Validated against authenticated user
• Cannot be modified during request
• Logged for audit purposes

API LEVEL
─────────
• API keys scoped to organization
• Rate limiting per tenant
• Resource quotas enforced
• Cross-tenant requests blocked

═══════════════════════════════════════════════════════════════════
```

---

## Access Control

### Authentication

```
AUTHENTICATION METHODS
═══════════════════════════════════════════════════════════════════

STANDARD AUTHENTICATION
───────────────────────
• Email + Password (minimum 12 characters)
• Password requirements:
  - Minimum 12 characters
  - Complexity recommended, not required
  - Breach database checking (HaveIBeenPwned)
  - No maximum length

MULTI-FACTOR AUTHENTICATION (MFA)
─────────────────────────────────
• TOTP (Google Authenticator, Authy, etc.)
• SMS (as backup only)
• Hardware keys (WebAuthn/FIDO2) - Enterprise
• Required for admin accounts
• Recommended for all users

ENTERPRISE SSO
──────────────
• SAML 2.0
• OIDC (OpenID Connect)
• Supported IdPs:
  - Okta
  - Azure AD
  - Google Workspace
  - OneLogin
  - Custom SAML

PASSWORDLESS OPTIONS
────────────────────
• Magic link (email)
• Passkeys (WebAuthn)
• SSO-only mode

═══════════════════════════════════════════════════════════════════
```

### Authorization Model

**Role-Based Access Control (RBAC):**

```
ROLE HIERARCHY
═══════════════════════════════════════════════════════════════════

BUILDING ROLES
──────────────
Owner
├── Full access to building data
├── Manage users and permissions
├── Invite/remove contractors
├── Export all data
├── Delete building
└── Billing management

Manager
├── View all building data
├── Create/edit work orders
├── Upload documents
├── Invite contractors (with approval)
└── Cannot delete or export

Viewer
├── View building data
├── View work orders (read-only)
└── Cannot create or modify

CONTRACTOR ROLES
────────────────
Service Admin
├── Manage contractor company
├── Add/remove technicians
├── Accept building invitations
├── View all assigned buildings
└── Billing for contractor

Dispatcher
├── Create/assign work orders
├── View assigned buildings
├── Manage schedules
└── Cannot access billing

Technician
├── View assigned work orders
├── Log work performed
├── Access AI diagnosis
├── Update job status
└── Cannot access other techs' data

PLATFORM ROLES
──────────────
System Admin (SiteSync Staff)
├── Platform administration
├── Support access (with customer consent)
├── Cannot view customer data without audit trail
└── All access logged and reviewed

═══════════════════════════════════════════════════════════════════
```

### Permission Matrix

| Resource | Owner | Manager | Viewer | Service Admin | Technician |
|----------|-------|---------|--------|---------------|------------|
| View equipment | ✓ | ✓ | ✓ | ✓ | ✓ (assigned) |
| Edit equipment | ✓ | ✓ | - | - | - |
| View work orders | ✓ | ✓ | ✓ | ✓ | ✓ (assigned) |
| Create work orders | ✓ | ✓ | - | ✓ | - |
| Complete work orders | ✓ | ✓ | - | ✓ | ✓ (assigned) |
| View compliance | ✓ | ✓ | ✓ | ✓ | - |
| Upload documents | ✓ | ✓ | - | ✓ | ✓ |
| Export data | ✓ | - | - | - | - |
| Manage users | ✓ | - | - | ✓ | - |
| Billing access | ✓ | - | - | ✓ | - |

---

## Infrastructure Security

### Cloud Architecture

```
INFRASTRUCTURE OVERVIEW
═══════════════════════════════════════════════════════════════════

CLOUD PROVIDER: Google Cloud Platform (GCP)
─────────────────────────────────────────
• Region: Australia (sydney) primary
• Secondary: US (us-central1) available
• EU region available for EU customers

NETWORK SECURITY
────────────────
• VPC with private subnets
• Cloud Armor (WAF/DDoS protection)
• Cloud NAT for outbound
• No public IPs on compute instances

                     ┌─────────────────────────────┐
                     │      Cloud Armor (WAF)      │
                     │      DDoS Protection        │
                     └──────────────┬──────────────┘
                                    │
                     ┌──────────────▼──────────────┐
                     │      Cloud Load Balancer    │
                     │      SSL Termination        │
                     └──────────────┬──────────────┘
                                    │
         ┌──────────────────────────┼──────────────────────────┐
         │                          │                          │
   ┌─────▼─────┐             ┌──────▼──────┐            ┌──────▼──────┐
   │ Cloud Run │             │  Cloud Run  │            │  Cloud Run  │
   │ (API)     │             │  (Workers)  │            │  (AI)       │
   └─────┬─────┘             └──────┬──────┘            └──────┬──────┘
         │                          │                          │
         └──────────────────────────┼──────────────────────────┘
                                    │
                     ┌──────────────▼──────────────┐
                     │     VPC Private Network     │
                     └──────────────┬──────────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
        ┌─────▼─────┐         ┌─────▼─────┐         ┌─────▼─────┐
        │ Cloud SQL │         │Memorystore│         │  Cloud    │
        │(PostgreSQL)│        │  (Redis)  │         │  Storage  │
        │ (Private) │         │ (Private) │         │ (Private) │
        └───────────┘         └───────────┘         └───────────┘

COMPUTE SECURITY
────────────────
• Cloud Run (serverless, no SSH access)
• Container images scanned for vulnerabilities
• Minimal base images (distroless)
• No persistent state on compute

DATABASE SECURITY
─────────────────
• Cloud SQL with private IP only
• Automated backups (point-in-time recovery)
• Encryption at rest (Google-managed keys)
• Customer-managed keys available (Enterprise)

═══════════════════════════════════════════════════════════════════
```

### Security Monitoring

```
MONITORING & DETECTION
═══════════════════════════════════════════════════════════════════

LOGGING
───────
• All API requests logged
• Authentication events
• Authorization decisions
• Data access patterns
• Retention: 90 days online, 7 years archived

ALERTING
────────
• Failed authentication attempts
• Privilege escalation attempts
• Unusual data access patterns
• API rate limit breaches
• System availability issues

INCIDENT RESPONSE
─────────────────
• 24/7 on-call rotation
• Defined escalation procedures
• Customer notification SLAs
• Post-incident reviews
• Root cause analysis published

PENETRATION TESTING
───────────────────
• Annual third-party testing
• Continuous automated scanning
• Bug bounty program (planned)
• Results remediated promptly

═══════════════════════════════════════════════════════════════════
```

---

## Privacy Framework

### Australian Privacy Principles (APPs)

**Compliance Summary:**

| APP | Requirement | SiteSync Compliance |
|-----|-------------|---------------------|
| APP 1 | Open and transparent management | Privacy Policy published, regularly updated |
| APP 2 | Anonymity and pseudonymity | Anonymous knowledge contributions supported |
| APP 3 | Collection of solicited information | Only collect what's necessary for service |
| APP 4 | Unsolicited information | Destroyed if not needed |
| APP 5 | Notification of collection | Clear notices at collection points |
| APP 6 | Use or disclosure | Only for stated purposes, no selling |
| APP 7 | Direct marketing | Opt-in only, easy unsubscribe |
| APP 8 | Cross-border disclosure | Disclosed in privacy policy, adequate protections |
| APP 9 | Government identifiers | Not used as primary identifiers |
| APP 10 | Quality of personal information | Accuracy maintained, correction supported |
| APP 11 | Security of personal information | Technical and organizational measures |
| APP 12 | Access to personal information | Self-service and request options |
| APP 13 | Correction of personal information | Edit and request correction |

### GDPR Alignment

**For EU Users/Data:**

```
GDPR COMPLIANCE
═══════════════════════════════════════════════════════════════════

LAWFUL BASIS FOR PROCESSING
───────────────────────────
• Contract: Service provision
• Legitimate Interest: Platform improvement
• Consent: Marketing, optional features

DATA SUBJECT RIGHTS
───────────────────
Right of Access          ✓ Self-service export
Right to Rectification   ✓ Edit profile/data
Right to Erasure         ✓ Delete account request
Right to Restriction     ✓ Pause processing
Right to Portability     ✓ Export in standard formats
Right to Object          ✓ Marketing opt-out, AI opt-out
Automated Decisions      ✓ Human review available

DATA PROCESSING AGREEMENT
─────────────────────────
• Standard Contractual Clauses available
• Sub-processor list maintained
• Notification of changes

EU DATA STORAGE
───────────────
• EU region available on request
• Data residency guarantee
• No transfer outside EU (if selected)

═══════════════════════════════════════════════════════════════════
```

### Privacy by Design

**Implementation:**

1. **Data Minimization**
   - Collect only what's needed
   - Clear purpose for each field
   - Regular review of data collected

2. **Purpose Limitation**
   - Data used only for stated purposes
   - New uses require consent
   - No selling of personal data

3. **Storage Limitation**
   - Defined retention periods
   - Automated deletion schedules
   - Export before deletion available

4. **Transparency**
   - Clear privacy policy
   - In-app privacy notices
   - Easy access to personal data

5. **User Control**
   - Privacy settings dashboard
   - Export functionality
   - Deletion requests honored

---

## Building Industry Compliance

### Elevator Regulations

```
AUSTRALIAN ELEVATOR REGULATIONS
═══════════════════════════════════════════════════════════════════

WORK HEALTH AND SAFETY
──────────────────────
• AS 1735 Lifts, Escalators and Moving Walks
• State/Territory WHS Acts
• Registration requirements vary by state

INSPECTION REQUIREMENTS
───────────────────────
• Annual safety inspection (most states)
• Major inspection every 5 years
• Records must be maintained
• SiteSync tracks and alerts

STATE-SPECIFIC
──────────────
Victoria: WorkSafe Victoria registration
NSW: SafeWork NSW registration
Queensland: Workplace Health and Safety Queensland
WA: WorkSafe WA
SA: SafeWork SA

HOW SITESYNC HELPS
───────────────────
✓ Track inspection due dates
✓ Store certificates digitally
✓ Alert before expiry
✓ Generate compliance reports
✓ Maintain audit trail for regulators

═══════════════════════════════════════════════════════════════════
```

### Building Compliance

```
BUILDING MANAGEMENT COMPLIANCE
═══════════════════════════════════════════════════════════════════

STRATA/BODY CORPORATE
─────────────────────
• Strata Schemes Management Act (NSW)
• Owners Corporation Act (VIC)
• Body Corporate and Community Management Act (QLD)
• Record-keeping requirements
• Meeting/communication requirements

COMMERCIAL BUILDINGS
────────────────────
• Building Code of Australia (BCA)
• Essential Services requirements
• Fire safety compliance
• Accessibility standards

ENVIRONMENTAL
─────────────
• NABERS ratings (voluntary/mandatory)
• Energy efficiency reporting
• Sustainability certifications

SITESYNC SUPPORT
─────────────────
✓ Centralized record keeping
✓ Compliance calendar
✓ Document management
✓ Audit-ready reports
✓ Export for regulators

═══════════════════════════════════════════════════════════════════
```

---

## Audit Trail

### Immutable Event Log

**Architecture:**

```
AUDIT ARCHITECTURE
═══════════════════════════════════════════════════════════════════

WHAT'S LOGGED
─────────────
• Every data modification
• Every access to sensitive data
• Authentication events
• Authorization decisions
• System configuration changes

LOG STRUCTURE
─────────────
{
  "event_id": "uuid",
  "timestamp": "ISO8601",
  "event_type": "work_order_created",
  "actor_id": "user_uuid",
  "actor_type": "user|system|api",
  "organization_id": "org_uuid",
  "resource_type": "work_order",
  "resource_id": "wo_uuid",
  "changes": {
    "before": {...},
    "after": {...}
  },
  "ip_address": "masked",
  "user_agent": "browser info",
  "hash": "sha256 of previous + this event"
}

INTEGRITY
─────────
• Hash chain (each event references previous)
• Append-only storage
• No modification possible
• Regular integrity verification
• Third-party attestation available

RETENTION
─────────
• Online: 90 days (searchable)
• Archive: 7 years (retrievable)
• Compliance exports: On request

═══════════════════════════════════════════════════════════════════
```

### Event Types

| Category | Event Types |
|----------|-------------|
| **Authentication** | login, logout, mfa_challenge, password_reset |
| **Authorization** | permission_granted, permission_denied, role_changed |
| **Data** | created, updated, deleted, exported, accessed |
| **Work Orders** | created, assigned, started, completed, cancelled |
| **Equipment** | created, updated, status_changed |
| **Compliance** | certificate_uploaded, expiry_alert, inspection_scheduled |
| **System** | config_changed, integration_connected, api_key_created |

---

## Incident Response

### Response Procedures

```
INCIDENT RESPONSE FRAMEWORK
═══════════════════════════════════════════════════════════════════

SEVERITY LEVELS
───────────────
P1 - Critical
• Data breach confirmed
• Service completely unavailable
• Response: Immediate, all hands

P2 - High
• Potential data exposure
• Significant service degradation
• Response: Within 1 hour

P3 - Medium
• Security vulnerability found
• Minor service impact
• Response: Within 4 hours

P4 - Low
• Suspicious activity
• No immediate impact
• Response: Within 24 hours

RESPONSE PHASES
───────────────
1. Detection
   └── Automated alerts, user reports, monitoring

2. Containment
   └── Isolate affected systems, preserve evidence

3. Eradication
   └── Remove threat, patch vulnerabilities

4. Recovery
   └── Restore services, verify integrity

5. Lessons Learned
   └── Post-incident review, process improvement

═══════════════════════════════════════════════════════════════════
```

### Data Breach Protocol

**Notification Requirements:**

| Jurisdiction | Requirement | Timeline |
|--------------|-------------|----------|
| Australia (NDB) | Notify OAIC and affected individuals | As soon as practicable |
| GDPR | Notify supervisory authority | Within 72 hours |
| US (varies by state) | Notify affected individuals | Varies (30-90 days) |

**SiteSync Commitment:**
- Notify affected customers within 24 hours
- Provide details of what was affected
- Explain remediation steps taken
- Offer support and next steps

---

## Vendor Security

### Sub-Processors

**Primary Service Providers:**

| Provider | Service | Data Processed | Compliance |
|----------|---------|----------------|------------|
| Google Cloud | Infrastructure | All data | SOC 2, ISO 27001 |
| OpenAI/Anthropic/Google AI | AI Processing | Anonymized queries | SOC 2, GDPR |
| Stripe | Payments | Payment info | PCI-DSS Level 1 |
| SendGrid | Email | Email addresses | SOC 2 |
| Sentry | Error tracking | Error logs (no PII) | SOC 2 |

**Vendor Assessment:**
- Security questionnaire for all vendors
- Annual review of vendor security posture
- Data Processing Agreements in place
- Right to audit provisions

### Third-Party Integrations

**Integration Security:**

```
INTEGRATION SECURITY
═══════════════════════════════════════════════════════════════════

OAUTH 2.0
─────────
• All integrations use OAuth 2.0
• Scoped permissions (minimum required)
• Token refresh, no long-lived credentials
• User can revoke at any time

WEBHOOK SECURITY
────────────────
• HTTPS only
• Signature verification
• Payload encryption (optional)
• Retry with backoff

API SECURITY
────────────
• API keys scoped to organization
• Rate limiting enforced
• IP allowlisting available (Enterprise)
• Request logging

═══════════════════════════════════════════════════════════════════
```

---

## Security for Users

### Building Manager Security Checklist

```
SECURITY CHECKLIST FOR BUILDING MANAGERS
═══════════════════════════════════════════════════════════════════

ACCOUNT SECURITY
☐ Enable MFA on your account
☐ Use a unique, strong password
☐ Keep recovery codes in secure location
☐ Review active sessions regularly

USER MANAGEMENT
☐ Only grant necessary permissions
☐ Remove access when roles change
☐ Audit user list quarterly
☐ Use SSO if available (Enterprise)

CONTRACTOR ACCESS
☐ Review contractor permissions annually
☐ Revoke access when contracts end
☐ Monitor contractor activity
☐ Use approval workflow for sensitive actions

DATA PROTECTION
☐ Limit who can export data
☐ Review audit logs monthly
☐ Report suspicious activity
☐ Keep compliance documents current

═══════════════════════════════════════════════════════════════════
```

### Technician Security Checklist

```
SECURITY CHECKLIST FOR TECHNICIANS
═══════════════════════════════════════════════════════════════════

PERSONAL SECURITY
☐ Enable MFA on your account
☐ Don't share your credentials
☐ Log out on shared devices
☐ Keep app updated

DATA HANDLING
☐ Only access data you need
☐ Don't screenshot sensitive info
☐ Report lost/stolen devices immediately
☐ Use secure networks when possible

KNOWLEDGE CONTRIBUTIONS
☐ Don't share proprietary information
☐ Use anonymous option if needed
☐ Review before submitting
☐ Report concerning content

═══════════════════════════════════════════════════════════════════
```

---

## Security FAQs

**Q: Who can see my building's data?**
A: Only users you've authorized—your staff and contractors you've invited. SiteSync staff can only access your data with your explicit consent for support purposes, and all access is logged.

**Q: Is my data shared with other buildings?**
A: Never. Your building data is isolated. The only "shared" data is anonymized, aggregated insights for AI training and industry benchmarking—never identifiable information.

**Q: What happens to my data if I cancel?**
A: You can export all your data before cancellation. After cancellation, data is retained for 90 days (in case you return), then permanently deleted. Audit logs are retained for compliance.

**Q: Can technicians see data from other buildings?**
A: No. Technicians only see data for buildings/work orders they're assigned to. Row-Level Security ensures this at the database level.

**Q: How is AI trained on my data?**
A: AI models are trained on anonymized, aggregated patterns. Your specific building's data is never used in a way that could identify you. You can opt out of AI training entirely.

**Q: What certifications does SiteSync have?**
A: We maintain SOC 2 Type II certification and are GDPR compliant. ISO 27001 certification is in progress. See Compliance Certifications section for details.

**Q: Can I get a copy of your security audit?**
A: Yes. SOC 2 Type II reports are available under NDA for enterprise customers. Contact security@sitesync.com.

**Q: What happens in a data breach?**
A: We follow defined incident response procedures and notify affected customers within 24 hours. See Incident Response section for details.

---

## Contact & Resources

### Security Team

```
SECURITY CONTACTS
═══════════════════════════════════════════════════════════════════

General Security Inquiries
security@sitesync.com

Report a Vulnerability
security@sitesync.com (PGP key available)

Privacy Inquiries
privacy@sitesync.com

Compliance Documentation Requests
compliance@sitesync.com

Data Protection Officer (GDPR)
dpo@sitesync.com

═══════════════════════════════════════════════════════════════════
```

### Documentation

- [Privacy Policy](https://sitesync.com/privacy)
- [Terms of Service](https://sitesync.com/terms)
- [Data Processing Agreement](https://sitesync.com/dpa)
- [Sub-Processor List](https://sitesync.com/subprocessors)
- [Security Whitepaper](https://sitesync.com/security)

---

**[← Back to Data Migration](../how-to/data-migration.md)** | **[Next: FAQ →](../faq.md)**
