var Package = require('dgeni').Package,
  _ = require('lodash');

// Create a new Dgeni package called less based on the jsdoc package from dgeni-packaes
var lessPackage = module.exports = new Package('less', [
    require('dgeni-packages/jsdoc')
]);

// Add LESS file reader and comment extractor
lessPackage.factory(require('./file-readers/less'));
lessPackage.processor(require('./processors/extract-less-comments'));

// Configure package
lessPackage.config(function (log, readFilesProcessor, parseTagsProcessor, lessFileReader) {
    // Add support for example tag
    parseTagsProcessor.tagDefinitions.push({name: 'example'});
    // The name tag should not be required
    _.find(parseTagsProcessor.tagDefinitions, {name: 'name'}).required = false;
    // Replace the jsdoc file reader
    readFilesProcessor.fileReaders = [lessFileReader];
});
