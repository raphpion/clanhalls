import { useEffect, useMemo } from 'react';

import { Field, Form, FormikContext, useFormik } from 'formik';

import { type CredentialsData } from '$api/account';
import {
  emptyScopes,
  type Scopes,
  scopesFromString,
  scopesToString,
} from '$helpers/credentials';
import { Input } from '$ui/input';
import { Label } from '$ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '$ui/sheet';

import SelectScope from '../../Credentials/SelectScope';

type Props = {
  open: boolean;
  editingCredential?: CredentialsData;
  onOpenChange: (open: boolean) => void;
};

type CreateOrEditCredentialsFormValues = {
  name: string;
  scope: Scopes;
};

function CreateOrEditCredential({ editingCredential, ...props }: Props) {
  const initialValues = useMemo(
    () => ({
      name: editingCredential?.name || '',
      scope: editingCredential
        ? scopesFromString(editingCredential.scope)
        : { ...emptyScopes },
    }),
    [editingCredential],
  );

  const formik = useFormik<CreateOrEditCredentialsFormValues>({
    initialValues,
    onSubmit: (values) => {
      const scope = scopesToString(values.scope);
    },
  });

  useEffect(() => {
    formik.resetForm({ values: initialValues });
  }, [initialValues]);

  return (
    <Sheet {...props}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="mb-6">
            {editingCredential ? 'Update Credential' : 'Create Credential'}
          </SheetTitle>
        </SheetHeader>
        <FormikContext.Provider value={formik}>
          <Form>
            <h3 className="mb-4 text-lg font-medium">Details</h3>
            <Label htmlFor="name">Name</Label>
            <Field id="name" name="name" type="text" as={Input} />
            <h3 className="mb-4 mt-6 text-lg font-medium">Scopes</h3>
            <SelectScope<CreateOrEditCredentialsFormValues> />
          </Form>
        </FormikContext.Provider>
      </SheetContent>
    </Sheet>
  );
}

export default CreateOrEditCredential;
