import dayjs from "dayjs";

import { DateTime } from "@/components/ui/date-time";
import { Form, FormDescription, FormInput } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import { Combobox } from "../../../../components/ui/combobox";
import useEventForm from "../../hooks/useEventForm";

const AddEventForm = ({ formId }: { formId: string }) => {
  const {
    form,
    mode,
    onSubmit,
    eventCategorySelectOptions,
    copiedFromId,
    isSubmitting,
  } = useEventForm();

  return (
    <div className="relative">
      {isSubmitting && <LoadingOverlay />}
      <Form {...{ form, onSubmit, id: formId }}>
        {(copiedFromId || (mode == "edit" && copiedFromId === "")) && (
          <FormDescription className="mb-4 bg-muted p-4 rounded-lg grid grid-cols-1 gap-2">
            {mode === "copyFromConnection" ? (
              <>
                <span>
                  This will create a linked copy of your connection's event,
                  with only your version shown to avoid duplicates in your
                  calendars.
                </span>
                <span>
                  If you change the start date, they'll be treated as separate
                  and you will see both events once more.
                </span>
              </>
            ) : (
              <>
                <span>This event was copied from another event.</span>
                <span>
                  If you change the start date, they'll be treated as separate
                  and you will see both events once more.
                </span>
              </>
            )}
          </FormDescription>
        )}

        <FormInput name="title" label="Title*">
          <Input placeholder="Event title" maxLength={100} />
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

        <div className="flex items-center justify-around pt-3">
          <FormInput
            name="unConfirmed"
            label="Unconfirmed"
            className="flex items-center space-y-0 gap-3"
          >
            <Switch
              checked={form.watch("unConfirmed")}
              onCheckedChange={(checked) =>
                form.setValue("unConfirmed", checked, { shouldValidate: true })
              }
            />
          </FormInput>
          <FormInput
            name="private"
            label="Private"
            className="flex items-center space-y-0 gap-3"
          >
            <Switch
              checked={form.watch("private")}
              onCheckedChange={(checked) =>
                form.setValue("private", checked, { shouldValidate: true })
              }
            />
          </FormInput>
        </div>

        <FormInput name="category" label="Category*">
          <div>
            <Combobox
              value={form.watch("category")}
              onChange={(value) =>
                form.setValue("category", value, { shouldValidate: true })
              }
              options={eventCategorySelectOptions}
              placeholder="Select a category"
            />
          </div>
        </FormInput>

        <FormInput name="venue" label="Venue">
          <Input placeholder="Event venue (optional)" maxLength={150} />
        </FormInput>

        <FormInput name="city" label="City">
          <Input placeholder="City (optional)" maxLength={50} />
        </FormInput>

        <FormInput name="description" label="Description">
          <Textarea
            placeholder="Any extra details about the event..."
            maxLength={2000}
          />
        </FormInput>
      </Form>
    </div>
  );
};

export default AddEventForm;
