'use strict';
/* eslint-env node, mocha */
var assert = require('assert');

describe('generator-alfresco-common:alfresco-module-registry', function () {
  var yomock = {
    'config': {
      'get': function (key) { return undefined },
      'set': function (key, value) { },
    },
    'projectGroupId': 'org.alfresco',
    'projectVersion': '1.0.0-SNAPSHOT',
  };

  describe('.getModules()', function () {
    it('returns an empty list by default', function () {
      var repo = require('../index').alfresco_module_registry(yomock);
      var modules = repo.getModules();
      assert.ok(modules);
      assert.deepStrictEqual(modules, []);
    });

    it('handles a module provided via long argument list', function () {
      var repo = require('../index').alfresco_module_registry(yomock);
      repo.addModule('groupId', 'artifactId', 'version', 'packaging', 'war', 'location', 'path');
      var modules = repo.getModules();
      assert.ok(modules);
      assert.deepStrictEqual(modules, [{
        'groupId': 'groupId',
        'artifactId': 'artifactId',
        'version': 'version',
        'packaging': 'packaging',
        'war': 'war',
        'location': 'location',
        'path': 'path',
      }]);
    });

    it('handles a module provided via object form', function () {
      var repo = require('../index').alfresco_module_registry(yomock);
      repo.addModule({
        'groupId': 'groupId',
        'artifactId': 'artifactId',
        'version': 'version',
        'packaging': 'packaging',
        'war': 'war',
        'location': 'location',
        'path': 'path',
      });
      var modules = repo.getModules();
      assert.ok(modules);
      assert.deepStrictEqual(modules, [{
        'groupId': 'groupId',
        'artifactId': 'artifactId',
        'version': 'version',
        'packaging': 'packaging',
        'war': 'war',
        'location': 'location',
        'path': 'path',
      }]);
    });
  });

  describe('.getNamedModules()', function () {
    it('returns an empty list by default', function () {
      var repo = require('../index').alfresco_module_registry(yomock);
      var modules = repo.getNamedModules();
      assert.ok(modules);
      assert.deepStrictEqual(modules, []);
    });

    it('handles a module provided via long argument list', function () {
      var repo = require('../index').alfresco_module_registry(yomock);
      repo.addModule('groupId', 'artifactId', 'version', 'packaging', 'war', 'location', 'path');
      var modules = repo.getNamedModules();
      assert.ok(modules);
      assert.deepStrictEqual(modules, [{
        'name': 'groupId:artifactId:version:packaging:war:location',
        'module': {
          'groupId': 'groupId',
          'artifactId': 'artifactId',
          'version': 'version',
          'packaging': 'packaging',
          'war': 'war',
          'location': 'location',
          'path': 'path',
        },
      }]);
    });

    it('handles a module provided via object form', function () {
      var repo = require('../index').alfresco_module_registry(yomock);
      repo.addModule({
        'groupId': 'groupId',
        'artifactId': 'artifactId',
        'version': 'version',
        'packaging': 'packaging',
        'war': 'war',
        'location': 'location',
        'path': 'path',
      });
      var modules = repo.getNamedModules();
      assert.ok(modules);
      assert.deepStrictEqual(modules, [{
        'name': 'groupId:artifactId:version:packaging:war:location',
        'module': {
          'groupId': 'groupId',
          'artifactId': 'artifactId',
          'version': 'version',
          'packaging': 'packaging',
          'war': 'war',
          'location': 'location',
          'path': 'path',
        },
      }]);
    });

    it('handles ${project.groupId} and ${project.version}', function () {
      var repo = require('../index').alfresco_module_registry(yomock);
      repo.addModule('${project.groupId}', 'artifactId', '${project.version}', 'packaging', 'war', 'location', 'path');
      var modules = repo.getNamedModules();
      assert.ok(modules);
      assert.deepStrictEqual(modules, [{
        'name': 'org.alfresco:artifactId:1.0.0-SNAPSHOT:packaging:war:location',
        'module': {
          'groupId': '${project.groupId}',
          'artifactId': 'artifactId',
          'version': '${project.version}',
          'packaging': 'packaging',
          'war': 'war',
          'location': 'location',
          'path': 'path',
        },
      }]);
    });
  });

  describe('.normalizeModule()', function () {
    it('handles a module provided via long argument list', function () {
      var repo = require('../index').alfresco_module_registry(yomock);
      var module = repo.normalizeModule('groupId', 'artifactId', 'version', 'packaging', 'war', 'location', 'path');
      assert.ok(module);
      assert.deepStrictEqual(module, {
        'groupId': 'groupId',
        'artifactId': 'artifactId',
        'version': 'version',
        'packaging': 'packaging',
        'war': 'war',
        'location': 'location',
        'path': 'path',
      });
    });

    it('handles a module provided via object form', function () {
      var repo = require('../index').alfresco_module_registry(yomock);
      var module = repo.normalizeModule({
        'groupId': 'groupId',
        'artifactId': 'artifactId',
        'version': 'version',
        'packaging': 'packaging',
        'war': 'war',
        'location': 'location',
        'path': 'path',
      });
      assert.ok(module);
      assert.deepStrictEqual(module, {
        'groupId': 'groupId',
        'artifactId': 'artifactId',
        'version': 'version',
        'packaging': 'packaging',
        'war': 'war',
        'location': 'location',
        'path': 'path',
      });
    });

    it('returns undefined if no arguments', function () {
      var repo = require('../index').alfresco_module_registry(yomock);
      assert.strictEqual(repo.normalizeModule(), undefined);
    });

    it('returns undefined if we are missing an argument', function () {
      var repo = require('../index').alfresco_module_registry(yomock);
      assert.strictEqual(repo.normalizeModule('groupId', 'artifactId', 'version', 'packaging', 'war', 'location'), undefined);
    });

    it('returns undefined if inner arguments are undefined', function () {
      var repo = require('../index').alfresco_module_registry(yomock);
      assert.strictEqual(
        repo.normalizeModule('groupId', 'artifactId', undefined, 'packaging', 'war', undefined, 'path'),
        undefined);
    });

    it('returns undefined for an empty module provided via object form', function () {
      var repo = require('../index').alfresco_module_registry(yomock);
      var module = repo.normalizeModule({});
      assert.strictEqual(module, undefined);
    });

    it('returns undefined for an incomplete module provided via object form', function () {
      var repo = require('../index').alfresco_module_registry(yomock);
      var module = repo.normalizeModule({
        'groupId': 'groupId',
        'artifactId': 'artifactId',
        'version': 'version',
        'packaging': 'packaging',
        'war': 'war',
        'location': 'location',
      });
      assert.strictEqual(module, undefined);
    });
  });

  describe('.findModule()', function () {
    it('does not find a non-existent module', function () {
      var repo = require('../index').alfresco_module_registry(yomock);
      var module = repo.findModule('groupId', 'artifactId', 'version', 'packaging', 'war', 'location', 'path');
      assert.strictEqual(module, undefined);
    });

    it('finds module even when no path is provided', function () {
      var repo = require('../index').alfresco_module_registry(yomock);
      repo.addModule('groupId', 'artifactId', 'version', 'packaging', 'war', 'location', 'path');
      var module = repo.findModule('groupId', 'artifactId', 'version', 'packaging', 'war', 'location', undefined);
      assert.ok(module);
      assert.deepStrictEqual(module, {
        'groupId': 'groupId',
        'artifactId': 'artifactId',
        'version': 'version',
        'packaging': 'packaging',
        'war': 'war',
        'location': 'location',
        'path': 'path',
      });
    });

    it('finds the only existing module', function () {
      var repo = require('../index').alfresco_module_registry(yomock);
      repo.addModule('groupId', 'artifactId', 'version', 'packaging', 'war', 'location', 'path');
      var module = repo.findModule('groupId', 'artifactId', 'version', 'packaging', 'war', 'location', 'path');
      assert.ok(module);
      assert.deepStrictEqual(module, {
        'groupId': 'groupId',
        'artifactId': 'artifactId',
        'version': 'version',
        'packaging': 'packaging',
        'war': 'war',
        'location': 'location',
        'path': 'path',
      });
    });

    it('finds the first module', function () {
      var repo = require('../index').alfresco_module_registry(yomock);
      repo.addModule('groupId', 'artifactId', 'version', 'packaging', 'war', 'location', 'path');
      repo.addModule('groupId2', 'artifactId2', 'version2', 'packaging2', 'war2', 'location2', 'path2');
      var module = repo.findModule('groupId', 'artifactId', 'version', 'packaging', 'war', 'location', 'path');
      assert.ok(module);
      assert.deepStrictEqual(module, {
        'groupId': 'groupId',
        'artifactId': 'artifactId',
        'version': 'version',
        'packaging': 'packaging',
        'war': 'war',
        'location': 'location',
        'path': 'path',
      });
    });

    it('finds the middle module', function () {
      var repo = require('../index').alfresco_module_registry(yomock);
      repo.addModule('groupId1', 'artifactId1', 'version1', 'packaging1', 'war1', 'location1', 'path1');
      repo.addModule('groupId', 'artifactId', 'version', 'packaging', 'war', 'location', 'path');
      repo.addModule('groupId3', 'artifactId3', 'version3', 'packaging3', 'war3', 'location3', 'path3');
      var module = repo.findModule('groupId', 'artifactId', 'version', 'packaging', 'war', 'location', 'path');
      assert.ok(module);
      assert.deepStrictEqual(module, {
        'groupId': 'groupId',
        'artifactId': 'artifactId',
        'version': 'version',
        'packaging': 'packaging',
        'war': 'war',
        'location': 'location',
        'path': 'path',
      });
    });

    it('finds the last module', function () {
      var repo = require('../index').alfresco_module_registry(yomock);
      repo.addModule('groupId1', 'artifactId1', 'version1', 'packaging1', 'war1', 'location1', 'path1');
      repo.addModule('groupId2', 'artifactId2', 'version2', 'packaging2', 'war2', 'location2', 'path2');
      repo.addModule('groupId', 'artifactId', 'version', 'packaging', 'war', 'location', 'path');
      var module = repo.findModule('groupId', 'artifactId', 'version', 'packaging', 'war', 'location', 'path');
      assert.ok(module);
      assert.deepStrictEqual(module, {
        'groupId': 'groupId',
        'artifactId': 'artifactId',
        'version': 'version',
        'packaging': 'packaging',
        'war': 'war',
        'location': 'location',
        'path': 'path',
      });
    });
  });

  describe('.addModule()', function () {
    it('ignores requests to add an existing module', function () {
      var repo = require('../index').alfresco_module_registry(yomock);
      repo.addModule('groupId', 'artifactId', 'version', 'packaging', 'war', 'location', 'path');
      repo.addModule('groupId', 'artifactId', 'version', 'packaging', 'war', 'location', 'path');
      var modules = repo.getModules();
      assert.ok(modules);
      assert.deepStrictEqual(modules, [{
        'groupId': 'groupId',
        'artifactId': 'artifactId',
        'version': 'version',
        'packaging': 'packaging',
        'war': 'war',
        'location': 'location',
        'path': 'path',
      }]);
    });

    it('throws if no arguments', function () {
      var repo = require('../index').alfresco_module_registry(yomock);
      assert.throws(function () {
        repo.addModule();
      });
    });

    it('throws if we are missing an argument', function () {
      var repo = require('../index').alfresco_module_registry(yomock);
      assert.throws(function () {
        repo.addModule('groupId', 'artifactId', 'version', 'packaging', 'war', 'location');
      });
    });

    it('throws if inner arguments are undefined', function () {
      var repo = require('../index').alfresco_module_registry(yomock);
      assert.throws(function () {
        repo.addModule('groupId', 'artifactId', undefined, 'packaging', 'war', undefined, 'path');
      });
    });
  });

  describe('.removeModule()', function () {
    it('removes only module', function () {
      var repo = require('../index').alfresco_module_registry(yomock);
      repo.addModule('groupId', 'artifactId', 'version', 'packaging', 'war', 'location', 'path');
      repo.removeModule('groupId', 'artifactId', 'version', 'packaging', 'war', 'location', 'path');
      var modules = repo.getModules();
      assert.ok(modules);
      assert.deepStrictEqual(modules, []);
    });

    it('removes first module', function () {
      var repo = require('../index').alfresco_module_registry(yomock);
      repo.addModule('groupId', 'artifactId1', 'version', 'packaging', 'war', 'location', 'path');
      repo.addModule('groupId', 'artifactId2', 'version', 'packaging', 'war', 'location', 'path');
      repo.addModule('groupId', 'artifactId3', 'version', 'packaging', 'war', 'location', 'path');
      repo.removeModule('groupId', 'artifactId1', 'version', 'packaging', 'war', 'location', 'path');
      var modules = repo.getModules();
      assert.ok(modules);
      assert.deepStrictEqual(modules, [
        {
          'groupId': 'groupId',
          'artifactId': 'artifactId2',
          'version': 'version',
          'packaging': 'packaging',
          'war': 'war',
          'location': 'location',
          'path': 'path',
        },
        {
          'groupId': 'groupId',
          'artifactId': 'artifactId3',
          'version': 'version',
          'packaging': 'packaging',
          'war': 'war',
          'location': 'location',
          'path': 'path',
        },
      ]);
    });

    it('removes middle module', function () {
      var repo = require('../index').alfresco_module_registry(yomock);
      repo.addModule('groupId', 'artifactId1', 'version', 'packaging', 'war', 'location', 'path');
      repo.addModule('groupId', 'artifactId2', 'version', 'packaging', 'war', 'location', 'path');
      repo.addModule('groupId', 'artifactId3', 'version', 'packaging', 'war', 'location', 'path');
      repo.removeModule('groupId', 'artifactId2', 'version', 'packaging', 'war', 'location', 'path');
      var modules = repo.getModules();
      assert.ok(modules);
      assert.deepStrictEqual(modules, [
        {
          'groupId': 'groupId',
          'artifactId': 'artifactId1',
          'version': 'version',
          'packaging': 'packaging',
          'war': 'war',
          'location': 'location',
          'path': 'path',
        },
        {
          'groupId': 'groupId',
          'artifactId': 'artifactId3',
          'version': 'version',
          'packaging': 'packaging',
          'war': 'war',
          'location': 'location',
          'path': 'path',
        },
      ]);
    });

    it('removes last module', function () {
      var repo = require('../index').alfresco_module_registry(yomock);
      repo.addModule('groupId', 'artifactId1', 'version', 'packaging', 'war', 'location', 'path');
      repo.addModule('groupId', 'artifactId2', 'version', 'packaging', 'war', 'location', 'path');
      repo.addModule('groupId', 'artifactId3', 'version', 'packaging', 'war', 'location', 'path');
      repo.removeModule('groupId', 'artifactId3', 'version', 'packaging', 'war', 'location', 'path');
      var modules = repo.getModules();
      assert.ok(modules);
      assert.deepStrictEqual(modules, [
        {
          'groupId': 'groupId',
          'artifactId': 'artifactId1',
          'version': 'version',
          'packaging': 'packaging',
          'war': 'war',
          'location': 'location',
          'path': 'path',
        },
        {
          'groupId': 'groupId',
          'artifactId': 'artifactId2',
          'version': 'version',
          'packaging': 'packaging',
          'war': 'war',
          'location': 'location',
          'path': 'path',
        },
      ]);
    });

    it('throws if no arguments', function () {
      var repo = require('../index').alfresco_module_registry(yomock);
      assert.throws(function () {
        repo.removeModule();
      });
    });

    it('throws if we are missing an argument', function () {
      var repo = require('../index').alfresco_module_registry(yomock);
      assert.throws(function () {
        repo.removeModule('groupId', 'artifactId', 'version', 'packaging', 'war', 'location');
      });
    });

    it('throws if inner arguments are undefined', function () {
      var repo = require('../index').alfresco_module_registry(yomock);
      assert.throws(function () {
        repo.removeModule('groupId', 'artifactId', undefined, 'packaging', 'war', undefined, 'path');
      });
    });

    it('throws if module does not exist', function () {
      var repo = require('../index').alfresco_module_registry(yomock);
      assert.throws(function () {
        repo.removeModule('groupId', 'artifactId', 'version', 'packaging', 'war', 'location', 'path');
      });
    });
  });

  describe('windows paths', function () {
    it('are converted to posix paths when adding', function () {
      var repo = require('../index').alfresco_module_registry(yomock);
      repo.addModule('groupId', 'artifactId', 'version', 'packaging', 'war', 'location', 'customizations\\path');
      var modules = repo.getModules();
      assert.ok(modules);
      assert.deepStrictEqual(modules, [{
        'groupId': 'groupId',
        'artifactId': 'artifactId',
        'version': 'version',
        'packaging': 'packaging',
        'war': 'war',
        'location': 'location',
        'path': 'customizations/path',
      }]);
    });

    it('are converted to posix paths when reading', function () {
      var persistentyomock = {
        'config': {
          'get': key => { return persistentyomock.configData[key] },
          'set': (key, value) => { persistentyomock.configData[key] = value },
        },
        'configData': {},
        'projectGroupId': 'org.alfresco',
        'projectVersion': '1.0.0-SNAPSHOT',
      };

      var repo = require('../index').alfresco_module_registry(persistentyomock);
      repo.addModule('groupId', 'artifactId', 'version', 'packaging', 'war', 'location', 'customizations\\path');
      repo.save();
      repo = require('../index').alfresco_module_registry(persistentyomock);
      var modules = repo.getModules();
      assert.ok(modules);
      assert.deepStrictEqual(modules, [{
        'groupId': 'groupId',
        'artifactId': 'artifactId',
        'version': 'version',
        'packaging': 'packaging',
        'war': 'war',
        'location': 'location',
        'path': 'customizations/path',
      }]);
    });
  });
});

// vim: autoindent expandtab tabstop=2 shiftwidth=2 softtabstop=2
