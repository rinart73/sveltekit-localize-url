# Localize URL [![NPM lite-youtube-embed package](https://img.shields.io/npm/v/sveltekit-localize-url.svg)](https://npmjs.org/package/sveltekit-localize-url)

**SvelteKit library that handles URL localization and routing.**

> **Note**
> This package is WIP. It works but the future updates may introduce breaking changes to simplify setup or introduce features.

## Features

-   Supports 3 URL structure types:
    -   Locale prefix except for the base locale (default) - `/about`, `/ru/o-nas`;
    -   Prefix for every locale - `/en/about`, `/ru/o-nas`;
    -   Separate domains for locales - `example.com/about`, `example.ru/o-nas`.
-   Validates current URL:
    -   Redirects `/ru/about-us` to the corrected `/ru/o-nas`;
    -   Supports partially localized pages - throws 404 if a page isn’t available for the requested locale.
-   Helps to build localized URLs;
-   Builds alternate URLs for the `<link rel="alternate"` tags and for a language switcher;
-   Supports dynamic params that depend on the server (such as localized post slugs).

## Interactive Live Demo

https://sveltekit-localize-url.vercel.app/

## Compatibility

This library was initially created to be used with the [typesafe-i18n](https://github.com/ivanhofer/typesafe-i18n) library, but should work fine with any i18n library (or even without one).

## Installation

```
npm install sveltekit-localize-url
```

## Usage

Please take a look the [example](https://github.com/rinart73/sveltekit-localize-url/tree/main/src) for the full setup.

## How does it work?

Let's imagine that:

-   Your default/base locale is `en` and enabled locales are `en`, `ru` and `it`;
-   You have the following structure: `/[[lang=lang]]/[l_about=l_about]`;
-   Your `l_about` param is registered like this:

```typescript
// src/params/l_about.ts
import { localizeParam, matchParam } from 'sveltekit-localize-url';

const localizedParam = localizeParam(1, 'l_about', {
	en: 'about-us',
	ru: 'o-nas'
	// there is version in Italian
});
export const match: ParamMatcher = (param) => matchParam(param, localizedParam);
```

When SvelteKit will match params, it will decide that **all of following paths are valid**:

-   `/about-us`
-   `/en/about-us`
-   `/ru/about-us`
-   `/it/about-us`
-   `/o-nas`
-   `/en/o-nas`
-   `/ru/o-nas`
-   `/it/o-nas`

However the `validateUrlLocale()` function that is called in the `src/routes/[[lang=lang]]/+layout.ts` will take care of that by taking registered params and using them to construct a correct path for the current locale.

-   If the paths match, proceed;
-   If the paths don't match, redirect to a corrected URL;
-   If it can't construct a path for the current locale, throw 404.

So in the end we'll get the following:

-   `/about-us` - Correct;
-   `/ru/o-nas` - Correct;
-   `/o-nas`, `/en/about-us`, `/en/o-nas` - Redirect to `/about-us`;
-   `/ru/about-us` - Redirect to `/ru/o-nas`;
-   `/it/about-us`, `/it/o-nas` - 404 Not Found.
