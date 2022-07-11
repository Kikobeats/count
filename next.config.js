module.exports = {
  async rewrites () {
    return [
      {
        source: '/:path*',
        destination: '/api/:path*'
      }
    ]
  }
}
