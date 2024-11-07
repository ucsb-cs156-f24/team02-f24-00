import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { http, HttpResponse } from "msw";

import CommitsCreatePage from "main/pages/Commits/CommitsCreatePage";

import { commitFixtures } from "fixtures/commitFixtures";

export default {
  title: "pages/Commits/CommitsCreatePage",
  component: CommitsCreatePage,
};

const Template = () => <CommitsCreatePage storybook={true} />;

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
    http.post("/api/commits/post", () => {
      return HttpResponse.json(commitFixtures.oneCommit, { status: 200 });
    }),
  ],
};
