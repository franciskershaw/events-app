import { EventFormValues } from "../components/AddEventForm";

export const transformEventFormValues = (values: EventFormValues) => ({
  title: values.title,
  date: {
    start: values.datetime,
    end: values.endDatetime || values.datetime,
  },
  location: {
    venue: values.venue,
    city: values.city,
  },
  description: values.description,
  category: values.category,
});
