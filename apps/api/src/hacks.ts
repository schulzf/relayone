export function startupHacks() {
  // @Bugfix fastify JSON.stringify cannot serialize BigInt.
  BigInt.prototype['toJSON'] = function () {
    return parseInt(this.toString());
  };

  // @Bugfix it fixes issue with maxListeners due to ElasticSearch package
  require('events').EventEmitter.defaultMaxListeners = 0;
}
