module.exports = {
  writerOpts: {
    transform: (commit, _context) => {
      if (!commit.type) {
        commit.type = 'misc' // Default type for unclassified commits
      }
      return commit
    },
    groupBy: false, // Do not group by type
    commitsSort: ['commit', 'scope'], // Sort by commit message and scope
  },
  parserOpts: {
    noteKeywords: [], // Leave this empty to prevent filtering
  },
  releaseRules: [
    { type: '*', release: 'patch' }, // Include all commits
  ],
}
