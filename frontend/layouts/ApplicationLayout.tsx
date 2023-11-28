import { Suspense } from "react";

import Loading from "@/components/Loading";
import Navbar from "@/components/Navbar";

const ApplicationLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Suspense fallback={<Loading />}>
      <div className="w-full">
        <Navbar isConnectWallet={false} />
        {children}
      </div>
    </Suspense>
  );
};

export default ApplicationLayout;
