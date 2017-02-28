/* global describe, it */
const MessageConnector = require('../src/message-connector')
const expect = require('chai').expect
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
require('chai').use(sinonChai)

const settingsA = {
  pubAddress: 'tcp://127.0.0.1:3001',
  subAddress: ['tcp://127.0.0.1:3002', 'tcp://127.0.0.1:3003']
}
const settingsB = {
  pubAddress: 'tcp://127.0.0.1:3002',
  subAddress: ['tcp://127.0.0.1:3001', 'tcp://127.0.0.1:3003']
}
const settingsC = {
  pubAddress: 'tcp://127.0.0.1:3003',
  subAddress: ['tcp://127.0.0.1:3001', 'tcp://127.0.0.1:3002']
}
const MESSAGE_TIME = 500

describe('Messages are sent between multiple instances', () => {
  var connectorA, connectorB, connectorC
  var callbackA = sinon.spy()
  var callbackB = sinon.spy()
  var callbackC = sinon.spy()

  it('creates connectorA', (done) => {
    connectorA = new MessageConnector(settingsA)
    expect(connectorA.isReady).to.equal(false)
    connectorA.on('ready', done)
    connectorA.on('error', (e) => { throw e })
  })

  it('creates connectorB', (done) => {
    connectorB = new MessageConnector(settingsB)
    expect(connectorB.isReady).to.equal(false)
    connectorB.on('ready', done)
  })

  it('creates connectorC', (done) => {
    connectorC = new MessageConnector(settingsC)
    expect(connectorC.isReady).to.equal(false)
    connectorC.on('ready', done)
  })

  it('subscribes to a topic', (done) => {
    connectorA.subscribe('topic1', callbackA)
    connectorB.subscribe('topic1', callbackB)
    connectorC.subscribe('topic1', callbackC)
    expect(callbackA.callCount).to.equal(0)
    setTimeout(done, MESSAGE_TIME)
  })

  it('connectorB sends a message', (done) => {
    connectorB.publish('topic1', {some: 'data'})
    setTimeout(done, MESSAGE_TIME)
  })

  it('connectorA and connectorC have received the message', () => {
    expect(callbackA).to.have.been.calledWith({_s: connectorB._sender, some: 'data'})
    expect(callbackB).to.not.have.been.called
    expect(callbackC).to.have.been.calledWith({_s: connectorB._sender, some: 'data'})
  })

  it('connectorC sends a message', (done) => {
    connectorC.publish('topic1', {other: 'value'})
    setTimeout(done, MESSAGE_TIME)
  })

  it('connectorA and connectorB have received the message', () => {
    expect(callbackA).to.have.been.calledWith({_s: connectorC._sender, other: 'value'})
    expect(callbackB).to.have.been.calledWith({_s: connectorC._sender, other: 'value'})
    expect(callbackC).to.have.been.calledWith({_s: connectorB._sender, some: 'data'})
  })

  it('connectorA and connectorC send messages at the same time', (done) => {
    connectorA.publish('topic1', {val: 'x'})
    connectorC.publish('topic1', {val: 'y'})
    setTimeout(done, MESSAGE_TIME)
  })

  it('connectorA and connectorB have received the message', () => {
    expect(callbackA).to.have.been.calledWith({_s: connectorC._sender, val: 'y'})
    expect(callbackB).to.have.been.calledWith({_s: connectorA._sender, val: 'x'})
    expect(callbackB).to.have.been.calledWith({_s: connectorC._sender, val: 'y'})
    expect(callbackC).to.have.been.calledWith({_s: connectorA._sender, val: 'x'})
  })

  it('connectorB unsubscribes', () => {
    connectorB.unsubscribe('topic1', callbackB)
  })

  it('connectorA sends a message', (done) => {
    connectorA.publish('topic1', {notFor: 'B'})
    setTimeout(done, MESSAGE_TIME)
  })

  it('only connector c has received the message', () => {
    expect(callbackA).to.not.have.been.calledWith({_s: connectorA._sender, notFor: 'B'})
    expect(callbackB).to.not.have.been.calledWith({_s: connectorA._sender, notFor: 'B'})
    expect(callbackC).to.have.been.calledWith({_s: connectorA._sender, notFor: 'B'})
  })
})
