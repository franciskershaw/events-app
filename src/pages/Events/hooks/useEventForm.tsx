import { useEffect, useMemo } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useModals } from "@/contexts/Modals/ModalsContext";

import { getFrequencyOptions } from "../helpers/getRecurringFrequencyOptions";
import useAddEvent from "./useAddEvent";
import useEditEvent from "./useEditEvent";
import useGetEventCategories from "./useGetEventCategories";

const eventFormSchema = z
  .object({
    _id: z.string().optional(),
    title: z
      .string()
      .min(3, "Title must be at least 3 characters long")
      .max(100, "Title cannot exceed 100 characters"),
    datetime: z.date({ required_error: "Start date is required" }),
    endDatetime: z.date().nullable().optional(),
    unConfirmed: z.boolean().optional().default(false),
    private: z.boolean().optional().default(false),
    category: z.string().min(1, "Please select a category"),
    venue: z
      .string()
      .max(150, "Venue name cannot exceed 150 characters")
      .optional(),
    city: z
      .string()
      .max(50, "City name cannot exceed 50 characters")
      .optional(),
    description: z
      .string()
      .max(2000, "Description cannot exceed 2000 characters")
      .optional(),
    recurrence: z
      .object({
        isRecurring: z.boolean().default(false),
        pattern: z.object({
          frequency: z
            .enum(["daily", "weekly", "monthly", "yearly"])
            .default("weekly"),
          interval: z.number().min(1).default(1),
          startDate: z.date().nullable().optional(),
          endDate: z.date().nullable().optional(),
        }),
      })
      .optional()
      .default({
        isRecurring: false,
        pattern: { frequency: "weekly", interval: 1 },
      }),
  })
  .refine((data) => !data.endDatetime || data.endDatetime >= data.datetime, {
    message: "End date must be the same as or after the start date.",
    path: ["endDatetime"],
  });

export type EventFormValues = z.infer<typeof eventFormSchema>;

const useEventForm = () => {
  const { eventCategorySelectOptions } = useGetEventCategories();
  const recurringFrequencySelectOptions = getFrequencyOptions();

  const addEvent = useAddEvent();
  const editEvent = useEditEvent();

  const { selectedEvent, mode } = useModals();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      _id:
        mode === "copy" || mode === "addFromFreeEvent"
          ? ""
          : selectedEvent?._id || "",
      title: selectedEvent?.title ?? "",
      datetime:
        mode === "edit" &&
        selectedEvent?.recurrence?.isRecurring &&
        selectedEvent.recurrence.pattern?.startDate
          ? dayjs(selectedEvent.recurrence.pattern.startDate).toDate()
          : selectedEvent?.date.start
            ? dayjs(selectedEvent.date.start).toDate()
            : dayjs().startOf("day").toDate(),
      endDatetime:
        selectedEvent?.date.end &&
        !dayjs(selectedEvent.date.end).isSame(selectedEvent.date.start)
          ? dayjs(selectedEvent.date.end).toDate()
          : null,
      unConfirmed: selectedEvent?.unConfirmed ?? false,
      private: selectedEvent?.private ?? false,
      category: selectedEvent?.category._id ?? "",
      venue: selectedEvent?.location?.venue ?? "",
      city: selectedEvent?.location?.city ?? "",
      description: selectedEvent?.description ?? "",
      recurrence: {
        isRecurring: selectedEvent?.recurrence?.isRecurring ?? false,
        pattern: {
          frequency: selectedEvent?.recurrence?.pattern?.frequency ?? "weekly",
          interval: selectedEvent?.recurrence?.pattern?.interval ?? 1,
          startDate:
            selectedEvent?.recurrence?.pattern?.startDate ||
            selectedEvent?.date.start
              ? dayjs(
                  selectedEvent.recurrence?.pattern?.startDate ||
                    selectedEvent.date.start
                ).toDate()
              : dayjs().startOf("day").toDate(),
          endDate: selectedEvent?.recurrence?.pattern?.endDate
            ? dayjs(selectedEvent.recurrence.pattern.endDate).toDate()
            : null,
        },
      },
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
        const payload = {
          ...values,
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
  };

  return {
    form,
    onSubmit,
    eventCategorySelectOptions,
    recurringFrequencySelectOptions,
    copiedFromId,
    mode,
    isSubmitting: addEvent.isPending || editEvent.isPending,
  };
};

export default useEventForm;
