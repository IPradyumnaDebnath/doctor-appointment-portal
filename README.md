
## Getting set up

1. Clone this repo
2. `yarn install`
3. `yarn start` will start both the backend and frontend servers in separate processes. You can use BACKEND_PORT and PORT env variables if you need.

## Backend

- A Clinician model, which represents a member of the clinical team
- An Availability model, which represents availability time slots
- A Patient model
- An Appointment model - which can be used to represent
  - an open appointment (which is a relationship between the availability and clinician)
  - a booked appointment (which is a relationship between the availability, clinician and patient)
- Endpoints for listing all of the clinicians, patients, availabilities and appointments

## Frontend

- A working create-react-app server with working booking portal


