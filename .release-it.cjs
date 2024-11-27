module.exports = {
  plugins: {
    '@release-it/conventional-changelog': {
      infile: 'CHANGELOG.md',
      preset: 'conventionalcommits'
      // preset: {
      //   name: 'angular',
      //   parserOpts: {
      //     noteKeywords: [], // Disable filtering by note keywords
      //   },
      //   writerOpts: {
      //     transform: (commit) => {
      //       // Ensure every commit is included
      //       if (!commit.type) {
      //         commit.type = 'misc' // Assign a default type to uncategorized commits
      //       }
      //       return commit
      //     },
      //   },
      // },
    },
  },
  git: {
    requireCleanWorkingDir: true,
    commitMessage: 'chore: release ${version}',
    tagName: 'v${version}',
    push: true,
  },
}
