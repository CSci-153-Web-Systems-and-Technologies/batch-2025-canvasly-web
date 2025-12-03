import PurchaseCard from "@/components/purchase-card";
import React from "react";

const PurchasePage = () => {
  return (
    <div className="w-full pb-1 md:pb-10 md:px-10 bg-[#f5f5f5] flex flex-col items-center justify-center pt-16 md:pt-32">
      <div className="max-w-7xl mx-auto flex flex-col gap-1 w-full p-4 bg-background mb-1 border rounded-md mt-2 md:mt-0">
        <p className="text-3xl font-semibold ">Pending Purchases</p>
      </div>
      <PurchaseCard></PurchaseCard>
    </div>
  );
};

export default PurchasePage;
