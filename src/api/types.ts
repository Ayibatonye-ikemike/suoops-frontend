/**
 * Condensed API type surface derived from the service OpenAPI schema.
 * Regenerate via `npm run openapi` and keep this file under ~400 lines by curating
 * the exported types that the frontend uses directly.
 */

export type paths = Record<string, never>;
export type operations = Record<string, never>;
export type external = Record<string, never>;
export type $defs = Record<string, never>;

export interface components {
  schemas: {
    CustomerOut: {
      name: string;
      phone?: string | null;
    };
    HTTPValidationError: {
      detail?: components["schemas"]["ValidationError"][];
    };
    InvoiceCreate: {
      amount: number | string;
      due_date?: string | null;
      lines?: components["schemas"]["InvoiceLineIn"][] | null;
      discount_amount?: number | string | null;
      invoice_type?: "revenue" | "expense";
      customer_name?: string | null;
      customer_phone?: string | null;
      customer_email?: string | null;
      vendor_name?: string | null;
      category?: string | null;
      merchant?: string | null;
      description?: string | null;
      receipt_url?: string | null;
      receipt_text?: string | null;
      input_method?: string | null;
      channel?: string | null;
      verified?: boolean;
      notes?: string | null;
    };
    InvoiceLineIn: {
      description: string;
      quantity: number;
      unit_price: number | string;
    };
    InvoiceLineOut: {
      id: number;
      description: string;
      quantity: number;
      unit_price: string;
    };
    InvoiceOut: {
      invoice_id: string;
      amount: string;
      status: string;
      pdf_url: string | null;
      receipt_pdf_url?: string | null;
      created_at?: string | null;
      due_date?: string | null;
      paid_at?: string | null;
      // Unified invoice/expense fields
      invoice_type?: string;
      category?: string | null;
      vendor_name?: string | null;
      merchant?: string | null;
      verified?: boolean | null;
      notes?: string | null;
      receipt_url?: string | null;  // Uploaded receipt/proof of purchase
    };
    InvoiceOutDetailed: {
      invoice_id: string;
      amount: string;
      status: string;
      pdf_url: string | null;
      receipt_pdf_url?: string | null;
      created_at?: string | null;
      due_date?: string | null;
      discount_amount?: string | null;
      customer?: components["schemas"]["CustomerOut"] | null;
      lines?: components["schemas"]["InvoiceLineOut"][];
      paid_at?: string | null;
      // Unified invoice/expense fields
      invoice_type?: string;
      category?: string | null;
      vendor_name?: string | null;
      merchant?: string | null;
      verified?: boolean | null;
      notes?: string | null;
      receipt_url?: string | null;  // Uploaded receipt/proof of purchase
    };
    InvoiceStatusUpdate: {
      status: "pending" | "awaiting_confirmation" | "paid" | "failed";
    };
    MessageOut: {
      detail: string;
    };
    InvoicePublicOut: {
      invoice_id: string;
      amount: string;
      status: "pending" | "awaiting_confirmation" | "paid" | "failed" | string;
      due_date?: string | null;
      customer_name?: string | null;
      business_name?: string | null;
      bank_name?: string | null;
      account_number?: string | null;
      account_name?: string | null;
      paid_at?: string | null;
    };
    RefreshRequest: {
      refresh_token?: string | null;
    };
    TokenOut: {
      access_token: string;
      token_type: string;
      access_expires_at: string;
      refresh_token?: string | null;
    };
    UserCreate: {
      phone: string;
      name: string;
      password: string;
    };
    UserLogin: {
      phone: string;
      password: string;
    };
    UserOut: {
      id: number;
      phone?: string | null;
      phone_verified?: boolean;
      email?: string | null;
      name: string;
      plan: string;  // FREE, STARTER, PRO, BUSINESS
      invoices_this_month: number;
      logo_url?: string | null;
    };
    ValidationError: {
      loc: (string | number)[];
      msg: string;
      type: string;
    };
    WebhookEventOut: {
      provider: string;
      external_id: string;
      created_at: string;
    };
    BankDetailsUpdate: {
      business_name?: string | null;
      bank_name?: string | null;
      account_number?: string | null;
      account_name?: string | null;
    };
    BankDetailsOut: {
      business_name: string | null;
      bank_name: string | null;
      account_number: string | null;
      account_name: string | null;
      is_configured: boolean;
    };
    // Team management types
    TeamRole: "admin" | "member";
    InvitationStatus: "pending" | "accepted" | "expired" | "revoked";
    TeamOut: {
      id: number;
      name: string;
      admin_user_id: number;
      max_members: number;
      member_count: number;
      created_at: string;
    };
    TeamMemberOut: {
      id: number;
      user_id: number;
      user_name: string;
      user_email: string | null;
      role: components["schemas"]["TeamRole"];
      joined_at: string;
    };
    InvitationOut: {
      id: number;
      email: string;
      status: components["schemas"]["InvitationStatus"];
      created_at: string;
      expires_at: string;
      is_expired: boolean;
      is_valid: boolean;
    };
    TeamWithMembersOut: {
      team: components["schemas"]["TeamOut"];
      admin: components["schemas"]["TeamMemberOut"];
      members: components["schemas"]["TeamMemberOut"][];
      pending_invitations: components["schemas"]["InvitationOut"][];
      can_invite: boolean;
    };
    UserTeamRole: {
      has_team: boolean;
      is_admin: boolean;
      team_id: number | null;
      role: components["schemas"]["TeamRole"] | null;
      can_access_settings: boolean;
      can_edit_inventory: boolean;
    };
    InvitationValidation: {
      valid: boolean;
      team_name: string | null;
      inviter_name: string | null;
      email: string | null;
      error: string | null;
    };
    InvitationCreate: {
      email: string;
    };
    InvitationAccept: {
      token: string;
    };
    TeamCreate: {
      name: string;
    };
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}
