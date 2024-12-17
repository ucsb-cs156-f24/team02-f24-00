import React from "react";
import CommitForm from "main/components/Commits/CommitForm";
import { commitFixtures } from "fixtures/commitFixtures";

export default {
  title: "components/Commits/CommitForm",
  component: CommitForm,
};

const Template = (args) => {
  return <CommitForm {...args} />;
};

export const Create = Template.bind({});

Create.args = {
  buttonLabel: "Create",
  submitAction: (data) => {
    console.log("Submit was clicked with data: ", data);
    window.alert("Submit was clicked with data: " + JSON.stringify(data));
  },
};

export const Update = Template.bind({});

Update.args = {
  initialContents: commitFixtures.oneCommit,
  buttonLabel: "Update",
  submitAction: (data) => {
    console.log("Submit was clicked with data: ", data);
    window.alert("Submit was clicked with data: " + JSON.stringify(data));
  },
};
