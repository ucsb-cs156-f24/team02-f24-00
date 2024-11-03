import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import HelpRequestForm from "../../../main/components/HelpRequest/HelpRequestForm";
import { helpRequestFixtures } from "../../../fixtures/helpRequestFixtures";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("HelpRequestForm tests", () => {
  test("renders correctly", async () => {
    await render(
      <Router>
        <HelpRequestForm />
      </Router>,
    );
    expect(screen.getByText(/Explanation/)).toBeInTheDocument();
    expect(screen.getByText(/Create/)).toBeInTheDocument();
  });

  test("renders correctly when passing in a HelpRequest", async () => {
    await render(
      <Router>
        <HelpRequestForm
          initialContents={helpRequestFixtures.oneHelpRequest[0]}
        />
      </Router>,
    );
    expect(screen.getByText(/Id/)).toBeInTheDocument();
    expect(screen.getByTestId(/HelpRequestForm-id/)).toHaveValue("1");
  });

  test("Correct Error messages on bad input", async () => {
    await render(
      <Router>
        <HelpRequestForm />
      </Router>,
    );
    const requesterEmailField = screen.getByTestId(
      "HelpRequestForm-requesterEmail",
    );
    const submitButton = screen.getByTestId("HelpRequestForm-submit");

    fireEvent.change(requesterEmailField, { target: { value: "bad-input" } });
    fireEvent.click(submitButton);

    await screen.findByText(/Requester Email must match email format\./);
  });

  test("Correct Error messages on missing input", async () => {
    await render(
      <Router>
        <HelpRequestForm />
      </Router>,
    );
    const submitButton = screen.getByTestId("HelpRequestForm-submit");

    fireEvent.click(submitButton);

    await screen.findByText(/Requester Email is required\./);
    expect(screen.getByText(/Team ID is required\./)).toBeInTheDocument();
    expect(
      screen.getByText(/Table or Breakout Room is required\./),
    ).toBeInTheDocument();
    expect(screen.getByText(/Request Time is required\./)).toBeInTheDocument();
    expect(screen.getByText(/Explanation is required\./)).toBeInTheDocument();
    expect(screen.getByText(/Resolution is required\./)).toBeInTheDocument();
  });

  test("No Error messsages on good input", async () => {
    const mockSubmitAction = jest.fn();

    await render(
      <Router>
        <HelpRequestForm submitAction={mockSubmitAction} />
      </Router>,
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

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    expect(
      screen.queryByText(/Requester Email must match email format\./),
    ).not.toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    await render(
      <Router>
        <HelpRequestForm />
      </Router>,
    );
    const cancelButton = screen.getByTestId("HelpRequestForm-cancel");

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});
