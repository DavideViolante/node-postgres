'use strict'
const helper = require('../test-helper')
const pg = helper.pg
const assert = require('assert')

new helper.Suite().test('support for complex column names', function () {
  const pool = new pg.Pool()
  pool.connect(
    assert.success(function (client, done) {
      client.query('CREATE TEMP TABLE t ( "complex\'\'column" TEXT )')
      client.query(
        'SELECT * FROM t',
        assert.success(function (res) {
          done()
          assert.strictEqual(res.fields[0].name, "complex''column")
          pool.end()
        })
      )
    })
  )
})
