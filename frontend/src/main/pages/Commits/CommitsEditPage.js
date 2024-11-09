import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import CommitForm from "main/components/Commits/CommitForm";
import { Navigate } from "react-router-dom";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function CommitEditPage({ storybook = false }) {
  let { id } = useParams();

  const {
    data: commit,
    _error,
    _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    [`/api/commits?id=${id}`],
    {
      // Stryker disable next-line all : GET is the default, so mutating this to "" doesn't introduce a bug
      method: "GET",
      url: `/api/commits`,
      params: {
        id,
      },
    },
  );

  const objectToAxiosPutParams = (commit) => ({
    url: "/api/commits",
    method: "PUT",
    params: {
      id: commit.id,
    },
    data: {
      message: commit.message,
      url: commit.url,
      authorLogin: commit.authorLogin,
      commitTime: `${commit.commitTime}Z`,
    },
  });

  const onSuccess = (commit) => {
    toast(`Commit Updated - id: ${commit.id} message: ${commit.message}`);
  };

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/commits?id=${id}`],
  );

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (isSuccess && !storybook) {
    return <Navigate to="/commits" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit Commit</h1>
        {commit && (
          <CommitForm
            submitAction={onSubmit}
            buttonLabel={"Update"}
            initialContents={commit}
          />
        )}
      </div>
    </BasicLayout>
  );
}
