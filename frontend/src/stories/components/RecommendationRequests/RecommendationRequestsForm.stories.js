import React from 'react';
import RecommendationRequestForm from "main/components/RecommendationRequests/RecommendationRequestForm"
import { recommendationRequestsFixtures } from 'fixtures/ucsbRecommendationRequestsFixtures';

export default {
    title: 'components/RecommendationRequests/RecommendationRequestForm',
    component: RecommendationRequestForm
};


const Template = (args) => {
    return (
        <RecommendationRequestForm {...args} />
    )
};

export const Create = Template.bind({});

Create.args = {
    buttonLabel: "Create",
    submitAction: (data) => {
        console.log("Submit was clicked with data: ", data); 
        window.alert("Submit was clicked with data: " + JSON.stringify(data));
   }
};

export const Update = Template.bind({});

Update.args = {
    initialContents: recommendationRequestsFixtures.oneRecommendationrequests,
    buttonLabel: "Update",
    submitAction: (data) => {
        console.log("Submit was clicked with data: ", data); 
        window.alert("Submit was clicked with data: " + JSON.stringify(data));
   }
};