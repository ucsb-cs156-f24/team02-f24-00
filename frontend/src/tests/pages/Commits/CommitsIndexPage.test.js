import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import CommitsIndexPage from "main/pages/Commits/CommitsIndexPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";
import { commitFixtures } from "fixtures/commitFixtures";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

describe("CommitIndexPage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  const testId = "CommitTable";


  const setupUserOnly = () => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  };

  const setupAdminUser = () => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.adminUser);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  };

  const queryClient = new QueryClient();

  test("Renders with Create Button for admin user", async () => {
    setupAdminUser();
    axiosMock.onGet("/api/commits/all").reply(200, []);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CommitsIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Create Commit/)).toBeInTheDocument();
    });
    const button = screen.getByText(/Create Commit/);
    expect(button).toHaveAttribute("href", "/commits/create");
    expect(button).toHaveAttribute("style", "float: right;");
  });

  test("renders three commits correctly for regular user", async () => {
    setupUserOnly();
    axiosMock.onGet("/api/commits/all").reply(200, commitFixtures.threeCommits);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CommitsIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-id`),
      ).toHaveTextContent("1");
    });
    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent(
      "3",
    );
    expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent(
      "4",
    );

    const createButton = screen.queryByText("Create Commit");
    expect(createButton).not.toBeInTheDocument();

    const message = screen.getByText("pc - updated tests for blah controller");
    expect(message).toBeInTheDocument();

    const url = screen.getByText(
      "https://github.com/ucsb-cs156-f24/team02-f24-00/commit/fe7825cf06b420552141f587a9499273b6d09916",
    );
    expect(url).toBeInTheDocument();

    const authorLogin = screen.getByText("pconrad");
    expect(authorLogin).toBeInTheDocument();

    // for non-admin users, details button is visible, but the edit and delete buttons should not be visible
    expect(
      screen.queryByTestId("RestaurantTable-cell-row-0-col-Delete-button"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("RestaurantTable-cell-row-0-col-Edit-button"),
    ).not.toBeInTheDocument();
  });

  test("renders empty table when backend unavailable, user only", async () => {
    setupUserOnly();

    axiosMock.onGet("/api/commits/all").timeout();

    const restoreConsole = mockConsole();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CommitsIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1);
    });

    const errorMessage = console.error.mock.calls[0][0];
    expect(errorMessage).toMatch(
      "Error communicating with backend via GET on /api/commits/all",
    );
    restoreConsole();
  });

  test("what happens when you click delete, admin", async () => {
    setupAdminUser();

    axiosMock.onGet("/api/commits/all").reply(200, commitFixtures.threeCommits);
    axiosMock
      .onDelete("/api/commits")
      .reply(200, "Commit with id 1 was deleted");


    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CommitsIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-id`),
      ).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent(
      "1",
    );

    const deleteButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Delete-button`,
    );
    expect(deleteButton).toBeInTheDocument();

    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith("Commit with id 1 was deleted");
    });

    await waitFor(() => {
      expect(axiosMock.history.delete.length).toBe(1);
    });
    expect(axiosMock.history.delete[0].url).toBe("/api/commits");
    expect(axiosMock.history.delete[0].params).toEqual({ id: 1 });

  });
});
