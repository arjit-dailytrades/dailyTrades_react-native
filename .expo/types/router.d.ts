/* eslint-disable */
import * as Router from "expo-router";

export * from "expo-router";

declare module "expo-router" {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams:
        | {
            pathname: Router.RelativePathString;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: Router.ExternalPathString;
            params?: Router.UnknownInputParams;
          }
        | { pathname: `/agreement`; params?: Router.UnknownInputParams }
        | {
            pathname: `/expertPastPerformance`;
            params?: Router.UnknownInputParams;
          }
        | { pathname: `/favorite-advisor`; params?: Router.UnknownInputParams }
        | { pathname: `/following-advisor`; params?: Router.UnknownInputParams }
        | { pathname: `/modal`; params?: Router.UnknownInputParams }
        | { pathname: `/myOrders`; params?: Router.UnknownInputParams }
        | { pathname: `/myTrades`; params?: Router.UnknownInputParams }
        | { pathname: `/premiumTools`; params?: Router.UnknownInputParams }
        | { pathname: `/profile`; params?: Router.UnknownInputParams }
        | { pathname: `/risk-profile`; params?: Router.UnknownInputParams }
        | { pathname: `/subscription`; params?: Router.UnknownInputParams }
        | { pathname: `/support`; params?: Router.UnknownInputParams }
        | { pathname: `/transactions`; params?: Router.UnknownInputParams }
        | { pathname: `/userProfile`; params?: Router.UnknownInputParams }
        | {
            pathname: `/../components/common/BottomSheetModal`;
            params?: Router.UnknownInputParams;
          }
        | { pathname: `/_sitemap`; params?: Router.UnknownInputParams }
        | {
            pathname: `${"/(auth)"}/login` | `/login`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `${"/(auth)"}/verify` | `/verify`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `${"/(tabs)"}/expert` | `/expert`;
            params?: Router.UnknownInputParams;
          }
        | { pathname: `${"/(tabs)"}` | `/`; params?: Router.UnknownInputParams }
        | {
            pathname: `${"/(tabs)"}/orders` | `/orders`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `${"/(tabs)"}/position` | `/position`;
            params?: Router.UnknownInputParams;
          };
      hrefOutputParams:
        | {
            pathname: Router.RelativePathString;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname: Router.ExternalPathString;
            params?: Router.UnknownOutputParams;
          }
        | { pathname: `/agreement`; params?: Router.UnknownOutputParams }
        | {
            pathname: `/expertPastPerformance`;
            params?: Router.UnknownOutputParams;
          }
        | { pathname: `/favorite-advisor`; params?: Router.UnknownOutputParams }
        | {
            pathname: `/following-advisor`;
            params?: Router.UnknownOutputParams;
          }
        | { pathname: `/modal`; params?: Router.UnknownOutputParams }
        | { pathname: `/myOrders`; params?: Router.UnknownOutputParams }
        | { pathname: `/myTrades`; params?: Router.UnknownOutputParams }
        | { pathname: `/premiumTools`; params?: Router.UnknownOutputParams }
        | { pathname: `/profile`; params?: Router.UnknownOutputParams }
        | { pathname: `/risk-profile`; params?: Router.UnknownOutputParams }
        | { pathname: `/subscription`; params?: Router.UnknownOutputParams }
        | { pathname: `/support`; params?: Router.UnknownOutputParams }
        | { pathname: `/transactions`; params?: Router.UnknownOutputParams }
        | { pathname: `/userProfile`; params?: Router.UnknownOutputParams }
        | {
            pathname: `/../components/common/BottomSheetModal`;
            params?: Router.UnknownOutputParams;
          }
        | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams }
        | {
            pathname: `${"/(auth)"}/login` | `/login`;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname: `${"/(auth)"}/verify` | `/verify`;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname: `${"/(tabs)"}/expert` | `/expert`;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname: `${"/(tabs)"}` | `/`;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname: `${"/(tabs)"}/orders` | `/orders`;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname: `${"/(tabs)"}/position` | `/position`;
            params?: Router.UnknownOutputParams;
          };
      href:
        | Router.RelativePathString
        | Router.ExternalPathString
        | `/agreement${`?${string}` | `#${string}` | ""}`
        | `/expertPastPerformance${`?${string}` | `#${string}` | ""}`
        | `/favorite-advisor${`?${string}` | `#${string}` | ""}`
        | `/following-advisor${`?${string}` | `#${string}` | ""}`
        | `/modal${`?${string}` | `#${string}` | ""}`
        | `/myOrders${`?${string}` | `#${string}` | ""}`
        | `/myTrades${`?${string}` | `#${string}` | ""}`
        | `/premiumTools${`?${string}` | `#${string}` | ""}`
        | `/profile${`?${string}` | `#${string}` | ""}`
        | `/risk-profile${`?${string}` | `#${string}` | ""}`
        | `/subscription${`?${string}` | `#${string}` | ""}`
        | `/support${`?${string}` | `#${string}` | ""}`
        | `/transactions${`?${string}` | `#${string}` | ""}`
        | `/userProfile${`?${string}` | `#${string}` | ""}`
        | `/../components/common/BottomSheetModal${`?${string}` | `#${string}` | ""}`
        | `/_sitemap${`?${string}` | `#${string}` | ""}`
        | `${"/(auth)"}/login${`?${string}` | `#${string}` | ""}`
        | `/login${`?${string}` | `#${string}` | ""}`
        | `${"/(auth)"}/verify${`?${string}` | `#${string}` | ""}`
        | `/verify${`?${string}` | `#${string}` | ""}`
        | `${"/(tabs)"}/expert${`?${string}` | `#${string}` | ""}`
        | `/expert${`?${string}` | `#${string}` | ""}`
        | `${"/(tabs)"}${`?${string}` | `#${string}` | ""}`
        | `/${`?${string}` | `#${string}` | ""}`
        | `${"/(tabs)"}/orders${`?${string}` | `#${string}` | ""}`
        | `/orders${`?${string}` | `#${string}` | ""}`
        | `${"/(tabs)"}/position${`?${string}` | `#${string}` | ""}`
        | `/position${`?${string}` | `#${string}` | ""}`
        | {
            pathname: Router.RelativePathString;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: Router.ExternalPathString;
            params?: Router.UnknownInputParams;
          }
        | { pathname: `/agreement`; params?: Router.UnknownInputParams }
        | {
            pathname: `/expertPastPerformance`;
            params?: Router.UnknownInputParams;
          }
        | { pathname: `/favorite-advisor`; params?: Router.UnknownInputParams }
        | { pathname: `/following-advisor`; params?: Router.UnknownInputParams }
        | { pathname: `/modal`; params?: Router.UnknownInputParams }
        | { pathname: `/myOrders`; params?: Router.UnknownInputParams }
        | { pathname: `/myTrades`; params?: Router.UnknownInputParams }
        | { pathname: `/premiumTools`; params?: Router.UnknownInputParams }
        | { pathname: `/profile`; params?: Router.UnknownInputParams }
        | { pathname: `/risk-profile`; params?: Router.UnknownInputParams }
        | { pathname: `/subscription`; params?: Router.UnknownInputParams }
        | { pathname: `/support`; params?: Router.UnknownInputParams }
        | { pathname: `/transactions`; params?: Router.UnknownInputParams }
        | { pathname: `/userProfile`; params?: Router.UnknownInputParams }
        | {
            pathname: `/../components/common/BottomSheetModal`;
            params?: Router.UnknownInputParams;
          }
        | { pathname: `/_sitemap`; params?: Router.UnknownInputParams }
        | {
            pathname: `${"/(auth)"}/login` | `/login`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `${"/(auth)"}/verify` | `/verify`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `${"/(tabs)"}/expert` | `/expert`;
            params?: Router.UnknownInputParams;
          }
        | { pathname: `${"/(tabs)"}` | `/`; params?: Router.UnknownInputParams }
        | {
            pathname: `${"/(tabs)"}/orders` | `/orders`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `${"/(tabs)"}/position` | `/position`;
            params?: Router.UnknownInputParams;
          };
    }
  }
}
