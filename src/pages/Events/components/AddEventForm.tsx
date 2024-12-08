import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { DateTime } from "@/components/ui/date-time";
import { Form, FormInput } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormSelect } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useModals } from "@/contexts/ModalsContext";

import useAddEvent from "../hooks/useAddEvent";
import useGetEventCategories from "../hooks/useGetEventCategories";

const eventFormSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    datetime: z.date({ required_error: "Start date is required" }),
    endDatetime: z.date().optional(),
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

const AddEventForm = ({ id }: { id: string }) => {
  const { eventCategorySelectOptions } = useGetEventCategories();

  const addEvent = useAddEvent();

  const { closeModal } = useModals();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      datetime: dayjs().startOf("day").toDate(),
      endDatetime: undefined,
      category: "",
      venue: "",
      city: "",
      description: "",
    },
  });

  const onSubmit = (values: EventFormValues) => {
    addEvent.mutate(values);
    closeModal();
  };

  return (
    <Form {...{ form, onSubmit, id }}>
      <FormInput name="title" label="Title*">
        <Input placeholder="Event title" />
      </FormInput>

      <FormInput name="datetime" label="Start Date*">
        <DateTime
          onChange={(date) =>
            form.setValue("datetime", date ?? dayjs().startOf("day").toDate())
          }
        />
      </FormInput>

      <FormInput name="endDatetime" label="End Date">
        <DateTime
          onChange={(date) => form.setValue("endDatetime", date ?? undefined)}
        />
      </FormInput>

      <FormSelect
        name="category"
        label="Category*"
        placeholder="Select a category"
        options={eventCategorySelectOptions}
      />

      <FormInput name="venue" label="Venue">
        <Input placeholder="Event venue (optional)" />
      </FormInput>

      <FormInput name="city" label="City">
        <Input placeholder="City (optional)" />
      </FormInput>

      <FormInput name="description" label="Description">
        <Textarea placeholder="Any extra details about the event..." />
      </FormInput>
    </Form>
  );
};

export default AddEventForm;
