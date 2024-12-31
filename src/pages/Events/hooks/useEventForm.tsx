import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useModals } from "@/contexts/ModalsContext";

import useAddEvent from "./useAddEvent";
import useEditEvent from "./useEditEvent";
import useGetEventCategories from "./useGetEventCategories";

const eventFormSchema = z
  .object({
    _id: z.string().optional(),
    title: z.string().min(1, "Title is required"),
    datetime: z.date({ required_error: "Start date is required" }),
    endDatetime: z.date().nullable().optional(),
    category: z.string().min(1, "Please select a category"),
    venue: z.string().optional(),
    city: z.string().optional(),
    description: z.string().optional(),
  })
  .refine((data) => !data.endDatetime || data.endDatetime >= data.datetime, {
    message: "End date must be the same as or after the start date.",
    path: ["endDatetime"],
  });

export type EventFormValues = z.infer<typeof eventFormSchema>;

const useEventForm = () => {
  const { eventCategorySelectOptions } = useGetEventCategories();

  const addEvent = useAddEvent();
  const editEvent = useEditEvent();

  const { closeModal, selectedEvent } = useModals();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      _id: selectedEvent?._id ?? "",
      title: selectedEvent?.title ?? "",
      datetime: selectedEvent?.date.start
        ? dayjs(selectedEvent.date.start).toDate()
        : dayjs().startOf("day").toDate(),
      endDatetime:
        selectedEvent?.date.end &&
        !dayjs(selectedEvent.date.end).isSame(selectedEvent.date.start)
          ? dayjs(selectedEvent.date.end).toDate()
          : null,
      category: selectedEvent?.category._id ?? "",
      venue: selectedEvent?.location?.venue ?? "",
      city: selectedEvent?.location?.city ?? "",
      description: selectedEvent?.description ?? "",
    },
  });

  // Watch the start date and update end date if needed
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "datetime" && value.datetime && value.endDatetime) {
        const startDate = dayjs(value.datetime);
        const endDate = dayjs(value.endDatetime);

        if (
          (startDate.isSame(endDate, "day") && !endDate.isAfter(startDate)) ||
          endDate.isBefore(startDate)
        ) {
          const newEndDate = startDate.toDate();

          form.setValue("endDatetime", newEndDate, {
            shouldValidate: true,
          });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = (values: EventFormValues) => {
    if (selectedEvent) {
      editEvent.mutate(values);
    } else {
      addEvent.mutate(values);
    }
    closeModal();
  };

  return { form, onSubmit, eventCategorySelectOptions };
};

export default useEventForm;
