import BASE_URL from "./api";

// Apply service
export const applyService = async (data: any) => {
  const res = await fetch(`${BASE_URL}/citizen/apply`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

// Get application status
export const getStatus = async (userId: string) => {
  const res = await fetch(`${BASE_URL}/citizen/status/${userId}`);
  return res.json();
};

// Admin: get all applications
export const getAllApplications = async () => {
  const res = await fetch(`${BASE_URL}/admin/all`);
  return res.json();
};

// Admin: update status
export const updateStatus = async (id: string, status: string) => {
  const res = await fetch(`${BASE_URL}/admin/update/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  return res.json();
};