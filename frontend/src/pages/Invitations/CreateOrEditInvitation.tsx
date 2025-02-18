import { useMutation } from '@tanstack/react-query';
import { Form, FormikContext, useFormik } from 'formik';

import { createInvitation } from '$api/account';
import { useToast } from '$ui/hooks/use-toast';
import { Input } from '$ui/input';
import { Label } from '$ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '$ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '$ui/sheet';
import { Switch } from '$ui/switch';

import { Button } from '../../ui/button';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateSuccess?: (/* TODO: add value */) => void;
};

const EXPIRATION_TO_VALUE = [
  { label: '1 hour', value: 3600000 },
  { label: '6 hours', value: 21600000 },
  { label: '1 day', value: 86400000 },
  { label: '7 days', value: 604800000 },
] as const;

type ExpirationValue = (typeof EXPIRATION_TO_VALUE)[number]['label'];

type FormValues = {
  description: string;
  expiresIn: ExpirationValue | null;
  maxUses: number | null;
};

function CreateOrEditInvitation({ onCreateSuccess, ...sheetProps }: Props) {
  const { toast, genericErrorToast } = useToast();

  const createInvitationMutation = useMutation({
    mutationKey: ['createInvitation'],
    mutationFn: createInvitation,
    onMutate: () => {
      toast({
        title: 'Creating invitation...',
        variant: 'loading',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Invitation created successfully!',
        variant: 'success',
      });
    },
    onError: genericErrorToast,
  });

  const formik = useFormik<FormValues>({
    initialValues: { description: '', expiresIn: null, maxUses: null },
    onSubmit: async ({ description, expiresIn, maxUses }, { resetForm }) => {
      let expiresAt: number | null = null;
      if (expiresIn) {
        const match = EXPIRATION_TO_VALUE.find((v) => v.label === expiresIn);

        if (!match) return;

        expiresAt = Date.now() + match.value;
      }

      const input = { description, expiresAt, maxUses };
      await createInvitationMutation.mutateAsync(input);
      onCreateSuccess?.(/* TODO: add value */);

      sheetProps.onOpenChange(false);
      resetForm();
    },
  });

  const handleClose = () => sheetProps.onOpenChange(false);

  return (
    <Sheet {...sheetProps}>
      <SheetContent>
        <FormikContext.Provider value={formik}>
          <SheetHeader>
            <SheetTitle>Create invitation</SheetTitle>
            <SheetDescription>
              Create an invitation for one to many users to join your clan.
            </SheetDescription>
          </SheetHeader>
          <Form className="mt-6">
            <div className="mb-8">
              <Label htmlFor="name">Description (optional)</Label>
              <Input
                id="name"
                type="text"
                value={formik.values.description}
                onChange={(e) =>
                  formik.setFieldValue('description', e.target.value)
                }
              />
            </div>
            <div className="mb-8">
              <div className="flex items-center gap-2">
                <Switch
                  id="expiresIn"
                  checked={formik.values.expiresIn !== null}
                  onCheckedChange={(checked) =>
                    formik.setFieldValue('expiresIn', checked ? '7 days' : null)
                  }
                />
                <Label htmlFor="expiresIn">
                  {formik.values.expiresIn !== null
                    ? 'Expires after'
                    : 'Set an expiration'}
                </Label>
              </div>
              {formik.values.expiresIn !== null && (
                <div className="ml-12 mt-2">
                  <Select
                    value={formik.values.expiresIn}
                    onValueChange={(value) =>
                      formik.setFieldValue('expiresIn', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPIRATION_TO_VALUE.map(({ label }) => (
                        <SelectItem key={label} value={label}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="maxUses"
                checked={formik.values.maxUses !== null}
                onCheckedChange={(checked) =>
                  formik.setFieldValue('maxUses', checked ? 1 : null)
                }
              />
              <Label htmlFor="maxUses">
                {formik.values.maxUses !== null
                  ? 'Max number of uses'
                  : 'Limit usage'}
              </Label>
            </div>
            {formik.values.maxUses !== null && (
              <div className="ml-12 mt-2">
                <Input
                  type="number"
                  min={1}
                  value={formik.values.maxUses}
                  onChange={(e) =>
                    formik.setFieldValue('maxUses', e.target.value)
                  }
                />
              </div>
            )}
            <SheetFooter className="mt-6">
              <Button type="submit">Create invitation</Button>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
            </SheetFooter>
          </Form>
        </FormikContext.Provider>
      </SheetContent>
    </Sheet>
  );
}

export default CreateOrEditInvitation;
