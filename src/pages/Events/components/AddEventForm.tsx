import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { DateTime } from "@/components/ui/date-time";
import { Form, FormInput } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const AddEventForm = () => {
  const form = useForm();

  return (
    <Form {...form}>
      <div className="space-y-4">
        <FormInput name="title" label="Title">
          <Input placeholder="Event title" />
        </FormInput>

        <FormInput name="datetime" label="Date and Time">
          <DateTime
            value={form.watch("datetime")}
            onChange={(date) => form.setValue("datetime", date)}
          />
        </FormInput>

        <FormInput name="location" label="Location">
          <Input placeholder="Event location" />
        </FormInput>

        <FormInput name="category" label="Category">
          <Select
            onValueChange={(value) => form.setValue("category", value)}
            defaultValue={form.watch("category")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="test">Test</SelectItem>
            </SelectContent>
          </Select>
        </FormInput>

        <FormInput name="extraInfo" label="Additional Information">
          <Textarea
            placeholder="Any extra details about the event..."
            {...form.register("extraInfo")}
          />
        </FormInput>
      </div>
      <Button type="submit">Add event</Button>
    </Form>
  );
};

export default AddEventForm;
