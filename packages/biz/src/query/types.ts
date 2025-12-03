import type * as qs from 'qs'

/**
 * Options for parsing query strings
 * Extends qs.IParseOptions with type safety
 */
export type ParseOptions = qs.IParseOptions

/**
 * Options for stringifying query objects
 * Extends qs.IStringifyOptions with type safety
 */
export type StringifyOptions = qs.IStringifyOptions

/**
 * Generic query object type
 * Represents key-value pairs in query strings
 */
export type QueryObject = Record<string, any>

/**
 * Generic parsed query result
 * Allows type-safe parsing with custom types
 */
export type ParsedQuery<T = QueryObject> = T

/**
 * Options for merging query parameters into URLs
 */
export interface MergeOptions {
  /**
   * Whether to override existing query parameters
   * @default true
   */
  override?: boolean

  /**
   * Whether to encode the resulting query string
   * @default true
   */
  encode?: boolean
}
