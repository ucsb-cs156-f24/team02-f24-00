import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import CommitsCreatePage from "main/pages/Commits/CommitsCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

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

describe("CommitsCreatePage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    jest.clearAllMocks();

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
          <CommitsCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Message")).toBeInTheDocument();
    });
  });

  test("on submit, makes request to backend, and redirects to /commits", async () => {
    const queryClient = new QueryClient();

    const commit = {
      id: 7,
      message: "pc - updated tests for blah controller",
      url: "https://github.com/ucsb-cs156-f24/team02-f24-00/commit/fe7825cf06b420552141f587a9499273b6d09916",
      authorLogin: "pconrad",
      commitTime: "2024-10-31T12:34:12Z",
    };

    axiosMock.onPost("/api/commits/post").reply(202, commit);


    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CommitsCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Message")).toBeInTheDocument();
    });

    const messageInput = screen.getByLabelText("Message");
    expect(messageInput).toBeInTheDocument();

    const urlInput = screen.getByLabelText("Url");
    expect(urlInput).toBeInTheDocument();

    const authorLoginInput = screen.getByLabelText("Author Login");
    expect(authorLoginInput).toBeInTheDocument();

    const commitTimeInput = screen.getByLabelText("Commit Time (in UTC)");
    expect(commitTimeInput).toBeInTheDocument();

    const createButton = screen.getByText("Create");
    expect(createButton).toBeInTheDocument();

    fireEvent.change(messageInput, {
      target: { value: "pc - updated tests for blah controller" },
    });
    fireEvent.change(urlInput, {
      target: {
        value:
          "https://github.com/ucsb-cs156-f24/team02-f24-00/commit/fe7825cf06b420552141f587a9499273b6d09916",
      },
    });
    fireEvent.change(authorLoginInput, { target: { value: "pconrad" } });
    fireEvent.change(commitTimeInput, {
      target: { value: "2024-10-31T12:34:12" },
    });

    fireEvent.click(createButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      message: "pc - updated tests for blah controller",
      url: "https://github.com/ucsb-cs156-f24/team02-f24-00/commit/fe7825cf06b420552141f587a9499273b6d09916",
      authorLogin: "pconrad",
      commitTime: "2024-10-31T12:34:12.000Z",
    });

    // assert - check that the toast was called with the expected message
    expect(mockToast).toHaveBeenCalledWith(
      "New commit Created - id: 7 message: pc - updated tests for blah controller",
    );
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/commits" });

  });
});
