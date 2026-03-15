// Business logic for health checks
export const getHealthStatus = () => {
  return {
    status: "ok",
    timestamp: new Date().toISOString()
  };
};
