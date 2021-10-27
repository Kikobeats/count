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

Imagine you are visiting a blog post and you want to count views.

Just pass the blog post relative path for counting pageviews:

```
kikobeats.com/culture-shipping → count.kikobeats.com/pageviews/culture-shipping?incr → HTTP 200 OK
```

The service will return you the current counter, and the first and last timestamp associated:

```json
{
  "updatedAt": 1564327678670,
  "createdAt": 1564327676653,
  "count": 25
}
```

For counting thing, you need to perform a `GET` to `/:collection/:key`, being supported the following query string:

- **incr**: When it is present, it specifies how much increment the value.

It doesn't matter if your `id` contains final slash; it will be sanitized.

For printing the value in your website, a representative code for doing that could be:

```html
<script>
  fetch(`'https://count.kikobeats.com/pageviews/${window.location.pathname}?incr`)
    .then(res => res.json())
    .then(({ count }) => {
      document.querySelector('.pageviews-container').classList.remove('display-none')
      document.querySelector('.pageviews-count').textContent = count
    })
</script>
```

# Environment Variables

## Database

The service is backed at [Upstash](https://upstash.com).

You need to create an account (it's free!) and copy some relevant values specified below.

### UPSTASH_URL

Type: `string`

Your Upstash database URL to use.

### UPSTASH_TOKEN

Type: `string`

Your Upstash token authentication-

## License

**count** © [Kiko Beats](https://kikobeats.com), released under the [MIT](https://github.com/Kikobeats/count/blob/master/LICENSE.md) License.<br>
Authored and maintained by Kiko Beats with help from [contributors](https://github.com/Kikobeats/count/contributors).

> [kikobeats.com](https://kikobeats.com) · GitHub [Kiko Beats](https://github.com/Kikobeats) · Twitter [@Kikobeats](https://twitter.com/Kikobeats)
