import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { Navigate } from "react-router-dom";
import HelpRequestForm from "../../components/HelpRequest/HelpRequestForm";
import { toast } from "react-toastify";
import { useBackendMutation } from "../../utils/useBackend";

export default function HelpRequestCreatePage({ storybook = false }) {
  const objectToAxiosParams = (helpRequest) => ({
    url: "/api/helprequest/post",
    method: "POST",
    params: {
      requesterEmail: helpRequest.requesterEmail,
      teamId: helpRequest.teamId,
      tableOrBreakoutRoom: helpRequest.tableOrBreakoutRoom,
      requestTime: helpRequest.requestTime,
      explanation: helpRequest.explanation,
      solved: helpRequest.solved,
    },
  });

  const onSuccess = (helprequest) => {
    toast(
      `New help request created - id: ${helprequest.id} table: ${helprequest.tableOrBreakoutRoom}`,
    );
  };

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    ["/api/helprequest/all"],
  );

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (isSuccess && !storybook) {
    return <Navigate to="/helprequest" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New Help Request</h1>

        <HelpRequestForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  );
}
