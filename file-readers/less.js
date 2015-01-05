var _ = require('lodash');

var COMMENT_START = /^\s*\/\*\*/,
  COMMENT_END = /^\s*\*\//;

/**
 * This service reads LESS files and extract jsdoc styles comments.
 * It doesn't parse tags inside comments.
 */
module.exports = function lessFileReader(log) {
  return {
    name: 'lessFileReader',
    defaultPattern: /\.less$/,
    getDocs: function(fileInfo) {
      var isComment = false;
      var commentLines = String(fileInfo.content)
        .trim()
        .replace(/\r\n|\r|\n *\n/g, '\n')
        .split('\n');

      /**
       * Reduce lines to comment blocks
       */
      fileInfo.comments = _.reduce(commentLines, function (commentBlocks, commentLine) {
        if (COMMENT_START.test(commentLine)) {
          isComment = true;
          commentBlocks.push(['*']);
          return commentBlocks;
        }
        if (isComment) {
          if (COMMENT_END.test(commentLine)) {
            commentBlocks[commentBlocks.length - 1].push('*');
            isComment = false;
          } else {
            commentBlocks[commentBlocks.length - 1].push(commentLine);
          }
        }
        return commentBlocks;
      }, []).map(function (block) {
        return {
          type: 'Block',
          value: block.join('\n')
        };
      });

      return [{
        docType: 'lessFile'
      }];
    }
  };
};
