const helpRequestFixtures = {
  oneHelpRequest: [
    {
      id: 1,
      requesterEmail: "djensen@ucsb.edu",
      teamId: "staff",
      tableOrBreakoutRoom: "table 17",
      requestTime: "2024-03-11T08:00:00",
      explanation: "Need clarification on a PR",
      solved: "true",
    },
  ],
  threeHelpRequest: [
    {
      id: 1,
      requesterEmail: "djensen@ucsb.edu",
      teamId: "staff",
      tableOrBreakoutRoom: "table 17",
      requestTime: "2024-03-11T08:00:00",
      explanation: "Need clarification on a PR",
      solved: "true",
    },
    {
      id: 2,
      requesterEmail: "djensen2@outlook.com",
      teamId: "5pm-4",
      tableOrBreakoutRoom: "table 12",
      requestTime: "2024-10-11T08:00:00",
      explanation: "Need staff approval for a retro",
      solved: "false",
    },
    {
      id: 3,
      requesterEmail: "phtcon@ucsb.edu",
      teamId: "5",
      tableOrBreakoutRoom: "table 5",
      requestTime: "2024-12-23T08:00:00",
      explanation: "Need code support",
      solved: "true",
    },
  ],
};

export {helpRequestFixtures}