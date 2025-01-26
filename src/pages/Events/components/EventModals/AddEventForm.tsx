import dayjs from "dayjs";

import { DateTime } from "@/components/ui/date-time";
import { Form, FormInput } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormSelect } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { Checkbox } from "../../../../components/ui/checkbox";
import useEventForm from "../../hooks/useEventForm";

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
          toDate={dayjs().add(5, "years").endOf("year").toDate()}
        />
      </FormInput>

      <FormInput name="endDatetime" label="End Date">
        <DateTime
          onChange={(date) => form.setValue("endDatetime", date ?? undefined)}
          disablePast
          minDate={form.watch("datetime")}
          showTime
          allowClear
          toDate={dayjs().add(5, "years").endOf("year").toDate()}
        />
      </FormInput>

      <FormInput
        name="unConfirmed"
        label="Unconfirmed?"
        className="m-0 flex items-center"
      >
        <Checkbox
          checked={form.watch("unConfirmed")}
          onCheckedChange={(checked) =>
            form.setValue("unConfirmed", !!checked, { shouldValidate: true })
          }
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
