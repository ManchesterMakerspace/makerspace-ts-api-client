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
let baseApiPath: string = "";
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

export const makeRequest = <T>(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  path: string,
  params?: { [key: string]: any },
  responseRoot?: string,
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
      if (responseRoot) {
        result.data = result.data[responseRoot];
      }
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

function validateRequiredParameters(
  required: string[],
  operationName: string,
  params: { [key: string]: any }
) {
  required.forEach(requiredParameter => {
    if (params[requiredParameter] === null) {
      throw new Error(`Missing required parameter ${requiredParameter} when calling ${operationName}`);
    }
  });
}

/* tslint:disable */

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

export interface CreditCard {
    "id": string;
    "_default": boolean;
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
    "imageUrl": string;
    "cardType": string;
    "expirationMonth": number;
    "expirationYear": number;
    "expirationDate": string;
    "last4": number;
    "debit": boolean;
    "token": string;
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

export interface EarnedMembership {
    "id": string;
    "memberId": string;
    "memberName": string;
    "memberStatus": EarnedMembershipMemberStatusEnum;
    "memberExpiration": number;
    "requirements": Array<Requirement>;
}


export enum EarnedMembershipMemberStatusEnum {
    ActiveMember = 'activeMember',
    Inactive = 'inactive',
    NonMember = 'nonMember',
    Revoked = 'revoked'
}

export interface Error {
    "message": string;
    "status"?: number;
    "error"?: string;
}

export interface InlineResponse200 {
    "analytics": InlineResponse200Analytics;
}

export interface InlineResponse2001 {
    "plans": Array<Plan>;
}

export interface InlineResponse20010 {
    "earnedMemberships": Array<EarnedMembership>;
}

export interface InlineResponse20011 {
    "earnedMembership": EarnedMembership;
}

export interface InlineResponse20012 {
    "invoiceOption": InvoiceOption;
}

export interface InlineResponse20013 {
    "invoices": Array<Invoice>;
}

export interface InlineResponse20014 {
    "invoice": Invoice;
}

export interface InlineResponse20015 {
    "member": Member;
}

export interface InlineResponse20016 {
    "rentals": Array<Rental>;
}

export interface InlineResponse20017 {
    "rental": Rental;
}

export interface InlineResponse20018 {
    "clientToken": string;
}

export interface InlineResponse20019 {
    "paymentMethods": Array<CreditCard>;
}

export interface InlineResponse2002 {
    "discounts": Array<Discount>;
}

export interface InlineResponse20020 {
    "paymentMethod": CreditCard;
}

export interface InlineResponse20021 {
    "subscription": Subscription;
}

export interface InlineResponse20022 {
    "report": Report;
}

export interface InlineResponse20023 {
    "invoiceOptions": Array<InvoiceOption>;
}

export interface InlineResponse20024 {
    "permissions": any;
}

export interface InlineResponse20025 {
    "members": Array<MemberSummary>;
}

export interface InlineResponse2003 {
    "subscriptions": Array<Subscription>;
}

export interface InlineResponse2004 {
    "transactions": Array<Transaction>;
}

export interface InlineResponse2005 {
    "transaction": Transaction;
}

export interface InlineResponse2006 {
    "card": InlineResponse2006Card;
}

export interface InlineResponse2006Card {
    "uid"?: string;
}

export interface InlineResponse2007 {
    "cards": Array<Card>;
}

export interface InlineResponse2008 {
    "card": Card;
}

export interface InlineResponse2009 {
    "reports": Array<Report>;
}

export interface InlineResponse200Analytics {
    "totalMembers"?: number;
    "newMembers"?: number;
    "subscribedMembers"?: number;
    "pastDueInvoices"?: number;
    "refundsPending"?: number;
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
    "resourceClass": InvoiceResourceClassEnum;
    "resourceId": string;
    "quantity": number;
    "discountId"?: string;
    "memberName": string;
    "memberId": string;
    "refunded": boolean;
    "refundRequested"?: string;
    "resource": Member | Rental;
}


export enum InvoiceResourceClassEnum {
    Member = 'member',
    Rental = 'rental'
}

export interface InvoiceOption {
    "id": string;
    "name": string;
    "description": string;
    "amount": string;
    "planId"?: string;
    "resourceClass": string;
    "quantity": number;
    "discountId"?: string;
    "disabled": boolean;
    "operation": string;
    "isPromotion": boolean;
}

export interface Member {
    "id": string;
    "firstname": string;
    "lastname": string;
    "email": string;
    "status": MemberStatus;
    "role": MemberRole;
    "expirationTime"?: number;
    "memberContractOnFile": boolean;
    "cardId"?: string;
    "subscriptionId"?: string;
    "subscription": boolean;
    "customerId"?: string;
    "earnedMembershipId"?: string;
    "notes"?: string;
    "phone"?: string;
    "address": MemberAddress;
}

export interface MemberAddress {
    "street"?: string;
    "unit"?: string;
    "city"?: string;
    "state"?: string;
    "postalCode"?: string;
}

export type MemberRole = "admin" | "member";
export enum MemberRoleValues {
    admin = "admin",
    member = "member"
}
export type MemberStatus = "activeMember" | "inactive" | "nonMember" | "revoked";
export enum MemberStatusValues {
    activeMember = "activeMember",
    inactive = "inactive",
    nonMember = "nonMember",
    revoked = "revoked"
}
export interface MemberSummary {
    "id": string;
    "firstname": string;
    "lastname": string;
    "email": string;
    "status": MemberStatus;
    "role": MemberRole;
    "expirationTime"?: number;
    "memberContractOnFile": boolean;
    "notes"?: string;
}

export interface NewEarnedMembership {
    "memberId": string;
    "requirements": Array<NewRequirement>;
}

export interface NewInvoiceOption {
    "name": string;
    "description": string;
    "amount": string;
    "planId"?: string;
    "resourceClass": string;
    "quantity": number;
    "discountId"?: string;
    "disabled": boolean;
    "isPromotion": boolean;
}

export interface NewMember {
    "firstname": string;
    "lastname": string;
    "email": string;
    "status": MemberStatus;
    "role": MemberRole;
    "memberContractOnFile": boolean;
    "phone": string;
    "address": NewMemberAddress;
}

export interface NewMemberAddress {
    "street"?: string;
    "unit"?: string;
    "city"?: string;
    "state"?: string;
    "postalCode"?: string;
}

export interface NewRental {
    "number": string;
    "description": string;
    "memberId": string;
    "expiration": number;
    "contractOnFile": boolean;
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
    "email"?: Array<string>;
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
    "imageUrl": string;
    "payerEmail": string;
    "payerFirstName": string;
    "payerLastName": string;
    "token": string;
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
    "id"?: string;
    "name"?: string;
    "description"?: string;
    "amount"?: string;
}

export interface Rental {
    "id": string;
    "number": string;
    "description": string;
    "memberName": string;
    "memberId": string;
    "expiration": number;
    "subscriptionId"?: string;
    "contractOnFile": boolean;
    "notes"?: string;
}

export interface Report {
    "id": string;
    "date": string;
    "earnedMembershipId": string;
    "reportRequirements": Array<ReportRequirement>;
}

export interface ReportRequirement {
    "id": string;
    "requirementId": string;
    "reportedCount": number;
    "appliedCount": number;
    "currentCount": number;
    "memberIds": Array<string>;
    "termStartDate": string;
    "termEndDate": string;
    "satisfied": boolean;
}

export interface Requirement {
    "id": string;
    "earnedMembershipId": string;
    "name": string;
    "rolloverLimit": number;
    "termLength": number;
    "targetCount": number;
    "strict": boolean;
    "currentCount": number;
    "termStartDate": string;
    "termEndDate": string;
    "termId": string;
    "satisfied": boolean;
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
    "subscriptionDetails": TransactionSubscriptionDetails;
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


export type adminListAnalyticsReturnType = InlineResponse200[keyof InlineResponse200];

/** 
* Lists analytic counts
*/
export function adminListAnalytics(): Promise<{ response: Response, data: adminListAnalyticsReturnType }> {

    const path = `/admin/analytics`;

    return makeRequest<adminListAnalyticsReturnType>(
        "GET",
        path,
    );
}
export type registerMemberReturnType = InlineResponse20015[keyof InlineResponse20015];
export type sendRegistrationEmailReturnType = Response;
export type signInReturnType = InlineResponse20015[keyof InlineResponse20015];
export type signOutReturnType = Response;

/** 
* Registers new member
*/
export function registerMember(): Promise<{ response: Response, data: registerMemberReturnType }> {

    const path = `/members`;

    return makeRequest<registerMemberReturnType>(
        "POST",
        path,
    );
}
/** 
* Sends registration email
*/
export function sendRegistrationEmail(): Promise<{ response: Response, data: undefined }> {

    const path = `/send_registration`;

    return makeRequest(
        "POST",
        path,
    );
}
/** 
* Signs in user
*/
export function signIn(): Promise<{ response: Response, data: signInReturnType }> {

    const path = `/members/sign_in`;

    return makeRequest<signInReturnType>(
        "POST",
        path,
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
export type adminCreateCardReturnType = InlineResponse2008[keyof InlineResponse2008];
export type adminGetNewCardReturnType = InlineResponse2006[keyof InlineResponse2006];
export type adminListCardsReturnType = InlineResponse2007[keyof InlineResponse2007];
export type adminUpdateCardReturnType = InlineResponse2008[keyof InlineResponse2008];

/** 
* Creates an access card
*/
export function adminCreateCard(): Promise<{ response: Response, data: adminCreateCardReturnType }> {

    const path = `/admin/cards`;

    return makeRequest<adminCreateCardReturnType>(
        "POST",
        path,
    );
}
/** 
* Initiate new card creation
*/
export function adminGetNewCard(): Promise<{ response: Response, data: adminGetNewCardReturnType }> {

    const path = `/admin/cards/new`;

    return makeRequest<adminGetNewCardReturnType>(
        "GET",
        path,
    );
}
/** 
* Gets a list of members cards
* @param memberId 
*/
export function adminListCards(params: {  "memberId": string; }): Promise<{ response: Response, data: adminListCardsReturnType }> {
    validateRequiredParameters(
        ["memberId"], 
        "adminListCards", 
        params
    );

    const path = `/admin/cards`;

    return makeRequest<adminListCardsReturnType>(
        "GET",
        path,
        {
            "memberId": { values: params["memberId"] }
        },
    );
}
/** 
* Updates a card
* @param id 
*/
export function adminUpdateCard(params: {  "id": string; }): Promise<{ response: Response, data: adminUpdateCardReturnType }> {
    validateRequiredParameters(
        ["id"], 
        "adminUpdateCard", 
        params
    );

    const path = `/admin/cards/{id}`.replace(`{${"id"}}`, `${ params["id"] }`);

    return makeRequest<adminUpdateCardReturnType>(
        "PUT",
        path,
    );
}
export type messageReturnType = Response;

/** 
* Sends a slack message
*/
export function message(): Promise<{ response: Response, data: undefined }> {

    const path = `/client_error_handler`;

    return makeRequest(
        "POST",
        path,
    );
}
export type adminListBillingPlanDiscountsReturnType = InlineResponse2002[keyof InlineResponse2002];

/** 
* Gets a list of billing plan discounts
* @param pageNum 
* @param orderBy 
* @param order 
* @param subscriptionOnly 
* @param types 
*/
export function adminListBillingPlanDiscounts(params: {  "pageNum"?: number; "orderBy"?: string; "order"?: string; "subscriptionOnly"?: boolean; "types"?: Array<string>; }): Promise<{ response: Response, data: adminListBillingPlanDiscountsReturnType }> {
    validateRequiredParameters(
        [], 
        "adminListBillingPlanDiscounts", 
        params
    );

    const path = `/admin/billing/plans/discounts`;

    return makeRequest<adminListBillingPlanDiscountsReturnType>(
        "GET",
        path,
        {
            "pageNum": { values: params["pageNum"] },
            "orderBy": { values: params["orderBy"] },
            "order": { values: params["order"] },
            "subscriptionOnly": { values: params["subscriptionOnly"] },
            "types": { values: params["types"], collectionFormat: "multi" }
        },
    );
}
export type getDocumentReturnType = Response;

/** 
* Get a document
* @param id 
* @param resourceId 
*/
export function getDocument(params: {  "id": string; "resourceId"?: string; }): Promise<{ response: Response, data: undefined }> {
    validateRequiredParameters(
        ["id",], 
        "getDocument", 
        params
    );

    const path = `/documents/{id}`.replace(`{${"id"}}`, `${ params["id"] }`);

    return makeRequest(
        "GET",
        path,
        {
            "resourceId": { values: params["resourceId"] }
        },
    );
}
export type adminCreateEarnedMembershipReturnType = InlineResponse20011[keyof InlineResponse20011];
export type adminGetEarnedMembershipReturnType = InlineResponse20011[keyof InlineResponse20011];
export type adminListEarnedMembershipsReturnType = InlineResponse20010[keyof InlineResponse20010];
export type adminUpdateEarnedMembershipReturnType = InlineResponse20011[keyof InlineResponse20011];
export type getEarnedMembershipReturnType = InlineResponse20011[keyof InlineResponse20011];

/** 
* Creates an earned membership
*/
export function adminCreateEarnedMembership(): Promise<{ response: Response, data: adminCreateEarnedMembershipReturnType }> {

    const path = `/admin/earned_memberships`;

    return makeRequest<adminCreateEarnedMembershipReturnType>(
        "POST",
        path,
    );
}
/** 
* Gets an earned membership
* @param id 
*/
export function adminGetEarnedMembership(params: {  "id": string; }): Promise<{ response: Response, data: adminGetEarnedMembershipReturnType }> {
    validateRequiredParameters(
        ["id"], 
        "adminGetEarnedMembership", 
        params
    );

    const path = `/admin/earned_memberships/{id}`.replace(`{${"id"}}`, `${ params["id"] }`);

    return makeRequest<adminGetEarnedMembershipReturnType>(
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
export function adminListEarnedMemberships(params: {  "pageNum"?: number; "orderBy"?: string; "order"?: string; }): Promise<{ response: Response, data: adminListEarnedMembershipsReturnType }> {
    validateRequiredParameters(
        [], 
        "adminListEarnedMemberships", 
        params
    );

    const path = `/admin/earned_memberships`;

    return makeRequest<adminListEarnedMembershipsReturnType>(
        "GET",
        path,
        {
            "pageNum": { values: params["pageNum"] },
            "orderBy": { values: params["orderBy"] },
            "order": { values: params["order"] }
        },
    );
}
/** 
* Updates an earned membership
* @param id 
*/
export function adminUpdateEarnedMembership(params: {  "id": string; }): Promise<{ response: Response, data: adminUpdateEarnedMembershipReturnType }> {
    validateRequiredParameters(
        ["id"], 
        "adminUpdateEarnedMembership", 
        params
    );

    const path = `/admin/earned_memberships/{id}`.replace(`{${"id"}}`, `${ params["id"] }`);

    return makeRequest<adminUpdateEarnedMembershipReturnType>(
        "PUT",
        path,
    );
}
/** 
* Gets an earned membership
* @param id 
*/
export function getEarnedMembership(params: {  "id": string; }): Promise<{ response: Response, data: getEarnedMembershipReturnType }> {
    validateRequiredParameters(
        ["id"], 
        "getEarnedMembership", 
        params
    );

    const path = `/earned_memberships/{id}`.replace(`{${"id"}}`, `${ params["id"] }`);

    return makeRequest<getEarnedMembershipReturnType>(
        "GET",
        path,
    );
}
export type adminCreateInvoiceOptionReturnType = InlineResponse20012[keyof InlineResponse20012];
export type adminDeleteInvoiceOptionReturnType = Response;
export type adminUpdateInvoiceOptionReturnType = InlineResponse20012[keyof InlineResponse20012];
export type getInvoiceOptionReturnType = InlineResponse20012[keyof InlineResponse20012];
export type listInvoiceOptionsReturnType = InlineResponse20023[keyof InlineResponse20023];

/** 
* Creates an invoice option
*/
export function adminCreateInvoiceOption(): Promise<{ response: Response, data: adminCreateInvoiceOptionReturnType }> {

    const path = `/admin/invoice_options`;

    return makeRequest<adminCreateInvoiceOptionReturnType>(
        "POST",
        path,
    );
}
/** 
* Deletes an invoice option
* @param id 
*/
export function adminDeleteInvoiceOption(params: {  "id": string; }): Promise<{ response: Response, data: undefined }> {
    validateRequiredParameters(
        ["id"], 
        "adminDeleteInvoiceOption", 
        params
    );

    const path = `/admin/invoice_options/{id}`.replace(`{${"id"}}`, `${ params["id"] }`);

    return makeRequest(
        "DELETE",
        path,
    );
}
/** 
* Updates an invoice option
* @param id 
*/
export function adminUpdateInvoiceOption(params: {  "id": string; }): Promise<{ response: Response, data: adminUpdateInvoiceOptionReturnType }> {
    validateRequiredParameters(
        ["id"], 
        "adminUpdateInvoiceOption", 
        params
    );

    const path = `/admin/invoice_options/{id}`.replace(`{${"id"}}`, `${ params["id"] }`);

    return makeRequest<adminUpdateInvoiceOptionReturnType>(
        "PUT",
        path,
    );
}
/** 
* Gets an Invoice Option
* @param id 
*/
export function getInvoiceOption(params: {  "id": string; }): Promise<{ response: Response, data: getInvoiceOptionReturnType }> {
    validateRequiredParameters(
        ["id"], 
        "getInvoiceOption", 
        params
    );

    const path = `/invoice_options/{id}`.replace(`{${"id"}}`, `${ params["id"] }`);

    return makeRequest<getInvoiceOptionReturnType>(
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
export function listInvoiceOptions(params: {  "pageNum"?: number; "orderBy"?: string; "order"?: string; "subscriptionOnly"?: boolean; "types"?: Array<string>; }): Promise<{ response: Response, data: listInvoiceOptionsReturnType }> {
    validateRequiredParameters(
        [], 
        "listInvoiceOptions", 
        params
    );

    const path = `/invoice_options`;

    return makeRequest<listInvoiceOptionsReturnType>(
        "GET",
        path,
        {
            "pageNum": { values: params["pageNum"] },
            "orderBy": { values: params["orderBy"] },
            "order": { values: params["order"] },
            "subscriptionOnly": { values: params["subscriptionOnly"] },
            "types": { values: params["types"], collectionFormat: "multi" }
        },
    );
}
export type adminCreateInvoicesReturnType = InlineResponse20014[keyof InlineResponse20014];
export type adminDeleteInvoiceReturnType = Response;
export type adminListInvoicesReturnType = InlineResponse20013[keyof InlineResponse20013];
export type adminUpdateInvoiceReturnType = InlineResponse20014[keyof InlineResponse20014];
export type createInvoiceReturnType = InlineResponse20014[keyof InlineResponse20014];
export type listInvoicesReturnType = InlineResponse20013[keyof InlineResponse20013];

/** 
* Creates an invoice
*/
export function adminCreateInvoices(): Promise<{ response: Response, data: adminCreateInvoicesReturnType }> {

    const path = `/admin/invoices`;

    return makeRequest<adminCreateInvoicesReturnType>(
        "POST",
        path,
    );
}
/** 
* Deletes an invoice
* @param id 
*/
export function adminDeleteInvoice(params: {  "id": string; }): Promise<{ response: Response, data: undefined }> {
    validateRequiredParameters(
        ["id"], 
        "adminDeleteInvoice", 
        params
    );

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
export function adminListInvoices(params: {  "pageNum"?: number; "orderBy"?: string; "order"?: string; "search"?: string; "settled"?: boolean; "pastDue"?: boolean; "refunded"?: boolean; "refundRequested"?: boolean; "planId"?: Array<string>; "resourceId"?: Array<string>; "memberId"?: Array<string>; "resourceClass"?: Array<string>; }): Promise<{ response: Response, data: adminListInvoicesReturnType }> {
    validateRequiredParameters(
        [], 
        "adminListInvoices", 
        params
    );

    const path = `/admin/invoices`;

    return makeRequest<adminListInvoicesReturnType>(
        "GET",
        path,
        {
            "pageNum": { values: params["pageNum"] },
            "orderBy": { values: params["orderBy"] },
            "order": { values: params["order"] },
            "search": { values: params["search"] },
            "settled": { values: params["settled"] },
            "pastDue": { values: params["pastDue"] },
            "refunded": { values: params["refunded"] },
            "refundRequested": { values: params["refundRequested"] },
            "planId": { values: params["planId"], collectionFormat: "multi" },
            "resourceId": { values: params["resourceId"], collectionFormat: "multi" },
            "memberId": { values: params["memberId"], collectionFormat: "multi" },
            "resourceClass": { values: params["resourceClass"], collectionFormat: "multi" }
        },
    );
}
/** 
* Updates an invoice
* @param id 
*/
export function adminUpdateInvoice(params: {  "id": string; }): Promise<{ response: Response, data: adminUpdateInvoiceReturnType }> {
    validateRequiredParameters(
        ["id"], 
        "adminUpdateInvoice", 
        params
    );

    const path = `/admin/invoices/{id}`.replace(`{${"id"}}`, `${ params["id"] }`);

    return makeRequest<adminUpdateInvoiceReturnType>(
        "PUT",
        path,
    );
}
/** 
* Create an invoice
*/
export function createInvoice(): Promise<{ response: Response, data: createInvoiceReturnType }> {

    const path = `/invoices`;

    return makeRequest<createInvoiceReturnType>(
        "POST",
        path,
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
export function listInvoices(params: {  "pageNum"?: number; "orderBy"?: string; "order"?: string; "settled"?: boolean; "pastDue"?: boolean; "refunded"?: boolean; "refundRequested"?: boolean; "planId"?: Array<string>; "resourceId"?: Array<string>; "resourceClass"?: Array<string>; }): Promise<{ response: Response, data: listInvoicesReturnType }> {
    validateRequiredParameters(
        [], 
        "listInvoices", 
        params
    );

    const path = `/invoices`;

    return makeRequest<listInvoicesReturnType>(
        "GET",
        path,
        {
            "pageNum": { values: params["pageNum"] },
            "orderBy": { values: params["orderBy"] },
            "order": { values: params["order"] },
            "settled": { values: params["settled"] },
            "pastDue": { values: params["pastDue"] },
            "refunded": { values: params["refunded"] },
            "refundRequested": { values: params["refundRequested"] },
            "planId": { values: params["planId"], collectionFormat: "multi" },
            "resourceId": { values: params["resourceId"], collectionFormat: "multi" },
            "resourceClass": { values: params["resourceClass"], collectionFormat: "multi" }
        },
    );
}
export type adminCreateMemberReturnType = InlineResponse20015[keyof InlineResponse20015];
export type adminUpdateMemberReturnType = InlineResponse20015[keyof InlineResponse20015];
export type getMemberReturnType = InlineResponse20015[keyof InlineResponse20015];
export type listMembersReturnType = InlineResponse20025[keyof InlineResponse20025];
export type updateMemberReturnType = InlineResponse20015[keyof InlineResponse20015];

/** 
* Creates a member
*/
export function adminCreateMember(): Promise<{ response: Response, data: adminCreateMemberReturnType }> {

    const path = `/admin/members`;

    return makeRequest<adminCreateMemberReturnType>(
        "POST",
        path,
    );
}
/** 
* Updates a member
* @param id 
*/
export function adminUpdateMember(params: {  "id": string; }): Promise<{ response: Response, data: adminUpdateMemberReturnType }> {
    validateRequiredParameters(
        ["id"], 
        "adminUpdateMember", 
        params
    );

    const path = `/admin/members/{id}`.replace(`{${"id"}}`, `${ params["id"] }`);

    return makeRequest<adminUpdateMemberReturnType>(
        "PUT",
        path,
    );
}
/** 
* Gets a member
* @param id 
*/
export function getMember(params: {  "id": string; }): Promise<{ response: Response, data: getMemberReturnType }> {
    validateRequiredParameters(
        ["id"], 
        "getMember", 
        params
    );

    const path = `/members/{id}`.replace(`{${"id"}}`, `${ params["id"] }`);

    return makeRequest<getMemberReturnType>(
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
export function listMembers(params: {  "pageNum"?: number; "orderBy"?: string; "order"?: string; "currentMembers"?: boolean; "search"?: string; }): Promise<{ response: Response, data: listMembersReturnType }> {
    validateRequiredParameters(
        [], 
        "listMembers", 
        params
    );

    const path = `/members`;

    return makeRequest<listMembersReturnType>(
        "GET",
        path,
        {
            "pageNum": { values: params["pageNum"] },
            "orderBy": { values: params["orderBy"] },
            "order": { values: params["order"] },
            "currentMembers": { values: params["currentMembers"] },
            "search": { values: params["search"] }
        },
    );
}
/** 
* Updates a member and uploads signature
* @param id 
*/
export function updateMember(params: {  "id": string; }): Promise<{ response: Response, data: updateMemberReturnType }> {
    validateRequiredParameters(
        ["id"], 
        "updateMember", 
        params
    );

    const path = `/members/{id}`.replace(`{${"id"}}`, `${ params["id"] }`);

    return makeRequest<updateMemberReturnType>(
        "PUT",
        path,
    );
}
export type requestPasswordResetReturnType = Response;
export type resetPasswordReturnType = Response;

/** 
* Sends password reset instructions
*/
export function requestPasswordReset(): Promise<{ response: Response, data: undefined }> {

    const path = `/members/password`;

    return makeRequest(
        "POST",
        path,
    );
}
/** 
* Updates member password
*/
export function resetPassword(): Promise<{ response: Response, data: undefined }> {

    const path = `/members/password`;

    return makeRequest(
        "PUT",
        path,
    );
}
export type createPaymentMethodReturnType = InlineResponse20020[keyof InlineResponse20020];
export type deletePaymentMethodReturnType = Response;
export type getNewPaymentMethodReturnType = InlineResponse20018[keyof InlineResponse20018];
export type getPaymentMethodReturnType = InlineResponse20020[keyof InlineResponse20020];
export type listPaymentMethodsReturnType = InlineResponse20019[keyof InlineResponse20019];

/** 
* Create an payment_method
*/
export function createPaymentMethod(): Promise<{ response: Response, data: createPaymentMethodReturnType }> {

    const path = `/billing/payment_methods`;

    return makeRequest<createPaymentMethodReturnType>(
        "POST",
        path,
    );
}
/** 
* Deletes a payment method
* @param id 
*/
export function deletePaymentMethod(params: {  "id": string; }): Promise<{ response: Response, data: undefined }> {
    validateRequiredParameters(
        ["id"], 
        "deletePaymentMethod", 
        params
    );

    const path = `/billing/payment_methods/{id}`.replace(`{${"id"}}`, `${ params["id"] }`);

    return makeRequest(
        "DELETE",
        path,
    );
}
/** 
* Initiate new payment method creation
*/
export function getNewPaymentMethod(): Promise<{ response: Response, data: getNewPaymentMethodReturnType }> {

    const path = `/billing/payment_methods/new`;

    return makeRequest<getNewPaymentMethodReturnType>(
        "GET",
        path,
    );
}
/** 
* Get a payment method
* @param id 
*/
export function getPaymentMethod(params: {  "id": string; }): Promise<{ response: Response, data: getPaymentMethodReturnType }> {
    validateRequiredParameters(
        ["id"], 
        "getPaymentMethod", 
        params
    );

    const path = `/billing/payment_methods/{id}`.replace(`{${"id"}}`, `${ params["id"] }`);

    return makeRequest<getPaymentMethodReturnType>(
        "GET",
        path,
    );
}
/** 
* Gets a list of payment_methods
*/
export function listPaymentMethods(): Promise<{ response: Response, data: listPaymentMethodsReturnType }> {

    const path = `/billing/payment_methods`;

    return makeRequest<listPaymentMethodsReturnType>(
        "GET",
        path,
    );
}
export type listMembersPermissionsReturnType = InlineResponse20024[keyof InlineResponse20024];

/** 
* Gets a member&#39;s permissions
* @param id 
*/
export function listMembersPermissions(params: {  "id": string; }): Promise<{ response: Response, data: listMembersPermissionsReturnType }> {
    validateRequiredParameters(
        ["id"], 
        "listMembersPermissions", 
        params
    );

    const path = `/members/{id}/permissions`.replace(`{${"id"}}`, `${ params["id"] }`);

    return makeRequest<listMembersPermissionsReturnType>(
        "GET",
        path,
    );
}
export type adminListBillingPlansReturnType = InlineResponse2001[keyof InlineResponse2001];

/** 
* Gets a list of billing plans
* @param pageNum 
* @param orderBy 
* @param order 
* @param types 
*/
export function adminListBillingPlans(params: {  "pageNum"?: number; "orderBy"?: string; "order"?: string; "types"?: Array<string>; }): Promise<{ response: Response, data: adminListBillingPlansReturnType }> {
    validateRequiredParameters(
        [], 
        "adminListBillingPlans", 
        params
    );

    const path = `/admin/billing/plans`;

    return makeRequest<adminListBillingPlansReturnType>(
        "GET",
        path,
        {
            "pageNum": { values: params["pageNum"] },
            "orderBy": { values: params["orderBy"] },
            "order": { values: params["order"] },
            "types": { values: params["types"], collectionFormat: "multi" }
        },
    );
}
export type adminGetReceiptReturnType = Response;
export type getReceiptReturnType = Response;

/** 
* Get a receipt for an invoice
* @param id 
*/
export function adminGetReceipt(params: {  "id": string; }): Promise<{ response: Response, data: undefined }> {
    validateRequiredParameters(
        ["id"], 
        "adminGetReceipt", 
        params
    );

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
    validateRequiredParameters(
        ["id"], 
        "getReceipt", 
        params
    );

    const path = `/billing/receipts/{id}`.replace(`{${"id"}}`, `${ params["id"] }`);

    return makeRequest(
        "GET",
        path,
    );
}
export type adminCreateRentalReturnType = InlineResponse20017[keyof InlineResponse20017];
export type adminDeleteRentalReturnType = Response;
export type adminListRentalsReturnType = InlineResponse20016[keyof InlineResponse20016];
export type adminUpdateRentalReturnType = InlineResponse20017[keyof InlineResponse20017];
export type getRentalReturnType = InlineResponse20017[keyof InlineResponse20017];
export type listRentalsReturnType = InlineResponse20016[keyof InlineResponse20016];
export type updateRentalReturnType = InlineResponse20017[keyof InlineResponse20017];

/** 
* Creates a rental
*/
export function adminCreateRental(): Promise<{ response: Response, data: adminCreateRentalReturnType }> {

    const path = `/admin/rentals`;

    return makeRequest<adminCreateRentalReturnType>(
        "POST",
        path,
    );
}
/** 
* Deletes a rental
* @param id 
*/
export function adminDeleteRental(params: {  "id": string; }): Promise<{ response: Response, data: undefined }> {
    validateRequiredParameters(
        ["id"], 
        "adminDeleteRental", 
        params
    );

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
export function adminListRentals(params: {  "pageNum"?: number; "orderBy"?: string; "order"?: string; "search"?: string; "memberId"?: string; }): Promise<{ response: Response, data: adminListRentalsReturnType }> {
    validateRequiredParameters(
        [], 
        "adminListRentals", 
        params
    );

    const path = `/admin/rentals`;

    return makeRequest<adminListRentalsReturnType>(
        "GET",
        path,
        {
            "pageNum": { values: params["pageNum"] },
            "orderBy": { values: params["orderBy"] },
            "order": { values: params["order"] },
            "search": { values: params["search"] },
            "memberId": { values: params["memberId"] }
        },
    );
}
/** 
* Updates a rental
* @param id 
*/
export function adminUpdateRental(params: {  "id": string; }): Promise<{ response: Response, data: adminUpdateRentalReturnType }> {
    validateRequiredParameters(
        ["id"], 
        "adminUpdateRental", 
        params
    );

    const path = `/admin/rentals/{id}`.replace(`{${"id"}}`, `${ params["id"] }`);

    return makeRequest<adminUpdateRentalReturnType>(
        "PUT",
        path,
    );
}
/** 
* Gets a rental
* @param id 
*/
export function getRental(params: {  "id": string; }): Promise<{ response: Response, data: getRentalReturnType }> {
    validateRequiredParameters(
        ["id"], 
        "getRental", 
        params
    );

    const path = `/rentals/{id}`.replace(`{${"id"}}`, `${ params["id"] }`);

    return makeRequest<getRentalReturnType>(
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
export function listRentals(params: {  "pageNum"?: number; "orderBy"?: string; "order"?: string; }): Promise<{ response: Response, data: listRentalsReturnType }> {
    validateRequiredParameters(
        [], 
        "listRentals", 
        params
    );

    const path = `/rentals`;

    return makeRequest<listRentalsReturnType>(
        "GET",
        path,
        {
            "pageNum": { values: params["pageNum"] },
            "orderBy": { values: params["orderBy"] },
            "order": { values: params["order"] }
        },
    );
}
/** 
* Updates a rental and uploads signature
* @param id 
*/
export function updateRental(params: {  "id": string; }): Promise<{ response: Response, data: updateRentalReturnType }> {
    validateRequiredParameters(
        ["id"], 
        "updateRental", 
        params
    );

    const path = `/rentals/{id}`.replace(`{${"id"}}`, `${ params["id"] }`);

    return makeRequest<updateRentalReturnType>(
        "PUT",
        path,
    );
}
export type adminListEarnedMembershipReportsReturnType = InlineResponse2009[keyof InlineResponse2009];
export type createEarnedMembershipReportReturnType = InlineResponse20022[keyof InlineResponse20022];
export type listEarnedMembershipReportsReturnType = InlineResponse2009[keyof InlineResponse2009];

/** 
* Gets a list of reports
* @param id 
* @param pageNum 
* @param orderBy 
* @param order 
*/
export function adminListEarnedMembershipReports(params: {  "id": string; "pageNum"?: number; "orderBy"?: string; "order"?: string; }): Promise<{ response: Response, data: adminListEarnedMembershipReportsReturnType }> {
    validateRequiredParameters(
        ["id",], 
        "adminListEarnedMembershipReports", 
        params
    );

    const path = `/admin/earned_memberships/{id}/reports`.replace(`{${"id"}}`, `${ params["id"] }`);

    return makeRequest<adminListEarnedMembershipReportsReturnType>(
        "GET",
        path,
        {
            "pageNum": { values: params["pageNum"] },
            "orderBy": { values: params["orderBy"] },
            "order": { values: params["order"] }
        },
    );
}
/** 
* Create an report
* @param id 
*/
export function createEarnedMembershipReport(params: {  "id": string; }): Promise<{ response: Response, data: createEarnedMembershipReportReturnType }> {
    validateRequiredParameters(
        ["id"], 
        "createEarnedMembershipReport", 
        params
    );

    const path = `/earned_memberships/{id}/reports`.replace(`{${"id"}}`, `${ params["id"] }`);

    return makeRequest<createEarnedMembershipReportReturnType>(
        "POST",
        path,
    );
}
/** 
* Gets a list of reports for current member
* @param id 
* @param pageNum 
* @param orderBy 
* @param order 
*/
export function listEarnedMembershipReports(params: {  "id": string; "pageNum"?: number; "orderBy"?: string; "order"?: string; }): Promise<{ response: Response, data: listEarnedMembershipReportsReturnType }> {
    validateRequiredParameters(
        ["id",], 
        "listEarnedMembershipReports", 
        params
    );

    const path = `/earned_memberships/{id}/reports`.replace(`{${"id"}}`, `${ params["id"] }`);

    return makeRequest<listEarnedMembershipReportsReturnType>(
        "GET",
        path,
        {
            "pageNum": { values: params["pageNum"] },
            "orderBy": { values: params["orderBy"] },
            "order": { values: params["order"] }
        },
    );
}
export type adminCancelSubscriptionReturnType = Response;
export type adminListSubscriptionsReturnType = InlineResponse2003[keyof InlineResponse2003];
export type cancelSubscriptionReturnType = Response;
export type getSubscriptionReturnType = InlineResponse20021[keyof InlineResponse20021];
export type updateSubscriptionReturnType = InlineResponse20021[keyof InlineResponse20021];

/** 
* Cancels a subscription
* @param id 
*/
export function adminCancelSubscription(params: {  "id": string; }): Promise<{ response: Response, data: undefined }> {
    validateRequiredParameters(
        ["id"], 
        "adminCancelSubscription", 
        params
    );

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
export function adminListSubscriptions(params: {  "startDate"?: string; "endDate"?: string; "search"?: string; "planId"?: Array<string>; "subscriptionStatus"?: Array<string>; "customerId"?: string; }): Promise<{ response: Response, data: adminListSubscriptionsReturnType }> {
    validateRequiredParameters(
        [], 
        "adminListSubscriptions", 
        params
    );

    const path = `/admin/billing/subscriptions`;

    return makeRequest<adminListSubscriptionsReturnType>(
        "GET",
        path,
        {
            "startDate": { values: params["startDate"] },
            "endDate": { values: params["endDate"] },
            "search": { values: params["search"] },
            "planId": { values: params["planId"], collectionFormat: "multi" },
            "subscriptionStatus": { values: params["subscriptionStatus"], collectionFormat: "multi" },
            "customerId": { values: params["customerId"] }
        },
    );
}
/** 
* Cancels a subscription
* @param id 
*/
export function cancelSubscription(params: {  "id": string; }): Promise<{ response: Response, data: undefined }> {
    validateRequiredParameters(
        ["id"], 
        "cancelSubscription", 
        params
    );

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
export function getSubscription(params: {  "id": string; }): Promise<{ response: Response, data: getSubscriptionReturnType }> {
    validateRequiredParameters(
        ["id"], 
        "getSubscription", 
        params
    );

    const path = `/billing/subscriptions/{id}`.replace(`{${"id"}}`, `${ params["id"] }`);

    return makeRequest<getSubscriptionReturnType>(
        "GET",
        path,
    );
}
/** 
* Update a subscription
* @param id 
*/
export function updateSubscription(params: {  "id": string; }): Promise<{ response: Response, data: updateSubscriptionReturnType }> {
    validateRequiredParameters(
        ["id"], 
        "updateSubscription", 
        params
    );

    const path = `/billing/subscriptions/{id}`.replace(`{${"id"}}`, `${ params["id"] }`);

    return makeRequest<updateSubscriptionReturnType>(
        "PUT",
        path,
    );
}
export type adminDeleteTransactionReturnType = Response;
export type adminGetTransactionReturnType = InlineResponse2005[keyof InlineResponse2005];
export type adminListTransactionReturnType = InlineResponse2004[keyof InlineResponse2004];
export type createTransactionReturnType = InlineResponse2005[keyof InlineResponse2005];
export type deleteTransactionReturnType = Response;
export type listTransactionsReturnType = InlineResponse2004[keyof InlineResponse2004];

/** 
* Request refund for a transaction
* @param id 
*/
export function adminDeleteTransaction(params: {  "id": string; }): Promise<{ response: Response, data: undefined }> {
    validateRequiredParameters(
        ["id"], 
        "adminDeleteTransaction", 
        params
    );

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
export function adminGetTransaction(params: {  "id": string; }): Promise<{ response: Response, data: adminGetTransactionReturnType }> {
    validateRequiredParameters(
        ["id"], 
        "adminGetTransaction", 
        params
    );

    const path = `/admin/billing/transactions/{id}`.replace(`{${"id"}}`, `${ params["id"] }`);

    return makeRequest<adminGetTransactionReturnType>(
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
export function adminListTransaction(params: {  "startDate"?: string; "endDate"?: string; "refund"?: boolean; "type"?: string; "transactionStatus"?: Array<string>; "customerId"?: string; }): Promise<{ response: Response, data: adminListTransactionReturnType }> {
    validateRequiredParameters(
        [], 
        "adminListTransaction", 
        params
    );

    const path = `/admin/billing/transactions`;

    return makeRequest<adminListTransactionReturnType>(
        "GET",
        path,
        {
            "startDate": { values: params["startDate"] },
            "endDate": { values: params["endDate"] },
            "refund": { values: params["refund"] },
            "type": { values: params["type"] },
            "transactionStatus": { values: params["transactionStatus"], collectionFormat: "multi" },
            "customerId": { values: params["customerId"] }
        },
    );
}
/** 
* Create an transaction
*/
export function createTransaction(): Promise<{ response: Response, data: createTransactionReturnType }> {

    const path = `/billing/transactions`;

    return makeRequest<createTransactionReturnType>(
        "POST",
        path,
    );
}
/** 
* Request refund for a transaction
* @param id 
*/
export function deleteTransaction(params: {  "id": string; }): Promise<{ response: Response, data: undefined }> {
    validateRequiredParameters(
        ["id"], 
        "deleteTransaction", 
        params
    );

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
export function listTransactions(params: {  "startDate"?: string; "endDate"?: string; "refund"?: boolean; "type"?: string; "transactionStatus"?: Array<string>; "paymentMethodToken"?: Array<string>; }): Promise<{ response: Response, data: listTransactionsReturnType }> {
    validateRequiredParameters(
        [], 
        "listTransactions", 
        params
    );

    const path = `/billing/transactions`;

    return makeRequest<listTransactionsReturnType>(
        "GET",
        path,
        {
            "startDate": { values: params["startDate"] },
            "endDate": { values: params["endDate"] },
            "refund": { values: params["refund"] },
            "type": { values: params["type"] },
            "transactionStatus": { values: params["transactionStatus"], collectionFormat: "multi" },
            "paymentMethodToken": { values: params["paymentMethodToken"], collectionFormat: "multi" }
        },
    );
}
