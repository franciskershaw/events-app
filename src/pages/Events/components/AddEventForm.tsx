import dayjs from "dayjs";

import { DateTime } from "@/components/ui/date-time";
import { Form, FormInput } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormSelect } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import useEventForm from "../hooks/useEventForm";

const AddEventForm = ({ formId }: { formId: string }) => {
  const { form, onSubmit, eventCategorySelectOptions } = useEventForm();

  return (
    <Form {...{ form, onSubmit, id: formId }}>
      <FormInput name="title" label="Title*">
        <Input placeholder="Event title" />
      </FormInput>

      <FormInput name="datetime" label="Start Date*">
        <DateTime
          onChange={(date) =>
            form.setValue("datetime", date ?? dayjs().startOf("day").toDate())
          }
          disablePast
          showTime
        />
      </FormInput>

      <FormInput name="endDatetime" label="End Date">
        <DateTime
          onChange={(date) => form.setValue("endDatetime", date ?? undefined)}
          disablePast
          minDate={form.watch("datetime")}
          showTime
          allowClear
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
