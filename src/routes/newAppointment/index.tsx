import { useMemo, useState } from "react";
import { useQueryClient } from "react-query";
import EventIcon from "@mui/icons-material/Event";
import _find from "lodash/find";

import Select from "components/select";
import { useAvailabilities, usePatients } from "services/requests";

const NewAppointment = () => {
  const queryClient = useQueryClient();
  const { isFetching: availabilitiesFetching, data: availabilities } =
    useAvailabilities();
  const { data: patients } = usePatients();
  const [appointmentConfig, setAppointmentConfig] = useState({});

  //Memorized and formatted selectable patient
  const selectablePatient = useMemo(
    () =>
      !!patients &&
      patients.map((patient) => ({
        ...patient,
        name: `${patient.first_name} ${patient.last_name}`,
      })),
    [patients]
  );

  /**
   * handle clinician selection
   * @params
   * availabilityId: unique id for availability (to support multi-booking)
   * selected: selected clinician data
   */
  const handleSelectedClinician = (availabilityId, selected) => {
    setAppointmentConfig((prevApt) => ({
      ...prevApt,
      [availabilityId]: {
        ...prevApt[availabilityId],
        selectedClinician: selected,
      },
    }));
  };

  /** handle patient selection
   * @params
   * availabilityId: unique id for availability (to support multi-booking)
   * selected: selected patient data
   */
  const handleSelectedPatient = (availabilityId, selected) => {
    setAppointmentConfig((prevApt) => ({
      ...prevApt,
      [availabilityId]: {
        ...prevApt[availabilityId],
        selectedPatient: selected,
      },
    }));
  };

  /**
   * handle Booking submit : Invoke POST api for new booking and put if update supported
   * @params
   * availabilityId: unique id for availability (to support multi-booking)
   */
  const handleBookAppointment = (e, availabilityId) => {
    e.preventDefault();
    const selectedAvailability = _find(
      availabilities,
      (availability) => availability.id === availabilityId
    );

    //Invoke api to book appointment and refetch appointments availability
    fetch("/appointments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "Active",
        start: selectedAvailability.start,
        clinician_id: appointmentConfig[availabilityId].selectedClinician,
        patient_id: appointmentConfig[availabilityId].selectedPatient,
        availability_id: availabilityId,
      }),
    })
      .then(() => {
        queryClient.invalidateQueries("/appointments");
      })
      .catch((e) => alert(`Error occurred ${e?.message}, Please retry !`));
  };

  if (availabilitiesFetching) return <div>Loading...</div>;
  return (
    <div className="w-full p-2">
      <h1 className="text-4xl mb-4">Book Appointments</h1>
      <div className="grid grid-cols-4 gap-4">
        {/* TODO:create a separate component for availability card */}
        {!!availabilities?.length ? (
          availabilities.map(
            ({ start, end, id: availabilityId, clinician }) => {
              const startDateTime = new Date(start);
              const endDateTime = new Date(end);
              const formattedDay = Intl.DateTimeFormat("en-US", {
                dateStyle: "full",
              }).format(startDateTime);
              return (
                <div
                  key={availabilityId}
                  className="p-4 space-y-3 cursor-pointer shadow-lg shadow-slate-400 hover:scale-105"
                >
                  <header className="space-y-1">
                    <div className="flex space-x-2">
                      <EventIcon color="secondary" />
                      <div>
                        <h1 className="font-bold">{formattedDay}</h1>
                        <h1 className="pr-6 text-sm font-thin">
                          {`${startDateTime.toLocaleTimeString(
                            "en-US"
                          )}-${endDateTime.toLocaleTimeString("en-US")}`}
                        </h1>
                      </div>
                    </div>
                  </header>
                  <div>
                    <Select
                      label="Choose Clinician"
                      //As per BE code currently only one clinician is available per availability
                      options={[
                        {
                          id: clinician.id,
                          name:
                            clinician.first_name + " " + clinician.last_name,
                          ...clinician,
                        },
                      ]}
                      onChange={(selected) =>
                        handleSelectedClinician(availabilityId, selected)
                      }
                      selected={
                        appointmentConfig?.[availabilityId]?.selectedClinician
                      }
                    />
                  </div>
                  <div>
                    <Select
                      label="Choose patient"
                      options={selectablePatient}
                      onChange={(selected) =>
                        handleSelectedPatient(availabilityId, selected)
                      }
                      selected={
                        appointmentConfig?.[availabilityId]?.selectedPatient
                      }
                    />
                  </div>
                  <button
                    className="px-4 bg-blue-700 text-white rounded-md disabled:bg-slate-400 hover:scale-105 hover:opacity-70"
                    onClick={(e) => handleBookAppointment(e, availabilityId)}
                    disabled={
                      !appointmentConfig?.[availabilityId]?.selectedClinician ||
                      !appointmentConfig?.[availabilityId]?.selectedPatient
                    }
                  >
                    Book
                  </button>
                </div>
              );
            }
          )
        ) : (
          <p className="pt-4 text-center text-red-600 font-bold text-4xl">
            No slot available
          </p>
        )}
      </div>
    </div>
  );
};

export default NewAppointment;
