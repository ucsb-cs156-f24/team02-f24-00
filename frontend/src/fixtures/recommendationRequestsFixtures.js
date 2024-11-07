const recommendationRequestsFixtures = {
    oneRecommendationrequests:
    [
      {
       "id": 1,
        "requesterEmail": "requester email 1",
        "professorEmail": "professor email 1",
        "explanation": "explanation 1",
        "dateRequested": "2022-01-02T12:00:00",
        "dateNeeded": "2022-02-02T12:00:00",
        "done": true  
      }
    ],
    threerecommendationrequests:
    [
        {
            "id": 2,
             "requesterEmail": "requester email 2",
             "professorEmail": "professor email 2",
             "explanation": "explanation 2",
             "dateRequested": "2022-03-02T12:00:00",
             "dateNeeded": "2022-04-02T12:00:00",
             "done": true  
        },
        {
            "id": 3,
             "requesterEmail": "requester email 3",
             "professorEmail": "professor email 3",
             "explanation": "explanation 3",
             "dateRequested": "2022-05-02T12:00:00",
             "dateNeeded": "2022-06-02T12:00:00",
             "done": false  
        },
        {
            "id": 4,
             "requesterEmail": "requester email 4",
             "professorEmail": "professor email 4",
             "explanation": "explanation 4",
             "dateRequested": "2022-07-02T12:00:00",
             "dateNeeded": "2022-08-02T12:00:00",
             "done": false  
        }
        
    ]
};
export { recommendationRequestsFixtures };