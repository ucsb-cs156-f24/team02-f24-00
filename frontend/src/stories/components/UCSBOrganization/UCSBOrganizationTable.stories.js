import React from "react";
import UCSBOrganizationTable from "main/components/UCSBOrganization/UCSBOrganizationTable";
import { ucsbOrganizationFixtures } from "fixtures/ucsbOrganizationFixtures";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import { http, HttpResponse } from "msw";

export default {
  title: "components/UCSBOrganization/UCSBOrganizationTable",
  component: UCSBOrganizationTable,
};

const Template = (args) => {
  return <UCSBOrganizationTable {...args} />;
};

export const Empty = Template.bind({});

Empty.args = {
  ucsborganization: [],
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.args = {
  ucsborganization: ucsbOrganizationFixtures.threeOrganizations,
  currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
  ucsborganization: ucsbOrganizationFixtures.threeOrganizations,
  currentUser: currentUserFixtures.adminUser,
};

ThreeItemsAdminUser.parameters = {
  msw: [
    http.delete("/api/ucsborganization", () => {
      return HttpResponse.json({}, { status: 200 });
    }),
  ],
};
