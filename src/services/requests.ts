import { useQuery } from "react-query";

export const api = {
  fetchAvailabilities: () =>
    fetch("/availabilities").then((resp) => resp.json()),
  fetchAppointments: () => fetch("/appointments").then((resp) => resp.json()),
  fetchClinicians: () => fetch("/clinicians").then((resp) => resp.json()),
  fetchPatients: () => fetch("/patients").then((resp) => resp.json()),
};

// get all availabilities with cache support
export function useAvailabilities(config = {}) {
  return useQuery("/availabilities", () => api.fetchAvailabilities(), {
    refetchOnWindowFocus: false,
    ...config,
  });
}

// get all appointments with cache support
export function useAppointments(config = {}) {
  return useQuery("/appointments", () => api.fetchAppointments(), {
    refetchOnWindowFocus: false,
    ...config,
  });
}

// get all clinician list with cache support
export function useClinicians(config = {}) {
  return useQuery("/clinicians", () => api.fetchClinicians(), {
    refetchOnWindowFocus: false,
    ...config,
  });
}

// get patients data with cache support
export function usePatients(config = {}) {
  return useQuery("/patients", () => api.fetchPatients(), {
    refetchOnWindowFocus: false,
    ...config,
  });
}

export default api;
