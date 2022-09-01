import React from "react";
import { DataBrowserRouter, Route } from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
} from "react-query";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { blue, deepOrange } from "@mui/material/colors";
import { CircularProgress } from "@mui/material";

import { Root } from "./routes/home/Root";
import Appointments from "./routes/appointments";
import NewAppointment from "./routes/newAppointment";

const THEME = createTheme({
  palette: {
    primary: { ...blue, main: blue["700"] },
    secondary: deepOrange,
  },
});

// Create a query client
const queryClient = new QueryClient();

export const App: React.FC = () => (
  <ThemeProvider theme={THEME}>
    <QueryClientProvider client={queryClient}>
      <DataBrowserRouter fallbackElement={<CircularProgress />}>
        <Route path="/" element={<Root />}>
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/appointment/new" element={<NewAppointment />} />
        </Route>
      </DataBrowserRouter>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
