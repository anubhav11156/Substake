import { NextPage } from "next";
import { useConnect } from "wagmi";

import ApplicationLayout from "@/layouts/ApplicationLayout";

const UnstakePage: NextPage = () => {
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();

  return (
    <ApplicationLayout>
      <div className="max-w-[85rem] mx-auto w-full">
        <h1 className="text-center mt-10">Unstake</h1>

        <div>
          {connectors.map((connector) => (
            <button
              disabled={!connector.ready}
              key={connector.id}
              onClick={() => connect({ connector })}
            >
              {connector.name}
              {!connector.ready && " (unsupported)"}
              {isLoading &&
                connector.id === pendingConnector?.id &&
                " (connecting)"}
            </button>
          ))}

          {error && <div>{error.message}</div>}
        </div>
      </div>
    </ApplicationLayout>
  );
};

export default UnstakePage;
