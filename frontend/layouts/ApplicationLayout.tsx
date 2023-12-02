import { Suspense } from "react";

import Loading from "@/components/Loading";
import Navbar from "@/components/Navbar";

const ApplicationLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="w-full">
      <Navbar isConnectWallet={false} />
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </div>
  );
};

export default ApplicationLayout;
