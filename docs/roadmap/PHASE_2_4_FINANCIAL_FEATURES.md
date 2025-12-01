# Phase 2.4: Financial Features

## Overview

The Financial Features module creates a comprehensive payment and financial management ecosystem for the building services industry. It enables instant payments to technicians, manages contractor invoicing, processes marketplace transactions, handles multi-party payment splits, and provides financial analytics—all while maintaining compliance and security.

## Core Philosophy

### Multi-Flow Payment Architecture
```
┌─────────────────────────────────────────────────────────────────┐
│                    FINANCIAL ECOSYSTEM                           │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    PAYMENT FLOWS                            │ │
│  │                                                             │ │
│  │  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    │ │
│  │  │  WORK ORDER │    │ MARKETPLACE │    │  CONTRACTOR │    │ │
│  │  │  PAYMENTS   │    │    ESCROW   │    │  INVOICING  │    │ │
│  │  │             │    │             │    │             │    │ │
│  │  │ Building →  │    │ Buyer →     │    │ Service →   │    │ │
│  │  │ Contractor  │    │ Escrow →    │    │ Invoice →   │    │ │
│  │  │             │    │ Seller      │    │ Payment     │    │ │
│  │  └─────────────┘    └─────────────┘    └─────────────┘    │ │
│  │                                                             │ │
│  │  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    │ │
│  │  │   INSTANT   │    │   PAYROLL   │    │ SUBSCRIPTION│    │ │
│  │  │   PAYOUT    │    │ INTEGRATION │    │   BILLING   │    │ │
│  │  │             │    │             │    │             │    │ │
│  │  │ Same-day    │    │ Sync with   │    │ Platform    │    │ │
│  │  │ tech pay    │    │ external    │    │ fees &      │    │ │
│  │  │             │    │ payroll     │    │ plans       │    │ │
│  │  └─────────────┘    └─────────────┘    └─────────────┘    │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    FINANCIAL TOOLS                          │ │
│  │                                                             │ │
│  │  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐  │ │
│  │  │ Analytics │ │ Tax Mgmt  │ │ Reporting │ │ Compliance│  │ │
│  │  └───────────┘ └───────────┘ └───────────┘ └───────────┘  │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Key Principles
1. **Security First** - PCI compliance, encryption, fraud detection
2. **Instant When Possible** - Same-day payouts for technicians
3. **Transparent Fees** - Clear fee structures, no hidden costs
4. **Multi-Party Support** - Split payments, holds, escrow
5. **Compliance Built-In** - Tax reporting, contractor 1099s, audit trails

---

## Data Models

### Enums and Types

```python
from enum import Enum
from decimal import Decimal
from datetime import datetime, date
from uuid import UUID
from pydantic import BaseModel, Field

class PaymentMethod(str, Enum):
    BANK_TRANSFER = "bank_transfer"      # ACH
    WIRE = "wire"
    CREDIT_CARD = "credit_card"
    DEBIT_CARD = "debit_card"
    INSTANT = "instant"                   # Instant payout (debit card)
    CHECK = "check"
    PLATFORM_BALANCE = "platform_balance"

class TransactionType(str, Enum):
    # Inbound
    DEPOSIT = "deposit"
    PAYMENT_RECEIVED = "payment_received"
    REFUND_RECEIVED = "refund_received"
    PAYOUT_REVERSAL = "payout_reversal"

    # Outbound
    PAYOUT = "payout"
    PAYMENT_SENT = "payment_sent"
    REFUND_SENT = "refund_sent"
    FEE = "fee"
    WITHDRAWAL = "withdrawal"

    # Internal
    TRANSFER = "transfer"
    HOLD = "hold"
    RELEASE = "release"
    ESCROW_FUND = "escrow_fund"
    ESCROW_RELEASE = "escrow_release"
    ESCROW_REFUND = "escrow_refund"

class TransactionStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"
    REVERSED = "reversed"
    DISPUTED = "disputed"

class InvoiceStatus(str, Enum):
    DRAFT = "draft"
    SENT = "sent"
    VIEWED = "viewed"
    PARTIAL = "partial"
    PAID = "paid"
    OVERDUE = "overdue"
    DISPUTED = "disputed"
    CANCELLED = "cancelled"
    WRITTEN_OFF = "written_off"

class PayoutSchedule(str, Enum):
    INSTANT = "instant"
    DAILY = "daily"
    WEEKLY = "weekly"
    BIWEEKLY = "biweekly"
    MONTHLY = "monthly"
    MANUAL = "manual"

class EscrowStatus(str, Enum):
    PENDING_FUNDING = "pending_funding"
    FUNDED = "funded"
    RELEASED = "released"
    DISPUTED = "disputed"
    REFUNDED = "refunded"
    PARTIAL_RELEASE = "partial_release"
    EXPIRED = "expired"

class DisputeReason(str, Enum):
    WORK_NOT_COMPLETED = "work_not_completed"
    POOR_QUALITY = "poor_quality"
    WRONG_PARTS = "wrong_parts"
    OVERCHARGE = "overcharge"
    NEVER_RECEIVED = "never_received"
    NOT_AS_DESCRIBED = "not_as_described"
    UNAUTHORIZED = "unauthorized"
    OTHER = "other"
```

### Core Financial Models

```python
class FinancialAccount(BaseModel):
    """Organization's financial account on platform"""
    id: UUID
    organization_id: UUID

    # Balance
    available_balance: Decimal = Decimal(0)
    pending_balance: Decimal = Decimal(0)  # Incoming, not yet available
    held_balance: Decimal = Decimal(0)     # Held for disputes/escrow
    currency: str = "USD"

    # Connected Accounts
    stripe_account_id: str | None  # Stripe Connect account
    stripe_account_status: str | None  # "pending", "active", "restricted"

    # Bank Accounts
    default_bank_account_id: UUID | None
    bank_accounts: list["BankAccount"] = []

    # Payout Settings
    payout_schedule: PayoutSchedule = PayoutSchedule.DAILY
    payout_day_of_week: int | None  # For weekly (0=Monday)
    payout_day_of_month: int | None  # For monthly
    minimum_payout: Decimal = Decimal("25.00")
    auto_payout_enabled: bool = True

    # Limits
    daily_limit: Decimal | None
    monthly_limit: Decimal | None
    per_transaction_limit: Decimal | None

    # Fees
    platform_fee_rate: Decimal = Decimal("0.025")  # 2.5% default
    instant_payout_fee_rate: Decimal = Decimal("0.01")  # 1% for instant

    # Verification
    verified: bool = False
    verification_status: str = "pending"  # "pending", "verified", "failed"
    tax_id_provided: bool = False
    w9_on_file: bool = False

    # Stats
    total_received: Decimal = Decimal(0)
    total_paid_out: Decimal = Decimal(0)
    total_fees_paid: Decimal = Decimal(0)

    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class BankAccount(BaseModel):
    """Linked bank account for payouts"""
    id: UUID
    financial_account_id: UUID

    # Account Info (tokenized via Stripe)
    stripe_bank_account_id: str
    last_four: str
    bank_name: str
    account_holder_name: str
    account_type: str  # "checking", "savings"

    # Routing
    routing_number_last_four: str
    country: str = "US"
    currency: str = "USD"

    # Status
    is_default: bool = False
    is_verified: bool = False
    verification_status: str  # "pending", "verified", "failed"

    # Instant Payout Eligibility
    instant_payout_eligible: bool = False

    created_at: datetime


class Transaction(BaseModel):
    """Financial transaction record"""
    id: UUID
    financial_account_id: UUID

    # Transaction Info
    transaction_type: TransactionType
    amount: Decimal
    currency: str = "USD"
    net_amount: Decimal  # After fees
    fee_amount: Decimal = Decimal(0)

    # Status
    status: TransactionStatus = TransactionStatus.PENDING
    status_message: str | None

    # References
    invoice_id: UUID | None
    work_order_id: UUID | None
    marketplace_transaction_id: UUID | None
    escrow_id: UUID | None
    related_transaction_id: UUID | None  # For reversals/refunds

    # Counterparty
    counterparty_type: str | None  # "organization", "user", "external"
    counterparty_id: UUID | None
    counterparty_name: str | None

    # Payment Details
    payment_method: PaymentMethod | None
    payment_method_id: UUID | None
    stripe_payment_intent_id: str | None
    stripe_transfer_id: str | None

    # Payout Details (if payout)
    payout_bank_account_id: UUID | None
    payout_arrival_date: date | None

    # Description
    description: str
    memo: str | None
    metadata: dict = {}

    # Timestamps
    initiated_at: datetime
    processed_at: datetime | None
    completed_at: datetime | None
    failed_at: datetime | None

    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class Invoice(BaseModel):
    """Invoice for work performed"""
    id: UUID
    organization_id: UUID  # Who's sending
    client_organization_id: UUID | None  # Who's receiving
    client_user_id: UUID | None  # If individual

    # Invoice Info
    invoice_number: str
    reference: str | None
    status: InvoiceStatus = InvoiceStatus.DRAFT

    # Dates
    invoice_date: date
    due_date: date
    sent_at: datetime | None
    paid_at: datetime | None

    # Related Work
    work_order_ids: list[UUID] = []
    contract_id: UUID | None

    # Line Items
    line_items: list["InvoiceLineItem"]
    subtotal: Decimal
    discount_amount: Decimal = Decimal(0)
    discount_reason: str | None
    tax_rate: Decimal = Decimal(0)
    tax_amount: Decimal = Decimal(0)
    total: Decimal
    currency: str = "USD"

    # Payment
    amount_paid: Decimal = Decimal(0)
    amount_due: Decimal  # total - amount_paid
    payment_terms: str | None  # "Net 30", etc.

    # Billing Details
    bill_to_name: str
    bill_to_address: str
    bill_to_email: str | None

    # Notes
    notes: str | None
    terms: str | None

    # Documents
    pdf_url: str | None

    # Reminders
    reminders_sent: int = 0
    last_reminder_at: datetime | None
    next_reminder_at: datetime | None

    created_by: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class InvoiceLineItem(BaseModel):
    """Line item on an invoice"""
    id: UUID
    invoice_id: UUID

    # Item Details
    description: str
    quantity: Decimal = Decimal(1)
    unit: str | None  # "hours", "units", etc.
    unit_price: Decimal
    total: Decimal

    # References
    work_order_id: UUID | None
    part_id: UUID | None

    # Taxable
    taxable: bool = True

    order_index: int


class Escrow(BaseModel):
    """Escrow for marketplace/job transactions"""
    id: UUID
    funder_account_id: UUID  # Who funds
    recipient_account_id: UUID  # Who receives

    # Transaction Reference
    reference_type: str  # "marketplace", "job", "contract"
    reference_id: UUID

    # Amounts
    amount: Decimal
    currency: str = "USD"
    platform_fee: Decimal
    net_to_recipient: Decimal

    # Status
    status: EscrowStatus = EscrowStatus.PENDING_FUNDING
    funded_at: datetime | None
    release_conditions: list[str] = []  # Conditions to be met
    conditions_met: list[str] = []

    # Release
    partial_releases: list[dict] = []  # For milestone-based
    released_amount: Decimal = Decimal(0)
    released_at: datetime | None
    released_by: UUID | None

    # Dispute
    disputed_at: datetime | None
    dispute_id: UUID | None

    # Expiry
    expires_at: datetime | None
    expired_at: datetime | None

    # Transactions
    funding_transaction_id: UUID | None
    release_transaction_id: UUID | None
    refund_transaction_id: UUID | None

    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PaymentDispute(BaseModel):
    """Payment dispute/chargeback"""
    id: UUID
    transaction_id: UUID
    escrow_id: UUID | None
    invoice_id: UUID | None

    # Parties
    filed_by_organization_id: UUID
    filed_by_user_id: UUID
    against_organization_id: UUID

    # Details
    reason: DisputeReason
    description: str
    amount_disputed: Decimal
    currency: str = "USD"

    # Evidence
    evidence: list[dict] = []  # {type, file_url, description}

    # Status
    status: str = "open"  # "open", "under_review", "resolved_for_filer", "resolved_against_filer", "escalated"

    # Resolution
    resolution: str | None
    resolution_amount: Decimal | None
    resolution_notes: str | None
    resolved_by: UUID | None
    resolved_at: datetime | None

    # Stripe
    stripe_dispute_id: str | None

    # Timeline
    response_deadline: datetime
    escalated_at: datetime | None

    created_at: datetime
    updated_at: datetime


class InstantPayoutRequest(BaseModel):
    """Request for instant payout to technician"""
    id: UUID
    user_id: UUID
    organization_id: UUID  # Employer

    # Amount
    requested_amount: Decimal
    fee_amount: Decimal  # Instant payout fee
    net_amount: Decimal
    currency: str = "USD"

    # Earnings Basis
    work_order_ids: list[UUID] = []  # Work orders being paid out
    total_earned: Decimal
    already_paid: Decimal
    available_for_payout: Decimal

    # Payout Destination
    payout_method: PaymentMethod
    bank_account_id: UUID | None
    debit_card_id: UUID | None

    # Status
    status: str = "pending"  # "pending", "approved", "processing", "completed", "failed", "denied"
    denial_reason: str | None

    # Approval
    requires_approval: bool = False
    approved_by: UUID | None
    approved_at: datetime | None

    # Processing
    stripe_payout_id: str | None
    arrival_date: date | None

    requested_at: datetime
    processed_at: datetime | None

    class Config:
        from_attributes = True


class RecurringPayment(BaseModel):
    """Scheduled recurring payment (subscriptions, contracts)"""
    id: UUID
    payer_account_id: UUID
    recipient_account_id: UUID

    # Schedule
    frequency: str  # "weekly", "monthly", "quarterly", "annually"
    next_payment_date: date
    last_payment_date: date | None
    day_of_month: int | None
    day_of_week: int | None

    # Amount
    amount: Decimal
    currency: str = "USD"

    # Reference
    reference_type: str  # "subscription", "contract", "service_agreement"
    reference_id: UUID

    # Payment Method
    payment_method_id: UUID

    # Status
    is_active: bool = True
    paused_at: datetime | None
    cancelled_at: datetime | None

    # Retry
    retry_count: int = 0
    max_retries: int = 3
    last_failure_reason: str | None

    # Notification
    notify_before_days: int = 3

    created_at: datetime
    updated_at: datetime


class PaymentMethod(BaseModel):
    """Stored payment method"""
    id: UUID
    organization_id: UUID | None
    user_id: UUID | None

    # Type
    type: str  # "card", "bank_account"
    stripe_payment_method_id: str

    # Card Details (if card)
    card_brand: str | None
    card_last_four: str | None
    card_exp_month: int | None
    card_exp_year: int | None

    # Bank Details (if bank)
    bank_name: str | None
    bank_last_four: str | None

    # Settings
    is_default: bool = False
    nickname: str | None

    # Billing
    billing_name: str | None
    billing_address: str | None

    created_at: datetime


class TechnicianEarnings(BaseModel):
    """Track technician earnings and payouts"""
    id: UUID
    user_id: UUID
    organization_id: UUID  # Employer

    # Period
    period_start: date
    period_end: date

    # Earnings
    total_earned: Decimal = Decimal(0)
    regular_hours: Decimal = Decimal(0)
    overtime_hours: Decimal = Decimal(0)
    regular_pay: Decimal = Decimal(0)
    overtime_pay: Decimal = Decimal(0)
    bonus_pay: Decimal = Decimal(0)
    tips: Decimal = Decimal(0)

    # Work
    work_orders_completed: int = 0
    work_order_ids: list[UUID] = []

    # Deductions
    deductions: list[dict] = []
    total_deductions: Decimal = Decimal(0)

    # Net
    net_earnings: Decimal

    # Payouts
    amount_paid: Decimal = Decimal(0)
    amount_pending: Decimal = Decimal(0)
    available_for_instant: Decimal = Decimal(0)

    # Status
    status: str = "active"  # "active", "finalized", "paid"
    finalized_at: datetime | None
    paid_at: datetime | None

    created_at: datetime
    updated_at: datetime
```

---

## Database Schema

```sql
-- Financial accounts
CREATE TABLE financial_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) UNIQUE,

    available_balance DECIMAL(14, 2) DEFAULT 0,
    pending_balance DECIMAL(14, 2) DEFAULT 0,
    held_balance DECIMAL(14, 2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'USD',

    stripe_account_id VARCHAR(100) UNIQUE,
    stripe_account_status VARCHAR(30),

    default_bank_account_id UUID,

    payout_schedule VARCHAR(20) DEFAULT 'daily',
    payout_day_of_week INTEGER CHECK (payout_day_of_week BETWEEN 0 AND 6),
    payout_day_of_month INTEGER CHECK (payout_day_of_month BETWEEN 1 AND 28),
    minimum_payout DECIMAL(10, 2) DEFAULT 25.00,
    auto_payout_enabled BOOLEAN DEFAULT TRUE,

    daily_limit DECIMAL(14, 2),
    monthly_limit DECIMAL(14, 2),
    per_transaction_limit DECIMAL(14, 2),

    platform_fee_rate DECIMAL(5, 4) DEFAULT 0.0250,
    instant_payout_fee_rate DECIMAL(5, 4) DEFAULT 0.0100,

    verified BOOLEAN DEFAULT FALSE,
    verification_status VARCHAR(30) DEFAULT 'pending',
    tax_id_provided BOOLEAN DEFAULT FALSE,
    w9_on_file BOOLEAN DEFAULT FALSE,

    total_received DECIMAL(14, 2) DEFAULT 0,
    total_paid_out DECIMAL(14, 2) DEFAULT 0,
    total_fees_paid DECIMAL(14, 2) DEFAULT 0,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT positive_balances CHECK (
        available_balance >= 0 AND
        pending_balance >= 0 AND
        held_balance >= 0
    )
);

CREATE INDEX idx_financial_accounts_stripe ON financial_accounts(stripe_account_id);


-- Bank accounts
CREATE TABLE bank_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    financial_account_id UUID NOT NULL REFERENCES financial_accounts(id) ON DELETE CASCADE,

    stripe_bank_account_id VARCHAR(100) NOT NULL,
    last_four VARCHAR(4) NOT NULL,
    bank_name VARCHAR(100),
    account_holder_name VARCHAR(200),
    account_type VARCHAR(20),

    routing_number_last_four VARCHAR(4),
    country VARCHAR(2) DEFAULT 'US',
    currency VARCHAR(3) DEFAULT 'USD',

    is_default BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_status VARCHAR(30) DEFAULT 'pending',

    instant_payout_eligible BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bank_accounts_financial ON bank_accounts(financial_account_id);


-- Transactions
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    financial_account_id UUID NOT NULL REFERENCES financial_accounts(id),

    transaction_type VARCHAR(30) NOT NULL,
    amount DECIMAL(14, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    net_amount DECIMAL(14, 2) NOT NULL,
    fee_amount DECIMAL(10, 2) DEFAULT 0,

    status VARCHAR(20) DEFAULT 'pending',
    status_message TEXT,

    invoice_id UUID REFERENCES invoices(id),
    work_order_id UUID REFERENCES work_orders(id),
    marketplace_transaction_id UUID REFERENCES part_transactions(id),
    escrow_id UUID REFERENCES escrows(id),
    related_transaction_id UUID REFERENCES transactions(id),

    counterparty_type VARCHAR(30),
    counterparty_id UUID,
    counterparty_name VARCHAR(200),

    payment_method VARCHAR(30),
    payment_method_id UUID REFERENCES payment_methods(id),
    stripe_payment_intent_id VARCHAR(100),
    stripe_transfer_id VARCHAR(100),

    payout_bank_account_id UUID REFERENCES bank_accounts(id),
    payout_arrival_date DATE,

    description TEXT NOT NULL,
    memo TEXT,
    metadata JSONB DEFAULT '{}',

    initiated_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    failed_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_transactions_account ON transactions(financial_account_id);
CREATE INDEX idx_transactions_type ON transactions(transaction_type);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_date ON transactions(initiated_at DESC);
CREATE INDEX idx_transactions_invoice ON transactions(invoice_id);
CREATE INDEX idx_transactions_work_order ON transactions(work_order_id);
CREATE INDEX idx_transactions_stripe_pi ON transactions(stripe_payment_intent_id);


-- Invoices
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    client_organization_id UUID REFERENCES organizations(id),
    client_user_id UUID REFERENCES users(id),

    invoice_number VARCHAR(50) NOT NULL,
    reference VARCHAR(100),
    status VARCHAR(20) DEFAULT 'draft',

    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    sent_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,

    work_order_ids JSONB DEFAULT '[]',
    contract_id UUID REFERENCES contracts(id),

    subtotal DECIMAL(14, 2) NOT NULL,
    discount_amount DECIMAL(12, 2) DEFAULT 0,
    discount_reason VARCHAR(200),
    tax_rate DECIMAL(5, 4) DEFAULT 0,
    tax_amount DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(14, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',

    amount_paid DECIMAL(14, 2) DEFAULT 0,
    amount_due DECIMAL(14, 2) GENERATED ALWAYS AS (total - amount_paid) STORED,
    payment_terms VARCHAR(50),

    bill_to_name VARCHAR(200) NOT NULL,
    bill_to_address TEXT,
    bill_to_email VARCHAR(255),

    notes TEXT,
    terms TEXT,

    pdf_url VARCHAR(500),

    reminders_sent INTEGER DEFAULT 0,
    last_reminder_at TIMESTAMPTZ,
    next_reminder_at TIMESTAMPTZ,

    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT unique_invoice_number UNIQUE(organization_id, invoice_number),
    CONSTRAINT valid_dates CHECK (due_date >= invoice_date)
);

CREATE INDEX idx_invoices_org ON invoices(organization_id);
CREATE INDEX idx_invoices_client ON invoices(client_organization_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_due ON invoices(due_date) WHERE status NOT IN ('paid', 'cancelled');


-- Invoice line items
CREATE TABLE invoice_line_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,

    description TEXT NOT NULL,
    quantity DECIMAL(10, 3) DEFAULT 1,
    unit VARCHAR(30),
    unit_price DECIMAL(12, 2) NOT NULL,
    total DECIMAL(12, 2) NOT NULL,

    work_order_id UUID REFERENCES work_orders(id),
    part_id UUID REFERENCES parts_catalog(id),

    taxable BOOLEAN DEFAULT TRUE,
    order_index INTEGER NOT NULL
);

CREATE INDEX idx_invoice_items_invoice ON invoice_line_items(invoice_id);


-- Escrows
CREATE TABLE escrows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    funder_account_id UUID NOT NULL REFERENCES financial_accounts(id),
    recipient_account_id UUID NOT NULL REFERENCES financial_accounts(id),

    reference_type VARCHAR(30) NOT NULL,
    reference_id UUID NOT NULL,

    amount DECIMAL(14, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    platform_fee DECIMAL(10, 2) NOT NULL,
    net_to_recipient DECIMAL(14, 2) NOT NULL,

    status VARCHAR(30) DEFAULT 'pending_funding',
    funded_at TIMESTAMPTZ,
    release_conditions JSONB DEFAULT '[]',
    conditions_met JSONB DEFAULT '[]',

    partial_releases JSONB DEFAULT '[]',
    released_amount DECIMAL(14, 2) DEFAULT 0,
    released_at TIMESTAMPTZ,
    released_by UUID REFERENCES users(id),

    disputed_at TIMESTAMPTZ,
    dispute_id UUID,

    expires_at TIMESTAMPTZ,
    expired_at TIMESTAMPTZ,

    funding_transaction_id UUID REFERENCES transactions(id),
    release_transaction_id UUID REFERENCES transactions(id),
    refund_transaction_id UUID REFERENCES transactions(id),

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT valid_amounts CHECK (
        amount > 0 AND
        net_to_recipient <= amount AND
        released_amount <= amount
    )
);

CREATE INDEX idx_escrows_funder ON escrows(funder_account_id);
CREATE INDEX idx_escrows_recipient ON escrows(recipient_account_id);
CREATE INDEX idx_escrows_status ON escrows(status);
CREATE INDEX idx_escrows_reference ON escrows(reference_type, reference_id);


-- Payment disputes
CREATE TABLE payment_disputes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID REFERENCES transactions(id),
    escrow_id UUID REFERENCES escrows(id),
    invoice_id UUID REFERENCES invoices(id),

    filed_by_organization_id UUID NOT NULL REFERENCES organizations(id),
    filed_by_user_id UUID NOT NULL REFERENCES users(id),
    against_organization_id UUID NOT NULL REFERENCES organizations(id),

    reason VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    amount_disputed DECIMAL(14, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',

    evidence JSONB DEFAULT '[]',

    status VARCHAR(30) DEFAULT 'open',

    resolution VARCHAR(50),
    resolution_amount DECIMAL(14, 2),
    resolution_notes TEXT,
    resolved_by UUID REFERENCES users(id),
    resolved_at TIMESTAMPTZ,

    stripe_dispute_id VARCHAR(100),

    response_deadline TIMESTAMPTZ NOT NULL,
    escalated_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_disputes_filed_by ON payment_disputes(filed_by_organization_id);
CREATE INDEX idx_disputes_against ON payment_disputes(against_organization_id);
CREATE INDEX idx_disputes_status ON payment_disputes(status);


-- Instant payout requests
CREATE TABLE instant_payout_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    organization_id UUID NOT NULL REFERENCES organizations(id),

    requested_amount DECIMAL(14, 2) NOT NULL,
    fee_amount DECIMAL(10, 2) NOT NULL,
    net_amount DECIMAL(14, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',

    work_order_ids JSONB DEFAULT '[]',
    total_earned DECIMAL(14, 2),
    already_paid DECIMAL(14, 2),
    available_for_payout DECIMAL(14, 2),

    payout_method VARCHAR(30) NOT NULL,
    bank_account_id UUID REFERENCES bank_accounts(id),
    debit_card_id UUID REFERENCES payment_methods(id),

    status VARCHAR(20) DEFAULT 'pending',
    denial_reason TEXT,

    requires_approval BOOLEAN DEFAULT FALSE,
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMPTZ,

    stripe_payout_id VARCHAR(100),
    arrival_date DATE,

    requested_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);

CREATE INDEX idx_instant_payouts_user ON instant_payout_requests(user_id);
CREATE INDEX idx_instant_payouts_org ON instant_payout_requests(organization_id);
CREATE INDEX idx_instant_payouts_status ON instant_payout_requests(status);


-- Recurring payments
CREATE TABLE recurring_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payer_account_id UUID NOT NULL REFERENCES financial_accounts(id),
    recipient_account_id UUID NOT NULL REFERENCES financial_accounts(id),

    frequency VARCHAR(20) NOT NULL,
    next_payment_date DATE NOT NULL,
    last_payment_date DATE,
    day_of_month INTEGER,
    day_of_week INTEGER,

    amount DECIMAL(14, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',

    reference_type VARCHAR(30),
    reference_id UUID,

    payment_method_id UUID REFERENCES payment_methods(id),

    is_active BOOLEAN DEFAULT TRUE,
    paused_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,

    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    last_failure_reason TEXT,

    notify_before_days INTEGER DEFAULT 3,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_recurring_payer ON recurring_payments(payer_account_id);
CREATE INDEX idx_recurring_next ON recurring_payments(next_payment_date) WHERE is_active = TRUE;


-- Payment methods
CREATE TABLE payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    user_id UUID REFERENCES users(id),

    type VARCHAR(20) NOT NULL,
    stripe_payment_method_id VARCHAR(100) NOT NULL,

    card_brand VARCHAR(20),
    card_last_four VARCHAR(4),
    card_exp_month INTEGER,
    card_exp_year INTEGER,

    bank_name VARCHAR(100),
    bank_last_four VARCHAR(4),

    is_default BOOLEAN DEFAULT FALSE,
    nickname VARCHAR(50),

    billing_name VARCHAR(200),
    billing_address TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT owner_required CHECK (
        organization_id IS NOT NULL OR user_id IS NOT NULL
    )
);

CREATE INDEX idx_payment_methods_org ON payment_methods(organization_id);
CREATE INDEX idx_payment_methods_user ON payment_methods(user_id);


-- Technician earnings
CREATE TABLE technician_earnings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    organization_id UUID NOT NULL REFERENCES organizations(id),

    period_start DATE NOT NULL,
    period_end DATE NOT NULL,

    total_earned DECIMAL(14, 2) DEFAULT 0,
    regular_hours DECIMAL(8, 2) DEFAULT 0,
    overtime_hours DECIMAL(8, 2) DEFAULT 0,
    regular_pay DECIMAL(14, 2) DEFAULT 0,
    overtime_pay DECIMAL(14, 2) DEFAULT 0,
    bonus_pay DECIMAL(14, 2) DEFAULT 0,
    tips DECIMAL(10, 2) DEFAULT 0,

    work_orders_completed INTEGER DEFAULT 0,
    work_order_ids JSONB DEFAULT '[]',

    deductions JSONB DEFAULT '[]',
    total_deductions DECIMAL(14, 2) DEFAULT 0,

    net_earnings DECIMAL(14, 2) GENERATED ALWAYS AS (total_earned - total_deductions) STORED,

    amount_paid DECIMAL(14, 2) DEFAULT 0,
    amount_pending DECIMAL(14, 2) DEFAULT 0,
    available_for_instant DECIMAL(14, 2) DEFAULT 0,

    status VARCHAR(20) DEFAULT 'active',
    finalized_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT unique_period UNIQUE(user_id, organization_id, period_start, period_end),
    CONSTRAINT valid_period CHECK (period_end >= period_start)
);

CREATE INDEX idx_earnings_user ON technician_earnings(user_id);
CREATE INDEX idx_earnings_org ON technician_earnings(organization_id);
CREATE INDEX idx_earnings_period ON technician_earnings(period_start, period_end);
CREATE INDEX idx_earnings_status ON technician_earnings(status);


-- Tax documents (1099s, W-9s)
CREATE TABLE tax_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    user_id UUID REFERENCES users(id),

    document_type VARCHAR(30) NOT NULL,  -- "1099_nec", "1099_misc", "w9"
    tax_year INTEGER NOT NULL,

    -- 1099 specific
    recipient_name VARCHAR(200),
    recipient_tin_last_four VARCHAR(4),
    amount DECIMAL(14, 2),
    box_description VARCHAR(100),

    -- W-9 specific
    business_name VARCHAR(200),
    tax_classification VARCHAR(50),
    tin_type VARCHAR(20),  -- "ssn", "ein"

    status VARCHAR(20) DEFAULT 'pending',  -- "pending", "generated", "sent", "confirmed"
    generated_at TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    confirmed_at TIMESTAMPTZ,

    pdf_url VARCHAR(500),

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tax_docs_org ON tax_documents(organization_id);
CREATE INDEX idx_tax_docs_year ON tax_documents(tax_year);
CREATE INDEX idx_tax_docs_type ON tax_documents(document_type);
```

---

## API Design

### Financial Accounts

```python
from fastapi import APIRouter, Depends, Query, BackgroundTasks
from typing import Annotated

router = APIRouter(prefix="/api/v1/finance", tags=["finance"])


# ============ Account Management ============

@router.get("/account", response_model=FinancialAccountResponse)
async def get_financial_account(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> FinancialAccountResponse:
    """Get organization's financial account"""
    pass


@router.post("/account/setup", response_model=AccountSetupResponse)
async def setup_financial_account(
    setup: AccountSetupRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> AccountSetupResponse:
    """Set up Stripe Connect account"""
    pass


@router.get("/account/onboarding-link")
async def get_onboarding_link(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> dict:
    """Get Stripe Connect onboarding link"""
    pass


@router.patch("/account/settings", response_model=FinancialAccountResponse)
async def update_account_settings(
    settings: AccountSettingsUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> FinancialAccountResponse:
    """Update payout settings"""
    pass


# ============ Bank Accounts ============

@router.get("/bank-accounts", response_model=list[BankAccountResponse])
async def get_bank_accounts(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> list[BankAccountResponse]:
    """Get linked bank accounts"""
    pass


@router.post("/bank-accounts", response_model=BankAccountResponse, status_code=201)
async def add_bank_account(
    bank_account: BankAccountCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> BankAccountResponse:
    """Add a bank account"""
    pass


@router.delete("/bank-accounts/{account_id}")
async def remove_bank_account(
    account_id: UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> dict:
    """Remove a bank account"""
    pass


@router.post("/bank-accounts/{account_id}/set-default")
async def set_default_bank_account(
    account_id: UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> dict:
    """Set as default bank account"""
    pass


# ============ Transactions ============

@router.get("/transactions", response_model=TransactionListResponse)
async def get_transactions(
    transaction_type: list[TransactionType] | None = Query(None),
    status: list[TransactionStatus] | None = Query(None),
    date_from: date | None = None,
    date_to: date | None = None,
    page: int = 1,
    page_size: int = 50,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> TransactionListResponse:
    """Get transaction history"""
    pass


@router.get("/transactions/{transaction_id}", response_model=TransactionDetail)
async def get_transaction(
    transaction_id: UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> TransactionDetail:
    """Get transaction details"""
    pass


@router.get("/transactions/summary", response_model=TransactionSummary)
async def get_transaction_summary(
    period: str = Query("month"),  # "week", "month", "quarter", "year"
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> TransactionSummary:
    """Get transaction summary/analytics"""
    pass


# ============ Payouts ============

@router.post("/payouts", response_model=PayoutResponse, status_code=201)
async def initiate_payout(
    payout: PayoutRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> PayoutResponse:
    """Initiate a payout to bank account"""
    pass


@router.get("/payouts", response_model=list[PayoutSummary])
async def get_payouts(
    status: str | None = None,
    date_from: date | None = None,
    date_to: date | None = None,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> list[PayoutSummary]:
    """Get payout history"""
    pass
```

### Invoicing

```python
router_invoices = APIRouter(prefix="/api/v1/invoices", tags=["invoices"])


@router_invoices.get("/", response_model=InvoiceListResponse)
async def get_invoices(
    status: list[InvoiceStatus] | None = Query(None),
    client_id: UUID | None = None,
    date_from: date | None = None,
    date_to: date | None = None,
    overdue_only: bool = False,
    page: int = 1,
    page_size: int = 20,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> InvoiceListResponse:
    """Get invoices"""
    pass


@router_invoices.post("/", response_model=InvoiceResponse, status_code=201)
async def create_invoice(
    invoice: InvoiceCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> InvoiceResponse:
    """Create an invoice"""
    pass


@router_invoices.post("/from-work-orders", response_model=InvoiceResponse, status_code=201)
async def create_invoice_from_work_orders(
    work_order_ids: list[UUID],
    client_id: UUID,
    due_days: int = 30,
    notes: str | None = None,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> InvoiceResponse:
    """Create invoice from completed work orders"""
    pass


@router_invoices.get("/{invoice_id}", response_model=InvoiceDetail)
async def get_invoice(
    invoice_id: UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> InvoiceDetail:
    """Get invoice details"""
    pass


@router_invoices.patch("/{invoice_id}", response_model=InvoiceResponse)
async def update_invoice(
    invoice_id: UUID,
    updates: InvoiceUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> InvoiceResponse:
    """Update invoice (draft only)"""
    pass


@router_invoices.post("/{invoice_id}/send")
async def send_invoice(
    invoice_id: UUID,
    email_to: str | None = None,
    message: str | None = None,
    background_tasks: BackgroundTasks = None,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> dict:
    """Send invoice to client"""
    pass


@router_invoices.get("/{invoice_id}/pdf")
async def get_invoice_pdf(
    invoice_id: UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> FileResponse:
    """Download invoice PDF"""
    pass


@router_invoices.post("/{invoice_id}/pay")
async def pay_invoice(
    invoice_id: UUID,
    payment: InvoicePayment,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> TransactionResponse:
    """Pay an invoice"""
    pass


@router_invoices.post("/{invoice_id}/record-payment")
async def record_manual_payment(
    invoice_id: UUID,
    payment: ManualPaymentRecord,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> dict:
    """Record offline payment (check, wire, etc.)"""
    pass


@router_invoices.post("/{invoice_id}/send-reminder")
async def send_payment_reminder(
    invoice_id: UUID,
    message: str | None = None,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> dict:
    """Send payment reminder"""
    pass
```

### Escrow & Marketplace Payments

```python
router_escrow = APIRouter(prefix="/api/v1/escrow", tags=["escrow"])


@router_escrow.post("/", response_model=EscrowResponse, status_code=201)
async def create_escrow(
    escrow: EscrowCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> EscrowResponse:
    """Create an escrow for a transaction"""
    pass


@router_escrow.get("/{escrow_id}", response_model=EscrowDetail)
async def get_escrow(
    escrow_id: UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> EscrowDetail:
    """Get escrow details"""
    pass


@router_escrow.post("/{escrow_id}/fund")
async def fund_escrow(
    escrow_id: UUID,
    payment_method_id: UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> TransactionResponse:
    """Fund an escrow"""
    pass


@router_escrow.post("/{escrow_id}/release")
async def release_escrow(
    escrow_id: UUID,
    amount: Decimal | None = None,  # Partial release
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> dict:
    """Release escrow to recipient"""
    pass


@router_escrow.post("/{escrow_id}/dispute")
async def dispute_escrow(
    escrow_id: UUID,
    dispute: DisputeCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> DisputeResponse:
    """Dispute an escrow transaction"""
    pass


@router_escrow.post("/{escrow_id}/refund")
async def refund_escrow(
    escrow_id: UUID,
    reason: str,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> dict:
    """Refund escrow to funder"""
    pass
```

### Instant Payouts (Technicians)

```python
router_instant = APIRouter(prefix="/api/v1/instant-pay", tags=["instant-pay"])


@router_instant.get("/eligibility", response_model=InstantPayEligibility)
async def check_eligibility(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> InstantPayEligibility:
    """Check instant payout eligibility"""
    pass


@router_instant.get("/available", response_model=AvailableEarnings)
async def get_available_earnings(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> AvailableEarnings:
    """Get available earnings for instant payout"""
    pass


@router_instant.post("/request", response_model=InstantPayoutResponse, status_code=201)
async def request_instant_payout(
    request: InstantPayoutCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> InstantPayoutResponse:
    """Request instant payout"""
    pass


@router_instant.get("/history", response_model=list[InstantPayoutSummary])
async def get_instant_payout_history(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> list[InstantPayoutSummary]:
    """Get instant payout history"""
    pass


# Employer endpoints
@router_instant.get("/pending", response_model=list[InstantPayoutPending])
async def get_pending_requests(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> list[InstantPayoutPending]:
    """Get pending instant payout requests (employer)"""
    pass


@router_instant.post("/{request_id}/approve")
async def approve_instant_payout(
    request_id: UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> dict:
    """Approve instant payout request"""
    pass


@router_instant.post("/{request_id}/deny")
async def deny_instant_payout(
    request_id: UUID,
    reason: str,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> dict:
    """Deny instant payout request"""
    pass


# ============ Technician Earnings ============

@router_instant.get("/earnings", response_model=list[EarningsPeriod])
async def get_earnings(
    period_start: date | None = None,
    period_end: date | None = None,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> list[EarningsPeriod]:
    """Get earnings history"""
    pass


@router_instant.get("/earnings/current", response_model=CurrentEarnings)
async def get_current_earnings(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> CurrentEarnings:
    """Get current period earnings"""
    pass
```

### Disputes

```python
router_disputes = APIRouter(prefix="/api/v1/disputes", tags=["disputes"])


@router_disputes.get("/", response_model=list[DisputeSummary])
async def get_disputes(
    status: str | None = None,
    role: str = Query("all"),  # "filed", "against", "all"
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> list[DisputeSummary]:
    """Get disputes"""
    pass


@router_disputes.get("/{dispute_id}", response_model=DisputeDetail)
async def get_dispute(
    dispute_id: UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> DisputeDetail:
    """Get dispute details"""
    pass


@router_disputes.post("/{dispute_id}/respond")
async def respond_to_dispute(
    dispute_id: UUID,
    response: DisputeResponse,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> dict:
    """Respond to a dispute"""
    pass


@router_disputes.post("/{dispute_id}/evidence")
async def add_evidence(
    dispute_id: UUID,
    evidence: UploadFile = File(...),
    description: str = None,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> dict:
    """Add evidence to dispute"""
    pass


@router_disputes.post("/{dispute_id}/escalate")
async def escalate_dispute(
    dispute_id: UUID,
    reason: str,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> dict:
    """Escalate dispute to platform"""
    pass
```

---

## Payment Processing Service

### Stripe Integration

```python
import stripe
from typing import TypedDict

class StripeService:
    """Stripe payment processing"""

    def __init__(self, api_key: str):
        stripe.api_key = api_key

    async def create_connect_account(
        self,
        organization: Organization
    ) -> str:
        """Create Stripe Connect account for organization"""

        account = stripe.Account.create(
            type="express",
            country="US",
            email=organization.email,
            business_type="company",
            company={
                "name": organization.name,
            },
            capabilities={
                "card_payments": {"requested": True},
                "transfers": {"requested": True},
            },
            metadata={
                "organization_id": str(organization.id)
            }
        )

        return account.id

    async def create_onboarding_link(
        self,
        account_id: str,
        return_url: str,
        refresh_url: str
    ) -> str:
        """Create account onboarding link"""

        link = stripe.AccountLink.create(
            account=account_id,
            refresh_url=refresh_url,
            return_url=return_url,
            type="account_onboarding"
        )

        return link.url

    async def create_payment_intent(
        self,
        amount: Decimal,
        currency: str,
        customer_id: str | None,
        payment_method_id: str | None,
        transfer_destination: str | None,  # Connected account
        application_fee: Decimal | None,
        metadata: dict | None = None
    ) -> stripe.PaymentIntent:
        """Create payment intent"""

        params = {
            "amount": int(amount * 100),  # Convert to cents
            "currency": currency.lower(),
            "metadata": metadata or {}
        }

        if customer_id:
            params["customer"] = customer_id

        if payment_method_id:
            params["payment_method"] = payment_method_id
            params["confirm"] = True

        if transfer_destination:
            params["transfer_data"] = {
                "destination": transfer_destination
            }
            if application_fee:
                params["application_fee_amount"] = int(application_fee * 100)

        return stripe.PaymentIntent.create(**params)

    async def create_payout(
        self,
        account_id: str,
        amount: Decimal,
        currency: str,
        destination: str,  # Bank account or card ID
        method: str = "standard",  # "standard" or "instant"
        metadata: dict | None = None
    ) -> stripe.Payout:
        """Create payout to connected account's bank"""

        return stripe.Payout.create(
            amount=int(amount * 100),
            currency=currency.lower(),
            destination=destination,
            method=method,
            metadata=metadata or {},
            stripe_account=account_id
        )

    async def create_transfer(
        self,
        amount: Decimal,
        currency: str,
        destination: str,  # Connected account ID
        metadata: dict | None = None
    ) -> stripe.Transfer:
        """Transfer funds to connected account"""

        return stripe.Transfer.create(
            amount=int(amount * 100),
            currency=currency.lower(),
            destination=destination,
            metadata=metadata or {}
        )

    async def create_refund(
        self,
        payment_intent_id: str,
        amount: Decimal | None = None,
        reason: str | None = None
    ) -> stripe.Refund:
        """Refund a payment"""

        params = {"payment_intent": payment_intent_id}

        if amount:
            params["amount"] = int(amount * 100)

        if reason:
            params["reason"] = reason

        return stripe.Refund.create(**params)


class EscrowService:
    """Manage escrow transactions"""

    def __init__(
        self,
        db: AsyncSession,
        stripe_service: StripeService
    ):
        self.db = db
        self.stripe = stripe_service

    async def create_escrow(
        self,
        funder_account: FinancialAccount,
        recipient_account: FinancialAccount,
        amount: Decimal,
        reference_type: str,
        reference_id: UUID,
        release_conditions: list[str] | None = None
    ) -> Escrow:
        """Create an escrow transaction"""

        platform_fee = amount * funder_account.platform_fee_rate
        net_to_recipient = amount - platform_fee

        escrow = Escrow(
            funder_account_id=funder_account.id,
            recipient_account_id=recipient_account.id,
            amount=amount,
            platform_fee=platform_fee,
            net_to_recipient=net_to_recipient,
            reference_type=reference_type,
            reference_id=reference_id,
            release_conditions=release_conditions or [],
            expires_at=datetime.now() + timedelta(days=30)  # 30 day default
        )

        await self._save(escrow)
        return escrow

    async def fund_escrow(
        self,
        escrow: Escrow,
        payment_method_id: str
    ) -> Transaction:
        """Fund an escrow with payment"""

        funder_account = await self._get_account(escrow.funder_account_id)

        # Create payment intent
        payment_intent = await self.stripe.create_payment_intent(
            amount=escrow.amount,
            currency=escrow.currency,
            payment_method_id=payment_method_id,
            customer_id=funder_account.stripe_customer_id,
            metadata={
                "escrow_id": str(escrow.id),
                "type": "escrow_funding"
            }
        )

        # Create transaction record
        transaction = Transaction(
            financial_account_id=funder_account.id,
            transaction_type=TransactionType.ESCROW_FUND,
            amount=escrow.amount,
            net_amount=escrow.amount,
            escrow_id=escrow.id,
            payment_method=PaymentMethod.CREDIT_CARD,
            stripe_payment_intent_id=payment_intent.id,
            description=f"Escrow funding for {escrow.reference_type}",
            status=TransactionStatus.PROCESSING
        )

        await self._save(transaction)

        # Update escrow status
        escrow.status = EscrowStatus.FUNDED
        escrow.funded_at = datetime.now()
        escrow.funding_transaction_id = transaction.id
        await self._save(escrow)

        return transaction

    async def release_escrow(
        self,
        escrow: Escrow,
        amount: Decimal | None = None,
        released_by: UUID | None = None
    ) -> Transaction:
        """Release escrow funds to recipient"""

        if escrow.status not in [EscrowStatus.FUNDED, EscrowStatus.PARTIAL_RELEASE]:
            raise ValueError("Escrow is not in a releasable state")

        release_amount = amount or (escrow.amount - escrow.released_amount)
        recipient_account = await self._get_account(escrow.recipient_account_id)

        # Calculate proportional fee
        fee_proportion = release_amount / escrow.amount
        fee_amount = escrow.platform_fee * fee_proportion
        net_amount = release_amount - fee_amount

        # Transfer to recipient's connected account
        transfer = await self.stripe.create_transfer(
            amount=net_amount,
            currency=escrow.currency,
            destination=recipient_account.stripe_account_id,
            metadata={
                "escrow_id": str(escrow.id),
                "type": "escrow_release"
            }
        )

        # Create transaction
        transaction = Transaction(
            financial_account_id=recipient_account.id,
            transaction_type=TransactionType.ESCROW_RELEASE,
            amount=release_amount,
            net_amount=net_amount,
            fee_amount=fee_amount,
            escrow_id=escrow.id,
            stripe_transfer_id=transfer.id,
            description=f"Escrow release for {escrow.reference_type}",
            status=TransactionStatus.COMPLETED,
            completed_at=datetime.now()
        )

        await self._save(transaction)

        # Update escrow
        escrow.released_amount += release_amount
        if escrow.released_amount >= escrow.amount:
            escrow.status = EscrowStatus.RELEASED
            escrow.released_at = datetime.now()
        else:
            escrow.status = EscrowStatus.PARTIAL_RELEASE
            escrow.partial_releases.append({
                "amount": str(release_amount),
                "released_at": datetime.now().isoformat()
            })

        escrow.released_by = released_by
        escrow.release_transaction_id = transaction.id
        await self._save(escrow)

        # Update recipient balance
        recipient_account.available_balance += net_amount
        await self._save(recipient_account)

        return transaction


class InstantPayService:
    """Instant payout service for technicians"""

    def __init__(
        self,
        db: AsyncSession,
        stripe_service: StripeService
    ):
        self.db = db
        self.stripe = stripe_service

    async def get_available_earnings(
        self,
        user_id: UUID,
        organization_id: UUID
    ) -> AvailableEarnings:
        """Get earnings available for instant payout"""

        # Get current earnings period
        earnings = await self._get_current_earnings(user_id, organization_id)

        if not earnings:
            return AvailableEarnings(
                total_earned=Decimal(0),
                already_paid=Decimal(0),
                pending=Decimal(0),
                available=Decimal(0)
            )

        # Calculate available (typically % of earned, not yet paid)
        available_percent = Decimal("0.70")  # 70% available immediately
        available = (earnings.net_earnings - earnings.amount_paid) * available_percent

        return AvailableEarnings(
            total_earned=earnings.total_earned,
            already_paid=earnings.amount_paid,
            pending=earnings.amount_pending,
            available=max(Decimal(0), available),
            work_orders_included=len(earnings.work_order_ids)
        )

    async def request_instant_payout(
        self,
        user_id: UUID,
        organization_id: UUID,
        amount: Decimal,
        payout_method_id: UUID
    ) -> InstantPayoutRequest:
        """Request instant payout"""

        # Validate available amount
        available = await self.get_available_earnings(user_id, organization_id)
        if amount > available.available:
            raise ValueError(f"Requested amount exceeds available ({available.available})")

        # Get payout destination
        payout_method = await self._get_payout_method(payout_method_id)

        # Calculate fee
        org_account = await self._get_org_account(organization_id)
        fee = amount * org_account.instant_payout_fee_rate
        net = amount - fee

        # Check if approval required
        requires_approval = await self._check_requires_approval(organization_id, amount)

        request = InstantPayoutRequest(
            user_id=user_id,
            organization_id=organization_id,
            requested_amount=amount,
            fee_amount=fee,
            net_amount=net,
            payout_method=PaymentMethod.INSTANT,
            bank_account_id=payout_method.id if payout_method.type == 'bank' else None,
            debit_card_id=payout_method.id if payout_method.type == 'card' else None,
            requires_approval=requires_approval,
            total_earned=available.total_earned,
            already_paid=available.already_paid,
            available_for_payout=available.available
        )

        await self._save(request)

        # If no approval needed, process immediately
        if not requires_approval:
            await self.process_instant_payout(request)

        return request

    async def process_instant_payout(
        self,
        request: InstantPayoutRequest
    ):
        """Process an instant payout"""

        user = await self._get_user(request.user_id)
        payout_dest = await self._get_payout_destination(request)

        try:
            # Create instant payout via Stripe
            payout = await self.stripe.create_payout(
                account_id=user.stripe_account_id,
                amount=request.net_amount,
                currency="USD",
                destination=payout_dest.stripe_id,
                method="instant",
                metadata={
                    "request_id": str(request.id),
                    "user_id": str(request.user_id)
                }
            )

            request.status = "completed"
            request.stripe_payout_id = payout.id
            request.arrival_date = date.today()  # Instant
            request.processed_at = datetime.now()

            # Update earnings
            await self._update_earnings_paid(
                request.user_id,
                request.organization_id,
                request.requested_amount
            )

        except stripe.error.StripeError as e:
            request.status = "failed"
            request.denial_reason = str(e)

        await self._save(request)
```

---

## Invoice Generation

```python
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph
from reportlab.lib.styles import getSampleStyleSheet


class InvoiceGenerator:
    """Generate PDF invoices"""

    async def generate_pdf(
        self,
        invoice: Invoice,
        organization: Organization
    ) -> bytes:
        """Generate invoice PDF"""

        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        styles = getSampleStyleSheet()
        elements = []

        # Header
        elements.append(Paragraph(organization.name, styles['Title']))
        elements.append(Paragraph(organization.address, styles['Normal']))
        elements.append(Paragraph(f"Invoice #{invoice.invoice_number}", styles['Heading2']))

        # Invoice details
        details = [
            ["Invoice Date:", invoice.invoice_date.strftime("%B %d, %Y")],
            ["Due Date:", invoice.due_date.strftime("%B %d, %Y")],
            ["Payment Terms:", invoice.payment_terms or "Due on Receipt"],
        ]
        elements.append(Table(details))

        # Bill To
        elements.append(Paragraph("Bill To:", styles['Heading3']))
        elements.append(Paragraph(invoice.bill_to_name, styles['Normal']))
        elements.append(Paragraph(invoice.bill_to_address or "", styles['Normal']))

        # Line items
        items_data = [["Description", "Qty", "Unit Price", "Total"]]
        for item in invoice.line_items:
            items_data.append([
                item.description,
                str(item.quantity),
                f"${item.unit_price:.2f}",
                f"${item.total:.2f}"
            ])

        items_table = Table(items_data)
        items_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (1, 0), (-1, -1), 'RIGHT'),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ]))
        elements.append(items_table)

        # Totals
        totals = [
            ["Subtotal:", f"${invoice.subtotal:.2f}"],
        ]
        if invoice.discount_amount:
            totals.append(["Discount:", f"-${invoice.discount_amount:.2f}"])
        if invoice.tax_amount:
            totals.append([f"Tax ({invoice.tax_rate * 100:.1f}%):", f"${invoice.tax_amount:.2f}"])
        totals.append(["Total Due:", f"${invoice.total:.2f}"])

        totals_table = Table(totals)
        totals_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'RIGHT'),
            ('FONTNAME', (-1, -1), (-1, -1), 'Helvetica-Bold'),
        ]))
        elements.append(totals_table)

        # Notes
        if invoice.notes:
            elements.append(Paragraph("Notes:", styles['Heading3']))
            elements.append(Paragraph(invoice.notes, styles['Normal']))

        # Terms
        if invoice.terms:
            elements.append(Paragraph("Terms & Conditions:", styles['Heading3']))
            elements.append(Paragraph(invoice.terms, styles['Normal']))

        doc.build(elements)
        return buffer.getvalue()
```

---

## Frontend Components

### Financial Dashboard

```tsx
// components/finance/FinancialDashboard.tsx
export function FinancialDashboard() {
  const { data: account } = useFinancialAccount();
  const { data: summary } = useTransactionSummary('month');

  return (
    <div className="space-y-6">
      {/* Balance Cards */}
      <div className="grid grid-cols-4 gap-4">
        <BalanceCard
          title="Available Balance"
          amount={account?.available_balance}
          currency={account?.currency}
          trend={summary?.available_change}
        />
        <BalanceCard
          title="Pending"
          amount={account?.pending_balance}
          currency={account?.currency}
          subtitle="Incoming, processing"
        />
        <BalanceCard
          title="Held"
          amount={account?.held_balance}
          currency={account?.currency}
          subtitle="Escrow & disputes"
        />
        <BalanceCard
          title="Month Revenue"
          amount={summary?.total_received}
          currency={account?.currency}
          trend={summary?.revenue_vs_last_month}
        />
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
          Create Invoice
        </button>
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg">
          Request Payout
        </button>
        <button className="px-4 py-2 border rounded-lg">
          Add Payment Method
        </button>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        <RevenueChart period="month" />
        <PaymentMethodsBreakdown />
      </div>

      {/* Recent Transactions */}
      <RecentTransactions limit={10} />

      {/* Outstanding Invoices */}
      <OutstandingInvoices />
    </div>
  );
}


// components/finance/InstantPayWidget.tsx
export function InstantPayWidget() {
  const { data: earnings } = useAvailableEarnings();
  const [amount, setAmount] = useState('');
  const { mutate: requestPayout, isLoading } = useRequestInstantPayout();

  const fee = parseFloat(amount) * 0.01;  // 1% fee
  const netAmount = parseFloat(amount) - fee;

  return (
    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
      <h3 className="text-lg font-semibold mb-2">Instant Pay</h3>
      <p className="text-green-100 text-sm mb-4">
        Get paid now instead of waiting for payday
      </p>

      <div className="bg-white/10 rounded-lg p-4 mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-green-100">Available for instant pay</span>
          <span className="font-bold text-xl">${earnings?.available.toFixed(2)}</span>
        </div>
        <div className="text-sm text-green-200">
          Based on {earnings?.work_orders_included} completed work orders
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm text-green-100">Amount to withdraw</label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              max={earnings?.available}
              className="w-full pl-8 pr-4 py-2 rounded-lg text-gray-900"
              placeholder="0.00"
            />
          </div>
        </div>

        {amount && (
          <div className="bg-white/10 rounded-lg p-3 text-sm">
            <div className="flex justify-between">
              <span>Instant pay fee (1%)</span>
              <span>-${fee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold mt-2 pt-2 border-t border-white/20">
              <span>You'll receive</span>
              <span>${netAmount.toFixed(2)}</span>
            </div>
          </div>
        )}

        <button
          onClick={() => requestPayout({ amount: parseFloat(amount) })}
          disabled={isLoading || !amount || parseFloat(amount) > (earnings?.available || 0)}
          className="w-full py-3 bg-white text-green-600 font-semibold rounded-lg hover:bg-green-50 disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : 'Get Paid Now'}
        </button>
      </div>

      <p className="text-xs text-green-200 mt-4">
        Funds typically arrive within 30 minutes to your linked debit card
      </p>
    </div>
  );
}


// components/finance/InvoiceCreator.tsx
export function InvoiceCreator() {
  const [invoice, setInvoice] = useState<InvoiceCreate>({
    client_id: '',
    invoice_date: new Date(),
    due_date: addDays(new Date(), 30),
    line_items: [],
    notes: '',
  });

  const addLineItem = () => {
    setInvoice({
      ...invoice,
      line_items: [
        ...invoice.line_items,
        { description: '', quantity: 1, unit_price: 0, taxable: true }
      ]
    });
  };

  const subtotal = invoice.line_items.reduce(
    (sum, item) => sum + (item.quantity * item.unit_price),
    0
  );

  return (
    <div className="bg-white rounded-lg border p-6">
      <h2 className="text-xl font-semibold mb-6">Create Invoice</h2>

      {/* Client Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Bill To</label>
        <ClientSelector
          value={invoice.client_id}
          onChange={(id) => setInvoice({ ...invoice, client_id: id })}
        />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Invoice Date</label>
          <DatePicker
            value={invoice.invoice_date}
            onChange={(d) => setInvoice({ ...invoice, invoice_date: d })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Due Date</label>
          <DatePicker
            value={invoice.due_date}
            onChange={(d) => setInvoice({ ...invoice, due_date: d })}
          />
        </div>
      </div>

      {/* Line Items */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium">Line Items</label>
          <button onClick={addLineItem} className="text-blue-600 text-sm">
            + Add Item
          </button>
        </div>

        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-500 border-b">
              <th className="pb-2">Description</th>
              <th className="pb-2 w-24">Qty</th>
              <th className="pb-2 w-32">Price</th>
              <th className="pb-2 w-32">Total</th>
              <th className="pb-2 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {invoice.line_items.map((item, idx) => (
              <LineItemRow
                key={idx}
                item={item}
                onChange={(updated) => {
                  const items = [...invoice.line_items];
                  items[idx] = updated;
                  setInvoice({ ...invoice, line_items: items });
                }}
                onRemove={() => {
                  const items = invoice.line_items.filter((_, i) => i !== idx);
                  setInvoice({ ...invoice, line_items: items });
                }}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Import from Work Orders */}
      <button className="text-blue-600 text-sm mb-6">
        Import line items from work orders...
      </button>

      {/* Totals */}
      <div className="border-t pt-4 mb-6">
        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax (0%)</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Notes</label>
        <textarea
          value={invoice.notes}
          onChange={(e) => setInvoice({ ...invoice, notes: e.target.value })}
          className="w-full border rounded-lg p-3"
          rows={3}
          placeholder="Additional notes or payment instructions..."
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button className="px-4 py-2 border rounded-lg">Save Draft</button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
          Send Invoice
        </button>
      </div>
    </div>
  );
}
```

---

## Implementation Timeline

### Week 1-2: Core Infrastructure
- [ ] Financial account model and schema
- [ ] Stripe Connect integration
- [ ] Bank account linking
- [ ] Basic balance tracking

### Week 3-4: Payment Processing
- [ ] Payment intent creation
- [ ] Transaction recording
- [ ] Payout processing
- [ ] Webhook handling

### Week 5-6: Invoicing
- [ ] Invoice creation and management
- [ ] PDF generation
- [ ] Invoice payment processing
- [ ] Payment reminders

### Week 7-8: Escrow System
- [ ] Escrow creation and funding
- [ ] Release workflows
- [ ] Partial releases
- [ ] Marketplace integration

### Week 9-10: Instant Pay
- [ ] Technician earnings tracking
- [ ] Instant payout requests
- [ ] Approval workflows
- [ ] Debit card payouts

### Week 11-12: Advanced Features
- [ ] Dispute handling
- [ ] Recurring payments
- [ ] Tax document generation
- [ ] Financial analytics

---

## Security & Compliance

### PCI Compliance
- All card data handled by Stripe
- No raw card numbers stored
- Tokenization for payment methods
- Secure webhook verification

### Fraud Prevention
- Velocity checks on payouts
- Suspicious activity monitoring
- Two-factor for large transactions
- IP-based risk scoring

### Tax Compliance
- 1099-NEC generation for contractors
- W-9 collection and verification
- Annual tax reporting
- State-specific requirements

### Audit Trail
- All transactions logged
- User action tracking
- Balance change history
- Immutable transaction records

---

## Success Metrics

### Financial Health
- Payment success rate
- Average time to payment
- Payout failure rate
- Dispute rate

### User Adoption
- Instant pay usage rate
- Invoice automation rate
- Connected account activation
- Payment method diversity

### Platform Revenue
- Transaction fee revenue
- Instant pay fee revenue
- Platform fee collection rate
- Revenue per active organization
