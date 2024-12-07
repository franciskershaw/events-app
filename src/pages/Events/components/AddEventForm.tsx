import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { DateTime } from "@/components/ui/date-time";
import { Form, FormInput } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormSelect } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const AddEventForm = () => {
  const form = useForm();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => console.log(values))}
        className="space-y-4"
      >
        <FormInput name="title" label="Title">
          <Input placeholder="Event title" />
        </FormInput>

        <FormInput name="datetime" label="Start Date*">
          <DateTime
            value={form.watch("datetime")}
            onChange={(date) => form.setValue("datetime", date)}
          />
        </FormInput>

        <FormSelect
          name="category"
          label="Category"
          placeholder="Select a category"
          options={[{ value: "test", label: "Test" }]}
        />

        <FormInput name="extraInfo" label="Additional Information">
          <Textarea
            placeholder="Any extra details about the event..."
            {...form.register("extraInfo")}
          />
        </FormInput>

        <Button type="submit">Add event</Button>
      </form>
    </Form>
  );
};

export default AddEventForm;
