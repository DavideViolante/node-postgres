const assert = require('assert')
const Client = require('../')

describe('COPY FROM', function () {
  before(function (done) {
    this.client = Client()
    this.client.connect(done)
  })

  after(function (done) {
    this.client.end(done)
  })

  it('works', function (done) {
    const client = this.client
    this.client.querySync('CREATE TEMP TABLE blah(name text, age int)')
    this.client.querySync('COPY blah FROM stdin')
    const stream = this.client.getCopyStream()
    stream.write(Buffer.from('Brian\t32\n', 'utf8'))
    stream.write(Buffer.from('Aaron\t30\n', 'utf8'))
    stream.write(Buffer.from('Shelley\t28\n', 'utf8'))
    stream.end()

    stream.once('finish', function () {
      const rows = client.querySync('SELECT COUNT(*) FROM blah')
      assert.equal(rows.length, 1)
      assert.equal(rows[0].count, 3)
      done()
    })
  })

  it('works with a callback passed to end', function (done) {
    const client = this.client
    this.client.querySync('CREATE TEMP TABLE boom(name text, age int)')
    this.client.querySync('COPY boom FROM stdin')
    const stream = this.client.getCopyStream()
    stream.write(Buffer.from('Brian\t32\n', 'utf8'))
    stream.write(Buffer.from('Aaron\t30\n', 'utf8'), function () {
      stream.end(Buffer.from('Shelley\t28\n', 'utf8'), function () {
        const rows = client.querySync('SELECT COUNT(*) FROM boom')
        assert.equal(rows.length, 1)
        assert.equal(rows[0].count, 3)
        done()
      })
    })
  })
})
