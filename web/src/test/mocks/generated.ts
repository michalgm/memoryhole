/* eslint-disable @typescript-eslint/no-use-before-define,@typescript-eslint/no-unused-vars,no-prototype-builtins,@typescript-eslint/no-explicit-any */
import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from 'graphql'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never }
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never
    }
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
  BigInt: { input: any; output: any }
  Byte: { input: any; output: any }
  Date: { input: any; output: any }
  DateTime: { input: any; output: any }
  File: { input: any; output: any }
  JSON: { input: any; output: any }
  JSONObject: { input: any; output: any }
  Time: { input: any; output: any }
}

export type Action = {
  __typename?: 'Action'
  Arrest: Array<Maybe<Arrest>>
  city?: Maybe<Scalars['String']['output']>
  custom_fields?: Maybe<Scalars['JSON']['output']>
  description?: Maybe<Scalars['String']['output']>
  end_date?: Maybe<Scalars['DateTime']['output']>
  id: Scalars['Int']['output']
  jurisdiction?: Maybe<Scalars['String']['output']>
  name: Scalars['String']['output']
  start_date: Scalars['DateTime']['output']
}

export type Arrest = {
  __typename?: 'Arrest'
  /** Associated action record */
  action?: Maybe<Action>
  /** Foreign key linking to action */
  action_id?: Maybe<Scalars['Int']['output']>
  /** City where arrest occurred */
  arrest_city?: Maybe<Scalars['String']['output']>
  /** Arrestee record for the person arrested */
  arrestee?: Maybe<Arrestee>
  /** Foreign key linking to arrestee */
  arrestee_id?: Maybe<Scalars['Int']['output']>
  /** List of charges filed */
  charges?: Maybe<Scalars['String']['output']>
  /** Official citation or case number */
  citation_number?: Maybe<Scalars['String']['output']>
  /** Timestamp of record creation */
  created_at?: Maybe<Scalars['DateTime']['output']>
  /** User who created the record */
  created_by?: Maybe<User>
  /** Foreign key linking to creating user */
  created_by_id?: Maybe<Scalars['Int']['output']>
  /** Flexible field for additional data */
  custom_fields?: Maybe<Scalars['JSON']['output']>
  /** Date and time when the arrest occurred */
  date?: Maybe<Scalars['DateTime']['output']>
  /** Formatted display name for UI presentation */
  display_field?: Maybe<Scalars['String']['output']>
  /** Unique identifier for the arrest record */
  id: Scalars['Int']['output']
  /** Legal jurisdiction handling the case */
  jurisdiction?: Maybe<Scalars['String']['output']>
  /** Physical location where arrest took place */
  location?: Maybe<Scalars['String']['output']>
  /** Searchable text field for finding arrests */
  search_field?: Maybe<Scalars['String']['output']>
  /** Timestamp of last update */
  updated_at?: Maybe<Scalars['DateTime']['output']>
  /** User who last updated the record */
  updated_by?: Maybe<User>
  /** Foreign key linking to updating user */
  updated_by_id?: Maybe<Scalars['Int']['output']>
}

export type Arrestee = {
  __typename?: 'Arrestee'
  address?: Maybe<Scalars['String']['output']>
  arrestee_logs: Array<Maybe<Log>>
  arrests: Array<Maybe<Arrest>>
  city?: Maybe<Scalars['String']['output']>
  created_at?: Maybe<Scalars['DateTime']['output']>
  created_by?: Maybe<User>
  created_by_id?: Maybe<Scalars['Int']['output']>
  custom_fields?: Maybe<Scalars['JSON']['output']>
  display_field?: Maybe<Scalars['String']['output']>
  dob?: Maybe<Scalars['DateTime']['output']>
  email?: Maybe<Scalars['String']['output']>
  first_name?: Maybe<Scalars['String']['output']>
  id: Scalars['Int']['output']
  last_name?: Maybe<Scalars['String']['output']>
  notes?: Maybe<Scalars['String']['output']>
  phone_1?: Maybe<Scalars['String']['output']>
  phone_2?: Maybe<Scalars['String']['output']>
  preferred_name?: Maybe<Scalars['String']['output']>
  pronoun?: Maybe<Scalars['String']['output']>
  search_display_field?: Maybe<Scalars['String']['output']>
  search_field?: Maybe<Scalars['String']['output']>
  state?: Maybe<Scalars['String']['output']>
  updated_at?: Maybe<Scalars['DateTime']['output']>
  updated_by?: Maybe<User>
  updated_by_id?: Maybe<Scalars['Int']['output']>
  zip?: Maybe<Scalars['String']['output']>
}

export type BatchPayload = {
  __typename?: 'BatchPayload'
  count: Scalars['Int']['output']
}

export type CreateActionInput = {
  city?: InputMaybe<Scalars['String']['input']>
  custom_fields?: InputMaybe<Scalars['JSON']['input']>
  description?: InputMaybe<Scalars['String']['input']>
  end_date?: InputMaybe<Scalars['DateTime']['input']>
  jurisdiction?: InputMaybe<Scalars['String']['input']>
  name: Scalars['String']['input']
  start_date: Scalars['DateTime']['input']
}

/** Creates a new arrest and arrestee */
export type CreateArrestInput = {
  action_id?: InputMaybe<Scalars['Int']['input']>
  arrest_city?: InputMaybe<Scalars['String']['input']>
  arrestee?: InputMaybe<UpdateArresteeInput>
  arrestee_id?: InputMaybe<Scalars['Int']['input']>
  charges?: InputMaybe<Scalars['String']['input']>
  citation_number?: InputMaybe<Scalars['String']['input']>
  created_by_id?: InputMaybe<Scalars['Int']['input']>
  custom_fields?: InputMaybe<Scalars['JSON']['input']>
  date?: InputMaybe<Scalars['DateTime']['input']>
  display_field?: InputMaybe<Scalars['String']['input']>
  jurisdiction?: InputMaybe<Scalars['String']['input']>
  location?: InputMaybe<Scalars['String']['input']>
  search_field?: InputMaybe<Scalars['String']['input']>
  updated_by_id?: InputMaybe<Scalars['Int']['input']>
}

export type CreateArresteeInput = {
  address?: InputMaybe<Scalars['String']['input']>
  city?: InputMaybe<Scalars['String']['input']>
  created_by_id?: InputMaybe<Scalars['Int']['input']>
  custom_fields?: InputMaybe<Scalars['JSON']['input']>
  display_field?: InputMaybe<Scalars['String']['input']>
  dob?: InputMaybe<Scalars['DateTime']['input']>
  email?: InputMaybe<Scalars['String']['input']>
  first_name?: InputMaybe<Scalars['String']['input']>
  last_name?: InputMaybe<Scalars['String']['input']>
  notes?: InputMaybe<Scalars['String']['input']>
  phone_1?: InputMaybe<Scalars['String']['input']>
  phone_2?: InputMaybe<Scalars['String']['input']>
  preferred_name?: InputMaybe<Scalars['String']['input']>
  pronoun?: InputMaybe<Scalars['String']['input']>
  search_field?: InputMaybe<Scalars['String']['input']>
  state?: InputMaybe<Scalars['String']['input']>
  updated_by_id?: InputMaybe<Scalars['Int']['input']>
  zip?: InputMaybe<Scalars['String']['input']>
}

export type CreateCustomSchemaInput = {
  schema: Scalars['JSON']['input']
  section: Scalars['String']['input']
  table: Scalars['String']['input']
  updated_by_id?: InputMaybe<Scalars['Int']['input']>
}

export type CreateLogInput = {
  action_id?: InputMaybe<Scalars['Int']['input']>
  arrests?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  created_by_id?: InputMaybe<Scalars['Int']['input']>
  custom_fields?: InputMaybe<Scalars['JSON']['input']>
  needs_followup?: InputMaybe<Scalars['Boolean']['input']>
  notes?: InputMaybe<Scalars['String']['input']>
  type?: InputMaybe<Scalars['String']['input']>
  updated_by_id?: InputMaybe<Scalars['Int']['input']>
}

export type CreateOptionSetInput = {
  name: Scalars['String']['input']
  values: Array<InputMaybe<CreateOptionSetInputValueInput>>
}

export type CreateOptionSetInputValueInput = {
  label: Scalars['String']['input']
  value: Scalars['String']['input']
}

export type CreateOptionSetValueInput = {
  label: Scalars['String']['input']
  option_set_id: Scalars['Int']['input']
  value: Scalars['String']['input']
}

export type CreateSiteSettingInput = {
  description?: InputMaybe<Scalars['String']['input']>
  id: Scalars['String']['input']
  value: Scalars['JSON']['input']
}

export type CreateTableViewInput = {
  created_at?: InputMaybe<Scalars['DateTime']['input']>
  created_by_id?: InputMaybe<Scalars['Int']['input']>
  name: Scalars['String']['input']
  state: Scalars['String']['input']
  type: Scalars['String']['input']
  updated_at?: InputMaybe<Scalars['DateTime']['input']>
  updated_by_id?: InputMaybe<Scalars['Int']['input']>
}

export type CreateUserInput = {
  action_ids?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  arrest_date_max?: InputMaybe<Scalars['DateTime']['input']>
  arrest_date_min?: InputMaybe<Scalars['DateTime']['input']>
  arrest_date_threshold?: InputMaybe<Scalars['Int']['input']>
  custom_fields?: InputMaybe<Scalars['JSON']['input']>
  email: Scalars['String']['input']
  expiresAt?: InputMaybe<Scalars['DateTime']['input']>
  name: Scalars['String']['input']
  role: Scalars['String']['input']
}

export type CustomSchema = {
  __typename?: 'CustomSchema'
  id: Scalars['Int']['output']
  schema: Scalars['JSON']['output']
  section: Scalars['String']['output']
  table: Scalars['String']['output']
  updated_at?: Maybe<Scalars['DateTime']['output']>
  updated_by?: Maybe<User>
  updated_by_id?: Maybe<Scalars['Int']['output']>
}

export type GenericFilterInput = {
  field: Scalars['String']['input']
  operator?: InputMaybe<Scalars['String']['input']>
  value: Scalars['JSON']['input']
}

export type Log = {
  __typename?: 'Log'
  action?: Maybe<Action>
  action_id?: Maybe<Scalars['Int']['output']>
  arrests: Array<Maybe<Arrest>>
  created_at?: Maybe<Scalars['DateTime']['output']>
  created_by?: Maybe<User>
  created_by_id?: Maybe<Scalars['Int']['output']>
  custom_fields?: Maybe<Scalars['JSON']['output']>
  id: Scalars['Int']['output']
  needs_followup: Scalars['Boolean']['output']
  notes?: Maybe<Scalars['String']['output']>
  time: Scalars['DateTime']['output']
  type?: Maybe<Scalars['String']['output']>
  updated_at?: Maybe<Scalars['DateTime']['output']>
  updated_by?: Maybe<User>
  updated_by_id?: Maybe<Scalars['Int']['output']>
}

export type Mutation = {
  __typename?: 'Mutation'
  /** Remove multiple arrest records simultaneously (alongs with their arrestee records */
  bulkDeleteArrests?: Maybe<BatchPayload>
  /** Update multiple arrest records simultaneously */
  bulkUpdateArrests?: Maybe<BatchPayload>
  bulkUpdateUsers?: Maybe<BatchPayload>
  bulkUpsertSiteSetting: Array<Maybe<SiteSetting>>
  createAction: Action
  /** Create a new arrest record with optional arrestee details */
  createArrest: Arrest
  createCustomSchema: CustomSchema
  createLog: Log
  createOptionSet: OptionSet
  createOptionSetValue: OptionSetValue
  createSiteSetting: SiteSetting
  createTableView: TableView
  createUser: User
  deleteAction: Action
  /** Remove an arrest record and its arrestee */
  deleteArrest: Arrest
  deleteCustomSchema: CustomSchema
  deleteLog: Log
  deleteOptionSet: OptionSet
  deleteOptionSetValue: OptionSetValue
  deleteSiteSetting: SiteSetting
  deleteTableView: TableView
  deleteUser: User
  updateAction: Action
  /** Update an existing arrest record */
  updateArrest: Arrest
  updateCustomSchema: CustomSchema
  updateLog: Log
  updateOptionSet: OptionSet
  updateOptionSetValue: OptionSetValue
  updateSiteSetting: SiteSetting
  updateTableView: TableView
  updateUser: User
  upsertSiteSetting: SiteSetting
}

export type MutationBulkDeleteArrestsArgs = {
  ids: Array<InputMaybe<Scalars['Int']['input']>>
}

export type MutationBulkUpdateArrestsArgs = {
  ids: Array<InputMaybe<Scalars['Int']['input']>>
  input?: InputMaybe<UpdateArrestInput>
}

export type MutationBulkUpdateUsersArgs = {
  ids: Array<InputMaybe<Scalars['Int']['input']>>
  input?: InputMaybe<UpdateUserInput>
}

export type MutationBulkUpsertSiteSettingArgs = {
  input: Array<InputMaybe<UpsertSiteSettingInput>>
}

export type MutationCreateActionArgs = {
  input: CreateActionInput
}

export type MutationCreateArrestArgs = {
  input: CreateArrestInput
}

export type MutationCreateCustomSchemaArgs = {
  input: CreateCustomSchemaInput
}

export type MutationCreateLogArgs = {
  input: CreateLogInput
}

export type MutationCreateOptionSetArgs = {
  input: CreateOptionSetInput
}

export type MutationCreateOptionSetValueArgs = {
  input: CreateOptionSetValueInput
}

export type MutationCreateSiteSettingArgs = {
  input: CreateSiteSettingInput
}

export type MutationCreateTableViewArgs = {
  input: CreateTableViewInput
}

export type MutationCreateUserArgs = {
  input: CreateUserInput
}

export type MutationDeleteActionArgs = {
  id: Scalars['Int']['input']
}

export type MutationDeleteArrestArgs = {
  id: Scalars['Int']['input']
}

export type MutationDeleteCustomSchemaArgs = {
  id: Scalars['Int']['input']
}

export type MutationDeleteLogArgs = {
  id: Scalars['Int']['input']
}

export type MutationDeleteOptionSetArgs = {
  id: Scalars['Int']['input']
}

export type MutationDeleteOptionSetValueArgs = {
  id: Scalars['Int']['input']
}

export type MutationDeleteSiteSettingArgs = {
  id: Scalars['String']['input']
}

export type MutationDeleteTableViewArgs = {
  id: Scalars['Int']['input']
}

export type MutationDeleteUserArgs = {
  id: Scalars['Int']['input']
}

export type MutationUpdateActionArgs = {
  id: Scalars['Int']['input']
  input: UpdateActionInput
}

export type MutationUpdateArrestArgs = {
  id: Scalars['Int']['input']
  input: UpdateArrestInput
}

export type MutationUpdateCustomSchemaArgs = {
  id: Scalars['Int']['input']
  input: UpdateCustomSchemaInput
}

export type MutationUpdateLogArgs = {
  id: Scalars['Int']['input']
  input: UpdateLogInput
}

export type MutationUpdateOptionSetArgs = {
  id: Scalars['Int']['input']
  input: UpdateOptionSetInput
}

export type MutationUpdateOptionSetValueArgs = {
  id: Scalars['Int']['input']
  input: UpdateOptionSetValueInput
}

export type MutationUpdateSiteSettingArgs = {
  id: Scalars['String']['input']
  input: UpdateSiteSettingInput
}

export type MutationUpdateTableViewArgs = {
  id: Scalars['Int']['input']
  input: UpdateTableViewInput
}

export type MutationUpdateUserArgs = {
  id: Scalars['Int']['input']
  input: UpdateUserInput
}

export type MutationUpsertSiteSettingArgs = {
  input: UpsertSiteSettingInput
}

export type OptionSet = {
  __typename?: 'OptionSet'
  description?: Maybe<Scalars['String']['output']>
  id: Scalars['Int']['output']
  name: Scalars['String']['output']
  values: Array<Maybe<OptionSetValue>>
}

export type OptionSetValue = {
  __typename?: 'OptionSetValue'
  id: Scalars['Int']['output']
  label: Scalars['String']['output']
  option_set_details: OptionSet
  option_set_id: Scalars['Int']['output']
  value: Scalars['String']['output']
}

/** About the Redwood queries. */
export type Query = {
  __typename?: 'Query'
  action?: Maybe<Action>
  actions: Array<Action>
  /** Get a single arrest record by ID */
  arrest?: Maybe<Arrest>
  arresteeLogs: Array<Log>
  /** Retrieve all accessible arrest records */
  arrests: Array<Arrest>
  customSchema?: Maybe<CustomSchema>
  customSchemata: Array<CustomSchema>
  /** Search arrests within a date range for docket sheet generation */
  docketSheetSearch: Array<Maybe<Arrest>>
  /** Filter arrests using flexible criteria */
  filterArrests: Array<Maybe<Arrest>>
  log?: Maybe<Log>
  logs: Array<Log>
  optionSet?: Maybe<OptionSet>
  optionSetValue?: Maybe<OptionSetValue>
  optionSetValues: Array<OptionSetValue>
  optionSets: Array<OptionSet>
  /** Fetches the Redwood root schema. */
  redwood?: Maybe<Redwood>
  searchActions: Array<Action>
  /** Search arrests by name with optional query parameters */
  searchArrests: Array<Arrest>
  searchUsers: Array<User>
  siteSetting?: Maybe<SiteSetting>
  siteSettings?: Maybe<Array<Maybe<SiteSetting>>>
  tableView?: Maybe<TableView>
  tableViews: Array<TableView>
  user?: Maybe<User>
  users: Array<User>
}

/** About the Redwood queries. */
export type QueryActionArgs = {
  id: Scalars['Int']['input']
}

/** About the Redwood queries. */
export type QueryArrestArgs = {
  id: Scalars['Int']['input']
}

/** About the Redwood queries. */
export type QueryArresteeLogsArgs = {
  arrestee_id?: InputMaybe<Scalars['Int']['input']>
}

/** About the Redwood queries. */
export type QueryCustomSchemaArgs = {
  id: Scalars['Int']['input']
}

/** About the Redwood queries. */
export type QueryDocketSheetSearchArgs = {
  date: Scalars['DateTime']['input']
  days: Scalars['Int']['input']
  include_contact?: InputMaybe<Scalars['Boolean']['input']>
  jurisdiction?: InputMaybe<Scalars['String']['input']>
  report_type: Scalars['String']['input']
}

/** About the Redwood queries. */
export type QueryFilterArrestsArgs = {
  filters?: InputMaybe<Array<InputMaybe<GenericFilterInput>>>
}

/** About the Redwood queries. */
export type QueryLogArgs = {
  id: Scalars['Int']['input']
}

/** About the Redwood queries. */
export type QueryLogsArgs = {
  params?: InputMaybe<QueryParams>
}

/** About the Redwood queries. */
export type QueryOptionSetArgs = {
  id: Scalars['Int']['input']
}

/** About the Redwood queries. */
export type QueryOptionSetValueArgs = {
  id: Scalars['Int']['input']
}

/** About the Redwood queries. */
export type QuerySearchActionsArgs = {
  search?: InputMaybe<Scalars['String']['input']>
}

/** About the Redwood queries. */
export type QuerySearchArrestsArgs = {
  action_id?: InputMaybe<Scalars['Int']['input']>
  search?: InputMaybe<Scalars['String']['input']>
}

/** About the Redwood queries. */
export type QuerySearchUsersArgs = {
  search: Scalars['String']['input']
}

/** About the Redwood queries. */
export type QuerySiteSettingArgs = {
  id: Scalars['String']['input']
}

/** About the Redwood queries. */
export type QuerySiteSettingsArgs = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
}

/** About the Redwood queries. */
export type QueryTableViewArgs = {
  id: Scalars['Int']['input']
}

/** About the Redwood queries. */
export type QueryUserArgs = {
  id: Scalars['Int']['input']
}

export type QueryParams = {
  orderBy?: InputMaybe<Scalars['JSON']['input']>
  select?: InputMaybe<Scalars['JSON']['input']>
  skip?: InputMaybe<Scalars['Int']['input']>
  take?: InputMaybe<Scalars['Int']['input']>
  where?: InputMaybe<Scalars['JSON']['input']>
}

/**
 * The RedwoodJS Root Schema
 *
 * Defines details about RedwoodJS such as the current user and version information.
 */
export type Redwood = {
  __typename?: 'Redwood'
  /** The current user. */
  currentUser?: Maybe<Scalars['JSON']['output']>
  /** The version of Prisma. */
  prismaVersion?: Maybe<Scalars['String']['output']>
  /** The version of Redwood. */
  version?: Maybe<Scalars['String']['output']>
}

export type SiteSetting = {
  __typename?: 'SiteSetting'
  description?: Maybe<Scalars['String']['output']>
  id: Scalars['String']['output']
  updated_at?: Maybe<Scalars['DateTime']['output']>
  updated_by?: Maybe<User>
  updated_by_id?: Maybe<Scalars['Int']['output']>
  value: Scalars['JSON']['output']
}

export type TableView = {
  __typename?: 'TableView'
  created_at?: Maybe<Scalars['DateTime']['output']>
  created_by?: Maybe<User>
  created_by_id?: Maybe<Scalars['Int']['output']>
  id: Scalars['Int']['output']
  name: Scalars['String']['output']
  state: Scalars['String']['output']
  type: Scalars['String']['output']
  updated_at?: Maybe<Scalars['DateTime']['output']>
  updated_by?: Maybe<User>
  updated_by_id?: Maybe<Scalars['Int']['output']>
}

export type UpdateActionInput = {
  city?: InputMaybe<Scalars['String']['input']>
  custom_fields?: InputMaybe<Scalars['JSON']['input']>
  description?: InputMaybe<Scalars['String']['input']>
  end_date?: InputMaybe<Scalars['DateTime']['input']>
  jurisdiction?: InputMaybe<Scalars['String']['input']>
  name?: InputMaybe<Scalars['String']['input']>
  start_date?: InputMaybe<Scalars['DateTime']['input']>
}

export type UpdateArrestInput = {
  action_id?: InputMaybe<Scalars['Int']['input']>
  arrest_city?: InputMaybe<Scalars['String']['input']>
  arrestee?: InputMaybe<CreateArresteeInput>
  arrestee_id?: InputMaybe<Scalars['Int']['input']>
  charges?: InputMaybe<Scalars['String']['input']>
  citation_number?: InputMaybe<Scalars['String']['input']>
  created_by_id?: InputMaybe<Scalars['Int']['input']>
  custom_fields?: InputMaybe<Scalars['JSON']['input']>
  date?: InputMaybe<Scalars['DateTime']['input']>
  display_field?: InputMaybe<Scalars['String']['input']>
  jurisdiction?: InputMaybe<Scalars['String']['input']>
  location?: InputMaybe<Scalars['String']['input']>
  search_field?: InputMaybe<Scalars['String']['input']>
  updated_by_id?: InputMaybe<Scalars['Int']['input']>
}

export type UpdateArresteeInput = {
  address?: InputMaybe<Scalars['String']['input']>
  city?: InputMaybe<Scalars['String']['input']>
  created_by_id?: InputMaybe<Scalars['Int']['input']>
  custom_fields?: InputMaybe<Scalars['JSON']['input']>
  display_field?: InputMaybe<Scalars['String']['input']>
  dob?: InputMaybe<Scalars['DateTime']['input']>
  email?: InputMaybe<Scalars['String']['input']>
  first_name?: InputMaybe<Scalars['String']['input']>
  last_name?: InputMaybe<Scalars['String']['input']>
  notes?: InputMaybe<Scalars['String']['input']>
  phone_1?: InputMaybe<Scalars['String']['input']>
  phone_2?: InputMaybe<Scalars['String']['input']>
  preferred_name?: InputMaybe<Scalars['String']['input']>
  pronoun?: InputMaybe<Scalars['String']['input']>
  search_field?: InputMaybe<Scalars['String']['input']>
  state?: InputMaybe<Scalars['String']['input']>
  updated_by_id?: InputMaybe<Scalars['Int']['input']>
  zip?: InputMaybe<Scalars['String']['input']>
}

export type UpdateCustomSchemaInput = {
  schema?: InputMaybe<Scalars['JSON']['input']>
  section?: InputMaybe<Scalars['String']['input']>
  table?: InputMaybe<Scalars['String']['input']>
  updated_by_id?: InputMaybe<Scalars['Int']['input']>
}

export type UpdateLogInput = {
  action_id?: InputMaybe<Scalars['Int']['input']>
  arrests?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  created_by_id?: InputMaybe<Scalars['Int']['input']>
  custom_fields?: InputMaybe<Scalars['JSON']['input']>
  needs_followup?: InputMaybe<Scalars['Boolean']['input']>
  notes?: InputMaybe<Scalars['String']['input']>
  time?: InputMaybe<Scalars['DateTime']['input']>
  type?: InputMaybe<Scalars['String']['input']>
  updated_by_id?: InputMaybe<Scalars['Int']['input']>
}

export type UpdateOptionSetInput = {
  name?: InputMaybe<Scalars['String']['input']>
  values: Array<InputMaybe<CreateOptionSetValueInput>>
}

export type UpdateOptionSetValueInput = {
  label?: InputMaybe<Scalars['String']['input']>
  option_set_id?: InputMaybe<Scalars['Int']['input']>
  value?: InputMaybe<Scalars['String']['input']>
}

export type UpdateSiteSettingInput = {
  description?: InputMaybe<Scalars['String']['input']>
  value: Scalars['JSON']['input']
}

export type UpdateTableViewInput = {
  created_at?: InputMaybe<Scalars['DateTime']['input']>
  created_by_id?: InputMaybe<Scalars['Int']['input']>
  name?: InputMaybe<Scalars['String']['input']>
  state?: InputMaybe<Scalars['String']['input']>
  type?: InputMaybe<Scalars['String']['input']>
  updated_at?: InputMaybe<Scalars['DateTime']['input']>
  updated_by_id?: InputMaybe<Scalars['Int']['input']>
}

export type UpdateUserInput = {
  action_ids?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>
  arrest_date_max?: InputMaybe<Scalars['DateTime']['input']>
  arrest_date_min?: InputMaybe<Scalars['DateTime']['input']>
  arrest_date_threshold?: InputMaybe<Scalars['Int']['input']>
  custom_fields?: InputMaybe<Scalars['JSON']['input']>
  email?: InputMaybe<Scalars['String']['input']>
  expiresAt?: InputMaybe<Scalars['DateTime']['input']>
  name?: InputMaybe<Scalars['String']['input']>
  role?: InputMaybe<Scalars['String']['input']>
}

export type UpsertSiteSettingInput = {
  description?: InputMaybe<Scalars['String']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  value: Scalars['JSON']['input']
}

export type User = {
  __typename?: 'User'
  action_ids?: Maybe<Array<Maybe<Scalars['Int']['output']>>>
  actions: Array<Maybe<Action>>
  arrest_date_max?: Maybe<Scalars['DateTime']['output']>
  arrest_date_min?: Maybe<Scalars['DateTime']['output']>
  arrest_date_threshold?: Maybe<Scalars['Int']['output']>
  created_arrestee_logs: Array<Maybe<Log>>
  created_arrestees: Array<Maybe<Arrestee>>
  created_arrests: Array<Maybe<Arrest>>
  created_table_views: Array<Maybe<TableView>>
  custom_fields?: Maybe<Scalars['JSON']['output']>
  email: Scalars['String']['output']
  expiresAt?: Maybe<Scalars['DateTime']['output']>
  id: Scalars['Int']['output']
  name: Scalars['String']['output']
  role: Scalars['String']['output']
  updated_arrestee_logs: Array<Maybe<Log>>
  updated_arrestees: Array<Maybe<Arrestee>>
  updated_arrests: Array<Maybe<Arrest>>
  updated_custom_schemas: Array<Maybe<CustomSchema>>
  updated_table_views: Array<Maybe<TableView>>
}

export type ResolverTypeWrapper<T> = Promise<T> | T

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>
}
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {},
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>

export type NextResolverFn<T> = () => Promise<T>

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {},
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Action: ResolverTypeWrapper<Action>
  Arrest: ResolverTypeWrapper<Arrest>
  Arrestee: ResolverTypeWrapper<Arrestee>
  BatchPayload: ResolverTypeWrapper<BatchPayload>
  BigInt: ResolverTypeWrapper<Scalars['BigInt']['output']>
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>
  Byte: ResolverTypeWrapper<Scalars['Byte']['output']>
  CreateActionInput: CreateActionInput
  CreateArrestInput: CreateArrestInput
  CreateArresteeInput: CreateArresteeInput
  CreateCustomSchemaInput: CreateCustomSchemaInput
  CreateLogInput: CreateLogInput
  CreateOptionSetInput: CreateOptionSetInput
  CreateOptionSetInputValueInput: CreateOptionSetInputValueInput
  CreateOptionSetValueInput: CreateOptionSetValueInput
  CreateSiteSettingInput: CreateSiteSettingInput
  CreateTableViewInput: CreateTableViewInput
  CreateUserInput: CreateUserInput
  CustomSchema: ResolverTypeWrapper<CustomSchema>
  Date: ResolverTypeWrapper<Scalars['Date']['output']>
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>
  File: ResolverTypeWrapper<Scalars['File']['output']>
  GenericFilterInput: GenericFilterInput
  Int: ResolverTypeWrapper<Scalars['Int']['output']>
  JSON: ResolverTypeWrapper<Scalars['JSON']['output']>
  JSONObject: ResolverTypeWrapper<Scalars['JSONObject']['output']>
  Log: ResolverTypeWrapper<Log>
  Mutation: ResolverTypeWrapper<{}>
  OptionSet: ResolverTypeWrapper<OptionSet>
  OptionSetValue: ResolverTypeWrapper<OptionSetValue>
  Query: ResolverTypeWrapper<{}>
  QueryParams: QueryParams
  Redwood: ResolverTypeWrapper<Redwood>
  SiteSetting: ResolverTypeWrapper<SiteSetting>
  String: ResolverTypeWrapper<Scalars['String']['output']>
  TableView: ResolverTypeWrapper<TableView>
  Time: ResolverTypeWrapper<Scalars['Time']['output']>
  UpdateActionInput: UpdateActionInput
  UpdateArrestInput: UpdateArrestInput
  UpdateArresteeInput: UpdateArresteeInput
  UpdateCustomSchemaInput: UpdateCustomSchemaInput
  UpdateLogInput: UpdateLogInput
  UpdateOptionSetInput: UpdateOptionSetInput
  UpdateOptionSetValueInput: UpdateOptionSetValueInput
  UpdateSiteSettingInput: UpdateSiteSettingInput
  UpdateTableViewInput: UpdateTableViewInput
  UpdateUserInput: UpdateUserInput
  UpsertSiteSettingInput: UpsertSiteSettingInput
  User: ResolverTypeWrapper<User>
}

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Action: Action
  Arrest: Arrest
  Arrestee: Arrestee
  BatchPayload: BatchPayload
  BigInt: Scalars['BigInt']['output']
  Boolean: Scalars['Boolean']['output']
  Byte: Scalars['Byte']['output']
  CreateActionInput: CreateActionInput
  CreateArrestInput: CreateArrestInput
  CreateArresteeInput: CreateArresteeInput
  CreateCustomSchemaInput: CreateCustomSchemaInput
  CreateLogInput: CreateLogInput
  CreateOptionSetInput: CreateOptionSetInput
  CreateOptionSetInputValueInput: CreateOptionSetInputValueInput
  CreateOptionSetValueInput: CreateOptionSetValueInput
  CreateSiteSettingInput: CreateSiteSettingInput
  CreateTableViewInput: CreateTableViewInput
  CreateUserInput: CreateUserInput
  CustomSchema: CustomSchema
  Date: Scalars['Date']['output']
  DateTime: Scalars['DateTime']['output']
  File: Scalars['File']['output']
  GenericFilterInput: GenericFilterInput
  Int: Scalars['Int']['output']
  JSON: Scalars['JSON']['output']
  JSONObject: Scalars['JSONObject']['output']
  Log: Log
  Mutation: {}
  OptionSet: OptionSet
  OptionSetValue: OptionSetValue
  Query: {}
  QueryParams: QueryParams
  Redwood: Redwood
  SiteSetting: SiteSetting
  String: Scalars['String']['output']
  TableView: TableView
  Time: Scalars['Time']['output']
  UpdateActionInput: UpdateActionInput
  UpdateArrestInput: UpdateArrestInput
  UpdateArresteeInput: UpdateArresteeInput
  UpdateCustomSchemaInput: UpdateCustomSchemaInput
  UpdateLogInput: UpdateLogInput
  UpdateOptionSetInput: UpdateOptionSetInput
  UpdateOptionSetValueInput: UpdateOptionSetValueInput
  UpdateSiteSettingInput: UpdateSiteSettingInput
  UpdateTableViewInput: UpdateTableViewInput
  UpdateUserInput: UpdateUserInput
  UpsertSiteSettingInput: UpsertSiteSettingInput
  User: User
}

export type LiveDirectiveArgs = {
  if?: Maybe<Scalars['Boolean']['input']>
  throttle?: Maybe<Scalars['Int']['input']>
}

export type LiveDirectiveResolver<
  Result,
  Parent,
  ContextType = any,
  Args = LiveDirectiveArgs,
> = DirectiveResolverFn<Result, Parent, ContextType, Args>

export type RequireAuthDirectiveArgs = {
  roles?: Maybe<Array<Maybe<Scalars['String']['input']>>>
}

export type RequireAuthDirectiveResolver<
  Result,
  Parent,
  ContextType = any,
  Args = RequireAuthDirectiveArgs,
> = DirectiveResolverFn<Result, Parent, ContextType, Args>

export type SkipAuthDirectiveArgs = {}

export type SkipAuthDirectiveResolver<
  Result,
  Parent,
  ContextType = any,
  Args = SkipAuthDirectiveArgs,
> = DirectiveResolverFn<Result, Parent, ContextType, Args>

export type ActionResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Action'] = ResolversParentTypes['Action'],
> = {
  Arrest?: Resolver<
    Array<Maybe<ResolversTypes['Arrest']>>,
    ParentType,
    ContextType
  >
  city?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  custom_fields?: Resolver<
    Maybe<ResolversTypes['JSON']>,
    ParentType,
    ContextType
  >
  description?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  end_date?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  jurisdiction?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  start_date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ArrestResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Arrest'] = ResolversParentTypes['Arrest'],
> = {
  action?: Resolver<Maybe<ResolversTypes['Action']>, ParentType, ContextType>
  action_id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  arrest_city?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  arrestee?: Resolver<
    Maybe<ResolversTypes['Arrestee']>,
    ParentType,
    ContextType
  >
  arrestee_id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  charges?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  citation_number?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  created_at?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >
  created_by?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>
  created_by_id?: Resolver<
    Maybe<ResolversTypes['Int']>,
    ParentType,
    ContextType
  >
  custom_fields?: Resolver<
    Maybe<ResolversTypes['JSON']>,
    ParentType,
    ContextType
  >
  date?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  display_field?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  jurisdiction?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  location?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  search_field?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  updated_at?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >
  updated_by?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>
  updated_by_id?: Resolver<
    Maybe<ResolversTypes['Int']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ArresteeResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Arrestee'] = ResolversParentTypes['Arrestee'],
> = {
  address?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  arrestee_logs?: Resolver<
    Array<Maybe<ResolversTypes['Log']>>,
    ParentType,
    ContextType
  >
  arrests?: Resolver<
    Array<Maybe<ResolversTypes['Arrest']>>,
    ParentType,
    ContextType
  >
  city?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  created_at?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >
  created_by?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>
  created_by_id?: Resolver<
    Maybe<ResolversTypes['Int']>,
    ParentType,
    ContextType
  >
  custom_fields?: Resolver<
    Maybe<ResolversTypes['JSON']>,
    ParentType,
    ContextType
  >
  display_field?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  dob?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  first_name?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  last_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  phone_1?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  phone_2?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  preferred_name?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  pronoun?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  search_display_field?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  search_field?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  state?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  updated_at?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >
  updated_by?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>
  updated_by_id?: Resolver<
    Maybe<ResolversTypes['Int']>,
    ParentType,
    ContextType
  >
  zip?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type BatchPayloadResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['BatchPayload'] = ResolversParentTypes['BatchPayload'],
> = {
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export interface BigIntScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['BigInt'], any> {
  name: 'BigInt'
}

export interface ByteScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['Byte'], any> {
  name: 'Byte'
}

export type CustomSchemaResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['CustomSchema'] = ResolversParentTypes['CustomSchema'],
> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  schema?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>
  section?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  table?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  updated_at?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >
  updated_by?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>
  updated_by_id?: Resolver<
    Maybe<ResolversTypes['Int']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export interface DateScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date'
}

export interface DateTimeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime'
}

export interface FileScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['File'], any> {
  name: 'File'
}

export interface JsonScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON'
}

export interface JsonObjectScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['JSONObject'], any> {
  name: 'JSONObject'
}

export type LogResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Log'] = ResolversParentTypes['Log'],
> = {
  action?: Resolver<Maybe<ResolversTypes['Action']>, ParentType, ContextType>
  action_id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  arrests?: Resolver<
    Array<Maybe<ResolversTypes['Arrest']>>,
    ParentType,
    ContextType
  >
  created_at?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >
  created_by?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>
  created_by_id?: Resolver<
    Maybe<ResolversTypes['Int']>,
    ParentType,
    ContextType
  >
  custom_fields?: Resolver<
    Maybe<ResolversTypes['JSON']>,
    ParentType,
    ContextType
  >
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  needs_followup?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  time?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  updated_at?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >
  updated_by?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>
  updated_by_id?: Resolver<
    Maybe<ResolversTypes['Int']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type MutationResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation'],
> = {
  bulkDeleteArrests?: Resolver<
    Maybe<ResolversTypes['BatchPayload']>,
    ParentType,
    ContextType,
    RequireFields<MutationBulkDeleteArrestsArgs, 'ids'>
  >
  bulkUpdateArrests?: Resolver<
    Maybe<ResolversTypes['BatchPayload']>,
    ParentType,
    ContextType,
    RequireFields<MutationBulkUpdateArrestsArgs, 'ids'>
  >
  bulkUpdateUsers?: Resolver<
    Maybe<ResolversTypes['BatchPayload']>,
    ParentType,
    ContextType,
    RequireFields<MutationBulkUpdateUsersArgs, 'ids'>
  >
  bulkUpsertSiteSetting?: Resolver<
    Array<Maybe<ResolversTypes['SiteSetting']>>,
    ParentType,
    ContextType,
    RequireFields<MutationBulkUpsertSiteSettingArgs, 'input'>
  >
  createAction?: Resolver<
    ResolversTypes['Action'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateActionArgs, 'input'>
  >
  createArrest?: Resolver<
    ResolversTypes['Arrest'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateArrestArgs, 'input'>
  >
  createCustomSchema?: Resolver<
    ResolversTypes['CustomSchema'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateCustomSchemaArgs, 'input'>
  >
  createLog?: Resolver<
    ResolversTypes['Log'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateLogArgs, 'input'>
  >
  createOptionSet?: Resolver<
    ResolversTypes['OptionSet'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateOptionSetArgs, 'input'>
  >
  createOptionSetValue?: Resolver<
    ResolversTypes['OptionSetValue'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateOptionSetValueArgs, 'input'>
  >
  createSiteSetting?: Resolver<
    ResolversTypes['SiteSetting'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateSiteSettingArgs, 'input'>
  >
  createTableView?: Resolver<
    ResolversTypes['TableView'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateTableViewArgs, 'input'>
  >
  createUser?: Resolver<
    ResolversTypes['User'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateUserArgs, 'input'>
  >
  deleteAction?: Resolver<
    ResolversTypes['Action'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteActionArgs, 'id'>
  >
  deleteArrest?: Resolver<
    ResolversTypes['Arrest'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteArrestArgs, 'id'>
  >
  deleteCustomSchema?: Resolver<
    ResolversTypes['CustomSchema'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteCustomSchemaArgs, 'id'>
  >
  deleteLog?: Resolver<
    ResolversTypes['Log'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteLogArgs, 'id'>
  >
  deleteOptionSet?: Resolver<
    ResolversTypes['OptionSet'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteOptionSetArgs, 'id'>
  >
  deleteOptionSetValue?: Resolver<
    ResolversTypes['OptionSetValue'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteOptionSetValueArgs, 'id'>
  >
  deleteSiteSetting?: Resolver<
    ResolversTypes['SiteSetting'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteSiteSettingArgs, 'id'>
  >
  deleteTableView?: Resolver<
    ResolversTypes['TableView'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteTableViewArgs, 'id'>
  >
  deleteUser?: Resolver<
    ResolversTypes['User'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteUserArgs, 'id'>
  >
  updateAction?: Resolver<
    ResolversTypes['Action'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateActionArgs, 'id' | 'input'>
  >
  updateArrest?: Resolver<
    ResolversTypes['Arrest'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateArrestArgs, 'id' | 'input'>
  >
  updateCustomSchema?: Resolver<
    ResolversTypes['CustomSchema'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateCustomSchemaArgs, 'id' | 'input'>
  >
  updateLog?: Resolver<
    ResolversTypes['Log'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateLogArgs, 'id' | 'input'>
  >
  updateOptionSet?: Resolver<
    ResolversTypes['OptionSet'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateOptionSetArgs, 'id' | 'input'>
  >
  updateOptionSetValue?: Resolver<
    ResolversTypes['OptionSetValue'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateOptionSetValueArgs, 'id' | 'input'>
  >
  updateSiteSetting?: Resolver<
    ResolversTypes['SiteSetting'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateSiteSettingArgs, 'id' | 'input'>
  >
  updateTableView?: Resolver<
    ResolversTypes['TableView'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateTableViewArgs, 'id' | 'input'>
  >
  updateUser?: Resolver<
    ResolversTypes['User'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateUserArgs, 'id' | 'input'>
  >
  upsertSiteSetting?: Resolver<
    ResolversTypes['SiteSetting'],
    ParentType,
    ContextType,
    RequireFields<MutationUpsertSiteSettingArgs, 'input'>
  >
}

export type OptionSetResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['OptionSet'] = ResolversParentTypes['OptionSet'],
> = {
  description?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  values?: Resolver<
    Array<Maybe<ResolversTypes['OptionSetValue']>>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type OptionSetValueResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['OptionSetValue'] = ResolversParentTypes['OptionSetValue'],
> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  option_set_details?: Resolver<
    ResolversTypes['OptionSet'],
    ParentType,
    ContextType
  >
  option_set_id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type QueryResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Query'] = ResolversParentTypes['Query'],
> = {
  action?: Resolver<
    Maybe<ResolversTypes['Action']>,
    ParentType,
    ContextType,
    RequireFields<QueryActionArgs, 'id'>
  >
  actions?: Resolver<Array<ResolversTypes['Action']>, ParentType, ContextType>
  arrest?: Resolver<
    Maybe<ResolversTypes['Arrest']>,
    ParentType,
    ContextType,
    RequireFields<QueryArrestArgs, 'id'>
  >
  arresteeLogs?: Resolver<
    Array<ResolversTypes['Log']>,
    ParentType,
    ContextType,
    Partial<QueryArresteeLogsArgs>
  >
  arrests?: Resolver<Array<ResolversTypes['Arrest']>, ParentType, ContextType>
  customSchema?: Resolver<
    Maybe<ResolversTypes['CustomSchema']>,
    ParentType,
    ContextType,
    RequireFields<QueryCustomSchemaArgs, 'id'>
  >
  customSchemata?: Resolver<
    Array<ResolversTypes['CustomSchema']>,
    ParentType,
    ContextType
  >
  docketSheetSearch?: Resolver<
    Array<Maybe<ResolversTypes['Arrest']>>,
    ParentType,
    ContextType,
    RequireFields<QueryDocketSheetSearchArgs, 'date' | 'days' | 'report_type'>
  >
  filterArrests?: Resolver<
    Array<Maybe<ResolversTypes['Arrest']>>,
    ParentType,
    ContextType,
    Partial<QueryFilterArrestsArgs>
  >
  log?: Resolver<
    Maybe<ResolversTypes['Log']>,
    ParentType,
    ContextType,
    RequireFields<QueryLogArgs, 'id'>
  >
  logs?: Resolver<
    Array<ResolversTypes['Log']>,
    ParentType,
    ContextType,
    Partial<QueryLogsArgs>
  >
  optionSet?: Resolver<
    Maybe<ResolversTypes['OptionSet']>,
    ParentType,
    ContextType,
    RequireFields<QueryOptionSetArgs, 'id'>
  >
  optionSetValue?: Resolver<
    Maybe<ResolversTypes['OptionSetValue']>,
    ParentType,
    ContextType,
    RequireFields<QueryOptionSetValueArgs, 'id'>
  >
  optionSetValues?: Resolver<
    Array<ResolversTypes['OptionSetValue']>,
    ParentType,
    ContextType
  >
  optionSets?: Resolver<
    Array<ResolversTypes['OptionSet']>,
    ParentType,
    ContextType
  >
  redwood?: Resolver<Maybe<ResolversTypes['Redwood']>, ParentType, ContextType>
  searchActions?: Resolver<
    Array<ResolversTypes['Action']>,
    ParentType,
    ContextType,
    Partial<QuerySearchActionsArgs>
  >
  searchArrests?: Resolver<
    Array<ResolversTypes['Arrest']>,
    ParentType,
    ContextType,
    Partial<QuerySearchArrestsArgs>
  >
  searchUsers?: Resolver<
    Array<ResolversTypes['User']>,
    ParentType,
    ContextType,
    RequireFields<QuerySearchUsersArgs, 'search'>
  >
  siteSetting?: Resolver<
    Maybe<ResolversTypes['SiteSetting']>,
    ParentType,
    ContextType,
    RequireFields<QuerySiteSettingArgs, 'id'>
  >
  siteSettings?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['SiteSetting']>>>,
    ParentType,
    ContextType,
    Partial<QuerySiteSettingsArgs>
  >
  tableView?: Resolver<
    Maybe<ResolversTypes['TableView']>,
    ParentType,
    ContextType,
    RequireFields<QueryTableViewArgs, 'id'>
  >
  tableViews?: Resolver<
    Array<ResolversTypes['TableView']>,
    ParentType,
    ContextType
  >
  user?: Resolver<
    Maybe<ResolversTypes['User']>,
    ParentType,
    ContextType,
    RequireFields<QueryUserArgs, 'id'>
  >
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>
}

export type RedwoodResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['Redwood'] = ResolversParentTypes['Redwood'],
> = {
  currentUser?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>
  prismaVersion?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  version?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type SiteSettingResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['SiteSetting'] = ResolversParentTypes['SiteSetting'],
> = {
  description?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  updated_at?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >
  updated_by?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>
  updated_by_id?: Resolver<
    Maybe<ResolversTypes['Int']>,
    ParentType,
    ContextType
  >
  value?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type TableViewResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['TableView'] = ResolversParentTypes['TableView'],
> = {
  created_at?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >
  created_by?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>
  created_by_id?: Resolver<
    Maybe<ResolversTypes['Int']>,
    ParentType,
    ContextType
  >
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  state?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  updated_at?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >
  updated_by?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>
  updated_by_id?: Resolver<
    Maybe<ResolversTypes['Int']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export interface TimeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['Time'], any> {
  name: 'Time'
}

export type UserResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes['User'] = ResolversParentTypes['User'],
> = {
  action_ids?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['Int']>>>,
    ParentType,
    ContextType
  >
  actions?: Resolver<
    Array<Maybe<ResolversTypes['Action']>>,
    ParentType,
    ContextType
  >
  arrest_date_max?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >
  arrest_date_min?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >
  arrest_date_threshold?: Resolver<
    Maybe<ResolversTypes['Int']>,
    ParentType,
    ContextType
  >
  created_arrestee_logs?: Resolver<
    Array<Maybe<ResolversTypes['Log']>>,
    ParentType,
    ContextType
  >
  created_arrestees?: Resolver<
    Array<Maybe<ResolversTypes['Arrestee']>>,
    ParentType,
    ContextType
  >
  created_arrests?: Resolver<
    Array<Maybe<ResolversTypes['Arrest']>>,
    ParentType,
    ContextType
  >
  created_table_views?: Resolver<
    Array<Maybe<ResolversTypes['TableView']>>,
    ParentType,
    ContextType
  >
  custom_fields?: Resolver<
    Maybe<ResolversTypes['JSON']>,
    ParentType,
    ContextType
  >
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  expiresAt?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  role?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  updated_arrestee_logs?: Resolver<
    Array<Maybe<ResolversTypes['Log']>>,
    ParentType,
    ContextType
  >
  updated_arrestees?: Resolver<
    Array<Maybe<ResolversTypes['Arrestee']>>,
    ParentType,
    ContextType
  >
  updated_arrests?: Resolver<
    Array<Maybe<ResolversTypes['Arrest']>>,
    ParentType,
    ContextType
  >
  updated_custom_schemas?: Resolver<
    Array<Maybe<ResolversTypes['CustomSchema']>>,
    ParentType,
    ContextType
  >
  updated_table_views?: Resolver<
    Array<Maybe<ResolversTypes['TableView']>>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type Resolvers<ContextType = any> = {
  Action?: ActionResolvers<ContextType>
  Arrest?: ArrestResolvers<ContextType>
  Arrestee?: ArresteeResolvers<ContextType>
  BatchPayload?: BatchPayloadResolvers<ContextType>
  BigInt?: GraphQLScalarType
  Byte?: GraphQLScalarType
  CustomSchema?: CustomSchemaResolvers<ContextType>
  Date?: GraphQLScalarType
  DateTime?: GraphQLScalarType
  File?: GraphQLScalarType
  JSON?: GraphQLScalarType
  JSONObject?: GraphQLScalarType
  Log?: LogResolvers<ContextType>
  Mutation?: MutationResolvers<ContextType>
  OptionSet?: OptionSetResolvers<ContextType>
  OptionSetValue?: OptionSetValueResolvers<ContextType>
  Query?: QueryResolvers<ContextType>
  Redwood?: RedwoodResolvers<ContextType>
  SiteSetting?: SiteSettingResolvers<ContextType>
  TableView?: TableViewResolvers<ContextType>
  Time?: GraphQLScalarType
  User?: UserResolvers<ContextType>
}

export type DirectiveResolvers<ContextType = any> = {
  live?: LiveDirectiveResolver<any, any, ContextType>
  requireAuth?: RequireAuthDirectiveResolver<any, any, ContextType>
  skipAuth?: SkipAuthDirectiveResolver<any, any, ContextType>
}

export const anAction = (
  overrides?: Partial<Action>,
  _relationshipsToOmit: Set<string> = new Set()
): { __typename: 'Action' } & Action => {
  const relationshipsToOmit: Set<string> = new Set(_relationshipsToOmit)
  relationshipsToOmit.add('Action')
  return {
    __typename: 'Action',
    Arrest:
      overrides && overrides.hasOwnProperty('Arrest')
        ? overrides.Arrest!
        : [
            relationshipsToOmit.has('Arrest')
              ? ({} as Arrest)
              : anArrest({}, relationshipsToOmit),
          ],
    city:
      overrides && overrides.hasOwnProperty('city')
        ? overrides.city!
        : 'cognatus',
    custom_fields:
      overrides && overrides.hasOwnProperty('custom_fields')
        ? overrides.custom_fields!
        : 'nulla',
    description:
      overrides && overrides.hasOwnProperty('description')
        ? overrides.description!
        : 'thymum',
    end_date:
      overrides && overrides.hasOwnProperty('end_date')
        ? overrides.end_date!
        : 'acer',
    id: overrides && overrides.hasOwnProperty('id') ? overrides.id! : 8775,
    jurisdiction:
      overrides && overrides.hasOwnProperty('jurisdiction')
        ? overrides.jurisdiction!
        : 'omnis',
    name:
      overrides && overrides.hasOwnProperty('name')
        ? overrides.name!
        : 'coadunatio',
    start_date:
      overrides && overrides.hasOwnProperty('start_date')
        ? overrides.start_date!
        : 'socius',
  }
}

export const anArrest = (
  overrides?: Partial<Arrest>,
  _relationshipsToOmit: Set<string> = new Set()
): { __typename: 'Arrest' } & Arrest => {
  const relationshipsToOmit: Set<string> = new Set(_relationshipsToOmit)
  relationshipsToOmit.add('Arrest')
  return {
    __typename: 'Arrest',
    action:
      overrides && overrides.hasOwnProperty('action')
        ? overrides.action!
        : relationshipsToOmit.has('Action')
          ? ({} as Action)
          : anAction({}, relationshipsToOmit),
    action_id:
      overrides && overrides.hasOwnProperty('action_id')
        ? overrides.action_id!
        : 787,
    arrest_city:
      overrides && overrides.hasOwnProperty('arrest_city')
        ? overrides.arrest_city!
        : 'amaritudo',
    arrestee:
      overrides && overrides.hasOwnProperty('arrestee')
        ? overrides.arrestee!
        : relationshipsToOmit.has('Arrestee')
          ? ({} as Arrestee)
          : anArrestee({}, relationshipsToOmit),
    arrestee_id:
      overrides && overrides.hasOwnProperty('arrestee_id')
        ? overrides.arrestee_id!
        : 1165,
    charges:
      overrides && overrides.hasOwnProperty('charges')
        ? overrides.charges!
        : 'defaeco',
    citation_number:
      overrides && overrides.hasOwnProperty('citation_number')
        ? overrides.citation_number!
        : 'utroque',
    created_at:
      overrides && overrides.hasOwnProperty('created_at')
        ? overrides.created_at!
        : 'aggero',
    created_by:
      overrides && overrides.hasOwnProperty('created_by')
        ? overrides.created_by!
        : relationshipsToOmit.has('User')
          ? ({} as User)
          : aUser({}, relationshipsToOmit),
    created_by_id:
      overrides && overrides.hasOwnProperty('created_by_id')
        ? overrides.created_by_id!
        : 1059,
    custom_fields:
      overrides && overrides.hasOwnProperty('custom_fields')
        ? overrides.custom_fields!
        : 'arbustum',
    date:
      overrides && overrides.hasOwnProperty('date')
        ? overrides.date!
        : 'accedo',
    display_field:
      overrides && overrides.hasOwnProperty('display_field')
        ? overrides.display_field!
        : 'quia',
    id: overrides && overrides.hasOwnProperty('id') ? overrides.id! : 9081,
    jurisdiction:
      overrides && overrides.hasOwnProperty('jurisdiction')
        ? overrides.jurisdiction!
        : 'tempus',
    location:
      overrides && overrides.hasOwnProperty('location')
        ? overrides.location!
        : 'suggero',
    search_field:
      overrides && overrides.hasOwnProperty('search_field')
        ? overrides.search_field!
        : 'deleniti',
    updated_at:
      overrides && overrides.hasOwnProperty('updated_at')
        ? overrides.updated_at!
        : 'totus',
    updated_by:
      overrides && overrides.hasOwnProperty('updated_by')
        ? overrides.updated_by!
        : relationshipsToOmit.has('User')
          ? ({} as User)
          : aUser({}, relationshipsToOmit),
    updated_by_id:
      overrides && overrides.hasOwnProperty('updated_by_id')
        ? overrides.updated_by_id!
        : 8500,
  }
}

export const anArrestee = (
  overrides?: Partial<Arrestee>,
  _relationshipsToOmit: Set<string> = new Set()
): { __typename: 'Arrestee' } & Arrestee => {
  const relationshipsToOmit: Set<string> = new Set(_relationshipsToOmit)
  relationshipsToOmit.add('Arrestee')
  return {
    __typename: 'Arrestee',
    address:
      overrides && overrides.hasOwnProperty('address')
        ? overrides.address!
        : 'arguo',
    arrestee_logs:
      overrides && overrides.hasOwnProperty('arrestee_logs')
        ? overrides.arrestee_logs!
        : [
            relationshipsToOmit.has('Log')
              ? ({} as Log)
              : aLog({}, relationshipsToOmit),
          ],
    arrests:
      overrides && overrides.hasOwnProperty('arrests')
        ? overrides.arrests!
        : [
            relationshipsToOmit.has('Arrest')
              ? ({} as Arrest)
              : anArrest({}, relationshipsToOmit),
          ],
    city:
      overrides && overrides.hasOwnProperty('city') ? overrides.city! : 'tenax',
    created_at:
      overrides && overrides.hasOwnProperty('created_at')
        ? overrides.created_at!
        : 'vindico',
    created_by:
      overrides && overrides.hasOwnProperty('created_by')
        ? overrides.created_by!
        : relationshipsToOmit.has('User')
          ? ({} as User)
          : aUser({}, relationshipsToOmit),
    created_by_id:
      overrides && overrides.hasOwnProperty('created_by_id')
        ? overrides.created_by_id!
        : 343,
    custom_fields:
      overrides && overrides.hasOwnProperty('custom_fields')
        ? overrides.custom_fields!
        : 'considero',
    display_field:
      overrides && overrides.hasOwnProperty('display_field')
        ? overrides.display_field!
        : 'quidem',
    dob:
      overrides && overrides.hasOwnProperty('dob') ? overrides.dob! : 'vesco',
    email:
      overrides && overrides.hasOwnProperty('email')
        ? overrides.email!
        : 'nobis',
    first_name:
      overrides && overrides.hasOwnProperty('first_name')
        ? overrides.first_name!
        : 'decumbo',
    id: overrides && overrides.hasOwnProperty('id') ? overrides.id! : 8257,
    last_name:
      overrides && overrides.hasOwnProperty('last_name')
        ? overrides.last_name!
        : 'ventito',
    notes:
      overrides && overrides.hasOwnProperty('notes')
        ? overrides.notes!
        : 'vomica',
    phone_1:
      overrides && overrides.hasOwnProperty('phone_1')
        ? overrides.phone_1!
        : 'trucido',
    phone_2:
      overrides && overrides.hasOwnProperty('phone_2')
        ? overrides.phone_2!
        : 'alius',
    preferred_name:
      overrides && overrides.hasOwnProperty('preferred_name')
        ? overrides.preferred_name!
        : 'provident',
    pronoun:
      overrides && overrides.hasOwnProperty('pronoun')
        ? overrides.pronoun!
        : 'excepturi',
    search_display_field:
      overrides && overrides.hasOwnProperty('search_display_field')
        ? overrides.search_display_field!
        : 'dolore',
    search_field:
      overrides && overrides.hasOwnProperty('search_field')
        ? overrides.search_field!
        : 'conturbo',
    state:
      overrides && overrides.hasOwnProperty('state')
        ? overrides.state!
        : 'tergiversatio',
    updated_at:
      overrides && overrides.hasOwnProperty('updated_at')
        ? overrides.updated_at!
        : 'confido',
    updated_by:
      overrides && overrides.hasOwnProperty('updated_by')
        ? overrides.updated_by!
        : relationshipsToOmit.has('User')
          ? ({} as User)
          : aUser({}, relationshipsToOmit),
    updated_by_id:
      overrides && overrides.hasOwnProperty('updated_by_id')
        ? overrides.updated_by_id!
        : 415,
    zip:
      overrides && overrides.hasOwnProperty('zip')
        ? overrides.zip!
        : 'curriculum',
  }
}

export const aBatchPayload = (
  overrides?: Partial<BatchPayload>,
  _relationshipsToOmit: Set<string> = new Set()
): { __typename: 'BatchPayload' } & BatchPayload => {
  const relationshipsToOmit: Set<string> = new Set(_relationshipsToOmit)
  relationshipsToOmit.add('BatchPayload')
  return {
    __typename: 'BatchPayload',
    count:
      overrides && overrides.hasOwnProperty('count') ? overrides.count! : 8933,
  }
}

export const aCreateActionInput = (
  overrides?: Partial<CreateActionInput>,
  _relationshipsToOmit: Set<string> = new Set()
): CreateActionInput => {
  const relationshipsToOmit: Set<string> = new Set(_relationshipsToOmit)
  relationshipsToOmit.add('CreateActionInput')
  return {
    city:
      overrides && overrides.hasOwnProperty('city')
        ? overrides.city!
        : 'accommodo',
    custom_fields:
      overrides && overrides.hasOwnProperty('custom_fields')
        ? overrides.custom_fields!
        : 'assumenda',
    description:
      overrides && overrides.hasOwnProperty('description')
        ? overrides.description!
        : 'advoco',
    end_date:
      overrides && overrides.hasOwnProperty('end_date')
        ? overrides.end_date!
        : 'ustilo',
    jurisdiction:
      overrides && overrides.hasOwnProperty('jurisdiction')
        ? overrides.jurisdiction!
        : 'carus',
    name:
      overrides && overrides.hasOwnProperty('name')
        ? overrides.name!
        : 'tubineus',
    start_date:
      overrides && overrides.hasOwnProperty('start_date')
        ? overrides.start_date!
        : 'temptatio',
  }
}

export const aCreateArrestInput = (
  overrides?: Partial<CreateArrestInput>,
  _relationshipsToOmit: Set<string> = new Set()
): CreateArrestInput => {
  const relationshipsToOmit: Set<string> = new Set(_relationshipsToOmit)
  relationshipsToOmit.add('CreateArrestInput')
  return {
    action_id:
      overrides && overrides.hasOwnProperty('action_id')
        ? overrides.action_id!
        : 1413,
    arrest_city:
      overrides && overrides.hasOwnProperty('arrest_city')
        ? overrides.arrest_city!
        : 'crudelis',
    arrestee:
      overrides && overrides.hasOwnProperty('arrestee')
        ? overrides.arrestee!
        : relationshipsToOmit.has('UpdateArresteeInput')
          ? ({} as UpdateArresteeInput)
          : anUpdateArresteeInput({}, relationshipsToOmit),
    arrestee_id:
      overrides && overrides.hasOwnProperty('arrestee_id')
        ? overrides.arrestee_id!
        : 1262,
    charges:
      overrides && overrides.hasOwnProperty('charges')
        ? overrides.charges!
        : 'iste',
    citation_number:
      overrides && overrides.hasOwnProperty('citation_number')
        ? overrides.citation_number!
        : 'totus',
    created_by_id:
      overrides && overrides.hasOwnProperty('created_by_id')
        ? overrides.created_by_id!
        : 4662,
    custom_fields:
      overrides && overrides.hasOwnProperty('custom_fields')
        ? overrides.custom_fields!
        : 'viscus',
    date:
      overrides && overrides.hasOwnProperty('date')
        ? overrides.date!
        : 'laboriosam',
    display_field:
      overrides && overrides.hasOwnProperty('display_field')
        ? overrides.display_field!
        : 'umerus',
    jurisdiction:
      overrides && overrides.hasOwnProperty('jurisdiction')
        ? overrides.jurisdiction!
        : 'abeo',
    location:
      overrides && overrides.hasOwnProperty('location')
        ? overrides.location!
        : 'admoneo',
    search_field:
      overrides && overrides.hasOwnProperty('search_field')
        ? overrides.search_field!
        : 'sono',
    updated_by_id:
      overrides && overrides.hasOwnProperty('updated_by_id')
        ? overrides.updated_by_id!
        : 5291,
  }
}

export const aCreateArresteeInput = (
  overrides?: Partial<CreateArresteeInput>,
  _relationshipsToOmit: Set<string> = new Set()
): CreateArresteeInput => {
  const relationshipsToOmit: Set<string> = new Set(_relationshipsToOmit)
  relationshipsToOmit.add('CreateArresteeInput')
  return {
    address:
      overrides && overrides.hasOwnProperty('address')
        ? overrides.address!
        : 'viriliter',
    city:
      overrides && overrides.hasOwnProperty('city')
        ? overrides.city!
        : 'tristis',
    created_by_id:
      overrides && overrides.hasOwnProperty('created_by_id')
        ? overrides.created_by_id!
        : 3281,
    custom_fields:
      overrides && overrides.hasOwnProperty('custom_fields')
        ? overrides.custom_fields!
        : 'deorsum',
    display_field:
      overrides && overrides.hasOwnProperty('display_field')
        ? overrides.display_field!
        : 'vox',
    dob:
      overrides && overrides.hasOwnProperty('dob') ? overrides.dob! : 'demitto',
    email:
      overrides && overrides.hasOwnProperty('email')
        ? overrides.email!
        : 'quasi',
    first_name:
      overrides && overrides.hasOwnProperty('first_name')
        ? overrides.first_name!
        : 'uterque',
    last_name:
      overrides && overrides.hasOwnProperty('last_name')
        ? overrides.last_name!
        : 'arcesso',
    notes:
      overrides && overrides.hasOwnProperty('notes')
        ? overrides.notes!
        : 'somniculosus',
    phone_1:
      overrides && overrides.hasOwnProperty('phone_1')
        ? overrides.phone_1!
        : 'fugit',
    phone_2:
      overrides && overrides.hasOwnProperty('phone_2')
        ? overrides.phone_2!
        : 'vociferor',
    preferred_name:
      overrides && overrides.hasOwnProperty('preferred_name')
        ? overrides.preferred_name!
        : 'caute',
    pronoun:
      overrides && overrides.hasOwnProperty('pronoun')
        ? overrides.pronoun!
        : 'commodi',
    search_field:
      overrides && overrides.hasOwnProperty('search_field')
        ? overrides.search_field!
        : 'deduco',
    state:
      overrides && overrides.hasOwnProperty('state')
        ? overrides.state!
        : 'thermae',
    updated_by_id:
      overrides && overrides.hasOwnProperty('updated_by_id')
        ? overrides.updated_by_id!
        : 4990,
    zip:
      overrides && overrides.hasOwnProperty('zip') ? overrides.zip! : 'infit',
  }
}

export const aCreateCustomSchemaInput = (
  overrides?: Partial<CreateCustomSchemaInput>,
  _relationshipsToOmit: Set<string> = new Set()
): CreateCustomSchemaInput => {
  const relationshipsToOmit: Set<string> = new Set(_relationshipsToOmit)
  relationshipsToOmit.add('CreateCustomSchemaInput')
  return {
    schema:
      overrides && overrides.hasOwnProperty('schema')
        ? overrides.schema!
        : 'ars',
    section:
      overrides && overrides.hasOwnProperty('section')
        ? overrides.section!
        : 'brevis',
    table:
      overrides && overrides.hasOwnProperty('table')
        ? overrides.table!
        : 'comptus',
    updated_by_id:
      overrides && overrides.hasOwnProperty('updated_by_id')
        ? overrides.updated_by_id!
        : 639,
  }
}

export const aCreateLogInput = (
  overrides?: Partial<CreateLogInput>,
  _relationshipsToOmit: Set<string> = new Set()
): CreateLogInput => {
  const relationshipsToOmit: Set<string> = new Set(_relationshipsToOmit)
  relationshipsToOmit.add('CreateLogInput')
  return {
    action_id:
      overrides && overrides.hasOwnProperty('action_id')
        ? overrides.action_id!
        : 3519,
    arrests:
      overrides && overrides.hasOwnProperty('arrests')
        ? overrides.arrests!
        : [8520],
    created_by_id:
      overrides && overrides.hasOwnProperty('created_by_id')
        ? overrides.created_by_id!
        : 606,
    custom_fields:
      overrides && overrides.hasOwnProperty('custom_fields')
        ? overrides.custom_fields!
        : 'valde',
    needs_followup:
      overrides && overrides.hasOwnProperty('needs_followup')
        ? overrides.needs_followup!
        : true,
    notes:
      overrides && overrides.hasOwnProperty('notes')
        ? overrides.notes!
        : 'comparo',
    type:
      overrides && overrides.hasOwnProperty('type')
        ? overrides.type!
        : 'blanditiis',
    updated_by_id:
      overrides && overrides.hasOwnProperty('updated_by_id')
        ? overrides.updated_by_id!
        : 4817,
  }
}

export const aCreateOptionSetInput = (
  overrides?: Partial<CreateOptionSetInput>,
  _relationshipsToOmit: Set<string> = new Set()
): CreateOptionSetInput => {
  const relationshipsToOmit: Set<string> = new Set(_relationshipsToOmit)
  relationshipsToOmit.add('CreateOptionSetInput')
  return {
    name:
      overrides && overrides.hasOwnProperty('name')
        ? overrides.name!
        : 'vulpes',
    values:
      overrides && overrides.hasOwnProperty('values')
        ? overrides.values!
        : [
            relationshipsToOmit.has('CreateOptionSetInputValueInput')
              ? ({} as CreateOptionSetInputValueInput)
              : aCreateOptionSetInputValueInput({}, relationshipsToOmit),
          ],
  }
}

export const aCreateOptionSetInputValueInput = (
  overrides?: Partial<CreateOptionSetInputValueInput>,
  _relationshipsToOmit: Set<string> = new Set()
): CreateOptionSetInputValueInput => {
  const relationshipsToOmit: Set<string> = new Set(_relationshipsToOmit)
  relationshipsToOmit.add('CreateOptionSetInputValueInput')
  return {
    label:
      overrides && overrides.hasOwnProperty('label')
        ? overrides.label!
        : 'collum',
    value:
      overrides && overrides.hasOwnProperty('value')
        ? overrides.value!
        : 'caveo',
  }
}

export const aCreateOptionSetValueInput = (
  overrides?: Partial<CreateOptionSetValueInput>,
  _relationshipsToOmit: Set<string> = new Set()
): CreateOptionSetValueInput => {
  const relationshipsToOmit: Set<string> = new Set(_relationshipsToOmit)
  relationshipsToOmit.add('CreateOptionSetValueInput')
  return {
    label:
      overrides && overrides.hasOwnProperty('label')
        ? overrides.label!
        : 'undique',
    option_set_id:
      overrides && overrides.hasOwnProperty('option_set_id')
        ? overrides.option_set_id!
        : 3219,
    value:
      overrides && overrides.hasOwnProperty('value')
        ? overrides.value!
        : 'voro',
  }
}

export const aCreateSiteSettingInput = (
  overrides?: Partial<CreateSiteSettingInput>,
  _relationshipsToOmit: Set<string> = new Set()
): CreateSiteSettingInput => {
  const relationshipsToOmit: Set<string> = new Set(_relationshipsToOmit)
  relationshipsToOmit.add('CreateSiteSettingInput')
  return {
    description:
      overrides && overrides.hasOwnProperty('description')
        ? overrides.description!
        : 'caste',
    id: overrides && overrides.hasOwnProperty('id') ? overrides.id! : 'crur',
    value:
      overrides && overrides.hasOwnProperty('value')
        ? overrides.value!
        : 'cribro',
  }
}

export const aCreateTableViewInput = (
  overrides?: Partial<CreateTableViewInput>,
  _relationshipsToOmit: Set<string> = new Set()
): CreateTableViewInput => {
  const relationshipsToOmit: Set<string> = new Set(_relationshipsToOmit)
  relationshipsToOmit.add('CreateTableViewInput')
  return {
    created_at:
      overrides && overrides.hasOwnProperty('created_at')
        ? overrides.created_at!
        : 'basium',
    created_by_id:
      overrides && overrides.hasOwnProperty('created_by_id')
        ? overrides.created_by_id!
        : 2096,
    name:
      overrides && overrides.hasOwnProperty('name') ? overrides.name! : 'arguo',
    state:
      overrides && overrides.hasOwnProperty('state') ? overrides.state! : 'non',
    type:
      overrides && overrides.hasOwnProperty('type')
        ? overrides.type!
        : 'crudelis',
    updated_at:
      overrides && overrides.hasOwnProperty('updated_at')
        ? overrides.updated_at!
        : 'cupio',
    updated_by_id:
      overrides && overrides.hasOwnProperty('updated_by_id')
        ? overrides.updated_by_id!
        : 9928,
  }
}

export const aCreateUserInput = (
  overrides?: Partial<CreateUserInput>,
  _relationshipsToOmit: Set<string> = new Set()
): CreateUserInput => {
  const relationshipsToOmit: Set<string> = new Set(_relationshipsToOmit)
  relationshipsToOmit.add('CreateUserInput')
  return {
    action_ids:
      overrides && overrides.hasOwnProperty('action_ids')
        ? overrides.action_ids!
        : [7190],
    arrest_date_max:
      overrides && overrides.hasOwnProperty('arrest_date_max')
        ? overrides.arrest_date_max!
        : 'voluptates',
    arrest_date_min:
      overrides && overrides.hasOwnProperty('arrest_date_min')
        ? overrides.arrest_date_min!
        : 'angulus',
    arrest_date_threshold:
      overrides && overrides.hasOwnProperty('arrest_date_threshold')
        ? overrides.arrest_date_threshold!
        : 5199,
    custom_fields:
      overrides && overrides.hasOwnProperty('custom_fields')
        ? overrides.custom_fields!
        : 'vix',
    email:
      overrides && overrides.hasOwnProperty('email')
        ? overrides.email!
        : 'amoveo',
    expiresAt:
      overrides && overrides.hasOwnProperty('expiresAt')
        ? overrides.expiresAt!
        : 'somnus',
    name:
      overrides && overrides.hasOwnProperty('name') ? overrides.name! : 'neque',
    role:
      overrides && overrides.hasOwnProperty('role')
        ? overrides.role!
        : 'aperiam',
  }
}

export const aCustomSchema = (
  overrides?: Partial<CustomSchema>,
  _relationshipsToOmit: Set<string> = new Set()
): { __typename: 'CustomSchema' } & CustomSchema => {
  const relationshipsToOmit: Set<string> = new Set(_relationshipsToOmit)
  relationshipsToOmit.add('CustomSchema')
  return {
    __typename: 'CustomSchema',
    id: overrides && overrides.hasOwnProperty('id') ? overrides.id! : 7604,
    schema:
      overrides && overrides.hasOwnProperty('schema')
        ? overrides.schema!
        : 'via',
    section:
      overrides && overrides.hasOwnProperty('section')
        ? overrides.section!
        : 'suffoco',
    table:
      overrides && overrides.hasOwnProperty('table')
        ? overrides.table!
        : 'cogito',
    updated_at:
      overrides && overrides.hasOwnProperty('updated_at')
        ? overrides.updated_at!
        : 'caput',
    updated_by:
      overrides && overrides.hasOwnProperty('updated_by')
        ? overrides.updated_by!
        : relationshipsToOmit.has('User')
          ? ({} as User)
          : aUser({}, relationshipsToOmit),
    updated_by_id:
      overrides && overrides.hasOwnProperty('updated_by_id')
        ? overrides.updated_by_id!
        : 7362,
  }
}

export const aGenericFilterInput = (
  overrides?: Partial<GenericFilterInput>,
  _relationshipsToOmit: Set<string> = new Set()
): GenericFilterInput => {
  const relationshipsToOmit: Set<string> = new Set(_relationshipsToOmit)
  relationshipsToOmit.add('GenericFilterInput')
  return {
    field:
      overrides && overrides.hasOwnProperty('field') ? overrides.field! : 'ait',
    operator:
      overrides && overrides.hasOwnProperty('operator')
        ? overrides.operator!
        : 'sperno',
    value:
      overrides && overrides.hasOwnProperty('value')
        ? overrides.value!
        : 'sophismata',
  }
}

export const aLog = (
  overrides?: Partial<Log>,
  _relationshipsToOmit: Set<string> = new Set()
): { __typename: 'Log' } & Log => {
  const relationshipsToOmit: Set<string> = new Set(_relationshipsToOmit)
  relationshipsToOmit.add('Log')
  return {
    __typename: 'Log',
    action:
      overrides && overrides.hasOwnProperty('action')
        ? overrides.action!
        : relationshipsToOmit.has('Action')
          ? ({} as Action)
          : anAction({}, relationshipsToOmit),
    action_id:
      overrides && overrides.hasOwnProperty('action_id')
        ? overrides.action_id!
        : 2223,
    arrests:
      overrides && overrides.hasOwnProperty('arrests')
        ? overrides.arrests!
        : [
            relationshipsToOmit.has('Arrest')
              ? ({} as Arrest)
              : anArrest({}, relationshipsToOmit),
          ],
    created_at:
      overrides && overrides.hasOwnProperty('created_at')
        ? overrides.created_at!
        : 'vicissitudo',
    created_by:
      overrides && overrides.hasOwnProperty('created_by')
        ? overrides.created_by!
        : relationshipsToOmit.has('User')
          ? ({} as User)
          : aUser({}, relationshipsToOmit),
    created_by_id:
      overrides && overrides.hasOwnProperty('created_by_id')
        ? overrides.created_by_id!
        : 3238,
    custom_fields:
      overrides && overrides.hasOwnProperty('custom_fields')
        ? overrides.custom_fields!
        : 'usus',
    id: overrides && overrides.hasOwnProperty('id') ? overrides.id! : 9228,
    needs_followup:
      overrides && overrides.hasOwnProperty('needs_followup')
        ? overrides.needs_followup!
        : true,
    notes:
      overrides && overrides.hasOwnProperty('notes')
        ? overrides.notes!
        : 'terebro',
    time:
      overrides && overrides.hasOwnProperty('time')
        ? overrides.time!
        : 'suffoco',
    type:
      overrides && overrides.hasOwnProperty('type') ? overrides.type! : 'ultra',
    updated_at:
      overrides && overrides.hasOwnProperty('updated_at')
        ? overrides.updated_at!
        : 'tui',
    updated_by:
      overrides && overrides.hasOwnProperty('updated_by')
        ? overrides.updated_by!
        : relationshipsToOmit.has('User')
          ? ({} as User)
          : aUser({}, relationshipsToOmit),
    updated_by_id:
      overrides && overrides.hasOwnProperty('updated_by_id')
        ? overrides.updated_by_id!
        : 3917,
  }
}

export const aMutation = (
  overrides?: Partial<Mutation>,
  _relationshipsToOmit: Set<string> = new Set()
): { __typename: 'Mutation' } & Mutation => {
  const relationshipsToOmit: Set<string> = new Set(_relationshipsToOmit)
  relationshipsToOmit.add('Mutation')
  return {
    __typename: 'Mutation',
    bulkDeleteArrests:
      overrides && overrides.hasOwnProperty('bulkDeleteArrests')
        ? overrides.bulkDeleteArrests!
        : relationshipsToOmit.has('BatchPayload')
          ? ({} as BatchPayload)
          : aBatchPayload({}, relationshipsToOmit),
    bulkUpdateArrests:
      overrides && overrides.hasOwnProperty('bulkUpdateArrests')
        ? overrides.bulkUpdateArrests!
        : relationshipsToOmit.has('BatchPayload')
          ? ({} as BatchPayload)
          : aBatchPayload({}, relationshipsToOmit),
    bulkUpdateUsers:
      overrides && overrides.hasOwnProperty('bulkUpdateUsers')
        ? overrides.bulkUpdateUsers!
        : relationshipsToOmit.has('BatchPayload')
          ? ({} as BatchPayload)
          : aBatchPayload({}, relationshipsToOmit),
    bulkUpsertSiteSetting:
      overrides && overrides.hasOwnProperty('bulkUpsertSiteSetting')
        ? overrides.bulkUpsertSiteSetting!
        : [
            relationshipsToOmit.has('SiteSetting')
              ? ({} as SiteSetting)
              : aSiteSetting({}, relationshipsToOmit),
          ],
    createAction:
      overrides && overrides.hasOwnProperty('createAction')
        ? overrides.createAction!
        : relationshipsToOmit.has('Action')
          ? ({} as Action)
          : anAction({}, relationshipsToOmit),
    createArrest:
      overrides && overrides.hasOwnProperty('createArrest')
        ? overrides.createArrest!
        : relationshipsToOmit.has('Arrest')
          ? ({} as Arrest)
          : anArrest({}, relationshipsToOmit),
    createCustomSchema:
      overrides && overrides.hasOwnProperty('createCustomSchema')
        ? overrides.createCustomSchema!
        : relationshipsToOmit.has('CustomSchema')
          ? ({} as CustomSchema)
          : aCustomSchema({}, relationshipsToOmit),
    createLog:
      overrides && overrides.hasOwnProperty('createLog')
        ? overrides.createLog!
        : relationshipsToOmit.has('Log')
          ? ({} as Log)
          : aLog({}, relationshipsToOmit),
    createOptionSet:
      overrides && overrides.hasOwnProperty('createOptionSet')
        ? overrides.createOptionSet!
        : relationshipsToOmit.has('OptionSet')
          ? ({} as OptionSet)
          : anOptionSet({}, relationshipsToOmit),
    createOptionSetValue:
      overrides && overrides.hasOwnProperty('createOptionSetValue')
        ? overrides.createOptionSetValue!
        : relationshipsToOmit.has('OptionSetValue')
          ? ({} as OptionSetValue)
          : anOptionSetValue({}, relationshipsToOmit),
    createSiteSetting:
      overrides && overrides.hasOwnProperty('createSiteSetting')
        ? overrides.createSiteSetting!
        : relationshipsToOmit.has('SiteSetting')
          ? ({} as SiteSetting)
          : aSiteSetting({}, relationshipsToOmit),
    createTableView:
      overrides && overrides.hasOwnProperty('createTableView')
        ? overrides.createTableView!
        : relationshipsToOmit.has('TableView')
          ? ({} as TableView)
          : aTableView({}, relationshipsToOmit),
    createUser:
      overrides && overrides.hasOwnProperty('createUser')
        ? overrides.createUser!
        : relationshipsToOmit.has('User')
          ? ({} as User)
          : aUser({}, relationshipsToOmit),
    deleteAction:
      overrides && overrides.hasOwnProperty('deleteAction')
        ? overrides.deleteAction!
        : relationshipsToOmit.has('Action')
          ? ({} as Action)
          : anAction({}, relationshipsToOmit),
    deleteArrest:
      overrides && overrides.hasOwnProperty('deleteArrest')
        ? overrides.deleteArrest!
        : relationshipsToOmit.has('Arrest')
          ? ({} as Arrest)
          : anArrest({}, relationshipsToOmit),
    deleteCustomSchema:
      overrides && overrides.hasOwnProperty('deleteCustomSchema')
        ? overrides.deleteCustomSchema!
        : relationshipsToOmit.has('CustomSchema')
          ? ({} as CustomSchema)
          : aCustomSchema({}, relationshipsToOmit),
    deleteLog:
      overrides && overrides.hasOwnProperty('deleteLog')
        ? overrides.deleteLog!
        : relationshipsToOmit.has('Log')
          ? ({} as Log)
          : aLog({}, relationshipsToOmit),
    deleteOptionSet:
      overrides && overrides.hasOwnProperty('deleteOptionSet')
        ? overrides.deleteOptionSet!
        : relationshipsToOmit.has('OptionSet')
          ? ({} as OptionSet)
          : anOptionSet({}, relationshipsToOmit),
    deleteOptionSetValue:
      overrides && overrides.hasOwnProperty('deleteOptionSetValue')
        ? overrides.deleteOptionSetValue!
        : relationshipsToOmit.has('OptionSetValue')
          ? ({} as OptionSetValue)
          : anOptionSetValue({}, relationshipsToOmit),
    deleteSiteSetting:
      overrides && overrides.hasOwnProperty('deleteSiteSetting')
        ? overrides.deleteSiteSetting!
        : relationshipsToOmit.has('SiteSetting')
          ? ({} as SiteSetting)
          : aSiteSetting({}, relationshipsToOmit),
    deleteTableView:
      overrides && overrides.hasOwnProperty('deleteTableView')
        ? overrides.deleteTableView!
        : relationshipsToOmit.has('TableView')
          ? ({} as TableView)
          : aTableView({}, relationshipsToOmit),
    deleteUser:
      overrides && overrides.hasOwnProperty('deleteUser')
        ? overrides.deleteUser!
        : relationshipsToOmit.has('User')
          ? ({} as User)
          : aUser({}, relationshipsToOmit),
    updateAction:
      overrides && overrides.hasOwnProperty('updateAction')
        ? overrides.updateAction!
        : relationshipsToOmit.has('Action')
          ? ({} as Action)
          : anAction({}, relationshipsToOmit),
    updateArrest:
      overrides && overrides.hasOwnProperty('updateArrest')
        ? overrides.updateArrest!
        : relationshipsToOmit.has('Arrest')
          ? ({} as Arrest)
          : anArrest({}, relationshipsToOmit),
    updateCustomSchema:
      overrides && overrides.hasOwnProperty('updateCustomSchema')
        ? overrides.updateCustomSchema!
        : relationshipsToOmit.has('CustomSchema')
          ? ({} as CustomSchema)
          : aCustomSchema({}, relationshipsToOmit),
    updateLog:
      overrides && overrides.hasOwnProperty('updateLog')
        ? overrides.updateLog!
        : relationshipsToOmit.has('Log')
          ? ({} as Log)
          : aLog({}, relationshipsToOmit),
    updateOptionSet:
      overrides && overrides.hasOwnProperty('updateOptionSet')
        ? overrides.updateOptionSet!
        : relationshipsToOmit.has('OptionSet')
          ? ({} as OptionSet)
          : anOptionSet({}, relationshipsToOmit),
    updateOptionSetValue:
      overrides && overrides.hasOwnProperty('updateOptionSetValue')
        ? overrides.updateOptionSetValue!
        : relationshipsToOmit.has('OptionSetValue')
          ? ({} as OptionSetValue)
          : anOptionSetValue({}, relationshipsToOmit),
    updateSiteSetting:
      overrides && overrides.hasOwnProperty('updateSiteSetting')
        ? overrides.updateSiteSetting!
        : relationshipsToOmit.has('SiteSetting')
          ? ({} as SiteSetting)
          : aSiteSetting({}, relationshipsToOmit),
    updateTableView:
      overrides && overrides.hasOwnProperty('updateTableView')
        ? overrides.updateTableView!
        : relationshipsToOmit.has('TableView')
          ? ({} as TableView)
          : aTableView({}, relationshipsToOmit),
    updateUser:
      overrides && overrides.hasOwnProperty('updateUser')
        ? overrides.updateUser!
        : relationshipsToOmit.has('User')
          ? ({} as User)
          : aUser({}, relationshipsToOmit),
    upsertSiteSetting:
      overrides && overrides.hasOwnProperty('upsertSiteSetting')
        ? overrides.upsertSiteSetting!
        : relationshipsToOmit.has('SiteSetting')
          ? ({} as SiteSetting)
          : aSiteSetting({}, relationshipsToOmit),
  }
}

export const anOptionSet = (
  overrides?: Partial<OptionSet>,
  _relationshipsToOmit: Set<string> = new Set()
): { __typename: 'OptionSet' } & OptionSet => {
  const relationshipsToOmit: Set<string> = new Set(_relationshipsToOmit)
  relationshipsToOmit.add('OptionSet')
  return {
    __typename: 'OptionSet',
    description:
      overrides && overrides.hasOwnProperty('description')
        ? overrides.description!
        : 'tantillus',
    id: overrides && overrides.hasOwnProperty('id') ? overrides.id! : 6049,
    name:
      overrides && overrides.hasOwnProperty('name') ? overrides.name! : 'earum',
    values:
      overrides && overrides.hasOwnProperty('values')
        ? overrides.values!
        : [
            relationshipsToOmit.has('OptionSetValue')
              ? ({} as OptionSetValue)
              : anOptionSetValue({}, relationshipsToOmit),
          ],
  }
}

export const anOptionSetValue = (
  overrides?: Partial<OptionSetValue>,
  _relationshipsToOmit: Set<string> = new Set()
): { __typename: 'OptionSetValue' } & OptionSetValue => {
  const relationshipsToOmit: Set<string> = new Set(_relationshipsToOmit)
  relationshipsToOmit.add('OptionSetValue')
  return {
    __typename: 'OptionSetValue',
    id: overrides && overrides.hasOwnProperty('id') ? overrides.id! : 2437,
    label:
      overrides && overrides.hasOwnProperty('label')
        ? overrides.label!
        : 'canonicus',
    option_set_details:
      overrides && overrides.hasOwnProperty('option_set_details')
        ? overrides.option_set_details!
        : relationshipsToOmit.has('OptionSet')
          ? ({} as OptionSet)
          : anOptionSet({}, relationshipsToOmit),
    option_set_id:
      overrides && overrides.hasOwnProperty('option_set_id')
        ? overrides.option_set_id!
        : 141,
    value:
      overrides && overrides.hasOwnProperty('value') ? overrides.value! : 'bos',
  }
}

export const aQuery = (
  overrides?: Partial<Query>,
  _relationshipsToOmit: Set<string> = new Set()
): { __typename: 'Query' } & Query => {
  const relationshipsToOmit: Set<string> = new Set(_relationshipsToOmit)
  relationshipsToOmit.add('Query')
  return {
    __typename: 'Query',
    action:
      overrides && overrides.hasOwnProperty('action')
        ? overrides.action!
        : relationshipsToOmit.has('Action')
          ? ({} as Action)
          : anAction({}, relationshipsToOmit),
    actions:
      overrides && overrides.hasOwnProperty('actions')
        ? overrides.actions!
        : [
            relationshipsToOmit.has('Action')
              ? ({} as Action)
              : anAction({}, relationshipsToOmit),
          ],
    arrest:
      overrides && overrides.hasOwnProperty('arrest')
        ? overrides.arrest!
        : relationshipsToOmit.has('Arrest')
          ? ({} as Arrest)
          : anArrest({}, relationshipsToOmit),
    arresteeLogs:
      overrides && overrides.hasOwnProperty('arresteeLogs')
        ? overrides.arresteeLogs!
        : [
            relationshipsToOmit.has('Log')
              ? ({} as Log)
              : aLog({}, relationshipsToOmit),
          ],
    arrests:
      overrides && overrides.hasOwnProperty('arrests')
        ? overrides.arrests!
        : [
            relationshipsToOmit.has('Arrest')
              ? ({} as Arrest)
              : anArrest({}, relationshipsToOmit),
          ],
    customSchema:
      overrides && overrides.hasOwnProperty('customSchema')
        ? overrides.customSchema!
        : relationshipsToOmit.has('CustomSchema')
          ? ({} as CustomSchema)
          : aCustomSchema({}, relationshipsToOmit),
    customSchemata:
      overrides && overrides.hasOwnProperty('customSchemata')
        ? overrides.customSchemata!
        : [
            relationshipsToOmit.has('CustomSchema')
              ? ({} as CustomSchema)
              : aCustomSchema({}, relationshipsToOmit),
          ],
    docketSheetSearch:
      overrides && overrides.hasOwnProperty('docketSheetSearch')
        ? overrides.docketSheetSearch!
        : [
            relationshipsToOmit.has('Arrest')
              ? ({} as Arrest)
              : anArrest({}, relationshipsToOmit),
          ],
    filterArrests:
      overrides && overrides.hasOwnProperty('filterArrests')
        ? overrides.filterArrests!
        : [
            relationshipsToOmit.has('Arrest')
              ? ({} as Arrest)
              : anArrest({}, relationshipsToOmit),
          ],
    log:
      overrides && overrides.hasOwnProperty('log')
        ? overrides.log!
        : relationshipsToOmit.has('Log')
          ? ({} as Log)
          : aLog({}, relationshipsToOmit),
    logs:
      overrides && overrides.hasOwnProperty('logs')
        ? overrides.logs!
        : [
            relationshipsToOmit.has('Log')
              ? ({} as Log)
              : aLog({}, relationshipsToOmit),
          ],
    optionSet:
      overrides && overrides.hasOwnProperty('optionSet')
        ? overrides.optionSet!
        : relationshipsToOmit.has('OptionSet')
          ? ({} as OptionSet)
          : anOptionSet({}, relationshipsToOmit),
    optionSetValue:
      overrides && overrides.hasOwnProperty('optionSetValue')
        ? overrides.optionSetValue!
        : relationshipsToOmit.has('OptionSetValue')
          ? ({} as OptionSetValue)
          : anOptionSetValue({}, relationshipsToOmit),
    optionSetValues:
      overrides && overrides.hasOwnProperty('optionSetValues')
        ? overrides.optionSetValues!
        : [
            relationshipsToOmit.has('OptionSetValue')
              ? ({} as OptionSetValue)
              : anOptionSetValue({}, relationshipsToOmit),
          ],
    optionSets:
      overrides && overrides.hasOwnProperty('optionSets')
        ? overrides.optionSets!
        : [
            relationshipsToOmit.has('OptionSet')
              ? ({} as OptionSet)
              : anOptionSet({}, relationshipsToOmit),
          ],
    redwood:
      overrides && overrides.hasOwnProperty('redwood')
        ? overrides.redwood!
        : relationshipsToOmit.has('Redwood')
          ? ({} as Redwood)
          : aRedwood({}, relationshipsToOmit),
    searchActions:
      overrides && overrides.hasOwnProperty('searchActions')
        ? overrides.searchActions!
        : [
            relationshipsToOmit.has('Action')
              ? ({} as Action)
              : anAction({}, relationshipsToOmit),
          ],
    searchArrests:
      overrides && overrides.hasOwnProperty('searchArrests')
        ? overrides.searchArrests!
        : [
            relationshipsToOmit.has('Arrest')
              ? ({} as Arrest)
              : anArrest({}, relationshipsToOmit),
          ],
    searchUsers:
      overrides && overrides.hasOwnProperty('searchUsers')
        ? overrides.searchUsers!
        : [
            relationshipsToOmit.has('User')
              ? ({} as User)
              : aUser({}, relationshipsToOmit),
          ],
    siteSetting:
      overrides && overrides.hasOwnProperty('siteSetting')
        ? overrides.siteSetting!
        : relationshipsToOmit.has('SiteSetting')
          ? ({} as SiteSetting)
          : aSiteSetting({}, relationshipsToOmit),
    siteSettings:
      overrides && overrides.hasOwnProperty('siteSettings')
        ? overrides.siteSettings!
        : [
            relationshipsToOmit.has('SiteSetting')
              ? ({} as SiteSetting)
              : aSiteSetting({}, relationshipsToOmit),
          ],
    tableView:
      overrides && overrides.hasOwnProperty('tableView')
        ? overrides.tableView!
        : relationshipsToOmit.has('TableView')
          ? ({} as TableView)
          : aTableView({}, relationshipsToOmit),
    tableViews:
      overrides && overrides.hasOwnProperty('tableViews')
        ? overrides.tableViews!
        : [
            relationshipsToOmit.has('TableView')
              ? ({} as TableView)
              : aTableView({}, relationshipsToOmit),
          ],
    user:
      overrides && overrides.hasOwnProperty('user')
        ? overrides.user!
        : relationshipsToOmit.has('User')
          ? ({} as User)
          : aUser({}, relationshipsToOmit),
    users:
      overrides && overrides.hasOwnProperty('users')
        ? overrides.users!
        : [
            relationshipsToOmit.has('User')
              ? ({} as User)
              : aUser({}, relationshipsToOmit),
          ],
  }
}

export const aQueryParams = (
  overrides?: Partial<QueryParams>,
  _relationshipsToOmit: Set<string> = new Set()
): QueryParams => {
  const relationshipsToOmit: Set<string> = new Set(_relationshipsToOmit)
  relationshipsToOmit.add('QueryParams')
  return {
    orderBy:
      overrides && overrides.hasOwnProperty('orderBy')
        ? overrides.orderBy!
        : 'careo',
    select:
      overrides && overrides.hasOwnProperty('select')
        ? overrides.select!
        : 'cilicium',
    skip:
      overrides && overrides.hasOwnProperty('skip') ? overrides.skip! : 5365,
    take:
      overrides && overrides.hasOwnProperty('take') ? overrides.take! : 2969,
    where:
      overrides && overrides.hasOwnProperty('where')
        ? overrides.where!
        : 'contra',
  }
}

export const aRedwood = (
  overrides?: Partial<Redwood>,
  _relationshipsToOmit: Set<string> = new Set()
): { __typename: 'Redwood' } & Redwood => {
  const relationshipsToOmit: Set<string> = new Set(_relationshipsToOmit)
  relationshipsToOmit.add('Redwood')
  return {
    __typename: 'Redwood',
    currentUser:
      overrides && overrides.hasOwnProperty('currentUser')
        ? overrides.currentUser!
        : 'vindico',
    prismaVersion:
      overrides && overrides.hasOwnProperty('prismaVersion')
        ? overrides.prismaVersion!
        : 'talus',
    version:
      overrides && overrides.hasOwnProperty('version')
        ? overrides.version!
        : 'turpis',
  }
}

export const aSiteSetting = (
  overrides?: Partial<SiteSetting>,
  _relationshipsToOmit: Set<string> = new Set()
): { __typename: 'SiteSetting' } & SiteSetting => {
  const relationshipsToOmit: Set<string> = new Set(_relationshipsToOmit)
  relationshipsToOmit.add('SiteSetting')
  return {
    __typename: 'SiteSetting',
    description:
      overrides && overrides.hasOwnProperty('description')
        ? overrides.description!
        : 'molestiae',
    id: overrides && overrides.hasOwnProperty('id') ? overrides.id! : 'vallum',
    updated_at:
      overrides && overrides.hasOwnProperty('updated_at')
        ? overrides.updated_at!
        : 'tabula',
    updated_by:
      overrides && overrides.hasOwnProperty('updated_by')
        ? overrides.updated_by!
        : relationshipsToOmit.has('User')
          ? ({} as User)
          : aUser({}, relationshipsToOmit),
    updated_by_id:
      overrides && overrides.hasOwnProperty('updated_by_id')
        ? overrides.updated_by_id!
        : 2396,
    value:
      overrides && overrides.hasOwnProperty('value')
        ? overrides.value!
        : 'animus',
  }
}

export const aTableView = (
  overrides?: Partial<TableView>,
  _relationshipsToOmit: Set<string> = new Set()
): { __typename: 'TableView' } & TableView => {
  const relationshipsToOmit: Set<string> = new Set(_relationshipsToOmit)
  relationshipsToOmit.add('TableView')
  return {
    __typename: 'TableView',
    created_at:
      overrides && overrides.hasOwnProperty('created_at')
        ? overrides.created_at!
        : 'arguo',
    created_by:
      overrides && overrides.hasOwnProperty('created_by')
        ? overrides.created_by!
        : relationshipsToOmit.has('User')
          ? ({} as User)
          : aUser({}, relationshipsToOmit),
    created_by_id:
      overrides && overrides.hasOwnProperty('created_by_id')
        ? overrides.created_by_id!
        : 2858,
    id: overrides && overrides.hasOwnProperty('id') ? overrides.id! : 6224,
    name:
      overrides && overrides.hasOwnProperty('name')
        ? overrides.name!
        : 'delectatio',
    state:
      overrides && overrides.hasOwnProperty('state')
        ? overrides.state!
        : 'tolero',
    type:
      overrides && overrides.hasOwnProperty('type')
        ? overrides.type!
        : 'ulterius',
    updated_at:
      overrides && overrides.hasOwnProperty('updated_at')
        ? overrides.updated_at!
        : 'vulgo',
    updated_by:
      overrides && overrides.hasOwnProperty('updated_by')
        ? overrides.updated_by!
        : relationshipsToOmit.has('User')
          ? ({} as User)
          : aUser({}, relationshipsToOmit),
    updated_by_id:
      overrides && overrides.hasOwnProperty('updated_by_id')
        ? overrides.updated_by_id!
        : 1734,
  }
}

export const anUpdateActionInput = (
  overrides?: Partial<UpdateActionInput>,
  _relationshipsToOmit: Set<string> = new Set()
): UpdateActionInput => {
  const relationshipsToOmit: Set<string> = new Set(_relationshipsToOmit)
  relationshipsToOmit.add('UpdateActionInput')
  return {
    city:
      overrides && overrides.hasOwnProperty('city') ? overrides.city! : 'celo',
    custom_fields:
      overrides && overrides.hasOwnProperty('custom_fields')
        ? overrides.custom_fields!
        : 'utpote',
    description:
      overrides && overrides.hasOwnProperty('description')
        ? overrides.description!
        : 'cogito',
    end_date:
      overrides && overrides.hasOwnProperty('end_date')
        ? overrides.end_date!
        : 'coniecto',
    jurisdiction:
      overrides && overrides.hasOwnProperty('jurisdiction')
        ? overrides.jurisdiction!
        : 'cuius',
    name:
      overrides && overrides.hasOwnProperty('name') ? overrides.name! : 'in',
    start_date:
      overrides && overrides.hasOwnProperty('start_date')
        ? overrides.start_date!
        : 'magnam',
  }
}

export const anUpdateArrestInput = (
  overrides?: Partial<UpdateArrestInput>,
  _relationshipsToOmit: Set<string> = new Set()
): UpdateArrestInput => {
  const relationshipsToOmit: Set<string> = new Set(_relationshipsToOmit)
  relationshipsToOmit.add('UpdateArrestInput')
  return {
    action_id:
      overrides && overrides.hasOwnProperty('action_id')
        ? overrides.action_id!
        : 2212,
    arrest_city:
      overrides && overrides.hasOwnProperty('arrest_city')
        ? overrides.arrest_city!
        : 'curis',
    arrestee:
      overrides && overrides.hasOwnProperty('arrestee')
        ? overrides.arrestee!
        : relationshipsToOmit.has('CreateArresteeInput')
          ? ({} as CreateArresteeInput)
          : aCreateArresteeInput({}, relationshipsToOmit),
    arrestee_id:
      overrides && overrides.hasOwnProperty('arrestee_id')
        ? overrides.arrestee_id!
        : 4557,
    charges:
      overrides && overrides.hasOwnProperty('charges')
        ? overrides.charges!
        : 'agnitio',
    citation_number:
      overrides && overrides.hasOwnProperty('citation_number')
        ? overrides.citation_number!
        : 'quam',
    created_by_id:
      overrides && overrides.hasOwnProperty('created_by_id')
        ? overrides.created_by_id!
        : 1254,
    custom_fields:
      overrides && overrides.hasOwnProperty('custom_fields')
        ? overrides.custom_fields!
        : 'omnis',
    date:
      overrides && overrides.hasOwnProperty('date')
        ? overrides.date!
        : 'utique',
    display_field:
      overrides && overrides.hasOwnProperty('display_field')
        ? overrides.display_field!
        : 'volutabrum',
    jurisdiction:
      overrides && overrides.hasOwnProperty('jurisdiction')
        ? overrides.jurisdiction!
        : 'vigor',
    location:
      overrides && overrides.hasOwnProperty('location')
        ? overrides.location!
        : 'decimus',
    search_field:
      overrides && overrides.hasOwnProperty('search_field')
        ? overrides.search_field!
        : 'calculus',
    updated_by_id:
      overrides && overrides.hasOwnProperty('updated_by_id')
        ? overrides.updated_by_id!
        : 7545,
  }
}

export const anUpdateArresteeInput = (
  overrides?: Partial<UpdateArresteeInput>,
  _relationshipsToOmit: Set<string> = new Set()
): UpdateArresteeInput => {
  const relationshipsToOmit: Set<string> = new Set(_relationshipsToOmit)
  relationshipsToOmit.add('UpdateArresteeInput')
  return {
    address:
      overrides && overrides.hasOwnProperty('address')
        ? overrides.address!
        : 'amita',
    city:
      overrides && overrides.hasOwnProperty('city') ? overrides.city! : 'verto',
    created_by_id:
      overrides && overrides.hasOwnProperty('created_by_id')
        ? overrides.created_by_id!
        : 3382,
    custom_fields:
      overrides && overrides.hasOwnProperty('custom_fields')
        ? overrides.custom_fields!
        : 'quasi',
    display_field:
      overrides && overrides.hasOwnProperty('display_field')
        ? overrides.display_field!
        : 'aestas',
    dob:
      overrides && overrides.hasOwnProperty('dob')
        ? overrides.dob!
        : 'occaecati',
    email:
      overrides && overrides.hasOwnProperty('email')
        ? overrides.email!
        : 'correptius',
    first_name:
      overrides && overrides.hasOwnProperty('first_name')
        ? overrides.first_name!
        : 'tertius',
    last_name:
      overrides && overrides.hasOwnProperty('last_name')
        ? overrides.last_name!
        : 'dicta',
    notes:
      overrides && overrides.hasOwnProperty('notes')
        ? overrides.notes!
        : 'damnatio',
    phone_1:
      overrides && overrides.hasOwnProperty('phone_1')
        ? overrides.phone_1!
        : 'curiositas',
    phone_2:
      overrides && overrides.hasOwnProperty('phone_2')
        ? overrides.phone_2!
        : 'vinculum',
    preferred_name:
      overrides && overrides.hasOwnProperty('preferred_name')
        ? overrides.preferred_name!
        : 'veritatis',
    pronoun:
      overrides && overrides.hasOwnProperty('pronoun')
        ? overrides.pronoun!
        : 'amplus',
    search_field:
      overrides && overrides.hasOwnProperty('search_field')
        ? overrides.search_field!
        : 'allatus',
    state:
      overrides && overrides.hasOwnProperty('state')
        ? overrides.state!
        : 'talio',
    updated_by_id:
      overrides && overrides.hasOwnProperty('updated_by_id')
        ? overrides.updated_by_id!
        : 1141,
    zip:
      overrides && overrides.hasOwnProperty('zip') ? overrides.zip! : 'nostrum',
  }
}

export const anUpdateCustomSchemaInput = (
  overrides?: Partial<UpdateCustomSchemaInput>,
  _relationshipsToOmit: Set<string> = new Set()
): UpdateCustomSchemaInput => {
  const relationshipsToOmit: Set<string> = new Set(_relationshipsToOmit)
  relationshipsToOmit.add('UpdateCustomSchemaInput')
  return {
    schema:
      overrides && overrides.hasOwnProperty('schema')
        ? overrides.schema!
        : 'confido',
    section:
      overrides && overrides.hasOwnProperty('section')
        ? overrides.section!
        : 'fugiat',
    table:
      overrides && overrides.hasOwnProperty('table')
        ? overrides.table!
        : 'conduco',
    updated_by_id:
      overrides && overrides.hasOwnProperty('updated_by_id')
        ? overrides.updated_by_id!
        : 9410,
  }
}

export const anUpdateLogInput = (
  overrides?: Partial<UpdateLogInput>,
  _relationshipsToOmit: Set<string> = new Set()
): UpdateLogInput => {
  const relationshipsToOmit: Set<string> = new Set(_relationshipsToOmit)
  relationshipsToOmit.add('UpdateLogInput')
  return {
    action_id:
      overrides && overrides.hasOwnProperty('action_id')
        ? overrides.action_id!
        : 5779,
    arrests:
      overrides && overrides.hasOwnProperty('arrests')
        ? overrides.arrests!
        : [3092],
    created_by_id:
      overrides && overrides.hasOwnProperty('created_by_id')
        ? overrides.created_by_id!
        : 1077,
    custom_fields:
      overrides && overrides.hasOwnProperty('custom_fields')
        ? overrides.custom_fields!
        : 'conduco',
    needs_followup:
      overrides && overrides.hasOwnProperty('needs_followup')
        ? overrides.needs_followup!
        : true,
    notes:
      overrides && overrides.hasOwnProperty('notes')
        ? overrides.notes!
        : 'admoveo',
    time:
      overrides && overrides.hasOwnProperty('time')
        ? overrides.time!
        : 'sollers',
    type:
      overrides && overrides.hasOwnProperty('type') ? overrides.type! : 'votum',
    updated_by_id:
      overrides && overrides.hasOwnProperty('updated_by_id')
        ? overrides.updated_by_id!
        : 4834,
  }
}

export const anUpdateOptionSetInput = (
  overrides?: Partial<UpdateOptionSetInput>,
  _relationshipsToOmit: Set<string> = new Set()
): UpdateOptionSetInput => {
  const relationshipsToOmit: Set<string> = new Set(_relationshipsToOmit)
  relationshipsToOmit.add('UpdateOptionSetInput')
  return {
    name:
      overrides && overrides.hasOwnProperty('name')
        ? overrides.name!
        : 'tempus',
    values:
      overrides && overrides.hasOwnProperty('values')
        ? overrides.values!
        : [
            relationshipsToOmit.has('CreateOptionSetValueInput')
              ? ({} as CreateOptionSetValueInput)
              : aCreateOptionSetValueInput({}, relationshipsToOmit),
          ],
  }
}

export const anUpdateOptionSetValueInput = (
  overrides?: Partial<UpdateOptionSetValueInput>,
  _relationshipsToOmit: Set<string> = new Set()
): UpdateOptionSetValueInput => {
  const relationshipsToOmit: Set<string> = new Set(_relationshipsToOmit)
  relationshipsToOmit.add('UpdateOptionSetValueInput')
  return {
    label:
      overrides && overrides.hasOwnProperty('label') ? overrides.label! : 'rem',
    option_set_id:
      overrides && overrides.hasOwnProperty('option_set_id')
        ? overrides.option_set_id!
        : 3089,
    value:
      overrides && overrides.hasOwnProperty('value')
        ? overrides.value!
        : 'coadunatio',
  }
}

export const anUpdateSiteSettingInput = (
  overrides?: Partial<UpdateSiteSettingInput>,
  _relationshipsToOmit: Set<string> = new Set()
): UpdateSiteSettingInput => {
  const relationshipsToOmit: Set<string> = new Set(_relationshipsToOmit)
  relationshipsToOmit.add('UpdateSiteSettingInput')
  return {
    description:
      overrides && overrides.hasOwnProperty('description')
        ? overrides.description!
        : 'voluptas',
    value:
      overrides && overrides.hasOwnProperty('value')
        ? overrides.value!
        : 'asporto',
  }
}

export const anUpdateTableViewInput = (
  overrides?: Partial<UpdateTableViewInput>,
  _relationshipsToOmit: Set<string> = new Set()
): UpdateTableViewInput => {
  const relationshipsToOmit: Set<string> = new Set(_relationshipsToOmit)
  relationshipsToOmit.add('UpdateTableViewInput')
  return {
    created_at:
      overrides && overrides.hasOwnProperty('created_at')
        ? overrides.created_at!
        : 'caterva',
    created_by_id:
      overrides && overrides.hasOwnProperty('created_by_id')
        ? overrides.created_by_id!
        : 1145,
    name:
      overrides && overrides.hasOwnProperty('name') ? overrides.name! : 'arx',
    state:
      overrides && overrides.hasOwnProperty('state')
        ? overrides.state!
        : 'dolor',
    type:
      overrides && overrides.hasOwnProperty('type')
        ? overrides.type!
        : 'cenaculum',
    updated_at:
      overrides && overrides.hasOwnProperty('updated_at')
        ? overrides.updated_at!
        : 'cilicium',
    updated_by_id:
      overrides && overrides.hasOwnProperty('updated_by_id')
        ? overrides.updated_by_id!
        : 6238,
  }
}

export const anUpdateUserInput = (
  overrides?: Partial<UpdateUserInput>,
  _relationshipsToOmit: Set<string> = new Set()
): UpdateUserInput => {
  const relationshipsToOmit: Set<string> = new Set(_relationshipsToOmit)
  relationshipsToOmit.add('UpdateUserInput')
  return {
    action_ids:
      overrides && overrides.hasOwnProperty('action_ids')
        ? overrides.action_ids!
        : [1493],
    arrest_date_max:
      overrides && overrides.hasOwnProperty('arrest_date_max')
        ? overrides.arrest_date_max!
        : 'coma',
    arrest_date_min:
      overrides && overrides.hasOwnProperty('arrest_date_min')
        ? overrides.arrest_date_min!
        : 'doloribus',
    arrest_date_threshold:
      overrides && overrides.hasOwnProperty('arrest_date_threshold')
        ? overrides.arrest_date_threshold!
        : 3558,
    custom_fields:
      overrides && overrides.hasOwnProperty('custom_fields')
        ? overrides.custom_fields!
        : 'vinculum',
    email:
      overrides && overrides.hasOwnProperty('email')
        ? overrides.email!
        : 'turbo',
    expiresAt:
      overrides && overrides.hasOwnProperty('expiresAt')
        ? overrides.expiresAt!
        : 'terreo',
    name:
      overrides && overrides.hasOwnProperty('name') ? overrides.name! : 'velit',
    role:
      overrides && overrides.hasOwnProperty('role')
        ? overrides.role!
        : 'toties',
  }
}

export const anUpsertSiteSettingInput = (
  overrides?: Partial<UpsertSiteSettingInput>,
  _relationshipsToOmit: Set<string> = new Set()
): UpsertSiteSettingInput => {
  const relationshipsToOmit: Set<string> = new Set(_relationshipsToOmit)
  relationshipsToOmit.add('UpsertSiteSettingInput')
  return {
    description:
      overrides && overrides.hasOwnProperty('description')
        ? overrides.description!
        : 'careo',
    id:
      overrides && overrides.hasOwnProperty('id') ? overrides.id! : 'apostolus',
    value:
      overrides && overrides.hasOwnProperty('value')
        ? overrides.value!
        : 'saepe',
  }
}

export const aUser = (
  overrides?: Partial<User>,
  _relationshipsToOmit: Set<string> = new Set()
): { __typename: 'User' } & User => {
  const relationshipsToOmit: Set<string> = new Set(_relationshipsToOmit)
  relationshipsToOmit.add('User')
  return {
    __typename: 'User',
    action_ids:
      overrides && overrides.hasOwnProperty('action_ids')
        ? overrides.action_ids!
        : [3304],
    actions:
      overrides && overrides.hasOwnProperty('actions')
        ? overrides.actions!
        : [
            relationshipsToOmit.has('Action')
              ? ({} as Action)
              : anAction({}, relationshipsToOmit),
          ],
    arrest_date_max:
      overrides && overrides.hasOwnProperty('arrest_date_max')
        ? overrides.arrest_date_max!
        : 'rerum',
    arrest_date_min:
      overrides && overrides.hasOwnProperty('arrest_date_min')
        ? overrides.arrest_date_min!
        : 'angulus',
    arrest_date_threshold:
      overrides && overrides.hasOwnProperty('arrest_date_threshold')
        ? overrides.arrest_date_threshold!
        : 3186,
    created_arrestee_logs:
      overrides && overrides.hasOwnProperty('created_arrestee_logs')
        ? overrides.created_arrestee_logs!
        : [
            relationshipsToOmit.has('Log')
              ? ({} as Log)
              : aLog({}, relationshipsToOmit),
          ],
    created_arrestees:
      overrides && overrides.hasOwnProperty('created_arrestees')
        ? overrides.created_arrestees!
        : [
            relationshipsToOmit.has('Arrestee')
              ? ({} as Arrestee)
              : anArrestee({}, relationshipsToOmit),
          ],
    created_arrests:
      overrides && overrides.hasOwnProperty('created_arrests')
        ? overrides.created_arrests!
        : [
            relationshipsToOmit.has('Arrest')
              ? ({} as Arrest)
              : anArrest({}, relationshipsToOmit),
          ],
    created_table_views:
      overrides && overrides.hasOwnProperty('created_table_views')
        ? overrides.created_table_views!
        : [
            relationshipsToOmit.has('TableView')
              ? ({} as TableView)
              : aTableView({}, relationshipsToOmit),
          ],
    custom_fields:
      overrides && overrides.hasOwnProperty('custom_fields')
        ? overrides.custom_fields!
        : 'tabula',
    email:
      overrides && overrides.hasOwnProperty('email')
        ? overrides.email!
        : 'natus',
    expiresAt:
      overrides && overrides.hasOwnProperty('expiresAt')
        ? overrides.expiresAt!
        : 'crustulum',
    id: overrides && overrides.hasOwnProperty('id') ? overrides.id! : 7270,
    name:
      overrides && overrides.hasOwnProperty('name')
        ? overrides.name!
        : 'supellex',
    role:
      overrides && overrides.hasOwnProperty('role')
        ? overrides.role!
        : 'apostolus',
    updated_arrestee_logs:
      overrides && overrides.hasOwnProperty('updated_arrestee_logs')
        ? overrides.updated_arrestee_logs!
        : [
            relationshipsToOmit.has('Log')
              ? ({} as Log)
              : aLog({}, relationshipsToOmit),
          ],
    updated_arrestees:
      overrides && overrides.hasOwnProperty('updated_arrestees')
        ? overrides.updated_arrestees!
        : [
            relationshipsToOmit.has('Arrestee')
              ? ({} as Arrestee)
              : anArrestee({}, relationshipsToOmit),
          ],
    updated_arrests:
      overrides && overrides.hasOwnProperty('updated_arrests')
        ? overrides.updated_arrests!
        : [
            relationshipsToOmit.has('Arrest')
              ? ({} as Arrest)
              : anArrest({}, relationshipsToOmit),
          ],
    updated_custom_schemas:
      overrides && overrides.hasOwnProperty('updated_custom_schemas')
        ? overrides.updated_custom_schemas!
        : [
            relationshipsToOmit.has('CustomSchema')
              ? ({} as CustomSchema)
              : aCustomSchema({}, relationshipsToOmit),
          ],
    updated_table_views:
      overrides && overrides.hasOwnProperty('updated_table_views')
        ? overrides.updated_table_views!
        : [
            relationshipsToOmit.has('TableView')
              ? ({} as TableView)
              : aTableView({}, relationshipsToOmit),
          ],
  }
}
