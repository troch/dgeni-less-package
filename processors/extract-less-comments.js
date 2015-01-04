var _ = require('lodash');
var LEADING_STAR = /^[^\S\r\n]*\*[^\S\n\r]?/gm;

/**
 * This processor will create a doc for each jsdoc style comment in each lessFile
 * doc in the docs collection.
 * It will optionaly remove those lessFile docs from the collection by setting the
 * `removeLessFileDocs` property.
 *
 * The doc will initially have the form:
 * ```
 * {
 *   fileInfo: { ... },
 *   content: 'the content of the comment',
 *   startingLine: xxx,
 *   endingLine: xxx
 * }
 * ```
 */
module.exports = function extracLessCommentsProcessor() {
  return {
    $runAfter: ['files-read'],
    $runBefore: ['parsing-tags'],
    $validate: {
      removeLessFileDocs: { presence: true }
    },
    removeLessFileDocs: true,
    $process: function(docs) {

      var commentDocs = [];
      var processor = this;

      // Extract all the `jsFile` docs from the docs collection
      docs = _.filter(docs, function(doc) {

        if ( doc.docType !== 'lessFile' ) {
          return true;
        }

        // Generate a doc for each jsdoc style comment
        _.forEach(doc.fileInfo.comments, function(comment) {
          // To test for a jsdoc comment (i.e. starting with /** ), we need to check for a
          // star in the first character since the parser strips off the "/*" comment identifier
          if ( comment.type === 'Block' && comment.value.charAt(0) === '*' ) {
            // Strip off any leading stars and
            // trim off leading and trailing whitespace
            var text = comment.value.replace(LEADING_STAR, '').trim();

            // Create a doc from this comment
            commentDocs.push({
              fileInfo: doc.fileInfo,
              // startingLine: comment.loc.start.line,
              // endingLine: comment.loc.end.line,
              content: text,
              docType: 'less'
            });
          }
        });

        return !processor.removeLessFileDocs;
      });

      // Add the new comment docs to the docs collection
      return docs.concat(commentDocs);
    }
  };
};
