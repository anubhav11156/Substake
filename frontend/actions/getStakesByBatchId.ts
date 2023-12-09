export const fetchStakesByBatchId = async (stakeBatchId: number) => {
  const res = await fetch("/api/getStakesByBatchId", {
    method: "POST",
    body: JSON.stringify({ stakeBatchId }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await res.json();
};
