'use strict';
/* eslint-env node, mocha */
var _ = require('lodash');
var assert = require('assert');
var debug = require('debug')('generator-alfresco-common-test:prompt-validators');
var validators = require('../index').prompt_validators;

describe('generator-alfresco-common:prompt-validators', function () {
  var yomock = {
    'config': {
      'get': function (key) { return undefined },
      'set': function (key, value) { },
    },
    'projectGroupId': 'org.alfresco',
    'projectVersion': '1.0.0-SNAPSHOT',
  };
  var yomockmodules = {
    'config': {
      'get': function (key) { return this[key] },
      'set': function (key, value) { },
      'moduleRegistry': [
        {
          'groupId': 'groupId',
          'artifactId': 'boo-repo-amp',
          'version': 'version',
          'packaging': 'amp',
          'war': 'repo',
          'location': 'source',
          'path': 'customizations/boo-repo-amp',
        }],
    },
    'projectGroupId': 'org.alfresco',
    'projectVersion': '1.0.0-SNAPSHOT',
  };
  var isNotEmpty = function (input) {
    return !_.isEmpty(input);
  };
  var thisNameCheck = function (input) {
    debug('input %s', input);
    if (this.name === input) return true;
    return 'that did not work';
  };
  var moduleRegistryWithNoModules = require('../index').alfresco_module_registry(yomock);
  var moduleRegistryWithOneModule = require('../index').alfresco_module_registry(yomockmodules);
  describe('.sequentialValidatorFactory()', function () {
    it('handles invalid input', function () {
      assert.strictEqual(validators.sequentialValidatorFactory([])(undefined), undefined);
      assert.strictEqual(validators.sequentialValidatorFactory([])(null), undefined);
    });
    it('handles single value in array', function () {
      assert.strictEqual(validators.sequentialValidatorFactory([validators.uniqueSourceAmpModuleValidator])(undefined, moduleRegistryWithNoModules), 'Artifact Id cannot be empty');
      assert.strictEqual(validators.sequentialValidatorFactory([validators.uniqueSourceAmpModuleValidator])('', moduleRegistryWithNoModules), 'Artifact Id cannot be empty');
      assert.strictEqual(validators.sequentialValidatorFactory([isNotEmpty])('one'), true);
    });
    it('handles multiple values in array', function () {
      assert.strictEqual(validators.sequentialValidatorFactory([isNotEmpty, validators.uniqueSourceAmpModuleValidator])('', moduleRegistryWithNoModules), false);
      assert.strictEqual(validators.sequentialValidatorFactory([validators.uniqueSourceAmpModuleValidator, isNotEmpty])('', moduleRegistryWithNoModules), 'Artifact Id cannot be empty');
    });
    it('handles validators that require a this reference', function () {
      var obj = {
        name: 'fred',
      };
      assert.strictEqual(validators.sequentialValidatorFactory([thisNameCheck]).bind(obj)('fred'), true);
      assert.strictEqual(validators.sequentialValidatorFactory([thisNameCheck]).bind(obj)('george'), 'that did not work');
    });
  });
  describe('.uniqueSourceAmpModuleValidator()', function () {
    it('handles invalid input', function () {
      assert.strictEqual(validators.uniqueSourceAmpModuleValidator(undefined, moduleRegistryWithNoModules), 'Artifact Id cannot be empty');
      assert.strictEqual(validators.uniqueSourceAmpModuleValidator(null, moduleRegistryWithNoModules), 'Artifact Id cannot be empty');
    });
    it('handles unique artifact Id', function () {
      assert.strictEqual(validators.uniqueSourceAmpModuleValidator('one', moduleRegistryWithNoModules), true);
    });
    it('handles duplicate artifact Id', function () {
      assert.strictEqual(validators.uniqueSourceAmpModuleValidator('boo', moduleRegistryWithOneModule), 'Duplicate artifact Id specified');
    });
  });
});

// vim: autoindent expandtab tabstop=2 shiftwidth=2 softtabstop=2
