# pageviews-microservice

![Last version](https://img.shields.io/github/tag/Kikobeats/pageviews-microservice.svg?style=flat-square)
[![Build Status](https://img.shields.io/travis/com/Kikobeats/pageviews-microservice/master.svg?style=flat-square)](https://travis-ci.com/Kikobeats/pageviews-microservice)
[![Dependency status](https://img.shields.io/david/Kikobeats/pageviews-microservice.svg?style=flat-square)](https://david-dm.org/Kikobeats/pageviews-microservice)
[![Dev Dependencies Status](https://img.shields.io/david/dev/Kikobeats/pageviews-microservice.svg?style=flat-square)](https://david-dm.org/Kikobeats/pageviews-microservice#info=devDependencies)

A simple microservice for counting page views and embedding them in your site.

![](demo.png)

It's inspired by [antirez.com](http://antirez.com) & [rauchg.com](https://rauchg.com/).

## Environment Variables

### API_KEY

Type: `string` </br>
Default: `undefined`

When you provide it, all request to need to be authenticated in order to increment pageviews.

The API key can be provided:

- as `x-api-key` request header.
- as `key` or `apiKey` as query parameter.

You can use [randomkeygen.com](https://randomkeygen.com) for generating an unique API key.

### DB_URI

Type: `string` </br>
Default: `undefined`

The database URI used for backed your microservice.

Since we delegate into [`Keyv`](https://github.com/lukechilds/keyv), any storage (Redis, Mongo, SQLite, PostgreSQL, MySQL & more) are supported.


## License

**pageviews-microservice** © [Kiko Beats](https://kikobeats.com), released under the [MIT](https://github.com/Kikobeats/pageviews-microservice/blob/master/LICENSE.md) License.<br>
Authored and maintained by Kiko Beats with help from [contributors](https://github.com/Kikobeats/pageviews-microservice/contributors).

> [kikobeats.com](https://kikobeats.com) · GitHub [Kiko Beats](https://github.com/Kikobeats) · Twitter [@Kikobeats](https://twitter.com/Kikobeats)
