// @generated by protoc-gen-es v1.3.1 with parameter "target=ts,import_extension=.js"
// @generated from file mgmt/v1alpha1/auth.proto (package mgmt.v1alpha1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3, protoInt64 } from "@bufbuild/protobuf";

/**
 * @generated from message mgmt.v1alpha1.LoginCliRequest
 */
export class LoginCliRequest extends Message<LoginCliRequest> {
  /**
   * The oauth code
   *
   * @generated from field: string code = 1;
   */
  code = "";

  /**
   * The oauth redirect uri that the client uses during the oauth request
   *
   * @generated from field: string redirect_uri = 2;
   */
  redirectUri = "";

  constructor(data?: PartialMessage<LoginCliRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "mgmt.v1alpha1.LoginCliRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "code", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "redirect_uri", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): LoginCliRequest {
    return new LoginCliRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): LoginCliRequest {
    return new LoginCliRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): LoginCliRequest {
    return new LoginCliRequest().fromJsonString(jsonString, options);
  }

  static equals(a: LoginCliRequest | PlainMessage<LoginCliRequest> | undefined, b: LoginCliRequest | PlainMessage<LoginCliRequest> | undefined): boolean {
    return proto3.util.equals(LoginCliRequest, a, b);
  }
}

/**
 * @generated from message mgmt.v1alpha1.LoginCliResponse
 */
export class LoginCliResponse extends Message<LoginCliResponse> {
  /**
   * The access token that is returned on successful login
   *
   * @generated from field: mgmt.v1alpha1.AccessToken access_token = 1;
   */
  accessToken?: AccessToken;

  constructor(data?: PartialMessage<LoginCliResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "mgmt.v1alpha1.LoginCliResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "access_token", kind: "message", T: AccessToken },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): LoginCliResponse {
    return new LoginCliResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): LoginCliResponse {
    return new LoginCliResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): LoginCliResponse {
    return new LoginCliResponse().fromJsonString(jsonString, options);
  }

  static equals(a: LoginCliResponse | PlainMessage<LoginCliResponse> | undefined, b: LoginCliResponse | PlainMessage<LoginCliResponse> | undefined): boolean {
    return proto3.util.equals(LoginCliResponse, a, b);
  }
}

/**
 * @generated from message mgmt.v1alpha1.GetAuthStatusRequest
 */
export class GetAuthStatusRequest extends Message<GetAuthStatusRequest> {
  constructor(data?: PartialMessage<GetAuthStatusRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "mgmt.v1alpha1.GetAuthStatusRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetAuthStatusRequest {
    return new GetAuthStatusRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetAuthStatusRequest {
    return new GetAuthStatusRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetAuthStatusRequest {
    return new GetAuthStatusRequest().fromJsonString(jsonString, options);
  }

  static equals(a: GetAuthStatusRequest | PlainMessage<GetAuthStatusRequest> | undefined, b: GetAuthStatusRequest | PlainMessage<GetAuthStatusRequest> | undefined): boolean {
    return proto3.util.equals(GetAuthStatusRequest, a, b);
  }
}

/**
 * @generated from message mgmt.v1alpha1.GetAuthStatusResponse
 */
export class GetAuthStatusResponse extends Message<GetAuthStatusResponse> {
  /**
   * Whether or not the server has authentication enabled.
   * This tells the client if it is expected to send access tokens.
   *
   * @generated from field: bool is_enabled = 1;
   */
  isEnabled = false;

  constructor(data?: PartialMessage<GetAuthStatusResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "mgmt.v1alpha1.GetAuthStatusResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "is_enabled", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetAuthStatusResponse {
    return new GetAuthStatusResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetAuthStatusResponse {
    return new GetAuthStatusResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetAuthStatusResponse {
    return new GetAuthStatusResponse().fromJsonString(jsonString, options);
  }

  static equals(a: GetAuthStatusResponse | PlainMessage<GetAuthStatusResponse> | undefined, b: GetAuthStatusResponse | PlainMessage<GetAuthStatusResponse> | undefined): boolean {
    return proto3.util.equals(GetAuthStatusResponse, a, b);
  }
}

/**
 * A decoded representation of an Access token from the backing auth server
 *
 * @generated from message mgmt.v1alpha1.AccessToken
 */
export class AccessToken extends Message<AccessToken> {
  /**
   * The access token that will be provided in subsequent requests to provide authenticated access to the Api
   *
   * @generated from field: string access_token = 1;
   */
  accessToken = "";

  /**
   * Token that can be used to retrieve a refreshed access token.
   * Will not be provided if the offline_access scope is not provided in the initial login flow.
   *
   * @generated from field: optional string refresh_token = 2;
   */
  refreshToken?: string;

  /**
   * Relative time in seconds that the access token will expire. Combine with the current time to get the expires_at time.
   *
   * @generated from field: int64 expires_in = 3;
   */
  expiresIn = protoInt64.zero;

  /**
   * The scopes that the access token have
   *
   * @generated from field: string scope = 4;
   */
  scope = "";

  /**
   * The identity token of the authenticated user
   *
   * @generated from field: optional string id_token = 5;
   */
  idToken?: string;

  /**
   * The token type. For JWTs, this will be `Bearer`
   *
   * @generated from field: string token_type = 6;
   */
  tokenType = "";

  constructor(data?: PartialMessage<AccessToken>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "mgmt.v1alpha1.AccessToken";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "access_token", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "refresh_token", kind: "scalar", T: 9 /* ScalarType.STRING */, opt: true },
    { no: 3, name: "expires_in", kind: "scalar", T: 3 /* ScalarType.INT64 */ },
    { no: 4, name: "scope", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 5, name: "id_token", kind: "scalar", T: 9 /* ScalarType.STRING */, opt: true },
    { no: 6, name: "token_type", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): AccessToken {
    return new AccessToken().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): AccessToken {
    return new AccessToken().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): AccessToken {
    return new AccessToken().fromJsonString(jsonString, options);
  }

  static equals(a: AccessToken | PlainMessage<AccessToken> | undefined, b: AccessToken | PlainMessage<AccessToken> | undefined): boolean {
    return proto3.util.equals(AccessToken, a, b);
  }
}

/**
 * @generated from message mgmt.v1alpha1.GetAuthorizeUrlRequest
 */
export class GetAuthorizeUrlRequest extends Message<GetAuthorizeUrlRequest> {
  /**
   * The state that's generated by the client that is passed along to prevent tampering
   *
   * @generated from field: string state = 1;
   */
  state = "";

  /**
   * The redirect uri that the client will be redirected back to during the auth request
   *
   * @generated from field: string redirect_uri = 2;
   */
  redirectUri = "";

  /**
   * The scopes the client is requesting as a part of the oauth login request
   *
   * @generated from field: string scope = 3;
   */
  scope = "";

  constructor(data?: PartialMessage<GetAuthorizeUrlRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "mgmt.v1alpha1.GetAuthorizeUrlRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "state", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "redirect_uri", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "scope", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetAuthorizeUrlRequest {
    return new GetAuthorizeUrlRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetAuthorizeUrlRequest {
    return new GetAuthorizeUrlRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetAuthorizeUrlRequest {
    return new GetAuthorizeUrlRequest().fromJsonString(jsonString, options);
  }

  static equals(a: GetAuthorizeUrlRequest | PlainMessage<GetAuthorizeUrlRequest> | undefined, b: GetAuthorizeUrlRequest | PlainMessage<GetAuthorizeUrlRequest> | undefined): boolean {
    return proto3.util.equals(GetAuthorizeUrlRequest, a, b);
  }
}

/**
 * @generated from message mgmt.v1alpha1.GetAuthorizeUrlResponse
 */
export class GetAuthorizeUrlResponse extends Message<GetAuthorizeUrlResponse> {
  /**
   * The generated url that is the client will be redirected to during the Oauth flow
   *
   * @generated from field: string url = 1;
   */
  url = "";

  constructor(data?: PartialMessage<GetAuthorizeUrlResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "mgmt.v1alpha1.GetAuthorizeUrlResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "url", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetAuthorizeUrlResponse {
    return new GetAuthorizeUrlResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetAuthorizeUrlResponse {
    return new GetAuthorizeUrlResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetAuthorizeUrlResponse {
    return new GetAuthorizeUrlResponse().fromJsonString(jsonString, options);
  }

  static equals(a: GetAuthorizeUrlResponse | PlainMessage<GetAuthorizeUrlResponse> | undefined, b: GetAuthorizeUrlResponse | PlainMessage<GetAuthorizeUrlResponse> | undefined): boolean {
    return proto3.util.equals(GetAuthorizeUrlResponse, a, b);
  }
}

/**
 * @generated from message mgmt.v1alpha1.GetCliIssuerRequest
 */
export class GetCliIssuerRequest extends Message<GetCliIssuerRequest> {
  constructor(data?: PartialMessage<GetCliIssuerRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "mgmt.v1alpha1.GetCliIssuerRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetCliIssuerRequest {
    return new GetCliIssuerRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetCliIssuerRequest {
    return new GetCliIssuerRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetCliIssuerRequest {
    return new GetCliIssuerRequest().fromJsonString(jsonString, options);
  }

  static equals(a: GetCliIssuerRequest | PlainMessage<GetCliIssuerRequest> | undefined, b: GetCliIssuerRequest | PlainMessage<GetCliIssuerRequest> | undefined): boolean {
    return proto3.util.equals(GetCliIssuerRequest, a, b);
  }
}

/**
 * @generated from message mgmt.v1alpha1.GetCliIssuerResponse
 */
export class GetCliIssuerResponse extends Message<GetCliIssuerResponse> {
  /**
   * The backing authentication issuer url
   *
   * @generated from field: string issuer_url = 1;
   */
  issuerUrl = "";

  /**
   * The audience that will be used in the access token. This corresponds to the "aud" claim
   *
   * @generated from field: string audience = 2;
   */
  audience = "";

  constructor(data?: PartialMessage<GetCliIssuerResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "mgmt.v1alpha1.GetCliIssuerResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "issuer_url", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "audience", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetCliIssuerResponse {
    return new GetCliIssuerResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetCliIssuerResponse {
    return new GetCliIssuerResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetCliIssuerResponse {
    return new GetCliIssuerResponse().fromJsonString(jsonString, options);
  }

  static equals(a: GetCliIssuerResponse | PlainMessage<GetCliIssuerResponse> | undefined, b: GetCliIssuerResponse | PlainMessage<GetCliIssuerResponse> | undefined): boolean {
    return proto3.util.equals(GetCliIssuerResponse, a, b);
  }
}

/**
 * @generated from message mgmt.v1alpha1.RefreshCliRequest
 */
export class RefreshCliRequest extends Message<RefreshCliRequest> {
  /**
   * The token used to retrieve a new access token.
   *
   * @generated from field: string refresh_token = 1;
   */
  refreshToken = "";

  constructor(data?: PartialMessage<RefreshCliRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "mgmt.v1alpha1.RefreshCliRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "refresh_token", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): RefreshCliRequest {
    return new RefreshCliRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): RefreshCliRequest {
    return new RefreshCliRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): RefreshCliRequest {
    return new RefreshCliRequest().fromJsonString(jsonString, options);
  }

  static equals(a: RefreshCliRequest | PlainMessage<RefreshCliRequest> | undefined, b: RefreshCliRequest | PlainMessage<RefreshCliRequest> | undefined): boolean {
    return proto3.util.equals(RefreshCliRequest, a, b);
  }
}

/**
 * @generated from message mgmt.v1alpha1.RefreshCliResponse
 */
export class RefreshCliResponse extends Message<RefreshCliResponse> {
  /**
   * The access token that is returned on successful refresh
   *
   * @generated from field: mgmt.v1alpha1.AccessToken access_token = 1;
   */
  accessToken?: AccessToken;

  constructor(data?: PartialMessage<RefreshCliResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "mgmt.v1alpha1.RefreshCliResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "access_token", kind: "message", T: AccessToken },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): RefreshCliResponse {
    return new RefreshCliResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): RefreshCliResponse {
    return new RefreshCliResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): RefreshCliResponse {
    return new RefreshCliResponse().fromJsonString(jsonString, options);
  }

  static equals(a: RefreshCliResponse | PlainMessage<RefreshCliResponse> | undefined, b: RefreshCliResponse | PlainMessage<RefreshCliResponse> | undefined): boolean {
    return proto3.util.equals(RefreshCliResponse, a, b);
  }
}

/**
 * @generated from message mgmt.v1alpha1.CheckTokenRequest
 */
export class CheckTokenRequest extends Message<CheckTokenRequest> {
  constructor(data?: PartialMessage<CheckTokenRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "mgmt.v1alpha1.CheckTokenRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CheckTokenRequest {
    return new CheckTokenRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CheckTokenRequest {
    return new CheckTokenRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CheckTokenRequest {
    return new CheckTokenRequest().fromJsonString(jsonString, options);
  }

  static equals(a: CheckTokenRequest | PlainMessage<CheckTokenRequest> | undefined, b: CheckTokenRequest | PlainMessage<CheckTokenRequest> | undefined): boolean {
    return proto3.util.equals(CheckTokenRequest, a, b);
  }
}

/**
 * @generated from message mgmt.v1alpha1.CheckTokenResponse
 */
export class CheckTokenResponse extends Message<CheckTokenResponse> {
  constructor(data?: PartialMessage<CheckTokenResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "mgmt.v1alpha1.CheckTokenResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CheckTokenResponse {
    return new CheckTokenResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CheckTokenResponse {
    return new CheckTokenResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CheckTokenResponse {
    return new CheckTokenResponse().fromJsonString(jsonString, options);
  }

  static equals(a: CheckTokenResponse | PlainMessage<CheckTokenResponse> | undefined, b: CheckTokenResponse | PlainMessage<CheckTokenResponse> | undefined): boolean {
    return proto3.util.equals(CheckTokenResponse, a, b);
  }
}

