import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button, Form } from "react-bootstrap";

export default function HelpRequestForm({
  initialContents,
  submitAction,
  buttonLabel = "Create",
}) {
  // Stryker disable all
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues: initialContents || {} });
  // Stryker restore all

  const navigate = useNavigate();
  //Stryker disable Regex
  const emailRegex = /\w+@\w+\.\w{1,3}/i;
  //Stryker restore Regex

  const testIdPrefix = "HelpRequestForm";

  return (
    <Form onSubmit={handleSubmit(submitAction)}>
      {initialContents && (
        <Form.Group className="mb-3">
          <Form.Label htmlFor="id">Id</Form.Label>
          <Form.Control
            data-testid={testIdPrefix + "-id"}
            id="id"
            type="text"
            {...register("id")}
            value={initialContents.id}
            disabled
          />
        </Form.Group>
      )}
      <Form.Group className="mb-3">
        <Form.Label htmlFor="requesterEmail">Requester Email</Form.Label>
        <Form.Control
          data-testid={testIdPrefix + "-requesterEmail"}
          id="requesterEmail"
          type="text"
          {...register("requesterEmail", {
            required: true,
            pattern: emailRegex,
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.requesterEmail && "Requester Email is required."}
          {errors.requesterEmail?.type === "pattern" &&
            "Requester Email must match email format."}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="teamId">Team ID</Form.Label>
        <Form.Control
          data-testid={testIdPrefix + "-teamId"}
          id="teamId"
          type="text"
          {...register("teamId", {
            required: true,
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.teamId && "Team ID is required."}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="tableOrBreakoutRoom">
          Table or Breakout Room
        </Form.Label>
        <Form.Control
          data-testid={testIdPrefix + "-tableOrBreakoutRoom"}
          id="tableOrBreakoutRoom"
          type="text"
          {...register("tableOrBreakoutRoom", {
            required: true,
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.tableOrBreakoutRoom && "Table or Breakout Room is required."}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="requestTime">Request Time</Form.Label>
        <Form.Control
          data-testid={testIdPrefix + "-requestTime"}
          id="requestTime"
          type="datetime-local"
          {...register("requestTime", {
            required: true,
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.requestTime && "Request Time is required."}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="explanation">Explanation</Form.Label>
        <Form.Control
          data-testid={testIdPrefix + "-explanation"}
          id="explanation"
          type="text"
          {...register("explanation", {
            required: true,
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.explanation && "Explanation is required."}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="solved">Request Resolved?</Form.Label>
        <Form.Control
          data-testid={testIdPrefix + "-solved"}
          id="solved"
          as="select"
          {...register("solved", {
            required: true,
            minLength: 1,
          })}
        >
          <option value="">Choose an option</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </Form.Control>
        <Form.Control.Feedback type="invalid">
          {errors.solved && "Resolution is required."}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group>
        <Button type="submit" data-testid="HelpRequestForm-submit">
          {buttonLabel}
        </Button>
        <Button
          variant="Secondary"
          onClick={() => navigate(-1)}
          data-testid="HelpRequestForm-cancel"
        >
          Cancel
        </Button>
      </Form.Group>
    </Form>
  );
}
