import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export function removeZ(myString) {
  return myString.replace("Z", "");
}

function CommitForm({ initialContents, submitAction, buttonLabel = "Create" }) {
  const defaultValues = initialContents
    ? {
        ...initialContents,
        commitTime: removeZ(initialContents.commitTime),
      }
    : {};

  // Stryker disable all
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues });
  // Stryker restore all

  const navigate = useNavigate();

  const testIdPrefix = "CommitForm";

  // For explanation, see: https://stackoverflow.com/questions/3143070/javascript-regex-iso-datetime
  // Note that even this complex regex may still need some tweaks

  // Stryker disable Regex
  const isodate_regex =
    /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/i;
  // Stryker restore Regex

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
        <Form.Label htmlFor="message">Message</Form.Label>
        <Form.Control
          data-testid={testIdPrefix + "-message"}
          id="message"
          type="text"
          isInvalid={Boolean(errors.message)}
          {...register("message", {
            required: "Message is required.",
            maxLength: {
              value: 255,
              message: "Max length 255 characters",
            },
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.message?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="url">Url</Form.Label>
        <Form.Control
          id="url"
          type="text"
          isInvalid={Boolean(errors.url)}
          {...register("url", {
            required: "Url is required.",
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.url?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="authorLogin">Author Login</Form.Label>
        <Form.Control
          id="authorLogin"
          type="text"
          isInvalid={Boolean(errors.authorLogin)}
          {...register("authorLogin", {
            required: "Author Login is required.",
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.authorLogin?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="commitTime">Commit Time (in UTC)</Form.Label>
        <Form.Control
          id="commitTime"
          type="datetime-local"
          isInvalid={Boolean(errors.commitTime)}
          {...register("commitTime", {
            required: true,
            pattern: isodate_regex,
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.commitTime && "Commit Time is required. "}
        </Form.Control.Feedback>
      </Form.Group>

      <Button type="submit">{buttonLabel}</Button>
      <Button
        variant="Secondary"
        onClick={() => navigate(-1)}
        data-testid={testIdPrefix + "-cancel"}
      >
        Cancel
      </Button>
    </Form>
  );
}

export default CommitForm;
