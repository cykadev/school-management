/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: { input: any; output: any };
};

export type AuthPayload = {
  __typename?: "AuthPayload";
  token?: Maybe<Scalars["String"]["output"]>;
  user?: Maybe<User>;
};

export type LoginInput = {
  email: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
};

export type Mutation = {
  __typename?: "Mutation";
  createOrganization?: Maybe<Organization>;
  createUser?: Maybe<User>;
  login?: Maybe<AuthPayload>;
};

export type MutationCreateOrganizationArgs = {
  input: OrganizationCreateInput;
};

export type MutationCreateUserArgs = {
  input: UserInput;
};

export type MutationLoginArgs = {
  input: LoginInput;
};

export type Organization = {
  __typename?: "Organization";
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  id?: Maybe<Scalars["ID"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  status?: Maybe<Scalars["String"]["output"]>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
  users?: Maybe<Array<User>>;
};

export type OrganizationCreateInput = {
  name: Scalars["String"]["input"];
  status?: InputMaybe<OrganizationStatus>;
};

export enum OrganizationStatus {
  Active = "ACTIVE",
  Disabled = "DISABLED",
}

export type Query = {
  __typename?: "Query";
  organization?: Maybe<Organization>;
  organizations?: Maybe<Array<Organization>>;
  user?: Maybe<User>;
  users?: Maybe<Array<User>>;
};

export type QueryOrganizationArgs = {
  id: Scalars["String"]["input"];
};

export type QueryOrganizationsArgs = {
  status?: InputMaybe<OrganizationStatus>;
};

export type QueryUserArgs = {
  id: Scalars["String"]["input"];
};

export type QueryUsersArgs = {
  status?: InputMaybe<UserStatus>;
};

export type User = {
  __typename?: "User";
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  email?: Maybe<Scalars["String"]["output"]>;
  firstName?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["ID"]["output"]>;
  lastName?: Maybe<Scalars["String"]["output"]>;
  role?: Maybe<Scalars["String"]["output"]>;
  status?: Maybe<Scalars["String"]["output"]>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
};

export type UserInput = {
  email: Scalars["String"]["input"];
  firstName: Scalars["String"]["input"];
  lastName: Scalars["String"]["input"];
  role: Scalars["String"]["input"];
  status?: InputMaybe<UserStatus>;
};

export enum UserStatus {
  Active = "ACTIVE",
  Disabled = "DISABLED",
}
