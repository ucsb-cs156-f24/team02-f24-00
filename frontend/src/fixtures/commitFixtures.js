const commitFixtures = {
  oneCommit: {
    id: 1,
    message: "pc - updated tests for blah controller",
    url: "https://github.com/ucsb-cs156-f24/team02-f24-00/commit/fe7825cf06b420552141f587a9499273b6d09916",
    authorLogin: "pconrad",
    commitTime: "2024-10-31T12:34:00Z",
  },
  threeCommits: [
    {
      id: 1,
      message: "pc - updated tests for blah controller",
      url: "https://github.com/ucsb-cs156-f24/team02-f24-00/commit/fe7825cf06b420552141f587a9499273b6d09916",
      authorLogin: "pconrad",
      commitTime: "2024-10-31T12:34:00Z",
    },
    {
      id: 3,
      message: "dj-added backend files for help request",
      url: "https://github.com/ucsb-cs156-f24/team02-f24-00/commit/51987a8c30e3f1014cc0c40438b48df66682448b",
      authorLogin: "Division7",
      commitTime: "2024-10-31T12:34:00Z",
    },
    {
      id: 4,
      message: "dj - forgot the linter existed. ran it now ",
      url: "https://github.com/ucsb-cs156-f24/team02-f24-00/pull/77/commits/25abe6abe91ce7a8b69afe56672f797a31e7b230",
      authorLogin: "Division7",
      commitTime: "2024-11-04T15:12:00Z",
    },
  ],
};

export { commitFixtures };
