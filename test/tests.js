/* eslint-disable prefer-arrow-callback */

const expect = require('expect');
const mongoose = require('mongoose');

const Store = require('../dist');
const schema = require('../dist/schema');

mongoose.connect('mongodb://localhost:27017/test_brute_express_mongoose');

describe('MongooseStore', function () {
  beforeEach(function () {
    mongoose.Promise = Promise;
    this.model = mongoose.model('bruteforce', schema);
    this.store = new Store(this.model);
    return this.model.remove({}).exec();
  });

  it('should be able to set a value', function () {
    return this.store.set('foo', { count: 123 }, 1000)
      .then(() => this.model.findOne({ _id: 'foo' }).exec())
      .then(data => {
        expect(data.data).toMatch({
          count: 123
        });
        expect(data.expires).toBeA(Date);
      });
  });

  it('should be able to get a value', function () {
    return this.store.set('foo', { count: 123 }, 1000)
      .then(() => this.store.get('foo'))
      .then(data => {
        expect(data).toMatch({
          count: 123
        });
      });
  });

  it('should return undef if expired', function () {
    return this.store.set('foo', { count: 123 }, 0)
      .then(() => this.store.get('foo'))
      .then(data => {
        expect(data).toBe(null);
      });
  });

  it('should delete the doc if expired', function () {
    return this.store.set('foo', { count: 123 }, 0)
      .then(() => this.store.get('foo'))
      .then(() => this.model.findOne({ _id: 'foo' }).exec())
      .then(data => {
        expect(data).toBe(null);
      });
  });

  it('should be able to reset', function () {
    return this.store.set('foo', { count: 123 }, 1000)
      .then(() => this.store.reset('foo'))
      .then(() => this.model.findOne({ _id: 'foo' }).exec())
      .then(data => {
        expect(data).toBe(null);
      });
  });

  it('should be able to specify defaults', function () {
    const store = new Store(() => {}, { prefix: 'testPrefix' });
    expect(store.options.prefix).toBe('testPrefix');
  });
});
