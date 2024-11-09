import React from "react";
import { useBackend } from "main/utils/useBackend";

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import CommitsTable from "main/components/Commits/CommitTable";
import { useCurrentUser, hasRole } from "main/utils/currentUser";
import { Button } from "react-bootstrap";

export default function CommitIndexPage() {
  const currentUser = useCurrentUser();

  const {
    data: commits,
    error: _error,
    status: _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    ["/api/commits/all"],
    { method: "GET", url: "/api/commits/all" },
    // Stryker disable next-line all : don't test default value of empty list
    [],
  );

  const createButton = () => {
    if (hasRole(currentUser, "ROLE_ADMIN")) {
      return (
        <Button
          variant="primary"
          href="/commits/create"
          style={{ float: "right" }}
        >
          Create Commit
        </Button>
      );
    }
  };

  return (
    <BasicLayout>
      <div className="pt-2">
        {createButton()}
        <h1>Commits</h1>
        <CommitsTable commits={commits} currentUser={currentUser} />
      </div>
    </BasicLayout>
  );
}
