import { useEffect, useMemo } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useModals } from "@/contexts/Modals/ModalsContext";

import useAddEvent from "./useAddEvent";
import useCheckEventLinks from "./useCheckEventLinks";
import useEditEvent from "./useEditEvent";
import useGetEventCategories from "./useGetEventCategories";

const eventFormSchema = z
  .object({
    _id: z.string().optional(),
    title: z.string().min(1, "Title is required"),
    datetime: z.date({ required_error: "Start date is required" }),
    endDatetime: z.date().nullable().optional(),
    unConfirmed: z.boolean().optional().default(false),
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

  const { closeModal, selectedEvent, mode } = useModals();

  const linkedEventIds = useCheckEventLinks();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      _id:
        mode === "copy" || mode === "addFromFreeEvent"
          ? ""
          : selectedEvent?._id || "",
      title: selectedEvent?.title ?? "",
      datetime: selectedEvent?.date.start
        ? dayjs(selectedEvent.date.start).toDate()
        : dayjs().startOf("day").toDate(),
      endDatetime:
        selectedEvent?.date.end &&
        !dayjs(selectedEvent.date.end).isSame(selectedEvent.date.start)
          ? dayjs(selectedEvent.date.end).toDate()
          : null,
      unConfirmed: selectedEvent?.unConfirmed ?? false,
      category: selectedEvent?.category._id ?? "",
      venue: selectedEvent?.location?.venue ?? "",
      city: selectedEvent?.location?.city ?? "",
      description: selectedEvent?.description ?? "",
    },
  });

  const datetime = form.watch("datetime");

  const copiedFromId = useMemo(() => {
    if (!selectedEvent?._id) return null;

    // If editing an event that was copied from another event
    if (mode === "edit" && selectedEvent.copiedFrom) {
      return dayjs(datetime).isSame(selectedEvent.date.start, "day")
        ? selectedEvent.copiedFrom
        : ""; // Return empty string if date changed
    }

    // If copying from a connection's event
    if (mode === "copyFromConnection") {
      return dayjs(datetime).isSame(selectedEvent.date.start, "day")
        ? selectedEvent._id
        : null;
    }

    return null;
  }, [mode, selectedEvent, datetime]);

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
    switch (mode) {
      case "edit": {
        if (!selectedEvent?._id) throw new Error("No event ID found");
        const payload = {
          ...values,
          _id: selectedEvent._id,
          linkedEventIds,
          ...(copiedFromId === ""
            ? { copiedFrom: null }
            : { copiedFrom: copiedFromId }),
        };
        editEvent.mutate(payload);
        break;
      }
      default: {
        const payload = {
          ...values,
          ...(copiedFromId && { copiedFrom: copiedFromId }),
        };
        addEvent.mutate(payload);
      }
    }
    closeModal();
  };

  return {
    form,
    onSubmit,
    eventCategorySelectOptions,
    copiedFromId,
    mode,
  };
};

export default useEventForm;
