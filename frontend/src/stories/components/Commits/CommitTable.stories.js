import React from "react";
import CommitTable from "main/components/Commits/CommitTable";
import { commitFixtures } from "fixtures/commitFixtures";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import { http, HttpResponse } from "msw";

export default {
  title: "components/Commits/CommitTable",
  component: CommitTable,
};

const Template = (args) => {
  return <CommitTable {...args} />;
};

export const Empty = Template.bind({});

Empty.args = {
  commits: [],
  currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.args = {
  commits: commitFixtures.threeCommits,
  currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
  commits: commitFixtures.threeCommits,
  currentUser: currentUserFixtures.adminUser,
};

ThreeItemsAdminUser.parameters = {
  msw: [
    http.delete("/api/commits", () => {
      return HttpResponse.json(
        { message: "Commit deleted successfully" },
        { status: 200 },
      );
    }),
  ],
};
