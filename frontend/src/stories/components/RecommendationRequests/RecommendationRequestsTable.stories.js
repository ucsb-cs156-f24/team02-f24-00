import React from 'react';
import RecommendationRequestTable from "main/components/RecommendationRequests/RecommendationRequestTable";
import { recommendationRequestsFixtures } from 'fixtures/recommendationRequestsFixtures';
import { currentUserFixtures } from 'fixtures/currentUserFixtures';
import { rest } from "msw";

export default {
    title: 'components/RecommendationRequests/RecommendationRequestTable',
    component: RecommendationRequestTable
};

const Template = (args) => {
    return (
        <RecommendationRequestTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    recommendationrequests: []
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.args = {
    recommendationrequests: recommendationRequestsFixtures.threerecommendationrequests,
    currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
    recommendationrequests: recommendationRequestsFixtures.threerecommendationrequests,
    currentUser: currentUserFixtures.adminUser,
}

ThreeItemsAdminUser.parameters = {
    msw: [
        rest.delete('/api/ucsbrecommendationrequests', (req, res, ctx) => {
            window.alert("DELETE: " + JSON.stringify(req.url));
            return res(ctx.status(200),ctx.json({}));
        }),
    ]
};