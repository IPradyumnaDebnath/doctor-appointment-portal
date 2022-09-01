import { useState } from "react";
import { useQueryClient } from "react-query";
import EventIcon from "@mui/icons-material/Event";
import _uniqBy from "lodash/uniqBy";

import { useAppointments } from "services/requests";
import Filters from "components/filterGroup";

//Type definitions start -->
export type Availability = {
  id: number;
  start: string;
  end: string;
  clinician_id: number;
};
export type Person = {
  id: number;
  first_name: string;
  last_name: string;
};
export type Clinician = Person & {
  national_provider_number: string;
};
export type Appointment = {
  id: number;
  availability: Availability;
  clinician: Clinician;
  patient: Person;
  status: string;
};
export type CliniciansType = {
  first_name: string;
  id: number;
  last_name: string;
  national_provider_number: string;
};

type Filter = {
  options: [];
  selected: [];
};

type FiltersState = {
  clinician: Filter;
  patient: Filter;
  date: Filter;
};
//<-- Type definitions end

export const Appointments = () => {
  const queryClient = useQueryClient();
  //TODO: use filters to actually filter the result 
  const [filters, setFilters] = useState<FiltersState>({
    clinician: {
      options: [],
      selected: [],
    },
    date: {
      options: [],
      selected: [],
    },
    patient: {
      options: [],
      selected: [],
    },
  });
  const [appointments, setAppointments] = useState<Appointment[] | []>([]);
  const { isFetching: appointmentFetching } = useAppointments({
    onSuccess: (data) => {
      setAppointments(data);
      const clinician = _uniqBy(data, "clinician_id")?.map((apt) => ({
        id: apt.clinician.id,
        name: `${apt.clinician.first_name} ${apt.clinician.last_name}`,
      }));
      const patient = _uniqBy(data, "patient_id")?.map((apt) => ({
        id: apt.patient.id,
        name: `${apt.patient.first_name} ${apt.patient.last_name}`,
      }));
      const date = _uniqBy(data, (date) => new Date(date.start).getDay())?.map(
        (apt) => ({
          id: apt.start,
          name: new Intl.DateTimeFormat("en-US", { dateStyle: "full" }).format(
            new Date(apt.start)
          ),
        })
      );
      setFilters({ clinician, date, patient });
    },
  });

  //Handle cancel operation
  const handleCancelAppointment = (appointmentId) => {
    fetch(`/appointments?id=${appointmentId}`, {
      method: "DELETE",
    })
      .then(() => {
        queryClient.invalidateQueries("/appointments");
      })
      .catch((e) => alert(`Error occurred ${e?.message}, Please retry !`));
  };
  //show loading while data is fetching
  if (appointmentFetching)
    return <div className="w-full flex items-center">Loading...</div>;

  return (
    <div className="flex py-2 divide-x-2 h-screen w-full">
      <div className="flex flex-col gap-4 px-3 text-center w-2/6">
        <Filters label="Clinicians" filters={filters?.clinician} />
        <Filters label="Date" filters={filters?.date} />
        <Filters label="Patient" filters={filters?.patient} />
      </div>
      <div className="w-full px-4">
        <header className="px-3">
          <h1 className="text-4xl mb-4">All Appointments</h1>
        </header>
        {!!appointments?.length ? (
          <div className="grid grid-cols-4 gap-4">
            {appointments?.map((appointment) => {
              const startDateTime = new Date(appointment?.availability?.start);
              const endDateTime = new Date(appointment?.availability?.end);
              return (
                <div
                  key={appointment.id}
                  className="p-4 space-y-3 cursor-pointer shadow-lg shadow-slate-400 hover:scale-105"
                >
                  <div className="flex items-center gap-2">
                    <EventIcon color="warning" />
                    <h1 className="text-sm font-bold text-left">
                      {`${startDateTime.toLocaleTimeString(
                        "en-US"
                      )}-${endDateTime.toLocaleTimeString("en-US")}`}
                    </h1>
                  </div>
                  <button
                    className="px-4 bg-blue-700 text-white rounded-md disabled:bg-slate-400 hover:scale-105 hover:opacity-70"
                    onClick={() => handleCancelAppointment(appointment.id)}
                    disabled={appointment.status !== "Active"}
                  >
                    Cancel
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="pt-4 text-center text-red-600 font-bold text-4xl">
            No Appointments available !!!
          </p>
        )}
      </div>
    </div>
  );
};
export default Appointments;
