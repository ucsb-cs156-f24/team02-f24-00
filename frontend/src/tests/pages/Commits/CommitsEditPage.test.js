import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import CommitsEditPage from "main/pages/Commits/CommitsEditPage";

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

describe("CommitsEditPage tests", () => {
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
      axiosMock.onGet("/api/commits", { params: { id: 17 } }).timeout();
    });

    const queryClient = new QueryClient();
    test("renders header but form is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <CommitsEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit Commit");
      expect(screen.queryByTestId("Commit-message")).not.toBeInTheDocument();
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
      axiosMock.onGet("/api/commits", { params: { id: 17 } }).reply(200, {
        id: 17,
        message: "pc - updated tests for blah controller",
        url: "https://github.com/ucsb-cs156-f24/team02-f24-00/commit/fe7825cf06b420552141f587a9499273b6d09916",
        authorLogin: "pconrad",
        commitTime: "2024-10-31T12:34:01Z",
      });
      axiosMock.onPut("/api/commits").reply(200, {
        id: 17,
        message: "pc - updated tests for blah controller edits",
        url: "https://github.com/ucsb-cs156-f24/team02-f24-01/commit/fe7825cf06b420552141f587a9499273b6d09916",
        authorLogin: "Division7",
        commitTime: "2024-10-30T12:34:02Z",
      });
    });

    const queryClient = new QueryClient();

    test("Is populated with the data provided, and changes when data is changed", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <CommitsEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("CommitForm-id");

      const idField = screen.getByTestId("CommitForm-id");
      const messageField = screen.getByTestId("CommitForm-message");
      const urlField = screen.getByLabelText("Url");
      const authorLoginField = screen.getByLabelText("Author Login");
      const commitTimeField = screen.getByLabelText("Commit Time (in UTC)");

      const submitButton = screen.getByText("Update");

      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue("17");

      expect(messageField).toBeInTheDocument();
      expect(messageField).toHaveValue(
        "pc - updated tests for blah controller",
      );

      expect(urlField).toBeInTheDocument();
      expect(urlField).toHaveValue(
        "https://github.com/ucsb-cs156-f24/team02-f24-00/commit/fe7825cf06b420552141f587a9499273b6d09916",
      );

      expect(authorLoginField).toBeInTheDocument();
      expect(authorLoginField).toHaveValue("pconrad");

      expect(commitTimeField).toBeInTheDocument();
      expect(commitTimeField).toHaveValue("2024-10-31T12:34:01.000");

      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(messageField, {
        target: { value: "pc - updated tests for blah controller edits" },
      });
      fireEvent.change(urlField, {
        target: {
          value:
            "https://github.com/ucsb-cs156-f24/team02-f24-01/commit/fe7825cf06b420552141f587a9499273b6d09916",
        },
      });
      fireEvent.change(authorLoginField, {
        target: { value: "Division7" },
      });
      fireEvent.change(commitTimeField, {
        target: { value: "2024-10-30T12:34:02" },
      });

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toHaveBeenCalled());
      expect(mockToast).toHaveBeenCalledWith(
        "Commit Updated - id: 17 message: pc - updated tests for blah controller edits",
      );

      expect(mockNavigate).toHaveBeenCalledWith({ to: "/commits" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          message: "pc - updated tests for blah controller edits",
          url: "https://github.com/ucsb-cs156-f24/team02-f24-01/commit/fe7825cf06b420552141f587a9499273b6d09916",
          authorLogin: "Division7",
          commitTime: "2024-10-30T12:34:02.000Z",
        }),
      ); // posted object
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/commits" });
    });
  });
});
