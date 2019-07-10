export interface ApiErrorResponse {
  errorMessage?: string;
  response: Response;
}

export interface ApiDataResponse<T> {
  response: Response;
  data: T
}

const isObject = (item: any): boolean => !!item && typeof item === 'object';
export const isApiErrorResponse = (response: any): response is ApiErrorResponse => {
  return isObject(response) && response.errorMessage;
}

const defaultMessage = "Unknown Error.  Contact an administrator";
let baseUrl: string = process.env.BASE_URL || "";
let baseApiPath: string = "";
export const setBaseApiPath = (path: string) => baseApiPath = path;

const buildUrl = (path: string): string => `${baseUrl}${baseApiPath}${path}`;
const parseQueryParams = (params: { [key: string]: any }) => 
  Object.keys(params)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&');

export const makeRequest = <T>(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE", 
  path: string, 
  params?: { [key: string]: any },
  responseRoot?: string,
): Promise<ApiDataResponse<T> | ApiErrorResponse> => {
  let body: string;
  let url: string = buildUrl(path);
  if (params) {
    if (["GET", "DELETE"].includes(method)) {
      url += `?${parseQueryParams(params)}`;
    } else {
      body = JSON.stringify(params);
    }
  }

  return window.fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'),
    },
    method,
    body
  })
  .then(async (response: Response) => {
    const result: ApiDataResponse<T> = {
      response: response.clone(),
      data: undefined
    }

    try {
      const dataCollection = await result.response.json()
      if (dataCollection) {
        result.data = responseRoot ? dataCollection[responseRoot] : dataCollection;
      }
    } catch { }

    if (result.response.status >= 200 && result.response.status < 300) {
      return result;
    } else {
      return {
        response: result.response,
        error: result.data || {
          status: 500,
          message: defaultMessage,
          error: "internal_server_error"
        },
      } as ApiErrorResponse;
    }
  });
};

const getCookie = (name: string): string => {
  if (!document.cookie) {
    return null;
  }
  const xsrfCookies = document.cookie.split(';')
    .map(c => c.trim())
    .filter(c => c.startsWith(name + '='));

  if (xsrfCookies.length === 0) {
    return null;
  }
  return decodeURIComponent(xsrfCookies[0].split('=')[1]);
};

baseApiPath = "/api";

export enum CardValidity {
  ActiveMember = "activeMember",
  Expired = "expired",
  Inactive = "inactive",
  Lost = "lost",
  NonMember = "nonMember",
  Revoked = "revoked",
  Stolen = "stolen"
}

export interface Card {
  id: string;
  holder: string;
  expiry: number;
  validity: string;
  uid: string;
}

export interface CreditCard {
  customerId: string;
  imageUrl: string;
  subscriptions: Subscription[];
  cardType: string;
  expirationMonth: number;
  expirationYear: number;
  expirationDate: string;
  last4: number;
}

export interface Discount {
  id: string;
  name: string;
  description: string;
  amount: string;
}

export interface Dispute {
  id: string;
  kind: string;
  reason: string;
  createdAt: string;
  amountDisputed: number;
  status: string;
  transaction: Transaction;
}

export enum EarnedMembershipMemberStatus {
  ActiveMember = "activeMember",
  Inactive = "inactive",
  NonMember = "nonMember",
  Revoked = "revoked"
}

export interface EarnedMembership {
  id: string;
  memberId: string;
  memberName: string;
  memberStatus: string;
  memberExpiration: number;
  requirements: Requirement[];
}

export interface error {
  message: string;
  status: number;
  error: string;
}

export enum InvoiceResourceClass {
  Member = "member",
  Rental = "rental"
}

export interface Invoice {
  id: string;
  name: string;
  description: string;
  settled: boolean;
  pastDue: boolean;
  createdAt: string;
  dueDate: string;
  amount: string;
  subscriptionId?: string;
  planId?: string;
  resourceClass: string;
  resourceId: string;
  quantity: number;
  discountId?: string;
  memberName: string;
}

export interface InvoiceOption {
  id: string;
  name: string;
  description: string;
  amount: string;
  planId?: string;
  resourceClass: string;
  quantity: number;
  discountId?: string;
  disabled: boolean;
}

export enum MemberStatus {
  ActiveMember = "activeMember",
  Inactive = "inactive",
  NonMember = "nonMember",
  Revoked = "revoked"
}

export enum MemberRole {
  Admin = "admin",
  Member = "member"
}

export interface Member {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  status: string;
  role: string;
  expirationTime?: number;
  memberContractOnFile: boolean;
  cardId?: string;
  subscriptionId?: string;
  customerId?: string;
  earnedMembershipId?: string;
}

export interface PayPalAccount {
  customerId: string;
  imageUrl: string;
  subscriptions: Subscription[];
  email: string;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  amount: string;
  billingFrequency: number;
  discounts: {
    id: string,
    name: string,
    description: string,
    amount: string
  }[];
}

export interface Requirement {
  id: string;
  earnedMembershipId: string;
  name: string;
  rolloverLimit: number;
  termLength: number;
  targetCount: number;
  strict: boolean;
  currentCount: number;
  termStartDate: string;
  termEndDate: string;
  termId: string;
  satisfied: boolean;
}

export interface ReportRequirement {
  id: string;
  requirementId: string;
  reportedCount: number;
  appliedCount: number;
  currentCount: number;
  memberIds: string[];
  termStartDate: string;
  termEndDate: string;
  satisfied: boolean;
}

export interface Report {
  id: string;
  date: string;
  earnedMembershipId: string;
  reportRequirements: EarnedMembership[];
}

export interface Rental {
  id: string;
  number: string;
  description: string;
  memberName: string;
  memberId: string;
  expiration: number;
}

export interface Subscription {
  id: string;
  planId: string;
  status: string;
  amount: string;
  failureCount: number;
  daysPastDue: number;
  billingDayOfMonth: string;
  firstBillingDate: string;
  nextBillingDate: string;
  memberId: string;
  memberName: string;
  resourceClass: string;
  resourceId: string;
  paymentMethodToken: string;
}

export enum TransactionStatus {
  Failed = "failed",
  Gateway_rejected = "gateway_rejected",
  Processor_declined = "processor_declined",
  Settled = "settled",
  Unrecognized = "unrecognized",
  Voided = "voided"
}

export interface Transaction {
  createdAt: string;
  customerDetails: { [key: string]: string };
  disputes: Dispute[];
  discountAmount: string;
  discounts: Discount[];
  gatewayRejectionReason?: string;
  status: string;
  id: string;
  planId?: string;
  recurring: boolean;
  refundIds: string[];
  refundedTransactionId?: string;
  subscriptionDetails: {
    billingPeriodStartDate?: string,
    billingPeriodEndDate?: string
  };
  subscriptionId?: string;
  amount: string;
  memberId: string;
  memberName: string;
}

export const adminListBillingPlans = (params?: { 
    pageNum?: number,
    orderBy?: string,
    order?: string,
    types?: string[],
}) => {
    return makeRequest<Plan[]>(
      "GET", 
      "/admin/billing/plans",
    params,
    "plans"
    );
  }
  
export const adminListBillingPlanDiscounts = (params?: { 
    pageNum?: number,
    orderBy?: string,
    order?: string,
    subscriptionOnly?: boolean,
    types?: string[],
}) => {
    return makeRequest<Discount[]>(
      "GET", 
      "/admin/billing/plans/discounts",
    params,
    "discounts"
    );
  }
  
export const adminListSubscriptions = () => {
    return makeRequest<Subscription[]>(
      "GET", 
      "/admin/billing/subscriptions",
    undefined,
"subscriptions"
    );
  }
  
export const adminCancelSubscription = (id: string) => {
    return makeRequest<void>(
      "DELETE", 
      "/admin/billing/subscriptions/{id}".replace("{id}", id)
    );
  }
  
export const adminListTransaction = (params?: { 
    pageNum?: number,
    orderBy?: string,
    order?: string,
    searchId?: string,
    searchBy?: string,
    endDate?: string,
    startDate?: string,
}) => {
    return makeRequest<Transaction[]>(
      "GET", 
      "/admin/billing/transactions",
    params,
    "transactions"
    );
  }
  
export const adminGetTransaction = (id: string) => {
    return makeRequest<Transaction>(
      "GET", 
      "/admin/billing/transactions/{id}".replace("{id}", id),
    undefined,
"transaction"
    );
  }
  
export const adminDeleteTransaction = (id: string) => {
    return makeRequest<void>(
      "DELETE", 
      "/admin/billing/transactions/{id}".replace("{id}", id)
    );
  }
  
export const adminGetNewCard = () => {
    return makeRequest<{
    uid: string
  }>(
      "GET", 
      "/admin/cards/new",
    undefined,
"card"
    );
  }
  
export const adminListCards = (params: { 
    memberId: string,
}) => {
    return makeRequest<Card[]>(
      "GET", 
      "/admin/cards",
    params,
    "cards"
    );
  }
  
export const adminCreateCard = (createAccessCardDetails: {
    memberId: string,
    uid: string,
    cardLocation: string
  },
) => {
    return makeRequest<Card>(
      "POST", 
      "/admin/cards",
    { card: createAccessCardDetails },
    "card"
    );
  }
  
export const adminUpdateCard = (id: string, updateAccessCardDetails: {
    memberId: string,
    uid: string,
    cardLocation: string
  },
) => {
    return makeRequest<Card>(
      "PUT", 
      "/admin/cards/{id}".replace("{id}", id),
    { card: updateAccessCardDetails },
    "card"
    );
  }
  
export const adminGetEarnedMembershipReports = (id: string, params?: { 
    pageNum?: number,
    orderBy?: string,
    order?: string,
}) => {
    return makeRequest<Report[]>(
      "GET", 
      "/admin/earned_memberships/{id}/reports".replace("{id}", id),
    params,
    "reports"
    );
  }
  
export const adminListEarnedMembership = (params?: { 
    pageNum?: number,
    orderBy?: string,
    order?: string,
}) => {
    return makeRequest<EarnedMembership[]>(
      "GET", 
      "/admin/earned_memberships",
    params,
    "earnedMemberships"
    );
  }
  
export const adminCreateEarnedMembership = (createEarnedMembershipDetails: EarnedMembership,
) => {
    return makeRequest<EarnedMembership>(
      "POST", 
      "/admin/earned_memberships",
    { earnedMembership: createEarnedMembershipDetails },
    "earnedMembership"
    );
  }
  
export const adminGetEarnedMembership = (id: string) => {
    return makeRequest<EarnedMembership>(
      "GET", 
      "/admin/earned_memberships/{id}".replace("{id}", id),
    undefined,
"earnedMembership"
    );
  }
  
export const adminUpdateEarnedMembership = (id: string, updateEarnedMembershipDetails: EarnedMembership,
) => {
    return makeRequest<EarnedMembership>(
      "PUT", 
      "/admin/earned_memberships/{id}".replace("{id}", id),
    { earnedMembership: updateEarnedMembershipDetails },
    "earnedMembership"
    );
  }
  
export const adminCreateInvoiceOption = (createInvoiceOptionDetails: InvoiceOption,
) => {
    return makeRequest<InvoiceOption>(
      "POST", 
      "/admin/invoice_options",
    { invoiceOption: createInvoiceOptionDetails },
    "invoiceOption"
    );
  }
  
export const adminUpdateInvoiceOption = (id: string, updateInvoiceOptionDetails: InvoiceOption,
) => {
    return makeRequest<InvoiceOption>(
      "PUT", 
      "/admin/invoice_options/{id}".replace("{id}", id),
    { invoiceOption: updateInvoiceOptionDetails },
    "invoiceOption"
    );
  }
  
export const adminDeleteInvoiceOption = (id: string) => {
    return makeRequest<void>(
      "DELETE", 
      "/admin/invoice_options/{id}".replace("{id}", id)
    );
  }
  
export const adminListInvoices = (params?: { 
    pageNum?: number,
    orderBy?: string,
    order?: string,
    resourceId?: string,
}) => {
    return makeRequest<Invoice[]>(
      "GET", 
      "/admin/invoices",
    params,
    "invoices"
    );
  }
  
export const adminCreateInvoices = (createInvoiceDetails: {
    id: string,
    discountId: string,
    memberId: string,
    resourceId: string
  },
) => {
    return makeRequest<Invoice>(
      "POST", 
      "/admin/invoices",
    { invoiceOption: createInvoiceDetails },
    "invoice"
    );
  }
  
export const adminUpdateInvoice = (id: string, updateInvoiceDetails: Invoice,
) => {
    return makeRequest<Invoice>(
      "PUT", 
      "/admin/invoices/{id}".replace("{id}", id),
    { invoice: updateInvoiceDetails },
    "invoice"
    );
  }
  
export const adminDeleteInvoice = (id: string) => {
    return makeRequest<void>(
      "DELETE", 
      "/admin/invoices/{id}".replace("{id}", id)
    );
  }
  
export const adminCreateMember = (createMemberDetails: Member,
) => {
    return makeRequest<Member>(
      "POST", 
      "/admin/members",
    { member: createMemberDetails },
    "member"
    );
  }
  
export const adminUpdateMember = (id: string, updateMemberDetails: Member,
) => {
    return makeRequest<Member>(
      "PUT", 
      "/admin/members/{id}".replace("{id}", id),
    { member: updateMemberDetails },
    "member"
    );
  }
  
export const amdinListRentals = (params?: { 
    pageNum?: number,
    orderBy?: string,
    order?: string,
    memberId?: string,
}) => {
    return makeRequest<Rental[]>(
      "GET", 
      "/admin/rentals",
    params,
    "rentals"
    );
  }
  
export const adminCreateRental = (createRentalDetails: Rental,
) => {
    return makeRequest<Rental>(
      "POST", 
      "/admin/rentals",
    { rental: createRentalDetails },
    "rental"
    );
  }
  
export const adminUpdateRental = (id: string, updateRentalDetails: Rental,
) => {
    return makeRequest<Rental>(
      "PUT", 
      "/admin/rentals/{id}".replace("{id}", id),
    { rental: updateRentalDetails },
    "rental"
    );
  }
  
export const getNewPaymentMethod = () => {
    return makeRequest<string>(
      "GET", 
      "/billing/payment_methods/new",
    undefined,
"clientToken"
    );
  }
  
export const listPaymentMethods = () => {
    return makeRequest<CreditCard[]>(
      "GET", 
      "/billing/payment_methods",
    undefined,
"paymentMethods"
    );
  }
  
export const createPaymentMethod = (createPaymentMethodDetails: {
    payment_method_nonce: string,
    make_default: string
  },
) => {
    return makeRequest<CreditCard>(
      "POST", 
      "/billing/payment_methods",
    { payment_method: createPaymentMethodDetails },
    "paymentMethod"
    );
  }
  
export const deletePaymentMethod = (id: string) => {
    return makeRequest<void>(
      "DELETE", 
      "/billing/payment_methods/{id}".replace("{id}", id)
    );
  }
  
export const listSubscriptions = (id: string) => {
    return makeRequest<Subscription>(
      "GET", 
      "/billing/subscriptions/{id}".replace("{id}", id),
    undefined,
"subscription"
    );
  }
  
export const updateSubscription = (id: string, updateSubscriptionDetails: {
    payment_method_token: string
  },
) => {
    return makeRequest<Subscription>(
      "PUT", 
      "/billing/subscriptions/{id}".replace("{id}", id),
    { subscription: updateSubscriptionDetails },
    "subscription"
    );
  }
  
export const cancelSubscription = (id: string) => {
    return makeRequest<void>(
      "DELETE", 
      "/billing/subscriptions/{id}".replace("{id}", id)
    );
  }
  
export const listTransactions = (params?: { 
    pageNum?: number,
    orderBy?: string,
    order?: string,
}) => {
    return makeRequest<Transaction[]>(
      "GET", 
      "/billing/transactions",
    params,
    "transactions"
    );
  }
  
export const createTransaction = (createTransactionDetails: {
    id: string,
    discountId: string
  },
) => {
    return makeRequest<Transaction>(
      "POST", 
      "/billing/transactions",
    { transaction: createTransactionDetails },
    "transaction"
    );
  }
  
export const deleteTransaction = (id: string) => {
    return makeRequest<void>(
      "DELETE", 
      "/billing/transactions/{id}".replace("{id}", id)
    );
  }
  
export const listEarnedMembershipReports = (id: string, params?: { 
    pageNum?: number,
    orderBy?: string,
    order?: string,
}) => {
    return makeRequest<Report[]>(
      "GET", 
      "/earned_memberships/{id}/reports".replace("{id}", id),
    params,
    "reports"
    );
  }
  
export const createEarnedMembershipReport = (id: string, createEarnedMembershipReportDetails: {
    earnedMembershipId: string,
    reportRequirements: {
    requirementId: string,
    reportedCount: number,
    memberIds: string[]
  }[]
  },
) => {
    return makeRequest<Report>(
      "POST", 
      "/earned_memberships/{id}/reports".replace("{id}", id),
    { report: createEarnedMembershipReportDetails },
    "report"
    );
  }
  
export const getEarnedMembership = (id: string) => {
    return makeRequest<EarnedMembership>(
      "GET", 
      "/earned_memberships/{id}".replace("{id}", id),
    undefined,
"earnedMembership"
    );
  }
  
export const listInvoiceOptions = (params?: { 
    pageNum?: number,
    orderBy?: string,
    order?: string,
    subscriptionOnly?: boolean,
    types?: string[],
}) => {
    return makeRequest<InvoiceOption[]>(
      "GET", 
      "/invoice_options",
    params,
    "invoiceOptions"
    );
  }
  
export const listInvoices = (params?: { 
    pageNum?: number,
    orderBy?: string,
    order?: string,
}) => {
    return makeRequest<Invoice[]>(
      "GET", 
      "/invoices",
    params,
    "invoices"
    );
  }
  
export const createInvoice = (createInvoiceDetails: {
    id: string,
    discountId: string
  },
) => {
    return makeRequest<Invoice>(
      "POST", 
      "/invoices",
    { invoiceOption: createInvoiceDetails },
    "invoice"
    );
  }
  
export const listMembersPermissions = (id: string) => {
    return makeRequest<{ [key: string]: string }>(
      "GET", 
      "/members/{id}/permissions".replace("{id}", id),
    undefined,
"permissions"
    );
  }
  
export const listMembers = (params?: { 
    pageNum?: number,
    orderBy?: string,
    order?: string,
    currentMembers?: boolean,
}) => {
    return makeRequest<Member[]>(
      "GET", 
      "/members",
    params,
    "members"
    );
  }
  
export const registerMember = (registerMemberDetails: {
    email: string,
    password: string,
    firstname: string,
    lastname: string
  },
) => {
    return makeRequest<Member>(
      "POST", 
      "/members",
    { member: registerMemberDetails },
    "member"
    );
  }
  
export const getMember = (id: string) => {
    return makeRequest<Member>(
      "GET", 
      "/members/{id}".replace("{id}", id),
    undefined,
"member"
    );
  }
  
export const updateMember = (id: string, updateMemberDetails: {
    firstname: string,
    lastname: string,
    email: string,
    signature: string
  },
) => {
    return makeRequest<Member>(
      "PUT", 
      "/members/{id}".replace("{id}", id),
    { member: updateMemberDetails },
    "member"
    );
  }
  
export const signIn = (signInDetails?: {
    email: string,
    password: string
  },
) => {
    return makeRequest<Member>(
      "POST", 
      "/members/sign_in",
    { member: signInDetails },
    "member"
    );
  }
  
export const signOut = () => {
    return makeRequest<void>(
      "DELETE", 
      "/members/sign_out"
    );
  }
  
export const requestPasswordReset = (passwordResetDetails: {
    email: string
  },
) => {
    return makeRequest<void>(
      "POST", 
      "/members/password",
    { member: passwordResetDetails }
    );
  }
  
export const resetPassword = (passwordResetDetails: {
    resetPasswordToken: string,
    password: string
  },
) => {
    return makeRequest<void>(
      "PUT", 
      "/members/password",
    { member: passwordResetDetails }
    );
  }
  
export const listRentals = (params?: { 
    pageNum?: number,
    orderBy?: string,
    order?: string,
}) => {
    return makeRequest<Rental[]>(
      "GET", 
      "/rentals",
    params,
    "rentals"
    );
  }
  
export const getRental = (id: string) => {
    return makeRequest<Rental>(
      "GET", 
      "/rentals/{id}".replace("{id}", id),
    undefined,
"rental"
    );
  }
  