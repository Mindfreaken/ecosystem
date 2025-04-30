/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as achievementDefs from "../achievementDefs.js";
import type * as achievements from "../achievements.js";
import type * as counters from "../counters.js";
import type * as friendCodes from "../friendCodes.js";
import type * as friends from "../friends.js";
import type * as messages from "../messages.js";
import type * as profile from "../profile.js";
import type * as profileTypes from "../profileTypes.js";
import type * as profiles from "../profiles.js";
import type * as punishments from "../punishments.js";
import type * as settings from "../settings.js";
import type * as users from "../users.js";
import type * as utils from "../utils.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  achievementDefs: typeof achievementDefs;
  achievements: typeof achievements;
  counters: typeof counters;
  friendCodes: typeof friendCodes;
  friends: typeof friends;
  messages: typeof messages;
  profile: typeof profile;
  profileTypes: typeof profileTypes;
  profiles: typeof profiles;
  punishments: typeof punishments;
  settings: typeof settings;
  users: typeof users;
  utils: typeof utils;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
