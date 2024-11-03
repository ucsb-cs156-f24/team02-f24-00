import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import HelpRequestEditPage from "main/pages/HelpRequest/HelpRequestEditPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

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
    useParams: () => ({
      id: 17,
    }),
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("HelpRequestEditPage tests", () => {
  describe("when the backend doesn't return data", () => {
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
      axiosMock.onGet("/api/helprequest", { params: { id: 17 } }).timeout();
    });

    const queryClient = new QueryClient();
    test("renders header but form is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HelpRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit Help Request");
      expect(
        screen.queryByTestId("HelpRequestForm-requesterEmail"),
      ).not.toBeInTheDocument();
      restoreConsole();
    });
  });
  describe("tests where backend is working normally", () => {
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
      axiosMock.onGet("/api/helprequest", { params: { id: 17 } }).reply(200, {
        id: 17,
        requesterEmail: "djensen@ucsb.edu",
        teamId: "staff",
        tableOrBreakoutRoom: "table 17",
        requestTime: "2024-10-11T12:00",
        explanation: "Question about PR Reviews",
        solved: "true",
      });
      axiosMock.onPut("/api/helprequest").reply(200, {
        id: "17",
        requesterEmail: "djensen2@outlook.com",
        teamId: "5pm-4",
        tableOrBreakoutRoom: "table 12",
        requestTime: "2024-03-11T08:00",
        explanation: "Code Review",
        solved: "false",
      });
    });

    const queryClient = new QueryClient();
    test("renders without crashing", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HelpRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("HelpRequestForm-requesterEmail");
    });

    test("Is populated with the data provided", async () => {
      await render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HelpRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const idField = screen.getByTestId("HelpRequestForm-id");
      const requesterEmailField = screen.getByTestId(
        "HelpRequestForm-requesterEmail",
      );
      const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
      const tableOrBreakoutRoomField = screen.getByTestId(
        "HelpRequestForm-tableOrBreakoutRoom",
      );
      const requestTimeField = screen.getByTestId(
        "HelpRequestForm-requestTime",
      );
      const explanationField = screen.getByTestId(
        "HelpRequestForm-explanation",
      );
      const solvedField = screen.getByTestId("HelpRequestForm-solved");
      const submitButton = screen.getByTestId("HelpRequestForm-submit");

      expect(idField).toHaveValue("17");
      expect(requesterEmailField).toHaveValue("djensen@ucsb.edu");
      expect(teamIdField).toHaveValue("staff");
      expect(tableOrBreakoutRoomField).toHaveValue("table 17");
      expect(requestTimeField).toHaveValue("2024-10-11T12:00");
      expect(explanationField).toHaveValue("Question about PR Reviews");
      expect(solvedField).toHaveValue("true");
      expect(submitButton).toBeInTheDocument();
    });

    test("Changes when you click Update", async () => {
      await render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HelpRequestEditPage />
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
      const requestTimeField = screen.getByTestId(
        "HelpRequestForm-requestTime",
      );
      const explanationField = screen.getByTestId(
        "HelpRequestForm-explanation",
      );
      const solvedField = screen.getByTestId("HelpRequestForm-solved");
      const submitButton = screen.getByTestId("HelpRequestForm-submit");
      expect(submitButton).toBeInTheDocument();

      fireEvent.change(requesterEmailField, {
        target: { value: "djensen2@outlook.com" },
      });
      fireEvent.change(teamIdField, { target: { value: "5pm-4" } });
      fireEvent.change(tableOrBreakoutRoomField, {
        target: { value: "table 12" },
      });
      fireEvent.change(requestTimeField, {
        target: { value: "2024-03-11T08:00" },
      });
      fireEvent.change(explanationField, {
        target: { value: "Code Review" },
      });
      fireEvent.change(solvedField, { target: { value: "false" } });

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "Help Request updated - id: 17 table: table 12",
      );
      expect(mockNavigate).toBeCalledWith({ to: "/helprequest" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          requesterEmail: "djensen2@outlook.com",
          teamId: "5pm-4",
          tableOrBreakoutRoom: "table 12",
          requestTime: "2024-03-11T08:00",
          explanation: "Code Review",
          solved: "false",
        }),
      ); // posted object
    });
  });
});
