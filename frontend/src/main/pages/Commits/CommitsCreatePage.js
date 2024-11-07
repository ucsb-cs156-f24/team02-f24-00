import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import CommitForm from "main/components/Commits/CommitForm";
import { Navigate } from "react-router-dom";
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function CommitsCreatePage({ storybook = false }) {

  const addZ = (string) => `${string}Z`;

  const objectToAxiosParams = (commit) => ({
    url: "/api/commits/post",
    method: "POST",
    params: {
      message: commit.message,
      url: commit.url,
      authorLogin: commit.authorLogin,
      commitTime: addZ(commit.commitTime)
    },
  });

  const onSuccess = (commit) => {
    toast(
      `New commit Created - id: ${commit.id} message: ${commit.message}`,
    );
  };

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    ["/api/commits/all"], // mutation makes this key stale so that pages relying on it reload
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
        <h1>Create New Commit</h1>
        <CommitForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  );
}
