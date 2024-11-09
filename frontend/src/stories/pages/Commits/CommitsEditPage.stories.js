import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { http, HttpResponse } from "msw";

import CommitsEditPage from "main/pages/Commits/CommitsEditPage";
import { commitFixtures } from "fixtures/commitFixtures";

export default {
  title: "pages/Commits/CommitsEditPage",
  component: CommitsEditPage,
};

const Template = () => <CommitsEditPage storybook={true} />;

export const Default = Template.bind({});
Default.parameters = {
  msw: [
    http.get("/api/currentUser", () => {
      return HttpResponse.json(apiCurrentUserFixtures.userOnly, {
        status: 200,
      });
    }),
    http.get("/api/systemInfo", () => {
      return HttpResponse.json(systemInfoFixtures.showingNeither, {
        status: 200,
      });
    }),
    http.get("/api/commits", () => {
      return HttpResponse.json(commitFixtures.threeCommits[0], {
        status: 200,
      });
    }),
    http.put("/api/commits", () => {
      return HttpResponse.json(
        {
          id: 17,
          message: "pc - updated tests for blah controller edits",
          url: "https://github.com/ucsb-cs156-f24/team02-f24-01/commit/fe7825cf06b420552141f587a9499273b6d09916",
          authorLogin: "Division7",
          commitTime: "2024-10-30T12:34:02Z",
        },
        { status: 200 },
      );
    }),
  ],
};
