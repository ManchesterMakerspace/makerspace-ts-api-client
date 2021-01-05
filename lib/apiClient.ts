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

export interface AdmincardsCard {
    "memberId"?: string;
    "uid"?: string;
}

export interface AdmincardsidCard {
    "memberId"?: string;
    "uid"?: string;
    "cardLocation"?: string;
}

export interface AdmininvoicesInvoiceOption {
    "id"?: string;
    "discountId"?: string;
    "memberId"?: string;
    "resourceId"?: string;
}

export interface AdminmembersidMember {
    "firstname"?: string;
    "lastname"?: string;
    "email"?: string;
    "address"?: AdminmembersidMemberAddress;
    "phone"?: string;
    "status"?: AdminmembersidMemberStatusEnum;
    "role"?: AdminmembersidMemberRoleEnum;
    "renew"?: number;
    "memberContractOnFile"?: boolean;
    "subscription"?: boolean;
}


export enum AdminmembersidMemberStatusEnum {
    ActiveMember = 'activeMember',
    Inactive = 'inactive',
    NonMember = 'nonMember',
    Revoked = 'revoked'
}

export enum AdminmembersidMemberRoleEnum {
    Admin = 'admin',
    Member = 'member'
}

export interface AdminmembersidMemberAddress {
    "street"?: string;
    "unit"?: string;
    "city"?: string;
    "state"?: string;
    "postalCode"?: string;
}

export interface BillingpaymentMethodsPaymentMethod {
    "paymentMethodNonce": string;
    "makeDefault"?: boolean;
}

export interface BillingsubscriptionsidSubscription {
    "paymentMethodToken": string;
}

export interface BillingtransactionsTransaction {
    "invoiceId"?: string;
    "invoiceOptionId"?: string;
    "discountId"?: string;
    "paymentMethodId"?: string;
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

export interface ClientErrorHandlerNotification {
    "message"?: string;
}

export interface CreateAccessCardDetails {
    "card"?: AdmincardsCard;
}

export interface CreateEarnedMembershipDetails {
    "earnedMembership"?: NewEarnedMembership;
}

export interface CreateEarnedMembershipReportDetails {
    "report"?: NewReport;
}

export interface CreateInvoiceDetails {
    "invoiceOption"?: AdmininvoicesInvoiceOption;
}

export interface CreateInvoiceDetails1 {
    "invoiceOption": InvoicesInvoiceOption;
}

export interface CreateInvoiceOptionDetails {
    "invoiceOption"?: NewInvoiceOption;
}

export interface CreateMemberDetails {
    "member"?: NewMember;
}

export interface CreatePaymentMethodDetails {
    "paymentMethod": BillingpaymentMethodsPaymentMethod;
}

export interface CreateRentalDetails {
    "rental"?: NewRental;
}

export interface CreateTransactionDetails {
    "transaction": BillingtransactionsTransaction;
}

export interface CreditCard {
    "id": string;
    "_default": boolean;
    "paymentType": string;
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
    "status": number;
    "error": string;
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
    "subscriptionId": string;
    "transactionId": string;
    "planId": string;
    "resourceClass": InvoiceResourceClassEnum;
    "resourceId": string;
    "quantity": number;
    "discountId": string;
    "memberName": string;
    "memberId": string;
    "refunded": boolean;
    "refundRequested": string;
    "operation": string;
    "member": InvoiceMember;
    "rental": InvoiceMember;
}


export enum InvoiceResourceClassEnum {
    Member = 'member',
    Rental = 'rental'
}

export interface InvoiceMember {
    "ref"?: any;
}

export interface InvoiceOption {
    "id": string;
    "name": string;
    "description": string;
    "amount": string;
    "planId": string;
    "resourceClass": string;
    "quantity": number;
    "discountId": string;
    "disabled": boolean;
    "operation": string;
    "isPromotion": boolean;
}

export interface InvoicesInvoiceOption {
    "id": string;
    "discountId"?: string;
}

export interface Member {
    "id": string;
    "firstname": string;
    "lastname": string;
    "email": string;
    "status": MemberStatusEnum;
    "role": MemberRoleEnum;
    "expirationTime": number;
    "memberContractOnFile": boolean;
    "cardId": string;
    "subscriptionId": string;
    "subscription": boolean;
    "customerId": string;
    "earnedMembershipId": string;
    "notes": string;
    "phone": string;
    "address": MembersMemberAddress;
}


export enum MemberStatusEnum {
    ActiveMember = 'activeMember',
    Inactive = 'inactive',
    NonMember = 'nonMember',
    Revoked = 'revoked'
}

export enum MemberRoleEnum {
    Admin = 'admin',
    Member = 'member'
}

export interface MemberSummary {
    "id": string;
    "firstname": string;
    "lastname": string;
    "email": string;
    "status": MemberSummaryStatusEnum;
    "role": MemberSummaryRoleEnum;
    "expirationTime": number;
    "memberContractOnFile": boolean;
    "notes": string;
}


export enum MemberSummaryStatusEnum {
    ActiveMember = 'activeMember',
    Inactive = 'inactive',
    NonMember = 'nonMember',
    Revoked = 'revoked'
}

export enum MemberSummaryRoleEnum {
    Admin = 'admin',
    Member = 'member'
}

export interface MembersMember {
    "email"?: string;
    "password"?: string;
    "firstname"?: string;
    "lastname"?: string;
    "phone"?: string;
    "address"?: MembersMemberAddress;
}

export interface MembersMemberAddress {
    "street"?: string;
    "unit"?: string;
    "city"?: string;
    "state"?: string;
    "postalCode"?: string;
}

export interface MembersidMember {
    "firstname"?: string;
    "lastname"?: string;
    "email"?: string;
    "signature"?: string;
    "phone"?: string;
    "address"?: AdminmembersidMemberAddress;
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
    "notification"?: ClientErrorHandlerNotification;
}

export interface NewEarnedMembership {
    "memberId": string;
    "requirements": Array<NewRequirement>;
}

export interface NewInvoiceOption {
    "name": string;
    "description": string;
    "amount": string;
    "planId": string;
    "resourceClass": string;
    "quantity": number;
    "discountId": string;
    "disabled": boolean;
    "isPromotion": boolean;
}

export interface NewMember {
    "firstname": string;
    "lastname": string;
    "email": string;
    "status": NewMemberStatusEnum;
    "role": NewMemberRoleEnum;
    "memberContractOnFile": boolean;
    "phone": string;
    "address": NewMemberAddress;
}


export enum NewMemberStatusEnum {
    ActiveMember = 'activeMember',
    Inactive = 'inactive',
    NonMember = 'nonMember',
    Revoked = 'revoked'
}

export enum NewMemberRoleEnum {
    Admin = 'admin',
    Member = 'member'
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

export interface PasswordResetDetails {
    "member"?: MemberspasswordMember;
}

export interface PasswordResetDetails1 {
    "member"?: MemberspasswordMember1;
}

export interface PayPalAccount {
    "id": string;
    "_default": boolean;
    "paymentType": string;
    "customerId": string;
    "imageUrl": string;
    "subscriptions": Array<Subscription>;
    "email": string;
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

export interface RegisterMemberDetails {
    "member"?: MembersMember;
}

export interface RegistrationEmailDetails {
    "email"?: string;
}

export interface Rental {
    "id": string;
    "number": string;
    "description": string;
    "memberName": string;
    "memberId": string;
    "expiration": number;
    "subscriptionId": string;
    "contractOnFile": boolean;
    "notes": string;
}

export interface RentalsidRental {
    "signature"?: string;
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
    "gatewayRejectionReason": string;
    "status": TransactionStatusEnum;
    "id": string;
    "planId": string;
    "recurring": boolean;
    "refundIds": Array<string>;
    "refundedTransactionId": string;
    "subscriptionDetails": TransactionSubscriptionDetails;
    "subscriptionId": string;
    "amount": string;
    "memberId": string;
    "memberName": string;
    "invoice": Invoice;
    "creditCardDetails": InvoiceMember;
    "paypalDetails": InvoiceMember;
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
    "card"?: AdmincardsidCard;
}

export interface UpdateEarnedMembershipDetails {
    "earnedMembership"?: EarnedMembership;
}

export interface UpdateInvoiceDetails {
    "invoice"?: Invoice;
}

export interface UpdateInvoiceOptionDetails {
    "invoiceOption"?: InvoiceOption;
}

export interface UpdateMemberDetails {
    "member"?: AdminmembersidMember;
}

export interface UpdateMemberDetails1 {
    "member"?: MembersidMember;
}

export interface UpdateRentalDetails {
    "rental"?: Rental;
}

export interface UpdateRentalDetails1 {
    "rental"?: RentalsidRental;
}

export interface UpdateSubscriptionDetails {
    "subscription": BillingsubscriptionsidSubscription;
}


export type adminListAnalyticsReturnType = InlineResponse200[keyof InlineResponse200];

/**
 * AnalyticsApi - object-oriented interface
 */
export class AnalyticsApi {

    /** 
     * Lists analytic counts
     */
    public adminListAnalytics(): Promise<{ response: Response, data: adminListAnalyticsReturnType }> {

        const path = `/admin/analytics`;

        return makeRequest<adminListAnalyticsReturnType>(
            "GET",
            path,
        );
    }
};

export type registerMemberReturnType = InlineResponse20015[keyof InlineResponse20015];
export type sendRegistrationEmailReturnType = Response;
export type signInReturnType = InlineResponse20015[keyof InlineResponse20015];
export type signOutReturnType = Response;

/**
 * AuthenticationApi - object-oriented interface
 */
export class AuthenticationApi {

    /** 
     * Registers new member
     * @param registerMemberDetails 
     */
    public registerMember(params: {  "registerMemberDetails": RegisterMemberDetails; }): Promise<{ response: Response, data: registerMemberReturnType }> {
        validateRequiredParameters(
            ["registerMemberDetails"], 
            "registerMember", 
            params
        );

        const path = `/members`;

        return makeRequest<registerMemberReturnType>(
            "POST",
            path,
            params["registerMemberDetails"]
        );
    }
    /** 
     * Sends registration email
     * @param registrationEmailDetails 
     */
    public sendRegistrationEmail(params: {  "registrationEmailDetails": RegistrationEmailDetails; }): Promise<{ response: Response, data: undefined }> {
        validateRequiredParameters(
            ["registrationEmailDetails"], 
            "sendRegistrationEmail", 
            params
        );

        const path = `/send_registration`;

        return makeRequest(
            "POST",
            path,
            params["registrationEmailDetails"]
        );
    }
    /** 
     * Signs in user
     * @param signInDetails 
     */
    public signIn(params: {  "signInDetails"?: SignInDetails; }): Promise<{ response: Response, data: signInReturnType }> {
        validateRequiredParameters(
            [], 
            "signIn", 
            params
        );

        const path = `/members/sign_in`;

        return makeRequest<signInReturnType>(
            "POST",
            path,
            params["signInDetails"]
        );
    }
    /** 
     * Signs out user
     */
    public signOut(): Promise<{ response: Response, data: undefined }> {

        const path = `/members/sign_out`;

        return makeRequest(
            "DELETE",
            path,
        );
    }
};

export type adminCreateCardReturnType = InlineResponse2008[keyof InlineResponse2008];
export type adminGetNewCardReturnType = InlineResponse2006[keyof InlineResponse2006];
export type adminListCardsReturnType = InlineResponse2007[keyof InlineResponse2007];
export type adminUpdateCardReturnType = InlineResponse2008[keyof InlineResponse2008];

/**
 * CardsApi - object-oriented interface
 */
export class CardsApi {

    /** 
     * Creates an access card
     * @param createAccessCardDetails 
     */
    public adminCreateCard(params: {  "createAccessCardDetails": CreateAccessCardDetails; }): Promise<{ response: Response, data: adminCreateCardReturnType }> {
        validateRequiredParameters(
            ["createAccessCardDetails"], 
            "adminCreateCard", 
            params
        );

        const path = `/admin/cards`;

        return makeRequest<adminCreateCardReturnType>(
            "POST",
            path,
            params["createAccessCardDetails"]
        );
    }
    /** 
     * Initiate new card creation
     */
    public adminGetNewCard(): Promise<{ response: Response, data: adminGetNewCardReturnType }> {

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
    public adminListCards(params: {  "memberId": string; }): Promise<{ response: Response, data: adminListCardsReturnType }> {
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
     * @param updateAccessCardDetails 
     */
    public adminUpdateCard(params: {  "id": string; "updateAccessCardDetails": UpdateAccessCardDetails; }): Promise<{ response: Response, data: adminUpdateCardReturnType }> {
        validateRequiredParameters(
            ["id","updateAccessCardDetails"], 
            "adminUpdateCard", 
            params
        );

        const path = `/admin/cards/{id}`.replace(`{${"id"}}`, `${ params["id"] }`);

        return makeRequest<adminUpdateCardReturnType>(
            "PUT",
            path,
            params["updateAccessCardDetails"]
        );
    }
};

export type messageReturnType = Response;

/**
 * ClientErrorHandlerApi - object-oriented interface
 */
export class ClientErrorHandlerApi {

    /** 
     * Sends a slack message
     * @param messageDetails 
     */
    public message(params: {  "messageDetails"?: MessageDetails; }): Promise<{ response: Response, data: undefined }> {
        validateRequiredParameters(
            [], 
            "message", 
            params
        );

        const path = `/client_error_handler`;

        return makeRequest(
            "POST",
            path,
            params["messageDetails"]
        );
    }
};

export type adminListBillingPlanDiscountsReturnType = InlineResponse2002[keyof InlineResponse2002];

/**
 * DiscountsApi - object-oriented interface
 */
export class DiscountsApi {

    /** 
     * Gets a list of billing plan discounts
     * @param pageNum 
     * @param orderBy 
     * @param order 
     * @param subscriptionOnly 
     * @param types 
     */
    public adminListBillingPlanDiscounts(params: {  "pageNum"?: number; "orderBy"?: string; "order"?: string; "subscriptionOnly"?: boolean; "types"?: Array<string>; }): Promise<{ response: Response, data: adminListBillingPlanDiscountsReturnType }> {
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
                "types": { values: params["types"], collectionFormat: "csv" }
            },
        );
    }
};

export type getDocumentReturnType = Response;

/**
 * DocumentsApi - object-oriented interface
 */
export class DocumentsApi {

    /** 
     * Get a document
     * @param id 
     * @param resourceId 
     */
    public getDocument(params: {  "id": string; "resourceId"?: string; }): Promise<{ response: Response, data: undefined }> {
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
};

export type adminCreateEarnedMembershipReturnType = InlineResponse20011[keyof InlineResponse20011];
export type adminGetEarnedMembershipReturnType = InlineResponse20011[keyof InlineResponse20011];
export type adminListEarnedMembershipsReturnType = InlineResponse20010[keyof InlineResponse20010];
export type adminUpdateEarnedMembershipReturnType = InlineResponse20011[keyof InlineResponse20011];
export type getEarnedMembershipReturnType = InlineResponse20011[keyof InlineResponse20011];

/**
 * EarnedMembershipsApi - object-oriented interface
 */
export class EarnedMembershipsApi {

    /** 
     * Creates an earned membership
     * @param createEarnedMembershipDetails 
     */
    public adminCreateEarnedMembership(params: {  "createEarnedMembershipDetails": CreateEarnedMembershipDetails; }): Promise<{ response: Response, data: adminCreateEarnedMembershipReturnType }> {
        validateRequiredParameters(
            ["createEarnedMembershipDetails"], 
            "adminCreateEarnedMembership", 
            params
        );

        const path = `/admin/earned_memberships`;

        return makeRequest<adminCreateEarnedMembershipReturnType>(
            "POST",
            path,
            params["createEarnedMembershipDetails"]
        );
    }
    /** 
     * Gets an earned membership
     * @param id 
     */
    public adminGetEarnedMembership(params: {  "id": string; }): Promise<{ response: Response, data: adminGetEarnedMembershipReturnType }> {
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
    public adminListEarnedMemberships(params: {  "pageNum"?: number; "orderBy"?: string; "order"?: string; }): Promise<{ response: Response, data: adminListEarnedMembershipsReturnType }> {
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
     * @param updateEarnedMembershipDetails 
     */
    public adminUpdateEarnedMembership(params: {  "id": string; "updateEarnedMembershipDetails": UpdateEarnedMembershipDetails; }): Promise<{ response: Response, data: adminUpdateEarnedMembershipReturnType }> {
        validateRequiredParameters(
            ["id","updateEarnedMembershipDetails"], 
            "adminUpdateEarnedMembership", 
            params
        );

        const path = `/admin/earned_memberships/{id}`.replace(`{${"id"}}`, `${ params["id"] }`);

        return makeRequest<adminUpdateEarnedMembershipReturnType>(
            "PUT",
            path,
            params["updateEarnedMembershipDetails"]
        );
    }
    /** 
     * Gets an earned membership
     * @param id 
     */
    public getEarnedMembership(params: {  "id": string; }): Promise<{ response: Response, data: getEarnedMembershipReturnType }> {
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
};

export type adminCreateInvoiceOptionReturnType = InlineResponse20012[keyof InlineResponse20012];
export type adminDeleteInvoiceOptionReturnType = Response;
export type adminUpdateInvoiceOptionReturnType = InlineResponse20012[keyof InlineResponse20012];
export type getInvoiceOptionReturnType = InlineResponse20012[keyof InlineResponse20012];
export type listInvoiceOptionsReturnType = InlineResponse20023[keyof InlineResponse20023];

/**
 * InvoiceOptionsApi - object-oriented interface
 */
export class InvoiceOptionsApi {

    /** 
     * Creates an invoice option
     * @param createInvoiceOptionDetails 
     */
    public adminCreateInvoiceOption(params: {  "createInvoiceOptionDetails": CreateInvoiceOptionDetails; }): Promise<{ response: Response, data: adminCreateInvoiceOptionReturnType }> {
        validateRequiredParameters(
            ["createInvoiceOptionDetails"], 
            "adminCreateInvoiceOption", 
            params
        );

        const path = `/admin/invoice_options`;

        return makeRequest<adminCreateInvoiceOptionReturnType>(
            "POST",
            path,
            params["createInvoiceOptionDetails"]
        );
    }
    /** 
     * Deletes an invoice option
     * @param id 
     */
    public adminDeleteInvoiceOption(params: {  "id": string; }): Promise<{ response: Response, data: undefined }> {
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
     * @param updateInvoiceOptionDetails 
     */
    public adminUpdateInvoiceOption(params: {  "id": string; "updateInvoiceOptionDetails": UpdateInvoiceOptionDetails; }): Promise<{ response: Response, data: adminUpdateInvoiceOptionReturnType }> {
        validateRequiredParameters(
            ["id","updateInvoiceOptionDetails"], 
            "adminUpdateInvoiceOption", 
            params
        );

        const path = `/admin/invoice_options/{id}`.replace(`{${"id"}}`, `${ params["id"] }`);

        return makeRequest<adminUpdateInvoiceOptionReturnType>(
            "PUT",
            path,
            params["updateInvoiceOptionDetails"]
        );
    }
    /** 
     * Gets an Invoice Option
     * @param id 
     */
    public getInvoiceOption(params: {  "id": string; }): Promise<{ response: Response, data: getInvoiceOptionReturnType }> {
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
    public listInvoiceOptions(params: {  "pageNum"?: number; "orderBy"?: string; "order"?: string; "subscriptionOnly"?: boolean; "types"?: Array<string>; }): Promise<{ response: Response, data: listInvoiceOptionsReturnType }> {
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
                "types": { values: params["types"], collectionFormat: "csv" }
            },
        );
    }
};

export type adminCreateInvoicesReturnType = InlineResponse20014[keyof InlineResponse20014];
export type adminDeleteInvoiceReturnType = Response;
export type adminListInvoicesReturnType = InlineResponse20013[keyof InlineResponse20013];
export type adminUpdateInvoiceReturnType = InlineResponse20014[keyof InlineResponse20014];
export type createInvoiceReturnType = InlineResponse20014[keyof InlineResponse20014];
export type listInvoicesReturnType = InlineResponse20013[keyof InlineResponse20013];

/**
 * InvoicesApi - object-oriented interface
 */
export class InvoicesApi {

    /** 
     * Creates an invoice
     * @param createInvoiceDetails 
     */
    public adminCreateInvoices(params: {  "createInvoiceDetails": CreateInvoiceDetails; }): Promise<{ response: Response, data: adminCreateInvoicesReturnType }> {
        validateRequiredParameters(
            ["createInvoiceDetails"], 
            "adminCreateInvoices", 
            params
        );

        const path = `/admin/invoices`;

        return makeRequest<adminCreateInvoicesReturnType>(
            "POST",
            path,
            params["createInvoiceDetails"]
        );
    }
    /** 
     * Deletes an invoice
     * @param id 
     */
    public adminDeleteInvoice(params: {  "id": string; }): Promise<{ response: Response, data: undefined }> {
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
    public adminListInvoices(params: {  "pageNum"?: number; "orderBy"?: string; "order"?: string; "search"?: string; "settled"?: boolean; "pastDue"?: boolean; "refunded"?: boolean; "refundRequested"?: boolean; "planId"?: Array<string>; "resourceId"?: Array<string>; "memberId"?: Array<string>; "resourceClass"?: Array<string>; }): Promise<{ response: Response, data: adminListInvoicesReturnType }> {
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
                "planId": { values: params["planId"], collectionFormat: "csv" },
                "resourceId": { values: params["resourceId"], collectionFormat: "csv" },
                "memberId": { values: params["memberId"], collectionFormat: "csv" },
                "resourceClass": { values: params["resourceClass"], collectionFormat: "csv" }
            },
        );
    }
    /** 
     * Updates an invoice
     * @param id 
     * @param updateInvoiceDetails 
     */
    public adminUpdateInvoice(params: {  "id": string; "updateInvoiceDetails": UpdateInvoiceDetails; }): Promise<{ response: Response, data: adminUpdateInvoiceReturnType }> {
        validateRequiredParameters(
            ["id","updateInvoiceDetails"], 
            "adminUpdateInvoice", 
            params
        );

        const path = `/admin/invoices/{id}`.replace(`{${"id"}}`, `${ params["id"] }`);

        return makeRequest<adminUpdateInvoiceReturnType>(
            "PUT",
            path,
            params["updateInvoiceDetails"]
        );
    }
    /** 
     * Create an invoice
     * @param createInvoiceDetails 
     */
    public createInvoice(params: {  "createInvoiceDetails": CreateInvoiceDetails1; }): Promise<{ response: Response, data: createInvoiceReturnType }> {
        validateRequiredParameters(
            ["createInvoiceDetails"], 
            "createInvoice", 
            params
        );

        const path = `/invoices`;

        return makeRequest<createInvoiceReturnType>(
            "POST",
            path,
            params["createInvoiceDetails"]
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
    public listInvoices(params: {  "pageNum"?: number; "orderBy"?: string; "order"?: string; "settled"?: boolean; "pastDue"?: boolean; "refunded"?: boolean; "refundRequested"?: boolean; "planId"?: Array<string>; "resourceId"?: Array<string>; "resourceClass"?: Array<string>; }): Promise<{ response: Response, data: listInvoicesReturnType }> {
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
                "planId": { values: params["planId"], collectionFormat: "csv" },
                "resourceId": { values: params["resourceId"], collectionFormat: "csv" },
                "resourceClass": { values: params["resourceClass"], collectionFormat: "csv" }
            },
        );
    }
};

export type adminCreateMemberReturnType = InlineResponse20015[keyof InlineResponse20015];
export type adminUpdateMemberReturnType = InlineResponse20015[keyof InlineResponse20015];
export type getMemberReturnType = InlineResponse20015[keyof InlineResponse20015];
export type listMembersReturnType = InlineResponse20025[keyof InlineResponse20025];
export type updateMemberReturnType = InlineResponse20015[keyof InlineResponse20015];

/**
 * MembersApi - object-oriented interface
 */
export class MembersApi {

    /** 
     * Creates a member
     * @param createMemberDetails 
     */
    public adminCreateMember(params: {  "createMemberDetails": CreateMemberDetails; }): Promise<{ response: Response, data: adminCreateMemberReturnType }> {
        validateRequiredParameters(
            ["createMemberDetails"], 
            "adminCreateMember", 
            params
        );

        const path = `/admin/members`;

        return makeRequest<adminCreateMemberReturnType>(
            "POST",
            path,
            params["createMemberDetails"]
        );
    }
    /** 
     * Updates a member
     * @param id 
     * @param updateMemberDetails 
     */
    public adminUpdateMember(params: {  "id": string; "updateMemberDetails": UpdateMemberDetails; }): Promise<{ response: Response, data: adminUpdateMemberReturnType }> {
        validateRequiredParameters(
            ["id","updateMemberDetails"], 
            "adminUpdateMember", 
            params
        );

        const path = `/admin/members/{id}`.replace(`{${"id"}}`, `${ params["id"] }`);

        return makeRequest<adminUpdateMemberReturnType>(
            "PUT",
            path,
            params["updateMemberDetails"]
        );
    }
    /** 
     * Gets a member
     * @param id 
     */
    public getMember(params: {  "id": string; }): Promise<{ response: Response, data: getMemberReturnType }> {
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
    public listMembers(params: {  "pageNum"?: number; "orderBy"?: string; "order"?: string; "currentMembers"?: boolean; "search"?: string; }): Promise<{ response: Response, data: listMembersReturnType }> {
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
     * @param updateMemberDetails 
     */
    public updateMember(params: {  "id": string; "updateMemberDetails": UpdateMemberDetails1; }): Promise<{ response: Response, data: updateMemberReturnType }> {
        validateRequiredParameters(
            ["id","updateMemberDetails"], 
            "updateMember", 
            params
        );

        const path = `/members/{id}`.replace(`{${"id"}}`, `${ params["id"] }`);

        return makeRequest<updateMemberReturnType>(
            "PUT",
            path,
            params["updateMemberDetails"]
        );
    }
};

export type requestPasswordResetReturnType = Response;
export type resetPasswordReturnType = Response;

/**
 * PasswordApi - object-oriented interface
 */
export class PasswordApi {

    /** 
     * Sends password reset instructions
     * @param passwordResetDetails 
     */
    public requestPasswordReset(params: {  "passwordResetDetails": PasswordResetDetails1; }): Promise<{ response: Response, data: undefined }> {
        validateRequiredParameters(
            ["passwordResetDetails"], 
            "requestPasswordReset", 
            params
        );

        const path = `/members/password`;

        return makeRequest(
            "POST",
            path,
            params["passwordResetDetails"]
        );
    }
    /** 
     * Updates member password
     * @param passwordResetDetails 
     */
    public resetPassword(params: {  "passwordResetDetails": PasswordResetDetails; }): Promise<{ response: Response, data: undefined }> {
        validateRequiredParameters(
            ["passwordResetDetails"], 
            "resetPassword", 
            params
        );

        const path = `/members/password`;

        return makeRequest(
            "PUT",
            path,
            params["passwordResetDetails"]
        );
    }
};

export type createPaymentMethodReturnType = InlineResponse20020[keyof InlineResponse20020];
export type deletePaymentMethodReturnType = Response;
export type getNewPaymentMethodReturnType = InlineResponse20018[keyof InlineResponse20018];
export type getPaymentMethodReturnType = InlineResponse20020[keyof InlineResponse20020];
export type listPaymentMethodsReturnType = InlineResponse20019[keyof InlineResponse20019];

/**
 * PaymentMethodsApi - object-oriented interface
 */
export class PaymentMethodsApi {

    /** 
     * Create an payment_method
     * @param createPaymentMethodDetails 
     */
    public createPaymentMethod(params: {  "createPaymentMethodDetails": CreatePaymentMethodDetails; }): Promise<{ response: Response, data: createPaymentMethodReturnType }> {
        validateRequiredParameters(
            ["createPaymentMethodDetails"], 
            "createPaymentMethod", 
            params
        );

        const path = `/billing/payment_methods`;

        return makeRequest<createPaymentMethodReturnType>(
            "POST",
            path,
            params["createPaymentMethodDetails"]
        );
    }
    /** 
     * Deletes a payment method
     * @param id 
     */
    public deletePaymentMethod(params: {  "id": string; }): Promise<{ response: Response, data: undefined }> {
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
    public getNewPaymentMethod(): Promise<{ response: Response, data: getNewPaymentMethodReturnType }> {

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
    public getPaymentMethod(params: {  "id": string; }): Promise<{ response: Response, data: getPaymentMethodReturnType }> {
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
    public listPaymentMethods(): Promise<{ response: Response, data: listPaymentMethodsReturnType }> {

        const path = `/billing/payment_methods`;

        return makeRequest<listPaymentMethodsReturnType>(
            "GET",
            path,
        );
    }
};

export type listMembersPermissionsReturnType = InlineResponse20024[keyof InlineResponse20024];

/**
 * PermissionsApi - object-oriented interface
 */
export class PermissionsApi {

    /** 
     * Gets a member&#39;s permissions
     * @param id 
     */
    public listMembersPermissions(params: {  "id": string; }): Promise<{ response: Response, data: listMembersPermissionsReturnType }> {
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
};

export type adminListBillingPlansReturnType = InlineResponse2001[keyof InlineResponse2001];

/**
 * PlansApi - object-oriented interface
 */
export class PlansApi {

    /** 
     * Gets a list of billing plans
     * @param pageNum 
     * @param orderBy 
     * @param order 
     * @param types 
     */
    public adminListBillingPlans(params: {  "pageNum"?: number; "orderBy"?: string; "order"?: string; "types"?: Array<string>; }): Promise<{ response: Response, data: adminListBillingPlansReturnType }> {
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
                "types": { values: params["types"], collectionFormat: "csv" }
            },
        );
    }
};

export type adminGetReceiptReturnType = Response;
export type getReceiptReturnType = Response;

/**
 * ReceiptsApi - object-oriented interface
 */
export class ReceiptsApi {

    /** 
     * Get a receipt for an invoice
     * @param id 
     */
    public adminGetReceipt(params: {  "id": string; }): Promise<{ response: Response, data: undefined }> {
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
    public getReceipt(params: {  "id": string; }): Promise<{ response: Response, data: undefined }> {
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
};

export type adminCreateRentalReturnType = InlineResponse20017[keyof InlineResponse20017];
export type adminDeleteRentalReturnType = Response;
export type adminListRentalsReturnType = InlineResponse20016[keyof InlineResponse20016];
export type adminUpdateRentalReturnType = InlineResponse20017[keyof InlineResponse20017];
export type getRentalReturnType = InlineResponse20017[keyof InlineResponse20017];
export type listRentalsReturnType = InlineResponse20016[keyof InlineResponse20016];
export type updateRentalReturnType = InlineResponse20017[keyof InlineResponse20017];

/**
 * RentalsApi - object-oriented interface
 */
export class RentalsApi {

    /** 
     * Creates a rental
     * @param createRentalDetails 
     */
    public adminCreateRental(params: {  "createRentalDetails": CreateRentalDetails; }): Promise<{ response: Response, data: adminCreateRentalReturnType }> {
        validateRequiredParameters(
            ["createRentalDetails"], 
            "adminCreateRental", 
            params
        );

        const path = `/admin/rentals`;

        return makeRequest<adminCreateRentalReturnType>(
            "POST",
            path,
            params["createRentalDetails"]
        );
    }
    /** 
     * Deletes a rental
     * @param id 
     */
    public adminDeleteRental(params: {  "id": string; }): Promise<{ response: Response, data: undefined }> {
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
    public adminListRentals(params: {  "pageNum"?: number; "orderBy"?: string; "order"?: string; "search"?: string; "memberId"?: string; }): Promise<{ response: Response, data: adminListRentalsReturnType }> {
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
     * @param updateRentalDetails 
     */
    public adminUpdateRental(params: {  "id": string; "updateRentalDetails": UpdateRentalDetails; }): Promise<{ response: Response, data: adminUpdateRentalReturnType }> {
        validateRequiredParameters(
            ["id","updateRentalDetails"], 
            "adminUpdateRental", 
            params
        );

        const path = `/admin/rentals/{id}`.replace(`{${"id"}}`, `${ params["id"] }`);

        return makeRequest<adminUpdateRentalReturnType>(
            "PUT",
            path,
            params["updateRentalDetails"]
        );
    }
    /** 
     * Gets a rental
     * @param id 
     */
    public getRental(params: {  "id": string; }): Promise<{ response: Response, data: getRentalReturnType }> {
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
    public listRentals(params: {  "pageNum"?: number; "orderBy"?: string; "order"?: string; }): Promise<{ response: Response, data: listRentalsReturnType }> {
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
     * @param updateRentalDetails 
     */
    public updateRental(params: {  "id": string; "updateRentalDetails": UpdateRentalDetails1; }): Promise<{ response: Response, data: updateRentalReturnType }> {
        validateRequiredParameters(
            ["id","updateRentalDetails"], 
            "updateRental", 
            params
        );

        const path = `/rentals/{id}`.replace(`{${"id"}}`, `${ params["id"] }`);

        return makeRequest<updateRentalReturnType>(
            "PUT",
            path,
            params["updateRentalDetails"]
        );
    }
};

export type adminListEarnedMembershipReportsReturnType = InlineResponse2009[keyof InlineResponse2009];
export type createEarnedMembershipReportReturnType = InlineResponse20022[keyof InlineResponse20022];
export type listEarnedMembershipReportsReturnType = InlineResponse2009[keyof InlineResponse2009];

/**
 * ReportsApi - object-oriented interface
 */
export class ReportsApi {

    /** 
     * Gets a list of reports
     * @param id 
     * @param pageNum 
     * @param orderBy 
     * @param order 
     */
    public adminListEarnedMembershipReports(params: {  "id": string; "pageNum"?: number; "orderBy"?: string; "order"?: string; }): Promise<{ response: Response, data: adminListEarnedMembershipReportsReturnType }> {
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
     * @param createEarnedMembershipReportDetails 
     */
    public createEarnedMembershipReport(params: {  "id": string; "createEarnedMembershipReportDetails": CreateEarnedMembershipReportDetails; }): Promise<{ response: Response, data: createEarnedMembershipReportReturnType }> {
        validateRequiredParameters(
            ["id","createEarnedMembershipReportDetails"], 
            "createEarnedMembershipReport", 
            params
        );

        const path = `/earned_memberships/{id}/reports`.replace(`{${"id"}}`, `${ params["id"] }`);

        return makeRequest<createEarnedMembershipReportReturnType>(
            "POST",
            path,
            params["createEarnedMembershipReportDetails"]
        );
    }
    /** 
     * Gets a list of reports for current member
     * @param id 
     * @param pageNum 
     * @param orderBy 
     * @param order 
     */
    public listEarnedMembershipReports(params: {  "id": string; "pageNum"?: number; "orderBy"?: string; "order"?: string; }): Promise<{ response: Response, data: listEarnedMembershipReportsReturnType }> {
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
};

export type adminCancelSubscriptionReturnType = Response;
export type adminListSubscriptionsReturnType = InlineResponse2003[keyof InlineResponse2003];
export type cancelSubscriptionReturnType = Response;
export type getSubscriptionReturnType = InlineResponse20021[keyof InlineResponse20021];
export type updateSubscriptionReturnType = InlineResponse20021[keyof InlineResponse20021];

/**
 * SubscriptionsApi - object-oriented interface
 */
export class SubscriptionsApi {

    /** 
     * Cancels a subscription
     * @param id 
     */
    public adminCancelSubscription(params: {  "id": string; }): Promise<{ response: Response, data: undefined }> {
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
    public adminListSubscriptions(params: {  "startDate"?: string; "endDate"?: string; "search"?: string; "planId"?: Array<string>; "subscriptionStatus"?: Array<string>; "customerId"?: string; }): Promise<{ response: Response, data: adminListSubscriptionsReturnType }> {
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
                "planId": { values: params["planId"], collectionFormat: "csv" },
                "subscriptionStatus": { values: params["subscriptionStatus"], collectionFormat: "csv" },
                "customerId": { values: params["customerId"] }
            },
        );
    }
    /** 
     * Cancels a subscription
     * @param id 
     */
    public cancelSubscription(params: {  "id": string; }): Promise<{ response: Response, data: undefined }> {
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
    public getSubscription(params: {  "id": string; }): Promise<{ response: Response, data: getSubscriptionReturnType }> {
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
     * @param updateSubscriptionDetails 
     */
    public updateSubscription(params: {  "id": string; "updateSubscriptionDetails": UpdateSubscriptionDetails; }): Promise<{ response: Response, data: updateSubscriptionReturnType }> {
        validateRequiredParameters(
            ["id","updateSubscriptionDetails"], 
            "updateSubscription", 
            params
        );

        const path = `/billing/subscriptions/{id}`.replace(`{${"id"}}`, `${ params["id"] }`);

        return makeRequest<updateSubscriptionReturnType>(
            "PUT",
            path,
            params["updateSubscriptionDetails"]
        );
    }
};

export type adminDeleteTransactionReturnType = Response;
export type adminGetTransactionReturnType = InlineResponse2005[keyof InlineResponse2005];
export type adminListTransactionReturnType = InlineResponse2004[keyof InlineResponse2004];
export type createTransactionReturnType = InlineResponse2005[keyof InlineResponse2005];
export type deleteTransactionReturnType = Response;
export type listTransactionsReturnType = InlineResponse2004[keyof InlineResponse2004];

/**
 * TransactionsApi - object-oriented interface
 */
export class TransactionsApi {

    /** 
     * Request refund for a transaction
     * @param id 
     */
    public adminDeleteTransaction(params: {  "id": string; }): Promise<{ response: Response, data: undefined }> {
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
    public adminGetTransaction(params: {  "id": string; }): Promise<{ response: Response, data: adminGetTransactionReturnType }> {
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
    public adminListTransaction(params: {  "startDate"?: string; "endDate"?: string; "refund"?: boolean; "type"?: string; "transactionStatus"?: Array<string>; "customerId"?: string; }): Promise<{ response: Response, data: adminListTransactionReturnType }> {
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
                "transactionStatus": { values: params["transactionStatus"], collectionFormat: "csv" },
                "customerId": { values: params["customerId"] }
            },
        );
    }
    /** 
     * Create an transaction
     * @param createTransactionDetails 
     */
    public createTransaction(params: {  "createTransactionDetails": CreateTransactionDetails; }): Promise<{ response: Response, data: createTransactionReturnType }> {
        validateRequiredParameters(
            ["createTransactionDetails"], 
            "createTransaction", 
            params
        );

        const path = `/billing/transactions`;

        return makeRequest<createTransactionReturnType>(
            "POST",
            path,
            params["createTransactionDetails"]
        );
    }
    /** 
     * Request refund for a transaction
     * @param id 
     */
    public deleteTransaction(params: {  "id": string; }): Promise<{ response: Response, data: undefined }> {
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
    public listTransactions(params: {  "startDate"?: string; "endDate"?: string; "refund"?: boolean; "type"?: string; "transactionStatus"?: Array<string>; "paymentMethodToken"?: Array<string>; }): Promise<{ response: Response, data: listTransactionsReturnType }> {
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
                "transactionStatus": { values: params["transactionStatus"], collectionFormat: "csv" },
                "paymentMethodToken": { values: params["paymentMethodToken"], collectionFormat: "csv" }
            },
        );
    }
};

