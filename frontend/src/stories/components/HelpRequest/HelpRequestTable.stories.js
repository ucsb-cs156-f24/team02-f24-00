import React from "react";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import { http, HttpResponse } from "msw";
import HelpRequestTable from "../../../main/components/HelpRequest/HelpRequestTable";
import { helpRequestFixtures } from "../../../fixtures/helpRequestFixtures";

export default {
  title: "components/HelpRequest/HelpRequestTable",
  component: HelpRequestTable,
};

const Template = (args) => {
  return <HelpRequestTable {...args} />;
};

export const Empty = Template.bind({});

Empty.args = {
  dates: [],
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.args = {
  helpRequests: helpRequestFixtures.threeHelpRequest,
  currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
  helpRequests: helpRequestFixtures.threeHelpRequest,
  currentUser: currentUserFixtures.adminUser,
};

ThreeItemsAdminUser.parameters = {
  msw: [
    http.delete("/api/helprequest", () => {
      return HttpResponse.json({}, { status: 200 });
    }),
  ],
};
