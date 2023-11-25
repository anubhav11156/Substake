import Navbar from "@/components/Navbar";

const ApplicationLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="w-full">
      <Navbar isConnectWallet={false} />
      {children}
    </div>
  );
};

export default ApplicationLayout;
