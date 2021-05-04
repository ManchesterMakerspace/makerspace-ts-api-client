export interface ApiError {
  status: number;
  message: string;
  error: string;
}
export interface ApiErrorResponse {
  error: ApiError;
  response: Response;
}

export interface ApiDataResponse<T> {
  response: Response;
  data: T;
  error?: ApiError;
}

const isObject = (item: any): boolean => !!item && typeof item === 'object';
export const isApiErrorResponse = (response: any): response is ApiErrorResponse => {
  return !!(isObject(response) && response.error);
}

const defaultMessage = "Unknown Error.  Contact an administrator";
let baseUrl: string = process.env.BASE_URL || "";
let baseApiPath: string = "/api";
export const setBaseApiPath = (path: string) => baseApiPath = path;

const buildUrl = (path: string): string => `${baseUrl}${baseApiPath}${path}`;
const parseQueryParams = (params: { [key: string]: any }) =>
  Object.keys(params)
    .filter(k => params[k] !== undefined)
    .map(k => {

      let key = encodeURIComponent(k);
      const value = params[k];
      if (Array.isArray(value)) {
        key += "[]";
        return value.map(v => constructQueryParam(key, v)).join("&");
      }

      return constructQueryParam(key, value);
    })
    .join('&');

const constructQueryParam = (key: string, value: string): string =>
  `${key}=${encodeURIComponent(value)}`;

const defaultError = {
  status: 500,
  message: defaultMessage,
  error: "internal_server_error"
};

export const makeRequest = async <T>(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  path: string,
  params?: { [key: string]: any },
): Promise<ApiDataResponse<T>> => {
  let body: string;
  let url: string = buildUrl(path);
  if (params) {
    if (["GET", "DELETE"].includes(method)) {
      url += `?${parseQueryParams(params)}`;
    } else {
      body = JSON.stringify(params);
    }
  }

  try {
    const response = await window.fetch(url, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'),
      },
      method,
      body
    });

    const result: ApiDataResponse<T> = {
      response: response.clone(),
      data: undefined
    }

    try {
      if (response.status !== 204) {
        result.data = await result.response.json()
      }
    } catch { }

    if (result.response.status >= 200 && result.response.status < 300) {
      return result;
    } else {
      return {
        ...result,
        error: (result.data as unknown as ApiError) || defaultError,
      };
    }
  } catch (e) {
    return {
      response: e,
      data: undefined,
      error: defaultError
    };
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
      result.data = await result.response.json()
    } catch { }

    if (result.response.status >= 200 && result.response.status < 300) {
      return result;
    } else {
      return {
        response: result.response,
        data: undefined,
        error: (result.data as unknown as ApiError)|| {
          status: 500,
          message: defaultMessage,
          error: "internal_server_error"
        }
      };
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

/* tslint:disable */

export interface AdminUpdateMemberDetails {
    "renew"?: number;
    "firstname"?: string;
    "lastname"?: string;
    "email"?: string;
    "status"?: MemberStatus;
    "role"?: MemberRole;
    "expirationTime"?: number;
    "memberContractOnFile"?: boolean;
    "notes"?: string;
    "silenceEmails"?: boolean;
    "phone"?: string;
    "address"?: MembersAddress;
}

export interface BaseMember {
    "firstname": string;
    "lastname": string;
    "email": string;
    "status": MemberStatus;
    "role": MemberRole;
    "expirationTime": number;
    "memberContractOnFile": boolean;
    "notes"?: string;
    "silenceEmails"?: boolean;
}

export interface Card {
    "id": string;
    "holder": string;
    "expiry": number;
    "validity": CardValidityEnum;
    "uid": string;
}


export enum CardValidityEnum {
    ActiveMember = 'activeMember',
    Expired = 'expired',
    Inactive = 'inactive',
    Lost = 'lost',
    NonMember = 'nonMember',
    Revoked = 'revoked',
    Stolen = 'stolen'
}

export interface CreateAccessCardDetails {
    "memberId": string;
    "uid": string;
}

export interface CreateInvoiceDetails {
    "id": string;
    "memberId": string;
    "resourceId": string;
    "discountId"?: string;
}

export interface CreateInvoiceDetails1 {
    "id": string;
    "discountId"?: string;
}

export interface CreatePaymentMethodDetails {
    "paymentMethodNonce": string;
    "makeDefault"?: boolean;
}

export interface CreateTransactionDetails {
    "invoiceId"?: string;
    "invoiceOptionId"?: string;
    "discountId"?: string;
    "paymentMethodId": string;
}

export interface CreditCard {
    "id": string;
    "isDefault": boolean;
    "paymentType"?: string;
    "customerId": string;
    "imageUrl": string;
    "subscriptions": Array<Subscription>;
    "cardType": string;
    "expirationMonth": number;
    "expirationYear": number;
    "expirationDate": string;
    "last4": number;
    "debit": boolean;
}

export interface CreditCardSummary {
    "imageUrl"?: string;
    "cardType"?: string;
    "expirationMonth"?: number;
    "expirationYear"?: number;
    "expirationDate"?: string;
    "last4"?: number;
    "debit"?: boolean;
    "token"?: string;
}

export interface Discount {
    "id": string;
    "name": string;
    "description": string;
    "amount": string;
}

export interface Dispute {
    "id": string;
    "kind": string;
    "reason": string;
    "createdAt": string;
    "amountDisputed": number;
    "status": string;
    "transaction": Transaction;
}

export interface EarnedMembership extends NewEarnedMembership {
    "id": string;
    "memberName": string;
    "memberStatus": MemberStatus;
    "memberExpiration": number;
}

export interface Error {
    "message": string;
    "status"?: number;
    "error"?: string;
}

export interface InlineResponse200 {
    "totalMembers"?: number;
    "newMembers"?: number;
    "subscribedMembers"?: number;
    "pastDueInvoices"?: number;
    "refundsPending"?: number;
}

export interface InlineResponse2001 {
    "clientToken": string;
}

export interface Invoice {
    "id": string;
    "name": string;
    "description": string;
    "settled": boolean;
    "pastDue": boolean;
    "createdAt": string;
    "dueDate": string;
    "amount": string;
    "subscriptionId"?: string;
    "transactionId"?: string;
    "planId"?: string;
    "resourceClass": InvoiceableResource;
    "resourceId": string;
    "quantity": number;
    "discountId"?: string;
    "memberName": string;
    "memberId": string;
    "refunded": boolean;
    "refundRequested"?: string;
    "resource": Member | Rental;
}

export interface InvoiceOption extends NewInvoiceOption {
    "id": string;
}

export enum InvoiceableResource {
    Member = 'member',
    Rental = 'rental'
}
export interface Member extends NewMember {
    "id": string;
    "expirationTime": number;
    "cardId"?: string;
    "subscriptionId"?: string;
    "subscription"?: boolean;
    "customerId"?: string;
    "earnedMembershipId"?: string;
}

export enum MemberRole {
    Admin = 'admin',
    Member = 'member'
}
export enum MemberStatus {
    ActiveMember = 'activeMember',
    Inactive = 'inactive',
    NonMember = 'nonMember',
    Revoked = 'revoked'
}
export interface MemberSummary extends BaseMember {
    "id": string;
}

export interface MembersAddress {
    "street"?: string;
    "unit"?: string;
    "city"?: string;
    "state"?: string;
    "postalCode"?: string;
}

export interface MemberspasswordMember {
    "resetPasswordToken"?: string;
    "password"?: string;
}

export interface MemberspasswordMember1 {
    "email"?: string;
}

export interface MemberssignInMember {
    "email"?: string;
    "password"?: string;
}

export interface MessageDetails {
    "message": string;
}

export interface NewEarnedMembership {
    "memberId": string;
    "requirements": Array<NewRequirement>;
}

export interface NewInvoiceOption {
    "name": string;
    "amount": string;
    "resourceClass": InvoiceableResource;
    "quantity": number;
    "description"?: string;
    "planId"?: string;
    "discountId"?: string;
    "disabled"?: boolean;
    "isPromotion"?: boolean;
}

export interface NewMember extends MemberSummary {
    "phone"?: string;
    "address"?: MembersAddress;
}

export interface NewRental {
    "number": string;
    "memberId": string;
    "description"?: string;
    "expiration"?: number;
    "contractOnFile"?: boolean;
    "notes"?: string;
}

export interface NewReport {
    "earnedMembershipId": string;
    "reportRequirements": Array<NewReportRequirement>;
}

export interface NewReportRequirement {
    "requirementId": string;
    "reportedCount": number;
    "memberIds": Array<string>;
}

export interface NewRequirement {
    "name": string;
    "rolloverLimit": number;
    "termLength": number;
    "targetCount": number;
    "strict": boolean;
}

export interface PasswordError {
    "errors": PasswordErrorErrors;
}

export interface PasswordErrorErrors {
    "email": Array<string>;
}

export interface PasswordResetDetails {
    "member"?: MemberspasswordMember;
}

export interface PasswordResetDetails1 {
    "member"?: MemberspasswordMember1;
}

export interface PayPalAccount {
    "id": string;
    "_default": boolean;
    "paymentType"?: string;
    "customerId": string;
    "imageUrl": string;
    "subscriptions": Array<Subscription>;
    "email": string;
}

export interface PayPalAccountSummary {
    "imageUrl"?: string;
    "payerEmail"?: string;
    "payerFirstName"?: string;
    "payerLastName"?: string;
    "token"?: string;
}

export interface Plan {
    "id": string;
    "name": string;
    "type": PlanTypeEnum;
    "description": string;
    "amount": string;
    "billingFrequency": number;
    "discounts": Array<PlanDiscounts>;
}


export enum PlanTypeEnum {
    Membership = 'membership',
    Rental = 'rental'
}

export interface PlanDiscounts {
    "id": string;
    "name": string;
    "description": string;
    "amount": string;
}

export interface RegisterMemberDetails {
    "email": string;
    "password": string;
    "firstname": string;
    "lastname": string;
    "phone"?: string;
    "address"?: MembersAddress;
}

export interface RegistrationEmailDetails {
    "email": string;
}

export interface RejectionCard {
    "uid": string;
}

export interface Rental extends NewRental {
    "id": string;
    "memberName": string;
    "subscriptionId": string;
}

export interface Report extends NewReport {
    "id": string;
    "date": string;
    "reportRequirements": Array<ReportRequirement>;
}

export interface ReportRequirement extends NewReportRequirement {
    "id": string;
    "appliedCount": number;
    "currentCount": number;
    "termStartDate": string;
    "termEndDate": string;
    "satisfied": boolean;
}

export interface Requirement extends NewRequirement {
    "id": string;
    "earnedMembershipId": string;
    "currentCount": number;
    "termStartDate": string;
    "termEndDate": string;
    "termId": string;
    "satisfied": boolean;
}

export interface SignInDetails {
    "member"?: MemberssignInMember;
}

export interface Subscription {
    "id": string;
    "planId": string;
    "status": SubscriptionStatusEnum;
    "amount": string;
    "failureCount": number;
    "daysPastDue": number;
    "billingDayOfMonth": string;
    "firstBillingDate": string;
    "nextBillingDate": string;
    "memberId": string;
    "memberName": string;
    "resourceClass": string;
    "resourceId": string;
    "paymentMethodToken": string;
}


export enum SubscriptionStatusEnum {
    Active = 'Active',
    Canceled = 'Canceled',
    PastDue = 'Past Due',
    Pending = 'Pending',
    Expired = 'Expired'
}

export interface Transaction {
    "createdAt": string;
    "customerDetails": any;
    "disputes": Array<Dispute>;
    "discountAmount": string;
    "discounts": Array<Discount>;
    "gatewayRejectionReason"?: string;
    "status": TransactionStatusEnum;
    "id": string;
    "planId"?: string;
    "recurring": boolean;
    "refundIds": Array<string>;
    "refundedTransactionId"?: string;
    "subscriptionDetails"?: TransactionSubscriptionDetails;
    "subscriptionId"?: string;
    "amount": string;
    "memberId": string;
    "memberName": string;
    "invoice"?: Invoice;
    "paymentMethodDetails": CreditCardSummary | PayPalAccountSummary;
}


export enum TransactionStatusEnum {
    AuthorizationExpired = 'authorization_expired',
    Authorized = 'authorized',
    Authorizing = 'authorizing',
    SettlementPending = 'settlement_pending',
    SettlementDeclined = 'settlement_declined',
    Failed = 'failed',
    GatewayRejected = 'gateway_rejected',
    ProcessorDeclined = 'processor_declined',
    Settled = 'settled',
    Settling = 'settling',
    SubmmittedForSettlement = 'submmitted_for_settlement',
    Voided = 'voided'
}

export interface TransactionSubscriptionDetails {
    "billingPeriodStartDate"?: string;
    "billingPeriodEndDate"?: string;
}

export interface UpdateAccessCardDetails {
    "cardLocation": string;
}

export interface UpdateInvoiceDetails {
    "settled"?: boolean;
}

export interface UpdateMemberDetails {
    "firstname"?: string;
    "lastname"?: string;
    "email"?: string;
    "memberContractOnFile"?: boolean;
    "silenceEmails"?: boolean;
    "phone"?: string;
    "address"?: MembersAddress;
    "signature"?: string;
}

export interface UpdateRentalDetails {
    "signature": string;
}

export interface UpdateSubscriptionDetails {
    "paymentMethodToken": string;
}



/** 
* Lists analytic counts
*/
export function adminListAnalytics(): Promise<{ response: Response, data: InlineResponse200 }> {
    const path = `/admin/analytics`;

    return makeRequest<InlineResponse200>(
        "GET",
        path,
    );
}

/** 
* Registers new member
* @param body 
*/
export function registerMember(params: {  "body": RegisterMemberDetails; }): Promise<{ response: Response, data: Member }> {
    const path = `/members`;

    return makeRequest<Member>(
        "POST",
        path,
        params["body"]
    );
}
/** 
* Sends registration email
* @param body 
*/
export function sendRegistrationEmail(params: {  "body": RegistrationEmailDetails; }): Promise<{ response: Response, data: undefined }> {
    const path = `/send_registration`;

    return makeRequest(
        "POST",
        path,
        params["body"]
    );
}
/** 
* Signs in user
* @param body 
*/
export function signIn(params: {  "body": SignInDetails; }): Promise<{ response: Response, data: Member }> {
    const path = `/members/sign_in`;

    return makeRequest<Member>(
        "POST",
        path,
        params["body"]
    );
}
/** 
* Signs out user
*/
export function signOut(): Promise<{ response: Response, data: undefined }> {
    const path = `/members/sign_out`;

    return makeRequest(
        "DELETE",
        path,
    );
}

/** 
* Creates an access card
* @param body 
*/
export function adminCreateCard(params: {  "body": CreateAccessCardDetails; }): Promise<{ response: Response, data: Card }> {
    const path = `/admin/cards`;

    return makeRequest<Card>(
        "POST",
        path,
        params["body"]
    );
}
/** 
* Initiate new card creation
*/
export function adminGetNewCard(): Promise<{ response: Response, data: RejectionCard }> {
    const path = `/admin/cards/new`;

    return makeRequest<RejectionCard>(
        "GET",
        path,
    );
}
/** 
* Gets a list of members cards
* @param memberId 
*/
export function adminListCards(params: {  "memberId": string; }): Promise<{ response: Response, data: Array<Card> }> {
    const path = `/admin/cards`;

    return makeRequest<Array<Card>>(
        "GET",
        path,
        {
            ...params["memberId"] !== undefined && { "memberId": params["memberId"] }
        },
    );
}
/** 
* Updates a card
* @param body 
* @param id 
*/
export function adminUpdateCard(params: {  "body": UpdateAccessCardDetails; "id": string; }): Promise<{ response: Response, data: Card }> {
    const path = `/admin/cards/{id}`.replace(`{${"id"}}`, `${ params["id"] }`);

    return makeRequest<Card>(
        "PUT",
        path,
        params["body"]
    );
}

/** 
* Sends a slack message
* @param body 
*/
export function message(params: {  "body": MessageDetails; }): Promise<{ response: Response, data: undefined }> {
    const path = `/client_error_handler`;

    return makeRequest(
        "POST",
        path,
        params["body"]
    );
}

/** 
* Gets a list of billing plan discounts
* @param pageNum 
* @param orderBy 
* @param order 
* @param subscriptionOnly 
* @param types 
*/
export function adminListBillingPlanDiscounts(params: {  "pageNum"?: number; "orderBy"?: string; "order"?: string; "subscriptionOnly"?: boolean; "types"?: Array<string>; }): Promise<{ response: Response, data: Array<Discount> }> {
    const path = `/admin/billing/plans/discounts`;

    return makeRequest<Array<Discount>>(
        "GET",
        path,
        {
            ...params["pageNum"] !== undefined && { "pageNum": params["pageNum"] },
            ...params["orderBy"] !== undefined && { "orderBy": params["orderBy"] },
            ...params["order"] !== undefined && { "order": params["order"] },
            ...params["subscriptionOnly"] !== undefined && { "subscriptionOnly": params["subscriptionOnly"] },
            ...params["types"] !== undefined && { "types": params["types"] }
        },
    );
}

/** 
* Get a document
* @param id 
* @param resourceId 
*/
export function getDocument(params: {  "id": string; "resourceId"?: string; }): Promise<{ response: Response, data: undefined }> {
    const path = `/documents/{id}`.replace(`{${"id"}}`, `${ params["id"] }`);

    return makeRequest(
        "GET",
        path,
        {
            ...params["resourceId"] !== undefined && { "resourceId": params["resourceId"] }
        },
    );
}

/** 
* Creates an earned membership
* @param body 
*/
export function adminCreateEarnedMembership(params: {  "body": NewEarnedMembership; }): Promise<{ response: Response, data: EarnedMembership }> {
    const path = `/admin/earned_memberships`;

    return makeRequest<EarnedMembership>(
        "POST",
        path,
        params["body"]
    );
}
/** 
* Gets an earned membership
* @param id 
*/
export function adminGetEarnedMembership(params: {  "id": string; }): Promise<{ response: Response, data: EarnedMembership }> {
    const path = `/admin/earned_memberships/{id}`.replace(`{${"id"}}`, `${ params["id"] }`);

    return makeRequest<EarnedMembership>(
        "GET",
        path,
    );
}
/** 
* Gets a list of earned memberships
* @param pageNum 
* @param orderBy 
* @param order 
*/
export function adminListEarnedMemberships(params: {  "pageNum"?: number; "orderBy"?: string; "order"?: string; }): Promise<{ response: Response, data: Array<EarnedMembership> }> {
    const path = `/admin/earned_memberships`;

    return makeRequest<Array<EarnedMembership>>(
        "GET",
        path,
        {
            ...params["pageNum"] !== undefined && { "pageNum": params["pageNum"] },
            ...params["orderBy"] !== undefined && { "orderBy": params["orderBy"] },
            ...params["order"] !== undefined && { "order": params["order"] }
        },
    );
}
/** 
* Updates an earned membership
* @param body 
* @param id 
*/
export function adminUpdateEarnedMembership(params: {  "body": EarnedMembership; "id": string; }): Promise<{ response: Response, data: EarnedMembership }> {
    const path = `/admin/earned_memberships/{id}`.replace(`{${"id"}}`, `${ params["id"] }`);

    return makeRequest<EarnedMembership>(
        "PUT",
        path,
        params["body"]
    );
}
/** 
* Gets an earned membership
* @param id 
*/
export function getEarnedMembership(params: {  "id": string; }): Promise<{ response: Response, data: EarnedMembership }> {
    const path = `/earned_memberships/{id}`.replace(`{${"id"}}`, `${ params["id"] }`);

    return makeRequest<EarnedMembership>(
        "GET",
        path,
    );
}

/** 
* Creates an invoice option
* @param body 
*/
export function adminCreateInvoiceOption(params: {  "body": NewInvoiceOption; }): Promise<{ response: Response, data: InvoiceOption }> {
    const path = `/admin/invoice_options`;

    return makeRequest<InvoiceOption>(
        "POST",
        path,
        params["body"]
    );
}
/** 
* Deletes an invoice option
* @param id 
*/
export function adminDeleteInvoiceOption(params: {  "id": string; }): Promise<{ response: Response, data: undefined }> {
    const path = `/admin/invoice_options/{id}`.replace(`{${"id"}}`, `${ params["id"] }`);

    return makeRequest(
        "DELETE",
        path,
    );
}
/** 
* Updates an invoice option
* @param body 
* @param id 
*/
export function adminUpdateInvoiceOption(params: {  "body": InvoiceOption; "id": string; }): Promise<{ response: Response, data: InvoiceOption }> {
    const path = `/admin/invoice_options/{id}`.replace(`{${"id"}}`, `${ params["id"] }`);

    return makeRequest<InvoiceOption>(
        "PUT",
        path,
        params["body"]
    );
}
/** 
* Gets an Invoice Option
* @param id 
*/
export function getInvoiceOption(params: {  "id": string; }): Promise<{ response: Response, data: InvoiceOption }> {
    const path = `/invoice_options/{id}`.replace(`{${"id"}}`, `${ params["id"] }`);

    return makeRequest<InvoiceOption>(
        "GET",
        path,
    );
}
/** 
* Gets a list of invoice_options
* @param pageNum 
* @param orderBy 
* @param order 
* @param subscriptionOnly 
* @param types 
*/
export function listInvoiceOptions(params: {  "pageNum"?: number; "orderBy"?: string; "order"?: string; "subscriptionOnly"?: boolean; "types"?: Array<string>; }): Promise<{ response: Response, data: Array<InvoiceOption> }> {
    const path = `/invoice_options`;

    return makeRequest<Array<InvoiceOption>>(
        "GET",
        path,
        {
            ...params["pageNum"] !== undefined && { "pageNum": params["pageNum"] },
            ...params["orderBy"] !== undefined && { "orderBy": params["orderBy"] },
            ...params["order"] !== undefined && { "order": params["order"] },
            ...params["subscriptionOnly"] !== undefined && { "subscriptionOnly": params["subscriptionOnly"] },
            ...params["types"] !== undefined && { "types": params["types"] }
        },
    );
}

/** 
* Creates an invoice
* @param body 
*/
export function adminCreateInvoices(params: {  "body": CreateInvoiceDetails; }): Promise<{ response: Response, data: Invoice }> {
    const path = `/admin/invoices`;

    return makeRequest<Invoice>(
        "POST",
        path,
        params["body"]
    );
}
/** 
* Deletes an invoice
* @param id 
*/
export function adminDeleteInvoice(params: {  "id": string; }): Promise<{ response: Response, data: undefined }> {
    const path = `/admin/invoices/{id}`.replace(`{${"id"}}`, `${ params["id"] }`);

    return makeRequest(
        "DELETE",
        path,
    );
}
/** 
* Gets a list of invoices
* @param pageNum 
* @param orderBy 
* @param order 
* @param search 
* @param settled 
* @param pastDue 
* @param refunded 
* @param refundRequested 
* @param planId 
* @param resourceId 
* @param memberId 
* @param resourceClass 
*/
export function adminListInvoices(params: {  "pageNum"?: number; "orderBy"?: string; "order"?: string; "search"?: string; "settled"?: boolean; "pastDue"?: boolean; "refunded"?: boolean; "refundRequested"?: boolean; "planId"?: Array<string>; "resourceId"?: Array<string>; "memberId"?: Array<string>; "resourceClass"?: Array<string>; }): Promise<{ response: Response, data: Array<Invoice> }> {
    const path = `/admin/invoices`;

    return makeRequest<Array<Invoice>>(
        "GET",
        path,
        {
            ...params["pageNum"] !== undefined && { "pageNum": params["pageNum"] },
            ...params["orderBy"] !== undefined && { "orderBy": params["orderBy"] },
            ...params["order"] !== undefined && { "order": params["order"] },
            ...params["search"] !== undefined && { "search": params["search"] },
            ...params["settled"] !== undefined && { "settled": params["settled"] },
            ...params["pastDue"] !== undefined && { "pastDue": params["pastDue"] },
            ...params["refunded"] !== undefined && { "refunded": params["refunded"] },
            ...params["refundRequested"] !== undefined && { "refundRequested": params["refundRequested"] },
            ...params["planId"] !== undefined && { "planId": params["planId"] },
            ...params["resourceId"] !== undefined && { "resourceId": params["resourceId"] },
            ...params["memberId"] !== undefined && { "memberId": params["memberId"] },
            ...params["resourceClass"] !== undefined && { "resourceClass": params["resourceClass"] }
        },
    );
}
/** 
* Updates an invoice
* @param body 
* @param id 
*/
export function adminUpdateInvoice(params: {  "body": UpdateInvoiceDetails; "id": string; }): Promise<{ response: Response, data: Invoice }> {
    const path = `/admin/invoices/{id}`.replace(`{${"id"}}`, `${ params["id"] }`);

    return makeRequest<Invoice>(
        "PUT",
        path,
        params["body"]
    );
}
/** 
* Create an invoice
* @param body 
*/
export function createInvoice(params: {  "body": CreateInvoiceDetails1; }): Promise<{ response: Response, data: Invoice }> {
    const path = `/invoices`;

    return makeRequest<Invoice>(
        "POST",
        path,
        params["body"]
    );
}
/** 
* Gets a list of invoices
* @param pageNum 
* @param orderBy 
* @param order 
* @param settled 
* @param pastDue 
* @param refunded 
* @param refundRequested 
* @param planId 
* @param resourceId 
* @param resourceClass 
*/
export function listInvoices(params: {  "pageNum"?: number; "orderBy"?: string; "order"?: string; "settled"?: boolean; "pastDue"?: boolean; "refunded"?: boolean; "refundRequested"?: boolean; "planId"?: Array<string>; "resourceId"?: Array<string>; "resourceClass"?: Array<string>; }): Promise<{ response: Response, data: Array<Invoice> }> {
    const path = `/invoices`;

    return makeRequest<Array<Invoice>>(
        "GET",
        path,
        {
            ...params["pageNum"] !== undefined && { "pageNum": params["pageNum"] },
            ...params["orderBy"] !== undefined && { "orderBy": params["orderBy"] },
            ...params["order"] !== undefined && { "order": params["order"] },
            ...params["settled"] !== undefined && { "settled": params["settled"] },
            ...params["pastDue"] !== undefined && { "pastDue": params["pastDue"] },
            ...params["refunded"] !== undefined && { "refunded": params["refunded"] },
            ...params["refundRequested"] !== undefined && { "refundRequested": params["refundRequested"] },
            ...params["planId"] !== undefined && { "planId": params["planId"] },
            ...params["resourceId"] !== undefined && { "resourceId": params["resourceId"] },
            ...params["resourceClass"] !== undefined && { "resourceClass": params["resourceClass"] }
        },
    );
}

/** 
* Creates a member
* @param body 
*/
export function adminCreateMember(params: {  "body": NewMember; }): Promise<{ response: Response, data: Member }> {
    const path = `/admin/members`;

    return makeRequest<Member>(
        "POST",
        path,
        params["body"]
    );
}
/** 
* Updates a member
* @param body 
* @param id 
*/
export function adminUpdateMember(params: {  "body": AdminUpdateMemberDetails; "id": string; }): Promise<{ response: Response, data: Member }> {
    const path = `/admin/members/{id}`.replace(`{${"id"}}`, `${ params["id"] }`);

    return makeRequest<Member>(
        "PUT",
        path,
        params["body"]
    );
}
/** 
* Gets a member
* @param id 
*/
export function getMember(params: {  "id": string; }): Promise<{ response: Response, data: Member }> {
    const path = `/members/{id}`.replace(`{${"id"}}`, `${ params["id"] }`);

    return makeRequest<Member>(
        "GET",
        path,
    );
}
/** 
* Gets a list of members
* @param pageNum 
* @param orderBy 
* @param order 
* @param currentMembers 
* @param search 
*/
export function listMembers(params: {  "pageNum"?: number; "orderBy"?: string; "order"?: string; "currentMembers"?: boolean; "search"?: string; }): Promise<{ response: Response, data: Array<MemberSummary> }> {
    const path = `/members`;

    return makeRequest<Array<MemberSummary>>(
        "GET",
        path,
        {
            ...params["pageNum"] !== undefined && { "pageNum": params["pageNum"] },
            ...params["orderBy"] !== undefined && { "orderBy": params["orderBy"] },
            ...params["order"] !== undefined && { "order": params["order"] },
            ...params["currentMembers"] !== undefined && { "currentMembers": params["currentMembers"] },
            ...params["search"] !== undefined && { "search": params["search"] }
        },
    );
}
/** 
* Updates a member and uploads signature
* @param body 
* @param id 
*/
export function updateMember(params: {  "body": UpdateMemberDetails; "id": string; }): Promise<{ response: Response, data: Member }> {
    const path = `/members/{id}`.replace(`{${"id"}}`, `${ params["id"] }`);

    return makeRequest<Member>(
        "PUT",
        path,
        params["body"]
    );
}

/** 
* Sends password reset instructions
* @param body 
*/
export function requestPasswordReset(params: {  "body": PasswordResetDetails1; }): Promise<{ response: Response, data: undefined }> {
    const path = `/members/password`;

    return makeRequest(
        "POST",
        path,
        params["body"]
    );
}
/** 
* Updates member password
* @param body 
*/
export function resetPassword(params: {  "body": PasswordResetDetails; }): Promise<{ response: Response, data: undefined }> {
    const path = `/members/password`;

    return makeRequest(
        "PUT",
        path,
        params["body"]
    );
}

/** 
* Create an payment_method
* @param body 
*/
export function createPaymentMethod(params: {  "body": CreatePaymentMethodDetails; }): Promise<{ response: Response, data: CreditCard }> {
    const path = `/billing/payment_methods`;

    return makeRequest<CreditCard>(
        "POST",
        path,
        params["body"]
    );
}
/** 
* Deletes a payment method
* @param id 
*/
export function deletePaymentMethod(params: {  "id": string; }): Promise<{ response: Response, data: undefined }> {
    const path = `/billing/payment_methods/{id}`.replace(`{${"id"}}`, `${ params["id"] }`);

    return makeRequest(
        "DELETE",
        path,
    );
}
/** 
* Initiate new payment method creation
*/
export function getNewPaymentMethod(): Promise<{ response: Response, data: InlineResponse2001 }> {
    const path = `/billing/payment_methods/new`;

    return makeRequest<InlineResponse2001>(
        "GET",
        path,
    );
}
/** 
* Get a payment method
* @param id 
*/
export function getPaymentMethod(params: {  "id": string; }): Promise<{ response: Response, data: CreditCard }> {
    const path = `/billing/payment_methods/{id}`.replace(`{${"id"}}`, `${ params["id"] }`);

    return makeRequest<CreditCard>(
        "GET",
        path,
    );
}
/** 
* Gets a list of payment_methods
*/
export function listPaymentMethods(): Promise<{ response: Response, data: Array<CreditCard | PayPalAccount> }> {
    const path = `/billing/payment_methods`;

    return makeRequest<Array<CreditCard | PayPalAccount>>(
        "GET",
        path,
    );
}

/** 
* Gets a member&#39;s permissions
* @param id 
*/
export function listMembersPermissions(params: {  "id": string; }): Promise<{ response: Response, data: any }> {
    const path = `/members/{id}/permissions`.replace(`{${"id"}}`, `${ params["id"] }`);

    return makeRequest<any>(
        "GET",
        path,
    );
}

/** 
* Gets a list of billing plans
* @param pageNum 
* @param orderBy 
* @param order 
* @param types 
*/
export function adminListBillingPlans(params: {  "pageNum"?: number; "orderBy"?: string; "order"?: string; "types"?: Array<string>; }): Promise<{ response: Response, data: Array<Plan> }> {
    const path = `/admin/billing/plans`;

    return makeRequest<Array<Plan>>(
        "GET",
        path,
        {
            ...params["pageNum"] !== undefined && { "pageNum": params["pageNum"] },
            ...params["orderBy"] !== undefined && { "orderBy": params["orderBy"] },
            ...params["order"] !== undefined && { "order": params["order"] },
            ...params["types"] !== undefined && { "types": params["types"] }
        },
    );
}

/** 
* Get a receipt for an invoice
* @param id 
*/
export function adminGetReceipt(params: {  "id": string; }): Promise<{ response: Response, data: undefined }> {
    const path = `/admin/billing/receipts/{id}`.replace(`{${"id"}}`, `${ params["id"] }`);

    return makeRequest(
        "GET",
        path,
    );
}
/** 
* Get a receipt for an invoice
* @param id 
*/
export function getReceipt(params: {  "id": string; }): Promise<{ response: Response, data: undefined }> {
    const path = `/billing/receipts/{id}`.replace(`{${"id"}}`, `${ params["id"] }`);

    return makeRequest(
        "GET",
        path,
    );
}

/** 
* Creates a rental
* @param body 
*/
export function adminCreateRental(params: {  "body": NewRental; }): Promise<{ response: Response, data: Rental }> {
    const path = `/admin/rentals`;

    return makeRequest<Rental>(
        "POST",
        path,
        params["body"]
    );
}
/** 
* Deletes a rental
* @param id 
*/
export function adminDeleteRental(params: {  "id": string; }): Promise<{ response: Response, data: undefined }> {
    const path = `/admin/rentals/{id}`.replace(`{${"id"}}`, `${ params["id"] }`);

    return makeRequest(
        "DELETE",
        path,
    );
}
/** 
* Gets a list of rentals
* @param pageNum 
* @param orderBy 
* @param order 
* @param search 
* @param memberId 
*/
export function adminListRentals(params: {  "pageNum"?: number; "orderBy"?: string; "order"?: string; "search"?: string; "memberId"?: string; }): Promise<{ response: Response, data: Array<Rental> }> {
    const path = `/admin/rentals`;

    return makeRequest<Array<Rental>>(
        "GET",
        path,
        {
            ...params["pageNum"] !== undefined && { "pageNum": params["pageNum"] },
            ...params["orderBy"] !== undefined && { "orderBy": params["orderBy"] },
            ...params["order"] !== undefined && { "order": params["order"] },
            ...params["search"] !== undefined && { "search": params["search"] },
            ...params["memberId"] !== undefined && { "memberId": params["memberId"] }
        },
    );
}
/** 
* Updates a rental
* @param body 
* @param id 
*/
export function adminUpdateRental(params: {  "body": Rental; "id": string; }): Promise<{ response: Response, data: Rental }> {
    const path = `/admin/rentals/{id}`.replace(`{${"id"}}`, `${ params["id"] }`);

    return makeRequest<Rental>(
        "PUT",
        path,
        params["body"]
    );
}
/** 
* Gets a rental
* @param id 
*/
export function getRental(params: {  "id": string; }): Promise<{ response: Response, data: Rental }> {
    const path = `/rentals/{id}`.replace(`{${"id"}}`, `${ params["id"] }`);

    return makeRequest<Rental>(
        "GET",
        path,
    );
}
/** 
* Gets a list of rentals
* @param pageNum 
* @param orderBy 
* @param order 
*/
export function listRentals(params: {  "pageNum"?: number; "orderBy"?: string; "order"?: string; }): Promise<{ response: Response, data: Array<Rental> }> {
    const path = `/rentals`;

    return makeRequest<Array<Rental>>(
        "GET",
        path,
        {
            ...params["pageNum"] !== undefined && { "pageNum": params["pageNum"] },
            ...params["orderBy"] !== undefined && { "orderBy": params["orderBy"] },
            ...params["order"] !== undefined && { "order": params["order"] }
        },
    );
}
/** 
* Updates a rental and uploads signature
* @param body 
* @param id 
*/
export function updateRental(params: {  "body": UpdateRentalDetails; "id": string; }): Promise<{ response: Response, data: Rental }> {
    const path = `/rentals/{id}`.replace(`{${"id"}}`, `${ params["id"] }`);

    return makeRequest<Rental>(
        "PUT",
        path,
        params["body"]
    );
}

/** 
* Gets a list of reports
* @param id 
* @param pageNum 
* @param orderBy 
* @param order 
*/
export function adminListEarnedMembershipReports(params: {  "id": string; "pageNum"?: number; "orderBy"?: string; "order"?: string; }): Promise<{ response: Response, data: Array<Report> }> {
    const path = `/admin/earned_memberships/{id}/reports`.replace(`{${"id"}}`, `${ params["id"] }`);

    return makeRequest<Array<Report>>(
        "GET",
        path,
        {
            ...params["pageNum"] !== undefined && { "pageNum": params["pageNum"] },
            ...params["orderBy"] !== undefined && { "orderBy": params["orderBy"] },
            ...params["order"] !== undefined && { "order": params["order"] }
        },
    );
}
/** 
* Create an report
* @param body 
* @param id 
*/
export function createEarnedMembershipReport(params: {  "body": NewReport; "id": string; }): Promise<{ response: Response, data: Report }> {
    const path = `/earned_memberships/{id}/reports`.replace(`{${"id"}}`, `${ params["id"] }`);

    return makeRequest<Report>(
        "POST",
        path,
        params["body"]
    );
}
/** 
* Gets a list of reports for current member
* @param id 
* @param pageNum 
* @param orderBy 
* @param order 
*/
export function listEarnedMembershipReports(params: {  "id": string; "pageNum"?: number; "orderBy"?: string; "order"?: string; }): Promise<{ response: Response, data: Array<Report> }> {
    const path = `/earned_memberships/{id}/reports`.replace(`{${"id"}}`, `${ params["id"] }`);

    return makeRequest<Array<Report>>(
        "GET",
        path,
        {
            ...params["pageNum"] !== undefined && { "pageNum": params["pageNum"] },
            ...params["orderBy"] !== undefined && { "orderBy": params["orderBy"] },
            ...params["order"] !== undefined && { "order": params["order"] }
        },
    );
}

/** 
* Cancels a subscription
* @param id 
*/
export function adminCancelSubscription(params: {  "id": string; }): Promise<{ response: Response, data: undefined }> {
    const path = `/admin/billing/subscriptions/{id}`.replace(`{${"id"}}`, `${ params["id"] }`);

    return makeRequest(
        "DELETE",
        path,
    );
}
/** 
* Lists subscription
* @param startDate 
* @param endDate 
* @param search 
* @param planId 
* @param subscriptionStatus 
* @param customerId 
*/
export function adminListSubscriptions(params: {  "startDate"?: string; "endDate"?: string; "search"?: string; "planId"?: Array<string>; "subscriptionStatus"?: Array<string>; "customerId"?: string; }): Promise<{ response: Response, data: Array<Subscription> }> {
    const path = `/admin/billing/subscriptions`;

    return makeRequest<Array<Subscription>>(
        "GET",
        path,
        {
            ...params["startDate"] !== undefined && { "startDate": params["startDate"] },
            ...params["endDate"] !== undefined && { "endDate": params["endDate"] },
            ...params["search"] !== undefined && { "search": params["search"] },
            ...params["planId"] !== undefined && { "planId": params["planId"] },
            ...params["subscriptionStatus"] !== undefined && { "subscriptionStatus": params["subscriptionStatus"] },
            ...params["customerId"] !== undefined && { "customerId": params["customerId"] }
        },
    );
}
/** 
* Cancels a subscription
* @param id 
*/
export function cancelSubscription(params: {  "id": string; }): Promise<{ response: Response, data: undefined }> {
    const path = `/billing/subscriptions/{id}`.replace(`{${"id"}}`, `${ params["id"] }`);

    return makeRequest(
        "DELETE",
        path,
    );
}
/** 
* Gets a subscription
* @param id 
*/
export function getSubscription(params: {  "id": string; }): Promise<{ response: Response, data: Subscription }> {
    const path = `/billing/subscriptions/{id}`.replace(`{${"id"}}`, `${ params["id"] }`);

    return makeRequest<Subscription>(
        "GET",
        path,
    );
}
/** 
* Update a subscription
* @param body 
* @param id 
*/
export function updateSubscription(params: {  "body": UpdateSubscriptionDetails; "id": string; }): Promise<{ response: Response, data: Subscription }> {
    const path = `/billing/subscriptions/{id}`.replace(`{${"id"}}`, `${ params["id"] }`);

    return makeRequest<Subscription>(
        "PUT",
        path,
        params["body"]
    );
}

/** 
* Request refund for a transaction
* @param id 
*/
export function adminDeleteTransaction(params: {  "id": string; }): Promise<{ response: Response, data: undefined }> {
    const path = `/admin/billing/transactions/{id}`.replace(`{${"id"}}`, `${ params["id"] }`);

    return makeRequest(
        "DELETE",
        path,
    );
}
/** 
* Gets a transaction
* @param id 
*/
export function adminGetTransaction(params: {  "id": string; }): Promise<{ response: Response, data: Transaction }> {
    const path = `/admin/billing/transactions/{id}`.replace(`{${"id"}}`, `${ params["id"] }`);

    return makeRequest<Transaction>(
        "GET",
        path,
    );
}
/** 
* Gets a list of transactions
* @param startDate 
* @param endDate 
* @param refund 
* @param type 
* @param transactionStatus 
* @param customerId 
*/
export function adminListTransaction(params: {  "startDate"?: string; "endDate"?: string; "refund"?: boolean; "type"?: string; "transactionStatus"?: Array<string>; "customerId"?: string; }): Promise<{ response: Response, data: Array<Transaction> }> {
    const path = `/admin/billing/transactions`;

    return makeRequest<Array<Transaction>>(
        "GET",
        path,
        {
            ...params["startDate"] !== undefined && { "startDate": params["startDate"] },
            ...params["endDate"] !== undefined && { "endDate": params["endDate"] },
            ...params["refund"] !== undefined && { "refund": params["refund"] },
            ...params["type"] !== undefined && { "type": params["type"] },
            ...params["transactionStatus"] !== undefined && { "transactionStatus": params["transactionStatus"] },
            ...params["customerId"] !== undefined && { "customerId": params["customerId"] }
        },
    );
}
/** 
* Create an transaction
* @param body 
*/
export function createTransaction(params: {  "body": CreateTransactionDetails; }): Promise<{ response: Response, data: Transaction }> {
    const path = `/billing/transactions`;

    return makeRequest<Transaction>(
        "POST",
        path,
        params["body"]
    );
}
/** 
* Request refund for a transaction
* @param id 
*/
export function deleteTransaction(params: {  "id": string; }): Promise<{ response: Response, data: undefined }> {
    const path = `/billing/transactions/{id}`.replace(`{${"id"}}`, `${ params["id"] }`);

    return makeRequest(
        "DELETE",
        path,
    );
}
/** 
* Gets a list of transactions
* @param startDate 
* @param endDate 
* @param refund 
* @param type 
* @param transactionStatus 
* @param paymentMethodToken 
*/
export function listTransactions(params: {  "startDate"?: string; "endDate"?: string; "refund"?: boolean; "type"?: string; "transactionStatus"?: Array<string>; "paymentMethodToken"?: Array<string>; }): Promise<{ response: Response, data: Array<Transaction> }> {
    const path = `/billing/transactions`;

    return makeRequest<Array<Transaction>>(
        "GET",
        path,
        {
            ...params["startDate"] !== undefined && { "startDate": params["startDate"] },
            ...params["endDate"] !== undefined && { "endDate": params["endDate"] },
            ...params["refund"] !== undefined && { "refund": params["refund"] },
            ...params["type"] !== undefined && { "type": params["type"] },
            ...params["transactionStatus"] !== undefined && { "transactionStatus": params["transactionStatus"] },
            ...params["paymentMethodToken"] !== undefined && { "paymentMethodToken": params["paymentMethodToken"] }
        },
    );
}
