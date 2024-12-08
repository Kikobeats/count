<p align="center">
  <br />
  <img src="https://emojipedia-api.vercel.app/?emoji=%F0%9F%92%AF" height="128">
<h2 align="center"> A simple microservice for counting things. <br />
  <br />
  <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FKikobeats%2Fcount">
    <img src="https://vercel.com/button" alt="Deploy with Vercel" />
  </a>
  <br />
  <br />
</h2>
</p>

# Usage

You can count whatever you want. It's inspired by [antirez.com](http://antirez.com) and [rauchg.com](https://rauchg.com/).

For seeing your counters, just perform a `GET` to `/:collection/:key`:

```
curl https://count.kikobeats.com/pageviews/culture-shipping
// => "204"
```

You can also getting counters in a bulk using a comma as separator:

```
curl https://count.kikobeats.com/pageviews/culture-shipping,professional-career
// => "204,98"
```

If you want to increment a counter, pass `incr` query parameter:

```
curl https://count.kikobeats.com/pageviews/culture-shipping?incr
// => "205"
```

It doesn't matter if your `id` contains final slash; it will be sanitized.

For printing the value in your website, a representative code for doing that could be:

```html
<script>
  fetch(`'https://count.kikobeats.com/pageviews/${window.location.pathname}?incr`)
    .then(res => res.json())
    .then(count => {
      document.querySelector('.pageviews-container').classList.remove('display-none')
      document.querySelector('.pageviews-count').textContent = count
    })
</script>
```

# Environment Variables

## Authentication

### DOMAINS

*Required*</br>
Type: `string`|`string[]`

The list of allowed domains authorized to consume your Microlink API credentials.

Note domains should be provided in the [URL.origin](https://developer.mozilla.org/en-US/docs/Web/API/URL/origin) format (e.g., `'https://example.com'`).

## Database

The service is backed at [Upstash](https://upstash.com).

You need to create an account (it's free!) and copy some relevant values specified below.

### UPSTASH_REDIS_REST_URL

Type: `string`

Your Upstash database URL to use.

### UPSTASH_REDIS_REST_TOKEN

Type: `string`

Your Upstash token authentication-

## License

**count** © [Kiko Beats](https://kikobeats.com), released under the [MIT](https://github.com/Kikobeats/count/blob/master/LICENSE.md) License.<br>
Authored and maintained by Kiko Beats with help from [contributors](https://github.com/Kikobeats/count/contributors).

> [kikobeats.com](https://kikobeats.com) · GitHub [Kiko Beats](https://github.com/Kikobeats) · X [@Kikobeats](https://x.com/Kikobeats)
