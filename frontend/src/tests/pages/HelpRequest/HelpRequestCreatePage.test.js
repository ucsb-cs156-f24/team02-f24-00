import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import HelpRequestCreatePage from "../../../main/pages/HelpRequest/HelpRequestCreatePage";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...originalModule,
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("HelpRequestCreatePage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  });

  const queryClient = new QueryClient();
  test("renders without crashing", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("HelpRequestForm-requesterEmail"),
      ).toBeInTheDocument();
    });
  });

  test("when you fill in the form and hit submit, it makes a request to the backend", async () => {
    const queryClient = new QueryClient();
    const helpRequest = {
      id: 17,
      requesterEmail: "djensen@ucsb.edu",
      teamId: "staff",
      tableOrBreakoutRoom: "table 17",
      requestTime: "2024-10-11T12:00",
      explanation: "Question about PR Reviews",
      solved: "true",
    };

    axiosMock.onPost("/api/helprequest/post").reply(202, helpRequest);

    await render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const requesterEmailField = screen.getByTestId(
      "HelpRequestForm-requesterEmail",
    );
    const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
    const tableOrBreakoutRoomField = screen.getByTestId(
      "HelpRequestForm-tableOrBreakoutRoom",
    );
    const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
    const explanationField = screen.getByTestId("HelpRequestForm-explanation");
    const solvedField = screen.getByTestId("HelpRequestForm-solved");
    const submitButton = screen.getByTestId("HelpRequestForm-submit");

    fireEvent.change(requesterEmailField, {
      target: { value: "djensen@ucsb.edu" },
    });
    fireEvent.change(teamIdField, { target: { value: "staff" } });
    fireEvent.change(tableOrBreakoutRoomField, {
      target: { value: "table 17" },
    });
    fireEvent.change(requestTimeField, {
      target: { value: "2024-10-11T12:00" },
    });
    fireEvent.change(explanationField, {
      target: { value: "Question about PR Reviews" },
    });
    fireEvent.change(solvedField, { target: { value: "true" } });

    fireEvent.click(submitButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      requesterEmail: "djensen@ucsb.edu",
      teamId: "staff",
      tableOrBreakoutRoom: "table 17",
      requestTime: "2024-10-11T12:00",
      explanation: "Question about PR Reviews",
      solved: "true",
    });

    expect(mockToast).toBeCalledWith(
      "New help request created - id: 17 table: table 17",
    );
    expect(mockNavigate).toBeCalledWith({ to: "/helprequest" });
  });
});
