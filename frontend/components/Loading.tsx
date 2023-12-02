import React from "react";

const Loading: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full z-50 flex justify-center items-center bg-[#FFDEAD]">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#afa445]" />
    </div>
  );
};

export default Loading;
