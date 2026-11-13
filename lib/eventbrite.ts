// Generated from Rails OpenAPI by scripts/generate-eventbrite.cjs.
import { makeRequest, ApiDataResponse, Member } from './apiClient';

export type SignupAttribution = { "signupSource"?: string; "signupSourceDetail"?: string; "signupEventbriteEventId"?: string; };
export type SignupEvent = { "id": string; "name": string; "startsAt": string; "timezone": string; };
export type EventbriteRecord = { "id": string; "organizationId": string; "eventbriteId": string; "name"?: string | null; "email"?: string | null; "status"?: string | null; "eventId"?: string | null; "orderId"?: string | null; "ticketClassId"?: string | null; "memberId"?: string | null; "memberIds"?: Array<string>; "ticketClassName"?: string | null; "refunded"?: boolean; "event"?: { "name"?: string | null; "startsAt"?: string | null; "timezone"?: string | null; } | null; "costs"?: { [key: string]: unknown }; "cost"?: { [key: string]: unknown }; "free"?: boolean; "quantityTotal"?: number | null; "linkConflict"?: boolean; "startsAt"?: string | null; "timezone"?: string | null; "invalidatedAt"?: string | null; "invalidationReason"?: string | null; "refundedAt"?: string | null; "attendees"?: Array<EventbriteRecord>; "ticketClasses"?: Array<EventbriteRecord>; };

export function listSignupEvents(): Promise<ApiDataResponse<Array<{ "id": string; "name": string; "startsAt": string; "timezone": string; }>>> {
  return makeRequest<Array<{ "id": string; "name": string; "startsAt": string; "timezone": string; }>>("GET", "/signup_events", undefined);
}

export function saveSignupSource(params: { body?: SignupAttribution; }): Promise<ApiDataResponse<Member>> {
  return makeRequest<Member>("PUT", "/signup_source", params.body);
}

export function listEventbriteEvents(params: { "organization_id"?: string; "event_id"?: string; "status"?: string; "linked"?: string; "search"?: string; "pageNum"?: string; }): Promise<ApiDataResponse<Array<EventbriteRecord>>> {
  return makeRequest<Array<EventbriteRecord>>("GET", "/admin/eventbrite/events", { "organization_id": params["organization_id"], "event_id": params["event_id"], "status": params["status"], "linked": params["linked"], "search": params["search"], "pageNum": params["pageNum"] });
}

export function listEventbriteOrders(params: { "organization_id"?: string; "event_id"?: string; "status"?: string; "linked"?: string; "search"?: string; "pageNum"?: string; }): Promise<ApiDataResponse<Array<EventbriteRecord>>> {
  return makeRequest<Array<EventbriteRecord>>("GET", "/admin/eventbrite/orders", { "organization_id": params["organization_id"], "event_id": params["event_id"], "status": params["status"], "linked": params["linked"], "search": params["search"], "pageNum": params["pageNum"] });
}

export function listEventbriteAttendees(params: { "organization_id"?: string; "event_id"?: string; "status"?: string; "linked"?: string; "search"?: string; "pageNum"?: string; }): Promise<ApiDataResponse<Array<EventbriteRecord>>> {
  return makeRequest<Array<EventbriteRecord>>("GET", "/admin/eventbrite/attendees", { "organization_id": params["organization_id"], "event_id": params["event_id"], "status": params["status"], "linked": params["linked"], "search": params["search"], "pageNum": params["pageNum"] });
}

export function getEventbriteEvents(params: { "id": string; }): Promise<ApiDataResponse<EventbriteRecord>> {
  return makeRequest<EventbriteRecord>("GET", "/admin/eventbrite/events/{id}".replace("{id}", encodeURIComponent(params["id"])), undefined);
}

export function getEventbriteOrders(params: { "id": string; }): Promise<ApiDataResponse<EventbriteRecord>> {
  return makeRequest<EventbriteRecord>("GET", "/admin/eventbrite/orders/{id}".replace("{id}", encodeURIComponent(params["id"])), undefined);
}

export function getEventbriteAttendees(params: { "id": string; }): Promise<ApiDataResponse<EventbriteRecord>> {
  return makeRequest<EventbriteRecord>("GET", "/admin/eventbrite/attendees/{id}".replace("{id}", encodeURIComponent(params["id"])), undefined);
}

export function listMemberEventbriteOrders(params: { "member_id": string; "pageNum"?: number; }): Promise<ApiDataResponse<Array<EventbriteRecord>>> {
  return makeRequest<Array<EventbriteRecord>>("GET", "/admin/members/{member_id}/eventbrite/orders".replace("{member_id}", encodeURIComponent(params["member_id"])), { "pageNum": params["pageNum"] });
}

export function listMemberEventbriteAttendees(params: { "member_id": string; "pageNum"?: number; }): Promise<ApiDataResponse<Array<EventbriteRecord>>> {
  return makeRequest<Array<EventbriteRecord>>("GET", "/admin/members/{member_id}/eventbrite/attendees".replace("{member_id}", encodeURIComponent(params["member_id"])), { "pageNum": params["pageNum"] });
}
