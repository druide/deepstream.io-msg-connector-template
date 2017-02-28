/* global describe, it */
const MessageConnector = require('../src/message-connector')
const expect = require('chai').expect
const EventEmitter = require('events').EventEmitter
const settings = {
  pubAddress: 'tcp://127.0.0.1:3004',
  subAddress: 'tcp://127.0.0.1:3002'
}

describe('The message connector has the correct structure', () => {
  var messageConnector

  it('creates a messageConnector', (done) => {
    messageConnector = new MessageConnector(settings)
    expect(messageConnector.isReady).to.equal(false)
    messageConnector.on('error', done)
    messageConnector.on('ready', done)
  })

  it('implements the messageConnector interface', () => {
    expect(typeof messageConnector.subscribe).to.equal('function')
    expect(typeof messageConnector.unsubscribe).to.equal('function')
    expect(typeof messageConnector.publish).to.equal('function')
    expect(typeof messageConnector.isReady).to.equal('boolean')
    expect(typeof messageConnector.name).to.equal('string')
    expect(typeof messageConnector.version).to.equal('string')
    expect(messageConnector instanceof EventEmitter).to.equal(true)
  })

  it('throws an error when required settings are missing', () => {
    expect(() => {
      var a = new MessageConnector('gibberish')
      void a
    }).to.throw()
  })
})
