# pageviews-microservice

![Last version](https://img.shields.io/github/tag/Kikobeats/pageviews-microservice.svg?style=flat-square)
[![Build Status](https://img.shields.io/travis/com/Kikobeats/pageviews-microservice/master.svg?style=flat-square)](https://travis-ci.com/Kikobeats/pageviews-microservice)
[![Dependency status](https://img.shields.io/david/Kikobeats/pageviews-microservice.svg?style=flat-square)](https://david-dm.org/Kikobeats/pageviews-microservice)
[![Dev Dependencies Status](https://img.shields.io/david/dev/Kikobeats/pageviews-microservice.svg?style=flat-square)](https://david-dm.org/Kikobeats/pageviews-microservice#info=devDependencies)

A simple microservice for counting page views and embedding them in your site.

![](demo.gif)

It's inspired by [antirez.com](http://antirez.com) & [rauchg.com](https://rauchg.com/).

# Install

Using [ZEIT Now](https://zeit.co/now) CLI:

```bash
$ now
```

# Usage

The microservice counts pageviews at `pageviews.kikobeats.com/:id`, being `id` the URL slug of your blog post or publication.

Imagine an user is visiting [kikobeats.com/culture-shipping](https://kikobeats.com/culture-shipping); for counting a pageview, you need to do something like:

```
kikobeats.com/culture-shipping → pageviews.kikobeats.com/culture-shipping → HTTP 201 Created
```

The service will return you the current pageviews counted, and the first and last pageview timestamp.

```json
{

  "updatedAt": 1564327678670,
  "createdAt": 1564327676653,
  "pageviews": 25
}
```

The service is enough smart for:

- A maximum of 10 pageviews is counted from the same IP in a window of 1 hour.
- It doesn't matter if your `id` contains final slash; it will be sanitized.

For printing the value in your website, a representative code for doing that could be:

```html
<script>
  fetch('https://pageviews.kikobeats.com' + window.location.pathname + '?key=' + window.PAGEVIEWS_API_KEY)
    .then(res => res.json())
    .then(({ pageviews }) => {
      document.querySelector('.pageviews-container').classList.remove('display-none')
      document.querySelector('.pageviews-count').textContent = pageviews
    })
</script>
```

# Environment Variables

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
