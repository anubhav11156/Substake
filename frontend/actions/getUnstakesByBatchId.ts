export const fetchUnstakesByBatchId = async (unstakeBatchId: number) => {
  const res = await fetch("/api/getUnstakesByBatchId", {
    method: "POST",
    body: JSON.stringify({ unstakeBatchId }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await res.json();
};
