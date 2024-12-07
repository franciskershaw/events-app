import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { DateTime } from "@/components/ui/date-time";
import { Form, FormInput } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormSelect } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { EventCategory } from "@/types/globalTypes";

import useGetEventCategories from "../hooks/useGetEventCategories";

const eventFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  datetime: z.date({
    required_error: "Date and time is required",
  }),
  category: z.string().min(1, "Please select a category"),
  extraInfo: z.string().optional(),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

const AddEventForm = () => {
  const { eventCategories } = useGetEventCategories();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      datetime: dayjs().startOf("day").toDate(),
      category: "",
      extraInfo: "",
    },
  });

  return (
    <Form {...{ form }} onSubmit={(values) => console.log(values)}>
      <FormInput name="title" label="Title*">
        <Input placeholder="Event title" />
      </FormInput>

      <FormInput name="datetime" label="Start Date*">
        <DateTime
          value={form.watch("datetime")}
          onChange={(date) =>
            form.setValue("datetime", date ?? dayjs().startOf("day").toDate())
          }
        />
      </FormInput>

      <FormSelect
        name="category"
        label="Category"
        placeholder="Select a category"
        options={eventCategories.map((category: EventCategory) => ({
          value: category._id,
          label: category.name,
        }))}
      />

      <FormInput name="extraInfo" label="Additional Information">
        <Textarea placeholder="Any extra details about the event..." />
      </FormInput>

      <Button type="submit">Add event</Button>
    </Form>
  );
};

export default AddEventForm;
